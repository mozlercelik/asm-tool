document.addEventListener('DOMContentLoaded', () => {
    const startScanButton = document.getElementById('start-scan');
    const targetInput = document.getElementById('target');
    const loadingElement = document.getElementById('loading');
    const resultsContainer = document.getElementById('results');

    startScanButton.addEventListener('click', async () => {
        const target = targetInput.value.trim();
        if (!target) {
            alert('Please enter a domain name');
            return;
        }

        // Show loading state
        loadingElement.style.display = 'flex';
        resultsContainer.style.display = 'none';

        try {
            const response = await fetch(`/api/whois?target=${encodeURIComponent(target)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch WHOIS data');
            }

            // Check if data is empty or not found
            if (!data.result || Object.keys(data.result).length === 0) {
                document.getElementById('domain-info').innerHTML = '<div class="info-item"><span class="info-value">Data not found</span></div>';
                document.getElementById('registrant-info').innerHTML = '';
                document.getElementById('nameservers-info').innerHTML = '';
            } else {
                const whoisData = data.result;

                // Update domain information
                updateInfoSection('domain-info', {
                    'Domain Name': whoisData.domain_name,
                    'Creation Date': whoisData.creation_date,
                    'Expiration Date': whoisData.expiration_date,
                    'Updated Date': whoisData.updated_date,
                    'Registrar': whoisData.registrar,
                    'Whois Server': whoisData.whois_server
                });

                // Update registrant information
                updateInfoSection('registrant-info', {
                    'Name': whoisData.name,
                    'Organization': whoisData.org,
                    'Email': whoisData.emails,
                    'Address': whoisData.address,
                    'City': whoisData.city,
                    'State': whoisData.state,
                    'Zip Code': whoisData.zipcode,
                    'Country': whoisData.country
                });

                // Update nameservers
                const nameserversHtml = whoisData.name_servers?.map(ns => 
                    `<div class="info-item">
                        <span class="info-value">${ns}</span>
                    </div>`
                ).join('') || '<div class="info-item">No nameservers found</div>';
                document.getElementById('nameservers-info').innerHTML = nameserversHtml;

            }

            // Show results
            resultsContainer.style.display = 'block';
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            loadingElement.style.display = 'none';
        }
    });

    function updateInfoSection(sectionId, data) {
        const section = document.getElementById(sectionId);
        section.innerHTML = Object.entries(data)
            .map(([key, value]) => `
                <div class="info-item">
                    <span class="info-label">${key}:</span>
                    <span class="info-value">${value || 'N/A'}</span>
                </div>
            `)
            .join('');
    }
}); 