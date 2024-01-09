/*
TUTORIAL 03 DEMO CODE:

Here we are prepared to receive a POST message from the client,
and acknowledge that, with a very limited response back to the client

Use browser to view pages at http://localhost:3000/example1.html

When the blue cube is moved with the arrow keys, a POST message will be
sent to the server when the arrow key is released. The POST message will
contain a data string which is the location of the blue cube when the
arrow key was released. The server sends back a JSON string which the client should use
to put down a "waypoint" for where the arrow key was released

Also if the client types in the app text field and presses the "Submit Request" button
a JSON object containing the text field text will be send to this
server in a POST message.

Notice in this code we attach an event listener to the request object
to receive data that might come in in chunks. When the request end event
is posted we look and see if it is a POST message and if so extract the
data and process it.

*/

//Cntl+C to stop server (in command line terminal)


//Server Code --USING ONLY NODE.JS BUILT IN MODULES
const http = require('http') //need to http
const fs = require('fs') //need to read static files
const url = require('url') //to parse url strings

const ROOT_DIR = 'html' //dir to serve static files from

const MIME_TYPES = {
  'css': 'text/css',
  'gif': 'image/gif',
  'htm': 'text/html',
  'html': 'text/html',
  'ico': 'image/x-icon',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'js': 'application/javascript',
  'json': 'application/json',
  'png': 'image/png',
  'svg': 'image/svg+xml',
  'txt': 'text/plain'
}

function get_mime(filename) {
  for (let ext in MIME_TYPES) {
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
      return MIME_TYPES[ext]
    }
  }
  return MIME_TYPES['txt']
}

