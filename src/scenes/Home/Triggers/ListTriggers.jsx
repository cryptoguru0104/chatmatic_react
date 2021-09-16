import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { Button as MuiButton, Grid as MuiGrid } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import MuiPaper from "../../../components/MuiPaper";
import VideoCard from "../../../components/VideoCard";
import MuiTypography from "../../../components/MuiTypography";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';



import {
    Dropdown,
    Statistic,
    Icon,
    // Label,
    // Table,
    // Button,
    Popup,
    Menu
} from "semantic-ui-react";
import Swal from "sweetalert2";

import { Block, Pagination, Svg } from "../Layout";
import { Area } from "../components/Charts";
import {
    getPageCampaigns,
    deleteCampaign,
    toggleTriggerActive
} from "services/campaigns/campaignsActions";
import { getSubscribersHistory } from "services/subscribers/subscribersActions";
import { getIntegrations, getIntegrationTypes } from 'scenes/Home/scenes/Settings/scenes/Integrations/services/actions';
import { triggerTypes, triggerTypesInstagram } from "constants/AppConstants";
import { numberWithCommas } from "services/utils";
import { getPageFromUrl } from "services/pages/selector";
import { getButtonHtml, getChatWidgetHtml } from "./services/CreateHtml";
import { getCampaignAdd } from "./services/selector";
import { getPageWorkflowJson } from "services/workflows/workflowsApi";
import { HtmlModal } from "./components";
import { MuiSwitch, MuiFilter, MuiPagination, MuiWidget } from "../../../components/Mui";
import "./styles.scss";
import { YoutubeSearchedForOutlined } from "@material-ui/icons";
import { updateNewCampaignInfo, updateCampaignInfo } from './services/actions';
import SubscribersPopup from "./SubscribersPopup";

import trainingVideoCover from 'assets/images/cover-triggers.png';
const daysOptions = [
    { key: 7, value: 7, text: "7 Days" },
    { key: 14, value: 14, text: "14 Days" },
    { key: 30, value: 30, text: "30 Days" }
];
class ListTriggers extends React.Component {
    //#region life cycle
    state = {
        pageTriggers: [],
        filteredTriggers: [],
        filterOptions: { field: "", searchKey: ""},
        days: 7,
        isOpenHtmlPopUp: false,
        triggerHtml: null,
        htmlType: "html",
        openMenuUid: null,
        pageNumber: 1,
        subscriberPopupTrigger: null
    };

    componentDidMount = () => {
        this.props.actions.getPageCampaigns(this.props.match.params.id);
        this.props.actions.getIntegrations(this.props.match.params.id);
        this.handleChartDays(7);
    };
    componentDidUpdate = (prevProps) => {
        const { pageNumber, filterOptions } = this.state;
        if (prevProps.triggers != this.props.triggers) {
            this.searchTriggers(filterOptions)
        }
    }
    //#endregion

    //#region functionality
    handleChartDays = days => {
        this.setState({ days });
        this.props.actions.getSubscribersHistory(
            this.props.match.params.id,
            days
        );
    };
    handleSearch = (keyword) => {
        const { filterOptions } = this.state;
        this.setState({ filterOptions: {field: filterOptions.field, searchKey: keyword}})
        this.searchTriggers({field: filterOptions.field, searchKey: keyword})
    }

