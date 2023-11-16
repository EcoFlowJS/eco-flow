// import EcoFlow from "./packages/ecoflow/src";

// new EcoFlow().start();

import { JsonBuilder } from "@eco-flow/utils";

let a = JsonBuilder.stringify([
  {
    label: "first",
    id: 1,
    children: [],
  },
  {
    label: "second",
    id: 2,
    children: [
      {
        label: "third",
        id: 3,
        children: [
          {
            label: "fifth",
            id: 5,
            children: [
              {
                label: "second",
                id: 2,
                children: [
                  {
                    label: "third",
                    id: 3,
                    children: [
                      {
                        label: "fifth",
                        id: 5,
                        children: [],
                      },
                      {
                        label: "sixth",
                        id: 6,
                        children: [
                          {
                            label: "seventh",
                            id: 7,
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    label: "fourth",
                    id: 4,
                    children: [],
                  },
                ],
              },
            ],
          },
          {
            label: "sixth",
            id: 6,
            children: [
              {
                label: "seventh",
                id: 7,
                children: [],
              },
              {
                label: "second",
                id: 2,
                children: [
                  {
                    label: "third",
                    id: 3,
                    children: [
                      {
                        label: "fifth",
                        id: 5,
                        children: [],
                      },
                      {
                        label: "sixth",
                        id: 6,
                        children: [
                          {
                            label: "seventh",
                            id: 7,
                            children: [
                              {
                                a: () => {
                                  console.log("hello!");
                                },
                                b: () => {
                                  console.log("hello!");
                                },
                                c: () => {
                                  console.log("hello!");
                                },
                              },
                              {
                                a: () => {
                                  console.log("hello!");
                                },
                                b: () => {
                                  console.log("hello!");
                                },
                                c: () => {
                                  console.log("hello!");
                                },
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    label: "fourth",
                    id: 4,
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        label: "fourth",
        id: 4,
        children: [],
      },
    ],
  },
  {
    a: () => {
      console.log("hello!");
    },
  },
]);

// console.log(a);

let abc = JsonBuilder.parse(a);

// console.log(abc);
//@ts-ignore
console.log(
  //@ts-ignore
  abc[1].children[0].children[1].children[1].children[0].children[1]
);
