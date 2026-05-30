const PDFDocument = require('pdfkit');

const generateInvoicePDF = (invoice, res) => {
  const doc = new PDFDocument();

  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`);

  // Pipe to response
  doc.pipe(res);

  // Title
  doc.fontSize(24).font('Helvetica-Bold').text('INVOICE', { align: 'center' });
  doc.moveDown(0.5);

  // Invoice Number and Date
  doc.fontSize(11).font('Helvetica');
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, 50, 100);
  doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 50, 120);
  if (invoice.dueDate) {
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 50, 140);
  }

  // Client Information
  doc.fontSize(12).font('Helvetica-Bold').text('Bill To:', 50, 180);
  doc.fontSize(11).font('Helvetica');
  doc.text(invoice.clientDetails.name, 50, 200);
  if (invoice.clientDetails.address) {
    doc.text(invoice.clientDetails.address, 50, 218);
  }
  if (invoice.clientDetails.email) {
    doc.text(`Email: ${invoice.clientDetails.email}`, 50, 236);
  }
  if (invoice.clientDetails.phone) {
    doc.text(`Phone: ${invoice.clientDetails.phone}`, 50, 254);
  }

  // Items Table
  const startY = 310;
  const col1 = 50;
  const col2 = 300;
  const col3 = 380;
  const col4 = 460;
  const rowHeight = 25;

  // Table Header
  doc.rect(col1, startY, 450, rowHeight).stroke();
  doc.fontSize(11).font('Helvetica-Bold');
  doc.text('Description', col1 + 5, startY + 7);
  doc.text('Qty', col2 + 5, startY + 7);
  doc.text('Rate', col3 + 5, startY + 7);
  doc.text('Amount', col4 + 5, startY + 7);

  // Table Rows
  doc.font('Helvetica');
  let currentY = startY + rowHeight;
  invoice.items.forEach((item) => {
    doc.rect(col1, currentY, 450, rowHeight).stroke();
    doc.text(item.description, col1 + 5, currentY + 7);
    doc.text(item.quantity.toString(), col2 + 5, currentY + 7);
    doc.text(`$${item.rate.toFixed(2)}`, col3 + 5, currentY + 7);
    doc.text(`$${item.amount.toFixed(2)}`, col4 + 5, currentY + 7);
    currentY += rowHeight;
  });

  // Totals Section
  currentY += 20;
  doc.fontSize(11).font('Helvetica');
  doc.text(`Subtotal: $${invoice.subtotal.toFixed(2)}`, 400, currentY);
  currentY += 20;
  doc.text(`Tax: $${invoice.tax.toFixed(2)}`, 400, currentY);

  // Total (Bold and Larger)
  currentY += 25;
  doc.fontSize(13).font('Helvetica-Bold');
  doc.text(`Total: $${invoice.total.toFixed(2)}`, 400, currentY);

  // Notes
  if (invoice.notes) {
    currentY += 50;
    doc.fontSize(11).font('Helvetica-Bold').text('Notes:', 50, currentY);
    currentY += 20;
    doc.fontSize(10).font('Helvetica').text(invoice.notes, 50, currentY, { width: 450 });
  }

  // Footer
  doc.fontSize(9).font('Helvetica').text(
    'Thank you for your business!',
    50,
    doc.page.height - 50,
    { align: 'center' }
  );

  // Finalize PDF
  doc.end();
};

module.exports = { generateInvoicePDF };
