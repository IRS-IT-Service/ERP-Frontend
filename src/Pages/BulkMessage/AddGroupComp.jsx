import { React, useEffect, useState } from "react";
import { Box, styled,
    Typography,
    Grid,
    TextField,
    Button,
    CircularProgress, } from "@mui/material";

import Header from "../../components/Common/Header";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../features/slice/uiSlice";
import FilterBar from "../../components/Common/FilterBar";
import {
    DataGrid,
    useGridApiRef,
    GridToolbarContainer,
    GridToolbarExport,
    GridPagination,
    GridToolbarQuickFilter,
  } from "@mui/x-data-grid";
import { useGetAllProductQuery } from "../../features/api/productApiSlice";
import GroupDial from "./GroupDial";
import {
  useAddPriceHistoryMutation,
  useGetAllPriceHistoryQuery,
} from "../../features/api/PriceHistoryApiSlice";
import { setAllProducts } from "../../features/slice/productSlice";
import Loading from "../../components/Common/Loading";
import { formatDate } from "../../commonFunctions/commonFunctions";
import { useGetAllClientQuery } from "../../features/api/clientAndShipmentApiSlice";
import { Portal } from "@mui/base/Portal";
import {useGetGroupInfoByidQuery} from "../../features/api/marketingApiSlice"

import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
}));