    searchTriggers = (filterOptions) => {
        let filteredTriggers  = []
        if (!filterOptions.searchKey) {
            filteredTriggers = [...this.props.triggers]; 
        } else {
            console.log(filterOptions);
            if (filterOptions.field === 'name') {
                filteredTriggers = this.props.triggers.filter(item => {
                    return item.triggerName.toLowerCase().includes(filterOptions.searchKey.toLowerCase())
                })
            } else if (filterOptions.field === 'type') {
                filteredTriggers = this.props.triggers.filter(item => {
                    return this.getTriggerType(item.type).toLowerCase().includes(filterOptions.searchKey.toLowerCase())
                })
            } else {
                filteredTriggers = this.props.triggers.filter(item => {
                    return this.getTriggerType(item.type).toLowerCase().includes(filterOptions.searchKey.toLowerCase()) || item.triggerName.toLowerCase().includes(filterOptions.searchKey.toLowerCase())
                })
            }
        }
        const pageTriggers = filteredTriggers.slice(0, 10)
        this.setState({ filteredTriggers, pageTriggers });
    }
    handleCopyCode = trigger => {
        this.setState({ openMenuUid: null });
        const pageInfo = this.props.pageInfo;
        const pageId = this.props.match.params.id;
        if (trigger.type === "buttons") {
            console.log("campaignAdd:", this.props.campaignAdd);
            const options = {
                refParameter: `campaign::${this.props.campaignAdd.publicId ||
                    ""}`,
                fbId: this.props.pageInfo ? this.props.pageInfo.fbId : null,
                ...trigger.options
            };
            const triggerHtml = getButtonHtml(options);
            this.setState({
                triggerHtml,
                isOpenHtmlPopUp: true,
                htmlType: "html"
            });
        } else if (trigger.type === "chat_widget") {
            console.log("campaignAdd:", this.props.campaignAdd);
            const options = {
                refParameter: `campaign::${this.props.campaignAdd.publicId ||
                    ""}`,
                fbId: this.props.pageInfo ? this.props.pageInfo.fbId : null,
                ...trigger.options
            };
            const triggerHtml = getChatWidgetHtml(options);
            this.setState({
                triggerHtml,
                isOpenHtmlPopUp: true,
                htmlType: "html"
            });
        } else if (trigger.type === "m_dot_me") {
            const refLink = `https://m.me/${pageInfo.fbId}?ref=${trigger.options
                .customRef || trigger.options.publicId}`;
            this.setState({
                triggerHtml: refLink,
                isOpenHtmlPopUp: true,
                htmlType: "html"
            });
        } else if (trigger.type === "json") {
            try {
                Swal({
                    title: "Please wait...",
                    text: "We are loading JSON...",
                    onOpen: () => {
                        Swal.showLoading();
                    },
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false
                });
                getPageWorkflowJson(pageId, trigger.uid).then(res => {
                    Swal.close();
                    const data = res.data;
                    this.setState({
                        triggerHtml: JSON.stringify(data["json_step"], null, 2),
                        isOpenHtmlPopUp: true,
                        htmlType: "json"
                    });
                });
            } catch (error) {
                Swal.close();
                if (error) {
                    Swal.fire({
                        type: "error",
                        title: "Oops...",
                        text: "Something went wrong! Please try again."
                    });
                }
                // console.log('error', error);
            }
        }
    };

    handleOpenMenu = triggerUid => {
        this.setState({
            openMenuUid: triggerUid
        });
    };

    handleCloseMenu = () => {
        this.setState({
            openMenuUid: null
        });
    };

    onToggleSubscribersPopup = (trigger) => {
        this.setState({
            subscriberPopupTrigger: trigger
        });
    };
    //#endregion

    //#region delete trigger
    handleDeleteTrigger = triggerId => {
        this.setState({ openMenuUid: null }, () => {
            Swal({
                title: "Are you sure?",
                text: "Please verify that you want to delete this trigger",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete this trigger",
                cancelButtonText: "No, I want to keep it",
                confirmButtonColor: "#f02727"
            }).then(result => {
                if (result.value) {
                    this.props.actions.deleteCampaign(
                        this.props.match.params.id,
                        triggerId
                    );
                }
            });
        });
    };
    //#endregion

