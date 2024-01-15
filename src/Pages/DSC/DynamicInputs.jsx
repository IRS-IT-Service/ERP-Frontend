import React from "react";
import { Box, Button, TextField, Typography, styled } from "@mui/material";
import {
  useCreateFormDynamicDataMutation,
  useGetFormDynamicDataQuery,
} from "../../features/api/dscApiSlice";
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

import Loading from "../../components/Common/Loading";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DynamicInputs = () => {
  /// initialization
  const navigate = useNavigate();
  /// local state
  const [modelName, setModelName] = useState("");

  /// RTK query
  const { data, isLoading, isFetching, refetch } = useGetFormDynamicDataQuery();
  const [addNewModelApi, { isLoading: newModelLoading }] =
    useCreateFormDynamicDataMutation();

  /// handle Submit

  const handleAddNewModel = async () => {
    try {
      if (!modelName) {
        toast.error("Please Enter Model Name First");
        return;
      }

      const res = await addNewModelApi({ modelName: modelName }).unwrap();
      toast.success("New Model added successfully");
      refetch();
    } catch (e) {
      console.log("Error at DSC add New model");
      console.log(e);
    }
  };

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "hidden" }}
    >
      <DrawerHeader />
      <Loading loading={isLoading || newModelLoading} />
      <Box>
        <Box>
          <TextField
            value={modelName}
            onChange={(e) => {
              setModelName(e.target.value);
            }}
            // placeholder="Enter New Drone Model"
          />
          <Button
            sx={{
              marginLeft: "5px",
              marginTop: "10px",
            }}
            variant="contained"
            onClick={handleAddNewModel}
          >
            Submit
          </Button>
        </Box>

        <Typography>Select Drone Model</Typography>
        <Box>
          {data?.data.map((item) => {
            return (
              <Button
                onClick={() => {
                  navigate(`/oneDynamicInput/${item.ModelId}`);
                }}
                key={item.ModelId}
              >
                {item.ModelName}
              </Button>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default DynamicInputs;
