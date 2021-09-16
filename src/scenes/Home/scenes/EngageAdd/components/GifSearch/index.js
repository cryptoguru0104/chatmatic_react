import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';
import { debounce } from 'throttle-debounce';
import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios';

const SEARCH_PAGE_SIZE = 20;
const API_KEY =
  process.env.REACT_APP_GIPHY_KEY || 'rduCN9f6YyoCuo87ftdUoE3tLWvqkCqT';
class GifSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      searchText: '',
      page: 0,
      total: 0
    };
    this.searchThrottled = debounce(500, this._search);
  }

  componentDidMount() {
    this.searchRef.focus();
  }

  _onChange = e => {
    this.setState(
      {
        searchText: e.target.value
      },
      () => {
        if (this.state.searchText.length < 1) {
          this.setState({ images: [], page: 0, total: 0 });
          return;
        }
        this.searchThrottled(this.state.searchText);
      }
    );
  };

  _loadMore = () => {
    const { page, searchText } = this.state;
    const nextPage = page + 1;

    axios
      .get(
        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchText}&limit=${SEARCH_PAGE_SIZE}&offset=${nextPage *
          SEARCH_PAGE_SIZE}&lang=en`
      )
      .then(r => {
        this.setState({
          images: this.state.images.concat(
            r.data.data.map(i => i.images.downsized)
          ),
          page: nextPage,
          total: r.data.pagination.total_count
        });
      });
  };

  _search = q => {
    axios
      .get(
        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${q}&limit=${SEARCH_PAGE_SIZE}&offset=0&lang=en`
      )
      .then(r => {
        this.setState({
          images: r.data.data.map(i => i.images.downsized),
          page: 1,
          total: r.data.pagination.total_count
        });
      });
  };

  render() {
    const { onSave } = this.props;
    const { images, page, searchText, total } = this.state;

    return (
      <div className="d-flex flex-column action-button-container imagefinder-container p-4">
        <div className="d-flex justify-content-between action-header">
          <span> Click to Add </span>{' '}
        </div>
        <div className="form-group">
          <label> Filter: </label>{' '}
          <div className="position-relative d-flex align-items-center value-container w-100">
            <input
              ref={ref => (this.searchRef = ref)}
              type="text"
              value={searchText}
              onChange={this._onChange}
            />{' '}
          </div>
        </div>
        {images &&
          images.length > 0 && (
            <div
              className="d-flex imagelist"
              ref={ref => (this.scrollParentRef = ref)}
            >
              <InfiniteScroll
                pageStart={1}
                initialLoad={false}
                useWindow={false}
                hasMore={
                  images.length > 0 && (page + 1) * SEARCH_PAGE_SIZE < total
                }
                loadMore={this._loadMore}
                loader={'Loading...'}
                getScrollParent={() => this.scrollParentRef}
              >
                {images.map((i, x) => (
                  <div key={x} className="image">
                    <img
                      src={i.url}
                      className="img-thumbnail img-fluid"
                      onClick={() => {
                        onSave(i.url);
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

GifSearch.propTypes = {
  onSave: PropTypes.func.isRequired
};

export default GifSearch;
