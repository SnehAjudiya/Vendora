import { useAsyncError, useNavigate, useParams } from "react-router-dom";
import Button from "../../../../common-components/Button";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import {
  getCartProductById,
  updateQuantity,
} from "../../../../redux/slice/CartSlice";
import {
  ArrowLeft,
  Edit,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Trash2,
} from "lucide-react";
import { RootState } from "../../../../redux/store/store";
import { useEffect, useState } from "react";
import {
  deleteProduct,
  getProductById,
} from "../../../../redux/slice/ProductSlice";
import useDeleteModal from "../../../../hooks/useDeleteModal";
import DeletePopup from "../../../../common-components/DeletePopup";
import Dropdown from "../../../../common-components/DropDown";
import { exportProductApi } from "../../../../api/productsApi";
import UserDetails from "../Users/UserDetails";

export const EXPORT_FILE_TYPE_OPTIONS = [
  { label: ".xlsx", value: "xlsx" },
  { label: ".csv", value: "csv" },
  { label: ".pdf", value: "pdf" },
];
function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const deleteModal = useDeleteModal();

  useEffect(() => {
    if (!id) return;
    dispatch(getProductById(Number(id)));
  }, [id, dispatch]);

  const product = useAppSelector(
    (state: RootState) => state.products.selectedProduct,
  );

  useEffect(() => {
    if (!product || role !== "Customer") return;
    dispatch(getCartProductById(product?._id));
  }, [product]);

  const auth = useAppSelector((state: RootState) => state.auth);
  const role = auth.role;

  const cartProduct = useAppSelector(
    (state: RootState) => state.cart.selectedItem,
  );

  if (!id) return <div className="p-6">Invalid product</div>;

  if (!product)
    return (
      <div>
        <Button variant="secondary" onClick={() => navigate("/products")}>
          <ArrowLeft />
        </Button>
        <div className="flex justify-center items-center text-gray-500">
          Product Not Found
        </div>
      </div>
    );
  const category = product.category;
  const handleClick = () => {
    dispatch(updateQuantity({ productId: product._id, action: "i" }));
  };

  return (
    <div className="min-h-screen p-6 flex flex-col gap-5">
      <div className="flex justify-between">
        <Button
          variant="secondary"
          onClick={() => navigate("/products")}
          className="w-auto px-4 active:scale-95"
        >
          <ArrowLeft size={18} />
        </Button>
        <div className="flex gap-5">
          {/* <Button
            onClick={() => {
              if (product?.vendorId)
                popUpModal.confirm({ item: product?.vendorId, value: "" });
            }}
          >
            Contact Vendor
          </Button> */}
          <Dropdown
            label="Download"
            options={EXPORT_FILE_TYPE_OPTIONS}
            onSelect={(value) => {
              exportProductApi(Number(id), value);
            }}
            className="text-md"
          />

          <Button
            variant="secondary"
            onClick={() => navigate("/cart")}
            className="w-auto px-4 active:scale-95"
          >
            <ShoppingCart />
            <div className="text-xs bg-red-500 text-white h-4 w-4 rounded-full flex justify-center">
              {/* {totalItems} */}
            </div>
          </Button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="flex justify-center items-center bg-gray-100 rounded-lg p-6">
            <img
              src={
                typeof product.image === "string"
                  ? product.image.startsWith("http")
                    ? product.image
                    : `http://localhost:5000/uploads/${product.image}`
                  : ""
              }
              alt={product.name}
              className="w-64 h-64 object-contain"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4 items-start">
            <div className="text-3xl font-bold">{product.name}</div>
            <div className="text-gray-600">{product.description}</div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 text-sm bg-gray-100 rounded-full">
                {product.category}
              </span>
              <span className="px-3 py-1 text-sm bg-gray-100 rounded-full">
                {product.subCategory}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-green-600">
                ₹{product.price}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Star size={16} /> <span>{product.rating.stars}</span>
              <span className="text-gray-500">({product.rating.count})</span>
            </div>

            {!cartProduct && (
              <div className="flex gap-4 mt-4">
                {role === "Customer" && (
                  <Button variant="yellow" onClick={handleClick}>
                    Add to Cart
                  </Button>
                )}
                {role === "Customer" && (
                  <Button
                    variant="yellow"
                    onClick={() => navigate("/checkout")}
                  >
                    Buy Now
                  </Button>
                )}
              </div>
            )}
            {cartProduct && (
              <div className="flex items-center w-fit mt-5">
                <Button
                  variant="danger"
                  className="rounded-none"
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        productId: product._id,
                        action: "r",
                      }),
                    )
                  }
                >
                  <Trash2 size={16} />
                </Button>
                <Button
                  className="rounded-none"
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        productId: product._id,
                        action: "d",
                      }),
                    )
                  }
                >
                  <Minus size={16} />
                </Button>
                <div className="border px-5 py-1.5 font-bold text-sm">
                  {cartProduct?.quantity}
                </div>
                <Button
                  className="rounded-none"
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        productId: product._id,
                        action: "i",
                      }),
                    )
                  }
                >
                  <Plus size={16} />
                </Button>
              </div>
            )}
            <div className="flex gap-4 mt-4">
              {role !== "Customer" && (
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/products/${id}/edit`)}
                >
                  <Edit />
                </Button>
              )}
              {role !== "Customer" && (
                <Button
                  variant="danger"
                  onClick={() => deleteModal.confirmDelete(id)}
                >
                  <Trash2 />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-6">
          {product.keywords.map((tag: any) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs bg-gray-200 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
      {deleteModal.showDeleteModal && (
        <DeletePopup
          item={deleteModal.selected}
          onConfirm={() => {
            dispatch(
              deleteProduct({
                id: Number(id),
                stripeProductId: product?.stripeProductId,
              }),
            );
            navigate("/products");
          }}
          onCancel={deleteModal.cancelDelete}
        />
      )}
      <hr />
      {role === "Admin" && product?.vendorId && (
        <UserDetails vendor={product.vendorId} />
      )}
    </div>
  );
}

export default ProductDetails;
