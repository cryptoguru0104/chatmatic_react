import React from 'react';
import PropTypes from 'prop-types';
import Unsplash, { toJson } from 'unsplash-js';
import './styles.scss';
import { debounce } from 'throttle-debounce';
import InfiniteScroll from 'react-infinite-scroller';

const unsplash = new Unsplash({
    applicationId: process.env.REACT_APP_UNSPLASH_ACCESS_KEY,
    secret: process.env.REACT_APP_UNSPLASH_SECRET_KEY
});
const SEARCH_PAGE_SIZE = 20;

class ImageFinder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            searchText: '',
            page: 1,
            pages: 0,
            total: 0
        };
        this.searchThrottled = debounce(500, this._search);
    }

    componentDidMount() {
        this.searchRef.focus();
        unsplash.photos
            .listPhotos(1, SEARCH_PAGE_SIZE, 'latest')
            .then(toJson)
            .then(json => {
                this.setState({
                    images: json,
                    page: 1,
                    pages: 1,
                    total: SEARCH_PAGE_SIZE
                });
            });
    }

    _onChange = e => {
        this.setState({ searchText: e.target.value }, () => {
            this.searchThrottled(this.state.searchText);
        });
    };

    _loadMore = () => {
        const { page, pages, searchText } = this.state;
        const nextPage = page + 1;

        unsplash.search
            .photos(searchText, nextPage, SEARCH_PAGE_SIZE)
            .then(toJson)
            .then(json => {
                this.setState({
                    images: this.state.images.concat(json.results),
                    total: json.total,
                    page: nextPage,
                    pages: json.total_pages
                });
            });
    };

    _search = q => {
        unsplash.search
            .photos(q, 1, SEARCH_PAGE_SIZE)
            .then(toJson)
            .then(json => {
                this.setState({
                    images: json.results,
                    total: json.total,
                    page: 1,
                    pages: json.total_pages
                });
            });
    };

    render() {
        const { onSave } = this.props;
        const { images, page, pages, searchText } = this.state;

        return (
            <div className="d-flex flex-column action-button-container imagefinder-container p-4">
                <div className="d-flex justify-content-between action-header">
                    <span>Click to Add</span>
                </div>
                <div className="form-group">
                    <label>Filter:</label>
                    <div className="position-relative d-flex align-items-center value-container w-100">
                        <input
                            ref={ref => (this.searchRef = ref)}
                            type="text"
                            value={searchText}
                            onChange={this._onChange}
                        />
                    </div>
                </div>
                {images && images.length > 0 && (
                    <div
                        className="d-flex imagelist"
                        ref={ref => (this.scrollParentRef = ref)}
                    >
                        <InfiniteScroll
                            pageStart={1}
                            initialLoad={false}
                            useWindow={false}
                            hasMore={images.length > 0 && page < pages}
                            loadMore={this._loadMore}
                            loader={'Loading...'}
                            getScrollParent={() => this.scrollParentRef}
                        >
                            {images.map((i, x) => (
                                <div key={x} className="image">
                                    <img
                                        src={i.urls.regular}
                                        className="img-thumbnail img-fluid"
                                        onClick={() => {
                                            onSave(i.urls.regular);
                                        }}
                                    />
                                </div>
                            ))}
                        </InfiniteScroll>
                    </div>
                )}
            </div>
        );
    }
}

ImageFinder.propTypes = {
    onSave: PropTypes.func.isRequired
};

export default ImageFinder;
