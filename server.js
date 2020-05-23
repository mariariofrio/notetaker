var express = require("express");
var path = require("path");
var fs = require('fs')
var app = express();
var PORT = process.env.PORT || 3000;
var db = require("./db.json")

app.use(express.urlencoded({extended:true})) 
app.use(express.json())
app.use(express.static("public"))


app.use((req,res,next)=>{// custom middleware logger
    console.log(req.url,req.method, res.statusCode)
    next()
})

app.get("/api/notes", (req,res)=>{

    console.log(db[0])
    res.json(db)
      
})

app.post("/api/notes", (req,res)=>{
    const newNote= req.body
    //save the note into the db.json
    db.push(newNote)
    console.log(db)

    //write the db as a file for data persistence
    fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(db), function(err) {

        if (err) {
          return console.log(err);
        }
      
        console.log("Success!");
      
      });
      
    res.json({ok:true})
})

app.delete("/api/notes/:id", (req,res)=>{
    let indexToDelete = req.params.id
    db.splice(indexToDelete,1)
    fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(db), function(err) {

        if (err) {
          return console.log(err);
        }
      
        console.log("Success!");
      
      });
    res.json({ok:true})
})

// to pass the files 
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
   
  });




app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
  }); 
  app.listen(PORT, ()=>console.log(`App is listening on port ${PORT}`))