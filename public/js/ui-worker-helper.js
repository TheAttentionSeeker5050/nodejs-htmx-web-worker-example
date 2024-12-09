document.addEventListener("DOMContentLoaded", () => {
    // Get the DOM elements we need
    const downloadBtn = document.getElementById("download-btn");
    const message = document.getElementById("message");
    const animationPlaceholder = document.getElementById("animation-placeholder");
    const progressText = document.getElementById("progress-text");
    const completionWheel = document.getElementById("completion-wheel"); 
  
  
    const worker = new Worker("/js/download-worker.js");

    // We use this to format the size in bytes, kilobytes, megabytes, or gigabytes
    // depending on the size of the file
    const formatSize = (bytes) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
      if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
      return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
    };
  
    worker.onmessage = (event) => {
      const { status, progress, downloadedSize, totalSize, blob, message: errorMsg } = event.data;

      
      if (status === "progress") {
        // Update the completion wheel with progress
        completionWheel.style.background = `conic-gradient(#4CAF50 ${progress}%, #ddd ${progress}%)`;
        progressText.textContent = `${progress}% (${formatSize(downloadedSize)} of ${formatSize(totalSize)})`;
      } else if (status === "complete") {
        // Create a download link for the Blob
        const fileName = "placeholder-video.mp4";
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  
        // Add a message to the user and hide the wheel animation
        message.textContent = "Download complete!";
        animationPlaceholder.classList.add("hidden");
        completionWheel.classList.add("hidden");
      } else if (status === "error") {
        // Hide the progress text
        progressText.textContent = "";
        progressText.classList.add("hidden");

        // Display the error message and hide the wheel animation
        message.textContent = `Error: ${errorMsg}`;
        animationPlaceholder.classList.add("hidden");
        completionWheel.classList.add("hidden");
      }
    };
  
    downloadBtn.addEventListener("click", () => {
      message.textContent = "Downloading placeholder-video.mp4...";
      message.classList.remove("hidden");
      animationPlaceholder.classList.remove("hidden");
      completionWheel.classList.remove("hidden");
      progressText.classList.remove("hidden");
  
      worker.postMessage({ url: "/files/placeholder-video.mp4" });
    });
  });
  