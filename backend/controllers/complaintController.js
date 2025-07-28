const { validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');
const Department = require('../models/Department');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Generate complaint letter
const generateComplaintLetter = (complaint, userInfo, departmentInfo) => {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
Date: ${currentDate}

To,
${departmentInfo.name}
${complaint.location.city}

Subject: Complaint regarding ${complaint.issueType} issue - Tracking ID: ${complaint.trackingId}

Dear Sir/Madam,

I hope this letter finds you in good health. I am writing to bring to your immediate attention a serious issue regarding ${complaint.issueType.toLowerCase()} in our locality.

Complainant Details:
Name: ${userInfo.name}
Email: ${userInfo.email}

Issue Details:
Location: ${complaint.location.address}, ${complaint.location.city} - ${complaint.location.pincode}
Issue Type: ${complaint.issueType}

Description:
${complaint.description}

This issue is causing significant inconvenience to the residents of our area and requires urgent attention from your department. I request you to kindly look into this matter and take appropriate action at the earliest.

I would appreciate if you could acknowledge the receipt of this complaint and provide an estimated timeline for resolution. You can reach me via email at ${userInfo.email} for any clarifications.

Thank you for your time and consideration.

Yours sincerely,
${userInfo.name}

Tracking ID: ${complaint.trackingId}
Filed on: ${currentDate}
`.trim();
};

// Create new complaint
const createComplaint = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { issueType, location, description } = req.body;
    const userId = req.user.id;

    // Get department information from database
    let departmentInfo = await Department.findByLocationAndIssue(location.city, issueType);
    
    // If no department found, create a default one
    if (!departmentInfo) {
      departmentInfo = {
        name: `Municipal Department - ${location.city}`,
        contactEmail: `complaints@${location.city.toLowerCase().replace(/\s+/g, '')}.gov.in`,
        contactPhone: "+91-XXX-XXX-XXXX",
        address: `Municipal Office, ${location.city}`,
        website: `https://${location.city.toLowerCase().replace(/\s+/g, '')}.gov.in`,
        workingHours: "9:00 AM - 5:00 PM (Mon-Fri)"
      };
    }

    // Handle image upload (convert to base64 if provided)
    let imageBase64 = null;
    if (req.file) {
      imageBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    // Generate tracking ID
    const generateTrackingId = () => {
      const timestamp = Date.now().toString(36);
      const randomStr = Math.random().toString(36).substring(2, 8);
      return `CC-${timestamp.toUpperCase()}-${randomStr.toUpperCase()}`;
    };

    // Create complaint object
    const complaintData = {
      user: userId,
      issueType,
      location,
      description,
      image: imageBase64,
      department: departmentInfo,
      trackingId: generateTrackingId()
    };

    // Generate complaint letter
    const complaintLetter = generateComplaintLetter(complaintData, req.user, departmentInfo);
    complaintData.complaintLetter = complaintLetter;

    // Create and save complaint
    const complaint = new Complaint(complaintData);
    await complaint.save();

    // Populate user data for response
    await complaint.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Complaint filed successfully',
      complaint,
      complaintLetter
    });

  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while filing complaint'
    });
  }
};

// Get user's complaints
const getUserComplaints = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const complaints = await Complaint.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email');

    const total = await Complaint.countDocuments({ user: userId });

    res.json({
      success: true,
      complaints,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching complaints'
    });
  }
};

// Get single complaint
const getComplaint = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const userId = req.user.id;

    const complaint = await Complaint.findOne({
      _id: complaintId,
      user: userId
    }).populate('user', 'name email');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.json({
      success: true,
      complaint
    });

  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching complaint'
    });
  }
};

// Update complaint status
const updateComplaintStatus = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const { status } = req.body;
    const userId = req.user.id;

    const complaint = await Complaint.findOneAndUpdate(
      { _id: complaintId, user: userId },
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.json({
      success: true,
      message: 'Complaint status updated successfully',
      complaint
    });

  } catch (error) {
    console.error('Update complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating complaint'
    });
  }
};

// Mark complaint as sent via WhatsApp/Email
const markComplaintSent = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const { method } = req.body; // 'WhatsApp' or 'Email'
    const userId = req.user.id;

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

    // Add to sentVia array
    complaint.sentVia.push({
      method,
      sentAt: new Date()
    });

    await complaint.save();

    res.json({
      success: true,
      message: `Complaint marked as sent via ${method}`,
      complaint
    });

  } catch (error) {
    console.error('Mark sent error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating complaint'
    });
  }
};

// Delete complaint
const deleteComplaint = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const userId = req.user.id;

    const complaint = await Complaint.findOneAndDelete({
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
      message: 'Complaint deleted successfully'
    });

  } catch (error) {
    console.error('Delete complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting complaint'
    });
  }
};

module.exports = {
  upload,
  createComplaint,
  getUserComplaints,
  getComplaint,
  updateComplaintStatus,
  markComplaintSent,
  deleteComplaint
}; 