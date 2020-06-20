const express = require("express");
const shortid = require("shortid");
const bodyParser = require("body-parser");
const cors = require("cors");

const port = 5000;
const server = express();

server.use(bodyParser.json());
server.use(cors());

const users = [
    {
        id: "PBa4Er2", // hint: use the shortid npm package to generate it
        name: "Jane Doe", // String, required
        bio: "Not Tarzan's Wife, another Jane",  // String, required
    }
];

server.get("/", (req, res) => {
    res.status(200).send("Welcome to my very first API!");
});

server.get("/api/users", (req, res) => {
    try {
        res.status(200).json(users);
    }
    catch {
        res.status(500).json({ errorMessage: "The users information could not be retrieved." });
    }
});

server.get("/api/users/:id", (req, res) => {
    if(!req.params.id) {
        res.status(400).json({ errorMessage: "Missing user id on url." });
    }
    const userId = req.params.id;

    try {
        const found = users.find(user => user.id === userId);

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

server.post("/api/users", (req, res) => {
    if(!(req.body.name || req.body.bio)) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    }

    try {
        const itExists = users.find(user => user.name === req.body.name);

        if(!itExists) {
            const newUser = {
                ...req.body,
                id: shortid.generate()
            }
            users.push(newUser);
            res.status(201).json(users);
        } else {
            res.status(400).json({ errorMessage: "A user with that name already exists!" });
        }
        
    }
    catch {
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database" });
    }
});


server.delete("/api/users/:id", (req, res) => {
    if(!req.params.id) {
        res.status(400).json({ errorMessage: "Missing user id on url." });
    }
    const userId = req.params.id;

    try {
        const found = users.find(user => user.id === userId);

        if(found) {
            const removed = users.splice(users.indexOf(found), 1)[0];
            res.status(200).json({users: users, removed: removed});
        } else {
            res.status(404).json({ errorMessage: "The user with the specified ID does not exist." })
        }

    }   
    catch {
        res.status(500).json({ errorMessage: "The user could not be removed" });
    }
});

server.put("/api/users/:id", (req, res) => {
    if(!req.params.id) {
        res.status(400).json({ errorMessage: "Missing user id on url." });
    }

    const userId = req.params.id;

    if(!(req.body.name || req.body.bio)) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    }

    try {
        
        const found = users.find(user => user.id === userId);

        if(found) {
            
            users[users.indexOf(found)] = {
                ...users[users.indexOf(found)],
                name: req.body.name,
                bio: req.body.bio
            } 

            res.status(200).json(users);
        } else {
            res.status(404).json({ errorMessage: "The user with the specified ID does not exist." })
        }

    }   
    catch {
        res.status(500).json({ errorMessage: "The user information could not be modified." });
    }
});


server.listen(port, () => console.log(`Server listening on port: ${port}`))
