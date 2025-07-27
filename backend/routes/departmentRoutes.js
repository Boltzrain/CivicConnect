const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
  getAllCities,
  getAllIssueTypes,
  getDepartmentsByCity,
  getDepartmentByLocationAndIssue,
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  toggleDepartmentStatus
} = require('../controllers/departmentController');

const router = express.Router();

// Validation middleware for creating/updating departments
const departmentValidation = [
  body('city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('issueType')
    .isIn(['Water', 'Electricity', 'Road', 'Sanitation', 'Street Lights', 'Garbage Collection', 'Public Transport', 'Parks', 'Noise Pollution', 'Other'])
    .withMessage('Invalid issue type'),
  body('name')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Department name must be between 5 and 100 characters'),
  body('contactEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('contactPhone')
    .trim()
    .isLength({ min: 10, max: 20 })
    .withMessage('Contact phone must be between 10 and 20 characters'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Address cannot exceed 200 characters'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL'),
  body('workingHours')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Working hours cannot exceed 100 characters')
];

// Public routes (no authentication required)

// GET /api/departments/cities - Get all available cities
router.get('/cities', getAllCities);

// GET /api/departments/issue-types - Get all issue types
router.get('/issue-types', getAllIssueTypes);

// GET /api/departments/city/:city - Get all departments for a specific city
router.get('/city/:city', getDepartmentsByCity);

// GET /api/departments/:city/:issueType - Get specific department by city and issue type
router.get('/:city/:issueType', getDepartmentByLocationAndIssue);

// GET /api/departments - Get all departments (with optional filters)
router.get('/', getAllDepartments);

// Protected routes (authentication required)

// POST /api/departments - Create new department (Admin only)
router.post(
  '/',
  auth,
  departmentValidation,
  createDepartment
);

// PUT /api/departments/:id - Update department (Admin only)
router.put(
  '/:id',
  auth,
  departmentValidation,
  updateDepartment
);

// DELETE /api/departments/:id - Delete department (Admin only)
router.delete('/:id', auth, deleteDepartment);

// PATCH /api/departments/:id/toggle-status - Toggle department active status (Admin only)
router.patch('/:id/toggle-status', auth, toggleDepartmentStatus);

module.exports = router; 