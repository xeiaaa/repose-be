const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createLeave = {
  body: Joi.object().keys({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    daysCount: Joi.number().required(),
    note: Joi.string(),
  }),
};

const getLeaves = {
  query: Joi.object().keys({
    filter: Joi.string(),
    sort: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    populate: Joi.string(),
  }),
};

const getLeave = {
  params: Joi.object().keys({
    leaveId: Joi.string().custom(objectId),
  }),
};

const updateLeave = {
  params: Joi.object().keys({
    leaveId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      startDate: Joi.date(),
      endDate: Joi.date(),
      daysCount: Joi.number(),
      note: Joi.string(),
      status: Joi.string(),
    })
    .min(1),
};

const deleteLeave = {
  params: Joi.object().keys({
    leaveId: Joi.string().custom(objectId),
  }),
};

const adminUpdateLeave = {
  params: Joi.object().keys({
    leaveId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      status: Joi.string().required(),
    })
    .min(1),
};

module.exports = {
  createLeave,
  getLeaves,
  getLeave,
  updateLeave,
  deleteLeave,
  adminUpdateLeave,
};
