import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allProduct: [],
  brands: [],
  GST: [],
  checkedBrand: [],
  selectedItems: [],
  categories: [],
  checkedCategory: [],
  checkedGST: [],
  deepSearch: "",
  name: "",
  sku: "",
  cart: {},
  orders: [],
  oneOrder: {},
  unApprovedCount: {},
  customerInfo: {},
  searchTerm: null,
  forceSearch: false,
  unApprovedData: {},
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setAllProducts: (state, action) => {
      state.allProduct = action.payload.data;
      state.categories = action.payload.categories;
      state.brands = action.payload.brands;
      state.GST = action.payload.GST;
    },
    setAllProductsV2: (state, action) => {
      state.categories = action.payload.filterOptions.category;
      state.brands = action.payload.filterOptions.brand;
      state.GST = action.payload.filterOptions.GST;
    },
    removeAllProducts: (state) => {
      state.allProduct = [];
      state.brands = [];
      state.categories = [];
    },
    setAllCart: (state, action) => {
      state.cart = action.payload;
    },
    setAllOrder: (state, action) => {
      state.orders = action.payload;
    },
    setOneOrder: (state, action) => {
      state.oneOrder = action.payload;
    },
    setUnApprovedCount: (state, action) => {
      state.unApprovedCount = action.payload;
    },
    setCustomerInfo: (state, action) => {
      state.customerInfo = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.forceSearch = !state.forceSearch;
    },
    clearSearchTerm: (state, action) => {
      state.searchTerm = null;
      state.forceSearch = !state.forceSearch;
    },
    setCheckedBrand: (state, action) => {
      state.checkedBrand = action.payload;
    },
    setCheckedCategory: (state, action) => {
      state.checkedCategory = action.payload;
    },
    setCheckedGST: (state, action) => {
      state.checkedGST = action.payload;
    },
    setDeepSearch: (state, action) => {
      state.deepSearch = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setSku: (state, action) => {
      state.sku = action.payload;
    },
    setSelectedItems: (state, action) => {
      state.selectedItems = action.payload;
    },
    setSelectedItems: (state, action) => {
      state.unApprovedData = action.payload;
    },
    setUnApprovedData: (state, action) => {
      state.unApprovedData = action.payload;
    },
  },
});

export const {
  setAllProducts,
  removeAllProducts,
  setAllCart,
  setUpdateCart,
  setAllOrder,
  setOneOrder,
  setUnApprovedCount,
  setCustomerInfo,
  setSearchTerm,
  clearSearchTerm,
  setAllProductsV2,
  setCheckedGST,
  setCheckedBrand,
  setCheckedCategory,
  setDeepSearch,
  setSelectedItems,
  setName,
  setSku,
  setUnApprovedData,
} = productSlice.actions;
export default productSlice.reducer;
