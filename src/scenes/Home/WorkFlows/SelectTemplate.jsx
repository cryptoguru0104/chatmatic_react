import React from 'react'; import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import { List } from 'semantic-ui-react';
import { Button, Grid, IconButton } from "@material-ui/core";
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import { Block, Svg, Pagination } from '../Layout';
import { Link } from 'react-router-dom';
import { getPageTemplates } from 'services/workflows/workflowsActions';
import { getPageFromUrl } from 'services/pages/selector';
import { PreviewTemplateModal } from './components';
import { MuiPagination } from "components/Mui";
// import { template } from 'lodash';
// import imgPlaceholder from 'assets/images/Image.png';
import TemplateCard from '../../Templates/components/TemplateCard';
import './SelectTemplate.scss';

const categories = ['Ecommerce', 'Digital Products', 'Health & Fitness', 'Local Business', 'General', 'Free'];

const PAGE_ITEM_COUNT = 8;
class SelectTemplate extends React.Component {
    state = {
        category: null,
        templateData: null,
        showTemplateModal: false,
        page: 1
    }

    componentDidMount = () => {
        this.handleChangeCategory(this.state.category);
        if(this.props.page && this.props.page.source) {
            this.props.actions.getPageTemplates(this.props.page.source);
        }
    }

    UNSAFE_componentWillReceiveProps = ({ page, loading, error, templates }) => {
        if ((!templates || (templates && templates.length === 0)) && loading) {
            Swal({
                name: 'Please wait...',
                text: 'We are loading templates...',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (!loading && error) {
            Swal.fire({
                type: 'error',
                name: 'Oops...',
                text: error || 'Something went wrong! Please try again.'
            });
        } else {
            Swal.close();
        }

        if (templates !== this.props.templates) {
            this.setState(({ category }) => ({
                category,
                templates
            }));
        }

        if(this.props.page != page && page.source) {
            this.props.actions.getPageTemplates(page.source);
        }
    }

    handleChangeCategory = category => {
        const { templates: allTemplates } = this.props;
        let templates = allTemplates;
        console.log('category', category)
        if (category && category === 'Free') {
            templates = allTemplates.filter(t => Number(t.price) === 0);
        } else if (category) {
            templates = allTemplates.filter(t => t.category === category);
        }
        console.log('templates', templates)
        this.setState({
            category,
            templates,
            page: 1
        });
    }

    _handleTemplatePreview = template => {
        console.log('template', template);
        // return false;
        this.setState({
            showTemplateModal: true,
            templateData: template
        });
    }

    closeTemplateModal = () => {
        // console.log('close modal');
        this.setState({
            showTemplateModal: false,
            templateData: null
        });
    };

    render() {
        // console.log('iinthe function')
        const { category, showTemplateModal, templateData, templates, page } = this.state;
        const pageId = this.props.match.params.id;
        console.log('templates', templates);
        const pageTemplates = templates ? templates.slice(PAGE_ITEM_COUNT * (page - 1), PAGE_ITEM_COUNT * page) : [];
        return (
            <Block className="main-container select-template-container mt-4 ">
                <div>
                    {showTemplateModal && (
                        <PreviewTemplateModal
                            open={showTemplateModal}
                            close={this.closeTemplateModal}
                            templateData={templateData}
                            id={pageId}
                        />
                    )}
                    <Block className="w-100 m-0 p-0 ml-3">
                        <h2 className="title-head mt-3">
                            Workflows &gt; Select Template
                        </h2>
                    </Block>
                    <Block className="inner-box-main">
                        <Grid container className="add-temp-top-grid" justify="center" alignItems="stretch" spacing={1}>
                            <Grid item>
                                <Link to={`/page/${pageId}/workflows/add`}>
                                    <Button variant="contained" color="primary" startIcon={<ControlPointIcon />}>Blank Workflow</Button>
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link to={`/page/${pageId}/workflows/add?type=privateReply`}>
                                    <Button variant="contained" color="primary" startIcon={<ControlPointIcon />}>Private Reply</Button>
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link to={`/page/${pageId}/workflows/add?type=JSON`}>
                                    <Button variant="contained" color="primary" startIcon={<ControlPointIcon />}>Json</Button>
                                </Link>
                            </Grid>
                        </Grid>

                        <Block className="add-temp-middle-tab">
                            <Block className="edit-listing">
                                <List horizontal>
                                    <List.Item className={`${!category ? 'active' : ''}`}>
                                        <Link onClick={() => this.handleChangeCategory(null)} to="#">All Products</Link>
                                    </List.Item>
                                    {categories.map((c, i) => (
                                        <><List.Item className="separator"></List.Item>
                                        <List.Item className={`${c === category ? 'active' : ''}`} key={i}>
                                            <Link
                                                onClick={() => this.handleChangeCategory(c)}
                                                to="#"
                                            >
                                                {c}
                                            </Link>
                                        </List.Item></>
                                    ))}
                                </List>
                            </Block>
                        </Block>
                        <Grid container spacing={2} className="choose-sequence-box choose-work-temp-btm select-template-box row">
                            {pageTemplates && pageTemplates.map((t, i) => (
                                <Grid item xs={6} sm={4} md={3}><TemplateCard item={t} index={i} buttonText="Preview Template" onButtonClick={this._handleTemplatePreview} key={i}/></Grid>
                            ))
                            }
                        </Grid>
                        <Block className="paginationCol">
                            {templates && templates.length > PAGE_ITEM_COUNT && (
                            <MuiPagination 
                                count={Math.ceil(templates.length / PAGE_ITEM_COUNT)} 
                                shape="rounded"
                                onChange={(event, page) => {
                                    this.setState({ page });
                                }}/>)}
                        </Block>
                    </Block>
                </div>
            </Block>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            getPageTemplates
        },
        dispatch
    )
});

export default withRouter(
    connect(
        (state, props) => ({
            page: getPageFromUrl(state, props),
            loading: state.default.workflows.loading,
            error: state.default.workflows.error,
            templates: state.default.workflows.templates
        }),
        mapDispatchToProps
    )(SelectTemplate)
);