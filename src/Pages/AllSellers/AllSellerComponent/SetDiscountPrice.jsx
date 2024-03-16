import { React, useEffect, useState, useRef } from "react";
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import FilterBarV2 from "../../../components/Common/FilterBarV2";
import { Grid, Box, Button, TablePagination ,styled } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllProductV2Query } from "../../../features/api/productApiSlice";
import Loading from "../../../components/Common/Loading";
import { setAllProductsV2 } from "../../../features/slice/productSlice";
import Header from "../../../components/Common/Header";
import CachedIcon from "@mui/icons-material/Cached";
import { useNavigate } from "react-router-dom";
import AddCardIcon from '@mui/icons-material/AddCard';
import AddIcon from '@mui/icons-material/Add';
import RangeDial from "./RangeDial";
import { setHeader, setInfo } from "../../../features/slice/uiSlice";
import InfoDialogBox from "../../../components/Common/InfoDialogBox";
// for refresh data
const DrawerHeader = styled("div")(({ theme }) => ({
    ...theme.mixins.toolbar,
  }));
  
  // infoDialog box data 
  const infoDetail = [{
    name: 'Sort By Brand', 
    screenshot: (<img
      src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortBrand_productList.png?updatedAt=1703135461416"
      height={"60%"}
      width={"90%"}
    />), 
    instruction: "If you click 'Sort by Brand' and select a particular brand, you can view listings for that specific brand", 
   
  },{
    name: 'Sort By Category', 
    screenshot: (<img
      src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortcategory_productList.png?updatedAt=1703135461428"
      height={"60%"}
      width={"90%"}
    />), 
    instruction: "If you click 'Sort by Category' and select a particular category, you can view listings for that specific product", 
   
  },{
    name: 'Search', 
    screenshot: (<img
      src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/search_productList.png?updatedAt=1703135461582"
      height={"60%"}
      width={"90%"}
    />), 
    instruction: "If you click the search box, you can search for any product or brand here", 
   
  },]



