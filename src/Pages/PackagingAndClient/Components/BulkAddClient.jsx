import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Grid,
  Paper,
  styled,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import CartGrid from "../../../components/Common/CardGrid";
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
}));
import BASEURL from "../../../constants/BaseApi";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import * as XLSX from "xlsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useAddClientMutation } from "../../../features/api/clientAndShipmentApiSlice";
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
import { useNavigate } from "react-router-dom";
import { useSendMessageToAdminMutation } from "../../../features/api/whatsAppApiSlice";



const BulkAddClient = () => {

  const { name } = useSelector((state) => state.auth.userInfo);
  /// local state
  const [excelData, setExcelData] = useState([]);
  const [rows, setRows] = useState([]);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const { themeColor } = useSelector((state) => state.ui);

  const [addClient, { isLoading }] = useAddClientMutation();

  const color = themeColor.sideBarColor1;

const navigate = useNavigate()


  const ExcelHeader = [
    "Sno",
    "ContactName",
    "CompanyName",
    "ContactNumber",
    "Email",
    "GSTIN",
    "ClientType",
    "Pincode",
    "District",
    "State",
    "Country",
  ];

  const handleFileChange = (event) => {
    console.log(event);
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
console.log(jsonData);
      // Remove white spaces from the header row
      const headerRow = jsonData.shift().map((item) => item.trim());
      const processedHeaderRow = headerRow.map((item) =>
        item.startsWith("Address")
          ? item.replace(" (Street Address)", "").trim()
          : item
      );

      const headerRowExist = processedHeaderRow.some((item) =>
        ExcelHeader.includes(item)
      );

      if (!headerRowExist) {
        toast.error("Invalid Excel Format");
        return;
      }

      const excelObjects = jsonData.map((row, index) =>
        row.reduce(
          (obj, value, columnIndex) => {
            // Remove white spaces from the cell values
            // const trimmedValue =
            //   typeof value === "string" ? value.trim() : value;

       
            // if (processedHeaderRow[columnIndex] === "Address") {
            //   return {
            //     ...obj,
            //     PermanentAddress: {
            //       ...obj.PermanentAddress,
            //       Address: trimmedValue,
            //     },
            //   };
            // }

           
            // if (processedHeaderRow[columnIndex] === "Pincode") {
            //   return {
            //     ...obj,
            //     PermanentAddress: {
            //       ...obj.PermanentAddress,
            //       Pincode: trimmedValue,
            //     },
            //   };
            // }

            // if (processedHeaderRow[columnIndex] === "District") {
            //   return {
            //     ...obj,
            //     PermanentAddress: {
            //       ...obj.PermanentAddress,
            //       District: trimmedValue,
            //     },
            //   };
            // }

            // if (processedHeaderRow[columnIndex] === "State") {
            //   return {
            //     ...obj,
            //     PermanentAddress: {
            //       ...obj.PermanentAddress,
            //       State: trimmedValue,
            //     },
            //   };
            // }

            // if (processedHeaderRow[columnIndex] === "Country") {
            //   return {
            //     ...obj,
            //     PermanentAddress: {
            //       ...obj.PermanentAddress,
            //       Country: trimmedValue,
            //     },
            //   };
            // }

            return {
              ...obj,
              [processedHeaderRow[columnIndex]]: value,
            };
          },
          {
            Sno: index + 1,
            id: index + 1,
          }
        )
      );

      setExcelData(excelObjects);
      console.log(excelObjects);
    };

    reader.readAsArrayBuffer(file);
  };

console.log(excelData);

  const handleSubmit = async () => {
    try {
      const result = await Promise.all(
        excelData.map(async (item) => {
          if (!item.Email || !item.ContactNumber || !item.ContactName || !item.Pincode) {
            toast.error("Please fill the form before submitting");
            throw new Error("Incomplete form data");
          }
          return {
            ...item,
            PermanentAddress: {
              Pincode: item.Pincode,
              District: item.District,
              State: item.State,
              Country: item.Country,
              Address: item.Address,
            },
            GSTIN: item.GST || "N/A",
          };
        })
      );
  
      const info = {
        datas: result,
      };
  
      const res = await addClient(info).unwrap();
      toast.success("Client added successfully");
      setExcelData([]);
      navigate("/addClient")
      

 
    } catch (error) {
      console.error("An error occurred during submission:", error);
    }

  };
  

  const downloadExcelSample = async () => {
    try {
      setDownloadLoading(true);

      let response = await axios.get(`${BASEURL}/Sample/AddBulkClient.xlsx`, {
        responseType: "blob",
      });

      // Create a temporary link element to trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      let atribute = "AddBulkClient.xlsx";

      link.setAttribute("download", atribute);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading sample:", error);
    } finally {
      setDownloadLoading(false);
    }
  };

  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.1,
      minWidth: 10,
      maxWidth: 100,
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
      maxWidth: 200,
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
      headerName: "Contact",
      flex: 0.1,
      minWidth: 100,
      maxWidth: 200,
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
      field: "GSTIN",
      headerName: "GSTIN",
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
      headerName: "Type ",
      flex: 0.1,
      minWidth: 100,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Address",
      headerName: "Address (Street Address) ",
      flex: 0.1,
      minWidth: 100,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Pincode",
      headerName: "Pincode",
      flex: 0.1,
      minWidth: 100,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "District",
      headerName: "District",
      flex: 0.1,
      minWidth: 100,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "State",
      headerName: "State",
      flex: 0.1,
      minWidth: 100,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Country",
      headerName: "Country",
      flex: 0.1,
      minWidth: 100,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
  ];
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Paper
          elevation={3}
          sx={{ padding: "16px", width: "50%", margin: "16px" }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
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
                    backgroundColor: color,
                    "&:hover": {
                      color: "black",
                    },
                  }}
                >
                  Upload Excel File
                </Button>
              </label>
            </Box>
            {excelData.length > 0 && (
              <Button variant="contained" onClick={handleSubmit} s>
                {isLoading ? (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: "#fff",
                    }}
                  />
                ) : (
                  "Submit"
                )}
              </Button>
            )}
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={downloadExcelSample}
              >
                {downloadLoading ? (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: "#fff",
                    }}
                  />
                ) : (
                  "Download Sample"
                )}
              </Button>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ height: "80vh", width: "100%", overflow: "auto" }}>
          <DataGrid rows={excelData} columns={columns} />
        </Box>
      </Box>
    </Box>
  );
};

export default BulkAddClient;
