"use strict";

const { Joi } = require('celebrate');

module.exports = {
    validateRegistration: {
        body: Joi.object().keys({
            username: Joi.string().min(3).max(25).alphanum().trim().required(),
            email: Joi.string().min(6).max(50).email().required(),
            password: Joi.string().min(5).max(25).alphanum().trim().required()
        })
    },

    changeRole: {
        params: {
            id: Joi.string().alphanum().length(24).required()
        },
        body: Joi.object().keys({
            newRole: Joi.string().valid('user', 'moderator', 'admin').required()
        })
    }
};
