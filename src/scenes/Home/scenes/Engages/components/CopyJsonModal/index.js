import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'components';
import { getPageWorkflowJson } from '../../../../../../services/workflows/workflowsApi';
import { convertObjectKeyToCamelCase } from '../../../../../../services/utils';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toastr } from 'react-redux-toastr';
class CopyJsonModal extends React.Component {
    state = { errorMessage: '', json: '' };

    componentDidMount() {
        const { pageId, workflowRootStepUid } = this.props;

        try {
            getPageWorkflowJson(pageId, workflowRootStepUid).then(res => {
                const data = res.data;
                this.setState({ json: JSON.stringify(data['json_step']) });
            });
        } catch (error) {
            console.log('error', error);
        }
    }

    render() {
        const { isOpen, toggle } = this.props;
        const { json } = this.state;

        return (
            <Modal isOpen={isOpen} toggle={toggle}>
                <ModalHeader toggle={toggle}>Copy JSON</ModalHeader>
                <ModalBody>
                    <div className="mb-3">
                        <p style={{ fontSize: '.9rem' }}>
                            If you are looking to use this as an ad, please
                            note, you should ONLY use one “item” in this
                            message. So for example, make sure your engagement
                            has just one text box and not text + images. You are
                            allowed one element, buttons, and quick replies in
                            Facebook ads
                        </p>
                        <textarea
                            type="text"
                            className="form-control"
                            name="newTag"
                            rows={6}
                            readOnly
                            value={json}
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <CopyToClipboard
                        text={json}
                        onCopy={() => {
                            toastr.success('Copied', 'Copied to Clipboard');
                        }}
                    >
                        <Button className="rounded mb-2 w-100" color="primary">
                            <i className="fa fa-copy mr-2"></i>Copy
                        </Button>
                    </CopyToClipboard>
                </ModalFooter>
            </Modal>
        );
    }
}
CopyJsonModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    pageId: PropTypes.string.isRequired,
    toggle: PropTypes.func.isRequired,
    workflowRootStepUid: PropTypes.number.isRequired
};
export default CopyJsonModal;
