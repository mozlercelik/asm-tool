document.addEventListener('DOMContentLoaded', () => {
    const startScanButton = document.getElementById('start-scan');
    const targetInput = document.getElementById('target');
    const startPortInput = document.getElementById('start-port');
    const endPortInput = document.getElementById('end-port');
    const loadingElement = document.getElementById('loading');
    const resultsContainer = document.getElementById('results');
    const totalPortsElement = document.getElementById('total-ports');
    const openPortsElement = document.getElementById('open-ports');
    const portsBodyElement = document.getElementById('ports-body');

    startScanButton.addEventListener('click', async () => {
        const target = targetInput.value.trim();
        const startPort = parseInt(startPortInput.value);
        const endPort = parseInt(endPortInput.value);

        if (!target) {
            alert('Please enter a target IP or domain');
            return;
        }

        if (isNaN(startPort) || isNaN(endPort) || startPort < 1 || endPort > 65535 || startPort > endPort) {
            alert('Please enter valid port range (1-65535)');
            return;
        }

        // Show loading state
        loadingElement.style.display = 'flex';
        resultsContainer.style.display = 'none';

        try {
            const response = await fetch(`/api/tools/ports?target=${encodeURIComponent(target)}&start_port=${startPort}&end_port=${endPort}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to scan ports');
            }

            // Check if data is empty or not found
            if (!data.result || !data.result.ports || data.result.ports.length === 0) {
                portsBodyElement.innerHTML = '<tr><td colspan="4">No ports found</td></tr>';
                totalPortsElement.textContent = '0';
                openPortsElement.textContent = '0';
            } else {
                const scanResults = data.result;
                const openPorts = scanResults.ports.filter(port => port.status === 'open');
                const closedPorts = scanResults.ports.filter(port => port.status === 'closed');

                // Update summary
                totalPortsElement.textContent = scanResults.ports.length;
                openPortsElement.textContent = openPorts.length;

                // Sort ports: open ports first, then closed ports
                const sortedPorts = [...openPorts, ...closedPorts];

                // Update ports table
                portsBodyElement.innerHTML = sortedPorts.map(port => `
                    <tr>
                        <td>${port.port}</td>
                        <td>
                            <span class="status-badge ${port.status}">
                                ${port.status}
                            </span>
                        </td>
                        <td>${port.service || 'Unknown'}</td>
                        <td>${port.protocol || 'TCP'}</td>
                    </tr>
                `).join('');
            }

            // Show results
            resultsContainer.style.display = 'block';
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            loadingElement.style.display = 'none';
        }
    });
}); 