const Product = require('../models/product.model')
const {ErrorHndler} = require('../middleware/error')
const apifeatures = require('../utils/apifeatures')

exports.createproducta = async (req,res,next) => {
    try{
        const product = await Product.create(req.body)

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product
        })

    }catch(err){
        return next(err)
    }

}

exports.getproduct = async (req,res,next) => {
    const resultPerPage =3
    const productcount = await Product.countDocuments()
   const apifeature = new apifeatures (Product.find(),req.query).search().filter().pagination(resultPerPage)
    const product = await apifeature.query 
    try{
    res.status(200).json({
        success: true,
        message: 'Product fetched successfully',
        product,
        productcount,
        resultPerPage,
    })
}catch(err){
    return next(err)
}
}
//update pro --admin
exports.updateproduct = async (req,res,next) => {
    try{
        
        let product = await Product.findById(req.params.id)
        if(!product){
            return next(new ErrorHndler('Product not found', 404))
        }
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })
        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product
        })
    }catch(err){
        return next(err)
    }
}
exports.deleteproduct = async(req,res,next) => {
    try{
        let product = await Product.findById(req.params.id)
        if(!product){
            return next(new ErrorHndler('Product not found', 404))
        }
product = await Product.findByIdAndDelete(req.params.id)
res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
    product
})
    }catch(err){
        return next(err)
    }
}
exports.getsingleproduct = async(req,res,next) => {
const product = await Product.findById(req.params.id)
try{
    res.status(200).json({
        success: true,
        message: 'Product fetched successfully',
        product
    })
}catch(err){
    return next(err)
}
}



exports.createrev = async(req,res,next) => {
    try {
        const { rating, comment,productId } = req.body;

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment
        }
        const product = await Product.findById(productId);
if(!product){
    return next(new ErrorHndler('Product not found', 404));
}
const isreviewed = product.reviews.find(review => review.user.toString() === req.user._id.toString());
if(isreviewed){
    //update is happenning
    product.reviews.forEach((review)=> { 
        if(review.user.toString() === req.user._id.toString()){
            review.rating = rating;
            review.comment = comment;
        }
    });

} else{
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
}
    product.ratings = product.reviews.reduce((acc, review) => review.rating + acc, 0) / product.reviews.length;
    await product.save();
    res.status(200).json({
        success: true,
        message: 'Review added successfully',
        product
    });



}catch(err){
        return next(err)
    }
}