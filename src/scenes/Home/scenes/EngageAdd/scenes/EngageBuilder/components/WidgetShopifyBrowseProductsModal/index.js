import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Pagination from '@material-ui/lab/Pagination';

import InputAdornment from '@material-ui/core/InputAdornment';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CloseIcon from '@material-ui/icons/Close';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import SearchIcon from '@material-ui/icons/Search';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';

import moment from 'moment';

import './style.scss';
import { bindActionCreators } from 'redux';
import { getProducts, getCollects } from '../../../../services/actions'
import { getEngageAddState } from '../../../../services/selector';

const PRODUCT_PAGE_PRODUCT_COUNT = 8;
const CAROUSEL_PRODUCTS_COUNT_LIMIT = 9;
class WidgetShopifyBrowseProductsModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      search: '',
      selectedCollection: '',
      selectedProducts: [],
      sortBy: '',
      page: 1,
      tab: 'ALL_PRODUCTS',  // SELECTED_PRODUCTS
    }

    this.selectCollection = this.selectCollection.bind(this);
    this.selectSortBy = this.selectSortBy.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);

  }

  componentDidMount() {
    let integration = this.props.integrations.find(integration => integration.integrationTypeUid == this.props.widget.integrationTypeUid);

    this.props.actions.getCollects(this.props.match.params.id, integration.uid);
  }

  // OnChange handler for collection dropdown
  selectCollection(event) {
    this.setState({ selectedCollection: event.target.value });
  }
  // OnChange handler for collection dropdown
  selectSortBy(event) {
    this.setState({ sortBy: event.target.value });
  }

  selectProduct = (product) => {
    const { selectedProducts } = this.state;
    const { widget } = this.props;

    const index = selectedProducts.findIndex(p => p.id == product.id);

    if(widget.slug == 'card') {
      if(index === -1) {
        this.setState({
          selectedProducts: [product]
        });
      }
      else {
        this.setState({
          selectedProducts: []
        });
      }
    }
    else if(widget.slug == 'carousel') {
      if(index !== -1) {
        this.setState({
          selectedProducts: selectedProducts.filter(p => p.id != product.id)
        });
      }
      else if(selectedProducts.length < CAROUSEL_PRODUCTS_COUNT_LIMIT) {
        this.setState({
          selectedProducts: [...this.state.selectedProducts, product]
        });
      }
    }
  }

  selectTab = (tab) => {
    this.setState({ tab });
  }

  setPage = (page) => {
    this.setState({
      page
    });
  }

  handleSearchChange(event) {
    this.setState({
      search: event.target.value
    });
  }

  addProducts = () => {
    const { selectedProducts } = this.state;
    const { widget, onHide } = this.props;

    if(widget.slug == 'card') {
      this.props.addWidgetData(widget, selectedProducts[0]);
      onHide();
    }
    else if(widget.slug == 'carousel') {
      this.props.addWidgetData(widget, {products: selectedProducts });
      onHide();
    }
  }

  _renderFilter = () => {
    const { widget, collects } = this.props;
    const { search, sortBy, selectedCollection } = this.state;

    return (<Grid container spacing={2} className="filter-container">
      <Grid item xs={12} sm={12} md={6}>
        {widget.slug == 'card' && <label>Please select a product.</label>}
        {widget.slug == 'carousel' && <label>You can choose up to {CAROUSEL_PRODUCTS_COUNT_LIMIT} items to be featured in a carousel.</label>}
        <TextField className="input-search" value={search} onChange={this.handleSearchChange} InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }} variant="outlined" placeholder="Search by name or ID, case sensitive" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <label><b>Category</b></label>
        <Select className="select" value={selectedCollection} onChange={this.selectCollection} variant="outlined"> 
          <MenuItem value="">---All---</MenuItem>
          {collects.map((collection, index) => <MenuItem key={index} value={collection}>{collection.title}</MenuItem>)}
        </Select>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <label><b>Sort</b></label>
        <Select className="select" value={sortBy} onChange={this.selectSortBy} variant="outlined"> 
          <MenuItem value=""></MenuItem>
          <MenuItem value="title-asc">Name Ascending</MenuItem>
          <MenuItem value="title-desc">Name Descending</MenuItem>
          <MenuItem value="updatedAt-asc">Date Ascending</MenuItem>
          <MenuItem value="updatedAt-desc">Date Descending</MenuItem>
          <MenuItem value="vendor-asc">Vendor Ascending</MenuItem>
          <MenuItem value="vendor-desc">Vendor Descending</MenuItem>
        </Select>
      </Grid>
    </Grid>);
  }

  _renderProductsList = (products) => {
    const { page, sortBy, tab, selectedProducts } = this.state;
    
    // sort
    if(sortBy != '') {
      let sorts = sortBy.split('-');
      products.sort((a, b) => {
        if(a[sorts[0]] == b[sorts[0]]) return 0;
        if(a[sorts[0]] < b[sorts[0]]) return sorts[1] === 'asc' ? -1 : 1;
        return sorts[1] === 'asc' ? 1 : -1;
      });      
    }

    // pagination
    products = products.slice((page - 1) * PRODUCT_PAGE_PRODUCT_COUNT, page * PRODUCT_PAGE_PRODUCT_COUNT);

    return <>
      <div className="tabs">
        <span onClick={() => this.selectTab('ALL_PRODUCTS')} className={tab == 'ALL_PRODUCTS' ? 'active' : 'inactive'}>All Products</span>
        <span className="inactive">|</span>
        <span onClick={() => this.selectTab('SELECTED_PRODUCTS')} className={tab == 'SELECTED_PRODUCTS' ? 'active' : 'inactive'}>Selected Products({selectedProducts.length})</span>
      </div>
      <Grid container spacing={1} className="products-list">
        {products.length == 0 && <div className="no-product-message">There is no products available.</div>}
        {products.map((product, index) => <Grid item className="product-container" key={index} xs={12} sm={6}>
          <Grid container direction="row" justify="flex-start" alignItems="stretch">
            <Checkbox className="product-check" color="primary" inputProps={{  }} checked={selectedProducts.findIndex(p => p.id == product.id) !== -1} onChange={() => this.selectProduct(product) }/>
            <div className="product-image"><img src={product.image.src} alt={product.title} /></div>
            <div className="product-detail">
              <div className="product-title">{product.title}</div>
              <div>Item ID: {product.id}</div>
              <div>Last Updated: {moment(product.updatedAt).format('MMM D, YYYY')}</div>
            </div>
          </Grid>
        </Grid>)}
        {products.length % 2 == 1 && <Grid item className="product-container" xs={12} sm={6} />}
      </Grid>
    </>
  }


  render() {
    const { collects, onHide } = this.props;
    const { search, tab, page, selectedCollection, selectedProducts } = this.state;

    let products = [];

    if(tab == 'ALL_PRODUCTS') {
      if(selectedCollection == '') {
        collects.forEach(collect => {
          collect.products.forEach(p => {
            if(products.find(k => k.id == p.id)) return;
            products.push({...p, collection_id: collect.id});
          });
        });
      }
      else {
        products = selectedCollection.products;
      }
    }
    else {
      products = selectedProducts;
    }

    if(search != '') {
      products = products.filter(p => p.id == search || p.title.indexOf(search) !== -1);
    }

    return <Dialog 
      className="widget-modal-container"
      aria-labelledby="widget-modal-title"
      open={true}
      fullWidth={true}
      maxWidth="md"
      onClose={onHide}>
        <DialogTitle disableTypography id="widget-modal-title" className="widget-modal-title">
          <Grid container direction="row" justify="space-between" alignItems="center">
            <h2>Browse for products</h2>
            <IconButton onClick={onHide}><CloseIcon /></IconButton>
          </Grid>
        </DialogTitle>
        <DialogContent>
          {this._renderFilter()}
          {this._renderProductsList(products)}
        </DialogContent>
        <DialogActions>
          <Grid container direction="row" justify="space-between" alignItems="center">
            <Pagination count={Math.ceil(products.length / PRODUCT_PAGE_PRODUCT_COUNT)} page={page} onChange={(e, p) => this.setPage(p)} className="pagination" color="primary" />
            <div className="modal-actions-container">
              <Button variant="contained" onClick={onHide}>
                Cancel
              </Button>
              <Button variant="contained" onClick={() => this.addProducts()} disabled={selectedProducts.length == 0} color="primary" className=""
            startIcon={<AddCircleOutlineIcon />}>
                Add Products
              </Button>
            </div>
          </Grid>
        </DialogActions>
      </Dialog>
  }
}

WidgetShopifyBrowseProductsModal.propTypes = {
  onHide: PropTypes.func,
  addWidgetData: PropTypes.func,
  integrationType: PropTypes.object,
  integrations: PropTypes.array,
  widget: PropTypes.object,
  collects: PropTypes.array,
}

WidgetShopifyBrowseProductsModal.defaultProps = {
  collects: []
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getCollects
    },
    dispatch
  )
})

const mapStateToProps = state => ({
  collects: getEngageAddState(state).collects,
  integrations: state.default.settings.integrations.integrations
})

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(WidgetShopifyBrowseProductsModal)
);