import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { injectIntl } from 'react-intl';

import WeightTag from '../../WeightTag';
import { getAuthorsChildWobjects } from '../../../../waivioApi/ApiClient';
import RightSidebarLoading from '../../../app/Sidebar/RightSidebarLoading';
import ObjectCard from '../ObjectCard';
import { AppSharedContext } from '../../../Wrapper';

import './ObjectsRelated.less';

const ObjectsRelated = ({ wobject, intl }) => {
  const [objectsState, setObjectsState] = useState({
    objects: [],
    loading: true,
    skip: 0,
    hasNext: true,
  });
  const [showModal, setShowModal] = useState(false);
  const { usedLocale } = useContext(AppSharedContext);
  const getInitialWobjects = () => {
    getAuthorsChildWobjects(wobject.author_permlink, objectsState.skip, 5, usedLocale)
      .then(data => {
        const objects = data.map(wobj => ({
          ...wobj,
          parent: wobject,
        }));

        setObjectsState({
          objects: [...objects],
          loading: false,
          skip: 5,
          hasNext: data.length === 5,
        });
      })
      .catch(() => setObjectsState({ loading: false }));
  };

  const getWobjects = () => {
    getAuthorsChildWobjects(wobject.author_permlink, objectsState.skip, 5, usedLocale)
      .then(data => {
        const objects = data.map(wobj => ({
          ...wobj,
          parent: wobject,
        }));

        setObjectsState({
          objects: [...objectsState.objects, ...objects],
          skip: objectsState.skip + 5,
          hasNext: data.length === 5,
        });
      })
      .catch(() => setObjectsState({ ...objectsState, hasNext: false }));
  };

  useEffect(() => {
    getInitialWobjects();
  }, [wobject.author_permlink]);

  let renderCard = <RightSidebarLoading id="RightSidebarLoading" />;

  if (!objectsState.loading) {
    if (!_.isEmpty(objectsState.objects)) {
      const renderObjects = objectsState.objects
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

      const renderObjectsModal = objectsState.objects.map(item => (
        <ObjectCard
          key={item.author_permlink}
          wobject={item}
          parent={wobject}
          showFollow={false}
          alt={<WeightTag weight={item.weight} />}
          isNewWindow={false}
        />
      ));

      const renderButtons = () => (
        <div className="ObjectsRelated__more">
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <a onClick={() => setShowModal(true)} id="show_more_div">
            {intl.formatMessage({ id: 'show_more', defaultMessage: 'Show more' })}
          </a>
        </div>
      );

      const onWheelHandler = () => {
        if (objectsState.hasNext) {
          getWobjects();
        }
      };

      renderCard = (
        <div className="SidebarContentBlock" data-test="objectsRelatedComponent">
          <div className="SidebarContentBlock__title">
            <i className="iconfont icon-link SidebarContentBlock__icon" />{' '}
            {intl.formatMessage({ id: 'related_to_object', defaultMessage: 'Related to object' })}
          </div>
          <div className="SidebarContentBlock__content">{renderObjects}</div>
          {renderButtons()}
          <div onWheel={_.throttle(onWheelHandler, 100)}>
            <Modal
              title="Related"
              visible={showModal}
              footer={null}
              onCancel={() => setShowModal(false)}
              id="ObjectRelated__Modal"
            >
              {renderObjectsModal}
            </Modal>
          </div>
        </div>
      );
    } else {
      renderCard = null;
    }
  }

  return renderCard;
};

ObjectsRelated.propTypes = {
  wobject: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(ObjectsRelated);
