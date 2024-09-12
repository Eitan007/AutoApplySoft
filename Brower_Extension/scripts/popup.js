// send url to server
document.getElementById('analyzeButton').addEventListener('click', async function () {
    try {
        
        message_to_content_js("analyze", null);
        
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const url = tab.url;
        console.log(JSON.stringify({ url: url }));
        
        const response = await fetch('http://127.0.0.1:8000/prompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        });

        const messageElement = document.getElementById('message');

        if (response.ok) {
            messageElement.textContent = 'URL Submitted Successfully!';
            messageElement.className = 'success';

            const data = await response.json();

            console.log(data);

            message_to_content_js("fill form", data);

        } else {
            messageElement.textContent = 'Error occurred while submitting URL.';
            messageElement.className = 'error';
        }


    

    } catch (error) {
        const messageElement = document.getElementById('message');
        messageElement.textContent = 'Network error occurred.';
        messageElement.className = 'error';
    }
});


function message_to_content_js(command, data) {
    chrome.tabs.query( {active: true, currentWindow: true },
        function(tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, { command : command, data : data });
        }
    );
}
