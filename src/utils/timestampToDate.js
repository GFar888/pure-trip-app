const timestampToDate = (timestamp) => {
  const date = new Date(timestamp);

  let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  let minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let timestampToDate = `${day}/${month}/${year} ${hours}:${minutes}`;
  return timestampToDate;
};

export default timestampToDate;
