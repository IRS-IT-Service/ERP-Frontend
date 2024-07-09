import React, { useState } from "react";
import {
  Button,
  Container,
  Grid,
  Paper,
  styled,
  Box,
  CircularProgress,
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

const BulkAddClient = () => {
  /// local state
  const [excelData, setExcelData] = useState([]);
  const [rows, setRows] = [{ id: 1 }];
  const [downloadLoading, setDownloadLoading] = useState(false);
  const { themeColor } = useSelector((state) => state.ui);

  const color = themeColor.sideBarColor1;

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   const reader = new FileReader();

  //   reader.onload = (e) => {
  //     const data = new Uint8Array(e.target.result);
  //     const workbook = XLSX.read(data, { type: "array" });
  //     const sheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[sheetName];
  //     const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  //     // Remove white spaces from the header row
  //     const headerRow = jsonData.shift().map((item) => item.trim());
  //     const processedHeaderRow = headerRow.map((item) =>
  //       item.startsWith("GSTIN")
  //         ? item.replace(" (GST Number)", "").trim()
  //         : item
  //     );
  //     const headerRowExist = processedHeaderRow.some(
  //       (item) => item.trim() === query
  //     );

  //     if (!headerRowExist) {
  //       toast.error("Invalid Excel Format");
  //       return;
  //     }

  //     const excelObjects = jsonData.map((row, index) =>
  //       row.reduce(
  //         (obj, value, columnIndex) => {
  //           // Remove white spaces from the cell values
  //           const trimmedValue =
  //             typeof value === "string" ? value.trim() : value;
  //           return {
  //             ...obj,
  //             [processedHeaderRow[columnIndex]]: trimmedValue,
  //           };
  //         },
  //         {
  //           Sno: index + 1,
  //           id: index + 1,
  //         }
  //       )
  //     );

  //     setExcelData(excelObjects);
  //   };

  //   reader.readAsArrayBuffer(file);
  // };

  const handleFileChange = (event) => {
    console.log(event)
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
      // Remove white spaces from the header row
      const headerRow = jsonData.shift().map((item) => item.trim());
      const processedHeaderRow = headerRow.map((item) =>
        item.startsWith("Address") ? item.replace(" (Street Address)", "").trim() : item
      );
  
      const headerRowExist = processedHeaderRow.some(
        (item) => item.trim() === "ClientId"
      );
  
      if (!headerRowExist) {
        toast.error("Invalid Excel Format");
        return;
      }
  
      const excelObjects = jsonData.map((row, index) =>
        row.reduce(
          (obj, value, columnIndex) => {
            // Remove white spaces from the cell values
            const trimmedValue = typeof value === "string" ? value.trim() : value;
  
            // Constructing PermanentAddress object
            if (processedHeaderRow[columnIndex] === 'Address') {
              return {
                ...obj,
                PermanentAddress: {
                  ...obj.PermanentAddress,
                  Address: trimmedValue,
                }
              };
            }
  
            // Continue adding other address fields similarly
            if (processedHeaderRow[columnIndex] === 'Pincode') {
              return {
                ...obj,
                PermanentAddress: {
                  ...obj.PermanentAddress,
                  Pincode: trimmedValue,
                }
              };
            }
  
            if (processedHeaderRow[columnIndex] === 'District') {
              return {
                ...obj,
                PermanentAddress: {
                  ...obj.PermanentAddress,
                  District: trimmedValue,
                }
              };
            }
  
            if (processedHeaderRow[columnIndex] === 'State') {
              return {
                ...obj,
                PermanentAddress: {
                  ...obj.PermanentAddress,
                  State: trimmedValue,
                }
              };
            }
  
            if (processedHeaderRow[columnIndex] === 'Country') {
              return {
                ...obj,
                PermanentAddress: {
                  ...obj.PermanentAddress,
                  Country: trimmedValue,
                }
              };
            }
  
            return {
              ...obj,
              [processedHeaderRow[columnIndex]]: trimmedValue,
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


  const handleSubmit = async () => {
    try {
      const params = {
        products: excelData.map((item) => {
          return { SKU: item.SKU, value: item[query] };
        }),
      };

      const res = await updateProductApi({
        type: query,
        body: params,
      }).unwrap();
      const liveStatusData = {
        message: `${userInfo.name} updated ${query} of ${params.products
          .map((product) => `${product.SKU} to ${product.value}`)
          .join(", ")} `,
        time: new Date(),
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
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
    setExcelData([]);
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
      maxWidth:100,
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
      maxWidth:200,
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
      maxWidth:400,
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
      maxWidth:200,
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
      maxWidth:200,
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
      maxWidth:200,
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
      maxWidth:200,
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
      maxWidth:200,
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
      maxWidth:200,
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
      maxWidth:200,
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
      maxWidth:200,
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
      maxWidth:200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
  ];
  return (
    <Container sx={{ marginTop: "100px" }}>
      <Grid container alignItems="center" justifyContent="center" spacing={2}>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} style={{ padding: "16px" }}>
            <Grid container spacing={2} justifyContent="space-between">
              <Grid item xs={6} style={{ textAlign: "start" }}>
                <input
                  type="file"
                  accept=".xls, .xlsx"
                  onChange={(event)=>handleFileChange(event)}
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
              </Grid>
              <Grid item xs={6} style={{ textAlign: "end" }}>
                <Button
                  //   disabled={query === "Quantity" || downloadLoading}
                  variant="contained"
                  color="primary"
                  onClick={downloadExcelSample}
                >
                  {downloadLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Download Sample"
                  )}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item>
          {excelData.length > 0 && (
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </Grid>
      </Grid>
      <Box sx={{ height: "80vh", width: "100%" }}>
        <DataGrid rows={excelData} columns={columns} />
      </Box>
    </Container>
  );
};

export default BulkAddClient;
