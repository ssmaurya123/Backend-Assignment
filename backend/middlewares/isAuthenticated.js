import jwt from "jsonwebtoken"; //import for token verification

//Middleware to check user is authenticated
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token; //getting token from cookies
    if (!token) {
      return res.status(401).json({
        message: "User Is Not Authorised",
        success: false,
      });
    }
    const decode = await jwt.verify(token, process.env.SECRET_KEY); //verifying token using secret key
    //checking token is valid
    if (!decode) {
      return res.status(401).json({
        message: "Invalid Token",
        success: false,
      });
    }
    req.id = decode.userId; //Attaching the user ID from the decoded token to the request object
    next();
  } catch (error) {
    console.log(error);
  }
};

export default isAuthenticated;
