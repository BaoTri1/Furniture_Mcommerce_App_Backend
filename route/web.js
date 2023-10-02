import express from "express";

let router = express.Router();

let iniWebRoutes = (app) => {
    router.get('/', (req, res) =>{
        return res.send("Hello world");
    });
    return app.use("/", router);
}

module.exports = iniWebRoutes;
