// scan/whois.js
// done

// Replace 'YOUR API KEY HERE' with your actual API key
const API_KEY = 'ZiuAKT2ntPOfvo2mNErgJdm6iUmAchxV';

const getWhoisInfo = async (domain) => {
    try {
        const response = await fetch(`https://api.apilayer.com/whois/query?domain=${domain}`, {
            method: 'GET',
            headers: {
                'apikey': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching WHOIS info for ${domain}:`, error);
        return null; // Return null in case of an error
    }
}

module.exports = { getWhoisInfo };