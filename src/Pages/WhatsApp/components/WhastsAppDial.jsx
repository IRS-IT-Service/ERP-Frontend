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
  // const [deleteWhatsAppNo, { refetch: refetchDelete }] =
  //   useDeleteContactNoMutation();

  const [savedContact, setSavedContact] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    const reult = getAllSaveContact?.data?.data;
    if (reult) {
      setSavedContact(reult);
    }
  }, [getAllSaveContact, name]);

  const handleClose = () => {
    setOpen(!open);
  };

  const handleCheckboxChange = ({ item, index }) => {
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems = [...prevCheckedItems];

      if (newCheckedItems.includes(item)) {
        newCheckedItems.splice(newCheckedItems.indexOf(item), 1);
      } else {
        newCheckedItems[index] = item;
      }
      const filteredCheckedItems = newCheckedItems.filter(
        (value) => value !== undefined && value !== null
      );

      return filteredCheckedItems;
    });
  };

  const handleSave = async () => {
    if (checkedItems.length <= 0) return toast.error("Plz provide contact no");
    try {
      const data = checkedItems.map((item, index) => {
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
      handleClose();
    } catch (error) {
      toast.error(error);
      refetch();
      handleClose();
    }
  };

  return (
    <Box>
      <Dialog open={open}>
        <DialogTitle sx={{ textAlign: "center", background: color }}>
          Choose WhatsApp Contact For {name}
        </DialogTitle>
        <DialogContent>
          <div style={{ width: "100%", marginTop: "15px" }}>
            <Paper>
              <TableContainer>
                <Table>
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
                            disabled={item?.ContactNo ? false : true}
                            defaultChecked={getAllSaveContact?.data?.data
                              .map((item) => item.adminId)
                              ?.includes(item?.adminId)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </div>
        </DialogContent>
        <DialogActions>
          <div style={{ width: "100%", textAlign: "center" }}>
            <Button onClick={handleClose} sx={{ background: color }}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              sx={{ background: color, marginLeft: "10px" }}
              disabled = {loadingContact || checkedItems.length <= 0}
            >
              Save
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WhastsAppDial;
