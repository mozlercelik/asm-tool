// scan/technologies.js
const axios = require('axios');

async function identifyTechnologies(target) {
    try {
        // First, try to get the website content with shorter timeout
        const response = await axios.get(`http://${target}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 3000, // Reduced timeout to 3 seconds
            maxRedirects: 5,
            validateStatus: function (status) {
                return status >= 200 && status < 500; // Accept all status codes less than 500
            }
        });

        const html = response.data;
        const headers = response.headers;

        // Analyze technologies based on common patterns
        const technologies = new Set();

        // Check for common frameworks and libraries
        if (html.includes('jquery')) technologies.add('jQuery');
        if (html.includes('react')) technologies.add('React');
        if (html.includes('vue')) technologies.add('Vue.js');
        if (html.includes('angular')) technologies.add('Angular');

        // Check for server technologies
        if (headers['server']) technologies.add(headers['server']);
        if (headers['x-powered-by']) technologies.add(headers['x-powered-by']);

        // Check for CMS
        if (html.includes('wp-content') || html.includes('wordpress')) technologies.add('WordPress');
        if (html.includes('joomla')) technologies.add('Joomla');
        if (html.includes('drupal')) technologies.add('Drupal');

        // Check for analytics
        if (html.includes('google-analytics')) technologies.add('Google Analytics');
        if (html.includes('gtag')) technologies.add('Google Tag Manager');

        // Check for CDN
        if (html.includes('cloudflare')) technologies.add('Cloudflare');
        if (html.includes('akamai')) technologies.add('Akamai');

        // Check for web server
        if (headers['server']?.includes('nginx')) technologies.add('Nginx');
        if (headers['server']?.includes('apache')) technologies.add('Apache');

        // Check for programming languages
        if (html.includes('php')) technologies.add('PHP');
        if (html.includes('asp.net')) technologies.add('ASP.NET');
        if (html.includes('node.js')) technologies.add('Node.js');

        // Check for database
        if (html.includes('mysql')) technologies.add('MySQL');
        if (html.includes('postgresql')) technologies.add('PostgreSQL');
        if (html.includes('mongodb')) technologies.add('MongoDB');

        // Check for security headers
        if (headers['x-frame-options']) technologies.add('X-Frame-Options');
        if (headers['x-xss-protection']) technologies.add('XSS Protection');
        if (headers['content-security-policy']) technologies.add('Content Security Policy');

        return Array.from(technologies);
    } catch (error) {
        console.error(`Error identifying technologies for ${target}:`, error);
        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout - the server took too long to respond');
        }
        if (error.code === 'ECONNREFUSED') {
            throw new Error('Connection refused - the server is not responding');
        }
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            throw new Error(`Server responded with status: ${error.response.status}`);
        }
        throw new Error('Failed to identify technologies');
    }
}

module.exports = { identifyTechnologies };