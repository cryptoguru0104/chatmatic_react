import React, { Component } from 'react';
import { Button, Modal, Checkbox, Form, Dropdown } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { injectStripe, CardElement } from 'react-stripe-elements';

import { Block } from '../../Layout';

class StripeCardModal extends Component {
  constructor(props) {
      super(props);
      this.state = {
        loading: false
      };
  }

  handleSource = () => {
    this.setState({ loading: true });
    const self = this
    this.props.stripe
      .createSource({ type: 'card' })
      .then(({ source }) => {
        console.log('source', source);
        self.props.source(source.id);
        this.setState({
          loading: false
        });
      })
      .catch(error => {
        this.setState({
          loading: false
        })
        if (typeof error === 'string') {
          toastr.error('Error', error);
        } else {
          toastr.error('Error', 'Invalid Token');
        }
      });
  }

  render() {
    // const pageId = this.props.id;

    const { open, close } = this.props;
    const { loading } = this.state;

    return (
      <Modal
        size="mini"
        className="stripeCardmodal"
        open={open}
        onClose={() => false}
      >
        <Modal.Header>
        Card details
          <i
            aria-hidden="true"
            className="close small icon close-icon"
            onClick={close}
          ></i>
        </Modal.Header>
        <Modal.Content>
          <Block className="">
            <CardElement />
          </Block>
        </Modal.Content>
        <Block className="modal-footer">
            <Button
              className="primary"
              type="submit"
              loading={loading}
              onClick={this.handleSource}
            >
              Submit
            </Button>
        </Block>
      </Modal>
    );
  }
}

// export default injectStripe(StripeCardModal)

// const mapDispatchToProps = dispatch => ({
//     actions: bindActionCreators(
//         {
//             getPageTemplate,
//             buyPageTemplate,
//             addTemplate
//         },
//         dispatch
//     )
// });

export default connect(
  state => ({
    // loading: state.default.settings.templates.loading,
    // error: state.default.settings.templates.error,
    // template: state.default.workflows.template,
    // workflowLoading: state.default.workflows.loading,
    // workflowError: state.default.workflows.error,
    // templateCode: state.default.workflows.templateCode
  })
)(injectStripe(StripeCardModal))
