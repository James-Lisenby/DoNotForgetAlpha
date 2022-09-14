const express = require('express');
// Requires 'express'.
const path = require('path');
const fs = require('fs');
// Requires 'fs'.
const PORT = 3001;
// Port being listened to. 
const app = express();
// Initializes the 'app' server.
const {readFromFile, writeToFile, readAndAppend} = require('./helpers/fsUtils.js');


const notes = require('./db/notes.json');
const { randomUUID } = require('crypto');
// Require the 'db.json' file.

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(express.static('db'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get("/api/notes", (req, res) => {
    readFromFile('./db/notes.json').then((notesResponse) => {
        res.json(JSON.parse(notesResponse))
    })
    console.log("Hello")
});

app.post("/api/notes", (req, res) => {

    const { title, text} = req.body;
    if (title && text) {
        const newNote = {
            title,
            text,
            id: randomUUID()
        }
        .then(readAndAppend('./db/notes.json'))
    
        const response = {
            status: 'success',
            body: newNote, 
        };

        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting new note')
    }
});

          // req.body title/text
          // New note = {}
          // title: req.body.title
          // text: req.body.text
          // also create unique id portion--uuid package
          // new note needs to be appended to db.json file
 


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});





app.listen(PORT, () => {
    console.log("Server Ready")
});
// Use the 'app' to 'listen' to a specific 'PORT'