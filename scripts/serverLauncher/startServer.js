const { spawn } = require('child_process');
const fs = require('fs');
const dns = require('dns').promises;

const PROXY_URL = process.env.PROXY_URL;

async function runServer() {
  if (PROXY_URL) {
    const IP_REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/;

    // Parse the proxy URL
    const hostWithPort = PROXY_URL.split('//')[1];
    let [host, port] = hostWithPort.split(':');
    const protocol = PROXY_URL.split('://')[0];

    // If the host is not an IP, resolve it using DNS
    if (!IP_REGEX.test(host)) {
      try {
        const result = await dns.lookup(host);
        ip = result.address;  // Get the resolved IP address
        console.log(`Resolved ${host} to IP: ${ip}`);
      } catch (error) {
        console.error(`DNS lookup failed for host: ${host}`, error);
        process.exit(1);
      }
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

    fs.writeFileSync('/etc/proxychains4.conf', proxyChainsConfig.trim());

    // Run the server using proxychains
    const proxyChains = spawn('proxychains', ['-q', 'node', '/app/server.js'], { stdio: 'inherit' });

    proxyChains.on('close', (code) => {
      console.log(`Server exited with code ${code}`);
    });
  } else {
    // No proxy, run the server directly
    const server = spawn('node', ['/app/server.js'], { stdio: 'inherit' });

    server.on('close', (code) => {
      console.log(`Server exited with code ${code}`);
    });
  }
}

runServer();
