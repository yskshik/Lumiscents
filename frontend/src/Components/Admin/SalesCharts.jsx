import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';

const SalesCharts = () => {
    const [monthlySales, setMonthlySales] = useState([]);
    const [dateRangeSales, setDateRangeSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRangeLoading, setDateRangeLoading] = useState(false);
    const [chartType, setChartType] = useState('line');
    const [dateRange, setDateRange] = useState({
        startDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD')
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchMonthlySales();
        fetchDateRangeSales();
    }, []);

    const fetchMonthlySales = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${import.meta.env.VITE_API}/admin/sales/monthly`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                // Process data to include all 12 months
                const monthNames = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];

                const processedData = monthNames.map((month, index) => {
                    const monthData = data.monthlySales.find(item => item._id.month === index + 1);
                    return {
                        month: month,
                        monthShort: month.substring(0, 3),
                        totalSales: monthData ? monthData.totalSales : 0,
                        totalOrders: monthData ? monthData.totalOrders : 0,
                        monthNumber: index + 1
                    };
                });

                setMonthlySales(processedData);
            }
        } catch (error) {
            console.error('Error fetching monthly sales:', error);
            toast.error('Failed to load monthly sales data');
        } finally {
            setLoading(false);
        }
    };

    const fetchDateRangeSales = async () => {
        try {
            setDateRangeLoading(true);
            const { data } = await axios.get(
                `${import.meta.env.VITE_API}/admin/sales/daterange?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                const processedData = data.salesData.map(item => ({
                    date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
                    displayDate: moment(`${item._id.year}-${item._id.month}-${item._id.day}`).format('MMM DD'),
                    totalSales: item.totalSales,
                    totalOrders: item.totalOrders
                })).sort((a, b) => new Date(a.date) - new Date(b.date));

                setDateRangeSales(processedData);
            }
        } catch (error) {
            console.error('Error fetching date range sales:', error);
            toast.error('Failed to load date range sales data');
        } finally {
            setDateRangeLoading(false);
        }
    };

    const handleDateRangeChange = (field, value) => {
        setDateRange(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const applyDateRangeFilter = () => {
        fetchDateRangeSales();
    };

    const formatCurrency = (value) => {
        return `₱${value.toLocaleString()}`;
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip p-3 bg-white border rounded shadow">
                    <p className="fw-bold mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="mb-1" style={{ color: entry.color }}>
                            {entry.dataKey === 'totalSales' ? 'Sales: ' : 'Orders: '}
                            {entry.dataKey === 'totalSales' ? formatCurrency(entry.value) : entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const totalMonthlySales = monthlySales.reduce((sum, item) => sum + item.totalSales, 0);
    const totalMonthlyOrders = monthlySales.reduce((sum, item) => sum + item.totalOrders, 0);
    const totalDateRangeSales = dateRangeSales.reduce((sum, item) => sum + item.totalSales, 0);
    const totalDateRangeOrders = dateRangeSales.reduce((sum, item) => sum + item.totalOrders, 0);

    return (
        <Container fluid className="py-4">
            <Row>
                <Col>
                    <Card className="shadow-sm mb-4">
                        <Card.Header className="bg-primary text-white">
                            <h4 className="mb-0">
                                <i className="fas fa-chart-line me-2"></i>
                                Sales Analytics Dashboard
                            </h4>
                        </Card.Header>
                        <Card.Body>
                            {/* Monthly Sales Chart */}
                            <Row className="mb-5">
                                <Col>
                                    <Card className="border-0 shadow-sm">
                                        <Card.Header className="bg-success text-white">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h5 className="mb-0">
                                                    <i className="fas fa-calendar-alt me-2"></i>
                                                    Monthly Sales Overview (All Months)
                                                </h5>
                                                <div>
                                                    <Badge bg="light" text="dark" className="me-2">
                                                        Total Sales: {formatCurrency(totalMonthlySales)}
                                                    </Badge>
                                                    <Badge bg="light" text="dark">
                                                        Total Orders: {totalMonthlyOrders}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </Card.Header>
                                        <Card.Body>
                                            {loading ? (
                                                <div className="text-center py-5">
                                                    <div className="elegant-spinner"></div>
                                                    <p className="mt-3 text-muted">Loading monthly sales data...</p>
                                                </div>
                                            ) : (
                                                <ResponsiveContainer width="100%" height={400}>
                                                    <LineChart data={monthlySales} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                        <XAxis 
                                                            dataKey="monthShort" 
                                                            stroke="#666"
                                                            fontSize={12}
                                                        />
                                                        <YAxis 
                                                            stroke="#666"
                                                            fontSize={12}
                                                            tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                                                        />
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend />
                                                        <Line 
                                                            type="monotone" 
                                                            dataKey="totalSales" 
                                                            stroke="var(--primary-color)"
                                                            strokeWidth={3}
                                                            dot={{ fill: 'var(--primary-color)', strokeWidth: 2, r: 6 }}
                                                            activeDot={{ r: 8, stroke: 'var(--primary-color)', strokeWidth: 2 }}
                                                            name="Sales (₱)"
                                                        />
                                                        <Line 
                                                            type="monotone" 
                                                            dataKey="totalOrders" 
                                                            stroke="var(--accent-color)"
                                                            strokeWidth={2}
                                                            dot={{ fill: 'var(--accent-color)', strokeWidth: 2, r: 4 }}
                                                            name="Orders"
                                                            yAxisId="right"
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            {/* Date Range Sales Chart */}
                            <Row>
                                <Col>
                                    <Card className="border-0 shadow-sm">
                                        <Card.Header className="bg-info text-white">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h5 className="mb-0">
                                                    <i className="fas fa-chart-bar me-2"></i>
                                                    Sales by Date Range
                                                </h5>
                                                <div>
                                                    <Badge bg="light" text="dark" className="me-2">
                                                        Total Sales: {formatCurrency(totalDateRangeSales)}
                                                    </Badge>
                                                    <Badge bg="light" text="dark">
                                                        Total Orders: {totalDateRangeOrders}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </Card.Header>
                                        <Card.Body>
                                            {/* Date Range Filter */}
                                            <Row className="mb-4">
                                                <Col md={3}>
                                                    <Form.Group>
                                                        <Form.Label>Start Date</Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            value={dateRange.startDate}
                                                            onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={3}>
                                                    <Form.Group>
                                                        <Form.Label>End Date</Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            value={dateRange.endDate}
                                                            onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={3}>
                                                    <Form.Group>
                                                        <Form.Label>Chart Type</Form.Label>
                                                        <Form.Select
                                                            value={chartType}
                                                            onChange={(e) => setChartType(e.target.value)}
                                                        >
                                                            <option value="line">Line Chart</option>
                                                            <option value="bar">Bar Chart</option>
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={3} className="d-flex align-items-end">
                                                    <Button
                                                        onClick={applyDateRangeFilter}
                                                        disabled={dateRangeLoading}
                                                        className="w-100"
                                                    >
                                                        {dateRangeLoading ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                                Loading...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fas fa-search me-2"></i>
                                                                Apply Filter
                                                            </>
                                                        )}
                                                    </Button>
                                                </Col>
                                            </Row>

                                            {/* Chart Display */}
                                            {dateRangeLoading ? (
                                                <div className="text-center py-5">
                                                    <div className="elegant-spinner"></div>
                                                    <p className="mt-3 text-muted">Loading date range sales data...</p>
                                                </div>
                                            ) : (
                                                <ResponsiveContainer width="100%" height={400}>
                                                    {chartType === 'line' ? (
                                                        <LineChart data={dateRangeSales} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                            <XAxis 
                                                                dataKey="displayDate" 
                                                                stroke="#666"
                                                                fontSize={12}
                                                                angle={-45}
                                                                textAnchor="end"
                                                                height={80}
                                                            />
                                                            <YAxis 
                                                                stroke="#666"
                                                                fontSize={12}
                                                                tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                                                            />
                                                            <Tooltip content={<CustomTooltip />} />
                                                            <Legend />
                                                            <Line 
                                                                type="monotone" 
                                                                dataKey="totalSales" 
                                                                stroke="var(--info-color)"
                                                                strokeWidth={3}
                                                                dot={{ fill: 'var(--info-color)', strokeWidth: 2, r: 6 }}
                                                                activeDot={{ r: 8, stroke: 'var(--info-color)', strokeWidth: 2 }}
                                                                name="Sales (₱)"
                                                            />
                                                            <Line 
                                                                type="monotone" 
                                                                dataKey="totalOrders" 
                                                                stroke="var(--warning-color)"
                                                                strokeWidth={2}
                                                                dot={{ fill: 'var(--warning-color)', strokeWidth: 2, r: 4 }}
                                                                name="Orders"
                                                            />
                                                        </LineChart>
                                                    ) : (
                                                        <BarChart data={dateRangeSales} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                            <XAxis 
                                                                dataKey="displayDate" 
                                                                stroke="#666"
                                                                fontSize={12}
                                                                angle={-45}
                                                                textAnchor="end"
                                                                height={80}
                                                            />
                                                            <YAxis 
                                                                stroke="#666"
                                                                fontSize={12}
                                                                tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                                                            />
                                                            <Tooltip content={<CustomTooltip />} />
                                                            <Legend />
                                                            <Bar 
                                                                dataKey="totalSales" 
                                                                fill="var(--info-color)"
                                                                name="Sales (₱)"
                                                                radius={[4, 4, 0, 0]}
                                                            />
                                                            <Bar 
                                                                dataKey="totalOrders" 
                                                                fill="var(--warning-color)"
                                                                name="Orders"
                                                                radius={[4, 4, 0, 0]}
                                                            />
                                                        </BarChart>
                                                    )}
                                                </ResponsiveContainer>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default SalesCharts;
