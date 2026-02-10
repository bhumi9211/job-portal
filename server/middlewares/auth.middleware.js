import User from "../models/user.model.js"
import jwt from "jsonwebtoken"

export const protectRoute = async(req,res,next) =>{
   try {
    console.log('--- New request to protected route ---');
    console.log('Request Headers:', req.headers);
    const token = req.cookies.jwt
    console.log("Cookies (parsed by cookieParser):", req.cookies);
    console.log("JWT from cookie:", req.cookies?.jwt);

    if(!token){
        return res.status(401).json({message: "Unauthorized user.."})
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    if(!decoded){
        return res.status(401).json({message: "Unauthorized user.."})
    }
    const user = await User.findById(decoded.userId).select("-password")
    if(!user){
        return res.status(404).json({message: "User not found."})
    }
    req.user = user
    next()
   } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Something went wrong."})
   }
}