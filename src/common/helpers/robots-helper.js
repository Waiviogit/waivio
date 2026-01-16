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
Disallow: /api/export/all

Sitemap: https://${host}/sitemap.xml
`;
export default null;
