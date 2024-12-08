document.addEventListener("DOMContentLoaded", () => {
    const downloadBtn = document.getElementById("download-btn");
    const message = document.getElementById("message");
    const animationPlaceholder = document.getElementById("animation-placeholder");
  
    const worker = new Worker("/js/download-worker.js");
  
    worker.onmessage = (event) => {
      const { status, blob, message: errorMsg } = event.data;
      
      if (status === "complete") {
        // Create a download link for the Blob
        const fileName = "placeholder-video.mp4";
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  
        message.textContent = "Download complete!";
        animationPlaceholder.classList.add("hidden");
      } else if (status === "error") {
        message.textContent = `Error: ${errorMsg}`;
        animationPlaceholder.classList.add("hidden");
      }
    };
  
    downloadBtn.addEventListener("click", () => {
      message.textContent = "Downloading placeholder-video.mp4...";
      message.classList.remove("hidden");
      animationPlaceholder.classList.remove("hidden");
  
      worker.postMessage({ url: "/files/placeholder-video.mp4" });
    });
  });
  