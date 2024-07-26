const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: String,
    email: String 
})

const UserModel = mongoose.model("students",UserSchema)
module.exports = UserModel;