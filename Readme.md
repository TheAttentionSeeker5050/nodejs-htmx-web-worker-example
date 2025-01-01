# HTMX File Download and Video Player with Progress Wheel Animation

This project combines a file download application and a video player using Node.js, Express, HTMX, and Web Workers. It offers a visually appealing progress indicator, custom video player functionality, and easy playlist management.

## Features

### File Download
- **Progress Wheel**: A dynamic, filling animation that visually tracks download progress.
- **File Info Display**: Shows the percentage of the file downloaded and its size (e.g., MB, KB, GB).
- **Efficient Background Downloads**: Web Workers handle downloading files without blocking other operations.

### Video Player
- **Custom Player Controls**: Play, pause, next, previous, and instant play buttons for an intuitive experience.
- **Manageable Playlist**: Add, remove, or rearrange videos in a playlist dynamically.
- **Instant Play Option**: Play a selected video immediately, bypassing the current playlist sequence.
- **Auto-Advance**: Automatically moves to the next video when the current one ends.
- **Loading Spinner**: Displays a spinner while videos load or buffer for smoother feedback.
- **Supports HTTP Streams**: Enables streaming playback of video files.

### Additional Features
- **Dynamic Video List**: Automatically detects and lists videos from the `/public/files` folder.
- **Responsive UI**: Styled using SASS for a clean and modern look.
- **HTMX-Powered Interactions**: Ensures smooth updates without page reloads.

## Project Structure

```
├── public/
│   ├── css/
│   │   ├── main.css           # Compiled CSS from main.scss
│   │   ├── colors.css         # Compiled CSS from colors.scss
│   │   ├── spinner.css        # Compiled CSS from spinner.scss
│   │   ├── video-list.css     # Compiled CSS from video-list.scss
│   │   └── video-player.css   # Compiled CSS from video-player.scss
│   ├── files/
│   │   ├── miami.mp4
│   │   ├── canada.mp4
│   │   ├── city-skyline.mp4
│   │   ├── fjord.mp4
│   │   ├── racecar.mp4
│   │   ├── reindeer.mp4
│   │   ├── russia.mp4
│   │   └── sky.mp4
│   ├── favicon.ico            # Favicon for the app
│   └── js/
│       ├── player-elements.js # Custom video player functionality
│       ├── playlist-elements.js # Manages playlist features
│       └── utils.js           # Utilities (e.g., file size formatting)
├── sass/
│   ├── colors.scss            # Color variables
│   ├── spinner.scss           # Spinner animation styles
│   ├── video-list.scss        # Styles for video list
│   └── video-player.scss      # Styles for video player
├── views/
│   ├── content.html           # Main content layout
│   └── partials/
│       ├── footer.html        # Footer template
│       ├── header.html        # Header template
│       ├── player.html        # Video player template
│       ├── playlist.html      # Playlist UI
│       └── spinner.html       # Spinner animation UI
├── index.js                   # Express server setup
├── project-gif-screenshot.gif # Animated project preview
└── README.md                  # Project documentation
```

## Requirements

- Node.js (v22 recommended)
- npm (Node Package Manager)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/TheAttentionSeeker5050/nodejs-htmx-web-worker-example
   cd nodejs-htmx-web-worker-example
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Compile SASS files to CSS:

   ```bash
   npm run sass
   ```

4. Start the server:

   ```bash
   npm start
   ```

5. Open your browser and go to `http://localhost:3000`.

## How It Works

### File Download
1. **Interactive UI**: A list of videos is displayed with download buttons, a hidden progress wheel, and text for progress updates.
2. **Download Workflow**:
   - Clicking a download button triggers a Web Worker to fetch the file in chunks.
   - Progress, total file size, and downloaded size are tracked and sent to the main thread.
3. **Visual Updates**:
   - Progress is updated on the wheel and displayed as text every 500ms.
4. **Completion**:
   - When the download completes, the progress wheel fills up entirely, and the file is saved locally.

### Video Player
1. **Flexible Playback**: Custom buttons control playback seamlessly.
2. **Dynamic Playlist**:
   - Automatically scans `/public/files` to populate the playlist.
   - Users can add or remove videos directly from the UI.
3. **Quick Actions**:
   - An instant play button bypasses the playlist order to play a video immediately.
   - Spinner feedback is shown for buffering or loading delays.

## Live Demo

[Check out the Live Demo](https://nodejs-htmx-web-worker-example.onrender.com)

## Scripts

- `npm start`: Starts the Express server.
- `npm run sass`: Compiles SASS files into CSS.

## Technologies Used

- **Node.js**: Backend functionality.
- **Express**: Web server framework.
- **HTMX**: For dynamic, lightweight UI interactions.
- **Web Workers**: Efficient background file processing.
- **SASS**: For responsive and modern styling.
- **EJS**: Templating engine for reusable UI components.

## Screenshot

![App Preview](project-gif-screenshot-3.gif)