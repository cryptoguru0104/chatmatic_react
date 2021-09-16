import React, { useState, useEffect } from 'react';
import { Form, TextArea, Button, Icon } from 'semantic-ui-react';
import { Svg } from "../../Layout";
import '../style.scss';

const UserInfo = ({ user, pageEditable, saveUser }) => {
  const [editUser, setEditUser] = useState({});
  const [editableUserInfo, setEditableUserInfo] = useState(false);

  useEffect(() => {
    setEditUser(user);
  }, [user]);

  const handleChangeDescription = (e) => {
    e.persist();
    setEditUser(editUser => ({ ...editUser, description: e.target.value}));
  }

  const handleSaveUserInfo = () => {
    saveUser(editUser);
    setEditableUserInfo(false);
  };

  const handleEditUserInfo = () => {
    setEditableUserInfo(true);
  };

  return (
    <Form className="user-info">
      <h3 className="full-name">{user.name}</h3>
      <Svg name="mail-box" />{" "}
      <span className="user-email">{user.email}</span>
      {editableUserInfo ? (
        <React.Fragment>
          <Form.Field className="input-form">
            <TextArea
              placeholder="Input your description"
              className="user-input description"
              value={editUser.description}
              onChange={handleChangeDescription}
              rows={5}
            />
          </Form.Field>
          <Button className="ui primary save-button" onClick={handleSaveUserInfo}>Save</Button>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <p className="user-description">{user.description}</p>
          {pageEditable ? <a className="icon-btn edit-icon" onClick={handleEditUserInfo}><Icon name="pencil"/></a> : null}
        </React.Fragment>
      )}
    </Form>
  );
}

export default UserInfo