const moment = require('moment');

const generateOrderPDF = (order, user) => {
    return new Promise((resolve, reject) => {
        // For now, return a simple text-based receipt
        // This can be enhanced with proper PDF generation later
        // Calculate totals
        const itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const shippingPrice = order.shippingPrice || 0;
        const taxPrice = order.taxPrice || 0;
        const totalPrice = order.totalPrice || (itemsPrice + shippingPrice + taxPrice);

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>LumiScents - Order Receipt</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    margin: 0;
                    padding: 20px;
                    color: #333;
                    line-height: 1.6;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 3px solid #8B4513;
                    padding-bottom: 20px;
                }
                .logo {
                    font-size: 28px;
                    font-weight: bold;
                    color: #8B4513;
                    margin-bottom: 5px;
                }
                .tagline {
                    font-size: 14px;
                    color: #666;
                    font-style: italic;
                }
                .receipt-info {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 30px;
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 5px;
                }
                .receipt-info div {
                    flex: 1;
                }
                .receipt-info h3 {
                    margin: 0 0 10px 0;
                    color: #8B4513;
                    font-size: 16px;
                }
                .order-details {
                    margin-bottom: 30px;
                }
                .order-details h2 {
                    color: #8B4513;
                    border-bottom: 2px solid #8B4513;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }
                .items-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                .items-table th,
                .items-table td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                .items-table th {
                    background-color: #8B4513;
                    color: white;
                    font-weight: bold;
                }
                .items-table tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                .totals {
                    float: right;
                    width: 300px;
                    margin-top: 20px;
                }
                .totals table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .totals td {
                    padding: 8px 12px;
                    border-bottom: 1px solid #ddd;
                }
                .totals .total-row {
                    background-color: #8B4513;
                    color: white;
                    font-weight: bold;
                    font-size: 16px;
                }
                .shipping-info {
                    clear: both;
                    margin-top: 40px;
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 5px;
                }
                .shipping-info h3 {
                    color: #8B4513;
                    margin-bottom: 15px;
                }
                .status-badge {
                    display: inline-block;
                    padding: 5px 15px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: bold;
                    text-transform: uppercase;
                }
                .status-processing {
                    background-color: #ffc107;
                    color: #000;
                }
                .status-shipped {
                    background-color: #17a2b8;
                    color: white;
                }
                .status-delivered {
                    background-color: #28a745;
                    color: white;
                }
                .footer {
                    margin-top: 40px;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                    border-top: 1px solid #ddd;
                    padding-top: 20px;
                }
                .thank-you {
                    text-align: center;
                    margin: 30px 0;
                    padding: 20px;
                    background: linear-gradient(135deg, #8B4513, #D2691E);
                    color: white;
                    border-radius: 10px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">🕯️ LumiScents</div>
                <div class="tagline">Illuminate Your Space with Premium Candles</div>
            </div>

            <div class="receipt-info">
                <div>
                    <h3>Order Information</h3>
                    <p><strong>Order ID:</strong> ${order._id}</p>
                    <p><strong>Order Date:</strong> ${moment(order.createdAt).format('MMMM DD, YYYY')}</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${order.orderStatus.toLowerCase()}">${order.orderStatus}</span></p>
                </div>
                <div>
                    <h3>Customer Information</h3>
                    <p><strong>Name:</strong> ${user.name}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Phone:</strong> ${order.shippingInfo?.phoneNo || 'N/A'}</p>
                </div>
            </div>

            <div class="order-details">
                <h2>Order Items</h2>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.orderItems.map(item => `
                            <tr>
                                <td>
                                    <strong>${item.name}</strong><br>
                                    <small>Product ID: ${item.product}</small>
                                </td>
                                <td>${item.quantity}</td>
                                <td>₱${item.price.toFixed(2)}</td>
                                <td>₱${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="totals">
                    <table>
                        <tr>
                            <td>Items Subtotal:</td>
                            <td>₱${itemsPrice.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Shipping Fee:</td>
                            <td>₱${shippingPrice.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Tax:</td>
                            <td>₱${taxPrice.toFixed(2)}</td>
                        </tr>
                        <tr class="total-row">
                            <td>Total Amount:</td>
                            <td>₱${totalPrice.toFixed(2)}</td>
                        </tr>
                    </table>
                </div>
            </div>

            <div class="shipping-info">
                <h3>Shipping Address</h3>
                <p>
                    ${order.shippingInfo?.address || 'N/A'}<br>
                    ${order.shippingInfo?.city || ''}, ${order.shippingInfo?.postalCode || ''}<br>
                    ${order.shippingInfo?.country || ''}
                </p>
            </div>

            <div class="thank-you">
                <h3>Thank You for Your Order! 🙏</h3>
                <p>We appreciate your business and hope you enjoy your premium candles from LumiScents.</p>
                <p>For any questions or concerns, please contact us at support@lumiscents.com</p>
            </div>

            <div class="footer">
                <p>This is an automatically generated receipt. Please keep this for your records.</p>
                <p>© ${new Date().getFullYear()} LumiScents. All rights reserved.</p>
                <p>Generated on: ${moment().format('MMMM DD, YYYY [at] hh:mm A')}</p>
            </div>
        </body>
        </html>
        `;

        const options = {
            format: 'A4',
            orientation: 'portrait',
            border: {
                top: '0.5in',
                right: '0.5in',
                bottom: '0.5in',
                left: '0.5in'
            },
            header: {
                height: '0mm'
            },
            footer: {
                height: '0mm'
            }
        };

        // For now, create a simple text receipt instead of PDF
        // This avoids package compatibility issues
        const textReceipt = `
LumiScents Order Receipt
========================
Order ID: ${order._id}
Date: ${moment(order.createdAt).format('MMMM DD, YYYY')}
Customer: ${user.name}
Email: ${user.email}

Order Items:
${order.orderItems.map(item => `- ${item.name} x${item.quantity} - ₱${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Subtotal: ₱${itemsPrice.toFixed(2)}
Shipping: ₱${shippingPrice.toFixed(2)}
Tax: ₱${taxPrice.toFixed(2)}
Total: ₱${totalPrice.toFixed(2)}

Thank you for shopping with LumiScents!
        `;
        
        // Convert text to buffer for email attachment
        const buffer = Buffer.from(textReceipt, 'utf8');
        resolve(buffer);
    });
};

module.exports = {
    generateOrderPDF
};
