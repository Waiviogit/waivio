export const getRobotsTxtContent = host => `User-agent: *
Disallow: /settings/
Disallow: /bookmarks/
Disallow: /drafts/
Disallow: /edit-profile/
Disallow: /editor/
Disallow: /@*/activity
Disallow: /@*/map
Disallow: /@*/threads
Disallow: /@*/comments
Disallow: /@*/transfers
Disallow: /@*/mentions

Sitemap: https://${host}/sitemap.xml
`;
export default null;
