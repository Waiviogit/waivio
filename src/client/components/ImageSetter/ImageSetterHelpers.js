import { message } from 'antd';

export default function addImageByLink(image, getImageByLink, intl) {
  const checkIsImage = isValidLink => {
    if (isValidLink) {
      getImageByLink(image);
    } else {
      message.error(
        intl.formatMessage({
          id: 'imageSetter_invalid_link',
          defaultMessage: 'The link is invalid',
        }),
      );
    }
  };
  const img = new Image();
  img.src = image.src;
  img.onload = () => checkIsImage(true);
  img.onerror = () => checkIsImage(false);
}
