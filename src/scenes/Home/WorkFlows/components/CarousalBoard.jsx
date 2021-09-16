import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Image, Icon } from 'semantic-ui-react';

import { Block, Svg } from '../../Layout';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

class CarousalBoard extends Component {
    render() {
        return (
            <React.Fragment>
                <Block className="imageTextBlockMain carousal-board-block">
                    <Carousel>
                        <div>
                            <img src="http://react-responsive-carousel.js.org/assets/1.jpeg" />
                            <p className="legend">Legend 1</p>
                        </div>
                        <div>
                            <img src="http://react-responsive-carousel.js.org/assets/2.jpeg" />
                            <p className="legend">Legend 2</p>
                        </div>
                        <div>
                            <img src="http://react-responsive-carousel.js.org/assets/3.jpeg" />
                            <p className="legend">Legend 3</p>
                        </div>
                    </Carousel>
                </Block>
            </React.Fragment>
        );
    }
}

export default connect(state => ({}))(CarousalBoard);
