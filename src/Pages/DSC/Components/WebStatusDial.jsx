import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  useAddWebsiteStatusMutation,
  useGetWebsiteStatusQuery,
  useDeleteWebsiteStatusMutation
} from "../../../features/api/dscApiSlice";
import { toast } from "react-toastify";
import { get } from "react-hook-form";

const WebStatusDial = ({ open, close, data }) => {
  // calling rtk query
  const [addStatus, { isLoading }] = useAddWebsiteStatusMutation();
  const { data: getStatus, refetch } = useGetWebsiteStatusQuery(data?.token);
  const [deleteWebStatus] = useDeleteWebsiteStatusMutation()

  const token = data?.token;
  const status = getStatus?.data?.repairingStatus;

  const handleOnClick = async (data) => {
    const info = {
      name: [data],
      token: token,
    };
    try {
      const result = await addStatus(info).unwrap();
      toast.success("Status Updated Successfully");
      refetch()
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteAll = async() => {
    try{
      const result = await deleteWebStatus(data?.token).unwrap()
      toast.success("Deleted Successfully");
      refetch()
    }catch(error){

    }
  }
  return (
    <Dialog open={open}>
      <DialogTitle sx={{ background: "blue", color: "white" }}>
        Website Status for Token No : {data?.token}
      </DialogTitle>
      <DialogContent>
        <div
          style={{
            margin: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleOnClick("ServiceBook")}
            disabled={status?.some((item) =>item === "servicebook") || isLoading}
          >
            Service Book
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleOnClick("RepairOrReplacement")}
            disabled={status?.some((item) =>item === "repairorreplacement") || isLoading}
          >
            Repair or Replacement Plan
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleOnClick("PartsOrdering")}
            disabled={status?.some((item) =>item === "partsordering") || isLoading}
          >
            Parts Ordering and Waiting
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleOnClick("ComponentReplacement")}
            disabled={status?.some((item) =>item === "componentreplacement") || isLoading}
          >
            Component Replacement or Repair
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleOnClick("SystemTesting")}
            disabled={status?.some((item) =>item === "systemtesting") || isLoading}
          >
            System Testing and Calibration
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleOnClick("FinalInspection")}
            disabled={status?.some((item) =>item === "finalinspection") || isLoading}
          >
            Final Inspection and Quality Control
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleOnClick("ReadyToDispatch")}
            disabled={status?.some((item) =>item === "readytodispatch") || isLoading}
          >
            Ready to dispatch
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleOnClick("Delivered")}
            disabled={status?.some((item) => item === "delivered") || isLoading}
          >
            Delivered
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} fullWidth>
          Cancel
        </Button>
        <Button onClick={()=> handleDeleteAll()} fullWidth>
          Reset All Status
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WebStatusDial;
