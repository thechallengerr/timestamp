import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const CreateFile = () => {
    const [book, setBook] = useState({
        title:"",
        desc:"",
        cover:"",
        price:null
    });

    const navigate = useNavigate()

    const handleChange = (e) => {
        setBook(prev=>({...prev, [e.target.name]:e.target.value}));
    }

    const handleClick = async e => {
        e.preventDefault();
        try{
            await axios.post("http://localhost:8800/books", book);
            navigate("/files");
        }catch(err){
            console.log(err);
        }
    }

  return (
    <div classname='form'>
        <h1>Add New File</h1>
        <input type="text" placeholder='title' onChange={handleChange} name="title" />
        <input type="text" placeholder='desc' onChange={handleChange} name="desc"/>
        <input type="number" placeholder='price' onChange={handleChange} name="price"/>
        <input type="text" placeholder='cover' onChange={handleChange} name="cover"/>
        <button onClick={handleClick}>Add</button>
    </div>
  )
}

export default CreateFile