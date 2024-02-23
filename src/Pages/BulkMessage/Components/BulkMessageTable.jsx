import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import {
  useAddCustomerNumberMutation,
  useGetCustomerNumberQuery,
  useSendBulkMessagesWithPicMutation,
} from "../../../features/api/whatsAppApiSlice";
import Loading from "../../../components/Common/Loading";
import CustomMsgDialogbox from "./CustomMsgDialogbox";
import TemplateMessage from "./TemplateMessage";

//File upload
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const BulkMessageTable = () => {
  const [open, setOpen] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [customerNumber, setCustomerNumber] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState("");
  const [input, setInput] = useState({ CustomerName: "", CustomerNumber: "" });
  const [rows, setRows] = useState([]);
  const [msgDialogbox, setMsgDialogbox] = useState(false);
  const [sendingType, setSendingType] = useState("");
  const [tempopen, setTempopen] = useState(false);
  const [title, setTitle] = useState("");

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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFileUploaded(true);
    setFile(file);
  };

  const handleClickOpen = () => {
    setOpen(true);
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
    if (getAllCustomers?.message === "Customer Successfully fetched") {
      const row = getAllCustomers?.data.map((item, index) => {
        return {
          ...item,
          id: item._id,
          sn: index + 1,
        };
      });

      setRows(row);
    }
  }, [getAllCustomers]);

  // const handleSend = async () => {
  //   try {
  //     const formData = new FormData();

  //     formData.append("contacts", JSON.stringify(customerNumber)),
  //       formData.append("message", message),
  //       formData.append("file", file);

  //     const res = await sendMsg(formData).unwrap();
  //     if (!res.status) {
  //       return;
  //     }
  //     toast.success("Message successfully send!");
  //     setFileUploaded(false);
  //     setFile("");
  //     setMessage("");
  //     refetch();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const handleSubmit = async (event) => {
    try {
      const customerNumberRegex = /^\d{10}$/;
      if (!input.CustomerName || !input.CustomerNumber) {
        toast.error("Please fill Customer Name or Customer Number ");
      } else if (!customerNumberRegex.test(input.CustomerNumber)) {
        toast.error("Please Enter Correct Customer Number");
      } else {
        const info = {
          name: input.CustomerName,
          number: input.CustomerNumber,
        };
        const res = await addCustomer(info).unwrap();
        if (res.message !== "Customer Successfully Added") {
          return;
        }
        toast.success("Customer Successfully Added");
        setInput([]);
        handleClose();
        refetch();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

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
      width: 150,
      editable: true,
    },
    {
      field: "CustomerNumber",
      headerName: "Customer Number",
      width: 150,
      editable: true,
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
            variant="outlined"
            onClick={handleClickOpen}
            sx={{ margin: "6px 0px 6px 0px " }}
          >
            Add Customer
          </Button>
          {/* <textarea
            style={{
              width: "100%",
              height: "400px",

              resize: "none",
              paddingTop: 5,
              textIndent: "20px",
            }}
            value={message}
            minRows={8}
            placeholder="Enter your message"
            aria-label="maximum height"
            onChange={(e) => setMessage(e.target.value)}
          /> */}
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
                backgroundColor: "blue",
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
              sx={{
                margin: "0.6rem",
                backgroundColor: "blue",
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
              sx={{
                margin: "0.6rem",
                backgroundColor: "blue",
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
              sx={{
                margin: "0.6rem",
                backgroundColor: "blue",
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

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle
              id="alert-dialog-title"
              sx={{
                textAlign: "center",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <Typography sx={{ fontWeight: "bold" }}>Add Customer</Typography>
            </DialogTitle>

            <DialogContent>
              <Box
                sx={{
                  gap: "12px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <TextField
                    label="Customer Name"
                    variant="outlined"
                    sx={{ width: "100%", marginTop: "12px" }}
                    name="CustomerName"
                    value={input.CustomerName}
                    onChange={handleInputChange}
                  />
                  <TextField
                    label="Customer Number"
                    variant="outlined"
                    sx={{ width: "100%" }}
                    name="CustomerNumber"
                    value={input.CustomerNumber}
                    onChange={handleInputChange}
                    type="number"
                  />

                  <Button onClick={handleSubmit} variant="outlined">
                    {addCustomerLoading ? <CircularProgress /> : "Add"}
                  </Button>
                  <Button
                    onClick={handleClose}
                    variant="outlined"
                    sx={{ fontWeight: "bold" }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions></DialogActions>
          </Dialog>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              margin: "10px",
            }}
          >
            {/* <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              style={{ backgroundColor: fileUploaded ? "green" : undefined }}
            >
              {fileUploaded ? "File Uploaded" : "Upload File"}
              <VisuallyHiddenInput type="file" onChange={handleFileUpload} />
            </Button> */}

            {/* 
            //send buttton  */}

            {/* <Button
              variant="outlined"
              sx={{ margin: "10px" }}
              onClick={() => handleSend()}
            >
              {sendMsgLoading ? <CircularProgress size={30} /> : "send"}
            </Button> */}
          </Box>
        </Box>
        <Box sx={{ width: "35%", marginTop: "2rem" }}>
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
