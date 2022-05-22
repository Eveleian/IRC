import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Chat from './Chat';
import Login from './Login';
import Main from './Main';
import Signup from './Signup';

const AutorizationContext = React.createContext();


function App() {
  const token = localStorage.getItem('token');
  return (
      <AutorizationContext.Provider value={token}>
        {!!token ?  
          <Router>
                <Routes>
                    <Route path="/" element={<Chat/>}/>
                </Routes>
          </Router> :  
          <Router>
                <Routes>
                    <Route path="/" element={<Main/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                </Routes>
          </Router>}
      </AutorizationContext.Provider>
  )

}

export default App;
