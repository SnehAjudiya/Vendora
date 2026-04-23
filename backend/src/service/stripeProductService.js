import { AppConstants } from '../constant/appConstants.js';
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// Stripe Create Product
export const stripe_create_product = async (product, image) => {
  const stripeProduct = await stripe.products.create({

    name: product.name,
    // images: [(image)],
    description: product.description,

    default_price_data: {
      currency: AppConstants.Stripe_Currency_IsoCodes.India,
      unit_amount: product.price * 100,
    },

    metadata: {
      [AppConstants.ProductFields.Category]: product.category,
      [AppConstants.ProductFields.SubCategory]: product.subCategory,
      [AppConstants.ProductFields.Keywords]: product.keywords.join(", "),
    }
  })

  return stripeProduct.id;
}

// Stripe Update Product
export const stripe_update_product = async (product, image, productId) => {
  let updateFields = {};
  updateFields.metadata = {};

  if (product) {
    // update only necessary fields
    if (product.name) updateFields.name = product.name;
    if (image) updateFields.images = [image];
    if (product.description) updateFields.description = product.description;
    if (product.category) {
      updateFields.metadata[AppConstants.ProductFields.Category] = product.category;
    }
    if (product.subCategory) {
      updateFields.metadata[AppConstants.ProductFields.SubCategory] = product.subCategory;
    }
    if (product.keywords) {
      updateFields.metadata[AppConstants.ProductFields.Keywords] = product.keywords.join(", ");
    }

    // price create new -> set default -> list -> archive old
    if (product.price) {
      const newPrice = await stripe.prices.create({
        unit_amount: product.price * 100,
        currency: AppConstants.Stripe_Currency_IsoCodes.India,
        product: productId,
        active: true,
      })

      await stripe.products.update(productId, {
        default_price: newPrice.id,
      })

      const allPrices = await stripe.prices.list({
        product: productId
      })

      allPrices.data.map(async (price) => {
        if (price.id !== newPrice.id) {
          await stripe.prices.update(price.id, {
            active: false
          })
        }
      })
    }
  }

  const stripeProduct = await stripe.products.update(productId, updateFields);
  return stripeProduct.id;
}

// Stripe Delete Product
export const stripe_delete_product = async (productId) => {
  const deletedProduct = stripe.products.update(productId, {
    active: false,
  });

  return deletedProduct;
}

// Stripe Fetch List
export const stripe_fetch_products = async () => {
  const stripeProductList = await stripe.products.list({
    active: true,
  })

}

export const stripe_retrieve_product = async (productId) => {
  const stripeProduct = await stripe.products.retrieve(productId);

  return stripeProduct;
}

export const stripe_create_product_with_recurring_price = async (product, image) => {
  const stripeProduct = await stripe.products.create({

    name: product.name,
    // images: [(image)],
    // description: product.description,

    default_price_data: {
      recurring: {
        interval: product.interval,
        interval_count: product.interval_count,
      },
      currency: AppConstants.Stripe_Currency_IsoCodes.India,
      unit_amount: product.price * 100,
    },


  })

  return stripeProduct.id;
}