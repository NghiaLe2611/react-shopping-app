require('dotenv').config();

const express = require('express');
const app = express();
const mongoPractice = require('./mongoose');
const Product = require('./models/product');

// const productsRoute = require('./routes/products');

// app.use(express.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	if (req.method === 'OPTIONS') {
		res.header(
			'Access-Control-Allow-Methods',
			'PUT, POST, PATCH, DELETE, GET'
		);
		return res.status(200).json({});
	}
	next();
});

// app.use('/products', productsRoute);

// Get all products
app.get('/getProducts', mongoPractice.getFeaturedProducts);

// Get product detail
app.get('/product/:productId', mongoPractice.getProductDetail);

// Get products by category, brand...
app.get('/products', mongoPractice.getProducts);

// Search product
app.get('/productSearch', mongoPractice.searchProduct);

// Compare product
app.get('/compare', mongoPractice.compareProduct);


// app.get('/test', async function(req, res, next) {
//     const categories = await Product.distinct('brand');
//     console.log(categories);
//     res.json(categories)
// });




app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message,
		},
	});
});

module.exports = app;