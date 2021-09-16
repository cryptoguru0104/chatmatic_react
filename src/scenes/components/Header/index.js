import React from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import PropTypes from "prop-types";

import logo from "assets/images/logo.png";

import "./styles.css";

class Header extends React.Component {
    render() {
        return (
            <nav className="navbar sticky-top navbar-expand-lg position-absolute header-container">
                <Link to="/landing" className="navbar-brand mr-auto">
                    <img src={logo} alt="" />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <i className="fa fa-bars" />
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="navbarSupportedContent"
                >
                    <ul className="navbar-nav mr-auto">
                        {/* <li className="nav-item active">
                            <Link
                                to="/"
                                className="btn btn-link btn-header-link"
                            >
                                Get Started
                            </Link>
                        </li> */}
                        {/* <li className="nav-item">
              <Link to="/" className="btn btn-link btn-header-link">
                What We Do
              </Link>
            </li> */}
                        <li className="nav-item dropdown">
                            <Link
                                to="/pricing"
                                className={classnames(
                                    "btn btn-link btn-header-link",
                                    {
                                        active:
                                            this.props.pathname === "/pricing"
                                    }
                                )}
                            >
                                Pricing
                            </Link>
                        </li>
                        {/* <li className="nav-item">
              <Link to="/" className="btn btn-link btn-header-link">
                About
              </Link>
            </li> */}
                        <li className="nav-item">
                            <Link
                                to="/login"
                                className={classnames(
                                    "btn btn-link btn-header-link",
                                    {
                                        active: this.props.pathname === "/login"
                                    }
                                )}
                            >
                                Login
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

Header.propTypes = {
    pathname: PropTypes.string.isRequired
};

export default Header;
