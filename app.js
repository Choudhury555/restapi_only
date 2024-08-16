const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());

/////DATABASE CONNECTION START/////
mongoose.connect("mongodb://0.0.0.0:27017",{
    dbName:"sampledbforrestapi"
}).then(()=>{
    console.log("Database Connected");
}).catch((err)=>{
    console.log(err);
})

const productschema = new mongoose.Schema({
    name:String,
    description:String,
    price:Number
})

const Product = new mongoose.model("Product",productschema);
/////DATABASE CONNECTION END/////

//CREATE
app.post("/api/v1/product/new",async (req,res)=>{
    const productCreated = await Product.create(req.body);

    res.status(201).json({
        status:true,
        product:productCreated
    })
})


//READ
app.get("/api/v1/products",async (req,res)=>{
    const getAllProduct = await Product.find();

    res.status(200).json({
        success:true,
        product:getAllProduct
    });
})


//UPDATE
app.put("/api/v1/product/:id",async (req,res)=>{
    console.log(req.params.id);
    const findProductBeforeUpdate = await Product.findById(req.params.id);
    if(!findProductBeforeUpdate){
        return res.status(500).json({
            success:false,
            message:"Product Not Found"
        })
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id,req.body);
    
    const findProductAfterUpdate = await Product.findById(req.params.id);
    // console.log(findProductAfterUpdate);
    
    res.status(200).json({
        success:true,
        message:"Product is Updated Sucessfully",
        product:findProductAfterUpdate
    })
    
})


//DELETE
app.delete("/api/v1/product/:id",async (req,res)=>{
    const findProduct = await Product.findById(req.params.id);

    if(!findProduct){
        return res.status(500).json({
            success:false,
            message:"Product Not Found"
        })
    }

    await Product.deleteOne({_id:req.params.id});

    res.status(200).json({
        success:true,
        message:"Product is Deleted Successfully"
    })
})




app.listen(2000,()=>{
    console.log("Server is Working");
})