import { CollectionInfo } from "@eco-flow/types";
import { Connection } from "mongoose";

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
  collectionKey.split(".").forEach((val, index) => {
    aggregate.push(
      aggregateHelper({
        parent: val === "$$ROOT" ? "$$ROOT" : null,
        key: val !== "$$ROOT" ? val : null,
      })
    );
  });

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
