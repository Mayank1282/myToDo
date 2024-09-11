import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { fetchUserAllTask } from "../features/counter/task/taskSlice";
import AuthContext from "../context/auth/AuthContext";
import { Link } from "react-router-dom";
import TaskTable from "./TaskTable";
function TaskList(props) {
  const [refresh, setRefresh] = useState(false);

  const refreshTaskList = () => {
    setRefresh((prev) => !prev); // Toggle the refresh state
  };

  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserAllTask(user["_id"]));
    }
  }, [user, refresh]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 to-purple-300 p-8">
      <div className="max-w-4xl mx-auto bg-purple-200 bg-opacity-60 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-700">My Task List</h1>
          <Link
            to="/create_task"
            className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800"
          >
            <FontAwesomeIcon icon={faPenToSquare} /> Create Task
          </Link>
        </div>

        <TaskTable refreshTaskList={refreshTaskList} />
      </div>
    </div>
  );
}

export default TaskList;

