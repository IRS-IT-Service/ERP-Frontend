import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateFormDynamicDataMutation,
  useGetFormDynamicDataQuery,
} from "../../../features/api/dscApiSlice";
import { toast } from "react-toastify";
import Header from "../../../components/Common/Header";
import InfoDialogBox from "../../../components/Common/InfoDialogBox";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../../features/slice/uiSlice";

const infoDetail = [
  {
    name: "Drone Brand",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortBrand_productList.png?updatedAt=1703135461416"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "You can Enter Drone Model and Save in Database",
  },
];

const DsCModelInput = () => {
  /// global state
  const { themeColor } = useSelector((state) => state.ui);
  const color = themeColor.sideBarColor1;

  const description = `The Barcode Generation function is  designed to create barcodes for
          products. This is accomplished by selecting the product, clicking on
          the "Generate" button, which will yield a new barcode. To obtain the
          barcode, click on "Download." If you wish to view the barcode, you can
          do so by clicking on "View."`;

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Add Drone Model`));
  }, []);

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
      setModelName("");
      refetch();
    } catch (e) {
      console.log("Error at DSC add New model");
      console.log(e);
    }
  };

  return (
    <>
      {/* <Header Name={"Add Drone Model"} info={true} customOnClick={handleOpen} /> */}

      {/* Dialog info Box */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "10px 0px",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: "8px",
            width: "35%",
            background: color,
            gap: "60px",
            borderRadius: "7px",
            border: "1px solid #F7FAFF",
            boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
          }}
        >
          <input
            style={{
              width: "70%",
              padding: "4px",
              border: "1px solid #F7FAFF",
              borderRadius: "7px",
              boxShadow: "-4px 4px 4px 1px rgba(0, 0, 0, 0.48)",
            }}
            type="text"
            placeholder="Enter New Drone Model"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
          ></input>
          <button
            style={{
              background: color,
              color: "#fff",
              cursor: "pointer",
              padding: "4px",
              border: "none",
            }}
            onClick={handleAddNewModel}
          >
            Submit
          </button>
        </div>
      </Box>
      <Box
        sx={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            padding: "8px",
            borderRadius: "7px",
            border: "1px solid #F7FAFF",
            boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
          }}
        >
          <h2>Select Drone Model</h2>
        </div>
      </Box>
      <Box
        sx={{
          margin: "25px 20px",
          padding: "10px",
          border: "1px solid",
          borderColor: color,
          borderRadius: "8px",
          boxShadow: "-4px 4px 4px 1px rgba(0, 0, 0, 0.48)",
          background: "#E8EFFF",
        }}
      >
        <Grid container spacing={0}>
          {data?.data?.map((item, index) => (
            <Grid item key={index} xs={3}>
              <div
                style={{
                  padding: "2px",
                  lineHeight: "30px",
                  margin: "10px",
                  border: "1px solid",
                  borderColor: color,
                  textAlign: "center",
                  borderRadius: "7px",
                  boxShadow: "-4px 4px 4px 1px rgba(0, 0, 0, 0.48)",
                  background: "#FEFFFF",
                  overflowY: "hidden",
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate(`/oneDynamicInput/${item.ModelId}`);
                }}
              >
                <span
                  key={item.ModelId}
                  style={{
                    color: color,
                  }}
                >
                  {item.ModelName}
                </span>
              </div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default DsCModelInput;
