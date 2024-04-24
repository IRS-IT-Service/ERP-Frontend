import { Box, Button, CircularProgress, TextField } from "@mui/material";
import React, { useState } from "react";
import { useAddCareerMutation } from "../../../features/api/otherSlice";

const CreateCareer = () => {
  const [addData, { isLoading }] = useAddCareerMutation();
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    responsibility: "",
    skills: "",
    education: "",
    ctc: "",
    experience: "",
    position: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await addData(formData).unwrap();
      console.log("result", result);
      console.log(formData);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <div
      style={{margin:"5px"}}
    >
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "40ch" },
        }}
        onSubmit={handleSubmit}
        noValidate
        style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        autoComplete="off"
      >
        <TextField
          fullWidth
          id="title"
          label="Title"
          variant="outlined"
          value={formData.title}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          id="summary"
          label="Summary"
          variant="outlined"
          value={formData.summary}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          id="responsibility"
          label="Responsibility"
          variant="outlined"
          value={formData.responsibility}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          id="skills"
          label="Skills"
          variant="outlined"
          value={formData.skills}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          id="education"
          label="Education"
          variant="outlined"
          value={formData.education}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          id="ctc"
          label="CTC"
          variant="outlined"
          value={formData.ctc}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          id="experience"
          label="Experience"
          variant="outlined"
          value={formData.experience}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          id="position"
          label="Position"
          variant="outlined"
          value={formData.position}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained">
          {isLoading ? <CircularProgress /> : "Submit"}
        </Button>
      </Box>
    </div>
  );
};

export default CreateCareer;
