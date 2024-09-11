import { createContext, useState } from "react";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [updateTask, setUpdateTask] = useState(false);

  return (
    <TaskContext.Provider
      value={{
        updateTask,
        setUpdateTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
