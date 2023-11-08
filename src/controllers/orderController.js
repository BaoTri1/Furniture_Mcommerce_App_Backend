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
        let payStatus = req.body.payStatus || false;
        let products = req.body.products;

        console.log(idDelivery);
        console.log(idUser);
        console.log(idPayment);
        console.log(nameCustomer);
        console.log(sdtOrder);
        console.log(address);
        console.log(total);
        console.log(payStatus);
        console.log(products);

        //idDelivery	idUser	idPayment	nameCustomer	sdtOrder	address	status	total	payStatus

        if (!idDelivery || !idUser || !idPayment || !nameCustomer || !sdtOrder || !address || !total || !products) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Internal Server Error or missing payload.'
            })
        }

        console.log('xuong day roi')

        if (total < 0) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Tổng giá tiền không hợp lệ.'
            })
        }

        let results = await orderService.createOrder(req.body)

        return res.status(200).json({
            ...results
        })

    }

    //GET api/orders/items/?id=''
    async getInforOrder(req, res, next) {
        let idOrder = req.query.id;


        if (!idOrder) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Internal Server Error or missing payload.'
            })
        }
        let results = await orderService.getInforOrder(idOrder)

        return res.status(200).json({
            ...results
        })

    }

    //GET api/orders/?page=''&limit=''
    async getOrdertByPage(req, res, next) {
        let page = req.query.page || 1;
        let limit = req.query.limit || 20;
        let status = req.query.status || '';
        let dayCreate = req.query.dayCreate || '';
        let dayUpdate = req.query.dayUpdate || '';
        let search = req.query.search || '';
        let price = req.query.price || '';

        let results = await orderService.getOrderByPage(page, limit, status, dayCreate, dayUpdate, search, price)

        return res.status(200).json({
           ...results   
        })
    }

    //GET api/orders/list-status
    async getListStatus(req, res, next) {

        let results = await orderService.getListStatus()

        return res.status(200).json({
           ...results   
        })
    }

    //PUT api/orders/update/:id
    async updateOrder(req, res, next) {
        let id = req.params.id;
        let nameCustomer = req.body.nameCustomer;
        let sdt = req.body.sdtOrder;
        let address = req.body.address;
        let status = req.body.status;
        let payStatus = req.body.payStatus;

        if(!nameCustomer || !sdt || !address || !status) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Internal Server Error or missing payload.'
            })
        }

        let results = await orderService.updateOrder(id, req.body);
        return res.status(200).json({
            ...results
        })
    }
}

module.exports = new OrderService;