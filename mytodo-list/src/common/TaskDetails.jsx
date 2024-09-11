import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserNewTask,
  selectUserNewTask,
  fetchUserRecentTask,
  selectUserRecentTask,
} from "../features/counter/task/taskSlice";
import { dateFilter } from "../helper/helper";
import { Link } from "react-router-dom";
import TaskContext from "../context/auth/TaskContext";

function TaskDetails(props) {
  const dispatch = useDispatch();
  const { user_id, taskUpdated } = props;

  const { updateTask ,setUpdateTask } = useContext(TaskContext);

  const UserNewtaskSelector = useSelector(selectUserNewTask);
  const UserRecenttaskSelector = useSelector(selectUserRecentTask);

  const [newTaskState, setNewTaskState] = useState(null);
  const [recentTaskState, setRecentTaskState] = useState(null);

  const {
    status: newTaskStatus,
    data: newTaskData,
    error: newTaskError,
  } = UserNewtaskSelector;

  const {
    status: recentTaskStatus,
    data: recentTaskData,
    error: recentTaskError,
  } = UserRecenttaskSelector;

  useEffect(() => {
    dispatch(fetchUserNewTask(user_id));
    dispatch(fetchUserRecentTask(user_id));
  }, [user_id, dispatch, taskUpdated]);

  useEffect(() => {
    setNewTaskState(newTaskData);
  }, [newTaskData]);

  useEffect(() => {
    setRecentTaskState(recentTaskData);
  }, [recentTaskData]);

  const Taskup = (e) => {
    e.preventDefault();
    setUpdateTask(true);
  }

  return (
    <div className="w-full md:w-2/5 md:ml-8">
      <div className="bg-white bg-opacity-70 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-bold mb-4">New Task</h3>
        {Array.isArray(newTaskState).length || newTaskState?.length ? (
          newTaskState.map((task) => (
            <div key={task._id}>
              <p className="font-semibold text-lg mb-2">{task.title}</p>
              <p className="mb-4">{task.description}</p>
              <p className="text-sm text-gray-600 mb-1">
                Created At: {dateFilter(task.created_at)}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Due At: {dateFilter(task.task_date)}
              </p>
              <button className="bg-purple-600 text-white py-1 px-3 rounded-md hover:bg-purple-700" onClick={Taskup}>
                Edit Task
              </button>
            </div>
          ))
        ) : (
          <>No Data Found</>
        )}
      </div>

      <div className="bg-white bg-opacity-70 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Recently Added</h3>
        {Array.isArray(recentTaskState).length || recentTaskState?.length ? (
          recentTaskState.map((item) => (
            <div key={item._id}>
              <p className="flex justify-between mb-2">
                <span>{item.title}</span>
                <span>{dateFilter(item.created_at)}</span>
              </p>
            </div>
          ))
        ) : (
          <>No Data Found</>
        )}
        {Array.isArray(recentTaskData).length || recentTaskData?.length ? (
          <Link to="/task_list" className="text-purple-600 hover:underline">
            view all
          </Link>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default TaskDetails;
