import Joi from "joi";
import {
  productImage_validator,
  productCategory_validator,
  productPrice_validator,
  productRatingStars_validator,
  productRatingCount_validator,
  productKeywords_validator,
  existingImage_validator,
  name_validator,
} from "../validators.js";

// PRODUCTS
// Create product
export const createProduct_validation_schema = Joi.object({
  vendor: Joi.string().min(0),
  name: Joi.string(),
  description: Joi.string(),
  image: productImage_validator,
  category: productCategory_validator,
  price: productPrice_validator,
  rating: Joi.object({
    stars: productRatingStars_validator,
    count: productRatingCount_validator,
  }),
  subCategory: Joi.string(),
  keywords: productKeywords_validator,
});

// Update Product
export const updateProduct_validation_schema = createProduct_validation_schema
  .fork(
    [
      "vendor",
      "name",
      "description",
      "image",
      "category",
      "price",
      "rating.stars",
      "rating.count",
      "subCategory",
      "keywords",
    ],
    (schema) => schema.optional(),
  )
  .keys({
    id: Joi.string(),
    vendorId: Joi.string(),
    existing_image: existingImage_validator,
  });