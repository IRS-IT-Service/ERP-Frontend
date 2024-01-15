import React, { useEffect, useState, useRef } from "react";
import Header from "../../components/Common/Header";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Collapse,
  InputBase,
  IconButton,
  Box,
  Button,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Grid,
  Tooltip,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import Autocomplete from "@mui/material/Autocomplete";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import RishabhCalc from "./RishabhCalc";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const { themeColor } = useSelector((state) => state.ui);
  const color = themeColor.sideBarColor1;
  const color2 = themeColor.sideBarColor2;

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell sx={{ padding: 0 }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          align="left"
          sx={{ fontWeight: "bold", padding: 1, fontSize: "0.6rem" }}
        >
          {row.sku}
        </TableCell>
        <TableCell
          align="left"
          sx={{ fontWeight: "bold", padding: 1, fontSize: "0.6rem" }}
        >
          {row.product}
        </TableCell>
        <TableCell>
          {" "}
          <InputBase
            type="number"
            sx={{
              outline: "1px solid black ",
              marginLeft: "5px",
              width: "30px",
              height: "15px",
              borderRadius: "2px",
              fontSize: "0.6rem",
              fontWeight: "bold",
            }}
          />
        </TableCell>
        <TableCell>
          {" "}
          <InputBase
            type="number"
            sx={{
              outline: "1px solid black ",
              marginLeft: "5px",
              width: "30px",
              height: "15px",
              borderRadius: "2px",
              fontSize: "0.6rem",
              fontWeight: "bold",
            }}
          />
        </TableCell>
        <TableCell>
          <InputBase
            type="number"
            sx={{
              outline: "1px solid black ",
              marginLeft: "5px",
              width: "30px",
              height: "15px",
              borderRadius: "2px",
              fontSize: "0.6rem",
              fontWeight: "bold",
            }}
          />
        </TableCell>
        <TableCell>
          <InputBase
            type="number"
            sx={{
              outline: "1px solid black ",
              marginLeft: "5px",
              width: "30px",
              height: "15px",
              borderRadius: "2px",
              fontSize: "0.6rem",
              fontWeight: "bold",
            }}
          />
        </TableCell>
        <TableCell>
          {" "}
          <InputBase
            type="number"
            sx={{
              outline: "1px solid black",
              marginLeft: "5px",
              width: "30px",
              height: "15px",
              borderRadius: "2px",
              fontSize: "0.6rem",
              fontWeight: "bold",
            }}
          />
        </TableCell>
        <TableCell
          align="center"
          sx={{ fontWeight: "bold", padding: 1, fontSize: "0.6rem" }}
        >
          {row.clc}
        </TableCell>
        <TableCell
          align="center"
          sx={{ fontWeight: "bold", padding: 1, fontSize: "0.6rem" }}
        >
          {row.nlc}
        </TableCell>
        <TableCell align="right" sx={{ color: color, fontSize: "0.6rem" }}>
          <Tooltip title="Delete">
            <i className="fa-solid fa-trash"></i>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={14}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "start",
                textAlign: "center",
                // border: "1px solid black",
              }}
            >
              <Box sx={{ borderRight: " 2px solid black", width: "8%" }}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    // border: "1px solid red",
                    fontSize: "0.8rem",
                  }}
                  gutterBottom
                  component="div"
                >
                  Weight
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 0.8,
                  justifyContent: "space-around",
                  alignItems: "center",
                  flexWrap: "wrap",
                  marginLeft: "4px",
                  padding: "4px",
                }}
              >
                <Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    {`Length ${" "}cm :`}
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>

                <Typography>
                  <Typography
                    sx={{
                      fontSize: "0.6rem",
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    {`Width ${" "}cm :`}{" "}
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
                <Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    {`Height ${" "}cm :`}
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
                <Typography>
                  <Typography
                    sx={{
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {`Volume Weight${" "}(cm):`}
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
                <Typography>
                  <Typography
                    sx={{
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {`Actual Weight ${" "}(gm):`}
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
                <Typography>
                  <Typography
                    sx={{
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {` Weight Compare${" "}(gm):`}
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
                <Typography>
                  <Typography
                    sx={{
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {` Total Weight${" "}(gm):`}
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
                <Typography>
                  <Typography
                    sx={{
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {` Weight ratio${" "}(%):`}
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
                <Typography>
                  <Typography
                    sx={{
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {` Extra Weight${" "}(gm):`}
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>

                <Typography>
                  <Typography
                    sx={{
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {` Final Weight${" "}(gm):`}
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
              </Box>
            </Box>
            <hr style={{}} />
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "start",
                textAlign: "center",
                // border: "1px solid black",
              }}
            >
              <Box sx={{ borderRight: " 2px solid black", width: "8%" }}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    // border: "1px solid red",
                    fontSize: "0.8rem",
                  }}
                  gutterBottom
                  component="div"
                >
                  Product
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 0.8,
                  justifyContent: "space-around",
                  alignItems: "center",
                  flexWrap: "wrap",
                  marginLeft: "4px",
                  padding: "4px",
                }}
              >
                <Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    Total USD:
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>

                <Typography>
                  <Typography
                    sx={{
                      fontSize: "0.6rem",
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    Payment Price:
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
                <Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    Landing for other value:
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
                <Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    SW charge:
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
                <Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    CD Total:
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
                <Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    Price ratio:
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
                <Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    Freight:
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
                <Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    GST value:
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
                <Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    Boe Price:
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
                <Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    Insurance:
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
                <Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    Basic duty value:
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>

                <Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    Late fee:
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
              </Box>
            </Box>
            <hr style={{}} />
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "start",
                textAlign: "center",
                // border: "1px solid black",
              }}
            >
              <Box sx={{ borderRight: " 2px solid black", width: "8%" }}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    // border: "1px solid red",
                    fontSize: "0.8rem",
                  }}
                  gutterBottom
                  component="div"
                >
                  Shipping
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 0.8,
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                  marginLeft: "4px",
                  padding: "4px",
                }}
              >
                <Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    Shipping Value:
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
                <Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    Shipping GST Value:
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
                <Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    Total Shipping:
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
              </Box>
            </Box>
            <hr style={{}} />
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "start",
                textAlign: "center",
                // border: "1px solid black",
              }}
            >
              <Box sx={{ borderRight: " 2px solid black", width: "8%" }}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    // border: "1px solid red",
                    fontSize: "0.8rem",
                  }}
                  gutterBottom
                  component="div"
                >
                  Other
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 0.8,
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                  marginLeft: "4px",
                  padding: "4px",
                }}
              >
                <Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    Regualar bill entry:
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
                <Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    Warehouse Charge:
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>

                <Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    Other Charge:
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
                <Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    Bank Charge:
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
                <Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    Total other Charge:
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
              </Box>
            </Box>
            <hr style={{}} />
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "start",
                textAlign: "center",
                // border: "1px solid black",
              }}
            >
              <Box sx={{ borderRight: " 2px solid black", width: "8%" }}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    // border: "1px solid red",
                    fontSize: "0.8rem",
                  }}
                  gutterBottom
                  component="div"
                >
                  Total
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 0.8,
                  justifyContent: "space-around",
                  alignItems: "center",
                  flexWrap: "wrap",
                  marginLeft: "4px",
                  padding: "4px",
                }}
              >
                <Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    GST Recover:
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
                <Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    Final Total Excel GST:
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
                <Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    Final Landing Cost Excel GST:
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
                <Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    Landing Cost(1 unit) Excel GST:
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
                <Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    Landing Cost (1 unit with GST):
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
                <Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    Final Total(Total CD + Total Shipping + Total Other Charge):
                  </Typography>
                  <InputBase
                    type="number"
                    sx={{
                      outline: "1px solid black ",
                      marginLeft: "5px",
                      width: "50px",
                      height: "15px",
                      borderRadius: "2px",
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
              </Box>
            </Box>
            <hr style={{}} />
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};

const headdata = [
  {
    sku: "IRS2304173948",
    product: "3K Carbon Fiber 1055 Propeller 10*5.5 pair of cw ccw for Drone",
    clc: " ₹0.00",
    nlc: " ₹0.00",
  },
];

const rows = headdata.map((data) => ({
  ...data,
}));

const infoDetail = [];

const Country = [
  { label: "India", key: "India" },
  { label: "United States", key: "USA" },
  { label: "Canada", key: "Canada" },
  { label: "Brazil", key: "Brazil" },
  { label: "France", key: "France" },
  { label: "Australia", key: "Australia" },
  { label: "Japan", key: "Japan" },
  { label: "Mexico", key: "Mexico" },
  { label: "China", key: "China" },
  { label: "Russia", key: "Russia" },
  { label: "Germany", key: "Germany" },
];

const NewCalcRishabh = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const { themeColor } = useSelector((state) => state.ui);
  const color = themeColor.sideBarColor1;
  const color2 = themeColor.sideBarColor2;

  const description1 = "Price Calculator";

  const [infoOpen, setInfoOpen] = useState(false);
  const handleClose1 = () => {
    setInfoOpen(!infoOpen);
  };
  const handleOpen1 = () => {
    setInfoOpen(true);
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
        }}
      >
        <DrawerHeader />
        <Header
          Name={"Price Calculator"}
          info={true}
          customOnClick={handleOpen1}
        />
        <Box
          sx={{
            display: "flex",
            width: "100%",
          }}
        >
          <Box sx={{ width: "70%", overflow: "auto", marginLeft: "10px" }}>
            <Box
              sx={{
                height: "6vh",
                display: "flex",
                justifyContent: "space-evenly",
                marginTop: "5px",
                boxShadow: "0px 0xp 6px black",
                alignItems: "center",
                flexDirection: "wrap",
                padding: "10px",
              }}
            >
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                size="small"
                options={Country}
                sx={{
                  width: 900,
                  borderRadius: "8px",
                  marginRight: "8px",
                  "& .MuiAutocomplete-endAdornment": {
                    display: "none",
                  },
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Search here.." />
                )}
              />
              <Button
                variant="outlined"
                sx={{
                  color: "white",
                  background: color,
                  "&:hover": {
                    color: "black",
                  },
                }}
              >
                Save
              </Button>
            </Box>

            <Box sx={{ height: "70vh", overflow: "auto" }}>
              <TableContainer
                component={Paper}
                sx={{ border: "1px solid black" }}
              >
                <Table aria-label="sticky">
                  <TableHead>
                    <TableRow sx={{ background: color }}>
                      <TableCell
                        sx={{ fontWeight: "bold", padding: 0 }}
                      ></TableCell>
                      <TableCell sx={{ fontWeight: "bold", padding: 0 }}>
                        <Typography
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "0.6rem",
                            paddingLeft: "10px",
                          }}
                        >
                          Sku
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: "bold", paddingy: 0, color: "white" }}
                      >
                        <Typography
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "0.6rem",
                            paddingLeft: "60px",
                          }}
                        >
                          {" "}
                          Product Name
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          paddingy: 0,
                          color: "white",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.6rem",
                            fontWeight: "bold",
                            paddingLeft: "6px",
                          }}
                        >
                          QYT:
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          paddingy: 0,
                          color: "white",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.6rem",
                            fontWeight: "bold",
                            paddingLeft: "5px",
                          }}
                        >
                          USD $:
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          paddingy: 0,
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        <Typography
                          sx={{ fontSize: "0.6rem", fontWeight: "bold" }}
                        >
                          RMB ¥:
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          paddingy: 0,
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        <Typography
                          sx={{ fontSize: "0.6rem", fontWeight: "bold" }}
                        >
                          BasicDuty%:
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          paddingy: 0,
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.6rem",
                            fontWeight: "bold",
                          }}
                        >
                          GST:
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: "bold", padding: 0, color: "white" }}
                      >
                        <Tooltip title="Current Landing Cost" arrow>
                          <Typography
                            sx={{
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "0.6rem",
                              cursor: "pointer",
                            }}
                          >
                            CLC
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: "bold", padding: 0, color: "white" }}
                      >
                        <Tooltip title="New Landing Cost" arrow>
                          <Typography
                            sx={{
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "0.6rem",
                              cursor: "pointer",
                            }}
                          >
                            NLC
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: "bold", padding: 0, color: "white" }}
                      >
                        <Typography
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "0.6rem",
                          }}
                        >
                          {" "}
                          Delete
                        </Typography>
                      </TableCell>

                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <Row key={row} row={row} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
          <RishabhCalc />
        </Box>

        <InfoDialogBox
          infoDetails={infoDetail}
          description={description1}
          open={infoOpen}
          close={handleClose1}
        />
      </Box>
    </>
  );
};

export default NewCalcRishabh;
