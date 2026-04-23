import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ProductRow } from "../../components/MySite/pages/Products/ProductAddEditForm";
import {
  fetchProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  getProductByIdApi,
  uploadProductsApi,
  FetchProductsParams,
} from "../../api/productsApi";

type pagination = {
  totalDocuments: number;
  page: number;
  limit: number;
  totalPages: number;
  next?: { page: number; limit: number };
  prev?: { page: number; limit: number };
};

export interface FetchProductResponse {
  pagination: pagination;
  data: Array<ProductRow>;
}

interface ProductsState {
  products: ProductRow[];
  loading: boolean;
  error: string | null;
  selectedProduct: ProductRow | any | null;
  pagination: pagination;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
  selectedProduct: null,
  pagination: {
    totalDocuments: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    next: undefined,
    prev: undefined,
  },
};

// fetch
export const fetchProducts = createAsyncThunk<
  FetchProductResponse,
  FetchProductsParams
>("products/fetchProducts", fetchProductsApi);

// add
export const addProduct = createAsyncThunk<ProductRow, FormData>(
  "products/addProduct",
  createProductApi,
);

// update
export const updateProduct = createAsyncThunk<
  ProductRow,
  { id: number; data: FormData; stripeProductId: string }
>("products/updateProduct", updateProductApi);

// delete
export const deleteProduct = createAsyncThunk<
  number,
  { id: number; stripeProductId: string }
>("products/deleteProduct", deleteProductApi);

// fetch one
export const getProductById = createAsyncThunk<any, number>(
  "products/getProductById",
  getProductByIdApi,
);

// upload
export const uploadProducts = createAsyncThunk<ProductRow[], FormData>(
  "products/uploadProducts",
  uploadProductsApi,
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      /* FETCH */
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data || [];
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })

      /* ADD */
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        addProduct.fulfilled,
        (state, action: PayloadAction<ProductRow>) => {
          state.loading = false;
          state.products.unshift(action.payload);
        },
      )
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add product";
      })

      /* UPDATE */
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<ProductRow>) => {
          state.loading = false;

          const index = state.products.findIndex(
            (p) => p.id === action.payload.id,
          );

          if (index !== -1) {
            state.products[index] = action.payload;
          }

          state.selectedProduct = action.payload;
        },
      )
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update product";
      })

      /* DELETE */
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;

          state.products = state.products.filter(
            (p) => p.id !== action.payload,
          );
        },
      )
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete product";
      })

      /* GET BY ID */
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getProductById.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.selectedProduct = action.payload;
        },
      )
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch product";
      })

      /* UPLOAD MULTIPLE */
      .addCase(uploadProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadProducts.fulfilled, (state, action) => {
        state.loading = false;
        // const existingIds = new Set(state.products.map((p) => p._id));
        // const newProducts = action.payload.filter(
        //   (p) => !existingIds.has(p._id),
        // );
        // state.products = [...newProducts, ...state.products];
      })
      .addCase(uploadProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to upload products";
      });
  },
});

export default productsSlice.reducer;
