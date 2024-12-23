import { useContext, useState } from "react"
import { UserContext } from "../App"
import { Button, Container, Modal, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const Navigation = () =>{

    const {currentUser, setCurrentUser} = useContext(UserContext);
    const [confirmLogout, setConfirmLogout] = useState(false);

    const navigate = useNavigate();

    const logout = () =>{
      localStorage.removeItem("currentUser");
      setCurrentUser(null);
      toast.success("User logged out!");
      setConfirmLogout(false);
      navigate("/");
    }

    if (currentUser){
      return (
        <>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Navbar.Brand href="/">
                Employee Reimbursement System
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  {currentUser.role === "Manager" ? (
                    <>
                      <Nav.Link href="/reimburse">Reimbursements</Nav.Link>
                      <Nav.Link href="/users">Users</Nav.Link>
                    </>
                  ) : (
                    ""
                  )}
                </Nav>
                <Nav>
                  <NavDropdown
                    title={currentUser.username}
                    id="basic-nav-dropdown"
                    drop="start"
                  >
                    <NavDropdown.Header>
                      {currentUser.firstName} {currentUser.lastName}
                    </NavDropdown.Header>
                    <NavDropdown.Header>
                      <b>Role: </b>
                      {currentUser.role}
                    </NavDropdown.Header>
                    <NavDropdown.Header>
                      <b>Email: </b>
                      {currentUser.email}
                    </NavDropdown.Header>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      onClick={() => {
                        setConfirmLogout(true);
                      }}
                    >
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          <Modal
            show={confirmLogout}
            onHide={() => {
              setConfirmLogout(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirm Logout</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to logout?</Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  setConfirmLogout(false);
                }}
              >
                Close
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  logout();
                }}
              >
                Logout
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );

    }
  else{
    return (
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">Employee Reimbursement System</Navbar.Brand>
        </Container>
      </Navbar>
    );
  }
}