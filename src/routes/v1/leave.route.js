const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const leaveValidation = require('../../validations/leave.validation');
const leaveController = require('../../controllers/leave.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(leaveValidation.createLeave), leaveController.createLeave)
  .get(auth(), validate(leaveValidation.getLeaves), leaveController.getLeaves);

router
  .route('/:leaveId')
  .get(auth(), validate(leaveValidation.getLeave), leaveController.getLeave)
  .patch(auth(), validate(leaveValidation.updateLeave), leaveController.updateLeave)
  .delete(auth(), validate(leaveValidation.deleteLeave), leaveController.deleteLeave);

router.patch('/:leaveId/approve', auth('manageUsers'), leaveController.approveLeave);

router.patch('/:leaveId/deny', auth('manageUsers'), leaveController.denyLeave);

module.exports = router;
