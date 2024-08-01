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
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
const columns = [
  { field: "Sno", headerName: "S.No" },
  { field: "SKU", headerName: "SKU" },
  { field: "Name", headerName: "Name" },
  { field: "Brand", headerName: "Brand" },
  { field: "GST", headerName: "GST (%)" },
  { field: "InStock", headerName: "In Store" },
  { field: "R&DStock", headerName: "New Parts" },
  { field: "Old", headerName: "Old Parts" },
  { field: "Require QTY", headerName: "Require QTY" },
  { field: "UseOld", headerName: "Use Old Parts" },
  { field: "NewQty", headerName: "New Qty" },
  { field: "Delete", headerName: "Remove" },
];
import { useSocket } from "../../../CustomProvider/useWebSocket";
import { useCreateRandDInventryMutation } from "../../../features/api/barcodeApiSlice";
import {
  removedSelectedItemsRandD,
  removeSelectedSkusRandD,
  setSelectedItemsRandD,
  setSelectedSkusRandD,
} from "../../../features/slice/R&DSlice";
import {
  useAddProjectItemMutation,
} from "../../../features/api/RnDSlice";
import { useNavigate } from "react-router-dom";

// styling for mui grid
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

const CreateReqDial = ({
  data,
  open,
  setOpen,

  id,
  name,
  refetch,
}) => {
  /// initialize
  const socket = useSocket();
  const navigate = useNavigate();

  /// global state


  /// local state

  const [localData, setLocalData] = useState([]);

  useEffect(() => {
    const initializedData = data.map((item) => ({
      SKU: item.SKU,
      Name: item.Name,
      Brand: item.Brand,
      GST: item.GST,
      Quantity: item.ActualQuantity,
      OldQty: item.OldQty,
      NewQty: item.NewQty,
      ReqQty: 0,
      StoreQty: 0,
      RestockQty: 0,
      NewOldQty: 0,
    }));
    setLocalData(initializedData);
  }, [data]);

  const [errors, setErrors] = useState({});

  const [createQueryApi, { isLoading }] = useCreateRandDInventryMutation();

  const dispatch = useDispatch();
  // handlers
  const [
    addProjectItems,
    { isLoading: addProjectLoading, refetch: addRefetch },
  ] = useAddProjectItemMutation();
  const handleCloseDialog = () => {
    setOpen(false);
  };
  

  const handleDelete = (sku) => {
    const filterData = localData.filter((data) => data.SKU !== sku);
    setLocalData(filterData);
    dispatch(setSelectedItemsRandD(sku));
    dispatch(setSelectedSkusRandD(sku));
  };

  

  // handling send query
  const handleSubmit = async () => {
    try {
      const sendingData = localData.map((data) => ({
        SKU: data.SKU,
        RequireQty: Number(data.ReqQty),
        Brand: data.Brand,
        GST: data.GST,
        OldQty: Number(data.NewOldQty),
        Name: data.Name,
      }));

      let info = {
        id: id,
        items: sendingData,
      };
      // console.log(info);

      const result = await addProjectItems(info).unwrap();

      toast.success("Parts add successfully");
      dispatch(removeSelectedSkusRandD());
      dispatch(removedSelectedItemsRandD());
      refetch();
      handleCloseDialog();
      navigate("/Project");
    } catch (e) {
      console.log("error at Discount Query create ", e);
    }
  };

  const handleChange = (e, item) => {
    const { name, value } = e.target;
    const qty = Number(item.Quantity);
    const newqty = item.NewQty;
    const oldqty = item.OldQty;
    let storeQty = "";
    let newRdQty = "";
    let restockQty = "";

    if (name === "ReqQty") {
      if (value > qty) {
        restockQty = Number(value) - qty;
      } else if (newqty > 0) {
        storeQty = value - Number(newqty) - Number(restockQty);
        newRdQty = newqty;
      }
      setLocalData((prevData) =>
        prevData.map((i) =>
          i.SKU === item.SKU
            ? {
                ...i,
                [name]: value,
                RestockQty: restockQty,
                StoreQty: storeQty,
                NewRdQty: newRdQty,
              }
            : i
        )
      );
    } else if (name === "NewOldQty") {
      if (Number(value) > oldqty) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [item.SKU]: "OldQty cannot be greater than Quantity",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [item.SKU]: "" }));
        storeQty = qty > value ? qty - value : qty;
        newRdQty = newqty;
        setLocalData((prevData) =>
          prevData.map((i) =>
            i.SKU === item.SKU
              ? { ...i, [name]: value, StoreQty: storeQty, NewRdQty: newRdQty }
              : i
          )
        );
      }
    } else {
      storeQty = qty;
      newRdQty = newqty;
      setLocalData((prevData) =>
        prevData.map((i) =>
          i.SKU === item.SKU
            ? { ...i, [name]: value, StoreQty: storeQty, NewRdQty: newRdQty }
            : i
        )
      );
    }
  };

  return (
    <div>
      <Dialog open={open} maxWidth="xl" onClose={handleCloseDialog}>
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
              ADD PARTS
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
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="span" fontWeight="bold" fontSize={"12px"}>
              Project Id :{" "}
              <Typography variant="span" fontWeight="lighter" fontSize={"12px"}>
                {id}
              </Typography>
            </Typography>
            <Typography variant="span" fontWeight="bold" fontSize={"12px"}>
              Project Name :{" "}
              <Typography variant="span" fontWeight="lighter" fontSize={"12px"}>
                {name}
              </Typography>
            </Typography>
          </Box>
          <TableContainer sx={{ maxHeight: "60vh", marginTop: "0.3rem" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <StyledCell sx={{ fontSize: ".7rem" }} key={column.field}>
                      {column.headerName}
                    </StyledCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {localData.length > 0 &&
                  localData.map((item, index) => {
                    return (
                      <TableRow key={index}>
                        <StyleTable sx={{ fontSize: ".8rem" }}>
                          {index + 1}
                        </StyleTable>
                        <StyleTable sx={{ fontSize: ".8rem" }}>
                          {item.SKU}
                        </StyleTable>
                        <StyleTable
                          sx={{ fontSize: ".8rem", minWidth: "150px" }}
                        >
                          {item.Name}
                        </StyleTable>
                        <StyleTable sx={{ fontSize: ".8rem" }}>
                          {item.Brand}
                        </StyleTable>

                        <StyleTable
                          sx={{ fontSize: ".8rem", minWidth: "80px" }}
                        >
                          {item.GST} %
                        </StyleTable>
                        <StyleTable sx={{ fontSize: ".8rem" }}>
                          {item.Quantity}
                        </StyleTable>
                        <StyleTable
                          sx={{ fontSize: ".8rem", minWidth: "99px" }}
                        >
                          {item.NewQty}
                        </StyleTable>
                        <StyleTable
                          sx={{ fontSize: ".8rem", minWidth: "99px" }}
                        >
                          {item.OldQty}
                        </StyleTable>
                        <StyleTable>
                          <TextField
                            autocomplete={false}
                            size="small"
                            sx={{
                              "& input": {
                                height: "10px",
                                maxWidth: "30px",
                              },
                            }}
                            name="ReqQty"
                            value={item.ReqQty}
                            type="number"
                            onChange={(event) => {
                              handleChange(event, item);
                            }}
                          />
                        </StyleTable>
                        <StyleTable>
                          <TextField
                            autocomplete={false}
                            size="small"
                            sx={{
                              "& input": {
                                height: "10px",
                                maxWidth: "30px",
                              },
                            }}
                            name="NewOldQty"
                            disabled={item.OldQty == "" || item.OldQty <= 0}
                            value={item.NewOldQty}
                            type="number"
                            onChange={(event) => {
                              handleChange(event, item);
                            }}
                            error={!!errors[item.SKU]}
                            helperText={
                              errors[item.SKU] ? (
                                <span style={{ fontSize: "4px" }}>
                                  {errors[item.SKU]}
                                </span>
                              ) : (
                                ""
                              )
                            }
                          />
                        </StyleTable>
                        <StyleTable
                          sx={{ fontSize: ".8rem", minWidth: "99px" }}
                        >
                          {Number(item.ReqQty || 0) - Number(item.NewOldQty || 0)}
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
                "Add Parts"
              )}
            </Button>
          </Box>
        </StyledBox>
      </Dialog>
    </div>
  );
};

export default CreateReqDial;
