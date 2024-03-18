import { CollectionInfo, DriverMongoose } from "@eco-flow/types";
import { Types } from "mongoose";

const processMongo = async (
  connection: DriverMongoose,
  collectionORtableName: string,
  data: CollectionInfo,
  documentID: any = "",
  parent = ""
) => {
  const values = Object.create({});
  for await (const key of data.keys) {
    if (data.types[key] === "array" || data.types[key] === "object") {
      try {
        const result = await processMongo(
          connection,
          collectionORtableName,
          (
            await connection.collectionInfo(collectionORtableName, {
              subColumn: parent.length > 0 ? parent + "." + key : key,
              match: {
                _id:
                  documentID instanceof Types.ObjectId
                    ? documentID
                    : new Types.ObjectId(documentID),
              },
            })
          )[0],
          documentID,
          parent.length > 0 ? parent + "." + key : key
        );

        values[key] =
          data.types[key] === "array"
            ? Object.keys(result).map((key) => result[key])
            : result;
      } catch {
        continue;
      }
    } else if (data.types[key] === "binData") {
      values[key] = `Binary(${data.values[key]})`;
    } else if (data.types[key] === "date")
      values[key] = `Date(${
        data.values[key] instanceof Date
          ? (<Date>data.values[key]).toISOString()
          : data.values[key]
      })`;
    else if (data.types[key] === "decimal")
      values[key] = `MongoDecimal(${data.values[key]})`;
    else values[key] = data.values[key];
  }

  return values;
};

const dataProcessorMongo = async (
  connection: DriverMongoose,
  collectionORtableName: string,
  data: CollectionInfo[]
): Promise<any> => {
  const result = [];
  for await (const value of data) {
    const _id = value.values["_id"];
    result.push(
      await processMongo(connection, collectionORtableName, value, _id)
    );
  }
  return result;
};

export default dataProcessorMongo;
