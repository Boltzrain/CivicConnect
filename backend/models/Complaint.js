const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  issueType: {
    type: String,
    required: [true, 'Issue type is required'],
    enum: ['Water', 'Electricity', 'Road', 'Sanitation', 'Street Lights', 'Garbage Collection', 'Public Transport', 'Parks', 'Noise Pollution', 'Other']
  },
  location: {
    city: {
      type: String,
      required: [true, 'City is required']
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^\d{6}$/, 'Please provide a valid 6-digit pincode']
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      maxlength: [200, 'Address cannot exceed 200 characters']
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  image: {
    type: String, // Base64 encoded image or file path
    default: null
  },
  status: {
    type: String,
    enum: ['Filed', 'In Progress', 'Resolved', 'Closed'],
    default: 'Filed'
  },
  complaintLetter: {
    type: String, // Auto-generated formatted complaint text
    required: true
  },
  trackingId: {
    type: String,
    unique: true,
    required: true
  },
  department: {
    name: String,
    contactEmail: String,
    contactPhone: String
  },
  sentVia: [{
    method: {
      type: String,
      enum: ['WhatsApp', 'Email']
    },
    sentAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Generate tracking ID before saving
complaintSchema.pre('save', function(next) {
  if (!this.trackingId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.trackingId = `CC${timestamp}${random}`.toUpperCase();
  }
  next();
});

// Virtual for formatted date
complaintSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

module.exports = mongoose.model('Complaint', complaintSchema); 