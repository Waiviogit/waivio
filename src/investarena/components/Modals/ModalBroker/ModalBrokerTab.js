import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import BrokerAuthorization from '../ModalBroker/BrokerAuthorization';
import BrokerRegistration from '../ModalBroker/BrokerRegistration';
import './ModalBroker.less';

const propTypes = {
    getBroker: PropTypes.func.isRequired,
    forgotPassBroker: PropTypes.func.isRequired,
    getBrokers: PropTypes.func.isRequired,
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
    componentDidMount () {
        let tabId;
        this.props.getBrokers().then(brokersList => {
            if (brokersList.length === 0) tabId = '2';
            else tabId = '1';
            this.setState({ activeTab: tabId });
        });
    }
    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({activeTab: tab});
        }
    };
    render () {
        return (
            <React.Fragment>
                <Nav tabs className="st-broker-tab">
                    <NavItem className="st-broker-tab-item">
                        <NavLink
                            id='brokerAuthorization'
                            className={this.state.activeTab === '1' ? 'active' : 'disable'}
                            onClick={() => { this.toggle('1') }}>
                            <FormattedMessage id="modalBroker.tab.connect" />
                        </NavLink>
                    </NavItem>
                    <NavItem className="st-broker-tab-item">
                        <NavLink
                            id='brokerRegistration'
                            className={this.state.activeTab === '2' ? 'active' : 'disable'}
                            onClick={() => { this.toggle('2') }}>
                            <FormattedMessage id="modalBroker.tab.create" />
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        <BrokerAuthorization
                            isLoading={this.props.isLoading}
                            forgotPassBroker={this.props.forgotPassBroker}
                            getBroker={this.props.getBroker}
                            getBrokers={this.props.getBrokers}
                            authorizeBroker={this.props.authorizeBroker}
                            disconnectBroker={this.props.disconnectBroker}
                            toggleModal={this.props.toggleModal}
                            brokerConnected={this.props.platformName !== 'widgets'}/>
                    </TabPane>
                    <TabPane tabId="2">
                        <BrokerRegistration
                            isLoading={this.props.isLoading}
                            registerBroker = {this.props.registerBroker}
                            authorizeBroker={this.props.authorizeBroker}
                            toggleModal={this.props.toggleModal}/>
                    </TabPane>
                </TabContent>
            </React.Fragment>
        );
    }
}

ModalBrokerTab.propTypes = propTypes;

export default ModalBrokerTab;
