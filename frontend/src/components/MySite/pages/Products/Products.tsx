import { Link, useNavigate } from "react-router-dom";
import { Check, FunnelPlus, Plus, ShoppingCart, Upload, X } from "lucide-react";
import usePopUpModalForFilter from "../../../../hooks/usePopUpModalForFilter";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import { RootState } from "../../../../redux/store/store";
import { useEffect, useRef, useState } from "react";
import Filter from "./Filter";
import Button from "../../../../common-components/Button";
import {
  fetchProducts,
  uploadProducts,
} from "../../../../redux/slice/ProductSlice";
import Dropdown from "../../../../common-components/DropDown";
import { EXPORT_FILE_TYPE_OPTIONS } from "./ProductDetails";
import { exportAllProductsApi } from "../../../../api/productsApi";

const SORT_OPTIONS = [
  { label: "Price: ↑", value: "price desc" },
  { label: "Price: ↓", value: "price asc" },
  { label: "Rating: ↑", value: "rating desc" },
  { label: "Rating: ↓", value: "rating asc" },
];

const LABEL_OPTIONS = [
  { label: "10", value: "10" },
  { label: "15", value: "15" },
  { label: "20", value: "20" },
  { label: "25", value: "25" },
];
function Products({ vendorId }: { vendorId?: string }) {
  const popUpModal = usePopUpModalForFilter();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const filesUploadRef = useRef<HTMLInputElement | null>(null);

  const [files, setFiles] = useState<(File | string)[]>([]);
  const [filesUploadInvalidText, setFilesUploadInvalidText] = useState({
    show: false,
    text: "",
  });
  const [filesUploadError, setFilesUploadError] = useState({
    show: false,
    text: "",
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const ALLOWED_TYPES = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];
  const MAX_SIZE = 5 * 1024 * 1024;

  useEffect(() => {
    const timerId = setTimeout(() => {
      setFilesUploadInvalidText({ show: false, text: "" });
    }, 2000);
    return () => {
      clearTimeout(timerId);
    };
  }, [filesUploadInvalidText.show]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setFilesUploadError({ show: false, text: "" });
    }, 2000);
    return () => {
      clearTimeout(timerId);
    };
  }, [filesUploadError.show]);

  const categories = useAppSelector((state: RootState) =>
    Array.from(state.filter.category).join(","),
  );
  const subCategories = useAppSelector((state: RootState) =>
    Array.from(state.filter.subcategory).join(","),
  );

  useEffect(() => {
    dispatch(
      fetchProducts({
        page,
        limit,
        search,
        sort,
        categories,
        subCategories,
        vendorId,
      }),
    );
  }, [page, limit, search, sort, categories, subCategories, vendorId]);

  const { products, loading, pagination } = useAppSelector(
    (state: RootState) => state.products,
  );

  const totalPages = pagination.totalPages;
  const paginatedArray = Array(totalPages)
    .fill(0)
    .map((u, index) => index + 1);

  const handleChange = (e: any) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const role = useAppSelector((state: RootState) => state.auth.role);

  return (
    <div className="relative">
      <div className="flex justify-between p-6">
        <div className="flex capitalize font-bold text-3xl">Products</div>
        <input
          className="border border-gray-500 rounded-full px-3 py-1 text-md"
          name="filter"
          type="text"
          placeholder={`Search...`}
          onChange={handleChange}
        />

        <div className="flex gap-4">
          {role !== "Customer" && !vendorId && (
            <Button
              variant="secondary"
              className="w-auto px-4 active:scale-95"
              onClick={() => navigate("/products/add-product")}
            >
              Add Product
            </Button>
          )}
          {role === "Vendor" && (
            <div className="flex flex-col gap-1">
              <Button
                variant="secondary"
                className="w-auto px-4 active:scale-95"
                onClick={() => filesUploadRef.current?.click()}
              >
                Upload Products
              </Button>
              <input
                name="file"
                type="file"
                ref={filesUploadRef}
                placeholder="file"
                className="hidden w-0 h-0"
                multiple
                onChange={(event) => {
                  const selectedFiles = Array.from(event.target.files || []);

                  const validFiles = selectedFiles.filter((file) => {
                    if (!ALLOWED_TYPES.includes(file.type)) {
                      setFilesUploadInvalidText({
                        show: true,
                        text: `${file.name} is not XLSX`,
                      });
                      return false;
                    }

                    if (file.size > MAX_SIZE) {
                      setFilesUploadInvalidText({
                        show: true,
                        text: `${file.name} exceeds 5 MB`,
                      });
                      return false;
                    }

                    return true;
                  });

                  const combined = [...files, ...validFiles];

                  setFiles(combined);
                  event.target.value = "";
                }}
              />

              {filesUploadInvalidText.show && (
                <div className="text-red-500 text-sm">
                  {filesUploadInvalidText.text}
                </div>
              )}

              {files.map((file, index) => {
                if (!file) return null;

                const name =
                  file instanceof File
                    ? file.name
                    : file.split("-").slice(1).join("-");

                return (
                  <div
                    key={index}
                    className="text-gray-500 text-sm flex items-center align-center gap-1 ml-5 px-5 py-0.5 hover:bg-gray-100 rounded-full"
                  >
                    <button
                      type="button"
                      onClick={async () => {
                        const currentFile = files[index];

                        if (!currentFile) return;

                        const formData = new FormData();
                        formData.append("file", currentFile);

                        try {
                          const res = await dispatch(
                            uploadProducts(formData),
                          ).unwrap();
                          if (!res.length)
                            setFilesUploadError({
                              show: true,
                              text: "Invalid Upload",
                            });
                        } catch (err) {
                          setFilesUploadError({
                            show: true,
                            text: "Invalid Upload",
                          });
                        }
                        setFiles((prev) => prev.filter((_, i) => i !== index));
                      }}
                      className="rounded-full text-sm font-bold text-green-600 h-4 w-4 flex justify-center items-center"
                    >
                      <Check />
                    </button>
                    <div className="text-gray-500 text-sm hover:underline hover:cursor-pointer">
                      {name}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = files.filter((_, i) => i !== index);

                        setFiles(updated);
                      }}
                      className="rounded-full text-sm font-bold text-red-600 h-4 w-4 flex justify-center items-center"
                    >
                      <X />
                    </button>
                  </div>
                );
              })}
              {filesUploadError.show && (
                <div className="text-red-500 text-sm">
                  {filesUploadError.text}
                </div>
              )}
            </div>
          )}

          <Dropdown
            label="Download Products"
            options={EXPORT_FILE_TYPE_OPTIONS}
            onSelect={(value) => exportAllProductsApi(value)}
            className="text-sm"
          />

          <Dropdown
            label="Sort By"
            options={SORT_OPTIONS}
            onSelect={(value) => setSort(value)}
            className="text-sm"
          />

          <Button
            variant="secondary"
            className="w-auto px-4 active:scale-95"
            onClick={popUpModal.confirm}
          >
            Filter
          </Button>

          {role === "Customer" && (
            <Button
              variant="secondary"
              onClick={() => navigate("/cart")}
              className="w-auto px-4 active:scale-95"
            >
              Cart
              {/* <div className="text-xs bg-red-500 text-white h-4 w-4 rounded-full flex justify-center">
              {totalItems}
            </div> */}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-10 p-6">
        {/* {loading ? (
          <div className="text-gray-500 ">Loading Projects...</div>
        ) : products.length === 0 ? (
          <div className="text-gray-500 ">No Product Found</div>
        ) : ( */}
        {products.map((product) => {
          return (
            <Link
              key={product._id}
              to={`/products/${product.id}`}
              className="group"
            >
              <div className="h-[300px] w-[200px] rounded-lg border shadow-sm hover:shadow-md transition">
                <img
                  src={
                    typeof product.image === "string"
                      ? product.image.startsWith("http")
                        ? product.image
                        : `http://localhost:5000/uploads/${product.image}`
                      : ""
                  }
                  alt={product.name}
                  className="h-[200px] w-[200px] object-contain bg-gray-50 rounded-t-lg"
                />
                <div className="bg-gray-100 flex flex-col justify-center items-center gap-2 h-[100px] rounded-b-lg px-3">
                  <div className="text-center font-medium line-clamp-2">
                    {product.name}
                  </div>
                  <div className="text-green-600 text-lg font-semibold">
                    ₹{product.price}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <br />
      {pagination.totalDocuments > 0 && (
        <div className="flex justify-between mt-10">
          <div className="flex justify-between">
            <button
              className="border rounded font-semibold px-3 py-1 hover:bg-gray-100"
              onClick={() => page > 1 && setPage((val) => val - 1)}
            >
              Prev
            </button>
          </div>

          <Dropdown
            options={LABEL_OPTIONS}
            label="Limit"
            onSelect={(value) => {
              setLimit(Number(value));
              setPage(1);
            }}
          />
          <div className="">
            {paginatedArray.map((u) => (
              <button
                key={u}
                className={`border rounded px-3 py-1 m-1 ${page === u ? "bg-green-200" : ""}`}
                onClick={() => setPage(u)}
              >
                {u}
              </button>
            ))}
          </div>
          <button
            className="border rounded font-semibold px-3 py-1 hover:bg-gray-100"
            onClick={() => page < totalPages && setPage((val) => val + 1)}
          >
            Next
          </button>
        </div>
      )}
      {popUpModal.showPopUpModal && <Filter onCancel={popUpModal.cancel} />}
    </div>
  );
}

export default Products;
