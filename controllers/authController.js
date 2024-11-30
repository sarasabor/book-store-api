import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

//* Function To Handle Errors
const errorsFunction = (err) => {
    let errors = { email: '', password: ''}

    //* Incorrect Email
    if(err.message === 'Incorrect Email') {
        errors.email = 'This Email is Already Registered';
    }

    //* Incorrect Password
    if(err.message === 'Incorrect Password') {
        errors.password = 'This password is incorrect';
    }

    //* if Data is Duplicated
    if(err.code === 11000) {
        errors.email = 'Email is Already Registered';
        return errors;
    }

    if(err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
            //* Operation one : errors['email'] = error message
            //* Operation Two : errors['password'] = error message 
        });
    }

    return errors;

}


export const signUpPost = async(req, res) => {
    const { email, password } = req.body;

    try {
        //* Communication with Database 
        const newUser = await User({email, password });
        if(!newUser) return res.status(404).json({message: 'Invalid Information'});

        await newUser.save(); //* Saving The User to The Database
        
        //* use of jwt to install it use : npm i jsonwebtoken
        const token = jwt.sign({user: newUser._id}, process.env.SECRET_KEY, { expiresIn: '1h'});
        
        //* register it in cookies
       //* install cookie-parser and declare it as middleware ex: in this case it's declared in server.js 
        res.cookie('jwt', token);
        
        res.status(201).json({ message: 'User Registered Successfully', redirect: '/login', token});
    } catch (error) {
        const errors = errorsFunction(error); //* Returns Errors
        console.log(errors);
        res.status(500).send(errors);
    }
}

export const loginPost = async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = await User.findOne({email});
        if(!user) {
            throw new Error("Incorrect Email");
        }

        const auth = await bcrypt.compare(password, user.password);
        if(!auth) {
            throw new Error("Incorrect Password");
        } 

        const token = jwt.sign({user: user._id}, process.env.SECRET_KEY, { expiresIn: '1h'});

        //* register Cookie As WEll
        res.cookie('jwt', token, { maxAge: 1000 * 60 * 60 });

        res.status(200).json({user: user._id, redirect: '/', token});
    }catch(error) {
        const errors = errorsFunction(error);
        res.status(500).send(errors);
    }

}