const Order = require('../models/order.models')
const{ErrorHandler}=require('../middleware/error')
const Product = require('../models/product.model')


exports.createorder = async(req,res,next)=>{
    try{
const {shippinginfo,orderitems,paymentinfo} = req.body
const order = await Order.create({
    shippinginfo,
    orderitems,
    paymentinfo,
    user:req.user._id,
    totalprice:req.body.totalprice
})
res.status(201).json({
    success:true,
    order
})
    }catch(err){
        return next(err)
    }
}

exports.getsingleorder = async(req,res,next)=>{
    try{
        const order = await Order.findById(req.params.id).populate('user','name email')
        if(!order){
            return next(new ErrorHandler('order not found',404))
        }
        res.status(200).json({
            success:true,
            order
        })
    }catch(err){
        return next(err)
    }
}
exports.myorders = async(req,res,next)=>{
    try{
        const orders = await Order.find({user:req.user._id})
        res.status(200).json({
            success:true,
            orders
        })
    }catch(err){
        return next(err)
    }
}
exports.allorders = async(req,res,next)=>{
    try{
        let total = 0

        const orders = await Order.find()
        orders.forEach(element => {
            total += element.totalprice
        });

        res.status(200).json({
            success:true,
            orders,
            total
        })
    }catch(err){
        return next(err)
    }
}
exports.updateorder = async(req,res,next)=>{
    try{
        const order = await Order.findById(req.params.id)
        if(!order){
            return next(new ErrorHandler('order not found',404))
        }
        if(order.orderstatus === 'Delivered'){
            return next(new ErrorHandler('you have already delivered this order',400))
        }
        order.orderitems.forEach(async(item)=>{
            await updatestock(item.product,item.quantity)

        })
        order.orderstatus = req.body.orderstatus
        if(req.body.orderstatus === 'Delivered'){
            order.deliveredAt = Date.now()
        }

await order.save()

res.status(200).json({
    success:true,
    message:'order updated successfully',
    order
})
    }catch(err){
    return next(err)
}
}
async function updatestock(id,quantity){
    const product = await Product.findById(id)
    product.stock -= quantity
    await product.save({validateBeforeSave:false})
}
exports.deleteorder = async(req,res,next)=>{
    try{
        let order = await Order.findById(req.params.id)
        if(!order){
            return next(new ErrorHandler('order not found',404))
        }
order = await Order.findByIdAndDelete(req.params.id)
res.status(200).json({
    success:true
})
        
    }catch(err){
        return next(err)
    }
}
