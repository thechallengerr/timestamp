export const SimpleStorage = [
    {
        inputs: [
          {
            internalType: "string",
            name: "x",
            type: "string"
          }
        ],
        name: "set",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [],
        name: "get",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string"
          }
        ],
        stateMutability: "view",
        type: "function"
      }
  ];