import React, { useEffect, useCallback, useState } from 'react';
import { Form, Tabs } from 'antd';
import { connect, useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import { debounce, get } from 'lodash';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';

import CreateWebsite from './CreateWebsite';
import CreateCustomWebsite from './CreateCustomWebsite';
import {
  getCreateWebsiteLoading,
  getDomainAvailableStatus,
  getParentDomain,
} from '../../../../store/websiteStore/websiteSelectors';
import {
  checkAvailableDomain,
  createNewWebsite,
  getParentDomainList,
} from '../../../../store/websiteStore/websiteActions';

const CreatePage = ({
  intl,
  form,
  getDomainList,
  checkStatusAvailableDomain,
  availableStatus,
  createWebsite,
  loading,
}) => {
  const parentDomain = useSelector(getParentDomain);
  const template = form.getFieldValue('parent');
  const subDomain = form.getFieldValue('domain');
  const history = useHistory();
  const available = get(availableStatus, 'status');
  const [searchString, setSearchString] = useState('');

  const domainNamesList = Object.keys(parentDomain);
  const showingParentList = searchString
    ? domainNamesList.filter(host => host.includes(searchString))
    : domainNamesList;
  const statusMessageClassList = available ? 'CreateWebsite__available' : 'CreateWebsite__error';

  const handleSearchHost = value => setSearchString(value);

  useEffect(() => {
    getDomainList();
  }, []);

  const domainStatus = useCallback(
    debounce(
      () =>
        checkStatusAvailableDomain(
          form.getFieldValue('domain').toLowerCase(),
          parentDomain[template],
        ),
      300,
    ),
    [template],
  );

  useEffect(() => {
    if (subDomain) domainStatus();
  }, [template]);

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err && available) {
        createWebsite(values, history).then(() => form.resetFields());
      }
    });
  };

  const onSelect = value => {
    form.setFieldsValue({ parent: value });
    setSearchString('');
  };

  return (
    <Tabs defaultActiveKey="1" onChange={() => {}}>
      <Tabs.TabPane tab="Standart" key="1">
        <CreateWebsite
          showingParentList={showingParentList}
          statusMessageClassList={statusMessageClassList}
          handleSearchHost={handleSearchHost}
          onSelect={onSelect}
          loading={loading}
          handleSubmit={handleSubmit}
          intl={intl}
          parentDomain={parentDomain}
          form={form}
          template={template}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Custom domain" key="2" disabled>
        <CreateCustomWebsite
          showingParentList={showingParentList}
          onSelect={onSelect}
          loading={loading}
          statusMessageClassList={statusMessageClassList}
          handleSearchHost={handleSearchHost}
          handleSubmit={handleSubmit}
          intl={intl}
          parentDomain={parentDomain}
          form={form}
          template={template}
        />
      </Tabs.TabPane>
    </Tabs>
  );
};

CreatePage.propTypes = {
  intl: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
  availableStatus: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  getDomainList: PropTypes.func,
  checkStatusAvailableDomain: PropTypes.func,
  createWebsite: PropTypes.func,
};

export default connect(
  state => ({
    availableStatus: getDomainAvailableStatus(state),
    parentDomain: getParentDomain(state),
    loading: getCreateWebsiteLoading(state),
  }),
  {
    getDomainList: getParentDomainList,
    checkStatusAvailableDomain: checkAvailableDomain,
    createWebsite: createNewWebsite,
  },
)(Form.create()(injectIntl(CreatePage)));
