import React, { useEffect, useState } from "react";
import { Grid, Button, Box, styled, Typography } from "@mui/material";
import { useGetAllVendorWithOrderQuery } from "../../../features/api/RestockOrderApiSlice";
import { useNavigate } from "react-router-dom";
import CartGrid from "../../../components/Common/CardGrid";
import Nodata from "../../../assets/error.gif";
import Loading from "../../../components/Common/Loading";
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
}));

const OverseasOrderGrid = () => {
  /// initialize
  const navigate = useNavigate();

  /// rtk query

  const { data: allVendorData, isLoading: allVendorLoading } =
    useGetAllVendorWithOrderQuery();

  /// local state
  const [rows, setRows] = useState([]);

  // useEffect to handle data after fetching
  useEffect(() => {
    if (allVendorData?.status === "success") {
      const data = allVendorData.data?.map((item, index) => {
        return {
          id: item.vendorId,
          Sno: index + 1,
          CompanyName: item.comapanyName,
          ConcernPerson: item.concernPerson,
          Mobile: item.mobileNo || "N/A",
          vendorId: item.vendorId,
          paid: item.paidOrders,
          unPaid: item.unpaidOrders,
        };
      });

      setRows(data);
    }
  }, [allVendorData]);

  // Define the columns
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.1,
      minWidth: 10,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "vendorId",
      headerName: "Vendor Id",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "CompanyName",
      headerName: "CompanyName",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "ConcernPerson",
      headerName: "ConcernPerson ",
      flex: 0.3,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Mobile",
      headerName: "Mobile",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "paid",
      headerName: "Paid Products",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "unPaid",
      headerName: "UnPaid Products",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "order",
      headerName: "Orders",
      sortable: false,
      minWidth: 130,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => (
        <Button
          onClick={() => {
            navigate(`/OverseasOrderlist/${params.row.vendorId}`);
          }}
        >
          View
        </Button>
      ),
    },
    {
      field: "Box",
      headerName: "Box",
      sortable: false,
      minWidth: 130,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => (
        <Button
          onClick={() => {
            navigate(
              `/OverseasOrderBoxes/${params.row.vendorId}?companyName=${params.row.CompanyName}&concernPerson=${params.row.ConcernPerson}&mobile=${params.row.Mobile}`
            );
          }}
        >
          View
        </Button>
      ),
    },
    {
      field: "shipment",
      headerName: "Shipments",
      sortable: false,
      minWidth: 130,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => (
        <Button
        onClick={() => {
          navigate(
            `/OverseasShipment/${params.row.vendorId}?companyName=${params.row.CompanyName}&concernPerson=${params.row.ConcernPerson}&mobile=${params.row.Mobile}`
          );
        }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <StyledBox>
      <Loading loading={allVendorLoading} />
      <Grid item xs={12} sx={{ mt: "5px" }}>
        <CartGrid
          components={{
            NoRowsOverlay: () => (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  style={{
                    width: "10%",
                  }}
                  src={Nodata}
                />
                <Typography variant="body2">No data found !</Typography>
              </Box>
            ),
          }}
          columns={columns}
          rows={rows}
          rowHeight={40}
          Height={"82vh"}
        />
      </Grid>
    </StyledBox>
  );
};

export default OverseasOrderGrid;
