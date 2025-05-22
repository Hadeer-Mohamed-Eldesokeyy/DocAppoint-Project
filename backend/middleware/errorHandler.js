export const errorHandler = (err, req, res, next) => {
  console.error('🔥 Unhandled Error:', err.stack || err.message);

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};
