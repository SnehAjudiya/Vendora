import { MESSAGES } from "../../constant/messages.js";
import { StatusCodes } from "../../constant/statusCodes.js";
import { createProduct_validation_schema } from "../../validation/Validation Schema/Product_Validation.js";
import productsModel from "../../models/Products.js";
import { CommonResponse } from "../../constant/commonResponse.js";
import XLSX from "xlsx";
import fs from "fs";
import { searchFields_Product } from "../../constant/searchFields.js";
import PDFDocument from "pdfkit";
import userModel from "../../models/Users.js";
import { AppConstants } from "../../constant/appConstants.js";

import { stripe_create_product, stripe_delete_product, stripe_fetch_products, stripe_update_product } from "../../service/stripeProductService.js";

// helper
const badRequest = (res, message) =>
  res
    .status(StatusCodes.BAD_REQUEST)
    .json(CommonResponse.Bad_Request({}, message));

// FETCH ALL
export const fetchProducts = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, categories, subCategories, sort, vendorId } = req.query;

    // search
    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: searchFields_Product.map((field) => ({
          [field]: { $regex: search, $options: "i" },
        })),
      };
    }

    // filter - category, subCategory
    let filterQuery = {};
    if (categories) {
      filterQuery.category = {
        $in: categories.split(",").map((u) => u.trim()),
      };
    }

    if (subCategories) {
      filterQuery.subCategory = {
        $in: subCategories.split(",").map((u) => u.trim()),
      };
    }

    // sort
    let sortQuery = {};
    if (sort) {
      const fields = sort.split(",");
      fields.map((f) => {
        const sortField = f.trim().split(" ")[0];
        const sortMethod = f.trim().split(" ")[1];
        sortQuery[sortField] = sortMethod === "asc" ? 1 : -1;
      });
    }

    // if admin => vendor id is selected 
    const vendorProductsId =
      role === AppConstants.Role.Vendor
        ? { vendorId: id }
        : role === AppConstants.Role.Admin
          ? vendorId
            ? { vendorId: vendorId }
            : {}
          : {};

    // whole query
    const query = {
      isDeleted: false,
      ...filterQuery,
      ...searchQuery,
      ...vendorProductsId,
    };

    stripe_fetch_products();

    // total documents
    const totalDocuments = await productsModel.countDocuments(query);

    const data = await productsModel
      .find(query, {
        id: 1,
        image: 1,
        name: 1,
        "rating.stars": 1,
        "rating.count": 1,
        price: 1,
        category: 1,
        subCategory: 1,
        keywords: 1,
        description: 1,
        stripeProductId: 1
      })
      .skip(skip)
      .sort(sortQuery)
      .limit(limit);

    if (!data?.length) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(CommonResponse.Not_Found({}, MESSAGES.PRODUCT.NOT_FOUND));
    }

    return res.status(StatusCodes.OK).json(
      CommonResponse.Success(
        {
          data,
          pagination: {
            totalDocuments,
            page,
            limit,
            totalPages: Math.ceil(totalDocuments / limit),
          },
        },
        MESSAGES.PRODUCT.FETCH_ALL,
      ),
    );
  } catch (error) {
    next(error);
  }
};

// CREATE NEW
export const createProduct = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    const newProduct = req.body;

    if (!newProduct) return badRequest(res, MESSAGES.PRODUCT.NOT_FOUND);

    // image of product => existing "image" or from file
    const image = req.file
      ? req.file.filename
      : newProduct.image
        ? newProduct.image
        : null;
    const lastProduct = await productsModel.findOne().sort({ id: -1 });
    const nextId = lastProduct ? lastProduct.id + 1 : 1;

    let vendorProductsId = {};
    if (role === AppConstants.Role.Admin) {
      const vendorUser = await userModel.findOne(
        { id: newProduct.vendor },
      );

      if (!vendorUser) {
        return badRequest(res, MESSAGES.PRODUCT.VENDOR_NOT_FOUND);
      }

      vendorProductsId = { vendorId: vendorUser._id };
      delete newProduct.vendor;
    } else if (role === AppConstants.Role.Vendor) {
      vendorProductsId = { vendorId: id };
    }

    // const stripeProductId = await stripe_create_product(newProduct, image);
    const stripeProductId = await stripe_create_product(newProduct, image);

    const addedProduct = await productsModel.create({
      ...newProduct,
      ...vendorProductsId,
      id: nextId,
      image,
      stripeProductId,
    });

    res
      .status(StatusCodes.CREATED)
      .json(CommonResponse.Created(addedProduct, MESSAGES.PRODUCT.CREATED));
  } catch (error) {
    next(error);
  }
};

