import React from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import { List } from "semantic-ui-react";
import Header from "../../components/Header";

import { Block, Pagination } from "../../Home/Layout";
import { Link } from "react-router-dom";
import { getPageTemplates } from "services/workflows/workflowsActions";
import { getUserCards } from "services/auth/authActions";
import { getPageFromUrl } from 'services/pages/selector';
// import { template } from 'lodash';
// import imgPlaceholder from 'assets/images/Image.png';
import TemplateCard from "./TemplateCard";
import "../style.scss";

const categories = [
    "Ecommerce",
    "Digital Products",
    "Health & Fitness",
    "Local Business",
    "General",
    "Free"
];
// const randomColor = (category) => {
//     const colors = [
//         'blue',
//         'lightGreen',
//         'orange',
//         'lightBlue',
//         'voilet'
//     ];
//     return colors[categories.findIndex(c => c === category)];
// }

class Templates extends React.Component {
    state = {
        category: null,
        templateData: null,
        showTemplateModal: false,
        pageTemplates: []
    };

    componentDidMount = () => {
        this.props.actions.getPageTemplates(null);
        this.handleChangeCategory(this.state.category);
        document.getElementById("main").style.overflow = "auto";
    };

    UNSAFE_componentWillReceiveProps = ({ page, loading, error, templates }) => {
        if ((!templates || (templates && templates.length === 0)) && loading) {
            Swal({
                name: "Please wait...",
                text: "We are loading templates...",
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (!loading && error) {
            Swal.fire({
                type: "error",
                name: "Oops...",
                text: error || "Something went wrong! Please try again."
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
    };

    handleChangeCategory = category => {
        const { templates: allTemplates } = this.props;
        let templates = allTemplates;
        console.log("category", category);
        if (category && category === "Free") {
            templates = allTemplates.filter(t => Number(t.price) === 0);
        } else if (category) {
            templates = allTemplates.filter(t => t.category === category);
        }

        this.setState({
            category,
            templates
        });
    };

    handleShareButtonClick = item => {
        this.props.history.push("/template/" + item.uid);
    };

    render() {
        // console.log('iinthe function')
        const { category, pageTemplates, templates } = this.state;

        return (
            <div
                className="d-flex flex-column position-relative template-container"
                id="templates-view"
            >
                <Block className="main-container trigger-newo templates-container">
                    <Block className="inner-box-main">
                        <Block className="float-left w-100">
                            <h2 className="title-head no-padding float-left">
                                Templates
                            </h2>
                        </Block>

                        <Block className="add-temp-middle-tab">
                            <Block className="edit-listing">
                                <List horizontal>
                                    <List.Item
                                        className={`${
                                            !category ? "active" : ""
                                        }`}
                                    >
                                        <Link
                                            onClick={() =>
                                                this.handleChangeCategory(null)
                                            }
                                            to="#"
                                        >
                                            All Products
                                        </Link>
                                    </List.Item>
                                    {categories.map((c, i) => (
                                        <List.Item
                                            className={`${
                                                c === category ? "active" : ""
                                            }`}
                                            key={i}
                                        >
                                            <Link
                                                onClick={() =>
                                                    this.handleChangeCategory(c)
                                                }
                                                to="#"
                                            >
                                                {c}
                                            </Link>
                                        </List.Item>
                                    ))}
                                </List>
                            </Block>
                        </Block>
                        <Block className="choose-sequence-box choose-work-temp-btm select-template-box row">
                            {pageTemplates &&
                                pageTemplates.map((t, i) => (
                                    <TemplateCard
                                        item={t}
                                        index={i}
                                        buttonText="Share Url"
                                        onButtonClick={
                                            this.handleShareButtonClick
                                        }
                                        key={i}
                                        sourceIconVisible={true}
                                    />
                                ))}
                        </Block>
                        <Block className="paginationCol">
                            <Pagination
                                pageLimit={6}
                                onPageChange={pageTemplates =>
                                    this.setState({ pageTemplates })
                                }
                                data={templates}
                            />
                        </Block>
                    </Block>
                </Block>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            getPageTemplates,
            getUserCards
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
    )(Templates)
);
