let questionData = []; // Global array to store question data

// Listen for the install event
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

// Listen for the startup event
chrome.runtime.onStartup.addListener(() => {
    console.log('Extension started');
});

// Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'fetchData') {
        fetch('https://api.example.com/data')
            .then(response => response.json())
            .then(data => sendResponse({ success: true, data }))
            .catch(error => {
                console.error('Error fetching data:', error);
                sendResponse({ success: false, error });
            });
        return true; // Indicates you want to send a response asynchronously
    }

    if (message.action === 'storeQuestion') {
        if (!questionData.includes(message.question)) {
            questionData.push(message.question);
        }
        console.log('Question stored:', questionData);
        sendResponse({ success: true, questionData });
    }

    if (message.action === 'getQuestion') {
        sendResponse({ success: true, questionData });
    }
});
