import React, { useState } from "react";
import { Button, Dialog, DialogTitle, DialogActions, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { NearbyError } from "@mui/icons-material";

const BulkUpdateSelectorDialog = ({ list, open, setOpen }) => {
  const [newList, setNewList] = useState(list?.filter((item) => item.id !== 7));
  // console.log(newList);
  const [selectedItems, setSelectedItems] = useState([]);
  /// initialize
  const navigate = useNavigate();

  /// handler
  const handleClose = () => {
    setOpen(false);
  };

  const handleSelected = (name) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(name)) {
        return prevSelected.filter((itemName) => itemName !== name);
      } else {
        return [...prevSelected, name];
      }
    });
  };
  const handleOk = (name) => {
    const finalName = name.join("&");
    console.log(finalName);
    navigate(`/UpdateSellerPriceBulk/${finalName}`);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xl">
      <DialogTitle
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          background: "#80bfff",
        }}
      >
        <span style={{ marginLeft: "30%" }}>Select Option To Bulk Update </span>
        <div>
          <i
            className="fa-solid fa-circle-xmark"
            style={{
              marginLeft: "20%",
              cursor: "pointer",
              color: "black", // Initial color
            }}
            onClick={handleClose}
          ></i>
        </div>
      </DialogTitle>

      <DialogActions>
        {newList?.map((item) => {
          return (
            <Button
              key={item.id}
              // onClick={() => {
              //   onClick(item.name);
              // }}
              onClick={() => handleSelected(item.name)}
              variant={selectedItems.includes(item.name) ? "contained" : "text"}
              sx={{
                background: selectedItems.includes(item.name)
                  ? "#169cff"
                  : "#fff",
                color: selectedItems.includes(item.name) ? "black" : "black",
                margin: "10px",
                boxShadow:
                  " rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
                "&:hover": {
                  background: "#169cff",
                  color: "black",
                  transform: "scale(1.05)",
                },
              }}
            >
              {item.name}
            </Button>
          );
        })}

        <Button
          variant="contained"
          sx={{
            backgroundColor: "black",
            "&:hover": {
              backgroundColor: "white",
              color: "black",
              border: "2px solid black",
            },
          }}
          onClick={() => {
            handleOk(selectedItems);
          }}
        >
          {" "}
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkUpdateSelectorDialog;
