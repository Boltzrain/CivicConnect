import React from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <Container className="dashboard-container">
      <Row>
        <Col>
          <div className="welcome-card">
            <h1>Welcome to CivicConnect!</h1>
            <p>Hello {user?.name}, you're successfully logged in to your dashboard.</p>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <div className="mb-3">
                <i className="fas fa-user-circle display-4 text-primary"></i>
              </div>
              <Card.Title>Profile</Card.Title>
              <Card.Text>
                Manage your profile information and account settings.
              </Card.Text>
              <Button variant="primary">View Profile</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <div className="mb-3">
                <i className="fas fa-comments display-4 text-success"></i>
              </div>
              <Card.Title>Community</Card.Title>
              <Card.Text>
                Connect with your local community and participate in discussions.
              </Card.Text>
              <Button variant="success">Join Discussions</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <div className="mb-3">
                <i className="fas fa-vote-yea display-4 text-warning"></i>
              </div>
              <Card.Title>Civic Engagement</Card.Title>
              <Card.Text>
                Stay informed about local issues and participate in civic activities.
              </Card.Text>
              <Button variant="warning">Get Involved</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">Account Information</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Name:</strong> {user?.name}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Role:</strong> {user?.role}</p>
                  <p><strong>Account ID:</strong> {user?.id}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard 