import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const Columns = ["Sno", "SKU", "ProductName", "Comp1", "Comp2", "Comp3"];
// const vendor = ['Hilda', 'Jinping', 'Putin'];
const data = [
  {
    Sno: 1,
    SKU: "SKU123",
    ProductName: "Product A",
    Comp1: "comp 1",
    Comp2: "comp 2",
    Comp3: "comp 3",
  },
  {
    Sno: 2,
    SKU: "SKU456",
    ProductName: "Product B",
    Comp1: "comp 1",
    Comp2: "comp 2",
    Comp3: "comp 3",
  },
  {
    Sno: 3,
    SKU: "SKU789",
    ProductName: "Product C",
    Comp1: "comp 1",
    Comp2: "comp 2",
    Comp3: "comp 3",
  },
];

const CompetitorTable = () => {
  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {Columns.map((column) => (
                <TableCell key={column}>{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.Sno}>
                <TableCell>{row.Sno}</TableCell>
                <TableCell>{row.SKU}</TableCell>
                <TableCell>{row.ProductName}</TableCell>
                <TableCell>{row.Comp1}</TableCell>
                <TableCell>{row.Comp2}</TableCell>
                <TableCell>{row.Comp3}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CompetitorTable;
