const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
shippinginfo:{
    address:{
        type: String,
        required: [true, "Please Enter Address"],

    },
    city:{
        type: String,
        required: [true, "Please Enter City"],
    
    },
    state:{
        type: String,
        required: [true, "Please Enter State"],
        
    },
    country:{
        type: String,
        required: [true, "Please Enter Zip"],
        
    },
    pincode:{
        type: String,
        required: [true, "Please Enter Zip"],
    
    }
},
orderitems:[
    {
        product:{
            type: mongoose.Schema.ObjectId,
            ref: "Product",
            required: [true, "Please Enter Product"],
        },
        quantity:{
            type: Number,
            required: [true, "Please Enter Quantity"],
        },
        price:{
            type: Number,
            required: [true, "Please Enter Price"],
        },
        name:{
            type: String,
            required: [true, "Please Enter Name"],
        },
        image:{
            type:String,
        }
    }
],
user:{
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please Enter User"],
},
paymentinfo:{
    id:{
       type: String,
       required: true,
    },
    status:{
        type: String,
        default: "pending",
    },
    itemprice:{
        type: Number,
        default: 0,
    },
    shippingprice:{
        type: Number,
        default: 0,
    },
    taxprice:{
        type: Number,
        default: 0,
    },
    totalprice:{
        type: Number,
        default: 0,
    },
    orderstatus:{
        type: String,
        default: "pending",
    }
},
deliveredAt:{
    type: Date,
},

},{timestamps: true});

module.exports = mongoose.model("Order", orderSchema)