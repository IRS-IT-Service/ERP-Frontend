import React, { useState } from "react";
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

const initialData = [
  {
    Sno: 1,
    SKU: "SKU123",
    ProductName: "Product A",
    Comp1: "",
    Comp2: "",
    Comp3: "",
  },
  {
    Sno: 2,
    SKU: "SKU456",
    ProductName: "Product B",
    Comp1: "",
    Comp2: "",
    Comp3: "",
  },
  {
    Sno: 3,
    SKU: "SKU789",
    ProductName: "Product C",
    Comp1: "",
    Comp2: "",
    Comp3: "",
  },
  {
    Sno: 4,
    SKU: "SKU789",
    ProductName: "Product C",
    Comp1: "",
    Comp2: "",
    Comp3: "",
  },
  {
    Sno: 5,
    SKU: "SKU789",
    ProductName: "Product C",
    Comp1: "",
    Comp2: "",
    Comp3: "",
  },
  {
    Sno: 6,
    SKU: "SKU789",
    ProductName: "Product C",
    Comp1: "",
    Comp2: "",
    Comp3: "",
  },
  {
    Sno: 7,
    SKU: "SKU789",
    ProductName: "Product C",
    Comp1: "",
    Comp2: "",
    Comp3: "",
  },
];

const CompetitorTable = () => {
  const [data, setData] = useState(initialData);

  const handleInputChange = (event, rowIndex, columnName) => {
    const { value } = event.target;
    const newData = [...data];
    newData[rowIndex][columnName] = value;
    setData(newData);
    console.log(newData);
  };

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
            {data.map((row, rowIndex) => (
              <TableRow key={row.Sno}>
                <TableCell>{row.Sno}</TableCell>
                <TableCell>{row.SKU}</TableCell>
                <TableCell>{row.ProductName}</TableCell>
                {[1, 2, 3].map((compNum) => (
                  <TableCell key={`Comp${compNum}`}>
                    <input
                      type="text"
                      value={row[`Comp${compNum}`]}
                      onChange={(event) =>
                        handleInputChange(event, rowIndex, `Comp${compNum}`)
                      }
                      style={{
                        width: "5vw",
                        height: "4vh",
                        border: "1px solid black",
                        borderRadius: "4px",
                        textAlign: "center",
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CompetitorTable;
