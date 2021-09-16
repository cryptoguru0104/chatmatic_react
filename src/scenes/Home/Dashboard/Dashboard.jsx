import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, withRouter } from "react-router-dom";
import {
    Input,
    Button,
    Icon,
    // Progress,
    Grid
} from "semantic-ui-react";
import { Button as MuiButton, Grid as MuiGrid, Box as MuiBox, Select, MenuItem, FormControlLabel, Checkbox, Typography} from "@material-ui/core";
import MuiTypography from "../../../components/MuiTypography";
import { MuiWidget, MuiSwitch } from "../../../components/Mui";
import VideoCard from "../../../components/VideoCard";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import { Block, Svg } from "../Layout";
import { LineChat } from "../components/Charts";
import { SelectFbIgModal, AddNewPageModal, CarouselCard, CarouselTopBtnCard } from "./components";
import { getPages, getRecentSubscribers } from "services/pages/pagesActions";

import SearchBar from "../../../components/SearchText";
import CircleFacebookIcon from "assets/images/icon-facebook-circle.svg";
import CircleInstagramIcon from "assets/images/icon-instagram-circle.svg";
import InstagramIcon from '@material-ui/icons/Instagram';
import { Card , CardContent } from '@material-ui/core';
import './styles.scss';
import Constants from 'config/Constants';
import Swal from "sweetalert2";
import FacebookIcon from "assets/images/icon-facebook.svg";
import YoutubeIcon from "assets/images/icon-youtube.svg";
import SupportDeskIcon from "assets/images/icon-supportdesk.svg";
import trainingVideoCover1 from 'assets/images/cover-triggers.png';
import trainingVideoCover2 from 'assets/images/cover-broadcasts.png';
import trainingVideoCover3 from 'assets/images/cover-training.png';
import moment from 'moment';
import { dropRight } from "lodash";
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'components';
import { PreviewTemplateModal } from "../WorkFlows/components";
const fileContentStyle = {
    objectFit: "cover"
    // borderRadius: 18
};

class Dashboard extends React.Component {
    //#region life cycle
    constructor(props) {
        super(props);
        const { updates } = props;
        // const updates = [...props.updates, ...props.updates, ...props.updates];
        this.state = {
            pages: props.pages,
            allPages: props.pages,
            pageSearch: "",
            updates,
            activeUpdateIndex: 0,
            isNextUpdate: updates && updates.length > 1 ? true : false,
            isPrevUpdate: false,
            addPageModal: false,
            selectFbIgModal: false,
            seletedPageType: '',
            isFiltering: false,
            filterType: 'all',
            filterActiveOnly: false,
            recentDays: 7,
            previewingTemplate: null,
        };
    }

    componentDidMount = () => {
        // this.props.actions.getPages();
    };
    componentDidUpdate(prevProps) {
        const { pages, updates } = this.props;
        const { pageSearch } = this.state;

        if (
            JSON.stringify(prevProps.pages) != JSON.stringify(pages) ||
            JSON.stringify(updates) != JSON.stringify(prevProps.updates)
        ) {
            this.setState(
                {
                    allPages: pages,
                    selectFbIgModal: !pages || pages.length == 0,
                    updates,
                    isNextUpdate: updates && updates.length > 1 ? true : false
                },
                () => {
                    this.onPageSearch(pageSearch);
                }
            );
        }
    }
    //#endregion

    //#region functionality
    onPageSearch = pageSearch => {
        const { allPages } = this.state;
        if (pageSearch && pageSearch.trim() !== "") {
            const pages = allPages.filter(p =>
                p.fbName.toLowerCase().includes(pageSearch.trim().toLowerCase())
            );
            this.setState({
                pageSearch,
                pages
            });
        } else {
            this.setState({
                pageSearch: "",
                pages: allPages
            });
        }
    };

    clearPageSearch = () =>
        this.setState(({ allPages }) => ({ pages: allPages, pageSearch: "" }));

    openPage = pageId => {
        this.props.history.push(`/page/${pageId}`);
    };

