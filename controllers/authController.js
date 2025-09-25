import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from "validator";

const { isEmail, isStrongPassword } = validator;

//* Function To Handle Errors
const errorsFunction = (err) => {
    let errors = { email: '', password: ''}

    switch(err.message) {
        case 'All Fields Are Required': 
            errors.email = 'All Fields Are Required';
            break;
        case 'Password Not Strong' : 
            errors.password = 'Please Enter A Strong Password';
            break;
        case 'Email is Already in Use' : 
            errors.email = 'Email is Already in Use';
            break;
        case 'Incorrect Email' : 
            errors.email = 'Incorrect Email';
            break;
        case 'Incorrect Password' : 
            errors.password = 'This password is incorrect';
            break;
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
        
            if(!email || !password) {
                throw new Error('All Fields Are Required');
            }
            if(!isEmail(email)) {
                throw new Error('Email Not Valid');
            }

            if(!isStrongPassword(password)) {
                throw new Error('Password Not Strong');
            }

            const emailExists = await User.findOne({email});

            if(emailExists) {
                throw new Error('Email is Already in Use');
            }
        //* Communication with Database 
        const newUser = new User({email, password });
        if(!newUser) return res.status(401).json({message: 'Invalid Information'});

        await newUser.save(); //* Saving The User to The Database
        
        //* use of jwt to install it use : npm i jsonwebtoken
        const token = jwt.sign({user: newUser._id}, process.env.SECRET_KEY, { expiresIn: '1h'});
        
        //* register it in cookies
       //* install cookie-parser and declare it as middleware ex: in this case it's declared in server.js 
        // res.cookie('jwt', token);
        
        // res.status(201).json({ message: 'User Registered Successfully', redirect: '/login', token});
        res.status(200).json({ email, token, redirect: '/login'});
    } catch (error) {
        const errors = errorsFunction(error); //* Returns Errors
        res.status(500).send(errors);
    }
}

export const loginPost = async (req, res) => {
    const { email, password } = req.body;

    try{

        if(!email || !password) {
            throw new Error('All Fields Are Required');
        }

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
        // res.cookie('jwt', token, { maxAge: 1000 * 60 * 60 });

        // res.status(200).json({user: user._id, redirect: '/', token});
        res.status(200).json({ email, token, redirect: '/'});
    }catch(error) {
        const errors = errorsFunction(error);
        res.status(500).json(errors);
    }

}