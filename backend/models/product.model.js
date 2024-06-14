const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Product Name"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please Enter Product Description"],
    },
    price: {
        type: Number,
        required: [true, "Please Enter Product Price"],
    
    },
    ratings: {
        type: Number,
        default: 0,
    },
    images:[{
        public_id:{
            type: String,
        },
        url:{
            type: String,
        }
}],

    category: {
        type: String,
        required: [true, "Please Enter Product Category"],
    },
    stock: {
        type: Number,
        
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                
            },
            name: {
                type: String,
                
            },
            rating: {
                type: Number,
            
            },
            comment: {
                type: String,
                
            },
}],


    },{timestamps: true,})

    module.exports = mongoose.model("Product", productSchema);