// GET BY ID
export const getProductById = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    const productId = req.params.id;
    const vendorProductsId = role === AppConstants.Role.Vendor ? { vendorId: id } : {};
    let query = productsModel.findOne(
      { ...vendorProductsId, id: productId, isDeleted: false },
      {

        id: 1,
        image: 1,
        name: 1,
        "rating.stars": 1,
        "rating.count": 1,
        price: 1,
        category: 1,
        subCategory: 1,
        keywords: 1,
        description: 1,
        stripeProductId: 1,
      },
    );

    if (role === AppConstants.Role.Admin) query = query.populate("vendorId");

    const product = await query;

    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(CommonResponse.Not_Found({}, MESSAGES.PRODUCT.NOT_FOUND));
    }

    res
      .status(StatusCodes.OK)
      .json(CommonResponse.Success(product, MESSAGES.PRODUCT.FETCH));
  } catch (error) {
    next(error);
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    const productId = req.params.id;
    const updateData = req.body;
    const { stripeProductId } = req.query;

    const product = await productsModel.findOne({
      ...(role === AppConstants.Role.Vendor ? { vendorId: id } : {}),
      id: productId,
      isDeleted: false,
    });

    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(CommonResponse.Not_Found({}, MESSAGES.PRODUCT.NOT_FOUND));
    }

    const _id = product._id;
    let image = req.file ? req.file.filename : null;
    if (updateData.existing_image && image === null)
      image = updateData.existing_image;

    const imageField = image ? { image: image } : { image: product.image };

    let vendorProductsId = {};
    if (role === AppConstants.Role.Admin && updateData.vendor) {
      const vendorUser = await userModel.findOne(
        { id: updateData.vendor },
        { _id: 1 },
      );

      if (!vendorUser) {
        return badRequest(res, MESSAGES.PRODUCT.VENDOR_NOT_FOUND);
      }

      vendorProductsId = { vendorId: vendorUser._id };
      delete updateData.vendor;
    } else if (role === AppConstants.Role.Vendor) {
      vendorProductsId = { vendorId: id };
    }

    await stripe_update_product(updateData, image, stripeProductId);

    const updatedProduct = await productsModel.findByIdAndUpdate(
      _id,
      { ...updateData, ...vendorProductsId, ...imageField },
      { new: true },
    );

    if (!updatedProduct) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          CommonResponse.Not_Found(updatedProduct, MESSAGES.PRODUCT.NOT_FOUND),
        );
    }

    res
      .status(StatusCodes.OK)
      .json(CommonResponse.Success(updatedProduct, MESSAGES.PRODUCT.UPDATED));
  } catch (error) {
    next(error);
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    const productId = req.params.id;
    const { stripeProductId } = req.query;
    const vendorProductsId = role === AppConstants.Role.Vendor ? { vendorId: id } : {};

    const product = await productsModel.findOne(
      { ...vendorProductsId, id: productId, isDeleted: false },
      { _id: 1 },
    );

    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(CommonResponse.Not_Found({}, MESSAGES.PRODUCT.NOT_FOUND));
    }

    const _id = product._id;

    await stripe_delete_product(stripeProductId);

    const deletedProduct = await productsModel.findByIdAndUpdate(
      _id,
      { isDeleted: true },
      { new: true },
    );

    if (!deletedProduct) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(CommonResponse.Not_Found({}, MESSAGES.PRODUCT.NOT_FOUND));
    }

    res
      .status(StatusCodes.OK)
      .json(CommonResponse.Success({}, MESSAGES.PRODUCT.DELETED));
  } catch (error) {
    next(error);
  }
};

