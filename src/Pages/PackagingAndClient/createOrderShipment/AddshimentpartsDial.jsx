import { React, useEffect, useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogContent,
  Button,
  TextField,
  Box,
  Grid,
  Typography,
  CircularProgress,
  styled,
  InputAdornment,
  Autocomplete,
  Popover,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
  FormControlLabel,
  TablePagination,
  DialogTitle
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";

import { setAddparts } from "../../../features/slice/R&DSlice";
import { useDispatch, useSelector } from "react-redux";
import { setAllProductsV2 } from "../../../features/slice/productSlice";
import {
  removeSelectedCreateQuery,
  setSelectedCreateQuery,
  setSelectedSkuQuery,
  removeSelectedSkuQuery,
} from "../../../features/slice/selectedItemsSlice";
import FilterBarV2 from "../../../components/Common/FilterBarV2";
import { useGetAllProductV2Query } from "../../../features/api/productApiSlice";
import Loading from "../../../components/Common/Loading";
import InfoDialogBox from "../../../components/Common/InfoDialogBox";
import { setHeader, setInfo } from "../../../features/slice/uiSlice";
import AddshimentpartsDial from "./AddshimentpartsDial";
import CachedIcon from "@mui/icons-material/Cached";
import { useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import './Addship.css'


import { toast } from "react-toastify";
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
} from "@mui/x-data-grid";



const myTheme = createTheme({
  components: {
    //@ts-ignore - this isn't in the TS because DataGird is not exported from `@mui/material`
    MuiDataGrid: {
      styleOverrides: {
        row: {
          "&.Mui-selected": {
            backgroundColor: "rebeccapurple",
            color: "yellow",
            "&:hover": {
              backgroundColor: "purple"
            }
          }
        }
      }
    }
  }
});






const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "	 #0d0d0d" : "#eee",
  color: theme.palette.mode === "dark" ? "#fff" : "black",
}));

const StyleTable = styled(TableCell)(({ theme }) => ({
  fontSize: ".777rem",
  padding: "5px !important",
  textAlign: "center",
}));





