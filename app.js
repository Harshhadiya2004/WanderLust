const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsmate = require("ejs-mate");

main().then(()=>{
    console.log("Connected To DB");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("Hi I am a root");
});

app.get("/listing",async(req,res)=>{
    const alllist = await Listing.find({});
    res.render("./listing/index.ejs",{alllist});
});



app.get("/listing/new",(req,res)=>{
    res.render("./listing/new.ejs");
})

app.post("/listing",async(req,res)=>{
    const newlist = await new Listing(req.body.list);
    newlist.save();
    res.redirect("/listing");
})

app.get("/listing/:id",async (req,res)=>{
    let {id} = req.params;
    const list = await Listing.findById(id);
    res.render("./listing/show.ejs",{list});
});

app.get("/listing/:id/edit",async(req,res)=>{
    let {id} = req.params;
    const list = await Listing.findById(id);
    res.render("./listing/edit.ejs",{list});
});

app.put("/listing/:id",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.list});
    res.redirect(`/listing/${id}`);
});

app.delete("/listing/:id",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
})

app.listen(3000,()=>{
    console.log("Server is listening to port 3000");
});
