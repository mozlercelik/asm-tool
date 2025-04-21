// scan/dns.js
// DONE!
const dns = require('dns').promises;

async function getDNSRecords(target) {
    try {
        const records = {
            A: await dns.resolve4(target).catch(() => []),
            AAAA: await dns.resolve6(target).catch(() => []),
            MX: await dns.resolveMx(target).catch(() => []).then(mx => mx.map(m => m.exchange)),
            TXT: await dns.resolveTxt(target).catch(() => []).then(txt => txt.flat()),
            NS: await dns.resolveNs(target).catch(() => []),
            CNAME: await dns.resolveCname(target).catch(() => [])
        };

        // Filter out empty records
        return Object.fromEntries(
            Object.entries(records).filter(([_, value]) => value && value.length > 0)
        );
    } catch (error) {
        console.error(`Error fetching DNS records for ${target}:`, error);
        return {};
    }
}

async function getSecurityTrailsDNSRecords(domain) {
    const apiKey = "a4QuPNhUjHuKvR52hOmR28t2zwMjiHS_";

    try {
        const response = await fetch(`https://api.securitytrails.com/v1/domain/${domain}`, {
            method: 'GET',
            headers: {
                'apikey': apiKey
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching data from Security Trails: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching DNS records from Security Trails for ${domain}:`, error);
        return null;
    }
}

module.exports = { getDNSRecords, getSecurityTrailsDNSRecords };