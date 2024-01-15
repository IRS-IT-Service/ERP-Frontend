import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import {
  useGetOneFormDynamicDataQuery,
  useAddIssuesToModelMutation,
  useRemoveIssuesToModelMutation,
} from "../../features/api/dscApiSlice";
import { useParams } from "react-router-dom";
import { current } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import OneModelDetailInput from "./Components/OneModelDetailInput";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const OneDynamicInput = () => {
  /// initialization
  const id = useParams().id;

  /// local state
  const [inputCount, setInputCount] = useState([""]);
  const [openHardware, setOpenHardware] = useState(false);
  const [openSoftware, setOpenSoftware] = useState(false);

  /// rtk query

  const { data, isLoading, isFetching, refetch } =
    useGetOneFormDynamicDataQuery(id);

  const [addIssuesApi, { isLoading: addIssueLoading }] =
    useAddIssuesToModelMutation();

  const [removeIssuesApi, { isLoading: removeIssueLoading }] =
    useRemoveIssuesToModelMutation();

  const handleSubmit = async () => {
    try {
      let params = { modelId: id };
      if (openHardware) {
        params.type = "hardware";
        const currentHardware =
          data.data.Hardware.map((item) => item.Name) || [];
        console.log(currentHardware);

        const processedData = inputCount.filter(
          (item) => !currentHardware.includes(item) && item
        );

        params.issues = processedData;
      }
      if (openSoftware) {
        params.type = "software";
        const currentSoftware =
          data.data.Software.map((item) => item.Name) || [];

        const processedData = inputCount.filter(
          (item) => !currentSoftware.includes(item) && item
        );
        params.issues = processedData;
      }
      /// api call

      const res = await addIssuesApi(params).unwrap();
      toast.success("Successfully added issues");
      refetch();
      setOpenHardware(false);
      setOpenSoftware(false);
      setInputCount([""]);
    } catch (e) {
      console.log(e);
      console.log("Error at Model issues add");
    }
  };

  const handleRemoveIssue = async (name, type) => {
    try {
      let params = { modelId: id, type: type };

      if (type === "software") {
        const newSoftwareList = data.data.Software.filter(
          (item) => item.Name !== name
        );
        params.issues = newSoftwareList;
        console.log(newSoftwareList);
      }

      if (type === "hardware") {
        const newHardwareList = data.data.Hardware.filter(
          (item) => item.Name !== name
        );
        params.issues = newHardwareList;
        console.log(newHardwareList);
      }

      const res = await removeIssuesApi(params).unwrap();
      toast.success("Successfully added issues");
      refetch();
    } catch (e) {
      console.log(e);
      console.log("Error at Model issues add");
    }
  };

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <OneModelDetailInput />
    </Box>
  );
};

export default OneDynamicInput;
