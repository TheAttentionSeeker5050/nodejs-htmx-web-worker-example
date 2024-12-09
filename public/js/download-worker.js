self.onmessage = async (event) => {
    const { url } = event.data;
  
    
     // In this solution we want to display a completion ring that goes from 1 to 100% as the video is downloaded. We can achieve this by calculating the percentage of the video downloaded and sending it back to the main thread. The main thread can then update the UI with the percentage value.
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch the video");

      // Get the content length (total file size) from the response headers
      const totalSize = parseInt(response.headers.get("Content-Length"), 10);
      let downloadedSize = 0;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const chunks = [];

      // Read the file in chunks and track the download progress
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Update the downloaded size and send progress
        downloadedSize += value.length;
        const progress = Math.round((downloadedSize / totalSize) * 100);
        self.postMessage({
          status: "progress",
          progress,
          downloadedSize,
          totalSize,
        });

        // Push the chunk to the chunks array
        chunks.push(value);
      }
  
      // Once download is complete, send the file as a Blob
      const blob = new Blob(chunks);
      self.postMessage({ status: "complete", blob });

    } catch (error) {
      self.postMessage({ status: "error", message: error.message });
    }
  };
  