import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MetaData from '../Layout/MetaData';
import Loader from '../Layout/Loader';
import Sidebar from './Sidebar';
import axios from 'axios';
import { getToken } from '../../Utils/helpers';
import { toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [productSales, setProductSales] = useState([]);
    const [monthlySales, setMonthlySales] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filteredAmount, setFilteredAmount] = useState(0);
    const [filteredMonthlySales, setFilteredMonthlySales] = useState([]);
    const [showPDFModal, setShowPDFModal] = useState(false);
    const [pdfFields, setPdfFields] = useState({
        summary: true,
        products: true,
        monthly: true,
        orders: true
    });

    const COLORS = ['#8B4513', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#85C1E2'];

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        getDashboardData();
    }, []);

    useEffect(() => {
        if (startDate && endDate) {
            filterDataByDateRange();
        } else {
            setFilteredOrders(orders);
            setFilteredAmount(totalAmount);
        }
    }, [startDate, endDate, orders, totalAmount]);

    const getDashboardData = async () => {
        const config = {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        };

        try {
            const [productsRes, ordersRes, usersRes, salesRes, monthlySalesRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API}/admin/products`, config),
                axios.get(`${import.meta.env.VITE_API}/admin/orders`, config),
                axios.get(`${import.meta.env.VITE_API}/admin/users`, config),
                axios.get(`${import.meta.env.VITE_API}/admin/product-sales`, config),
                axios.get(`${import.meta.env.VITE_API}/admin/sales-per-month`, config)
            ]);

            setProducts(productsRes.data.products);
            setOrders(ordersRes.data.orders);
            setUsers(usersRes.data.users);
            setTotalAmount(ordersRes.data.totalAmount);
            setProductSales(salesRes.data.totalPercentage || []);
            setMonthlySales(monthlySalesRes.data.salesPerMonth || []);
            setLoading(false);
        } catch (error) {
            toast.error('Error loading dashboard data');
            setLoading(false);
        }
    };

    const filterDataByDateRange = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include the entire end date

        // Filter orders
        const filtered = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= start && orderDate <= end;
        });

        const amount = filtered.reduce((acc, order) => acc + order.totalPrice, 0);
        setFilteredOrders(filtered);
        setFilteredAmount(amount);

        // Filter monthly sales data
        const filtered_monthly = monthlySales.filter(item => {
            // Parse month string like "October 2024" or "Oct-2024"
            const monthYear = item.month.toLowerCase();
            const startMonth = start.toLocaleString('default', { month: 'long', year: 'numeric' }).toLowerCase();
            const endMonth = end.toLocaleString('default', { month: 'long', year: 'numeric' }).toLowerCase();
            
            // Check if month is within range
            const itemDate = new Date(`${item.month} 1`);
            return itemDate >= start && itemDate <= end;
        });

        setFilteredMonthlySales(filtered_monthly);
    };

    const generatePDF = async () => {
        try {
            const doc = new jsPDF('p', 'mm', 'a4');
            let finalY = 20;
            const pageHeight = doc.internal.pageSize.height;
            const margin = 14;
            const lineHeight = 7;
            
            // Helper function to add a simple table
            const addTable = (title, headers, rows) => {
                if (finalY > pageHeight - 40) {
                    doc.addPage();
                    finalY = 20;
                }
                
                doc.setFontSize(12);
                doc.setTextColor(0);
                doc.text(title, margin, finalY);
                finalY += 8;
                
                // Draw header
                doc.setFillColor(139, 69, 19); // Brown color instead of purple
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(10);
                
                const colWidths = headers.map(() => (210 - 2 * margin) / headers.length);
                let xPos = margin;
                
                headers.forEach((header, i) => {
                    doc.rect(xPos, finalY - 5, colWidths[i], 7, 'F');
                    doc.text(header, xPos + 2, finalY, { maxWidth: colWidths[i] - 4 });
                    xPos += colWidths[i];
                });
                
                finalY += 5;
                
                // Draw rows
                doc.setTextColor(0);
                doc.setFontSize(9);
                rows.forEach(row => {
                    if (finalY > pageHeight - 20) {
                        doc.addPage();
                        finalY = 20;
                    }
                    
                    xPos = margin;
                    row.forEach((cell, i) => {
                        doc.text(cell, xPos + 2, finalY, { maxWidth: colWidths[i] - 4 });
                        xPos += colWidths[i];
                    });
                    finalY += 6;
                });
                
                finalY += 10;
            };
            
            // Helper function to add chart image
            const addChartImage = async (elementId, title) => {
                try {
                    const chartElement = document.getElementById(elementId);
                    if (chartElement) {
                        const canvas = await html2canvas(chartElement, {
                            backgroundColor: '#ffffff',
                            scale: 2
                        });
                        const imgData = canvas.toDataURL('image/png');
                        
                        if (finalY > pageHeight - 80) {
                            doc.addPage();
                            finalY = 20;
                        }
                        
                        doc.setFontSize(12);
                        doc.setTextColor(0);
                        doc.text(title, margin, finalY);
                        finalY += 10;
                        
                        // Add image with proper dimensions
                        const imgWidth = 180;
                        const imgHeight = (canvas.height * imgWidth) / canvas.width;
                        doc.addImage(imgData, 'PNG', margin, finalY, imgWidth, Math.min(imgHeight, 60));
                        finalY += Math.min(imgHeight, 60) + 15;
                    }
                } catch (error) {
                    console.error(`Error capturing ${title}:`, error);
                }
            };
            
            // Add title
            doc.setFontSize(18);
            doc.setTextColor(139, 69, 19);
            doc.text('LumiScents - Dashboard Report', margin, finalY);
            finalY += 15;
            
            // Add date range if applicable
            if (startDate && endDate) {
                doc.setFontSize(10);
                doc.setTextColor(100);
                doc.text(`Period: ${startDate} to ${endDate}`, margin, finalY);
                finalY += 10;
            }
            
            // Add summary statistics
            if (pdfFields.summary) {
                const summaryRows = [
                    ['Total Sales', `$${(startDate && endDate ? filteredAmount : totalAmount).toFixed(2)}`],
                    ['Total Orders', `${startDate && endDate ? filteredOrders.length : orders.length}`],
                    ['Total Products', `${products.length}`],
                    ['Total Users', `${users.length}`],
                    ['Out of Stock', `${outOfStock}`]
                ];
                addTable('Summary Statistics', ['Metric', 'Value'], summaryRows);
            }
            
            // Add charts first
            if (pdfFields.monthly) {
                await addChartImage('line-chart-container', 'Monthly Sales Chart');
            }
            
            if (pdfFields.products) {
                await addChartImage('pie-chart-container', 'Product Sales Chart');
            }
            
            // Add product sales table
            if (pdfFields.products && productSales.length > 0) {
                const productRows = productSales.map(item => [
                    item.name.substring(0, 25),
                    `${item.percent.toFixed(2)}%`
                ]);
                addTable('Product Sales', ['Product', 'Sales %'], productRows);
            }
            
            // Add monthly sales table
            if (pdfFields.monthly) {
                const monthlyToShow = startDate && endDate ? filteredMonthlySales : monthlySales;
                if (monthlyToShow.length > 0) {
                    const monthlyRows = monthlyToShow.map(item => [
                        item.month,
                        `$${item.total.toFixed(2)}`
                    ]);
                    addTable('Monthly Sales', ['Month', 'Sales'], monthlyRows);
                }
            }
            
            // Add orders
            if (pdfFields.orders) {
                const ordersToShow = startDate && endDate ? filteredOrders : orders.slice(0, 15);
                if (ordersToShow.length > 0) {
                    const ordersRows = ordersToShow.map(order => [
                        order._id.substring(0, 8),
                        new Date(order.createdAt).toLocaleDateString(),
                        `$${order.totalPrice.toFixed(2)}`,
                        order.orderStatus
                    ]);
                    addTable('Recent Orders', ['Order ID', 'Date', 'Amount', 'Status'], ordersRows);
                }
            }
            
            // Save PDF
            const filename = startDate && endDate 
                ? `dashboard-report-${startDate}-to-${endDate}.pdf`
                : `dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(filename);
            
            toast.success('PDF report downloaded successfully!');
            setShowPDFModal(false);
        } catch (error) {
            console.error('PDF generation error:', error);
            toast.error('Error generating PDF');
        }
    };

    // Function to download LineChart as image
    const downloadLineChart = async () => {
        try {
            const chartElement = document.getElementById('line-chart-container');
            if (chartElement) {
                const canvas = await html2canvas(chartElement);
                const link = document.createElement('a');
                link.download = `monthly-sales-chart-${new Date().toISOString().split('T')[0]}.png`;
                link.href = canvas.toDataURL();
                link.click();
                toast.success('Monthly sales chart downloaded successfully!');
            }
        } catch (error) {
            console.error('Chart download error:', error);
            toast.error('Error downloading chart');
        }
    };

    // Function to download PieChart as image
    const downloadPieChart = async () => {
        try {
            const chartElement = document.getElementById('pie-chart-container');
            if (chartElement) {
                const canvas = await html2canvas(chartElement);
                const link = document.createElement('a');
                link.download = `product-sales-chart-${new Date().toISOString().split('T')[0]}.png`;
                link.href = canvas.toDataURL();
                link.click();
                toast.success('Product sales chart downloaded successfully!');
            }
        } catch (error) {
            console.error('Chart download error:', error);
            toast.error('Error downloading chart');
        }
    };

    let outOfStock = 0;
    products.forEach(product => {
        if (product.stock === 0) {
            outOfStock += 1;
        }
    });

    return (
        <Fragment>
            <MetaData title={'Admin Dashboard'} />
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            
            <div style={{
                marginLeft: sidebarOpen ? '250px' : '0',
                transition: 'margin-left 0.3s ease',
                padding: '20px',
                minHeight: '100vh',
                backgroundColor: 'var(--warm-white)',
                color: 'var(--text-dark)'
            }}
            className="brown-theme-override">
                    <MetaData title={'Admin Dashboard'} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h1 style={{ color: '#333', margin: 0 }}>Dashboard</h1>
                        <button
                            onClick={() => setShowPDFModal(true)}
                            style={{
                                padding: '12px 24px',
                                background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 4px 6px rgba(139, 69, 19, 0.3)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            <i className="fa fa-download mr-2"></i>
                            Export PDF Report
                        </button>
                    </div>

                    {/* Date Range Filter */}
                    <div className="row pr-4 mb-4">
                        <div className="col-12">
                            <div className="card" style={{ 
                                borderRadius: '15px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                border: '1px solid var(--border-light)',
                                padding: '20px'
                            }}>
                                <h5 style={{ color: '#333', marginBottom: '15px' }}>
                                    <i className="fa fa-calendar mr-2"></i>
                                    Filter by Date Range
                                </h5>
                                <div className="row">
                                    <div className="col-md-4">
                                        <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            style={{
                                                padding: '10px',
                                                borderRadius: '8px',
                                                border: '2px solid var(--border-light)'
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            style={{
                                                padding: '10px',
                                                borderRadius: '8px',
                                                border: '2px solid var(--border-light)'
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-4" style={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <button
                                            onClick={() => {
                                                setStartDate('');
                                                setEndDate('');
                                            }}
                                            style={{
                                                padding: '10px 20px',
                                                background: 'var(--warm-beige)',
                                                color: '#333',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                width: '100%'
                                            }}
                                        >
                                            <i className="fa fa-times mr-2"></i>
                                            Clear Filter
                                        </button>
                                    </div>
                                </div>
                                {startDate && endDate && (
                                    <div style={{ marginTop: '15px', padding: '10px', background: 'var(--cream-color)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                                        <i className="fa fa-info-circle mr-2" style={{ color: '#333' }}></i>
                                        <span style={{ color: '#333', fontWeight: '600' }}>
                                            Showing data from {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {loading ? <Loader /> : (
                        <>
                            {/* Stats Cards */}
                            <div className="row pr-4">
                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white o-hidden h-100" style={{ 
                                        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                                        borderRadius: '15px',
                                        boxShadow: '0 4px 6px rgba(139, 69, 19, 0.3)',
                                        color: 'white !important'
                                    }}>
                                        <div className="card-body" style={{ color: 'white !important' }}>
                                            <div className="text-center card-font-size">
                                                Total Sales<br /> 
                                                <b>${(startDate && endDate ? filteredAmount : totalAmount).toFixed(2)}</b>
                                                {startDate && endDate && (
                                                    <div style={{ fontSize: '0.75rem', marginTop: '5px', opacity: 0.9 }}>
                                                        (Filtered)
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white o-hidden h-100" style={{ 
                                        background: 'linear-gradient(135deg, #A0522D 0%, #8B4513 100%)',
                                        borderRadius: '15px',
                                        boxShadow: '0 4px 6px rgba(160, 82, 45, 0.3)'
                                    }}>
                                        <div className="card-body" style={{ color: 'white !important' }}>
                                            <div className="text-center card-font-size">
                                                Orders<br /> 
                                                <b>{startDate && endDate ? filteredOrders.length : (orders && orders.length)}</b>
                                                {startDate && endDate && (
                                                    <div style={{ fontSize: '0.75rem', marginTop: '5px', opacity: 0.9 }}>
                                                        (Filtered)
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <Link className="card-footer text-white clearfix small z-1" to="/admin/orders">
                                            <span className="float-left">View Details</span>
                                            <span className="float-right">
                                                <i className="fa fa-angle-right"></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>

                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white o-hidden h-100" style={{ 
                                        background: 'linear-gradient(135deg, #D2691E 0%, #A0522D 100%)',
                                        borderRadius: '15px',
                                        boxShadow: '0 4px 6px rgba(210, 105, 30, 0.3)'
                                    }}>
                                        <div className="card-body" style={{ color: 'white !important' }}>
                                            <div className="text-center card-font-size">
                                                Products<br /> 
                                                <b>{products && products.length}</b>
                                            </div>
                                        </div>
                                        <Link className="card-footer text-white clearfix small z-1" to="/admin/products">
                                            <span className="float-left">View Details</span>
                                            <span className="float-right">
                                                <i className="fa fa-angle-right"></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>

                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white o-hidden h-100" style={{ 
                                        background: 'linear-gradient(135deg, #FFB347 0%, #D2691E 100%)',
                                        borderRadius: '15px',
                                        boxShadow: '0 4px 6px rgba(255, 179, 71, 0.3)'
                                    }}>
                                        <div className="card-body" style={{ color: 'white !important' }}>
                                            <div className="text-center card-font-size">
                                                Users<br /> 
                                                <b>{users && users.length}</b>
                                            </div>
                                        </div>
                                        <Link className="card-footer text-white clearfix small z-1" to="/admin/users">
                                            <span className="float-left">View Details</span>
                                            <span className="float-right">
                                                <i className="fa fa-angle-right"></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Charts Section */}
                            <div className="row pr-4">
                                {/* Monthly Sales Chart */}
                                <div className="col-xl-8 col-sm-12 mb-3">
                                    <div className="card" style={{ 
                                        borderRadius: '15px',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                        border: '1px solid var(--border-light)',
                                        backgroundColor: 'var(--warm-white)'
                                    }}>
                                        <div className="card-body">
                                            <h4 className="mb-3" style={{ color: '#333' }}>
                                                📈 Monthly Sales
                                                <button 
                                                    onClick={downloadLineChart}
                                                    className="btn btn-sm ml-2"
                                                    style={{
                                                        backgroundColor: '#8B4513',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '5px',
                                                        padding: '5px 10px',
                                                        fontSize: '0.8rem'
                                                    }}
                                                    title="Download chart as image"
                                                >
                                                    <i className="fa fa-download"></i>
                                                </button>
                                            </h4>
                                            {(startDate && endDate ? filteredMonthlySales : monthlySales).length > 0 ? (
                                                <div id="line-chart-container">
                                                    <ResponsiveContainer width="100%" height={300}>
                                                        <LineChart data={startDate && endDate ? filteredMonthlySales : monthlySales}>
                                                            <CartesianGrid 
                                                                strokeDasharray="3 3" 
                                                                stroke="var(--border-light)"
                                                            />
                                                            <XAxis 
                                                                dataKey="month" 
                                                                stroke="var(--text-light)"
                                                            />
                                                            <YAxis 
                                                                stroke="var(--text-light)"
                                                            />
                                                            <Tooltip 
                                                                contentStyle={{
                                                                    backgroundColor: 'var(--warm-white)',
                                                                    border: '1px solid var(--border-light)',
                                                                    color: '#333'
                                                                }}
                                                            />
                                                            <Legend 
                                                                wrapperStyle={{
                                                                    color: '#333'
                                                                }}
                                                            />
                                                            <Line 
                                                                type="monotone" 
                                                                dataKey="sales" 
                                                                stroke="#FF6B6B" 
                                                                strokeWidth={3}
                                                                name="Sales ($)"
                                                            />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            ) : (
                                                <p className="text-center">No sales data available yet</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Product Sales Pie Chart */}
                                <div className="col-xl-4 col-sm-12 mb-3">
                                    <div className="card" style={{ 
                                        borderRadius: '15px',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                        border: '1px solid var(--border-light)',
                                        backgroundColor: 'var(--warm-white)'
                                    }}>
                                        <div className="card-body">
                                            <h4 className="mb-3" style={{ color: '#333' }}>
                                                🕯️ Product Sales
                                                <button 
                                                    onClick={downloadPieChart}
                                                    className="btn btn-sm ml-2"
                                                    style={{
                                                        backgroundColor: '#8B4513',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '5px',
                                                        padding: '5px 10px',
                                                        fontSize: '0.8rem'
                                                    }}
                                                    title="Download chart as image"
                                                >
                                                    <i className="fa fa-download"></i>
                                                </button>
                                            </h4>
                                            {productSales.length > 0 ? (
                                                <div id="pie-chart-container">
                                                    <ResponsiveContainer width="100%" height={300}>
                                                        <PieChart>
                                                            <Pie
                                                                data={productSales}
                                                                cx="50%"
                                                                cy="50%"
                                                                labelLine={false}
                                                                label={({ name, percent }) => `${name}: ${percent}%`}
                                                                outerRadius={80}
                                                                fill="#8B4513"
                                                                dataKey="percent"
                                                            >
                                                                {productSales.map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                                ))}
                                                            </Pie>
                                                            <Tooltip 
                                                                contentStyle={{
                                                                    backgroundColor: 'var(--warm-white)',
                                                                    border: '1px solid var(--border-light)',
                                                                    color: '#333'
                                                                }}
                                                            />
                                                            <Legend 
                                                                wrapperStyle={{
                                                                    border: '1px solid var(--border-light)',
                                                                    color: '#333'
                                                                }}
                                                            />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            ) : (
                                                <p className="text-center">No product sales data yet</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="row pr-4">
                                <div className="col-12">
                                    <div className="card" style={{ 
                                        borderRadius: '15px',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                        border: '1px solid var(--border-light)',
                                        backgroundColor: 'var(--warm-white)'
                                    }}>
                                        <div className="card-body">
                                            <h4 style={{ color: '#333' }}>📊 Quick Stats</h4>
                                            <div className="row mt-3">
                                                <div className="col-md-4">
                                                    <div style={{ 
                                                        backgroundColor: 'var(--warm-beige)', 
                                                        padding: '20px', 
                                                        borderRadius: '10px',
                                                        textAlign: 'center'
                                                    }}>
                                                        <h5 style={{ color: '#333' }}>Out of Stock</h5>
                                                        <h2 style={{ color: '#D2691E', fontWeight: 'bold' }}>{outOfStock}</h2>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div style={{ 
                                                        backgroundColor: 'var(--warm-beige)', 
                                                        padding: '20px', 
                                                        borderRadius: '10px',
                                                        textAlign: 'center'
                                                    }}>
                                                        <h5 style={{ color: '#333' }}>In Stock</h5>
                                                        <h2 style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>
                                                            {products.length - outOfStock}
                                                        </h2>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div style={{ 
                                                        backgroundColor: 'var(--warm-beige)', 
                                                        padding: '20px', 
                                                        borderRadius: '10px',
                                                        textAlign: 'center'
                                                    }}>
                                                        <h5 style={{ color: '#333' }}>Avg Order Value</h5>
                                                        <h2 style={{ color: '#333', fontWeight: 'bold' }}>
                                                            ${orders.length > 0 ? (totalAmount / orders.length).toFixed(2) : '0.00'}
                                                        </h2>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* PDF Export Modal */}
                    {showPDFModal && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(139, 69, 19, 0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(253, 248, 241, 0.98) 100%)',
                                borderRadius: '15px',
                                padding: '30px',
                                maxWidth: '500px',
                                width: '90%',
                                boxShadow: '0 10px 40px rgba(139, 69, 19, 0.2)'
                            }}>
                                <h3 style={{ color: '#333', marginBottom: '20px' }}>
                                    <i className="fa fa-cog mr-2"></i>
                                    PDF Report Configuration
                                </h3>

                                <div style={{ marginBottom: '20px' }}>
                                    <p style={{ fontWeight: '600', marginBottom: '15px', color: '#333' }}>
                                        Select fields to include in the report:
                                    </p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={pdfFields.summary}
                                                onChange={(e) => setPdfFields({ ...pdfFields, summary: e.target.checked })}
                                                style={{ marginRight: '10px', width: '18px', height: '18px', cursor: 'pointer' }}
                                            />
                                            <span style={{ fontWeight: '500' }}>Summary Statistics</span>
                                        </label>

                                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={pdfFields.products}
                                                onChange={(e) => setPdfFields({ ...pdfFields, products: e.target.checked })}
                                                style={{ marginRight: '10px', width: '18px', height: '18px', cursor: 'pointer' }}
                                            />
                                            <span style={{ fontWeight: '500' }}>Product Sales</span>
                                        </label>

                                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={pdfFields.monthly}
                                                onChange={(e) => setPdfFields({ ...pdfFields, monthly: e.target.checked })}
                                                style={{ marginRight: '10px', width: '18px', height: '18px', cursor: 'pointer' }}
                                            />
                                            <span style={{ fontWeight: '500' }}>Monthly Sales</span>
                                        </label>

                                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={pdfFields.orders}
                                                onChange={(e) => setPdfFields({ ...pdfFields, orders: e.target.checked })}
                                                style={{ marginRight: '10px', width: '18px', height: '18px', cursor: 'pointer' }}
                                            />
                                            <span style={{ fontWeight: '500' }}>Orders</span>
                                        </label>
                                    </div>
                                </div>

                                {startDate && endDate && (
                                    <div style={{
                                        background: 'var(--cream-color)',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: '8px',
                                        padding: '12px',
                                        marginBottom: '20px'
                                    }}>
                                        <p style={{ margin: 0, color: '#333', fontSize: '0.9rem' }}>
                                            <i className="fa fa-info-circle mr-2"></i>
                                            Report will include data from {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={generatePDF}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                                        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                                    >
                                        <i className="fa fa-download mr-2"></i>
                                        Download PDF
                                    </button>

                                    <button
                                        onClick={() => setShowPDFModal(false)}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            background: 'var(--warm-beige)',
                                            color: 'var(--primary-color)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseOver={(e) => e.target.style.background = 'var(--cream-color)'}
                                        onMouseOut={(e) => e.target.style.background = 'var(--warm-beige)'}
                                    >
                                        <i className="fa fa-times mr-2"></i>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
            </div>
        </Fragment>
    );
};

export default Dashboard;
