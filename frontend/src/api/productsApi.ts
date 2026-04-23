import api from "./axios";
import { ProductRow } from "../components/MySite/pages/Products/ProductAddEditForm";
import { FetchProductResponse } from "../redux/slice/ProductSlice";
import axios from "axios";

const mapProduct = (p: any): ProductRow => ({
  _id: p._id,
  id: p.id,
  name: p.name,
  description: p.description,
  image: p.image,
  price: p.price,
  rating: {
    stars: p.rating.stars,
    count: p.rating.count,
  },
  category: p.category,
  subCategory: p.subCategory,
  keywords: p.keywords,
  stripeProductId: p.stripeProductId,
});

export interface FetchProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categories?: string;
  subCategories?: string;
  sort?: string;
  vendorId?: string;
}

export const fetchProductsApi = async (
  params: FetchProductsParams,
): Promise<FetchProductResponse> => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sort = "",
    categories,
    subCategories,
    vendorId,
  } = params;
  try {
    const res = await api.get("/products", {
      params: {
        page,
        limit,
        search,
        sort,
        categories,
        subCategories,
        vendorId,
      },
    });
    return res.data.data;
  } catch (error) {
    return {
      pagination: {
        totalDocuments: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
      data: [],
    };
  }
};

export const createProductApi = async (data: FormData): Promise<ProductRow> => {
  const res = await api.post("/products", data);

  return mapProduct(res.data.data);
};

export const updateProductApi = async ({
  id,
  data,
  stripeProductId,
}: {
  id: number;
  data: FormData;
  stripeProductId: string;
}): Promise<ProductRow> => {
  const res = await api.put(`/products/${id}`, data, {
    params: { stripeProductId },
  });

  return mapProduct(res.data.data);
};

export const deleteProductApi = async ({
  id,
  stripeProductId,
}: {
  id: number;
  stripeProductId: string;
}): Promise<number> => {
  await api.delete(`/products/${id}`, { params: { stripeProductId } });
  return id;
};

export const getProductByIdApi = async (id: number): Promise<ProductRow> => {
  const res = await api.get(`/products/${id}`);

  return res.data.data;
};

export const uploadProductsApi = async (data: FormData) => {
  const res = await api.post(`/products/uploadProducts`, data);
  return res.data.data.map((p: any) => mapProduct(p));
};

export const exportProductApi = async (id: number, exportFileType: string) => {
  try {
    const res = await api.get(`/products/exportProduct/${id}`, {
      params: { exportFileType },
    });

    const { downloadUrl, fileName } = res.data.data;

    const fileRes = await axios.get(downloadUrl, {
      responseType: "blob",
    });

    const mimeTypes: Record<string, string> = {
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      csv: "text/csv",
      pdf: "application/pdf",
    };

    const url = window.URL.createObjectURL(
      new Blob([fileRes.data], {
        type: mimeTypes[exportFileType],
      }),
    );

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export failed:", error);
  }
};

// export const exportAllProductsApi = async (exportFileType: string) => {
//   try {
//     const res = await api.get(`/products/exportAllProducts`, {
//       params: { exportFileType },
//     });

//     const { downloadUrl } = res.data;
//     window.location.href = downloadUrl;
//   } catch (error) {
//     console.error("Export failed:", error);
//   }
// };

export const exportAllProductsApi = async (exportFileType: string) => {
  try {
    const res = await api.get(`/products/exportAllProducts`, {
      params: { exportFileType },
    });

    const { downloadUrl, fileName } = res.data.data;

    const fileRes = await axios.get(downloadUrl, {
      responseType: "blob",
    });

    const mimeTypes: Record<string, string> = {
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      csv: "text/csv",
      pdf: "application/pdf",
    };

    const url = window.URL.createObjectURL(
      new Blob([fileRes.data], {
        type: mimeTypes[exportFileType],
      }),
    );

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export failed:", error);
  }
};
