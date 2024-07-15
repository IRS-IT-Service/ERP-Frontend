import React, { useState, useEffect } from "react";
import productColumnData from "../../../constants/ProductColumn";
import { Dialog, DialogContent, Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
import { useUserRoleUpdateMutation } from "../../../features/api/usersApiSlice";
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

const StyledDraggableItem = styled("div")(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: "lightblue",
  margin: theme.spacing(1),
  cursor: "pointer",
}));

const ProductColumnDialog = ({
  open,
  setOpen,
  handleClose,
  oneUserData,
  adminId,
  refetchOneUser,
  color,
}) => {
  /// global state
  const { name } = useSelector((state) => state.auth.userInfo);

  /// local state
  const [items, setItems] = useState(productColumnData);
  const [box1Items, setBox1Items] = useState([...items]);
  const [box2Items, setBox2Items] = useState([]);
  const [triggerUpdate, setTriggerUpdate] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);

  /// RTK query
  const [userRoleUpdateApi, { isLoading }] = useUserRoleUpdateMutation();
  const handleDragStart = (event, item) => {
    event.dataTransfer.setData("text/plain", item.id);
  };

  /// userEffect
  useEffect(() => {
    if (oneUserData?.status === "success") {
      const box1 = items.filter(
        (item) =>
          !oneUserData.data.productColumns.some(({ id }) => id === item.id)
      );

      setBox1Items(box1);
      setBox2Items(oneUserData.data.productColumns);
    }
  }, [oneUserData]);

  useEffect(() => {
    if (triggerUpdate) {
      const data = {
        type: "product",
        body: {
          adminId: adminId,
          items: box2Items,
          message: updateMessage,
        },
      };

      const performUpdate = async () => {
        try {
          const res = await userRoleUpdateApi(data).unwrap();
          refetchOneUser();
        } catch (error) {
          console.error("An error occurred during login:", error);
        }
      };

      performUpdate();
    }
    setTriggerUpdate(false);
    setUpdateMessage(null);
  }, [box2Items.length, box2Items]);

  const isEditableHandler = async (e, item) => {
    setTriggerUpdate(true);

    let newUpdateMessage = `${name} ${
      e.target.checked ? "added" : "removed"
    } Update rights of ${item.name} ${e.target.checked ? "to" : "from"} user ${
      oneUserData?.data?.name
    }`;
    setUpdateMessage(newUpdateMessage);
    const newbox2Items = box2Items.map((data) => {
      if (data.name === item.name) {
        return { ...data, isEdit: e.target.checked };
      } else {
        return data;
      }
    });

    setBox2Items(newbox2Items);
  };

  const handleDrop = (event, boxNumber) => {
    const itemId = event.dataTransfer.getData("text/plain");
    const draggedItem = items.find((item) => item.id.toString() === itemId);
    let newUpdateMessage = `${name} ${boxNumber === 1 ? "removed" : "added"} ${
      draggedItem.name
    } Product Column rights ${boxNumber === 1 ? "from" : "to"} ${
      oneUserData?.data?.name
    }`;

    setUpdateMessage(newUpdateMessage);

    setTriggerUpdate(true);
    if (draggedItem) {
      if (boxNumber === 1) {
        const box1Exist = box1Items.some((item) => item.id === draggedItem.id);
        if (box1Exist) {
          return;
        }
      }
      if (boxNumber === 2) {
        const box2Exist = box2Items.some((item) => item.id === draggedItem.id);
        if (box2Exist) {
          return;
        }
      }
      if (box1Items.find((item) => item.id === draggedItem.id)) {
        setBox1Items(box1Items.filter((item) => item.id !== draggedItem.id));
      } else if (box2Items.find((item) => item.id === draggedItem.id)) {
        setBox2Items(box2Items.filter((item) => item.id !== draggedItem.id));
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
                fontSize: "1.7rem",
              }}
            >
              Product Columns
            </Typography>
            <CloseIcon
              onClick={handleClose}
              sx={{
                cursor: "pointer",
                background: color,
                color: "#fff",
                borderRadius: "5rem",
                padding: ".1rem",
                marginLeft: "auto",
              }}
            />
          </Box>
          <Box display="flex">
            <StyledBox
              onDrop={(event) => handleDrop(event, 1)}
              onDragOver={(event) => event.preventDefault()}
              sx={{
                overflow: "auto",
                textAlign: "center",
                width: "350px",
                height: "600px",
                padding: "0",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "	 #bfbfbf",
                  padding: ".5rem",
                }}
              >
                Product Columns
              </Typography>
              <Box sx={{ padding: ".5rem" }}>
                {box1Items.map((item) => (
                  <StyledDraggableItem
                    key={item.id}
                    draggable={!isLoading}
                    onDragStart={(event) => handleDragStart(event, item)}
                    sx={{
                      background: color,
                      color: "#fff",
                    }}
                  >
                    {item.name}
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
                width: "350px",
                height: "600px",
                padding: "0",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#bfbfbf",
                  padding: ".5rem",
                }}
              >
                {oneUserData?.data?.name}
              </Typography>
              <Box sx={{ padding: ".5rem", border: "2px solid pink" }}>
                {box2Items.map((item) => (
                  <div key={item.id} style={{ position: "relative" }}>
                    {" "}
                    <StyledDraggableItem
                      key={item.id}
                      draggable={!isLoading}
                      onDragStart={(event) => handleDragStart(event, item)}
                      sx={{
                        background: color,
                        color: "#fff",
                        padding: ".8rem",
                      }}
                    >
                      {item.name}
                    </StyledDraggableItem>
                    <Checkbox
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
                    />
                  </div>
                ))}
              </Box>
            </StyledBox>
          </Box>
        </DialogContent>
      </StyledDialog>
    </div>
  );
};

export default ProductColumnDialog;
