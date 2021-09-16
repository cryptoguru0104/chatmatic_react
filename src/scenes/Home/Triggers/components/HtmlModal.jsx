import React from 'react';
import { toastr } from 'react-redux-toastr';
import $ from 'jquery';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { Svg } from '../../Layout';
import './HtmlModal.scss';

const copyHtml = async (html, close) => {
    // const temp = $('<input>');
    // $('body').append(temp);
    // temp.val($('#html-code').text()).select();
    // document.execCommand('copy');
    // temp.remove();
    await navigator.clipboard.writeText(html);
    toastr.success('Copy HTML', 'Code is copied to clipboard');
    setTimeout(() => {
        close();
    }, 200);
};

const HtmlModal = ({ html, open, close, htmlType }) => (
    <Dialog
        maxWidth="sm" 
        open={open}
        onClose={close}
    >
        <DialogContent>
            <div className="html-modal-content">
                <Grid container justify="space-between">
                    <h2>HTML code</h2>
                    <Button onClick={close} className="btn-close">
                        <Svg name="modal-close" />
                    </Button>
                </Grid>
                <hr />
                <div className="html-contents">
                    {htmlType === 'json' ? (<pre id="html-code">{html}</pre>) : (<code id="html-code">{html}</code>)}
                </div>
                <Button
                    onClick={() => copyHtml(html, close)}
                    variant="contained"
                    color="primary"
                    className="btn-copy-to-clipboard"
                    startIcon={<Svg name="copy-clipboard" />}
                >
                    Copy to clipboard
                </Button>
            </div>
        </DialogContent>
    </Dialog>
);

export default HtmlModal;
