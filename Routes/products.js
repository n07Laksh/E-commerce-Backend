const express = require("express");
const Product = require("../Models/Product")
const getUser = require("../middleware/getUser")
const { body, validationResult } = require("express-validator");

const router = express.Router();


// route1 getting Products from database(mongodb) /api/products/getproducts login required
router.get("/getproducts", getUser, async (req, res) => {
    let userId = req.user.id;
    const data = await Product.find({ user: userId });
    if (data) {
        res.send(data)
    } else res.send({ error: "some error Accured" })
});


// route2 adding product in database /api/products/addproducts login required
router.post("/addproducts", [
    body("name", "Plese fill the Name").isLength({ min: 1 }),
    body("price", "Plese fill the Price").isLength({ min: 1 }),
    body("category", "Plese fill the category").isLength({ min: 1 })
], getUser, async (req, res) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() })
    }
    let userId = req.user.id;
    let { name, price, category } = req.body;
    const data = await Product.create({ name: name, price: price, category: category, user: userId });
    res.send(data)
})


// route3 deleting product in database DELETE /api/products/deleteProduct login required
router.delete("/deleteProduct", getUser, async (req, res) => {
    const item = await Product.deleteOne({ _id: req.body.id });
    if (item.deletedCount > 0) {
        res.status(200).json({ success: "Item Deleted Successfully" })
    }
});

// route4 updating product in database PUT /api/products/updateProduct login required
router.put("/updateProduct", [
    body("name", "Plese fill the Name").isLength({ min: 1 }),
    body("price", "Plese fill the Price").isLength({ min: 1 }),
    body("category", "Plese fill the category").isLength({ min: 1 })
], getUser, async (req, res) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() })
    }
    let {name,price,category,id} = req.body;
    let data = await Product.updateOne({_id:id}, {
        $set: {
            name: name,
            price: price,
            category: category
        }
    })
    res.send(data);
});

// route5 fetching product POST /api/products/findproduct login required
router.post("/findproduct", getUser , async (req,res)=>{
    let data = await Product.findOne({_id:req.body.id});
    if(data._id){
       return res.status(200).json(data);
    }else {
        return res.status(500).json({error:"Internal Server Error"})
    }
})

module.exports = router;