import { CollectionInfo } from "@ecoflow/types";
import { Connection } from "mongoose";

/**
 * Aggregate helper function that constructs a MongoDB aggregation pipeline stage based on the provided options.
 * @param {Object} options - An object containing parent and key properties.
 * @param {string | null} [options.parent] - The parent field to be added to the aggregation stage.
 * @param {string | null} [options.key] - The key field to be added to the aggregation stage.
 * @returns {Object} - A MongoDB aggregation pipeline stage object.
 */
const aggregateHelper = (options: {
  parent?: string | null;
  key?: string | null;
}):
  | {
      [key: string]: string;
    }
  | {} => {
  const { parent, key } = options;
  return parent
    ? {
        $addFields: {
          originalValues: parent,
        },
      }
    : key
    ? {
        $addFields: {
          originalValues: {
            $cond: {
              if: { $isArray: "$originalValues" },
              then: {
                $arrayElemAt: [
                  "$originalValues",
                  {
                    $convert: {
                      input: key,
                      to: "int",
                      onError: 0, // Optional.
                      onNull: 0, // Optional.
                    },
                  },
                ],
              },
              else: `$originalValues.${key}`,
            },
          },
        },
      }
    : {};
};

/**
 * Processes collection information based on the provided parameters.
 * @param {Connection} connection - The database connection object.
 * @param {string} collectionName - The name of the collection to process.
 * @param {string} collectionKey - The key of the collection to process.
 * @param {Object} [match] - Optional matching criteria for the collection.
 * @returns {Promise<CollectionInfo[]>} A promise that resolves to an array of CollectionInfo objects.
 */
const processCollectionInfo = async (
  connection: Connection,
  collectionName: string,
  collectionKey: string,
  match?: {
    [key: string]: any;
  }
): Promise<CollectionInfo[]> => {
  const aggregate: ({ [key: string]: string } | {})[] = [
    { $match: match || {} },
  ];

  /**
   * Splits a collection key by "." and aggregates the values using aggregateHelper function.
   * @param {string} collectionKey - The key to split and aggregate.
   * @returns An array of aggregated values.
   */
  collectionKey.split(".").forEach((val, index) => {
    aggregate.push(
      aggregateHelper({
        parent: val === "$$ROOT" ? "$$ROOT" : null,
        key: val !== "$$ROOT" ? val : null,
      })
    );
  });

  /**
   * Aggregates an array of objects by adding fields, projecting specific fields, and replacing the root object.
   * @param {Array} aggregate - The array of aggregation stages to be applied.
   * @returns None
   */
  aggregate.push(
    {
      $addFields: {
        originalValues: {
          $cond: {
            if: { $isArray: "$originalValues" },
            then: {
              $map: {
                input: "$originalValues",
                as: "item",
                in: {
                  k: {
                    $toString: {
                      $indexOfArray: ["$originalValues", "$$item"],
                    },
                  },
                  v: "$$item",
                },
              },
            },
            else: { $objectToArray: "$originalValues" },
          },
        },
      },
    },
    {
      $project: {
        originalValues: 1,
        keys: {
          $map: {
            input: "$originalValues",
            as: "pair",
            in: "$$pair.k",
          },
        },
        types: {
          $map: {
            input: "$originalValues",
            as: "pair",
            in: {
              k: "$$pair.k",
              v: { $type: "$$pair.v" },
            },
          },
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          keys: "$keys",
          types: { $arrayToObject: "$types" },
          values: { $arrayToObject: "$originalValues" },
        },
      },
    }
  );

  return <CollectionInfo[]>(
    await connection.db
      .collection(collectionName)
      .aggregate(aggregate)
      .toArray()
  );
};

export default processCollectionInfo;
