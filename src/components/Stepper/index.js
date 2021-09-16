import React from 'react';
import PropTypes from 'prop-types';
import './style.css';
import classnames from 'classnames';

class Stepper extends React.PureComponent {
    render() {
        const { steps, step } = this.props;
        return (
            <div style={{ flex: '0 0 auto' }}>
                <div>
                    <ul className="stepper stepper-horizontal pt-0">
                        {steps.map((s, i) => (
                            <li
                                key={i + 1}
                                className={classnames(
                                    step >= i + 1 && 'completed'
                                )}
                            >
                                <a>
                                    <span className="circle">{i + 1}</span>
                                    <span className="label">{s.label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}

Stepper.propTypes = {
    step: PropTypes.number.isRequired,
    steps: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string
        })
    ).isRequired
};

export default Stepper;
