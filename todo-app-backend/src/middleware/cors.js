const ALLOWED_ORIGIN = 'http://localhost:5173';

function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;
  const allowOrigin = origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : origin || '*';

  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  if (origin) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Origin, Accept');
  res.setHeader('Access-Control-Expose-Headers', 'Authorization');
  res.setHeader('Access-Control-Max-Age', '3600');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
}

module.exports = corsMiddleware;
