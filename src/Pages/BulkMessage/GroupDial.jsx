import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  styled 
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import { useAddGroupMutation } from "../../features/api/marketingApiSlice";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: "#fff", 
  backgroundColor: "#03084E",
  textAlign: "center",
  }));

  const StyledTableCellvalue = styled(TableCell)(({ theme }) => ({
   textAlign: "center",
    padding: ".5rem"
    }));

function GroupDial({
  data,
  successdisplay,
  open,
  setOpen,
  handleSelectionChange,
  selectedItems,
  setSelectedItems,
  setSelectedItemsData
}) {
  /// local state

  const [addGroups, { isLoading: groupLoading }] = useAddGroupMutation();
  const [datas, setDatas] = useState();
  const [Group, setGroup] = useState({
    name: "",
    desc: "",
  });

  const navigate = useNavigate();

  /// rtk query
  const handleChange = (event) => {
    const { name, value } = event.target;

    setGroup({ ...Group, [name]: value });
  };

  /// handlers
  useEffect(() => {
    if (data) {
      const initializeData = data.map((item, index) => ({
        ...item,
        usdValue: null,
        rmbValue: null,
      }));
      setDatas(initializeData);
    }
  }, [data]);



  const handleDelete = (id) => {
    const newSelectedItems = selectedItems.filter((row) => row !== id);
    handleSelectionChange(newSelectedItems);
    if (!newSelectedItems.length) {
      setOpen(false);
    }
    console.log(newSelectedItems);
  };



  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    const NewMember = data.map((item) => {
      return {
        ClientId:item.ClientId,
        ContactName: item.ContactName,
        ContactNumber: item.ContactNumber,
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
      setSelectedItems([])
      setSelectedItems([])
      setGroup({})
      handleClose();
      navigate(
        `/BulkMessage`
      );
    } catch (err) {
      console.log("Error:", err);
    }
  };


  


  return (
    <div style={{ backgroundColor: "green" }}>
      <Dialog   
        open={open}
        onClose={handleClose}
        sx={{ backdropFilter: "blur(5px)" }}
        maxWidth="xl">
    

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
          <TableContainer component={Paper} sx={{ maxHeight: 540 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead sx={{ backgroundColor: "#03084E" }}>
                <TableRow>
                  <StyledTableCell sx={{ color: "#fff", backgroundColor: "#03084E" }}>
                    Sno
                  </StyledTableCell>
                  <StyledTableCell sx={{ color: "#fff", backgroundColor: "#03084E" }}>
                    Contact Name
                  </StyledTableCell>
                  <StyledTableCell sx={{ color: "#fff", backgroundColor: "#03084E" }}>
                    Company Name
                  </StyledTableCell>
                  <StyledTableCell sx={{ color: "#fff", backgroundColor: "#03084E" }}>
                    Email
                  </StyledTableCell>
                  <StyledTableCell sx={{ color: "#fff", backgroundColor: "#03084E" }}>
                    Client Type
                  </StyledTableCell>
                  <StyledTableCell sx={{ color: "#fff", backgroundColor: "#03084E" }}>
                    GSTIN
                  </StyledTableCell>
                  <StyledTableCell sx={{ color: "#fff", backgroundColor: "#03084E" }}>
                    Address
                  </StyledTableCell>
                  <StyledTableCell sx={{ color: "#fff", backgroundColor: "#03084E" }}>
                    Action
                  </StyledTableCell>
              
                </TableRow>
              </TableHead>
              <TableBody>
                {datas?.map((row, index) => (
                  <TableRow key={row.id}>
                    <StyledTableCellvalue sx={{ padding: ".5rem" }}>{index + 1}</StyledTableCellvalue>
                    <StyledTableCellvalue sx={{ padding: ".5rem" }}>{row.ContactName}</StyledTableCellvalue>
                    <StyledTableCellvalue sx={{ padding: ".5rem" }}>{row.CompanyName}</StyledTableCellvalue>
                    <StyledTableCellvalue sx={{ padding: ".5rem" }}>{row.Email}</StyledTableCellvalue>
                    <StyledTableCellvalue sx={{ padding: ".5rem" }}>{row.ClientType}</StyledTableCellvalue>
                    <StyledTableCellvalue sx={{ padding: ".5rem" }}>
                  {row.GSTIN}
                    </StyledTableCellvalue>
                    <StyledTableCellvalue sx={{ padding: ".5rem" }}>
                    {row.Address}
                    </StyledTableCellvalue>
                 
                    <StyledTableCellvalue sx={{ padding: ".5rem" }}>
                      <Button
                        onClick={() => {
                          handleDelete(row.id);
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    </StyledTableCellvalue>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "right",
            padding: ".6rem",
            gap: "1rem",
          }}
        >
      
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
        </Box>
      </Dialog>
    </div>
  );
}

export default GroupDial;
