import {
  Box,
  Button,
  Grid,
  styled,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useLocation } from "react-router-dom";
import {
  useCreateShipmentMutation,
  useGetSingleSalesHistoryMutation,
  useGetSingleShipmentMutation,
} from "../../../features/api/barcodeApiSlice";
import { toast } from "react-toastify";
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "#B3CBFF",
}));

const Shipment = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsData, setSelectedItemsData] = useState([]);
  const [barcode, setBarcode] = useState([]);
  const [trackingId, setTrackingId] = useState("");
  const [courierName, setCourierName] = useState("");
  const [data, setData] = useState(null);

  // rkt query
  const [getSingleSales] = useGetSingleSalesHistoryMutation();
  const [createShipment, { isLoading: createShipmentLoading }] =
    useCreateShipmentMutation();
  const [getSingleShipment] = useGetSingleShipmentMutation();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  // fetching data to show
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const response = await getSingleSales(id);
        if (response.data.status === "success") {
          setData(response.data.data);
        }
      };
      fetchData();
    }
  }, [id]);

  // courier service name
  const courierOptions = [
    "Porter",
    "Delhivery",
    "Ekart",
    "ExpressBess",
    "DHL Express",
    "DTDC",
    "FedEx",
    "Blue Dart",
    "Ecom Express",
    "India Post",
    "Self Pickup" ,
    "Others",
  ];
  const handleCourierNameChange = (event) => {
    setCourierName(event.target.value);
  };

  // function for rows
  const rowss = data?.barcodeDetails.map((item, index) => ({
    id: item.barcode, // Use a unique identifier as 'id'
    sno: index + 1,
    name: item.name,
    barcode: item.barcode,
  }));

  // handle selection change for checkbox
  const handleSelectionChange = (selectionModel) => {
    setSelectedItems(selectionModel);
    const newSelectedRowsData = rowss.filter((item) =>
      selectionModel.includes(item.id)
    );
    setSelectedItemsData(newSelectedRowsData);
  };

  // handle submit here
  const handleSubmit = async () => {
    if (!trackingId || !courierName) {
      return toast.error("Please Provide TrackingId Or CourierName");
    }
    if (selectedItemsData.length <= 0) {
      return toast.error("Plz SelectItems to Send");
    }
    const barcodes = selectedItemsData.map((item) => item.barcode);
    try {
      const info = {
        customername: data?.result?.CustomerName,
        courierName: courierName,
        trackingId: trackingId,
        salesId: data?.result?.SalesId,
        barcodes: barcodes,
      };
      const result = await createShipment(info);

      toast.success("Item has shipped successfully");
      setTrackingId("");
      setCourierName("");
    } catch (error) {
      console.log("Server Error", error.message);
      setTrackingId("");
      setCourierName("");
    }
  };
  // for disable the checkbox
  useEffect(() => {
    if (data?.result?.SalesId) {
      const fetchData = async () => {
        const result = await getSingleShipment(data?.result?.SalesId);
        if (result.data.status === true) {
          setBarcode(result.data?.data);
        }
      };
      fetchData();
    }
  }, [data?.result?.SalesId, setTrackingId, trackingId]);

  const columns = [
    {
      field: "sno",
      headerName: "Sno",
      maxWidht: 10,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "name",
      headerName: "Product Name",
      flex: 0.3,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "barcode",
      headerName: "Barcode",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "gray",
          color: "white",
          padding: "2px",
        }}
      >
        <h3>Tracking-Details</h3>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          padding: "4px",
          margin: "8px",
          borderRadius: "5px",
          border: "2px solid #B3CBFF",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#0003FA",
            color: "white",
            padding: "8px",
            borderRadius: "5px",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
        >
          <h3>
            Cust.Name{" "}
            <input
              value={
                data?.result?.CustomerName ? data?.result?.CustomerName : "N/A"
              }
              style={{
                textAlign: "center",
                padding: "2px",
                borderRadius: "5px",
              }}
            />
          </h3>
        </Box>
        <Box
          sx={{
            backgroundColor: "#0003FA",
            color: "white",
            padding: "8px",
            borderRadius: "5px",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
        >
          <h3>
            Invoice No.{" "}
            <input
              value={data?.result?.InvoiceNo ? data?.result?.InvoiceNo : "N/A"}
              style={{
                textAlign: "center",
                padding: "2px",
                borderRadius: "5px",
              }}
            />
          </h3>
        </Box>
        <Box
          sx={{
            backgroundColor: "#0003FA",
            color: "white",
            padding: "8px",
            borderRadius: "5px",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
        >
          <h3>
            Mob.No{" "}
            <input
              value={data?.result?.MobileNo ? data?.result?.MobileNo : "N/A"}
              style={{
                textAlign: "center",
                padding: "2px",
                borderRadius: "5px",
              }}
            />
          </h3>
        </Box>
      </Box>
      <Box
        sx={{
          height: "65vh",
          // width: "100vw",
          "& .super-app-theme--header": {
            background: "#B3CBFF",
            textAlign: "center",
          },

          // "& .vertical-lines .MuiDataGrid-cell": {
          //   borderRight: "1px solid #B3CBFF",
          // },
          "& .super-app-theme--cell": {
            backgroundColor: "#E8F0FF",
            color: "#7C7777",
            fontWeight: "600",
            border: "1px solid #B3CBFF",
          },

          "& .MuiDataGrid-columnHeaderTitleContainer": {
            background: "#B3CBFF",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "800",
          },

          "& .MuiDataGrid-virtualScrollerRenderZone": {
            background: "#E8F0FF",
            fontWeight: "800",
          },

          position: "relative",
          overflow: "auto",
        }}
      >
        <DataGrid
          columns={columns}
          rows={rowss || []}
          rowHeight={40}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={handleSelectionChange}
          rowSelectionModel={selectedItems}
          isRowSelectable={(params) => {
            // Check if the barcode value is in the barcode status array
            return !barcode.includes(params.row.barcode);
          }}
        />
      </Box>
      {/* {openDial && <ShipmentDial open={openDial} close= {handleClose} data={selectedItemsData}/>} */}
      <Box
        sx={{ display: "flex", justifyContent: "space-around", margin: "10px" }}
      >
        <Box
          sx={{
            border: "2px solid #B3CBFF",
            padding: "15px",
            borderRadius: "5px",
            width: "26%",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
        >
          <div
            style={{
              backgroundColor: "#0003FA",
              padding: "5px",
              borderRadius: "3px",
            }}
          >
            <h2 style={{ textAlign: "center", color: "white" }}>Tracking Id</h2>
            <input
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              style={{ width: "100%", backgroundColor: "#fff", height: "28px" }}
            ></input>
          </div>
        </Box>
        <Box
          sx={{
            border: "2px solid #B3CBFF",
            padding: "10px",
            borderRadius: "5px",
            width: "26%",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
        >
          <div
            style={{
              backgroundColor: "#0003FA",
              padding: "5px",
              borderRadius: "3px",
            }}
          >
            <h2 style={{ textAlign: "center", color: "white" }}>
              Courier Name
            </h2>
            <Select
              value={courierName}
              onChange={handleCourierNameChange}
              style={{ width: "100%", backgroundColor: "#fff", height: "28px" }}
            >
              {courierOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </div>
        </Box>
        <Box
          sx={{
            mt: "30px",
          }}
        >
          <button
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              backgroundColor: "#0003FA",
              borderRadius: "4px",
              fontWeight: "bold",
              color: "white",
            }}
            disabled={createShipmentLoading}
            onClick={handleSubmit}
          >
            {createShipmentLoading ? (
              <CircularProgress />
            ) : (
              <>
                {" "}
                <span>Submit Here</span>
                <ChevronRightIcon />
              </>
            )}
          </button>
        </Box>
      </Box>
    </Box>
  );
};

export default Shipment;
