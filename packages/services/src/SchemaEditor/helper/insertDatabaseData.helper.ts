import mongoose from "mongoose";

const formateDateTime = (dateTime: Date) => {
  //Sql Format : YYYY-MM-DD HH:MI:SS

  const padL = (nr: any, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);

  return `${dateTime.getFullYear()}-${padL(dateTime.getMonth() + 1)}-${padL(
    dateTime.getDate()
  )} ${padL(dateTime.getHours())}:${padL(dateTime.getMinutes())}:${padL(
    dateTime.getSeconds()
  )}`;
};

const processMongo = (data: any) => {
  const { _ } = ecoFlow;
  if (_.isUndefined(data)) return {};
  if (_.isNull(data)) return null;
  if (typeof data === "object") {
    if (Array.isArray(data)) {
      const result: any[] = [];
      data.map((_value, index) => result.push(processMongo(data[index])));
      return result;
    }
    const result = Object.create({});
    Object.keys(data).map((key) => (result[key] = processMongo(data[key])));
    return result;
  }
  if (_.isString(data) && data.startsWith("Binary(") && data.endsWith(")"))
    return Buffer.from("ROMEL", "utf8");

  if (_.isString(data) && data.trim() === "Date()") return new Date();
  if (_.isString(data) && data.startsWith("Date(") && data.endsWith(")"))
    return new Date(data.substring("Date(".length, data.length - 1));

  if (
    _.isString(data) &&
    data.startsWith("MongoDecimal(") &&
    data.endsWith(")")
  )
    return new mongoose.Types.Decimal128(
      data.substring("MongoDecimal(".length, data.length - 1)
    );
  return data;
};

export { formateDateTime, processMongo };
