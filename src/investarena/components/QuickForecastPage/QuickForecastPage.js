import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';

import QuickForecastCard from './QuickForecastCard';
import Loading from '../../../client/components/Icon/Loading';
import BallotTimer from './BallotTimer';
import TopPredictors from './TopPredictors';
import USDDisplay from '../../../client/components/Utils/USDDisplay';
import SortSelector from '../../../client/components/SortSelector/SortSelector';
import {answerForQuickForecast, getDataForQuickForecast} from '../../redux/actions/forecastActions';
import {marketNames} from '../../constants/objectsInvestarena';

import './QuickForecastPage.less';

class QuickForecastPage extends React.PureComponent {
  state = {
    isLoading: false,
    sortBy: ''
  };

  componentDidMount() {
    this.props.getDataForQuickForecast([{
      author: '',
      permlink: 'ukd-bitcoin',
      expiredAt: '',
      security: 'BTCUSD',
      recommend: 'Buy',
      instrument: 'Commodity',
      active: false,
    }, {
      author: '',
      permlink: 'ukd-bitcoin',
      expiredAt: '',
      security: 'BTCUSD',
      recommend: 'Sell',
      instrument: 'Crypto',
      active: false,
    }, {
      author: 'lucykolosova',
      permlink: 'cute-cat',
      expiredAt: '',
      security: 'BTCUSD',
      recommend: 'buy',
      instrument: 'Index',
      active: false,
    }]);

    setTimeout(() => this.setState(state => ({isLoading: !state.isLoading})), 3000)
  }

  handleSort(sort) {
    this.setState({sortBy: sort});
  };

  render() {
    const filterForecastList = this.props.quickForecastDataList.filter(obj => obj.instrument === this.state.sortBy);
    const forecastList = this.state.sortBy
      ? filterForecastList
      : this.props.quickForecastDataList;
    const filtersType = [...marketNames,
      {
        name: 'Reset',
        key: '',
        intl: {
          id: 'reset_filter',
          defaultMessage: 'Reset'
        }
      }];
    const sortItemKey = type => type.name === 'Reset' ? '' : type.name;
    const mockUserTop = [{
      userName: 'vlemon',
      guessed: 10
    }, {
      userName: 'popkov',
      guessed: 120
    }, {
      userName: 'fedorchuk',
      guessed: 120
    }, {
      userName: 'tarazkp',
      guessed: 120
    }, {
      userName: 'theycallmedan',
      guessed: 120
    }];
    const mockUserWin = [{
      userName: 'vlemon',
      reward: 10
    }, {
      userName: 'popkov',
      reward: 120
    }, {
      userName: 'fedorchuk',
      reward: 120
    }, {
      userName: 'tarazkp',
      reward: 120
    }, {
      userName: 'theycallmedan',
      reward: 120
    }];

    return (
      <div className="shifted">
        <div className="feed-layout container">
          <div className="leftContainer">
            <div className="reward">
              <span>Rewards:</span>
              <USDDisplay value={14}/>
              <span>Current round:</span>
              <USDDisplay value={14}/>
            </div>
            <TopPredictors userList={mockUserWin} title="Current round winners" showMore/>
          </div>
          <div className="center">
            <div className="timer-container">
              <BallotTimer willCallAfterTimerEnd={this.props.getDataForQuickForecast} hours={2} minutes={30}/>
            </div>
            <SortSelector caption="Filter" sort={this.state.sortBy} onChange={sort => this.handleSort(sort)}>
              {
                filtersType.map(type => (
                  <SortSelector.Item key={sortItemKey(type)}>
                    {this.props.intl.formatMessage({id: type.intl.id, defaultMessage: type.intl.defaultMessage})}
                  </SortSelector.Item>
                ))
              }
            </SortSelector>
            {
              this.state.isLoading
                ? forecastList.map(obj => (
                  <QuickForecastCard wObject={obj} key={Math.random()}
                                     predictionObject={this.props.quotes[obj.security].name}
                                     answerForecast={this.props.answerForQuickForecast}
                                     getForecast={this.props.getDataForQuickForecast}/>)
                )
                : <Loading/>
            }
            {
              this.state.isLoading && !forecastList.length && (
                <div className="no-posts">
                  There are currently no forecasts in this category.
                </div>
              )
            }
          </div>
          <div className="rightContainer">
            <TopPredictors userList={mockUserTop} title="Top 5 Users" activeUser={this.props.userName}/>
          </div>
        </div>
      </div>
    );
  }
}

QuickForecastPage.propTypes = {
  quickForecastDataList: PropTypes.arrayOf(PropTypes.object).isRequired,
  answerForQuickForecast: PropTypes.func.isRequired,
  getDataForQuickForecast: PropTypes.func.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  quotes: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  quickForecastDataList: state.forecasts.quickForecastData,
  quotes: state.quotesSettings,
  usersList: state.forecasts.userStatistics,
  winners: state.forecasts.winners,
  userName: state.auth.user.name,
});

const mapDispatchToProps = {
  answerForQuickForecast,
  getDataForQuickForecast,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(QuickForecastPage));
