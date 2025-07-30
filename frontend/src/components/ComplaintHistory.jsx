import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Alert, Modal, Badge, Pagination, Spinner, ButtonGroup } from 'react-bootstrap'
import { complaintService } from '../services/complaintService'

const ComplaintHistory = () => {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({})
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showComplaintLetter, setShowComplaintLetter] = useState(false)

  useEffect(() => {
    loadComplaints(currentPage)
  }, [currentPage])

  const loadComplaints = async (page = 1) => {
    setLoading(true)
    try {
      const response = await complaintService.getUserComplaints(page, 10)
      setComplaints(response.complaints)
      setPagination(response.pagination)
    } catch (error) {
      console.error('Error loading complaints:', error)
      setError('Failed to load complaints. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'Filed': 'primary',
      'In Progress': 'warning',
      'Resolved': 'success',
      'Closed': 'secondary'
    }
    return <Badge bg={statusMap[status] || 'secondary'} className="px-3 py-2">{status}</Badge>
  }

  const handleSendWhatsApp = async (complaint) => {
    try {
      const whatsappUrl = complaintService.generateWhatsAppLink(
        complaint.complaintLetter,
        complaint.department.contactPhone
      )
      
      // Mark as sent via WhatsApp
      await complaintService.markComplaintSent(complaint._id, 'WhatsApp')
      
      // Update local state
      setComplaints(prev => prev.map(c => 
        c._id === complaint._id 
          ? { ...c, sentVia: [...c.sentVia, { method: 'WhatsApp', sentAt: new Date() }] }
          : c
      ))
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank')
      setSuccess('Complaint sent via WhatsApp successfully!')
    } catch (error) {
      console.error('Error sending via WhatsApp:', error)
      setError('Failed to send via WhatsApp')
    }
  }

  const handleSendEmail = async (complaint) => {
    try {
      const subject = `Complaint regarding ${complaint.issueType} - ${complaint.trackingId}`
      const emailUrl = complaintService.generateEmailLink(
        complaint.complaintLetter,
        complaint.department.contactEmail,
        subject
      )
      
      // Mark as sent via Email
      await complaintService.markComplaintSent(complaint._id, 'Email')
      
      // Update local state
      setComplaints(prev => prev.map(c => 
        c._id === complaint._id 
          ? { ...c, sentVia: [...c.sentVia, { method: 'Email', sentAt: new Date() }] }
          : c
      ))
      
      // Open email client
      window.open(emailUrl, '_blank')
      setSuccess('Complaint sent via Email successfully!')
    } catch (error) {
      console.error('Error sending via Email:', error)
      setError('Failed to send via Email')
    }
  }

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint)
    setShowDetailModal(true)
  }

  const handleViewComplaintLetter = (complaint) => {
    setSelectedComplaint(complaint)
    setShowComplaintLetter(true)
  }

  const handleDeleteComplaint = async (complaintId) => {
    if (window.confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) {
      try {
        await complaintService.deleteComplaint(complaintId)
        setComplaints(prev => prev.filter(c => c._id !== complaintId))
        setSuccess('Complaint deleted successfully!')
      } catch (error) {
        console.error('Error deleting complaint:', error)
        setError('Failed to delete complaint')
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getSentViaInfo = (sentVia) => {
    if (!sentVia || sentVia.length === 0) {
      return <span className="text-muted small">Not sent yet</span>
    }

    return (
      <div className="d-flex flex-wrap gap-1">
        {sentVia.map((item, index) => (
          <Badge key={index} bg={item.method === 'WhatsApp' ? 'success' : 'primary'} className="small">
            <i className={`bi bi-${item.method === 'WhatsApp' ? 'whatsapp' : 'envelope'} me-1`}></i>
            {item.method}
          </Badge>
        ))}
      </div>
    )
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center mb-4">
            <div className="bg-primary rounded-circle p-3 me-3">
              <i className="bi bi-clock-history text-white fs-4"></i>
            </div>
            <div>
              <h2 className="mb-0 fw-bold">Complaint History</h2>
              <p className="text-muted mb-0">Track and manage all your filed complaints</p>
            </div>
            <div className="ms-auto">
              <Button
                variant="outline-primary"
                onClick={() => loadComplaints(currentPage)}
                disabled={loading}
                className="px-4"
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Refresh
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')} className="fade-in-up mb-4">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success" dismissible onClose={() => setSuccess('')} className="fade-in-up mb-4">
              <i className="bi bi-check-circle me-2"></i>
              {success}
            </Alert>
          )}

          {loading ? (
            <Card className="border-0">
              <Card.Body className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="text-muted">Loading your complaints...</h5>
                <p className="text-muted mb-0">Please wait while we fetch your complaint history</p>
              </Card.Body>
            </Card>
          ) : complaints.length === 0 ? (
            <Card className="border-0 text-center py-5 fade-in-up">
              <Card.Body>
                <div className="mb-4">
                  <i className="bi bi-inbox display-1 text-muted opacity-50"></i>
                </div>
                <h4 className="text-muted mb-3">No complaints found</h4>
                <p className="text-muted mb-4 fs-5">You haven't filed any complaints yet. Start by filing your first complaint.</p>
                <Button href="/new-complaint" variant="primary" size="lg" className="px-4">
                  <i className="bi bi-plus-circle me-2"></i>
                  File Your First Complaint
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <>
              <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="text-muted">
                    Showing {complaints.length} of {pagination.total} complaints
                  </span>
                  <small className="text-muted">
                    Page {currentPage} of {pagination.pages}
                  </small>
                </div>
              </div>

              {complaints.map((complaint, index) => (
                <Card key={complaint._id} className="mb-4 border-0 hover-card fade-in-up" style={{'--bs-animation-delay': `${index * 0.1}s`}}>
                  <Card.Body className="p-4">
                    <Row className="align-items-center">
                      <Col lg={8}>
                        <div className="d-flex align-items-center mb-3">
                          <h5 className="mb-0 me-3 fw-bold">{complaint.issueType}</h5>
                          {getStatusBadge(complaint.status)}
                        </div>
                        
                        <div className="mb-2">
                          <i className="bi bi-geo-alt text-primary me-2"></i>
                          <span className="text-muted fw-medium">
                            {complaint.location.address}, {complaint.location.city} - {complaint.location.pincode}
                          </span>
                        </div>
                        
                        <p className="text-dark mb-3 lh-base">
                          {complaint.description.length > 120 
                            ? `${complaint.description.substring(0, 120)}...` 
                            : complaint.description}
                        </p>
                        
                        <div className="row g-3 align-items-center text-muted small mb-3">
                          <div className="col-auto">
                            <i className="bi bi-calendar3 me-1"></i>
                            {formatDate(complaint.createdAt)}
                          </div>
                          <div className="col-auto">
                            <i className="bi bi-hash me-1"></i>
                            <code className="bg-light px-2 py-1 rounded text-primary">
                              {complaint.trackingId}
                            </code>
                          </div>
                          <div className="col-auto">
                            <i className="bi bi-building me-1"></i>
                            {complaint.department.name}
                          </div>
                        </div>
                        
                        <div className="d-flex align-items-center">
                          <span className="text-muted small me-2 fw-semibold">Sent via:</span>
                          {getSentViaInfo(complaint.sentVia)}
                        </div>
                      </Col>
                      
                      <Col lg={4}>
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleViewDetails(complaint)}
                              className="flex-fill"
                            >
                              <i className="bi bi-eye me-1"></i>
                              Details
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"  
                              onClick={() => handleViewComplaintLetter(complaint)}
                              className="flex-fill"
                            >
                              <i className="bi bi-file-text me-1"></i>
                              Letter
                            </Button>
                          </div>
                          
                          <div className="d-flex gap-2">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleSendWhatsApp(complaint)}
                              className="flex-fill"
                            >
                              <i className="bi bi-whatsapp me-1"></i>
                              WhatsApp
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleSendEmail(complaint)}
                              className="flex-fill"
                            >
                              <i className="bi bi-envelope me-1"></i>
                              Email
                            </Button>
                          </div>
                          
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteComplaint(complaint._id)}
                          >
                            <i className="bi bi-trash me-1"></i>
                            Delete
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="d-flex justify-content-center mt-5">
                  <Pagination size="lg">
                    <Pagination.Prev 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    />
                    {[...Array(pagination.pages)].map((_, index) => (
                      <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next 
                      disabled={currentPage === pagination.pages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>

      {/* Complaint Details Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="d-flex align-items-center">
            <i className="bi bi-info-circle me-2"></i>
            Complaint Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedComplaint && (
            <Row className="g-4">
              <Col md={6}>
                <Card className="bg-light border-0 h-100">
                  <Card.Body>
                    <h6 className="text-primary mb-3 fw-bold">Basic Information</h6>
                    <div className="mb-3">
                      <strong className="d-block text-muted small mb-1">Tracking ID</strong>
                      <code className="bg-white px-2 py-1 rounded text-primary">
                        {selectedComplaint.trackingId}
                      </code>
                    </div>
                    <div className="mb-3">
                      <strong className="d-block text-muted small mb-1">Issue Type</strong>
                      <span>{selectedComplaint.issueType}</span>
                    </div>
                    <div className="mb-3">
                      <strong className="d-block text-muted small mb-1">Status</strong>
                      {getStatusBadge(selectedComplaint.status)}
                    </div>
                    <div className="mb-0">
                      <strong className="d-block text-muted small mb-1">Filed on</strong>
                      <span>{formatDate(selectedComplaint.createdAt)}</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="bg-light border-0 h-100">
                  <Card.Body>
                    <h6 className="text-primary mb-3 fw-bold">Location & Department</h6>
                    <div className="mb-3">
                      <strong className="d-block text-muted small mb-1">City</strong>
                      <span>{selectedComplaint.location.city}</span>
                    </div>
                    <div className="mb-3">
                      <strong className="d-block text-muted small mb-1">Pincode</strong>
                      <span>{selectedComplaint.location.pincode}</span>
                    </div>
                    <div className="mb-3">
                      <strong className="d-block text-muted small mb-1">Address</strong>
                      <span>{selectedComplaint.location.address}</span>
                    </div>
                    <div className="mb-0">
                      <strong className="d-block text-muted small mb-1">Department</strong>
                      <span>{selectedComplaint.department.name}</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12}>
                <Card className="border-0">
                  <Card.Body>
                    <h6 className="text-primary mb-3 fw-bold">Description</h6>
                    <div className="bg-light p-3 rounded">
                      <p className="mb-0 lh-lg">{selectedComplaint.description}</p>
                    </div>
                  </Card.Body>
                </Card>
                {selectedComplaint.image && (
                  <Card className="border-0 mt-3">
                    <Card.Body>
                      <h6 className="text-primary mb-3 fw-bold">Attached Image</h6>
                      <div className="text-center">
                        <img
                          src={selectedComplaint.image}
                          alt="Complaint"
                          className="img-fluid rounded shadow-sm"
                          style={{ maxHeight: '400px' }}
                        />
                      </div>
                    </Card.Body>
                  </Card>
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            <i className="bi bi-x-circle me-2"></i>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Complaint Letter Modal */}
      <Modal show={showComplaintLetter} onHide={() => setShowComplaintLetter(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="d-flex align-items-center">
            <i className="bi bi-file-text me-2"></i>
            Complaint Letter
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedComplaint && (
            <Card className="border-0 bg-light">
              <Card.Body>
                <div className="bg-white p-4 rounded">
                  <pre className="mb-0" style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.8' }}>
                    {selectedComplaint.complaintLetter}
                  </pre>
                </div>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setShowComplaintLetter(false)}>
            <i className="bi bi-x-circle me-2"></i>
            Close
          </Button>
          {selectedComplaint && (
            <>
              <Button
                variant="success"
                onClick={() => handleSendWhatsApp(selectedComplaint)}
              >
                <i className="bi bi-whatsapp me-2"></i>
                Send via WhatsApp
              </Button>
              <Button
                variant="primary"
                onClick={() => handleSendEmail(selectedComplaint)}
              >
                <i className="bi bi-envelope me-2"></i>
                Send via Email
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default ComplaintHistory 