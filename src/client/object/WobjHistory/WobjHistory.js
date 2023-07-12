import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Select, Icon } from 'antd';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router';
import { objectFields } from '../../../common/constants/listOfFields';
import LANGUAGES from '../../../common/translations/languages';
import { getLanguageText } from '../../../common/translations';
import AppendModal from '../AppendModal/AppendModal';
import IconButton from '../../components/IconButton';
import SortSelector from '../../components/SortSelector/SortSelector';
import OBJECT_TYPE from '../const/objectTypes';
import {
  getObjectFieldName,
  getObjectName,
  sortAlphabetically,
} from '../../../common/helpers/wObjectHelper';
import { getExposedFieldsByObjType } from '../wObjectHelper';
import { getIsAuthenticated } from '../../../store/authStore/authSelectors';
import { getObject } from '../../../store/wObjectStore/wObjectSelectors';
import { getReadLanguages } from '../../../store/settingsStore/settingsSelectors';

import './WobjHistory.less';

const WobjHistory = ({
  object,
  readLanguages,
  isAuthenticated,
  setSort,
  setLocale,
  sort,
  locale,
  intl,
}) => {
  const history = useHistory();
  const { 0: fieldUpdate } = useParams();
  const [currField, setCurrField] = useState(
    fieldUpdate ? getObjectFieldName(fieldUpdate, object, intl) : undefined,
  );
  const [showModal, setShowModal] = useState(false);

  const updateFields = getExposedFieldsByObjType(object).reduce(
    (acc, name) => [...acc, { name, translation: getObjectFieldName(name, object, intl) }],
    [],
  );

  const handleFieldChange = translation => {
    const field = updateFields.find(f => f.translation === translation);

    setCurrField(field.translation);

    history.push(
      `/object/${object.author_permlink}/${field.name ? `updates/${field.name}` : 'updates'}`,
    );
  };

  const handleToggleModal = () => setShowModal(!showModal);

  const handleAddBtnClick = () => {
    if (currField === objectFields.pageContent) {
      history.push(`/object/${object.author_permlink}/${OBJECT_TYPE.PAGE}`);
    } else {
      handleToggleModal();
    }
  };

  const filteredLanguages = LANGUAGES.sort((a, b) => {
    if (readLanguages.some(lang => lang === a.id)) return -1;
    if (readLanguages.some(lang => lang === b.id)) return 1;

    return b.id - a.id;
  });

  const objName = getObjectName(object);

  return (
    <React.Fragment>
      <div className="wobj-history__filters">
        <Select
          showSearch
          placeholder={
            <FormattedMessage id="object_field_placeholder" defaultMessage="Object field" />
          }
          value={currField}
          onChange={handleFieldChange}
        >
          {updateFields
            .map(f => (
              <Select.Option key={f.name} value={f.translation}>
                {f.translation}
              </Select.Option>
            ))
            .sort((a, b) => sortAlphabetically(a.props.children, b.props.children))}
        </Select>
        <Select
          placeholder={<FormattedMessage id="language" defaultMessage="All languages" />}
          onChange={setLocale}
          value={locale}
        >
          {filteredLanguages.map(lang => (
            <Select.Option key={lang.id} value={lang.id}>
              {getLanguageText(lang)}
            </Select.Option>
          ))}
        </Select>
        {isAuthenticated && (
          <React.Fragment>
            <IconButton
              icon={<Icon type="plus-circle" />}
              onClick={handleAddBtnClick}
              caption={<FormattedMessage id="add_new_proposition" defaultMessage="Add" />}
            />
            {showModal && (
              <AppendModal
                showModal={showModal}
                hideModal={handleToggleModal}
                chosenLocale={locale}
                field={updateFields.find(f => f.translation === currField).name}
                objName={objName}
                history={history}
              />
            )}
          </React.Fragment>
        )}
      </div>
      <div className="wobj-history__sort">
        <SortSelector sort={sort} onChange={setSort}>
          <SortSelector.Item key="createdAt">
            <FormattedMessage id="recency" defaultMessage="Recency">
              {msg => msg.toUpperCase()}
            </FormattedMessage>
          </SortSelector.Item>
          {/* <SortSelector.Item key="vote"> */}
          {/*  <FormattedMessage id="vote_count_tag" defaultMessage="Vote count"> */}
          {/*    {msg => msg.toUpperCase()} */}
          {/*  </FormattedMessage> */}
          {/* </SortSelector.Item> */}
          <SortSelector.Item key="approvePercent">
            <FormattedMessage id="approval" defaultMessage="Approval">
              {msg => msg.toUpperCase()}
            </FormattedMessage>
          </SortSelector.Item>
        </SortSelector>
      </div>
    </React.Fragment>
  );
};

WobjHistory.propTypes = {
  isAuthenticated: PropTypes.bool,
  readLanguages: PropTypes.arrayOf(PropTypes.string),
  object: PropTypes.shape(),
  intl: PropTypes.shape().isRequired,
  setSort: PropTypes.func.isRequired,
  setLocale: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
};

WobjHistory.defaultProps = {
  readLanguages: ['en-US'],
  isAuthenticated: false,
  object: {},
};

export default connect(state => ({
  object: getObject(state),
  readLanguages: getReadLanguages(state),
  isAuthenticated: getIsAuthenticated(state),
}))(injectIntl(WobjHistory));
