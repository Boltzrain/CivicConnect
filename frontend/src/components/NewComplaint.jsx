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
    priority: 'Medium',
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
      priority: 'Medium',
      image: null
    })
    setImagePreview(null)
    setGeneratedComplaint(null)
    setShowPreview(false)
    setSuccess('')
    setError('')
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">
                <i className="bi bi-file-earmark-plus me-2"></i>
                File New Complaint
              </h4>
            </Card.Header>
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                  {success}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Issue Type *</Form.Label>
                      <Form.Select
                        name="issueType"
                        value={formData.issueType}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Issue Type</option>
                        {issueTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Priority</Form.Label>
                      <Form.Select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>City *</Form.Label>
                      <Form.Select
                        name="location.city"
                        value={formData.location.city}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select City</option>
                        {cities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Pincode *</Form.Label>
                      <Form.Control
                        type="text"
                        name="location.pincode"
                        value={formData.location.pincode}
                        onChange={handleInputChange}
                        placeholder="Enter 6-digit pincode"
                        pattern="\d{6}"
                        maxLength="6"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Address *</Form.Label>
                  <Form.Control
                    type="text"
                    name="location.address"
                    value={formData.location.address}
                    onChange={handleInputChange}
                    placeholder="Enter detailed address"
                    maxLength="200"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the issue in detail..."
                    maxLength="1000"
                    required
                  />
                  <Form.Text className="text-muted">
                    {formData.description.length}/1000 characters
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Upload Image (Optional)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <Form.Text className="text-muted">
                    Max file size: 5MB. Supported formats: JPG, PNG, GIF
                  </Form.Text>
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                        className="img-thumbnail"
                      />
                    </div>
                  )}
                </Form.Group>

                <div className="d-grid">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
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
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-check-circle-fill text-success me-2"></i>
            Complaint Filed Successfully
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {generatedComplaint && (
            <>
              <div className="mb-3">
                <strong>Tracking ID:</strong> 
                <span className="badge bg-primary ms-2">
                  {generatedComplaint.complaint.trackingId}
                </span>
              </div>
              
              <div className="mb-3">
                <strong>Department:</strong> {generatedComplaint.complaint.department.name}
              </div>

              <Card className="mb-3">
                <Card.Header>
                  <h6 className="mb-0">Generated Complaint Letter</h6>
                </Card.Header>
                <Card.Body>
                  <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
                    {generatedComplaint.complaintLetter}
                  </pre>
                </Card.Body>
              </Card>

              <div className="d-grid gap-2">
                <h6>Send Complaint:</h6>
                <Row>
                  <Col md={6}>
                    <Button
                      variant="success"
                      className="w-100"
                      onClick={handleSendWhatsApp}
                    >
                      <i className="bi bi-whatsapp me-2"></i>
                      Send via WhatsApp
                    </Button>
                  </Col>
                  <Col md={6}>
                    <Button
                      variant="primary"
                      className="w-100"
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
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            Close
          </Button>
          <Button variant="outline-primary" onClick={handleNewComplaint}>
            File Another Complaint
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default NewComplaint 