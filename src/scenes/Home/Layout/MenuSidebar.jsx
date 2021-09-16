import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Button, Icon } from 'semantic-ui-react';

import { Block, Svg } from './';
import { NavLink } from './';
import mainMenuItems from 'constants/mainMenuItems';
import bottomMenuItems from 'constants/bottomMenuItems';

class MenuSidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobMenu: false,
            activeNav: 'map'
        };
    }

    // logout = () => {
    //   this.props.dispatch(logout());
    // }

    handleMobile = () => {
        this.setState(({ mobMenu }) => ({
            mobMenu: !mobMenu
        }));
    };

    // handleNavButton = activeNav => () => {
    //   this.setState({ activeNav });
    // }

    render() {
        const { mobMenu } = this.state;
        return (
            <Block
                id="aside-main-nav"
                className={`asideMain ${mobMenu ? 'res-nav' : ''}`}
            >
                <Block className="sidebar">
                    <Block className="mobileMenu">
                        <Button onClick={this.handleMobile} className="mobMenu">
                            <Icon name="bars" />
                        </Button>
                    </Block>
                    <Menu pointing secondary vertical>
                        <Block className="top-menu-item">
                            {mainMenuItems &&
                                mainMenuItems.length &&
                                mainMenuItems.map(item => (
                                    // <NavLink
                                    //   key={item.name}
                                    //   // isActive={activeNav === item.name}
                                    //   onClick={this.handleNavButton(item.name)}
                                    //   svg={item.name}
                                    //   title={[item.title]}
                                    // />
                                    <NavLink
                                        key={item.name}
                                        to={`/${item.name}`}
                                    >
                                        <Svg name={item.name} />
                                        <Menu.Item name={item.title} />
                                    </NavLink>
                                ))}
                        </Block>
                        <Block className="bottom-menu-item">
                            {bottomMenuItems &&
                                bottomMenuItems.length &&
                                bottomMenuItems.map(item => (
                                    <NavLink
                                        key={item.name}
                                        to={`/${item.name}`}
                                    >
                                        <Svg name={item.name} />
                                        <Menu.Item name={item.title} />
                                    </NavLink>
                                ))}
                        </Block>
                        {/* <Button onClick={this.logout} className="logout"><Icon name='sign-out' />Home</Button> */}
                    </Menu>
                    {/* <SideSubMenu activeSubMenu={activeNav} /> */}
                </Block>
            </Block>
        );
    }
}

export default connect(state => ({}))(MenuSidebar);
