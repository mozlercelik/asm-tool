document.getElementById('start-scan').addEventListener('click', async () => {
    const target = document.getElementById('target').value;
    const resultsDiv = document.getElementById('results');

    if (!target) {
        resultsDiv.innerHTML = '<p style="color: red;">Please enter a target.</p>';
        return;
    }

    resultsDiv.innerHTML = '<p>Scanning...</p>';

    try {
        const response = await fetch('http://localhost/api/scan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ target }),
        });

        const data = await response.json();
        displayResults(data);
    } catch (error) {
        resultsDiv.innerHTML = '<p style="color: red;">Error occurred during the scan.</p>';
        console.error('Error:', error);
    }
});

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h2>Scan Results</h2>';

    for (const [key, value] of Object.entries(data)) {
        resultsDiv.innerHTML += `<h3>${key.charAt(0).toUpperCase() + key.slice(1)}</h3>`;
        resultsDiv.innerHTML += `<pre>${JSON.stringify(value, null, 2)}</pre>`;
    }
}