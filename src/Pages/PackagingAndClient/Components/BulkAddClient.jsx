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

const BulkAddClient = () => {
  /// local state
  const [excelData, setExcelData] = useState([]);
  const [rows, setRows] = [{ id: 1 }];
  const [downloadLoading, setDownloadLoading] = useState(false);
  const { themeColor } = useSelector((state) => state.ui);

  const color = themeColor.sideBarColor1;

  const handleFileChange = (event) => {
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
        item.startsWith("Name")
          ? item.replace(" (its not required for reference only)", "").trim()
          : item
      );
      const headerRowExist = processedHeaderRow.some(
        (item) => item.trim() === query
      );

      if (!headerRowExist) {
        toast.error("Invalid Excel Format");
        return;
      }

      const excelObjects = jsonData.map((row, index) =>
        row.reduce(
          (obj, value, columnIndex) => {
            // Remove white spaces from the cell values
            const trimmedValue =
              typeof value === "string" ? value.trim() : value;
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

  const handleDownloadSample = async () => {
    try {
      setDownloadLoading(true);
      const response = await axios.get(
        `${BASEURL}/Sample/${query}Sample.xlsx`,
        {
          responseType: "blob",
        }
      );

      // Create a temporary link element to trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${query}Sample.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadLoading(false);
    } catch (error) {
      console.error("Error downloading sample:", error);
    } finally {
    }
  };

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
      field: "CompanyName",
      headerName: "Company Name",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "ContactNumber",
      headerName: "Contact",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Email",
      headerName: "Email",
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
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "Address",
      headerName: "Address ",
      flex: 0.3,
      minWidth: 250,
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
              </Grid>
              <Grid item xs={6} style={{ textAlign: "end" }}>
                <Button
                  //   disabled={query === "Quantity" || downloadLoading}
                  variant="contained"
                  color="primary"
                  onClick={handleDownloadSample}
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
