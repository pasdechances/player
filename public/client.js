window.AudioContext = window.AudioContext || window.webkitAudioContext;
const volumeButton = document.getElementById('volume')
const playButton = document.getElementById('play')
const stopButton = document.getElementById('stop')
const shuffleButton = document.getElementById('shuffle')

let context = new AudioContext();
let source = null;
let gainNode = context.createGain();
let isPlaying = false;
let audioBuffer = null;
let offset = 0

async function loadAudio(url) {
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = await context.decodeAudioData(arrayBuffer);
        playBuffer();
    } catch (err) {
        console.error(`Unable to fetch the audio file. Error: ${err.message}`);
    }
}

function playBuffer() {
    if (audioBuffer) {
        source = context.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(gainNode);
        gainNode.connect(context.destination);
        source.loop = true;
        source.start(0, offset);
        isPlaying = true;

        source.onended = () => {
            isPlaying = false;
        };
    }
}

function stopPlayback() {
    if (isPlaying) {
        source.stop();
        isPlaying = false;
    }
}



shuffleButton.onclick = () => {
    loadAudio("/random-music")
};

stopButton.onclick = () => {
    source.stopPlayback();
};

playButton.onclick = () => {
    if (!isPlaying) {
        playBuffer();
    }
};

volumeButton.oninput  = () => {
    gainNode.gain.value = volumeButton.value / 10;
    console.log(`Volume set to: ${gainNode.gain.value}`);
};

loadAudio("/random-music");