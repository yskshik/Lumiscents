import React, { Fragment, useState, useEffect } from 'react';
import MetaData from './Layout/MetaData';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Card, CardContent, CardMedia, Typography, Button, Chip, Container, Grid, Box } from '@mui/material';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        getProducts();
        setIsVisible(true);
        
        // Add floating animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
            }
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            @keyframes shimmer {
                0% { background-position: -1000px 0; }
                100% { background-position: 1000px 0; }
            }
        `;
        document.head.appendChild(style);
        
        return () => document.head.removeChild(style);
    }, []);

    const getProducts = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API}/products`);
            setProducts(data.products);
            setLoading(false);
        } catch (error) {
            toast.error('Error loading products');
            setLoading(false);
        }
    };

    return (
        <Fragment>
            <MetaData title={'Home'} />
            
            {/* Hero Section */}
            <section className="lumiscents-hero" style={{
                background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 50%, var(--accent-color) 100%)',
                backgroundSize: '200% 200%',
                animation: 'gradientShift 15s ease infinite',
                padding: '100px 0',
                color: 'white',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="row align-items-center">
                        <div className="col-md-6 text-left" style={{
                            animation: isVisible ? 'fadeInUp 1s ease-out' : 'none'
                        }}>
                            <h1 className="lumiscents-hero-title" style={{ 
                                fontSize: '3.5rem', 
                                fontWeight: 'bold', 
                                marginBottom: '1rem',
                                color: 'var(--warm-white)',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.25)'
                            }}>
                                The Ultimate <span style={{ 
                                    color: '#ffd700',
                                    textShadow: '0 0 20px rgba(255,215,0,0.5)'
                                }}>Candle</span><br />
                                Shopping Destination
                            </h1>
                            <p className="lumiscents-hero-subtitle" style={{
                                color: 'var(--warm-white)',
                                opacity: 0.9,
                                fontSize: '1.05rem'
                            }}>
                                Delivering Aromatherapy to Your Door. Premium scented candles for every mood, 
                                handpicked with love and care.
                            </p>
                            
                            <div className="mt-4">
                                <Link to="/products" className="btn btn-lg lumiscents-btn">
                                    Shop Now →
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-6" style={{
                            animation: isVisible ? 'fadeInUp 1s ease-out 0.3s both' : 'none'
                        }}>
                            <div style={{
                                backgroundColor: 'rgba(255,255,255,0.15)',
                                borderRadius: '25px',
                                padding: '40px',
                                backdropFilter: 'blur(15px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                                transition: 'transform 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                <div style={{ 
                                    fontSize: '5rem', 
                                    marginBottom: '20px',
                                    animation: 'pulse 3s ease-in-out infinite'
                                }}>🕯️</div>
                                <h3 style={{ marginBottom: '15px' }}>Welcome to Lumiscents</h3>
                                <p style={{ color: 'var(--text-light)' }}>Your premium candle shopping destination</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            
            {/* Featured Products */}
            <section style={{ 
                padding: '80px 0',
                background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)'
            }}>
                <div className="container">
                    <div className="text-center mb-5" style={{
                        animation: isVisible ? 'fadeInUp 1s ease-out 1s both' : 'none'
                    }}>
                        <h2 style={{ 
                            color: '#8b4513', 
                            fontSize: '2.8rem', 
                            fontWeight: 'bold',
                            marginBottom: '10px'
                        }}>
                            Top Seller <span style={{ 
                                background: 'linear-gradient(135deg, #8b4513 0%, #d2691e 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>Candles</span>
                        </h2>
                        <p style={{ color: '#666', fontSize: '1.1rem' }}>Handpicked bestsellers loved by our customers</p>
                    </div>
                    <div className="row">
                        {loading ? (
                            <div className="col-12 text-center">
                                <div className="loader"></div>
                            </div>
                        ) : products.length > 0 ? (
                            products.slice(0, 4).map(product => (
                                <div key={product._id} className="col-sm-12 col-md-6 col-lg-3 my-3">
                                    <div className="card p-3 rounded" style={{ 
                                        border: '2px solid #f5deb3',
                                        borderRadius: '20px',
                                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        animation: isVisible ? 'fadeInUp 1s ease-out 1.2s both' : 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-10px) scale(1.03)';
                                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(139, 69, 19, 0.3)';
                                        e.currentTarget.style.borderColor = '#8b4513';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.borderColor = '#f5deb3';
                                    }}
                                    >
                                        <img
                                            className="card-img-top mx-auto"
                                            src={product.images[0]?.url || 'https://via.placeholder.com/200'}
                                            alt={product.name}
                                        />
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title">
                                                <Link to={`/product/${product._id}`}>{product.name}</Link>
                                            </h5>
                                            <div className="ratings mt-auto">
                                                <div className="rating-outer">
                                                    <div className="rating-inner" style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
                                                </div>
                                                <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>
                                            </div>
                                            <p className="card-text" style={{ color: '#8b4513', fontWeight: 'bold' }}>
                                                ${product.price}
                                            </p>
                                            <Link to={`/product/${product._id}`} id="view_btn" className="btn btn-block">
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center">
                                <p>No candles available yet. Check back soon for beautiful candles! 🕯️</p>
                            </div>
                        )}
                    </div>
                    {products.length > 4 && (
                        <div className="text-center mt-4">
                            <Link to="/products" className="btn btn-lg" style={{
                                backgroundColor: '#8b4513',
                                color: 'white',
                                padding: '12px 40px',
                                borderRadius: '50px',
                                fontWeight: 'bold',
                                border: 'none'
                            }}>
                                View All Candles
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Premium Features */}
            <section style={{ 
                padding: '80px 0', 
                background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 50%, var(--accent-color) 100%)',
                backgroundSize: '200% 200%',
                animation: 'gradientShift 15s ease infinite',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="container">
                    <div className="text-center mb-5" style={{
                        animation: isVisible ? 'fadeInUp 1s ease-out' : 'none'
                    }}>
                        <h2 style={{ 
                            fontSize: '2.8rem', 
                            fontWeight: 'bold',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                            marginBottom: '10px'
                        }}>
                            Why Choose Lumiscents
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-light)' }}>Experience the difference with our premium candle collection</p>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-md-6 col-lg-4 text-center mb-4" style={{
                            animation: isVisible ? `fadeInUp 1s ease-out 1.6s both` : 'none'
                        }}>
                            <div style={{ 
                                backgroundColor: 'rgba(255,255,255,0.15)',
                                borderRadius: '25px',
                                padding: '40px 30px',
                                backdropFilter: 'blur(15px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                            }}>
                                <div style={{ 
                                    fontSize: '4rem', 
                                    marginBottom: '20px',
                                    animation: 'pulse 3s ease-in-out infinite'
                                }}>🕯️</div>
                                <h3 style={{ marginBottom: '15px', color: 'white', fontWeight: 'bold' }}>Premium Candles</h3>
                                <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>Handcrafted with the finest ingredients and essential oils</p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4 text-center mb-4" style={{
                            animation: isVisible ? `fadeInUp 1s ease-out 1.8s both` : 'none'
                        }}>
                            <div style={{ 
                                backgroundColor: 'rgba(255,255,255,0.15)',
                                borderRadius: '25px',
                                padding: '40px 30px',
                                backdropFilter: 'blur(15px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                            }}>
                                <div style={{ 
                                    fontSize: '4rem', 
                                    marginBottom: '20px',
                                    animation: 'pulse 3s ease-in-out infinite'
                                }}>💯</div>
                                <h3 style={{ marginBottom: '15px', color: 'white', fontWeight: 'bold' }}>Quality Guaranteed</h3>
                                <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>100% satisfaction guaranteed or your money back</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    );
};

export default Home;
