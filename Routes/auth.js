
const express = require('express');
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const getUser = require('../middleware/getUser');
const multer = require("multer");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

let secretKey = process.env.SECRET_KEY;

const router = express.Router();

// route1 creating user with POST /api/auth/createuser no login required
router.post("/createuser", [
    //express validator
    body("name", "Plese enter valid Name").isLength({ min: 3 }),
    body("email", "Plese enter valid Email").isEmail(),
    body("password", "Plese enter valid Password").isLength({ min: 5 })
], async (req, res) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() })
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.send({ error: "User already exists" })
    }

    try {
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        const data = {
            user: {
                id: user.id
            }
        };
        const jwtoken = jwt.sign(data, secretKey);

        if (jwtoken) {
            res.status(200).json(jwtoken)
        } else {
            res.status(400).send({ error: "Bad request" })
        }

    } catch (error) {
        res.status(400).send({ err: "Bad Request" })
    }

});

// route2 creating user login page with POST /api/auth/login no login required
router.post("/login", [
    //express validator
    body("email", "Plese enter valid Email").isEmail(),
    body("password", "Plese enter valid Password").isLength({ min: 5 })
], async (req, res) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).send({ error: error.array() })
    };

    try {
        const user = await User.findOne({ email: req.body.email }).select("-password");
        if (user) {
            data = {
                user: {
                    id: user.id
                }
            }
        } else {
            return res.status(400).send({ error: "Please Provide the correct Detail" });
        }
        const jwtoken = jwt.sign(data, secretKey)
        if (jwtoken) {
            res.status(200).json(jwtoken)
        } else {
            res.status(404).send({ error: "Please use the correct credentials" });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});

// route3 getting logged In user detail using get /api/auth/getuser login require
router.get("/getuser", getUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }

});

// middleware function for uploading profile picture in folder
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "upload")
        },
        filename: function (req, file, cb) {
            // console.log( Date.now() + "_" +file.originalname)
            cb(null, Date.now() + "_" + file.originalname);
        }
    })
}).single("profilePhoto")


// route4 upload profile photo POST /api/auth/upload login required
router.post("/upload", getUser, upload, async (req, res) => {
    let { filename, path } = req.file;
    let userId = req.user.id;
    let oldUser = await User.findById(userId);
    if(oldUser.profilePhoto){
        fs.unlink(oldUser.profilePhoto, function (err){
            if(err){
                console.error("Error deleting profile photo:", err);
            }
        });
    }

    User.findByIdAndUpdate(userId, { profilePhoto: path }, { new: true }).select("-password -email -name -_id -__v")
        .then(user => {
            if (!user) {
                return res.status(404).send("user not found")
            }
            
            res.status(200).json({ user, success: "file uploaded successfully" });
        })
        .catch(err => {
            res.status(500).send('An Error Accured')
        })
})

// route4 upload profile photo POST /api/auth/upload login required
router.get("/upload/:id", getUser, async (req, res) => {
    try {
        let userImg = await User.findById(req.params.id);
        
        if (!userImg) {
           return res.status(404).send({user:"user not found"})
        }
        // Construct the full path to the image file
        const filePath = path.resolve(userImg.profilePhoto);

        // Return the image file to the client
        res.sendFile(filePath);
        // res.sendFile(userImg.profilePhoto, {root: "upload/"})
    } catch (err) {
        res.status(500).json({error:'Internal Server Error'});
    }
})

module.exports = router;