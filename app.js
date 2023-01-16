"use strict"
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

// Element variable
const resetBtn = $("#reset-btn")
const board = $(".board")
const boardItems  = [...$$(".board-item")]
const indexTurnDisplay = $("#index-turn")
const banner = $(".banner")
const bannerQuitBtn = $(".banner button:nth-child(1)")
const bannerNextBtn = $(".banner button:nth-child(2)")

// Gameplay variable
const winSamples = [
    [1,2,3], [4,5,6], [7,8,9],
    [1,4,7], [2,5,8], [3,6,9],
    [1,5,9], [3,5,7]
]
let player1Move = []
let player2Move = []
let isPlayer1Turn = true
let step = 0
let result = {
    p1Win: 0,
    p2Win: 0,
    tie: 0
}
const player1Mark = "<i class=\"fa-solid fa-xmark\"></i>"
const player2Mark = "<i class=\"fa-sharp fa-solid fa-o\"></i>"

// Setting variable
const displaySetting = {
    darkMode: {

    },
    lightMode: {

    }
}
function displayMode (containerBg, btnBg) {
    this.containerBg = containerBg
    this.btnBg = btnBg
}
displaySetting.darkMode = new displayMode("#1a2b33", "#1E363E")
displaySetting.lightMode = new displayMode("#fff", "#1E363E")


// ? Control Handler
    // Index Turn Display
changeIndexTurnDisplay()
    // Reset btn
resetBtn.addEventListener("click", resetHandle)
    
// ? Game Handler
    // Add x/o when board-item clicked
boardItems.forEach(boardItem => {
    boardItem.addEventListener("click", (e) => {
        if (!boardItem.innerHTML) {
            addMoveHandler(e.target)
            isPlayer1Turn = !isPlayer1Turn
            step++
            changeIndexTurnDisplay()
            winHandler()
        }
    })  
})
// ? Result Handler
    // Update number of result
updateResult()

//  ? Banner Handle
bannerQuitBtn.addEventListener("click", () => banner.style.display = "none")
bannerNextBtn.addEventListener("click", () => {
    banner.style.display = "none"
    resetHandle()
    updateResult()
})




// ? Function Feature
;(function layoutDesign() {
    // Board width = height
    const boardWidth = board.offsetWidth 
    board.style.height = boardWidth + "px"
})()

function changeIndexTurnDisplay() {
    indexTurnDisplay.classList = isPlayer1Turn ? "control-item p1" : "control-item p2"
    indexTurnDisplay.children[0]. innerHTML = isPlayer1Turn ? player1Mark : player2Mark
}

function resetHandle() {
    boardItems.forEach(boardItem => {
        boardItem.classList = "board-item"
        boardItem.innerHTML = ""
    });
    isPlayer1Turn = true
    changeIndexTurnDisplay()
    step = 0
    player1Move = []
    player2Move = []
    updateResult()
}

function addMoveHandler(item) {
    if (item) {
        if (isPlayer1Turn) {
            item.innerHTML = player1Mark
            item.classList.add("p1")
            player1Move.push(parseInt(item.dataset.id))
        } else {
            item.classList.add("p2")
            item.innerHTML = player2Mark
            player2Move.push(parseInt(item.dataset.id))
        }
    }
}


// Win handler
function winHandler() {
    let winner = winCheck()
    if (winner) {
        highlightWinMove(winner)
        showBanner(winner.winnerPlayer)
    }
    if (step === 9 && !winner) {
        showBanner("tie")
    }
}
function winCheck() {
    for (const sample of winSamples) {
        const p1Check = sample.every(move => player1Move.includes(move));
        const p2Check = sample.every(move => player2Move.includes(move));
        if (p1Check) {
            return {
                winnerPlayer: "p1",
                move: sample
            }
        } else if (p2Check) {
            return {
                winnerPlayer: "p2",
                move: sample
            }
        }       
    }
    return null;
}

function highlightWinMove(winner) {
    const winMove = winner.move
    winMove.forEach(id => {
        const winBoardItem = boardItems.filter(boardItem => {
            return boardItem.dataset.id === `${id}`
        })
        winBoardItem[0].classList.add("win-move")   
    })
}

function showBanner (type) {
    const winPlayer = $(".game-container .banner .content .win-player")
    const winNotice = $(".game-container .banner .content .win-notice")
    banner.style.display = "flex"
    switch (type) {
        case "p1":
            result.p1Win++
            winNotice.classList = "win-notice p1"
            winPlayer.innerHTML = "PLAYER 1 WIN THE ROUND!"
            winNotice.innerHTML = `${player1Mark} <span>TAKE THE ROUND</span>`
            break
        case "p2":
            result.p2Win++
            winNotice.classList = "win-notice p2"
            winPlayer.innerHTML = "PLAYER 2 WIN THE ROUND!"
            winNotice.innerHTML = `${player2Mark} <span>TAKE THE ROUND</span>`
            break
        case "tie":
            result.tie++
            winNotice.classList = "win-notice tie"
            winPlayer.innerHTML = "TIE!"
            winNotice.innerHTML = `${player1Mark} <span>REMATCH</span> ${player2Mark}`
            break
        default:
            break;
    }
}

function updateResult () {
    $("#player1-result .player-count").innerHTML = result.p1Win
    $("#tie-result .player-count").innerHTML = result.tie
    $("#player2-result .player-count").innerHTML = result.p2Win
}