import React from 'react'
import { Box,styled } from '@mui/material'
import CreateChat from './Components/CreateChat';

const DrawerHeader = styled("div")(({ theme }) => ({
    ...theme.mixins.toolbar,
  }));

function ChatMessage() {
  return (
    <Box
    component="main"
    sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "hidden" }}
  >
    <DrawerHeader />
    <CreateChat/>
  </Box>  )
}

export default ChatMessage