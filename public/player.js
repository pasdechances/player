window.AudioContext = window.AudioContext || window.webkitAudioContext;
const volumeRange = document.getElementById('volume-range');
const volumeMute = document.getElementById('volume-Mute');
const playButton = document.getElementById('play');
const stopButton = document.getElementById('stop');
const shuffleButton = document.getElementById('shuffle');
const timeText = document.getElementById('time');
const timeRange = document.getElementById('time-range');

let context = null;
let gainNode = null;
let audioBuffer = null;
let source = null;
let startTime = 0;
let pauseTime = 0;
let elapsedTime = 0;
let seeking = false;
let isLoadingTrack = false;
let muted = false;

async function loadAudio(url) {
    try {
        resetAudio();
        isLoadingTrack = true;
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = await context.decodeAudioData(arrayBuffer);
        sourceLaunch();
        requestAnimationFrame(updateElapsedTime);
    } catch (err) {
        console.error(`Unable to fetch the audio file. Error: ${err.message}`);
    } finally {
        isLoadingTrack = false;
    }
}

function sourceLaunch(){
    source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(gainNode);
    gainNode.connect(context.destination);
    source.loop = false;
    startTime = context.currentTime - elapsedTime;
    source.start(0, elapsedTime);
    togglePlayStop()
    source.context.onstatechange = onChangeState;
    source.onended = onEndTrack;
}

function onEndTrack() {
    if(!seeking){
        console.log("load")
        loadAudio("/random-music");
    }
}

function onChangeState(test) {
    console.log(source.context.state)
    togglePlayStop()
}

function togglePlayStop(){
    if(source.context.state == "running"){
        playButton.disabled = true
        stopButton.disabled = false
    } else if(source.context.state == "suspended"){
        playButton.disabled = false
        stopButton.disabled = true
    }
}

function updateElapsedTime() {
    if (!seeking && audioBuffer) {
        elapsedTime = context.currentTime - startTime;
        timeText.innerHTML = elapsedTime.toFixed(0);
        timeRange.max = audioBuffer.duration;
        timeRange.value = elapsedTime;
        requestAnimationFrame(updateElapsedTime);
    }
}

function resetAudio() {
    elapsedTime = 0;
    context = new AudioContext();
    gainNode = context.createGain();
    audioBuffer = null;
    source = null;
    startTime = 0;
    pauseTime = 0;
    elapsedTime = 0;
    isLoadingTrack = false;
}

shuffleButton.onclick = () => {
    source.context.suspend();
    loadAudio("/random-music");
};

stopButton.onclick = () => {
    if(source){
        source.context.suspend();
    }
};

playButton.onclick = () => {
    if(source){
        source.context.resume();
    }
};

timeRange.oninput = () => {
    seeking = true;
    timeText.innerHTML = timeRange.value;
};

timeRange.onchange = async () => {
    elapsedTime = parseFloat(timeRange.value);
    if (source) {
        await stopSource(source);
        sourceLaunch();
        requestAnimationFrame(updateElapsedTime);
    }
    seeking = false;
};

async function stopSource(source) {
    return new Promise((resolve, reject) => {
        source.onended = () => {
            resolve();
        };
        source.stop();
    });
}

volumeRange.oninput = () => {
    gainNode.gain.value = volumeRange.value / 10;
};

volumeMute.onclick = () => {
    if (!muted) {
        gainNode.gain.value = 0;
        volumeMute.innerText = "Mute On";
    } else {
        gainNode.gain.value = volumeRange.value / 10;
        volumeMute.innerText = "Mute Off";
    }
    muted = !muted;
};

loadAudio("/random-music");
