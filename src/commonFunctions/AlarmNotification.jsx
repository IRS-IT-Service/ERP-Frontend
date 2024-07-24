import React, { useEffect,useState } from 'react';
import Swal from 'sweetalert2';
import {
    useGetAllTasksManagementQuery,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
  } from "../features/api/taskManagementApiSilce";
  import {
    formatDate,
    formatIndianPrice,
    formatUSDPrice,
    formateDateAndTime
  } from "../commonFunctions/commonFunctions";
  import { useSocket } from "../CustomProvider/useWebSocket";
  import { useSendMessageToAdminMutation } from "../features/api/whatsAppApiSlice";
  import {
    Select,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Box,
    styled,
    Button,
    List,
    Popover,
    Typography,
    TextField,
    CircularProgress
  } from "@mui/material";

const AlarmNotification = ({ id,title, description,userInfo }) => {
  const [updateData ,{isLoading}] = useUpdateTaskMutation();
  const { data: allData, refetch } = useGetAllTasksManagementQuery();
  const socket = useSocket();
  const [sendMessageToAdmin] = useSendMessageToAdminMutation()
 


  useEffect(() => {
    const handleUpdate = async (id, query, data, taskTitle) => {
        
      let changeData = data;
      try {
      
        const formDataQuery = new FormData();
        formDataQuery.append("id", id);
        formDataQuery.append("data", data);

        const info = {
          query: query,
          body: formDataQuery,
        };

        await updateData(info).unwrap();
         
  
        refetch();
   
      } catch (err) {
        console.log(err);
      }
    };


    const Tone = "https://ik.imagekit.io/z7h0zeety/Admin-Portal/hello/mixkit-happy-bells-notification-937.wav?updatedAt=1721460292798";

    Swal.fire({
      title: `Task Remainders !`,
      html: `
      <div id="default" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <h5>You have "<span style="color:red">${title}</span>" pending task</h5>
          <img  src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/hello/Alarm%20Clock.gif?updatedAt=1721460292925 " >
        <select id="snoozeSelect" style="padding: 10px; border-radius: 5px; border: 1px solid #ccc;">
        <option value="5">5 minutes</option>
        <option value="10">10 minutes</option>
        <option value="60">1 hour</option>
      </select>
      <div id="default" style="display: flex; justify-content: center; align-items: center; margin-top:10px; gap:10px">
         <button id="snoozeButton" style="
          padding: 5px 20px; 
          border: none; 
          border-radius: 5px; 
          background-color: ${isLoading ? '#ccc' : '#007bff'}; 
          color: white; 
          order: 1;
          cursor: ${isLoading ? 'not-allowed' : 'pointer'};
          font-size: 16px;
          transition: background-color 0.3s;
          display: flex;
          align-items: center;
        " ${isLoading ? 'disabled' : ''}>
          ${isLoading ? 
            '<svg style="margin-right: 8px;"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" /></svg>'
            : '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px;"><path d="M12 3C9.79 3 8 4.79 8 7v2.54l-1.88.95C5.63 11.7 5 12.8 5 14v2h14v-2c0-1.2-.63-2.3-1.12-2.51L16 9.54V7c0-2.21-1.79-4-4-4zm-1 14h2v2h-2zm0-12h2v6h-2z" fill="currentColor"/></svg>'}
          Snooze
        </button>
            <button id="stopButton" style="
            padding:5px 30px; 
            border: none; 
            border-radius: 5px; 
            background-color: #dc3545; 
            color: white; 
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            transition: background-color 0.3s;
          " ${isLoading ? 'disabled' : ''}>
            ${isLoading ? `<span style="margin-right: 8px;"><svg width="24" height="24"><circle cx="12" cy="12" r="10" stroke="#dc3545" stroke-width="2" fill="none" stroke-dasharray="60" stroke-dashoffset="0" transform="rotate(-90 12 12)"><animateTransform attributeName="transform" type="rotate" values="0 12 12;360 12 12" dur="1s" repeatCount="indefinite"/><animate attributeName="stroke-dashoffset" values="60;0" dur="1s" repeatCount="indefinite"/></circle></svg></span>` : ''}
            <!-- MUI Stop icon SVG -->
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px;">
              <path d="M6 6h12v12H6z" fill="currentColor"/>
            </svg>
            Stop
          </button>
          </div>
        </div>`,
      showConfirmButton: false,
      didOpen: () => {
        const audio = new Audio(Tone);
        audio.loop = true;
        audio.play();

        const snoozeButton = Swal.getPopup().querySelector('#snoozeButton');
        snoozeButton.addEventListener('click', async () => {
          const snoozeSelect = Swal.getPopup().querySelector('#snoozeSelect');
          const snoozeValue = parseInt(snoozeSelect.value, 10);

          const currentDateTime = new Date();
          const snoozeTime = new Date(currentDateTime.getTime() + snoozeValue * 60000);
          snoozeTime.setSeconds(0, 0);
          const isoString = snoozeTime.toISOString();
          await handleUpdate(id, 'warningTime', isoString, title);

          Swal.close();
          audio.pause();
        audio.currentTime = 0;
        });
        const stopButton = Swal.getPopup().querySelector('#stopButton');
        stopButton.addEventListener('click', async () => {
          const currentDateTime = new Date();
          currentDateTime.setSeconds(0, 0);
          const isoString = currentDateTime.toISOString();

          await handleUpdate(id, 'warningTime', isoString, title);

          Swal.close();
          audio.pause();
          audio.currentTime = 0;
        });
        
        
      },
 
    
    });
  }, [title, description, updateData]);

  return null;
};

export default AlarmNotification;
