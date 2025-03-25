import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { objAuthorPermlink } from '../socialProductHelper';
import { objectFields } from '../../../../common/constants/listOfFields';
import { getBrandName, getObjectName } from '../../../../common/helpers/wObjectHelper';
import { getLink } from '../../../object/wObjectHelper';

const SocialListItem = ({ fieldName, field, title, showTitle }) => {
  const fieldPermlink = field.author_permlink || field.authorPermlink;
  const getLayout = () => {
    switch (fieldName) {
      case objectFields.parent:
      case objectFields.merchant:
      case objectFields.manufacturer:
        return objAuthorPermlink(field) ? (
          <Link to={`/object/${objAuthorPermlink(field)}`}>{field.name}</Link>
        ) : (
          <Link to={`/discover-objects/product?search=${field.name}`}>{field.name}</Link>
        );
      case objectFields.brand: {
        return (
          <Link to={`/discover-objects/product?search=${getBrandName(field)}`}>
            {getBrandName(field)}
          </Link>
        );
      }
      case objectFields.productWeight:
        return (
          <span>
            {field.value} {field.unit}
          </span>
        );

      case objectFields.dimensions:
        return (
          <span>
            {field.length} x {field.width} x {field.depth} {field.unit}
          </span>
        );
      case objectFields.website:
        return (
          <span>
            <a target="_blank" rel="noopener noreferrer" href={getLink(field.link)}>
              {field.title}
            </a>
          </span>
        );
      case objectFields.printLength:
        return (
          <>
            {' '}
            <span>{field}</span> <FormattedMessage id="lowercase_pages" />{' '}
          </>
        );
      case 'authors':
        return (
          <span>
            {field.map((a, i) => (
              <>
                <>
                  {a.author_permlink || a.authorPermlink ? (
                    <Link key={a.defaultShowLink} to={a.defaultShowLink}>
                      {a.name}
                    </Link>
                  ) : (
                    <span key={a.defaultShowLink}>{a.name}</span>
                  )}
                </>
                {i !== field.length - 1 && ','}
                {'  '}
              </>
            ))}
          </span>
        );
      case objectFields.publisher:
        return fieldPermlink ? (
          <span>
            <Link to={field.defaultShowLink}>{getObjectName(field)}</Link>
          </span>
        ) : (
          <Link to={`/discover-objects/book?search=${field.name}`}>{field.name}</Link>
        );
      default:
        return <span>{field}</span>;
    }
  };

  return (
    <div className={showTitle ? 'paddingBottom' : ''}>
      {showTitle && (
        <b>
          {title || (
            <FormattedMessage id={`object_field_${fieldName}`} defaultMessage={fieldName} />
          )}
          :{' '}
        </b>
      )}
      {getLayout(fieldName, field)}
    </div>
  );
};

SocialListItem.propTypes = {
  fieldName: PropTypes.string,
  title: PropTypes.string,
  field: PropTypes.shape(),
  showTitle: PropTypes.bool,
};

SocialListItem.defaultProps = {
  showTitle: true,
};

export default SocialListItem;
