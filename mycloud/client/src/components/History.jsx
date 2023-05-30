import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";

const History = () => {
  // return (
  //   <div style={{padding: "50px"}}>
  //     <table id="tableFiles">
  //       <thead>
  //         <th>File id</th>
  //         <th>File name</th>
  //         <th>File size</th>
  //         <th>Operating time</th>
  //         <th>Operation</th>
  //         <th>Operator</th>
  //         <th>Block transaction</th>
  //       </thead>
  //     </table>
  //   </div>
  // )
  const [data, setData] = useState([]);
  useEffect(() => {
    const fecthAllData = async () => {
      try {
        const res = await axios.get("http://localhost:8800/historys");
        // console.log(res);
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fecthAllData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/posts/${id}`);
      setData(data.filter((d) => d.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <table id="tableFiles">
        <thead>
          <th>File id</th>
          <th>File name</th>
          <th>File size</th>
          <th>Operating time</th>
          <th>Operation</th>
          <th>Operator</th>
          <th>Block transaction</th>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.fileId}</td>
              <td>{d.fileName}</td>
              <td>{d.fileSize}</td>
              <td>{moment(d.time).format("YYYY-MM-DD HH:mm:ss")}</td>
              <td>{d.operation}</td>
              <td>{d.operator}</td>
              <td><Link>{d.blockHash}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
