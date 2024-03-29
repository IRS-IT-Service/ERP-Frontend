import React, { useEffect } from "react";
import { Box, styled, Button, Dialog, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  useGetAllOpenedBoxQuery,
  useCreateBoxOpenMutation,
} from "../../features/api/barcodeApiSlice";
import { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { toast } from "react-toastify";
import Header from "../../components/Common/Header";
import { setHeader, setInfo } from "../../features/slice/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import InfoDialogBox from "../../components/Common/InfoDialogBox";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const infoDetail = [
  {
    name: "Barcode",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/search-product_ProductRemoval.png?updatedAt=1703144447246"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click the Barcode  to filter trough",
  },
  {
    name: "View Items",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortBrand_productList.png?updatedAt=1703135461416"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "Here You Can see List of Items in Box",
  },
  {
    name: "Close Box",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortcategory_productList.png?updatedAt=1703135461428"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "Here you Can see all items in Closed Box",
  },
];

const OpenBoxList = () => {
  const description =
    "This is the OpenBox List, We Can See Lsit of Open Box for Individual Item";
  /// rtk query
  const { data, isLoading, refetch } = useGetAllOpenedBoxQuery(null, {
    refetchOnMountOrArgChange: true,
  });
  const [createBoxOpenApi, { isLoading: boxOpenLoading }] =
    useCreateBoxOpenMutation();

  /// local state
  const [selectedItem, setSeletedItem] = useState(null);
  const [openItems, setOpenItems] = useState(false);
  const [closeBoxOpen, setCloseBoxOpen] = useState(false);
  const [chechkedItems, setCheckedItems] = useState([]);

  /// handlers
  const handleSubmit = async () => {
    try {
      if (selectedItem?.openItems?.length !== chechkedItems.length) {
        toast.error("Cant process Please return All items from the box");
        return;
      }
      const params = {
        sno: selectedItem.barcode,
        items: chechkedItems,
        type: "close",
      };

      const res = await createBoxOpenApi(params).unwrap();
      toast.success("Box Closed SuccessFully");
      setCloseBoxOpen(false);
      setCheckedItems([]);
      refetch();
    } catch (e) {
      console.log("Error at Box Open");
      console.log(e);
    }
  };

  /// columns
  const columns = [
    {
      field: "Sno",
      flex: 0.3,
      headerName: "Sno",
      minWidth: 70,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "SKU",
      flex: 0.3,
      headerName: "SKU",
      width: 130,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "name",
      flex: 0.3,
      headerName: "Name",
      minWidth: 300,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "barcode",
      flex: 0.3,
      headerName: "Barcode",
      minWidth: 230,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "date",
      flex: 0.3,
      headerName: "Date",
      minWidth: 90,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "action",
      flex: 0.3,
      headerName: "View Items",
      minWidth: 90,
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
    {
      field: "action2",
      flex: 0.3,
      headerName: "Close Box",
      minWidth: 90,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <Button
            onClick={() => {
              setSeletedItem(params.row);
              setCloseBoxOpen(true);
            }}
          >
            View
          </Button>
        );
      },
    },
  ];

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Opened Boxes`));
  }, []);

  /// Function

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      {/* <Header Name={"Opened Boxes"}/> */}
      <Box>
    
        <Box
          sx={{
            width: "100%",
            height: "83vh",
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
          {" "}
          <DataGrid
            rows={data?.data || []}
            columns={columns}
            rowHeight={40}
            pageSize={10}
          />
        </Box>
      </Box>
      <Dialog
        maxWidth="lg"
        open={openItems}
        onClose={() => {
          setOpenItems(false);
          setSeletedItem(null);
        }}
      >
        {selectedItem ? (
          <Box sx={{ padding: ".8rem" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                margin: ".5rem",
                alignItems: "start",
              }}
            >
              <p
                style={{
                  fontSize: "1rem",
                  color: "#fff",
                  backgroundColor: " #000",
                  // paddingX: '1rem',
                  padding: ".4rem",
                  border: "2px solid #3385ff",
                  borderRadius: ".4rem",
                  boxShadow: "-3px 3px 4px 0px #404040",
                  marginTop: ".5rem",
                }}
              >
                SKU: {selectedItem.SKU}{" "}
              </p>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#fff",
                  backgroundColor: " #000",
                  // paddingX: '1rem',
                  padding: ".4rem",
                  border: "2px solid #3385ff",
                  borderRadius: ".4rem",
                  boxShadow: "-3px 3px 4px 0px #404040",
                  marginTop: ".5rem",
                }}
              >
                Name: {selectedItem.name}{" "}
              </p>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#fff",
                  backgroundColor: " #000",
                  // paddingX: '1rem',
                  padding: ".4rem",
                  border: "2px solid #3385ff",
                  borderRadius: ".4rem",
                  boxShadow: "-3px 3px 4px 0px #404040",
                  marginTop: ".5rem",
                }}
              >
                barcode: {selectedItem.barcode}{" "}
              </p>
            </div>

            <Box
              sx={{
                marginY: "1rem",
                textAlign: "center",
                textTransform: "uppercase",
              }}
            >
              <h3>Items Taken From Box</h3>
            </Box>
            {selectedItem?.openItems?.map((item, index) => {
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
                    marginBottom: "1rem",
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
        <Box sx={{ padding: "1rem" }}>
          <Button
            sx={{ marginX: ".5rem", float: "right" }}
            variant="contained"
            color="error"
            onClick={() => {
              setOpenItems(false);
              setSeletedItem(null);
            }}
          >
            Close
          </Button>
        </Box>
      </Dialog>
      {/* Close box dialog */}
      <Dialog
        maxWidth="lg"
        open={closeBoxOpen}
        onClose={() => {
          setCloseBoxOpen(false);
          setSeletedItem(null);
          setCheckedItems([]);
        }}
      >
        {selectedItem ? (
          <Box sx={{ padding: ".9rem" }}>
            <h3
              style={{
                width: "30rem",
                backgroundColor: "#80bfff",
                padding: "1rem",
              }}
            >
              Closing box
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "start",
                flexDirection: "column",
                marginTop: "3rem",
                marginBottom: "3rem",
              }}
            >
              <p
                style={{
                  fontSize: "1rem",
                  color: "#fff",
                  backgroundColor: " #000",
                  // paddingX: '1rem',
                  padding: ".4rem",
                  border: "2px solid #3385ff",
                  borderRadius: ".4rem",
                  boxShadow: "-3px 3px 4px 0px #404040",
                  marginTop: ".5rem",
                }}
              >
                SKU: {selectedItem.SKU}{" "}
              </p>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#fff",
                  backgroundColor: " #000",
                  // paddingX: '1rem',
                  padding: ".4rem",
                  border: "2px solid #3385ff",
                  borderRadius: ".4rem",
                  boxShadow: "-3px 3px 4px 0px #404040",
                  marginTop: ".5rem",
                }}
              >
                Name: {selectedItem.name}{" "}
              </p>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#fff",
                  backgroundColor: " #000",
                  // paddingX: '1rem',
                  padding: ".4rem",
                  border: "2px solid #3385ff",
                  borderRadius: ".4rem",
                  boxShadow: "-3px 3px 4px 0px #404040",
                  marginTop: ".5rem",
                }}
              >
                barcode: {selectedItem.barcode}{" "}
              </p>
            </div>
            <p>
              Instruction: Please Select the item which were taken from box to
              Close the box
            </p>

            {selectedItem?.openItems?.map((item, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: ".666rem",
                    color: "#000",
                    backgroundColor: " #80bfff",
                    paddingX: "1rem",
                    border: "2px solid black",
                    borderRadius: ".4rem",
                    boxShadow: "-3px 3px 4px 0px #404040",
                    marginTop: "1rem",
                  }}
                >
                  <p style={{ fontSize: "1rem", fontWeight: "600", flex: "1" }}>
                    {item}
                  </p>
                  <Checkbox
                    checked={chechkedItems.includes(item)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;

                      if (isChecked) {
                        setCheckedItems((prev) => {
                          return [...prev, item];
                        });
                      } else {
                        setCheckedItems((prev) => {
                          return prev.filter((data) => item !== data);
                        });
                      }
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        ) : (
          ""
        )}
        <Box sx={{ display: "flex", justifyContent: "end", padding: ".7rem" }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {boxOpenLoading ? <CircularProgress /> : "Submit"}
          </Button>
          <Button
            color="error"
            sx={{ marginX: ".5rem" }}
            variant="contained"
            onClick={() => {
              setCloseBoxOpen(false);
              setSeletedItem(null);
              setCheckedItems([]);
            }}
          >
            Close
          </Button>
        </Box>
        
      </Dialog>
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
      />
    </Box>
  );
};

export default OpenBoxList;
