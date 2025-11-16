import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Modal, Form, Alert } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const ProductReviews = ({ productId, userReview, onReviewUpdate }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    // Validation schema
    const validationSchema = Yup.object({
        rating: Yup.number()
            .min(1, 'Rating must be at least 1')
            .max(5, 'Rating cannot exceed 5')
            .required('Rating is required'),
        comment: Yup.string()
            .min(10, 'Comment must be at least 10 characters')
            .max(500, 'Comment cannot exceed 500 characters')
            .required('Comment is required')
    });

    // Formik setup
    const formik = useFormik({
        initialValues: {
            rating: editingReview ? editingReview.rating : 5,
            comment: editingReview ? editingReview.comment : ''
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            await handleSubmitReview(values);
        }
    });

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API}/reviews?id=${productId}`);
            if (data.success) {
                setReviews(data.reviews);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (values) => {
        try {
            setSubmitting(true);
            
            const reviewData = {
                rating: values.rating,
                comment: values.comment,
                productId
            };

            let response;
            if (editingReview) {
                // Update existing review
                reviewData.reviewId = editingReview._id;
                response = await axios.put(`${import.meta.env.VITE_API}/review/update`, reviewData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                // Create new review
                response = await axios.put(`${import.meta.env.VITE_API}/review`, reviewData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            if (response.data.success) {
                toast.success(response.data.message);
                
                // Show filtered words warning if any
                if (response.data.filteredWords) {
                    toast.warning(response.data.filteredWords, {
                        autoClose: 5000
                    });
                }
                
                setShowModal(false);
                setEditingReview(null);
                formik.resetForm();
                fetchReviews();
                
                // Notify parent component
                if (onReviewUpdate) {
                    onReviewUpdate();
                }
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditReview = (review) => {
        setEditingReview(review);
        setShowModal(true);
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            const result = await Swal.fire({
                title: 'Delete Review?',
                text: 'Are you sure you want to delete this review? This action cannot be undone.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                const { data } = await axios.delete(
                    `${import.meta.env.VITE_API}/review/user?productId=${productId}&reviewId=${reviewId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (data.success) {
                    toast.success('Review deleted successfully');
                    fetchReviews();
                    
                    // Notify parent component
                    if (onReviewUpdate) {
                        onReviewUpdate();
                    }
                }
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error(error.response?.data?.message || 'Failed to delete review');
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <i
                key={index}
                className={`fas fa-star ${index < rating ? 'text-warning' : 'text-dark'}`}
                style={{ fontSize: '0.9rem', color: index < rating ? 'var(--gold-color)' : '#333' }}
            ></i>
        ));
    };

    const renderRatingInput = () => {
        return [...Array(5)].map((_, index) => (
            <i
                key={index}
                className={`fas fa-star ${index < formik.values.rating ? 'text-warning' : 'text-dark'}`}
                style={{ fontSize: '1.5rem', cursor: 'pointer', marginRight: '5px', color: index < formik.values.rating ? 'var(--gold-color)' : '#333' }}
                onClick={() => formik.setFieldValue('rating', index + 1)}
            ></i>
        ));
    };

    if (loading) {
        return (
            <div className="text-center py-4">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading reviews...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-4 reviews-section" style={{ color: '#333' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 style={{ color: '#333' }}>Customer Reviews ({reviews.length})</h4>
                {user && (
                    <Button
                        variant="primary"
                        size="sm"
                        style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
                        onClick={() => {
                            const existingReview = reviews.find(r => r.user === user._id);
                            if (existingReview) {
                                handleEditReview(existingReview);
                            } else {
                                setEditingReview(null);
                                setShowModal(true);
                            }
                        }}
                    >
                        <i className="fas fa-edit me-2"></i>
                        {reviews.find(r => r.user === user._id) ? 'Edit My Review' : 'Write Review'}
                    </Button>
                )}
            </div>

            {reviews.length === 0 ? (
                <Alert variant="info" style={{ backgroundColor: 'var(--warm-white)', borderColor: 'var(--border-light)', color: '#333' }}>
                    <i className="fas fa-info-circle me-2"></i>
                    No reviews yet. Be the first to review this product!
                </Alert>
            ) : (
                <Row>
                    {reviews.map((review) => (
                        <Col md={6} key={review._id} className="mb-3">
                            <Card className="h-100" style={{ backgroundColor: 'var(--warm-white)', borderColor: 'var(--border-light)', color: '#333' }}>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div>
                                            <h6 className="mb-1">{review.name}</h6>
                                            <div className="mb-2">
                                                {renderStars(review.rating)}
                                                <small className="text-muted ms-2" style={{ color: '#333' }}>
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </small>
                                            </div>
                                        </div>
                                        {user && user._id === review.user && (
                                            <div>
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="me-1"
                                                    style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
                                                    onClick={() => handleEditReview(review)}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    style={{ borderColor: '#dc3545', color: '#dc3545' }}
                                                    onClick={() => handleDeleteReview(review._id)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    <p className="mb-0">{review.comment}</p>
                                    {review.updatedAt !== review.createdAt && (
                                        <small className="text-muted" style={{ color: 'var(--text-light)' }}>
                                            <i className="fas fa-edit me-1"></i>
                                            Edited on {new Date(review.updatedAt).toLocaleDateString()}
                                        </small>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Review Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingReview ? 'Edit Review' : 'Write a Review'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={formik.handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Rating</Form.Label>
                            <div className="mb-2">
                                {renderRatingInput()}
                            </div>
                            <Form.Text className="text-muted" style={{ color: 'var(--text-light)' }}>
                                Click on stars to rate (1-5 stars)
                            </Form.Text>
                            {formik.touched.rating && formik.errors.rating && (
                                <div className="text-danger small mt-1" style={{ color: '#dc3545' }}>{formik.errors.rating}</div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="comment"
                                placeholder="Share your experience with this product..."
                                value={formik.values.comment}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={formik.touched.comment && formik.errors.comment}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.comment}
                            </Form.Control.Feedback>
                            <Form.Text className="text-muted" style={{ color: 'var(--text-light)' }}>
                                {formik.values.comment.length}/500 characters
                            </Form.Text>
                        </Form.Group>

                        <Alert variant="info" className="small" style={{ backgroundColor: 'var(--warm-white)', borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}>
                            <i className="fas fa-shield-alt me-2"></i>
                            <strong>Content Policy:</strong> Reviews are automatically filtered for inappropriate content. 
                            Please keep your review respectful and helpful for other customers.
                        </Alert>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)} style={{ backgroundColor: 'var(--text-light)', borderColor: 'var(--text-light)', color: 'white' }}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={formik.handleSubmit}
                        disabled={submitting || !formik.isValid}
                        style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
                    >
                        {submitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                {editingReview ? 'Updating...' : 'Submitting...'}
                            </>
                        ) : (
                            <>
                                <i className={`fas ${editingReview ? 'fa-save' : 'fa-paper-plane'} me-2`}></i>
                                {editingReview ? 'Update Review' : 'Submit Review'}
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProductReviews;
