import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Slider } from 'antd';
import ObjectType from '../../object/ObjectType';
import { getClientWObj } from '../../adapters';
import Topic from '../../components/Button/Topic';
import { UsedLocaleContext } from '../../Wrapper';
import './PostObjectCard.less';

const propTypes = {
  wObject: PropTypes.shape().isRequired,
};

const PostObjectCard = ({ wObject }) => {
  const usedLocale = useContext(UsedLocaleContext);
  const object = getClientWObj(wObject, usedLocale);
  const pathName = `/object/${object.id}`;
  return (
    <React.Fragment>
      <div
        style={{
          backgroundImage: `url(${object.background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="editor-object"
      >
        <div className="background-transparent">
          <div className="editor-object__content">
            <div className="editor-object__content row">
              <a href={pathName} target="_blank" rel="noopener noreferrer">
                <img className="editor-object__avatar" src={object.avatar} alt={object.name} />
              </a>
              <div className="editor-object__info">
                <a
                  href={pathName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editor-object__info name"
                  title={object.name}
                >
                  <span className="editor-object__truncated">{object.name}</span>
                </a>
                {wObject.object_type && wObject.rank && (
                  <div className="editor-object__rankWrap">
                    <div className="editor-object__type">
                      <ObjectType type={wObject.object_type} />
                    </div>
                  </div>
                )}
                {object.title && (
                  <span className="editor-object__truncated" title={object.title}>
                    {object.title}
                  </span>
                )}
              </div>
            </div>
            <div className="editor-object__content row slider">
              <span className="label">{`${wObject.percent}%`}</span>
              <Slider min={1} max={100} value={wObject.percent} disabled />
            </div>
          </div>
          {wObject.tagged && (
            <div className="editor-object__tag">
              <Topic key={wObject.tagged} name={wObject.tagged} />
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

PostObjectCard.propTypes = propTypes;

export default PostObjectCard;
