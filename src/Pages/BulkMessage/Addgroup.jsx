import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Grid,
  TableContainer,
} from "@mui/material";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
import { useAddGroupMutation } from "../../features/api/marketingApiSlice";
import { toast } from "react-toastify";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    minWidth: "400px",
  },
}));

const StyledBox = styled(Box)(({ theme }) => ({
  width: "300px",
  height: "400px",
  border: "2px solid gray",
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  // margin: theme.spacing(1),
  padding: theme.spacing(1),
  width: "600px",
  height: "120px",
  overflow: "auto",
  fontSize: "10px",
  backgroundColor: "transparent",

  boxShadow: "none",
  // Smaller font size to fit all the text
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: "10px", // Smaller font size to fit all the text
  padding: "4px 8px",
  color: "black",
  border: "none",
}));

const StyledDraggableItem = styled("div")(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: "lightblue",
  margin: theme.spacing(1),
  cursor: "pointer",
  overflow: "hidden",
}));

const Addgroup = ({
  open,
  handleClose,
  refetch,
  color,
  data,
  GroupRefetch,
  GroupInfo,
}) => {
  let IsGroupInfo = GroupInfo ? true : false;
  let FinalData = IsGroupInfo ? GroupInfo.Members : data;
  let PreviousMembers = IsGroupInfo ? GroupInfo.Members : [];
  /// global state
  const { name } = useSelector((state) => state.auth.userInfo);
  console.log(data);
  /// local state
  const [items, setItems] = useState(data);
  const [box1Items, setBox1Items] = useState([...data]);
  const [box2Items, setBox2Items] = useState([]);
  const [triggerUpdate, setTriggerUpdate] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [Group, setGroup] = useState({
    name: "",
    desc: "",
  });

  const [addGroups, { isLoading: groupLoading }] = useAddGroupMutation();

  

  /// RTK query
  const handleDragStart = (event, item) => {
    event.dataTransfer.setData("text/plain", item._id);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setGroup({ ...Group, [name]: value });
  };
  const filteredItems = items && items.filter(data =>
    data.ContactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    data.CompanyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    data.ContactNumber.includes(searchTerm)
  );

  /// userEffect
  //   useEffect(() => {
  //     if (oneUserData?.status === "success") {
  //       const box1 = items.filter(
  //         (item) =>
  //           !oneUserData.data.productColumns.some(({ id }) => id === item.id)
  //       );

  //       setBox1Items(box1);
  //       setBox2Items(oneUserData.data.productColumns);
  //     }
  //   }, [oneUserData]);

  //   useEffect(() => {
  //     if (triggerUpdate) {
  //       console.log(updateMessage);
  //       const data = {
  //         type: "product",
  //         body: {
  //           adminId: adminId,
  //           items: box2Items,
  //           message: updateMessage,
  //         },
  //       };

  //       const performUpdate = async () => {
  //         try {
  //           const res = await userRoleUpdateApi(data).unwrap();
  //           refetchOneUser();
  //         } catch (error) {
  //           console.error("An error occurred during login:", error);
  //         }
  //       };

  //       performUpdate();
  //     }
  //     setTriggerUpdate(false);
  //     setUpdateMessage(null);
  //   }, [box2Items.length, box2Items]);

  //   const isEditableHandler = async (e, item) => {
  //     setTriggerUpdate(true);

  //     let newUpdateMessage = `${name} ${
  //       e.target.checked ? "added" : "removed"
  //     } Update rights of ${item.name} ${e.target.checked ? "to" : "from"} user ${
  //       oneUserData?.data?.name
  //     }`;
  //     setUpdateMessage(newUpdateMessage);
  //     const newbox2Items = box2Items.map((data) => {
  //       if (data.name === item.name) {
  //         return { ...data, isEdit: e.target.checked };
  //       } else {
  //         return data;
  //       }
  //     });

  //     setBox2Items(newbox2Items);
  //   };

  const handleSubmit = async () => {
    const NewMember = box2Items.map((data) => {
      return {
        ContactName: data.ContactName,
        ContactNumber: data.ContactNumber,
      };
    });

    try {
      if (!Group.name && !Group.desc) {
        return toast("Please enter a group name and description");
      }
      const info = {
        groupName: Group.name,
        groupDescription: Group.desc,
        Members: JSON.stringify(NewMember),
      };
      const result = await addGroups(info).unwrap();
      toast.success("Group Created Successfully");
      refetch();
      GroupRefetch();
      setGroup({});
      handleClose();
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const handleDrop = (event, boxNumber) => {
    const itemId = event.dataTransfer.getData("text/plain");
    const draggedItem = items.find((item) => item._id.toString() === itemId);
    // let newUpdateMessage = `${name} ${boxNumber === 1 ? "removed" : "added"} ${
    //   draggedItem.name
    // } Product Column rights ${boxNumber === 1 ? "from" : "to"} ${
    //   oneUserData?.data?.name
    // }`;

    // setUpdateMessage(newUpdateMessage);

    setTriggerUpdate(true);
    if (draggedItem) {
      if (boxNumber === 1) {
        const box1Exist = box1Items.some(
          (item) => item._id === draggedItem._id
        );
        if (box1Exist) {
          return;
        }
      }
      if (boxNumber === 2) {
        const box2Exist = box2Items.some(
          (item) => item._id === draggedItem._id
        );
        if (box2Exist) {
          return;
        }
      }
      if (box1Items.find((item) => item._id === draggedItem._id)) {
        setBox1Items(box1Items.filter((item) => item._id !== draggedItem._id));
      } else if (box2Items.find((item) => item._id === draggedItem._id)) {
        setBox2Items(box2Items.filter((item) => item._id !== draggedItem._id));
      }

      if (boxNumber === 1) {
        setBox1Items([...box1Items, draggedItem]);
      } else if (boxNumber === 2) {
        setBox2Items([...box2Items, draggedItem]);
      }
    }
  };

  return (
    <div>
      <StyledDialog
        open={open}
        onClose={handleClose}
        sx={{ backdropFilter: "blur(5px)" }}
        maxWidth="xl"
      >
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                flex: "1",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              Add Group
            </Typography>
            <CloseIcon
              onClick={handleClose}
              sx={{
                cursor: "pointer",
                background: "#32a852",
                color: "#fff",
                borderRadius: "5rem",
                padding: ".1rem",
                marginLeft: "auto",
              }}
            />
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              padding: 1,
              gap: "10px",
            }}
          >
            <TextField
              variant="outlined"
              label="Group Name"
              name={"name"}
              size="small"
              fullWidth
              value={Group.name}
              onChange={(e) => handleChange(e)}
            />
            <TextField
              variant="outlined"
              label="Group description"
              name={"desc"}
              value={Group.desc}
              size="small"
              fullWidth
              onChange={(e) => handleChange(e)}
            />
          </Box>
          <TextField
          fullWidth
          variant="outlined"
          label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
          <Box display="flex">
            <StyledBox
              onDrop={(event) => handleDrop(event, 1)}
              onDragOver={(event) => event.preventDefault()}
              sx={{
                overflow: "auto",
                textAlign: "center",
                width: "650px",
                height: "600px",
                padding: "0",
                background: "#d4fce0",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#032b0e",
                  color: "#fff",
                  padding: ".5rem",
                  fontSize: "0.88rem",
                  position: "sticky",
                  top: 0,
                }}
              >
                Client Name
              </Typography>
              <Box sx={{ padding: ".5rem" }}>
                {filteredItems.map((item) => (
                  <StyledDraggableItem
                    key={item.id}
                    draggable={true}
                    onDragStart={(event) => handleDragStart(event, item)}
                    sx={{
                      background: "#32a852",
                      color: "#fff",
                    }}
                  >
                    <Box>
                      <StyledCard>
                        <TableContainer style={{ maxHeight: "200px" }}>
                          <Table size="small">
                            <TableBody>
                              <TableRow>
                                <StyledTableCell
                                  colSpan={4}
                                  sx={{
                                    fontSize: "12px",
                                    color: "#fff",
                                    background: "black",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      padding: ".1rem",
                                    }}
                                  >
                                    <div>{item.ContactName}</div>
                                    <div>{item.ContactNumber}</div>
                                  </div>
                                </StyledTableCell>
                              </TableRow>
                              <TableRow>
                                <StyledTableCell>
                                  <strong>Client Type:</strong>{" "}
                                  {item.ClientType}
                                </StyledTableCell>

                                {item.CompanyName && (
                                  <StyledTableCell>
                                    <strong>Company Name:</strong>{" "}
                                    {item.CompanyName}
                                  </StyledTableCell>
                                )}
                                <StyledTableCell>
                                  <strong>Email:</strong> {item.Email}
                                </StyledTableCell>
                              </TableRow>
                              <TableRow>
                                <StyledTableCell>
                                  <strong>GSTIN:</strong> {item.GSTIN}
                                </StyledTableCell>
                                <StyledTableCell>
                                  <strong>Permanent Address:</strong>{" "}
                                  {item.PermanentAddress.Address},{" "}
                                  {item.PermanentAddress.District},{" "}
                                  {item.PermanentAddress.State},{" "}
                                  {item.PermanentAddress.Pincode},{" "}
                                  {item.PermanentAddress.Country}
                                </StyledTableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </StyledCard>
                    </Box>
                  </StyledDraggableItem>
                ))}
              </Box>
            </StyledBox>
            <StyledBox
              onDrop={(event) => handleDrop(event, 2)}
              onDragOver={(event) => event.preventDefault()}
              sx={{
                overflow: "auto",
                textAlign: "center",
                width: "650px",
                height: "600px",
                padding: "0",
                background: "#d4fce0",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#032b0e",
                  color: "#fff",
                  padding: ".5rem",
                  fontSize: "0.88rem",
                  position: "sticky",
                  top: 0,
                }}
              >
                Group Member
              </Typography>
              <Box sx={{ padding: ".5rem" }}>
                {box2Items.map((item) => (
                  <div key={item._id} style={{ position: "relative" }}>
                    {" "}
                    <StyledDraggableItem
                      key={item._id}
                      draggable={true}
                      onDragStart={(event) => handleDragStart(event, item)}
                      sx={{
                        backgroundColor: "#32a852",
                        color: "#fff",
                        padding: ".4rem",
                      }}
                    >
                      <Box>
                        <StyledCard>
                          <TableContainer style={{ maxHeight: "200px" }}>
                            <Table size="small">
                              <TableBody>
                                <TableRow>
                                  <StyledTableCell
                                    colSpan={4}
                                    sx={{
                                      fontSize: "12px",
                                      color: "#fff",
                                      background: "black",
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: ".1rem",
                                      }}
                                    >
                                      <div>{item.ContactName}</div>
                                      <div>{item.ContactNumber}</div>
                                    </div>
                                  </StyledTableCell>
                                </TableRow>
                                <TableRow>
                                  <StyledTableCell>
                                    <strong>Client Type:</strong>{" "}
                                    {item.ClientType}
                                  </StyledTableCell>

                                  {item.CompanyName && (
                                    <StyledTableCell>
                                      <strong>Company Name:</strong>{" "}
                                      {item.CompanyName}
                                    </StyledTableCell>
                                  )}
                                  <StyledTableCell>
                                    <strong>Email:</strong> {item.Email}
                                  </StyledTableCell>
                                </TableRow>
                                <TableRow>
                                  <StyledTableCell>
                                    <strong>GSTIN:</strong> {item.GSTIN}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    <strong>Permanent Address:</strong>{" "}
                                    {item.PermanentAddress.Address},{" "}
                                    {item.PermanentAddress.District},{" "}
                                    {item.PermanentAddress.State},{" "}
                                    {item.PermanentAddress.Pincode},{" "}
                                    {item.PermanentAddress.Country}
                                  </StyledTableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </StyledCard>
                      </Box>
                    </StyledDraggableItem>
                    {/* <Checkbox
                      disabled={isLoading}
                      sx={{
                        position: "absolute",
                        // border: "2px solid green",
                        right: ".6rem",
                        top: 0,
                        backgroundColor: "white",
                        "&:hover": {
                          backgroundColor: "white",
                        },
                      }}
                      checked={item.isEdit ? true : false}
                      onChange={(e) => isEditableHandler(e, item)}
                      style={{ color: color }}
                    /> */}
                  </div>
                ))}
              </Box>
            </StyledBox>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              marginTop: "1rem",
            }}
          >
            {" "}
            <Button
              variant="contained"
              sx={{
                background: "#094f1d",
                "&:hover": { background: "#021708" },
              }}
              onClick={handleSubmit}
              disabled={groupLoading}
            >
              {groupLoading ? (
                <CircularProgress size={30} sx={{ color: "#fff" }} />
              ) : (
                "Create group"
              )}
            </Button>{" "}
          </Box>
        </DialogContent>
      </StyledDialog>
    </div>
  );
};

export default Addgroup;
