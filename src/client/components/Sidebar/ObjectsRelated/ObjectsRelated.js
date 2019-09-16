import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import WeightTag from '../../WeightTag';
import './ObjectsRelated.less';
import { getAuthorsChildWobjects } from '../../../../waivioApi/ApiClient';
import RightSidebarLoading from '../../../app/Sidebar/RightSidebarLoading';
import ObjectCard from '../ObjectCard';

const ObjectsRelated = ({ wobject }) => {
  const [objectsWithMaxFields, setObjectsWithMaxFields] = useState({ objects: [], loading: true });
  const [showModal, setShowModal] = useState(false);
  const [skipValue, setSkipValue] = useState(0);

  const getInitialWobjects = () => {
    getAuthorsChildWobjects(wobject.author_permlink, skipValue, 5)
      .then(data => setObjectsWithMaxFields({ objects: [...data], loading: false }))
      .catch(() => setObjectsWithMaxFields({ loading: false }));
  };

  const getWobjects = () => {
    const skip = skipValue + 5;
    getAuthorsChildWobjects(wobject.author_permlink, skip, 5).then(data => {
      setObjectsWithMaxFields({ objects: [...objectsWithMaxFields.objects, ...data] });
      setSkipValue(skipValue + 5);
    });
  };

  useEffect(() => {
    getInitialWobjects();
    return () => setObjectsWithMaxFields([]) && setSkipValue(0);
  }, [wobject.author_permlink]);

  let renderCard = <RightSidebarLoading id="RightSidebarLoading" />;

  if (!objectsWithMaxFields.loading) {
    if (!_.isEmpty(objectsWithMaxFields.objects)) {
      const renderObjects = objectsWithMaxFields.objects
        .slice(0, 5)
        .map(item => (
          <ObjectCard
            key={item.author_permlink}
            wobject={item}
            showFollow={false}
            alt={<WeightTag weight={item.weight} />}
            isNewWindow={false}
            id="ObjectCard"
          />
        ));

      const renderObjectsModal = objectsWithMaxFields.objects.map(item => (
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
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div>
              <FormattedMessage id="show_more" defaultMessage="Show more" onClick={eventHandler} />
            </div>
            <div>
              <FormattedMessage id="explore" defaultMessage="Explore" />
            </div>
          </h4>
        </React.Fragment>
      );

      renderCard = (
        <div className="SidebarContentBlock" data-test="objectsRelatedComponent">
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
            onCancel={() => setShowModal(false)}
            id="ObjectRelated__Modal"
            onWheel={() => getWobjects()}
          >
            {renderObjectsModal}
            {renderButtons(() => getWobjects())}
          </Modal>
        </div>
      );
    } else {
      renderCard = <div>Empty</div>;
    }
  }

  return renderCard;
};

ObjectsRelated.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  wobject: PropTypes.object.isRequired,
};

export default ObjectsRelated;
