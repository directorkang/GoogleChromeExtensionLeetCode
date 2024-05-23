let questionData = ''; // Global variable to store question data

// Listen for the install event
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

// Listen for the startup event
chrome.runtime.onStartup.addListener(() => {
    console.log('Extension started');
});

// Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === 'fetchData') {
        try {
            const response = await fetch('https://api.example.com/data');
            const data = await response.json();
            sendResponse({ success: true, data: data });
        } catch (error) {
            console.error('Error fetching data:', error);
            sendResponse({ success: false, error: error });
        }
        return true;
    }

    if (message.action === 'storeQuestion') {
        questionData = message.question;
        console.log('Question stored:', questionData);
        sendResponse({ success: true });
    }

    if (message.action === 'getQuestion') {
        sendResponse({ success: true, question: questionData });
    }
});