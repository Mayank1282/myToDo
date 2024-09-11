import { React, useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTaskDetails,
  updateTaskData,
  selectTaskDetails,
} from "../features/counter/task/taskCrudSlice";
import AuthContext from "../context/auth/AuthContext";

function PopUP(props) {
  const dispatch = useDispatch();

  const { actionType, data, taskUpdated, refreshTaskList } = props;

  const capitalized = actionType.charAt(0).toUpperCase() + actionType.slice(1);

  const [message, setMessage] = useState("");

  const [ updateTask, setUpdateTask ] = useState(false);

  const TaskSelector = useSelector(selectTaskDetails);

  const { data: TaskData } = TaskSelector;

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

  const updateTsk = (e) => {
    e.preventDefault();
    if (isValid()) {
      if (updateTask && TaskData) {
        const qr = { formData: formData, task_id: TaskData._id };
        dispatch(updateTaskData(qr)).then(() => {
          setMessage("Task updated successfully!");
        });
        refreshTaskList();
      }
    } else {
      const currentValue = inputField.current.value;

      if (!currentValue) {
        Object.keys(isDirty).forEach((test) => (isDirty[test] = true));
      }
      setMessage("Please resolve all errors in form");
    }
  };

  useEffect(() => {
    validate();
  }, [formData]);

  useEffect(() => {
    setMessage("");
  }, []);

  useEffect(() => {
    if (user && data && actionType) {
      const taskdata = { info: data, action: actionType };
      dispatch(fetchTaskDetails(taskdata));
    }
  }, [user, data, actionType]);

  useEffect(() => {
    if (TaskData) {
      const data = TaskData;
      setFormData(data);
    }
  }, [TaskData]);

  useEffect(() => {
    if (taskUpdated) {
      setUpdateTask(taskUpdated);
    }
  }, [taskUpdated]);

  const closeBtn = useRef(null);

  return (
    <div className="modal-content bg-white text-black">
      <div className="modal-header">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {capitalized} Form
        </h2>
        <button
          ref={closeBtn}
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div className="modal-body">
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg mb-8">
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
                  readOnly={actionType === "view"}
                />
                {actionType === "view" ? (
                  ""
                ) : (
                  <div className="text-red-500 text-sm mt-1">
                    {isDirty["title"] && errors["title"][0]
                      ? errors["title"]
                      : ""}
                  </div>
                )}
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
                  readOnly={actionType === "view"}
                ></textarea>
                {actionType === "view" ? (
                  ""
                ) : (
                  <div className="text-red-500 text-sm mt-1">
                    {isDirty["description"] && errors["description"][0]
                      ? errors["description"]
                      : ""}
                  </div>
                )}
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
                  readOnly={actionType === "view"}
                />
                {actionType === "view" ? (
                  ""
                ) : (
                  <div className="text-red-500 text-sm mt-1">
                    {isDirty["task_date"] && errors["task_date"][0]
                      ? errors["task_date"]
                      : ""}
                  </div>
                )}
              </div>
              {updateTask && actionType != "view" ? (
                <>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                    onClick={updateTsk}
                  >
                    Update Task
                  </button>
                </>
              ) : (
                ""
              )}

              <div className="text-red-500 text-center mt-4">{message}</div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopUP;
