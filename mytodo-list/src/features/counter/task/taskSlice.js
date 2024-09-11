import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../utitlity/axios";
import { task } from "../../../utitlity/apirequests";

const initialState = {
  user_new_task: {
    status: "idle",
    data: null,
    error: null,
  },
  user_recent_task: {
    status: "idle",
    data: null,
    error: null,
  },
  user_all_task: {
    status: "idle",
    data: null,
    error: null,
  },
};

export const fetchCreatedTask = createAsyncThunk(
  "task/fetchCreatedTask",
  async (formData) => {
    const response = await axios.post(task.create_task, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }
);

export const fetchUserNewTask = createAsyncThunk(
  "task/fetchUserNewTask",
  async (user_id) => {
    const response = await axios.get(task.new_task(user_id));

    return response.data;
  }
);

export const fetchUserRecentTask = createAsyncThunk(
  "task/fetchUserRecentTask",
  async (user_id) => {
    const response = await axios.get(task.recent_task(user_id));
    return response.data;
  }
);

export const fetchUserAllTask = createAsyncThunk(
  "task/fetchUserAllTask",
  async (user_id) => {
    const response = await axios.get(task.all_task(user_id));
    return response.data;
  }
);

export const taskSlice = createSlice({
  initialState,
  name: "task",
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserNewTask.pending, (state, action) => {
        state.user_new_task.status = "loading";
      })
      .addCase(fetchUserNewTask.fulfilled, (state, action) => {
        state.user_new_task.status = "success";
        state.user_new_task.data = action.payload;
      })
      .addCase(fetchUserNewTask.rejected, (state, action) => {
        state.user_new_task.status = "failed";
        state.user_new_task.data = action.error;
      })
      .addCase(fetchUserRecentTask.pending, (state, action) => {
        state.user_recent_task.status = "loading";
      })
      .addCase(fetchUserRecentTask.fulfilled, (state, action) => {
        state.user_recent_task.status = "success";
        state.user_recent_task.data = action.payload;
      })
      .addCase(fetchUserRecentTask.rejected, (state, action) => {
        state.user_recent_task.status = "failed";
        state.user_recent_task.data = action.error;
      })
      .addCase(fetchUserAllTask.pending, (state, action) => {
        state.user_all_task.status = "loading";
      })
      .addCase(fetchUserAllTask.fulfilled, (state, action) => {
        state.user_all_task.status = "success";
        state.user_all_task.data = action.payload;
      })
      .addCase(fetchUserAllTask.rejected, (state, action) => {
        state.user_all_task.status = "failed";
        state.user_all_task.data = action.error;
      });
  },
});

export const selectUserNewTask = (state) => state.task.user_new_task;
export const selectUserRecentTask = (state) => state.task.user_recent_task;
export const selectUserAllTask = (state) => state.task.user_all_task;

export default taskSlice.reducer;
