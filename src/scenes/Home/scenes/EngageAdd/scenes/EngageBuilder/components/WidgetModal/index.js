import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getEngageAddState } from '../../../../services/selector';

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import './style.scss';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import WidgetShopifyBrowseProductsModal from '../WidgetShopifyBrowseProductsModal';
import { Svg } from '../../../../../../Layout';

class WidgetModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIntegrationType: null,
      selectedWidget: null,
      showSubModal: false,
    };
  }

  handleIntegrationTypeClick = (selectedIntegrationType) => () => {
    this.setState({ selectedIntegrationType });
  };

  handleWidgetItemClick = (widgetType) => () => {
    // this.props.onClickWidgetType(widgetType);
    this.setState({ selectedWidget: widgetType });
    // this.props.onHide();
  };

  handleNextStep = () => {
    this.props.onClickWidgetType(this.state.selectedWidget);
    this.setState({ showSubModal: true });
    // this.props.onHide();
  }

  renderWidgets = () => {
    const { selectedWidget } = this.state;
    const widgetsByIntegration = this.props.widgetTypes.filter(types => types.integrationTypeUid === this.state.selectedIntegrationType.uid);

    return (
      <Grid container direction="row" justify="space-between" alignItems="center" spacing={1} wrap="nowrap">
        {widgetsByIntegration.map((widget) => {
          return (
            <div className={"widget" + (selectedWidget != null && selectedWidget.uid == widget.uid ? ' active' :'')} onClick={this.handleWidgetItemClick(widget)} key={widget.uid}>
              <div className="widget-image">
                <Svg name={"widget-item-" + widget.slug} />
              </div>
              {widget.name}
            </div>
          );
        })}
      </Grid>
    );
  };

  render() {
    const { integrationTypes, widgetTypes, visible, onShow, onHide } = this.props;
    const { selectedIntegrationType }  = this.state;

    const widgetIntegrationTypes = integrationTypes.filter(type => {
      return widgetTypes.find(widget => widget.integrationTypeUid == type.uid);
    });
    return (
      <>
        <Dialog 
        className=""
        aria-labelledby="widget-modal-title"
        open={!this.state.showSubModal}
        fullWidth={true}
        maxWidth="sm"
        onClose={onHide}>
          <DialogTitle disableTypography id="widget-modal-title" className="widget-modal-title">
            <Grid container direction="row" justify="space-between" alignItems="center">
              {selectedIntegrationType == null && <h2>Widgets</h2>}
              { (selectedIntegrationType != null && selectedIntegrationType.slug == 'shopify') && <h2>Shopify Widgets</h2>}
              <IconButton onClick={onHide}><CloseIcon /></IconButton>
            </Grid>
          </DialogTitle>
          {selectedIntegrationType == null && <DialogContent className="dialog-widget-container">
            {widgetIntegrationTypes.length === 0 && <div>There is no widget available.</div>}
            {widgetIntegrationTypes.length > 0 && <ul className="api-list">
              {widgetIntegrationTypes.map(integrationType => <li key={integrationType.uid} onClick={this.handleIntegrationTypeClick(integrationType)}>
                <img src={require("assets/images/icon-" + integrationType.slug + ".png")} alt="" />
                {integrationType.name}
                <div className="icon-info">i</div>
                <div className="clear" />
              </li>)}
            </ul>}
          </DialogContent>}
          { selectedIntegrationType != null && <>
            <DialogContent className="dialog-widgets-list-container">
              {this.renderWidgets()}
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={() => {
                this.setState({
                  selectedIntegrationType: null,
                  selectedWidget: null,
                  showSubModal: false
                });
              }}>
                Back
              </Button>
              <Button variant="contained" onClick={this.handleNextStep} disabled={this.state.selectedWidget == null} color="primary" className="btn-color-green">
                Next Step
              </Button>
            </DialogActions>
          </>}
          
        </Dialog>


        { this.state.showSubModal && <WidgetShopifyBrowseProductsModal
          onHide={onHide}
          addWidgetData={this.props.addWidgetData}
          integrationType={selectedIntegrationType}
          widget={this.state.selectedWidget}
        />}
      </>
    );
  }
}

WidgetModal.propTypes = {
  visible: PropTypes.bool,
  onShow: PropTypes.func,
  onHide: PropTypes.func,
  addWidget: PropTypes.func,
  integrationTypes: PropTypes.array,
  widgetTypes: PropTypes.array,
  onClickWidgetType: PropTypes.func
}

WidgetModal.defaultProps = {
  widgetTypes: [],
  integrationTypes: []
}

export default WidgetModal;