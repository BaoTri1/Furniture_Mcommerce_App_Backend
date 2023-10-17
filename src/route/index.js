const userRouter = require('./users');
const categoryRouter = require('./category');
const productRouter = require('./product');

function route(app) {
    app.use('/api/users', userRouter);
    app.use('/api/categories', categoryRouter);
    app.use('/api/products', productRouter);
}

module.exports = route;