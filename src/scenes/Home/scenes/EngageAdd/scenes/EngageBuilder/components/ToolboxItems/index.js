import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';
import WidgetModal from '../WidgetModal';
import { withRouter } from 'react-router-dom';

import {
  getEngageAddState,
  getCurrentStep
} from '../../../../services/selector';
import { updateEngageInfo, fileUpload } from '../../../../services/actions';

import './styles.css';
import { parseToArray } from '../../../../../../../../services/utils';
import Constants from '../../../../../../../../config/Constants';
import { screenOrientation } from '../../../../../../../../constants/AppConstants';
import Swal from 'sweetalert2';
import { getPageFromUrl } from "services/pages/selector";
import { Svg } from 'scenes/Home/Layout';

class ToolboxItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toolboxItemHover: null,
      visibleWidgetModal: false,
			selectedItemUid: ''
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.apiLoading) {
      Swal({
          title: 'Please wait...',
          text: 'We are retrieving data from store...',
          onOpen: () => {
              Swal.showLoading();
          },
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false
      });
    } else if (this.props.apiLoading) {
        Swal.close();
        if (nextProps.apiError) {
            Swal(nextProps.apiError);
        }
    }

    if (nextProps.widgetLoading) {
      Swal({
          title: 'Please wait...',
          text: 'We are creating widget...',
          onOpen: () => {
              Swal.showLoading();
          },
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false
      });
    } else if (this.props.widgetLoading) {
        Swal.close();
        if (nextProps.widgetError) {
            Swal(nextProps.widgetError);
        }
    }
  }

  isUserInputUsed = (currentStep) => {
    if(currentStep.quickReplies.length > 0) return true;
    
    let isUsed = false;
    let items = currentStep ? currentStep.items : [];
    
    parseToArray(items).forEach(item => {
      if (item.type === Constants.toolboxItems.userInputItem.type) {
        return (isUsed = true);
      }
    });

    return isUsed;
  };

  _handleShowWidgetModal = () => {
    this.setState({ visibleWidgetModal: true });
  }

  _handleHideWidgetModal = () => {
    this.setState({ visibleWidgetModal: false });
  }

  _addToolboxItem = item => {
    let order = 0;
    const steps = this.props.steps;
    const { currentStep } = this.props;
    if (currentStep) {
      if (currentStep && currentStep.items) {
        currentStep.items.forEach(item => {
          if (order <= item.order) {
            order = item.order + 1;
          }
        });
      }
    }
    let newItem = {};

    switch (item.type) {
      case 'carousel':
        newItem = {
          order,
          type: item.type,
          items: [
            {
              uid: uuid(),
              image: '',
              headline: '',
              description: '',
              actionBtns: []
            }
          ],
          orientation: screenOrientation.portrait
        };
        break;
      case 'card':
        newItem = {
          order,
          type: item.type,
          image: null,
          headline: null,
          description: null,
          imageLink: null,
          actionBtns: [],
          orientation: screenOrientation.portrait
        };
        break;
      case 'video':
        newItem = {
          order,
          type: item.type,
          video: null,
          actionBtns: []
        };
        break;
      case 'image':
        newItem = {
          order,
          type: item.type,
          image: null
        };
        break;
      case 'audio':
        newItem = {
          order,
          type: item.type,
          audio: null
        };
        break;
      case 'text':
        newItem = {
          order,
          type: item.type,
          textMessage: null,
          actionBtns: []
        };
        break;
      case 'delay':
        newItem = {
          order,
          type: item.type,
          delayTime: 4,
          showTyping: false 
        };
        break;
      case 'free_text_input':
        newItem = {
          order,
          customFieldUid: null,
          nextStepUid: null,
          type: item.type,
          textMessage: null
        };
        break;
      case 'widgets': 
        this._handleShowWidgetModal();
        return;
      
      //no default
    }

    newItem.uid = uuid();
    if (!this.props.activeStep) {
      const stepUid = uuid();
      const steps = [
        {
          order,
          name: '',
          stepUid: stepUid,
          items: [newItem],
          quickReplies: []
        }
      ];
      this.props.actions.updateEngageInfo({ steps, activeStep: stepUid });
    } else {
      const steps = this.props.steps.map((step, index) => {
        if (step.stepUid != this.props.activeStep) return step;
        if (
          step.items.findIndex(x => x.type == 'free_text_input') > -1
        ) {
          const index = step.items.findIndex(
            x => x.type == 'free_text_input'
          );
          step.items.splice(index, 0, newItem);
          return {
            ...step,
            items: step.items
          };
        }
        return { ...step, items: step.items.concat([newItem]) };
      });
      this.props.actions.updateEngageInfo({ steps });
    }
  };

  _handleAddWidget = (widgetType) => {
    let order = 0;
    const { currentStep } = this.props;
    if (currentStep) {
      if (currentStep && currentStep.items) {
        currentStep.items.forEach(item => {
          if (order <= item.order) {
            order = item.order + 1;
          }
        });
      }
    }
    let newItem = {};

    switch (widgetType.slug) {
      case 'carousel':
        newItem = {
          order,
          type: 'carousel',
          items: [
            {
              uid: uuid(),
              image: '',
              headline: '',
              description: '',
              actionBtns: []
            }
          ],
          orientation: screenOrientation.portrait
        };
        break;
      case 'card':
        newItem = {
          order,
          type: 'card',
          image: null,
          headline: null,
          description: null,
          imageLink: null,
          actionBtns: [],
          orientation: screenOrientation.portrait
        };
        break;
      case 'shopify_cart_abandonment':
        newItem = {
          order,
          type: 'shopify_cart_abandonment'
        }
        break;
    }

    newItem.uid = uuid();
		this.setState({ selectedItemUid: newItem.uid });
    if (!this.props.activeStep) {
      const stepUid = uuid();
      const steps = [
        {
          order,
          name: '',
          stepUid: stepUid,
          items: [newItem],
          quickReplies: []
        }
      ];
      this.props.actions.updateEngageInfo({ steps, activeStep: stepUid });
    } else {
      const steps = this.props.steps.map((step, index) => {
        if (step.stepUid != this.props.activeStep) return step;
        if (
          step.items.findIndex(x => x.type == 'free_text_input') > -1
        ) {
          const index = step.items.findIndex(
            x => x.type == 'free_text_input'
          );
          step.items.splice(index, 0, newItem);
          return {
            ...step,
            items: step.items
          };
        }
        return { ...step, items: step.items.concat([newItem]) };
      });
      this.props.actions.updateEngageInfo({ steps });
    }
  }

	addItemData = (widget_type, data) => {
		const { selectedItemUid } = this.state;
    console.log(widget_type);
    console.log(data);
		if (!widget_type)
			return;
			
		const step = this.props.steps.find(s => s.stepUid == this.props.activeStep);
    console.log('addItemData step: ', this.props.activeStep);
    if (!step)
      return;
    
		const itemIndex = step.items.findIndex(item => item.uid == selectedItemUid);
    console.log('addItemData itemIndex: ', itemIndex);
		if (itemIndex === undefined || itemIndex === null)
			return;

		let newItem = step.items[itemIndex];
    console.log('addItemData newItem', step.items[itemIndex]);
		switch(widget_type.slug) {
			case 'card':
				newItem = {
					...newItem,
					headline: data.title,
					description: data.bodyHtml,
					imageLink: data.image.src,
				};
				this.props.actions.fileUpload(
					this.props.pageId,
					step.stepUid,
					itemIndex,
					null,
					0,
					data.image.src
				);
				break;
      case 'carousel':
        newItem = {
          ...newItem,
          items: [],
        };
        if (!!data.products && data.products.length > 0) {
          newItem.items = data.products.map((product, index) => {
            let item = {
              uid: uuid(),
              headline: product.title,
              description: product.bodyHtml,
              imageLink: product.image.src,
              actionBtns: []
            };
            this.props.actions.fileUpload(
              this.props.pageId,
              step.stepUid,
              itemIndex,
              null,
              index,
              product.image.src
            );
            return item;
          })
        }
        break;
		}

		const steps = this.props.steps.map((step) => {
			if (step.stepUid != this.props.activeStep) return step;
			let index;
			if (
				(index = step.items.findIndex(x => x.uid === selectedItemUid)) > -1
			) {
				step.items.splice(index, 1, newItem);
				return {
					...step,
					items: step.items
				};
			}
			return { ...step, items: step.items.concat([newItem]) };
		});
		this.props.actions.updateEngageInfo({ steps });
	}

  render() {
    const { newWorkflowType, steps, currentStep, page, widgetTypes, integrationTypes, integrations } = this.props;
    const { visibleWidgetModal, selectedItemUid } = this.state;
    const userInputUsed = this.isUserInputUsed(
      currentStep
    );
    
    let isfirstToolBoxDisabled = false;
    if (
      currentStep &&
      steps[0].stepUid === currentStep.stepUid &&
      currentStep.items.length > 0 &&
      (
        newWorkflowType === 'privateReply'
      )
    ) {
      isfirstToolBoxDisabled = true;
    }
    let toolboxItems = [];

    if(page.source) {
        console.log(Constants.toolboxItemsPages[page.source]);
        if(Constants.toolboxItemsPages[page.source].length == 0) toolboxItems = Object.keys(Constants.toolboxItems);
        else toolboxItems = Constants.toolboxItemsPages[page.source];
    }
    return (
      <div className="toolbox-items-container">
        <p className="m-0 small">ToolBox</p>
        <div className={`d-flex flex-wrap ${isfirstToolBoxDisabled ? 'disabled-block' : ''}`}>
          {toolboxItems.map((item, index) => {
            let allowToAdd = true;
            if (
              Constants.toolboxItems[item].type ===
              Constants.toolboxItems.userInputItem.type
            ) {
              if (userInputUsed) allowToAdd = false;
            }

            if (
              [
                Constants.toolboxItems.userInputItem.type,
                Constants.toolboxItems.delayItem.type
              ].includes(Constants.toolboxItems[item].type) &&
              currentStep &&
              steps[0].stepUid === currentStep.stepUid &&
              (
                newWorkflowType === 'privateReply' ||
                newWorkflowType === 'JSON'
              )
            ) {
              allowToAdd = false;
            }
            return (
              <div
                className={classnames(
                  `d-flex flex-column align-items-center  toolbox-item ${allowToAdd ? '' : 'disable'
                  }`,
                  {
                    hover:
                      this.state.toolboxItemHover === item
                  }
                )}
                key={index}
                onClick={() =>
                  allowToAdd &&
                  this._addToolboxItem(
                    Constants.toolboxItems[item]
                  )
                }
                onMouseEnter={() =>
                  allowToAdd &&
                  this.setState({ toolboxItemHover: item })
                }
                onMouseLeave={() =>
                  allowToAdd &&
                  this.setState({ toolboxItemHover: null })
                }
              >
                <div className="icon-container"><Svg name={"toolbox-" + Constants.toolboxItems[item].type} /></div>
                <span>
                  {Constants.toolboxItems[item].label}
                </span>
              </div>
            );
          })}
        </div>
        {visibleWidgetModal && <WidgetModal
          visible={visibleWidgetModal}
          onShow={this._handleShowWidgetModal}
          onHide={this._handleHideWidgetModal}
          onClickWidgetType={this._handleAddWidget}
          widgetTypes={widgetTypes}
          integrationTypes={integrationTypes}
					addWidgetData={this.addItemData}
        /> }

      </div>
    );
  }
}

ToolboxItems.propTypes = {
  page: PropTypes.object.isRequired,
  pageId: PropTypes.string.isRequired,
  steps: PropTypes.array.isRequired,
  activeStep: PropTypes.any.isRequired,
  actions: PropTypes.object.isRequired
};


const urlParams = new URLSearchParams(window.location.search);
const mapStateToProps = (state, props) => ({
  page: getPageFromUrl(state, props),
  steps: getEngageAddState(state).steps,
  activeStep: getEngageAddState(state).activeStep,
  currentStep: getCurrentStep(state),
  newWorkflowType: urlParams.get('type'),
  widgetTypes: getEngageAddState(state).widgetTypes,
  integrationTypes: state.default.settings.integrations.integrationTypes,
  integrations: state.default.settings.integrations.integrations,
  apiLoading: getEngageAddState(state).apiLoading,
  apiError: getEngageAddState(state).apiError,
  widgetLoading: getEngageAddState(state).widgetLoading,
  apiError: getEngageAddState(state).error
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      updateEngageInfo,
      fileUpload,
    },
    dispatch
  )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ToolboxItems)
);
