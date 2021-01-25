const { JsonWebTokenError } = require("jsonwebtoken");


  next();
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
 function restrict() {
   return async (req, res, next) => {
     const authError = {
       message : "Invalid credentials"
     }
     try{
       const token = req.headers.authorization
       if (!token){
         return res.status(401).json(authError)
       } 
       JsonWebToken.verify(token, process.env.JWT_SECRET, (err, decoded) =>{
         if (err) {
           return res.status(401).json(authError)
         }
       })
     } catch(err) {
       next(err)
     }
   }
 }
module.exports = {
  restrict,
}