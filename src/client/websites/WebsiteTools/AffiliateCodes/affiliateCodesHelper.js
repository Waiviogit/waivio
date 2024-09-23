import { objectFields } from '../../../../common/constants/listOfFields';
import { getObjectName } from '../../../../common/helpers/wObjectHelper';

export default null;

export const getNewPostData = (
  formValues,
  langReadable,
  user,
  selectedObj,
  context,
  userUpVotePower,
) => {
  const { body, preview, currentField, currentLocale, follow, ...rest } = formValues;
  const fieldBody = [];
  const postData = [];
  const getAppendMsg = author =>
    `@${author} added ${objectFields.affiliateCode} (${langReadable}): ${
      formValues[objectFields.affiliateCode]
    }, context: ${context}`;

  fieldBody.push(rest[currentField]);
  fieldBody.forEach(bodyField => {
    const data = {};

    data.author = user.name;
    data.isLike = true;
    data.parentAuthor = selectedObj.author;
    data.parentPermlink = selectedObj.author_permlink;
    data.body = getAppendMsg(data.author, bodyField);

    data.title = '';
    const affiliateCodeBody = JSON.stringify([context, ...formValues[objectFields.affiliateCode]]);

    data.field = {
      name: objectFields.affiliateCode,
      locale: langReadable,
      body: affiliateCodeBody,
    };

    data.permlink = `${data.author}-${Math.random()
      .toString(36)
      .substring(2)}`;
    data.lastUpdated = Date.now();

    data.wobjectName = getObjectName(selectedObj);
    data.votePower = userUpVotePower;

    postData.push(data);
  });

  return postData;
};
