import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  InputLabel,
  CircularProgress,
  TextField,
  Table,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  useStepContext,
} from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import { useAddProjectNameMutation } from "../../../features/api/RnDSlice";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import { useGetAllRandDInventryQuery } from "../../../features/api/barcodeApiSlice";
import { useAddProjectItemMutation } from "../../../features/api/RnDSlice";

const AddpartsDial = ({ open, close, refetch, data }) => {
  // local state
  const [rows, setRows] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsData, setSelectedItemsData] = useState([]);
  const [localData, setLocalData] = useState([]);

  // api calling from rtk query
  const [addProjectItems, { isLoading, refetch: addRefetch }] =
    useAddProjectItemMutation();

  const {
    data: getAllRandDInventry,
    isLoading: RandDLoading,
    refetch: RandDRefetch,
  } = useGetAllRandDInventryQuery();

  // data grid row items
  useEffect(() => {
    if (getAllRandDInventry?.status) {
      const result = getAllRandDInventry?.data?.map((item, index) => {
        return {
          id: item.SKU,
          SKU: item.SKU,
          Name: item.Name,
          GST: item.GST,
          RandDStock: item.Quantity,
        };
      });
      setRows(result);
    }
  }, [getAllRandDInventry]);

  // for searching items from data grid

  const apiRef = useGridApiRef();

  useEffect(() => {
    const matchingArray = selectedItemsData.slice();
    setLocalData(matchingArray);
  }, [selectedItemsData, setSelectedItemsData]);

  // functions
  const handleSelectionChange = (selectionModel) => {
    setSelectedItems(selectionModel);
    const newSelectedRowsData = rows.filter((item) =>
      selectionModel.includes(item.id)
    );
    setSelectedItemsData(newSelectedRowsData);
  };

  const handleDelete = (id) => {
    const newSelectedItems = selectedItems.filter((row) => row !== id);
    const updatedQuantity = { ...quantity };

    if (updatedQuantity.hasOwnProperty(id)) {
      delete updatedQuantity[id];
      setQuantity(updatedQuantity);
    }
    handleSelectionChange(newSelectedItems);
  };

  const handleQty = (item, value) => {
    console.log(value);
    if (value >= 0 && value <= item.RandDStock) {
      setQuantity({
        ...quantity,
        [item.SKU]: value,
      });
    }
  };
  console.log(quantity);
  const handleFilterChange = (field, operator, value) => {
    apiRef.current.setFilterModel({
      items: [{ field: field, operator: operator, value: value }],
    });
  };

  const handleSubmit = async () => {
    try {
      const requestData = localData.map((item) => ({
        ...item,
        Quantity: Number(quantity[item.SKU]) || 0,
      }));
      let info = {
        id: data.projectId,
        items: requestData,
      };
      const filterData = requestData.filter((item) => item.Quantity === 0);
      if (filterData.length > 0) return toast.error("Missing Require Quantiy");
      const result = await addProjectItems(info).unwrap();
      toast.success("Request Query Sent Successfully");
      setQuantity({});
      RandDRefetch();
      refetch();
      close();
    } catch (e) {
      toast.error(e);
    }
  };

  // data grid columns
  const columns = [
    {
      field: "id",
      flex: 0.3,
      headerName: "SKU",
      minWidth: 50,
      maxWidth: 150,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "Name",
      flex: 0.3,
      headerName: "Name",
      minWidth: 300,
      maxWidth: 500,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "GST",
      headerName: "GST",
      minWidth: 50,
      maxWidth: 50,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "RandDStock",
      flex: 0.3,
      headerName: "R&D Stock",
      minWidth: 50,
      maxWidth: 100,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      align: "center",
    },
  ];

  return (
    <Dialog maxWidth="xl" open={open} onClose={close}>
      <DialogTitle
        sx={{
          minWidth: "50vw",
          minHeight: "5vh",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: "skyblue",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography sx={{ fontWeight: "bold", fontSize: "1rem" }}>
            Project Name :{" "}
            <Typography
              variant="span"
              fontWeight={"lighter"}
              fontSize={"0.9rem"}
            >
              {data?.Name}
            </Typography>
          </Typography>
          <Typography sx={{ fontWeight: "bold", fontSize: "1rem" }}>
            Project Id :{" "}
            <Typography
              variant="span"
              fontWeight={"lighter"}
              fontSize={"0.9rem"}
            >
              {data?.projectId}
            </Typography>
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          width: "auto",
          minHeight: " 10vh",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "80vw",
          }}
        >
          <Box
            sx={{
              height: "60vh",
              flex: 1,
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                textDecoration: "underline",
              }}
            >
              Select Items
            </Typography>
            <Box sx={{ marginLeft: "10px", width: "30rem" }}>
              <TextField
                size="small"
                placeholder="Search by Name"
                fullWidth
                onChange={(e) => {
                  // setSkuFilter(e.target.value);
                  // setCheckedBrands([]);
                  // setCheckedCategory([]);
                  handleFilterChange("Name", "contains", e.target.value);
                }}
              />
            </Box>
            <Box
              sx={{
                width: "100%",
                height: "52vh",
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
                position: "relative",
              }}
            >
              <DataGrid
                columns={columns}
                rows={rows}
                loading={RandDLoading}
                rowHeight={40}
                apiRef={apiRef}
                Height={"50vh"}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={handleSelectionChange}
                rowSelectionModel={selectedItems}
              />
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                textDecoration: "underline",
              }}
            >
              Selected Items
            </Typography>
            <TableContainer
              sx={{
                maxHeight: 490,
                overflow: "auto",
                marginTop: "2.5rem",
              }}
            >
              <Table
                stickyHeader
                aria-label="sticky table"
                sx={{ border: "1px solid grey" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        backgroundColor: "#eee",
                        color: "black",
                        textAlign: "center",
                      }}
                    >
                      SNo
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#eee",
                        color: "black",
                        textAlign: "center",
                      }}
                    >
                      SKU
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#eee",
                        color: "black",
                        textAlign: "center",
                      }}
                    >
                      Name
                    </TableCell>

                    <TableCell
                      sx={{
                        backgroundColor: "#eee",
                        color: "black",
                        textAlign: "center",
                      }}
                    >
                      Requirment
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#eee",
                        color: "black",
                        textAlign: "center",
                      }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {localData?.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ textAlign: "center" }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {data?.SKU}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {data?.Name}
                      </TableCell>

                      <TableCell
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Box
                          width="7rem"
                          sx={{
                            display: "flex",
                            gap: 1,
                          }}
                        >
                          <RemoveCircleOutlineIcon
                            sx={{
                              "&:hover": { color: "green" },
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleQty(data, quantity[data?.SKU] - 1)
                            }
                          />

                          <input
                            style={{
                              width: "100%",
                              borderRadius: "0.5rem",
                              textAlign: "center",
                              padding: 4,
                            }}
                            type="number"
                            value={quantity[data?.SKU]}
                            onChange={(e) => handleQty(data, +e.target.value)}
                          />
                          <AddCircleOutlineIcon
                            sx={{
                              "&:hover": { color: "green" },
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleQty(data, quantity[data?.SKU] + 1)
                            }
                          />
                        </Box>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <DeleteIcon
                          sx={{
                            "&:hover": { color: "red" },
                            cursor: "pointer",
                          }}
                          onClick={() => handleDelete(data.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <CircularProgress sx={{ color: "#fff" }} size={30} />
          ) : (
            "Submit"
          )}
        </Button>
        <Button variant="contained" onClick={close}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddpartsDial;
