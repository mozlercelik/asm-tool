// scan/technologies.js
const axios = require('axios');

async function identifyTechnologies(target) {
    try {
        // First, try to get the website content
        const response = await axios.get(`http://${target}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 5000
        });

        const html = response.data;
        const headers = response.headers;

        // Analyze technologies based on common patterns
        const technologies = [];

        // Check for common frameworks and libraries
        if (html.includes('jquery')) {
            technologies.push('jQuery');
        }
        if (html.includes('react')) {
            technologies.push('React');
        }
        if (html.includes('vue')) {
            technologies.push('Vue.js');
        }
        if (html.includes('angular')) {
            technologies.push('Angular');
        }

        // Check for server technologies
        if (headers['server']) {
            technologies.push(`Server: ${headers['server']}`);
        }
        if (headers['x-powered-by']) {
            technologies.push(`Powered by: ${headers['x-powered-by']}`);
        }

        // Check for CMS
        if (html.includes('wp-content') || html.includes('wordpress')) {
            technologies.push('WordPress');
        }
        if (html.includes('joomla')) {
            technologies.push('Joomla');
        }
        if (html.includes('drupal')) {
            technologies.push('Drupal');
        }

        // Check for analytics
        if (html.includes('google-analytics')) {
            technologies.push('Google Analytics');
        }
        if (html.includes('gtag')) {
            technologies.push('Google Tag Manager');
        }

        // Check for CDN
        if (html.includes('cloudflare')) {
            technologies.push('Cloudflare');
        }
        if (html.includes('akamai')) {
            technologies.push('Akamai');
        }

        // Check for web server
        if (headers['server']?.includes('nginx')) {
            technologies.push('Nginx');
        }
        if (headers['server']?.includes('apache')) {
            technologies.push('Apache');
        }

        // Check for programming languages
        if (html.includes('php')) {
            technologies.push('PHP');
        }
        if (html.includes('asp.net')) {
            technologies.push('ASP.NET');
        }
        if (html.includes('node.js')) {
            technologies.push('Node.js');
        }

        // Check for database
        if (html.includes('mysql')) {
            technologies.push('MySQL');
        }
        if (html.includes('postgresql')) {
            technologies.push('PostgreSQL');
        }
        if (html.includes('mongodb')) {
            technologies.push('MongoDB');
        }

        // Check for security headers
        if (headers['x-frame-options']) {
            technologies.push('X-Frame-Options');
        }
        if (headers['x-xss-protection']) {
            technologies.push('XSS Protection');
        }
        if (headers['content-security-policy']) {
            technologies.push('Content Security Policy');
        }

        return {
            technologies: [...new Set(technologies)],
            headers: headers,
            status: response.status,
            statusText: response.statusText
        };
    } catch (error) {
        console.error(`Error identifying technologies for ${target}:`, error);
        return {
            technologies: [],
            error: error.message
        };
    }
}

module.exports = { identifyTechnologies };