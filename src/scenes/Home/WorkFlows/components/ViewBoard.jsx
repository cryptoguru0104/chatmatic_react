import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Image, Icon } from 'semantic-ui-react';

import { Block, Svg } from '../../Layout';

class ViewBoard extends Component {
    render() {
        return (
            <React.Fragment>
                <Block className="imageTextBlockMain image-board-block">
                    <button className="btn btn-link btn-add-reply">
                        <Icon name="image outline" /> Image
                    </button>
                    <p className="title">Add a title</p>
                    <p className="subtitle">Add a subtitle</p>
                </Block>

                <Block className="imageBlock image-board-block">
                    <Image
                        src="https://images.unsplash.com/photo-1562886889-52933f35430b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjc2NjA2fQ"
                        alt="img"
                    />
                    <Block className="image-board-text">
                        <p className="title">Add a title</p>
                        <p className="subtitle">Add a subtitle</p>
                    </Block>
                </Block>
            </React.Fragment>
        );
    }
}

export default connect(state => ({}))(ViewBoard);
