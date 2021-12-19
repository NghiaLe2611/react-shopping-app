require('dotenv').config();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Product = require('./models/product');

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

    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const category = req.query.category;
    const brand = req.query.brand;
    const sort = req.query.sort;

    let query = {};

    if (category) {
        query['category'] = category;
    }

    if (brand) {
        query['brand'] = brand;
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

    // if (!sort) {
    //     Product.find(query).exec(function (err, data) {
    //         if (err) {
    //             res.json(err);
    //         } else {
    //             res.json({
    //                 results: data
    //             });
    //         }
    //     });
    // } else {
    //     const criteria = sort === 'priceAscending' ? 1 : sort === 'priceDescending' ? -1 : '';
    //     Product.find(query).sort({price: criteria}).exec(function (err, data) {
    //         if (err) {
    //             res.json(err);
    //         } else {
    //             res.json({
    //                 results: data
    //             });
    //         }
    //     });
    // }

    // Product.find(query).limit(limit).skip(offset).exec(function (err, data) {
    //     if (err) {
    //         res.json(err);
    //     } else {
    //         if (!category) {
    //             res.json({
    //                 results: data,
    //                 count
    //             });
    //         } else {
    //             res.json({
    //                 results: data
    //             });
    //         }
    //     }
    // });

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

exports.getFeaturedProducts = getFeaturedProducts;
exports.getProducts = getProducts;
exports.getProductDetail = getProductDetail;
exports.searchProduct = searchProduct;
exports.compareProduct = compareProduct;
