import { React, useEffect, useState } from "react";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import Nodata from "../../../assets/empty-cart.png";
import FilterBar from "../../../components/Common/FilterBar";
import { Grid, Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setAllProducts } from "../../../features/slice/productSlice";
import { useGetAllProductQuery } from "../../../features/api/productApiSlice";
import Loading from "../../../components/Common/Loading";
import { useNavigate } from "react-router-dom";
import DiscountCalcDialog from "./DiscountCalcDialog";

const DiscountQueryGrid = () => {
  /// initialize
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiRef = useGridApiRef();

  /// global state
  const { searchTerm, forceSearch } = useSelector((state) => state.product);

  /// local state

  const [showNoData, setShowNoData] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsData, setSelectedItemsData] = useState([]);
  const [open, setOpen] = useState(false);

  /// rtk query

  const {
    data: allProductData,
    isLoading: productLoading,
    refetch,
    isFetching,
  } = useGetAllProductQuery(
    { searchTerm: searchTerm || undefined },
    {
      pollingInterval: 1000 * 300,
    }
  );

  /// handlers

  const handleSelectionChange = (selectionModel) => {
    setSelectedItems(selectionModel);
    const newSelectedRowsData = rows.filter((item) =>
      selectionModel.includes(item.id)
    );
    setSelectedItemsData(newSelectedRowsData);
  };

  const removeSelectedItems = (id) => {
    const newSelectedItems = selectedItems.filter((item) => item !== id);
    const newSelectedRowsData = selectedItemsData.filter(
      (item) => item.SKU !== id
    );
    setSelectedItemsData(newSelectedRowsData);
    setSelectedItems(newSelectedItems);
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };
  /// useEffect
  useEffect(() => {
    if (allProductData?.status === "success") {
      const data = allProductData?.data.map((item, index) => {
        return {
          id: item.SKU,
          Sno: index + 1,
          SKU: item.SKU,
          Name: item.Name,
          GST: item.GST,
          MRP: item.MRP,
          Quantity: item.ActualQuantity,
          SalesPrice: item.SalesPrice,
          SalesPriceGst:(((item.SalesPrice * item.GST) / 100) + item.SalesPrice ).toFixed(0) ,
          Brand: item.Brand,
          Category: item.Category,
        };
      });

      dispatch(setAllProducts({ ...allProductData }));
      setRows(data);
    }
  }, [allProductData]);

  //Columns*******************
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
minWidth:30,
maxWidth:40,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "SKU",
      headerName: "SKU",

      minWidth:200,
      maxWidth:300,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Name",
      headerName: "Product ",
flex:0.1,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Brand",
      headerName: "Brand",

      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Category",
      headerName: "Category",

      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "GST",
      headerName: "GST",

      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => ` ${(+params.value).toFixed(0)} %`,
    },
    {
      field: "Quantity",
      headerName: "QTY",

      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "MRP",
      headerName: "MRP",

      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => `₹ ${(+params.value).toFixed(0)} `,
    },
    {
      field: "SalesPrice",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Sales",
      align: "center",
      headerAlign: "center",
      minWidth:200,
      maxWidth:300,
      valueFormatter: (params) => `₹ ${(+params.value).toFixed(0)} `,
    },
    {
      field: "SalesPriceGst",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Sales Price Inclu (GST) ₹",
      align: "center",
      minWidth:200,
      maxWidth:300,
      valueFormatter: (params) => `₹ ${(+params.value).toFixed(0)} `,
    },
  ];

  return (
    <Box>
      <FilterBar
        apiRef={apiRef}
        customButton={selectedItems.length ? "Create Query" : ""}
        customOnClick={handleOpenDialog}
      />
      <DiscountCalcDialog
        data={selectedItemsData}
        apiRef={apiRef}
        removeSelectedItems={removeSelectedItems}
        open={open}
        setOpen={setOpen}
      />
      <Grid container>
        {productLoading || isFetching ? (
          <Loading loading={true} />
        ) : (
          <Grid item xs={12} sx={{ mt: "5px" }}>
            <Box
              sx={{
                width: "100%",
                height: "75vh",
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
                "& .MuiDataGrid-columnHeaderTitleContainer": {
                  background: "#eee",
                },
              }}
            >
              <DataGrid
                columns={columns}
                rows={rows}
                rowHeight={40}
                apiRef={apiRef}
                columnVisibilityModel={{
                  Category: false,
                }}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={handleSelectionChange}
                isRowSelectable={(params) => params.row.SalesPrice > 0}
                rowSelectionModel={selectedItems}
                components={{
                  NoRowsOverlay: () => (
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      {showNoData && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                          }}
                        >
                          <img
                            style={{
                              width: "20%",
                            }}
                            src={Nodata}
                          />

                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
                          >
                            No data found !
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ),
                }}
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DiscountQueryGrid;
