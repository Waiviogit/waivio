export const getRobotsTxtContent = host => `User-agent: *
Disallow: /settings/
Disallow: /bookmarks/
Disallow: /drafts/
Disallow: /edit-profile/
Disallow: /editor/

Sitemap: https://${host}/sitemap.xml
`;
export default null;
