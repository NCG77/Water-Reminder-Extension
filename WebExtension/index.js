document.getElementById('reminderForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const waterTime = document.getElementById('waterInput').value;
    const reminderType = document.getElementById('reminderType').value;

    if (waterTime > 0) {
        chrome.runtime.sendMessage({
            type: 'startReminder',
            time: waterTime,
            reminderType: reminderType,
        });

        document.getElementById('reminderMessages').innerText = `Reminder set for every ${waterTime} minutes using ${reminderType}.`;
    } else {
        document.getElementById('reminderMessages').innerText = 'Please enter a valid time.';
    }
});

document.getElementById('stopButton').addEventListener('click', function () {
    chrome.runtime.sendMessage({ type: 'stopReminder' });
    document.getElementById('reminderMessages').innerText = 'Reminder stopped.';
});

document.getElementById('soundFile').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const audioData = e.target.result;
            localStorage.setItem('customSound', audioData);
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('volumeSlider').addEventListener('input', function () {
    const volume = this.value / 100;
    localStorage.setItem('volume', volume);
});

const playReminderSound = () => {
    const customSound = localStorage.getItem('customSound');
    const soundFile = customSound || 'default_sound.mp3';
    playSound(soundFile);
};

const playSound = (audioFile) => {
    const audio = new Audio(audioFile);
    const savedVolume = localStorage.getItem('volume') || 0.5;
    audio.volume = savedVolume;
    audio.play();
};

chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'triggerReminder') {
        if (message.reminderType === 'popup') {
            chrome.windows.create({
                url: 'reminder.html',
                type: 'popup',
                width: 300,
                height: 200,
            });
        } else if (message.reminderType === 'notification') {
            chrome.notifications.create('waterReminder', {
                type: 'basic',
                iconUrl: 'icon.png',
                title: 'Time to drink water!',
                message: 'Stay hydrated and take a break!',
            });
        }
        playReminderSound();
    }
});
