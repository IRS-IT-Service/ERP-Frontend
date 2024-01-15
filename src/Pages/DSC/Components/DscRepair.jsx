import React, { useEffect, useState } from "react";
import "../DscRepair.css";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useGetFormDynamicDataQuery } from "../../../features/api/dscApiSlice";

const DscRepair = () => {
  /// Local state
  const [modelOptions, setModelOptions] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [hardwareIssue, setHardwareIssue] = useState(null);
  const [softwareIssue, setSoftwareIssue] = useState(null);

  /// RTK query
  const { data, isLoading, refetch, isFetching } = useGetFormDynamicDataQuery();

  /// useEffect
  useEffect(() => {
    if (data?.success) {
      const newModelOptions = data.data.map((item) => {
        return { Name: item.ModelName };
      });

      setModelOptions(newModelOptions);
    }
  }, [data]);

  /// handlers
  const handleSelectedChange = (event, newValue) => {
    const { Hardware, Software } = data.data.find(
      (item) => newValue.Name === item.ModelName
    );

    setHardwareIssue(Hardware);

    setSoftwareIssue(Software);
  };

  return (
    <main
      style={{
        width: "87vw",
        height: "92vh",

        border: "2px solid gray",

        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",

          height: "15%",
          width: "100%",
          padding: "0.3rem 3rem",
          background: "#fe9313",
          color: "white",
        }}
      >
        <p style={{ fontSize: "1.5rem" }}>INDIAN ROBO STORE</p>

        <img src="" alt="" />

        <p style={{ fontSize: "1.5rem" }}>ENTRY FORM FOR REPAIRING</p>
      </header>

      {/*  customer detail*/}
      <div
        className="innerBox2"
        style={{
          display: "flex",
          // flexDirection: 'column',
          // justifyContent: 'space-between',

          alignItems: "center",
          width: "100%",
          height: "20%",
          // border: '3px solid #91c9f7',
          // borderRadius: "1.5%",
          margin: "0",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            // border: '2px solid black',
            justifyContent: "space-evenly",
            // gap: '4%',
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",

              justifyContent: "center",
              gap: "12%",
              alignItems: "center",
              width: "100%",
              height: "50%",
            }}
          >
            <TextField
              label="Customer Name"
              variant="outlined"
              size="small"
              sx={{ width: "21%", marginLeft: "0%" }}
            />

            <TextField
              label="Number"
              variant="outlined"
              size="small"
              sx={{ width: "14%" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              // border: '2px solid black',
              justifyContent: "center",
              gap: "5%",
              alignItems: "center",
              width: "100%",
              height: "50%",
            }}
          >
            <TextField
              label="Customer Name"
              variant="outlined"
              size="small"
              sx={{ width: "18%", marginLeft: "0%" }}
            />

            <TextField
              label="Address"
              variant="outlined"
              size="small"
              sx={{ width: "39%" }}
            />
            <input
              type="date"
              name="date"
              id="date"
              style={{ width: "14%", height: "70%", marginLeft: "0%" }}
            />
          </div>
        </div>
      </div>

      <section
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Model Number Dropdown */}
        <div
          style={{
            // border: '2px solid black',
            width: "15%",
            height: "9%",
            margin: "0.4% 41%",
            // marginBottom: '0%'
            position: "absolute",
            zIndex: "10",
            top: "0%",
            left: "3%",
          }}
        >
          <Autocomplete
            options={modelOptions}
            getOptionLabel={(option) => option.Name}
            onChange={handleSelectedChange}
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

        {/* for hardware & Software */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            // gap: '1%',
            alignItems: "center",
            width: "100%",
            height: "95%",
            // border: '2px solid red',
            position: "absolute",
            top: "1%",
            // zIndex: '-10'
          }}
        >
          {/* Hardware */}
          <div
            style={{
              // border: '2px solid black',
              height: "60%",
              width: "50%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "center",
              padding: "0%",
              marginLeft: "0%",
              fontSize: "1.2rem",
              fontWeight: "bold",
              position: "absolute",
              top: "1%",
              left: "0%",
            }}
          >
            <h3 style={{ letterSpacing: "o.6rem" }}>
              HARDWARE DAMAGE PARTS LIST
            </h3>

            <div
              style={{
                // border: '2px solid black',
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",

                rowGap: "8%",
                padding: "2%",
                gridColumnStart: "auto",
                // border: '5px solid #4668cd',

                borderRadius: "2%",
                width: "90%",
                height: "80%",
                overflowX: "hidden",
                overflowY: "scroll",
                fontSize: "0.8rem",
                marginTop: "4%",
              }}
              className="innerBox1"
            >
              {hardwareIssue?.map((item, index) => {
                return (
                  <label
                    key={index}
                    htmlFor="Upper-Shell"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "5%",
                    }}
                  >
                    {item.Name}
                    <input
                      type="checkbox"
                      name="Upper-Shell"
                      id="Upper-Shell"
                      style={{ width: "10%", height: "80%" }}
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* software */}
          <div
            style={{
              // border: '2px solid black',
              height: "60%",
              width: "50%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "center",
              // marginTop: '1.5%',
              padding: "0%",
              marginRight: "0%",
              fontSize: "1.2rem",
              fontWeight: "bold",
              position: "absolute",
              top: "1%",
              left: "50%",
            }}
          >
            <h3 style={{ position: "absolute", top: "1%", left: "45%" }}>
              Software warning & Error
            </h3>

            <div
              style={{
                // border: '2px solid black',
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                rowGap: "5%",
                padding: "2%",

                // border: '5px solid #4668cd',
                borderRadius: "2%",
                width: "95%",
                height: "80%",
                overflowX: "hidden",
                overflowY: "scroll",
                fontSize: "0.8rem",
                marginTop: "8%",
              }}
              className="innerBox1"
            >
              {softwareIssue?.map((item, index) => {
                return (
                  <label
                    key={index}
                    htmlFor="Upper-Shell"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "5%",
                    }}
                  >
                    {item.Name}
                    <input
                      type="checkbox"
                      name="Upper-Shell"
                      id="Upper-Shell"
                      style={{ width: "10%", height: "80%" }}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Parts Received with Product */}
        <div
          style={{
            // border: '2px solid black',
            height: "34%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "center",
            padding: "1%",
            position: "absolute",
            top: "60%",
            // marginLeft: '1.5%',
          }}
        >
          <h3
          // style={{ letterSpacing: 'o.6rem' }}
          >
            Parts Received with Product
          </h3>

          <div
            className="innerBox1"
            style={{
              // border: '2px solid black',
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              rowGap: "30%",
              padding: "2%",
              borderRadius: "2%",
              width: "90%",
              height: "100%",
              overflowX: "hidden",
              overflowY: "scroll",
              fontSize: "1rem",
              fontWeight: "bold",
              marginTop: "1%",
              width: "100%",
              height: "100%",
            }}
          >
            <label
              htmlFor="Upper-Shell"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "5%",
              }}
            >
              2 Upper Shell
              <input
                type="checkbox"
                name="Upper-Shell"
                id="Upper-Shell"
                style={{ width: "10%", height: "80%" }}
              />
            </label>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DscRepair;
