import './style.scss';
import Navbar from './components/Navbar';
import Editor from './components/Editor';
import MyFile from './components/MyFile';
import CreateFile from './components/CreateFile';
import Update from './components/Update';
import History from './components/History';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Navbar />
      <BrowserRouter> 
      <Routes>
        <Route path="/files" element={<MyFile/>} />
        <Route path="/create" element={<Editor/>} />
        <Route path="/history" element={<History/>} />
        <Route path="/update/:id" element={<Update/>} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
