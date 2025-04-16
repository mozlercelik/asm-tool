// scan/dns.js
// DONE!
const dns = require('dns').promises;

async function getDNSRecords(target) {
    try {
        const records = await dns.resolve(target);
        return records;
    } catch (error) {
        console.error(`Error fetching DNS records for ${target}:`, error);
        return [];
    }
}

async function getSecurityTrailsDNSRecords(domain) {
    const apiKey = "a4QuPNhUjHuKvR52hOmR28t2zwMjiHS_"

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
        return data; // Return the data received from Security Trails
    } catch (error) {
        console.error(`Error fetching DNS records from Security Trails for ${domain}:`, error);
        return null; // Return null in case of an error
    }
}

module.exports = { getDNSRecords, getSecurityTrailsDNSRecords };