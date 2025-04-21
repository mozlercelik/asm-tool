document.addEventListener('DOMContentLoaded', () => {
    const startScanButton = document.getElementById('start-scan');
    const targetInput = document.getElementById('target');
    const loadingElement = document.getElementById('loading');
    const resultsContainer = document.getElementById('results');
    const subdomainsListElement = document.getElementById('subdomains-list');

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
            const response = await fetch(`/api/tools/subdomains?target=${encodeURIComponent(target)}`, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                    'If-Modified-Since': '0'
                }
            });
            
            // Handle 304 response
            if (response.status === 304) {
                // Force a new request without caching
                const newResponse = await fetch(`/api/tools/subdomains?target=${encodeURIComponent(target)}&_=${Date.now()}`, {
                    method: 'GET',
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    }
                });
                const data = await newResponse.json();
                updateSubdomainsList(data);
            } else {
                const data = await response.json();
                updateSubdomainsList(data);
            }

            // Show results
            resultsContainer.style.display = 'block';
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            loadingElement.style.display = 'none';
        }
    });

    function updateSubdomainsList(subdomains) {
        const subdomainsHtml = subdomains
            .map(subdomain => {
                return `
                    <div class="info-item">
                        <div class="info-values">
                            <span class="info-value">${subdomain}</span>
                        </div>
                    </div>
                `;
            })
            .join('');
        
        subdomainsListElement.innerHTML = subdomainsHtml || '<div class="info-item"><span class="info-value">No subdomains found</span></div>';
    }
}); 