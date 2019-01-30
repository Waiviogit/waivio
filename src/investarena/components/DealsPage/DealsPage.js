import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import { getViewMode, setViewMode } from '../../helpers/localStorageHelpers';
import './DealsPage.less';
import OpenDeals from "./OpenDeals";
import ClosedDeals from "./ClosedDeals";

const propTypes = {
  quotes: PropTypes.object.isRequired,
  quoteSettings: PropTypes.object.isRequired,
  intl: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  platformName: PropTypes.string.isRequired,
  platformConnect: PropTypes.bool.isRequired,
  viewMode: PropTypes.oneOf(['list', 'cards']),
};

class DealsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewMode: 'list',
    };
  }

  componentDidMount() {
    const currentViewMode = getViewMode('instruments');
    if (currentViewMode) this.setState({ viewMode: currentViewMode });
  }

  toggleViewMode = () => {
    const viewModeValue = this.state.viewMode === 'list' ? 'cards' : 'list';
    this.setState({ viewMode: viewModeValue });
    setViewMode('instruments', viewModeValue);
  };
  render() {
    const { viewMode } = this.state;
    const paramDealType = this.props.match.params.dealType;
    const isClosedDealType = paramDealType === 'closed';
    return (
      <div className="st-deals-page">
        <div className="feed-layout container">
          <div className="leftContainer">
            <div role='presentation' className="st-deals-toggle-view" onClick={this.toggleViewMode}>
              {this.state.viewMode === 'list'
              ? <img alt="cards" className="st-deals-toggle-view__icon" src="/images/icons/grid-view.svg"/>
              : <img alt="list" className="st-deals-toggle-view__icon" src="/images/icons/list-of-items.svg"/>
              }
            </div>
            {isClosedDealType ?
              <Link to={`/deals/open`}>
                 To open deals
              </Link>
              :
              <Link to={`/deals/closed`}>
                To closed deals
              </Link>
            }
          </div>
          <div className="center">
            <div className="st-instruments-details">
              {this.props.platformName !== 'widgets' ?
                  isClosedDealType ?
                      <ClosedDeals viewMode={viewMode}/>
                      :
                      <OpenDeals viewMode={viewMode}/>
               : (
                <div className="st-deals-wrap st-connect-to-broker-wrap">
                  <span className="st-margin-bottom-large">
                    {this.props.intl.formatMessage({
                      id: 'headerAuthorized.textAttention3',
                      defaultMessage: 'To start trading, connect your broker.',
                    })}
                  </span>
                  {/*<ButtonBroker />*/}
                </div>
              )}
              </div>
          </div>
        </div>
      </div>
    );
  }
}

DealsPage.propTypes = propTypes;

export default injectIntl(DealsPage);
