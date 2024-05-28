import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Popover,
  CircularProgress,
  styled,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import {
  useGetsingleShipmentbyorderIdQuery,
  useCreateShipmentMutation,

} from "../../../features/api/barcodeApiSlice";

import {
  useChangeStatusForDeliverMutation
  } from "../../../features/api/clientAndShipmentApiSlice";

  import { toast } from "react-toastify";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundImage: "linear-gradient(0deg, #01127D, #04012F)",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  padding: 5,
}));

const OrderDetailsDialog = ({
  open,
  setOpen,
  details,
  handlePackaging,
  handleCurrier,
  updateShipmentLoading,
  packageDisable,
  courierDisable,
  isLoading,
  refetch
}) => {
  const skip = !open || !details.Dispatched;

  const { data: barcodeData, isLoading: clientLoading } =
    useGetsingleShipmentbyorderIdQuery(details.ShipmentId, {
      skip,
    });

  const [createShipment, { isLoading: createShipmentLoading }] =
    useCreateShipmentMutation();


    const [updateData, { isLoading: loadingUpdatedata }] =
    useChangeStatusForDeliverMutation();


  const [toggleSwitch, setToggleSwitch] = useState(true);
  const [imageDetails, setImageDetails] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popOpen, setPopOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setPopOpen(true);
    setImageDetails(event);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setPopOpen(false);
  };




  const handleSubmit = async () => {

    try {
  
      if (!details.ShipmentId) {
        return toast.error("Shipment Id not available");
      }
  
      const result = await updateData(details.ShipmentId).unwrap();

      toast.success("Item has shipped successfully");
      refetch()
      setOpen(false)
  

    } catch (error) {
      console.log("Server Error", error.message);
    }
  };




  return (
    <Box>
      <Dialog open={open} maxWidth="xl" onClose={()=>setOpen(false)}>
        <DialogTitle
          sx={{ textAlign: "center", color: "white", background: "blue" ,padding:0.5 }}
        >
          Details of Shipment
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",

              width: "70vw",
            }}
          >
            <Box sx={{ width: "40%", padding: "20px" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
              
                  alignItems: "center",
                  marginBottom: "10px",

                  padding: "10px",
                  borderRadius: "4px",
            
                }}
              >
                <TableContainer component={Paper} sx={{ marginTop: "1px" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{ background: "#ccc", padding: 0.5 }}
                          align="center"
                        >
                          <Typography variant="span">Shipping ID</Typography>
                        </TableCell>
                        <TableCell
                          sx={{ background: "#ccc", padding: 0.5 }}
                          align="center"
                        >
                          <Typography variant="span">Customer Name</Typography>
                        </TableCell>
                        <TableCell
                          sx={{ background: "#ccc", padding: 0.5 }}
                          align="center"
                        >
                          <Typography variant="span">Company Name</Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" sx={{ padding: 0.5 }}>
                          {details.ShipmentId}
                        </TableCell>
                        <TableCell align="center" sx={{ padding: 0.5 }}>
                          {details.CustomerName}
                        </TableCell>
                        <TableCell align="center" sx={{ padding: 0.5 }}>
                          {details.CompanyName}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <Box sx={{ display: "flex", gap: "20px" , flexDirection:"column" ,overflow:"auto" }}>
                {details.HasCourierId && (
                  <Box sx={{ marginTop: "10px" }}>
                    <Typography variant="body2" sx={{ marginBottom: "10px" }}>
                      <strong>Courier Name:</strong>{" "}
                      {details.CourierName || "N/A"}
                    </Typography>
                    <Typography variant="body2" sx={{ marginBottom: "10px" }}>
                      <strong>Courier Link:</strong>{" "}
                      {details.CourierLink || "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Tracking Id:</strong>{" "}
                      {details.TrackingId || "N/A"}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ marginTop: "10px" }}>
                  <Typography
                    variant="span"
                    sx={{
                      padding: "20px 0",
                      fontSize: "15px",
                      fontWeight: "bold",
                    }}
                  >
                    Shipping address :
                  </Typography>
                  <Table sx={{ marginTop: "10px" }}>
                    <TableBody>
                      {details?.ShippingAddress &&
                        Object.keys(details?.ShippingAddress).map((key) => {
                          if (key === "SNO" || key === "ClientId") {
                            return null;
                          }
                          return (
                            <TableRow key={key} sx={{ padding: 0 }}>
                              <TableCell
                                sx={{ padding: 0.5, fontWeight: "bold" }}
                              >
                                {key?.toUpperCase()}:
                              </TableCell>
                              <TableCell sx={{ padding: 0 }}>
                                {details?.ShippingAddress[key]}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px",
                }}
              >
                <Button
               
                  sx={{
                    backgroundColor: toggleSwitch ? "brown" : "" ,
                    color: toggleSwitch ? "#fff" : "",
                  "&:hover":{
                    backgroundColor: "black" ,
                    color:"#fff"
                  }

                  }}
                  onClick={() => setToggleSwitch(true)}
                >
                  View barcode
                </Button>

                <Button
            
            sx={{
              backgroundColor: !toggleSwitch ? "brown" : "" ,
              color: !toggleSwitch ? "#fff" : "",
            "&:hover":{
              backgroundColor: "black" ,
              color:"#fff"
            }

            }}
                  onClick={() => setToggleSwitch(false)}
                >
                  View Box details
                </Button>
                <Popover
          id={details?.OrderId}
          open={popOpen}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Paper sx={{ height: "400px", width: "400px", overflow: "hidden" }}>
            <img
              src={imageDetails?.Photo}
              alt="Packing Image"
              style={{ width: "100%", height: "100%" }}
            />
          </Paper>
        </Popover>
              </Box>
            </Box>
            <Box
              sx={{
                height: 400,
                width: "60%",
                overflow: "auto",
                marginTop: "5px",
              }}
            >
              {toggleSwitch ? (
                <TableContainer>
                        <Typography sx={{
                    display: 'flex',
                    justifyContent:'center',
                    width: '100%',
                     fontSize: '12px',
                    fontWeight: 'bold',
                  }}>Barcode Details</Typography>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center">Sno</StyledTableCell>
                        <StyledTableCell align="center">
                          Product Name
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Barcode No
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {barcodeData?.data?.barcodeDetails?.length > 0 ? (
                        barcodeData?.data?.barcodeDetails.map((item, index) => (
                          <TableRow key={index}>
                            <StyledTableCell align="center">
                              {index + 1}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {item.name}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {item.barcode}
                            </StyledTableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <StyledTableCell align="center" colSpan={6}>
                            No Barcode Data Available!
                          </StyledTableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <TableContainer>
                  <Typography sx={{
                    display: 'flex',
                    justifyContent:'center',
                    width: '100%',
                     fontSize: '12px',
                    fontWeight: 'bold',
                  }}>Box Details</Typography>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center">Sno</StyledTableCell>
                        <StyledTableCell align="center">Length</StyledTableCell>
                        <StyledTableCell align="center">Width</StyledTableCell>
                        <StyledTableCell align="center">Height</StyledTableCell>
                        <StyledTableCell align="center">
                          Marking
                        </StyledTableCell>
                        <StyledTableCell align="center">Action</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {details?.FieldPackingDetails.length > 0 ? (
                        details?.FieldPackingDetails.map((item, index) => (
                          <TableRow key={index}>
                            <StyledTableCell align="center">
                              {index + 1}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {item.Length}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {item.Width}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {item.Height}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {item.Marking}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                    
                              <Button
                              disabled={!item.Photo}
                                    sx={{ cursor: "pointer" }}
                                    onClick={() =>
                                      handleClick({
                                        Photo: item.Photo,
                                        ids: item.index,
                                      })
                                    }
                                  >
                                    View
                                  </Button>
                            </StyledTableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <StyledTableCell align="center" colSpan={6}>
                            No Box details available
                          </StyledTableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "space-around" }}>
          <Button
            variant="contained"
            disabled={isLoading || !details.HasCourierId || !details.PackingDetails || details.IsCompletedOrder
            }
            onClick={handleSubmit}
          >
            {isLoading ? <CircularProgress /> : "Final Submit"}
          </Button>

          <Button variant="outlined" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderDetailsDialog;
