import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from 'bcryptjs';
const { isEmail } = validator;

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please Enter Your Email'],
        unique: true, 
        lowercase: true,
        validate: [isEmail, 'Please Enter A Valid Email']
    },
    password: {
        type: String,
        required: [true, 'Please Enter Your Password'],
        minlength: [5, 'Minimum length is 5 characters']
    }
}, { timestamps: true });

//* Check User 
// userSchema.post('save', (data, next) => {
//     console.log('New User Has Been Registered', data);
//     next();
// });

//* Hashing Password Before the user is Saved to Db
userSchema.pre('save', async function(next) {
    // console.log('User is About To Be Saved', this);
    //* Crypting the password using bcrypt
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

const User = mongoose.model('User', userSchema);

export default User;