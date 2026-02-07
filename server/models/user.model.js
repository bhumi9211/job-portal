import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email:{
         type: String,
         unique: true,
         required: true,
    },
    password:{
         type: String,
         required: true,
         select: false
    },
    role:{
        type: String,
        enum: ['student','professor'],
        default: 'student',
    },
    profileImage: {
        type: String,
        default: ""
    },
    headline: {
        type: String,
        default: ""
    },
    skills: [
        {
            type: String
        }
    ],
    education: [
        {
            college: {
                type: String
            },
            degree: {
                type: String
            },
            fieldOfStudy: {
                type: String
            }
        }
    ],
    location: {
        type: String,
        default: "India"
    },
    gender: {
        type: String,
        enum: ["male","female","others"]
    },
    experience: [
        {
            title: {
                type: String
            },
            company: {
                type: String
            },
            description: {
                type: String
            },
            years:{
                type: Number
            }
        }
    ],
},{ timestamps: true })

const User = mongoose.model('User', UserSchema);
export default User