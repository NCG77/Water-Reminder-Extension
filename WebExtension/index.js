document.getElementById('reminderForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const waterTime = document.getElementById('waterInput').value;
    const reminderType = document.getElementById('reminderType').value;

    chrome.runtime.sendMessage({ type: 'startReminder', time: waterTime, reminderType }, (response) => {
        document.getElementById('reminderMessages').innerText = `Reminder set for every ${waterTime} minutes.`;
    });
});

document.getElementById('stopButton').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'stopReminder' }, () => {
        document.getElementById('reminderMessages').innerText = 'Reminder stopped.';
    });
});

document.getElementById('soundFile').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            chrome.runtime.sendMessage({ type: 'saveCustomSound', data: e.target.result });
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('volumeSlider').addEventListener('input', (event) => {
    const volume = event.target.value / 100;
    chrome.runtime.sendMessage({ type: 'setVolume', volume });
});
