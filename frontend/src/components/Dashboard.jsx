import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { complaintService } from '../services/complaintService'

const Dashboard = () => {
  const { user } = useAuth()
  const [recentComplaints, setRecentComplaints] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    filed: 0,
    inProgress: 0,
    resolved: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const response = await complaintService.getUserComplaints(1, 5)
      setRecentComplaints(response.complaints)
      
      // Calculate stats
      const totalComplaints = response.pagination.total
      const filed = response.complaints.filter(c => c.status === 'Filed').length
      const inProgress = response.complaints.filter(c => c.status === 'In Progress').length
      const resolved = response.complaints.filter(c => c.status === 'Resolved').length
      
      setStats({
        total: totalComplaints,
        filed,
        inProgress,
        resolved
      })
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
    <Container className="py-4">
      {/* Welcome Section */}
      <Row className="mb-4">
        <Col>
          <Card className="bg-primary text-white shadow">
            <Card.Body className="text-center py-4">
              <h1 className="display-5 fw-bold mb-3">Welcome to CivicConnect</h1>
              <p className="lead mb-0">
                Hello {user?.name}! File complaints with your municipal departments easily and track their progress.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <h4 className="mb-3">Quick Actions</h4>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <Card className="h-100 shadow-sm border-0 hover-card">
            <Card.Body className="text-center p-4">
              <div className="mb-3">
                <i className="bi bi-file-earmark-plus display-4 text-primary"></i>
              </div>
              <Card.Title className="h5">File New Complaint</Card.Title>
              <Card.Text className="text-muted mb-3">
                Report issues with water, electricity, roads, sanitation, and more to your municipal department.
              </Card.Text>
              <Button as={Link} to="/new-complaint" variant="primary" size="lg" className="w-100">
                <i className="bi bi-plus-circle me-2"></i>
                File Complaint
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-3">
          <Card className="h-100 shadow-sm border-0 hover-card">
            <Card.Body className="text-center p-4">
              <div className="mb-3">
                <i className="bi bi-clock-history display-4 text-success"></i>
              </div>
              <Card.Title className="h5">View Complaint History</Card.Title>
              <Card.Text className="text-muted mb-3">
                Track the status of your filed complaints and resend them via WhatsApp or email.
              </Card.Text>
              <Button as={Link} to="/complaint-history" variant="success" size="lg" className="w-100">
                <i className="bi bi-list-ul me-2"></i>
                View History
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Statistics */}
      <Row className="mb-4">
        <Col>
          <h4 className="mb-3">Your Complaint Statistics</h4>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="text-center shadow-sm border-0">
            <Card.Body>
              <i className="bi bi-folder display-4 text-primary mb-2"></i>
              <h3 className="text-primary mb-1">{stats.total}</h3>
              <p className="text-muted mb-0">Total Complaints</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center shadow-sm border-0">
            <Card.Body>
              <i className="bi bi-file-earmark display-4 text-info mb-2"></i>
              <h3 className="text-info mb-1">{stats.filed}</h3>
              <p className="text-muted mb-0">Filed</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center shadow-sm border-0">
            <Card.Body>
              <i className="bi bi-hourglass-split display-4 text-warning mb-2"></i>
              <h3 className="text-warning mb-1">{stats.inProgress}</h3>
              <p className="text-muted mb-0">In Progress</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center shadow-sm border-0">
            <Card.Body>
              <i className="bi bi-check-circle display-4 text-success mb-2"></i>
              <h3 className="text-success mb-1">{stats.resolved}</h3>
              <p className="text-muted mb-0">Resolved</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Complaints */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">Recent Complaints</h4>
            <Button as={Link} to="/complaint-history" variant="outline-primary" size="sm">
              View All
            </Button>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Row>
          <Col>
            <Card>
              <Card.Body className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading your complaints...</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : recentComplaints.length === 0 ? (
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-5">
                <i className="bi bi-inbox display-1 text-muted mb-3"></i>
                <h5 className="text-muted">No complaints filed yet</h5>
                <p className="text-muted mb-3">Start by filing your first complaint to see it here.</p>
                <Button as={Link} to="/new-complaint" variant="primary">
                  <i className="bi bi-plus-circle me-2"></i>
                  File Your First Complaint
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        recentComplaints.map((complaint) => (
          <Row key={complaint._id} className="mb-3">
            <Col>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={8}>
                      <div className="d-flex align-items-center mb-2">
                        <h6 className="mb-0 me-3">{complaint.issueType}</h6>
                        <span className={`badge bg-${getStatusBadge(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </div>
                      <p className="text-muted mb-1">
                        <i className="bi bi-geo-alt me-1"></i>
                        {complaint.location.city}
                      </p>
                      <p className="mb-0">
                        {complaint.description.length > 100 
                          ? `${complaint.description.substring(0, 100)}...` 
                          : complaint.description}
                      </p>
                    </Col>
                    <Col md={4} className="text-md-end">
                      <div className="text-muted small mb-2">
                        <i className="bi bi-calendar3 me-1"></i>
                        {formatDate(complaint.createdAt)}
                      </div>
                      <div className="text-muted small">
                        <i className="bi bi-hash me-1"></i>
                        {complaint.trackingId}
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
          <Card className="bg-light border-0">
            <Card.Body className="text-center py-4">
              <h5 className="mb-3">About CivicConnect</h5>
              <p className="text-muted mb-0">
                CivicConnect makes it easy to file complaints with your municipal departments. 
                Generate professional complaint letters and send them directly via WhatsApp or email 
                to the appropriate department based on your city and issue type.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard 