require('dotenv').config();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Product = require('./models/product');
const Review = require('./models/review');

function escapeRegExp(stringToGoIntoTheRegex) {
    return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

mongoose
	.connect(process.env.DATABASE_URL)
	.then(() => {
		console.log('Connected to database!');
	})
	.catch(() => {
		console.log('Connection failed!');
	});

const getFeaturedProducts = async (req, res, next) => {
    Product.find( {featured: true} ).exec(function (err, data) {
        if (err) {
            res.json(err);
        } else {
            res.json({
                results: data
            });
        }
    });
};

const getProducts = async (req, res, next) => {
	// const products = await Product.find().exec();
	// res.json(products);

    // const count = await Product.countDocuments({}).exec();

    const limit = req.query.limit ? parseInt(req.query.limit) : 20;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;

    const category = req.query.category;
    const brand = req.query.brand;
    const price = req.query.price;
    const battery = req.query.battery;
    const sort = req.query.sort;

    let query = {};

    if (category) {
        query['category'] = category;
    }

    if (brand) {
        query['brand'] = brand.split(",");
        console.log(query['brand']);
    }

    if (price) {
        const priceArr = price.split(",");

        let prices = [];

        priceArr.forEach(val => {
            if (val === 'duoi-2-trieu') {
                prices.push({ price: { $lte: 2000000 }});
            } else if (val === 'tu-2-5-trieu') {
                prices.push({ price: { $gt: 2000000, $lte: 5000000 }});
            } else if (val === 'tu-5-10-trieu') {
                prices.push({ price: { $gt: 5000000, $lte: 10000000 } });
            } else if (val === 'tu-10-20-trieu') {
                prices.push({ price: { $gt: 10000000, $lte: 20000000 }});
            } else if (val === 'tren-20-trieu') {
                prices.push({ price: { $gt: 20000000 }});
            }
        });

        if (prices.length > 0){ 
            query['$or'] = prices;
            console.log(query);
        }
    }

    if (battery) {
        const batteryArr = battery.split(",");

        let batteries = [];
        batteryArr.forEach(val => {
            let key = 'specs.pin';

            if (val === 'duoi-3000-mah') {
                batteries.push({ [key]: { $lte: 3000 }});
            } else if (val === 'tu-3000-4000-mah') {
                batteries.push({ [key]: { $gt: 3000, $lte: 4000 }});
            } else if (val === 'tren-4000-mah') {
                batteries.push({ [key]: { $gt: 4000 }});
            }
        });

        if (batteries.length > 0){ 
            query['$or'] = batteries;
        }
    }

    switch (sort) {
        case 'priceAscending': {
            Product.find(query).sort({ price: 1 }).exec(function (err, data) {
                if (err) {
                    res.json(err);
                } else {
                    res.json({
                        results: data
                    });
                }
            });

            break;;
        }
        case 'priceDescending': {
            Product.find(query).sort({ price: -1 }).exec(function (err, data) {
                if (err) {
                    res.json(err);
                } else {
                    res.json({
                        results: data
                    });
                }
            });

            break;
        }
        default: {
            Product.find(query).exec(function (err, data) {
                if (err) {
                    res.json(err);
                } else {
                    res.json({
                        results: data
                    });
                }
            });
        }
            
    }
};

const searchProduct = async (req, res, next) => {
    const category = req.query.category;
    let query = {};
    if (category) {
        query['category'] = category;
    }
    const limit = category ? 4 : 5;
    query['name'] = { $regex : new RegExp('.*' + escapeRegExp(req.query.name) + '.*', 'i') };

    Product.find(query).limit(limit).exec(function (err, data) {
        if (err) {
            res.json(err);
        } else {
            res.json({
                results: data
            });
        }
    });
};

const getProductDetail = async (req, res, next) => {
   
    const productId = req.params.productId;

    if (ObjectId.isValid(productId)) {
        const product = await Product.findById(productId).exec();
        res.json(product);
    } else {
        const queryName = req.params.productId.split('-').join(' ');
        let query = {};
        query['name'] = { $regex : new RegExp('^' + escapeRegExp(queryName) + '$', 'i') };
        Product.findOne(query).exec(function (err, data) {
            if (err) {
                res.json(err);
            } else {
                res.json(data);
            }
        });
    }
};

const compareProduct = async (req, res, next) => {
    const queryListId = req.query.id;
    console.log(queryListId);
    res.json(queryListId);
};

const getBrandList = async (req, res, next) => {
    const category = req.query.category;
    const brand = await Product.find({category: category}).distinct('brand');
    res.json(brand)
};

const getReviews = async (req, res, next) => {
    const productId = req.params.productId;

    if (ObjectId.isValid(productId)) {
        const review = await Review.find( { productId: productId}).exec();
        res.json(review);
    } else {
        res.json([]);
    }
};

exports.getFeaturedProducts = getFeaturedProducts;
exports.getProducts = getProducts;
exports.getProductDetail = getProductDetail;
exports.searchProduct = searchProduct;
exports.compareProduct = compareProduct;
exports.getBrandList = getBrandList;
exports.getReviews = getReviews;