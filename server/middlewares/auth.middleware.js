import User from "../models/user.model.js"
import jwt from 'jsonwebtoken'

export const protectRoute = async(req,res,next) =>{
  try {
    // 🔥 CRITICAL DEBUG LOGS
    console.log('🔍 RAW COOKIES:', req.cookies);
    console.log('🔍 HEADERS.cookie:', req.headers.cookie);
    console.log('🔍 User-Agent:', req.get('User-Agent'));
    
    const token = req.cookies.jwt;
    console.log('🔍 TOKEN EXTRACTED:', token ? '✅ FOUND' : '❌ MISSING');
    
    if(!token){
      console.log('❌ No token in cookies');
      return res.status(401).json({message: "Unauthorized user.."});
    }
    
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    console.log('🔍 DECODED:', decoded);
    
    const user = await User.findById(decoded.userId).select("-password");
    console.log('🔍 USER:', user ? '✅ FOUND' : '❌ NOT FOUND');
    
    req.user = user;
    next();
  } catch (error) {
    console.log('💥 ERROR:', error.message);
    return res.status(500).json({message: "Something went wrong."});
  }
};
