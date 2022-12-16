import express from 'express';
import { isAuth } from '../models/utils.js';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

const orderRouter = express.Router();
orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'order does not exist' });
    }
  })
);
orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemPrice: req.body.itemPrice,
      taxPrice: req.body.taxPrice,
      shippingPrice: req.body.shippingPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id, //from isAuth
    });

    const order = await newOrder.save();
    res.status(201).send({ message: 'New Order Created', order });
  })
);
orderRouter.put(
  '/:id/pay',
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      (order.ispaid = true),
        (order.paidAt = Date.now()),
        (order.paymentResult = {
          id: req.body.id,
          status: req.body.status,
          update_time: req.body.update_Time,
          email_address: req.body.email_address,
        });

      const updatedOrder = order.save();
      res.send({ message: 'Order Paid', order: updatedOrder });
    }
    res.status(404).send({ message: 'Order Not Found' });
  })
);
export default orderRouter;
