import { React, useEffect, useState, useRef } from "react";
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import BASEURL from "../../../constants/BaseApi";
import { saveAs } from "file-saver";
import { PRODUCT_URL } from "../../../constants/ApiEndpoints";
import { toast } from "react-toastify";
import FilterBarV2 from "../../../components/Common/FilterBarV2";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import {
  Box,
  Button,
  TablePagination,
  Typography,
  Switch,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  setStoredselectedSKU,
  removeSelectedSKU,
} from "../../../features/slice/selectedItemsSlice";
import {
  setAllProducts,
  setAllProductsV2,
} from "../../../features/slice/productSlice";

import {
  useUpdateNotationMutation,
  useGetAllProductV2Query,
  useProductAvailinEcwidMutation,
} from "../../../features/api/productApiSlice";

import Loading from "../../../components/Common/Loading";
import { useNavigate } from "react-router-dom";
import ProductStatusDownloadDialog from "./ProductStatusDownloadDialog";
import CachedIcon from "@mui/icons-material/Cached";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";

// for refresh data

const ProductStatusGrid = ({ setOpenHistory, setProductDetails }) => {
  /// initialization
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiRef = useGridApiRef();
  const debouncing = useRef();
  let MapSKU = {};

  /// global state
  const { deepSearch, checkedBrand, checkedCategory, checkedGST } = useSelector(
    (state) => state.product
  );
  const { isAdmin } = useSelector((state) => state.auth.userInfo);
  const { NewselectedSKU } = useSelector((state) => state.SelectedItems);

  /// local state
  const [rows, setRows] = useState([]);
  const [NewselectedItems, setNewSelectedItems] = useState([]);
  const [selectedSKU, setSelectedSKU] = useState([]);
  const [FilterSKU, setFilterSKU] = useState([]);
  // console.log(selectedItems.length);
  const [open, setOpen] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [loading, setLoading] = useState(false);
  const [downloadType, setDownloadType] = useState("value");
  const [StoredSKU, setStoredSKU] = useState(new Map());

  /// pagination State
  const [filterString, setFilterString] = useState("page=1");
  const [page, setPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(100);
  const [totalProductCount, setTotalProductCount] = useState(0);
  const [toggleValue, setToggleValue] = useState(false);

  /// rtk query

  const {
    data: allProductData,
    isLoading: productLoading,
    refetch,
    isFetching,
  } = useGetAllProductV2Query(filterString, {
    pollingInterval: 1000 * 300,
  });
  /// handlers

  const [notationUpdateApi, { isLoading: NotationLoading }] =
    useUpdateNotationMutation();
  //availability of sku in ecwid
  const [availProduct, { isLoading: EcwidLoading }] =
    useProductAvailinEcwidMutation();

  const handleavailEcwid = async (sku) => {
    try {
      const res = await availProduct(sku).unwrap();

      setSelectedSKU(res.product);
    } catch (error) {
      console.error("An error occurred during login:", error);
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
      toast.success(res?.message);
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  const handleExcelDownload = async (checkedItems, handleClose) => {
    setLoading(true);
    try {
      const body = {
        data: FilterSKU,
        columns: checkedItems,
        type: downloadType,
      };

      const response = await axios.post(
        `${BASEURL}${PRODUCT_URL}/ProductStatusExcel`,
        body,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, "product_status.xlsx");

      toast.success("Download Started...", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      });
    } catch (error) {
      console.error("An error occurred during download:", error);
    }
    setLoading(false);
    handleClose();
  };

  /// useEffect
  useEffect(() => {
    if (allProductData?.success) {
      const data2 = [];

      const data = allProductData?.data?.products?.map((item, index) => {
        dispatch(setStoredselectedSKU(item.SKU));
        data2.push(item.SKU);
        return {
          id:
            index +
            1 +
            (allProductData.data.currentPage - 1) * allProductData.data.limit,

          Sno:
            index +
            1 +
            (allProductData.data.currentPage - 1) * allProductData.data.limit,
          SKU: item.SKU,
          mainImage: item?.mainImage?.url,
          Name: item.Name,
          GST: item.GST,
          MRP: item.MRP,
          Quantity: item.ActualQuantity,
          LandingCost: item.LandingCost,
          SalesPrice: item.SalesPrice,
          SellerPrice: item.SellerPrice,
          Brand: item.Brand,
          isEcwidSync: item.isEcwidSync,
          isWholeSaleActive: item.isWholeSaleActive,
          isImageExist: item.mainImage?.fileId ? true : false,
        };
      });

      handleavailEcwid(data2);
      dispatch(setAllProductsV2(allProductData.data));
      setRows(data);
      setRowPerPage(allProductData.data.limit);
      setTotalProductCount(allProductData.data.totalProductCount);
      setPage(allProductData.data.currentPage);
    }
  }, [allProductData]);

  // useEffect(()=>{
  //   const NewData= (new Map(
  //     NewselectedSKU.map((item, index) => {
  //       return [index + 1, item];
  //     }))
  //   );
  //   setStoredSKU(NewData)
  // },[allProductData])

  useEffect(() => {
    dispatch(removeSelectedSKU());
  }, [checkedBrand, checkedCategory, checkedGST]);

  const handleSelectionChange = (selectionModel) => {
    const NewData = new Map(
      NewselectedSKU.map((item, index) => {
        return [index + 1, item];
      })
    );
    const FilteredSKU = selectionModel.map((item) => {
      return NewData.get(item);
    });

    setFilterSKU(FilteredSKU);

    setNewSelectedItems(selectionModel);
  };

  useEffect(() => {
    let newFilterString = "";
    checkedBrand.forEach((item, index) => {
      if (index === 0) {
        newFilterString += `brand=${item}`;
      } else {
        newFilterString += `&brand=${item}`;
      }
    });

    checkedCategory.forEach((item, index) => {
      newFilterString += `&category=${item}`;
    });

    checkedGST.forEach((item, index) => {
      if (index === 0) {
        newFilterString += `&gst=${item}`;
      } else {
        newFilterString += `&gst=${item}`;
      }
    });
    if (!checkedCategory.length && !checkedBrand.length && !checkedGST.length) {
      setFilterString(`${newFilterString}page=1`);
      return;
    }

    setFilterString(`${newFilterString}&page=1`);
  }, [checkedBrand, checkedCategory, checkedGST]);

  useEffect(() => {
    apiRef?.current?.scrollToIndexes({ rowIndex: 0, colIndex: 0 });
    clearTimeout(debouncing.current);
    if (!deepSearch) {
      setFilterString(`page=1`);
      return;
    } else {
      debouncing.current = setTimeout(() => {
        setFilterString(`deepSearch=${deepSearch}&page=1`);
      }, 1000);
    }
  }, [deepSearch]);

  const getNoImageFunc = () => {
    setFilterString("type=NoImage");
  };

  // toggle change function
  const handlechangeToShowValue = (e) => {
    setToggleValue(e.target.checked);
  };
  console.log(toggleValue);
  //Columns*******************
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.3,
      minWidth: 70,
      maxWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
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
            onClick={() => {
              setOpenHistory(true);
              setProductDetails(params.row);
            }}
          >
            {params.row.Sno}
          </div>
        );
      },
    },
    {
      field: "SKU",
      headerName: "SKU",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
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
            onClick={() => {
              navigate(`/OneProductDetails/${params.row.SKU}`);
            }}
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
      minWidth: 300,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Brand",
      headerName: "Brand",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 110,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "GST",
      headerName: "GST",
      flex: 0.3,
      minWidth: 60,
      maxWidth: 70,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      // renderCell: (params) => {
      //   const value = params.row.GST;
      //   const icon = value === 0 ? <CloseIcon /> : <CheckIcon />;
      //   const iconColor = value === 0 ? "red" : "green";

      //   return (
      //     <div
      //       style={{
      //         height: "30px",
      //         display: "flex",
      //         justifyContent: "center",
      //         alignItems: "center",
      //         color: iconColor,
      //       }}
      //     >
      //       {icon}
      //     </div>
      //   );
      // },
    },
    {
      field: "Quantity",
      headerName: "QTY",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 90,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const value = params.row.Quantity;
        const icon = value === 0 ? <CloseIcon /> : <CheckIcon />;
        const iconColor = value === 0 ? "red" : "green";

        return (
          <div
            style={{
              height: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: iconColor,
            }}
          >
            {toggleValue ? value : icon}
          </div>
        );
      },
    },
    {
      field: "MRP",
      headerName: "MRP",
      flex: 0.3,
      minWidth: 60,
      maxWidth: 70,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const value = params.row.MRP;
        const icon = value === 0 ? <CloseIcon /> : <CheckIcon />;
        const iconColor = value === 0 ? "red" : "green";

        return (
          <div
            style={{
              height: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: iconColor,
            }}
          >
            {toggleValue ? value : icon}
          </div>
        );
      },
    },
    {
      field: "LandingCost",
      headerName: "LNC",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderHeader: (params) => (
        <span title="Landing Cost No GST">{params.colDef.headerName}</span>
      ),
      renderCell: (params) => {
        const value = params.row.LandingCost;
        const icon = value === 0 ? <CloseIcon /> : <CheckIcon />;
        const iconColor = value === 0 ? "red" : "green";

        return (
          <div
            style={{
              height: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: iconColor,
            }}
          >
            {toggleValue ? value : icon}
          </div>
        );
      },
    },
    {
      field: "Landing Cost with GST",
      headerName: "LCG",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderHeader: (params) => (
        <span title="Landing Cost With GST">{params.colDef.headerName}</span>
      ),
      renderCell: (params) => {
        const value = params.row.LandingCost;
        const GSt = params.row.GST;
        const main = +(value + value * (GSt / 100)).toFixed(2);
        const icon = value === 0 ? <CloseIcon /> : <CheckIcon />;
        const iconColor = value === 0 ? "red" : "green";

        return (
          <div
            style={{
              height: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: iconColor,
            }}
          >
            {toggleValue ? main : icon}
          </div>
        );
      },
    },

    {
      field: "Sales",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Sales",
      align: "center",
      headerAlign: "center",
      minWidth: 70,
      maxWidth: 80,
      renderCell: (params) => {
        const value = params.row.SalesPrice;
        const icon = value === 0 ? <CloseIcon /> : <CheckIcon />;
        const iconColor = value === 0 ? "red" : "green";

        return (
          <div
            style={{
              height: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: iconColor,
            }}
          >
            {toggleValue ? value : icon}
          </div>
        );
      },
    },

    {
      field: "SellerPrice",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Seller",
      align: "center",
      headerAlign: "center",
      flex: 0.2,
      minWidth: 70,
      maxWidth: 80,
      editable: true,
      type: "number",
      renderCell: (params) => {
        const value = params.row.SellerPrice;
        const icon = value === 0 ? <CloseIcon /> : <CheckIcon />;
        const iconColor = value === 0 ? "red" : "green";
        return (
          <div
            style={{
              height: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: iconColor,
            }}
          >
            {toggleValue ? value : icon}
          </div>
        );
      },
    },
    {
      field: "isActive",
      headerName: `Ecwid`,
      flex: 0.3,
      minWidth: 80,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const SKU = params.row.SKU;
        const isEcwidavail = selectedSKU.includes(SKU);
        return (
          <Box
            sx={{
              "& .MuiSwitch-switchBase": {
                color: isEcwidavail ? "#EC5802" : "black",
              },
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: isEcwidavail ? "#135F04" : "",
              },
              "& .MuiSwitch-switchBase.Mui-disabled": {
                color: isEcwidavail ? "#EC5802" : "",
                opacity: 0.5,
              },
            }}
          >
            {" "}
            <Switch
              checked={params.row.isEcwidSync}
              disabled={!params.row.SalesPrice}
              onChange={(e) => {
                handleIsActiveyncUpdate(
                  params.row.SKU,
                  e.target.checked,
                  "isEcwidSync"
                );
              }}
            />
          </Box>
        );
      },
    },
    {
      field: "isImageExist",
      headerName: `WS Active`,
      flex: 0.3,
      minWidth: 80,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <div>
            {params.row.isImageExist ? (
              <Switch
                checked={params.row.isWholeSaleActive}
                disabled={!params.row.SellerPrice}
                onChange={(e) => {
                  handleIsActiveyncUpdate(
                    params.row.SKU,
                    e.target.checked,
                    "isWholeSaleActive"
                  );
                }}
              />
            ) : (
              <ImageNotSupportedIcon />
            )}
          </div>
        );
      },
    },
  ];

  /// CustomButton

  const downloadWithValueCustomButton = (
    <Button
      variant="contained"
      onClick={() => {
        if (NewselectedItems.length === 0) {
          window.alert("Please select Product First");
          return;
        }

        setDownloadType("value");
        setOpen(true);
      }}
    >
      Download with Value
    </Button>
  );

  const downloadWithTrueFalseCustomButton = (
    <Box>
      <Button
        onClick={() => {
          if (NewselectedItems.length === 0) {
            window.alert("Please select Product First");
            return;
          }

          setDownloadType("boolean");
          setOpen(true);
        }}
        variant="contained"
      >
        Download with True / False
      </Button>
      <Button
        sx={{ marginLeft: "5px" }}
        onClick={() => navigate("/updateBulkProduct")}
        variant="contained"
      >
        Bulk Update Admin
      </Button>
    </Box>
  );

  /// Custom Footer
  function CustomFooter(props) {
    const { status } = props;
    return (
      <GridToolbarContainer>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Button size="small" onClick={() => status()}>
            <CachedIcon />
          </Button>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>
              SKU available in Ecwid
            </Typography>{" "}
            <Box
              sx={{
                "& .MuiSwitch-switchBase.Mui-disabled": {
                  color: "#EC5802",
                },
              }}
            >
              {" "}
              <Switch disabled={true} />
            </Box>
            <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>
              SKU in Ecwid disabled due to missing sales price
            </Typography>{" "}
            <Box
              sx={{
                "& .MuiSwitch-switchBase.Mui-disabled": {
                  color: "#EC5802",
                  opacity: 0.5,
                },
              }}
            >
              {" "}
              <Switch disabled={true} />
            </Box>
            <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>
              SKU not available in Ecwid
            </Typography>{" "}
            <Box
              sx={{
                "& .MuiSwitch-switchBase.Mui-disabled": {
                  color: "Black",
                },
              }}
            >
              {" "}
              <Switch disabled={true} />
            </Box>
            <Box
              sx={{
                cursor: "pointer",
                display: "flex",
                gap: 1,
                alignItems: "center",
              }}
              onClick={() => getNoImageFunc()}
            >
              <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>
                Arrange By NoImage
              </Typography>{" "}
              <ImageNotSupportedIcon onClick={() => getNoImageFunc()} />
            </Box>
            {isAdmin && (
              <>
                <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>
                  Show Value Only
                </Typography>
                <Box sx={{}}>
                  {" "}
                  <Switch
                    checked={toggleValue}
                    onChange={handlechangeToShowValue}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </Box>
              </>
            )}
            
          </Box>
          <TablePagination
            component="div"
            count={totalProductCount}
            page={page - 1}
            onPageChange={(event, newPage) => {
              setPage(newPage + 1);

              let paramString = filterString;

              let param = new URLSearchParams(paramString);

              param.set("page", newPage + 1);

              let newFilterString = param.toString();

              setFilterString(newFilterString);

              apiRef?.current?.scrollToIndexes({ rowIndex: 0, colIndex: 0 });
            }}
            rowsPerPage={rowPerPage}
          />
        </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <FilterBarV2
        apiRef={apiRef}
        customButton1={isAdmin ? downloadWithValueCustomButton : ""}
        customButton2={downloadWithTrueFalseCustomButton}
        count={NewselectedItems}
      />
      <ProductStatusDownloadDialog
        open={open}
        setOpen={setOpen}
        type={downloadType}
        handleExcelDownload={handleExcelDownload}
        loading={loading}
      />
      <Loading loading={productLoading || isFetching || EcwidLoading} />
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
          "& .supercursor-app-theme--cell:hover": {
            background:
              "linear-gradient(180deg, #AA076B 26.71%, #61045F 99.36%)",
            color: "white",
            cursor: "pointer",
          },
          "& .MuiDataGrid-columnHeaderTitleContainer": {
            background: "#eee",
          },
        }}
      >
        <DataGrid
          columns={columns}
          rows={rows}
          rowHeight={40}
          apiRef={apiRef}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={handleSelectionChange}
          rowSelectionModel={NewselectedItems}
          columnVisibilityModel={hiddenColumns}
          keepNonExistentRowsSelected
          onColumnVisibilityModelChange={(newModel) =>
            setHiddenColumns(newModel)
          }
          components={{
            Footer: CustomFooter,
          }}
          slotProps={{
            footer: { status: refetch },
          }}
        />
      </Box>
    </Box>
  );
};

export default ProductStatusGrid;
