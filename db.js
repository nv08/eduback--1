const mongoose = require("mongoose");
const mongoURI = "mongodb+srv://root:root@cluster0.tmeox.mongodb.net/?retryWrites=true&w=majority"

const connectToMongo = () => {
  mongoose.connect(mongoURI, ()=> {
        console.log("education connected to data base ") 
    })
    
    
};

module.exports = connectToMongo;
