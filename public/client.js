window.AudioContext = window.AudioContext || window.webkitAudioContext;
const volumeText = document.getElementById('volume')
const volumeRange = document.getElementById('volume-range')
const volumeMute = document.getElementById('volume-Mute')
const playButton = document.getElementById('play')
const stopButton = document.getElementById('stop')
const shuffleButton = document.getElementById('shuffle')
const timeText = document.getElementById('time')
const timeRange = document.getElementById('time-range')

let context = new AudioContext();
let source = null;
let gainNode = context.createGain();
let isPlaying = false;
let audioBuffer = null;
let startTime = 0;
let pauseTime = 0;
let elapsedTime = 0;
let manuallyStopped = false;
let muted = false;
let seeking = false;
let timerChange = false

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
        console.log(elapsedTime)
        source.start(0, elapsedTime);
        isPlaying = true;
        manuallyStopped = false;

        source.onended = () => {
            isPlaying = false;
            if (!manuallyStopped) {
                loadAudio("/random-music")
            } 
            else if(seeking) {
                playBuffer();
                seeking = false;
            }
        };

        requestAnimationFrame(updateElapsedTime);
    }
}

function stopPlayback() {
    console.log("stop")
    manuallyStopped = true
    if (isPlaying) {
        source.stop();
        source.disconnect();
        isPlaying = false;
        source = null;
    }
}

function updateElapsedTime() {
    if (isPlaying && !seeking) {
        elapsedTime = context.currentTime - startTime;
        timeText.innerHTML = elapsedTime.toFixed(0);
        timeRange.max = audioBuffer.duration;
        timeRange.value = elapsedTime;
        requestAnimationFrame(updateElapsedTime);
    }
}


shuffleButton.onclick = () => {
    stopPlayback()
    if (source) {
        elapsedTime = 0
        context.currentTime = 0
        audioBuffer = null;
        console.log(audioBuffer)
    }
    loadAudio("/random-music")
};

stopButton.onclick = () => {
    stopPlayback();
};

playButton.onclick = () => {
    if (!isPlaying) {
        playBuffer();
    }
};

timeRange.oninput = () => {
    seeking = true;
    timeText.innerHTML = timeRange.value;
};

timeRange.onchange = () => {
    elapsedTime = parseFloat(timeRange.value);
    timerChange = true
    if (isPlaying) {
        stopPlayback();
    }
};

volumeRange.oninput  = () => {
    gainNode.gain.value = volumeRange.value / 10;
    volumeText.innerText = volumeRange.value;
    console.log(`Volume set to: ${gainNode.gain.value}`);
};

volumeMute.onclick  = () => {
    if(!muted){
        gainNode.gain.value = 0;
        volumeMute.innerText = " Mute On";
    }
    else{
        gainNode.gain.value = volumeRange.value / 10;
        volumeMute.innerText = " Mute Off";
    }
    muted=!muted
};

loadAudio("/random-music");