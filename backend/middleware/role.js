/**
 * Higher-order middleware to check if the user's role is in the allowed roles.
 * Must be used AFTER verifyToken middleware.
 *
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'member')
 */
const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(' or ')}`,
      });
    }

    next();
  };
};

module.exports = checkRole;
