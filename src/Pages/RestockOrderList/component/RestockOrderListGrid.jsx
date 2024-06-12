import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Box,
  styled,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useGetAllNewRestocksQuery } from "../../../features/api/RestockOrderApiSlice";
import { useNavigate, useLocation } from "react-router-dom";
import Nodata from "../../../assets/error.gif";
import { DataGrid } from "@mui/x-data-grid";
import Loading from "../../../components/Common/Loading";
import { formatDate } from "../../../commonFunctions/commonFunctions";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
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
    background: "linear-gradient(180deg, #AA076B 26.71%, #61045F 99.36%)",
    color: "white",
    cursor: "pointer",
  },
  "& .MuiDataGrid-columnHeaderTitleContainer": {
    background: "#eee",
  },
}));

const RestockOrderListGrid = () => {
  /// initialization
  const navigate = useNavigate();
  const location = useLocation();

  /// local state
  const [selectedRows, setSelectedRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [toggleValue, setToggleValue] = useState("pending");

  /// rtk query
  const {
    refetch,
    data: allRestockData,
    isLoading: allRestock,
  } = useGetAllNewRestocksQuery(toggleValue);

  /// handlers
  const handleRowSelection = (selection) => {
    setSelectedRows(selection);
  };

  useEffect(() => {
    if (allRestockData && allRestockData.data) {
      const data = allRestockData.data.map((item, index) => ({
        ...item,
        id: item._id,
        Sno: index + 1,
        date: formatDate(item.createdAt),
        status: item.status,
      }));
      setRows(data);
    }
  }, [allRestockData]);

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
      field: "SKU",
      headerName: "SKU",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Name",
      headerName: "Name",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "Brand",
      headerName: "Brand",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "GST",
      headerName: "GST",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      align: "center",
      headerAlign: "center",
      minWidth: 120,
    },
    {
      field: "date",
      headerName: "Created-On",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "RestockQuantity",
      headerName: "Ask-Quantity",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      align: "center",
      headerAlign: "center",
      minWidth: 240,
    },
    {
      field: "OrderedQuantity",
      headerName: "Ordered-Quantity",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      align: "center",
      headerAlign: "center",
      minWidth: 240,
    },
    {
      field: "AddedBy",
      headerName: "AddedBy",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      align: "center",
      headerAlign: "center",
      minWidth: 240,
    },
    // {
    //   field: "paid",
    //   headerClassName: "super-app-theme--header",
    //   cellClassName: "super-app-theme--cell",
    //   headerName: "Paid",
    //   align: "center",
    //   headerAlign: "center",
    //   minWidth: 240,
    // },
    // {
    //   field: "status",
    //   headerClassName: "super-app-theme--header",
    //   cellClassName: "super-app-theme--cell",
    //   headerName: "Status",
    //   align: "center",
    //   headerAlign: "center",
    //   minWidth: 100,
    // },
    // {
    //   field: "details",
    //   headerName: "Details",
    //   sortable: false,
    //   minWidth: 130,
    //   align: "center",
    //   headerAlign: "center",
    //   headerClassName: "super-app-theme--header",
    //   cellClassName: "super-app-theme--cell",
    //   renderCell: (params) => (
    //     <Button
    //       onClick={() => {
    //         if (location.pathname === "/RestockOrderView") {
    //           navigate(`/OrderSelection/${params.row.restockId}?view`);
    //         } else {
    //           navigate(`/OrderSelection/${params.row.restockId}`);
    //         }
    //       }}
    //     >
    //       Details
    //     </Button>
    //   ),
    // },
  ];

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <ToggleButtonGroup
          color="primary"
          value={toggleValue}
          exclusive
          onChange={(e) => {
            setToggleValue(e.target.value);
          }}
          aria-label="Platform"
        >
          <ToggleButton
            // classes={{ selected: classes.selected }}
            value="pending"
          >
            Pending
          </ToggleButton>
          <ToggleButton
            // classes={{ selected: classes.selected }}
            value="fullfilled"
          >
            Closed
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <StyledBox>
        <Loading loading={allRestock} />
        <DataGrid
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
                <Box sx={{ textAlign: "center" }}>
                  <img
                    style={{
                      width: "15%",
                    }}
                    src={Nodata}
                  />
                  <Typography variant="h6">No data found !</Typography>
                </Box>
              </Box>
            ),
          }}
          columns={columns}
          rows={rows}
          rowHeight={40}
          Height={"85vh"}
          rowSelection="multiple"
          onRowSelectionModelChange={handleRowSelection}
          checkboxSelection
        />
      </StyledBox>
    </>
  );
};

export default RestockOrderListGrid;
