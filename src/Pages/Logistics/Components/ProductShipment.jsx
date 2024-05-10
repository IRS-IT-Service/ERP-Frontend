import { Box, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useGetAllShipmentQuery } from "../../../features/api/barcodeApiSlice";
import ProductsDial from "./ProductsDial";
import { formateDateAndTime } from "../../../commonFunctions/commonFunctions";
import Loading from "../../../components/Common/Loading";
import Dateformat from "../../../components/Common/Dateformat";
import Header from "../../../components/Common/Header";
import InfoDialogBox from "../../../components/Common/InfoDialogBox";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../../features/slice/uiSlice";
import StatusDial from "./statusDial";
import RemarkDial from "./remarkDial";

const infoDetail = [
  {
    name: "Search",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/salesQuery.png?updatedAt=1702899124072"
        height={"100%"}
        width={"100%"}
        style={
          {
            // width: '10vw',
            // height: '10vh'
          }
        }
      />
    ),
    instruction: `You Can Find Shipment History, When you enter Customer Name `,
  },

  {
    name: "Date",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/discountGUI.png?updatedAt=1702900067460"
        height={"100%"}
        width={"100%"}
        style={
          {
            // width: '10vw',
            // height: '10vh'
          }
        }
      />
    ),
    instruction: `Select From Date to To Date and Filter Shipment`,
  },

  {
    name: "Shipment Detail Tracking",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/descriptionModule.png?updatedAt=1702965703590"
        height={"100%"}
        width={"100%"}
        style={
          {
            // width: '10vw',
            // height: '10vh'
          }
        }
      />
    ),
    instruction: `This is a tracking details section where we see products Name, SKU, Brand, and Barcode`,
  },
];

