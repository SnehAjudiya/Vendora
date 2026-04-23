import express from 'express';
import { clearCart, fetchCart, getCartProductById, updateQuantity } from '../controllers/Products/cartController.js';
import allowRoles from '../middleware/allowRoles.js';
import { AppConstants } from '../constant/appConstants.js';
import userAuth from '../middleware/userAuth.js';

const cartRouter = express.Router();

cartRouter.route('/').get(userAuth, allowRoles([AppConstants.Role.Customer]), fetchCart);

cartRouter.route('/updateQuantity/:productId').put(userAuth, allowRoles([AppConstants.Role.Customer]), updateQuantity);

cartRouter.route('/removeAll').delete(userAuth, allowRoles([AppConstants.Role.Customer]), clearCart);

cartRouter.route('/getCartProductById/:productId').get(userAuth, allowRoles([AppConstants.Role.Customer]), getCartProductById);

export default cartRouter;