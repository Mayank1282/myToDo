export const task = {
  create_task: `/create_task`,
  new_task: (user_id) => `/new_task?id=${user_id}`,
  recent_task: (user_id) => `/recent_task?id=${user_id}`,
  all_task: (user_id) => `/all_task?id=${user_id}`,
  task_action: (data) =>
    `/task_action?task_id=${data.info}&action=${data.action}`,
  update_task: `/update_task`,
};

export const action = {
  edit: "edit",
  view: "view",
  delete: "delete",
};

export const designation = ["Mern Stack Dev", "Php Dev", "Python Dev", "UI/UX"]; 