http.createServer(function(request, response) {
  let urlObj = url.parse(request.url, true, false)
  console.log('\n============================')
  console.log("PATHNAME: " + urlObj.pathname)
  console.log("REQUEST: " + ROOT_DIR + urlObj.pathname)
  console.log("METHOD: " + request.method)

  let receivedData = ''

  //attached event handlers to collect the message data
  request.on('data', function(chunk) {
    receivedData += chunk
  })

  let dataObj = undefined //object representing the client data
  let returnObj = {} //object to be returned to client


  //event handler for the end of the message
  request.on('end', function() {
    console.log('received data: ', receivedData)
    console.log('type: ', typeof receivedData)

    //Get data from any POST request
    if (request.method == "POST") {
      //Do this for all POST messages
      dataObj = JSON.parse(receivedData)
      console.log("received data object: ", dataObj)
      console.log("type: ", typeof dataObj)
      console.log("USER REQUEST: " + dataObj.text)
      returnObj.text = "NOT FOUND: " + dataObj.text
    }


    //sending and receiveing data through solve button
    if (request.method === "POST" && urlObj.pathname === "/solveText") {
      let puzzleFile = `puzzles/${dataObj.text.trim()}.txt`
      console.log(`Looking for puzzle file: ${puzzleFile}`)
      fs.exists(puzzleFile, (exists) => {
        if (exists) {
          console.log(puzzleFile + '<--EXISTS')
          //Found the puzzle file
          fs.readFile(puzzleFile, function(err, data) {
            //Read puzzle data file and send lines to client
            if (err) {
              returnObj.text = "FILE READ ERROR"
              response.writeHead(200, {
                "Content-Type": MIME_TYPES["json"]
              })
              response.end(JSON.stringify(returnObj))
            } else {
              let fileLines = data.toString().split("\n")
              let fileWords = [];
              
              let count =0;
              //get rid of any return characters
              for (i in fileLines){

              
                fileLines[i] = fileLines[i].replace(/(\r\n|\n|\r)/gm, "")
                fileTempWords = fileLines[i].split(" ")
                for(j in fileTempWords){
                  fileWords[count] = fileTempWords[j] 
              
                  count++;
                   

                }
              }
              if(fileWords[fileWords.length] == ''){
                fileWords.splice(-1)
              }
              

              let booleanCorrect = true;
              for(let i =0; i<fileWords.length-1; i++){
                if(fileWords[i] != dataObj.wordinfo[i].word){
                  booleanCorrect = false;
                  break;
                }
              }
              
              
              //randomize words so the client does not know the solution
              for(let i =0; i<fileWords.length; i++){
                let x = Math.floor((Math.random()*(fileWords.length-1)));
                temp = fileWords[i];
                fileWords[i] = fileWords[x];
                fileWords[x] = temp;
              }
              
             
             
              
              
              returnObj.correct = booleanCorrect
              response.writeHead(200, {
                "Content-Type": MIME_TYPES["json"]
              })
              response.end(JSON.stringify(returnObj))
            }
          })
        } else {
          console.log(puzzleFile + '<--DOES NOT EXIST')
          response.writeHead(200, {
            "Content-Type": MIME_TYPES["json"]
          })
          response.end(JSON.stringify(returnObj)) //send just the JSON object
        }
      })

    }

      
             

              

    if (request.method === "POST" && urlObj.pathname === "/userText") {
      //a POST request to fetch a puzzle
      //look for puzzle file in puzzles directory based on puzzle title
      let puzzleFile = `puzzles/${dataObj.text.trim()}.txt`
      console.log(`Looking for puzzle file: ${puzzleFile}`)
      fs.exists(puzzleFile, (exists) => {
        if (exists) {
          console.log(puzzleFile + '<--EXISTS')
          //Found the puzzle file
          fs.readFile(puzzleFile, function(err, data) {
            //Read puzzle data file and send lines to client
            if (err) {
              returnObj.text = "FILE READ ERROR"
              response.writeHead(200, {
                "Content-Type": MIME_TYPES["json"]
              })
              response.end(JSON.stringify(returnObj))
            } else {
              let fileLines = data.toString().split("\n")
              let fileWords = [];
              
              let count =0;
              //get rid of any return characters
              for (i in fileLines){

              
                fileLines[i] = fileLines[i].replace(/(\r\n|\n|\r)/gm, "")
                fileTempWords = fileLines[i].split(" ")
                for(j in fileTempWords){
                  fileWords[count] = fileTempWords[j] 
              
                  count++;
                   

                }
              }
              
              if(fileWords[fileWords.length-1] == ''){
                fileWords.splice(-1)
              }
              //randomize words so the client does not know the solution
              for(let i =0; i<fileWords.length; i++){
                let x = Math.floor((Math.random()*(fileWords.length-1)));
                temp = fileWords[i];
                fileWords[i] = fileWords[x];
                fileWords[x] = temp;
              }
             
             
              returnObj.text = puzzleFile
              returnObj.puzzleLines = fileWords
              returnObj.filePath = puzzleFile
              response.writeHead(200, {
                "Content-Type": MIME_TYPES["json"]
              })
              response.end(JSON.stringify(returnObj))
            }
          })
        } else {
          console.log(puzzleFile + '<--DOES NOT EXIST')
          response.writeHead(200, {
            "Content-Type": MIME_TYPES["json"]
          })
          response.end(JSON.stringify(returnObj)) //send just the JSON object
        }
      })
    }

    if (request.method === "GET") {
      //handle GET requests as static file requests
      let filePath = ROOT_DIR + urlObj.pathname
      if (urlObj.pathname === '/') filePath = ROOT_DIR + '/index.html'

      fs.readFile(filePath, function(err, data) {
        if (err) {
          //report error to console
          console.log('ERROR: ' + JSON.stringify(err))
          //respond with not found 404 to client
          response.writeHead(404)
          response.end(JSON.stringify(err))
          return
        }
        response.writeHead(200, {
          'Content-Type': get_mime(filePath)
        })
        response.end(data)
      })
    }
  })
}).listen(3000)

console.log('Server Running at http://127.0.0.1:3000  CNTL-C to quit')
console.log('To Test')
console.log('http://localhost:3000/index.html')
