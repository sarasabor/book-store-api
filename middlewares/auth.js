import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
    const { authorization } = req.headers;

    if(!authorization) return res.status(404).json({message: 'Authorization Token is Required'});

    const token = authorization.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decodedToken;
        next();
       
    } catch (error) {
        res.status(401).json({error: 'Request Failed'});
    }
}


export default protect;