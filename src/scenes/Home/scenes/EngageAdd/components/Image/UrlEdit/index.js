import React from 'react';
import PropTypes from 'prop-types';
import '../styles.scss';
import Swal from 'sweetalert2';

class UrlEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: props.url
    };
  }
  componentDidMount() {
    this.saveRef.focus();
  }

  _onChange = e => {
    this.setState({ url: e.target.value });
  };

  _save = () => {
    Swal({
      title: 'Please wait...',
      text: 'Validating Image Url',
      onOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
    });

    // fetch(this.state.url, { method: 'HEAD' })
    //   .then(res => {
    //     Swal.close();
    //     if (res.ok) {
    //       this.props.onSave(this.state.url);
    //     } else {
    //       Swal({
    //         title: 'Invalid URL',
    //         text: 'This Url appears to be invalid.',
    //         type: 'error',
    //         showCancelButton: true,
    //         cancelButtonText: 'Close'
    //       });
    //     }
    //   })
    //   .catch(err => {
        // Swal.close();
        // setTimeout(() => {
        //   Swal({
        //     title: 'Invalid URL',
        //     text: 'This Url appears to be invalid.',
        //     type: 'error',
        //     showCancelButton: true,
        //     cancelButtonText: 'Close'
        //   });
        // }, 100);
    //   });
    const img = new Image();
    img.onload = () => {
      this.props.onSave(this.state.url);
    };
    img.onerror = () => {
      Swal.close();
      setTimeout(() => {
        Swal({
          title: 'Invalid URL',
          text: 'This Url appears to be invalid.',
          type: 'error',
          showCancelButton: true,
          cancelButtonText: 'Close'
        });
      }, 100);
    };
    img.src = this.state.url;
  };

  render() {
    const { url } = this.state;

    return (
      <div className="d-flex flex-column action-button-container url-modal-container">
        <div className="form-group">
          <label>Enter Url:</label>
          <div className="position-relative d-flex align-items-center value-container w-100">
            <input
              className="px-3"
              ref={ref => (this.saveRef = ref)}
              type="text"
              value={url}
              onChange={this._onChange}
            />
          </div>
        </div>
        <div className="form-group tags-container">
          <button
            className="btn btn-primary btn-edit-message w-100"
            disabled={!url}
            onClick={this._save}
          >
            Save
          </button>
        </div>
      </div>
    );
  }
}

UrlEdit.propTypes = {
  onSave: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired
};

export default UrlEdit;
