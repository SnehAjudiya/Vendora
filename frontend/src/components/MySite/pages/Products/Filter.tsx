import { useState } from "react";
import { ProductsInfo } from "../../../../Products/ProductsInfo";
import SimpleCheckbox from "../../../../common-components/SimpleCheckBox";
import { ArrowDown, ArrowRight } from "lucide-react";
import Button from "../../../../common-components/Button";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import { RootState } from "../../../../redux/store/store";
import {
  addCategory,
  addSubCategory,
  removeCategory,
  removeSubCategory,
  removeAll,
} from "../../../../redux/slice/FilterSlice";
import { fetchProducts } from "../../../../redux/slice/ProductSlice";

type FilterProps = {
  onCancel: () => void;
};
function Filter({ onCancel }: FilterProps) {
  type Product = {
    id: string;
    image: string;
    name: string;
    rating: {
      stars: number;
      count: number;
    };
    price: number;
    category: string;
    subCategory: string;
    keywords: string[];
    description: string;
  };

  type CategoryResult = {
    category: string;
    subCategories: string[];
  };

  const buildCategories = (products: Product[]): CategoryResult[] => {
    const map = products.reduce<Record<string, Set<string>>>(
      (acc, { category, subCategory }) => {
        if (!acc[category]) acc[category] = new Set();
        acc[category].add(subCategory);
        return acc;
      },
      {},
    );

    return Object.entries(map).map(([category, subCategories]) => ({
      category,
      subCategories: Array.from(subCategories),
    }));
  };

  const result = buildCategories(ProductsInfo);

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {},
  );

  const filterOptions = useAppSelector((state: RootState) => state.filter);
  const dispatch = useAppDispatch();

  const handleMarkCategory = (
    category: string,
    subCategories: string[],
    checked: boolean,
  ) => {
    if (checked) {
      dispatch(addCategory(category));
      subCategories.map((val) => dispatch(addSubCategory(val)));
    } else {
      dispatch(removeCategory(category));
      subCategories.map((val) => dispatch(removeSubCategory(val)));
    }
  };

  const handleMarkSubCategory = (
    category: string,
    subCategory: string,
    checked: boolean,
  ) => {
    if (checked) {
      dispatch(addSubCategory(subCategory));
    } else {
      dispatch(removeSubCategory(subCategory));
      dispatch(removeCategory(category));
    }
  };
  const handleClick = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const addCategories = () => {
    return Array.from(filterOptions.category).join(",");
  };

  const addSubCategories = () => {
    return Array.from(filterOptions.subcategory).join(",");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
      <button
        onClick={onCancel}
        className="bg-white h-10 w-10 rounded-full mt-10 mr-2 flex justify-center items-center"
      >
        <ArrowRight />
      </button>
      <div className="bg-white pl-5 w-[400px] h-screen overflow-y-auto">
        <div className="flex font-bold text-lg mb-5 mt-10">Categories</div>
        {result.map((value) => (
          <div key={value.category} className="mb-4">
            {/* CATEGORY ROW */}
            <div className="flex items-center justify-between cursor-pointer">
              <SimpleCheckbox
                label={value.category}
                checked={
                  filterOptions.category.findIndex(
                    (c) => c === value.category,
                  ) !== -1
                }
                onChange={(checked) =>
                  handleMarkCategory(
                    value.category,
                    value.subCategories,
                    checked,
                  )
                }
              />

              <button
                onClick={() => handleClick(value.category)}
                className="text-sm px-2"
              >
                {openCategories[value.category] ? (
                  <ArrowDown size={16} />
                ) : (
                  <ArrowRight size={16} />
                )}
              </button>
            </div>

            {openCategories[value.category] && (
              <div className="ml-5 mt-2 flex flex-col gap-1">
                {value.subCategories.map((sub) => (
                  <SimpleCheckbox
                    key={sub}
                    label={sub}
                    checked={
                      filterOptions.subcategory.findIndex((c) => c === sub) !==
                      -1
                    }
                    onChange={(checked) =>
                      handleMarkSubCategory(value.category, sub, checked)
                    }
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="flex gap-5 justify-center">
          <Button
            variant="primary"
            onClick={() => {
              dispatch(
                fetchProducts({
                  categories: addCategories(),
                  subCategories: addSubCategories(),
                }),
              );
              onCancel();
            }}
          >
            Apply
          </Button>
          <Button variant="danger" onClick={() => dispatch(removeAll())}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Filter;
