const httpStatus = require('http-status');
const { Leave } = require('../models');
const ApiError = require('../utils/ApiError');

const createLeave = async (leaveBody) => {
  return Leave.create(leaveBody);
};

const queryLeaves = async (filter, options) => {
  const leaves = await Leave.paginate(filter, options);
  return leaves;
};

const getLeaveById = async (id) => {
  return Leave.findById(id);
};

const updateLeaveById = async (leaveId, updateBody) => {
  const leave = await getLeaveById(leaveId);
  if (!leave) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Leave not found');
  }
  Object.assign(leave, updateBody);
  await leave.save();
  return leave;
};

const deleteLeaveById = async (leaveId) => {
  const leave = await getLeaveById(leaveId);
  if (!leave) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Leave not found');
  }
  await leave.remove();
  return leave;
};

module.exports = {
  createLeave,
  queryLeaves,
  getLeaveById,
  updateLeaveById,
  deleteLeaveById,
};
