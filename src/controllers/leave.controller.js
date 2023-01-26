const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { leaveService } = require('../services');
const queryParser = require('../utils/queryParser');
const { User } = require('../models');

const createLeave = catchAsync(async (req, res) => {
  req.body.user = req.user._id;
  const leave = await leaveService.createLeave(req.body);

  res.status(httpStatus.CREATED).send(leave);
});

const getLeaves = catchAsync(async (req, res) => {
  const { filter, options } = queryParser(req.query);
  const result = await leaveService.queryLeaves(filter, options);
  res.send(result);
});

const getLeave = catchAsync(async (req, res) => {
  const leave = await leaveService.getLeaveById(req.params.leaveId);
  if (!leave) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Leave not found');
  }
  res.send(leave);
});

const updateLeave = catchAsync(async (req, res) => {
  const leave = await leaveService.updateLeaveById(req.params.leaveId, req.body);
  res.send(leave);
});

const deleteLeave = catchAsync(async (req, res) => {
  await leaveService.deleteLeaveById(req.params.leaveId);
  res.status(httpStatus.NO_CONTENT).send();
});

const approveLeave = catchAsync(async (req, res) => {
  const leave = await leaveService.updateLeaveById(req.params.leaveId, {
    status: 'APPROVED',
  });
  if (leave) {
    // update user balance
    const user = await User.findById(leave.user);
    user.leaveBalance -= leave.daysCount;

    if (typeof user.usedLeave !== 'number') {
      user.usedLeave = 0;
    }
    user.usedLeave += leave.daysCount;
    await user.save();
    leave.user = user;
  }
  res.send(leave);
});

const denyLeave = catchAsync(async (req, res) => {
  const leave = await leaveService.updateLeaveById(req.params.leaveId, {
    status: 'DENIED',
  });
  res.send(leave);
});

module.exports = {
  createLeave,
  getLeaves,
  getLeave,
  updateLeave,
  deleteLeave,
  approveLeave,
  denyLeave,
};
