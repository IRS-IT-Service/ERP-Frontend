import React from "react";
import { Box, styled, Button, Dialog } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetAllBoxOpenHistoryQuery } from "../../features/api/barcodeApiSlice";
import { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import Header from "../../components/Common/Header";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const OpenBoxHistory = () => {
  /// rtk query
  const { data, isLoading, refetch } = useGetAllBoxOpenHistoryQuery();

  /// local state
  const [selectedItem, setSeletedItem] = useState(null);
  const [openItems, setOpenItems] = useState(false);

  /// columns
  const columns = [
    {
      field: "sno",
      headerName: "Sno",
      flex: 0.3,
      width: 70,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "SKU",
      headerName: "SKU",
      flex: 0.3,
      width: 130,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.3,
      minWidth: 300,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "barcodeNo",
      headerName: "Barcode",
      flex: 0.3,
      minWidth: 230,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0.3,
      minWidth: 90,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "status",
      headerName: "status",
      flex: 0.3,
      minWidth: 90,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        let color = params.row.type === "removed" ? "red" : "green";
        let text = params.row.type === "removed" ? "Opened" : "Closed";
        return <p style={{ color: color }}>{text}</p>;
      },
    },

    {
      field: "action",
      headerName: "View Items",
      minWidth: 90,
      flex: 0.3,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <Button
            onClick={() => {
              setSeletedItem(params.row);
              setOpenItems(true);
            }}
          >
            View
          </Button>
        );
      },
    },
  ];

  /// Function

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <Header Name={"Opened Box History"}/>
      <Box>


        <Box
          sx={{
            width: "100%",
            height: "82vh",
            "& .super-app-theme--header": {
              background: "#eee",
              color: "black",
              textAlign: "center",
            },
            "& .vertical-lines .MuiDataGrid-cell": {
              borderRight: "1px solid #e0e0e0",
            },
            "& .supercursor-app-theme--cell:hover": {
              background:
                "linear-gradient(180deg, #AA076B 26.71%, #61045F 99.36%)",
              color: "white",
              cursor: "pointer",
            },
            "& .MuiDataGrid-columnHeaderTitleContainer": {
              background: "#eee",
            },
          }}
        >
          <DataGrid
            rows={data?.data || []}
            columns={columns}
            rowHeight={40}
            pageSize={10}
          />
        </Box>
      </Box>
      <Dialog
        open={openItems}
        onClose={() => {
          setOpenItems(false);
          setSeletedItem(null);
        }}
      >
        {selectedItem ? (
          <Box sx={{}}>
            <h3>
              {selectedItem.type === "removed"
                ? "Previous Took Items"
                : "Items Added Back To The Box"}
            </h3>
            <div>
              <p>SKU: {selectedItem.SKU} </p>
              <p>Name: {selectedItem.name} </p>
              <p>barcode: {selectedItem.barcode} </p>
            </div>

            {selectedItem?.items?.map((item, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    fontSize: ".666rem",
                    color: "#000",
                    backgroundColor: " #80bfff",
                    paddingX: "1rem",
                    paddingY: ".4rem",
                    border: "2px solid black",
                    borderRadius: ".4rem",
                    boxShadow: "-3px 3px 4px 0px #404040",
                    marginTop: "1rem",
                  }}
                >
                  <p style={{ fontSize: "1rem", fontWeight: "600" }}>{item}</p>
                </Box>
              );
            })}
          </Box>
        ) : (
          ""
        )}
        <Box>
          <Button
            sx={{ backgroundColor: "red", marginX: ".5rem" }}
            variant="contained"
            onClick={() => {
              setOpenItems(false);
              setSeletedItem(null);
            }}
          >
            Close
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default OpenBoxHistory;
