const jwt = require("jsonwebtoken");
// JWT SECRET KEY
const JWT_SECRET = "ASAN_HESAB%IS_MAQBOL";

const getLogedinUserData = (req,res,next)=>{
    // get auth-token param from header which will be sent from client 
    const token = req.header("auth-token");
    // if we dont have token it means the user is not authenticated
    if(!token)
    {
        res.status(401).json({"error":"لطفآ ابتدا به سیستم وارید شوید"});
    }else{
        try {
            // user is authenticated, now extract the userid from the token which is sent back while login
            const data = jwt.verify(token, JWT_SECRET);
            // append the user id to the req object so we can access it in getuser route
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).json({"error":"لطفآ ابتدا به سیستم وارید شوید"});
        }
    }
}

module.exports = getLogedinUserData;