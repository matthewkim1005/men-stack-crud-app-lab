//Initializing----------------------------------------------------------------------------------------------------
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");

const app = express();

mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

//Schemas/Models----------------------------------------------------------------------------------------------------
const Food = require("./models/foods.js");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

//CRUD Functions---------------------------------------------------------------------------------------------------
//GET '/' Landing page
app.get('/', (req, res) => {
    res.render('index.ejs')
});

//GET '/foods'
app.get('/foods', async (req, res) => {
    const allFoods = await Food.find();
    console.log(allFoods);
    res.render('foods/allFoodsIndex.ejs', { foods : allFoods });
});

//GET '/foods/new'
app.get('/foods/new', (req, res) => {
    res.render('foods/new.ejs')
});

//GET '/foods/:foodId'
app.get('/foods/:foodId', async (req, res) => {
    const foundFood = await Food.findById(req.params.foodId);
    res.render('foods/show.ejs', {food: foundFood});
});

//POST '/foods'
app.post('/foods', async (req, res) => {
    if (req.body.isVegetarian === 'on') {
        req.body.isVegetarian = true
    } else {
        req.body.isVegetarian = false
    }
    await Food.create(req.body);
    res.redirect('/foods/new');
});

//DELETE 
app.delete("/foods/:foodId", async (req, res) => {
    await Food.findByIdAndDelete(req.params.foodId);
    res.redirect("/foods");
  });

  // GET localhost:3000/foods/:foodId/edit
app.get("/foods/:foodId/edit", async (req, res) => {
    const foundFood = await Food.findById(req.params.foodId);
    res.render("foods/edit.ejs", {
        food: foundFood,
      });
  });

app.put("/foods/:foodId", async (req, res) => {
    // Handle the 'isVegetarian' checkbox data
    if (req.body.isVegetarian === "on") {
      req.body.isVegetarian = true;
    } else {
      req.body.isVegetarian = false;
    }
    await Food.findByIdAndUpdate(req.params.foodId, req.body);
    res.redirect(`/foods/${req.params.foodId}`);
    console.log('hi');
  });
  
app.listen(3000, () => {
    console.log("Listening on port 3000");
  });