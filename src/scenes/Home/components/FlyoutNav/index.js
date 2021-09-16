import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import $ from 'jquery';

/** import components */
import { Button, Collapse } from 'components';

/** Import selectors */
import { getConnectedPages } from 'services/pages/selector';

/** import assets */
import './styles.css';
import profileImg from 'assets/images/subscriber.png';

class FlyoutNav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      collapse: false
    };

    this.handleToggle = this.handleToggle.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handlePageItemClick = this.handlePageItemClick.bind(this);
  }

  componentWillMount() {
    // When location changes hide the flyout nav
    this.unlisten = this.props.history.listen((location, action) => {
      this.setState({
        collapse: false
      });
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  /**
   * Summary. handle toogle button click
   */
  handleToggle() {
    /** Change the arrow of toggle buutton */
    let newButtonTransform = 'rotate(0deg)';
    if (!this.state.collapse) {
      newButtonTransform = 'rotate(180deg)';
    }

    let $togglebtn = $('#globalnav-flyout-toggle div.flyout-arrow');
    $togglebtn.css('transform', newButtonTransform);

    /** toggle the collapse state */
    this.setState({
      collapse: !this.state.collapse
    });
  }

  /**
   * Summary. handle add button click
   */

  handleAdd() {
    this.props.history.push('/page/add');
  }

  handlePageItemClick(id) {
    this.props.history.push('/page/' + id);
  }

  render() {
    const pageItems = this.props.pages.map((item, index) => {
      const pageLogo = `url(//graph.facebook.com/${
        item.fbId
      }/picture?type=large)`;

      return (
        <div
          className="col-12 col-sm-6 col-lg-3 globalnav-fan-page-list-item"
          key={index}
        >
          <div className="globalnav-fan-page-title">{item.fbName}</div>
          <div className="row globalnav-fan-page-cell-container m-0">
            <div
              className="col-md-12 globalnav-fan-page-cell"
              onClick={() => {
                this.handlePageItemClick(item.uid);
              }}
            >
              <div className="row">
                <div
                  className="col-md-12 globalnav-fan-page-image"
                  style={{ backgroundImage: pageLogo }}
                />
              </div>
              <div className="row globalnav-fan-page-stats">
                <div className="col-4">
                  <div className="comment-count">{item.comments}</div>
                  COMMENTS
                </div>
                <div className="col-4">
                  <div className="subscribers-count">{item.subscribers}</div>
                  SUBSCRIBERS
                </div>
                <div className="col-4">
                  <div className="subscribers-count">{item.pageLikes}</div>
                  PAGE LIKES
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });

    let pageName = 'No selected page';
    let logoUrl = profileImg;

    const pageId = this.props.location.pathname.split('/')[2];

    if (parseInt(pageId) >= 0) {
      const page = this.props.pages.find(page => page.uid === parseInt(pageId));

      if (page) {
        pageName = page.fbName;
        logoUrl = `//graph.facebook.com/${page.fbId}/picture?type=small`;
      }
    }

    return (
      <div className="flyout-nav">
        <Collapse isOpen={this.state.collapse}>
          <div id="globalnav-flyout" className="container-fluid">
            <div id="globalnav" className="row">
              <div className="col-12 globalnav-fan-pages-listing-container shadow-sm">
                <div className="row globalnav-fan-pages">
                  <div className="col-12 col-sm-6 col-lg-3 globalnav-add-new-fan-page">
                    <Button
                      color="primary"
                      className="add-new-btn rounded-circle"
                      onClick={() => this.handleAdd()}
                    >
                      <i className="fa fa-plus" />
                    </Button>
                    <div>Add New</div>
                  </div>
                  {pageItems}
                </div>
              </div>
            </div>
          </div>
        </Collapse>

        {/* Toggle button */}
        <div
          id="globalnav-flyout-toggle"
          className="d-flex justify-content-between align-items-center"
          onClick={this.handleToggle}
        >
          <div className="profile-icon mr-3">
            <img src={logoUrl} alt="" width={'28'} />
            <span className="ml-1">{pageName}</span>
          </div>
          <div className="flyout-arrow">
            <i className="fa fa-caret-down" />
          </div>
        </div>
      </div>
    );
  }
}

FlyoutNav.propTypes = {
  pages: PropTypes.array.isRequired
};

export default withRouter(
  connect(
    state => ({
      pages: getConnectedPages(state)
    }),
    null
  )(FlyoutNav)
);
