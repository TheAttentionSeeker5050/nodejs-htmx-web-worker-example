self.onmessage = async (event) => {
    const { url } = event.data;
  
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch the video");
  
      // Convert response to blob
      const blob = await response.blob();

      self.postMessage({ status: "complete", blob });

    } catch (error) {
      self.postMessage({ status: "error", message: error.message });
    }
  };
  