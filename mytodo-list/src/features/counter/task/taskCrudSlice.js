import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../utitlity/axios";
import { task } from "../../../utitlity/apirequests";

const initialState = {
  taskDetails: {
    status: "idle",
    data: null,
    error: null,
  },
};

export const fetchTaskDetails = createAsyncThunk(
  "taskCrud/fetchTaskDetails",
  async (data) => {
    const response = await axios.get(task.task_action(data));
    return response.data;
  }
);

export const updateTaskData = createAsyncThunk(
  "taskCrud/updateTaskData",
  async (qr) => {
    const response = await axios.post(task.update_task, qr, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }
);

export const taskCrudSlice = createSlice({
  initialState,
  name: "taskCrud",
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTaskDetails.pending,(state,action)=>{
        state.taskDetails.status = "loading";
    })
    .addCase(fetchTaskDetails.fulfilled, (state,action) => {
        state.taskDetails.status = "success";
        state.taskDetails.data = action.payload;
    })
    .addCase(fetchTaskDetails.rejected, (state,action) => {
        state.taskDetails.status = "failed";
        state.taskDetails.data = action.error;
    });
  },
});

export const selectTaskDetails = (state) => state.taskCrud.taskDetails;

export default taskCrudSlice.reducer;