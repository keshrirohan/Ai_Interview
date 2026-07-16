import jwt from "jsonwebtoken";
const Token = (user) => {
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

export default Token;
