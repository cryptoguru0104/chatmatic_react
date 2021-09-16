import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

/** import components */
import { NavItem, NavLink } from 'components';
import PreSubmit from './components/PreSubmit/PreSubmit';
import PostSubmit from './components/PostSubmit/PostSubmit';
import SubmitAction from './components/SubmitAction/SubmitAction';
import HowToUseIt from './components/HowToUseIt/HowToUseIt';

/** Import assets */
import iconLanding from 'assets/images/icon-landing.png';
import './styles.css';

/** Define constants */
const presubmit = 'presubmit';
const postsubmit = 'postsubmit';
const submitAction = 'submitAction';
const howToUseIt = 'howToUseIt';

class LandingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedStep: this.props.initialStep
    };
  }

  handleStepChange = event => {
    this.setState({
      selectedStep: event.currentTarget.dataset.step
    });
    this.props.onStepChange(event.currentTarget.dataset.step);
  };

  handlePrevNextStep = step => {
    this.setState({
      selectedStep: step
    });
    this.props.onStepChange(step);
  };

  render() {
    let renderSteps = () => {
      switch (this.state.selectedStep) {
        case 'postsubmit':
          return <PostSubmit onSelectStep={this.handlePrevNextStep} />;
        case 'submitAction':
          return <SubmitAction onSelectStep={this.handlePrevNextStep} />;
        case 'howToUseIt':
          return <HowToUseIt onSelectStep={this.handlePrevNextStep} />;
        default:
          return <PreSubmit onSelectStep={this.handlePrevNextStep} />;
      }
    };

    const currentStep = this.state.selectedStep;

    return (
      <div className="card w-100 steps-container">
        <div className="card-body">
          <div className="d-flex px-2 align-items-start">
            {/* Landing Page Mark */}
            <div className="mr-5">
              <img src={iconLanding} className="img-center" alt="" />
              <small className="d-block text-center text-primary">
                Landing Page
              </small>
            </div>
            <div className="d-flex flex-grow-1 justify-content-center">
              <nav className="nav nav-pills nav-fill nav-justified step-navbar">
                <NavItem className="pr-0 step-nav">
                  <NavLink
                    className={classNames(
                      'nav-item nav-link d-flex flex-column',
                      {
                        active:
                          currentStep === presubmit ||
                          currentStep === postsubmit ||
                          currentStep === submitAction ||
                          currentStep === howToUseIt
                      }
                    )}
                    onClick={this.handleStepChange}
                    data-step={presubmit}
                  >
                    <span>PRE SUBMIT</span>
                    <span>
                      <i
                        className={classNames(
                          'fa',
                          {
                            'fa-check':
                              currentStep === postsubmit ||
                              currentStep === submitAction ||
                              currentStep === howToUseIt
                          },
                          { 'fa-ellipsis-h': currentStep === presubmit }
                        )}
                      />
                    </span>
                  </NavLink>
                </NavItem>
                <NavItem className="pr-0 step-nav">
                  <NavLink
                    className={classNames(
                      'nav-item nav-link d-flex flex-column',
                      {
                        active:
                          currentStep === postsubmit ||
                          currentStep === submitAction ||
                          currentStep === howToUseIt
                      }
                    )}
                    onClick={this.handleStepChange}
                    disabled={currentStep === presubmit}
                    data-step={postsubmit}
                  >
                    <span>POST SUBMIT</span>
                    <span>
                      <i
                        className={classNames(
                          'fa',
                          { 'fa-times': currentStep === presubmit },
                          {
                            'fa-check':
                              currentStep === submitAction ||
                              currentStep === howToUseIt
                          },
                          { 'fa-ellipsis-h': currentStep === postsubmit }
                        )}
                      />
                    </span>
                  </NavLink>
                </NavItem>
                <NavItem className="pr-0 step-nav">
                  <NavLink
                    className={classNames(
                      'nav-item nav-link d-flex flex-column',
                      {
                        active:
                          currentStep === submitAction ||
                          currentStep === howToUseIt
                      }
                    )}
                    onClick={this.handleStepChange}
                    disabled={
                      currentStep === presubmit || currentStep === postsubmit
                    }
                    data-step={submitAction}
                  >
                    <span>SUBMIT ACTION</span>
                    <span>
                      <i
                        className={classNames(
                          'fa',
                          {
                            'fa-times':
                              currentStep === presubmit ||
                              currentStep === postsubmit
                          },
                          { 'fa-check': currentStep === howToUseIt },
                          { 'fa-ellipsis-h': currentStep === submitAction }
                        )}
                      />
                    </span>
                  </NavLink>
                </NavItem>
                <NavItem className="pr-0 step-nav">
                  <NavLink
                    className={classNames(
                      'nav-item nav-link d-flex flex-column',
                      { active: currentStep === howToUseIt }
                    )}
                    onClick={this.handleStepChange}
                    disabled={
                      currentStep === presubmit ||
                      currentStep === postsubmit ||
                      currentStep === submitAction
                    }
                    data-step={howToUseIt}
                  >
                    <span>HOW TO USE IT</span>
                    <span>
                      <i
                        className={classNames(
                          'fa',
                          {
                            'fa-times':
                              currentStep === presubmit ||
                              currentStep === postsubmit ||
                              currentStep === submitAction
                          },
                          { 'fa-ellipsis-h': currentStep === howToUseIt }
                        )}
                      />
                    </span>
                  </NavLink>
                </NavItem>
              </nav>
            </div>
          </div>

          <div className="px-2 mt-3">{renderSteps()}</div>
        </div>
      </div>
    );
  }
}

LandingPage.propTypes = {
  initialStep: PropTypes.string.isRequired,
  onStepChange: PropTypes.func.isRequired
};

export default LandingPage;
