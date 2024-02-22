import React, { useEffect, useState, useCallback } from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { Delete, Rotate90DegreesCcw, Transform } from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogContent,
  Button,
  Box,
  styled,
  TextField,
  InputAdornment,
  CircularProgress,
  Typography,
  Collapse,
  Tooltip,

} from "@mui/material";
import { useUpdateProductsColumnMutation } from "../../../features/api/productApiSlice";
import { useSocket } from "../../../CustomProvider/useWebSocket";
import { toast } from "react-toastify";
import { useCreateUserHistoryMutation } from "../../../features/api/usersApiSlice";
import { useSendMessageToAdminMutation } from "../../../features/api/whatsAppApiSlice";
import { useDispatch, useSelector } from "react-redux";
import InfoIcon from "@mui/icons-material/Info";
import {
  removeLiveCalcDetails,
  setLiveCalcDetails,
} from "../../../features/slice/LiveCalcReducer";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
const StyledCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? " #0d0d0d" : "#eee",
  height: "50px",
  padding: 6,
  color: theme.palette.mode === "dark" ? "#fff" : "black",
  // Apply violet background color to specific columns
  "&.violet-bg": {
    backgroundColor: "#93C54B",
  },
  "&.blue-bg": {
    backgroundColor: "#606CF2",
  },
}));

const StyleCellData = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  width: "100%",
}));

