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
import { useAddCompetitorPriceMutation } from "../../../features/api/productApiSlice";
import { useSocket } from "../../../CustomProvider/useWebSocket";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import HttpIcon from "@mui/icons-material/Http";
const CompetitorDial = ({
  openCompetitor,
  handleCloseCompetitor,
  paramsData,
  handleRemoveCompetitorItem,
  columns,
  productrefetch,
  refetch,
}) => {
  const [compairePrice, setCompairePrice] = useState([]);

  const [addCompair, { isLoading }] = useAddCompetitorPriceMutation();

  const [price, setPrice] = useState({
    SKU: "",
    CompName: "",
    url: "",
    Price: "",
  });

  const handleSubmit = async () => {
    const finalValue = compairePrice.filter(
      (item) => item.competitor?.length > 0
    );
    let info = finalValue.map((item) => {
      return {
        sku: item.SKU,
        competitor: item.competitor,
      };
    });

    const main = {
      datas: info,
    };
    try {
      const res = await addCompair(main).unwrap();
      toast.success("Competitor price added successfully");
      handleCloseCompetitor();
      setCompairePrice([{}]);
      productrefetch();
      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  /// useEffects
  useEffect(() => {
    const newLocalData = paramsData.map((item) => {
      return {
        ...item,
      };
    });

    setCompairePrice(newLocalData);
  }, [paramsData]);

  const handleCompetitor = (SKU, CompName, e) => {
    const { value, name } = e.target;
    if (name === "url") {
      setPrice({ ...price, SKU: SKU, CompName: CompName, url: value });
    } else {
      setPrice({ ...price, SKU: SKU, CompName: CompName, Price: value });
    }
  };

  useEffect(() => {
    const newCompetitor = {
      Name: price.CompName,
      Price: +price.Price,
      URL: price.url,
    };

    const existingSKUIndex = compairePrice.findIndex(
      (item) => item.SKU === price.SKU
    );

    if (existingSKUIndex !== -1) {
      setCompairePrice((prev) => {
        return prev.map((data, index) => {
          if (index === existingSKUIndex) {
            const existingCompetitorIndex = data.competitor.findIndex(
              (comp) => comp.Name === price.CompName
            );
            if (existingCompetitorIndex !== -1) {
              const updatedCompetitorArray = [...data.competitor];
              updatedCompetitorArray[existingCompetitorIndex] = newCompetitor;
              return { ...data, competitor: updatedCompetitorArray };
            } else {
              return {
                ...data,
                competitor: [...data.competitor, newCompetitor],
              };
            }
          }
          return data;
        });
      });
    } else {
      setCompairePrice((prev) => {
        return [...prev, { SKU: price.SKU, competitor: [newCompetitor] }];
      });
    }
  }, [price, setPrice]);

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
      <DialogContent>
        <TableContainer sx={{ maxHeight: 450 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow colSpan={3}>
                <TableCell
                  sx={{
                    textAlign: "center",
                    background: "linear-gradient(0deg, #01127D, #04012F)",
                    color: "#fff",
                    position: "sticky",
                    top: 0,
                    left: 0,
                    zIndex: 200,
                    width: 0,
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
                      width: 0,
                      position: [
                        "SKU",
                        "Sno",
                        "Product",
                        "Brand",
                        "Category",
                        "SalesPrice",
                        "GST",
                      ].includes(item)
                        ? "sticky"
                        : "sticky",

                      left: `${
                        [
                          "SKU",
                          "Sno",
                          "Product",
                          "Brand",
                          "Category",
                          "SalesPrice",
                          "GST",
                        ].includes(item)
                          ? item === "Sno"
                            ? 5.2
                            : item === "SKU"
                            ? 8.75
                            : item === "Product"
                            ? 17.1
                            : item === "Brand"
                            ? 22.25
                            : item === "Category"
                            ? 26.6
                            : item === "SalesPrice"
                            ? 32
                            : item === "GST"
                            ? 38
                            : 0
                          : ""
                      }rem`,
                      zIndex: `${
                        [
                          "SKU",
                          "Sno",
                          "Product",
                          "Brand",
                          "Category",
                          "SalesPrice",
                          "GST",
                        ].includes(item)
                          ? 300
                          : 100
                      }`,
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
                      position: "sticky",
                      background: "#fff",
                      left: 0,
                      width: 0,

                      zIndex: 100,
                      "&:hover": { color: "red" },
                    }}
                  >
                    <DeleteIcon
                      onClick={() => handleRemoveCompetitorItem(item.id)}
                    />
                  </TableCell>
                  <TableCell
                    key={index}
                    sx={{
                      position: "sticky",
                      left: 75,
                      zIndex: 200,
                      background: "#fff",
                      textAlign: "center",
                    }}
                  >
                    {index + 1}
                  </TableCell>

                  {newColumns.map((column, columnIndex) => (
                    <TableCell
                      key={columnIndex}
                      sx={{
                        position: [
                          "SKU",
                          "Sno",
                          "Product",
                          "Brand",
                          "Category",
                          "SalesPrice",
                          "GST",
                        ].includes(column)
                          ? "sticky"
                          : "inherit",
                        left: `${
                          column === "Sno"
                            ? 0
                            : column === "SKU"
                            ? 10
                            : column === "Product"
                            ? 18
                            : column === "Brand"
                            ? 23
                            : column === "Category"
                            ? 27.45
                            : column === "SalesPrice"
                            ? 33.1
                            : column === "GST"
                            ? 38.8
                            : 60
                        }rem`,

                        // background:"#fff",
                        zIndex: 100,

                        background: `${column === "Product" ? "red" : "#fff"}`,
                        // paddingX:`${column === "Product" ? "15rem" : "#fff"}`,
                      }}
                    >
                      {[
                        "SKU",
                        "Sno",
                        "Product",
                        "Brand",
                        "Category",
                        "SalesPrice",
                        "GST",
                      ].includes(column) ? (
                        column === "GST" ? (
                          `${parseFloat(item[column]).toFixed(0)} %`
                        ) : column === "SalesPrice" ? (
                          ` ₹ ${(item[column]).toFixed(0)}`
                        ) : (
                          item[column]
                        )
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <Box
                            style={{
                              position: "relative",
                            }}
                          >
                            <span
                              style={{
                                position: "absolute",
                                zIndex: 1,
                                left: 2,
                                top: 1.5,
                              }}
                            >
                              <CurrencyRupeeIcon
                                sx={{ width: 15, background: "#eee" }}
                              />
                            </span>
                            <input
                              defaultValue={item[column]?.Price}
                              style={{
                                textIndent: "0.8rem",
                                width: "6rem",
                                padding: 4,
                              }} // Adjust the value according to your preference
                              onChange={(e) =>
                                handleCompetitor(item.SKU, column, e)
                              }
                            />
                          </Box>
                          <Box
                            style={{
                              position: "relative",
                            }}
                          >
                            <span
                              style={{
                                position: "absolute",
                                zIndex: 1,
                                left: 2,
                                top: 1.5,
                              }}
                            >
                              <HttpIcon
                                sx={{ width: 25, background: "#eee" }}
                              />
                            </span>
                            <input
                              defaultValue={item[column]?.URL}
                              name="url"
                              style={{
                                textIndent: "1.5rem",
                                width: "6rem",
                                padding: 4,
                              }} // Adjust the value according to your preference
                              onChange={(e) =>
                                handleCompetitor(item.SKU, column, e)
                              }
                            />
                          </Box>
                        </Box>
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
      ></Box>
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
