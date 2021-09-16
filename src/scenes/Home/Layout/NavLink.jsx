import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class NavLink extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleNavToggle = () => {
        const bodyClasses = document.getElementsByClassName('sidenav-toggled');
        if (bodyClasses.length > 0) {
            document.body.classList.remove('sidenav-toggled');
        }
    };

    render() {
        const isActive = window.location.pathname === this.props.to;
        let className = isActive ? 'active' : '';

        return (
            <Link
                className={className}
                {...this.props}
                onClick={this.handleNavToggle}
            >
                {this.props.children}
            </Link>
        );
    }
}

NavLink.contextTypes = {
    router: PropTypes.object
};

NavLink.propTypes = {
    children: PropTypes.any,
    to: PropTypes.any,
    type: PropTypes.string
};

NavLink.defaultProps = {
    children: null,
    to: null,
    type: 'parent'
};

export default NavLink;
