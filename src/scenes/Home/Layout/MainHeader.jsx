import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { logo } from 'assets/img';
import { Image, Header, Dropdown, Icon } from 'semantic-ui-react';
import { Block } from './';

const trigger = (
    <span>
        <Icon name="user" /> Hello, Bob
    </span>
);

const options = [
    {
        key: 'user',
        text: (
            <span>
                Signed in as <strong>Bob Smith</strong>
            </span>
        ),
        disabled: true
    },
    { key: 'profile', text: 'Your Profile' },
    { key: 'stars', text: 'Your Stars' },
    { key: 'explore', text: 'Explore' },
    { key: 'integrations', text: 'Integrations' },
    { key: 'help', text: 'Help' },
    { key: 'settings', text: 'Settings' },
    { key: 'sign-out', text: 'Sign Out' }
];

export default class MainHeader extends Component {
    render() {
        return (
            <Header className="top-header">
                <Block className="container">
                    <Block className="header">
                        <Block className="logo-area">
                            <Link to="/">
                                <Image
                                    src={logo}
                                    size="small"
                                    className="logo"
                                />
                            </Link>
                        </Block>
                        <Block className="right-col">
                            <Image
                                avatar
                                src="https://react.semantic-ui.com/images/avatar/small/tom.jpg"
                            />

                            <Dropdown trigger={trigger} options={options} />
                            {/* <Dropdown text="">
                                <Dropdown.Menu>
                                    <Dropdown.Item text="New" />
                                    <Dropdown.Item
                                        text="Open..."
                                        description="ctrl + o"
                                    />
                                    <Dropdown.Item
                                        text="Save as..."
                                        description="ctrl + s"
                                    />
                                    <Dropdown.Item
                                        text="Rename"
                                        description="ctrl + r"
                                    />
                                    <Dropdown.Item text="Make a copy" />
                                    <Dropdown.Item
                                        icon="folder"
                                        text="Move to folder"
                                    />
                                    <Dropdown.Item
                                        icon="trash"
                                        text="Move to trash"
                                    />
                                    <Dropdown.Divider />
                                    <Dropdown.Item text="Download As..." />
                                    <Dropdown.Item text="Publish To Web" />
                                    <Dropdown.Item text="E-mail Collaborators" />
                                </Dropdown.Menu>
                            </Dropdown> */}
                        </Block>
                        {/* <Button id="nav-btn" className="mat-button-wrapper menu-toggle">
                            <i className="material-icons">menu</i>
                        </Button>*/}
                    </Block>
                </Block>
            </Header>
        );
    }
}
