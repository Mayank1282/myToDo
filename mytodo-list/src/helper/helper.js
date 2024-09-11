export const dateFilter = (formatDate) => {
  let date = new Date(formatDate);
  return `
    ${date.getDate()}
    ${date.toLocaleDateString("en-US", { month: "short" })} 
    ${date.getFullYear()} 
    ${date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })}`;
};