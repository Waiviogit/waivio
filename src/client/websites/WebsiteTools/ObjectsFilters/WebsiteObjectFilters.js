import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { get, isArray, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Button } from 'antd';

import { getTagsSite, getWebsiteLoading } from '../../../reducers';
import { getWebsiteTags, saveTagsCategoryForSite } from '../../websiteActions';
import TagsSelector from '../../../components/TagsSelector/TagsSelector';
import Loading from '../../../components/Icon/Loading';

import './WebsiteObjectFilters.less';

export const WebsiteObjectFilters = ({
  match,
  intl,
  getWebTags,
  categories,
  saveCategoryForSite,
  location,
}) => {
  const [currentTags, setCurrentTags] = useState(null);
  const host = match.params.site;

  useEffect(() => {
    getWebTags(host);
  }, [location.pathname]);

  if (isEmpty(categories)) return <Loading />;

  const saveTags = () => saveCategoryForSite(host, currentTags);

  const handleChangeCurrentTags = (topic, category, tag) => {
    const topics = { ...categories };
    const currentCategoriesTag = topics[topic][category];

    if (isArray(tag)) topics[topic][category] = tag;
    else topics[topic][category] = [...currentCategoriesTag, tag];

    setCurrentTags(topics);
  };

  return (
    <div className="WebsiteObjectFilters">
      <h1>
        <FormattedMessage id="object_filters" defaultMessage="Object filters" />
      </h1>
      <p>
        {intl.formatMessage({
          id: 'filter_tags_will_appear',
          defaultMessage:
            'The objects matching any of the specified filter tags will appear on the website. For example, if you want to display only vegetarian and vegan dishes on the site, you can specify the filter for the dish category: vegetarian, vegan.',
        })}
      </p>
      <p>
        {intl.formatMessage({
          id: 'display_available_objects',
          defaultMessage: 'If you want to display all available objects, leave the filters empty.',
        })}
      </p>
      {Object.keys(categories).map(topic => (
        <div key={topic}>
          <h2>{topic}</h2>
          <div>
            {Object.keys(categories[topic]).map(category => (
              <div key={category} className="WebsiteObjectFilters__category">
                <h4>{category}</h4>
                <TagsSelector
                  tags={get(categories, [topic, category], [])}
                  onChange={tag => handleChangeCurrentTags(topic, category, tag)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="WebsiteObjectFilters__button-wrap">
        <Button type="primary" onClick={saveTags} disabled={!currentTags}>
          {intl.formatMessage({
            id: 'save',
            defaultMessage: 'Save',
          })}
        </Button>
      </div>
    </div>
  );
};

WebsiteObjectFilters.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      site: PropTypes.string,
    }),
  }).isRequired,
  getWebTags: PropTypes.func.isRequired,
  saveCategoryForSite: PropTypes.func.isRequired,
  categories: PropTypes.shape({}).isRequired,
  location: PropTypes.shape().isRequired,
};

export default connect(
  state => ({
    isLoading: getWebsiteLoading(state),
    categories: getTagsSite(state),
  }),
  {
    getWebTags: getWebsiteTags,
    saveCategoryForSite: saveTagsCategoryForSite,
  },
)(withRouter(injectIntl(WebsiteObjectFilters)));
