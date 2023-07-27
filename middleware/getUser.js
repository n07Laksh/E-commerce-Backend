const jwt = require("jsonwebtoken");

require("dotenv").config();

let secretKey = process.env.SECRET_KEY;

function getUser(req,res,next){
    let jwtoken = req.header("jw-token")
    if(!jwtoken){
        return res.status(400).json({error: "Please use the correct jw-token"});    
    }
    try{
    const data = jwt.verify(jwtoken, secretKey);
    req.user = data.user;
    next();
    } catch (error) {
        return res.status(400).json({error: "please use the correct jw-token"})
    }

}

module.exports = getUser;