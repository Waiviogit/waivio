import React from 'react';
import PropTypes from 'prop-types';
import { Slider } from 'antd';
import './PostObjectCard.less';
import ObjectRank from '../../object/ObjectRank';
import ObjectType from '../../object/ObjectType';

const propTypes = {
  wObject: PropTypes.shape().isRequired,
  influenceValue: PropTypes.number.isRequired,
};

const PostObjectCard = ({ wObject, influenceValue }) => {
  const pathName = `/object/${wObject.id}`;
  return (
    <React.Fragment>
      <div
        style={{
          backgroundImage: `url(${wObject.background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="editor-object"
      >
        <div className="background-transparent">
          <div className="editor-object__content">
            <div className="editor-object__content row">
              <a href={pathName} target="_blank" rel="noopener noreferrer">
                <img className="editor-object__avatar" src={wObject.avatar} alt={wObject.name} />
              </a>
              <div className="editor-object__info">
                <a
                  href={pathName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editor-object__info name"
                  title={wObject.name}
                >
                  <span className="editor-object__truncated">{wObject.name}</span>
                </a>
                {wObject.type && wObject.rank && (
                  <div className="editor-object__rankWrap">
                    <div className="editor-object__type">
                      <ObjectType type={wObject.type} />
                    </div>
                    <div className="editor-object__rank">
                      <ObjectRank rank={wObject.rank} />
                    </div>
                  </div>
                )}
                {wObject.title && (
                  <span className="editor-object__truncated" title={wObject.title}>
                    {wObject.title}
                  </span>
                )}
              </div>
            </div>
            <div className="editor-object__content row slider">
              <span className="label">{`${influenceValue}%`}</span>
              <Slider min={1} max={100} value={influenceValue} disabled />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

PostObjectCard.propTypes = propTypes;

export default PostObjectCard;
