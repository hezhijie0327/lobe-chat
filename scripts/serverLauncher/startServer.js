const fs = require('fs');
const { spawn } = require('child_process');
const dns = require('dns').promises;

// Set the proxychains configuration path
const PROXYCHAINS_CONF_PATH = process.env.PROXYCHAINS_CONF_PATH || '/etc/proxychains4.conf';
// Set the server script path
const SERVER_SCRIPT_PATH = process.env.SERVER_SCRIPT_PATH || '/app/server.js';

// Read proxy URL from environment variable
const PROXY_URL = process.env.PROXY_URL;

async function runServer() {
  if (PROXY_URL) {
    const IP_REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/;

    // Parse the proxy URL
    const hostWithPort = PROXY_URL.split('//')[1];
    let [host, port] = hostWithPort.split(':');
    const protocol = PROXY_URL.split('://')[0];
    const originalHost = host; // Store the original hostname for logging

    // If the host is not an IP, resolve it using DNS
    if (!IP_REGEX.test(host)) {
      try {
        const result = await dns.lookup(host);
        host = result.address;  // Get the resolved IP address
        console.log(`Resolved hostname "${originalHost}" to IP: ${host}`);
      } catch (error) {
        console.error(`DNS lookup failed for host: ${host}`, error);
        process.exit(1);
      }
    } else {
      // Log the original IP if it's already an IP address
      console.log(`Using IP: ${host}`);
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
${protocol} ${host} ${port}
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

runServer();
