import React, { useState, useEffect } from 'react';
import {
  styled,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  TextareaAutosize,
  CircularProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import {
  useAddCustomerNumberMutation,
  useGetCustomerNumberQuery,
  useSendBulkMessagesWithPicMutation,
} from "../../../features/api/whatsAppApiSlice";
import Loading from "../../../components/Common/Loading";
import CustomMsgDialogbox from "./CustomMsgDialogbox";
import TemplateMessage from "./TemplateMessage";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

//File upload
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const BulkMessageTable = () => {
  const [open, setOpen] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [customerNumber, setCustomerNumber] = useState([]);

  const [input, setInput] = useState({ CustomerName: "", CustomerNumber: "" });
  const [rows, setRows] = useState([]);
  const [msgDialogbox, setMsgDialogbox] = useState(false);
  const [sendingType, setSendingType] = useState('');
  const [tempopen, setTempopen] = useState(false);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const { themeColor } = useSelector((state) => state.ui);
  const color = themeColor.sideBarColor1;

  //rtk Query
  const [addCustomer, { isLoading: addCustomerLoading }] =
    useAddCustomerNumberMutation();

  const [sendMsg, { isLoading: sendMsgLoading }] =
    useSendBulkMessagesWithPicMutation();
  const {
    data: getAllCustomers,
    refetch,
    isloading: getloading,
  } = useGetCustomerNumberQuery();

  // const handleFileUpload = (event) => {
  //   const file = event.target.files[0];
  //   setFileUploaded(true);

  //   setFile(file);
  // };

  const handleClickOpen = () => {
    navigate("/addCusotmerforMarketing");
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenMsgDialogbox = (type, name) => {
    setSendingType(type);
    setTitle(name);
    setMsgDialogbox(true);
  };

  const handleCloseMsgDialogbox = () => {
    setMsgDialogbox(false);
  };

  const handleTempopen = () => {
    setTempopen(true);
  };

  const handleTempclose = () => {
    setTempopen(false);
  };
  useEffect(() => {
    if (getAllCustomers?.message === 'Customer Successfully fetched') {
      const row = getAllCustomers?.data.map((item, index) => {
        return {
          ...item,
          id: item._id,
          sn: index + 1,
        };
      });

      setRows(row);
      refetch();
    }
  }, [getAllCustomers]);

  // const handleSubmit = async (event) => {
  //   try {
  //     const customerNumberRegex = /^\d{10}$/;
  //     if (!input.CustomerName || !input.CustomerNumber) {
  //       toast.error("Please fill Customer Name or Customer Number ");
  //     } else if (!customerNumberRegex.test(input.CustomerNumber)) {
  //       toast.error("Please Enter Correct Customer Number");
  //     } else {
  //       const info = {
  //         name: input.CustomerName,
  //         number: input.CustomerNumber,
  //       };
  //       const res = await addCustomer(info).unwrap();
  //       if (res.message !== "Customer Successfully Added") {
  //         return;
  //       }
  //       toast.success("Customer Successfully Added");
  //       setInput([]);
  //       handleClose();
  //       refetch();
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   setInput((prevInput) => ({
  //     ...prevInput,
  //     [name]: value,
  //   }));
  // };

  const handleSelectionChange = (selectionModel) => {
    if (!Array.isArray(selectionModel)) return;
    const limitedSelection = selectionModel.slice(0, 50);
    const uniqueSelection = [
      ...new Set(
        rows
          .filter((item) => limitedSelection.includes(item.id))
          .map((item) => item.CustomerNumber)
      ),
    ];

    setCustomerNumber(uniqueSelection);
  };

  //This is data grid data
  const columns = [
    { field: "sn", headerName: "ID", width: 90 },
    {
      field: "CustomerName",
      headerName: "Customer Name",
      width: 180,
      editable: true,
    },
    {
      field: "CompanyName",
      headerName: "Company Name",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      flex: 0.3,
      width: 210,
    },
    {
      field: "CustomerNumber",
      headerName: "Mobile No",
      width: 150,
      editable: true,
    },
    {
      field: "Address",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      flex: 0.3,
      headerName: "Address",
      width: 250,
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "space-around",
        }}
      >
        <Box
          sx={{
            width: "30%",
            marginTop: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyItems: "center",
            overflow: "hidden",
          }}
        >
          <Button
            variant="contained"
            onClick={handleClickOpen}
            sx={{ margin: "6px 0px 6px 0px ", background: color }}
          >
            Add Customer
          </Button>
          <Box
            sx={{
              marginTop: "1rem",
              border: "2px solid black",
              borderRadius: "2px",
              display: "flex",
            }}
          >
            <Button
              variant="outlined"
              sx={{
                margin: "0.6rem",
                backgroundColor: color,
                color: "white",
                "&:hover": {
                  color: "black",
                },
              }}
              onClick={() =>
                handleOpenMsgDialogbox("File", "Send Text Message With Media")
              }
            >
              Send Text Message With Media
            </Button>
            <Button
              variant="outlined"
              disabled
              sx={{
                margin: "0.6rem",
                backgroundColor: color,
                color: "white",
                "&:hover": {
                  color: "black",
                },
              }}
              onClick={() =>
                handleOpenMsgDialogbox("Text", "Send Text Message")
              }
            >
              Send Text Message
            </Button>
            <Button
              variant="outlined"
              disabled
              sx={{
                margin: "0.6rem",
                backgroundColor: color,
                color: "white",
                "&:hover": {
                  color: "black",
                },
              }}
              onClick={() => handleOpenMsgDialogbox("Link", "Send Link")}
            >
              Send Link
            </Button>
            <Button
              variant="outlined"
              disabled
              sx={{
                margin: "0.6rem",
                backgroundColor: color,
                color: "white",
                "&:hover": {
                  color: "black",
                },
              }}
              onClick={() => handleTempopen()}
            >
              Send Message Template
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              margin: "10px",
            }}
          ></Box>
        </Box>
        <Box sx={{ width: "60%", marginTop: "2rem" }}>
          <Box sx={{ height: "72vh", width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={getloading}
              rowHeight={50}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 50,
                  },
                },
              }}
              pageSizeOptions={[50]}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={handleSelectionChange}
            />
          </Box>
        </Box>
      </Box>
      {msgDialogbox && (
        <CustomMsgDialogbox
          msgDialogbox={msgDialogbox}
          handleCloseMsgDialogbox={handleCloseMsgDialogbox}
          sendingType={sendingType}
          title={title}
          customerNumber={customerNumber}
          setCustomerNumber={setCustomerNumber}
        />
      )}

      {tempopen && (
        <TemplateMessage
          tempopen={tempopen}
          handleTempclose={handleTempclose}
          title="Send Message Template"
        />
      )}
    </Box>
  );
};

export default BulkMessageTable;
