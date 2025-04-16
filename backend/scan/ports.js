// scan/ports.js
// done
const net = require('net');

async function checkOpenPorts(target, ports) {
    const openPorts = [];
    for (const port of ports) {
        const isOpen = await new Promise((resolve) => {
            const socket = new net.Socket();
            socket.setTimeout(2000);
            socket.on('connect', () => {
                socket.destroy();
                resolve(true);
            });
            socket.on('error', () => {
                resolve(false);
            });
            socket.connect(port, target);
        });
        if (isOpen) openPorts.push(port);
    }
    return openPorts;
}

module.exports = { checkOpenPorts };