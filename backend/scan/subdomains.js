// scan/subdomains.js
// DONE!

const dns = require('dns').promises;
const fs = require('fs').promises;
const path = require('path');

// Wordlist-based subdomain discovery
async function discoverSubdomainsWithWordlist(domain) {
    const discovered = [];

    try {
        // Read the wordlist file
        const wordlistPath = path.join(__dirname, '..', 'wordlists', 'subdomains.txt');
        const wordlistContent = await fs.readFile(wordlistPath, 'utf-8');
        const subdomains = wordlistContent.split('\n').filter(word => word.trim() !== '');

        // Process all subdomains at once
        const promises = subdomains.map(subdomain => {
            const fullDomain = `${subdomain.trim()}.${domain}`;
            return dns.resolve(fullDomain)
                .then(() => fullDomain)
                .catch(() => null);
        });

        const results = await Promise.all(promises);
        discovered.push(...results.filter(result => result !== null));
    } catch (error) {
        console.error('Error reading wordlist:', error);
    }
    return discovered;
}

// Main subdomain discovery function
async function discoverSubdomains(domain) {
    try {
        const wordlistResults = await discoverSubdomainsWithWordlist(domain);

        // Remove duplicates and sort
        const allSubdomains = [...new Set(wordlistResults)].sort();

        return allSubdomains;
    } catch (error) {
        console.error(`Error discovering subdomains for ${domain}:`, error);
        return [];
    }
}

module.exports = { discoverSubdomains };