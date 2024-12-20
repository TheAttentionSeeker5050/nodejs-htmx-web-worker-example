const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Set views directory and render engine
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", path.join(__dirname, "views"));

// Create a list of all the videos on public/files
const allVideos = [
  "miami.mp4",
  "canada.mp4",
  "city-skyline.mp4",
  "fjord.mp4",
  "racecar.mp4",
  "reindeer.mp4",
  "russia.mp4",
  "sky.mp4",
  "space.mp4",
];

const headerPath = path.join(__dirname, "views/partials/header.html");
const footerPath = path.join(__dirname, "views/partials/footer.html");
const playerPath = path.join(__dirname, "views/partials/player.html");
const playlistPath = path.join(__dirname, "views/partials/playlist.html");

// Routes
app.get("/", (req, res) => {
  res.render("content", {
    header: require("fs").readFileSync(headerPath, "utf-8"),
    footer: require("fs").readFileSync(footerPath, "utf-8"),
    player: require("fs").readFileSync(playerPath, "utf-8"),
    playlist: require("fs").readFileSync(playlistPath, "utf-8"),
    videosList: allVideos,
    });
});


// Route to get the video files, it has parameters start for starting buffering at a specific time
app.get("/stream/:video", (req, res) => {
  const video = req.params.video;
  const videoPath = path.join(__dirname, "public/files", video);
  const stat = require("fs").statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range


  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10) | 0;
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    // Ensure start and end are within the file bounds
    if (start >= fileSize) {
      // If start is greater than or equal to the file size, return a 416 error (Range Not Satisfiable)
      res.status(416).send("Requested range not satisfiable");
      return;
    }


    const chunkSize = end - start + 1;
    const file = require("fs").createReadStream(videoPath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(200, head);
    require("fs").createReadStream(videoPath).pipe(res);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
