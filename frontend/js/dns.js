document.addEventListener('DOMContentLoaded', () => {
    const startScanButton = document.getElementById('start-scan');
    const targetInput = document.getElementById('target');
    const loadingElement = document.getElementById('loading');
    const resultsContainer = document.getElementById('results');
    const dnsRecordsElement = document.getElementById('dns-records');

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
            const response = await fetch(`/api/tools/dns-records?target=${encodeURIComponent(target)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch DNS records');
            }

            // Check if data is empty or not found
            if (!data.result || !data.result.dns_records || Object.keys(data.result.dns_records).length === 0) {
                dnsRecordsElement.innerHTML = '<div class="info-item"><span class="info-value">No DNS records found</span></div>';
            } else {
                updateDNSRecords(data.result.dns_records);
            }

            // Show results
            resultsContainer.style.display = 'block';
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            loadingElement.style.display = 'none';
        }
    });

    function updateDNSRecords(records) {
        const recordsHtml = Object.entries(records)
            .map(([type, values]) => {
                if (!values || values.length === 0) return '';
                return `
                    <div class="info-item">
                        <span class="info-label">${type}:</span>
                        <div class="info-values">
                            ${values.map(value => `<span class="info-value">${value}</span>`).join('<br>')}
                        </div>
                    </div>
                `;
            })
            .filter(html => html !== '')
            .join('');
        
        dnsRecordsElement.innerHTML = recordsHtml || '<div class="info-item"><span class="info-value">No DNS records found</span></div>';
    }
}); 