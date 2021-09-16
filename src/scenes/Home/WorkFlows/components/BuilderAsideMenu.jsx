import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import pencilIcon from 'assets/images/icon-pencil.png';
import { Icon } from 'semantic-ui-react';
import Constants from '../../../../config/Constants';
import { Svg, Block } from '../../Layout';
import { updateEngageInfo, getWidgetTypes } from '../../scenes/EngageAdd/services/actions';
import {
    getCurrentStep,
    getEngageAddState
} from '../../scenes/EngageAdd/services/selector';
import StepBoard from '../../scenes/EngageAdd/scenes/EngageBuilder/components/StepBoard';
import ToolboxItems from '../../scenes/EngageAdd/scenes/EngageBuilder/components/ToolboxItems';
import RandomizerBuilder from './QuickActionBuilders/RandomizerBuilder';
import ConditionBuilder from './QuickActionBuilders/ConditionBuilder';
import DelayBuilder from './QuickActionBuilders/DelayBuilder';
import SMSBuilder from './QuickActionBuilders/SMSBuilder';
import SMTPBuilder from './QuickActionBuilders/SMTPBuilder';
// import StatesCard from '../components/StatesCard';
import { getIntegrationTypes, getIntegrations } from '../../scenes/Settings/scenes/Integrations/services/actions';

const builderTypes = Constants.builderTypes;
class BuilderAsideMenu extends React.Component {
    //#region Life cycle hooks
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            showBuilderAsideMenu: true
        };
    }

    componentDidMount = () => {
        this.props.actions.getWidgetTypes(this.props.match.params.id);
        this.props.actions.getIntegrationTypes(this.props.match.params.id);
        this.props.actions.getIntegrations(this.props.match.params.id);
    }

    componentDidCatch = () => {
        this.showBuilderMenu(this.props.showBuilderAsideMenu, false);
    }


    UNSAFE_componentWillReceiveProps = ({ showBuilderAsideMenu, currentStep }) => {
        const stepType = currentStep ? currentStep.stepType : null;
        this.showBuilderMenu(showBuilderAsideMenu, false, stepType);
    }
    //#endregion

    updateTitle = event => {
        const steps = (this.props.steps || []).map((step, index) => {
            if (step.stepUid != this.props.activeStep) return step;
            return { ...step, name: event.target.value || '' };
        });
        this.props.actions.updateEngageInfo({ steps });
    };

    showBuilderMenu = (show = false, update = true, stepType = null) => {
        const type = builderTypes.messageConfig.type;
        const mainBlock = document.getElementById('main-block');
        if ((stepType || type) === 'delay') {
            mainBlock.classList.add('hide');
            mainBlock.classList.remove('show');
            this.setState({ showBuilderAsideMenu: false });
            return;
        } else if (Boolean(show)) {
            mainBlock.classList.add('show');
            mainBlock.classList.remove('hide');
        } else {
            mainBlock.classList.add('hide');
            mainBlock.classList.remove('show');
        }
        this.setState({ showBuilderAsideMenu: Boolean(show) });
        if (update) {
            this.props.actions.updateEngageInfo({ showBuilderAsideMenu: show });
        }
    };

    renderBuilder = () => {
        const type =
            (this.props.currentStep && this.props.currentStep.stepType) ||
            builderTypes.messageConfig.type;
        switch (type) {
            case builderTypes.randomizerConfig.type:
                return <RandomizerBuilder />;
            case builderTypes.conditionConfig.type:
                return <ConditionBuilder />;
            //Delay builder functionality moved to ViewDelayStep component
            case builderTypes.delayConfig.type:
                // return <DelayBuilder />;
                return <Block />;
            case builderTypes.smsConfig.type:
                return <SMSBuilder />;
            case builderTypes.smtpConfig.type:
                return <SMTPBuilder />;
            case builderTypes.messageConfig.type:
            default:
                return (
                    <React.Fragment>
                        <StepBoard
                            pageId={this.props.match.params.id}
                            isRestrictedForJSON={false}
                        />
                        <ToolboxItems pageId={this.props.match.params.id} />
                    </React.Fragment>
                );
        }
    };

    render() {
        const stepType =
            this.props.currentStep && this.props.currentStep.stepType;
        return (
            <React.Fragment>
                <Block
                    className={`sendMessageBox aside-send-messagebox ${stepType}`}
                >
                    {/* //#region Toggle Menu */}
                    <Block className="aside-showhide-button">
                        {this.state.showBuilderAsideMenu ? (
                            <Icon
                                className="iconright"
                                name="angle right"
                                onClick={() => this.showBuilderMenu(false)}
                            />
                        ) : (
                                <Icon
                                    className="iconleft"
                                    name="angle left"
                                    onClick={() => this.showBuilderMenu(true)}
                                />
                            )}
                    </Block>
                    {/* //#endregion */}
                    {/* //#region Heading */}
                    <Block className="align-items-center input-group step-name">
                        <input
                            type="text"
                            className="form-control pr-2"
                            placeholder="Step name"
                            onChange={this.updateTitle}
                            value={
                                this.props.currentStep &&
                                    this.props.currentStep.name
                                    ? this.props.currentStep.name
                                    : ''
                            }
                        />
                        <Block className="input-group-append">
                            <Svg name="penciloutline" />
                        </Block>
                    </Block>

                    {/* <StatesCard /> */}

                    {/* //#endregion */}

                    {this.renderBuilder()}
                </Block>
            </React.Fragment>
        );
    }
}

BuilderAsideMenu.propTypes = {
    workflowType: PropTypes.string,
    steps: PropTypes.array.isRequired,
    activeStep: PropTypes.any.isRequired,
    currentStep: PropTypes.object
};

const mapStateToProps = state => {
    return {
        ...getEngageAddState(state),
        workflows: state.default.workflows.workflows,
        currentStep: getCurrentStep(state)
    };
};
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            updateEngageInfo,
            getWidgetTypes,
            getIntegrationTypes,
            getIntegrations
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(BuilderAsideMenu)
);
