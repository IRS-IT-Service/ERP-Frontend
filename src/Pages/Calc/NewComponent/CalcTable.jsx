import React from "react";

const CalcTable = () => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow sx={{ background: themeColor.sideBarColor1 }}>
            <TableCell sx={{ fontWeight: "bold", padding: 0 }}></TableCell>
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
            <TableCell sx={{ fontWeight: "bold", paddingy: 0, color: "white" }}>
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
              <Typography sx={{ fontSize: "0.6rem", fontWeight: "bold" }}>
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
              <Typography sx={{ fontSize: "0.6rem", fontWeight: "bold" }}>
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
            <TableCell sx={{ fontWeight: "bold", padding: 0, color: "white" }}>
              <Typography
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.6rem",
                  cursor: "pointer",
                }}
              >
                <Tooltip title="Current Landing Cost">CLC</Tooltip>
              </Typography>
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", padding: 0, color: "white" }}>
              <Typography
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.6rem",
                  cursor: "pointer",
                }}
              >
                <Tooltip title="New Landing Cost">NLC</Tooltip>
              </Typography>
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", padding: 0, color: "white" }}>
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
          {/* {rows.map((row) => (
                    <Row key={row.name} row={row} />
                  ))} */}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CalcTable;
