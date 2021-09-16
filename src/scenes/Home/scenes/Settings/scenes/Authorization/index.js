import React from 'react';
import { authorizeIntegration } from '../Integrations/services/api';
import { toastr } from 'react-redux-toastr';
import { TransverseLoading } from 'react-loadingg';

import chatmaticLogo from 'assets/images/icon-messages.png';
import './style.scss';

class Authorization extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentWillMount() {
    let query = this.props.location.search;
    query = query.slice(1, query.length);

    try {
      const res = await authorizeIntegration({
        query        
      });

      this.props.history.push('/page/' + res.data.page_uid + '/settings/integrations');
    } catch(e) {
      toastr.error('Authorization failed');
    }
  }

  render() {
    return (
      <div className="authorizing-container">
        <p className="title">Authorizing ...</p>
        <div className="authorizing-progress">
          <img src={chatmaticLogo} className="chatmatic-logo"/>
          <div className="loading-bar"><TransverseLoading /></div>
          <img src="https://img.icons8.com/color/344/shopify.png" className="chatmatic-logo"/>
        </div>
      </div>
    );
  }
}

export default Authorization;