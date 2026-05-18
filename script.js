let isPlaying = false;
let audioPlayer = document.getElementById("audio-player");
let audioSource = document.getElementById("audio-source");
let currentTrackIndex = 0;
let audioList = [];
const defaultAudioFile = "englishSong.mpeg";

window.onload = function () {
    const savedAudio = localStorage.getItem('audioFiles');
    const savedIndex = localStorage.getItem('currentTrackIndex');
    if (savedAudio) {
        audioList = JSON.parse(savedAudio);
    } else {
        audioList = [defaultAudioFile];
    }
    if (!audioList.includes(defaultAudioFile)) {
        audioList.unshift(defaultAudioFile);
    }
    currentTrackIndex = savedIndex ? parseInt(savedIndex) : 0;
    loadAudio(currentTrackIndex);
    displayAudioList();
};

function togglePlay() {
    if (isPlaying) {
        audioPlayer.pause();
    } else {
        audioPlayer.play();
    }
    isPlaying = !isPlaying;
}

function prevTrack() {
    if (audioList.length > 0) {
        currentTrackIndex = (currentTrackIndex === 0) ? audioList.length - 1 : currentTrackIndex - 1;
        loadAudio(currentTrackIndex);
    }
}

function nextTrack() {
    if (audioList.length > 0) {
        currentTrackIndex = (currentTrackIndex === audioList.length - 1) ? 0 : currentTrackIndex + 1;
        loadAudio(currentTrackIndex);
    }
}

function loadAudio(index) {
    if (audioList.length > 0 && index < audioList.length) {
        audioSource.src = audioList[index];
        audioPlayer.load();
        audioPlayer.play();
        isPlaying = true;
        localStorage.setItem('currentTrackIndex', index);
    }
}

function showAudioMenu() {
    const menu = document.getElementById('audio-menu');
    menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'block' : 'none';
}

function saveAudio() {
    const fileInput = document.getElementById('audio-file');
    const files = fileInput.files;
    for (let file of files) {
        const audioURL = URL.createObjectURL(file);
        audioList.push(audioURL);
    }
    localStorage.setItem('audioFiles', JSON.stringify(audioList));
    alert("Audio files saved!");
    document.getElementById('audio-menu').style.display = 'none';
    fileInput.value = '';
    loadAudio(currentTrackIndex);
    displayAudioList();
}

function deleteAllAudio() {
    if (audioList.length > 0) {
        audioList = [defaultAudioFile];
        localStorage.setItem('audioFiles', JSON.stringify(audioList));
        localStorage.removeItem('currentTrackIndex');
        alert("All audio files deleted!");
        loadAudio(0);
        displayAudioList();
    } else {
        alert("No audio files to delete!");
    }
}

function deleteAudio(index) {
    audioList.splice(index, 1);
    if (audioList.length === 0) {
        audioList = [defaultAudioFile];
    }
    localStorage.setItem('audioFiles', JSON.stringify(audioList));
    alert("Audio file deleted!");
    loadAudio(currentTrackIndex);
    displayAudioList();
}

function displayAudioList() {
    const audioListContainer = document.getElementById('audio-list');
    audioListContainer.innerHTML = '';
    if (audioList.length === 0) {
        audioListContainer.innerHTML = '<li>No saved audio files.</li>';
    } else {
        audioList.forEach((audio, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>Track ${index + 1}</span>
                <button onclick="playSelectedAudio(${index})">Play</button>
                <button onclick="deleteAudio(${index})">Delete</button>
            `;
            audioListContainer.appendChild(li);
        });
    }
}

function playSelectedAudio(index) {
    currentTrackIndex = index;
    loadAudio(index);
    displayAudioList();
}
