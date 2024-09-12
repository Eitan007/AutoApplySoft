document.getElementById('apiKeyForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const apiKey = document.getElementById('apiKeyInput').value;
    const message = document.getElementById('message');

    try {
        const response = await fetch('http://127.0.0.1:8000/submit-key', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'api_key': apiKey
            })
        });

        if (response.ok) {
            message.textContent = 'API Key Submitted Successfully!';
            message.className = 'success';
        } else {
            message.textContent = 'Error occurred while submitting API key.';
            message.className = 'error';
        }
    } catch (error) {
        message.textContent = 'Network error occurred.';
        message.className = 'error';
    }
});
