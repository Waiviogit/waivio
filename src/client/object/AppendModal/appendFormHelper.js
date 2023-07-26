export const validateAffiliateUrl = (rule, url, callback) => {
  const websiteRegex = /^(https?:\/\/)/;
  const validUrl = websiteRegex.test(url);

  const containsProductId = url.includes('PRODUCTID');
  const containsAffiliateCode = url.includes('AFFILIATECODE');

  if (validUrl && containsProductId && containsAffiliateCode) {
    callback();
  }
  callback(
    'Please enter valid URL. It should begin with the website name and include PRODUCTID and AFFILIATECODE.',
  );
};
export default null;
