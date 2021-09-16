import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';

import { Block, Svg } from '../../Layout';
// import { addItemToWorkFlow } from 'services/modules/workflow';

class NewMenu extends Component {
    state = {
        showMenu: false
    };
    newCard = type => () => {
        const { id } = this.props;

        let btnTop = 0;
        if (id.includes('btn')) {
            btnTop = document.getElementById(id).offsetTop;
        }
        // console.log('btntop', btnTop);
        const parent = document.getElementById(id);
        const parentTop = parent.offsetTop + 50;
        const parentLeft = parent.offsetLeft;
        const parentWidth = parent.offsetWidth;
        const left = parentLeft + parentWidth + 200;
        const newItem = {
            id: uuid(),
            parents: [id],
            children: [],
            top: parentTop,
            left,
            isEmpty: true,
            hasChild: false
        };
        // console.log('new =>', newItem);
        // this.props.dispatch(addItemToWorkFlow(newItem));
        // console.log(id);
        // console.log(type);
    };

    toggleMenu = () => {
        this.setState(({ showMenu }) => ({
            showMenu: !showMenu
        }));
    };

    render() {
        const { showMenu } = this.state;
        // console.log('showMenu', showMenu)
        return (
            <Fragment>
                {/* <Block className="addSequenceButton">
          <button onClick={this.toggleMenu}><Svg name="plus" /></button>
        </Block> */}
                <Block className={`menu ${showMenu ? 'show' : 'hide'}`}>
                    {/* <input type="checkbox" href="#" className="menu-open" name="menu-open" id="menu-open" />
          <label className="menu-open-button" htmlFor="menu-open">
            <Svg name="plus" />
          </label> */}
                    <button
                        onClick={this.newCard('message')}
                        className="menu-item link"
                    >
                        <Svg name="Send_Message" />
                    </button>
                    <button className="menu-item link">
                        <Svg name="Another_Flow" />
                    </button>
                    <button className="menu-item link disable">
                        <Svg name="Condition" />
                    </button>
                    <button className="menu-item link">
                        <Svg name="Randomizer" />
                    </button>
                    <button className="menu-item link">
                        <Svg name="delaysm" />
                    </button>
                </Block>
            </Fragment>
        );
    }
}

export default connect(state => ({
    // workflow: state.workflows.workflow,
    // workflowItem: state.workflows.workflowItem,
    // lastUpdatedAt: Date.now()
}))(NewMenu);