// UPLOAD PRODUCTS
export const uploadProducts = async (req, res, next) => {
  try {
    if (!req.file) {
      return badRequest(res, MESSAGES.PRODUCT.NOT_UPLOADED);
    }
    if (!req.file.originalname.endsWith(AppConstants.ExportFileTypes.XLSX)) {
      return badRequest(res, MESSAGES.PRODUCT.FILE_VALIDATION_FAILED);
    }

    const filePath = req.file.path;

    let workbook;

    try {
      workbook = XLSX.readFile(req.file.path);
    } catch (err) {
      return badRequest(res, MESSAGES.PRODUCT.INVALID_OR_CORRUPTED);
    }

    if (!workbook.SheetNames || !workbook.SheetNames.length) {
      return badRequest(res, MESSAGES.PRODUCT.DATA_NOT_FOUND);
    }
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    if (!worksheet) {
      return badRequest(res, MESSAGES.PRODUCT.INVALID_OR_CORRUPTED);
    }

    const rows = XLSX.utils.sheet_to_json(worksheet);
    if (!rows.length) {
      return badRequest(res, MESSAGES.PRODUCT.DATA_NOT_FOUND);
    }

    const requiredColumns = [
      "image",
      "name",
      "rating_stars",
      "rating_count",
      "price",
      "category",
      "subCategory",
      "keywords",
      "description",
    ];

    const fileColumns = Object.keys(rows[0]);
    const missingColumns = requiredColumns.filter(
      (col) => !fileColumns.includes(col),
    );

    if (missingColumns.length > 0) {
      return badRequest(res, `Missing columns: ${missingColumns.join(", ")}`);
    }

    const extraColumns = fileColumns.filter(
      (col) => !requiredColumns.includes(col),
    );

    if (extraColumns.length > 0) {
      return badRequest(res, `Unexpected columns: ${extraColumns.join(", ")}`);
    }

    let products = [];

    const lastProduct = await productsModel.findOne().sort({ id: -1 });
    let nextId = lastProduct ? lastProduct.id + 1 : 1;

    const { id, role } = req.user;

    for (const row of rows) {
      const product = {
        image: row.image,
        name: row.name,
        rating: {
          stars: row.rating_stars,
          count: row.rating_count,
        },
        price: row.price ? Number(row.price) : undefined,
        category: row.category,
        subCategory: row.subCategory,
        keywords: row.keywords
          ? row.keywords.split(",").map((k) => k.trim())
          : [],
        description: row.description,
      };

      const { error, value } = createProduct_validation_schema.validate(product, {
        abortEarly: true,
      });

      if (error) {
        return badRequest(res, error);
      }

      if (role === AppConstants.Role.Vendor) {
        value.vendorId = id;
      }

      value.id = nextId++;

      const stripeProductId = await stripe_create_product(value, value.image);

      value.stripeProductId = stripeProductId;

      products.push(value);
    }

    if (products.length > 0) {
      await productsModel.insertMany(products, { ordered: false });
    }

    try {
      fs.unlink(filePath);
    } catch (err) {
      console.error("File delete failed:", err.message);
    }

    return res
      .status(StatusCodes.OK)
      .json(CommonResponse.Success(products, MESSAGES.PRODUCT.BULK_UPLOAD));
  } catch (error) {
    next(error);
  }
};

