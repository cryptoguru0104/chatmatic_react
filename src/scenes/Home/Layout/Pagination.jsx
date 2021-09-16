import React, { Component } from 'react';
import { Pagination } from 'semantic-ui-react';

export default class PaginationWrapper extends Component {
    state = {
        totalPages: 0,
        activePage: 1,
        pageLimit: this.props.pageLimit || 12,
        pageData: [],
        data: this.props.data || []
    };

    componentDidMount = () => {
        this.updatePageData();
    };

    UNSAFE_componentWillReceiveProps = nextProps => {
        const { data } = this.props;
        const { data: nextData } = nextProps;
        if (
            data !== nextData
        ) {
            this.setState({ data: nextData }, () => this.updatePageData());
        }
    };

    updatePageData = () => {
        const { activePage, pageLimit, data } = this.state;
        if (data && data.length) {
            const startIndex = (activePage - 1) * pageLimit;
            const endIndex = activePage * pageLimit;
            const totalPages = Math.ceil(data.length / pageLimit);
            const pageData = data.slice(startIndex, endIndex);

            this.setState({
                totalPages,
                pageData
            });
            this.props.onPageChange(pageData);
        } else {
            this.setState({
                totalPages: 0,
                pageData: []
            });
            this.props.onPageChange([]);
        }
    };

    onPageChange = (e, { activePage }) => {
        this.setState(
            {
                activePage
            },
            () => {
                this.updatePageData();
            }
        );
    };

    render() {
        const { activePage, totalPages } = this.state;
        if (totalPages < 2) {
            return null;
        }
        return (
            <Pagination
                // defaultActivePage={1}
                firstItem={null}
                lastItem={null}
                pointing
                secondary
                activePage={activePage}
                totalPages={totalPages}
                onPageChange={this.onPageChange}
            />
        );
    }
}
