import { useContext, useEffect, useState } from "react";

import axios from "axios";
import { Button, Col, Container, Dropdown, DropdownButton, DropdownDivider, Modal, Row, Spinner, Table } from "react-bootstrap";

import { newReimbursement, Reimbursement, User } from "../Models";
import { Login } from "./Login";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";


export const Reimbursements:React.FC = () =>{

    const [reimbursements,setReimbursements] = useState<Reimbursement[]>([]);
    const [filteredReimbursements, setFilteredReimbursements] = useState<Reimbursement[]>([]);
    const [newReimbursement, setNewReimbursement] = useState({title:"",description:"",amount:0})
    const [newResolveNote, setNewResolveNote] = useState("");
    
    const {currentUser,setCurrentUser} = useContext(UserContext);

    const [statusFilter, setStatusFilter] = useState("All");


    const [show,setShow] = useState(false);
    const [showNewModal,setShowNewModal] = useState(false);
    const [showDescription, setShowDescription] = useState(false);
    const [showResolve, setShowResolve] = useState(false);

    const [reimToEdit, setReimToEdit] = useState({});
    const [reimToResolve, setReimToResolve] = useState({});


    const navigate = useNavigate();

    //console.log(currentUser);
   

    const statusColors = {"Approved":"green","Denied":"red","Pending":"orange"}
    const variantColors = { "Approved": "success", "Denied": "danger", "Pending": "warning" };

    const reimbursementErrorHandler = (error) =>{
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
                toast.error(error.response.data,{toastId:"reimbursementError"});
            }
        }
        else{
            toast.error("Cannot reach server. Try again later.",{toastId:"serverError"});
        }
    }

    const getReimbursements = async() =>{
        await axios.get("http://localhost:8080/reimbursements",{withCredentials:true})
        .then((data)=>{
            setReimbursements(data.data);
            setFilteredReimbursements(data.data);
            setShow(true);
        })
        .catch((error)=>{
            reimbursementErrorHandler(error);
        });
    }

    const changeReimbursementValues = (event: any) => {
         let name = event.target.name;
         let value = event.target.value;

         setNewReimbursement({ ...newReimbursement, [name]: value });
       };
    
    const filterReimbursements = () =>{
        
    }

    useEffect(()=>{
        if (currentUser!=null) {
            getReimbursements();
        }
        else{
            toast.warning("Please login to access functionality!",{toastId:"noLogin"});
            navigate("/");
        }
    },[]);


    const checkValues = () => {
        if (newReimbursement.title === "") {
        toast.error("Title cannot be blank!");
        return false;
        }
        if (newReimbursement.description === "") {
        toast.error("Description cannot be blank!");
        return false;
        }
        if (newReimbursement.amount <= 0) {
        toast.error("Amount cannot be zero!");
        return false;
        }
        return true;
    };

    const createReimbursement = async () => {
        try {
        console.log(newReimbursement)
        const response = await axios.post(
            "http://localhost:8080/reimbursements",
            {...newReimbursement,userID:currentUser.userID},
            { withCredentials: true }
        );
        let newR = response.data;
        setReimbursements([...reimbursements, newR]);
        toast.success(
            "New ticket created successfully!"
        );
        setNewReimbursement({
            title: "",
            description: "",
            amount: 0
        });
        } catch (error) {
            reimbursementErrorHandler(error);
        }
    };

    const resolveReimbursement = async(reimbursementID:number,status:string) =>{
        try{
            const response = await axios.patch("http://localhost:8080/reimbursements/resolve/"+reimbursementID,{"status":status},{withCredentials:true});
            let newR = response.data;
            let updatedR = reimbursements.map((reimbursement) =>
              reimbursement.reimbursementID === newR.reimbursementID ? { ...reimbursement, status: newR.status } : reimbursement
            );
            setReimbursements(updatedR);
            toast.success("Ticket resolved!");
            
        }
        catch(error){
            reimbursementErrorHandler(error);
        }
    }



    const updateDescription = async(re) =>{
        try{
            const response = await axios.patch("http://localhost:8080/reimbursements/update/"+re.reimbursementID,{"description":re.description},{withCredentials:true});
            let newR = response.data;
            let updatedR = reimbursements.map((reimbursement) =>
              reimbursement.reimbursementID === newR.reimbursementID ? { ...reimbursement, 'description': newR.description } : reimbursement
            );
            setReimbursements(updatedR);
            toast.success("Description updated!");
            
        }
        catch(error){
            reimbursementErrorHandler(error);
        }
    }

    if (!show){
        return (<Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
            </Spinner>);
    }

    return (
      <Container fluid>
        <Row className="d-flex align-items-center justify-content-between">
          <Col>
            {currentUser.role === "Manager" ? (
              <h1>All Reimbursements</h1>
            ) : (
              <h1>{currentUser.firstName}'s Reimbursements</h1>
            )}
          </Col>
          <Col className="d-flex justify-content-end">
            <Button
              size="sm"
              variant="success"
              onClick={() => setShowNewModal(true)}
            >
              <b>Create Reimbursement</b>
            </Button>
          </Col>
          <Col className="d-flex justify-content-end">
            <Dropdown id="statusFilter">
              <Dropdown.Toggle
                size="sm"
                variant="info"
                className="d-flex align-items-center"
              >
                <span className="me-2">
                  <b>Filter by Status</b>
                </span>
                {statusFilter}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {["Approved", "Denied", "Pending", "All"]
                  .filter((status) => status != statusFilter)
                  .map((status) => {
                    return (
                      <Dropdown.Item
                        onClick={() => {
                          setStatusFilter(status);
                          filterReimbursements({ statusFilter });
                        }}
                      >
                        {status}
                      </Dropdown.Item>
                    );
                  })}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Amount</th>
                  {currentUser.role == "Manager" ? <th> Created by</th> : ""}
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reimbursements
                  .filter((reimbursement) => {
                    if (statusFilter === "All") {
                      return true;
                    } else {
                      return reimbursement.status === statusFilter;
                    }
                  })
                  .map((reimbursement) => {
                    return (
                      <tr>
                        <td>
                          <b>{reimbursement.title}</b>
                        </td>
                        <td className="d-flex align-items-center">
                          <span>{reimbursement.description}</span>
                          {reimbursement.status === "Pending" ? (
                            <div style={{ marginLeft: "20px" }}>
                              <Button
                                variant="secondary"
                                onClick={() => {
                                  setReimToEdit(reimbursement);
                                  setShowDescription(true);
                                }}
                              >
                                Edit
                              </Button>
                            </div>
                          ) : (
                            <></>
                          )}
                        </td>
                        <td>{reimbursement.amount}</td>
                        {currentUser.role == "Manager" ? (
                          <td>{reimbursement.user.username}</td>
                        ) : (
                          ""
                        )}
                        <td>
                          {currentUser.role === "Manager" &&
                          reimbursement.status === "Pending" ? (
                            <Dropdown>
                              <Dropdown.Toggle
                                id="resolve"
                                variant={variantColors[reimbursement.status]}
                              >
                                <b>Pending</b>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Header>
                                  Resolve Ticket
                                </Dropdown.Header>
                                <Dropdown.Item
                                  as="button"
                                  value="Approved"
                                  onClick={() => {
                                    setReimToResolve({
                                      ID: reimbursement.reimbursementID,
                                      status: "Approved",
                                    });
                                    setShowResolve(true);
                                  }}
                                >
                                  Approved
                                </Dropdown.Item>
                                <Dropdown.Item
                                  as="button"
                                  value="Denied"
                                  onClick={() => {
                                    setReimToResolve({
                                      ID: reimbursement.reimbursementID,
                                      status: "Denied",
                                    });
                                    setShowResolve(true);
                                  }}
                                >
                                  Denied
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          ) : (
                            <b
                              style={{
                                color: statusColors[reimbursement.status],
                              }}
                            >
                              {reimbursement.status}
                            </b>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Modal show={showNewModal}>
          <Modal.Header>
            <Modal.Title>Create New Reimbursement Ticket</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container className="d-flex flex-column gap-3">
              <input
                type="text"
                name="title"
                placeholder="Title"
                onChange={changeReimbursementValues}
                style={{ borderWidth: "1px", borderRadius: "3px" }}
              ></input>
              <textarea
                name="description"
                placeholder="Description"
                rows={2}
                onChange={changeReimbursementValues}
                style={{ borderRadius: "3px" }}
              ></textarea>
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                onChange={changeReimbursementValues}
                style={{ borderWidth: "1px", borderRadius: "3px" }}
              ></input>
              <span>Ticket being created by <b>{currentUser.username}.</b></span>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowNewModal(false)}>
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={() => {
                if (checkValues()) {
                  setShowNewModal(false);
                  createReimbursement();
                }
              }}
            >
              Create
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showDescription} onHide={() => setShowDescription(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Description</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container className="d-flex flex-column gap-3">
              <b>{reimToEdit.title}</b>
              <textarea
                name="description"
                placeholder="Description"
                rows={2}
                onChange={(event) =>
                  setReimToEdit({
                    ...reimToEdit,
                    description: event.target.value,
                  })
                }
              >
                {reimToEdit.description}
              </textarea>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDescription(false)}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={() => {
                if (reimToEdit.description === "") {
                  toast.error("Description cannot be blank!");
                } else {
                  setShowDescription(false);
                  updateDescription(reimToEdit);
                }
              }}
            >
              Update
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showResolve} onHide={() => setShowResolve(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Resolution</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to resolve ticket to{" "}
            <b>{reimToResolve.status}?</b>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowResolve(false)}>
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={() => {
                setShowResolve(false);
                resolveReimbursement(reimToResolve.ID, reimToResolve.status);
              }}
            >
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
}