// EXPORT PRODUCT
export const exportProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { exportFileType } = req.query;

    const fileTypeOptions = Object.values(AppConstants.ExportFileTypes);

    if (!fileTypeOptions.find((f) => f === exportFileType)) {
      return badRequest(res, MESSAGES.PRODUCT.EXPORT_FILE_TYPE_INVALID);
    }

    const product = await productsModel
      .findOne(
        { id },
        {
          _id: 0,
          image: 1,
          name: 1,
          rating: {
            stars: 1,
            count: 1,
          },
          price: 1,
          category: 1,
          subCategory: 1,
          keywords: 1,
          description: 1,
        },
      )
      .lean();

    if (!product) return badRequest(res, MESSAGES.PRODUCT.NOT_FOUND);


    const exportData = [
      {
        image: product.image,
        name: product.name,
        description: product.description,
        price: product.price,
        rating_stars: product.rating.stars,
        rating_count: product.rating.count,
        category: product.category,
        subCategory: product.subCategory,
        keywords: product.keywords.join(","),
      },
    ];

    const productName = product.name.replaceAll(" ", "_");
    const fileName = `${productName}.${exportFileType}`;

    if (!fs.existsSync("exports")) {
      fs.mkdirSync("exports");
    }
    const filePath = `exports/${fileName}`;
    if (exportFileType !== AppConstants.ExportFileTypes.PDF) {
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Product");
      XLSX.writeFile(workbook, filePath);
    } else {
      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream(filePath));
      doc.fontSize(25).text("Product List", 100, 100);

      doc.moveDown();

      exportData.map((product) => {
        doc.text(product.name);
        doc.text(product.price);
        doc.text(product.description);
      });
      doc.end();
    }
    const downloadUrl = `http://localhost:5000/exports/${fileName}`;

    return res
      .status(StatusCodes.OK)
      .json(
        CommonResponse.Success(
          { fileName: fileName, downloadUrl: downloadUrl },
          MESSAGES.PRODUCT.EXPORTED,
        ),
      );
  } catch (error) {
    next(error);
  }
};

// EXPORT ALL PRODUCTS
export const exportAllProducts = async (req, res, next) => {
  try {
    const { exportFileType } = req.query;
    const fileTypeOptions = Object.values(AppConstants.ExportFileTypes)

    if (!fileTypeOptions.find((f) => f === exportFileType)) {
      return badRequest(res, MESSAGES.PRODUCT.EXPORT_FILE_TYPE_INVALID);
    }

    const products = await productsModel
      .find(
        {},
        {
          _id: 0,
          image: 1,
          name: 1,
          "rating.stars": 1,
          "rating.count": 1,
          price: 1,
          category: 1,
          subCategory: 1,
          keywords: 1,
          description: 1,
        },
      )
      .lean();

    if (!products) return badRequest(res, MESSAGES.PRODUCT.NOT_FOUND);

    const exportData = products.map((product) => ({
      image: product.image,
      name: product.name,
      description: product.description,
      price: product.price,
      rating_stars: product.rating.stars,
      rating_count: product.rating.count,
      category: product.category,
      subCategory: product.subCategory,
      keywords: product.keywords.join(","),
    }));

    const fileName = `All_Products.${exportFileType}`;

    if (!fs.existsSync("exports")) {
      fs.mkdirSync("exports");
    }
    const filePath = `exports/${fileName}`;

    if (exportFileType !== AppConstants.ExportFileTypes.PDF) {
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
      XLSX.writeFile(workbook, filePath);
    } else {
      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream(filePath));
      doc.fontSize(25).text("All Products List", 100, 100);

      doc.moveDown();

      exportData.map((product) => {
        doc.text(product.name);
        doc.text(product.price);
        doc.text(product.description);
      });
      doc.end();
    }

    const downloadUrl = `http://localhost:5000/exports/${fileName}`;

    return res
      .status(StatusCodes.OK)
      .json(
        CommonResponse.Success(
          { fileName: fileName, downloadUrl: downloadUrl },
          MESSAGES.PRODUCT.EXPORTED,
        ),
      );
  } catch (error) {
    next(error);
  }
};
