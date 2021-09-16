import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Image, Icon, Statistic } from 'semantic-ui-react';

import { Block, Svg } from '../../Layout';
import { numberWithCommas } from 'services/utils';

class StatsCard extends Component {
    render() {
        const { stepStats } = this.props;
        const { sent, delivered, clicked, opened } = stepStats;
        return (
            <React.Fragment>
                <Block className="states-card-block">
                    <Block className="states-card-block-inner">
                        <Statistic.Group inverted>
                            <Statistic>
                                <Statistic.Value>
                                    {numberWithCommas(sent)}
                                </Statistic.Value>
                                <Statistic.Label>
                                    <Svg name="callout-sent" />{' '}
                                    <span>Sent</span>
                                </Statistic.Label>
                            </Statistic>
                        </Statistic.Group>
                        <Statistic.Group inverted>
                            <Statistic>
                                <Statistic.Value>
                                    {numberWithCommas(delivered)}
                                </Statistic.Value>
                                <Statistic.Label>
                                    <Svg name="callout-opened" />{' '}
                                    <span>Delivered</span>
                                </Statistic.Label>
                            </Statistic>
                        </Statistic.Group>
                        <Statistic.Group inverted>
                            <Statistic>
                                <Statistic.Value>
                                    {numberWithCommas(clicked)}
                                </Statistic.Value>
                                <Statistic.Label>
                                    <Svg name="callout-delivered" />{' '}
                                    <span>Clicked</span>
                                </Statistic.Label>
                            </Statistic>
                        </Statistic.Group>
                        <Statistic.Group inverted>
                            <Statistic>
                                <Statistic.Value>
                                    {numberWithCommas(opened)}
                                </Statistic.Value>
                                <Statistic.Label>
                                    <Svg name="callout-clicked" />{' '}
                                    <span>Opened</span>
                                </Statistic.Label>
                            </Statistic>
                        </Statistic.Group>
                    </Block>
                </Block>
            </React.Fragment>
        );
    }
}

export default connect(state => ({}))(StatsCard);
