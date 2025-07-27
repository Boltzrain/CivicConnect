const Department = require('../models/Department');
const { validationResult } = require('express-validator');

// Get all cities
const getAllCities = async (req, res) => {
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
};

// Get all issue types
const getAllIssueTypes = async (req, res) => {
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
};

// Get departments by city
const getDepartmentsByCity = async (req, res) => {
  try {
    const { city } = req.params;
    
    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'City parameter is required'
      });
    }

    const departments = await Department.getDepartmentsByCity(city);
    
    res.json({
      success: true,
      city,
      departments
    });
  } catch (error) {
    console.error('Get departments by city error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching departments'
    });
  }
};

// Get specific department by city and issue type
const getDepartmentByLocationAndIssue = async (req, res) => {
  try {
    const { city, issueType } = req.params;
    
    if (!city || !issueType) {
      return res.status(400).json({
        success: false,
        message: 'City and issue type parameters are required'
      });
    }

    const department = await Department.findByLocationAndIssue(city, issueType);
    
    if (!department) {
      // Return a default department structure for unknown combinations
      return res.json({
        success: true,
        department: {
          city,
          issueType,
          name: `Municipal Department - ${city}`,
          contactEmail: `complaints@${city.toLowerCase().replace(/\s+/g, '')}.gov.in`,
          contactPhone: "+91-XXX-XXX-XXXX",
          address: `Municipal Office, ${city}`,
          website: `https://${city.toLowerCase().replace(/\s+/g, '')}.gov.in`,
          workingHours: "9:00 AM - 5:00 PM (Mon-Fri)"
        }
      });
    }

    res.json({
      success: true,
      department
    });
  } catch (error) {
    console.error('Get department error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching department'
    });
  }
};

// Get all departments (with optional filters)
const getAllDepartments = async (req, res) => {
  try {
    const { city, issueType, active } = req.query;
    
    // Build filter object
    const filter = {};
    if (city) filter.city = city;
    if (issueType) filter.issueType = issueType;
    if (active !== undefined) filter.isActive = active === 'true';

    const departments = await Department.find(filter)
      .sort({ city: 1, issueType: 1 });
    
    res.json({
      success: true,
      count: departments.length,
      departments
    });
  } catch (error) {
    console.error('Get all departments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching departments'
    });
  }
};

// Create new department (Admin only)
const createDepartment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const departmentData = req.body;
    const department = new Department(departmentData);
    await department.save();

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      department
    });
  } catch (error) {
    console.error('Create department error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Department already exists for this city and issue type'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating department'
    });
  }
};

// Update department (Admin only)
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const department = await Department.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    res.json({
      success: true,
      message: 'Department updated successfully',
      department
    });
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating department'
    });
  }
};

// Delete department (Admin only)
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findByIdAndDelete(id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    res.json({
      success: true,
      message: 'Department deleted successfully'
    });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting department'
    });
  }
};

// Toggle department active status (Admin only)
const toggleDepartmentStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    department.isActive = !department.isActive;
    await department.save();

    res.json({
      success: true,
      message: `Department ${department.isActive ? 'activated' : 'deactivated'} successfully`,
      department
    });
  } catch (error) {
    console.error('Toggle department status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling department status'
    });
  }
};

module.exports = {
  getAllCities,
  getAllIssueTypes,
  getDepartmentsByCity,
  getDepartmentByLocationAndIssue,
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  toggleDepartmentStatus
}; 