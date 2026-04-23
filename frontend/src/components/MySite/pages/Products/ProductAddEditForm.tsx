import { useEffect, useRef, useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";

import FormInput from "../../../../common-components/FormInput";
import FormSelect from "../../../../common-components/FormSelect";
import Button from "../../../../common-components/Button";

import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import {
  addProduct,
  updateProduct,
  getProductById,
} from "../../../../redux/slice/ProductSlice";
import { RootState } from "../../../../redux/store/store";

import useImagePopUpModal from "../../../../hooks/useImagePopUpModal";
import ImagePopup from "../../../../common-components/ImagePopUp";
import { fetchUsers } from "../../../../redux/slice/UsersSlice";

export type ProductRow = {
  _id?: string;
  vendor?: string;
  id: number;
  name: string;
  description: string;
  image: File | string | null;
  price: number;
  category: string;
  subCategory: string;
  keywords: string[];
  rating: {
    stars: number;
    count: number;
  };
  stripeProductId?: string;
};

export type CreateProductPayload = {
  vendor?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subCategory: string;
  keywords: string;
  image: File | null;
};

const CATEGORY_OPTIONS = [
  { label: "Health & Fitness", value: "Health & Fitness" },
  { label: "Electronics & Gadgets", value: "Electronics & Gadgets" },
  { label: "Home & Kitchen", value: "Home & Kitchen" },
  { label: "Fashion & Apparel", value: "Fashion & Apparel" },
  { label: "Beauty & Personal Care", value: "Beauty & Personal Care" },
];

export default function ProductAddEditForm() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const role = useAppSelector((state: RootState) => state.auth.role);

  const imagePopUpModal = useImagePopUpModal();

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const [image, setImage] = useState<File | string>("");

  const [imageUploadInvalidText, setImageUploadInvalidText] = useState({
    show: false,
    text: "",
  });

  const [initialProduct, setInitialProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(isEditMode);

  const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
  const MAX_SIZE = 2 * 1024 * 1024;

  const selectedProduct = useAppSelector(
    (state: RootState) => state.products.selectedProduct,
  );

  const vendors = useAppSelector((state: RootState) => state.users.users);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setImageUploadInvalidText({ show: false, text: "" });
    }, 2000);
    return () => {
      clearTimeout(timerId);
    };
  }, [imageUploadInvalidText]);

  useEffect(() => {
    if (id) dispatch(getProductById(Number(id)));
  }, [id]);

  useEffect(() => {
    if (role === "Admin") dispatch(fetchUsers({ userRole: "Vendor" }));
  }, [role]);

  const VENDOR_OPTIONS: { label: string; value: string }[] = [];
  if (role === "Admin") {
    vendors.map((u) => {
      VENDOR_OPTIONS.push({ label: u.fullName, value: String(u.id) });
    });
  }

  useEffect(() => {
    if (!isEditMode || !selectedProduct) return;

    setInitialProduct(selectedProduct);
    setLoading(false);

    if (selectedProduct.image) {
      setImage(selectedProduct.image);
    }
  }, [selectedProduct]);

  const initialValues: CreateProductPayload = initialProduct
    ? {
        vendor: initialProduct.vendorId?.fullName || "",
        name: initialProduct.name,
        description: initialProduct.description,
        price: initialProduct.price,
        category: initialProduct.category,
        subCategory: initialProduct.subCategory,
        keywords: initialProduct.keywords?.join(", "),
        image: null,
      }
    : {
        vendor: "",
        name: "",
        description: "",
        price: 0,
        category: "",
        subCategory: "",
        keywords: "",
        image: null,
      };

  const validationSchema = Yup.object({
    vendor: Yup.string().when([], {
      is: () => role === "Admin",
      then: (schema) => schema.required("Please select vendor"),
      otherwise: (schema) => schema.notRequired(),
    }),
    name: Yup.string().required("Product name required"),
    description: Yup.string().required("Description required"),
    price: Yup.number().min(0.0001).required("Price required"),
    category: Yup.string().required("Category required"),
    subCategory: Yup.string().required("Subcategory required"),
  });

  const handleSubmit = async (
    values: CreateProductPayload,
    helpers: FormikHelpers<CreateProductPayload>,
  ) => {
    const { setSubmitting } = helpers;

    const formData = new FormData();
    formData.append("vendor", values.vendor ? values.vendor : "");
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", String(values.price));
    formData.append("category", values.category);
    formData.append("subCategory", values.subCategory);

    values.keywords
      .split(",")
      .map((k) => k.trim())
      .forEach((k) => formData.append("keywords", k));

    if (image instanceof File) {
      formData.append("image", image);
    }

    if (!(image instanceof File)) {
      formData.append("existing_image", image);
    }

    if (isEditMode && initialProduct) {
      await dispatch(
        updateProduct({
          id: initialProduct.id,
          data: formData,
          stripeProductId: selectedProduct?.stripeProductId,
        }),
      );
    } else {
      await dispatch(addProduct(formData));
    }

    if (isEditMode) navigate(`/products/${id}`);
    else navigate("/products");
    setSubmitting(false);
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <h2 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit Product" : "Add Product"}
      </h2>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="bg-white rounded-lg p-6 flex flex-col gap-4">
            {role === "Admin" && (
              <FormSelect
                label="Vendor"
                name="vendor"
                options={VENDOR_OPTIONS}
                required
              />
            )}
            <FormInput label="Product Name" name="name" required />

            <FormInput label="Description" name="description" required />

            <FormInput label="Price" name="price" type="number" required />

            <FormSelect
              label="Category"
              name="category"
              options={CATEGORY_OPTIONS}
              required
            />

            <FormInput label="Sub Category" name="subCategory" required />

            <FormInput
              label="Keywords"
              name="keywords"
              placeholder="gym, fitness, protein"
            />

            {/* IMAGE */}
            <div className="flex flex-col gap-1">
              <Button
                type="button"
                variant="secondary"
                onClick={() => imageInputRef.current?.click()}
              >
                Upload Product Image
              </Button>
              <input
                name="image"
                type="file"
                ref={imageInputRef}
                placeholder="image"
                className="hidden w-0 h-0"
                accept="image/*"
                onChange={(event: any) => {
                  const file = event.target.files?.[0];
                  if (!file) return;

                  if (!ALLOWED_TYPES.includes(file.type)) {
                    setImageUploadInvalidText({
                      show: true,
                      text: `${file.name} is not PNG/JPG/JPEG`,
                    });
                    event.target.value = "";
                    return;
                  }

                  if (file.size > MAX_SIZE) {
                    setImageUploadInvalidText({
                      show: true,
                      text: `${file.name} exceeds 2 MB`,
                    });
                    event.target.value = "";
                    return;
                  }

                  setImageUploadInvalidText({ show: false, text: "" });

                  setImage(file);
                  setFieldValue("image", file);
                }}
              />

              {imageUploadInvalidText.show && (
                <div className="text-red-500 text-sm">
                  {imageUploadInvalidText.text}
                </div>
              )}

              {image && (
                <div
                  className="text-sm text-gray-500 cursor-pointer hover:underline"
                  onClick={() => {
                    const path =
                      image instanceof File
                        ? URL.createObjectURL(image)
                        : `http://localhost:5000/uploads/${image}`;

                    imagePopUpModal.confirmImagePopUp(path);
                  }}
                >
                  {image instanceof File
                    ? image.name
                    : image.split("-").slice(1).join("-")}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isEditMode ? "Update Product" : "Create Product"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  isEditMode
                    ? navigate(`/products/${id}`)
                    : navigate("/products");
                }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Formik>

      {imagePopUpModal.showImagePopUpModal && (
        <ImagePopup
          item={imagePopUpModal.selected}
          onCancel={imagePopUpModal.cancelImagePopUp}
        />
      )}
    </div>
  );
}
