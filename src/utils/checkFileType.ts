export const checkFileType = (file: File) => {
  const validTypes = [
    "text/csv",
    "application/vnd.apache.parquet",
    "application/octet-stream",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
  ];
  return (
    validTypes.includes(file.type) ||
    file.name.match(/\.(csv|parquet|pq|xls|xlsx|txt)$/i)
  );
};
