import React, { useState } from "react";
import { Box, styled, Button, CircularProgress } from "@mui/material";
import Header from "../../components/Common/Header";
import axios from "axios";
import * as XLSX from "xlsx";
import { DataGrid, jaJP } from "@mui/x-data-grid";
import BASEURL from "../../constants/BaseApi";
import { useSelector } from "react-redux";
import {
  useAddAlternateNameMutation,
  useAddProductMutation,
} from "../../features/api/productApiSlice";
import { useCreateUserHistoryMutation } from "../../features/api/usersApiSlice";
import { useSocket } from "../../CustomProvider/useWebSocket";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const BulkAddProduct = () => {
  /// initialize
  const socket = useSocket();
  const params = useParams();
  const names = params.id;
  /// global state
  const { themeColor } = useSelector((state) => state.ui);
  const { userInfo } = useSelector((state) => state.auth);

  /// local state
  const [loading, setLoading] = useState(false);
  const [excelData, setExcelData] = useState([]);

  /// RTK query
  const [addProductsApi, { isLoading }] = useAddProductMutation();
  const [createUserHistoryApi] = useCreateUserHistoryMutation();
  const [addAlterNateName, { isLoading: alternatLoading }] =
    useAddAlternateNameMutation();

  /// Handlers
  const donwnloadExcelSample = async () => {
    console.log("hii");
    try {
      setLoading(true);
      let response;
      if (names === "addName") {
        response = await axios.get(`${BASEURL}/Sample/AlternateName.xlsx`, {
          responseType: "blob",
        });
      } else {
        response = await axios.get(`${BASEURL}/Sample/RoboProduct.xlsx`, {
          responseType: "blob",
        });
      }

      // Create a temporary link element to trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      let atribute =
        names === "addName" ? "AlternateName.xlsx" : "RoboProduct.xlsx";

      link.setAttribute("download", atribute);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading sample:", error);
    } finally {
      setLoading(false);
    }
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

  const handleSubmit = async (e) => {
    const transformedExcelData = excelData.map((item) => ({
      name: item.Name,
      brand: item.Brand,
      gst: item.GST,
      category: item.Category,
      subCategory: item.SubCategory,
      weight: item.Weight,
      dimensions: {
        length: item.length,
        width: item.width,
        height: item.height,
      },
    }));

    // Create an array of product objects
    const productsArray = [...transformedExcelData];

    if (!productsArray.length) {
      return;
    }

    const payload = {
      products: productsArray,
    };

    try {
      const res = await addProductsApi(payload).unwrap();

      const liveStatusData = {
        message: `${userInfo.name} Added ${productsArray.length} new product`,
        time: new Date(),
      };
      toast.success(res.message, {
        onClose: () => {
          socket.emit("liveStatusServer", liveStatusData);
        },
      });

      const addProductHistory = {
        userId: userInfo.adminId,
        message: liveStatusData.message,
        type: "product",
        by: "user",
        reference: { product: productsArray.map((item) => item.name) },
      };

      const historyRes = await createUserHistoryApi(addProductHistory);

      setExcelData([]);
    } catch (error) {
      console.log("Error occurred while adding products", error.message);
      console.log(error);
    }
  };

  const handleAddNameSubmit = async (e) => {
    const transformedExcelData = excelData.map((item) => ({
      SKU: item.SKU,
      AltName: item.AltName,
    }));

    // Create an array of product objects
    const productsArray = [...transformedExcelData];

    if (!productsArray.length) {
      return;
    }

    const payload = {
      products: productsArray,
    };

    try {
      const res = await addAlterNateName(payload).unwrap();

      toast.success(res.message);

      setExcelData([]);
    } catch (error) {
      console.log("Error occurred while adding products", error.message);
      console.log(error);
    }
  };

  /// columns
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
      field: "Name",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      flex: 0.3,
      headerName: "Name",
      width: 350,
    },
    {
      field: "Brand",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      flex: 0.3,
      headerName: "Brand",
      width: 250,
    },

    {
      field: "Category",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      flex: 0.3,
      headerName: "Category",
      width: 250,
    },
    {
      field: "GST",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      flex: 0.3,
      headerName: "GST",
      width: 250,
    },
    {
      field: "SubCategory",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      flex: 0.3,
      headerName: "Subcategory",
      width: 250,
    },
    {
      field: "dimensions",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      flex: 0.3,
      headerName: "(L X W X H) (cm)",
      width: 280,
      renderCell: (params) => {
        const { length, width, height } = params.row;
        return `${length} * ${width} * ${height}`;
      },
    },
    {
      field: "Weight",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      flex: 0.3,
      headerName: "Weight (gm)",
      width: 50,
    },
  ];
  const altColumns = [
    {
      field: "Sno",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      flex: 0.1,
      headerName: "Sno",
      width: 50,
    },
    {
      field: "SKU",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      flex: 0.1,
      headerName: "SKU",
      width: 100,
    },
    {
      field: "AltName",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      flex: 0.3,
      headerName: "Alternate Name",
      width: 500,
    },
  ];
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
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
                backgroundColor: themeColor.sideBarColor1,
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
        {}

        {names === "addName" ? (
          <Button
            variant="contained"
            sx={{
              backgroundColor: themeColor.sideBarColor1,
              "&:hover": {
                backgroundColor: "black",
              },
            }}
            onClick={() => handleAddNameSubmit()}
          >
            {alternatLoading ? (
              <CircularProgress
                sx={{
                  color: "white",
                }}
              />
            ) : (
              "Submit"
            )}
          </Button>
        ) : (
          <Button
            variant="contained"
            sx={{
              backgroundColor: themeColor.sideBarColor1,
              "&:hover": {
                backgroundColor: "black",
              },
            }}
            onClick={() => handleSubmit()}
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
        )}

        <Button
          variant="contained"
          sx={{
            backgroundColor: themeColor.sideBarColor1,
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
            "   Download Sample Excel"
          )}
        </Button>
      </Box>
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
        }}
      >
        <DataGrid
          rows={excelData}
          columns={params.id === "addName" ? altColumns : columns}
        />
      </Box>
    </Box>
  );
};

export default BulkAddProduct;
