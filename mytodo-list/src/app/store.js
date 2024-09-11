import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import taskReducer from "../features/counter/task/taskSlice";
import taskCrudReducer from "../features/counter/task/taskCrudSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    task: taskReducer,
    taskCrud: taskCrudReducer,
  },
});
