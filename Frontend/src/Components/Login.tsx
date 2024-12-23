import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../App";


interface LoginUser{
    username:string,
    password:string
}

export const Login:React.FC = () =>{

    const [user,setUser] = useState<LoginUser>({username:"",password:""});
    const navigate = useNavigate();

    const {currentUser, setCurrentUser} = useContext(UserContext);


    const changeValues = (event:any) =>{
        let name = event.target.name;
        let value = event.target.value;

        setUser({...user,[name]:value});
    }

    const login = async() =>{
        if (user.username===""){
            if (user.password===""){
                toast.error("Username and password cannot be empty!");
            }
            else{
                toast.error("Username cannot be empty!");
            }
        }
        else if (user.password === ""){
            toast.error("Password cannot be empty!");
        }
        else{
            try {
              const response = await axios.post("http://localhost:8080/users/login", user, { withCredentials: true });
              let newUser = response.data;
              localStorage.setItem("currentUser", JSON.stringify(newUser));
              setCurrentUser(newUser);
              toast.success("Login successful!");
              navigate("/reimburse");
            } catch (error) {
              if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data);
              } else {
                toast.error("Cannot reach server. Try again later.");
              }
            }
        }
    }

    useEffect(()=>{
      if (currentUser){
        navigate("/reimburse");
      }
    },[])

    return (
      <Container
        className="d-flex flex-column gap-3 mt-5 align-items-center"
        style={{ width: "50rem" }}
        fluid
      >
        <Row>
          <Col>
            <h2>Welcome!</h2>
          </Col>
        </Row>
        <Row>
          <input
            type="text"
            name="username"
            onChange={changeValues}
            placeholder="Username"
          />
        </Row>
        <Row>
          <input
            type="password"
            name="password"
            onChange={changeValues}
            placeholder="Password"
          />
        </Row>
        <Row className="justify-content-center">
          <Col>
            <Button
            variant="secondary"
              onClick={() => {
                navigate("/register");
              }}
            >
              Register
            </Button>
          </Col>
          <Col>
            <Button variant="success" onClick={login}>Login</Button>
          </Col>
        </Row>
      </Container>
    );
}