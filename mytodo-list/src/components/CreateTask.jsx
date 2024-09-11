import { React, useContext, useEffect, useRef, useState } from "react";
import TaskDetails from "../common/TaskDetails";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCreatedTask,
  fetchUserNewTask,
  fetchUserRecentTask,
  selectUserNewTask,
} from "../features/counter/task/taskSlice";
import AuthContext from "../context/auth/AuthContext";
import TaskContext from "../context/auth/TaskContext";
import { updateTaskData } from "../features/counter/task/taskCrudSlice";

function CreateTask(props) {
  const dispatch = useDispatch();

  const [taskUpdated, setTaskUpdated] = useState(false);

  const [message, setMessage] = useState("");

  const { updateTask, setUpdateTask } = useContext(TaskContext);

  const UserNewtaskSelector = useSelector(selectUserNewTask);

  const [newTaskState, setNewTaskState] = useState(null);

  const { data: newTaskData } = UserNewtaskSelector;

  const forminit = {
    title: "",
    description: "",
    task_date: "",
  };

  const [formData, setFormData] = useState(forminit);

  const inputField = useRef();

  const { user } = useContext(AuthContext);

  const [errors, setErrors] = useState({
    title: [],
    description: [],
    task_date: [],
  });

  const [isDirty, setIsDirty] = useState({
    title: false,
    description: false,
    task_date: false,
  });

  const validate = () => {
    let errorData = {};
    errorData.title = [];
    errorData.description = [];
    errorData.task_date = [];

    if (!formData.title) {
      errorData.title.push("Please Enter Title");
    }

    if (!formData.description) {
      errorData.description.push("Please Enter Description");
    }

    if (!formData.task_date) {
      errorData.task_date.push("Please Enter Task Date");
    }
    setErrors(errorData);
  };

  const isValid = () => {
    let valid = true;
    for (let key in errors) {
      if (errors[key].length > 0) {
        valid = false;
      }
    }
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      user_id: user["_id"],
    }));
  };

  const onblurHandle = (e) => {
    const { name } = e.target;

    setIsDirty((dirty) => ({
      ...dirty,
      [name]: true,
    }));
    validate();
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (isValid()) {
      dispatch(fetchCreatedTask(formData));
      setTaskUpdated((prev) => !prev); // Toggle state to trigger re-fetch
      setMessage("");
      setTimeout(() => {
        setFormData(forminit);
      }, 1000);
    } else {
      const currentValue = inputField.current.value;

      if (!currentValue) {
        Object.keys(isDirty).forEach((test) => (isDirty[test] = true));
      }
      setMessage("Please resolve all errors in form");
    }
  };

  const updateTsk = (e) => {
    e.preventDefault();
    if (updateTask && newTaskData) {
      const qr = { formData: formData, task_id: newTaskData[0]._id };
      dispatch(updateTaskData(qr));
      setTaskUpdated((prev) => !prev);
    }
  };

  const cancelTask = (e) => {
    e.preventDefault();
    setUpdateTask(false);
    setFormData(forminit);
  };

  useEffect(() => {
    validate();
  }, [formData]);

  useEffect(() => {
    setMessage("");
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserNewTask(user["_id"]));
      dispatch(fetchUserRecentTask(user["_id"]));
    }
  }, [user]);

  useEffect(() => {
    setNewTaskState(newTaskData);
    if (updateTask && newTaskData) {
      const data = newTaskData[0];
      setFormData(data);
    }
  }, [newTaskData, updateTask]);

  useEffect(() => {}, [updateTask]);

  useEffect(() => {
    document.body.style.background = "rgb(242, 147, 227)";

    document.body.style.background =
      "linear-gradient(90deg,rgba(242, 147, 227, 0.47) 100%,rgba(140, 85, 131, 0.74) 100%)";

    return () => {
      document.body.style.background = "";
      document.body.style.background = "";
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-wrap">
      <div className="bg-white bg-opacity-70 p-6 rounded-lg w-full md:w-2/5 mb-8 md:mb-0">
        <h2 className="text-2xl font-bold mb-6">Create Task</h2>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={formData?.title}
              onChange={handleChange}
              onBlur={onblurHandle}
              ref={inputField}
            />
            <div className="text-danger">
              {isDirty["title"] && errors["title"][0] ? errors["title"] : ""}
            </div>
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData?.description}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              rows="4"
              onChange={handleChange}
              onBlur={onblurHandle}
              ref={inputField}
            ></textarea>
            <div className="text-danger">
              {isDirty["description"] && errors["description"][0]
                ? errors["description"]
                : ""}
            </div>
          </div>
          <div>
            <label
              htmlFor="datetime"
              className="block text-sm font-medium text-gray-700"
            >
              Date and Time
            </label>
            <input
              type="datetime-local"
              id="datetime"
              name="task_date"
              value={formData?.task_date}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              onChange={handleChange}
              onBlur={onblurHandle}
              ref={inputField}
            />
            <div className="text-danger">
              {isDirty["task_date"] && errors["task_date"][0]
                ? errors["task_date"]
                : ""}
            </div>
          </div>
          {updateTask ? (
            <>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
                onClick={updateTsk}
              >
                Update Task
              </button>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
                onClick={cancelTask}
              >
                Cancel Task
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
              onClick={submitForm}
            >
              Create Task
            </button>
          )}

          {message}
        </form>
      </div>
      <TaskDetails
        user_id={user ? user["_id"] : ""}
        taskUpdated={taskUpdated}
      />
    </div>
  );
}

export default CreateTask;
