const mongoose = require('mongoose');

const committeeMemberSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const CommitteeMember = mongoose.model('CommitteeMember', committeeMemberSchema);
module.exports = CommitteeMember;
