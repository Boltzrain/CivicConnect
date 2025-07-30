import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert, Modal, Spinner } from 'react-bootstrap'
import { complaintService } from '../services/complaintService'
import { useAuth } from '../context/AuthContext'

const NewComplaint = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    issueType: '',
    location: {
      city: '',
      pincode: '',
      address: ''
    },
    description: '',
    image: null
  })
  const [cities, setCities] = useState([])
  const [issueTypes, setIssueTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [generatedComplaint, setGeneratedComplaint] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      const [citiesData, issueTypesData] = await Promise.all([
        complaintService.getSupportedCities(),
        complaintService.getIssueTypes()
      ])
      setCities(citiesData.cities)
      setIssueTypes(issueTypesData.issueTypes)
    } catch (error) {
      console.error('Error loading initial data:', error)
      setError('Failed to load form data. Please refresh the page.')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }))

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const { issueType, location, description } = formData

    if (!issueType) {
      setError('Please select an issue type')
      return false
    }

    if (!location.city || !location.pincode || !location.address) {
      setError('Please fill in all location details')
      return false
    }

    if (!/^\d{6}$/.test(location.pincode)) {
      setError('Please enter a valid 6-digit pincode')
      return false
    }

    if (description.length < 10) {
      setError('Description must be at least 10 characters long')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const response = await complaintService.createComplaint(formData)
      setGeneratedComplaint(response)
      setSuccess('Complaint filed successfully!')
      setShowPreview(true)
    } catch (error) {
      console.error('Error filing complaint:', error)
      setError(error.message || 'Failed to file complaint. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSendWhatsApp = async () => {
    try {
      const department = generatedComplaint.complaint.department
      const whatsappUrl = complaintService.generateWhatsAppLink(
        generatedComplaint.complaintLetter,
        department.contactPhone
      )
      
      // Mark as sent via WhatsApp
      await complaintService.markComplaintSent(generatedComplaint.complaint._id, 'WhatsApp')
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank')
    } catch (error) {
      console.error('Error sending via WhatsApp:', error)
      setError('Failed to send via WhatsApp')
    }
  }

  const handleSendEmail = async () => {
    try {
      const department = generatedComplaint.complaint.department
      const subject = `Complaint regarding ${generatedComplaint.complaint.issueType} - ${generatedComplaint.complaint.trackingId}`
      const emailUrl = complaintService.generateEmailLink(
        generatedComplaint.complaintLetter,
        department.contactEmail,
        subject
      )
      
      // Mark as sent via Email
      await complaintService.markComplaintSent(generatedComplaint.complaint._id, 'Email')
      
      // Open email client
      window.open(emailUrl, '_blank')
    } catch (error) {
      console.error('Error sending via Email:', error)
      setError('Failed to send via Email')
    }
  }

  const handleNewComplaint = () => {
    setFormData({
      issueType: '',
      location: {
        city: '',
        pincode: '',
        address: ''
      },
      description: '',
      image: null
    })
    setImagePreview(null)
    setGeneratedComplaint(null)
    setShowPreview(false)
    setSuccess('')
    setError('')
  }

  return (
    <Container className="py-5">
      {/* Header Section */}
      <Row className="mb-5">
        <Col>
          <div className="text-center mb-4">
            <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
              <i className="bi bi-file-earmark-plus text-white" style={{fontSize: '2.5rem'}}></i>
            </div>
            <h1 className="display-5 fw-bold mb-3">File New Complaint</h1>
            <p className="lead text-muted mb-0 px-md-5">
              Report civic issues to your municipal department with our easy-to-use complaint filing system.
              We'll generate a professional complaint letter for you to send via WhatsApp or email.
            </p>
          </div>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="border-0 shadow-lg">
            <Card.Body className="p-5">
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-4 fade-in-up">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess('')} className="mb-4 fade-in-up">
                  <i className="bi bi-check-circle me-2"></i>
                  {success}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Issue Type Section */}
                <div className="mb-5">
                  <h4 className="mb-3 fw-bold text-primary d-flex align-items-center">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    Issue Information
                  </h4>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">What type of issue are you reporting? *</Form.Label>
                    <Form.Select
                      name="issueType"
                      value={formData.issueType}
                      onChange={handleInputChange}
                      required
                      size="lg"
                    >
                      <option value="">Choose an issue type...</option>
                      {issueTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>

                {/* Location Section */}
                <div className="mb-5">
                  <h4 className="mb-3 fw-bold text-primary d-flex align-items-center">
                    <i className="bi bi-geo-alt me-2"></i>
                    Location Details
                  </h4>
                  <Row className="g-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">City *</Form.Label>
                        <Form.Select
                          name="location.city"
                          value={formData.location.city}
                          onChange={handleInputChange}
                          required
                          size="lg"
                        >
                          <option value="">Choose your city...</option>
                          {cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Pincode *</Form.Label>
                        <Form.Control
                          type="text"
                          name="location.pincode"
                          value={formData.location.pincode}
                          onChange={handleInputChange}
                          placeholder="Enter 6-digit pincode"
                          pattern="\d{6}"
                          maxLength="6"
                          required
                          size="lg"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mt-4">
                    <Form.Label className="fw-semibold">Complete Address *</Form.Label>
                    <Form.Control
                      type="text"
                      name="location.address"
                      value={formData.location.address}
                      onChange={handleInputChange}
                      placeholder="Enter the complete address where the issue is located"
                      maxLength="200"
                      required
                      size="lg"
                    />
                    <Form.Text className="text-muted">
                      Include street name, area, and landmarks for better identification
                    </Form.Text>
                  </Form.Group>
                </div>

                {/* Description Section */}  
                <div className="mb-5">
                  <h4 className="mb-3 fw-bold text-primary d-flex align-items-center">
                    <i className="bi bi-card-text me-2"></i>
                    Issue Description
                  </h4>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Describe the issue in detail *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Please provide a detailed description of the issue, including when it started, how it affects you, and any other relevant information..."
                      maxLength="1000"
                      required
                      className="mb-2"
                      style={{resize: 'vertical'}}
                    />
                    <div className="d-flex justify-content-between">
                      <Form.Text className="text-muted">
                        Be specific and detailed to help resolve your issue faster
                      </Form.Text>
                      <Form.Text className={`${formData.description.length > 900 ? 'text-warning' : 'text-muted'}`}>
                        {formData.description.length}/1000 characters
                      </Form.Text>
                    </div>
                  </Form.Group>
                </div>

                {/* Image Upload Section */}
                <div className="mb-5">
                  <h4 className="mb-3 fw-bold text-primary d-flex align-items-center">
                    <i className="bi bi-image me-2"></i>
                    Supporting Evidence
                    <span className="badge bg-light text-muted ms-2 fs-6 fw-normal">Optional</span>
                  </h4>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Upload an image of the issue</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mb-2"
                    />
                    <Form.Text className="text-muted d-block mb-3">
                      <i className="bi bi-info-circle me-1"></i>
                      Max file size: 5MB. Supported formats: JPG, PNG, GIF
                    </Form.Text>
                    {imagePreview && (
                      <div className="mt-3">
                        <div className="border rounded p-3 bg-light">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="fw-semibold text-success">
                              <i className="bi bi-check-circle me-1"></i>
                              Image uploaded successfully
                            </span>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => {
                                setImagePreview(null)
                                setFormData(prev => ({...prev, image: null}))
                              }}
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </div>
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="img-fluid rounded shadow-sm"
                            style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
                          />
                        </div>
                      </div>
                    )}
                  </Form.Group>
                </div>

                <div className="text-center">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                    className="px-5 py-3"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Filing Complaint...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-file-earmark-plus me-2"></i>
                        File Complaint
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Complaint Preview Modal */}
      <Modal
        show={showPreview}
        onHide={() => setShowPreview(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="d-flex align-items-center">
            <i className="bi bi-check-circle-fill text-success me-2"></i>
            Complaint Filed Successfully!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {generatedComplaint && (
            <>
              <div className="text-center mb-4">
                <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                  <i className="bi bi-check-lg text-success fs-3"></i>
                </div>
                <h5 className="mb-0">Your complaint has been successfully registered!</h5>
              </div>

              <Row className="mb-4">
                <Col md={6}>
                  <Card className="bg-light border-0 h-100">
                    <Card.Body>
                      <h6 className="text-primary mb-3 fw-bold">Complaint Details</h6>
                      <div className="mb-2">
                        <strong className="d-block text-muted small">Tracking ID</strong>
                        <code className="bg-white px-2 py-1 rounded text-primary">
                          {generatedComplaint.complaint.trackingId}
                        </code>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="bg-light border-0 h-100">
                    <Card.Body>
                      <h6 className="text-primary mb-3 fw-bold">Assigned Department</h6>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-building me-2 text-muted"></i>
                        <span className="fw-semibold">{generatedComplaint.complaint.department.name}</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Card className="border-0 mb-4">
                <Card.Header className="bg-light border-0">
                  <h6 className="mb-0 fw-bold text-primary d-flex align-items-center">
                    <i className="bi bi-file-text me-2"></i>
                    Generated Complaint Letter
                  </h6>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="bg-white border rounded p-4">
                    <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                      {generatedComplaint.complaintLetter}
                    </pre>
                  </div>
                </Card.Body>
              </Card>

              <div className="text-center">
                <h6 className="mb-3 fw-bold text-primary">Send Your Complaint</h6>
                <p className="text-muted mb-4">Choose how you'd like to send your complaint to the department</p>
                <Row className="g-3">
                  <Col md={6}>
                    <Button
                      variant="success"
                      className="w-100 py-3"
                      onClick={handleSendWhatsApp}
                    >
                      <i className="bi bi-whatsapp me-2"></i>
                      Send via WhatsApp
                    </Button>
                  </Col>
                  <Col md={6}>
                    <Button
                      variant="primary"
                      className="w-100 py-3"
                      onClick={handleSendEmail}
                    >
                      <i className="bi bi-envelope me-2"></i>
                      Send via Email
                    </Button>
                  </Col>
                </Row>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            <i className="bi bi-x-circle me-2"></i>
            Close
          </Button>
          <Button variant="outline-primary" onClick={handleNewComplaint}>
            <i className="bi bi-plus-circle me-2"></i>
            File Another Complaint
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default NewComplaint 