    prevUpdate = () => {
        const {
            updates,
            activeUpdateIndex: indexNow,
            isPrevUpdate
        } = this.state;
        if (isPrevUpdate) {
            this.setState({
                isNextUpdate: true,
                activeUpdateIndex: indexNow - 1,
                isPrevUpdate: updates && updates[indexNow - 2] ? true : false
            });
        }
    };

    nextUpdate = () => {
        const {
            updates,
            activeUpdateIndex: indexNow,
            isNextUpdate
        } = this.state;
        if (isNextUpdate) {
            this.setState({
                isNextUpdate: updates && updates[indexNow + 2] ? true : false,
                activeUpdateIndex: indexNow + 1,
                isPrevUpdate: true
            });
        }
    };

    renderStatistics = (title, count, percent) => {
        const style = "statistics-container " + title.replace(/ /g, '');
        return (<Card className={style} alignItems='center'>
                    <div className="card-content">
                        <h5>{title}</h5>
                        {   
                            percent > 0 &&
                                <div className="page-statistics">
                                    <div className="number">
                                        <h3 className="count">{count || 0}</h3>
                                        <div className="percent"><span>+{percent}%</span></div>
                                    </div>
                                    <div><Svg name="arrowupright" className={title=="Workflows"?"green":""} /></div>
                                </div> 
                        }
                        {    
                            percent == 0 &&
                                <div className="page-statistics">
                                    <div className="number">
                                        <h3 className="count">{count || 0}</h3>
                                        <div className="percent"><span>{' '+percent}%</span></div>
                                    </div>
                                </div> 
                        }
                        {
                            percent < 0 &&
                                <div className="page-statistics">
                                     <div className="number">
                                        <h3 className="count">{count || 0}</h3>
                                        <div className="percent"><span>-{percent}%</span></div>
                                    </div>
                                    <div><Svg name="arrowdownright" className={title=="Workflows"?"green":""} /></div>
                                </div>
                        } 
                    </div>
                </Card>);
    };

    _getRecentSubscribers = (days) => {
        this.props.actions.getRecentSubscribers(days);
    }

    handleCloseSelectFbIgModal = () => {
        this.setState({ selectFbIgModal: false });
    };

    handleSelectPageType = (pageType) => {
        this.setState({ seletedPageType: pageType});
        this.setState({ addPageModal: true});
    }

    handleCloseNewPageModal = () => {
        this.setState({ addPageModal: false });
        this.props.actions.getPages();
    };

    toggleFilterType = (type) => e => {
        const { filterType } = this.state;
        this.setState({
            filterType: e.target.checked ? (filterType == '' ? type : 'all') : (filterType == 'all' ? (type == 'fb' ? 'ig' : 'fb') : '')
        });
    };
    //#endregion

