// import React, { useEffect, useState } from 'react';
// import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';
// import { connect } from 'react-redux';
// import { get, isArray } from 'lodash';
// import PropTypes from 'prop-types';
// import { Tabs } from 'antd';
//
// import { getTagsSite, getWebsiteLoading } from '../../../reducers';
// import { getWebsiteTags, saveTagsCategoryForSite } from '../../websiteActions';
// import TagsSelector from '../../../components/TagsSelector/TagsSelector';
//
// // import './WebsiteObjectFilters.less';
//
// export const WebsiteRestrictions = ({ match, intl }) => {
//   const [currentTags, setCurrentTags] = useState(null);
//   const host = match.params.site;
//
//   useEffect(() => {}, []);
//
//   return (
//     <div className="WebsiteObjectFilters">
//       <Tabs defaultActiveKey="1" style={{ height: 220 }}>
//         <Tabs.TabPane tab="Muted" key="1" />
//         <Tabs.TabPane tab="Blacklisted" key="2" />
//       </Tabs>
//     </div>
//   );
// };
//
// WebsiteRestrictions.propTypes = {
//   intl: PropTypes.shape({
//     formatMessage: PropTypes.func,
//   }).isRequired,
//   match: PropTypes.shape({
//     params: PropTypes.shape({
//       site: PropTypes.string,
//     }),
//   }).isRequired,
//   getWebTags: PropTypes.func.isRequired,
//   saveCategoryForSite: PropTypes.func.isRequired,
//   categories: PropTypes.shape({}).isRequired,
// };
//
// export default connect(
//   state => ({
//     isLoading: getWebsiteLoading(state),
//     categories: getTagsSite(state),
//   }),
//   {
//     getWebTags: getWebsiteTags,
//     saveCategoryForSite: saveTagsCategoryForSite,
//   },
// )(injectIntl(WebsiteRestrictions));
