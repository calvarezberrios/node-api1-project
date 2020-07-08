const express = require("express");
const shortid = require("shortid");
const cors = require("cors");

const port = 5000;
const server = express();

server.use(express.json());
server.use(cors());

let users = [
    {
        id: "PBa4Er2", // hint: use the shortid npm package to generate it
        name: "Jane Doe", // String, required
        bio: "Not Tarzan's Wife, another Jane",  // String, required
    }
];

server.get("/", (req, res) => {
    res.status(200).send("Welcome to my very first API!");
});

// USERS CRUD

// CREATE
server.post("/api/users", (req, res) => {
    const newUser = req.body;

    if(!(newUser.name || newUser.bio)) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    }

    try {
        const itExists = users.find(user => user.name === req.body.name);

        if(!itExists) {
            newUser.id = shortid.generate();
            users.push(newUser);
            res.status(201).json(newUser);
        } else {
            res.status(400).json({ errorMessage: "A user with that name already exists!" });
        }
        
    }
    catch {
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database" });
    }
});



// READ
server.get("/api/users", (req, res) => {
    try {
        res.status(200).json(users);
    }
    catch {
        res.status(500).json({ errorMessage: "The users information could not be retrieved." });
    }
});

server.get("/api/users/:id", (req, res) => {
    const id = req.params.id;

    try {
        const found = users.find(user => user.id === id);

        if(found) {
            res.status(200).json(found);
        } else {
            res.status(404).json({ errorMessage: "The user with the specified ID does not exist." })
        }
    }   
    catch {
        res.status(500).json({ errorMessage: "The user information could not be retrieved." });
    }

});



// UPDATE
server.put("/api/users/:id", (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    changes.id = id;

    if(!(changes.name || changes.bio)) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    }

    try {        
        const index = users.findIndex(user => user.id === id);

        if(index !== -1) {            
            users[index] = changes;
            res.status(200).json(changes);
        } else {
            res.status(404).json({ errorMessage: "The user with the specified ID does not exist." })
        }
    }   
    catch {
        res.status(500).json({ errorMessage: "The user information could not be modified." });
    }
});



// DELETE/DESTROY
server.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;
    const found = users.find(user => user.id === id);

    try {
        if(found) {
            users = users.filter(user => user !== found);
            res.status(200).json(found);
        } else {
            res.status(404).json({ errorMessage: "The user with the specified ID does not exist." })
        }
    }   
    catch {
        res.status(500).json({ errorMessage: "The user could not be removed" });
    }
});


server.listen(port, () => console.log(`Server listening on port: ${port}`));
