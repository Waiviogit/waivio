import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { has, isNil } from 'lodash';
import Editor from '@react-page/editor';
import slate from '@react-page/plugins-slate';
import image from '@react-page/plugins-image';
import background from '@react-page/plugins-background';
import spacer from '@react-page/plugins-spacer';
import video from '@react-page/plugins-video';
import divider from '@react-page/plugins-divider';
import { getObject } from '../../../waivioApi/ApiClient';
import { colorPickerPlugin } from './colorPickerPlugin';
import { getIsEditMode } from '../../../store/wObjectStore/wObjectSelectors';
import AppendModal from '../AppendModal/AppendModal';
import { objectFields } from '../../../common/constants/listOfFields';
import { getObjectName } from '../../../common/helpers/wObjectHelper';

import './ObjectOfTypeWebpage.less';

const customSlate = slate(config => ({
  ...config,
  plugins: {
    ...config.plugins,
    color: {
      colorPicker: colorPickerPlugin,
    },
  },
}));

const plugins = [customSlate, image, background(), video, spacer, divider];

const ObjectOfTypeWebpage = ({ intl }) => {
  const [wobject, setWobject] = useState({});
  const [currentValue, setCurrentValue] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const isEditMode = useSelector(getIsEditMode);
  const { name } = useParams();
  const jsonVal = currentValue ? JSON.stringify(currentValue) : null;

  useEffect(() => {
    getObject(name).then(res => {
      setWobject(res);
      if (has(res, 'webpage')) {
        setCurrentValue(JSON.parse(res?.webpage));
      }
    });
  }, [name, wobject.webpage]);

  if ((isNil(currentValue) || currentValue?.rows.length < 1) && !isEditMode) {
    return (
      <React.Fragment>
        <div className="ObjectOfTypeWebpage__empty-placeholder">
          <span>
            {intl.formatMessage({
              id: 'empty_webpage_content',
              defaultMessage: 'This webpage has no content. Click Edit to start.',
            })}
          </span>
        </div>
      </React.Fragment>
    );
  }

  return (
    <div className="ObjectOfTypeWebpage">
      <Editor
        readOnly={!isEditMode || showModal}
        cellPlugins={plugins}
        value={currentValue}
        onChange={newValue => setCurrentValue(newValue)}
      />
      {isEditMode && (
        <div className="object-of-type-page__row align-center">
          <Button
            htmlType="button"
            // disabled={isNil(currentValue)}
            onClick={() => setShowModal(true)}
            size="large"
          >
            {intl.formatMessage({ id: 'ready_to_publish', defaultMessage: 'Ready to publish' })}
          </Button>
        </div>
      )}
      {showModal && (
        <AppendModal
          objName={getObjectName(wobject)}
          showModal={showModal}
          hideModal={() => setShowModal(false)}
          fieldBodyContent={jsonVal}
          field={objectFields.webpage}
        />
      )}
    </div>
  );
};

ObjectOfTypeWebpage.propTypes = {
  intl: PropTypes.shape(),
};

export default injectIntl(ObjectOfTypeWebpage);
