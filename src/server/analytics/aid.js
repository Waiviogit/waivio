import crypto from 'crypto';

export const newAid = () => crypto.randomUUID();

export const getOrSetAidCookie = (req, res) => {
  let aid = req.cookies?.aid;

  if (!aid || typeof aid !== 'string' || aid.length > 80) {
    aid = newAid();

    res.cookie('aid', aid, {
      maxAge: 365 * 24 * 3600 * 1000,
      sameSite: 'lax',
      secure: req.secure,
      httpOnly: false,
      path: '/',
    });
  }

  return aid;
};
