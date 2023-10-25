const userRouter = require('./users');
const categoryRouter = require('./category');
const productRouter = require('./product');
const imageRouter = require('./image');

function route(app) {
    app.use('/api/users', userRouter);
    app.use('/api/categories', categoryRouter);
    app.use('/api/products', productRouter);
    app.use('/api/images', imageRouter);
}

module.exports = route;