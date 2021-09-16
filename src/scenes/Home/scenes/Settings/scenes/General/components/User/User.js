import React from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

/** import assets */
import userImg from 'assets/images/subscriber.png';

class User extends React.Component {
  _deleteAdmin = () => {
    Swal({
      title: 'Are you sure?',
      text: 'Please verify that you want to delete the admin user',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete this admin',
      cancelButtonText: 'No, I want to keep it',
      confirmButtonColor: '#f02727'
    }).then(result => {
      if (result.value) {
        this.props.onDelete(this.props.admin.uid);
      }
    });
  };

  render() {
    const { firstName, lastName, email, photo } = this.props.admin;
    let userName = firstName + ' ' + lastName;

    if (!firstName && !lastName) {
      userName = 'Invited';
    }

    return (
      <div
        className="d-flex justify-content-start align-items-center pb-2 mb-4"
        style={{ borderBottom: '1px solid #e6e7eb' }}
      >
        <img
          src={photo || userImg}
          alt=""
          className="mr-2"
          style={{ borderRadius: '50%' }}
        />
        <div className="d-flex flex-column">
          <h4>{userName}</h4>
          <small className="text-muted font-weight-light">{email}</small>
        </div>
        <button
          className="btn btn-sm rounded-circle px-2 ml-auto"
          onClick={this._deleteAdmin}
        >
          <i className="fa fa-minus" />
        </button>
      </div>
    );
  }
}

User.propTypes = {
  admin: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    photo: PropTypes.string,
    uid: PropTypes.number.isRequired
  }).isRequired,
  onDelete: PropTypes.func.isRequired
};

export default User;