const ProductShipment = () => {
  const description = `In this Shipment History Module, you can find the complete shipment history dispatched to the client. Clicking on the 'Reset Filter' button will reset the date.`;

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose1 = () => {
    dispatch(setInfo(false));
  };

  const handleCloseStatus = () => {
    setOpenDial(false);
  };

  useEffect(() => {
    dispatch(setHeader(`Shipment History`));
  }, []);
  //Global state
  const { themeColor } = useSelector((state) => state.ui);
  const color = themeColor.sideBarColor1;

  /// local state
  const [row, setRow] = useState([]);
  const [openDial, setOpenDial] = useState(false);
  const [barcodes, setBarcodes] = useState([]);
  const [search, setSearch] = useState("");
  const [Value, setValue] = useState({});
  const [statusOpen, setStatusOpen] = useState(false);
  const [date, setDate] = useState({
    From: "",
    To: Dateformat(new Date()),
  });
  const [searchDelay, setSearchDelay] = useState(false);
  const [remarkOpen, setRemarkOpen] = useState(false);
  const [remarkData, setremarkData] = useState({});

  /// function
  const calculatePreviousDate = (baseDate, daysToSubtract) => {
    const resultDate = new Date(baseDate);
    resultDate.setDate(baseDate.getDate() - daysToSubtract);
    return resultDate;
  };

  // rtk query call
  const {
    data: getAllShipment,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllShipmentQuery(
    `?customerName=${search}&from=${date.From}&to=${date.To}`,
    {
      skip: !date.From || searchDelay,
    }
  );

  const handleOpenStatus = (data, mark) => {
    console.log(mark);
    if (mark !== "Delivered") {
      setStatusOpen(true), setValue(data);
    }
  };

  /// useEffects

  useEffect(() => {
    setDate({
      ...date,
      From: Dateformat(calculatePreviousDate(new Date(), 30)),
    });
  }, []);

  useEffect(() => {
    if (getAllShipment && getAllShipment.data) {
      const rowss = getAllShipment.data.map((item, index) => ({
        id: index + 1,
        sno: index + 1,
        Customer: item.CustomerName,
        CustomerMobile: item.CustomerMobile || "N/A",
        Courier: item.CourierName,
        Status: item.status || "InTransit",
        Remark: item.Remark,
        POD: item.POD,
        Tracking: item.TrackingId,
        Product: item.Barcode,
        date: formateDateAndTime(item.createdAt),
      }));
      setRow(rowss);
    }
  }, [getAllShipment]);

  /// handlers

  const handleView = (Product) => {
    setBarcodes(Product);
    handleOpen();
  };

  const handleOpen = () => {
    setOpenDial(true);
  };

  const handleClose = () => {
    setOpenDial(false);
  };

  const handleResetFilter = () => {
    setSearch("");
    setDate({
      To: Dateformat(new Date()),
      From: Dateformat(calculatePreviousDate(new Date(), 30)),
    });
  };
  const handleOnchange = (e) => {
    const { name, value, type } = e.target;
    if (type === "date") {
      setDate({
        ...date,
        [name]: value,
      });
    } else {
      setSearchDelay(true);
      setTimeout(() => {
        setSearchDelay(false);
      }, 1500);
      setSearch(e.target.value);
    }
  };

  const handleOpenRemark = (param) => {
    setRemarkOpen(true), setremarkData(param);
  };

  /// columns
  const columns = [
    {
      field: "sno",
      headerName: "Sno",
      flex: 0.2,
      minWidth: 20,
      maxWidth: 50,
      editable: true,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Tracking",
      headerName: "TrackingId",
      flex: 0.2,
      minWidth: 120,
      editable: true,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Courier",
      headerName: "Courier-Name",
      flex: 0.2,
      minWidth: 100,
      editable: true,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Customer",
      headerName: "Customer-Name",
      flex: 0.2,
      minWidth: 100,
      editable: true,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "CustomerMobile",
      headerName: "Customer Number",
      flex: 0.2,
      minWidth: 100,
      editable: true,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 250,
      maxWidth: 250,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const data = params.row;

        const color = params.row.Status === "InTransit" ? "red" : "green";

        return (
          <div
            style={{
              color: color,
            }}
          >
            <Button
              sx={{ color: `${color}` }}
              onClick={() => handleOpenStatus(data, params.row.Status)}
            >
              {params.row.Status}
            </Button>
          </div>
        );
      },
    },
    {
      field: "remark",
      headerName: "Remark",
      minWidth: 250,
      maxWidth: 250,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const param = params.row;

        return (
          <div>
            <Button
              sx={{ color: `${color}` }}
              onClick={() => handleOpenRemark(param)}
              disabled={!param.Remark && !param.POD}
            >
              view
            </Button>
          </div>
        );
      },
    },
    {
      field: "date",
      headerName: "CreatedAt",
      flex: 0.2,
      minWidth: 100,
      editable: true,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Product",
      headerName: "Products",
      flex: 0.2,
      minWidth: 100,
      editable: true,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <div>
            <Button onClick={() => handleView(params.row.Product)}>
              Details
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 0,
        width: "100%",

        overflowY: "auto",
        mt: "66px",
      }}
    >
      {/* <Header
        Name={"Shipment History"}
        info={true}
        customOnClick={handleOpen1}
      /> */}

      {/* Dialog info Box */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose1}
      />

      <Loading loading={isLoading || isFetching} />

      <>
        <Box
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            marginTop: "2px",
          }}
        >
          <input
            placeholder="search by customer name"
            style={{
              width: "30rem",
              padding: "10px 25px",
              margin: "2px 0",
              borderRadius: "10px",
            }}
            name="search"
            onChange={handleOnchange}
            value={search}
          />
          <Box
            sx={{
              display: "flex",
              marginLeft: "8rem",
              alignItems: "center",
              gap: "10px",
              fontWeight: "bold",
            }}
          >
            <span>From</span>
            <input
              placeholder="Date"
              type="date"
              style={{
                width: "10rem",
                padding: "10px 25px",
                margin: "2px 0",
                borderRadius: "10px",
                fontSize: "15px",
              }}
              name="From"
              value={date.From}
              onChange={handleOnchange}
              max={date.To}
            />
            <span>To</span>
            <input
              placeholder="Date"
              type="date"
              style={{
                width: "10rem",
                padding: "10px 25px",
                margin: "2px 0",
                borderRadius: "10px",
                fontSize: "15px",
              }}
              name="To"
              value={date.To}
              onChange={handleOnchange}
            />
          </Box>
          <Button
            onClick={handleResetFilter}
            sx={{
              backgroundColor: "red",
              color: "white",
              "&:hover": {
                backgroundColor: "red", // Remove hover effect
              },
            }}
          >
            Reset filter
          </Button>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "72vh",
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
            position: "relative",
            overflow: "auto",
          }}
        >
          <DataGrid rows={row} columns={columns} />
        </Box>
      </>

      {openDial && (
        <ProductsDial open={openDial} close={handleClose} data={barcodes} />
      )}
      {statusOpen && (
        <StatusDial
          open={statusOpen}
          data={Value}
          setStatusOpen={setStatusOpen}
          refetch={refetch}
        />
      )}

      {remarkOpen && (
        <RemarkDial
          open={remarkOpen}
          data={remarkData}
          setRemarkOpen={setRemarkOpen}
        />
      )}
    </Box>
  );
};

export default ProductShipment;
