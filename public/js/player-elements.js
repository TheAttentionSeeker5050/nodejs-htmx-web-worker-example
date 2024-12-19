// get the player elements by id
const videoPlayer = document.getElementById("video-player");
const playPauseBtn = document.getElementById("play-pause-btn");
const volumeBar = document.getElementById("volume-bar");
const muteBtn = document.getElementById("mute-btn");
const fullScreenBtn = document.getElementById("full-screen-btn");
const seekBar = document.getElementById("seek-bar");
const playerLoadingWheel = document.getElementById("player-loading-wheel");
const playerErrorIcon = document.getElementById("player-error-icon");
const progressBarDownloadBuffer = document.getElementById("progress-bar-download-buffer");

let bufferTimeStart = 0;
let videoBitRate = 0;

// event listeners for these buttons
playPauseBtn.addEventListener("click", playPauseVideo);

volumeBar.addEventListener("change", changeVolume);

muteBtn.addEventListener("click", muteVolume);

fullScreenBtn.addEventListener("click", toggleFullScreen);

seekBar.addEventListener("change", changeVideoTime);

// add event listener for the video player to update the seek bar
videoPlayer.addEventListener("timeupdate", currentTimeUpdate);

// event listener for the video player to hide the loading wheel
videoPlayer.addEventListener("canplay", videoCanPlay);

// event listener for the video player to show the loading wheel
videoPlayer.addEventListener("waiting", videoWaiting);

// event listener for the video player to show the error icon
videoPlayer.addEventListener("stalled", stalledOrErrorPlayer);
videoPlayer.addEventListener("error", stalledOrErrorPlayer);

// event listener for the video player to start over when the video ends
videoPlayer.addEventListener("ended", videoEnded);

// event listener for when the video is buffering to update the download buffer progress bar
videoPlayer.addEventListener("progress", updateDownloadBuffer);


// functions to handle the event listeners
function playPauseVideo() {
    if (videoPlayer.paused) {
        videoPlayer.play();

        playPauseBtn.childNodes[0].innerText = "pause_circle";

    } else {
        videoPlayer.pause();
        playPauseBtn.childNodes[0].innerText = "play_circle";
    }
}

function changeVolume() {
    videoPlayer.volume = volumeBar.value;
}

function muteVolume() {
    if (videoPlayer.muted) {
        videoPlayer.muted = false;
        muteBtn.childNodes[0].innerText = "volume_off";

    } else {
        videoPlayer.muted = true;
        muteBtn.childNodes[0].innerText = "volume_up";

    }
}

function toggleFullScreen() {
    if (videoPlayer.requestFullscreen) {
        videoPlayer.requestFullscreen();
    } else if (videoPlayer.mozRequestFullScreen) {
        videoPlayer.mozRequestFullScreen();
    } else if (videoPlayer.webkitRequestFullscreen) {
        videoPlayer.webkitRequestFullscreen();
    } else if (videoPlayer.msRequestFullscreen) {
        videoPlayer.msRequestFullscreen();
    }
}

// when we manually change the seek bar, we want to change the video time
function changeVideoTime(event) {
    // calculate the new time
    const newTime = videoPlayer.duration * (seekBar.value / 100);
    videoPlayer.currentTime = newTime;
    bufferTimeStart = newTime;
    
    // TODO: add a logic to jump to an unbuffered zone and start loading from there
    videoPlayer.currentTime = newTime;
    bufferTimeStart = newTime;
    videoPlayer.play();
}

// as the video plays and the seconds change with progression, execute this on this event
function currentTimeUpdate() {
    // only do this if the video is playing
    if (!videoPlayer.paused) {        
        const value = (100 / videoPlayer.duration) * videoPlayer.currentTime;
        seekBar.value = value;
    }
}

function stalledOrErrorPlayer() {
    playerLoadingWheel.classList.add("hidden");
    playerErrorIcon.classList.remove("hidden");
}

// function for when the video ends start over the current time and change the play button to play
function videoEnded() {
    videoPlayer.currentTime = 0;
    playPauseBtn.childNodes[0].innerText = "play_circle";
    seekBar.value = 0;
}

// function for when the video can play
function videoCanPlay() {
    playerLoadingWheel.classList.add("hidden");
    playerErrorIcon.classList.add("hidden");
}

// function for when video content is waiting for buffering and for now has to start the loading wheel
function videoWaiting() {
    playerLoadingWheel.classList.remove("hidden");
}

// function to update the download buffer progress bar on progress event
// this progress html tag has a start and end value
function updateDownloadBuffer(event) {
    // if buffered is not empty
    if (videoPlayer.buffered.length === 0) {
        return;
    }

    const endValue = (100 / videoPlayer.duration) * videoPlayer.buffered.end(0);

    // calculate download buffer fill percentage
    progressBarDownloadBuffer.style.width = endValue < 98 ? `${endValue}%` : "97%";
}

export {
    videoPlayer,
    playPauseBtn,
    volumeBar,
    muteBtn,
    fullScreenBtn,
    seekBar,
    playerLoadingWheel,
    progressBarDownloadBuffer,
    playerErrorIcon
}