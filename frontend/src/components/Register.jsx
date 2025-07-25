import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [validated, setValidated] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(true)
  
  const { register, loading, error, clearError, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    clearError()
  }, [clearError])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Check password match in real-time
    if (name === 'confirmPassword' || name === 'password') {
      const password = name === 'password' ? value : formData.password
      const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword
      setPasswordMatch(password === confirmPassword)
    }
    
    // Clear validation when user starts typing
    if (validated) {
      setValidated(false)
    }
    clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    
    if (form.checkValidity() === false || !passwordMatch) {
      e.stopPropagation()
      setValidated(true)
      return
    }

    const result = await register(formData.name, formData.email, formData.password)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setValidated(true)
    }
  }

  return (
    <div className="auth-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="auth-card">
              <div className="auth-header">
                <h2 className="mb-0">Create Account</h2>
                <p className="mb-0 mt-2">Join CivicConnect today</p>
              </div>
              <Card.Body className="auth-body">
                {error && (
                  <Alert variant="danger" className="mb-3">
                    {error}
                  </Alert>
                )}
                
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      minLength={2}
                      maxLength={50}
                      placeholder="Enter your full name"
                      size="lg"
                    />
                    <Form.Control.Feedback type="invalid">
                      Name must be between 2 and 50 characters.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                      size="lg"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid email address.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$"
                      placeholder="Enter your password"
                      size="lg"
                    />
                    <Form.Control.Feedback type="invalid">
                      Password must be at least 6 characters with uppercase, lowercase, and number.
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Must contain at least one uppercase letter, lowercase letter, and number.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Confirm your password"
                      size="lg"
                      isInvalid={validated && !passwordMatch}
                    />
                    <Form.Control.Feedback type="invalid">
                      Passwords do not match.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-100 mb-3"
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
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </Form>

                <div className="text-center">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Register 