import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
  selectClasses,
} from "@mui/material";
import {
  useCreateRestockMutation,
  useCreatePriceComparisionMutation,
} from "../../../features/api/RestockOrderApiSlice";
import { useSocket } from "../../../CustomProvider/useWebSocket";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";

const CompetitorDial = ({
  openCompetitor,
  handleCloseCompetitor,
  paramsData,
  handleRemoveCompetitorItem,
  columns,
}) => {
  const [compairePrice, setCompairePrice] = useState([]);

  console.log(compairePrice);
  /// intialize
  // const socket = useSocket();

  /// global state
  // const { isAdmin, productColumns, userInfo } = useSelector(
  //   (state) => state.auth
  // );

  /// local state
  // const [orderQuantities, setOrderQuantities] = useState({});
  // const [description, setDescription] = useState("");

  /// rtk query
  // const [createRestockOrderApi, { isLoading }] = useCreateRestockMutation();
  // const [createPriceComparision, { isLoading: compareLoading }] =
  //   useCreatePriceComparisionMutation();

  /// useEffects
  useEffect(() => {
    const newLocalData = paramsData.map((item) => {
        return {
        ...item,
         };
    });

    setCompairePrice(newLocalData);

  }, [paramsData]);



  const handleCompetitor = (SKU, Name, e) => {
    const { value } = e.target;
    const existingSKUIndex = compairePrice.findIndex(item => item.SKU === SKU);
    const newCompetitor = { Name: Name, Price: parseFloat(value) };
console.log(newCompetitor)
    let values = [];
      setCompairePrice((prev) => {
        return (values = prev.map((data) => {
         if(SKU === data.SKU){

   

    
    

        return {
          ...data,
          // [Name]: value,
          SKU: SKU,
          competitor: [{ Name: Name, Price:value}]
        };
      
     }
          
            
          }))
      });
    
  };


  

  const newColumns = columns.filter((column) => column !== "Sno");

  return (
    <Dialog
      open={openCompetitor}
      onClose={handleCloseCompetitor}
      maxWidth="xl"
      sx={{ backdropFilter: "blur(5px)" }}
      fullWidth
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "3rem",
        }}
      >
        <DialogTitle
          sx={{
            flex: "1",
            textAlign: "center",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          Set Competitor Price
        </DialogTitle>
        <CloseIcon
          onClick={handleCloseCompetitor}
          sx={{
            backgroundColor: "#000",
            color: "#fff",
            borderRadius: "5rem",
            marginRight: "1rem",
            cursor: "pointer",
          }}
        />
      </Box>
      <DialogContent sx={{ overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 450 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    textAlign: "center",
                    background: "linear-gradient(0deg, #01127D, #04012F)",
                    color: "#fff",
                  }}
                >
                  Remove
                </TableCell>
                {columns.map((item, index) => (
                  <TableCell
                    sx={{
                      textAlign: "center",
                      background: "linear-gradient(0deg, #01127D, #04012F)",
                      color: "#fff",
                    }}
                    key={index}
                  >
                    {item}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paramsData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      cursor: "pointer",
                      "&:hover": { color: "red" },
                    }}
                  >
                    <DeleteIcon
                      onClick={() => handleRemoveCompetitorItem(item.id)}
                    />
                  </TableCell>
                  <TableCell key={index}>{index + 1}</TableCell>
                  {newColumns.map((column, columnIndex) => (
                    <TableCell key={columnIndex}>
                      {[
                        "SKU",
                        "Sno",
                        "Product",
                        "Brand",
                        "Category",
                        "GST",
                      ].includes(column) ? (
                        column === "GST" ? (
                          `${parseFloat(item[column]).toFixed(0)} %`
                        ) : (
                          item[column]
                        )
                      ) : (
                        <input
                        defaultValue={item[column]}
                          style={{ width: "100%", padding: 4 }}
                          onChange={(e) =>
                           handleCompetitor(item.SKU, column, e)
                          }
                        />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <Box
        sx={{
          // border: '2px solid green',
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          gap: ".6rem",
        }}
      >
        {/* <Typography
          sx={{
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#80bfff",
            marginTop: ".4rem",
            // border: '2px solid yellow',
            padding: ".2rem",
            border: "2px solid #3385ff",
            borderRadius: ".4rem",
            boxShadow: "-3px 3px 4px 0px #404040",
          }}
        >
          Enter Description For Order
        </Typography> */}
        {/* <TextField
          placeholder="order description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        /> */}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 2,
          gap: "1rem",
          padding: "0.5rem",
          backgroundColor: " #e6e6e6",
        }}
      >
        {/* <Button variant="outlined" onClick={handleConfirm}>
          {isLoading ? (
            <CircularProgress size={24} color="inherit" /> // Show loading indicator
          ) : (
            "Create Restock"
          )}
        </Button> */}
      </Box>
    </Dialog>
  );
};

export default CompetitorDial;
