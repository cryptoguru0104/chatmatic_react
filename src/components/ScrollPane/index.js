import React, { Component } from 'react'
import { Scrollbars } from 'react-custom-scrollbars';

export default class ScrollPane extends Component {
    render() {
        return (
            <Scrollbars 
                renderTrackVertical={props => <div {...props} className="track-vertical"/>}
                renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
                style={{ width: '100%', height: '100%' }}>
                {this.props.children}
            </Scrollbars>
        )
    }
}
