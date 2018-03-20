"use strict";

const { Joi } = require('celebrate');

const id = Joi.string().alphanum().length(24);

module.exports = {
    addNewComment: {
        params: {
            id: id.required() // id post
        },
        body: Joi.object().keys({
            text: Joi.string().trim().min(2).max(10000).required(),
            // rate: Joi.number().min(1).max(5).integer().default(3),
            parentId: id
        })
    },

    changeStatus: {
        params: {
            id: Joi.string().alphanum().length(24).required()
        },
        body: Joi.object().keys({
            newStatus: Joi.boolean().required()
        })
    }
};