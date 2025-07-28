const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const Department = require('../models/Department');
const {
  upload,
  createComplaint,
  getUserComplaints,
  getComplaint,
  updateComplaintStatus,
  markComplaintSent,
  deleteComplaint
} = require('../controllers/complaintController');

const router = express.Router();

// Validation middleware
const complaintValidation = [
  body('issueType')
    .isIn(['Water', 'Electricity', 'Road', 'Sanitation', 'Street Lights', 'Garbage Collection', 'Public Transport', 'Parks', 'Noise Pollution', 'Other'])
    .withMessage('Invalid issue type'),
  body('location.city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('location.pincode')
    .matches(/^\d{6}$/)
    .withMessage('Pincode must be a 6-digit number'),
  body('location.address')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Address must be between 10 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters')
];

const statusValidation = [
  body('status')
    .isIn(['Filed', 'In Progress', 'Resolved', 'Closed'])
    .withMessage('Invalid status')
];

const sentViaValidation = [
  body('method')
    .isIn(['WhatsApp', 'Email'])
    .withMessage('Invalid method. Must be WhatsApp or Email')
];

// Routes
// GET /api/complaints - Get user's complaints
router.get('/', auth, getUserComplaints);

// GET /api/complaints/cities - Get supported cities
router.get('/cities', async (req, res) => {
  try {
    const cities = await Department.getAllCities();
    res.json({
      success: true,
      cities
    });
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cities'
    });
  }
});

// GET /api/complaints/issue-types - Get issue types
router.get('/issue-types', async (req, res) => {
  try {
    const issueTypes = await Department.getAllIssueTypes();
    res.json({
      success: true,
      issueTypes
    });
  } catch (error) {
    console.error('Get issue types error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching issue types'
    });
  }
});

// GET /api/complaints/:id - Get single complaint
router.get('/:id', auth, getComplaint);

// POST /api/complaints - Create new complaint
router.post(
  '/',
  auth,
  upload.single('image'),
  complaintValidation,
  createComplaint
);

// PUT /api/complaints/:id/status - Update complaint status
router.put(
  '/:id/status',
  auth,
  statusValidation,
  updateComplaintStatus
);

// POST /api/complaints/:id/sent - Mark complaint as sent
router.post(
  '/:id/sent',
  auth,
  sentViaValidation,
  markComplaintSent
);

// DELETE /api/complaints/:id - Delete complaint
router.delete('/:id', auth, deleteComplaint);

// GET /api/complaints/:id/department - Get department info for a complaint
router.get('/:id/department', auth, async (req, res) => {
  try {
    const complaintId = req.params.id;
    const userId = req.user.id;

    const Complaint = require('../models/Complaint');
    const complaint = await Complaint.findOne({
      _id: complaintId,
      user: userId
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.json({
      success: true,
      department: complaint.department
    });

  } catch (error) {
    console.error('Get department error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching department info'
    });
  }
});

module.exports = router; 