const AddshipmentDial = ({
  data,
  open,
  setOpen,
  setSelectedData,
  FinalData,


}) => {


  const apiRef = useGridApiRef();
  const dispatch = useDispatch();
  const debouncing = useRef();
  const [skip, setSkip] = useState(true);
  const { id } = useParams();
  const [SelectedSKU, setSelectedSKU] = useState();
  const [updateValue, setUpdateValue] = useState([]);
  const [buttonBlink, setButtonBlink] = useState("");

 /// global state
 const { checkedBrand, checkedCategory, searchTerm, checkedGST, deepSearch } =
 useSelector((state) => state.product);
const { createQueryItems, createQuerySku } = useSelector(
 (state) => state.SelectedItems
);
/// local state

const [openAdditem, setOpenAdditem] = useState(false);
const [rows, setRows] = useState([]);
const [selectedItems, setSelectedItems] = useState([]);
const [selectedItemsData, setSelectedItemsData] = useState([]);
const [selectedDiabledItems, setSelectedDiabled] = useState([]);

const [filterString, setFilterString] = useState("page=1");
const [page, setPage] = useState(1);
const [rowPerPage, setRowPerPage] = useState(100);
const [totalProductCount, setTotalProductCount] = useState(0);

/// rtk query
useEffect(() => {
 const Header = "Create Shipment order";
 const skipped = id === "R&D" ? true : false;
 setSkip(skipped);
 dispatch(setHeader(Header));
}, [id]);

const {
 data: allProductData,
 isLoading: productLoading,
 refetch,
 isFetching,
} = useGetAllProductV2Query(filterString, {
 pollingInterval: 1000 * 300,
});

/// handlers

const handleSelectionChange = (selectionModel) => {
 setSelectedItems(selectionModel);
 const newSelectedRowsData = rows.filter((item) =>
   selectionModel.includes(item.id)
 );
 setSelectedItemsData(newSelectedRowsData);
 dispatch(setSelectedSkuQuery(selectionModel));
};

const handleSetAddItem = () => {
 setOpenAdditem(true);
};

useEffect(() => {
 return () => {
   dispatch(removeSelectedCreateQuery());
   dispatch(removeSelectedSkuQuery());
 };
}, []);

useEffect(() => {{
const disabled = FinalData?.map((item)=> item.SKU)
setSelectedDiabled(disabled)

}}, [open]);


useEffect(() => {
 if (
   selectedItemsData.length > 0 &&
   (!createQueryItems || createQueryItems.length === 0)
 ) {
   dispatch(setSelectedCreateQuery(selectedItemsData));
 } else if (createQueryItems.length > 0 && selectedItemsData.length > 0) {
   const newData = [...createQueryItems, ...selectedItemsData];
   dispatch(setSelectedCreateQuery(newData));
 }
}, [selectedItemsData]);

const removeSelectedItems = (id) => {
 const newSelectedItems = selectedItems.filter((item) => item !== id);
 const newSelectedRowsData = selectedItemsData.filter(
   (item) => item.SKU !== id
 );
 const NewUpdatedValue = updateValue.filter((item) => item.SKU !== id);
 setUpdateValue(NewUpdatedValue);
 setSelectedItemsData(newSelectedRowsData);
 setSelectedItems(newSelectedItems);
};
const uniqueSKUs = new Set(createQueryItems || [].map((item) => item.SKU));
const uniqueSKUsArray = Array.from(uniqueSKUs);
const realData = uniqueSKUsArray?.filter((item) =>
 selectedItems.find((docs) => item.SKU === docs)
);



const handleAdditems = () => {
  setOpen(false)

  setSelectedData(selectedItemsData);
};

/// useEffect
useEffect(() => {
 if (allProductData?.success) {
  const sorted = [...allProductData?.data?.products].sort((a, b) => {
    const aCondition = !selectedDiabledItems.includes(a.SKU) && a.ActualQuantity > 0;
    const bCondition = !selectedDiabledItems.includes(b.SKU) && b.ActualQuantity > 0;

    if (allProductData.data.products) {
      if (aCondition && !bCondition) return -1;
      if (!aCondition && bCondition) return 1;
    } else {
      if (aCondition && !bCondition) return 1;
      if (!aCondition && bCondition) return -1;
    }
    return 0;
  });
   const data = sorted?.map((item, index) => {
     return {
       ...item,
       id: item.SKU,
       Sno:
         index +
         1 +
         (allProductData.data.currentPage - 1) * allProductData.data.limit,
       GST: item.GST || 0,
       NewQty: item.NewQty || "",
       OldQty: item.OldQty || "",
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



//Columns*******************
const columns = [
 {
   field: "Sno",
   headerName: "Sno",
   minWidth: 100,
   maxWidth: 200,
   align: "center",
   headerAlign: "center",
   headerClassName: "super-app-theme--header",
   cellClassName: "super-app-theme--cell",
 },
 {
   field: "SKU",
   headerName: "SKU",
   minWidth: 200,
   maxWidth: 300,
   align: "center",
   headerAlign: "center",
   headerClassName: "super-app-theme--header",
   cellClassName: "super-app-theme--cell",
 },
 {
   field: "Name",
   headerName: "Product ",
   flex: 0.1,
   align: "center",
   headerAlign: "center",
   headerClassName: "super-app-theme--header",
   cellClassName: "super-app-theme--cell",
 },
 {
   field: "Brand",
   headerName: "Brand",
   minWidth: 200,
   maxWidth: 300,
   align: "center",
   headerAlign: "center",
   headerClassName: "super-app-theme--header",
   cellClassName: "super-app-theme--cell",
 },
 {
   field: "Category",
   headerName: "Category",
   align: "center",
   headerAlign: "center",
   headerClassName: "super-app-theme--header",
   cellClassName: "super-app-theme--cell",
 },

 {
   field: "GST",
   headerName: "GST",
   align: "center",
   headerAlign: "center",
   headerClassName: "super-app-theme--header",
   cellClassName: "super-app-theme--cell",
   valueFormatter: (params) => ` ${(+params.value)?.toFixed(0)} %`,
 },
 {
   field: "ActualQuantity",
   headerName: "In Store",
   align: "center",
   headerAlign: "center",
   headerClassName: "super-app-theme--header",
   cellClassName: "super-app-theme--cell",
 },


];

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
const getRowClassName = (params) => {
  return (!selectedDiabledItems.includes(params.row.SKU) &&
  params.row.ActualQuantity > 0) ? "selected-value" : "disabled-value";
};



  return (
    <div> 
    
     
      <Dialog open={open}  onClose={()=>setOpen(false)}
          sx={{ backdropFilter: "blur(5px)" }}
          maxWidth="xl"
      >
        <DialogTitle textAlign="center" sx={{ }}>
    
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
           
          }}
        >
        Select items
        </Typography>
        <Button
          sx={{ position: "absolute", top: "0", right: "0" }}
          onClick={() => {
            setOpen(false)
          }}
        >
          <CancelIcon sx={{ fontSize: "2.3rem" }} />
        </Button>
      </DialogTitle>

        <DialogContent sx={{
          width:"80vw",
          minHeight: "80vh",
        }}>
        <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >

      <FilterBarV2
        apiRef={apiRef}

      />


 
      <Grid container>
        {productLoading || isFetching ? (
          <Loading loading={true} />
        ) : (
          <Grid item xs={12} sx={{ mt: "5px" }}>
               <ThemeProvider theme={myTheme}>
            <Box
              sx={{
                width: "100%",
                height: "73vh",
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
                columnVisibilityModel={{
                  Category: false,
                }}
                checkboxSelection
                disableRowSelectionOnClick
                isRowSelectable={(params) =>
                  !selectedDiabledItems.includes(params.row.SKU) &&
                  params.row.ActualQuantity > 0
                }
                getCellClassName={getRowClassName}
                onRowSelectionModelChange={handleSelectionChange}
                rowSelectionModel={selectedItems}
                keepNonExistentRowsSelected
                components={{
                  Footer: CustomFooter,
                }}
                slotProps={{
                  footer: { status: refetch },
                }}
              />
            </Box>
            </ThemeProvider>
          </Grid>
        )}
      </Grid>
    </Box>

         
        </DialogContent>
        <Box sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          padding:1
        }}>
      <Button variant="contained" onClick={handleAdditems}>Add</Button>
      </Box>
      </Dialog>
  
    </div>
  );
};

export default AddshipmentDial;
