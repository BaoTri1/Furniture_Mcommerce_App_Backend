const userRouter = require('./users');
const categoryRouter = require('./category');
const productRouter = require('./product');
const imageRouter = require('./image');
const discountRouter = require('./discount');
const reviewRouter = require('./review');
const OrderRouter = require('./order');
const serviceRouter = require('./service');

function route(app) {
    app.use('/api/users', userRouter);
    app.use('/api/categories', categoryRouter);
    app.use('/api/products', productRouter);
    app.use('/api/images', imageRouter);
    app.use('/api/discounts', discountRouter);
    app.use('/api/reviews', reviewRouter);
    app.use('/api/orders', OrderRouter);
    app.use('/api/services', serviceRouter);
}

module.exports = route;