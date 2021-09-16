import React from 'react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getDomains, updateDomains } from '../services/actions';
import Swal from 'sweetalert2';
import { toastr } from 'react-redux-toastr';
import './styles.css';

export const domainRegex = new RegExp(
    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)$/
);

class Domains extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            urls: props.domainUrls
        };
    }

    componentDidMount() {
        const { actions, pageId } = this.props;
        actions.getDomains(pageId);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({ urls: nextProps.domainUrls });

        if (nextProps.loading) {
            Swal({
                title: 'Please wait...',
                text: 'Loading Domain Settings...',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (this.props.loading) {
            Swal.close();

            if (nextProps.error) {
                toastr.error('Domains Loading Error', nextProps.error);
            }
        }
    }

    _removeUrl = url => {
        const { urls } = this.state;
        this.setState({ urls: urls.filter(x => x !== url) });
    };

    _addDomain = e => {
        const { urls } = this.state;
        e.preventDefault();
        if (this.addDomainRef) {
            if (!this.addDomainRef.value) {
                return;
            }
            if (!domainRegex.test(this.addDomainRef.value)) {
                toastr.error(
                    'Invalid domain',
                    "Please enter a valid URL. inlcuding the protocol identifier (e.g. 'https://' or 'http://')"
                );
                return;
            }
            if (urls.indexOf(this.addDomainRef.value) > -1) {
                toastr.error(
                    'Domain already exists',
                    'This domain has already been added'
                );
                return;
            }
            const newUrl = this.addDomainRef.value;

            this.setState({ urls: [...urls, newUrl] }, () => {
                this.addDomainRef.value = '';
            });
        }
    };

    _updateDomains = () => {
        const { actions, pageId } = this.props;
        const { urls } = this.state;
        actions.updateDomains(pageId, urls);
    };

    render() {
        const { urls } = this.state;
        const { domainUrls } = this.props;
        return (
            <div>
                <form onSubmit={this._addDomain} noValidate>
                    <div className="input-group input-group-sm mb-3">
                        <div className="input-group-prepend">
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={this._addDomain}
                            >
                                <i className="fa fa-plus mr-1" />
                                Add
                            </button>
                        </div>
                        <input
                            type="text"
                            name="addDomain"
                            className="form-control addDomain"
                            placeholder="e.g yoursite.com"
                            ref={ref => (this.addDomainRef = ref)}
                        />
                    </div>
                </form>
                {urls &&
                    urls.map((u, i) => (
                        <div className="chip" key={i}>
                            {u}
                            <i
                                className="close fa fa-times"
                                onClick={() => {
                                    this._removeUrl(u);
                                }}
                            ></i>
                        </div>
                    ))}
                {domainUrls !== urls && (
                    <div className="text-right">
                        <button
                            className="btn btn-primary"
                            onClick={this._updateDomains}
                        >
                            <i className="fa fa-save mr-2" />
                            Save Domains
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

Domains.propTypes = {
    actions: PropTypes.object.isRequired,
    domainUrls: PropTypes.array.isRequired,
    error: PropTypes.any,
    loading: PropTypes.bool.isRequired,
    pageId: PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => ({
    domainUrls: state.default.settings.domains.urls,
    error: state.default.settings.domains.error,
    loading: state.default.settings.domains.loading,
    pageId: ownProps.match.params.id
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            getDomains,
            updateDomains
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Domains)
);
