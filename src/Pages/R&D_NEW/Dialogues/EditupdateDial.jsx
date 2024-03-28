import React, { useState ,useEffect} from "react";
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
  Typography,
  CircularProgress,
  styled,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const columns = [
  { field: "Sno", headerName: "S.No" },
  { field: "SKU", headerName: "SKU" },
  { field: "Name", headerName: "Name" },
  { field: "GST", headerName: "GST (%)" },
  { field: "InStock", headerName: "In Use" },
];

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "	 #0d0d0d" : "#eee",
  color: theme.palette.mode === "dark" ? "#fff" : "black",
}));

const StyleTable = styled(TableCell)(({ theme }) => ({
  fontSize: ".777rem",
  padding: "5px !important",
  textAlign: "center",
}));

import { useSelector } from "react-redux";
import { TabOutlined } from "@mui/icons-material";
import { productApiSlice } from "../../../features/api/productApiSlice";
const StyledCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "	 #0d0d0d" : "#80bfff",
  color: theme.palette.mode === "dark" ? "#fff" : "black",
  textAlign: "center",
}));

const EditUpdateDial = ({ data, open, setOpen }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [projectItems, setProjectItems] = useState(data?.projectItem);
  /// local state
  const [quantity, setQuantity] = useState({});
  const [updatedData, setUpdatedData] = useState([]);
  // handlers
  useEffect(() => {
    setProjectItems(data?.projectItem);
  }, [data?.projectItem]);
  
  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity >= 0 && newQuantity <= item.Quantity) {
      const updatedItem = { ...item, Quantity: newQuantity };
  
      setUpdatedData((prev) => ({ ...prev, [item.SKU]: updatedItem }));
  
      setProjectItems((prevData) => {
        return prevData.map((dataItem) => {
          if (dataItem.SKU === item.SKU) {
            return updatedItem;
          }
          return dataItem;
        });
      });
  
    
    }
  };
  
  
  
  
  // handling send query
  const handleSubmit = async () => {
    try {
      //   const requestData = data.map((item) => ({
      //     ...item,
      //     ReqQty: Number(Requireqty[item.SKU]) || 0,
      //   }));
      //   const filterData = requestData.filter((item) => item.ReqQty === 0);
      //   if (filterData.length > 0) return toast.error("Missing Require Quantiy");
      //   const result = await createQueryApi({ datas: requestData }).unwrap();
      //   toast.success("Request Query Sent Successfully");
      //   dispatch(removeSelectedCreateQuery());
      //   dispatch(removeSelectedSkuQuery());
      //   removeSelectedItems([]);
      //   handleCloseDialog();
      console.log(updatedData);
    } catch (e) {
      console.log("error at Discount Query create ", e);
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
              Update Project Details
            </Typography>
            <CancelIcon
              onClick={(event) => {
                setOpen(false);
              }}
            />
          </Box>
        </Box>

        <DialogContent>
          <TableContainer sx={{ maxHeight: "60vh" }}>
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
                {projectItems &&
                  projectItems.map((item, index) => {
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

                        <StyleTable
                          sx={{ fontSize: ".8rem", minWidth: "80px" }}
                        >
                          {item.GST}
                        </StyleTable>
                        <StyleTable sx={{ fontSize: ".8rem" }}>
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
                                handleQuantityChange(item, item.Quantity - 1)
                              }
                            />

                            <input
                              style={{
                                width: "100%",
                                borderRadius: "0.5rem",
                                textAlign: "center",
                                padding: 4,
                              }}
                              readOnly
                              type="number"
                              value={item.Quantity}
                            //   onChange={(e) =>
                            //     handleQuantityChange(
                            //       item,
                            //       parseInt(e.target.value)
                            //     )
                            //   }
                            />
                            <AddCircleOutlineIcon
                              sx={{
                                "&:hover": { color: "green" },
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                handleQuantityChange(item, item.Quantity + 1)
                              }
                            />
                          </Box>
                        </StyleTable>
                      </TableRow>
                    );
                  })}
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
              //   disabled={isLoading}
              variant="contained"
              onClick={() => {
                handleSubmit();
              }}
              sx={{
                width: "150px",
              }}
            >
              {/* {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : ( */}
              "Send Request"
              {/* )} */}
            </Button>
          </Box>
        </StyledBox>
      </Dialog>
    </div>
  );
};

export default EditUpdateDial;
