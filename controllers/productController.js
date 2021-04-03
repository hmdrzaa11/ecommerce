let Product = require("../models/Product");
let catchAsync = require("../utils/catchAsync");
let multer = require("multer");
const AppError = require("../utils/AppError");
let sharp = require("sharp");
let path = require("path");

let multerStorage = multer.memoryStorage();

exports.upload = multer({
    storage: multerStorage,
    fileFilter(req, file, cb) {
        if (file.mimetype.startsWith("image")) {
            return cb(null, true);
        } else {
            return cb(new AppError("please upload an image", 400));
        }
    },
});

exports.resizeImages = catchAsync(async (req, res, next) => {
    if (!req.file) return next();
    let filename = `product-${req.user._id}-${Date.now()}.jpeg`;
    let diskPath = path.join(__dirname, `../public/images/products/${filename}`);
    req.filename = filename;
    await sharp(req.file.buffer).toFormat("jpeg").jpeg(80).toFile(diskPath);
    next();
});

exports.createProduct = catchAsync(async (req, res, next) => {
    let product = await Product.create({image: req.filename, ...req.body});
    res.status(201).json({
        status: "success",
        product,
    });
});


exports.getAllProducts = catchAsync(async (req, res, next) => {
    let products = await Product.find()
    res.status(200).json({
        status: "success",
        result: products.length,
        products

    })
})
