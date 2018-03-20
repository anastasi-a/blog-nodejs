"use strict";

const { celebrate, Joi } = require('celebrate');
const path = require('path');

exports.isAuthorized = (req, res, next) => {
    if(req.isAuthenticated()) next();
    else res.status(401).send("Not logged in");
};

const general = {
    getById: {
        params: {
            id: Joi.string().alphanum().length(24).required()
        }
    }
};

exports.checkValidation = (modelPath, schemaName, req, res, next) => {
    let schema;
    if(modelPath !== "general") {
        schema = require(path.join(__dirname, modelPath, modelPath + ".validation.js"));
    } else schema = general;

    celebrate(schema[schemaName])(req, res, next);
};