const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
// infoDialog box data
const infoDetail = [
  {
    name: "Sort By Brand",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortBrand_productList.png?updatedAt=1703135461416"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click 'Sort by Brand' and select a particular brand, you can view listings for that specific brand",
  },
  {
    name: "Sort By Category",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortcategory_productList.png?updatedAt=1703135461428"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click 'Sort by Category' and select a particular category, you can view listings for that specific product",
  },
  {
    name: "Search-Product",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/search-product_ProductRemoval.png?updatedAt=1703144447246"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click the search product, you can search for any product or brand here",
  },
  {
    name: "Search-SKU",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/Sku_productRemoval.png?updatedAt=1703144412883"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click search SKU, you can search for any product or brand by SKU number here ",
  },
  {
    name: "check",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/checkbox_priceHistory.png?updatedAt=1703224608533"
        height={"40%"}
        width={"40%"}
      />
    ),
    instruction: "If you check this, you can select a particular list",
  },
  {
    name: "Add Group",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/pricehistory_PriceHistory.png?updatedAt=1703224608892"
        height={"100%"}
        width={"100%"}
      />
    ),
    instruction:
      "When you select a particular list, the 'Price History' button becomes enabled. If you click on 'Price History,' you can check the history of that specific price",
  },
];
const AddGroupComp = () => {
  // infodialog state

  const apiRef = useGridApiRef();
const {id} = useParams()


  const description =
    "This is the Price History. You can view a particular price ";

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  const {
    data: clientData,
    refetch: clientrefetch,
    isLoading: clientLoading,
  } = useGetAllClientQuery();

  const {
    data: GroupData,
    refetch: grouprefetch,
    isLoading: groupLoading,
  } = useGetGroupInfoByidQuery(id,{
    skip:!id
  });

  useEffect(() => {
    dispatch(setHeader(`Add Whatsapp Group`));
  }, []);
  /// local state

  const [openHistory, setOpenHistory] = useState(false);
  const [productDetails, setProductDetails] = useState({});

  /// rtk query

  /// handlers
  const handleCloseHistory = () => {
    setOpenHistory(false);
  };


  /// global state
  const { searchTerm, forceSearch } = useSelector((state) => state.product);

  /// functions
  const successdisplay = () => {
    Swal.fire({
      title: "History Genrate!",
      text: "The Purchase history has been successfully submitted.",
      icon: "success",
      showConfirmButton: false,
    });
    const close = () => {
      setTimeout(function () {
        Swal.close();
      }, 2000);
    };
    close();
  };

  /// rtk query
 

  /// Local state
  const [paramsData, setParamsData] = useState({
    brand: "",
    productName: "",
  });

  const [openGroupDial, setOpenGroupDial] = useState(false);
  const [preData, setPreData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsData, setSelectedItemsData] = useState([]);
  const [rows, setRows] = useState([]);
  const [Group, setGroup] = useState({
    name: "",
    desc: "",
  });

  /// useEffects
  useEffect(() => {
    if (clientData?.status) {
      const data = clientData.client.map((item, index) => {
        return {
          ...item,
          id: item._id,
          Sno: index + 1,
          Address: `${item.PermanentAddress.Address}, ${item.PermanentAddress.District}, ${item.PermanentAddress.State}, ${item.PermanentAddress.Pincode}, ${item.PermanentAddress.Country}`,
        };
      });
  
      dispatch(setAllProducts({ ...clientData }));
      setRows(data);
    }
  }, [clientData, dispatch]);


  useEffect(() => {
    let SelectedItem = []
    if (GroupData?.status) {
      const ClientDetails = rows.filter((row) =>
        GroupData?.data?.Members.some((member) => member.ClientId === row.ClientId)
  
      );
      if(ClientDetails.length > 0){
        SelectedItem = ClientDetails.map((item)=> item._id)
      }

      setSelectedItemsData(ClientDetails)
      setSelectedItems(SelectedItem)
    console.log(GroupData?.data)
      setOpenGroupDial(true)
      setGroup({
        name: GroupData?.data?.groupName,
        desc: GroupData?.data?.groupDescription,
    })
    }
  }, [GroupData, rows]);

  function MyCustomToolbar(prop) {
    return (
      <>
        <Portal container={() => document.getElementById("filter-panel")}>
          <Box sx={{
            display:"flex",
            justifyContent: "space-between",
        
          }}>
          <GridToolbarQuickFilter />
         
          </Box>
        </Portal>
        {/* <GridToolbar {...prop} /> */}
      </>
    );
  }




 

  /// handlers
  const HandleOpen = (sku) => {
    setOpenHistory(true);
  };

  const handleSelectionChange = (selectionModel) => {
    setSelectedItems(selectionModel);
    const newSelectedRowsData = rows.filter((item) =>
      selectionModel.includes(item.id)
    );
    setSelectedItemsData(newSelectedRowsData);
  };



  /// Columns
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.2,
      minWidth: 40,
      maxWidth: 50,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "ContactName",
      headerName: "Contact Name",
      flex: 0.1,
      minWidth: 100,
      maxWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
   
    },
    {
      field: "CompanyName",
      headerName: "Company Name",
      flex: 0.1,
      minWidth: 100,
      maxWidth: 400,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "ContactNumber",
      headerName: "Mobile No",
      flex: 0.1,
      minWidth: 90,
      maxWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Email",
      headerName: "Email",
      flex: 0.1,
      minWidth: 100,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "ClientType",
      headerName: "Client Type",
      flex: 0.4,
      minWidth: 90,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "GSTIN",
      headerName: "GSTIN",
      flex: 0.1,
      minWidth: 50,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
     
    },

    {
      field: "Address",
      headerName: "Address",
      flex: 0.1,
      minWidth: 200,
      maxWidth: 500,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
     
    },

  ];
  return (
    <Box
      component="main"
      sx={{ flexGrow: 5, p: 0, width: "100%", overflow: "hidden" }}
    >
      <DrawerHeader />
      {/* <Header Name={"Price History"}  info={true} customOnClick={handleOpen}/> */}

      <Box
        sx={{
          height: "100%",
          width: "100%",
        }}
      >
        <StyledBox>
       
          <GroupDial
            data={selectedItemsData}
            successdisplay={successdisplay}
            open={openGroupDial}
            setOpen={setOpenGroupDial}
            handleSelectionChange={handleSelectionChange}
            selectedItems={selectedItems}
            setSelectedItemsData={setSelectedItemsData}
            setSelectedItems={setSelectedItems}
            setGroup ={setGroup}
            Group = {Group}
            grouprefetch={grouprefetch}
            id={id}
          />
          <Grid item xs={12} sx={{ mt: "5px" }}>
            {/* <Loading loading={productLoading || isFetching} /> */}

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
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding:"5px",
                    gap:"20px",
                  
                }}>
                 <Box id="filter-panel" />
                 <Box
    
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "12px",
      }}
    >
      {selectedItemsData.length > 0 && (
        <Box 
        onClick={() => {
            setOpenGroupDial(true);
          }}
        sx={{
            backgroundColor: "black",
            color:"#fff",
            padding:"5px",
            borderRadius:"25px",
            fontSize:"12px",
            cursor:"pointer",
            textTransform: "capitalize",
            marginLeft:"5px",
            borderRadius:"5px",
            "&:hover":{
                backgroundColor: "green",

            }
           
        }}>
          <span>{id ? "Update Group" : "Create Group"}</span>
        </Box>
      ) }
      </Box>
    </Box>
              <DataGrid
                columns={columns}
                rows={rows}
                rowHeight={40}
                Height={"84vh"}
                apiRef={apiRef}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={handleSelectionChange}
                rowSelectionModel={selectedItems}
                slots={{
                    toolbar: MyCustomToolbar,
                  }}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 50,
                      },
                    },
                    filter: {
                      filterModel: {
                        items: ["Individual"],
                        quickFilterExcludeHiddenColumns: true,
                      },
                    },
                  }}
              />
            </Box>
          </Grid>
        </StyledBox>
   
      </Box>
      {/* infoDialog table */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
      />
    </Box>
  );
};

export default AddGroupComp;
