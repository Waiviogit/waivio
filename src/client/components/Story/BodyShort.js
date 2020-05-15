import React from 'react';
import PropTypes from 'prop-types';
import ellipsis from 'text-ellipsis';
import striptags from 'striptags';
import Remarkable from 'remarkable';
import { forecastPostMessage } from '../../helpers/postHelpers';

const remarkable = new Remarkable({ html: true });

function decodeEntities(body) {
  return body.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

const BodyShort = props => {
  let body = props.body;
  const guestInfo = props.guestInfo;

  const isForecastPost = body.indexOf(forecastPostMessage) > 0;
  let forecastMessage;
  if (isForecastPost) {
    body = body.slice(0, body.indexOf(forecastPostMessage));
    forecastMessage = props.body.slice(props.body.indexOf(forecastPostMessage));
    forecastMessage = striptags(remarkable.render(striptags(decodeEntities(forecastMessage))));
    forecastMessage = guestInfo
      ? forecastMessage.replace(/\WThis message/, '. This message')
      : forecastMessage.replace(/(?:https?|ftp):\/\/[\S]+/g, '');
  }

  body = striptags(remarkable.render(striptags(decodeEntities(body))));

  body = body.replace(/(?:https?|ftp):\/\/[\S]+/g, '');

  // If body consists of whitespace characters only skip it.
  if (!body.replace(/\s/g, '').length) {
    return null;
  }

  /* eslint-disable react/no-danger */
  return (
    <div className={props.className}>
      {ellipsis(body, props.length, { ellipsis: '…' })}
      {isForecastPost && <div className="Body-short__line">{forecastMessage}</div>}
    </div>
  );
  /* eslint-enable react/no-danger */
};

BodyShort.propTypes = {
  className: PropTypes.string,
  body: PropTypes.string,
  length: PropTypes.number,
  guestInfo: PropTypes.shape({
    userId: PropTypes.string,
    social: PropTypes.string,
  }),
};

BodyShort.defaultProps = {
  className: '',
  body: '',
  length: 140,
  guestInfo: null,
};

export default BodyShort;
