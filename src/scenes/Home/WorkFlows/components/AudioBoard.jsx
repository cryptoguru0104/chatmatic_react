import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Image, Icon } from 'semantic-ui-react';

import { Block, Svg } from '../../Layout';

class AudioBoard extends Component {
    render() {
        return (
            <React.Fragment>
                <Block className="imageTextBlockMain audio-board-block">
                    <button className="btn btn-link btn-add-reply">
                        <Icon name="volume off" /> Audio
                    </button>
                </Block>
            </React.Fragment>
        );
    }
}

export default connect(state => ({}))(AudioBoard);
