import api from "./axios";

export const fetchCartApi = async () => {
  const res = await api.get("/cart");

  return res.data.data;
};

export interface UpdateQuantityParams {
  productId?: string;
  action: "i" | "d" | "r";
}

export const updateQuantityApi = async (params: UpdateQuantityParams) => {
  const { productId, action } = params;

  const res = await api.put(
    `/cart/updateQuantity/${productId}`,
    {},
    {
      params: {
        action: action,
      },
    },
  );

  return { data: res.data.data, productId: productId, action: action };
};

export const getCartProductByIdApi = async (productId: string) => {
  const res = await api.get(`/cart/getCartProductById/${productId}`);

  return res.data.data;
};

export const clearCartApi = async () => {
  const res = await api.delete(`/cart/removeAll`);

  return res.data.data;
};
