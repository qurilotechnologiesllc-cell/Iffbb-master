import { jwtVerify } from 'jose';

// User Authentication Middleware


export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies?.['user-auth-token'];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No user token provided.',
      });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret);

    req.user = {
      userId: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error) {
    console.error('User authentication error:', error.message);

    res.clearCookie('user-auth-token', {
      path: '/',
    });

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired user token.',
    });
  }
};


// Admin Authentication Middleware
export const authenticateAdmin = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies['admin-auth-token'];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No admin token provided.' 
      });
    }

    // Verify token
    const secret = new TextEncoder().encode(process.env.ADMIN_SECRET);
    const { payload } = await jwtVerify(token, secret, {
      issuer: 'iifb',
      audience: 'iifb-audience',
    });

    // Add admin info to request object
    req.admin = {
      userId: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error) {
    console.error('Admin authentication error:', error.message);
    
    // Clear invalid cookie
    res.clearCookie('admin-auth-token');
    
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired admin token.' 
    });
  }
};

// Optional: Combined middleware that accepts both user and admin tokens
// export const authenticateUserOrAdmin = async (req, res, next) => {
//   const userToken = req.cookies['user-auth-token'];
//   const adminToken = req.cookies['admin-auth-token'];

//   if (!userToken && !adminToken) {
//     return res.status(401).json({ 
//       success: false, 
//       message: 'Access denied. No authentication token provided.' 
//     });
//   }

//   try {
//     // Try admin token first
//     if (adminToken) {
//       const adminSecret = new TextEncoder().encode(process.env.ADMIN_SECRET);
//       const { payload } = await jwtVerify(adminToken, adminSecret, {
//         issuer: 'iifb',
//         audience: 'iifb-audience',
//       });

//       req.user = {
//         userId: payload.userId,
//         email: payload.email,
//         role: 'admin'
//       };
//       return next();
//     }

//     // Try user token
//     if (userToken) {
//       const userSecret = new TextEncoder().encode(process.env.USER_SECRET);
//       const { payload } = await jwtVerify(userToken, userSecret, {
//         issuer: 'iifb',
//         audience: 'iifb-audience',
//       });

//       req.user = {
//         userId: payload.userId,
//         email: payload.email,
//         role: 'user'
//       };
//       return next();
//     }
//   } catch (error) {
//     console.error('Authentication error:', error.message);
    
//     // Clear invalid cookies
//     res.clearCookie('user-auth-token');
//     res.clearCookie('admin-auth-token');
    
//     return res.status(401).json({ 
//       success: false, 
//       message: 'Invalid or expired authentication token.' 
//     });
//   }
// };