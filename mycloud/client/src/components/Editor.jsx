import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { sha256 } from "crypto-hash";
import { SimpleStorage } from "../abi/abi";
import Web3 from "web3";

// Access our wallet inside of our dapp
const web3 = new Web3(Web3.givenProvider);
// Contract address of the deployed smart contract
const contractAddress = "0x5889d658b43d46a701B4C812e874c61f3757Cd58";
const storageContract = new web3.eth.Contract(SimpleStorage, contractAddress);

const Editor = () => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [name, setName] = useState("");
  const time = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  var data = [];
  var txHash;
  const handleDelete = async (e) => {
    setValue("");
    setName("");
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(value);
      console.log(name);
      await axios.post("http://localhost:8800/posts", {
        name,
        desc: value,
        date: time,
      });
      fecthAllData();
      // handleDelete();
    } catch (err) {
      console.log(err);
    }
  };

  const fecthAllData = async () => {
    try {
      const res = await axios.post("http://localhost:8800/newposts", {
        name: name,
        time: time,
      });
      // console.log(res);
      data = res.data;
      postHistorys();
    } catch (err) {
      console.log(err);
    }
  };
  const hashData = async (ObHistory) => {
    // console.log(await sha256(JSON.stringify(ObHistory)));
    return await sha256(JSON.stringify(ObHistory));
  };

  const postBlockchain = async (obHash) => {
    console.log(obHash);
    // t.preventDefault();
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];
    // Get permission to access user funds to pay for gas fees
    const gas = await storageContract.methods.set(obHash).estimateGas();
    const post = await storageContract.methods
      .set(obHash)
      .send({
        from: account,
        gas,
      })
      .on("receipt", function (receipt) {
        console.log(receipt);
        txHash = receipt.transactionHash;
      });
  };

  const postHistorys = async () => {
    const ObHistory = {
      fileId: data[0].id,
      fileName: data[0].name,
      fileSize: data[0].desc.length,
      content: data[0].desc,
      time: time,
      operation: "Create",
      operator: "Admin",
    };
    // console.log(ObHistory);
    const result = await hashData(ObHistory);
    // console.log(result);
    await postBlockchain(result);
    console.log(txHash);
    ObHistory.blockHash = txHash;
    console.log(ObHistory);
    try {
      await axios
        .post("http://localhost:8800/historys  ", ObHistory)
        .then((res) => {
          console.log(res);
          setLoading(false);
        });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div>
          <div className="write">
            <div className="content">
              <input
                type="text"
                placeholder="File Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="editorContainer">
                <ReactQuill
                  className="editor"
                  theme="snow"
                  value={value}
                  onChange={setValue}
                />
              </div>
            </div>
            <div className="menu"></div>
          </div>
          <div className="buttonCre-De">
            <button onClick={handleClick}>Create</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;
