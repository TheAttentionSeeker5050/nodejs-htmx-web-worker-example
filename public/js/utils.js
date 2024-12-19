// Get the DOM elements we need
const progressText = document.getElementById("progress-text");
const completionWheel = document.getElementById("completion-wheel");
const message = document.getElementById("message");
const downloadQueueTitle = document.getElementById("download-queue-title");

// Add a list of all the available videos to download
const videoBtnList = document.querySelectorAll(".list-item button");


// Functions to hide and unhide video animations
function hideDownloadProgressAnimations() {
    completionWheel.classList.add("hidden");
    progressText.classList.add("hidden");
}

function unhideDownloadProgressAnimations() {
    completionWheel.classList.remove("hidden");
    progressText.classList.remove("hidden");
}

// We use this to format the size in bytes, kilobytes, megabytes, or gigabytes
// depending on the size of the file
const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
};

export {
    formatSize, 
    hideDownloadProgressAnimations,
    unhideDownloadProgressAnimations,
    progressText,
    completionWheel,
    message,
    downloadQueueTitle,
    videoBtnList,

}