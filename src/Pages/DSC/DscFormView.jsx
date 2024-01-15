import React from 'react'
import {Box} from "@mui/material"
import ViewForm from './Components/ViewForm'

const DscFormView = () => {
  return (
    <Box
    component="main"
    sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
  >
    <ViewForm/>
  </Box>
  )
}

export default DscFormView