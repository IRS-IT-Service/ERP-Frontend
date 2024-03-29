import React from "react";

const StatusDial = () => {
  return (
    <div>
      <Dialog
        open={statusOpen}
        onClose={() => {
          setStatusOpen(false);
          setSelectedData(null);
          setSelectedStatus("");
        }}
      >
        <DialogTitle>Select Status</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            id="outlined-select-currency"
            select
            label="Select"
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
            }}
            defaultValue="EUR"
            helperText="Please select Repair query status"
            sx={{
              margin: "5px",
            }}
          >
            {selectOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          {selectedStatus === "rejected" ? (
            <TextField
              placeholder="The Reason For Rejection"
              value={rejectRemark}
              onChange={(e) => {
                setRejectRemark(e.target.value);
              }}
            />
          ) : (
            ""
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              setStatusOpen(false);
              setSelectedData(null);
              setSelectedStatus("");
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            // onClick={() => {
            //   const params = {
            //     status: selectedStatus,
            //     rejectRemark: rejectRemark,
            //     token: selectedData.Token,
            //   };
            //   updateStausHandler(params);
            // }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StatusDial;
