# 📄 Invoice Generator App

A modern, full-stack web application for creating, managing, and downloading invoices as PDFs. Built with **Node.js**, **Express**, **MongoDB**, and vanilla **JavaScript**.

## ✨ Features

- ✅ **Create Invoices** - Generate professional invoices with client details and itemized lists
- ✅ **Auto-Calculate Totals** - Automatic calculation of subtotals, taxes, and final totals
- ✅ **Save to Database** - Persist all invoices in MongoDB
- ✅ **View & Manage** - Display all saved invoices with detailed view modal
- ✅ **Download as PDF** - Generate and download invoices in professional PDF format
- ✅ **Delete Invoices** - Remove invoices from the system
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **PDFKit** - PDF generation

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling (responsive grid layout)
- **Vanilla JavaScript** - Client-side logic

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on `mongodb://localhost:27017`
- npm (comes with Node.js)

## 🚀 Installation & Setup

1. **Clone the repository** (or navigate to the project directory)
   ```bash
   cd invoice-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/invoice-app
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your machine:
   ```bash
   mongod
   ```

5. **Start the server**
   
   **Development mode** (with auto-reload):
   ```bash
   npm run dev
   ```
   
   **Production mode**:
   ```bash
   npm start
   ```

6. **Open in browser**
   
   Navigate to: `http://localhost:5000`

## 📁 Project Structure

```
invoice-app/
├── public/                    # Frontend files
│   ├── index.html            # Main HTML page
│   ├── css/
│   │   └── style.css         # Responsive styling
│   └── js/
│       └── app.js            # Frontend logic
├── src/
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/
│   │   └── invoiceController.js  # Business logic
│   ├── models/
│   │   └── Invoice.js        # Database schema
│   ├── routes/
│   │   └── invoiceRoutes.js  # API endpoints
│   └── utils/
│       └── pdfGenerator.js   # PDF generation logic
├── server.js                 # Express server entry point
├── package.json              # Dependencies
├── .env                      # Environment variables (create this)
└── .gitignore               # Git ignore rules
```

## 🔌 API Endpoints

All endpoints are prefixed with `/api/invoices`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create a new invoice |
| GET | `/` | Get all invoices |
| GET | `/:id` | Get invoice by ID |
| GET | `/:id/pdf` | Download invoice as PDF |
| PUT | `/:id` | Update an invoice |
| DELETE | `/:id` | Delete an invoice |

### Example: Create Invoice
```javascript
POST /api/invoices
Content-Type: application/json

{
  "invoiceNumber": "INV-001",
  "clientDetails": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "address": "123 Main St, City, State"
  },
  "items": [
    {
      "description": "Web Design",
      "quantity": 1,
      "rate": 500.00,
      "amount": 500.00
    }
  ],
  "tax": 50,
  "dueDate": "2026-06-30",
  "notes": "Thank you for your business!"
}
```

## 📊 Invoice Schema

```javascript
{
  invoiceNumber: String (required, unique),
  clientDetails: {
    name: String (required),
    email: String,
    phone: String,
    address: String
  },
  items: [
    {
      description: String (required),
      quantity: Number (required, min: 1),
      rate: Number (required),
      amount: Number (auto-calculated)
    }
  ],
  subtotal: Number,
  tax: Number,
  total: Number,
  dueDate: Date,
  notes: String,
  createdAt: Date (default: now)
}
```

## 🎨 Features in Detail

### Invoice Creation
- Fill in invoice number and client details
- Add multiple line items with dynamic calculations
- Set optional tax percentage and due date
- Add notes for special instructions

### Auto-Calculation
- Item amounts calculated automatically (quantity × rate)
- Subtotal sums all items
- Tax calculated based on percentage
- Total automatically computed

### PDF Download
- Professional invoice layout
- Includes all invoice details
- Itemized table with calculations
- Company branding ready (customizable)

## 🔧 Development

### Run in development mode with auto-reload
```bash
npm run dev
```
(Requires `nodemon` - install with `npm install --save-dev nodemon`)

### View MongoDB data
```bash
mongosh
use invoice-app
db.invoices.find()
```

## 📝 Usage Example

1. Open the app at `http://localhost:5000`
2. Fill in the **Create New Invoice** form
3. Add line items (click "+ Add Item")
4. Adjust tax percentage if needed
5. Click **Create Invoice**
6. View your invoice in the **Saved Invoices** list
7. Click on an invoice to view details
8. Click **Download PDF** to save as file

## 🐛 Troubleshooting

### MongoDB connection error
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env` matches your setup
- Default: `mongodb://localhost:27017/invoice-app`

### Port already in use
- Change `PORT` in `.env` to an available port (e.g., 5001)

### PDF download not working
- Ensure `pdfkit` is installed: `npm install pdfkit`
- Check browser console for errors (F12)

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **dotenv** - Environment variables
- **pdfkit** - PDF generation

## 🚀 Future Enhancements

- [ ] Email invoice directly to clients
- [ ] Invoice templates with custom branding
- [ ] Multiple currency support
- [ ] Recurring invoices
- [ ] Payment tracking
- [ ] Invoice search and filters
- [ ] User authentication
- [ ] Dark mode

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👨‍💻 Contributing

Feel free to fork, modify, and improve this project. Submit pull requests with enhancements!

---

**Created with ❤️ for freelancers and small businesses**

## 🔗 Live Demo
[View Live App](https://invoice-generator-pst0.onrender.com)

## 💻 GitHub
[View Repository](https://github.com/oni-oluwapelumi/invoice-generator)

## 🛠️ Built With
- Node.js & Express.js
- MongoDB Atlas
- REST API
- PDFKit
- HTML/CSS/JavaScript
