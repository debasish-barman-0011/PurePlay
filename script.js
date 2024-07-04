const searchBtn = document.getElementById("search-btn");
const addPlaylistBtn = document.getElementById("add-playlist-btn");
const videoUrlInput = document.getElementById("video-url");
const videoPlayer = document.getElementById("video-player");
const playlist = document.getElementById("playlist");

// Global variables //
let currentVideoId = "";
const playlistLimit = 10;

// Search and play videos //
searchBtn.addEventListener("click", async () => {
  const videoUrl = videoUrlInput.value;
  const videoId = extractVideoId(videoUrl);
  if (videoId) {
    currentVideoId = videoId;
    await embedVideo(videoId);
  } else {
    alert("YouTube Video URL Doesn't Exist..!");
  }
});

// Add video to playlist //
addPlaylistBtn.addEventListener("click", async () => {
  if (currentVideoId) {
    await addToPlaylist(currentVideoId);
  } else {
    alert("Please search for a video first.");
  }
});

// ==Extract video ID from YouTube URL== //
function extractVideoId(url) {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Embeded video in player //
async function embedVideo(videoId) {
  try {
    const videoTitle = await getVideoTitle(videoId);
    videoPlayer.innerHTML = `
            <iframe width="100%" height="80%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
            <p>${videoTitle}</p>
        `;
  } catch (error) {
    console.error("Error embedding video:", error);
    alert("Error loading video. Please try again.");
  }
}

// I Added video to the playlist //
async function addToPlaylist(videoId) {
  if (playlist.children.length >= playlistLimit) {
    showModal(
      "Playlist is full. Please refresh the page to start a new playlist."
    );
    return;
  }

  try {
    const videoTitle = await getVideoTitle(videoId);
    const listItem = document.createElement("li");
    listItem.innerHTML = `
            <a href="#" data-video-id="${videoId}">
                <i class="fa-solid fa-angles-right"></i> ${videoTitle}
            </a>
            <button class="delete-btn" title="Remove from playlist">
                <i class="fa-solid fa-trash"></i> Remove
            </button>
        `;

    listItem.querySelector("a").addEventListener("click", (e) => {
      e.preventDefault();
      currentVideoId = videoId;
      embedVideo(videoId);
    });

    listItem.querySelector(".delete-btn").addEventListener("click", () => {
      playlist.removeChild(listItem);
    });

    playlist.insertBefore(listItem, playlist.firstChild); // Added video to the top of the playlist //
  } catch (error) {
    console.error("Error adding video to playlist:", error);
    alert("Error adding video to playlist. Please try again.");
  }
}

// ===Get YouTube video title from YouTube API=== //
async function getVideoTitle(videoId) {
  const apiKey = 'AIzaSyACmkBsmxnUdMfrKAsGnSIDOG7kfyZLVjo';
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
  );
  const data = await response.json();
  if (data.items && data.items.length > 0) {
    return data.items[0].snippet.title;
  } else {
    throw new Error("Video title not found");
  }
}

// Show modal (placeholder function) //
function showModal(message) {
  alert(message);
}

// ===========Dummy Video Optional=========== //

function loadDummyContent() {
  // Dummy video ID (this is a Dummy placeholder video) //
  const dummyVideoId = "WWr9086eWtY";

  // I Added dummy video to player. //
  videoPlayer.innerHTML = `
        <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${dummyVideoId}" frameborder="0" allowfullscreen></iframe>
        <p>Sample Video Title</p>
    `;

  // I Added dummy video to playlist. //
  const listItem = document.createElement("li");
  listItem.innerHTML = `
        <a href="#" data-video-id="${dummyVideoId}">
            <i class="fas fa-video"></i> Ordinary Person Lyric | Thalapathy Vijay, Anirudh Ravichander, Lokesh Kanagaraj, NikhitaGandhi
        </a>
        <button class="delete-btn" title="Remove from playlist">
            <i class="fas fa-trash"></i> Remove
        </button>
    `;

  listItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    embedVideo(dummyVideoId);
  });

  listItem.querySelector(".delete-btn").addEventListener("click", () => {
    playlist.removeChild(listItem);
  });

  playlist.appendChild(listItem);
}

searchBtn.addEventListener("click", async () => {
  const videoUrl = videoUrlInput.value;
  const videoId = extractVideoId(videoUrl);
  if (videoId) {
    currentVideoId = videoId;
    // ==Clear the playlist before adding the new video== //
    playlist.innerHTML = "";
    await embedVideo(videoId);
  } else {
    alert("Invalid YouTube Video URL");
  }
});

loadDummyContent();
