import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { toastr } from 'react-redux-toastr';
import { Form, Button, Input, Grid, Image, Popup } from 'semantic-ui-react';
import Swal from 'sweetalert2';

import { getPageWorkflows } from 'services/workflows/workflowsActions';
import { Block, Svg } from '../../Layout';
import { updateNewCampaignInfo, updateCampaignInfo } from '../services/actions';
import { sequenceGraph } from 'assets/img';
import { getPagePosts } from 'services/pages/pagesActions';
import { domainRegex } from '../../scenes/Settings/scenes/Domains/components/Domains';
import { NumberAlphaRegex } from 'services/utils';
import { getPageFromUrl } from "services/pages/selector";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import {
  Buttons,
  MDotMe,
  // AutoResponse,
  // Json,
  KeywordMessage,
  PrivateReplay,
  ChatWidget,
  HtmlModal,
  Welcomemsg
} from '../components';
import { getButtonHtml, getChatWidgetHtml } from '../services/CreateHtml';
import { triggerTypes, triggerTypesInstagram } from 'constants/AppConstants';
import { getPageCampaigns } from 'services/campaigns/campaignsActions';
import { snakeCaseKeys } from 'services/utils';
import { getDomains, updateDomains } from '../../scenes/Settings/scenes/Domains/services/actions';
import MuiPaper from '../../../../components/MuiPaper';
import noteIcon from '../../../../assets/images/note.svg';
import './styles.scss';
import { Grid as MuiGrid, Box as MuiBox} from "@material-ui/core";
import { IconButton, Button as MuiButton } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { createTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';

function AddTriggerButton() {
  const useStyles = makeStyles(theme => ({
      root: {
          backgroundColor: theme.palette.primary.main,
          borderRadius: '50%',
          height: 37,
          width: 37,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
          margin: 'auto'
      },
  }))

  const classes = useStyles()

  return (
      <div className={classes.root}>
          <AddIcon />
      </div>
  )
}

class AddTriggers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: null,
      triggerName: '',
      workflowUid: props.workflowUid || null,
      loading: false,
      saveTrigger: false,
      options: {},
      isOpenHtmlPopUp: false,
      triggerHtml: null,
      isWorkflowsBlur: true,
      htmlType: 'html',
      isStoryMention: false,
      defaultOptions: {},
    };
  }

  //#region life cycle
  componentDidMount = () => {
    this.props.actions.getPageWorkflows(this.props.match.params.id);
    this.props.actions.getDomains(this.props.match.params.id);
    // this.props.actions.getPagePosts(this.props.match.params.id);
    if (!this.props.triggers || this.props.triggers.length === 0) {
      this.props.actions.getPageCampaigns(this.props.match.params.id);
    }
    if (this.props.workflowUid) {
      this.setState({
        ...this.props.triggerInfo,
        workflowUid: this.props.workflowUid || null
      });
    }

    // If edit mode 
    const triggerId = this.props.match.params.triggerId;
    if (triggerId) {
      this.getCurrentTrigger(Number(triggerId));
    }
  };

  UNSAFE_componentWillReceiveProps = nextProps => {
    const { triggers } = nextProps;
    let isWelcomeMsg = false;
    let isAutoResponse = false;
    let isStoryMention = false;
    if (triggers && triggers.length > 0) {
      isWelcomeMsg = triggers.filter(
        t => t.type === triggerTypes.welcomemsg.type
      ).length;
      isAutoResponse = triggers.filter(
        t => t.type === triggerTypes.autoresponse.type
      ).length;
      isStoryMention = triggers.filter(
        t => t.type === triggerTypesInstagram.story_mention.type
      ).length;
    }
    this.setState({
      isWelcomeMsg,
      isAutoResponse,
      isStoryMention
    });

    const { loading, saveTrigger } = this.state;
    if (nextProps.loading && !loading && saveTrigger) {
      this.setState({ loading: true });
      this.loading();
    } else if (!nextProps.loading && loading) {
      Swal.close();
      this.setState(
        {
          loading: false,
          saveTrigger: false
        },
        () => {
          if (nextProps.error) {
            Swal.fire({
              type: 'error',
              title: 'Oops...',
              text:
                nextProps.error ||
                'Something went wrong! Please try again.'
            });
          } else {
            this.postSave();
          }
        }
      );
    }
  };
  //#endregion life cycle

  //#region loaders
  loading = () => {
    Swal({
      title: 'Please wait...',
      text: 'We are saving trigger...',
      onOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
    });
  };
  //#endregion loaders

  //#region functionlality
  addNewWorkflow = () => {
    this.props.actions.updateCampaignInfo(this.state);
    Swal({
      title: 'Please wait...',
      // text: 'We are saving trigger...',
      onOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
    });
    const self = this;
    const { type } = this.state;
    setTimeout(() => {
      let url = `/page/${self.props.match.params.id}/workflows/add?redirect=trigger`;
      if (type === triggerTypes.json.type) {
        url = `/page/${self.props.match.params.id}/workflows/add?type=JSON&redirect=trigger`;
      } else if (type === triggerTypes.post_trigger.type) {
        url = `/page/${self.props.match.params.id}/workflows/add?type=privateReply&redirect=trigger`;
      }
      self.props.history.push(url);
      Swal.close();
    }, 2000);
  };

  //#region functionality
  getCurrentTrigger = triggerId => {
    const { triggers } = this.props;
    if (triggers && triggers.length > 0) {
        const trigger = triggers.find(t => t.uid === triggerId);
        if (trigger) {
            this.setState({
                triggerUid: triggerId,
                type: trigger.type,
                triggerName: trigger.triggerName,
                workflowUid: trigger.workflowUid,
                defaultOptions: trigger.options,
                trigger,
                isWorkflowsBlur: false
            });
            return trigger;
        }
    }

    Swal.fire({
        timer: 1500,
        type: "error",
        title: "Oops...",
        text: "Trigger doesn't exist"
    });

    this.props.history.push(`/page/${this.props.match.params.id}/triggers`);
};

  closeHtmlModal = () => {
    this.setState({ isOpenHtmlPopUp: false, triggerHtml: null }, () => {
      this.props.history.push(`/page/${this.props.match.params.id}/triggers`);
    });
  }
  //#endregion

  //#region post save triggers
  postSave = () => {
    // this.props.actions.updateCampaignInfo({});
    Swal.fire({
      type: 'success',
      title: 'Success!',
      text: 'Trigger has been saved',
      showConfirmButton: false,
      timer: 1500
    });
    setTimeout(() => {
      const { type, options } = this.state;
      let triggerHtml = null;
      let isOpenHtmlPopUp = false;
      let htmlType = 'html';
      if (type === triggerTypes.buttons.type) {
        options.publicId = this.props.triggerInfo.publicId;
        triggerHtml = getButtonHtml(options);
        isOpenHtmlPopUp = true;
      }
      if (type === triggerTypes.chat_widget.type) {
        options.publicId = this.props.triggerInfo.publicId;
        triggerHtml = getChatWidgetHtml(options);
        isOpenHtmlPopUp = true;
      }
      else if (type === triggerTypes.json.type) {
        triggerHtml = JSON.stringify(snakeCaseKeys(this.props.triggerInfo.jsonStep), null, 2);
        isOpenHtmlPopUp = true;
        htmlType = 'json';
      }
      this.setState({
        type: null,
        triggerName: '',
        workflowUid: null,
        loading: false,
        saveTrigger: false,
        options: {},
        triggerHtml,
        isOpenHtmlPopUp,
        isWorkflowsBlur: true,
        htmlType
      }, () => {
        if (!isOpenHtmlPopUp) {
          this.props.history.push(`/page/${this.props.match.params.id}/triggers`);
        }
      });
    }, 2000);
  };
  //#endregion post save triggers

  //#region handle Values
  handleType = type => {
    this.setState({
      type
    });
  };

  handleNameChange = triggerName => {
    if (triggerName && triggerName.trim() && triggerName.length > 2) {
      this.setState({
        isWorkflowsBlur: false,
        triggerName
      });
    } else {
      this.setState({
        isWorkflowsBlur: true,
        triggerName
      });
    }
  };

  // handleNameBlur = () => {
  //     // const { triggerName } = this.state;
  //     // if (triggerName && triggerName.trim()) {
  //     //     this.setState({
  //     //         isWorkflowsBlur: false
  //     //     });
  //     // } else {
  //     //     this.setState({
  //     //         isWorkflowsBlur: true
  //     //     });
  //     // }
  // };

  onSelectWorkflow = ({ uid }) => {
    this.setState({
      workflowUid: uid
    });
  };

  updateOptions = options => {
    this.setState({
      options
    });
  };
  //#endregion handle values

  //#region save trigger
  checkValidations = trigger => {
    let isValid = true;
    const { triggerName, workflowUid, type, options } = trigger;
    if (!triggerName || (triggerName && !triggerName.trim())) {
      toastr.error(
        'You must supply a "Name" to this trigger before you can save it.'
      );
      return false;
    }

    if (type === triggerTypes.buttons.type) {
      const { redirectUrl } = options;
      if (!!redirectUrl && !domainRegex.test(redirectUrl)) {
        toastr.error(
          'Invalid Redirect URL',
          "Please enter a valid URL. inlcuding the protocol identifier (e.g. 'https://' or 'http://')"
        );
        isValid = false;
      }
      if (!isValid) {
        return false;
      }
    } else if (type === triggerTypes.m_dot_me.type) {
      if (this.state.options.isCustomRef) {
        if (
          !options.customRef ||
          !NumberAlphaRegex.test(options.customRef)
        ) {
          toastr.error(
            'Invalid Custom Ref',
            'Please enter a valid Custom Ref. only Alphanumeric value is allowed'
          );
          isValid = false;
        }
      }
      if (!isValid) {
        return false;
      }
    } else if (type === triggerTypes.keywordmsg.type) {
      if (!options.keywords || options.keywords.length === 0) {
        toastr.error(
          'Invalid Keywords',
          'Please enter valid keywords.'
        );
        isValid = false;
      }
      if (!isValid) {
        return false;
      }
    } else if (type === triggerTypes.post_trigger.type) {
      if (!options.postUid) {
        toastr.error('Invalid Post', 'Please select a post.');
        isValid = false;
      }
      if (!isValid) {
        return false;
      }
    }

    if (!workflowUid) {
      toastr.error('You must select a workflow');
      return false;
    }

    return true;
  };

  createTriggerData = () => {
    const { triggerName, workflowUid, type, options } = this.state;
    const trigger = {
      triggerName,
      workflowUid,
      type
    };

    if (type === triggerTypes.buttons.type) {
      trigger.options = {
        redirectUrl: options.redirectUrl.trim() || null,
        color: options.color,
        size: options.size
      };
    } else if (type === triggerTypes.m_dot_me.type) {
      if (options.isCustomRef) {
        trigger.options = {
          customRef: options.customRef.trim() || null,
          publicId: options.publicId
        };
      } else {
        trigger.options = {
          customRef: null,
          publicId: options.publicId
        };
      }
    } else if (type === triggerTypes.keywordmsg.type) {
      trigger.options = options;
    } else if (type === triggerTypes.post_trigger.type) {
      trigger.options = options;
    } else if (type === triggerTypes.chat_widget.type) {
      trigger.options = options;
    }

    if (this.props.pageInfo.source === 'ig') {
      trigger.source = 'ig'
      // if (trigger.type === triggerTypes.ads.type) {
      //   trigger.type = 'json'
      // }
    }

    // If edit mode 
    const triggerId = this.props.match.params.triggerId;
    if (triggerId) {
      trigger.uid = triggerId;
    }
    return trigger;
  };

  handleSave = () => {
    const trigger = this.createTriggerData();
    const isValid = this.checkValidations(trigger);
    if (isValid) {
      this.setState({
        saveTrigger: true
      }, () => {
        this.props.actions.updateNewCampaignInfo(
          this.props.match.params.id,
          trigger,
          true
        );
      });
    }
  };
  //#endregion save trigger

  isFinalSectionEnabled = (type) => {
    if(!type) return false;
    if(type == 'keywordmsg') return this.state.options && this.state.options.keywords && this.state.options.keywords.length !== 0;
    return true;
  };

  addDomain = (domainUrls) => {
    this.props.actions.updateDomains(this.props.match.params.id, domainUrls);
  }

  render() {
    const {
      type,
      triggerName,
      workflowUid,
      isOpenHtmlPopUp,
      triggerHtml,
      isWorkflowsBlur,
      options,
      isWelcomeMsg,
      isAutoResponse,
      isStoryMention,
      htmlType,
      defaultOptions
    } = this.state;
    const { workflows: allWorkflows, loading } = this.props;

    let workflows = allWorkflows;
    if (type === triggerTypes.json.type) {
      workflows = allWorkflows.filter(w => w.toJson);
    } else if (type === triggerTypes.post_trigger.type) {
      workflows = allWorkflows.filter(w => w.toPrivateRep);
    }

    let allTriggerTypes = triggerTypes;
    if (this.props.pageInfo.source === 'ig') {
      allTriggerTypes = {...triggerTypes, ...triggerTypesInstagram};
    }
    const triggerTypeKeysBySource = Object.keys(allTriggerTypes).filter(key => allTriggerTypes[key][this.props.pageInfo.source] )
    return (
      <Block className="main-container trigger-container trigger-newo add-trigger">
        <HtmlModal
          html={triggerHtml}
          open={isOpenHtmlPopUp}
          close={this.closeHtmlModal}
          htmlType={htmlType}
        />
        <MuiPaper className="trigger-aside-form">
          <Form>
            <h2 >Step 1.</h2>
            <hr/>
            <Form.Field className="">
              <label className="no-padding">
                Name Your Trigger
                            </label>
              <Input
                placeholder="Enter Name..."
                type="text"
                value={triggerName}
                onChange={(e, { value }) =>
                  this.handleNameChange(value)
                }
              // onBlur={this.handleNameBlur}
              />
            </Form.Field>

            <h2>Step 2.</h2>
            <hr/>
            <label>Choose An Event That Will Trigger This Message</label>
            <Block className="step-1-pop-outer">
              {isWelcomeMsg > 0 &&
                <Block className="step-1-pop-hide">
                  <Popup
                    trigger={<Button icon='add' />}
                    content='You are only allowed to add one welcome message at a time'
                  // inverted
                  />
                </Block>
              }
              {isAutoResponse > 0 &&
                <Block className="step-1-pop-hide step-1-pop-hide-right">
                  <Popup
                    trigger={<Button icon='add' />}
                    content='You are only allowed to add one autoresponse at a time'
                    position='top right'
                  // inverted
                  />
                </Block>
              }
              <Block className={`buttonsField left-sidebar-newo ${isWorkflowsBlur ? 'blur-section' : ''}`}>
                {
                  triggerTypeKeysBySource.map((t, tindex) => {
                    if (allTriggerTypes[t].type === allTriggerTypes.checkbox.type ||
                      (this.props.pageInfo.source == 'ig' && allTriggerTypes[t].type === allTriggerTypes.post_trigger.type)) { // Disable post reply in IG pages for now
                      return (
                        <Popup
                          key={tindex}
                          content="Coming Soon"
                          position="top center"
                          trigger={
                            <Button
                              key={allTriggerTypes[t].type}
                              className="btn-default btn-disabled"
                              style={{ cursor: "default", opacity: 0.5 }}
                            >
                              <Block className="sidebar-list-img">
                                <span>
                                  <Image
                                    src={allTriggerTypes[t].icon}
                                    className="wel"
                                  />
                                </span>
                                <p>{allTriggerTypes[t].text}</p>
                              </Block>
                            </Button>
                          }
                        />
                      )
                    } else {
                      return (
                        <Button
                          key={allTriggerTypes[t].type}
                          className={`btn btn-default ${allTriggerTypes[t].type === type
                            ? 'active'
                            : ''
                            }`}
                          onClick={() =>
                            this.handleType(allTriggerTypes[t].type)
                          }
                          disabled={
                            (allTriggerTypes[t].type ===
                              allTriggerTypes.welcomemsg.type &&
                              isWelcomeMsg > 0) ||
                            (allTriggerTypes[t].type ===
                              allTriggerTypes.autoresponse.type &&
                              isAutoResponse > 0) || 
                            (allTriggerTypes[t].type ===
                              allTriggerTypes.story_mention.type &&
                              isStoryMention > 0)
                              
                          }
                        >
                          <Block className="sidebar-list-img">
                            <span>
                              <Image
                                src={allTriggerTypes[t].icon}
                                className="wel"
                              />
                            </span>
                            <p>{allTriggerTypes[t].text}</p>
                          </Block>
                        </Button>
                      )
                    }
                  })
                }

              </Block>
            </Block>

            {(isWelcomeMsg > 0 || isAutoResponse > 0) && (
              <Block>
                <span style={{ color: '#969696' }}>
                  <strong>Note:</strong> You are only allowed
                                    to add one welcome message at a time and one
                                    autoresponse at a time.
                                </span>
              </Block>
            )}
             
            {/*<Button type="submit" className="primary">
                            Next
                        </Button>

                        {/*<Divider section />

                         <h3 className="heading">Step Two</h3>
                        <Block className="messageBlockMain"> 
                            <label>Choose From Existing Sequence</label>
                            <Select
                                placeholder="Select..."
                                options={countryOptions}
                            />
                        </Block>
                        {/* <Block className="messageBlockMain">
                            <Input placeholder='Super Long Test Name For Sequence' value="Super Long Test Name For Sequence" />
                        </Block> */}

            {/*<p>Or Create A New Sequence</p>
                        <Button type="submit" className="primary">
                            Create New Sequence
                        </Button>*/}
          </Form>
        </MuiPaper>
        <MuiPaper
          className={`trigger-aside-form trigger-aside-right trigger-customize open ${workflowUid ? 'open' : ''
            }`}
        >
          <h2>Step 3. Customize</h2>
          <hr/>
          <Form className="d-flex customize-section">
            <Block className="buttonsField left-sidebar-newo ">
              {type === triggerTypes.welcomemsg.type && (
                <Welcomemsg />
              )}
              {type === triggerTypes.m_dot_me.type && (
                <MDotMe updateOptions={this.updateOptions} defaultOptions={defaultOptions}/>
              )}
              {type === triggerTypes.buttons.type && (
                <Buttons updateOptions={this.updateOptions}  defaultOptions={defaultOptions}/>
              )}
              {/* {type === triggerTypes.json.type && <Json />} */}
              {type === triggerTypes.keywordmsg.type && (
                <KeywordMessage
                  updateOptions={this.updateOptions}
                  defaultOptions={defaultOptions}
                />
              )}
              {type === triggerTypes.post_trigger.type && (
                <PrivateReplay
                  updateOptions={this.updateOptions}
                  defaultOptions={defaultOptions}
                />
              )}
              {type === triggerTypes.chat_widget.type && (
                <ChatWidget
                  updateOptions={this.updateOptions}
                  addDomain={this.addDomain}
                  defaultOptions={defaultOptions}
                />
              )}
            </Block>

          </Form>
        </MuiPaper>
        <Block className="inner-box-main">
          <Block className="heading-btn-right d-flex justify-content-between align-items-center w-100 mb-4">
            <h2 className="float-left mt-3">
              Final Step: Select Workflow
            </h2>
            <div className="">
              <MuiButton 
                size="large" 
                className="backBtn text-capitalize"
                onClick={() => this.props.history.push(`/page/${this.props.match.params.id}/triggers`)}>
                  <KeyboardBackspaceIcon/>
                  {' '}
                  Back
              </MuiButton>
              {type === triggerTypes.keywordmsg.type &&
                options.keywords &&
                options.keywords.length > 0 && (
                  <MuiButton
                      variant="contained"
                      color="primary"
                      size="medium"
                      className="saveBtn text-capitalize"
                      onClick={this.handleSave}
                  >
                      <span className="font-size-2">Save and Complete</span>
                  </MuiButton>
                )}
              {type !== triggerTypes.keywordmsg.type && (
                <MuiButton
                    variant="contained"
                    color="primary"
                    size="medium"
                    className="saveBtn text-capitalize"
                    onClick={this.handleSave}
                >
                    <span className="font-size-2">Save and Complete</span>
                </MuiButton>
              )}
              
            </div>

            
          </Block>
          <Block
            className={`trigger-main-left ${!this.isFinalSectionEnabled(type) ? 'blur-section' : ''
              }`}
          >
            <MuiGrid container spacing={1} className="grid-inner-block">
              <MuiGrid item xs={4}>
                
                <Block
                  className="sequence-inner add-new-workflow"
                  onClick={this.addNewWorkflow}
                >
                  {/*<h6 className="sq-titlesm">
                                        New Work Flow
                                    </h6>*/}
                  <Block className="add-plus-icon-outer">
                    <AddTriggerButton></AddTriggerButton>
                    
                  </Block>
                  
                  <br/>
                  <h3 className="sq-title">
                    Add New Work Flow
                  </h3>
                </Block>
              </MuiGrid >
              {workflows &&
                workflows.length > 0 &&
                workflows.map(w => (
                  <MuiGrid 
                    item
                    key={w.uid}
                    xs={4}
                    onClick={() => this.onSelectWorkflow(w)}
                  >
                    <Block
                      className={`sequence-inner ${workflowUid === w.uid
                        ? 'active'
                        : ''
                        }`}
                    >
                      {/*<h6 className="sq-titlesm">
                                                Last edited <span>04/03</span>
                                            </h6>*/}
                      <h3 className="sq-title">
                        {w.name}
                      </h3>
                      <Image
                        src={sequenceGraph}
                        size="huge"
                        className="graph"
                      />
                    </Block>
                  </MuiGrid >
                ))}
            </MuiGrid>
          </Block>

          {/*<Block className="paginationCol">
                        <Pagination
                            defaultActivePage={1}
                            firstItem={null}
                            lastItem={null}
                            pointing
                            secondary
                            totalPages={3}
                        />
                    </Block>*/}
        </Block>
      </Block>
    );
  }
}
// export default AddTriggers;
const mapStateToProps = (state, ownProps) => ({
  // ...getEngageAddState(state),
  workflows: state.default.workflows.workflows,
  loading: state.default.scenes.campaignAdd.loading,
  triggerInfo: state.default.scenes.campaignAdd.campaignAdd,
  error: state.default.scenes.campaignAdd.error,
  workflowUid: state.default.scenes.engageAdd.uid,
  triggers: state.default.campaigns.campaigns,
  pageInfo: getPageFromUrl(state, ownProps),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getPageWorkflows,
      updateNewCampaignInfo,
      getPagePosts,
      updateCampaignInfo,
      getPageCampaigns,
      getDomains,
      updateDomains
      // updateEngageInfo,
      // deleteEngageInfo,
      // addEngage,
      // updateEngage,
      // updateNewCampaignInfo,
      // deleteStepInfo,
      // getCustomFields,
      // getTags,
      // getPageWorkflowTriggers,
      // getAutomations,
      // updatePersistentMenu,
      // updateBroadcast,
      // getPageWorkflowStats
    },
    dispatch
  )
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AddTriggers)
);
