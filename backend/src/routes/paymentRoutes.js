import express from 'express';
import { checkOutPaymentDetails, checkOutSession, updateCheckOutSession } from '../controllers/Payments/paymentController.js';
import userAuth from '../middleware/userAuth.js';
import allowRoles from '../middleware/allowRoles.js';
import { AppConstants } from '../constant/appConstants.js';
import { createOrder } from '../controllers/Products/orderController.js';

const paymentRouter = express.Router();

paymentRouter
  .route('/create-checkout-session')
  .post(userAuth, allowRoles([AppConstants.Role.Customer]), checkOutSession);

paymentRouter
  .route('/paymentDetails')
  .get(userAuth, allowRoles([AppConstants.Role.Customer]), checkOutPaymentDetails);

paymentRouter
  .route('/update-checkout-session')
  .put(updateCheckOutSession, createOrder);

export default paymentRouter;