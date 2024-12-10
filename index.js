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

// Routes
app.get("/", (req, res) => {
  const contentPath = path.join(__dirname, "views/content.html");
  res.render("content", {
    header: require("fs").readFileSync(headerPath, "utf-8"),
    footer: require("fs").readFileSync(footerPath, "utf-8"),
    videosList: allVideos,
    });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
