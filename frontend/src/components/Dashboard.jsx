import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { complaintService } from '../services/complaintService'

const Dashboard = () => {
  const { user } = useAuth()
  const [recentComplaints, setRecentComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const response = await complaintService.getUserComplaints(1, 5)
      setRecentComplaints(response.complaints)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setError('Failed to load dashboard data')
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
    return statusMap[status] || 'secondary'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Container className="dashboard-container">
      {/* Welcome Section */}
      <Row className="mb-5">
        <Col>
          <div className="welcome-card fade-in-up">
            <h1 className="display-4 fw-bold mb-3">
              Welcome to CivicConnect ✨
            </h1>
            <p className="lead mb-0">
              Hello <strong>{user?.name}</strong>! Your one-stop solution to file complaints with municipal departments and track their progress seamlessly.
            </p>
          </div>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-5">
        <Col>
          <div className="d-flex align-items-center mb-4">
            <div className="bg-primary rounded-circle p-2 me-3">
              <i className="bi bi-lightning-charge text-white"></i>
            </div>
            <h3 className="mb-0 fw-bold">Quick Actions</h3>
          </div>
        </Col>
      </Row>

      <Row className="mb-5 g-4">
        <Col md={6}>
          <Card className="hover-card h-100 border-0 fade-in-up" style={{'--bs-animation-delay': '0.1s'}}>
            <Card.Body className="text-center p-4">
              <div className="mb-4">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
                  <i className="bi bi-file-earmark-plus text-primary" style={{fontSize: '2rem'}}></i>
                </div>
              </div>
              <Card.Title className="h4 mb-3 fw-bold">File New Complaint</Card.Title>
              <Card.Text className="text-muted mb-4 px-3">
                Report issues with water supply, electricity, roads, sanitation, garbage collection, and more to your municipal department with ease.
              </Card.Text>
              <Button as={Link} to="/new-complaint" variant="primary" size="lg" className="px-4 py-2">
                <i className="bi bi-plus-circle me-2"></i>
                File Complaint
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="hover-card h-100 border-0 fade-in-up" style={{'--bs-animation-delay': '0.2s'}}>
            <Card.Body className="text-center p-4">
              <div className="mb-4">
                <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
                  <i className="bi bi-clock-history text-success" style={{fontSize: '2rem'}}></i>
                </div>
              </div>
              <Card.Title className="h4 mb-3 fw-bold">View Complaint History</Card.Title>
              <Card.Text className="text-muted mb-4 px-3">
                Track the status of your filed complaints, view detailed reports, and resend them via WhatsApp or email.
              </Card.Text>
              <Button as={Link} to="/complaint-history" variant="success" size="lg" className="px-4 py-2">
                <i className="bi bi-list-ul me-2"></i>
                View History
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Complaints */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <div className="bg-secondary rounded-circle p-2 me-3">
                <i className="bi bi-clock-history text-white"></i>
              </div>
              <h3 className="mb-0 fw-bold">Recent Complaints</h3>
            </div>
            <Button as={Link} to="/complaint-history" variant="outline-primary" className="px-4">
              <i className="bi bi-arrow-right me-2"></i>
              View All
            </Button>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="fade-in-up">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {loading ? (
        <Row>
          <Col>
            <Card className="border-0">
              <Card.Body className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="text-muted">Loading your complaints...</h5>
                <p className="text-muted mb-0">Please wait while we fetch your data</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : recentComplaints.length === 0 ? (
        <Row>
          <Col>
            <Card className="border-0 text-center py-5 fade-in-up">
              <Card.Body>
                <div className="mb-4">
                  <i className="bi bi-inbox display-1 text-muted opacity-50"></i>
                </div>
                <h4 className="text-muted mb-3">No complaints filed yet</h4>
                <p className="text-muted mb-4 fs-5">Start by filing your first complaint to see it here and track its progress.</p>
                <Button as={Link} to="/new-complaint" variant="primary" size="lg" className="px-4">
                  <i className="bi bi-plus-circle me-2"></i>
                  File Your First Complaint
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        recentComplaints.map((complaint, index) => (
          <Row key={complaint._id} className="mb-4">
            <Col>
              <Card className="border-0 hover-card fade-in-up" style={{'--bs-animation-delay': `${index * 0.1}s`}}>
                <Card.Body className="p-4">
                  <Row className="align-items-center">
                    <Col md={8}>
                      <div className="d-flex align-items-center mb-3">
                        <h5 className="mb-0 me-3 fw-bold">{complaint.issueType}</h5>
                        <span className={`badge bg-${getStatusBadge(complaint.status)} px-3 py-2`}>
                          {complaint.status}
                        </span>
                      </div>
                      <div className="mb-2">
                        <i className="bi bi-geo-alt text-primary me-2"></i>
                        <span className="text-muted fw-medium">
                          {complaint.location.city}, {complaint.location.pincode}
                        </span>
                      </div>
                      <p className="text-dark mb-3 lh-base">
                        {complaint.description.length > 120 
                          ? `${complaint.description.substring(0, 120)}...` 
                          : complaint.description}
                      </p>
                      <div className="d-flex align-items-center text-muted small">
                        <span className="me-4 d-flex align-items-center">
                          <i className="bi bi-calendar3 me-1"></i>
                          {formatDate(complaint.createdAt)}
                        </span>
                        <span className="me-4 d-flex align-items-center">
                          <i className="bi bi-hash me-1"></i>
                          <code className="bg-light px-2 py-1 rounded text-primary">
                            {complaint.trackingId}
                          </code>
                        </span>
                        <span className="d-flex align-items-center">
                          <i className="bi bi-building me-1"></i>
                          {complaint.department.name}
                        </span>
                      </div>
                    </Col>
                    <Col md={4} className="text-md-end">
                      <div className="d-flex flex-column gap-2">
                        <Button 
                          as={Link} 
                          to="/complaint-history" 
                          variant="outline-primary" 
                          size="sm"
                          className="px-3"
                        >
                          <i className="bi bi-eye me-1"></i>
                          View Details
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ))
      )}

      {/* About Section */}
      <Row className="mt-5">
        <Col>
          <Card className="bg-light border-0 fade-in-up">
            <Card.Body className="text-center py-5">
              <div className="mb-4">
                <i className="bi bi-info-circle text-primary" style={{fontSize: '3rem'}}></i>
              </div>
              <h4 className="mb-4 fw-bold">About CivicConnect</h4>
              <p className="text-muted mb-0 fs-5 lh-lg px-md-5">
                CivicConnect streamlines the process of filing complaints with municipal departments. 
                Generate professional complaint letters, send them directly via WhatsApp or email, 
                and track their progress - all from one convenient platform designed for Indian citizens.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard 