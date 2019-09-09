import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import WeightTag from '../WeightTag';
import './ObjectsRelated.less';
import { getAuthorsChildWobjects } from '../../../waivioApi/ApiClient';
import RightSidebarLoading from '../../app/Sidebar/RightSidebarLoading';
import ObjectCard from './ObjectCard';

const ObjectsRelated = ({ wobject }) => {
  const [objectsWithMaxFields, setObjectsWithMaxFields] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [skipValue, setSkipValue] = useState(0);

  const getWobjects = () => {
    const skip = skipValue + 5;
    getAuthorsChildWobjects(wobject.author_permlink, skip, 5).then(data => {
      setObjectsWithMaxFields([...objectsWithMaxFields, ...data]);
      setSkipValue(skipValue + 5);
    });
  };

  const getInitialWobjects = () => {
    getAuthorsChildWobjects(wobject.author_permlink, skipValue, 5)
      .then(data =>
        setObjectsWithMaxFields((prevState, props) => (prevState === props ? [] : data)),
      )
      .catch(setObjectsWithMaxFields([]));
  };

  useEffect(() => {
    getInitialWobjects();
    return () => setObjectsWithMaxFields([]) && setSkipValue(0);
  }, [wobject.author_permlink]);

  let renderCard = <RightSidebarLoading />;

  if (!_.isEmpty(objectsWithMaxFields)) {
    const renderObjects = objectsWithMaxFields
      .slice(0, 5)
      .map(item => (
        <ObjectCard
          key={item.author_permlink}
          wobject={item}
          showFollow={false}
          alt={<WeightTag weight={item.weight} />}
          isNewWindow={false}
        />
      ));

    const renderObjectsModal = objectsWithMaxFields.map(item => (
      <ObjectCard
        key={item.author_permlink}
        wobject={item}
        showFollow={false}
        alt={<WeightTag weight={item.weight} />}
        isNewWindow={false}
      />
    ));

    const renderButtons = eventHandler => (
      <React.Fragment>
        <h4 className="ObjectsRelated__more">
          <div role="presentation" onClick={eventHandler}>
            <FormattedMessage id="show_more" defaultMessage="Show more" />
          </div>
          <div>
            <FormattedMessage id="explore" defaultMessage="Explore" />
          </div>
        </h4>
      </React.Fragment>
    );

    renderCard = (
      <div className="SidebarContentBlock">
        <h4 className="SidebarContentBlock__title">
          <i className="iconfont icon-collection SidebarContentBlock__icon" />{' '}
          <FormattedMessage id="object_related" defaultMessage="Related" />
        </h4>
        <div className="SidebarContentBlock__content">{renderObjects}</div>
        {renderButtons(() => setShowModal(true))}
        <Modal
          title="Related"
          visible={showModal}
          onOk={() => setShowModal(false)}
          onCancel={() => getWobjects()}
        >
          {renderObjectsModal}
          {renderButtons(() => setShowModal(true))}
        </Modal>
      </div>
    );
  } else {
    renderCard = null;
  }
  return renderCard;
};

ObjectsRelated.propTypes = {
  wobject: PropTypes.shape().isRequired,
};

export default ObjectsRelated;
