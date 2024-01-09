/*
Javascript example using an html <canvas> as the main
app client area.
The application illustrates:
-handling mouse dragging and release
to drag a strings around on the html canvas
-Keyboard arrow keys are used to move a moving box around

Here we are doing all the work with javascript.
(none of the words are HTML, or DOM, elements.
The only DOM element is just the canvas on which
where are drawing and a text field and button where the
user can type data

Mouse event handlers are being added and removed.

Keyboard keyDown handler is being used to move a "moving box" around
Keyboard keyUP handler is used to trigger communication with the
server via POST message sending JSON data

*/

//DATA MODELS
//Use javascript array of objects to represent words and their locations
let words = []
words.push({word: "I", x: 50, y: 50})
words.push({word: "like", x: 70, y: 50})
words.push({word: "javascript", x: 120, y: 50})

//represents the word moving around the canvas being
//animated using timer events


let timer //used for the motion animation

const canvas = document.getElementById('canvas1') //our drawing canvas

//setting random puzzle words
function assignRandomIntCoords(object, maxX, maxY) {
  //object expected to have .x and .y co-ordinates

  const MARGIN = 50 //keep way from edge of canvas by MARGIN
  object.x = MARGIN + Math.floor(Math.random() * (maxX - 2*MARGIN))
  object.y = MARGIN + Math.floor(Math.random() * (maxY - MARGIN))
}


function randomizeWordArrayLocations(wordsArray) {
  for(word of wordsArray){
    assignRandomIntCoords(word, canvas.width, canvas.height)
  }
}

randomizeWordArrayLocations(words)


function getWordAtLocation(aCanvasX, aCanvasY) {

  //locate the word near aCanvasX,aCanvasY
  //Just use crude region for now.
  //should be improved to using length of word etc.

  //note you will have to click near the start of the word
  //as it is implemented now

  //========PROBLEM 3 Answer Code
    var context = canvas.getContext('2d')
    context.font = '20pt Arial'
    const TOLERANCE = 20
    for(var i=0; i<words.length; i++){
       var wordWidth = context.measureText(words[i].word).width
     if((aCanvasX > words[i].x && aCanvasX < (words[i].x + wordWidth))  &&
        Math.abs(words[i].y - aCanvasY) < TOLERANCE) return words[i]
    }
    return null
}

//orders the words based canvas location
function orderWords(){
//&& ((words[j].y > (words[i].y-TOLERANCE)) && (words[j].y < (words[i].y+TOLERANCE))
//(words[j].x < words[i].x) && ((words[j].y > (words[i].y-TOLERANCE)) && (words[j].y < (words[i].y+TOLERANCE)))


//my tolerance is 20 so the y value can be up or down by 20
const TOLERANCE = 20;

let lines =[];
let line ="";
let count =0;


  //orders the y values
  for(let i =0; i<words.length; i++){
    for(let j = i+1; j<words.length; j++){

      if((words[j].y < words[i].y)){
        
        temp = words[i];
        words[i] = words[j];
        words[j] = temp;
  
      }
    } 
  }

  
  //orders the x values with y value tolerance
  for(let i =0; i<words.length; i++){
    for(let j = i+1; j<words.length; j++){

      if((words[j].x < words[i].x) && ((words[j].y > (words[i].y-TOLERANCE)) && (words[j].y < (words[i].y+TOLERANCE)))){
        
        temp = words[i];
        words[i] = words[j];
        words[j] = temp;
  
      }
    } 
  }


  //sets all the words on the same line to the SAME y value so that it looks nice (clean up canvas)
  for(let i =1; i<words.length; i++){
    if(words[i-1].word == ''){

    }else{
    if(((words[i-1].y > (words[i].y-TOLERANCE)) && (words[i-1].y < (words[i].y+TOLERANCE)))){
      words[i].y = words[i-1].y;
      line = line +  words[i-1].word+" ";
    
    
    }
  }
    
    
    
  }


  //redraw the canvas
  drawCanvas();





}


//draws the words on the canvas
//styles as well
function drawCanvas() {

  const context = canvas.getContext('2d')

  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas.width, canvas.height) //erase canvas

  context.font = '20pt Arial'
  context.fillStyle = 'cornflowerblue'
  context.strokeStyle = 'blue'

  for (let i = 0; i < words.length; i++) { //note i declared as var

    let data = words[i]
    context.fillText(data.word, data.x, data.y)
    context.strokeText(data.word, data.x, data.y)

  }

  
}
