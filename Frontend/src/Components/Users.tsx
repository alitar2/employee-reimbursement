import axios from "axios";
import { useContext, useEffect, useState } from "react"
import { Button, Col, Container, Dropdown, DropdownButton, Modal, Row, Spinner, Table } from "react-bootstrap";
import { User } from "../Models";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { UserContext } from "../App";

export const Users:React.FC = () =>{
    
    const [users,setUsers] = useState<User[]>([]);
    //const [currentUser, setCurrentUser] = useState<User>({userID: 0, username: "", firstName: "", lastName: "", email: "", role: ""});

    const {currentUser,setCurrentUser} = useContext(UserContext);


    const [show,setShow] = useState(false);
    const [usertoDelete, setUsertoDelete] = useState({});
    const [usertoUpdate, setUsertoUpdate] = useState(0);
    const [showDeleteModal,setShowDeleteModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const navigate = useNavigate();

     const userErrorHandler = (error) =>{
      if (axios.isAxiosError(error) && error.response){
            if (error.response.data === "You must be logged in to access this functionality"){
                localStorage.removeItem("currentUser");
                setCurrentUser(null);
                navigate("/");
                toast.warning("Session timeout. Please login again.", {
                  toastId: "sessionTimeout",
                });
            }
            else{       
                toast.error(error.response.data,{toastId:"userError"});
            }
      }
      else{
        toast.error("Cannot reach server. Try again later.",{toastId:"serverError"});
      }
    }

    const getUsers = async() =>{
                await axios.get("http://localhost:8080/users", { withCredentials: true })
                .then((data) => {
                    setUsers(data.data);
                })
                .catch((error) => {
                    userErrorHandler(error);
                });
    }

    const promoteUser = async(userID:number) =>{
      try{
        const response = await axios.patch("http://localhost:8080/users/update-role/"+userID,{"role":"Manager"},{withCredentials:true});
        console.log(response.data);
        toast.success("User promoted!");
        let updatedUsers = users.map((user) => 
          user.userID === userID ? { ...user, role: "Manager" } : user
        );
        setUsers(updatedUsers);
      }
      catch(error){
        userErrorHandler(error);
      }
    }

    const deleteUser = async(userID: number) =>{
      try{
        await axios.delete("http://localhost:8080/users/"+userID,{withCredentials:true})
        toast.success("User deleted!");
        let newUsers = users.filter((user) => user.userID !== userID);
        setUsers(newUsers);
      }
      catch (error){
        userErrorHandler(error);
      }
      
    }
    
    useEffect(()=>{ 
      if (currentUser) {
        if (currentUser.role=="Manager"){
          getUsers();
          setShow(true);
        }
        else{
          toast.warning("User does not have proper permissions to access this page!");
          navigate("/reimburse");
        }
      } else {
        toast.warning("Please login to access functionality!");
        navigate("/");
      }
       
        
        
    },[])

    if (!show) {
       return (
         <Spinner animation="border" role="status" size="lg">
           <span className="visually-hidden">Loading...</span>
         </Spinner>
       );
     }


    return (
      <Container fluid>
        <Row>
          <Col>
            <h1>Users List</h1>
          </Col>
        </Row>
        <Row>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>Username</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((user) => user.userID != currentUser.userID)
                .map((user) => {
                  return (
                    <tr>
                      <td>
                        <strong>{user.username}</strong>
                      </td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <Dropdown>
                          <DropdownButton
                            id="options"
                            title="Options"
                            variant="secondary"
                          >
                            {user.role === "Manager" ? (
                              <Dropdown.Item disabled>Promote</Dropdown.Item>
                            ) : (
                              <Dropdown.Item
                                onClick={() => {
                                  setUsertoUpdate(user);
                                  setShowUpdateModal(true);
                                }}
                              >
                                Promote
                              </Dropdown.Item>
                            )}
                            <Dropdown.Item
                              style={{ color: "red" }}
                              onClick={() => {
                                setUsertoDelete(user);
                                setShowDeleteModal(true);
                              }}
                            >
                              Delete
                            </Dropdown.Item>
                          </DropdownButton>
                        </Dropdown>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </Row>
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete <b>{usertoDelete.username}?</b>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setShowDeleteModal(false);
                deleteUser(usertoDelete.userID);
              }}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Role Change</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to change <b>{usertoUpdate.username}'s</b> role to <b>Manager?</b>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowUpdateModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={() => {
                setShowUpdateModal(false);
                promoteUser(usertoUpdate.userID);
              }}
            >
              Update
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
}