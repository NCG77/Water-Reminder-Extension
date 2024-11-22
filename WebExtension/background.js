const getStoredData = (key, callback) => {
    chrome.storage.local.get(key, (result) => {
        callback(result[key]);
    });
};

const setStoredData = (key, value) => {
    chrome.storage.local.set({ [key]: value });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'startReminder') {
        const time = parseFloat(message.time);
        chrome.alarms.create('waterReminder', { delayInMinutes: time, periodInMinutes: time });
        setStoredData('reminderType', message.reminderType);
        sendResponse({ success: true });
    } else if (message.type === 'stopReminder') {
        chrome.alarms.clear('waterReminder');
        sendResponse({ success: true });
    } else if (message.type === 'saveCustomSound') {
        setStoredData('customSound', message.data);
        sendResponse({ success: true });
    } else if (message.type === 'setVolume') {
        setStoredData('volume', message.volume);
        sendResponse({ success: true });
    }
    return true;
});


chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'waterReminder') {
        getStoredData('reminderType', (reminderType) => {
            if (reminderType === 'popup') {
                chrome.windows.create({
                    url: 'reminder.html',
                    type: 'popup',
                    width: 270,
                    height: 260,
                });
            } else if (reminderType === 'notification') {
                chrome.notifications.create(
                    String(Date.now()),
                    {
                        type: 'basic',
                        iconUrl: chrome.runtime.getURL('WebExtension\icon.png'),
                        title: 'Health Reminder',
                        message: 'Time to drink water and take a short break!',
                        priority: 2,
                    }
                );
            }
        });

        getStoredData('customSound', (customSound) => {
            const soundFile = customSound || chrome.runtime.getURL('gm_melodic_chime_Audio_Denoise.mp3');
            getStoredData('volume', (volume) => {
                try {
                    const audio = new Audio(soundFile);
                    audio.volume = volume || 0.5;
                    audio.play().catch((error) => console.error('Audio playback failed:', error));
                } catch (error) {
                    console.error('Failed to initialize or play audio:', error);
                }
            });
        });
    }
});
