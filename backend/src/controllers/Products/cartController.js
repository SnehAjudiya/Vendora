import Cart from "../../models/Cart.js";
import { StatusCodes } from "../../constant/statusCodes.js";
import { CommonResponse } from "../../constant/commonResponse.js";
import { MESSAGES } from "../../constant/messages.js";
import { AppConstants } from "../../constant/appConstants.js";

export const fetchCart = async (req, res, next) => {
  try {
    const { id } = req.user;

    const cartProducts = await Cart.find({ userId: id }).populate("productId");

    res.status(StatusCodes.OK).json(CommonResponse.Success(cartProducts, MESSAGES.CART.FETCH));
  } catch (error) {
    next(error);
  }
}

export const updateQuantity = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { action } = req.query;
    const { id } = req.user;


    const filter = { userId: id, productId };

    if (action === AppConstants.CartQuantity.Increment) {
      await Cart.findOneAndUpdate(filter, { $inc: { quantity: 1 } }, { upsert: true });
    }
    else if (action === AppConstants.CartQuantity.Decrement) {
      await Cart.findOneAndUpdate(filter, { $inc: { quantity: -1 } });
      await Cart.findOneAndDelete({ ...filter, quantity: { $lte: 0 } });
    }
    else if (action === AppConstants.CartQuantity.RemoveItem) {
      await Cart.findOneAndDelete(filter);
    }
    else {
      return res.status(StatusCodes.NOT_IMPLEMENTED).json(CommonResponse.Not_Implemented({}, MESSAGES.CART.UPDATE_QUANTITY_METHOD_NOT_IMPLEMENTED))
    }

    const updated = await Cart.findOne(filter).populate("productId");

    res.status(StatusCodes.OK).json(CommonResponse.Success(updated, MESSAGES.CART.UPDATE_QUANTITY_SUCCESS));
  }
  catch (error) {
    next(error);
  }
}

export const getCartProductById = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { productId } = req.params;

    const selectedProduct = await Cart.findOne({ userId: id, productId: productId }).populate("productId");

    res.status(StatusCodes.OK).json(CommonResponse.Success(selectedProduct, MESSAGES.CART.FETCH))

  } catch (error) {
    next(error);
  }
}

export const clearCart = async (req, res, next) => {
  try {
    const { id } = req.user;

    await Cart.deleteMany({ userId: id });

    res.status(StatusCodes.OK).json(CommonResponse.Success({}, MESSAGES.CART.REMOVE_ALL));

  } catch (error) {
    next(error);
  }
}