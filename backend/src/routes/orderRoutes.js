import express from "express";
import { createOrder, fetchOrders } from "../controllers/Products/orderController.js";
import userAuth from "../middleware/userAuth.js"
import allowRoles from "../middleware/allowRoles.js"
import { AppConstants } from "../constant/appConstants.js";

const orderRouter = express.Router();

orderRouter
  .route("/")
  .get(userAuth, allowRoles([AppConstants.Role.Customer]), fetchOrders)
// .post(userAuth, allowRoles([AppConstants.Role.Customer]), createOrder);

export default orderRouter;