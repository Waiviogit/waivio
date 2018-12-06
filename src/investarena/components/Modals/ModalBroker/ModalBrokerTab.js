import React, { Component } from 'react';
import {injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import BrokerAuthorization from '../ModalBroker/BrokerAuthorization';
import BrokerRegistration from '../ModalBroker/BrokerRegistration';
import './ModalBroker.less';

const TabPane = Tabs.TabPane;

const propTypes = {
    forgotPassBroker: PropTypes.func.isRequired,
    registerBroker: PropTypes.func.isRequired,
    authorizeBroker: PropTypes.func.isRequired,
    disconnectBroker: PropTypes.func.isRequired,
    toggleModal: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    platformName: PropTypes.string.isRequired
};

class ModalBrokerTab extends Component {
    constructor (props) {
        super(props);
        this.state = {
            activeTab: '1'
        };
    }
    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({activeTab: tab});
        }
    };
    render () {
        return (
            <React.Fragment>
              <Tabs defaultActiveKey="1" onChange={this.toggle}>
                <TabPane
                  tab={ this.props.intl.formatMessage({id: 'modalBroker.tab.connect'})}
                  key="1"
                >
                  <BrokerAuthorization
                    isLoading={this.props.isLoading}
                    forgotPassBroker={this.props.forgotPassBroker}
                    authorizeBroker={this.props.authorizeBroker}
                    disconnectBroker={this.props.disconnectBroker}
                    toggleModal={this.props.toggleModal}
                    brokerConnected={this.props.platformName !== 'widgets'}/>
                </TabPane>
                <TabPane
                  tab={ this.props.intl.formatMessage({id: 'modalBroker.tab.create'})}
                  key="2">
                  <BrokerRegistration
                    isLoading={this.props.isLoading}
                    registerBroker = {this.props.registerBroker}
                    authorizeBroker={this.props.authorizeBroker}
                    toggleModal={this.props.toggleModal}/>
                </TabPane>
              </Tabs>
            </React.Fragment>
        );
    }
}

ModalBrokerTab.propTypes = propTypes;

export default injectIntl(ModalBrokerTab);
