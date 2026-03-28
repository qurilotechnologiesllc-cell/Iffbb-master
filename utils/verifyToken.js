import {  jwtVerify } from 'jose';



const verifyToken = async (token) => {
  const secret = new TextEncoder().encode(process.env.SECRET);
  try {
    const { payload } = await jwtVerify(token, secret, {
      issuer: 'iifb',
      audience: 'iifb-audience',
    });
    return payload 
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};
export default verifyToken;
