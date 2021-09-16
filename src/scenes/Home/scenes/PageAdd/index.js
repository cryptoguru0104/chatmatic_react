import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { toastr } from 'react-redux-toastr';

import { connectAll } from 'services/pages/pagesActions';

/** Import Components */
import PageConnectItem from './components/PageConnectItem';

import './styles.css';

class PageAdd extends React.Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      if (nextProps.error !== this.props.error) {
        toastr.error('Error', nextProps.error);
      }
    } else {
      if (
        this.props.pages !== nextProps.pages &&
        nextProps.toggleConnectSucceed
      ) {
        toastr.success(nextProps.successText);
      }
    }
  }

  render() {
    const { loadingMsgTitle, loadingMsgBody } = this.props;

    /** show loading alert */
    if (this.props.loading) {
      Swal({
        title: loadingMsgTitle,
        text: loadingMsgBody,
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
    const pageItems = this.props.pages.map((item, index) => {
      return <PageConnectItem {...item} key={item.uid} index={index} />;
    });

    return (
      <div className="d-flex flex-column align-items-center page-add-container">
        <button
          className="btn btn-primary btn-connect-all mr-4"
          onClick={() => this.props.actions.connectAll()}
        >
          Connect All
        </button>
        <span className="description">
          Connecting all pages costs you nothing. You only need to license a
          page when it reaches 500 subscribers so our suggestion is to connect
          ALL of your pages so they start collecting data. One day you may find
          that one of your pages has 500 subscribers and you'd like to license
          it, at which time you'll see that option below and on the page
          dashboard
        </span>
        <div className="page-list-container">{pageItems}</div>
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.default.pages
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        connectAll
      },
      dispatch
    )
  })
)(PageAdd);