    render() {
        const {
            totalPages,
            totalSequences,
            totalSubscribers,
            totalRecentSubscribers,
            tips,
            templates,
            currentUser,
            loading
        } = this.props;

        const {
            pageSearch,
            updates,
            activeUpdateIndex,
            isNextUpdate,
            isPrevUpdate,
            selectFbIgModal,
            seletedPageType,
            addPageModal,
            filterType,
            filterActiveOnly,
            recentDays,
            previewingTemplate
        } = this.state;
        console.log(this.state.seletedPageType);
        let newSubsPer = 0;
        let totalSubs = 0;
        let chartData = {};
        if (totalSubscribers && totalSubscribers.length > 0) {
            totalSubs = totalSubscribers[0].total;
            let prevCount = 0, currentCount = 0, currentSub = null;
            for(var i = recentDays-1; i >=0; i--) {
                currentSub = totalSubscribers.find(s => moment(s.date).format('YYYY-MM-DD') == moment().add(-1 * i, 'days').format('YYYY-MM-DD'));
                currentCount = currentSub ? currentSub.total : prevCount;
                chartData[moment().add(-1 * i, 'days').format('DD.MM.YY')] = currentCount;
                prevCount = currentCount;
            }
        }
        else {
            for(var i = recentDays-1; i >=0; i--) {
                chartData[moment().add(-1 * i, 'days').format('DD.MM.YY')] = 0;
            }
        }
        if (
            totalSubscribers &&
            totalSubscribers.length > 0 &&
            totalRecentSubscribers
        ) {
            newSubsPer = ((totalRecentSubscribers / totalSubs) * 100).toFixed(
                0
            );
        }

        const pages = this.state.pages.filter(p => {
            if(!p.isConnected) return false;
            if(filterType != 'all' && p.source != filterType) return false;
            if(filterActiveOnly && p.subscribers <= 0) return false;
            return true;
        });
        if (loading) {
            Swal({
                title: "Please wait...",
                text: "We are fetching pages...",
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

        return (
            <Block className="main-container dashboard-container mt-0">
                {selectFbIgModal && (
                    <SelectFbIgModal
                        open={selectFbIgModal}
                        close={this.handleCloseSelectFbIgModal}
                        selectPageType={this.handleSelectPageType}
                    />
                )}
                {addPageModal && (
                    <AddNewPageModal
                        open={addPageModal}
                        close={this.handleCloseNewPageModal}
                        pageType={seletedPageType}
                    />
                )}
                {previewingTemplate && (
                    <PreviewTemplateModal
                        open={true}
                        close={() => this.setState({previewingTemplate: null})}
                        templateData={previewingTemplate}
                        id={this.props.match.params.id}
                    />
                )}
                <Block className="inner-box-main">
                    <MuiGrid container spacing={1} className="dashboard-block">
                        <MuiGrid item xs={12} md >
                            <MuiWidget fullHeight fitParent className="dashboard-block-pages">
                                <MuiGrid container justify="flex-start" alignItems="stretch" className="filter-wrapper">
                                    <SearchBar
                                        placeholder="Search page by name..."
                                        value={pageSearch}
                                        onChange={e =>
                                            this.onPageSearch(e.target.value)
                                        }
                                    />
                                    <MuiButton onClick={() => this.setState({ isFiltering: !this.state.isFiltering })} className="btn-advanced-search">
                                    {!this.state.isFiltering && <Svg name="equalizer"></Svg>}
                                    {this.state.isFiltering && <span>X</span>}</MuiButton>

                                    {this.state.isFiltering && <Block className="advanced-filter-wrapper">
                                        <Block className="filter-row">
                                            <Block className="img-circle fb"><i className="fa fa-facebook" />
                                            </Block>
                                            <label>Only Facebook Pages</label>
                                            <Checkbox checked={this.state.filterType == 'all' || this.state.filterType == 'fb'} onChange={this.toggleFilterType('fb')} name="CheckboxFilterSubscribers" color="primary" />
                                        </Block>
                                        <Block className="filter-row">
                                            <Block className="img-circle ig"><InstagramIcon style={{color:"white", fontSize:"30px"}}/>
                                            </Block>
                                            <label>Only Instagram Pages</label>
                                            <Checkbox checked={this.state.filterType == 'all' || this.state.filterType == 'ig'} onChange={this.toggleFilterType('ig')} name="CheckboxFilterSubscribers" color="primary" />
                                        </Block>
                                    </Block>}
                                </MuiGrid>

                                <Block className="filter-search-subscribers">
                                    <FormControlLabel control={
                                        <Checkbox checked={this.state.filterActiveOnly || false} onChange={() => this.setState({
                                            filterActiveOnly: !this.state.filterActiveOnly
                                        })} name="CheckboxFilterSubscribers" color="primary" /> }
                                        label="Only Show Pages With Subscribers"
                                    />
                                </Block>


                                <Block className="addnewField">
                                    {pages &&
                                        pages.length > 0 &&
                                        pages.map(p => (
                                            <Block
                                                onClick={() =>
                                                    this.openPage(p.uid)
                                                }
                                                key={p.uid}
                                                className="side-listing align-items-center"
                                            >
                                                <Block className="img-circle">
                                                    {p.source === 'fb' && <img
                                                        src={`https://graph.facebook.com/${p.fbId}/picture?type=small`}
                                                        alt="user"
                                                    />}
                                                    {p.source === 'ig' && <InstagramIcon style={{color:"white", fontSize:"30px"}}/>}
                                                </Block>
                                                <Block className="list-text flex-grow-1">
                                                    <h3>{p.fbName}</h3>
                                                    <Block className="list-bottom">
                                                        <Block className="username">
                                                            <Icon name="users" />{" "}
                                                            {p.subscribers}
                                                            <span>
                                                                {" "}
                                                                +
                                                                {
                                                                    p.recentSubscribers
                                                                }
                                                            </span>
                                                        </Block>
                                                        <Block className="calander">
                                                            <Icon name="calendar alternate" />{" "}
                                                            {p.sequences}{" "}
                                                            {/* <span>+17</span> */}
                                                        </Block>
                                                    </Block>
                                                </Block>
                                                <Block className="page-type-icon">
                                                    {p.source === "fb" && (
                                                        <img
                                                            src={
                                                                CircleFacebookIcon
                                                            }
                                                        />
                                                    )}
                                                    {p.source === "ig" && (
                                                        <img
                                                            src={
                                                                CircleInstagramIcon
                                                            }
                                                        />
                                                    )}
                                                </Block>
                                            </Block>
                                        ))}
                                </Block>
                                <MuiButton
                                    variant="contained"
                                    color="primary"
                                    size="medium"
                                    onClick={() =>
                                        this.setState({ selectFbIgModal: true })
                                    }
                                    className="btn plusBtn text-capitalize"
                                >
                                    <AddCircleOutlineIcon />
                                    <span className="font-size-2">
                                        Add A new fan page
                                    </span>
                                </MuiButton>
                            </MuiWidget>
                        </MuiGrid>
                        <MuiGrid item xs={12} md={7}>
                            <MuiGrid container spacing={1} className="stats-content">
                                <MuiGrid item xs={6} md={4}>
                                    {this.renderStatistics('Total Pages', totalPages, 3)}
                                </MuiGrid>
                                <MuiGrid item xs={6} md={4}>
                                    {this.renderStatistics('Total Subscribers', totalSubs, newSubsPer)}
                                </MuiGrid>
                                <MuiGrid item xs={12} md={4}>
                                    {this.renderStatistics('Workflows', totalSequences, 0)}
                                </MuiGrid>

                                <MuiGrid item xs={12}>
                                    <MuiWidget>
                                        <Grid container style={{justifyContent: "space-between"}}>
                                            <Grid item xs={6}><h2>Subscribers Graphs</h2></Grid>
                                            <Grid item xs={6}>
                                            <UncontrolledDropdown
                                                style={{ width: 150, height: 40, borderRadius: 20, float: 'right' }}
                                            >
                                                <DropdownToggle
                                                className="py-0 font-weight-normal d-flex justify-content-between align-items-center h-100 w-100"
                                                style={{
                                                    borderWidth: 0,
                                                    borderRadius: 20,
                                                    backgroundColor: '#F3F5F9',
                                                    border: '1px solid #F8F9FC',
                                                    boxShadow: 'none',
                                                    zIndex: 999
                                                }}
                                                caret
                                                >
                                                {this.state.recentDays + ' Days'}
                                                </DropdownToggle>

                                                <DropdownMenu
                                                style={{
                                                    width: '100%',
                                                    marginLeft: -5,
                                                    marginTop: 0,
                                                    padding: 0,
                                                    boxShadow: 'none',
                                                    border: '1px solid #ebebeb'
                                                }}
                                                >
                                                <DropdownItem onClick={() => this.setState({ recentDays: 7 })}>
                                                    7 Days
                                                </DropdownItem>
                                                <DropdownItem onClick={() => this.setState({ recentDays: 14 })}>
                                                    14 Days
                                                </DropdownItem>
                                                <DropdownItem onClick={() => this.setState({ recentDays: 30 })}>
                                                    30 Days
                                                </DropdownItem>
                                                {/*<DropdownItem onClick={() => this.setState({ recentDays: -1 })}>*/}
                                                {/*All Time*/}
                                                {/*</DropdownItem>*/}
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                            </Grid>
                                        </Grid>
                                            {chartData && <LineChat data={chartData} height={200}/>}
                                    </MuiWidget>
                                </MuiGrid>
                                <MuiGrid item xs={12} md={6}>
                                    <Block className="tips-section">
                                        <Block className="carousal-col">
                                            <CarouselTopBtnCard title="Featured Templates"
                                            >
                                                {templates &&
                                                    templates.length > 0 &&
                                                    templates.map(t => (
                                                        <Block className="slider-item-wrapper" key={t.id}>
                                                            <Block className="image-wraper" style={{backgroundImage: `url(${t.pictureUrl})`}}>
                                                            </Block>
                                                            <Block className="template-title">
                                                                {t.name}
                                                            </Block>
                                                            <Block className="template-detail">
                                                                {t.description && t.description.length > 80 ? JSON.stringify(t.description).substring(0,80)+"..." : t.description}
                                                            </Block>
                                                            <Block className="btn-featured-template-button-container">
                                                                <button onClick={() => this.setState({previewingTemplate: t})} className="btn-featured-template-preview">
                                                                Get This Template
                                                                </button>
                                                            </Block>
                                                        </Block>
                                                    ))}
                                            </CarouselTopBtnCard>
                                        </Block>
                                    </Block>
                                </MuiGrid>
                                <MuiGrid item xs={12} md={6}>
                                    <Block className="update-changelog-section tips-section ">
                                        <h2>Updates & Changelog </h2>
                                        <div className="carousal-col">
                                            <CarouselCard key={Math.random()}>
                                                {updates &&
                                                    updates.length > 0 &&
                                                    updates.map((item, index) => (
                                                        <div key={index}>
                                                            <div
                                                                dangerouslySetInnerHTML={{
                                                                    __html:
                                                                        updates[
                                                                            index
                                                                        ].content
                                                                }}
                                                            ></div>
                                                        </div>
                                                    ))}
                                            </CarouselCard>
                                        </div>
                                       
                                    </Block>
                               
                                </MuiGrid>
                            </MuiGrid>
                        </MuiGrid>
                        <MuiGrid item xs={12} md>
                            <MuiGrid container spacing={1} className="right-side">
                                <MuiGrid item xs={12}>
                                  
                                       
                                        <MuiGrid
                                            container
                                            alignItems="center"
                                            className="right-side-video-card"
                                        >    
                                            <MuiGrid item xs={12}>
                                                <h2>Tips & Tricks</h2>
                                            </MuiGrid>
                                            <MuiGrid container spacing={2}>
                                                <MuiGrid item xs={5} style={{marginBottom: '5px'}}>
                                                    <VideoCard src="https://youtu.be/q5JZFfpn5ww" coverImage={trainingVideoCover1} videoId="q5JZFfpn5ww"></VideoCard>
                                                </MuiGrid>
                                                <MuiGrid item xs={7}>
                                                    <MuiTypography fontSize="18px">
                                                        Training Videos
                                                    </MuiTypography>
                                                </MuiGrid>
                                            </MuiGrid>
                                            <MuiGrid container spacing={2}>
                                                <MuiGrid item xs={5}>
                                                    <VideoCard src="https://youtu.be/jANom36p3aE" coverImage={trainingVideoCover2} videoId="jANom36p3aE"></VideoCard>
                                                </MuiGrid>
                                                <MuiGrid item xs={7}>
                                                    <MuiTypography fontSize="18px">
                                                    New Broadcast Walkthrough
                                                    </MuiTypography>
                                                </MuiGrid>
                                            </MuiGrid>
                                            <hr/>
                                            <Block className="button-container">
                                                <MuiButton className="see-more-button text-capitalize">
                                                    <span className="font-size-2">
                                                        <a href={Constants.trainingVideoUrl} className="see-more-label" target="_blank">See More</a>
                                                    </span>
                                                    <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1.25 3.375H11.25" stroke="#15205B" strokeLinecap="round"/>
                                                        <path d="M9.375 0.9375L11.8125 3.375L9.375 5.8125" stroke="#15205B" strokeLinecap="round"/>
                                                    </svg>
                                                </MuiButton>
                                            </Block>   
                                        </MuiGrid>
                                    
                                </MuiGrid>
                                <MuiGrid item xs={12}>
                                    <Block className="right-side-video-card">
                                        <MuiGrid container justify="space-between">
                                            <h2>
                                                Latest Training
                                            </h2>
                                            <Block className="button-container">
                                                <MuiButton className="see-more-button text-capitalize">
                                                    <span className="font-size-2 see-more-label">
                                                        <a href={Constants.trainingVideoUrl} className="see-more-label" target="_blank">See More</a>
                                                    </span>
                                                    <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1.25 3.375H11.25" stroke="#15205B" strokeLinecap="round"/>
                                                        <path d="M9.375 0.9375L11.8125 3.375L9.375 5.8125" stroke="#15205B" strokeLinecap="round"/>
                                                    </svg>
                                                </MuiButton>
                                            </Block>   
                                        </MuiGrid>
                                        <VideoCard  videoId="JUhAOwjN84M" src="https://youtu.be/JUhAOwjN84M" coverImage={trainingVideoCover3} ></VideoCard>
                                    </Block>
                                </MuiGrid>
                                <MuiGrid item xs={12} className="link-item">
                                    <MuiWidget fullHeight>
                                        <div className="link-item-content">
                                            <img src={FacebookIcon}/>
                                            <a href={`https://facebook.com/groups/chatmatic`} target="_blank">
                                                <MuiTypography component="span">
                                                    &nbsp;&nbsp;Join Our Group
                                                </MuiTypography>
                                            </a>
                                        </div>
                                    </MuiWidget>
                                </MuiGrid>
                                <MuiGrid item xs={12} className="link-item">
                                    <MuiWidget fullHeight>
                                        <div className="link-item-content">
                                            <img src={YoutubeIcon}/>
                                            <a href={`https://www.youtube.com/channel/UCDMVAdeGH3f8KJc6rD-B2WA`} target="_blank">
                                                <MuiTypography component="span">
                                                    &nbsp;&nbsp;Subscribe On Youtube
                                                </MuiTypography>
                                            </a>
                                        </div>
                                    </MuiWidget>
                                </MuiGrid>
                                <MuiGrid item xs={12} className="link-item">
                                    <MuiWidget fullHeight>
                                        <div className="link-item-content">
                                            <img src={SupportDeskIcon}/>
                                            
                                            <a href={`http://members.chatmatic.com/support`} target="_blank" >
                                                <MuiTypography component="span">
                                                    &nbsp;&nbsp;Visit Our Support Desk
                                                </MuiTypography>
                                            </a>
                                        </div>
                                    </MuiWidget>
                                </MuiGrid>
                            
                                </MuiGrid>
                        </MuiGrid>
                    </MuiGrid>
                </Block>
            </Block>
        );
    }
}

const mapStateToProps = state => ({
    // ...getEngageAddState(state),
    currentUser: state.default.auth.currentUser,
    pages: state.default.pages.pages,
    totalPages: state.default.pages.totalPages,
    loading: state.default.pages.loading,
    totalSequences: state.default.pages.totalSequences,
    totalSubscribers: state.default.pages.totalSubscribers,
    totalRecentSubscribers: state.default.pages.totalRecentSubscribers,
    updates: state.default.pages.updates,
    tips: state.default.pages.tips,
    templates: state.default.pages.templates
});
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            getPages,
            getRecentSubscribers
            // updateEngageInfo,
            // updateItemInfo,
            // addStepInfo,
            // updateStepInfo,
            // addEngage,
            // getTags,
            // getPageWorkflowTriggers
        },
        dispatch
    )
});
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);
