import React, { useState } from "react";
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
  TextField,
  Box,
  Typography,
  CircularProgress,
  styled,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  removedSelectedItemsRandD,
  removeSelectedSkusRandD,
} from "../../../features/slice/R&DSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
const columns = [
  { field: "Sno", headerName: "S.No" },
  { field: "SKU", headerName: "SKU" },
  { field: "Name", headerName: "Name" },
  { field: "Brand", headerName: "Brand" },
  { field: "GST", headerName: "GST (%)" },
  { field: "InStock", headerName: "Store Qty" },
  { field: "NewQty", headerName: "R&D Qty" },
  { field: "OldQty", headerName: "Old Qty" },

  { field: "Delete", headerName: "Remove" },
];
import { useQuantityUpdateRnDMutation } from "../../../features/api/productApiSlice";
import {
  setSelectedItemsRandD,
  setSelectedSkusRandD,
} from "../../../features/slice/R&DSlice";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "	 #0d0d0d" : "#eee",
  color: theme.palette.mode === "dark" ? "#fff" : "black",
}));

const StyleTable = styled(TableCell)(({ theme }) => ({
  fontSize: ".777rem",
  padding: "5px !important",
  textAlign: "center",
}));

const StyledCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "	 #0d0d0d" : "#80bfff",
  color: theme.palette.mode === "dark" ? "#fff" : "black",
  textAlign: "center",
}));

const AddRnDQtyDial = ({
  data,
  open,
  setOpen,
  refetch,
}) => {

  /// local state
  const [localData, setLocalData] = useState(data);

  /// rtk query calling
  const [updateQty, { isLoading }] = useQuantityUpdateRnDMutation();

  // functions 
  const dispatch = useDispatch();

  const handleDelete = (sku) => {
    // deleted the sku from local and redux both
    const filterData = localData.filter((data) => data.SKU !== sku);
    setLocalData(filterData);
    dispatch(setSelectedItemsRandD(sku));
    dispatch(setSelectedSkusRandD(sku));
    
  };

  useEffect(() => {
    if (localData.length === 0) {
      setOpen(false);
    }
  }, [localData]);


  // updating quantity on changes
  const handleQuantityChange = (event, item) => {
    const { name, value } = event.target;
    setLocalData((prevData) =>
      prevData.map((i) => (i.SKU === item.SKU ? { ...i, [name]: value } : i))
    );
  };

  // handling quantity update and calling update api
  const handleSubmit = async () => {
    const updatedValues = localData.map((item) => ({
      SKU: item.SKU,
      NewQty: Number(item.NewQty),
      OldQty: Number(item.OldQty),
    }));
    try {
      let info = {
        items: updatedValues,
      };
      const result = await updateQty(info).unwrap();
      toast.success("Quantity add successfully");
      dispatch(removedSelectedItemsRandD());
      dispatch(removeSelectedSkusRandD());
      refetch();
      setOpen(false);
    } catch (e) {
      console.log("error at Discount Query create ", e);
    }
  };

  return (
    <div>
      <Dialog open={open} maxWidth="xl" onClose={() => setOpen(false)}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              paddingTop: ".5rem",
              paddingX: ".7rem",
            }}
          >
            <Typography
              sx={{
                flex: "1",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1.3rem",
              }}
            >
              Add Parts Quantity
            </Typography>
            <CancelIcon
              sx={{ cursor: "pointer", "&:hover": { color: "red" } }}
              onClick={(event) => {
                setOpen(false);
              }}
            />
          </Box>
        </Box>

        <DialogContent>
          <TableContainer sx={{ maxHeight: "60vh", marginTop: "0.3rem" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <StyledCell sx={{ fontSize: ".8rem" }} key={column.field}>
                      {column.headerName}
                    </StyledCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {localData?.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <StyleTable sx={{ fontSize: ".8rem" }}>
                        {index + 1}
                      </StyleTable>
                      <StyleTable sx={{ fontSize: ".8rem" }}>
                        {item.SKU}
                      </StyleTable>
                      <StyleTable sx={{ fontSize: ".8rem", minWidth: "150px" }}>
                        {item.Name}
                      </StyleTable>
                      <StyleTable sx={{ fontSize: ".8rem" }}>
                        {item.Brand}
                      </StyleTable>

                      <StyleTable sx={{ fontSize: ".8rem", minWidth: "80px" }}>
                        {item.GST} %
                      </StyleTable>

                      <StyleTable>{item.Quantity}</StyleTable>
                      <StyleTable>
                        <TextField
                          size="small"
                          sx={{
                            "& input": {
                              height: "10px",
                              maxWidth: "30px",
                            },
                          }}
                          name="NewQty"
                          value={item.NewQty || ""}
                          type="number"
                          onChange={(event) => {
                            handleQuantityChange(event, item);
                          }}
                        />
                      </StyleTable>
                      <StyleTable>
                        <TextField
                          size="small"
                          sx={{
                            "& input": {
                              height: "10px",
                              maxWidth: "30px",
                            },
                          }}
                          name="OldQty"
                          value={item.OldQty || ""}
                          type="number"
                          onChange={(event) => {
                            handleQuantityChange(event, item);
                          }}
                        />
                      </StyleTable>
                      <StyleTable>
                        <DeleteIcon
                          sx={{
                            "&:hover": {
                              color: "red",
                            },
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            handleDelete(item.SKU);
                          }}
                        />
                      </StyleTable>
                    </TableRow>
                  );
                })}

                <TableRow></TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <StyledBox>
          {/* another section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: " 2rem",
              marginTop: ".7rem",
              paddingX: "2rem",
              paddingBottom: ".6rem",
            }}
          >
            {" "}
            <Button
              disabled={isLoading}
              variant="contained"
              onClick={() => {
                handleSubmit();
              }}
              sx={{
                width: "150px",
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "update"
              )}
            </Button>
          </Box>
        </StyledBox>
      </Dialog>
    </div>
  );
};

export default AddRnDQtyDial;
