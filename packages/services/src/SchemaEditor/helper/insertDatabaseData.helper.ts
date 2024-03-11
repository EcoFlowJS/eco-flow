const formateDateTime = (dateTime: Date) => {
  //Sql Format : YYYY-MM-DD HH:MI:SS

  const padL = (nr: any, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);

  return `${dateTime.getFullYear()}-${padL(dateTime.getMonth() + 1)}-${padL(
    dateTime.getDate()
  )} ${padL(dateTime.getHours())}:${padL(dateTime.getMinutes())}:${padL(
    dateTime.getSeconds()
  )}`;
};

export { formateDateTime };
