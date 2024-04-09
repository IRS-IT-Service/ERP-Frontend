import React, { useState, useEffect } from "react";
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
  DialogTitle,
  Popover,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useUpdateProjectMutation } from "../../../features/api/RnDSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { formatDate } from "../../../commonFunctions/commonFunctions";
import DeleteIcon from "@mui/icons-material/Delete";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "	 #0d0d0d" : "#eee",
  color: theme.palette.mode === "dark" ? "#fff" : "black",
}));

const StyleTable = styled(TableCell)(({ theme }) => ({
  fontSize: ".777rem",
  padding: "5px",
  textAlign: "center",
}));

const StyledCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "	 #0d0d0d" : "#80bfff",
  color: theme.palette.mode === "dark" ? "#fff" : "black",
  textAlign: "center",
}));

const EditUpdateDial = ({ data, open, setOpen, refetch, close }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [projectItems, setProjectItems] = useState(data?.projectItem);
  const [deleteInfo, setDeleteInfo] = useState({});

  /// local state
  const [updatedData, setUpdatedData] = useState([]);

  // api calling from rtk query
  const [updateProjectItems, { isLoading, refetch: addRefetch }] =
  useUpdateProjectMutation();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event, item) => {
    console.log(item);
    setDeleteInfo(item);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openDial = Boolean(anchorEl);
  const id = openDial ? "simple-popover" : undefined;

  // handlers
  useEffect(() => {
    setProjectItems(data?.projectItem);
  }, [data?.projectItem]);

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleQuantityChange = (item, OldQty , newQuantity ) => {
    if (data.status === "Closed") {
      return;
    }

    
let updatedItem = {}

if(item.Newqty !== null && item.OldQty !== null){
  updatedItem = {
   ...item,
   Newqty: newQuantity,
    OldQty: OldQty,
  }
}else{
  updatedItem = { ...item, Quantity: newQuantity };
}
    

    setProjectItems((prevData) => {
      return prevData.map((dataItem) => {
        if (dataItem.SKU === item.SKU) {
          return updatedItem;
        }
        return dataItem;
      });
    });

    // setUpdatedData((prev) => {
    //   const filteredData = prev.filter((dataItem) => dataItem.SKU !== item.SKU);
    //   return [...filteredData, { ...item, Quantity: newQuantity }];
    // });
  };

  // handling send query
  const handleSubmit = async () => {
    // if (updatedData.length <= 0) {
    //   return toast.error("Please Select a Quantity to Chang");
    // }
    try {
      const info = {
        id: data?.projectId,
        items: projectItems,
      };

      const result = await updateProjectItems(info).unwrap();
      toast.success("Quantity updated successfully");
      refetch();
      close();
    } catch (e) {
      console.log("error at Discount Query create ", e);
    }
  };

  const columns = [
    { field: "Sno", headerName: "S.No" },
    { field: "SKU", headerName: "SKU" },
    { field: "Name", headerName: "Name" },
    { field: "InStock", headerName: "In Use" },
    { field: "OldQty", headerName: "Old Qty" },
    { field: "Status", headerName: "Received" },

  ];

  return (
    <div>
      <Dialog open={open} maxWidth="xl" onClose={handleCloseDialog}>
        <DialogTitle sx={{ background: "#eee", position: "relative" }}>
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="span" fontWeight="bold" fontSize={13}>
                    Project Name :{" "}
                    <Typography
                      variant="span"
                      fontWeight="lighter"
                      fontSize={13}
                    >
                      {data?.Name}
                    </Typography>
                  </Typography>
                  <Typography fontWeight="bold" fontSize={13}>
                    Project Desc :{" "}
                    <Typography
                      variant="span"
                      fontWeight="lighter"
                      fontSize={13}
                    >
                      {data?.Description}
                    </Typography>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    paddingRight: 5,
                  }}
                >
                  <Typography variant="span" fontWeight="bold" fontSize={13}>
                    Status :{" "}
                    <Typography
                      variant="span"
                      fontWeight="lighter"
                      fontSize={13}
                    >
                      {data?.status}
                    </Typography>
                  </Typography>
                  <Typography fontWeight="bold" fontSize={13}>
                    Start Date :{" "}
                    <Typography
                      variant="span"
                      fontWeight="lighter"
                      fontSize={13}
                    >
                      {data?.date}
                    </Typography>
                  </Typography>
                  <Typography fontWeight="bold" fontSize={13}>
                    Complete Date :{" "}
                    <Typography
                      variant="span"
                      fontWeight="lighter"
                      fontSize={13}
                    >
                      {data?.endDate
                        ? formatDate(data?.endDate)
                        : "in Progress"}
                    </Typography>
                  </Typography>
                </Box>
              </Box>
              <CancelIcon
                sx={{ cursor: "pointer " }}
                onClick={(event) => {
                  setOpen(false);
                }}
              />
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TableContainer sx={{ maxHeight: "60vh", width: "50vw" }}>
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
                {!projectItems.length > 0 ? (
                  <TableRow sx={{ textAlign: "center" }}>
                    <StyleTable colSpan={5} sx={{ fontSize: ".8rem" }}>
                      No Data Available !
                    </StyleTable>
                  </TableRow>
                ) : (
                  projectItems.map((item, index) => {
                    return (
                      <TableRow key={index}>
                        <StyleTable sx={{ fontSize: ".8rem" }}>
                          {index + 1}
                        </StyleTable>
                        <StyleTable sx={{ fontSize: ".8rem" }}>
                          {item.SKU}
                        </StyleTable>

                        <StyleTable sx={{ fontSize: ".8rem" }}>
                          {item.Name}
                        </StyleTable>

                        <StyleTable
                          sx={{
                            fontSize: ".8rem",
                            display: "flex",
                            justifyContent: "center",
                          }}
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
                                handleQuantityChange(item,item.OldQty,item.Newqty === null
                                  ? item.Quantity - 1 
                                  : item.Newqty - 1 )
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
                              value={
                                item.Newqty === null
                                  ? +item.Quantity
                                  : +item.Newqty
                              }
                              onChange={(e) =>
                                handleQuantityChange(
                                  item,item.OldQty ,
                                  parseInt(e.target.value)
                                )
                              }
                            />
                            <AddCircleOutlineIcon
                              sx={{
                                "&:hover": { color: "green" },
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                handleQuantityChange(item,item.OldQty,item.Newqty === null
                                  ? item.Quantity + 1 
                                  : item.Newqty + 1 )
                              }
                            />
                          </Box>
                        </StyleTable>
                        <StyleTable
                          sx={{
                            fontSize: ".8rem",
                          }}
                        >
                          {item.OldQty !== null && (
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
                                  handleQuantityChange(item, item.OldQty - 1 ,item.Newqty)
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
                                value={+item.OldQty}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    item,
                                    parseInt(e.target.value) ,item.Newqty
                                  )
                                }
                              />
                              <AddCircleOutlineIcon
                                sx={{
                                  "&:hover": { color: "green" },
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleQuantityChange(item,item.OldQty + 1,item.Newqty)
                                }
                              />
                            </Box>
                          )}
                        </StyleTable>

                        <StyleTable sx={{ fontSize: ".8rem" }}>
                          <Box
                            sx={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                width: "13px",
                                height: "13px",
                                borderRadius: "100%",
                                backgroundColor: `${item.isFullFilled ? "rgba(5, 134, 15, 0.8)"
                                : "rgba(207, 0, 0, 0.8)"}`,
                                border: "1px solid black",
                              }}
                            ></div>
                          </Box>
                        </StyleTable>

                        {/* <StyleTable sx={{ fontSize: ".8rem" }}>
                          <DeleteIcon
                            sx={{
                              "&:hover": {
                                color: "red",
                              },
                              cursor: "pointer",
                            }}
                            onClick={(e) => handleClick(e, item)}
                          />
                        </StyleTable> */}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <StyledBox>
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
              disabled={isLoading || data.status === "Closed"}
              variant="contained"
              onClick={() => {
                handleSubmit();
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Update"
              )}
            </Button>
          </Box>
        </StyledBox>
        <Popover
          id={id}
          open={openDial}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Box
            sx={{
              width: "20vw",
              padding: "0.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "1rem",
                color: "red",
                textDecoration: "underline",
              }}
            >
              Caution !
            </Typography>
            <Box sx={{ textAlign: "center", padding: "0.5rem" }}>
              <Typography sx={{ fontSize: "1rem" }}>
                Do you really want to remove
                <Typography variant="span" sx={{ color: "red" }}>
                  {" "}
                  {deleteInfo.SKU}
                </Typography>
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <Button
                variant="contained"
                size="small"
                sx={{ background: "green", "&:hover": { background: "black" } }}
              >
                Yes
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ background: "red", "&:hover": { background: "black" } }}
                onClick={handleClose}
              >
                No
              </Button>
            </Box>
          </Box>
        </Popover>
      </Dialog>
    </div>
  );
};

export default EditUpdateDial;
