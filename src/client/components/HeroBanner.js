import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { map } from 'lodash';
import { Carousel } from 'antd';
import './HeroBanner.less';
import './HeroBannerSlider.less';

class HeroBanner extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    onCloseClick: PropTypes.func,
  };

  static defaultProps = {
    visible: true,
    onCloseClick: () => {},
  };

  static BANNER_CONTENTS = [
    {
      image: '/images/hero-1.svg',
      titleID: 'hero_banner_title_1',
      defaultTitle: 'Post your investing insight',
      className: 'HeroBannerSlider__image',
      number: 1,
    },
    {
      image: '/images/hero-2.svg',
      titleID: 'hero_banner_title_2',
      defaultTitle: 'The community votes for your posts',
      className: 'HeroBannerSlider__image',
      number: 2,
    },
    {
      image: '/images/hero-3.svg',
      titleID: 'hero_banner_title_3',
      defaultTitle: 'Earn rewards in Hive',
      className: 'HeroBannerSlider__image',
      number: 3,
    },
    {
      image: '/images/hero-4.svg',
      titleID: 'hero_banner_title_4',
      defaultTitle: 'Withdraw your money',
      className: 'HeroBannerSlider__image',
      number: 4,
    },
  ];

  render() {
    const { onCloseClick, visible } = this.props;
    if (!visible) return null;

    return (
      <div className="HeroBanner">
        <a onClick={onCloseClick} role="button" tabIndex="0" className="HeroBanner__close">
          <i className="iconfont icon-close" />
        </a>
        <div className="HeroBanner__container">
          <div className="HeroBanner__content-container">
            {map(HeroBanner.BANNER_CONTENTS, (content, idx) => (
              <React.Fragment>
                <div className="HeroBanner__content" key={content.titleID}>
                  <img
                    src={content.image}
                    className="HeroBanner__content__image"
                    alt={content.defaultTitle}
                  />
                  <div className="HeroBanner__content__description">
                    <div className="HeroBanner__content__title">
                      <FormattedMessage
                        id={content.titleID}
                        defaultMessage={content.defaultTitle}
                      />
                    </div>
                    <div className="HeroBanner__content__number">{content.number}</div>
                  </div>
                </div>
                {idx !== HeroBanner.BANNER_CONTENTS.length - 1 && (
                  <img
                    src="/images/banner-arrow.svg"
                    alt="banner-arrow"
                    style={{ height: '140px' }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="HeroBannerSlider__container">
            <Carousel effect="fade" autoplay autoplaySpeed={8000}>
              {map(HeroBanner.BANNER_CONTENTS, slide => (
                <div key={slide.titleID}>
                  <div className="HeroBannerSlider">
                    <div className={slide.className}>
                      <img src={slide.image} alt={slide.titleID} />
                    </div>
                    <div className="HeroBannerSlider__content">
                      <div className="HeroBannerSlider__content__number">{slide.number}</div>
                      <div className="HeroBannerSlider__content__title">
                        <FormattedMessage id={slide.titleID} defaultMessage={slide.defaultTitle} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    );
  }
}

export default HeroBanner;
