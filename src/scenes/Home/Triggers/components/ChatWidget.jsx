import React, { Component, Fragment } from 'react';
import { Form, Input, Select, Label, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { domainRegex } from '../../scenes/Settings/scenes/Domains/components/Domains';
import { toastr } from 'react-redux-toastr';

import { getPageFromUrl } from 'services/pages/selector';
import { getCampaignAdd } from '../services/selector';

class ChatWidget extends Component {
  constructor(props) {
    super(props);
    let options = {
      color: '#0000FF',
      logInGreeting: '',
      logOutGreeting: '',
      greetingDialogDisplay: 'show',
      delay: 0
    };

    console.log('defaultOptions: ', props.defaultOptions);
    if (props.defaultOptions) {
      options = {
        ...options,
        ...props.defaultOptions
      };
    }

    this.state = {
      options 
    };
  }

  componentDidMount() {
    this.setState(
      ({ options }) => ({
          options: {
              ...options,
              refParameter: `campaign::${this.props.campaignAdd
                  .publicId || ''}`,
              fbId: this.props.pageInfo ? this.props.pageInfo.fbId : null
          }
      }),
      () => this.updateOptions()
    );
  }

  updateOptions = () => {
    const { options } = this.state;
    console.log('options', options);
    this.props.updateOptions(options);
  };

  handleDomain = domain => {
    this.setState({ domain });
  }

  handleColor = color => {
    this.setState(
        ({ options }) => ({
            options: { ...options, color }
        }),
        () => this.updateOptions()
    );
  };

  handleLogInGreeting = logInGreeting => {
    this.setState(
        ({ options }) => ({
            options: { ...options, logInGreeting }
        }),
        () => this.updateOptions()
    );
  };

  handleLogOutGreeting = logOutGreeting => {
    this.setState(
        ({ options }) => ({
            options: { ...options, logOutGreeting }
        }),
        () => this.updateOptions()
    );
  };

  handleGreetingDialogDisplay = greetingDialogDisplay => {
    this.setState(
        ({ options }) => ({
            options: { ...options, greetingDialogDisplay }
        }),
        () => this.updateOptions()
    );
  };

  handleDelay = delay => {
    this.setState(
        ({ options }) => ({
            options: { ...options, delay }
        }),
        () => this.updateOptions()
    );
  };

  handleAddDomain = () => {
    const { domain } = this.state;
    const { addDomain, domainUrls } = this.props;
    if (domainRegex.test(domain))
      addDomain([ ...domainUrls, domain ]);
    else toastr.error(
      'Invalid Redirect URL',
      "Please enter a valid URL. inlcuding the protocol identifier (e.g. 'https://' or 'http://')"
    );
    this.setState({ domain: ''});
  }

  render() {
    const { domain, options: { color, logInGreeting, logOutGreeting, greetingDialogDisplay, delay } } = this.state;
    const { domainUrls } = this.props;
    
    return (
      <Fragment>
        <h3 className="heading">Chat Widget</h3>

        <Form.Field className="">
          <label className="no-padding">White List</label>
          <div style={{marginBottom: '10px', border: '1px solid #888', borderRadius: '10px', padding: '5px'}}>
          {domainUrls && domainUrls.length ? (
            domainUrls.map((url) => (
              <Label className="whitelist-url">{url}</Label>
            ))
          ) : "No whitelisted url"}
          </div>
          <Input
            placeholder="Domain"
            type="text"
            value={domain}
            onChange={ (e, {value}) => this.handleDomain(value) }
          />
          <Button onClick={this.handleAddDomain}>Add to White List</Button>
        </Form.Field>

        <Form.Field className="">
          <label className="no-padding">Color</label>
          <Input
            className="color-picker"
            placeholder="Select theme color"
            type="color"
            value={color}
            onChange={ (e, {value}) => this.handleColor(value) }
          />
        </Form.Field>
        <Form.Field className="">
          <label className="no-padding">Logged in greeting</label>
          <Input
            placeholder="Type greeting text here"
            type="text"
            value={logInGreeting}
            onChange={ (e, {value}) => this.handleLogInGreeting(value) }
          />
        </Form.Field>
        <Form.Field className="">
          <label className="no-padding">Logged out greeting</label>
          <Input
            placeholder="Type greeting text here"
            type="text"
            value={logOutGreeting}
            onChange={ (e, {value}) => this.handleLogOutGreeting(value) }
          />
        </Form.Field>
        <Form.Field className="">
          <label className="no-padding">Greeting dialog display</label>
          <Select
            placeholder="Select display option"
            options={[
              { key: 'show', value: 'show', text: 'Show' },
              { key: 'hide', value: 'hide', text: 'Hide'},
              { key: 'fade', value: 'fade', text: 'Fade'}
            ]}
            value={greetingDialogDisplay}
            onChange={ (e, {value}) => this.handleGreetingDialogDisplay(value) }
          />
        </Form.Field>
        <Form.Field className="">
          <label className="no-padding">Delay</label>
          <Input
            placeholder="Type delay time here"
            type="number"
            value={delay}
            min={0}
            onChange={ (e, {value}) => this.handleDelay(value) }
          />
        </Form.Field>
      </Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
      pageId: ownProps.match.params.id,
      campaignAdd: getCampaignAdd(state),
      pageInfo: getPageFromUrl(state, ownProps),
      domainUrls: state.default.settings.domains.urls
  };
};

export default withRouter(connect(mapStateToProps, {})(ChatWidget));