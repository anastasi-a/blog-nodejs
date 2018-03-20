"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const _ = require("lodash");

const UserSchema = new Schema({
    username: {type: String, required: true, unique: true, lowercase: true, trim: true},
    password: {type: String},
    addedAt: {type: Date, default: Date.now},
    role: {type: String, default: "user"},
    image: {type: String},
    email: {type: String}
}, {
    collection: "UsersCollection"
});

UserSchema.pre('save', function() {
    if(this.isNew || this.isModified("password")) {
        this.password = bcrypt.hashSync(this.password, 8);
    }
});

UserSchema.post('save', function() {
    console.log(`${this.username} was saved`);
});

UserSchema.statics = {
    checkPassword: async function(username, password, cb) {
        try{
            const user = await this
                .findOne({
                    username: {$regex: _.escapeRegExp(username), $options: "i"}
                })
                .select("username password role email image")
                .lean()
                .exec();

            if(user) {
                const compare = bcrypt.compareSync(password, user.password);

                if(compare) {
                    cb(false, _.omit(user, ["password"]));
                } else {
                    cb({message: "Login or password is not correct"});
                }
            } else cb({message: "Not exists"});
        } catch(e) {
            cb(e);
        }
    }
};

module.exports = mongoose.model('UsersModel', UserSchema);