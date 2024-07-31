import {
  React,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import FilterBarV2 from "../../../components/Common/FilterBarV2";
import { Grid, Box, Button, Switch } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setAllProductsV2 } from "../../../features/slice/productSlice";
import CachedIcon from "@mui/icons-material/Cached";
import BulkUpdateSelectorDialog from "./BulkUpdateSelectorDialog";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import {
  useUpdateProductsColumnMutation,
  useUpdateNotationMutation,
  useGetAllProductV2Query,
  useGetAllRoboProductsNewQuery,
} from "../../../features/api/productApiSlice";
import Loading from "../../../components/Common/Loading";
import UpdateStockDialog from "./UpdateStockDialog";
import productColumnData from "../../../constants/ProductColumn";
import { useSocket } from "../../../CustomProvider/useWebSocket";
import UpdateLiveCalcDialog from "./updateLiveCalcDialog";
import ColumnsExplainerDialog from "./ColumnsExplainerDialog";
import HideColumnsDialog from "./HideColumnsDialog";
import { useCreateUserHistoryMutation } from "../../../features/api/usersApiSlice";
import TablePagination from "@mui/material/TablePagination";
import { useSendMessageToAdminMutation } from "../../../features/api/whatsAppApiSlice";

import {
  setCheckedBrand,
  setCheckedCategory,
  setCheckedGST,
  setName,
  setSku,
} from "../../../features/slice/productSlice";

