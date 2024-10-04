document.getElementById('reminderForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const waterTime = document.getElementById('waterInput').value;

    chrome.runtime.sendMessage({
        type: 'startReminder',
        time: waterTime
    });

    document.getElementById('reminderMessages').innerText = `Reminder set for every ${waterTime} minutes.`;
});

document.getElementById('stopButton').addEventListener('click', function() {
    chrome.runtime.sendMessage({ type: 'stopReminder' });
    document.getElementById('reminderMessages').innerText = 'Reminder stopped.';
});

document.getElementById('soundFile').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const audioData = e.target.result;
            localStorage.setItem('customSound', audioData);  
        };
        reader.readAsDataURL(file);  L
    }
});

const playReminderSound = () => {
    const customSound = localStorage.getItem('customSound');
    let soundFile;

    if (customSound) {
        soundFile = customSound;
    } else {
        soundFile = 'default_sound.mp3';  
    }

    playSound(soundFile);  
};

const playSound = (audioFile) => {
    const audio = new Audio(audioFile);
    const savedVolume = localStorage.getItem('volume') || 0.5;  
    audio.volume = savedVolume;
    audio.play();
};

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'waterReminder') {
        chrome.windows.create({
            url: 'reminder.html',
            type: 'popup',
            width: 300,
            height: 200
        });
        playReminderSound(); 
    }
});


document.getElementById('volumeSlider').addEventListener('input', function() {
    const volume = this.value / 100;  
    localStorage.setItem('volume', volume); 
});

