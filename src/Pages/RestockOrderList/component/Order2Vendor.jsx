import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbar,
  useGridApiRef,
} from "@mui/x-data-grid";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  InputAdornment,
  CircularProgress,
  styled,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSocket } from "../../../CustomProvider/useWebSocket";
import { useGetAllVendorQuery } from "../../../features/api/RestockOrderApiSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import {
  useCreateOverseasOrderMutation,
  useAssignOrderVendorMutation,
} from "../../../features/api/RestockOrderApiSlice";
import { useSelector } from "react-redux";
import { Portal } from "@mui/base/Portal";

const StyledCell = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  padding: 1.5,
}));

const StyledCellHeader = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  background: "linear-gradient(0deg, #01127D, #04012F)",
  color: "#fff",
  padding: 1.5,
}));

const Order2Vendor = ({
  items,
  open,
  onClose,
  handleDelete,
  reStockId,
  refetch,
  setSelectedItems,
}) => {
  /// initialize
  const apiRef = useGridApiRef();
  const socket = useSocket();

  /// global state
  const { userInfo } = useSelector((state) => state.auth);

  /// local state

  const [skuFilter, setSkuFilter] = useState("");
  const [prices, setPrices] = useState({});
  const [rmbPrice, setRmbPrice] = useState({});
  const [rows, setRows] = useState([]);
  const [disable, setDisable] = useState(false);
  const [processItems, setProcessItems] = useState([]);
  const [conversionRate, setConversionRate] = useState(null);

  /// rtk query
  const { data: allVendorData } = useGetAllVendorQuery();
  const [assignOrderApi, { isLoading }] = useAssignOrderVendorMutation();

  useEffect(() => {
    setProcessItems((prev) => {
      return items.map((item, index) => ({
        ...item,
      }));
    });
  }, [items]);




  const handleChange = (e, SKU) => {
    const { name, value } = e.target;

    if(name === "NewQuantity"){
      setProcessItems((prev) => {
        return prev.map((item) => {
          if (item.SKU === SKU) {
            return {
             ...item,
              [name]: +value,
            };
          } else {
            return item;
          }
        });
      });
    }else if(name === "USD"){
      setProcessItems((prev) => {
        return prev.map((item) => {
          if (item.SKU === SKU) {
            return {
             ...item,
              USD: +value,
              RMB : (conversionRate * +value).toFixed(2) || 0
            };
          } else {
            return item;
          }
        });
      });
    }else if(name === "RMB"){
      setProcessItems((prev) => {
        return prev.map((item) => {
          if (item.SKU === SKU) {
            return {
             ...item,
              RMB: +value,
              USD: (+value / conversionRate).toFixed(2) || 0
            };
          } else {
            return item;
          }
        });
      });
    }
  };

  const handleAsign = async (e) => {
    setDisable(true);
    if (processItems.length > 0) {
      const processedItems = processItems.map((item, index) => ({
        USD: +item.USD || 0,
        RMB: +item.RMB || 0,
        Orderqty: item.NewQuantity,
        Gst: item.GST,
        Name: item.Name,
        Brand: item.Brand,
        SKU: item.SKU,
        prevRMB:item.prevRMB,
        prevUSD:item.prevUSD
        
      }));

      try {
        const data = {
          restockId: reStockId,
          vendorId: e,
          products: processedItems,
        };

        const res = await assignOrderApi(data).unwrap();
        const liveStatusData = {
          message: `${userInfo.name} Created Overseas Order `,
          time: new Date(),
        };


        socket.emit("liveStatusServer", liveStatusData);
        toast.success("Restock order was successfully processed");
        onClose();
        refetch();
        setSelectedItems([]);
        setPrices([]);
        setConversionRate(null)
        setProcessItems([])
      } catch (err) {
        console.error("Error at Creating Restock Order: " + err);
      }
    } else {
      toast.error("Please select a product.");
    }
    setDisable(false);
  };

  useEffect(() => {
    if (allVendorData?.status === "success") {
      const data = allVendorData?.data?.map((item, index) => {
        return {
          id: item.VendorId, // Use 'restockId' as the unique id for each row
          Sno: index + 1,
          companyName: item.CompanyName,
          concernPerson: item.ConcernPerson,
          generated: item.totalProductGenerated,
          inProcess: item.totalProductInProcess,
          paid: item.totalProductPaid,
          status: item.status,
          VendorId: item.VendorId,
        };
      });

      setRows(data);
    }
  }, [allVendorData]);

  const handleFilterChange = (field, operator, value) => {
    apiRef.current.setFilterModel({
      items: [{ field: field, operator: operator, value: value }],
    });
  };

  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.3,
      minWidth: 70,
      maxWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "companyName",
      headerName: "Company Name",
      flex: 0.3,
      minWidth: 100,
      // maxWidth: 390,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "concernPerson",
      headerName: "Concern Person",
      flex: 0.3,
      minWidth: 100,
      // maxWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "action",
      headerName: "Action",
      flex: 0.3,
      minWidth: 80,
      // maxWidth: 110,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => (
        <Button disabled={disable} onClick={() => handleAsign(params.row.id)}>
          Assign
        </Button>
      ),
    },
  ];

  function MyCustomToolbar(prop) {
    return (
      <React.Fragment>
        <Portal container={() => document.getElementById("filter-panel")}>
          <GridToolbarQuickFilter />
        </Portal>
        {/* <GridToolbar {...prop} /> */}
      </React.Fragment>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xxl"
      sx={{ backdropFilter: "blur(5px)" }}
      fullWidth
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "3rem",
        }}
      >
        <DialogTitle
          sx={{
            flex: "1",
            textAlign: "center",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          Select vendor
        </DialogTitle>
        <CloseIcon
          onClick={onClose}
          sx={{
            backgroundColor: "#000",
            color: "#fff",
            borderRadius: "5rem",
            marginRight: "1rem",
            cursor: "pointer",
          }}
        />
      </Box>
      <DialogContent sx={{ overflow: "hidden" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              border: "0.5px solid #ccc",
              height: "50%",
              overflow: "auto",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingX: "10px",
                padding: "5px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: "15%",
                    gap: "10px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.878rem",
                      fontWeight: "bold",
                    }}
                  >
                    Conversion rate
                  </Typography>{" "}
                  <input
                    value={conversionRate}
                    style={{
                      width: "30px",
                    }}
                    onChange={(e) => setConversionRate(e.target.value)}
                  />
                </Box>
                <Box
                  sx={{
                    width: "100%",
                  }}
                >
                  <Typography
                    textAlign="center"
                    sx={{
                      fontSize: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    Select product
                  </Typography>
                </Box>
              </Box>
            </Box>
            <TableContainer
              sx={{
                height: "40vh",
              }}
            >
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <StyledCellHeader>Sno</StyledCellHeader>
                    <StyledCellHeader>SKU</StyledCellHeader>

                    <StyledCellHeader>Name</StyledCellHeader>

                    <StyledCellHeader>Order QTY</StyledCellHeader>

                    <StyledCellHeader>Prev RMB</StyledCellHeader>
                    <StyledCellHeader>Prev USD</StyledCellHeader>

                    <StyledCellHeader>USD $</StyledCellHeader>
                    <StyledCellHeader>RMB ¥</StyledCellHeader>
                    <StyledCellHeader>Delete</StyledCellHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {processItems.map((item, index) => (
                    <TableRow
                      key={item.id}
                      sx={{ fontSize: "12px", padding: "10px" }}
                    >
                      <StyledCell>{index + 1}</StyledCell>
                      <StyledCell
                        sx={{ textAlign: "center", fontSize: "12px" }}
                      >
                        {item.SKU}
                      </StyledCell>

                      <StyledCell
                        sx={{ textAlign: "center", fontSize: "12px" }}
                      >
                        {item.Name}
                      </StyledCell>
                      <StyledCell
                        sx={{ textAlign: "center", fontSize: "12px" }}
                      >
                         <input
                          id={`price-${index}`}
                          variant="outlined"
                          name="NewQuantity"
                          placeholder="$"
                          size="small"
                          style={{
                            width: "50px",
                            padding: "5px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            textAlign: "center"
                          }}
                          value={item.NewQuantity} 
                                               
                          onChange={(e) =>{
                            handleChange(e,item.SKU)
                          }}
                        />
                      
                      </StyledCell>
                      <StyledCell
                        sx={{ textAlign: "center", fontSize: "12px" }}
                      >
                        ¥ {item.prevRMB}
                      </StyledCell>
                      <StyledCell
                        sx={{ textAlign: "center", fontSize: "12px" }}
                      >
                        $ {item.prevUSD}
                      </StyledCell>
                      <StyledCell
                        sx={{ textAlign: "center", fontSize: "12px" }}
                      >
                        <input
                          id={`price-${index}`}
                          variant="outlined"
                          name="USD"
                          placeholder="$"
                          size="small"
                          style={{
                            width: "100px",
                            padding: "5px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                          }}
                          value={item.USD} // Set the value from state
                          // onChange={(e) => {
                          //   const newPrices = { ...prices };
                          //   newPrices[item.SKU] = e.target.value;
                          //   setPrices(newPrices);
                          // }}
                          
                          onChange={(e) =>{
                            handleChange(e,item.SKU)
                          }}
                        />
                      </StyledCell>
                      <StyledCell
                        sx={{ textAlign: "center", fontSize: "12px" }}
                      >
                        <input
                          id={`price-${index}`}
                          variant="outlined"
                          name="RMB"
                          placeholder="¥"
                          size="small"
                          style={{
                            width: "100px",
                            padding: "5px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                          }}
                          value={item.RMB} // Set the value from state
                          // onChange={(e) => {
                          //   const newRMBprice = { ...rmbPrice };
                          //   newRMBprice[item.SKU] = e.target.value;
                          //   setRmbPrice(newRMBprice);
                          // }}

                          onChange={(e) =>{
                            handleChange(e,item.SKU)
                          }}
                        />
                      </StyledCell>
                      <StyledCell
                        sx={{ textAlign: "center", fontSize: "12px" }}
                      >
                        <DeleteIcon
                          onClick={() => handleDelete(item.id)}
                          sx={{ cursor: "pointer" }}
                        />
                      </StyledCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box
            sx={{
              height: "50%",
              border: "0.5px solid #ccc",
              overflow: "auto",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingX: "10px",
              }}
            >
              <Box id="filter-panel" />
              <Box
                sx={{
                  width: "100%",
                }}
              >
                {" "}
                <Typography
                  textAlign="center"
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                  }}
                >
                  Asign Vendor
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                height: "30vh",
                overflow: "auto",
                "& .super-app-theme--header": {
                  background: "#ccc",
                  color: "black",
                  textAlign: "center",
                },
              }}
            >
              <DataGrid
                columns={columns}
                rows={rows}
                rowHeight={30}
                initialState={{
                  columns: {
                    columnVisibilityModel: {
                      Category: false,
                    },
                  },
                  filter: {
                    filterModel: {
                      items: ["OrderDate"],
                      quickFilterExcludeHiddenColumns: true,
                    },
                  },
                }}
                slots={{
                  toolbar: MyCustomToolbar,
                }}
                // editMode="row"
                // apiRef={apiRef}
                // checkboxSelection
                disableRowSelectionOnClick
                // onRowSelectionModelChange={handleSelectionChange}
                // rowSelectionModel={selectedItems}
                // processRowUpdate={handleRowUpdate}
                onProcessRowUpdateError={(error) => {}}
                // autoPageSize
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 2,
          gap: "1rem",
          padding: "0.5rem",
          backgroundColor: " #e6e6e6",
        }}
      >
        {/* <Button variant="outlined" onClick={handleConfirm}>
          Confirm
        </Button> */}
        <Button variant="outlined" onClick={onClose}>
          {isLoading ? (
            <CircularProgress size={24} color="inherit" /> // Show loading indicator
          ) : (
            "Cancel"
          )}
        </Button>
      </Box>
    </Dialog>
  );
};

export default Order2Vendor;
