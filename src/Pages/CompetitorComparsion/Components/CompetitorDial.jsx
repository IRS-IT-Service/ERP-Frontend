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
  useAddCompetitorPriceMutation,
} from "../../../features/api/productApiSlice";
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
  productrefetch,
  refetch
}) => {
  const [compairePrice, setCompairePrice] = useState([]);

  const [addCompair ,{isLoading}] = useAddCompetitorPriceMutation()


 

const handleSubmit = async() =>{
const finalValue = compairePrice.filter((item) => item.competitor?.length > 0)
let info = finalValue.map((item)=>{
  return{
    sku: item.SKU,
    competitor: item.competitor
  }
})

const main = {
  datas:info
}
try{
  const res = await addCompair(main).unwrap()
  toast.success("Competitor price added successfully")
  handleCloseCompetitor()
  setCompairePrice([{}])
  productrefetch()
  refetch()

}catch(err){
  console.log(err)
}


}

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
    const newCompetitor = { Name: Name, Price: +value };

    let values = [];

    if (existingSKUIndex !== -1) {
      setCompairePrice(prev => {
        return prev.map((data, index) => {
          if (index === existingSKUIndex) {
            const existingCompetitorIndex = data.competitor.findIndex(comp => comp.Name === Name);
            if (existingCompetitorIndex !== -1) {
              const updatedCompetitorArray = [...data.competitor];
              updatedCompetitorArray[existingCompetitorIndex] = newCompetitor;
              return { ...data, competitor: updatedCompetitorArray };
            } else {
              return { ...data, competitor: [...data.competitor, newCompetitor] };
            }
          }
          return data;
        });
      });
    } else {
      setCompairePrice(prev => {
        return [...prev, { SKU: SKU, competitor: [newCompetitor] }];
      });
    }
    
    
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
        <Button variant="outlined" onClick={handleSubmit}>
          {isLoading ? (
            <CircularProgress size={24} color="inherit" /> // Show loading indicator
          ) : (
            "Submit"
          )}
        </Button>
      </Box>
    </Dialog>
  );
};

export default CompetitorDial;
