import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Statistic, Icon } from 'semantic-ui-react';

import { Block, Svg } from '../../Layout';
import ProgressCircle from './ProgressCircle';
import { numberWithCommas, getPerc } from 'services/utils';

class States extends Component {
    state = {
        toggleStats: true
    };

    render() {
        const { workflowStats } = this.props;
        const { sent, delivered, clicked, opened } = workflowStats;

        const sentPerc = sent ? getPerc(sent, sent) : 0;
        const deliveredPerc = sent ? getPerc(sent, delivered) : 0;
        const clickedPerc = sent ? getPerc(sent, clicked) : 0;
        const openedPerc = sent ? getPerc(sent, opened) : 0;

        return (
            <React.Fragment>
                <Block
                    className={`state-block-main ${
                        this.state.toggleStats ? '' : 'custom-close'
                    }`}
                >
                    <Block
                        onClick={() =>
                            this.setState(({ toggleStats }) => ({
                                toggleStats: !toggleStats
                            }))
                        }
                        className="bottom-bar-icon"
                    >
                        <i
                            aria-hidden="true"
                            className="angle right icon iconright"
                        ></i>
                    </Block>
                    <Block className="state-block-inner">
                        {/* <button className="btn btn-link btn-collapse">
                            <Svg name="collapse-button" />
                        </button> */}

                        <Statistic.Group inverted>
                            {/* <Icon name="circle outline" /> */}
                            <ProgressCircle perc={sentPerc} />
                            <Statistic>
                                <Statistic.Value>
                                    {numberWithCommas(sent)}
                                </Statistic.Value>
                                <Statistic.Label>messages sent</Statistic.Label>
                                <Statistic.Label>
                                    <Svg name="callout-sent" />{' '}
                                    <span>{sentPerc}%</span>
                                </Statistic.Label>
                            </Statistic>
                        </Statistic.Group>
                        <Statistic.Group inverted>
                            {/* <Icon name="circle outline" /> */}
                            <ProgressCircle perc={deliveredPerc} />
                            <Statistic>
                                <Statistic.Value>
                                    {numberWithCommas(delivered)}
                                </Statistic.Value>
                                <Statistic.Label>
                                    messages delivered
                                </Statistic.Label>
                                <Statistic.Label>
                                    <Svg name="callout-opened" />{' '}
                                    <span>{deliveredPerc}%</span>
                                </Statistic.Label>
                            </Statistic>
                        </Statistic.Group>
                        <Statistic.Group inverted>
                            {/* <Icon name="circle outline" /> */}
                            <ProgressCircle perc={clickedPerc} />
                            <Statistic>
                                <Statistic.Value>
                                    {numberWithCommas(clicked)}
                                </Statistic.Value>
                                <Statistic.Label>
                                    messages clicked
                                </Statistic.Label>
                                <Statistic.Label>
                                    <Svg name="callout-delivered" />{' '}
                                    <span>{clickedPerc}%</span>
                                </Statistic.Label>
                            </Statistic>
                        </Statistic.Group>
                        <Statistic.Group inverted>
                            {/* <Icon name="circle outline" /> */}
                            <ProgressCircle perc={openedPerc} />
                            <Statistic>
                                <Statistic.Value>
                                    {numberWithCommas(opened)}
                                </Statistic.Value>
                                <Statistic.Label>
                                    messages opened
                                </Statistic.Label>
                                <Statistic.Label>
                                    <Svg name="callout-clicked" />{' '}
                                    <span>{openedPerc}%</span>
                                </Statistic.Label>
                            </Statistic>
                        </Statistic.Group>
                    </Block>
                </Block>
            </React.Fragment>
        );
    }
}

export default connect(state => ({}))(States);
