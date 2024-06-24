window.AudioContext = window.AudioContext || window.webkitAudioContext;
const volumeText = document.getElementById('volume');
const volumeRange = document.getElementById('volume-range');
const volumeMute = document.getElementById('volume-Mute');
const playButton = document.getElementById('play');
const stopButton = document.getElementById('stop');
const timeText = document.getElementById('time');
const timeRange = document.getElementById('time-range');

let context = new AudioContext();
let gainNode = context.createGain();
let source = null;
let startTime = 0;
let elapsedTime = 0;
let isPlaying = false;
let muted = false;
let seeking = false;
let audioQueue = [];
let audioBuffer = null;

const socket = io();

// Event listeners for HTML elements
playButton.addEventListener('click', () => {
    if (!isPlaying) {
        playBuffer();
    }
});

stopButton.addEventListener('click', () => {
    stopPlayback();
});

volumeRange.addEventListener('input', () => {
    gainNode.gain.value = volumeRange.value / 10;
    volumeText.innerText = volumeRange.value;
});

volumeMute.addEventListener('click', () => {
    muted = !muted;
    gainNode.gain.value = muted ? 0 : volumeRange.value / 10;
    volumeMute.innerText = muted ? "Mute On" : "Mute Off";
});

timeRange.addEventListener('input', () => {
    seeking = true;
    timeText.innerHTML = timeRange.value;
});

timeRange.addEventListener('change', () => {
    elapsedTime = parseFloat(timeRange.value);
    if (isPlaying) {
        stopPlayback();
        playBuffer();
    }
    seeking = false;
});

socket.on('audio', chunk => {
    if (!isPlaying) {
        audioQueue = [];
        return;
    }
    const uint8Chunk = new Uint8Array(chunk);
    context.decodeAudioData(uint8Chunk.buffer, buffer => {
        audioQueue.push(buffer);
        if (!source) {
            playBuffer();
        }
    });
});

function playBuffer() {
    if (audioQueue.length > 0) {
        audioBuffer = audioQueue.shift();
        source = context.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(gainNode);
        gainNode.connect(context.destination);
        source.start(0, elapsedTime);
        startTime = context.currentTime - elapsedTime;
        isPlaying = true;
        source.onended = () => {
            if (audioQueue.length > 0) {
                playBuffer();
            } else {
                isPlaying = false;
            }
        };
        requestAnimationFrame(updateElapsedTime);
    }
}

function stopPlayback() {
    if (isPlaying && source) {
        source.stop();
        source.disconnect();
        isPlaying = false;
        source = null;
        elapsedTime = 0;
        timeText.innerHTML = '0';
        timeRange.value = '0';
    }
}

function updateElapsedTime() {
    if (isPlaying && !seeking) {
        elapsedTime = context.currentTime - startTime;
        timeText.innerHTML = elapsedTime.toFixed(0);
        timeRange.value = elapsedTime;
        requestAnimationFrame(updateElapsedTime);
    }
}