    //#region render
    renderTriggers = triggers => {
        const { openMenuUid } = this.state;
        if (triggers && triggers.length > 0) {
            return triggers.map((t, i) => (
                <TableRow key={t.uid} className="trigger-row">
                    <TableCell className="actionTD">
                        <Popup
                            className="table-popup-menu-outer"
                            content={
                                <Menu vertical className="table-popup-menu">
                                    <Menu.Item
                                        as={Link}
                                        to={`/page/${this.props.match.params.id}/triggers/${t.uid}/edit`}
                                    >
                                        <Icon name="pencil" />
                                        Edit
                                    </Menu.Item>
                                    {t.type === "m_dot_me" && (
                                        <Menu.Item
                                            // icon="copy"
                                            // text="Copy Link URL"
                                            onClick={() =>
                                                this.handleCopyCode(t)
                                            }
                                        >
                                            <Icon name="copy" />
                                            Copy Link URL
                                        </Menu.Item>
                                    )}
                                    {t.type === "buttons" && (
                                        <Menu.Item
                                            // icon="copy"
                                            // text="Copy Button HTML"
                                            onClick={() =>
                                                this.handleCopyCode(t)
                                            }
                                        >
                                            <Icon name="copy" />
                                            Copy Button HTML
                                        </Menu.Item>
                                    )}
                                    {t.type === "chat_widget" && (
                                        <Menu.Item
                                            // icon="copy"
                                            // text="Copy JSON"
                                            onClick={() =>
                                                this.handleCopyCode(t)
                                            }
                                        >
                                            <Icon name="copy" />
                                            Copy Chat Widget HTML
                                        </Menu.Item>
                                    )}
                                    {t.type === "json" && (
                                        <Menu.Item
                                            // icon="copy"
                                            // text="Copy JSON"
                                            onClick={() =>
                                                this.handleCopyCode(t)
                                            }
                                        >
                                            <Icon name="copy" />
                                            Copy JSON
                                        </Menu.Item>
                                    )}
                                    <Menu.Item
                                        // icon="trash"
                                        // text="Delete"
                                        as="button"
                                        onClick={() =>
                                            this.handleDeleteTrigger(t.uid)
                                        }
                                    >
                                        <Icon name="trash" />
                                        Delete
                                    </Menu.Item>
                                </Menu>
                            }
                            // key={}
                            // header={}
                            position="bottom left"
                            on="click"
                            open={openMenuUid === t.uid}
                            onOpen={() => this.handleOpenMenu(t.uid)}
                            onClose={this.handleCloseMenu}
                            trigger={<button className="action-button"><Icon name="ellipsis horizontal" /></button>}
                        />
                    </TableCell>
                    <TableCell className="trigger-name">{t.triggerName}</TableCell>
                    <TableCell style={{position: 'relative'}}>
                        {t.subscribers.length > 0 && <span className="subscribers-popup-link" onClick={e => this.onToggleSubscribersPopup(t)}>{t.subscribers.length}</span>}
                        {t.subscribers.length == 0 && "0"}
                    </TableCell>
                    <TableCell>{t.messagesDelivered}</TableCell>
                    <TableCell>{t.messagesRead}</TableCell>
                    <TableCell>{t.messagesClicked}</TableCell>
                    <TableCell>
                        {t.type ? this.getTriggerType(t.type) : ""}
                    </TableCell>
                    <TableCell>
                        <MuiSwitch onChange={this.handleActiveTrigger(t.uid)}  defaultChecked={t.active}></MuiSwitch>
                    </TableCell>
                </TableRow>
            ));
        }
        return null;
    };

    handleActiveTrigger = (triggerId) => (e) => {
        const pageId = this.props.match.params.id;
        
        if (e.target.checked) {
            Swal({
                title: "Trigger was enabled",
                text: "This trigger will start sending messages again to anyone who subscribers.",
                allowOutsideClick: true,
                allowEscapeKey: true,
                allowEnterKey: false
            }).then(()=>{
                this.props.actions.toggleTriggerActive(pageId, triggerId);
            });
        } else {
            Swal({
                title: "Trigger was disabled",
                text: "This trigger will stop sending messages again to anyone who subscribers.",
                allowOutsideClick: true,
                allowEscapeKey: true,
                allowEnterKey: false
            }).then(()=>{
                this.props.actions.toggleTriggerActive(pageId, triggerId);
            });
        }
    }
    getTriggerType = (type) => {
        if (this.props.pageInfo.source === 'ig') {
            return triggerTypesInstagram[type].text
        }
        return triggerTypes[type].text
    }
    //#endregion

