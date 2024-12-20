// import function  change playlist video
import { changeVideo } from "./player-elements.js";

// get elements by id
const playlist = document.getElementById("playlist");
const playlistTitle = document.getElementById("playlist-title");

// --------------------------------------------
// add event listeners to the playlist elements
// --------------------------------------------


// ----------------------------------------------------------
// add generic functions to serve as event listener callbacks
// ----------------------------------------------------------

// function that accepts a video name with extension and play the video
function playPlaylistVideo(event, videoName) {
    console.log("Playing video: ", videoName);
}

// function that accepts a video name with extension and deletes the video from the playlist
function deletePlaylistVideo(event, videoName) {
    // filter playlist item li elements to find the one with the video name, the li item has buttons with data-video attribute set to videoName
    const playlistItem = playlist.querySelector(`li[data-video="${videoName}"]`);
    
    // if the playlist item exists, remove it
    if (playlistItem) {
        playlistItem.remove();
    }

    // if there are no playlist items left, hide the playlist title
    if (playlist.children.length === 0) {
        playlist.classList.add("hidden");
        playlistTitle.classList.add("hidden");
    }
}

// add to playlist function
function addVideoToPlaylist(videoName, position=-1) {
    
    // if it is already in the playlist, do not add it again
    if (playlist.querySelector(`[data-video="${videoName}"]`)) {
        console.log("Video already in playlist");
        return;
    }

    // create list item and its contents
    const li = document.createElement("li");
    li.classList.add("list-item");
    li.setAttribute("data-video", videoName);
    li.setAttribute("data-active", "false");

    const dragBtn = document.createElement("button");
    dragBtn.classList.add("list-item-btn");
    dragBtn.classList.add("button-transparent");
    dragBtn.classList.add("text-clickable-green");
    dragBtn.setAttribute("data-video", videoName);
    dragBtn.setAttribute("data-action", "drag");
    dragBtn.addEventListener("drag", dragPlaylistVideo);
    dragBtn.addEventListener("drop", dropPlaylistVideo);
    li.appendChild(dragBtn);
    
    const dragIcon = document.createElement("span");
    dragIcon.classList.add("material-symbols-outlined");
    dragIcon.textContent = "drag_handle";
    dragBtn.appendChild(dragIcon);

    const listItemtemTitle = document.createElement("span");
    listItemtemTitle.classList.add("list-item-title");
    listItemtemTitle.textContent = videoName;
    // add on click event listener and change the player src url using imported function
    listItemtemTitle.addEventListener("click", (event) => changeVideo(videoName));
    li.appendChild(listItemtemTitle);
    
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("list-item-btn");
    deleteBtn.classList.add("button-transparent");
    deleteBtn.classList.add("text-clickable-green");
    deleteBtn.setAttribute("data-video", videoName);
    deleteBtn.setAttribute("data-action", "drop-from-playlist");
    deleteBtn.addEventListener("click", (event) => deletePlaylistVideo(event, videoName));
    li.appendChild(deleteBtn);
    
    const deleteIcon = document.createElement("span");
    deleteIcon.classList.add("material-symbols-outlined");
    deleteIcon.textContent = "delete";
    deleteBtn.appendChild(deleteIcon);

    // add the list item to the playlist, if position is -1, add to the end of the playlist
    if (position === -1) {
        playlist.appendChild(li);
    } else {
        playlist.insertBefore(li, playlist.childNodes[position]);
    }

    // remove the hidden class from the playlist
    playlist.classList.remove("hidden");
    playlistTitle.classList.remove("hidden");
}

// function to drag and drop the playlist items
// drag event callback
function dragPlaylistVideo(event) {
    console.log("Dragging and dropping");
}

// drop event callback
function dropPlaylistVideo(event) {
    console.log("Dropping");
}

// export the elements
export { 
    playlist,
    addVideoToPlaylist,
};