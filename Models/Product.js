const mongoose = require("mongoose");
const { Schema } = mongoose;

const Product = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    name:{
        type: String,
        required:true
    },
    price:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    }
})

module.exports = mongoose.model("product", Product);