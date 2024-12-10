import { formatSize, hideDownloadProgressAnimations, unhideDownloadProgressAnimations, progressText, completionWheel, message, downloadQueueTitle, videoBtnList } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {

  let downloadQueue = [];

  // add listener for click on each video
  // On click on a video button, we add the video to the end of the download queue list
  videoBtnList.forEach((video) => {
    video.addEventListener("click", () => {
      const videoName = video.getAttribute("data-video");
      if (!downloadQueue.includes(videoName)) {
        downloadQueue.push(videoName);
        addToDOMList(videoName); // Display the download list in the DOM

        // if there are videos in the download queue, enable the download button
        if (downloadQueue.length === 1) {
          message.textContent = `Downloading ${downloadQueue[0]}`;
          message.classList.remove("hidden");
          unhideDownloadProgressAnimations();
      
          videoDownloadWorker.postMessage({ url: `/files/${downloadQueue[0]}`, status: "progress" });
        }
      }
    });
  });

  // function to add a list item to the download queue in DOM list with id=download-queue
  const addToDOMList = (videoName) => {
    const li = document.createElement("li");
    li.classList.add("download-queue-item");

    // Add data attribute to the list item to be able to remove it from the download queue
    li.setAttribute("data-queue-video", videoName);

    const span = document.createElement("span");
    span.classList.add("download-queue-item-text");
    span.textContent = videoName;

    const button = document.createElement("button");
    button.textContent = "Cancel";
    button.classList.add("download-queue-item-cancel");
    // button.classList.add("button-transparent")

    li.appendChild(span);
    li.appendChild(button);

    document.getElementById("download-queue").appendChild(li);

    // add event listener to the cancel button
    button.addEventListener("click", () => {
      removeFromDOMList(videoName);
      document.getElementById("download-queue").removeChild(li);
      message.textContent = "Download " + videoName + " cancelled";
    });
  }

  // add functionality to the cancel button
  function removeFromDOMList(videoName) {
    // if video name is not present, default it to the first in queue.
    // We want this case so we are certain that on complete we can call this function
    // without the videoName argument and take the video item being downloaded
    const index = videoName ? downloadQueue.indexOf(videoName) : 0;
    
    if (index > -1) {
      downloadQueue.splice(index, 1);
    }
    
    // if the index is 0, we are currently downloading the video, so we need to cancel the download
    // We do this by changing the downloadWorker status to "complete" and removing the video from the download queue
    if (index === 0) {
      recreateDownloadQueueWorkerWithNextElement();
    }
  }

  // This function redeclares worker and sets new environment url and status progress if there are items in queue
  function recreateDownloadQueueWorkerWithNextElement () {
    // Stop the previous worker with the old event before pushing the new one
    if (videoDownloadWorker) {
      videoDownloadWorker.terminate();
    }

    // Create a new worker instance
    videoDownloadWorker = new Worker("/js/download-worker.js");

    // Reattach the message callback
    videoDownloadWorker.onmessage = (event) => videoDownloadWorkerMessageCallback(event);

    // Trigger the next download in the queue if there are items
    if (downloadQueue.length > 0) {

      message.textContent = "Waiting on next download";

      setTimeout(() => {
        message.textContent = `Downloading ${downloadQueue[0]}`;
        videoDownloadWorker.postMessage({ url: `/files/${downloadQueue[0]}`, status: "progress" });
      }, 1500);
    } else {
      hideDownloadProgressAnimations();
    }
  }

  let videoDownloadWorker = new Worker("/js/download-worker.js");
  videoDownloadWorker.onmessage = (event) => videoDownloadWorkerMessageCallback(event);
  
  function videoDownloadWorkerMessageCallback (event) {
    const { status, progress, downloadedSize, totalSize, blob, message: errorMsg } = event.data;
    
    if (status === "progress") {
      downloadQueueTitle.classList.remove("hidden");
      // Update the completion wheel with progress
      completionWheel.style.background = `conic-gradient(#4CAF50 ${progress}%, #ddd ${progress}%)`;
      progressText.textContent = `${progress}% (${formatSize(downloadedSize)} of ${formatSize(totalSize)})`;
    } else if (status === "complete") {
      // Create a download link for the Blob
      const fileName = downloadQueue[0];
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Add a message to the user and hide the wheel animation
      message.textContent = "All downloads complete!";

      removeFromDOMList();

      // remove the first video from the download queue in the DOM
      const downloadQueueList = document.getElementById("download-queue").children;
      if (downloadQueueList.length > 0) {
        downloadQueueList[0].remove();
      }

    } else if (status === "error") {
      // Hide the progress text
      progressText.textContent = "";

      // Display the error message and hide the wheel animation
      // message.textContent = `Error: ${errorMsg}`;
      message.textContent = "Something failed while trying to download the video";
      hideDownloadProgressAnimations();

      // if there are more videos in the download queue, start downloading the next one
      if (downloadQueue.length > 0) {
        message.textContent = `Downloading ${downloadQueue[0]}`;
        videoDownloadWorker.postMessage({ url: `/files/${downloadQueue[0]}`, status: "progress"});
      }
    }
  };
});