const userRouter = require('./users');
const categoryRouter = require('./category');
const productRouter = require('./product');
const imageRouter = require('./image');
const discountRouter = require('./discount');

function route(app) {
    app.use('/api/users', userRouter);
    app.use('/api/categories', categoryRouter);
    app.use('/api/products', productRouter);
    app.use('/api/images', imageRouter);
    app.use('/api/discounts', discountRouter);
}

module.exports = route;