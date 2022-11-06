import { Row } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

function Layout(props) {
    return (
        <>
            {/* -- NAVIGATION BAR -- */}
            <Row>
                <Navigation />
            </Row>

            {/* -- BODY  -- */}
            <Row>
                <Outlet />
            </Row>
        </>
    )
};

export default Layout;