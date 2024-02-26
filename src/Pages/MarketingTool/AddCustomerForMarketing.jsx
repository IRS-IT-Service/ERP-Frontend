import React, { useState } from "react";
import {
  Box,
  styled,
  Button,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";
import Header from "../../components/Common/Header";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import BASEURL from "../../constants/BaseApi";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const columns = [
  {
    field: "Sno",
    headerClassName: "super-app-theme--header",
    cellClassName: "super-app-theme--cell",
    flex: 0.3,
    headerName: "Sno",
    width: 100,
  },
  {
    field: "CustomerName",
    headerClassName: "super-app-theme--header",
    cellClassName: "super-app-theme--cell",
    flex: 0.3,
    headerName: "Customer Name",
    width: 350,
  },
  {
    field: "CompanyName",
    headerClassName: "super-app-theme--header",
    cellClassName: "super-app-theme--cell",
    flex: 0.3,
    headerName: "Company Name",
    width: 250,
  },

  {
    field: "MobileNo",
    headerClassName: "super-app-theme--header",
    cellClassName: "super-app-theme--cell",
    flex: 0.3,
    headerName: "Mobile No",
    width: 250,
  },
  {
    field: "Address",
    headerClassName: "super-app-theme--header",
    cellClassName: "super-app-theme--cell",
    flex: 0.3,
    headerName: "Address",
    width: 250,
  },
];

const AddCustomerForMarketing = () => {
  const [data, setData] = useState([
    {
      Sno: 1,
      id: 1,
      CustomerName: "",
      MobileNo: "",
      CompanyName: "",
      Address: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [submitData, setSubmitData] = useState([]);
  // const handle change for data input

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...data];
    list[index][name] = value;
    setData(list);
  };

  // for handeling add buttons
  const handleAddData = () => {
    const updatedData = data.map((item, idx) => ({
      ...item,
      Sno: idx + 1,
      id: idx + 1,
    }));
    const updatedSubmitData = [...submitData];

    updatedData.forEach((item) => {
      const existingSno = updatedSubmitData.find(
        (dataItem) => dataItem.Sno === item.Sno
      );
      if (existingSno) {
        item.Sno = updatedSubmitData.length + 1;
        item.id = updatedSubmitData.length + 1;
      }
    });

    setSubmitData([...updatedSubmitData, ...updatedData]);
    setData([
      {
        Sno: updatedSubmitData.length + 1,
        CustomerName: "",
        MobileNo: "",
        CompanyName: "",
        Address: "",
      },
    ]);
  };
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

  const donwnloadExcelSample = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASEURL}/Sample/CustomersSample.xlsx`,
        {
          responseType: "blob",
        }
      );

      // Create a temporary link element to trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "CustomersSample.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading sample:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = () => {
    if (submitData.length === 0 || excelData.length === 0) {
      return toast.error(
        "Please add some values or upload excel file before submitting"
      );
    }

  };
  return (
    <>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 0, width: "100%", overflow: "hidden" }}
      >
        <DrawerHeader />
        <Header Name={"Bulk Add Product"} />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            marginY: "5px",
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
                sx={{
                  "&:hover": {
                    backgroundColor: "black",
                  },
                }}
                variant="contained"
                component="span"
              >
                Upload Excel File
              </Button>
            </label>
          </Box>
          <Button
            variant="contained"
            sx={{
              "&:hover": {
                backgroundColor: "black",
              },
            }}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <CircularProgress
                sx={{
                  color: "white",
                }}
              />
            ) : (
              "Submit"
            )}
          </Button>
          <Button
            variant="contained"
            sx={{
              // backgroundColor: themeColor.sideBarColor1,
              "&:hover": {
                backgroundColor: "black",
              },
            }}
            onClick={donwnloadExcelSample}
          >
            {loading ? (
              <CircularProgress
                sx={{
                  color: "white",
                }}
              />
            ) : (
              " Download Sample Excel"
            )}
          </Button>
        </Box>
        <Box>
          {data?.map((item, index) => (
            <Grid container spacing={1} key={index}>
              <Grid item sm={1}>
                <TextField
                  label="Sno"
                  fullWidth
                  name="Sno"
                  value={item.Sno}
                  disabled
                />
              </Grid>
              <Grid item sm={2}>
                <TextField
                  label="Customer Name"
                  fullWidth
                  name="CustomerName"
                  value={item.CustomerName}
                  onChange={(e) => handleChange(e, index)}
                />
              </Grid>
              <Grid item sm={3}>
                <TextField
                  label="Company Name"
                  fullWidth
                  name="CompanyName"
                  value={item.CompanyName}
                  onChange={(e) => handleChange(e, index)}
                />
              </Grid>
              <Grid item sm={2}>
                <TextField
                  label="Mobile Number"
                  fullWidth
                  name="MobileNo"
                  value={item.MobileNo}
                  onChange={(e) => handleChange(e, index)}
                />
              </Grid>
              <Grid item sm={4}>
                <TextField
                  label="Address"
                  fullWidth
                  name="Address"
                  value={item.Address}
                  onChange={(e) => handleChange(e, index)}
                />
              </Grid>
            </Grid>
          ))}
          <Button onClick={() => handleAddData()}>Add</Button>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "75vh",
            overflowY: "auto",
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
          }}
        >
          <DataGrid
            rows={submitData.length > 0 ? submitData : excelData}
            columns={columns}
          />
        </Box>
      </Box>
    </>
  );
};

export default AddCustomerForMarketing;
