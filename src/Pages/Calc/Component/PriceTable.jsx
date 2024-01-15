import React, { useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { TextField, Box, Typography, styled, TableCell } from "@mui/material";
import {
  formatIndianPrice,
  formatUSDPrice,
} from "../../../commonFunctions/commonFunctions";
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

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

function PriceTable({
  product,
  handleValueChange,
  usdPrice,
  totalUsdPrice,
  usdPriceRatio,
  indianRateBoe,
  indianRatePayment,
  frieght,
  insurance,
  landingForOtherValue,
  assesableValue,
  basicDutyPer,
  basicDutyValue,
  swCharge,
  gstPer,
  gstRate,
  lateFeeValue,
  cdTotal,
  setGstPer,
}) {
  useEffect(() => {
    if (gstPer) {
      return;
    }
    setGstPer({ ...gstPer, [product.SKU]: product.GST });
  }, [product]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",

        border: "1px solid #fff",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: ".3rem",
          backgroundColor: "#cce6ff",
          padding: ".5rem",
          placeItems: "center",
          justifyItems: "center",
        }}
      >
        {/* <Box>
          <Typography sx={{ fontWeight: "bold", fontSize: ".7rem" }}>
            USD Price
          </Typography>
          <input
            type="number"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={usdPrice[product.SKU] ? usdPrice[product.SKU] : ""}
            onChange={(e) => {
              handleValueChange("usdPrice", product.SKU, +e.target.value);
            }}
          />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: "bold", fontSize: ".7rem" }}>
            Basic Duty
          </Typography>
          <input
            type="number"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={basicDutyPer[product.SKU] ? basicDutyPer[product.SKU] : ""}
            onChange={(e) => {
              handleValueChange("basicDutyPer", product.SKU, +e.target.value);
            }}
          />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: "bold", fontSize: ".7rem" }}>
            GST
          </Typography>
          <input
            type="number"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={gstPer[product.SKU] ? gstPer[product.SKU] : ""}
            onChange={(e) => {
              handleValueChange("gstPer", product.SKU, +e.target.value);
            }}
          />
        </Box> */}
        <Box>
          <Typography sx={{ fontSize: ".7rem" }}>Total USD</Typography>
          <input
            type="text"
            disabled={true}
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatUSDPrice(totalUsdPrice[product.SKU])}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".7rem" }}>Price ratio</Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={usdPriceRatio[product.SKU]?.toFixed(2) || 0}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".7rem" }}>Boe Price</Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(indianRateBoe[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".7rem" }}>Payment Price</Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(indianRatePayment[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".7rem" }}>Freight</Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(frieght[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".7rem" }}>insurance</Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(insurance[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".7rem" }}>
            Landing for other value
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(landingForOtherValue[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".7rem" }}>Assessable Value</Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(assesableValue[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".7rem" }}>Basic duty value</Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(basicDutyValue[product.SKU])}
            disabled={true}
          />
        </Box>

        <Box>
          <Typography sx={{ fontSize: ".7rem" }}>SW charge</Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(swCharge[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".7rem" }}>GST value</Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(gstRate[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".7rem" }}>Late fee</Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(lateFeeValue[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".7rem" }}>CD Total</Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(cdTotal[product.SKU])}
            disabled={true}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default PriceTable;