const UpdateLiveCalcDialog = ({
  open,
  setOpen,
  data,
  userInfo,
  refetch,
  type,
  setLocalData,
  localData,
  setSelectedItems,
  setSelectedItemsData,
  selectedItemsData,
  selectedItems,
}) => {
  // Initialization
  const socket = useSocket();

  // Local state
  console.log(localData);
  // RTK query
  const [updateProductsApi, { isLoading: updateProductLoading }] =
    useUpdateProductsColumnMutation();
  const [createUserHistoryApi] = useCreateUserHistoryMutation();
  const [sendMessageToAdmin] = useSendMessageToAdminMutation();
  const { liveCalcDetails } = useSelector((state) => state.liveCalc);
  const dispatch = useDispatch();

  // useEffect
  useEffect(() => {
    const newLocalData = data.map((item) => {
      const withoutTaxSalesProfit = (
        ((item.SalesPrice - item.LandingCost) /
          (item.LandingCost * (1 + item.SalesTax / 100))) *
        100
      ).toFixed(2);

      const withoutTaxSellerProfit = (
        ((item.SellerPrice - item.LandingCost) /
          (item.LandingCost * (1 + item.SellerTax / 100))) *
        100
      ).toFixed(2);

      return {
        ...item,
        ProfitSales: withoutTaxSalesProfit,
        ProfitSeller: withoutTaxSellerProfit,
        actualSalesProfit: item.ProfitSales,
        actualSellerProfit: item.ProfitSeller,
      };
    });

    setLocalData(newLocalData);
    // dispatch(setLiveCalcDetails(newLocalData))
  }, [data]);

  //for competitor
  const [openStates, setOpenStates] = useState(data.map(() => false));
  const handleRowClick = (index) => {
    const updatedOpenStates = [...openStates];
    updatedOpenStates[index] = !updatedOpenStates[index];
    setOpenStates(updatedOpenStates);
  };

  //end

  // Handlers
  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = async () => {
    try {
      // Changed values
      const updatedSalesTax = [];
      const updatedSalesPrice = [];
      const updatedSellerTax = [];
      const updatedSellerPrice = [];

      if (type === "Sales") {
        data.forEach((item, i) => {
          const newSalesTax = +localData[i].SalesTax || 0;
          const newSalesPrice = +localData[i].SalesPrice || 0;
          if (+item.SalesTax !== newSalesTax) {
            updatedSalesTax.push({
              SKU: item.SKU,
              value: newSalesTax,
              name: item.Name,
            });
          }
          if (+item.SalesPrice !== newSalesPrice) {
            updatedSalesPrice.push({
              SKU: item.SKU,
              value: newSalesPrice,
              name: item.Name,
            });
          }
        });

        if (updatedSalesPrice.length) {
          const params = {
            type: "SalesPrice",
            body: { products: updatedSalesPrice },
          };

          const res = await updateProductsApi(params).unwrap();
          const liveStatusData = {
            message: `${userInfo.name} updated SalesPrice of ${updatedSalesPrice
              .map((product) => `${product.name} to ${product.value}`)
              .join(", ")} `,
            time: new Date().toLocaleTimeString("en-IN", {
              timeZone: "Asia/Kolkata",
            }),
          };
          const whatsappMessage = {
            message: liveStatusData.message,
            contact: import.meta.env.VITE_ADMIN_CONTACT,
          };
          await sendMessageToAdmin(whatsappMessage).unwrap();
          socket.emit("liveStatusServer", liveStatusData);
          toast.success("SalesPrice updated successfully");
          const addProductHistory = {
            userId: userInfo.adminId,
            message: liveStatusData.message,
            type: "product",
            by: "user",
            reference: {
              product: updatedSalesPrice.map(
                (product) => `${product.name} to ${product.value}`
              ),
            },
          };
          const historyRes = await createUserHistoryApi(addProductHistory);
        }
        if (updatedSalesTax.length) {
          const params = {
            type: "SalesTax",
            body: { products: updatedSalesTax },
          };

          const res = await updateProductsApi(params).unwrap();
          const liveStatusData = {
            message: `${userInfo.name} updated SalesTax of ${updatedSalesTax
              .map((product) => `${product.name} to ${product.value}`)
              .join(", ")} `,
            time: new Date().toLocaleTimeString("en-IN", {
              timeZone: "Asia/Kolkata",
            }),
          };
          socket.emit("liveStatusServer", liveStatusData);
          toast.success("SalesTax updated successfully");
          const addProductHistory = {
            userId: userInfo.adminId,
            message: liveStatusData.message,
            type: "product",
            by: "user",
            reference: {
              product: updatedSalesTax.map(
                (product) => `${product.name} to ${product.value}`
              ),
            },
          };
          const historyRes = await createUserHistoryApi(addProductHistory);
          const whatsappMessage = {
            message: liveStatusData.message,
            contact: import.meta.env.VITE_ADMIN_CONTACT,
          };
          await sendMessageToAdmin(whatsappMessage).unwrap();
        }

        if (updatedSalesPrice.length || updatedSalesTax.length) {
          refetch();
        }
        setOpen(false);
      }

      if (type === "Seller") {
        data.forEach((item, i) => {
          const newSellerTax = +localData[i].SellerTax || 0;
          const newSellerPrice = +localData[i].SellerPrice || 0;
          if (+item.SellerTax !== newSellerTax) {
            updatedSellerTax.push({
              SKU: item.SKU,
              value: newSellerTax,
              name: item.Name,
            });
          }
          if (+item.SellerPrice !== newSellerPrice) {
            updatedSellerPrice.push({
              SKU: item.SKU,
              value: newSellerPrice,
              name: item.Name,
            });
          }
        });

        if (updatedSellerPrice.length) {
          const params = {
            type: "SellerPrice",
            body: { products: updatedSellerPrice },
          };

          const res = await updateProductsApi(params).unwrap();
          const liveStatusData = {
            message: `${
              userInfo.name
            } updated SellerPrice of ${updatedSellerPrice
              .map((product) => `${product.name} to ${product.value}`)
              .join(", ")} `,
            time: new Date().toLocaleTimeString("en-IN", {
              timeZone: "Asia/Kolkata",
            }),
          };
          socket.emit("liveStatusServer", liveStatusData);
          toast.success("SellerPrice updated successfully");
          const addProductHistory = {
            userId: userInfo.adminId,
            message: liveStatusData.message,
            type: "product",
            by: "user",
            reference: {
              product: updatedSellerPrice.map(
                (product) => `${product.name} to ${product.value}`
              ),
            },
          };
          const historyRes = await createUserHistoryApi(addProductHistory);
          const whatsappMessage = {
            message: liveStatusData.message,
            contact: import.meta.env.VITE_ADMIN_CONTACT,
          };
          await sendMessageToAdmin(whatsappMessage).unwrap();
        }
        if (updatedSellerTax.length) {
          const params = {
            type: "SellerTax",
            body: { products: updatedSellerTax },
          };

          const res = await updateProductsApi(params).unwrap();
          const liveStatusData = {
            message: `${userInfo.name} updated SalesTax of ${updatedSellerTax
              .map((product) => `${product.name} to ${product.value}`)
              .join(", ")} `,
            time: new Date().toLocaleTimeString("en-IN", {
              timeZone: "Asia/Kolkata",
            }),
          };
          socket.emit("liveStatusServer", liveStatusData);
          toast.success("SellerTax updated successfully");
          const addProductHistory = {
            userId: userInfo.adminId,
            message: liveStatusData.message,
            type: "product",
            by: "user",
            reference: {
              product: updatedSellerTax.map(
                (product) => `${product.name} to ${product.value}`
              ),
            },
          };
          const historyRes = await createUserHistoryApi(addProductHistory);
          const whatsappMessage = {
            message: liveStatusData.message,
            contact: import.meta.env.VITE_ADMIN_CONTACT,
          };
          await sendMessageToAdmin(whatsappMessage).unwrap();
        }
      }
      if (
        updatedSalesPrice.length ||
        updatedSalesTax.length ||
        updatedSellerPrice.length ||
        updatedSellerTax.length
      ) {
        refetch();
      }
      setOpen(false);
    } catch (e) {
      console.error("An error occurred Update Price Grid:");
      console.error(e);
    }
  };

  const removeSelectedItems = useCallback(
    (id) => {
      const newSelectedItemsIndex = selectedItems.indexOf(id);
      const newSelectedRowsDataindex = selectedItemsData.findIndex(
        (item) => item.id === id
      );

      if (newSelectedItemsIndex !== -1 && newSelectedRowsDataindex !== -1) {
        // Create copies of the arrays
        const newSelectedItems = selectedItems.slice();
        const newSelectedRowsData = selectedItemsData.slice();

        // Remove the item from the copies
        newSelectedItems.splice(newSelectedItemsIndex, 1);
        newSelectedRowsData.splice(newSelectedRowsDataindex, 1);

        setSelectedItemsData(newSelectedRowsData);
        setSelectedItems(newSelectedItems);
      } else {
        console.log(`Item with ID ${id} not found.`);
      }
    },
    [selectedItems, selectedItemsData]
  );
  //Reset value after delete elements
  useEffect(() => {
    const matchingArray = [];
    selectedItemsData.forEach((item) => {
      const match = liveCalcDetails.find((items) => item.SKU === items.SKU);
      if (match) {
        matchingArray.push(match);
      }
    });

    if (matchingArray.length > 0) {
      setLocalData(matchingArray);
    }
  }, [selectedItemsData, setSelectedItemsData]);

  const handleChange = (e, sku) => {
    const { value, name } = e.target;
    let values = [];
    // Updating the values
    setLocalData((prevData) => {
      return (values = prevData.map((data) => {
        if (sku === data.SKU) {
          // SalesTax Change
          if (name === "SalesTax") {
            const salesPriceByProfitPer =
              (+data.LandingCost || 0) * (1 + +data.ProfitSales / 100);

            const profitValue =
              (+salesPriceByProfitPer || 0) - (+data.LandingCost || 0);
            const taxProfitValue = (profitValue / 100) * (value || 0);
            const newSalesPrice = Math.round(
              taxProfitValue + salesPriceByProfitPer
            );

            const newActualSalesProfit = (
              ((newSalesPrice - +data.LandingCost) / +data.LandingCost) *
              100
            ).toFixed(2);
            return {
              ...data,
              [name]: value,
              SalesPrice: newSalesPrice,
              actualSalesProfit: newActualSalesProfit,
            };
          }
          // ProfitSales Change
          if (name === "ProfitSales") {
            const salesPriceByProfitPer =
              (+data.LandingCost || 0) * (1 + +value / 100);
            const profitValue =
              (+salesPriceByProfitPer || 0) - (+data.LandingCost || 0);
            const taxProfitValue = (profitValue / 100) * (+data.SalesTax || 0);
            const newSalesPrice = Math.round(
              taxProfitValue + salesPriceByProfitPer
            );
            const newActualSalesProfit = (
              ((newSalesPrice - +data.LandingCost) / +data.LandingCost) *
              100
            ).toFixed(2);
            return {
              ...data,
              [name]: value,
              SalesPrice: newSalesPrice,
              actualSalesProfit: newActualSalesProfit,
            };
          }

          // SalesPrice Change
          if (name === "SalesPrice") {
            const withoutTaxSalesProfit = Math.round(
              ((+value - +data.LandingCost) /
                (+data.LandingCost * (1 + +data.SalesTax / 100))) *
                100
            );
            const newActualSalesProfit = (
              ((+value - +data.LandingCost) / +data.LandingCost) *
              100
            ).toFixed(2);
            return {
              ...data,
              [name]: value,
              ProfitSales: withoutTaxSalesProfit,
              actualSalesProfit: newActualSalesProfit,
            };
          }

          // SellerTax Change
          if (name === "SellerTax") {
            const sellerPriceByProfitPer =
              (+data.LandingCost || 0) * (1 + +data.ProfitSeller / 100);

            const profitValue =
              (+sellerPriceByProfitPer || 0) - (+data.LandingCost || 0);
            const taxProfitValue = (profitValue / 100) * (value || 0);
            const newSellerPrice = Math.round(
              taxProfitValue + sellerPriceByProfitPer
            );

            const newActualSellerProfit = (
              ((newSellerPrice - +data.LandingCost) / +data.LandingCost) *
              100
            ).toFixed(2);

            return {
              ...data,
              [name]: value,
              SellerPrice: newSellerPrice,
              actualSellerProfit: newActualSellerProfit,
            };
          }

          // ProfitSeller Change
          if (name === "ProfitSeller") {
            const sellerPriceByProfitPer =
              (+data.LandingCost || 0) * (1 + +value / 100);

            const profitValue =
              (+sellerPriceByProfitPer || 0) - (+data.LandingCost || 0);
            const taxProfitValue = (profitValue / 100) * (+data.SellerTax || 0);
            const newSellerPrice = Math.round(
              taxProfitValue + sellerPriceByProfitPer
            );

            const newActualSellerProfit = (
              ((newSellerPrice - +data.LandingCost) / +data.LandingCost) *
              100
            ).toFixed(2);

            return {
              ...data,
              [name]: value,
              SellerPrice: newSellerPrice,
              actualSellerProfit: newActualSellerProfit,
            };
          }

          // SalesPrice Change
          if (name === "SellerPrice") {
            const withoutTaxSellerProfit = (
              ((+value - +data.LandingCost) /
                (+data.LandingCost * (1 + +data.SellerTax / 100))) *
              100
            ).toFixed(2);

            const newActualSellerProfit = (
              ((+value - +data.LandingCost) / +data.LandingCost) *
              100
            ).toFixed(2);
            return {
              ...data,
              [name]: value,
              ProfitSeller: withoutTaxSellerProfit,
              actualSellerProfit: newActualSellerProfit,
            };
          }
        } else {
          return data;
        }
      }));
    });



    // Updating the correlated value
    if (name === "SalesTax") {
      // Handle SalesTax change if needed
    }
    dispatch(setLiveCalcDetails(values));
  };

  // Columns
  const generateColumns = () => {
    let visibleColumns = [
      { field: "Sno", headerName: "S.No" },
      { field: "SKU", headerName: "SKU" },
      { field: "Name", headerName: "Product" },
      { field: "Quantity", headerName: "Quantity" },
      { field: "LandingCost", headerName: "LC₹", preFix: "₹" },
      { field: "GST", headerName: "GST %", preFix: "%" },
    ];

    if (type === "Sales") {
      visibleColumns = [
        ...visibleColumns,
        {
          field: "actualSalesProfit",
          headerName: "Sales Profit with Tax %",
          preFix: "%",
          className: "violet-bg",
        },
        {
          field: "ProfitSales",
          headerName: "Sales Profit %",
          input: true,
          preFix: "%",
          className: "violet-bg",
        },
        {
          field: "SalesTax",
          headerName: "Tax %",
          input: true,
          preFix: "%",
          // Apply violet background color to this column header
          className: "violet-bg",
        },
        {
          field: "SalesPrice",
          headerName: "Sales Price ₹",
          input: true,
          preFix: "₹",
          // Apply violet background color to this column header
          className: "violet-bg",
        },

        {
          field: "SalesPriceWithGst",
          headerName: "Sales Price Inclu (GST) ₹",
          preFix: "₹",
          className: "violet-bg",
        },
        {
          field: "Remove",
          headerName: "Remove",
          className: "violet-bg",
        },
        {
          field: "Compaire",
          headerName: "Comapire",
          className: "violet-bg",
        },
      ];
    } else if (type === "Seller") {
      visibleColumns = [
        ...visibleColumns,
        {
          field: "actualSellerProfit",
          headerName: "SPT%",
          preFix: "%",
          className: "blue-bg",
        },
        {
          field: "ProfitSeller",
          headerName: " SP%",
          input: true,
          preFix: "%",
          className: "blue-bg",
        },
        {
          field: "SellerTax",
          headerName: "Tax%",
          input: true,
          preFix: "%",
          // Apply violet background color to this column header
          className: "blue-bg",
        },
        {
          field: "SellerPrice",
          headerName: "SP₹",
          input: true,
          preFix: "₹",
          className: "blue-bg",
          // Apply violet background color to this column header
        },
        {
          field: "SellerPriceWithGst",
          headerName: "SP(GST)%",
          preFix: "₹",
          className: "blue-bg",
        },
        {
          field: "ProfitSales",
          headerName: "SP%",
          preFix: "%",
          className: "violet-bg",
        },
        {
          field: "actualSalesProfit",
          headerName: "SPT%",
          preFix: "%",
          className: "violet-bg",
        },
        {
          field: "SalesTax",
          headerName: "ST%",
          preFix: "%",
          className: "violet-bg",
        },
        {
          field: "SalesPrice",
          headerName: "SP₹",
          preFix: "₹",
          className: "violet-bg",
        },
        {
          field: "SalesPriceWithGst",
          headerName: "SP(GST)%",
          preFix: "₹",
          className: "violet-bg",
        },
        {
          field: "Remove",
          headerName: "Remove",
          className: "violet-bg",
        },
        {
          field: "Compaire",
          headerName: "Compaire",
          className: "violet-bg",
        },
      ];
    }

    return visibleColumns;
  };

  const columns = generateColumns();

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xxl">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          color: "white",
          backgroundColor: "#4d4dff",
        }}
      >
        <DialogTitle>{`Update ${type} Live Calculation`}</DialogTitle>
      </Box>
      <DialogContent>
        <TableContainer sx={{ maxHeight: "60vh" }}>
          <Table
            stickyHeader
            aria-label="sticky table"
            sx={{ marginTop: "2%" }}
          >
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <Tooltip
                    title={`${column.field}`}
                    placement="top"
                    key={column.field}
                  >
                    <StyledCell
                      sx={{
                        fontSize: ".7rem",
                        textAlign: "center",
                      }}
                      className={column.className}
                    >
                      {column.headerName}
                    </StyledCell>
                  </Tooltip>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {localData.map((item, index) => (
                <React.Fragment key={item.SKU}>
                  <TableRow key={index}>
                    <TableCell sx={{ fontSize: ".8rem", textAlign: "center" }}>
                      {index + 1}
                    </TableCell>
                    {columns.slice(1).map((column) => {
                      if (column.input) {
                        return (
                          <TableCell
                            key={column.field}
                            sx={{
                              fontSize: ".8rem",
                              textAlign: "center",
                              minWidth: "85px",
                            }}
                          >
                            <TextField
                              type="number"
                              name={column.field}
                              sx={{
                                "& input": {
                                  width: "60px",
                                  height: "25px",
                                  padding: "4px",
                                  borderRadius: "6px",
                                },
                              }}
                              value={item[column.field]}
                              onChange={(e) => {
                                handleChange(e, item.SKU);
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    {column.preFix || ""}
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </TableCell>
                        );
                      } else if (
                        column.field === "SalesPriceWithGst" ||
                        column.field === "SellerPriceWithGst"
                      ) {
                        const calculatedPrice = Math.round(
                          +item[
                            column.field.substring(0, column.field.length - 7)
                          ] +
                            (item.GST / 100) *
                              item[
                                column.field.substring(
                                  0,
                                  column.field.length - 7
                                )
                              ]
                        );
                        return (
                          <TableCell
                            key={column.field}
                            sx={{ fontSize: ".8rem", textAlign: "center" }}
                          >
                            {calculatedPrice}{" "}
                            {column.preFix ? column.preFix : ""}
                          </TableCell>
                        );
                      } else if (column.field === "Remove") {
                        return (
                          <TableCell
                            key={column.field}
                            sx={{
                              fontSize: ".8rem",
                              textAlign: "center",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              removeSelectedItems(item.SKU);
                            }}
                          >
                            <Delete />
                          </TableCell>
                        );
                      } else if (column.field === "Compaire") {
                        return (
                          <TableCell>
                            <Tooltip
                              title="Click for more details"
                              placement="top"
                            >
                              <KeyboardArrowDownIcon
                          
                          sx={{
                            cursor: "pointer",
                            fontSize: "20px",
                            marginLeft: "10px",
                            "&:hover": { color: "blue" },
                            transition: "transform 0.5s ease-out",
                            transform: openStates[index] ? "rotate(180deg)" : "rotate(0deg)",
                          }}
                                onClick={() => handleRowClick(index)}
                              />
                            </Tooltip>
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell
                          key={column.field}
                          sx={{ fontSize: ".8rem", textAlign: "center" }}
                        >
                          {item[column.field]}{" "}
                          {column.preFix ? column.preFix : ""}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  {/* Competitor details */}
                  {openStates[index] && (
                    <TableRow>
                      <StyleCellData
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={16}
                      >
                        <Collapse
                          in={openStates[index]}
                          timeout="auto"
                          unmountOnExit
                        >
                          {/* <Box sx={{backgroundColor: "#eee" ,width:"100%" }}> */}
                          {/* Render sub-data here */}

                          <TableContainer
                            sx={{ backgroundColor: "#eee"}}
                          >
                            <Table>
                              <TableRow>
                                {item.competitor.map((items, index) => {
                                  return (
                                    <TableCell
                                      key={index}
                                      sx={{
                                        background: "black",
                                        color: "#fff",
                                        padding: 0.5,
                                        fontSize:"12px"
                                      }}
                                    >
                                      {items.Name}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>

                              {item.competitor.map((items) => {
                                return (
                                  <TableCell key={index} sx={{ padding: 0.5 ,fontSize:"12px",fontWeight:"bold" }}>
                                    {items.Price} ₹
                                  </TableCell>
                                );
                              })}
                            </Table>
                          </TableContainer>

                          {/* </Box> */}
                        </Collapse>
                      </StyleCellData>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleUpdate} color="primary">
          {updateProductLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Submit"
          )}
        </Button>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateLiveCalcDialog;
