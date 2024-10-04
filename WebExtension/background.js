chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'startReminder') {
        const waterTime = message.time;
        chrome.alarms.create('waterReminder', {
            delayInMinutes: parseFloat(waterTime),
            periodInMinutes: parseFloat(waterTime)
        });
    } else if (message.type === 'stopReminder') {
        chrome.alarms.clear('waterReminder');
    }
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'waterReminder') {
        chrome.windows.create({
            url: 'reminder.html',
            type: 'popup',
            width: 270,
            height: 260
        });
    }
});

