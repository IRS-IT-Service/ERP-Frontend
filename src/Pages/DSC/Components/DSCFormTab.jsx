import React from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Autocomplete,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const DSCFormTab = ({
  softwareIssue,
  hardwareIssue,
  setOpen,
  setForm,
  data,
  handelSelectedChange,
  handleChange,
  part,
  setPart,
  form,
  partsQty,
  setPartsQty,
}) => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 0,
        width: "100%",
        overflowY: "auto",
      }}
    >
      {/* main Box For tab */}
      <Box sx={{ minHeight: "87vh", maxWidth: "100vw" }}>
        {/* this is the box for customer detail */}
        <Box
          sx={{
            maxHeight: "30%",
            border: "2px solid #708BFF",
            margin: "1em",
            padding: "1em",
            borderRadius: "0.5em",
            boxShadow: "-0.25em 0.25em 0.25em 0 rgba(0, 0, 0, 0.4)",
          }}
        >
          {/* first row */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div
              style={{
                padding: "0.25em 0.40em",
                background: "#495FFB",
                width: "32%",
                border: "1px solid #fff",
                borderRadius: "0.5em",
                boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
              }}
            >
              <h4 style={{ color: "white" }}>Customer Name</h4>
              <input
                style={{
                  width: "100%",
                  padding: "0.5em",
                  border: "1px solid #fff",
                  borderRadius: "0.25em",
                  boxShadow: "-0.25em 0.25em 0.25em 0 rgba(0, 0, 0, 0.4)",
                  fontSize: "17px",
                }}
                value={form.CustomerName}
                onChange={(e) => {
                  handleChange(e.target.value, "CustomerName");
                }}
              ></input>
            </div>
            <div
              style={{
                padding: "0.25em 0.40em",
                background: "#495FFB",
                width: "32%",
                border: "1px solid #fff",
                borderRadius: "0.5em",
                boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
              }}
            >
              <h4 style={{ color: "white" }}>Company Name</h4>
              <input
                style={{
                  width: "100%",
                  padding: "0.5em",
                  border: "1px solid #fff",
                  borderRadius: "0.25em",
                  boxShadow: "-0.25em 0.25em 0.25em 0 rgba(0, 0, 0, 0.4)",
                  fontSize: "17px",
                }}
                value={form.CompanyName}
                onChange={(e) => {
                  handleChange(e.target.value, "CompanyName");
                }}
              ></input>
            </div>
            <div
              style={{
                padding: "0.25em 0.40em",
                background: "#495FFB",
                width: "32%",
                border: "1px solid #fff",
                borderRadius: "0.5em",
                boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
              }}
            >
              <h4 style={{ color: "white" }}>Number</h4>
              <input
                style={{
                  width: "100%",
                  padding: "0.5em",
                  border: "1px solid #fff",
                  borderRadius: "0.25em",
                  boxShadow: "-0.25em 0.25em 0.25em 0 rgba(0, 0, 0, 0.4)",
                  fontSize: "17px",
                }}
                value={form.MobileNo}
                type="number"
                onChange={(e) => {
                  handleChange(e.target.value, "MobileNo");
                }}
              ></input>
            </div>
          </div>
          {/* second row */}
          <div
            style={{
              display: "flex",
              marginTop: "0.5em",
              justifyContent: "space-between",
              gap: "0.25em",
            }}
          >
            <div
              style={{
                padding: "0.25em 0.40em",
                background: "#495FFB",
                width: "32%",
                border: "1px solid #fff",
                borderRadius: "0.5em",
                boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
              }}
            >
              <h4 style={{ color: "white" }}>Pincode</h4>
              <input
                style={{
                  width: "100%",
                  padding: "0.5em",
                  border: "1px solid #fff",
                  borderRadius: "0.25em",
                  boxShadow: "-0.25em 0.25em 0.25em 0 rgba(0, 0, 0, 0.4)",
                  fontSize: "17px",
                }}
                value={form.pincode}
                onChange={(e) => {
                  handleChange(e.target.value, "pincode");
                }}
              ></input>
            </div>
            <div
              style={{
                padding: "0.25em 0.40em",
                background: "#495FFB",
                width: "32%",
                border: "1px solid #fff",
                borderRadius: "0.5em",
                boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
              }}
            >
              <h4 style={{ color: "white" }}>City</h4>
              <input
                style={{
                  width: "100%",
                  padding: "0.5em",
                  border: "1px solid #fff",
                  borderRadius: "0.25em",
                  boxShadow: "-0.25em 0.25em 0.25em 0 rgba(0, 0, 0, 0.4)",
                  fontSize: "17px",
                }}
                value={form.city}
                onChange={(e) => {
                  handleChange(e.target.value, "city");
                }}
              ></input>
            </div>
            <div
              style={{
                padding: "0.25em 0.40em",
                background: "#495FFB",
                width: "32%",
                border: "1px solid #fff",
                borderRadius: "0.5em",
                boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
              }}
            >
              <h4 style={{ color: "white" }}>State</h4>
              <input
                style={{
                  width: "100%",
                  padding: "0.5em",
                  border: "1px solid #fff",
                  borderRadius: "0.25em",
                  boxShadow: "-0.25em 0.25em 0.25em 0 rgba(0, 0, 0, 0.4)",
                  fontSize: "17px",
                }}
                value={form.state}
                onChange={(e) => {
                  handleChange(e.target.value, "state");
                }}
              ></input>
            </div>
          </div>
          {/* third row */}
          <div style={{ marginTop: "0.5em" }}>
            <div
              style={{
                padding: "0.25em 0.40em",
                background: "#495FFB",
                width: "100%",
                border: "1px solid #fff",
                borderRadius: "0.5em",
                boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
              }}
            >
              <h4 style={{ color: "white" }}>Address</h4>
              <input
                style={{
                  width: "100%",
                  padding: "0.5em",
                  border: "1px solid #fff",
                  borderRadius: "0.25em",
                  boxShadow: "-0.25em 0.25em 0.25em 0 rgba(0, 0, 0, 0.4)",
                  fontSize: "17px",
                }}
                type="text"
                value={form.address}
                onChange={(e) => {
                  handleChange(e.target.value, "address");
                }}
              ></input>
            </div>
          </div>
        </Box>
        {/* this is the box for select drone model */}
        <Box
          sx={{
            border: "2px solid #708BFF",
            margin: "1em",
            padding: "1em",
            borderRadius: "0.5em",
            boxShadow: "-0.25em 0.25em 0.25em 0 rgba(0, 0, 0, 0.4)",
            background: "#495FFB",
            maxHeight: "10%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4 style={{ color: "white", marginLeft: "3em" }}>Select</h4>
            <Autocomplete
              style={{
                width: "75%",
                background: "white",
                // padding: "0.5em",
                border: "1px solid #fff",
                borderRadius: "0.25em",
                boxShadow: "-0.25em 0.25em 0.25em 0 rgba(0, 0, 0, 0.4)",
              }}
              options={data?.data || []}
              getOptionLabel={(option) => option.ModelName}
              onChange={handelSelectedChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select"
                  onChange={(e) => {
                    console.log(e.target.value);
                  }}
                  size="small"
                />
              )}
            />
          </div>
        </Box>
        {/* this is the box for hardware and software entry  */}
        <Box sx={{ display: "flex", minHeight: "40vh" }}>
          {/* hardware box */}
          <Box
            sx={{
              border: "2px solid #708BFF",
              margin: ".15em 1em",
              padding: ".25em",
              borderRadius: "0.5em",
              boxShadow: "-0.25em 0.25em 0.25em 0 rgba(0, 0, 0, 0.4)",
              width: "50%",
              background: "#E8F0FF",
            }}
          >
            <div
              style={{
                textAlign: "center",
                color: "white",
                background: "#495FFB",
                padding: "0.5em",
                border: "1px solid #fff",
                borderRadius: "5px",
                boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
              }}
            >
              <h4>Hardware Damage Part List</h4>
            </div>
            <div>
              <Grid container sx={{ overflowY: "scroll", height: "35vh" }}>
                {hardwareIssue?.map((item, index) => (
                  <Grid item key={index} xs={12}>
                    <div
                    //   style={{
                    //     padding: "2px",
                    //     paddingLeft: "10px",
                    //     display: "flex",
                    //     gap: "8px",
                    //     alignItems: "center",
                    //     lineHeight: "20px",
                    //   }}
                    >
                      <FormControlLabel
                        label={item}
                        control={
                          <Checkbox
                            checked={form.hardwareIssues.includes(item)}
                            onChange={(event) => {
                              let currentHardwareIssues = [
                                ...form.hardwareIssues,
                              ];

                              if (event.target.checked) {
                                currentHardwareIssues.push(item);
                                setForm((prev) => {
                                  return {
                                    ...prev,
                                    hardwareIssues: currentHardwareIssues,
                                  };
                                });
                              } else {
                                const filterArray =
                                  currentHardwareIssues.filter(
                                    (data) => data !== item
                                  );

                                setForm((prev) => {
                                  return {
                                    ...prev,
                                    hardwareIssues: filterArray,
                                  };
                                });
                              }
                            }}
                          />
                        }
                      />
                    </div>
                  </Grid>
                ))}
              </Grid>
            </div>
          </Box>
          {/* software box */}
          <Box
            sx={{
              border: "2px solid #708BFF",
              margin: ".15em 1em",
              padding: ".25em",
              borderRadius: "0.5em",
              boxShadow: "-0.25em 0.25em 0.25em 0 rgba(0, 0, 0, 0.4)",
              width: "50%",
              background: "#E8F0FF",
            }}
          >
            <div
              style={{
                textAlign: "center",
                color: "white",
                background: "#495FFB",
                padding: "0.5em",
                border: "1px solid #fff",
                borderRadius: "5px",
                boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
              }}
            >
              <h4>Software Damage Part List</h4>
            </div>
            <Grid container sx={{ overflowY: "scroll", height: "35vh" }}>
              {softwareIssue?.map((item, index) => (
                <Grid item key={index} xs={12}>
                  <div
                  // style={{
                  //   padding: "2px",
                  //   paddingLeft: "10px",
                  //   display: "flex",
                  //   gap: "8px",
                  //   alignItems: "center",
                  //   lineHeight: "20px",
                  // }}
                  >
                    <FormControlLabel
                      label={item}
                      control={
                        <Checkbox
                          checked={form.softwareIssues.includes(item)}
                          onChange={(event) => {
                            let currentSoftwareIssues = [
                              ...form.softwareIssues,
                            ];

                            if (event.target.checked) {
                              currentSoftwareIssues.push(item);
                              setForm((prev) => {
                                return {
                                  ...prev,
                                  softwareIssues: currentSoftwareIssues,
                                };
                              });
                            } else {
                              const filterArray = currentSoftwareIssues.filter(
                                (data) => data !== item
                              );

                              setForm((prev) => {
                                return {
                                  ...prev,
                                  softwareIssues: filterArray,
                                };
                              });
                            }
                          }}
                        />
                      }
                    />
                  </div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
        {/* this is the box of return products */}

        <Box
          sx={{
            border: "2px solid #708BFF",
            margin: ".25em 1em",
            padding: ".25em",
            borderRadius: "0.5em",
            boxShadow: "-0.25em 0.25em 0.25em 0 rgba(0, 0, 0, 0.4)",
            //   background: "#495FFB",
            minHeight: "16vh",
          }}
        >
          <div
            style={{
              textAlign: "center",
              color: "white",
              background: "#495FFB",
              padding: "0.5em",
              border: "1px solid #fff",
              borderRadius: "5px",
              boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
            }}
          >
            <h4>Parts Received With Products</h4>
          </div>
          {/* items */}
          <Grid container sx={{ height: "15vh", overflowY: "scroll" }}>
            {part?.map((item, index) => (
              <Grid item key={index} xs={4}>
                <div
                // style={{
                //   padding: "2px",
                //   display: "flex",
                //   gap: "8px",
                //   alignItems: "center",
                //   lineHeight: "50px",
                // }}
                >
                  <FormControlLabel
                    label={item}
                    control={
                      <Checkbox
                        checked={form.partsRecieved.includes(item)}
                        onChange={(event) => {
                          let currentPartRecieved = [...form.partsRecieved];

                          if (event.target.checked) {
                            currentPartRecieved.push(item);
                            setForm((prev) => {
                              return {
                                ...prev,
                                partsRecieved: currentPartRecieved,
                              };
                            });
                          } else {
                            const filterArray = currentPartRecieved.filter(
                              (data) => data !== item
                            );

                            setForm((prev) => {
                              return {
                                ...prev,
                                partsRecieved: filterArray,
                              };
                            });
                          }
                        }}
                      />
                    }
                  />
                  {form.partsRecieved.includes(item) ? (
                    <TextField
                      sx={{
                        width: "65px",
                      }}
                      placeholder="Qty"
                      value={partsQty[item] || ""}
                      onChange={(e) => {
                        setPartsQty((prev) => {
                          return { ...prev, [item]: e.target.value };
                        });
                      }}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </Grid>
            ))}
          </Grid>
        </Box>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              setOpen(true);
            }}
          >
            Submit
          </Button>
        </div>
      </Box>
    </Box>
  );
};

export default DSCFormTab;
