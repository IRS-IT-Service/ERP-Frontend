import React from "react";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import {
  Button,
  Box,
  Table,
  TableBody,
  TableHead,
  TableContainer,
  TableRow,
  Paper,
  TableCell,
  Typography,
  Grid,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Container from "@mui/material/Container";

const CustomerForm = ({}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  const Parts = [
    {
      label: "Battery QTY",
      name: "batteryQTY",
    },
    {
      label: "Propeller QTY",
      name: "propellerQTY",
    },
    {
      label: "Memory Card",
      name: "memoryCard",
    },
  ];

  const droneOptions = [
    { value: "PHANTOM4", name: "Phantom 4" },
    { value: "PHANTOM4ADVANCED", name: "Phantom 4 Advanced" },
    { value: "PHANTOM4ADVANCEDPLUS", name: "Phantom 4 Advanced Plus" },
    { value: "PHANTOM4PRO", name: "Phantom 4 pro" },
    { value: "PHANTOM4PROPLUS", name: "Phantom 4 Pro Plus" },
    { value: "PHANTOM4PROBLACK", name: "Phantom 4 Pro Black" },
    { value: "FLOWERDROPPING", name: "Flower Dropping" },
    { value: "CUSTOMISEDDRONE", name: "Customised Drone" },
    { value: "MAVICPRO", name: "MAVIC PRO" },
    { value: "MAVICPROPLATINUM", name: "MAVIC PRO PLATINUM" },
    { value: "MAVIC2PRO", name: "MAVIC 2 PRO" },
    { value: "MAVIC2ZOOM", name: "MAVIC 2 ZOOM" },
    { value: "MAVIC2DUAL", name: "MAVIC 2 Dual" },
    { value: "SPARK", name: "SPARK" },
    { value: "MAVICAIR1", name: "MAVIC AIR 1" },
    { value: "MAVICMINI", name: "MAVIC MINI" },
    { value: "MAVICMINI2", name: "MAVIC MINI 2" },
    { value: "MAVICAIR2", name: "MAVIC AIR 2" },
    { value: "MAVICAIR2S", name: "MAVIC AIR 2S" },
    { value: "MAVICMINI3PRO", name: "MAVIC MINI 3 PRO" },
    { value: "MAVIC3", name: "MAVIC 3" },
    { value: "MAVIC3CLASSIC", name: "MAVIC 3 CLASSIC" },
  ];

  const PartsOption = [
    {
      name: "Mobile/Tablet",
    },
    {
      name: "Charging Hub",
    },
    {
      name: "Gimble Lock",
    },
    {
      name: "C-Type Data Cable",
    },
    {
      name: "Remote",
    },
    {
      name: "Normal Data Cable",
    },
    {
      name: "C-To-C Data Cable",
    },
    {
      name: "OTG Cable",
    },
    {
      name: "Remote Belt",
    },
    {
      name: "Carry Bag",
    },
  ];

  const ErrorCodeOptions = [
    { name: "Battery damaged" },
    { name: "Battery Connection Error" },
    { name: "Forward Vision Sensor Calibration Error" },
    { name: "Backward Vision Sensor Calibration Error" },
    { name: "Vision Sensor Calibration Error" },
    { name: "Downward Vision Sensor Calibration Error" },
    { name: "Error-202 Code Error" },
    { name: "Error-200 Code Error" },
    { name: "Error 0X8000" },
    { name: "IMU Calibration Error" },
    { name: "Camera Sensor Error" },
    { name: "Gimbal Motor Overload" },
    { name: "Gimbal Motor Protection" },
    { name: "Gimbal Joint Angle Sensor Initialization Error" },
    { name: "Navigation Error" },
    { name: "GPS Error" },
    { name: "USB Cable Connection Connected" },
    { name: "Gimbal Pitch Error" },
    { name: "Gimbal Gyroscope Error" },
    { name: "Air Encoder Error (0x800020)" },
    { name: "Left ESC Error" },
    { name: "Right ESC Error" },
    { name: "ESC Error" },
    { name: "Front Right ESC Error" },
    { name: "Front Left ESC Error" },
    { name: "Rear Right ESC Error" },
    { name: "Rear Left ESC Error" },
    { name: "Compass Error" },
    { name: "IMU Initializing Error" },
    { name: "SD Card Error" },
    { name: "Unknown Error Code 102 Cannot Take Off" },
    { name: "Video Not Visible" },
    { name: "Gallery Not Opened" },
    { name: "Update Required" },
    { name: "Update Failed" },
    { name: "Vision Sensor System Communication Error" },
    { name: "RC Error" },
    { name: "Gimbal Calibration Error" },
    { name: "Gimbal Stuck" },
    { name: "Power System Hardware Error" },
    { name: "ESC Status Error" },
    { name: "Unknown Error Code 102 Cannot Take Off" },
    { name: "Error Code 203 Code Error" },
  ];

  const PhyntomItems = [
    { name: "Upper Shell" },
    { name: "Lower Shell" },
    { name: "Landing Gear" },
    { name: "LED Cover" },
    { name: "Left Esc" },
    { name: "Right Esc" },
    { name: "Power Board" },
    { name: "Led" },
    { name: "Front Left Sensor" },
    { name: "Front Right Sensor" },
    { name: "Rear Left Sensor" },
    { name: "Rear Right Sensor" },
    { name: "Yaw Motor" },
    { name: "Roll Motor" },
    { name: "Pitch Motor" },
    { name: "Pitch Esc Board" },
    { name: "Yaw arm" },
    { name: "Roll Arm" },
    { name: "Camera Cover" },
    { name: "Camera back Cover" },
    { name: "Camera Front Lens" },
    { name: "Flex cable" },
    { name: "Flex cable set" },
    { name: "IMU Damping" },
    { name: "Memory card Board" },
    { name: "Yaw Arm Back Cover" },
    { name: "Yaw Motor Cover" },
    { name: "Yaw Motor Flex Cover" },
    { name: "Left Downward sensor" },
    { name: "Right Downward sensor" },
    { name: "Gimbal Damping Plate" },
    { name: "Propeller Hood (CW)" },
    { name: "CCD Camera module" },
    { name: "Battery Compartment" },
    { name: "Motor FL/FR/RR/RL" },
    { name: "GPS" },
    { name: "IMU Board" },
    { name: "Yaw Esc Board" },
    { name: "Camera Front cover" },
    { name: "Video board" },
    { name: "Ultrasonic Sensor" },
    { name: "Propeller Hood (CCW)" },
    { name: "Cooling Fan" },
    { name: "Gimbal Lock" },
    { name: "Gimbal Not Movement" },
    { name: "Camera Case" },
  ];

  const MavicItems = [
    { name: "Front Left Arm With Motor" },
    { name: "Front Right Arm With Motor" },
    { name: "Rear Left Arm With Motor" },
    { name: "Rear Right Arm With Motor" },
    { name: "Upper Shell" },
    { name: "Middle Shell" },
    { name: "Lower Shell" },
    { name: "Front shell Cover" },
    { name: "Gimbal ptz Cover" },
    { name: "Left compass cover" },
    { name: "Right Compass cover" },
    { name: "Esc Board" },
    { name: "Core board" },
    { name: "Wifi Board" },
    { name: "Downward sensor board" },
    { name: "Cooling Fan" },
    { name: "GPS Board" },
    { name: "Front Sensor Module" },
    { name: "Left Vision Sensor" },
    { name: "Right Vision Sensor" },
    { name: "Upward Vision sensor" },
    { name: "Rear Vsion Sensor" },
    { name: "Left/Right Sensor Comnucation board" },
    { name: "propeller Hood (CCW)" },
    { name: "Propeller Hood (CW)" },
    { name: "Gimbal Camera" },
    { name: "Gimbal Flex Cable" },
    { name: "Video Cable" },
    { name: "Gimbal Vibration Plate" },
    { name: "Gimbal Motor module" },
    { name: "Gimbal yaw cover" },
    { name: "Gimbal Roll cover" },
    { name: "Gimbal Pitch Cover" },
    { name: "Gimbal video Board" },
    { name: "Gimbal flat cable Set" },
    { name: "Gimbal Yaw arm module" },
    { name: "Gimbal Roll Arm" },
    { name: "Camera Cover" },
    { name: "Camera Back Cover" },
    { name: "Camera Front Glass" },
    { name: "Front Left ESC" },
    { name: "Front Right ESC" },
    { name: "Rear Left ESc" },
    { name: "Rear Right Esc" },
    { name: "Led Cover" },
    { name: "Gimbal Lock" },
    { name: "Lens Lock" },
  ];

  const mixModel = [...MavicItems, ...PhyntomItems];

  return (
    <Box
      sx={{
        width: "98vw",
        display: "flex",
        justifyContent: "center",
        marginTop: "10px",
        marginLeft: "10px",
      }}
    >
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Container maxWidth="md">
          <Typography
            align="center"
            sx={{
              backgroundImage:
                "linear-gradient(to bottom, #0068d9, #154fb0, #153789, #0d2164, #030c42)",
              color: "#fff",
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              borderRadius: "50px",
              padding: "5px",
              fontWeight: "bold",
            }}
          >
            Entry Form For Repairing
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              {/* Customer Name */}
              <Grid
                container
                spacing={1}
                marginTop={3}
                sx={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                  padding: "20px 5px 20px 0px",
                }}
              >
                <Grid item xs={12} sm={12}>
                  <Controller
                    name="companyName"
                    control={control}
                    defaultValue=""
                    //   rules={{ required: 'Customer name is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Company Name"
                        fullWidth
                        error={!!errors.customerName}
                        helperText={errors.customerName?.message}
                        variant="standard"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="customerName"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Customer name is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Customer Name"
                        fullWidth
                        error={!!errors.customerName}
                        helperText={errors.customerName?.message}
                        variant="standard"
                      />
                    )}
                  />
                </Grid>

                {/* Mobile Number */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="mobileNumber"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Mobile number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Invalid mobile number",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Mobile Number"
                        fullWidth
                        error={!!errors.mobileNumber}
                        helperText={errors.mobileNumber?.message}
                        variant="standard"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="whatsappNumber"
                    control={control}
                    defaultValue=""
                    rules={{
                      // required: 'Mobile number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Invalid whatsapp number",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Whatsapp Number"
                        fullWidth
                        error={!!errors.whatsappNumber}
                        helperText={errors.whatsappNumber?.message}
                        variant="standard"
                      />
                    )}
                  />
                </Grid>

                {/* Company Name */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="pinCode"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Pincode"
                        fullWidth
                        error={!!errors.pinCode}
                        helperText={errors.pinCode?.message}
                        variant="standard"
                      />
                    )}
                  />
                </Grid>

                {/* State */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="city"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="City"
                        fullWidth
                        error={!!errors.city}
                        helperText={errors.city?.message}
                        variant="standard"
                      />
                    )}
                  />
                </Grid>

                {/* City */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="state"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="State"
                        fullWidth
                        error={!!errors.state}
                        helperText={errors.state?.message}
                        variant="standard"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name="address"
                    control={control}
                    defaultValue=""
                    //   rules={{ required: 'Customer name is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Address"
                        fullWidth
                        error={!!errors.address}
                        helperText={errors.address?.message}
                        variant="standard"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name="model"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Model is required" }}
                    render={({ field }) => (
                      <>
                        <InputLabel id="model-label">
                          Select Drone Model
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="model-label"
                          label="Select Drone Model"
                          fullWidth
                          error={!!errors.model}
                          helperText={errors.model?.message}
                        >
                          {droneOptions.map((item, index) => (
                            <MenuItem key={index} value={item.value}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </>
                    )}
                  />
                </Grid>
              </Grid>
              {/* Checkboxes */}
              <Grid container rowGap={2} marginTop={2} gap={1}>
                <Grid
                  item
                  xs={12}
                  sm={5.8}
                  sx={{
                    boxShadow:
                      "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                  }}
                >
                  <Box
                    sx={{
                      backgroundImage:
                        "linear-gradient(to bottom, #0068d9, #154fb0, #153789, #0d2164, #030c42)",
                      color: "white",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "15px",
                        fontWeight: "Bold",
                        textAlign: "center",
                        padding: "2px",
                      }}
                    >
                      Hardware Damage Parts List
                    </Typography>{" "}
                  </Box>
                  <Box
                    sx={{
                      height: "40vh",
                      overflow: "auto",
                    }}
                  >
                    <Grid container>
                      {mixModel.map((option, rowIndex) => (
                        <Grid item xs={12} sm={6} key={rowIndex}>
                          <Controller
                            name={`Hardware_damage.${option.name}`}
                            control={control}
                            defaultValue={false}
                            render={({ field }) => (
                              <div>
                                <Checkbox
                                  {...field}
                                  value={option.name}
                                  color="primary"
                                />
                                <span
                                  style={{
                                    fontSize: "12px",
                                  }}
                                >
                                  {" "}
                                  {option.name}{" "}
                                </span>
                              </div>
                            )}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  sx={{
                    boxShadow:
                      "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                  }}
                >
                  <Box
                    sx={{
                      backgroundImage:
                        "linear-gradient(to bottom, #0068d9, #154fb0, #153789, #0d2164, #030c42)",
                      color: "white",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "15px",
                        fontWeight: "Bold",
                        textAlign: "center",
                        padding: "2px",
                      }}
                    >
                      Software warning & Error
                    </Typography>{" "}
                  </Box>
                  <Box
                    sx={{
                      height: "40vh",
                      overflow: "auto",
                    }}
                  >
                    <Grid container>
                      {ErrorCodeOptions.map((option, rowIndex) => (
                        <Grid item xs={12} sm={5} marginLeft={2} key={rowIndex}>
                          <FormControlLabel
                            control={
                              <Controller
                                name={`Software_warning.${option.name}`}
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <div>
                                    <Checkbox
                                      {...field}
                                      value={option.name}
                                      color="primary"
                                    />
                                    <span style={{ fontSize: "12px" }}>
                                      {option.name}
                                    </span>
                                  </div>
                                )}
                              />
                            }
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  marginTop={2}
                  padding={0}
                  sx={{
                    boxShadow:
                      "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                  }}
                >
                  <Box
                    sx={{
                      backgroundImage:
                        "linear-gradient(to bottom, #0068d9, #154fb0, #153789, #0d2164, #030c42)",
                      color: "white",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "15px",
                        fontWeight: "Bold",
                        textAlign: "center",
                        padding: "2px",
                      }}
                    >
                      Parts Received with Product
                    </Typography>{" "}
                  </Box>
                  <Box
                    sx={{
                      width: "100%",
                      height: "30vh",
                      overflow: "auto",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-evenly",
                      }}
                    >
                      {Parts.map((part) => (
                        <Box key={part.name}>
                          <Controller
                            name={part.name}
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <label style={{ fontWeight: "bold" }}>
                                {part.label}
                                <input
                                  {...field}
                                  style={{
                                    padding: "5px",
                                    width: "3rem",
                                    margin: "2px",
                                  }}
                                />
                                {part.label === "Memory Card" && (
                                  <span>GB</span>
                                )}
                              </label>
                            )}
                          />
                        </Box>
                      ))}
                    </Box>
                    <Grid container>
                      {PartsOption.map((option, rowIndex) => (
                        <Grid item xs={6} sm={4} key={rowIndex}>
                          <Controller
                            name={`Parts_received.${option.name}`}
                            control={control}
                            defaultValue={false}
                            render={({ field }) => (
                              <div>
                                <Checkbox
                                  {...field}
                                  value={option.name}
                                  color="primary"
                                />
                                {option.name}
                              </div>
                            )}
                          />
                        </Grid>
                      ))}

                      <Grid item xs={12} sm={12}>
                        <Controller
                          name={"Other_Items"}
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <textarea
                              {...field}
                              placeholder="Enter other received Items"
                              style={{
                                width: "98%",
                                marginLeft: 2,
                                height: "5rem",
                                resize: "none",
                              }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>

              {/* Dropdown menu for Models */}

              {/* Submit Button */}

              <Box
                display="flex"
                justifyContent="center"
                width="100%"
                margin={5}
              >
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Box>
            </Grid>
          </form>
        </Container>
      </Box>
    </Box>
  );
};

export default CustomerForm;
