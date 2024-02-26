import React, { useState } from "react";
import { Button, Box, CircularProgress } from "@mui/material";
import * as XLSX from "xlsx";
import { useUpdateBulkProductMutation } from "../../../features/api/productApiSlice";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSocket } from "../../../CustomProvider/useWebSocket";
import { useSendMessageToAdminMutation } from "../../../features/api/whatsAppApiSlice";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";

const UpdateProductBulk = () => {
  /// global state
  const { themeColor } = useSelector((state) => state.ui);
  const color = themeColor.sideBarColor1;
  /// initialization
  const query = useParams().query;
  const navigate = useNavigate();
  const socket = useSocket();

  /// global state
  const { userInfo } = useSelector((state) => state.auth);

  const [excelData, setExcelData] = useState([]);

  /// rtk query
  const [sendMessageToAdmin] = useSendMessageToAdminMutation();
  const [bulkUpdateProduct,{isLoading}] = useUpdateBulkProductMutation();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headerRow = jsonData.shift().map((item) => item.trim());

      const excelObjects = jsonData.map((row, index) =>
        row.reduce(
          (obj, value, columnIndex) => {
            // Remove white spaces from the cell values
            const trimmedValue =
              typeof value === "string" ? value.trim() : value;
            return {
              ...obj,
              [headerRow[columnIndex]]: trimmedValue,
            };
          },
          {
            Sno: index + 1,
            id: index + 1,
          }
        )
      );

      setExcelData(excelObjects);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async () => {
    if (excelData.length < 0)
      return toast.error("Please upload excel data before submit");
    try {
      const info = { datas: excelData };
      const res = await bulkUpdateProduct(info).unwrap();
      const liveStatusData = {
        message: `${userInfo.name} updated bulk product`,
        time: new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
      };
      socket.emit("liveStatusServer", liveStatusData);
      const whatsappMessage = {
        message: liveStatusData.message,
        contact: import.meta.env.VITE_ADMIN_CONTACT,
      };
      if (res.status === "success") {
        Swal.fire({
          icon: "success",
          title: `Product ${query} Updated`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
      await sendMessageToAdmin(whatsappMessage).unwrap();
      window.location.reload()
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
    setExcelData([]);
  };

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
    },
    {
      field: "SKU",
      headerName: "SKU",
      flex: 0.3,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Name",
      headerName: "Name",
      flex: 0.3,
      minWidth: 350,
      maxWidth: 400,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "GST",
      headerName: "GST",
      flex: 0.3,
      minWidth: 240,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "MRP",
      headerName: "MRP",
      flex: 0.3,
      minWidth: 240,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Quantity",
      headerName: "Quantity",
      flex: 0.3,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "LandingCost",
      headerName: "LandingCost",
      flex: 0.3,
      minWidth: 240,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "SalesPrice",
      headerName: "SalesPrice",
      flex: 0.3,
      minWidth: 240,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "SellerPrice",
      headerName: "SellerPrice",
      flex: 0.3,
      minWidth: 240,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
  ];
  return (
    <Box>
      <Box sx={{ display: "flex", gap: "10px", margin: "10px" }}>
        <Box>
          <input
            type="file"
            accept=".xls, .xlsx"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button
              variant="outlined"
              component="span"
              sx={{
                color: "white",
                background: color,
                "&:hover": {
                  color: "black",
                },
              }}
            >
              Upload Excel File
            </Button>
          </label>
        </Box>
        <Box>
          {excelData.length > 0 && (
            <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? <CircularProgress/> : "Submit"}
            </Button>
          )}
        </Box>
      </Box>
      <Box sx={{ width: "100%", height: "87vh" }}>
        <DataGrid columns={columns} rows={excelData} />
      </Box>
    </Box>
  );
};

export default UpdateProductBulk;
