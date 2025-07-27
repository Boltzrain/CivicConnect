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
    return <Badge bg={statusMap[status] || 'secondary'}>{status}</Badge>
  }

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      'Low': 'success',
      'Medium': 'warning',
      'High': 'danger',
      'Urgent': 'danger'
    }
    return <Badge bg={priorityMap[priority] || 'secondary'}>{priority}</Badge>
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
    if (window.confirm('Are you sure you want to delete this complaint?')) {
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
      return <span className="text-muted">Not sent</span>
    }

    return (
      <div>
        {sentVia.map((item, index) => (
          <Badge key={index} bg={item.method === 'WhatsApp' ? 'success' : 'primary'} className="me-1">
            {item.method}
          </Badge>
        ))}
      </div>
    )
  }

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <i className="bi bi-clock-history me-2"></i>
                Complaint History
              </h4>
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => loadComplaints(currentPage)}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Refresh
              </Button>
            </Card.Header>
            <Card.Body>
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

              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                  <p className="mt-2">Loading complaints...</p>
                </div>
              ) : complaints.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox display-1 text-muted"></i>
                  <h5 className="text-muted mt-3">No complaints found</h5>
                  <p className="text-muted">You haven't filed any complaints yet.</p>
                </div>
              ) : (
                <>
                  {complaints.map((complaint) => (
                    <Card key={complaint._id} className="mb-3 border">
                      <Card.Body>
                        <Row className="align-items-center">
                          <Col md={8}>
                            <div className="d-flex align-items-center mb-2">
                              <h5 className="mb-0 me-3">{complaint.issueType}</h5>
                              {getStatusBadge(complaint.status)}
                              <span className="ms-2">{getPriorityBadge(complaint.priority)}</span>
                            </div>
                            
                            <p className="text-muted mb-1">
                              <i className="bi bi-geo-alt me-1"></i>
                              {complaint.location.address}, {complaint.location.city} - {complaint.location.pincode}
                            </p>
                            
                            <p className="mb-2">
                              {complaint.description.length > 100 
                                ? `${complaint.description.substring(0, 100)}...` 
                                : complaint.description}
                            </p>
                            
                            <div className="d-flex align-items-center text-muted small">
                              <span className="me-3">
                                <i className="bi bi-calendar3 me-1"></i>
                                {formatDate(complaint.createdAt)}
                              </span>
                              <span className="me-3">
                                <i className="bi bi-hash me-1"></i>
                                {complaint.trackingId}
                              </span>
                              <span>
                                <i className="bi bi-building me-1"></i>
                                {complaint.department.name}
                              </span>
                            </div>
                            
                            <div className="mt-2">
                              <strong className="small">Sent via:</strong>
                              <span className="ms-2">{getSentViaInfo(complaint.sentVia)}</span>
                            </div>
                          </Col>
                          
                          <Col md={4}>
                            <div className="d-grid gap-2">
                              <ButtonGroup size="sm">
                                <Button
                                  variant="outline-primary"
                                  onClick={() => handleViewDetails(complaint)}
                                >
                                  <i className="bi bi-eye me-1"></i>
                                  Details
                                </Button>
                                <Button
                                  variant="outline-secondary"
                                  onClick={() => handleViewComplaintLetter(complaint)}
                                >
                                  <i className="bi bi-file-text me-1"></i>
                                  Letter
                                </Button>
                              </ButtonGroup>
                              
                              <ButtonGroup size="sm">
                                <Button
                                  variant="success"
                                  onClick={() => handleSendWhatsApp(complaint)}
                                >
                                  <i className="bi bi-whatsapp me-1"></i>
                                  WhatsApp
                                </Button>
                                <Button
                                  variant="primary"
                                  onClick={() => handleSendEmail(complaint)}
                                >
                                  <i className="bi bi-envelope me-1"></i>
                                  Email
                                </Button>
                              </ButtonGroup>
                              
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
                    <Row className="mt-4">
                      <Col className="d-flex justify-content-center">
                        <Pagination>
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
                      </Col>
                    </Row>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Complaint Details Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-info-circle me-2"></i>
            Complaint Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedComplaint && (
            <Row>
              <Col md={6}>
                <div className="mb-3">
                  <strong>Tracking ID:</strong>
                  <span className="ms-2 badge bg-primary">{selectedComplaint.trackingId}</span>
                </div>
                <div className="mb-3">
                  <strong>Issue Type:</strong>
                  <span className="ms-2">{selectedComplaint.issueType}</span>
                </div>
                <div className="mb-3">
                  <strong>Priority:</strong>
                  <span className="ms-2">{getPriorityBadge(selectedComplaint.priority)}</span>
                </div>
                <div className="mb-3">
                  <strong>Status:</strong>
                  <span className="ms-2">{getStatusBadge(selectedComplaint.status)}</span>
                </div>
                <div className="mb-3">
                  <strong>Filed on:</strong>
                  <span className="ms-2">{formatDate(selectedComplaint.createdAt)}</span>
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-3">
                  <strong>City:</strong>
                  <span className="ms-2">{selectedComplaint.location.city}</span>
                </div>
                <div className="mb-3">
                  <strong>Pincode:</strong>
                  <span className="ms-2">{selectedComplaint.location.pincode}</span>
                </div>
                <div className="mb-3">
                  <strong>Address:</strong>
                  <span className="ms-2">{selectedComplaint.location.address}</span>
                </div>
                <div className="mb-3">
                  <strong>Department:</strong>
                  <span className="ms-2">{selectedComplaint.department.name}</span>
                </div>
              </Col>
              <Col xs={12}>
                <div className="mb-3">
                  <strong>Description:</strong>
                  <p className="mt-2 p-3 bg-light rounded">{selectedComplaint.description}</p>
                </div>
                {selectedComplaint.image && (
                  <div className="mb-3">
                    <strong>Image:</strong>
                    <div className="mt-2">
                      <img
                        src={selectedComplaint.image}
                        alt="Complaint"
                        className="img-fluid rounded"
                        style={{ maxHeight: '300px' }}
                      />
                    </div>
                  </div>
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Complaint Letter Modal */}
      <Modal show={showComplaintLetter} onHide={() => setShowComplaintLetter(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-file-text me-2"></i>
            Complaint Letter
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedComplaint && (
            <Card>
              <Card.Body>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
                  {selectedComplaint.complaintLetter}
                </pre>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowComplaintLetter(false)}>
            Close
          </Button>
          {selectedComplaint && (
            <>
              <Button
                variant="success"
                onClick={() => handleSendWhatsApp(selectedComplaint)}
              >
                <i className="bi bi-whatsapp me-1"></i>
                Send via WhatsApp
              </Button>
              <Button
                variant="primary"
                onClick={() => handleSendEmail(selectedComplaint)}
              >
                <i className="bi bi-envelope me-1"></i>
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