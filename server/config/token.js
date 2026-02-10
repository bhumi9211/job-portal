import jwt from 'jsonwebtoken'

export const generateToken =async(userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  console.log("Generated JWT:", token);

  // res.cookie("jwt", token, {
  //   path: "/",
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: "None",
  //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  // });

  // console.log('JWT cookie set for user:', userId);

  return token;
};
