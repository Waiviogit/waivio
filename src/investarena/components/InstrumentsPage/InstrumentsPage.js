import React, { Component } from 'react';
import _ from 'lodash';
import { Tabs } from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { getViewMode, setViewMode } from '../../helpers/localStorageHelpers';
import AssetsTab from './AssetsTab/AssetsTab';
import { getAllSignals } from '../../redux/actions/signalsActions';
import './InstrumentsPage.less';
import {supportedObjectTypes} from "../../constants/objectsInvestarena";
import Affix from '../../../client/components/Utils/Affix';
import LeftSidebar from '../../../client/app/Sidebar/LeftSidebar';

const TabPane = Tabs.TabPane;

const propTypes = {
    charts: PropTypes.shape(),
    openDeals: PropTypes.shape(),
    favorites: PropTypes.array.isRequired,
    quotes: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    quoteSettings: PropTypes.shape().isRequired,
    getChartsData: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
};
const defaultProps = {
    charts: {},
    openDeals: {},
};

class InstrumentsPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            trends: [],
            signals: {},
            viewMode: null,
            wobjs: []
        };
    }

    componentDidMount () {
        this.props.getChartsData();
        const viewMode = getViewMode('instruments');
        if(viewMode) this.setState({viewMode});
        getAllSignals().then(({ data, error }) => {
            if (!error && data) {
              this.setState({signals: data})
            }
        });

    }

    toggleViewMode = () => {
        const viewModeValue = this.state.viewMode === 'list' ? 'cards' : 'list';
        this.setState({viewMode: viewModeValue});
        setViewMode('instruments', viewModeValue);
    };

    render () {
      const paramMarket = this.props.match.params.marketType;
      const marketType = (_.some(supportedObjectTypes, paramMarket) ||
        paramMarket === 'favorites' ||
        paramMarket === 'crypto') ? paramMarket : 'favorites';

      return (
            <div className="st-instr-page">
              <div className="feed-layout container">
                <Affix className="leftContainer" stickPosition={115}>
                  <div className="left">
                    <div role='presentation' className="st-instruments-toggle-view" onClick={this.toggleViewMode}>
                      {this.state.viewMode === 'list'
                        ? <img alt="cards" className="st-instruments-toggle-view__icon" src="/images/icons/grid-view.svg"/>
                        : <img alt="list" className="st-instruments-toggle-view__icon" src="/images/icons/list-of-items.svg"/>
                      }
                    </div>
                    <LeftSidebar />
                  </div>
                </Affix>
                <div className="center">
                  <AssetsTab
                    quotes={this.props.quotes}
                    charts={this.props.charts}
                    signals={this.state.signals}
                    deals={this.props.openDeals}
                    quoteSettings={this.props.quoteSettings}
                    title={marketType.toLowerCase()}
                    favorites={this.props.favorites}
                    trends={this.state.trends}
                    viewMode={this.state.viewMode}
                  />

                  </div>
                </div>
              </div>
        );
    }
}

InstrumentsPage.propTypes = propTypes;
InstrumentsPage.defaultProps = defaultProps;

export default injectIntl(InstrumentsPage);
