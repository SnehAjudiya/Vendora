import express from "express";
import {
  createProduct,
  deleteProduct,
  exportAllProducts,
  exportProduct,
  fetchProducts,
  getProductById,
  updateProduct,
  uploadProducts,
} from "../controllers/Products/productController.js";
import { validationHandler } from "../middleware/validationHandler.js";
import {
  createProduct_validation_schema,
  updateProduct_validation_schema,
} from "../validation/Validation Schema/Product_Validation.js";
import { upload } from "../middleware/multer.js";
import userAuth from "../middleware/userAuth.js";
import allowRoles from "../middleware/allowRoles.js";
import { AppConstants } from "../constant/appConstants.js";

const productRouter = express.Router();

productRouter
  .route("/uploadProducts")

  // Upload Products
  .post(
    userAuth,
    allowRoles([AppConstants.Role.Admin, AppConstants.Role.Vendor]),
    upload.single(AppConstants.UploadFileNames.File),
    uploadProducts,
  );

productRouter
  .route("/exportAllProducts")

  // Export Products
  .get(
    userAuth,
    allowRoles(Object.values(AppConstants.Role)),
    exportAllProducts,
  );

productRouter
  .route("/exportProduct/:id")

  // Export Single
  .get(userAuth, exportProduct);

productRouter
  .route("/")

  // Fetch All Products
  .get(userAuth, allowRoles(Object.values(AppConstants.Role)), fetchProducts)

  // Create Product
  .post(
    userAuth,
    allowRoles([AppConstants.Role.Admin, AppConstants.Role.Vendor]),
    upload.single(AppConstants.UploadFileNames.Image),
    validationHandler(createProduct_validation_schema),
    createProduct,
  );

productRouter
  .route("/:id")

  // Product details - By Id
  .get(userAuth, allowRoles(Object.values(AppConstants.Role)), getProductById)

  // Update Product
  .put(
    userAuth,
    allowRoles([AppConstants.Role.Admin, AppConstants.Role.Vendor]),
    upload.single(AppConstants.UploadFileNames.Image),
    validationHandler(updateProduct_validation_schema),
    updateProduct,
  )

  // Delete Products
  .delete(userAuth, allowRoles([AppConstants.Role.Admin, AppConstants.Role.Vendor]), deleteProduct);

export default productRouter;
