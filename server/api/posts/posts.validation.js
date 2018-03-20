"use strict";

const { Joi } = require('celebrate');

module.exports = {
    validateReceivedPost: {
        body: Joi.object().keys({
            text: Joi.string().min(3).max(10000).required(),
            title: Joi.string().min(3).max(100).required(),
            tags: Joi.string().min(3).max(5000).required(),
            comments: Joi.array().items(Joi.string().length(24).alphanum().allow("")).default([])
        })
    },
    getPosts: {
        query: {
            limit: Joi.number().valid(10, 25, 50).default(10),
            page: Joi.number().positive().integer().max(10000).default(1),
            sortField: Joi.string().valid('text', 'title', 'addedAt').default('addedAt'),
            sortValue: Joi.number().valid(-1, 1).default(-1)
        }
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