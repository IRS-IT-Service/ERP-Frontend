import React, { useState } from "react";
import { Box, styled, Button, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetCalcQuery } from "../../features/api/productApiSlice";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Common/Header";
import InfoDialogBox from "../../components/Common/InfoDialogBox";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
}));
// infoDialog box data
const infoDetail = [
  {
    name: "View",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/savedPriceCalc_Account.png?updatedAt=1703222092787"
        height={"40%"}
        width={"60%"}
      />
    ),
    instruction:
      "If you click 'View,' you can see that particular list and calc prices",
  },
 
  
];
const CalcEdit = () => {
   // infodialog state
   const description =
   "This is the Saved Price Calc, and you can view the price list";

 const [infoOpen, setInfoOpen] = useState(false);
 const handleClose = () => {
   setInfoOpen(!infoOpen);
 };
 const handleOpen = () => {
   setInfoOpen(true);
 };
  /// initialization
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  /// rtk query
  const { data, isLoading, refetch } = useGetCalcQuery();

  /// local state

  const [row, setRow] = useState([]);

  useEffect(() => {
    if (data?.success) {
      let newRows = data.data.map((item, index) => {
        return {
          ...item,
          id: index,
          createdAt: new Date(item.createdAt),
          Sno: index + 1,
          NoOfProducts: item.Product.length,
        };
      });

      setRow(newRows);
    }
  }, [data]);

  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.3,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      minWidth: 70,
    },
    {
      field: "CalcId",
      headerName: "ID",
      flex: 0.3,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      minWidth: 220,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 0.3,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      minWidth: 400,
    },
    {
      field: "NoOfProducts",
      headerName: "No of Products",
      flex: 0.3,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      minWidth: 250,
    },
    {
      field: "createdAt",
      headerName: "Date",
      flex: 0.3,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      type: "date",
      minWidth: 250,
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 90,
      flex: 0.3,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <Button
            onClick={() => {
              navigate(`/calc/${params.row["_id"]}`);
            }}
          >
            View
          </Button>
        );
      },
    },
  ];
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <Header Name={"Saved Price Calc"} info={true} customOnClick={handleOpen}/>
   
      <Box
        sx={{
          width: "100%",
          height: "82vh",
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
        <DataGrid rows={row} columns={columns} pageSize={10} rowHeight={40} />
           {/* infoDialog table */}
           <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={infoOpen}
        close={handleClose}
      />
      </Box>
    </Box>
  );
};

export default CalcEdit;
