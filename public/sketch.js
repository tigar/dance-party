
let song, artist;

async function get_track() {
  try {
    console.log("here");
    const response = await fetch(`/api`);
    const json = await response.json();
    console.log(json);
    song = json;
    document.getElementById('song').textContent = songs.summary;
  } catch (error) {
    console.error(error);
  }

}

window.onload = function() {
  get_track();
};
