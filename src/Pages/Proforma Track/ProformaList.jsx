import { Box, styled, Button } from "@mui/material";
import React, { useEffect } from "react";
import Header from "../../components/Common/Header";
import { DataGrid } from "@mui/x-data-grid";
import {
  formatDate,
  formatIndianPrice,
  formatUSDPrice,
} from "../../commonFunctions/commonFunctions";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../features/slice/uiSlice";
import { useGetAllProformaQuery } from "../../features/api/proformaApiSlice";
import PreviewDial from "./PreviewDial";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const ProformaList = () => {
  const [rows, setRows] = React.useState([]);
  const [previewDialOpen, setPreviewDialOpen] = React.useState(false);
  const [details, setDetails] = React.useState({});
  const { data: allData, isLoading } = useGetAllProformaQuery();

  const handlePreviewOpen = (details) => {
    setDetails(details);
    setPreviewDialOpen(true);
  };

  console.log(allData);
  useEffect(() => {
    if (allData?.status === true) {
      const data = allData?.data?.map((item, index) => {
        return {
          id: item.PiId,
          Sno: index + 1,
          companyName: item?.CompanyName,
          vendorId: item?.VendorId,
          piNo: item?.PiNo,
          description: item?.Description,
          date: formatDate(item?.PiDate),
          amount: item?.Amount,
          amountType: item?.AmountType,
          piCopy: item?.PiCopy,
          shiftCopy: item?.ShiftCopy,
        };
      });

      setRows(data);
    }
  }, [allData]);

  // Column definitions
  const columns = [
    { field: "Sno", headerName: "Sno", flex: 1 },
    { field: "id", headerName: "PI Id", flex: 1 },
    { field: "companyName", headerName: "Company Name", flex: 2 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "vendorId", headerName: "Vendor ID", flex: 1 },
    { field: "piNo", headerName: "PI No", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    {
      field: "amount",
      headerName: "Total Amount",
      flex: 1,
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
        console.log(params?.row)
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
      <Box sx={{ height: "88vh", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5} // Adjust as needed
          rowsPerPageOptions={[5, 10, 20]} // Adjust as needed
          //   checkboxSelection
          //   disableSelectionOnClick
        />
      </Box>
      {previewDialOpen && (
        <PreviewDial
          open={previewDialOpen}
          setOpen={setPreviewDialOpen}
          details={details}
        />
      )}
    </Box>
  );
};

export default ProformaList;
