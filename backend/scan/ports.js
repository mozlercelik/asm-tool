// scan/ports.js
// done
const net = require('net');

// Common port services mapping
const commonServices = {
    20: 'FTP-Data',
    21: 'FTP',
    22: 'SSH',
    23: 'Telnet',
    25: 'SMTP',
    53: 'DNS',
    80: 'HTTP',
    110: 'POP3',
    143: 'IMAP',
    443: 'HTTPS',
    445: 'SMB',
    465: 'SMTPS',
    587: 'SMTP',
    993: 'IMAPS',
    995: 'POP3S',
    1433: 'MSSQL',
    3306: 'MySQL',
    3389: 'RDP',
    5432: 'PostgreSQL',
    5900: 'VNC',
    8080: 'HTTP-Proxy',
    8443: 'HTTPS-Alt'
};

// Maximum number of ports to scan at once
const MAX_PORTS = 1025;
// Connection timeout in milliseconds
const CONNECTION_TIMEOUT = 2000;
// Overall scan timeout in milliseconds
const SCAN_TIMEOUT = 30000;

async function checkPort(target, port) {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(CONNECTION_TIMEOUT);
        
        socket.on('connect', () => {
            socket.destroy();
            resolve({
                port,
                status: 'open',
                service: commonServices[port] || 'Unknown',
                protocol: 'TCP'
            });
        });

        socket.on('error', () => {
            resolve({
                port,
                status: 'closed',
                service: commonServices[port] || 'Unknown',
                protocol: 'TCP'
            });
        });

        socket.on('timeout', () => {
            socket.destroy();
            resolve({
                port,
                status: 'closed',
                service: commonServices[port] || 'Unknown',
                protocol: 'TCP'
            });
        });

        socket.connect(port, target);
    });
}

async function checkOpenPorts(target, startPort, endPort) {
    // Validate port range
    const totalPorts = endPort - startPort + 1;
    if (totalPorts > MAX_PORTS) {
        throw new Error(`Port range too large. Maximum ${MAX_PORTS} ports allowed.`);
    }

    const ports = Array.from({ length: totalPorts }, (_, i) => startPort + i);
    const results = [];

    // Create a promise that rejects after SCAN_TIMEOUT
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Scan timeout')), SCAN_TIMEOUT);
    });

    // Create array of port check promises
    const portCheckPromises = ports.map(port => checkPort(target, port));

    try {
        // Race between the port checks and the timeout
        const scanResults = await Promise.race([
            Promise.all(portCheckPromises),
            timeoutPromise
        ]);

        return scanResults;
    } catch (error) {
        if (error.message === 'Scan timeout') {
            throw new Error('Port scan timed out. Please try a smaller port range.');
        }
        throw error;
    }
}

module.exports = { checkOpenPorts };