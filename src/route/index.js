const userRouter = require('./users');
function route(app) {
    app.use('/api/users', userRouter);
}

module.exports = route;