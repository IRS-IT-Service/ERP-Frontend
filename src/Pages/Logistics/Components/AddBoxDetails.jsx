import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  TextField,
  styled,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useSelector } from "react-redux";
import {
  useAddBoxDetailsMutation,
  useGetOneLogisticsQuery,
  useAddBoxImagesMutation,
} from "../../../features/api/logisticsApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../components/Common/Loading";
import { formatDate } from "../../../commonFunctions/commonFunctions";
import { toast } from "react-toastify";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
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

const AddBoxDetails = () => {
  /// initialize
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  /// global state
  const { themeColor } = useSelector((state) => state.ui);
  const color = themeColor.sideBarColor1;

  /// local state
  const [boxData, setBoxData] = useState([]);
  const [imageView, setImageView] = useState(false);
  const [imageDetails, setImageDetails] = useState(null);
  const [isEdited, setIsEdited] = useState(false);

  /// rtk query
  const { data, refetch, isLoading, isFetching } = useGetOneLogisticsQuery(id);
  const [addBoxDetailsApi, { isLoading: addBoxLoading }] =
    useAddBoxDetailsMutation();
  const [addBoxImageApi, { isLoading: addBoxImageLoading }] =
    useAddBoxImagesMutation();

  /// useEffects

  useEffect(() => {
    if (data?.status === "success") {
      const newBoxData = [];
      let boxCount = data.data?.Box;
      let ExistingData = data.data.NoOfBox;

      for (let i = 0; i < boxCount; i++) {
        if (ExistingData[i]) {
          newBoxData.push({ ...ExistingData[i] });
        } else {
          newBoxData.push({});
        }
      }

      setBoxData(newBoxData);
    }
  }, [data]);

  /// handlers
  const handleBoxValueChange = (value, index, name) => {
    setIsEdited(true);
    const existingBoxData = [...boxData];
    existingBoxData[index][name] = value;
    if (name === "height" || name === "width" || name === "length") {
      const newVolumeWeight = volWeightCalc(existingBoxData[index]);
      existingBoxData[index]["weight"] = newVolumeWeight;
    }
    setBoxData(existingBoxData);
  };

  const handleFileUpload = async (index, event) => {
    const file = event.target.files[0];

    try {
      if (!data?.data?.NoOfBox.length) {
        toast.warn("First Save Details Then Upload Images");
        return;
      }
      const formData = new FormData();

      formData.append("id", id);
      formData.append("index", index);
      formData.append("photo", file);
      const res = await addBoxImageApi(formData).unwrap();
      toast.success("Images Uploaded Successfully");
      refetch();
    } catch (err) {
      console.log("Error at Upload Box Image Logistics");
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log(boxData);
      const processedBoxData = boxData.map((item) => {
        return {
          ...item,
          actWeight: item.actWeight || "",
          description: item.description || "",
          height: item.height || "",
          length: item.length || "",
          marking: item.marking || "",
          weight: item.weight || "",
          width: item.width || "",
        };
      });

      const params = {
        id: id,
        body: { boxData: processedBoxData },
      };

      const res = await addBoxDetailsApi(params).unwrap();

      toast.success("Box Saved Successfully");
    } catch (err) {
      console.log("Error at addBoxes: " + err);
      toast.error(err.message);
    }
  };

  const handleUpdateButtonClick = () => {
    // Trigger click event on the file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  /// function

  const volWeightCalc = (box) => {
    const { length = 0, width = 0, height = 0 } = box;
    const value = data?.data?.CourierType === "courier" ? 5000 : 6000;

    const actualLength = parseFloat(length);
    const actualWidth = parseFloat(width);
    const actualHeight = parseFloat(height);

    const volumeWieght = (actualLength * actualWidth * actualHeight) / value;

    return volumeWieght.toFixed(2);
  };

  return (
    <div>
      <DrawerHeader />
      <Loading
        loading={isLoading || addBoxLoading || isFetching || addBoxImageLoading}
      />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          overflow: "hidden",
          height: "91.5vh",
        }}
      >
        <center>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              textAlign: "center",
              boxShadow: 5,
              borderRadius: "2px",
            }}
          >
            <Typography
              sx={{
                boxShadow: 1,
                borderRadius: "4px",
                cursor: "pointer",
                padding: 0.8,
              }}
            >
              Date = {formatDate(data?.data.Date)}
            </Typography>
            <Typography
              sx={{
                boxShadow: 1,
                borderRadius: "4px",
                cursor: "pointer",
                padding: 0.8,
              }}
            >
              HAWB no = {data?.data.Hawb}
            </Typography>
            <Typography
              sx={{
                boxShadow: 1,
                borderRadius: "4px",
                cursor: "pointer",
                padding: 0.8,
              }}
            >
              Pl = {data?.data.Pi}
            </Typography>
            <Typography
              sx={{
                boxShadow: 1,
                borderRadius: "4px",
                cursor: "pointer",
                padding: 0.8,
              }}
            >
              Logisticld = {data?.data.logisticId}
            </Typography>
            <Button
              variant="outlined"
              sx={{
                marginTop: "12px",
                marginBottom: "12px",
                color: "white",
                background: color,
                "&:hover": {
                  color: "black",
                },
              }}
              disabled={!isEdited}
              onClick={() => {
                handleSubmit();
              }}
            >
              Save Changes
            </Button>
          </Box>
          <div
            style={{
              overflow: "auto",
              height: "85vh",
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
                          backgroundColor: color,
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
                          backgroundColor: color,
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
                          backgroundColor: color,
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
                          backgroundColor: color,
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
                          backgroundColor: color,
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
                          backgroundColor: color,
                          color: "white",
                          padding: 0,
                          textAlign: "center",
                        },
                      }}
                    >
                      Vol.Weight
                    </TableCell>
                    <TableCell
                      sx={{
                        [`&.${tableCellClasses.head}`]: {
                          backgroundColor: color,
                          color: "white",
                          padding: 0,
                          textAlign: "center",
                        },
                      }}
                    >
                      Marking
                    </TableCell>
                    <TableCell
                      sx={{
                        [`&.${tableCellClasses.head}`]: {
                          backgroundColor: color,
                          color: "white",
                          padding: 0,
                          textAlign: "center",
                        },
                      }}
                    >
                      Description
                    </TableCell>
                    <TableCell
                      sx={{
                        [`&.${tableCellClasses.head}`]: {
                          backgroundColor: color,
                          color: "white",
                          padding: 0,
                          textAlign: "center",
                        },
                      }}
                    >
                      Upload Box Image
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {boxData.map((item, index) => {
                    return (
                      <StyledTableRow key={index}>
                        <TableCell
                          sx={{
                            [`&.${tableCellClasses.head}`]: {
                              backgroundColor: color,
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
                            type="number"
                            placeholder="A.Weight"
                            size="small"
                            value={item?.actWeight || ""}
                            onChange={(e) => {
                              handleBoxValueChange(
                                e.target.value,
                                index,
                                "actWeight"
                              );
                            }}
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          <TextField
                            type="number"
                            placeholder="Length"
                            size="small"
                            value={item?.length || ""}
                            onChange={(e) => {
                              handleBoxValueChange(
                                e.target.value,
                                index,
                                "length"
                              );
                            }}
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          <TextField
                            type="number"
                            placeholder="Width"
                            size="small"
                            value={item?.width || ""}
                            onChange={(e) => {
                              handleBoxValueChange(
                                e.target.value,
                                index,
                                "width"
                              );
                            }}
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          <TextField
                            type="number"
                            placeholder="Height"
                            size="small"
                            value={item?.height || ""}
                            onChange={(e) => {
                              handleBoxValueChange(
                                e.target.value,
                                index,
                                "height"
                              );
                            }}
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          <TextField
                            type="number"
                            placeholder="Vol.Weight"
                            size="small"
                            value={item?.weight || ""}
                            onChange={(e) => {
                              handleBoxValueChange(
                                e.target.value,
                                index,
                                "weight"
                              );
                            }}
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          <TextField
                            type="text"
                            placeholder="Marking"
                            size="small"
                            value={item?.marking || ""}
                            onChange={(e) => {
                              handleBoxValueChange(
                                e.target.value,
                                index,
                                "marking"
                              );
                            }}
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          <TextField
                            type="text"
                            placeholder="Description"
                            size="small"
                            value={item?.description || ""}
                            onChange={(e) => {
                              handleBoxValueChange(
                                e.target.value,
                                index,
                                "description"
                              );
                            }}
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          {item.photo ? (
                            <Button
                              onClick={() => {
                                setImageView(true);
                                setImageDetails({
                                  box: index + 1,
                                  photo: item.photo,
                                });
                              }}
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
                              />
                              <label htmlFor={`file-${index}`}>
                                {boxData &&
                                boxData[index].imageFile instanceof File ? (
                                  <AddPhotoAlternateIcon
                                    sx={{ color: "orange", fontSize: "2.5rem" }}
                                  />
                                ) : (
                                  <AddPhotoAlternateIcon
                                    sx={{ color: "gray", fontSize: "2.5rem" }}
                                  />
                                )}
                              </label>
                            </>
                          )}
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </center>
      </div>
      '
      <Dialog
        open={imageView}
        fullWidth
        onClose={() => {
          setImageView(false);
          setImageDetails(null);
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: color,
            color: "white",
          }}
        >
          Box {imageDetails?.box}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              maxWidth: "100%",
              maxHeight: "100%",
              overflow: "hidden",
            }}
          >
            <img
              src={imageDetails?.photo}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setImageView(false);
              setImageDetails(null);
            }}
          >
            Close
          </Button>
          <Button onClick={handleUpdateButtonClick}>Update</Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".png, .jpg, .jpeg"
            onChange={(e) => {
              handleFileUpload(imageDetails.box - 1, e);
              setImageView(false);
            }}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddBoxDetails;
