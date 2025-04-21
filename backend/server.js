const express = require('express');
const { getSecurityTrailsDNSRecords } = require('./scan/dns');
const { discoverSubdomains } = require('./scan/subdomains');
const { checkOpenPorts } = require('./scan/ports');
const { identifyTechnologies } = require('./scan/technologies');
const { getWhoisInfo } = require('./scan/whois');
const { getDNSRecords } = require('./scan/dns');

const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
    res.send('Welcome to the Attack Surface Management Tool!');
});

app.get("/api/test", (req, res) => {
    res.send('Test success!');
});

app.post('/api/scan', async (req, res) => {
    const { target } = req.body;

    if (!target) {
        return res.status(400).json({ error: 'Target is required' });
    }

    try {
        // const dnsRecords = await getDNSRecords(target);
        const subdomains = await discoverSubdomains(target);
        const openPorts = await checkOpenPorts(target, [80, 443, 8080]); // Example ports
        const technologies = await identifyTechnologies(target);
        const whoisInfo = await getWhoisInfo(target); // Get WHOIS info

        const scanResults = {
            // dnsRecords,
            subdomains,
            openPorts,
            technologies,
            whoisInfo
        };

        res.json(scanResults);
    } catch (error) {
        res.status(500).json({ msg: 'An error occurred during the scan', error: error });
    }
});

app.get('/api/whois', async (req, res) => {
    const { target } = req.query;

    if (!target) {
        return res.status(400).json({ error: 'Target is required' });
    }

    try {
        const whoisInfo = await getWhoisInfo(target);

        res.json(whoisInfo);
    } catch (error) {
        res.status(500).json({ msg: 'An error occurred while fetching WHOIS info', error: error });
    }
});

app.get('/api/tools/dns-records', async (req, res) => {
    const { target } = req.query;

    if (!target) {
        return res.status(400).json({ error: 'Target is required' });
    }

    try {
        const [dnsRecords, securityTrailsData] = await Promise.all([
            getDNSRecords(target),
            getSecurityTrailsDNSRecords(target)
        ]);

        res.json({
            result: {
                dns_records: dnsRecords,
                security_trails: securityTrailsData
            }
        });
    } catch (error) {
        res.status(500).json({
            error: 'DNS lookup failed',
            message: error.message
        });
    }
});

// New endpoint for subdomain discovery
app.get('/api/tools/subdomains', async (req, res) => {
    const { target } = req.query;

    if (!target) {
        return res.status(400).json({ error: 'Target is required' });
    }

    try {
        const subdomains = await discoverSubdomains(target);
        // Set headers to prevent caching
        res.set({
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        res.status(200).json(subdomains);
    } catch (error) {
        res.status(500).json({ msg: 'An error occurred while discovering subdomains', error: error });
    }
});

// New endpoint for technology detection
app.get('/api/tools/technologies', async (req, res) => {
    const { target } = req.query;

    if (!target) {
        return res.status(400).json({ error: 'Target is required' });
    }

    try {
        const techInfo = await identifyTechnologies(target);
        res.json(techInfo);
    } catch (error) {
        res.status(500).json({ msg: 'An error occurred while detecting technologies', error: error });
    }
});

// New endpoint for port scanning
app.get('/api/tools/ports', async (req, res) => {
    const { target, start_port, end_port } = req.query;

    if (!target) {
        return res.status(400).json({ error: 'Target is required' });
    }

    if (!start_port || !end_port) {
        return res.status(400).json({ error: 'Start port and end port are required' });
    }

    const startPort = parseInt(start_port);
    const endPort = parseInt(end_port);

    if (isNaN(startPort) || isNaN(endPort)) {
        return res.status(400).json({ error: 'Port numbers must be valid integers' });
    }

    if (startPort < 1 || endPort > 65535) {
        return res.status(400).json({ error: 'Port numbers must be between 1 and 65535' });
    }

    if (startPort > endPort) {
        return res.status(400).json({ error: 'Start port must be less than or equal to end port' });
    }

    const totalPorts = endPort - startPort + 1;
    if (totalPorts > 1024) {
        return res.status(400).json({
            error: 'Port range too large',
            message: 'Maximum 1024 ports can be scanned at once. Please reduce the port range.'
        });
    }

    try {
        const ports = await checkOpenPorts(target, startPort, endPort);
        res.json({ result: { ports } });
    } catch (error) {
        if (error.message.includes('timeout')) {
            return res.status(408).json({
                error: 'Scan timeout',
                message: error.message
            });
        }
        res.status(500).json({
            error: 'Port scan failed',
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});