import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Login } from './Components/Login'
import { Users } from './Components/Users'
import { Reimbursements } from './Components/Reimbursements';
import {Container, Spinner } from 'react-bootstrap';
import { Register } from './Components/Register';
import "react-toastify/dist/ReactToastify.css";
import {Slide, ToastContainer } from 'react-toastify';
import { createContext, useEffect, useState } from 'react';
import { Navigation } from './Components/Navigation';


export const UserContext = createContext(null);

function App() {
    
  const [currentUser, setCurrentUser] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(()=>{
    let user = localStorage.getItem("currentUser");
    if (user){
      setCurrentUser(JSON.parse(user));
    }
    setShow(true);
  },[])

  if (!show){
      return (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            );
  }


  return (
    <>
      <UserContext.Provider value={{ currentUser, setCurrentUser }}>
        <BrowserRouter>
          <Navigation />
          <Container className="d-flex mt-5">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/users" element={<Users />} />
              <Route path="/reimburse" element={<Reimbursements />} />
            </Routes>
          </Container>
        </BrowserRouter>
        <ToastContainer closeOnClick transition={Slide}/>
      </UserContext.Provider>
    </>
  );
}

export default App
