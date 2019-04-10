import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Icon, Tag, Rate, Row, Col } from 'antd';
// import {Slider, Icon, Tag, Rate, Row, Col} from 'antd';
import '../../post/PostObjectCard/PostObjectCard.less';
// import ObjectRank from '../../object/ObjectRank';
// import ObjectType from '../../object/ObjectType';
import { averageRate } from '../Sidebar/Rate/rateHelper';

@injectIntl
class EditorObject extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    wObject: PropTypes.shape().isRequired,
    // objectsNumber: PropTypes.number.isRequired,
    isLinkedObjectsValid: PropTypes.bool.isRequired,
    handleRemoveObject: PropTypes.func.isRequired,
    // handleChangeInfluence: PropTypes.func.isRequired,
  };

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     influenceValue: this.props.wObject.influence.value,
  //   };
  // }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.objectsNumber !== this.props.objectsNumber) {
  //     this.handleChangeInfluence(this.props.wObject.influence.value);
  //   }
  // }

  // throttledChange = _.throttle(
  //   influence => this.props.handleChangeInfluence(this.props.wObject, influence),
  //   10,
  // );

  // handleChangeInfluence = influence => {
  //   const influenceValue =
  //     influence < this.props.wObject.influence.max ? influence : this.props.wObject.influence.max;
  //   this.setState({ influenceValue });
  // };

  // handleAfterChangeInfluence = influence => {
  //   this.props.handleChangeInfluence(this.props.wObject, influence);
  // };

  getObjectRatings = () =>
    _.sortBy(
      _.filter(this.props.wObject.fields, ['name', 'rating']),
      [['rating_votes'].length],
      ['desc'],
    );

  getRatingsMarkDown = ratings => {
    // _.orderBy(ratings, [ratings., 'age'], ['asc', 'desc']);
    let layout = null;

    const rateLayout = (colNum, rateIndex, dividerClass) => (
      <Col className={`rate-wrap ${dividerClass}`} span={colNum}>
        <Rate allowHalf disabled value={averageRate(ratings[rateIndex])} />
        <div className="rate-title">{ratings[rateIndex].body}</div>
      </Col>
    );

    if (ratings[0]) {
      layout = (
        <div className="rate-padding">
          <Row>
            {rateLayout(12, 0, '')}
            {ratings[1] && rateLayout(12, 1, 'rate-divider')}
          </Row>
          {ratings[2] && (
            <Row>
              {rateLayout(12, 2, '')}
              {ratings[3] && rateLayout(12, 3, 'rate-divider')}
            </Row>
          )}
        </div>
      );
    }
    return layout;
  };

  render() {
    // const { influenceValue } = this.state;
    const { intl, wObject, handleRemoveObject, isLinkedObjectsValid } = this.props;
    const pathName = `/object/${wObject.id}`;
    const ratings = this.getObjectRatings();
    return (
      <React.Fragment>
        <div
          className={classNames('editor-object', {
            'validation-error': wObject.isNew && !isLinkedObjectsValid,
          })}
        >
          <div className="editor-object__content">
            <Row className="editor-object__content row">
              <Col span={7}>
                <a href={pathName} target="_blank" rel="noopener noreferrer">
                  <img className="editor-object__avatar" src={wObject.avatar} alt={wObject.name} />
                </a>
              </Col>
              <Col span={17} className="editor-object__info">
                <div className="editor-object__type">{wObject.type}</div>
                <a
                  href={pathName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editor-object__name"
                >
                  <div className="editor-object__truncated" title={wObject.name}>
                    {wObject.name}
                  </div>
                  {wObject.rank && <Tag>{wObject.rank}</Tag>}
                </a>
                {ratings && this.getRatingsMarkDown(ratings)}
                {wObject.title && (
                  <span className="editor-object__title" title={wObject.title}>
                    {wObject.title}
                  </span>
                )}
                {/* <div className="editor-object__content row slider"> */}
                {/* <span className="label">{`${influenceValue}%`}</span> */}
                {/* <Slider */}
                {/* min={1} */}
                {/* max={100} */}
                {/* value={influenceValue} */}
                {/* disabled={wObject.influence.value === 100} */}
                {/* onChange={this.handleChangeInfluence} */}
                {/* onAfterChange={this.handleAfterChangeInfluence} */}
                {/* /> */}
                {/* </div> */}
              </Col>
            </Row>
          </div>
          <div className="editor-object__controls">
            <div
              role="button"
              tabIndex={0}
              className="editor-object__control-item delete"
              onClick={() => handleRemoveObject(wObject)}
            >
              <Icon
                type="close"
                className="editor-object__control-item item-icon"
                title={intl.formatMessage({ id: 'remove', defaultMessage: 'Remove' })}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default EditorObject;
