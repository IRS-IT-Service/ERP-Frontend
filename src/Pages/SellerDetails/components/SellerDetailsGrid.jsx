import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Grid, Button, Box } from "@mui/material";
import FilterBar from "../../../components/Common/FilterBar";
import CartGrid from "../../../components/Common/CardGrid";
import { useGridApiRef } from "@mui/x-data-grid";
import { useGetAllSalesHistoryQuery } from "../../../features/api/barcodeApiSlice";
import SalesBarcodeDialog from "./SalesBarcodeDialog";
import Loading from "../../../components/Common/Loading";
import { formatDate } from "../../../commonFunctions/commonFunctions";
import { useNavigate } from "react-router-dom";
import Dateformat from "../../../components/Common/Dateformat";
import { useEffect } from "react";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const SellerDetailsGrid = () => {
  // initialize
  const navigate = useNavigate();

  // local states
  const [row, setRow] = useState([]);
  const [openHistory, setOpenHistory] = useState(false);
  const [serialData, setSerialData] = useState("");
  const [search, setSearch] = useState("");
  const [searchDelay, setSearchDelay] = useState(false);
  const [date, setDate] = useState({
    From: "",
    To: Dateformat(new Date()),
  });

  /// rtk query
  const {
    data: salesData,
    refetch,
    isLoading: salesDetailLoading,
    isFetching,
  } = useGetAllSalesHistoryQuery(
    `?customerName=${search}&from=${date.From}&to=${date.To}`,
    {
      skip: !date.From || searchDelay,
    }
  );

  // functions

  const calculatePreviousDate = (baseDate, daysToSubtract) => {
    const resultDate = new Date(baseDate);
    resultDate.setDate(baseDate.getDate() - daysToSubtract);
    return resultDate;
  };

  const handleOnchange = (e) => {
    const { name, value, type } = e.target;
    if (type === "date") {
      setDate({
        ...date,
        [name]: value,
      });
    } else {
      setSearchDelay(true);
      setTimeout(() => {
        setSearchDelay(false);
      }, 1500);
      setSearch(e.target.value);
    }
  };

  /// handlers
  const handleopenHistory = () => {
    setOpenHistory(!openHistory);
  };

  const handleViewClick = (id) => {
    setSerialData(id);
    handleopenHistory();
  };

  const handleNavigate = ({ id, name, no, invoice, salesId }) => {
    navigate(`/shipment?id=${id}`);
  };

  const handleResetFilter = () => {
    setSearch("");
    setDate({
      To: Dateformat(new Date()),
      From: Dateformat(calculatePreviousDate(new Date(), 30)),
    });
  };

  /// useEffect

  useEffect(() => {
    setDate({
      ...date,
      From: Dateformat(calculatePreviousDate(new Date(), 30)),
    });
  }, []);
  useEffect(() => {
    if (salesData?.status === "success") {
      const rowss = salesData?.data?.map((item, index) => ({
        id: item._id,
        salesId: item.SalesId,
        Sno: index + 1,
        CustomerName: item.CustomerName,
        MobileNo: item.MobileNo === 0 ? "N/A" : item.MobileNo,
        Date: formatDate(item.Date), // Remove curly braces {}
        InvoiceNo: item.InvoiceNo,
      }));

      setRow(rowss);
    }
  }, [salesData]);
  /// columns
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
      field: "CustomerName",
      headerName: "Customer Name",
      flex: 0.2,
      width: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "MobileNo",
      headerName: "Mobile No",
      flex: 0.2,
      width: 120,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "Date",
      headerName: "Purchase Date",
      flex: 0.3,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "InvoiceNo",
      headerName: "Invoice No",
      flex: 0.2,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "view",
      headerName: "Barcode no",
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleViewClick(params.id)}>view</Button>
          </>
        );
      },
    },
    {
      field: "ship",
      headerName: "Ship",
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleNavigate({ id: params.row.id })}>
              open
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Loading loading={isFetching || salesDetailLoading} />
      <Box style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <input
          placeholder="search"
          style={{
            width: "30rem",
            padding: "10px 25px",
            margin: "2px 0",
            borderRadius: "20px",
          }}
          name="search"
          onChange={handleOnchange}
          value={search}
        />
        <Box
          sx={{
            display: "flex",
            marginLeft: "8rem",
            alignItems: "center",
            gap: "10px",
            fontWeight: "bold",
          }}
        >
          <span>From</span>
          <input
            placeholder="Date"
            type="date"
            style={{
              width: "10rem",
              padding: "10px 25px",
              margin: "2px 0",
              borderRadius: "10px",
              fontSize: "15px",
            }}
            name="From"
            value={date.From}
            onChange={handleOnchange}
          />
          <span>To</span>
          <input
            placeholder="Date"
            type="date"
            style={{
              width: "10rem",
              padding: "10px 25px",
              margin: "2px 0",
              borderRadius: "10px",
              fontSize: "15px",
            }}
            name="To"
            value={date.To}
            onChange={handleOnchange}
          />
        </Box>
        <Button
          onClick={handleResetFilter}
          sx={{
            backgroundColor: "red",
            color: "white",
            "&:hover": {
              backgroundColor: "red", // Remove hover effect
            },
          }}
        >
          Reset filter
        </Button>
      </Box>
      <StyledBox>
        <Grid item xs={12} sx={{ mt: "5px" }}>
          {salesDetailLoading ? (
            <Loading loading={salesDetailLoading} />
          ) : (
            <CartGrid
              columns={columns}
              rows={row}
              rowHeight={40}
              Height={"73vh"}
            />
          )}
        </Grid>
      </StyledBox>

      {openHistory && (
        <SalesBarcodeDialog
          open={openHistory}
          onClose={handleopenHistory}
          serialData={serialData}
          rows={row}
          formatDate={formatDate}
        />
      )}
    </Box>
  );
};

export default SellerDetailsGrid;
