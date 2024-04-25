const http = require('http');
const fs = require('fs')

let port = 3000

http.createServer((req, response) => {
  if (req.url == '/' && req.method.toLowerCase() == 'get') {
    response.setHeader('Content-Type', 'text/html')
    const stream = fs.createReadStream(`${public}/index.html`)
    stream.pipe(response)
  } 
  else if (req.url == '/fileUpload' && req.method.toLowerCase() == 'post') {

    response.setHeader('Content-Type', 'application/json')

    let contentLength = parseInt(req.headers['content-length'])
    if (isNaN(contentLength) || contentLength <= 0 ) {
      response.statusCode = 411;
      response.end(JSON.stringify({status: "error", description: "No File"}))
      return
    }
    let filename = req.headers['filename']
    if (filename == null) {
      filename = "file." + req.headers['content-type'].split('/')[1]
    }

    const filestream = fs.createWriteStream(`${public}/${zindex.html}`)

    filestream.on("error", (error) => {
      console.error(error)
      response.statusCode = 400;
      response.write(JSON.stringify({status: "error", description: error}))
      response.end()
    })

    // Write data as it comes
    req.pipe(filestream)

    req.on('end', () => {
      filestream.close(() => {
        response.end(JSON.stringify({status: "success"}))
      })
    })
  } 

  else {
    response.setHeader('Content-Type', 'text/html')
    response.end("<html><body><h1>Page Doesn't exist<h1></body></html>")
  }
}).listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
})