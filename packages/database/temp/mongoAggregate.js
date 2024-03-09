const id = "mongodb+srv://admin:admin@clg.dgpebpv.mongodb.net/clg?retryWrites=true&w=majority&appName=clg"

const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(id);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled


  const a = await mongoose.connection.db.collection("tokens").aggregate([
    {
      $addFields: {
        originalValues: { $objectToArray: "$$ROOT" }
      }
    },
    {
      $project: {
        originalValues:1,
        keys:{
          $map: {
            input: "$originalValues",
            as: "pair",
            in: "$$pair.k"
          }
        },
        types: {
          $map: {
            input: "$originalValues",
            as: "pair",
            in: {
              k: "$$pair.k",
              v: {$type:"$$pair.v"},
            }
          }
        }
      }
    },
    {
      $replaceRoot: { newRoot: { keys:"$keys", types:{$arrayToObject: "$types"},values:{$arrayToObject:"$originalValues"} } }
    }
  ]).toArray();

  console.log(a);
}
