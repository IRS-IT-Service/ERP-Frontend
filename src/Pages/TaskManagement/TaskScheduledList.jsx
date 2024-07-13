import { Box, styled, Button } from "@mui/material";
import React, { useEffect } from "react";
import Header from "../../components/Common/Header";
import { Portal } from "@mui/base/Portal";
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
  GridToolbarExport,
  GridPagination,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import {
  formatDate,
  formatIndianPrice,
  formatUSDPrice,
} from "../../commonFunctions/commonFunctions";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../features/slice/uiSlice";
import { useGetAllProformaQuery } from "../../features/api/proformaApiSlice";
// import PreviewDial from "./PreviewDial";
import {useGetAllTasksManagementQuery} from "../../features/api/taskManagementApiSilce";
 
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const TaskScheduledList = () => {
  const [rows, setRows] = React.useState([]);
  const [previewDialOpen, setPreviewDialOpen] = React.useState(false);
  const [details, setDetails] = React.useState({});
  const { data: allData, isLoading } = useGetAllTasksManagementQuery();

  const handlePreviewOpen = (details) => {
    setDetails(details);
    setPreviewDialOpen(true);
  };


  useEffect(() => {
    if (allData?.status === true) {
      const data = allData?.data?.map((item, index) => {
        return {
          ...item,
          id: item.PiId,
          Sno: index + 1,
        file:item.files.url,
        };
      });

      setRows(data);
    }
  }, [allData]);
  
  const CustomToolbar = (prop) => {
    /// global state
    const { themeColor } = useSelector((state) => state.ui);
 

    return (
    <>
          <Portal container={() => document.getElementById("filter-panel")}>
              <Box style={{ display: "flex", justifyContent: "space-between",marginTop:"10px" }}>
         <GridToolbarQuickFilter style={{paddingTop:"20px"}} />
        
        </Box>
       </Portal>
      
      </>
 
 
    
    );
  };
  // Column definitions
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 1,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "id",
      headerName: "PI Id",
      flex: 1,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "companyName",
      headerName: "Company Name",
      flex: 2,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "vendorId",
      headerName: "Vendor ID",
      flex: 1,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "piNo",
      headerName: "PI No",
      flex: 1,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "amount",
      headerName: "Total Amount",
      flex: 1,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        console.log(params.row);
        return (
          <Box sx={{ width: "50%", height: "50%" }}>
            {params.row.amountType === "USD"
              ? `$ ${params.row.amount}`
              : `¥  ${params.row.amount}`}
          </Box>
        );
      },
    },

    {
      field: "piCopy",
      headerName: "Pi Copy",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const file = params.value.url;
        const piId = params.row.id;
        const CompanyName = params.row.companyName;
        console.log(params?.row);
        return (
          <Button
            onClick={() =>
              handlePreviewOpen({
                file: file,
                piId: piId,
                CompanyName: CompanyName,
              })
            }
          >
            View
          </Button>
        );
      },
    },
    {
      field: "shiftCopy",
      headerName: "Shift Copy",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const file = params.value.url;
        const piId = params.row.id;
        const CustomerName = params.row.companyName;

        return (
          <Button
            onClick={() =>
              handlePreviewOpen({
                file: file,
                piId: piId,
                CustomerName: CustomerName,
              })
            }
          >
            View
          </Button>
        );
      },
    },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   flex: 2,
    //   renderCell: (params) => {
    //     return (
    //       <Box
    //         sx={{
    //           width: "50%",
    //           height: "50%",
    //           backgroundColor: "lightblue",
    //           alignSelf: "center",
    //           borderRadius: "5px",
    //         }}
    //       ></Box>
    //     );
    //   },
    // },
    // {
    //   field: "action",
    //   headerName: "Action",
    //   flex: 2,
    //   renderCell: (params) => {
    //     return <Button>Details</Button>;
    //   },
    // },
  ];

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Proforma List`));
  }, []);

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "hidden" }}
    >
      <DrawerHeader />
      {/* <Header Name={"Proforma List"} /> */}

      {/* Add the DataGrid */}
      <Box id="filter-panel" />
      <Box
              sx={{
                width: "100%",
                height: "80vh",
                "& .super-app-theme--header": {
                  background: "#eee",
                  color: "black",
                  textAlign: "center",
                },
                "& .vertical-lines .MuiDataGrid-cell": {
                  borderRight: "1px solid #e0e0e0",
                },
               
              }}
            >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5} 
          rowsPerPageOptions={[5, 10, 20]} 
   
          initialState={{
            filter: {
                filterModel: {
                  items: ["Group"],
                  quickFilterExcludeHiddenColumns: true,
                },
              },
            }}
            components={{
              Toolbar: CustomToolbar,
            }}
        />
      </Box>
      {/* {previewDialOpen && (
        <PreviewDial
          open={previewDialOpen}
          setOpen={setPreviewDialOpen}
          details={details}
        />
      )} */}
    </Box>
  );
};

export default TaskScheduledList;
