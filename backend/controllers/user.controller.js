const User = require('../models/user.model')
const {ErrorHandler} = require('../middleware/error')
const sendEmail = require('../utils/sendEmail')
exports.registeruser = async(req,res,next) => {
try{
const{name,email,password,role} =req.body
if(!name || !email || !password || !role){
    return next(new ErrorHandler('please enter all fields',400))
}
let user = await User.findOne({email})
if(user){
    return next(new ErrorHandler('user already exists',400))
}
 user = await User.create({name,email,password,role})

res.status(200).json({
    success:true,
    message:'user created successfully',
    user
})
}catch(err){
    return next(err)
}
}
exports.loginuser = async(req,res,next) => {
    try{
        const {email,password} = req.body
        if(!email || !password){
            return next(new ErrorHandler('please enter all fields',400))
        }
        const user = await User.findOne({email})

        if(!user){
            return next(new ErrorHandler('invalid email or password',400))
        }
        const isMatch = await user.comparePassword(password)
        if(!isMatch){
            return next(new ErrorHandler('invalid email or password',400))
        }
        const option = {
            expiresin: new Date(
                process.env.COOKIE_EXPIRE * 24 *60 *60* 1000
            ),
            httpOnly:true
        }
        

        const token = await user.getJWTToken()

        res.status(200).cookie('token',token,option).json({
            success:true,
            message:'user logged in successfully',
            user
        })
    }catch(err){
        return next(err)
    }
}

exports.logoutuser = async(req,res,next) => {
    try{
        res.status(200).cookie('token',null,{
            expires: new Date(Date.now()),
            httpOnly:true
        }).json({
            success:true,
            message:'user logged out successfully'
        })
    }catch(err){
        return next(err)
    }
}
exports.getallusers = async(req,res,next) => {
    try{
        const users = await User.find()
        res.status(200).json({
            success:true,
            users
        })
    }catch(err){
        return next(err)
    }
}
exports.getuser = async(req,res,next) => {
    try{
        const user = await User.findById(req.params.id)
        res.status(200).json({
            success:true,
            message:'user fetched successfully',
            user
        })
    }catch(err){
        return next(err)
    }
}
exports.updatepassword = async(req,res,next) => {
    try{
        const{oldpassword,newpassword,confirmpassword} = req.body
        if(!oldpassword || !newpassword || !confirmpassword){
            return next(new ErrorHandler('please enter all fields',400))
        }
        const user = await User.findById(req.user._id)
        const isMatch = await user.comparePassword(oldpassword)
        if(!isMatch){
            return next(new ErrorHandler('old password is incorrect',400))
        }
        if(newpassword !== confirmpassword){
            return next(new ErrorHandler('password does not match',400))
        }
        user.password = newpassword
        await user.save()
        res.status(200).json({
            success:true,
            message:'password updated successfully'
        })
    }catch(err){
        return next(err)
    }
}
exports.updateuser = async(req,res,next) => {
    try{
        const{name,email,role} = req.body
        
        const user = await User.findById(req.user._id)
        if(!user){
            return next(new ErrorHandler('user not found',400))
        }
        user.name = name
        user.email = email
        user.role = role
        await user.save()
        res.status(200).json({
            success:true,
            message:'user updated successfully',
            user
        })
    }catch(err){    
        return next(err)
    }
}
exports.deleteuser = async(req,res,next) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user){
            return next(new ErrorHandler('user not found',400))
        }
        await user.remove()
        res.status(200).json({
            success:true,
            message:'user deleted successfully'
        })
    }catch(err){
        return next(err)
    }
}
exports.forgotpassword = async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if(!user){
        return next(new ErrorHandler('User not found', 404));
      }

      const resetToken = user.getResetPasswordToken();
      await user.save({ validateBeforeSave: false });
      const resetpasswordurl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;

      const message = `your password reset token is :- \n\n ${resetpasswordurl} \n\n if you have not requested this email then please ignore it`;

      await sendEmail({
        email: user.email,
        subject: 'Password Reset',
        message
      });
    }catch(err){
        return next(err)
    }
}
exports.mydetails = async(req,res,next)=>{
    try{
const user = await User.findById(req.user._id);

res.status(200).json({
    success:true,
    message:'user details fetched successfully',
    user
})  
    }catch(err){
        return next(err)
    }
}