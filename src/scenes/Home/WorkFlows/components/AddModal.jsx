import React, { Component } from 'react';
import { Button, Card, Input, Header, Popup } from 'semantic-ui-react';

import { Block, Svg } from '../../Layout';

export default class AddModal extends Component {
    render() {
        return (
            <Block className="sendMessageBox">
                <Block className="uploadSection">
                    <Block className="uploadfield">
                        <Input type="file" />
                        <Svg name="upload" />
                        <p>Upload Image</p>
                        <Block className="deleteIcon">
                            <Button className="btn del">
                                <Svg name="delete2" />
                            </Button>
                        </Block>

                        <Popup
                            trigger={
                                <Button className="infoButton">
                                    <Svg name="Warning" />
                                </Button>
                            }
                            flowing
                            hoverable
                        >
                            <Header as="h4">Basic Plan</Header>
                            <p>
                                <b>2</b> projects, $10 a month
                            </p>
                            <Button>Choose</Button>
                        </Popup>
                    </Block>
                    <Block className="contentBottom">
                        <Block className="title">
                            <p>Headline Preview</p>
                        </Block>
                        <Block className="subtitle">
                            <p>Description</p>
                            <p>Description line 2</p>
                        </Block>
                    </Block>
                    <Block className="buttonField">
                        <Button className="btn del">Add Button</Button>

                        <Popup
                            trigger={
                                <Button className="infoButton">
                                    <Svg name="Warning" />
                                </Button>
                            }
                            flowing
                            hoverable
                        >
                            <Header as="h4">Basic Plan</Header>
                            <p>
                                <b>2</b> projects, $10 a month
                            </p>
                            <Button>Choose</Button>
                        </Popup>
                    </Block>
                    <Block className="quickReply">
                        <Button className="btn quickReply">
                            <Svg name="plus" /> Add Quick Reply
                        </Button>
                    </Block>
                </Block>
                {/* Upload Section End */}

                <Block className="sendMessageBlock">
                    <h3>Send Message</h3>
                    <Block className="options">
                        <Card className="active">
                            <Svg name="card" />
                            <Card.Content>
                                <Card.Header>Card</Card.Header>
                            </Card.Content>
                        </Card>
                        <Card>
                            <Svg name="carousel" />
                            <Card.Content>
                                <Card.Header>Carousel</Card.Header>
                            </Card.Content>
                        </Card>
                        <Card>
                            <Svg name="video" />
                            <Card.Content>
                                <Card.Header>Video</Card.Header>
                            </Card.Content>
                        </Card>
                        <Card className="image">
                            <Svg name="image" />
                            <Card.Content>
                                <Card.Header>Image</Card.Header>
                            </Card.Content>
                        </Card>
                        <Card>
                            <Svg name="text" />
                            <Card.Content>
                                <Card.Header>Text</Card.Header>
                            </Card.Content>
                        </Card>
                        <Card>
                            <Svg name="audio" />
                            <Card.Content>
                                <Card.Header>Audio</Card.Header>
                            </Card.Content>
                        </Card>
                        <Card>
                            <Svg name="delay" />
                            <Card.Content>
                                <Card.Header>Delay</Card.Header>
                            </Card.Content>
                        </Card>
                        <Card>
                            <Svg name="userinput" />
                            <Card.Content>
                                <Card.Header>User Input</Card.Header>
                            </Card.Content>
                        </Card>
                    </Block>
                    <Block className="saveBtn">
                        <Button className="btn save">Save</Button>
                    </Block>
                </Block>
            </Block>
        );
    }
}
