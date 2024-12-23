import { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import { Login } from "./Login";
import { RegisterUser } from "../Models";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const Register = () =>{

    const [user,setUser] = useState<RegisterUser>({username:"",password:"",confirmPassword:"",firstName:"",lastName:"",email:"",role:"Employee"});
    const navigate = useNavigate();
 
    const storeValues = (event:any) =>{
        let name = event.target.name;
        let value = event.target.value;

        setUser({...user,[name]:value});
    }

    const register = async() =>{
        try{
        for (let u in user){
            if (user[u as keyof RegisterUser] === ""){
                throw "All fields must be filled out!";
            }
        }
        if (user.password!=user.confirmPassword){
            throw "Passwords do not match!"
        }
        const response = await axios.post("http://localhost:8080/users/register",user,{withCredentials:true});
        let newUser = response.data;
        toast.success("User "+newUser.username+" registered successfully! Use credentials to login!");
        navigate("/");
    }
    catch(error:unknown){
        if (typeof error === "string"){
            toast.error(error);
        }
        else{
            toast.error(error.response.data);
        }
    }
        
    }

    return (
      <Container
        className="d-flex flex-column align-items-center gap-3 mt-5 "
        fluid
      >
        <Row>
          <h2>Create New User</h2>
        </Row>
        <Row>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={storeValues}
          />
        </Row>
        <Row>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            onChange={storeValues}
          />
        </Row>
        <Row>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            onChange={storeValues}
          />
        </Row>
        <Row>
          <input
            type="text"
            name="email"
            placeholder="Email"
            onChange={storeValues}
          />
        </Row>
        <Row>
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={storeValues}
          />
        </Row>
        <Row>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={storeValues}
          />
        </Row>
        <Row>
          <Col>
            <b>Select Role:</b>
          </Col>
          <Col>
            <select name="role" onChange={storeValues}>
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
            </select>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col>
            <Button
              variant="secondary"
              onClick={() => {
                navigate("/");
              }}
            >
              Back
            </Button>
          </Col>
          <Col>
            <Button variant="success" onClick={register}>
              Register
            </Button>
          </Col>
        </Row>
      </Container>
    );
}