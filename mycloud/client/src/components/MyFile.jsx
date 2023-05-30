import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";
import { sha256 } from "crypto-hash";
import { SimpleStorage } from "../abi/abi";
import Web3 from "web3";

// Access our wallet inside of our dapp
const web3 = new Web3(Web3.givenProvider);
// Contract address of the deployed smart contract
const contractAddress = "0x5889d658b43d46a701B4C812e874c61f3757Cd58";
const storageContract = new web3.eth.Contract(SimpleStorage, contractAddress);

function MyFile() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  // const [value, setValue] = useState("");
  // const [name, setName] = useState("");
  var name;
  var value;
  var txHash;
  var lastBlockHash;

  useEffect(() => {
    const fecthAllData = async () => {
      try {
        const res = await axios.get("http://localhost:8800/posts");
        // console.log(res);
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fecthAllData();
  }, []);

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      getData(id);
      await axios.delete(`http://localhost:8800/posts/${id}`);
      setData(data.filter((d) => d.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const getData = async (id) => {
    try {
      console.log(id);
      const res = await axios.get("http://localhost:8800/posts/" + id);
      console.log(res.data);
      name = res.data[0].name;
      value = res.data[0].desc;
      const res2 = await axios.get("http://localhost:8800/historys/" + id);
      lastBlockHash = res2.data[0].blockHash;
      postHistorys(id, lastBlockHash);
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

  const postHistorys = async (id, lastBlockHash) => {
    const ObHistory = {
      fileId: id,
      fileName: name,
      fileSize: value.length,
      content: value,
      time: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      operation: "Delete",
      operator: "Admin",
      lastBlockHash: lastBlockHash,
    };
    // console.log(ObHistory);
    const result = await hashData(ObHistory);
    // console.log(result);
    let contentBlock = result +" | "+lastBlockHash;
    await postBlockchain(contentBlock);
    // console.log(txHash);
    delete ObHistory.lastBlockHash;
    ObHistory.blockHash = txHash;
    // console.log(ObHistory);
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
      ) : (<div style={{ padding: "50px" }}>
      <table id="tableFiles">
        <thead>
          <th>ID</th>
          <th>Name</th>
          <th>Date</th>
          <th>Active</th>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.id}</td>
              <td>{d.name}</td>
              <td>{moment(d.date).format("YYYY-MM-DD HH:mm:ss")}</td>
              <td>
                <button className="update">
                  <Link to={`/update/${d.id}`}>Update</Link>
                </button>
                <button className="delete" onClick={() => handleDelete(d.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>)}
      
    </div>
  );
}

export default MyFile;
