const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
require('./db/conn')
const productrouter = require('./routes/product.router')
const userrouter = require('./routes/user.router');
const orderrouter = require('./routes/order.rote')
const { errormiddleware } = require('./middleware/error');
const cookieparser = require('cookie-parser');
 
dotenv.config({path: 'backend/config/config.env'});
const port = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieparser())
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}))
app.use('/api/v1/products', productrouter)
app.use('/api/v1/users', userrouter)
app.use('/api/v1/orders', orderrouter)

app.use(errormiddleware)
app.listen(port, (req,res) => {
    console.log(`Server is running on port ${port}`);
})