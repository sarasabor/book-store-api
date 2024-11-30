import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
    const token = req.cookies.jwt;

    if(!token) {
        return res.status(401).json({ message: 'Token Not Found'});
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        console.log(decodedToken);
        console.log(req.user)
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token Not Found'});
    }
}


export default protect;