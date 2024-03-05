import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Box, styled } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { DataGrid } from "@mui/x-data-grid";
import { Transform, Translate } from "@mui/icons-material";

const rows = [
  { id: 1, Message: "Message 1", Image: "https://picsum.photos/200" },
  { id: 2, Message: "Message 2", Image: "https://picsum.photos/200" },
  { id: 3, Message: "Message 3", Image: "https://picsum.photos/200" },
  { id: 4, Message: "Message 4", Image: "https://picsum.photos/200" },
  { id: 5, Message: "Message 5", Image: "https://picsum.photos/200" },
  { id: 6, Message: "Message 6", Image: "https://picsum.photos/200" },
  { id: 7, Message: "Message 7", Image: "https://picsum.photos/200" },
  { id: 8, Message: "Message 8", Image: "https://picsum.photos/200" },
  { id: 9, Message: "Message 9", Image: "https://picsum.photos/200" },
];

const MessageDialogBox = ({ open, handleClose, title }) => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [click, setClick] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleAddMessage = () => {
    setShowTextArea(true);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFileUploaded(true);
    setFile(file);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "Message",
      headerName: "Message",
      width: 450,
      editable: false,
    },
    {
      field: "Image",
      headerName: "Image",
      width: 150,
      renderCell: (params) => {
        const index = params.row.id;
        return (
          <Box
            sx={{
              transition: "transform 0.3s ease-in-out",
              cursor: "pointer",
              transform: click === index ? "scale(1)" : "scale(0.3) ",
              zIndex: click === index ? 10 : "",
              position: click === index ? "absolute" : "",
              transitionProperty: "transform",
            }}
            onClick={() => {
              setClick(click === index ? null : index);
            }}
          >
            <img
              src={params.value}
              alt={`Image ${params.row.id}`}
              style={{ width: 100 }}
            />
          </Box>
        );
      },
    },
  ];

  // File upload
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="xl"
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{
          textAlign: "center",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <Button
            component="label"
            sx={{ width: "100%" }}
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            style={{
              backgroundColor: fileUploaded ? "green" : undefined,
            }}
          >
            {fileUploaded ? "File Uploaded" : "Upload File"}
            <input
              type="file"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <textarea
            style={{
              marginTop: "12px",
              width: "30vw",
              height: "20vh",
              resize: "none",
              paddingTop: 5,
              textIndent: "20px",
            }}
            value={message}
            placeholder="Enter your message"
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" sx={{ width: "20%" }}>
            Ok
          </Button>
          <Box sx={{ height: 300, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5]}
              checkboxSelection
              disableRowSelectionOnClick
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageDialogBox;
