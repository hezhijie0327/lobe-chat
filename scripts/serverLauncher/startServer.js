const dns = require('dns').promises;
const fs = require('fs');

const { spawn } = require('child_process');

// Set configuration paths and modes
const DATABASE_URL = process.env.DATABASE_URL;

const DB_MIGRATION_SCRIPT_PATH = '/app/docker.cjs';
const SERVER_SCRIPT_PATH = '/app/server.js';

const PROXYCHAINS_CONF_PATH = '/etc/proxychains4.conf';

// Read proxy URL from environment variable
const PROXY_URL = process.env.PROXY_URL;

// Function to check if a string is a valid IP address
function isValidIP(ip) {
  const IP_REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/;
  return IP_REGEX.test(ip);
}

async function runDBMigrationScript() {
  return new Promise((resolve, reject) => {
    const dbMigrationProcess = spawn('node', [DB_MIGRATION_SCRIPT_PATH], { stdio: 'inherit' });

    dbMigrationProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`DB Migration script failed with code ${code}`);
        reject(new Error('DB Migration script failed.'));
      } else {
        resolve();
      }
    });
  });
}

async function runServer() {
  if (PROXY_URL) {
    const IP_REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/;

    // Parse the proxy URL
    const hostWithPort = PROXY_URL.split('//')[1];
    let [host, port] = hostWithPort.split(':');
    const protocol = PROXY_URL.split('://')[0];

    // assume host is an IP address
    let ip = host

    // If the host is not an IP, resolve it using DNS
    if (!isValidIP(host)) {
      try {
        const result = await dns.lookup(host);
        if (isValidIP(result.address)) {
          ip = result.address;  // Get the resolved IP address
          console.log(`Resolved hostname "${host}" to IP: ${ip}`);
        } else {
          console.error(`Resolved address "${result.address}" is not a valid IPv4 address.`);
          process.exit(1);
        }
      } catch (error) {
        console.error(`DNS lookup failed for host: ${host}`, error);
        process.exit(1);
      }
    } else {
      // Log the original IP if it's already an IP address
      console.log(`Using IP: ${ip}`);
    }

    // Generate the proxychains configuration file
    const proxyChainsConfig = `
localnet 127.0.0.0/255.0.0.0
localnet ::1/128
proxy_dns
remote_dns_subnet 224
strict_chain
tcp_connect_time_out 8000
tcp_read_time_out 15000
[ProxyList]
${protocol} ${ip} ${port}
`;

    // Write configuration to the specified path
    fs.writeFileSync(PROXYCHAINS_CONF_PATH, proxyChainsConfig.trim());

    // Run the server using proxychains
    const proxyChains = spawn('proxychains', ['-q', 'node', SERVER_SCRIPT_PATH], { stdio: 'inherit' });

    proxyChains.on('close', (code) => {
      console.log(`Server exited with code ${code}`);
    });
  } else {
    // No proxy, run the server directly
    const server = spawn('node', [SERVER_SCRIPT_PATH], { stdio: 'inherit' });

    server.on('close', (code) => {
      console.log(`Server exited with code ${code}`);
    });
  }
}

(async () => {
  if (DATABASE_URL) {
    try {
      // Run the DB Migration script first
      await runDBMigrationScript();
      // If successful, proceed to run the server
      runServer();
    } catch (error) {
      console.error('Exiting due to DB Migration script failure.');
      process.exit(1);
    }
  } else {
    // Non-database mode: Run server directly
    runServer();
  }
})();
