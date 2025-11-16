import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Badge, Accordion } from 'react-bootstrap';

const ProductFilters = ({ onFilterChange, filters, onClearFilters }) => {
    const [localFilters, setLocalFilters] = useState({
        priceRange: filters.priceRange || [0, 10000],
        category: filters.category || '',
        rating: filters.rating || 0,
        ...filters
    });

    const categories = [
        'Scented Candles',
        'Aromatherapy',
        'Natural Scent',
        'Flavor Scent',
        'Pillar Candles',
        'Votive Candles',
        'Tea Light Candles',
        'Jar Candles',
        'Luxury Candles',
        'Soy Candles',
        'Beeswax Candles',
        'Seasonal Candles',
        'Gift Sets',
        'Home Decor'
    ];

    const handleFilterChange = (filterType, value) => {
        const newFilters = { ...localFilters, [filterType]: value };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handlePriceChange = (type, value) => {
        const newPriceRange = [...localFilters.priceRange];
        if (type === 'min') {
            newPriceRange[0] = parseInt(value) || 0;
        } else {
            newPriceRange[1] = parseInt(value) || 10000;
        }
        handleFilterChange('priceRange', newPriceRange);
    };

    const handleClearFilters = () => {
        const clearedFilters = {
            priceRange: [0, 10000],
            category: '',
            rating: 0
        };
        setLocalFilters(clearedFilters);
        onClearFilters();
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <i
                key={index}
                className={`fas fa-star ${index < rating ? 'text-warning' : 'text-dark'}`}
                style={{ fontSize: '1rem', cursor: 'pointer' }}
                onClick={() => handleFilterChange('rating', index + 1)}
            ></i>
        ));
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (localFilters.category) count++;
        if (localFilters.rating > 0) count++;
        if (localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 10000) count++;
        return count;
    };

    return (
        <Card className="elegant-filter-card mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                    <i className="fas fa-filter me-2 candle-flame"></i>
                    <strong>Filter Products</strong>
                </div>
                <div>
                    {getActiveFiltersCount() > 0 && (
                        <Badge bg="primary" className="me-2">
                            {getActiveFiltersCount()} Active
                        </Badge>
                    )}
                    <Button
                        variant="outline-light"
                        size="sm"
                        onClick={handleClearFilters}
                        disabled={getActiveFiltersCount() === 0}
                    >
                        <i className="fas fa-times me-1"></i>
                        Clear
                    </Button>
                </div>
            </Card.Header>
            <Card.Body>
                <Accordion defaultActiveKey={['0', '1', '2']} alwaysOpen>
                    {/* Price Filter */}
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            <i className="fas fa-dollar-sign me-2 text-dark"></i>
                            Price Range
                        </Accordion.Header>
                        <Accordion.Body>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Min Price (₱)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="0"
                                            value={localFilters.priceRange[0]}
                                            onChange={(e) => handlePriceChange('min', e.target.value)}
                                            placeholder="0"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Max Price (₱)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="0"
                                            value={localFilters.priceRange[1]}
                                            onChange={(e) => handlePriceChange('max', e.target.value)}
                                            placeholder="10000"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="price-range-display p-3 bg-light rounded text-dark">
                                <div className="d-flex justify-content-between">
                                    <span className="fw-bold text-dark">₱{localFilters.priceRange[0]}</span>
                                    <span className="text-dark">to</span>
                                    <span className="fw-bold text-dark">₱{localFilters.priceRange[1]}</span>
                                </div>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>

                    {/* Category Filter */}
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>
                            <i className="fas fa-tags me-2 text-dark"></i>
                            Category
                        </Accordion.Header>
                        <Accordion.Body>
                            <Form.Group>
                                <Form.Select
                                    value={localFilters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="mb-3"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            
                            {/* Category Pills */}
                            <div className="category-pills">
                                <Badge
                                    bg={!localFilters.category ? 'primary' : 'outline-primary'}
                                    className="me-2 mb-2 category-pill"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleFilterChange('category', '')}
                                >
                                    All
                                </Badge>
                                {categories.slice(0, 6).map(category => (
                                    <Badge
                                        key={category}
                                        bg={localFilters.category === category ? 'primary' : 'outline-secondary'}
                                        className="me-2 mb-2 category-pill"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleFilterChange('category', category)}
                                    >
                                        {category}
                                    </Badge>
                                ))}
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>

                    {/* Rating Filter */}
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>
                            <i className="fas fa-star me-2 text-dark"></i>
                            Customer Rating
                        </Accordion.Header>
                        <Accordion.Body>
                            <div className="rating-filter mb-3">
                                <Form.Label>Minimum Rating</Form.Label>
                                <div className="rating-stars-container p-3 bg-light rounded text-dark">
                                    <div className="d-flex align-items-center justify-content-center">
                                        {renderStars(localFilters.rating)}
                                        <span className="ms-3 fw-bold">
                                            {localFilters.rating > 0 ? `${localFilters.rating}+ Stars` : 'Any Rating'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Rating Options */}
                            <div className="rating-options">
                                {[0, 1, 2, 3, 4, 5].map(rating => (
                                    <div
                                        key={rating}
                                        className={`rating-option p-2 rounded mb-2 ${
                                            localFilters.rating === rating ? 'bg-primary text-white' : 'bg-light text-dark'
                                        }`}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleFilterChange('rating', rating)}
                                    >
                                        <div className="d-flex align-items-center">
                                            {rating === 0 ? (
                                                <span>Any Rating</span>
                                            ) : (
                                                <>
                                                    {[...Array(rating)].map((_, i) => (
                                                        <i key={i} className="fas fa-star text-dark me-1"></i>
                                                    ))}
                                                    <span className="ms-2">{rating}+ Stars</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Card.Body>
        </Card>
    );
};

export default ProductFilters;
