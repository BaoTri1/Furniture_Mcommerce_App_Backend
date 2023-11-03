import orderService from '../services/orderService';

class OrderService {

    //POST api/orders/createOrder
    async createOrder(req, res, next) {
        let idDelivery = req.body.idDelivery;
        let idUser = req.body.idUser;
        let idPayment = req.body.idPayment;
        let nameCustomer = req.body.nameCustomer;
        let sdtOrder = req.body.sdtOrder;
        let address = req.body.address;
        let total = req.body.total;
        let payStatus = req.body.payStatus;
        let products = req.body.products;

        //idDelivery	idUser	idPayment	nameCustomer	sdtOrder	address	status	total	payStatus

        if (!idDelivery || !idUser || !idPayment || !nameCustomer || !sdtOrder || !address || !total || !payStatus || !products) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Internal Server Error or missing payload.'
            })
        }

        if (total < 0) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Tổng giá tiền không hợp lệ.'
            })
        }

        //let results = await orderService.createOrder(req.body)

        return res.status(200).json({
            //results
            idDelivery: req.body.idDelivery,
            idUser: req.body.idUser,
            idPayment: req.body.idPayment,
            nameCustomer: req.body.nameCustomer,
            sdtOrder: req.body.sdtOrder,
            address: req.body.address,
            total: req.body.total,
            payStatus: req.body.payStatus,
            products: req.body.products,

        })

    }
}

module.exports = new OrderService;