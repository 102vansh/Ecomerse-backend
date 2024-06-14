const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    validate:[validator.isEmail,"Enter  correct password"]
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        public_id:{
            type:String,
            
        },
        url:{
            type:String,
    
        }
    },
    role:{
        type:String,
        default:"user"
    },
    date:{
        type:Date,
        default:Date.now
    },
    resetpasswordtoken:String,
    resetpasswordexpire:Date
},{timestamps:true});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
})
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}
userSchema.methods.getJWTToken = async function(next){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    });
}
userSchema.methods.getResetPasswordToken = async function(next){
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetpasswordtoken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetpasswordexpire = Date.now() + 15*60*1000;
    return resetToken;
}

module.exports = mongoose.model("User",userSchema)