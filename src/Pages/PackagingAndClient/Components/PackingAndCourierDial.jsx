import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  TextField,
  MenuItem,
  InputLabel,
  CircularProgress,
  styled,
  Popover,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useGetDynamicValueQuery } from "../../../features/api/productApiSlice";
import {
  useUpatePackagingMutation,
  useUpdateShipmentMutation,
  useUpdateShipmentImageMutation,
  
} from "../../../features/api/clientAndShipmentApiSlice";
import { toast } from "react-toastify";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import { Height } from "@mui/icons-material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "green",
    color: theme.palette.common.white,
    padding: 1,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 0,
    padding: 5,
  },
  textAlign: "center",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const PackingAndCourierDial = ({ open, setOpen, details, refetch }) => {
  // local states
  const [courierDetails, setCourierDetails] = useState({
    courierName: "",
    Link: "",
    trackingId: "",
  });

  const [packingDetails, setPackingDetails] = useState([
    {
      _id: "",
      ActualWeight: "",
      Length: "",
      Width: "",
      Height: "",
      VolumetryWeight: "",
      Marking: "",
      Description: "",
      Photo: null,
    },
  ]);
  const [imageDetails, setImageDetails] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popOpen, setPopOpen] = useState(false);
  const [toggleWeights,setToggleWeights] = useState(false)
  const [toggleDimension,setToggleDimension] = useState(false)

  // functions for popover
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setPopOpen(true);
    setImageDetails(event);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setPopOpen(false);
  };

  // for update data
  useEffect(() => {
    if (details && details?.fieldDetails?.length > 0) {
      setPackingDetails(details?.fieldDetails);
    } else {
      setPackingDetails([
        {
          _id: "",
          ActualWeight: "",
          Length: "",
          Width: "",
          Height: "",
          VolumetryWeight: "",
          Marking: "",
          Description: "",
          Photo: null,
        },
      ]);
    }
  }, [details && details?.fieldDetails]);

  // rtk query api calling
  const { data: getDyanmicValue } = useGetDynamicValueQuery();
  const [updateShipment, { isLoading: updateShipmentLoading }] =
    useUpdateShipmentMutation();

  const [updataPackages, { isLoading: loadingPacking }] =
    useUpatePackagingMutation();
    
  const [updateImage, { isLoading: loadingBoxImage }] =
    useUpdateShipmentImageMutation();



  const packageDisable = details?.fieldDetails?.length > 0 ? true : false;

  // HANDLE FOR COURIER REALATED FIELDS ONLY
  const handleCourierNameChange = (event) => {
    const { name, value } = event.target;
    let courierLinkFound;
    if (name === "courierName") {
      courierLinkFound = getDyanmicValue?.data[0].courierPartner.find(
        (item) => item.courierName === value
      );
      setCourierDetails((prev) => ({
        ...prev,
        ["Link"]: courierLinkFound.Link,
      }));
    }
    setCourierDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // HANDLE FOR PACKING RELATED FIELDS ONLY
  const handleBoxValueChange = (e, index) => {
    const { value, name } = e.target;
    setPackingDetails((prev) => {
      const updatedPackingDetails = [...prev];
      updatedPackingDetails[index] = {
        ...updatedPackingDetails[index],
        [name]: value,
      };
      return updatedPackingDetails;
    });
  };

  // HANDLE FOR PACKING BOX FILES CHANGE FUNCTION
  const handleFileUpload = async (index, event) => {
    const file = event.target.files[0];

    try {
      if (!details?.fieldDetails.length) {
        toast.warn("First Save Details Then Upload Images");
        return;
      }
      const formData = new FormData();

      formData.append("id", details?.OrderId);
      formData.append("index", index);
      formData.append("Photo", file);
      const res = await updateImage(formData).unwrap();
      toast.success("Images Uploaded Successfully");
      refetch();
      setOpen(false);
    } catch (err) {
      console.log("Error at Upload Box Image Logistics");
      console.log(err);
    }
  };

  // HANDLE ADD MORE FUNCTION
  const handleAddMore = () => {
    const newPackingDetails = [
      ...packingDetails,
      {
        ActualWeight: "",
        Length: "",
        Width: "",
        Height: "",
        VolumetryWeight: "",
        Marking: "",
        Description: "",
        Photo: null,
      },
    ];
    setPackingDetails(newPackingDetails);
  };

  // HANDLE DELETE BOX WHEN WE ADD
  const handleDeleteBox = (index) => {
    setPackingDetails((prevDetails) => {
      return prevDetails.filter((_, i) => i !== index);
    });
  };

  // HANDLE PACKING SUBMIT FUNCTION
  const handlePackaging = async () => {
    if (
      !packingDetails[0]?.Length ||
      !packingDetails[0]?.ActualWeight ||
      !packingDetails[0]?.Width ||
      !packingDetails[0]?.Height
    ) {
      return toast.error("Plase Fill Packing Details befor submission");
    }
    try {
      const info = { id: details.OrderId, datas: packingDetails };
      const result = await updataPackages(info).unwrap();
      toast.success("Packing Details Updated Successfully");
      refetch();
      setPackingDetails([
        {
          ActualWeight: "",
          Length: "",
          Width: "",
          Height: "",
          VolumetryWeight: "",
          Marking: "",
          Description: "",
          Photo: null,
        },
      ]);
      setOpen(false);
    } catch (error) {
      console.log(error);
      // Handle error
    }
  };

  // HANDLE COURIER SUBMIT FUNCTION
  const handleCurrier = async () => {
    if (!courierDetails.courierName)
      return toast.error("Plz Select Courier Name");
    try {
      const info = {
        id: "courier",
        orderShipmentId: details.OrderId,
        trackingId: courierDetails.trackingId,
        courierName: courierDetails.courierName,
        courierLink: courierDetails.Link,
      };
      const result = await updateShipment(info).unwrap();
      toast.success("Courier Details Updated Successfully");
      refetch();
      setCourierDetails({
        courierName: "",
        Link: "",
        trackingId: "",
      });
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box>
      <Dialog open={open} maxWidth="xl">
        <DialogTitle
          sx={{ textAlign: "center", color: "white", background: "blue" }}
        >
          Plz Enter Details of {details.OpenFor}{" "}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ marginTop: "10px", height: "100%", width: details.OpenFor === "Packing" ? "100%" :"20vw" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection:details.OpenFor === "Packing" ? "row" :"column",
                justifyContent: "space-between",
                backgroundColor: "gray",
                alignItems: "center",
                marginBottom: "10px",
                borderBottom: "1px solid #ccc",
                padding: "20px",
                borderRadius: "4px",
                gap:"20px"
              }}
            >
              <span style={{ fontWeight: "bold" }}>
                Shipping ID: {details.OrderId}
              </span>
              <span style={{ fontWeight: "bold" }}>
                Customer Name: {details.CustomerName}
              </span>
            </Box>

            {details.OpenFor === "Packing" ? (
              <Box
                sx={{
                  marginTop: "10px",
                }}
              >
                <div
                  style={{
                    overflow: "auto",
                    height: "100%",
                  }}
                >
                  <TableContainer
                    component={Paper}
                    sx={{
                      marginTop: "10px",
                      boxShadow: "-1px 1px 7px 0px black",
                      height: "100",
                    }}
                  >
                    <Table sx={{ minWidth: 650 }} aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              [`&.${tableCellClasses.head}`]: {
                                backgroundColor: "blue",
                                color: "white",
                                padding: 0,
                                textAlign: "center",
                              },
                            }}
                          >
                            Box No
                          </TableCell>
                          <TableCell
                            sx={{
                              [`&.${tableCellClasses.head}`]: {
                                backgroundColor: "blue",
                                color: "white",
                                padding: 0,
                                textAlign: "center",
                              },
                            }}
                          >
                            A.Weight
                          </TableCell>
                          <TableCell
                            sx={{
                              [`&.${tableCellClasses.head}`]: {
                                backgroundColor: "blue",
                                color: "white",
                                padding: 0,
                                textAlign: "center",
                              },
                            }}
                          >
                            Length<sup>cm</sup>
                          </TableCell>
                          <TableCell
                            sx={{
                              [`&.${tableCellClasses.head}`]: {
                                backgroundColor: "blue",
                                color: "white",
                                padding: 0,
                                textAlign: "center",
                              },
                            }}
                          >
                            Width<sup>cm</sup>
                          </TableCell>
                          <TableCell
                            sx={{
                              [`&.${tableCellClasses.head}`]: {
                                backgroundColor: "blue",
                                color: "white",
                                padding: 0,
                                textAlign: "center",
                              },
                            }}
                          >
                            Height<sup>cm</sup>
                          </TableCell>

                          <TableCell
                            sx={{
                              [`&.${tableCellClasses.head}`]: {
                                backgroundColor: "blue",
                                color: "white",
                                padding: 0,
                                textAlign: "center",
                              },
                            }}
                          >
                            Marking
                          </TableCell>
                          {/* <TableCell
                            sx={{
                              [`&.${tableCellClasses.head}`]: {
                                backgroundColor: "blue",
                                color: "white",
                                padding: 0,
                                textAlign: "center",
                              },
                            }}
                          >
                            Description
                          </TableCell> */}
                          <TableCell
                            sx={{
                              [`&.${tableCellClasses.head}`]: {
                                backgroundColor: "blue",
                                color: "white",
                                padding: 0,
                                textAlign: "center",
                              },
                            }}
                          >
                            Upload Box Image
                          </TableCell>
                          <TableCell
                            sx={{
                              [`&.${tableCellClasses.head}`]: {
                                backgroundColor: "blue",
                                color: "white",
                                padding: 0,
                                textAlign: "center",
                             
                              },
                            }}
                          >
                            Remove
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {packingDetails?.map((item, index) => {
                          
                          return (
                            <StyledTableRow key={index}>
                              <TableCell
                                sx={{
                                  [`&.${tableCellClasses.head}`]: {
                                    backgroundColor: "blue",
                                    color: "white",
                                    padding: 0,
                                    textAlign: "center",
                                  },
                                }}
                              >
                                {index + 1}
                              </TableCell>
                              <StyledTableCell component="th" scope="row">
                                <TextField
                                  placeholder="A.Weight"
                                  size="small"
                                  name="ActualWeight"
                                  value={item.ActualWeight || ""}
                                  onChange={(e) => {
                                    handleBoxValueChange(e, index);
                                  }}
                                />
                              </StyledTableCell>
                              <StyledTableCell>
                                <TextField
                                  type="number"
                                  placeholder="Length"
                                  size="small"
                                  name="Length"
                                  value={item.Length || ""}
                                  onChange={(e) => {
                                    handleBoxValueChange(e, index);
                                  }}
                                />
                              </StyledTableCell>
                              <StyledTableCell>
                                <TextField
                                  type="number"
                                  placeholder="Width"
                                  size="small"
                                  name="Width"
                                  value={item.Width || ""}
                                  onChange={(e) => {
                                    handleBoxValueChange(e, index);
                                  }}
                                />
                              </StyledTableCell>
                              <StyledTableCell>
                                <TextField
                                  type="number"
                                  placeholder="Height"
                                  size="small"
                                  name="Height"
                                  value={item.Height || ""}
                                  onChange={(e) => {
                                    handleBoxValueChange(e, index);
                                  }}
                                />
                              </StyledTableCell>

                              <StyledTableCell>
                                <TextField
                                  type="text"
                                  placeholder="Marking"
                                  size="small"
                                  name="Marking"
                                  value={item.Marking || ""}
                                  onChange={(e) => {
                                    handleBoxValueChange(e, index);
                                  }}
                                />
                              </StyledTableCell>
                              {/* <StyledTableCell>
                                <TextField
                                  type="text"
                                  placeholder="Description"
                                  size="small"
                                  name="Description"
                                  value={item.Description || ""}
                                  onChange={(e) => {
                                    handleBoxValueChange(e, index);
                                  }}
                                />
                              </StyledTableCell> */}
                              <StyledTableCell>
                                {item.Photo ? (
                                  <Button
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
                                ) : (
                                  <>
                                    <input
                                      style={{ display: "none" }}
                                      id={`file-${index}`}
                                      type="file"
                                      accept=".png, .jpg, .jpeg"
                                      onChange={(event) => {
                                        handleFileUpload(index, event);
                                      }}
                                      disabled={loadingBoxImage}
                                    />
                                    <label htmlFor={`file-${index}`}>
                                      {packingDetails &&
                                      packingDetails[index].Photo instanceof
                                        File ? (
                                        <AddPhotoAlternateIcon
                                          sx={{
                                            color: "orange",
                                            fontSize: "2.5rem",
                                          }}
                                        />
                                      ) : (
                                        <AddPhotoAlternateIcon
                                          sx={{
                                            color: "gray",
                                            fontSize: "2.5rem",
                                          }}
                                        />
                                      )}
                                    </label>
                                  </>
                                )}
                              </StyledTableCell>
                              <StyledTableCell>
                                {packingDetails.length > 1 && (
                                  <DeleteIcon
                                    sx={{ color: "red", cursor: "pointer" }}
                                    onClick={() => {
                                      handleDeleteBox(index);
                                    }}
                                  />
                                )}
                              </StyledTableCell>
                            </StyledTableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    margin: "20px",
                  }}
                >
                  <Button onClick={() => handleAddMore()} variant="outlined">
                    Add More Box
                  </Button>
                </div>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  marginTop: "10px",
                }}
              >
                <TextField
                  id="outlined-select-currency"
                  select
                  required
                  label="Select"
                  name="courierName"
                  value={courierDetails.courierName || details?.CourierName}
                  helperText="Please select courier name"
                  onChange={(e) => handleCourierNameChange(e)}
           
                >
                  {getDyanmicValue?.data[0]?.courierPartner?.map(
                    (option, index) => (
                      <MenuItem key={index} value={option.courierName}>
                        {option.courierName}
                      </MenuItem>
                    )
                  )}
                </TextField>
                <TextField
                  fullWidth
                  name="Link"
                  value={courierDetails.Link || details?.Link}
                  onChange={(e) => handleCourierNameChange(e)}
                  label="Courier Link"
                   InputLabelProps={{
                    shrink: courierDetails.Link || details?.Link ? true : false,
                  }}
                ></TextField>{" "}
                <TextField
                  fullWidth
                  label="Enter Tracking Id"
                  name="trackingId"
                  onChange={(e) => handleCourierNameChange(e)}
                  // disabled={details?.TrackingId ? true : false}
                ></TextField>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "space-around" }}>
          <Button
            variant="contained"
            disabled={updateShipmentLoading || packageDisable}
            onClick={() =>
              details.OpenFor === "Packing"
                ? handlePackaging()
                : handleCurrier()
            }
          >
            {updateShipmentLoading || loadingPacking ? (
              <CircularProgress />
            ) : (
              "Submit Details"
            )}
          </Button>

          <Button variant="outlined" onClick={() => setOpen()}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <div>
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
      </div>
    </Box>
  );
};

export default PackingAndCourierDial;
