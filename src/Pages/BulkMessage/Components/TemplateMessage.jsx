import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from "@mui/material";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "messages",
    headerName: "Messages",
    width: 600,
    editable: true,
  },
];

const rows = [
  { id: 1, messages: "Hello, how are you?" },
  { id: 2, messages: "I'm doing well, thank you!" },
  { id: 3, messages: "What have you been up to lately?" },
  { id: 4, messages: "Not much, just working on some projects." },
  { id: 5, messages: "That sounds interesting. Anything exciting?" },
  { id: 6, messages: "Yes, I'm working on a new app idea." },
  { id: 7, messages: "Wow, that sounds cool. What's it about?" },
  { id: 8, messages: "It's a social networking platform for artists." },
  { id: 9, messages: "That sounds like it could be really useful." },
  {
    id: 10,
    messages: "Yeah, I hope so. It's still in the early stages though.",
  },
];

const TemplateMessage = ({ tempopen, handleTempclose, title }) => {
  return (
    <Box>
      <Dialog open={tempopen} onClose={handleTempclose}>
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            textAlign: "center",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <Typography sx={{ fontWeight: "bold" }}>{title}</Typography>
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              gap: "12px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box sx={{ height: 400, width: "100%", marginBottom: "10px" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                checkboxSelection
                disableSelectionOnClick
              />
            </Box>

            <Box sx={{ display: "flex" }}>
              <Button variant="outlined" sx={{ margin: "4px", width: "50%" }}>
                Send
              </Button>
              <Button
                variant="outlined"
                onClick={handleTempclose}
                sx={{ margin: "4px", width: "50%" }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TemplateMessage;
