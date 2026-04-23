export const AppConstants = {
  Role: {
    Admin: "Admin",
    Vendor: "Vendor",
    Customer: "Customer",
  },

  ExportFileTypes: {
    XLSX: "xlsx",
    CSV: "csv",
    PDF: "pdf",
  },

  MulterFileFilters: {
    PNG: "image/png",
    JPEG: "image/jpeg",
    JPG: "image/jpg",
    XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },

  UploadFileNames: {
    Avatar: "avatar",
    Gallery: "gallery",
    File: "file",
    Image: "image",
  },

  ProductCategories: {
    Beauty: "Beauty & Personal Care",
    Electronics: "Electronics & Gadgets",
    Fashion: "Fashion & Apparel",
    Home: "Home & Kitchen",
    Health: "Health & Fitness",
  },

  ProductFields: {
    Category: "Category",
    SubCategory: "SubCategory",
    Keywords: "Keywords",
  },

  CartQuantity: {
    Increment: "i",
    Decrement: "d",
    RemoveItem: "r",
  },

  Stripe_Currency_IsoCodes: {
    India: "inr",
  },

  SessionModes: {
    Payment: "payment",
    Subscription: "subscription",
    Setup: "setup",
  },
}