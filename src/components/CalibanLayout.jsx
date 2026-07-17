import React from "react"
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, Outlet } from "react-router";
import logo from '../../assets/Caliban.png'
import CalibanTextContext from '../calibanTextContext.js';
import data from "../../data/data.json";

function CalibanHeader() {

    const texts = data;
    
    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand as={Link} to="/" style={{display: 'contents'}}>
                        <img
                            alt="Caliban Logo"
                            src={logo}
                            width="100"
                            height="100"
                            className="d-inline-block align-top"
                        />{' '}
                        Caliban - Interactive Shakespeare Concordance
                    </Navbar.Brand>
                    <Nav className="ms-4">
                        <Nav.Link as={Link} to="/">Analyze</Nav.Link> 
                        <Nav.Link as={Link} to="/search">Search</Nav.Link> 
                        <Nav.Link as={Link} to="/about">About</Nav.Link> 
                    </Nav>
                </Container>
            </Navbar>
                <CalibanTextContext.Provider value={texts}>
                    <Outlet />
                </CalibanTextContext.Provider>
        </div>
    )
}

export default CalibanHeader;
