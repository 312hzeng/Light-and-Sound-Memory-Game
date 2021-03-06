
// Print a message in the browser's dev tools console each time the page loads
// Use your menus or right-click / control-click and choose "Inspect" > "Console"
console.log("Hello 🌎");

//global constant
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//global var
var clueHoldTime = 1000; //how long to hold each clue's light/sound
var pattern = [2, 2, 6, 5, 4, 6, 2, 4];
var progress = 0; 
var gamePlaying = false;
var guessCounter = 0;
var mistakeCounter = 2;

var tonePlaying = false;
var volume = 0.5;  

//start and end game func
function startGame(){
    //sound effect when start game
    document.getElementById("myAudio").play();
  
    //initialize game variables  
    progress = 0;
    gamePlaying = true;
    mistakeCounter = 2;
    clueHoldTime = 1000;
    for(let i = 0; i < pattern.length; i++){
        pattern[i] = (Math.floor(Math.random() * 10)) % 6 + 1;
    }
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
  
    playClueSequence();
}
function stopGame(){
    //initialize game variables
    gamePlaying = false;
    document.getElementById("stopBtn").classList.add("hidden");
    document.getElementById("startBtn").classList.remove("hidden");
    for(let i = 1; i <= 6; i++){
        document.getElementById(i.toString()).classList.add("hidden");
    }
}

// Sound Synthesis Functions
const freqMap = {
    1: 261.6,
    2: 290.6,
    3: 329.6,
    4: 350.2,
    5: 390.2,
    6: 430
}

function playTone(btn,len){ 
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
    setTimeout(function(){
        stopTone()
    },len)
}

function startTone(btn){
    if(!tonePlaying){
        context.resume()
        o.frequency.value = freqMap[btn]
        g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
        context.resume()
        tonePlaying = true
    }
}

function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function playSingleClue(btn){
    if(gamePlaying){
        lightButton(btn);
        playTone(btn,clueHoldTime);
        setTimeout(clearButton,clueHoldTime,btn);
        
    }
}

function playClueSequence(){
    guessCounter = 0;
    let delay = nextClueWaitTime; //set delay to initial wait time
    for(let i = 0;i <= progress;i++){ // for each clue that is revealed so far
        console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
        setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
        delay += clueHoldTime 
        delay += cluePauseTime;
        clueHoldTime -= 20;
    }
}

function lightButton(btn){ 
    document.getElementById("button"+btn).classList.add("lit")
}

function clearButton(btn){       
    document.getElementById("button"+btn).classList.remove("lit")

}

//user response
function loseGame(){
    stopGame();
    alert("Game Over. You lost.");
}

function winGame(){
    stopGame();
    alert("Game Over. You won!");
}

function guess(btn){
    console.log("user guessed: " + btn);
  
    document.getElementById(btn.toString()).classList.remove("hidden");
  
    if(!gamePlaying){return;}
  
    //wrong guess: 
    //run out of mistake chance
    else if(pattern[guessCounter] != btn && mistakeCounter == 0){loseGame();}
    else if(pattern[guessCounter] != btn){mistakeCounter--;}
  
    //correct guess
    else if(pattern[guessCounter] == btn){
        //run out of guess choice
        if(guessCounter == progress){
        //reach the end of the game and win
            if(progress >= pattern.length - 1){winGame();}
            //continue
            else{
                progress++;
                playClueSequence();
            }  
        }
        //have not ran out of guess
        else{
            guessCounter++;
        }
    }

  
}    