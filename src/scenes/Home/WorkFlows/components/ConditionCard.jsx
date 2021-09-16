import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Image, Icon } from 'semantic-ui-react';

import { Block, Svg } from '../../Layout';

class ConditionCard extends Component {
    render() {
        return (
            <React.Fragment>
                <Block className="mydiv trans condition">
                    <Block className="selectBox heightAuto">
                        <Block className="HeadingBlock">
                            <h2>Condition</h2>
                        </Block>
                        <Block className="buttonsBlock">
                            <Block className="buttonsCol">
                                <Block className="txtblock">
                                    <p>
                                        Opted is through Widget is example bar
                                    </p>
                                    <p>Gender is Male</p>
                                    <p>Gender is Female</p>
                                </Block>
                                <button className="drag-con">
                                    <Svg name="plus" />
                                </button>
                            </Block>
                            <Block className="buttonsCol">
                                <Block className="txtblock">
                                    <p className="text-right">
                                        The user doesn't match any of these
                                        conditions.
                                    </p>
                                </Block>
                                <button className="drag-con without-plus">
                                    <Icon name="circle outline" />
                                </button>
                            </Block>
                        </Block>
                    </Block>
                </Block>
            </React.Fragment>
        );
    }
}

export default connect(state => ({}))(ConditionCard);
