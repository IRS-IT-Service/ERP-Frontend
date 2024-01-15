import React, { useEffect } from "react";
import { makeStyles } from "@mui/styles";
import {
  TextField,
  Box,
  Typography,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
} from "@mui/material";

const StyleSpan = styled("span")(({ theme }) => ({
  padding: "2px",
  border: "0.5px solid black",
  background: theme.palette.mode === "dark" ? "#fff" : "#fff",
  color: theme.palette.mode === "dark" ? "black" : "black",
  borderRadius: "5px",
}));

const StyleTextfeild = styled(TextField)(({ theme }) => ({
  background: theme.palette.mode === "dark" ? "black" : "#fff",
  color: theme.palette.mode === "dark" ? "black" : "black",
}));

const StyleTableCell = styled(TableCell)(({ theme }) => ({
  // background: theme.palette.mode === "dark" ? "black" : "#fff",
  color: theme.palette.mode === "dark" ? "#fff" : "#fff",
  padding: 3,
  fontSize: "12px",
}));

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function WeightTable({
  product,
  qty,
  volumeWeight,
  handleValueChange,
  dimensions,
  volumeWeightRatio,
  extraWeightIntoRatio,
  finalWeight,
  actualWeight,
  weightCompare,
  totalWeight,
  index,
  setDimensions,
  setActualWeight,
  WeightUnit,
  unit,
  id,
  isInitialCheck,
}) {
  const classes = useStyles();

  useEffect(() => {
    if (!id || isInitialCheck.current) {
      const dimensionsToUpdate = {
        L: product?.Dimensions?.length,
        W: product?.Dimensions?.width,
        H: product?.Dimensions?.height,
      };

      setDimensions({ ...dimensions, [product.SKU]: dimensionsToUpdate });
      const newActualWeight =
        WeightUnit === "kg"
          ? Math.ceil(product.Weight || 0) / 1000
          : Math.ceil(product.Weight || 0);
      setActualWeight({
        ...actualWeight,
        [product.SKU]: newActualWeight,
      });
    }
  }, [product]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        border: "1px solid #fff",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#b3d9ff",
          padding: ".6rem",
        }}
      >
        {/* <Box>
          <Typography sx={{ fontSize: ".6rem", fontWeight: "600" }}>
            Quantity
          </Typography>
          <input
            type="number"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={qty[product.SKU] ? qty[product.SKU] : ""}
            onChange={(e) => {
              handleValueChange("qty", product.SKU, +e.target.value);
            }}
          />
        </Box> */}
        <Box>
          <Typography sx={{ fontSize: ".6rem", fontWeight: "600" }}>
            Length <sup>{unit}</sup>
          </Typography>
          <input
            type="number"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={dimensions[product.SKU] ? dimensions[product.SKU]["L"] : ""}
            onChange={(e) => {
              handleValueChange("dimensions", product.SKU, e.target.value, "L");
            }}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".6rem", fontWeight: "600" }}>
            Width <sup>{unit}</sup>
          </Typography>
          <input
            type="number"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={dimensions[product.SKU] ? dimensions[product.SKU]["W"] : ""}
            onChange={(e) => {
              handleValueChange("dimensions", product.SKU, e.target.value, "W");
            }}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".6rem", fontWeight: "600" }}>
            Height <sup>{unit}</sup>
          </Typography>
          <input
            type="number"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={
              dimensions[product.SKU] && dimensions[product.SKU]["H"]
                ? dimensions[product.SKU]["H"]
                : ""
            }
            onChange={(e) => {
              handleValueChange("dimensions", product.SKU, e.target.value, "H");
            }}
          />
        </Box>

        <Box>
          <Typography sx={{ fontSize: ".6rem", fontWeight: "600" }}>
            Volume Weight <sup>({WeightUnit})</sup>
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={volumeWeight[product.SKU]?.toFixed(3) || null}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".6rem", fontWeight: "600" }}>
            Actual Weight <sup>({WeightUnit})</sup>
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={actualWeight[product.SKU] ? actualWeight[product.SKU] : ""}
            onChange={(e) => {
              handleValueChange("actualWeight", product.SKU, e.target.value);
            }}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".6rem", fontWeight: "600" }}>
            Weight compare <sup>({WeightUnit})</sup>
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={weightCompare[product.SKU]?.toFixed(3) || null}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".6rem", fontWeight: "600" }}>
            Total Weight <sup>({WeightUnit})</sup>
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={totalWeight[product.SKU]?.toFixed(3) || null}
            disabled={true}
          />
        </Box>

        <Box>
          <Typography sx={{ fontSize: ".6rem", fontWeight: "600" }}>
            Weight ratio <sup>({"%"})</sup>
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={volumeWeightRatio[product.SKU]?.toFixed(3)}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".6rem", fontWeight: "600" }}>
            Extra weight <sup>({WeightUnit})</sup>
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={extraWeightIntoRatio[product.SKU]?.toFixed(3)}
            disabled={true}
          />
        </Box>

        <Box>
          <Typography sx={{ fontSize: ".6rem", fontWeight: "600" }}>
            Final Weight <sup>({WeightUnit})</sup>
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={finalWeight[product.SKU]?.toFixed(3) || null}
            disabled={true}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default WeightTable;
