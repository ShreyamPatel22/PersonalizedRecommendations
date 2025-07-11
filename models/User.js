const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    preferences: { type: [String], default: [] }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