const Content = ({
  setOpenHistory,
  setProductDetails,
  autoHeight,
  condition,
}) => {
  /// initialization
  const dispatch = useDispatch();
  const apiRef = useGridApiRef();
  const socket = useSocket();
  const debouncing = useRef();
  /// global state
  const {
    isAdmin,
    productColumns,
    userInfo,
    hiddenColumns: latestHiddenColumns,
  } = useSelector((state) => state.auth);

  const {
    checkedBrand,
    checkedCategory,
    searchTerm,
    checkedGST,
    deepSearch,
    name,
    sku,
  } = useSelector((state) => state.product);
  /// local state
  const [rows, setRows] = useState([]);
  const [editedRows, setEditedRows] = useState([]);
  const [triggerDefault, setTriggerDefault] = useState(false);
  const [open, setOpen] = useState(false);
  const [SKU, setSKU] = useState("");
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [openBulkUpdateSelector, setOpenBulkUpdateSelector] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsData, setSelectedItemsData] = useState([]);
  const [openCalc, setOpenCalc] = useState(false);
  const [buttonType, setButtontype] = useState("");
  const [isRejectedOn, setisRejectedOn] = useState(false);
  const [buttonBlink, setButtonBlink] = useState("");

  /// pagination State
  const [filterString, setFilterString] = useState("");
  const [page, setPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(100);
  const [totalProductCount, setTotalProductCount] = useState(0);
  const [localData, setLocalData] = useState([]);

  /// rtk query
  const {
    data: allProductData,
    isLoading: productLoading,
    refetch,
    isFetching,
  } = useGetAllRoboProductsNewQuery(filterString, {
    pollingInterval: 1000 * 300,
  });

  const [updateProductsApi, { isLoading: updateProductLoading }] =
    useUpdateProductsColumnMutation();

  const [notationUpdateApi, { isLoading: NotationLoading }] =
    useUpdateNotationMutation();
  const [createUserHistoryApi] = useCreateUserHistoryMutation();
  const [sendMessageToAdmin] = useSendMessageToAdminMutation();


  function getUniqueItems(arr1, arr2, key) {
    // Combine both arrays
    const combinedArray = arr1.concat(arr2);

    // Use a Set to track unique items based on the specified key
    const uniqueItemsSet = new Set();

    // Filter the combined array to get unique items
    const uniqueItems = combinedArray.filter((item) => {
      const keyValue = item[key];
      if (!uniqueItemsSet.has(keyValue)) {
        uniqueItemsSet.add(keyValue);
        return true;
      }
      return false;
    });

    return uniqueItems;
  }

  /// handlers
  const handleSelectionChange = (selectionModel) => {
    setSelectedItems(selectionModel);

    if (selectionModel.length > selectedItems.length) {
      const newSelectedRowsData = rows.filter((item) =>
        selectionModel.includes(item.id)
      );

      const newSelectedData = getUniqueItems(
        newSelectedRowsData,
        selectedItemsData,
        "SKU"
      );

      setSelectedItemsData(newSelectedData);

    } else {
      const deletedItem = findUniqueElements(selectedItems, selectionModel);
      setSelectedItemsData((prev) => {
        return prev.filter((item) => item.SKU !== deletedItem);
      });
    }
  };

  function findUniqueElements(arr1, arr2) {
    // Create a set for the second array
    const set2 = new Set(arr2);

    // Filter the first array to get elements that are unique to it
    const uniqueElements = arr1.filter((item) => !set2.has(item));

    return uniqueElements[0];
  }

  // const handleSelectionChange = (selectionModel) => {
  //   const uniqueArray = [...new Set(selectionModel)];
  //   setSelectedItems(uniqueArray);

  //   const newSelectedRowsData = rows.filter((item) =>
  //     uniqueArray.includes(item.id)
  //   );

  //   setSelectedItemsData(newSelectedRowsData);
  // };

  // const removeSelectedItems = (id) => {
  //     const newSelectedItems = selectedItems.filter((item) => item !== id);
  //     const newSelectedRowsData = selectedItemsData.filter(
  //       (item) => item.SKU !== id
  //     );
  // console.log(newSelectedRowsData)
  //     setSelectedItemsData(newSelectedRowsData);
  //     setSelectedItems(newSelectedItems);

  // const newSelectedItemsIndex = selectedItems.findIndex(item => item === id);
  // const newSelectedRowsDataindex = selectedItemsData.findIndex(item => item.id === id);
  // const newSelectedItemsValue = selectedItems
  // const newselectedItemsDataValue = selectedItemsData
  // console.log(newSelectedItemsIndex,newSelectedRowsDataindex)
  // if (newSelectedItemsIndex !== -1 && newSelectedRowsDataindex !== -1) {
  //   selectedItems.splice(newSelectedItemsIndex, 1);
  //   selectedItemsData.splice(newSelectedRowsDataindex, 1);

  //     setSelectedItemsData(newselectedItemsDataValue);
  //     setSelectedItems(newSelectedItemsValue);

  // } else {
  //     console.log(`Item with ID ${id} not found.`);
  // }

  // };

  const handleOpenDialog = (type) => {
    setOpenCalc(true);
    setButtontype(type);
  };

  const handleSellerPrice = async () => {
    try {
      if (editedRows.length === 0) {
        return;
      }

      const newEditedRows = editedRows.reduce((result, item) => {
        const { id, field, value, name } = item;
        const existingQuery = result.find((query) => query.query === field);
        const newData = { SKU: id, value, name };

        if (existingQuery) {
          existingQuery.data.push(newData);
        } else {
          result.push({ query: field, data: [newData] });
        }

        return result;
      }, []);
      if (newEditedRows.length > 0) {
        await Promise.all(
          newEditedRows.map(async (item) => {
            const params = {
              type: item.query,
              body: { products: item.data },
            };
            const res = await updateProductsApi(params).unwrap();

            const liveStatusData = {
              message: `${userInfo.name} updated ${item.query} of ${item.data
                .map((product) => `${product.name} to ${product.value}`)
                .join(", ")} `,
              time: new Date(),
            };
            const addProductHistory = {
              userId: userInfo.adminId,
              message: liveStatusData.message,
              type: "product",
              by: "user",
              reference: {
                product: item.data.map(
                  (product) => `${product.name} to ${product.value}`
                ),
              },
            };
            socket.emit("liveStatusServer", liveStatusData);
            const historyRes = await createUserHistoryApi(addProductHistory);
            const whatsappMessage = {
              message: liveStatusData.message,
              contact: import.meta.env.VITE_ADMIN_CONTACT,
            };

            await sendMessageToAdmin(whatsappMessage).unwrap();
          })
        );
      }
      refetch();
      handleClear();
    } catch (error) {
      console.error("An error occurred Update Price Grid:");
      console.error(error);
    }
  };

  const handleIsActiveyncUpdate = async (id, status, type) => {
    try {
      const data = {
        sku: id,
        body: { data: status, type: type },
      };

      const res = await notationUpdateApi(data).unwrap();
      setRows((prevRow) => {
        return prevRow.map((item) => {
          if (item.SKU === id) {
            return { ...item, [type]: status };
          } else {
            return { ...item };
          }
        });
      });
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  const handleRowUpdate = () => {
    const ids = apiRef?.current?.state?.editRows || {};

    const outputArray = [];
    for (const [id, fields] of Object.entries(ids)) {
      for (const [field, valueObj] of Object.entries(fields)) {
        const value = Number(valueObj.value);
        const findName = rows.find((row) => row.SKU === id);
        outputArray.push({ id: id, field, value, name: findName.Name });
      }
    }

    setEditedRows(outputArray);
  };

  const handleClear = () => {
    if (editedRows.length > 0) {
      editedRows.forEach((row) => {
        apiRef.current.stopCellEditMode({
          id: row.id,
          field: row.field,
          ignoreModifications: true,
        });
      });
    }
    setEditedRows([]);
    setTriggerDefault(!triggerDefault);
  };

  /// useEffect
  useEffect(() => {
    if (allProductData?.success) {
      const data = allProductData?.data?.products?.map((item, index) => {
        return {
          id: item.SKU,
          Sno:
            index +
            1 +
            (allProductData.data.currentPage - 1) * allProductData.data.limit,
          SKU: item.SKU,
          Name: item.Name,
          LandingCost: item.LandingCost.toFixed(2),
          LandingCostWithGst: (
            (item.LandingCost / 100) *
            (100 + item.GST)
          ).toFixed(2),
          SalesPrice: item.SalesPrice.toFixed(2),
          MRP: item.MRP.toFixed(2),
          GST: item.GST,
          ThresholdQty: item.ThresholdQty,
          Mqr: item.Mqr || 0,
          Quantity: item.ActualQuantity,
          Category: item.Category,
          SalesTax: item.SalesTax.toFixed(2) || 0,
          SellerTax: item.SellerTax.toFixed(2) || 0,
          SellerPrice: item.SellerPrice.toFixed(2) || 0,
          ProfitSeller:
            !item.SellerPrice || !item.LandingCost
              ? 0
              : (
                  ((item.SellerPrice - item.LandingCost) / item.LandingCost) *
                  100
                ).toFixed(2),
          ProfitSellerWithTax: (
            ((item.SellerPrice - item.LandingCost) /
              (item.LandingCost * (1 + item.SellerTax / 100))) *
            100
          ).toFixed(2),
          ProfitSales:
            !item.SalesPrice || !item.LandingCost
              ? 0
              : (
                  ((item.SalesPrice - item.LandingCost) / item.LandingCost) *
                  100
                ).toFixed(2),
          ProfitSalesWithTax: (
            ((item.SalesPrice - item.LandingCost) /
              (item.LandingCost * (1 + item.SalesTax / 100))) *
            100
          ).toFixed(2),
          SalesPriceWithGst: item.SalesPrice
            ? ((item.SalesPrice * item.GST) / 100 + item.SalesPrice).toFixed(2)
            : 0,
          Brand: item.Brand,
          SellerPriceWithGST: item.SalesPrice
            ? ((item.SellerPrice * item.GST) / 100 + item.SellerPrice).toFixed(
                2
              )
            : 0,
          isVerifiedSellerPrice: item.isVerifiedSellerPrice,
          isRejectedSellerPrice: item.isRejectedSellerPrice,
          isVerifiedQuantity: item.isVerifiedQuantity,
          isRejectedQuantity: item.isRejectedQuantity,
          isVerifiedSalesPrice: item.isVerifiedSalesPrice,
          isRejectedSalesPrice: item.isRejectedSalesPrice,
          isVerifiedLandingCost: item.isVerifiedLandingCost,
          isRejectedLandingCost: item.isRejectedLandingCost,
          isVerifiedMRP: item.isVerifiedMRP,
          isRejectedMRP: item.isRejectedMRP,
          isEcwidSync: item.isEcwidSync,
          isWholeSaleActive: item.isWholeSaleActive,
          isImageExist: item.mainImage?.fileId ? true : false,
          competitor: item.CompetitorPrice,
        };
      });

      dispatch(setAllProductsV2(allProductData.data));

      setRows(data);
      setRowPerPage(allProductData.data.limit);
      setTotalProductCount(allProductData.data.totalProductCount);
      setPage(allProductData.data.currentPage);
    }
  }, [allProductData, triggerDefault]);

  // function for fetch data on latest query
  const fetchDataWithQuery = (query) => {
    const params = new URLSearchParams(filterString);

    if (query === "UpdatedProduct" || query === "NewArrival") {
      if (buttonBlink === query) {
        params.delete("sort");
      } else {
        params.set("sort", query);
        params.delete("type");
      }
    } else {
      if (buttonBlink === query) {
        params.delete("type");
      } else {
        params.set("type", query);
        params.delete("sort");
      }
    }

    params.set("page", "1");

    setFilterString(params.toString());
    setButtonBlink(buttonBlink === query ? null : query);
  };

  useEffect(() => {
    if (editedRows.length && rows.length) {
      const lastArrayItem = editedRows.length - 1;
      if (editedRows[lastArrayItem].field === "SellerPrice") {
        const updatedArr1 = rows?.map((item1) => {
          const matchingItem = editedRows.find(
            (item2) => item2.id === item1.id
          );

          if (matchingItem) {
            const ProfitSeller = (
              ((matchingItem.value - item1.LandingCost) / item1.LandingCost) *
              100
            ).toFixed(2);
            return {
              ...item1,
              SellerPrice: matchingItem.value,
              ProfitSeller,
            };
          }
          return item1;
        });

        setRows(updatedArr1);
      }
    }
  }, [editedRows]);

  useEffect(() => {
    const newHiddenColumns = {};

    latestHiddenColumns.forEach((column) => {
      newHiddenColumns[column] = false;
    });

    setHiddenColumns(newHiddenColumns);
  }, [latestHiddenColumns]);

  useEffect(() => {
    refetch();
    return () => {
      dispatch(setCheckedBrand([])),
        dispatch(setCheckedCategory([])),
        dispatch(setCheckedGST([])),
        dispatch(setName("")),
        dispatch(setSku(""));
      apiRef?.current?.setPage(0),
        apiRef?.current?.scrollToIndexes({ rowIndex: 0, colIndex: 0 });
    };
  }, []);

  useEffect(() => {
    let newFilterString = "";
    if (checkedBrand.length) {
      newFilterString += `brands=${checkedBrand.join(",")}`;
    }

    if (checkedCategory.length) {
      if (newFilterString) newFilterString += "&";
      newFilterString += `category=${checkedCategory.join(",")}`;
    }

    if (checkedGST.length) {
      if (newFilterString) newFilterString += "&";
      newFilterString += `gst=${checkedGST.join(",")}`;
    }

    if (!newFilterString) {
      setFilterString("page=1");
    } else {
      setFilterString(`${newFilterString}&page=1`);
    }
  }, [checkedBrand, checkedCategory, checkedGST]);

  useEffect(() => {
    if (apiRef?.current) {
      apiRef.current.scrollToIndexes({ rowIndex: 0, colIndex: 0 });
    }

    clearTimeout(debouncing.current);

    if (!name && !sku) {
      setFilterString("");
      return;
    }

    debouncing.current = setTimeout(() => {
      let newFilterString = "";
      if (name) {
        newFilterString += `name=${name}`;
      }
      if (sku) {
        if (newFilterString) newFilterString += "&";
        newFilterString += `sku=${sku}`;
      }
      setFilterString(`${newFilterString}&page=1`);
    }, 1000);

    return () => clearTimeout(debouncing.current);
  }, [name, sku]);

  //Columns*******
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 60,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "SKU",
      headerName: "SKU",
      flex: 0.3,
      minWidth: 100,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      editable: true,
      renderCell: (params) => {
        return (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            // onDoubleClick={() => {
            //   navigate(`/OneProductDetails/${params.row.SKU}`);
            // }}
          >
            {params.row.SKU}
          </div>
        );
      },
    },
    {
      field: "Name",
      headerName: "Product ",
      flex: 0.3,
      minWidth: 450,
      // maxWidth: 290,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Brand",
      headerName: "Brand",
      flex: 0.3,
      minWidth: 90,
      maxWidth: 110,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Category",
      headerName: "Category",
      flex: 0.3,
      minWidth: 90,
      maxWidth: 120,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "MRP",
      headerName: "MRP ₹",
      flex: 0.3,
      minWidth: 90,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      editable: true,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      type: "number",
      valueFormatter: (params) => `₹ ${params.value}`,
    },
    {
      field: "ThresholdQty",
      headerName: "Thld",
      flex: 0.3,
      minWidth: 60,
      maxWidth: 70,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      editable: true,
      type: "number",
      valueFormatter: (params) => `${params.value}`,
    },
    {
      field: "Quantity",
      headerName: "QTY",
      flex: 0.3,
      minWidth: 60,
      maxWidth: 70,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      type: "number",
      renderCell: (params) => {
        // for background
        const statusColor = params.row.isRejectedQuantity
          ? "#B22222"
          : !params.row.isVerifiedQuantity
          ? "#FF7F50"
          : "";
        // for text color
        const textColor = params.row.isRejectedQuantity
          ? "#fff"
          : !params.row.isVerifiedQuantity
          ? "#fff"
          : "";
        const onClick = () => {
          if (!params.row.isVerifiedQuantity) {
            return;
          }
          const product = productColumns.find(
            (productColumn) => productColumn.name === "Quantity"
          );

          if (!isAdmin && !product.isEdit) {
            return;
          }
          setSKU(params.row.SKU);
          setOpen(true);
        };
        return (
          <Button
            sx={{ background: statusColor, color: textColor }}
            onClick={onClick}
          >
            {params.row.Quantity}
          </Button>
        );
      },
    },

    {
      field: "LandingCost",
      headerName: "Cost ₹",
      flex: 0.3,
      minWidth: 150,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      editable: true,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      type: "number",
      valueFormatter: (params) => `₹ ${params.value}`,
    },
    {
      field: "GST",
      headerName: "GST %",
      flex: 0.3,
      minWidth: 60,
      maxWidth: 70,
      align: "center",
      headerAlign: "center",
      editable: true,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      type: "number",
      valueFormatter: (params) => `${params.value} %`,
    },
    {
      field: "LandingCostWithGst",
      headerName: "Cost +(gst)",
      flex: 0.3,
      minWidth: 150,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      type: "number",
      valueFormatter: (params) => `₹ ${params.value}`,
    },

    ,
  ];

  if (condition === "SalesPrice") {
    columns.push(
      {
        field: "ProfitSales",
        headerClassName: "super-app-theme--header--Sales",
        cellClassName: "super-app-theme--cell",
        headerName: "SP %",
        align: "center",
        headerAlign: "center",
        flex: 0.2,
        minWidth: 100,
        maxWidth: 80,
        type: "number",
        valueFormatter: (params) => `${params.value} %`,
        // maxWidth: 130,
      },

      {
        field: "SalesTax",
        headerClassName: "super-app-theme--header--Sales",
        cellClassName: "super-app-theme--cell",
        headerName: "ST %",
        align: "center",
        headerAlign: "center",
        flex: 0.2,
        minWidth: 100,
        maxWidth: 120,
        type: "number",
        valueFormatter: (params) => `${params.value} %`,
        // maxWidth: 130,
      },
      {
        field: "ProfitSalesWithTax",
        headerClassName: "super-app-theme--header--Sales",
        cellClassName: "super-app-theme--cell",
        headerName: "SP Tax %",
        align: "center",
        headerAlign: "center",
        flex: 0.2,
        minWidth: 100,
        maxWidth: 80,
        type: "number",
        valueFormatter: (params) =>
          `${
            isNaN(params.value) ||
            params.value === "Infinity" ||
            params.value < 0
              ? 0
              : params.value
          } %`,
        // maxWidth: 130,
      },

      {
        field: "SalesPrice",
        headerClassName: "super-app-theme--header--Sales",
        cellClassName: "super-app-theme--cell",
        headerName: "S price ₹",
        align: "center",
        headerAlign: "center",
        minWidth: 150,
        maxWidth: 200,
        type: "number",
        valueFormatter: (params) => `₹ ${params.value}`,
      },
      {
        field: "SalesPriceWithGst",
        headerClassName: "super-app-theme--header--Sales",
        cellClassName: "super-app-theme--cell",
        headerName: "Sales Price Inclu (GST) ₹",
        align: "center",
        headerAlign: "center",
        minWidth: 150,
        maxWidth: 200,
        type: "number",
        valueFormatter: (params) => `₹ ${params.value}`,
      },
      {
        field: "history",
        headerClassName: "super-app-theme--header--history",
        cellClassName: "super-app-theme--cell",
        headerName: "History",
        align: "center",
        headerAlign: "center",
        flex: 0.2,
        minWidth: 70,
        maxWidth: 90,
        renderCell: (params) => {
          return (
            <Button
              onClick={() => {
                setOpenHistory(true);
                setProductDetails(params.row);
              }}
            >
              View
            </Button>
          );
        },
      }
    );
  }

  if (condition === "SellerPrice") {
    columns.push(
      {
        field: "Mqr",
        headerName: "MQR",
        flex: 0.3,
        minWidth: 60,
        maxWidth: 70,
        align: "center",
        headerAlign: "center",
        headerClassName: "super-app-theme--header",
        cellClassName: "super-app-theme--cell",
        editable: true,
        type: "number",
        valueFormatter: (params) => `${params.value}`,
      },
      {
        field: "ProfitSeller",
        headerClassName: "super-app-theme--header--Seller",
        cellClassName: "super-app-theme--cell",
        headerName: "WP Tax %",
        align: "center",
        headerAlign: "center",
        flex: 0.2,
        minWidth: 80,
        maxWidth: 80,
        type: "number",
        valueFormatter: (params) => `${params.value} %`,
        // maxWidth: 130,
      },
      {
        field: "SellerTax",
        headerClassName: "super-app-theme--header--Seller",
        cellClassName: "super-app-theme--cell",
        headerName: "WT%",
        align: "center",
        headerAlign: "center",
        flex: 0.2,
        minWidth: 80,
        maxWidth: 80,
        type: "number",
        valueFormatter: (params) => `${params.value} %`,
        // maxWidth: 130,
      },
      {
        field: "ProfitSellerWithTax",
        headerClassName: "super-app-theme--header--Seller",
        cellClassName: "super-app-theme--cell",
        headerName: "WP%",
        align: "center",
        headerAlign: "center",
        flex: 0.2,
        minWidth: 100,
        maxWidth: 80,
        type: "number",
        valueFormatter: (params) =>
          `${
            isNaN(params.value) ||
            params.value === "Infinity" ||
            params.value < 0
              ? 0
              : params.value
          } %`,
        // maxWidth: 130,
      },
      {
        field: "SellerPrice",
        headerClassName: "super-app-theme--header--Seller",
        cellClassName: "super-app-theme--cell",
        headerName: "W price ₹",
        align: "center",
        headerAlign: "center",
        flex: 0.2,
        minWidth: 100,
        maxWidth: 100,
        type: "number",
        valueFormatter: (params) => `₹ ${params.value}`,
        // maxWidth: 130,
      },
      {
        field: "SellerPriceWithGST",
        headerClassName: "super-app-theme--header--Seller",
        cellClassName: "super-app-theme--cell",
        headerName: "W price Inc(GST) ₹",
        align: "center",
        headerAlign: "center",
        flex: 0.2,
        minWidth: 100,
        maxWidth: 100,
        type: "number",
        valueFormatter: (params) => `₹ ${params.value}`,
        // maxWidth: 130,
      },
      {
        field: "history",
        headerClassName: "super-app-theme--header--history",
        cellClassName: "super-app-theme--cell",
        headerName: "History",
        align: "center",
        headerAlign: "center",
        flex: 0.2,
        minWidth: 70,
        maxWidth: 90,
        renderCell: (params) => {
          return (
            <Button
              onClick={() => {
                setOpenHistory(true);
                setProductDetails(params.row);
              }}
            >
              View
            </Button>
          );
        },
      }
    );
  }

  /// Functions
  const getModifiedColumns = (isAdmin, productColumns, columns) => {
    if (isAdmin) {
      return columns;
    } else if (productColumns.length === 0) {
      return columns.slice(0, 5);
    } else {
      const retainedColumns = columns.filter((column) =>
        productColumns.find(
          (productColumn) => productColumn.name === column.field
        )
      );

      const isEditRetainedColumns = retainedColumns.map((item) => {
        const product = productColumns.find(
          (productColumn) => productColumn.name === item.field
        );
        if (item.field === "SalesPrice") {
          return item;
        }
        if (item.field === "SellerPrice") {
          return item;
        }
        if (item.field === "LandingCostWithGst") {
          return item;
        }

        return { ...item, editable: product?.isEdit === true ? true : false };
      });

      return columns.slice(0, 5).concat(isEditRetainedColumns);
    }
  };

  /// Custom Button
  const bulkUpdateCustomButton = (
    <Button
      variant="contained"
      onClick={() => {
        setOpenBulkUpdateSelector(true);
      }}
    >
      Bulk Update
    </Button>
  );

  const hiddenColumnCustomButton = (
    <HideColumnsDialog
      columns={getModifiedColumns(isAdmin, productColumns, columns)}
    />
  );
  const liveSalesCalcCustomButton = (isAdmin ||
    productColumns.some((col) => {
      if (col.name === "SalesPrice") {
        return col.isEdit;
      }
    })) &&
    selectedItems.length > 0 && (
      <Button onClick={handleOpenDialog.bind(null, "Sales")}>Live sales</Button>
    );

  const liveSellerCalcCustomButton = (isAdmin ||
    productColumns.some((col) => col.name === "SellerPrice")) &&
    selectedItems.length > 0 && (
      <Button onClick={handleOpenDialog.bind(null, "Seller")}>
        Live seller
      </Button>
    );

  /// Custom Footer
  const CustomFooter = (props) => {
    const { status } = props;

    const handlePageChange = (event, newPage) => {
      setPage(newPage + 1);

      let paramString = filterString;
      let param = new URLSearchParams(paramString);
      param.set("page", newPage + 1);
      let newFilterString = param.toString();

      setFilterString(newFilterString);
      apiRef?.current?.scrollToIndexes({ rowIndex: 0, colIndex: 0 });
    };

    return (
      <GridToolbarContainer>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Button size="small" onClick={() => status()}>
            <CachedIcon />
          </Button>
          <ColumnsExplainerDialog />
          <Box display="flex" gap="20px">
            {[
              {
                label: "Waiting Approval",
                query: "waitingApproval",
                color: "#FF7F50",
              },
              { label: "New Product", query: "NewArrival", color: "violet" },
              {
                label: "Update Rejected",
                query: "update",
                color: "#B22222",
                hoverColor: "#ffff",
                hoverBg: "#B22222",
              },
              {
                label: "Updated Product",
                query: "UpdatedProduct",
                color: "grey",
                hoverColor: "#ffff",
                hoverBg: "#B22222",
              },
            ].map((item) => (
              <Box
                key={item.query}
                display="flex"
                alignItems="center"
                gap="10px"
              >
                <span style={{ fontWeight: "bold" }}>{item.label}</span>
                <Button
                  sx={{
                    border: "0.5px solid black",
                    width: "25px",
                    height: "20px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    backgroundColor:
                      buttonBlink === item.query ? "white" : item.color,
                    color: item.hoverColor || "inherit",
                    "&:hover": {
                      backgroundColor: item.hoverBg || "inherit",
                      color: item.hoverColor || "inherit",
                    },
                  }}
                  onClick={() => fetchDataWithQuery(item.query)}
                />
              </Box>
            ))}
            {condition === "SalesPrice" ? (
              <Box display="flex" alignItems="center" gap="10px">
                <span style={{ fontWeight: "bold" }}>Sales Columns</span>
                <Box
                  bgcolor="#93C54B"
                  sx={{
                    border: "0.5px solid black",
                    width: "25px",
                    height: "20px",
                    borderRadius: "10px",
                  }}
                />
              </Box>
            ) : (
              <Box display="flex" alignItems="center" gap="10px">
                <span style={{ fontWeight: "bold" }}>Seller Columns</span>
                <Box
                  bgcolor="#606CF2"
                  sx={{
                    border: "0.5px solid black",
                    width: "25px",
                    height: "20px",
                    borderRadius: "10px",
                  }}
                />
              </Box>
            )}
          </Box>
          <TablePagination
            component="div"
            count={totalProductCount}
            page={page - 1}
            onPageChange={handlePageChange}
            rowsPerPage={rowPerPage}
          />
        </Box>
      </GridToolbarContainer>
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <UpdateStockDialog
        SKU={SKU}
        open={open}
        setOpen={setOpen}
        updateProductsApi={updateProductsApi}
        RefetchAll={refetch}
        loading={updateProductLoading}
        socket={socket}
        userInfo={userInfo}
      />
      <BulkUpdateSelectorDialog
        list={isAdmin ? productColumnData : productColumns}
        open={openBulkUpdateSelector}
        setOpen={setOpenBulkUpdateSelector}
      />

      <FilterBarV2
        customButton1={bulkUpdateCustomButton}
        customButton2={hiddenColumnCustomButton}
        customButton3={
          condition === "SalesPrice"
            ? liveSalesCalcCustomButton
            : liveSellerCalcCustomButton
        }
        // customButton4={liveSellerCalcCustomButton}
        count={selectedItems}
        apiRef={apiRef}
      />

      {openCalc && (
        <UpdateLiveCalcDialog
          data={selectedItemsData}
          apiRef={apiRef}
          // removeSelectedItems={removeSelectedItems}
          open={openCalc}
          setOpen={setOpenCalc}
          userInfo={userInfo}
          refetch={refetch}
          type={buttonType}
          localData={localData}
          setLocalData={setLocalData}
          setSelectedItems={setSelectedItems}
          setSelectedItemsData={setSelectedItemsData}
          selectedItemsData={selectedItemsData}
          selectedItems={selectedItems}
        />
      )}

      <Grid container>
        <Loading
          loading={productLoading || updateProductLoading || isFetching}
        />

        <Grid item xs={12} sx={{ mt: "5px" }}>
          {editedRows.length > 0 ? (
            <Box>
              <Button
                disabled={updateProductLoading}
                onClick={() => {
                  handleSellerPrice();
                }}
              >
                Save
              </Button>{" "}
              <Button onClick={handleClear}>Clear</Button>
            </Box>
          ) : (
            ""
          )}

          <Box
            sx={{
              width: "100%",
              height: "85vh",
              "& .super-app-theme--header": {
                background: "#eee",
                color: "black",
                textAlign: "center",
              },
              "& .vertical-lines .MuiDataGrid-cell": {
                borderRight: "1px solid #e0e0e0",
              },

              // "& .MuiDataGrid-columnHeaderTitleContainer": {
              //   background: "#eee",
              // },

              "& .orange": {
                backgroundColor: "#FF7F50",
                color: "#F0FFFF",
              },
              "& .red": {
                backgroundColor: "#B22222",
                color: "#F0FFFF",
              },
              " .super-app-theme--header--Sales": {
                backgroundColor: "#93C54B",
                // color: "#F0FFFF",
              },
              " .super-app-theme--header--Seller": {
                backgroundColor: "#606CF2",
                // color: "#F0FFFF",
              },
            }}
          >
            <DataGrid
              columns={getModifiedColumns(isAdmin, productColumns, columns)}
              rows={rows}
              rowHeight={40}
              autoHeight={autoHeight}
              apiRef={apiRef}
              editMode="cell"
              processRowUpdate={handleRowUpdate}
              isCellEditable={(params) => {
                if (params.field === "Quantity") {
                  return params.row.isVerifiedQuantity;
                } else if (params.field === "SellerPrice") {
                  return params.row.isVerifiedSellerPrice;
                } else if (params.field === "SalesPrice") {
                  return params.row.isVerifiedSalesPrice;
                } else if (params.field === "LandingCost") {
                  return params.row.isVerifiedLandingCost;
                } else if (params.field === "MRP") {
                  return params.row.isVerifiedMRP;
                } else if (params.field === "GST") {
                  return true;
                } else if (params.field === "ThresholdQty") {
                  return true;
                } else if (params.field === "Mqr") {
                  return true;
                }
              }}
              getCellClassName={(params) => {
                if (params.field === "Quantity") {
                  return params.row.isRejectedQuantity
                    ? "red"
                    : !params.row.isVerifiedQuantity
                    ? "orange"
                    : "";
                } else if (params.field === "SellerPrice") {
                  return params.row.isRejectedSellerPrice
                    ? "red"
                    : !params.row.isVerifiedSellerPrice
                    ? "orange"
                    : "";
                } else if (params.field === "SalesPrice") {
                  return params.row.isRejectedSalesPrice
                    ? "red"
                    : !params.row.isVerifiedSalesPrice
                    ? "orange"
                    : "";
                } else if (params.field === "LandingCost") {
                  return params.row.isRejectedLandingCost
                    ? "red"
                    : !params.row.isVerifiedLandingCost
                    ? "orange"
                    : "";
                } else if (params.field === "MRP") {
                  return params.row.isRejectedMRP
                    ? "red"
                    : !params.row.isVerifiedMRP
                    ? "orange"
                    : "";
                }

                return "";
              }}
              components={{
                Footer: CustomFooter,
              }}
              slotProps={{
                footer: { status: refetch },
              }}
              onProcessRowUpdateError={(error) => {}}
              columnVisibilityModel={hiddenColumns}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={handleSelectionChange}
              isRowSelectable={(params) => params.row.LandingCost > 0}
              rowSelectionModel={selectedItems}
              keepNonExistentRowsSelected
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Content;
