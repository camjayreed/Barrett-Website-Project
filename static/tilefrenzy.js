const tile_ids = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] // using a list that we can select random numbers from, when selecting a number we will remove it
const board = document.getElementById("board");          // whatever number that is selected will be the id of the tile that starts black
function make_tiles() {
    for (let i = 0; i < 16; i++) {
        const tiles = document.createElement("div");
        tiles.id = i
        tiles.className = "tiles";
        board.appendChild(tiles);
    }

    for (let i = 0; i < 3; i++) {
        Math.random() // get a way for math.random to give us a random number from our array
    }
}

let intervalId // stores an intervalId that we can return from setInterval to stop the 1 second looped timer code
let time = 0 // global variable for our timer because i couldnt figure out how else to do it without breaking things
function timer() {
    console.log(time)
    time -= 1

    if (time == -1) {
        console.log("times up")
        clearInterval(intervalId)
        intervalId = null
    }
}

document.getElementById("start_game").addEventListener("click", start_game)
function start_game() {
    console.log("game started")

    // start of game timer and score setup
    time = 45
    score = 0

    // count down for game timer
    intervalId ??= setInterval(timer, 1000)

    // grab all elements with the class of .tiles and give them an evenlistener for click
    const tile_click = document.querySelectorAll(".tiles")

    tile_click.forEach(element => {
        element.addEventListener("click", tile_clicked)
    });    

    // when the timer hits 0 we need to send data to our backend for leaderboard
}

score = 0
function tile_clicked(e) {
    const id = e.target.id
    console.log(id)

    const tile = document.getElementById(id).style.backgroundColor = "white";
    tile.setAttribute


    // if tile clicked background-color = white or black then do x
}



























