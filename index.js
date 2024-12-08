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



// Routes
app.get("/", (req, res) => {
  const contentPath = path.join(__dirname, "views/partials/content.html");
  res.render("index", { body: require("fs").readFileSync(contentPath, "utf-8") });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
