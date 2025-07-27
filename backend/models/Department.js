const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    index: true
  },
  issueType: {
    type: String,
    required: [true, 'Issue type is required'],
    enum: ['Water', 'Electricity', 'Road', 'Sanitation', 'Street Lights', 'Garbage Collection', 'Public Transport', 'Parks', 'Noise Pollution', 'Other'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Department name is required'],
    trim: true
  },
  contactEmail: {
    type: String,
    required: [true, 'Contact email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  contactPhone: {
    type: String,
    required: [true, 'Contact phone is required'],
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  workingHours: {
    type: String,
    default: '9:00 AM - 5:00 PM (Mon-Fri)'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
departmentSchema.index({ city: 1, issueType: 1 });

// Virtual for formatted contact info
departmentSchema.virtual('formattedContact').get(function() {
  return `${this.contactEmail} | ${this.contactPhone}`;
});

// Static method to get department by city and issue type
departmentSchema.statics.findByLocationAndIssue = function(city, issueType) {
  return this.findOne({ 
    city: city, 
    issueType: issueType, 
    isActive: true 
  });
};

// Static method to get all cities
departmentSchema.statics.getAllCities = function() {
  return this.distinct('city', { isActive: true }).sort();
};

// Static method to get all issue types
departmentSchema.statics.getAllIssueTypes = function() {
  return this.distinct('issueType', { isActive: true }).sort();
};

// Static method to get departments by city
departmentSchema.statics.getDepartmentsByCity = function(city) {
  return this.find({ city: city, isActive: true }).sort({ issueType: 1 });
};

module.exports = mongoose.model('Department', departmentSchema); 