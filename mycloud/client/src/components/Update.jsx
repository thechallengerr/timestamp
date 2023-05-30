import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
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

const Update = () => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [value, setValue] = useState("");
  const [name, setName] = useState("");
  const [data, setData] = useState([]);
  const [re, setRe] = useState("");
  const time = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  // var data =[];
  var txHash;
  var lastBlockHash;
  useEffect(() => {
    const fecthAllData = async () => {
      try {
        const res = await axios.get("http://localhost:8800/posts/" + id);
        setName(res.data[0].name);
        setValue(res.data[0].desc);
        setData(res.data[0]);
      } catch (err) {
        console.log(err);
      }
    };
    fecthAllData();
  }, []);

  const getLastTxHash = async () => {
    try {
      const res = await axios.get("http://localhost:8800/historys/" + id);
      // console.log(res.data[0].blockHash)
      lastBlockHash = res.data[0].blockHash;
      // console.log(lastBlockHash)
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      await axios.put("http://localhost:8800/posts/" + id, {
        name,
        desc: value
      });
      await getLastTxHash()
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
    // console.log(obHash);
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
        // console.log(receipt);
        txHash = receipt.transactionHash;
      });
  };

  const postHistorys = async () => {
    const ObHistory = {
      fileId: data.id,
      fileName: name,
      fileSize: value.length,
      content: value,
      time: time,
      operation: "Update",
      operator: "Admin",
      lastBlockHash: lastBlockHash
    };
    
    const result = await hashData(ObHistory);
    
    let contentBlock = result.concat(" | ",lastBlockHash);
    console.log(contentBlock);
    await postBlockchain(contentBlock);
    //console.log(txHash);
    delete ObHistory.lastBlockHash;
    ObHistory.blockHash = txHash;
    // console.log(ObHistory);
    try {
      await axios.post(
        "http://localhost:8800/historys  ",
        ObHistory
      ).then((res) => {
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
                placeholder="Name"
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
            <button onClick={handleClick}>Update</button>
            <button ><Link to={`/files`}>Back</Link></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Update;
