import React, { useState, useEffect } from 'react';
import { Icon, Form, Input, Button } from 'semantic-ui-react';
import { Svg } from '../../Layout';
import linkedin from 'assets/images/linkedin.png';
import '../style.scss';

const SocialLinks = ({ user, pageEditable, saveUser }) => {
  const [editableSocialLinks, setEditableSocialLinks] = useState(false);
  const [links, setLinks] = useState({});

  useEffect(() => {
    setLinks(user);
  }, [user]);

  const handleSaveSocialLinks = () => {
    saveUser(links);
    setEditableSocialLinks(false);
  }

  const handleEditableSocialLinks = () => {
    setEditableSocialLinks(true);
  }

  const handleChangeLinks = (key) => {
    return e => {
      e.persist();
      setLinks((state) => ({ ...state, [key]: e.target.value }));
    }
  }

  return (
    <div className="social-links">
      {!editableSocialLinks ? (
        <ul className="link-list">
          {links.facebookUrl && <li><a  href={links.facebookUrl}><Svg name="facebook" /></a></li>}
          {links.twitterUrl && <li><a  href={links.twitterUrl}><Svg name="twitter" /></a></li>}
          {links.linedinUrl && <li><a  href={links.linkedinUrl}><Svg name="linkedin" /></a></li>}
          {links.youtubeUrl && <li><a  href={links.youtubeUrl}><Svg name="youtube" /></a></li>}
          {links.linkifyUrl && <li><a  href={links.linkifyUrl}><Svg name="linkify" /></a></li>}
          {pageEditable?<li><a className="icon-btn" onClick={handleEditableSocialLinks}><Svg name="pencil" /></a></li>:null}
        </ul>) : (
          <div className="edit-links">
            <Form.Field className="input-form">
              <label className="user-label">Facebook</label>
              <Input
                className="user-input"
                placeholder="Input Facebook url"
                type="text"
                value={links.facebookUrl||''}
                onChange={handleChangeLinks('facebookUrl')}
              />
            </Form.Field>
            <Form.Field className="input-form">
              <label className="user-label">Twitter</label>
              <Input
                className="user-input"
                placeholder="Input Twitter url"
                type="text"
                value={links.twitterUrl||''}
                onChange={handleChangeLinks('twitterUrl')}
              />
            </Form.Field>
            <Form.Field className="input-form">
              <label className="user-label">Linkedin</label>
              <Input
                className="user-input"
                placeholder="Input Linkedin url"
                type="text"
                value={links.linkedinUrl||''}
                onChange={handleChangeLinks('linkedinUrl')}
              />
            </Form.Field>
            <Form.Field className="input-form">
              <label className="user-label">Google</label>
              <Input
                className="user-input"
                placeholder="Input Youtube url"
                type="text"
                value={links.youtubeUrl||''}
                onChange={handleChangeLinks('youtubeUrl')}
              />
            </Form.Field>
            <Form.Field className="input-form">
              <label className="user-label">Other</label>
              <Input
                className="user-input"
                placeholder="Input Other url"
                type="text"
                value={links.otherUrl||''}
                onChange={handleChangeLinks('otherUrl')}
              />
            </Form.Field>
            <Button className="ui primary save-button" onClick={handleSaveSocialLinks}>Save</Button>
          </div>
        )}
    </div>
  );
};

export default SocialLinks;