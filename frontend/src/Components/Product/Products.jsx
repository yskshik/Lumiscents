import React, { Fragment, useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MetaData from '../Layout/MetaData';
import axios from 'axios';
import { getToken, getUser } from '../../Utils/helpers';
import { toast } from 'react-toastify';
import { 
    Slider, Box, Autocomplete, TextField, Card, CardContent, CardMedia, 
    Typography, Button, Chip, IconButton, Rating, Tooltip, Fade
} from '@mui/material';

// Card component for individual product with image slideshow
const ProductCard = ({ product, isInWishlist, isLastProduct, lastProductRef, toggleWishlist }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const images = product.images || [];
        if (!images.length) return;

        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % images.length);
        }, 2500);

        return () => clearInterval(interval);
    }, [product.images]);

    const handlePrevImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const images = product.images || [];
        if (!images.length) return;
        setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
    };

    const handleNextImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const images = product.images || [];
        if (!images.length) return;
        setCurrentImageIndex(prev => (prev + 1) % images.length);
    };

    const cardRef = isLastProduct ? lastProductRef : null;

    return (
        <div 
            ref={cardRef}
            className="col-sm-12 col-md-6 col-lg-3 my-3"
        >
            <Card
                elevation={2}
                sx={{
                    background: 'linear-gradient(135deg, #fdf8f1 0%, #faf6f2 100%)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    borderRadius: '20px',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    border: '2px solid #e8d4b0',
                    boxShadow: '0 4px 20px rgba(139, 69, 19, 0.1)',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '5px',
                        background: 'linear-gradient(90deg, #ffd700, #ff9b50, #ffd700)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 3s infinite'
                    },
                    '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: '0 8px 32px rgba(212, 165, 116, 0.15)',
                        borderColor: '#ffd700'
                    }
                }}
            >
                {/* Wishlist Heart Button */}
                <Tooltip title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"} arrow>
                    <IconButton
                        onClick={(e) => toggleWishlist(product._id, e)}
                        sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            zIndex: 10,
                            bgcolor: 'white',
                            boxShadow: 2,
                            '&:hover': {
                                bgcolor: 'white',
                                transform: 'scale(1.1)',
                            }
                        }}
                    >
                        <i 
                            className={isInWishlist ? "fa fa-heart" : "fa fa-heart-o"}
                            style={{
                                color: isInWishlist ? '#8B4513' : '#999',
                                fontSize: '1.2rem'
                            }}
                        ></i>
                    </IconButton>
                </Tooltip>

                {/* Product Image with slideshow + arrows */}
                <div style={{ position: 'relative' }}>
                    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                        <CardMedia
                            component="img"
                            height="250"
                            image={product.images[currentImageIndex]?.url || product.images[0]?.url || 'https://via.placeholder.com/250'}
                            alt={product.name}
                            sx={{
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.05)'
                                }
                            }}
                        />
                    </Link>

                    {/* Arrow controls - only if multiple images */}
                    {(product.images && product.images.length > 1) && (
                        <>
                            <IconButton
                                onClick={handlePrevImage}
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: 8,
                                    transform: 'translateY(-50%)',
                                    bgcolor: 'rgba(255,255,255,0.9)',
                                    '&:hover': { bgcolor: 'white' },
                                    boxShadow: 2,
                                    width: 32,
                                    height: 32
                                }}
                            >
                                <i className="fa fa-chevron-left" style={{ color: '#8B4513', fontSize: '0.9rem' }}></i>
                            </IconButton>
                            <IconButton
                                onClick={handleNextImage}
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    right: 8,
                                    transform: 'translateY(-50%)',
                                    bgcolor: 'rgba(255,255,255,0.9)',
                                    '&:hover': { bgcolor: 'white' },
                                    boxShadow: 2,
                                    width: 32,
                                    height: 32
                                }}
                            >
                                <i className="fa fa-chevron-right" style={{ color: '#8B4513', fontSize: '0.9rem' }}></i>
                            </IconButton>
                        </>
                    )}
                </div>

                {/* Product Info */}
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
                    <Link 
                        to={`/product/${product._id}`} 
                        style={{ textDecoration: 'none' }}
                    >
                        <Typography 
                            variant="h6" 
                            component="h3"
                            sx={{
                                fontWeight: 700,
                                mb: 1.5,
                                color: 'text.primary',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                '&:hover': {
                                    color: 'var(--secondary-color)'
                                }
                            }}
                        >
                            {product.name}
                        </Typography>
                    </Link>

                    {/* Rating */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <Rating 
                            value={product.ratings} 
                            precision={0.1} 
                            readOnly 
                            size="small"
                            sx={{ color: '#fdcc0d' }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                            {product.ratings.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            ({product.numOfReviews})
                        </Typography>
                    </Box>

                    {/* Price */}
                    <Typography 
                        variant="h5" 
                        component="div"
                        sx={{
                            fontWeight: 700,
                            color: 'var(--secondary-color)',
                            mb: 2
                        }}
                    >
                        ₱{product.price.toLocaleString()}
                    </Typography>

                    {/* Stock Status */}
                    <Box sx={{ mb: 2 }}>
                        {product.stock > 0 ? (
                            <Chip 
                                icon={<i className="fa fa-check-circle" style={{ fontSize: '0.9rem' }}></i>}
                                label={`In Stock (${product.stock})`}
                                size="small"
                                sx={{ 
                                    bgcolor: '#d4edda',
                                    color: '#155724',
                                    fontWeight: 600
                                }}
                            />
                        ) : (
                            <Chip 
                                icon={<i className="fa fa-times-circle" style={{ fontSize: '0.9rem' }}></i>}
                                label="Out of Stock"
                                size="small"
                                sx={{ 
                                    bgcolor: '#f8d7da',
                                    color: '#721c24',
                                    fontWeight: 600
                                }}
                            />
                        )}
                    </Box>

                    {/* View Details Button */}
                    <Button
                        component={Link}
                        to={`/product/${product._id}`}
                        variant="contained"
                        fullWidth
                        startIcon={<i className="fa fa-eye"></i>}
                        sx={{
                            mt: 'auto',
                            bgcolor: 'var(--secondary-color)',
                            borderRadius: '10px',
                            py: 1.5,
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '1rem',
                            '&:hover': {
                                bgcolor: 'var(--accent-color)',
                                transform: 'scale(1.02)'
                            }
                        }}
                    >
                        View Details
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [wishlist, setWishlist] = useState([]);
    const [searchOptions, setSearchOptions] = useState([]);
    const [searchValue, setSearchValue] = useState(null);
    const [price, setPrice] = useState([1, 10000]);
    const [category, setCategory] = useState('');
    const [rating, setRating] = useState([]); // Changed to array for multiple selection
    const observer = useRef();
    const navigate = useNavigate();
    const user = getUser();
    const { keyword } = useParams();

    const [categories, setCategories] = useState([]);

    // Fetch wishlist, categories, and search options on mount
    useEffect(() => {
        if (user) {
            fetchWishlist();
        }
        fetchCategories();
        fetchSearchOptions();
    }, [user]);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API}/categories`);
            setCategories(data.categories.map(cat => cat.name));
        } catch (error) {
            console.error('Error fetching categories');
        }
    };

    const fetchSearchOptions = async () => {
        try {
            // Fetch all products for autocomplete
            const { data } = await axios.get(`${import.meta.env.VITE_API}/products?page=1&limit=100`);
            
            // Create options array with product names and categories
            const productNames = data.products.map(p => ({ label: p.name, type: 'Product', value: p.name }));
            const uniqueCategories = [...new Set(data.products.map(p => p.category))]
                .map(cat => ({ label: cat, type: 'Category', value: cat }));
            
            setSearchOptions([...productNames, ...uniqueCategories]);
        } catch (error) {
            console.error('Error fetching search options');
        }
    };

    const fetchWishlist = async () => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            };
            const { data } = await axios.get(`${import.meta.env.VITE_API}/wishlist`, config);
            setWishlist(data.wishlist.map(item => item._id));
        } catch (error) {
            console.error('Error fetching wishlist');
        }
    };

    // Fetch products with filters and pagination
    const fetchProducts = useCallback(async (resetProducts = false) => {
        if (loading && !resetProducts) return;
        
        setLoading(true);
        try {
            let link = `${import.meta.env.VITE_API}/products?`;
            
            if (keyword) {
                link += `keyword=${keyword}&`;
            }
            
            link += `page=${resetProducts ? 1 : page}`;
            link += `&price[gte]=${price[0]}&price[lte]=${price[1]}`;
            
            if (category) {
                link += `&category=${category}`;
            }
            
            const { data } = await axios.get(link);
            
            let filteredProducts = data.products;
            
            // Filter by multiple ratings if selected
            if (rating.length > 0) {
                filteredProducts = filteredProducts.filter(product => {
                    const productRating = Math.floor(product.ratings);
                    return rating.includes(productRating);
                });
            }
            
            // Sort by rating (highest first)
            filteredProducts.sort((a, b) => b.ratings - a.ratings);
            
            if (filteredProducts.length === 0) {
                setHasMore(false);
            } else {
                if (resetProducts) {
                    setProducts(filteredProducts);
                    setPage(2);
                    setHasMore(true);
                } else {
                    setProducts(prev => [...prev, ...filteredProducts]);
                    setPage(prev => prev + 1);
                }
            }
        } catch (error) {
            toast.error('Error loading products');
        } finally {
            setLoading(false);
        }
    }, [page, loading, keyword, price, category, rating]);

    // Reset and fetch when filters change
    useEffect(() => {
        setProducts([]);
        setPage(1);
        setHasMore(true);
        fetchProducts(true);
    }, [keyword, price, category, rating]);

    // Infinite scroll observer
    const lastProductRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchProducts();
            }
        });
        
        if (node) observer.current.observe(node);
    }, [loading, hasMore, fetchProducts]);

    const handlePriceChange = (event, newValue) => {
        setPrice(newValue);
    };

    const handleCategoryClick = (selectedCategory) => {
        if (category === selectedCategory) {
            setCategory('');
        } else {
            setCategory(selectedCategory);
        }
    };

    const handleRatingClick = (selectedRating) => {
        if (rating.includes(selectedRating)) {
            // Remove rating if already selected
            setRating(rating.filter(r => r !== selectedRating));
        } else {
            // Add rating to selection
            setRating([...rating, selectedRating]);
        }
    };

    const handleSearchSelect = (event, value) => {
        if (value) {
            if (value.type === 'Product') {
                // Search by product name
                navigate(`/products/${value.value}`);
            } else if (value.type === 'Category') {
                // Filter by category
                setCategory(value.value);
                setProducts([]);
                setPage(1);
                setHasMore(true);
            }
        }
    };

    const toggleWishlist = async (productId, e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.info('Please login to add to wishlist');
            navigate('/login');
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            };

            const isInWishlist = wishlist.includes(productId);

            if (isInWishlist) {
                await axios.delete(`${import.meta.env.VITE_API}/wishlist/${productId}`, config);
                setWishlist(prev => prev.filter(id => id !== productId));
                toast.success('Removed from wishlist');
            } else {
                await axios.post(`${import.meta.env.VITE_API}/wishlist`, { productId }, config);
                setWishlist(prev => [...prev, productId]);
                toast.success('Added to wishlist! 🕯️');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating wishlist');
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<i key={i} className="fa fa-star" style={{ color: '#333' }}></i>);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<i key={i} className="fa fa-star-half-o" style={{ color: '#333' }}></i>);
            } else {
                stars.push(<i key={i} className="fa fa-star-o" style={{ color: '#333' }}></i>);
            }
        }
        return stars;
    };

    return (
        <Fragment>
            <MetaData title={'All Products'} />
            
            {/* Header Banner */}
            <div style={{
                background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                padding: '40px 0',
                marginBottom: '30px'
            }}>
                <div className="container">
                    <h1 style={{ color: '#333', fontWeight: 'bold', textAlign: 'center', margin: 0 }}>
                        <i className="fa fa-shopping-bag mr-2"></i>
                        {keyword ? `Search Results for "${keyword}"` : 'Browse Our Collection'}
                    </h1>
                    <p style={{ color: '#333', textAlign: 'center', marginTop: '10px', marginBottom: 0 }}>
                        Discover beautiful candles for every occasion
                    </p>
                </div>
            </div>

            <div className="container">
                {/* Horizontal Filters Section */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '15px',
                    padding: '25px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    marginBottom: '30px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h4 style={{ color: '#333', fontWeight: 'bold', margin: 0 }}>
                            <i className="fa fa-filter mr-2"></i>
                            Filters
                        </h4>
                        {(category || rating.length > 0 || price[0] !== 1 || price[1] !== 10000) && (
                            <button
                                onClick={() => {
                                    setPrice([1, 10000]);
                                    setCategory('');
                                    setRating([]);
                                }}
                                style={{
                                    padding: '8px 20px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    fontSize: '0.9rem'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
                            >
                                <i className="fa fa-times mr-2"></i>
                                Clear All
                            </button>
                        )}
                    </div>

                    <div className="row">
                        {/* Search Autocomplete */}
                        <div className="col-md-12 mb-3">
                            <h6 style={{ color: '#333', fontWeight: '600', marginBottom: '10px' }}>
                                <i className="fa fa-search mr-2"></i>
                                Search Products
                            </h6>
                                <Autocomplete
                                    options={searchOptions}
                                    groupBy={(option) => option.type}
                                    getOptionLabel={(option) => option.label}
                                    value={searchValue}
                                    onChange={handleSearchSelect}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Search by name or category..."
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '&:hover fieldset': {
                                                        borderColor: 'var(--secondary-color)',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: 'var(--secondary-color)',
                                                    },
                                                },
                                            }}
                                        />
                                    )}
                                    sx={{ width: '100%' }}
                                />
                        </div>

                        {/* Price Filter */}
                        <div className="col-md-4 mb-3">
                            <h6 style={{ color: '#333', fontWeight: '600', marginBottom: '10px' }}>
                                <i className="fa fa-dollar mr-2"></i>
                                Price Range
                            </h6>
                                <Box sx={{ px: 1 }}>
                                    <Slider
                                        value={price}
                                        onChange={handlePriceChange}
                                        valueLabelDisplay="on"
                                        min={1}
                                        max={10000}
                                        sx={{
                                            color: 'var(--primary-color)',
                                            '& .MuiSlider-thumb': {
                                                backgroundColor: 'var(--secondary-color)',
                                            },
                                            '& .MuiSlider-track': {
                                                backgroundColor: 'var(--secondary-color)',
                                            },
                                            '& .MuiSlider-rail': {
                                                backgroundColor: 'var(--warm-beige)',
                                            }
                                        }}
                                    />
                                </Box>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                    <span style={{ color: '#333', fontSize: '0.9rem', fontWeight: '600' }}>₱{price[0]}</span>
                                    <span style={{ color: '#333', fontSize: '0.9rem', fontWeight: '600' }}>₱{price[1]}</span>
                                </div>
                        </div>

                        {/* Category Filter */}
                        <div className="col-md-4 mb-3">
                            <h6 style={{ color: '#333', fontWeight: '600', marginBottom: '10px' }}>
                                <i className="fa fa-tags mr-2"></i>
                                Categories
                            </h6>
                            <Autocomplete
                                options={categories}
                                value={category || null}
                                onChange={(event, newValue) => {
                                    setCategory(newValue || '');
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Select category..."
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '&:hover fieldset': {
                                                    borderColor: 'var(--secondary-color)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'var(--secondary-color)',
                                                },
                                            },
                                        }}
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props} style={{ 
                                        padding: '10px 16px',
                                        '&:hover': {
                                            backgroundColor: '#f8f9fa'
                                        }
                                    }}>
                                        <i className="fa fa-tag mr-2" style={{ color: '#333' }}></i>
                                        {option}
                                    </li>
                                )}
                                sx={{ width: '100%' }}
                            />
                        </div>

                            {/* Ratings Filter */}
                            <div className="col-md-4 mb-3">
                                <h6 style={{ color: '#333', fontWeight: '600', marginBottom: '10px' }}>
                                    <i className="fa fa-star mr-2" style={{ color: '#333' }}></i>
                                    Rating
                                </h6>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {[5, 4, 3, 2, 1].map(star => {
                                            const isSelected = rating.includes(star);
                                            return (
                                            <button
                                                key={star}
                                                onClick={() => handleRatingClick(star)}
                                                style={{
                                                    padding: '8px 12px',
                                                    borderRadius: '20px',
                                                    border: isSelected ? '2px solid var(--secondary-color)' : '1px solid #e0e0e0',
                                                    backgroundColor: isSelected ? 'var(--secondary-color)' : 'white',
                                                    color: isSelected ? 'white' : '#666',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    transition: 'all 0.3s ease',
                                                    fontWeight: isSelected ? '600' : '400',
                                                    fontSize: '0.85rem'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!isSelected) {
                                                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!isSelected) {
                                                        e.currentTarget.style.backgroundColor = 'white';
                                                    }
                                                }}
                                            >
                                                {[...Array(star)].map((_, i) => (
                                                    <i key={i} className="fa fa-star" style={{ color: isSelected ? 'white' : 'var(--gold)', fontSize: '0.85rem' }}></i>
                                                ))}
                                            </button>
                                            );
                                        })}
                                </div>
                            </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div>
                    <div className="row">
                    {products.length === 0 && !loading ? (
                        <div className="col-12 text-center" style={{ padding: '60px 0' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🕯️</div>
                            <h3 style={{ color: '#333' }}>No products available yet</h3>
                            <p style={{ color: '#333' }}>Check back soon for beautiful candles!</p>
                        </div>
                    ) : (
                        products.map((product, index) => {
                            const isInWishlist = wishlist.includes(product._id);
                            const isLastProduct = products.length === index + 1;

                            return (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    isInWishlist={isInWishlist}
                                    isLastProduct={isLastProduct}
                                    lastProductRef={lastProductRef}
                                    toggleWishlist={toggleWishlist}
                                />
                            );
                        })
                    )}
                </div>

                {/* Loading Indicator */}
                {loading && (
                    <div className="text-center" style={{ padding: '40px 0' }}>
                        <div className="spinner-border" style={{ color: 'var(--secondary-color)', width: '3rem', height: '3rem' }} role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        <p style={{ color: 'var(--secondary-color)', marginTop: '15px', fontWeight: '500' }}>Loading more products...</p>
                    </div>
                )}

                {/* No More Products */}
                {!hasMore && products.length > 0 && (
                    <div className="text-center" style={{ padding: '40px 0' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🕯️</div>
                        <p style={{ color: '#666', fontWeight: '500' }}>You've reached the end of our collection!</p>
                    </div>
                )}
                    </div>
                </div>
        </Fragment>
    );
};

export default Products;
