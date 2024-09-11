import React, { useState, useMemo, useEffect, useReducer } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { fetchTaskDetails } from "../features/counter/task/taskCrudSlice";
import { selectUserAllTask } from "../features/counter/task/taskSlice";
import { useDispatch, useSelector } from "react-redux";
import { dateFilter } from "../helper/helper";
import PopUp from "../common/PopUp";

function TaskTable(props) {
  const { refreshTaskList } = props;

  // Removed taskUpdated variable
  const reducer = (state, action) => {
    switch (action.type) {
      case "view":
        return { actionType: "view", data: action.payload, taskUpdated: false };
      case "edit":
        return { actionType: "edit", data: action.payload, taskUpdated: true };
      case "resetUpdate":
        return { ...state, taskUpdated: false };
      default:
        return state;
    }
  };

  const [state, localDispatch] = useReducer(reducer, {
    actionType: null,
    data: null,
    taskUpdated: false, // Initialize taskUpdated here
  });

  const dispatch = useDispatch();

  const allTaskList = useSelector(selectUserAllTask);
  const { data: tasks } = allTaskList;

  const [taskState, setTaskState] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const columnHelper = createColumnHelper();

  const deleteTask = (e, taskId) => {
    e.preventDefault();
    const userConfirmed = window.confirm("Are you sure you want to delete?");
    if (userConfirmed) {
      const result = dispatch(
        fetchTaskDetails({ info: taskId, action: "delete" })
      );

      setTaskState((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskId)
      );
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "srNo",
        header: "Sr.no",
        cell: (info) => info.row.index + 1,
      }),
      columnHelper.accessor("userDetails.name", { header: "Name" }),
      columnHelper.accessor("title", { header: "Title" }),
      columnHelper.accessor("description", { header: "Description" }),
      columnHelper.accessor("task_date", {
        header: "Due Date",
        cell: (info) => dateFilter(info.getValue()),
      }),
      columnHelper.display({
        id: "actions",
        header: "Action",
        cell: (info) => (
          <div className="px-4 py-2 flex space-x-2">
            <button
              className="text-gray-500 hover:text-gray-700"
              data-bs-toggle="modal"
              data-bs-target="#task-modal"
              onClick={() => {
                localDispatch({ type: "view", payload: info.row.original._id });
              }}
            >
              <FontAwesomeIcon icon={faEye} />
            </button>
            <button
              className="text-blue-500 hover:text-blue-700"
              data-bs-toggle="modal"
              data-bs-target="#task-modal"
              onClick={() => {
                localDispatch({ type: "edit", payload: info.row.original._id });
              }}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={(e) => deleteTask(e, info.row.original._id)}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        ),
      }),
    ],
    [columnHelper]
  );

  const filteredData = useMemo(() => {
    if (!taskState || taskState.length === 0) return [];
    return taskState.filter(
      (task) =>
        task.userDetails.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [taskState, searchQuery]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: 4 } },
  });

  useEffect(() => {
    setTaskState(tasks);
  }, [tasks]);

  return (
    <>
      <input
        type="text"
        placeholder="Search Task"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-md"
      />
      <div>
        <table className="w-full text-left table-auto bg-white bg-opacity-70 rounded-lg shadow-md">
          <thead className="bg-purple-700 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2 border">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center py-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border"
          >
            {"Previous"}
          </button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border"
          >
            {"Next"}
          </button>
        </div>
      </div>

      {/* Modal for view/edit actions */}
      <div
        className="modal fade"
        tabIndex="-1"
        id="task-modal"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          {state && state.data ? (
            <PopUp
              actionType={state.actionType}
              data={state.data}
              taskUpdated={state.taskUpdated} // Pass state.taskUpdated directly
              refreshTaskList={refreshTaskList}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

export default TaskTable;
