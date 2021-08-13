import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet/es/Helmet';
import { connect } from 'react-redux';
import { getCurrentHost, getHelmetIcon, getWebsiteName } from '../../store/appStore/appSelectors';

const Seo = props => {
  const title = props.title ? `${props.title} - ${props.websiteName}` : props.websiteName;
  const url = props.domain + props.params;
  const image = props.image || props.favicon;
  const description = props.desc || props.websiteName;

  return (
    <Helmet>
      <title>{title}</title>
      <link rel="canonical" href={url} />
      <meta property="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:url" content={image} />
      <meta property="og:image:width" content="600" />
      <meta property="og:image:height" content="600" />
      <meta property="og:description" content={description} />
      <meta name="twitter:card" content={props.image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:site" content={'@waivio'} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" property="twitter:image" content={image} />
      <meta property="og:site_name" content={props.websiteName} />
      {props.created && (
        <meta
          name="article:published_time"
          property="article:published_time"
          content={props.created}
        />
      )}
      {props.category && (
        <meta name="article:tag" property="article:tag" content={props.category} />
      )}
      {props.ampUrl && <link rel="amphtml" href={props.ampUrl} />}
      <link rel="image_src" href={image} />
      <link id="favicon" rel="icon" href={props.favicon} type="image/x-icon" />
    </Helmet>
  );
};

Seo.propTypes = {
  title: PropTypes.string.isRequired,
  websiteName: PropTypes.string.isRequired,
  domain: PropTypes.string.isRequired,
  params: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  favicon: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  created: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  ampUrl: PropTypes.string.isRequired,
};

export default connect(state => ({
  favicon: getHelmetIcon(state),
  domain: getCurrentHost(state),
  websiteName: getWebsiteName(state),
}))(Seo);