const SetDiscountPrice = ({ autoHeight, text }) => {
  const description =
  "This is set Discount Price Range";
  /// initialization
  const apiRef = useGridApiRef();
  const dispatch = useDispatch();
  const debouncing = useRef();
  const navigate = useNavigate()

  /// global state
  const { isAdmin, productColumns } = useSelector((state) => state.auth);
  const { checkedBrand, checkedCategory, searchTerm, checkedGST, deepSearch } =
  useSelector((state) => state.product);

  /// local state
  const [rows, setRows] = useState([]);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [openDial, setOpenDial] = useState(false);
  const [data, setData] = useState();


const HandleSet = (params) =>{
  setOpenDial(true)
    setData(params)
}

const handleDialClose = () =>{
  setOpenDial(false)
}

const { isInfoOpen } = useSelector((state) => state.ui);

const handleClose = () => {
  dispatch(setInfo(false));
};

useEffect(() => {
  dispatch(setHeader(`Set Discount Price Range`));
}, []);

  /// pagination State
  const [filterString, setFilterString] = useState("page=1");
  const [page, setPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(50);
  const [totalProductCount, setTotalProductCount] = useState(0);

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

  /// useEffect
  useEffect(() => {

    if (allProductData?.success) {
      const data = allProductData?.data?.products?.map((item, index) => {
        return {
          id: index,
          Sno:
            index +
            1 +
            (allProductData.data.currentPage - 1) * allProductData.data.limit,
          SKU: item.SKU,
          Name: item.Name,
          LandingCost: item.LandingCost.toFixed(2),
          SalesPrice: item.SalesPrice.toFixed(2),
          MRP: item.MRP.toFixed(2),
          GST: item.GST.toFixed(0),
          SellerPrice: item.SellerPrice.toFixed(2),
          Brand: item.Brand,
          Mqr: item.Mqr,
          Quantity: item.ActualQuantity,
          bulkSellerPrice:item?.bulkSellerPrice,
          Category: item.Category,
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
        };
      });
      dispatch(setAllProductsV2(allProductData.data));
      setRows(data);
      setRowPerPage(allProductData.data.limit);
      setTotalProductCount(allProductData.data.totalProductCount);
      setPage(allProductData.data.currentPage);
    }
  }, [allProductData]);

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

  ///Columns*******************
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.3,
      minWidth: 70,
      maxWidth: 70,
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
      headerName: "Product",
      flex: 0.3,
      minWidth: 200,

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
      maxWidth: 120,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Category",
      headerName: "Category",
      flex: 0.3,
      minWidth: 150,
      maxWidth: 200,
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
      type: "number",
      valueFormatter: (params) => `${params.value} %`,
    },

    {
      field: "Mqr",
      headerName: "MQR ",
      flex: 0.3,
      minWidth: 70,
      maxWidth: 120,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      type: "number",
 
    },

    {
      field: "SalesPrice",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Sales ₹",
      align: "center",
      headerAlign: "center",
      minWidth: 150,
      maxWidth: 200,
      type: "number",
      valueFormatter: (params) => `₹ ${params.value}`,
    },

    {
      field: "SellerPrice",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Seller ₹",
      align: "center",
      headerAlign: "center",
      flex: 0.2,
      minWidth: 80,
      maxWidth: 120,
      type: "number",

      valueFormatter: (params) => `₹ ${params.value}`,
      // maxWidth: 130,
    },
    {
        field: "setrange",
        headerClassName: "super-app-theme--header",
        cellClassName: "super-app-theme--cell",
        headerName: "Set Discount Range ₹",
        align: "center",
        headerAlign: "center",
        flex: 0.2,
        minWidth: 150,
        maxWidth: 200,
        type: "number",

        renderCell: (params) => (
            <Box>
           
            {params.row.bulkSellerPrice.length > 0 ?
                <AddCardIcon
                  onClick={(event) => HandleSet(params.row)}
                  sx={{ color: "green", cursor: "pointer" }}
                /> 
                : <AddIcon onClick={(event) => HandleSet(params.row)}
                sx={{ color: "gray", cursor: "pointer" }}
                 />
            }
           
            </Box>
          ),
      },
  ];

  const getModifiedColumns = (isAdmin, productColumns, columns) => {
    if (isAdmin) {
      return columns;
    } else if (productColumns?.length === 0) {
      return columns.slice(0, 5);
    } else {
      const retainedColumns = columns.filter((column) =>
        productColumns?.find(
          (productColumn) => productColumn.name === column.field
        )
      );
      return columns.slice(0, 5).concat(retainedColumns);
    }
  };

  /// Custom Footer
  function CustomFooter(props) {
    const { status } = props;

    return (
      <GridToolbarContainer>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Button size="small" onClick={() => status()}>
            <CachedIcon />
          </Button>
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
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
              <DrawerHeader />
      {/* <Header Name={"Set Discount Price Range"}
      info={true}
      customOnClick={handleOpen}/> */}
      <FilterBarV2 apiRef={apiRef}  />

      <Grid container>
        <Loading loading={productLoading || isFetching} />

        <Grid item xs={12} sx={{ mt: "5px" }}>
          <Box
            sx={{
              width: "100%",
              height: "78vh",
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
              position: "relative",
            }}
          >
            <DataGrid
              columns={getModifiedColumns(isAdmin, productColumns, columns)}
              rows={rows}
              rowHeight={40}
              autoHeight={autoHeight}
                           apiRef={apiRef}
              columnVisibilityModel={hiddenColumns}
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
        </Grid>
      </Grid>
    { openDial && <RangeDial
         open={openDial}
         close={handleDialClose}
         data={data}
         refetch={refetch}
      /> }
            <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
    
      />
    </Box>
  );
};

export default SetDiscountPrice;
