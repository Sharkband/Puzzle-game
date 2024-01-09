//KEY CODES
//should clean up these hard-coded key codes
const ENTER = 13
const RIGHT_ARROW = 39
const LEFT_ARROW = 37
const UP_ARROW = 38
const DOWN_ARROW = 40


function handleKeyDown(e) {

  //console.log("keydown code = " + e.which)

  let dXY = 5; //amount to move in both X and Y direction
  if (e.which == UP_ARROW && movingBox.y >= dXY)
    movingBox.y -= dXY //up arrow
  if (e.which == RIGHT_ARROW && movingBox.x + movingBox.width + dXY <= canvas.width)
    movingBox.x += dXY //right arrow
  if (e.which == LEFT_ARROW && movingBox.x >= dXY)
    movingBox.x -= dXY //left arrow
  if (e.which == DOWN_ARROW && movingBox.y + movingBox.height + dXY <= canvas.height)
    movingBox.y += dXY //down arrow

  let keyCode = e.which
  if (keyCode == UP_ARROW | keyCode == DOWN_ARROW) {
    //prevent browser from using these with text input drop downs
    e.stopPropagation()
    e.preventDefault()
  }

}

function handleKeyUp(e) {
  //  console.log("key UP: " + e.which)
  if (e.which == RIGHT_ARROW | e.which == LEFT_ARROW | e.which == UP_ARROW | e.which == DOWN_ARROW) {
    let dataObj = {
      x: movingBox.x,
      y: movingBox.y
    }
    //create a JSON string representation of the data object
    let jsonString = JSON.stringify(dataObj)
    //DO NOTHING WITH THIS DATA FOR NOW

  }

  if (e.which == ENTER) {
    handleGetPuzzle() //treat ENTER key like you would a submit
    document.getElementById('userTextField').value = ''

  }

  e.stopPropagation()
  e.preventDefault()

}

let userText="";



//handling get puzzle by putting the words randomly on the canvas
//puting the name in the html aswell 
function handleGetPuzzle() {

  userText = document.getElementById('userTextField').value

  if (userText && userText != '') {
    let textDiv = document.getElementById("text-area")
    textDiv.innerHTML = '';
    textDiv.innerHTML = textDiv.innerHTML + `<p> ${userText}</p>`
  
    let userRequestObj = {
      text: userText
    }
    let userRequestJSON = JSON.stringify(userRequestObj)
    document.getElementById('userTextField').value = ''
    //alert ("You typed: " + userText);

    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        //console.log("data: " + this.responseText)
        //console.log("typeof: " + typeof this.responseText)
        //we are expecting the response text to be a JSON string
        let responseObj = JSON.parse(this.responseText)

        console.dir(responseObj) //pretty print response data to console.
       
        
        if (responseObj.puzzleLines) {
          words = [] //clear words on canvas
          
            
            for (w of responseObj.puzzleLines) {
              let word = {
                word: w
              }
              assignRandomIntCoords(word, canvas.width, canvas.height)
              words.push(word)
              
            }
           
          
         
        }
        //redraw canvas
        drawCanvas()
      }

    }
    xhttp.open("POST", "userText") //API .open(METHOD, URL)
    xhttp.send(userRequestJSON) //API .send(BODY)
  }
}

//handle the solve button that orders the words based on the canvas 
//then sends JSON strings to server to check if its correct
function handleSolvePuzzle() {

  let spanClass ='';
  //order the words based on canvas
  orderWords();
  
  if (userText && userText != '') {
  
    let userRequestObj = {
      text: userText,
      wordinfo: words
    }
    let userRequestJSON = JSON.stringify(userRequestObj)
  let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        //console.log("data: " + this.responseText)
        //console.log("typeof: " + typeof this.responseText)
        //we are expecting the response text to be a JSON string
        let responseObj = JSON.parse(this.responseText)

        console.dir(responseObj) //pretty print response data to console.
        
        //using the response from server to check if the puzzle is correct
        //and wrapping it in a spanclass for true and false
        if(responseObj.correct == true){
          spanClass = 'correct';
        }else{
          spanClass = 'wrong';
        }
        
 
  let line = "";
  let textDiv = document.getElementById("text-area")
  textDiv.innerHTML = '';
        
  //putting in the lines of the puzzle
  for(let i =1; i<words.length; i++){
    if(words[i].y == words[i-1].y){
      line = line+" "+`<span class=${spanClass}>${words[i-1].word}</span>`;
    }else{
      line = line+" "+`<span class=${spanClass}>${words[i-1].word}</span>`;
      textDiv.innerHTML = textDiv.innerHTML +`<p>${line} </p>`
      line ="";
    }
      
  }

  //printing puzzle to the html
  line = line+" "+`<span class=${spanClass}>${words[words.length-1].word}</span>`;
  textDiv.innerHTML = textDiv.innerHTML +`<p>${line} </p>`

        
        
        }
    }
    xhttp.open("POST", "solveText") //API .open(METHOD, URL)
    xhttp.send(userRequestJSON) //API .send(BODY)
  
  

  
  
  

  
  
  
  

  
   
  
}
}
//=====================================================
