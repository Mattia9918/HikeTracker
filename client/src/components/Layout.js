import { Row } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

function Layout(props) {
    return (
        <>
            {/* -- NAVIGATION BAR -- */}
            <Row>
                <Navigation user = {props.user} logout = {props.logout}/>
            </Row>

            {/* -- BODY  -- */}
            <div id = "bg">
                <Row>
                    <Outlet />
                </Row>
            </div>
        </>
    )
};

export default Layout;