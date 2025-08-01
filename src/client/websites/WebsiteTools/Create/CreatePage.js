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
  resetAvailableStatus,
} from '../../../../store/websiteStore/websiteActions';

const CreatePage = ({
  intl,
  form,
  getDomainList,
  checkStatusAvailableDomain,
  availableStatus,
  createWebsite,
  loading,
  resetStatus,
}) => {
  const parentDomain = useSelector(getParentDomain);
  const template = form.getFieldValue('parent');
  const subDomain = form.getFieldValue('domain') || form.getFieldValue('host');
  const history = useHistory();
  const available = get(availableStatus, 'status');
  const [searchString, setSearchString] = useState('');
  const [tab, setTab] = useState('1');

  const domainNamesList = Object.keys(parentDomain);
  const showingParentList = searchString
    ? domainNamesList.filter(host => host.includes(searchString))
    : domainNamesList;
  const statusMessageClassList = available ? 'CreateWebsite__available' : 'CreateWebsite__error';

  const handleSearchHost = value => setSearchString(value);

  useEffect(() => {
    getDomainList();

    return () => resetStatus();
  }, []);

  const domainStatus = useCallback(
    debounce(
      () =>
        checkStatusAvailableDomain(
          subDomain.toLowerCase(),
          parentDomain[template],
          Boolean(form.getFieldValue('host')),
        ),
      300,
    ),
    [template, subDomain],
  );

  useEffect(() => {
    if (subDomain) domainStatus();
  }, [template, subDomain]);

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err && available) {
        createWebsite(values, history);
        form.resetFields();
      }
    });
  };

  const onSelect = value => {
    form.setFieldsValue({ parent: value });
    setSearchString('');
  };

  return (
    <Tabs
      defaultActiveKey="1"
      onChange={key => {
        form.resetFields();
        resetStatus();
        setTab(key);
      }}
      className="CreateWebsite"
    >
      <Tabs.TabPane
        tab={intl.formatMessage({
          id: 'standard_tab',
          defaultMessage: 'Standard',
        })}
        key="1"
      >
        {tab === '1' && (
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
            availableStatus={availableStatus}
          />
        )}
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={intl.formatMessage({
          id: 'custom_domain_tab',
          defaultMessage: 'Custom domain',
        })}
        key="2"
      >
        {tab === '2' && (
          <CreateCustomWebsite
            showingParentList={showingParentList}
            statusMessageClassList={statusMessageClassList}
            handleSearchHost={handleSearchHost}
            onSelect={onSelect}
            loading={loading}
            createWebsite={createWebsite}
            intl={intl}
            parentDomain={parentDomain}
            form={form}
            template={template}
            availableStatus={availableStatus}
          />
        )}
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
  resetStatus: PropTypes.func,
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
    resetStatus: resetAvailableStatus,
  },
)(Form.create()(injectIntl(CreatePage)));
