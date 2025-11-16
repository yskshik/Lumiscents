import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const ReviewsList = () => {
    const [reviews, setReviews] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (products.length > 0) {
            fetchAllReviews();
        }
    }, [products]);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API}/admin/products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setProducts(data.products);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        }
    };

    const fetchAllReviews = async () => {
        try {
            setLoading(true);
            const allReviews = [];
            
            // Fetch reviews for each product
            for (const product of products) {
                if (product.reviews && product.reviews.length > 0) {
                    const reviewsWithProduct = product.reviews.map(review => ({
                        ...review,
                        productId: product._id,
                        productName: product.name,
                        productImage: product.images[0]?.url || '/default-product.png'
                    }));
                    allReviews.push(...reviewsWithProduct);
                }
            }
            
            setReviews(allReviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async (productId, reviewId, reviewerName, productName) => {
        try {
            const result = await Swal.fire({
                title: 'Delete Review?',
                html: `
                    <div class="text-start">
                        <p><strong>Product:</strong> ${productName}</p>
                        <p><strong>Reviewer:</strong> ${reviewerName}</p>
                        <p class="text-danger mt-3">This action cannot be undone!</p>
                    </div>
                `,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel'
            });

            if (result.isConfirmed) {
                const { data } = await axios.delete(
                    `${import.meta.env.VITE_API}/reviews?productId=${productId}&id=${reviewId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (data.success) {
                    toast.success('Review deleted successfully');
                    fetchProducts(); // Refresh products to get updated reviews
                    setTimeout(() => {
                        fetchAllReviews(); // Refresh reviews list
                    }, 500);
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
                className={`fas fa-star ${index < rating ? 'text-warning' : 'text-muted'}`}
                style={{ fontSize: '0.8rem' }}
            ></i>
        ));
    };

    const getRatingColor = (rating) => {
        if (rating >= 4) return 'success';
        if (rating >= 3) return 'warning';
        if (rating >= 2) return 'info';
        return 'danger';
    };

    // Filter reviews based on search term and selected product
    const filteredReviews = reviews.filter(review => {
        const matchesSearch = !searchTerm || 
            review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.productName.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesProduct = !selectedProduct || review.productId === selectedProduct;
        
        return matchesSearch && matchesProduct;
    });

    const columns = [
        {
            field: 'productImage',
            headerName: 'Product',
            width: 100,
            renderCell: (params) => (
                <img
                    src={params.row.productImage}
                    alt="Product"
                    style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                    }}
                />
            ),
            sortable: false,
            filterable: false
        },
        {
            field: 'productName',
            headerName: 'Product Name',
            width: 200,
            renderCell: (params) => (
                <div>
                    <div className="fw-bold">{params.row.productName}</div>
                    <small className="text-muted">ID: {params.row.productId.slice(-8)}</small>
                </div>
            )
        },
        {
            field: 'name',
            headerName: 'Reviewer',
            width: 150,
            renderCell: (params) => (
                <div>
                    <div className="fw-bold">{params.row.name}</div>
                    <small className="text-muted">User ID: {params.row.user.slice(-8)}</small>
                </div>
            )
        },
        {
            field: 'rating',
            headerName: 'Rating',
            width: 120,
            renderCell: (params) => (
                <div className="d-flex align-items-center">
                    <Badge bg={getRatingColor(params.row.rating)} className="me-2">
                        {params.row.rating}
                    </Badge>
                    <div>{renderStars(params.row.rating)}</div>
                </div>
            )
        },
        {
            field: 'comment',
            headerName: 'Review Comment',
            width: 300,
            renderCell: (params) => (
                <div
                    style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        lineHeight: '1.2',
                        maxHeight: '60px',
                        overflow: 'hidden'
                    }}
                    title={params.row.comment}
                >
                    {params.row.comment}
                </div>
            )
        },
        {
            field: 'createdAt',
            headerName: 'Date',
            width: 120,
            renderCell: (params) => (
                <div>
                    <div>{new Date(params.row.createdAt).toLocaleDateString()}</div>
                    <small className="text-muted">
                        {new Date(params.row.createdAt).toLocaleTimeString()}
                    </small>
                </div>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            renderCell: (params) => (
                <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteReview(
                        params.row.productId,
                        params.row._id,
                        params.row.name,
                        params.row.productName
                    )}
                    title="Delete Review"
                >
                    <i className="fas fa-trash"></i>
                </Button>
            ),
            sortable: false,
            filterable: false
        }
    ];

    return (
        <Container fluid className="py-4">
            <Row>
                <Col>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <div className="d-flex justify-content-between align-items-center">
                                <h4 className="mb-0">
                                    <i className="fas fa-star me-2"></i>
                                    Reviews Management
                                </h4>
                                <Badge bg="light" text="dark" className="fs-6">
                                    {filteredReviews.length} Reviews
                                </Badge>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {/* Filters */}
                            <Row className="mb-4">
                                <Col md={6}>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <i className="fas fa-search"></i>
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            placeholder="Search reviews, products, or reviewers..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </InputGroup>
                                </Col>
                                <Col md={6}>
                                    <Form.Select
                                        value={selectedProduct}
                                        onChange={(e) => setSelectedProduct(e.target.value)}
                                    >
                                        <option value="">All Products</option>
                                        {products.map(product => (
                                            <option key={product._id} value={product._id}>
                                                {product.name} ({product.reviews?.length || 0} reviews)
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                            </Row>

                            {/* Statistics Cards */}
                            <Row className="mb-4">
                                <Col md={3}>
                                    <Card className="text-center border-success">
                                        <Card.Body>
                                            <h5 className="text-success">{reviews.length}</h5>
                                            <small className="text-muted">Total Reviews</small>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3}>
                                    <Card className="text-center border-info">
                                        <Card.Body>
                                            <h5 className="text-info">
                                                {reviews.length > 0 ? 
                                                    (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
                                                    : '0.0'
                                                }
                                            </h5>
                                            <small className="text-muted">Average Rating</small>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3}>
                                    <Card className="text-center border-warning">
                                        <Card.Body>
                                            <h5 className="text-warning">
                                                {products.filter(p => p.reviews && p.reviews.length > 0).length}
                                            </h5>
                                            <small className="text-muted">Products with Reviews</small>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3}>
                                    <Card className="text-center border-primary">
                                        <Card.Body>
                                            <h5 className="text-primary">
                                                {reviews.filter(r => r.rating >= 4).length}
                                            </h5>
                                            <small className="text-muted">4+ Star Reviews</small>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            {/* Reviews DataGrid */}
                            <div style={{ height: 600, width: '100%' }}>
                                <DataGrid
                                    rows={filteredReviews}
                                    columns={columns}
                                    pageSize={10}
                                    rowsPerPageOptions={[10, 25, 50]}
                                    loading={loading}
                                    disableSelectionOnClick
                                    getRowId={(row) => row._id}
                                    sx={{
                                        '& .MuiDataGrid-row:hover': {
                                            backgroundColor: '#f8f9fa'
                                        }
                                    }}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ReviewsList;
