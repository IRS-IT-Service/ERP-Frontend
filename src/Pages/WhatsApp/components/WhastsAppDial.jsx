import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Checkbox,
  Typography,
  filledInputClasses,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useGetAllUsersQuery } from "../../../features/api/usersApiSlice";
import { toast } from "react-toastify";
import {
  useDeleteContactNoMutation,
  useGetAllContactNoQuery,
  useSaveWhatsAppNoMutation,
} from "../../../features/api/whatsAppApiSlice";

const WhastsAppDial = ({ open, setOpen, name, color }) => {
  // rtk query call
  const {
    data: getAllUsers,
    isFetching,
    refetch: refetchAllUser,
  } = useGetAllUsersQuery();

  const { data: getAllSaveContact, refetch } = useGetAllContactNoQuery(name);
  const [saveWhatsAppNo, { isLoading: loadingContact }] =
    useSaveWhatsAppNoMutation();
  const [
    deleteWhatsAppNo,
    { refetch: refetchDelete, isLoading: deleteLoading },
  ] = useDeleteContactNoMutation();

  const [savedContact, setSavedContact] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [deleteCheckedItems, setDeleteCheckedItems] = useState([]);

  useEffect(() => {
    const reult = getAllSaveContact?.data?.data;
    if (reult) {
      setSavedContact(reult);
    }
  }, [getAllSaveContact, name]);

  const handleClose = () => {
    setOpen(!open);
  };
  const handleCheckboxChange = ({ item }) => {
    setCheckedItems((prevCheckedItems) => {
      const isChecked = prevCheckedItems.includes(item);
      if (isChecked) {
        return prevCheckedItems.filter((prev) => prev !== item);
      } else {
        return [...prevCheckedItems, item];
      }
    });
  };

  const handleSave = async () => {
    if (checkedItems.length <= 0) return toast.error("Plz provide contact no");
    try {
      const data = checkedItems.map((item) => {
        return {
          userName: item.name,
          adminId: item.adminId,
          contact: item.ContactNo,
          department: item.Department,
        };
      });
      const datas = { name: name, data: data };
      const saveContact = await saveWhatsAppNo(datas);
      toast.success(`WhatsApp Contact Saved For ${name}`);
      refetch();
      checkedItems([]);
    } catch (error) {
      toast.error(error);
      refetch();
    }
  };

  // handle on change for for deleted contact list for cha
  const handleDeleteChange = async ({ item }) => {
    setDeleteCheckedItems((prev) => {
      const isChecked = prev.includes(item);
      if (isChecked) {
        return prev.filter((prevItem) => prevItem !== item);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleDelete = async () => {
    if (deleteCheckedItems.length <= 0)
      return toast.success("Please select contact to delete");
    try {
      const info = { name: name, data: deleteCheckedItems };
      const deleteContact = await deleteWhatsAppNo(info).unwrap();
      toast.success("Contact Deleted Successfully");
      refetch();
      refetchAllUser();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <Dialog open={open} maxWidth={"xl"}>
        <DialogTitle sx={{ textAlign: "center", background: color }}>
          Choose WhatsApp Contact For {name}
        </DialogTitle>
        <DialogContent>
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ border: "1px solid green", marginTop: "15px" }}>
              <Typography
                sx={{
                  background: "green",
                  padding: "5px",
                  textAlign: "center",
                  color: "white",
                }}
              >
                All Current Users In Portal
              </Typography>
              <Paper>
                <TableContainer>
                  <Table sx={{ overflowY: "scroll" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>SNO</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Assign</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getAllUsers?.data.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            {item?.name ? item?.name : " N/A"}
                          </TableCell>
                          <TableCell>
                            {item?.Department ? item.Department : "N/A"}
                          </TableCell>
                          <TableCell>
                            {item?.ContactNo ? item.ContactNo : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              onChange={() =>
                                handleCheckboxChange({ item, index })
                              }
                              disabled={getAllSaveContact?.data?.data.some(
                                (data) => data.adminId === item.adminId
                              )}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </div>
            <div style={{ border: "1px solid green", marginTop: "15px" }}>
              <Typography
                sx={{
                  background: "green",
                  padding: "5px",
                  textAlign: "center",
                  color: "white",
                }}
              >
                Selected User For WhatsApp Event
              </Typography>
              <Paper>
                <TableContainer>
                  <Table sx={{ overflowY: "scroll" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>SNO</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Delete</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getAllSaveContact?.data?.data.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            {item?.userName ? item?.userName : " N/A"}
                          </TableCell>
                          <TableCell>
                            {item?.Department ? item.Department : "N/A"}
                          </TableCell>
                          <TableCell>
                            {item?.contact ? item.contact : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              onChange={() => handleDeleteChange({ item })}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Button onClick={handleClose} sx={{ background: color }}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              sx={{ background: color, marginLeft: "10px" }}
              disabled={loadingContact || checkedItems.length <= 0}
            >
              Assign
            </Button>
            <Button
              sx={{ background: color, marginLeft: "10px" }}
              disabled={deleteLoading || deleteCheckedItems.length === 0}
              onClick={() => handleDelete()}
            >
              Delete
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WhastsAppDial;
