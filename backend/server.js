const express = require('express');
const { getSecurityTrailsDNSRecords } = require('./scan/dns');
const { discoverSubdomains } = require('./scan/subdomains');
const { checkOpenPorts } = require('./scan/ports');
const { identifyTechnologies } = require('./scan/technologies');
const { getWhoisInfo } = require('./scan/whois');

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
        console.log("wqeqwe", whoisInfo);

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
        const dnsRecords = await getSecurityTrailsDNSRecords(target);
        res.json(dnsRecords);
    } catch (error) {
        res.status(500).json({ msg: 'An error occurred while fetching Security Trails DNS records', error: error });
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
        res.json({ subdomains });
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});