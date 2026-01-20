let tile_ids = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

function pick_random() {
  if (tile_ids.length === 0) {
    tile_ids = []; // make list empty so we dont add to any tiles that are currently black

    for (let i = 0; i < 16; i++) {
      // here were just running a for loop to append all the white tiles to a list, that way after they can randomly be selected from to become black
      if (document.getElementById(i).style.backgroundColor != "black") {
        // this is needed because otherwise we may try and force a tile thats already black to be black and get rid of a game object
        tile_ids.push(i);
      }
    }
  }

  tile_random = Math.floor(Math.random() * tile_ids.length);
  random = tile_ids[tile_random];
  tile_ids.splice(tile_random, 1);

  return random;
}

// This creates our clickable tiles and sets 3 of them randomly to black
const board = document.getElementById("board");
function make_tiles() {
  for (let i = 0; i < 16; i++) {
    const tiles = document.createElement("div");
    tiles.id = i;
    tiles.className = "tiles";
    tiles.classList.add("tile");

    // this stops highlighting on holding down mouse 1                  //
    tiles.style.userSelect = "none"; //
    tiles.style.webkitUserSelect = "none"; //
    tiles.style.mozUserSelect = "none"; //
    //      Credit to gpt for this section, i knew dragging was causing issues with responsiveness
    // stops ghost dragging behavior                                    //          but for the life of me i couldnt find out how to easily disable it using js
    tiles.draggable = false; //
    tiles.addEventListener("dragstart", (e) => e.preventDefault()); //
    //
    // stop click dragging behavior                                     //
    tiles.addEventListener("mousedown", (e) => e.preventDefault()); //

    board.appendChild(tiles);
  }

  // pick 3 random grids and make them black
  for (let i = 0; i < 3; i++) {
    pick_random();

    document.getElementById(random).style.backgroundColor = "black";
    console.log(`black tile created at square: ${random}`);
  }
}

let intervalId; // stores an intervalId that we can return from setInterval to stop the 1 second looped timer code
let time = 0; // global variable for our timer because i couldnt figure out how else to do it without breaking things
function timer() {
  time -= 1;
  document.getElementById("timer_text").innerHTML = `Timer: ${time}`;

  if (time == -1) {
    console.log("times up");
    clearInterval(intervalId);
    intervalId = null;
  }

  if (time <= -999) {
    clearInterval(intervalId);
    intervalId = null;
    console.log("timer stopped");
    return;
  }
}

document.getElementById("start_game").addEventListener("click", start_game);
function start_game() {
  console.log("game started");

  // start of game timer and score setup
  time = 45;
  score = 0;
  misses = 0;

  // count down for game timer
  intervalId ??= setInterval(timer, 1000);

  // grab all elements with the class of .tiles and give them an evenlistener for click
  const tile_click = document.querySelectorAll(".tiles");

  tile_click.forEach((element) => {
    element.addEventListener("click", tile_clicked);
  });

  // when the timer hits 0 we need to send data to our backend for leaderboard
}

score = 0;
misses = 0;
function tile_clicked(e) {
  const id = e.target.id; // storing id of clicked element
  const tile = document.getElementById(id); // storing element associated with the clicked id

  // if the tile we clicked isint black do x
  // we need to limit our user to 3 misses
  // if we click a black tile then we need to create a new black tile, but we also need to add to our score, our score should be multiplicative and reset on misses
  if (time >= 0) {
    if (tile.style.backgroundColor != "black") {
      console.log("clicked white tile");
      misses += 1;
      document.getElementById("misses_text").innerHTML = `Misses: ${misses}/3`;

      if (misses == 3) {
        time = -999;
        score = 0;
        console.log("game over");
      }
    } else {
      // what happens when we click a black target
      // all stuff for scoring and displaying it
      score += 1;
      document.getElementById("score_text").innerHTML = `Score: ${score}`;
      console.log(`current score: ${score}`);

      // for turning tile black on click
      pick_random();
      document.getElementById(random).style.backgroundColor = "black";
    }

    // on click turn box white
    document.getElementById(id).style.backgroundColor = "white";

    // if tile clicked background-color = white or black then do x
  }
}
