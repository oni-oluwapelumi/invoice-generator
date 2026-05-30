const Invoice = require('../models/Invoice');
const { generateInvoicePDF } = require('../utils/pdfGenerator');

// Create a new invoice
exports.createInvoice = async (req, res) => {
  try {
    const { invoiceNumber, clientDetails, items, tax, dueDate, notes } = req.body;

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const total = subtotal + (tax || 0);

    const invoice = new Invoice({
      invoiceNumber,
      clientDetails,
      items,
      subtotal,
      tax: tax || 0,
      total,
      dueDate,
      notes,
    });

    await invoice.save();
    res.status(201).json({ message: 'Invoice created successfully', invoice });
  } catch (error) {
    res.status(400).json({ message: 'Error creating invoice', error: error.message });
  }
};

// Get all invoices
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoices', error: error.message });
  }
};

// Get a single invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoice', error: error.message });
  }
};

// Update an invoice
exports.updateInvoice = async (req, res) => {
  try {
    const { items, tax } = req.body;

    // Recalculate totals if items or tax changed
    let updateData = req.body;
    if (items) {
      const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
      updateData.subtotal = subtotal;
      updateData.total = subtotal + (tax || 0);
    }

    const invoice = await Invoice.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json({ message: 'Invoice updated successfully', invoice });
  } catch (error) {
    res.status(400).json({ message: 'Error updating invoice', error: error.message });
  }
};

// Delete an invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting invoice', error: error.message });
  }
};

// Download invoice as PDF
exports.downloadInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    generateInvoicePDF(invoice, res);
  } catch (error) {
    res.status(500).json({ message: 'Error generating PDF', error: error.message });
  }
};
