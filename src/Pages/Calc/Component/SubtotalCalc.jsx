import React from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import {
  formatIndianPrice,
  formatUSDPrice,
} from "../../../commonFunctions/commonFunctions";

const SubtotalCalc = ({
  totalVolumeWeight,
  totalActualWeight,
  subTotalWeight,
  subTotalUsdPrice,
  subTotalIndianRateBoe,
  subTotalIndianRatePayment,
  subTotalFrieght,
  subTotalInsurance,
  subTotalAssesable,
  subTotalBasicDuty,
  subTotalGstRate,
  subCdTotal,
  subTotalShipping,
  subTotalOtherCharge,
  subFinalTotal,
  subFinalTotalExcludeGst,
  subFinalLandingCostExGst,
  subFinalGst,
  subLandingCostExGst,
  subLandingCost,
  subTotalFinalWeight,
}) => {
  return (
    <Box>
      {/* master flex Box  */}
      {/* <Typography
        variant="body2"
        textAlign="center"
        sx={{ fontSize: "20px", fontWeight: "bold" }}
      >
        Sub Total
      </Typography> */}

      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Box sx={{ flexBasis: "30%", paddingX: ".5rem" }}>
          <Box
            sx={{
              // border: '1px solid black',
              paddingBottom: "2px",
              display: "flex",
              flexDirection: "column",
              gap: ".5rem",
              border: "2px solid black",
            }}
          >
            <Typography
              variant="body2"
              textAlign="center"
              sx={{ fontSize: "12px", fontWeight: "bold" }}
            >
              Weight
            </Typography>

            <Grid item sx={{ background: "#eee", textAlign: "center" }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "12px",
                  backgroundColor: "#cce6ff",
                  padding: ".1rem",
                }}
              >
                Volume Weight
              </Typography>
              <hr />
              <Typography
                variant="body2"
                sx={{ fontSize: "11px", backgroundColor: "#b3d9ff" }}
              >
                {totalVolumeWeight?.toFixed(3)}
              </Typography>
            </Grid>
            <Grid item sx={{ background: "#eee", textAlign: "center" }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "12px",
                  backgroundColor: "#cce6ff",
                  padding: ".1rem",
                }}
              >
                Acutal Weight
              </Typography>
              <hr />
              <Typography
                variant="body2"
                sx={{ fontSize: "11px", backgroundColor: "#b3d9ff" }}
              >
                {totalActualWeight?.toFixed(3)}
              </Typography>
            </Grid>

            <Grid item sx={{ background: "#eee", textAlign: "center" }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "12px",
                  backgroundColor: "#cce6ff",
                  padding: ".1rem",
                }}
              >
                Final Weight
              </Typography>
              <hr />
              <Typography
                variant="body2"
                sx={{ fontSize: "11px", backgroundColor: "#b3d9ff" }}
              >
                {subTotalFinalWeight?.toFixed(3)}
              </Typography>
            </Grid>
          </Box>

          {/* remember this shippiing section */}

          <Box
            sx={{
              // border: '1px solid black',
              paddingBottom: "2px",
              marginTop: "3px",
              display: "flex",
              flexDirection: "column",
              border: "2px solid black",
            }}
          >
            <Typography
              variant="body2"
              textAlign="center"
              sx={{
                fontSize: "12px",
                fontWeight: "bold",
                // border: '2px solid green',
              }}
            >
              Shipping
            </Typography>
            <Box
              className="shipping"
              sx={{
                display: "flex",
                gap: "0.2rem",
                // justifyContent: 'center',
                // border: '2px solid green',
              }}
            >
              <Box
                sx={{ background: "#eee", textAlign: "center", width: "100%" }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "12px",
                    backgroundColor: "#cce6ff",
                    padding: ".1rem",
                  }}
                >
                  Shipping
                </Typography>
                <hr />
                <Typography
                  variant="body2"
                  sx={{ fontSize: "12px", backgroundColor: "#b3d9ff" }}
                >
                  {formatIndianPrice(subTotalShipping)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              // border: '1px solid black',
              paddingBottom: "2px",
              marginTop: "3px",
              border: "2px solid black",
            }}
          >
            <Typography
              variant="body2"
              textAlign="center"
              sx={{ fontSize: "12px", fontWeight: "bold" }}
            >
              Other Charges
            </Typography>
            <Grid
              container
              // xs={12}

              className="shipping"
              sx={{
                display: "flex",
                gap: "0.2rem",
                justifyContent: "center",
              }}
            >
              <Grid
                sx={{ background: "#eee", textAlign: "center", width: "100%" }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "12px",
                    backgroundColor: "#cce6ff",
                    padding: ".1rem",
                  }}
                >
                  Total OtherCharges
                </Typography>
                <hr />
                <Typography
                  variant="body2"
                  sx={{ fontSize: "12px", backgroundColor: "#b3d9ff" }}
                >
                  {formatIndianPrice(subTotalOtherCharge)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box sx={{ flexBasis: "70%", border: "2px solid black" }}>
          <Box
            sx={{
              // border: '1px solid black',
              paddingBottom: "2px",
              marginTop: "3px",
            }}
          >
            <Typography
              variant="body2"
              textAlign="center"
              sx={{ fontSize: "12px", fontWeight: "bold" }}
            >
              Price
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <Grid item sx={{ background: "#eee", textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "12px",
                    backgroundColor: "#cce6ff",
                    padding: ".1rem",
                  }}
                >
                  Total USD
                </Typography>
                <hr />
                <Typography
                  variant="body2"
                  sx={{ fontSize: "12px", backgroundColor: "#b3d9ff" }}
                >
                  {formatUSDPrice(subTotalUsdPrice)}
                </Typography>
              </Grid>

              <Grid sx={{ background: "#eee", textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "12px",
                    backgroundColor: "#cce6ff",
                    padding: ".1rem",
                  }}
                >
                  Total Boe
                </Typography>
                <hr />
                <Typography
                  variant="body2"
                  sx={{ fontSize: "12px", backgroundColor: "#b3d9ff" }}
                >
                  {formatIndianPrice(subTotalIndianRateBoe)}
                </Typography>
              </Grid>

              <Grid sx={{ background: "#eee", textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "12px",
                    backgroundColor: "#cce6ff",
                    padding: ".1rem",
                  }}
                >
                  Total Payment
                </Typography>
                <hr />
                <Typography
                  variant="body2"
                  sx={{ fontSize: "12px", backgroundColor: "#b3d9ff" }}
                >
                  {formatIndianPrice(subTotalIndianRatePayment)}
                </Typography>
              </Grid>

              <Grid sx={{ background: "#eee", textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "12px",
                    backgroundColor: "#cce6ff",
                    padding: ".1rem",
                  }}
                >
                  Total Frieght
                </Typography>
                <hr />
                <Typography
                  variant="body2"
                  sx={{ fontSize: "12px", backgroundColor: "#b3d9ff" }}
                >
                  {formatIndianPrice(subTotalFrieght)}
                </Typography>
              </Grid>
              <Grid sx={{ background: "#eee", textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "12px",
                    backgroundColor: "#cce6ff",
                    padding: ".1rem",
                  }}
                >
                  Total Insurance
                </Typography>
                <hr />
                <Typography
                  variant="body2"
                  sx={{ fontSize: "12px", backgroundColor: "#b3d9ff" }}
                >
                  {formatIndianPrice(subTotalInsurance)}
                </Typography>
              </Grid>

              <Grid sx={{ background: "#eee", textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "12px",
                    backgroundColor: "#cce6ff",
                    padding: ".1rem",
                  }}
                >
                  Total Assesable
                </Typography>
                <hr />
                <Typography
                  variant="body2"
                  sx={{ fontSize: "12px", backgroundColor: "#b3d9ff" }}
                >
                  {formatIndianPrice(subTotalAssesable)}
                </Typography>
              </Grid>

              <Grid sx={{ background: "#eee", textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "12px",
                    backgroundColor: "#cce6ff",
                    padding: ".1rem",
                  }}
                >
                  Total BasicDuty
                </Typography>
                <hr />
                <Typography
                  variant="body2"
                  sx={{ fontSize: "12px", backgroundColor: "#b3d9ff" }}
                >
                  {formatIndianPrice(subTotalBasicDuty)}
                </Typography>
              </Grid>

              <Grid sx={{ background: "#eee", textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "12px",
                    backgroundColor: "#cce6ff",
                    padding: ".1rem",
                  }}
                >
                  Total GST value
                </Typography>
                <hr />
                <Typography
                  variant="body2"
                  sx={{ fontSize: "12px", backgroundColor: "#b3d9ff" }}
                >
                  {formatIndianPrice(subTotalGstRate)}
                </Typography>
              </Grid>

              <Grid sx={{ background: "#eee", textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "12px",
                    backgroundColor: "#cce6ff",
                    padding: ".1rem",
                  }}
                >
                  Total CD value
                </Typography>
                <hr />
                <Typography
                  variant="body2"
                  sx={{ fontSize: "12px", backgroundColor: "#b3d9ff" }}
                >
                  {formatIndianPrice(subCdTotal)}
                </Typography>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          // border: '1px solid black',
          paddingBottom: "2px",
          marginTop: "3px",
          padding: ".3rem",
          border: "2px solid black",
        }}
      >
        <Typography
          variant="body2"
          textAlign="left"
          sx={{ fontSize: "12px", fontWeight: "bold" }}
        >
          Final Calculation
        </Typography>
        {/* Final-Calc */}

        <Box
          // className='shipping'
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: ".5rem",
          }}
        >
          {/* <Grid sx={{ background: '#eee', textAlign: 'center' }} order={6}>
            <Typography
              variant='body2'
              sx={{
                fontSize: '12px',
                backgroundColor: '#cce6ff',
                padding: '.1rem',
              }}
            >
              SubTotal finalTotal
            </Typography>
            <hr />
            <Typography
              variant='body2'
              sx={{ fontSize: '12px', backgroundColor: '#b3d9ff' }}
            >
              {formatIndianPrice(subFinalTotal)}
            </Typography>
          </Grid> */}

          {/* <Grid sx={{ background: '#eee', textAlign: 'center' }} order={2}>
            <Typography
              variant='body2'
              sx={{
                fontSize: '12px',
                backgroundColor: '#cce6ff',
                padding: '.1rem',
              }}
            >
              SubTotal FinalTotal Ex GST
            </Typography>
            <hr />
            <Typography
              variant='body2'
              sx={{ fontSize: '12px', backgroundColor: '#b3d9ff' }}
            >
              {formatIndianPrice(subFinalTotalExcludeGst)}
            </Typography>
          </Grid> */}

          <Grid sx={{ background: "#eee", textAlign: "center" }} order={1}>
            <Typography
              variant="body2"
              sx={{ fontSize: "12px", backgroundColor: "#cce6ff" }}
            >
              Final LandingCost Ex GST
            </Typography>
            <hr />
            <Typography
              variant="body2"
              sx={{ fontSize: "12px", backgroundColor: "#b3d9ff" }}
            >
              {formatIndianPrice(subFinalLandingCostExGst)}
            </Typography>
          </Grid>

          <Grid sx={{ background: "#eee", textAlign: "center" }} order={3}>
            <Typography
              variant="body2"
              sx={{ fontSize: "12px", backgroundColor: "#cce6ff" }}
            >
               GST Recover
            </Typography>
            <hr />
            <Typography
              variant="body2"
              sx={{ fontSize: "12px", backgroundColor: "#b3d9ff" }}
            >
              {formatIndianPrice(subFinalGst)}
            </Typography>
          </Grid>

          <Grid sx={{ background: "#eee", textAlign: "center" }} order={4}>
            <Typography
              variant="body2"
              sx={{ fontSize: "12px", backgroundColor: "#cce6ff" }}
            >
              LandingCost Ex GST
            </Typography>
            <hr />
            <Typography
              variant="body2"
              sx={{ fontSize: "12px", backgroundColor: "#b3d9ff" }}
            >
              {formatIndianPrice(subLandingCostExGst)}
            </Typography>
          </Grid>

          <Grid sx={{ background: "#eee", textAlign: "center" }} order={5}>
            <Typography
              variant="body2"
              sx={{ fontSize: "12px", backgroundColor: "#cce6ff" }}
            >
              LandingCost w GST
            </Typography>
            <hr />
            <Typography
              variant="body2"
              sx={{ fontSize: "12px", backgroundColor: "#b3d9ff" }}
            >
              {formatIndianPrice(subLandingCost)}
            </Typography>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default SubtotalCalc;
