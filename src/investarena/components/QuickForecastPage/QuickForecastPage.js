import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import ObjectExpertise from '../../../client/components/Sidebar/ObjectExpertise';
import QuickForecastCard from './QuickForecastCard';
import Loading from '../../../client/components/Icon/Loading';
import {answerForQuickForecast, getDataForQuickForecast} from '../../redux/actions/forecastActions';
import BallotTimer from './BallotTimer';

import './QuickForecastPage.less';
import TopPredictors from "./TopPredictors";

class QuickForecastPage extends React.PureComponent {
  state = {
    isLoading: false,
  };

  componentDidMount() {
    this.props.getDataForQuickForecast();
    setTimeout(() => this.setState(state => ({isLoading: !state.isLoading})), 3000)
  }

  render() {
    const {mockObj} = this.props;

    return (
      <div className="shifted">
        <div className="feed-layout container">
          <div className="leftContainer">
            <ObjectExpertise username={'Kurt Donald Cobain'} wobject={mockObj[0]}/>
          </div>
          <div className="center">
            <div className="timer-container">
              <BallotTimer hours={2} minutes={30}/>
            </div>
            {this.state.isLoading
              ?
              mockObj.map((obj) => (
                <QuickForecastCard wObject={obj} key={Math.random()}
                                   answerForecast={this.props.answerForQuickForecast}
                                   getForecast={this.props.getDataForQuickForecast}/>))
              : <Loading/>
            }
          </div>
          <div className="rightContainer">
            <TopPredictors reward={12}/>
          </div>
        </div>
      </div>
    );
  }
}

QuickForecastPage.propTypes = {
  mockObj: PropTypes.arrayOf().isRequired,
  answerForQuickForecast: PropTypes.func.isRequired,
  getDataForQuickForecast: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  mockObj: state.forecasts.quickForecastData,
});

const mapDispatchToProps = {
  answerForQuickForecast,
  getDataForQuickForecast,
};

export default connect(mapStateToProps, mapDispatchToProps)(QuickForecastPage);