    render() {
        const {
            triggers,
            loading,
            subscribersHistory,
            daysLoading
        } = this.props;
        const {
            pageTriggers,
            filteredTriggers,
            days,
            isOpenHtmlPopUp,
            triggerHtml,
            htmlType
        } = this.state;
        
        // console.log('iinthe function')
        if (loading && (!triggers || (triggers && triggers.length === 0))) {
            Swal({
                title: "Please wait...",
                text: "We are fetching trigger...",
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else {
            Swal.close();
        }

        const chatData = {};
        let totalSubs = 0;
        if (subscribersHistory && subscribersHistory.length > 0) {
            // console.log('subscribersHistory', subscribersHistory)
            totalSubs = subscribersHistory[subscribersHistory.length - 1].total;
            subscribersHistory.map(s => {
                chatData[s.date] = s.total;
                return true;
            });
        }

        return (
            <Block className="main-container trigger-container mt-0">
                <HtmlModal
                    html={triggerHtml}
                    open={isOpenHtmlPopUp}
                    close={() => {
                        this.setState({
                            isOpenHtmlPopUp: false,
                            triggerHtml: null
                        });
                    }}
                    htmlType={htmlType}
                />
                {(this.state.subscriberPopupTrigger != null) && <SubscribersPopup workflowTrigger={this.state.subscriberPopupTrigger} close={() => this.setState({ subscriberPopupTrigger: null })} />}
                <Block className="triggers-page">
                    <MuiGrid container spacing={1}>
                        <MuiGrid item xs={12} md={9} className="triggers-page-content">
                            <Block className="trigger-tbl">
                                <Block className="toolbar d-flex justify-content-between align-items-start">
                                    <h2 className="float-left mt-3 mb-3 p-0">Triggers</h2>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Dropdown
                                            loading={daysLoading}
                                            className="dropdown-option"
                                            value={days}
                                            options={daysOptions}
                                            onChange={(e, { value }) =>
                                            this.handleChartDays(value)
                                            }
                                        // selection
                                        />
                                        <MuiFilter
                                            onChangeType = {(type) => {
                                                this.setState({filterOptions:{field: type, searchKey: this.state.filterOptions.searchKey}})
                                            }}
                                            onChange = {this.handleSearch}
                                            selecteField = {this.state.filterOptions.field}
                                        ></MuiFilter>
                                        <Block className="addButtonWrapper">
                                            <Link to={`/page/${this.props.match.params.id}/triggers/add`}>
                                                <MuiButton
                                                    variant="contained"
                                                    color="primary"
                                                    size="medium"
                                                    className="btn plusBtn text-capitalize"
                                                >
                                                    <AddCircleOutlineIcon />
                                                    <span className="font-size-2">Add New Trigger</span>
                                                </MuiButton>
                                            </Link> 
                                        </Block>
                                    </div>
                                </Block>
                                
                                <TableContainer className="table-content">
                                    <Table celled >
                                        
                                        <TableHead>
                                            <TableRow>
                                                <TableCell
                                                    width={1}
                                                    className="actionThead"
                                                >
                                                    Actions
                                                </TableCell>
                                                <TableCell className="trigger-name">
                                                    Trigger Name
                                                </TableCell>
                                                <TableCell>
                                                    Subscribers
                                                </TableCell>
                                                <TableCell>
                                                    Delivered
                                                </TableCell>
                                                <TableCell>Read</TableCell>
                                                <TableCell>Clicked</TableCell>
                                                <TableCell>
                                                    Widget Type
                                                </TableCell>
                                                <TableCell>
                                                    Active
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>

                                        {triggers && triggers.length > 0 && (
                                            <TableBody>
                                                {this.renderTriggers(pageTriggers)}
                                            </TableBody>
                                        )}
                                        
                                    </Table>
                                    {(!triggers || triggers.length === 0) && (

                                        <div className="empty-section">
                                            <div><Svg name="list-empty" /></div>
                                            <h4>Trigger list is empty</h4>
                                            <label>Create one-off flows to promote flash sales, events or product launches.</label>
                                            <div className="button-wrapper">
                                                <Link to={`/page/${this.props.match.params.id}/triggers/add`}>
                                                    <MuiButton
                                                        variant="contained"
                                                        color="secondary"
                                                        size="medium"
                                                        className="btn plusBtn text-capitalize"
                                                    >
                                                        <AddCircleOutlineIcon />
                                                        <span className="font-size-2">Add New Trigger</span>
                                                    </MuiButton>
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </TableContainer>
                               
                                <Block className="paginationCol">
                                    {filteredTriggers && filteredTriggers.length > 0 && (
                                        <MuiPagination 
                                            count={Math.ceil(filteredTriggers.length / 10)} 
                                            shape="rounded"
                                            onChange={(event, page) => {
                                                const pageTriggers = filteredTriggers.slice(10 * (page - 1), 10 * page);
                                                this.setState({ pageTriggers, pageNumber: page })
                                            }}/>
                                    )}
                                </Block>
                            </Block>
                        </MuiGrid>
                        <MuiGrid item xs={12} md={3} className="triggers-page-right" >
                            <MuiPaper className="text-block">
                                <h3>
                                    Getting Started With Triggers
                                </h3>
                                <div>
                                Triggers are our way of saying "how to get subscribers into your workflows" and currently we have 5 built into our system you can use. <br />
                                <ul style={{paddingLeft: '15px'}}>
                                    <li><b>Keyword Message</b> - this allows you to set phrases or individual words that, if someone DM's them to your page, your bot can respond. </li>
                                    <li><b>Stories Mention</b> - if someone tags your brand in a stories post, you can automatically reply to them in a private DM. Great for getting influencers and just thanking people for tagging you and giving them some gift.</li>
                                    <li><b>Autoresponse</b> - This allows you to set a "catch all" workflow that will respond if someone DM's you but there's no Keyword Message that matches.</li>
                                    <li><b>Private Reply</b> - This allows you to private message anyone who comments on your posts on Instagram. Please Note, you can only send ONE ITEM in the first message of a private reply.</li>
                                    <li><b>Ads</b> - this will allow you to pull the JSON from a sequence and upload to your facebook ads interface so the ad will trigger your premade sequence.</li>
                                </ul>
                                <br />
                                For more information on Triggers - Please see the video below
                                </div>
                            </MuiPaper>   
                            <MuiPaper>
                                    <div>
                                        <h2>
                                            Latest Training
                                        </h2>
                                    </div>
                                    <VideoCard src="https://youtu.be/q5JZFfpn5ww" coverImage={trainingVideoCover} videoId="q5JZFfpn5ww"></VideoCard>
                                </MuiPaper>     
                        </MuiGrid>
                    </MuiGrid>
                    
                </Block>
            </Block>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        pageId: ownProps.match.params.id,
        triggers: state.default.campaigns.campaigns,
        loading: state.default.campaigns.loading,
        daysLoading: state.default.subscribers.loading,
        subscribersHistory: state.default.subscribers.subscribersHistory,
        pageInfo: getPageFromUrl(state, ownProps),
        campaignAdd: getCampaignAdd(state)
    };
};
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            getPageCampaigns,
            getSubscribersHistory,
            deleteCampaign,
            updateCampaignInfo,
            toggleTriggerActive,
            getIntegrations
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ListTriggers)
);
