// Global state
let currentInvoiceId = null;

// DOM Elements
const invoiceForm = document.getElementById('invoiceForm');
const addItemBtn = document.getElementById('addItemBtn');
const itemsContainer = document.getElementById('itemsContainer');
const invoicesList = document.getElementById('invoicesList');
const modal = document.getElementById('detailModal');
const closeBtn = document.querySelector('.close');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');
const deleteInvoiceBtn = document.getElementById('deleteInvoiceBtn');

// Event Listeners
invoiceForm.addEventListener('submit', handleCreateInvoice);
addItemBtn.addEventListener('click', addItemRow);
itemsContainer.addEventListener('change', recalculateTotals);
itemsContainer.addEventListener('click', handleRemoveItem);
closeBtn.addEventListener('click', closeModal);
downloadPdfBtn.addEventListener('click', downloadPDF);
deleteInvoiceBtn.addEventListener('click', deleteInvoice);
window.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// Add a new item row
function addItemRow() {
  const itemRow = document.createElement('div');
  itemRow.className = 'item-row';
  itemRow.innerHTML = `
    <input type="text" class="item-description" placeholder="Description" required>
    <input type="number" class="item-quantity" placeholder="Qty" value="1" min="1" required>
    <input type="number" class="item-rate" placeholder="Rate" min="0" step="0.01" required>
    <span class="item-amount">0.00</span>
    <button type="button" class="btn-remove-item">Remove</button>
  `;
  itemsContainer.appendChild(itemRow);
}

// Remove item row
function handleRemoveItem(e) {
  if (e.target.classList.contains('btn-remove-item')) {
    e.preventDefault();
    e.target.parentElement.remove();
    recalculateTotals();
  }
}

// Recalculate totals
function recalculateTotals() {
  const itemRows = document.querySelectorAll('.item-row');
  let subtotal = 0;

  itemRows.forEach((row) => {
    const qty = parseFloat(row.querySelector('.item-quantity').value) || 0;
    const rate = parseFloat(row.querySelector('.item-rate').value) || 0;
    const amount = qty * rate;
    row.querySelector('.item-amount').textContent = amount.toFixed(2);
    subtotal += amount;
  });

  const taxPercent = parseFloat(document.getElementById('tax').value) || 0;
  const taxAmount = (subtotal * taxPercent) / 100;
  const total = subtotal + taxAmount;

  document.getElementById('subtotal').textContent = subtotal.toFixed(2);
  document.getElementById('taxAmount').textContent = taxAmount.toFixed(2);
  document.getElementById('total').textContent = total.toFixed(2);
}

// Create Invoice
async function handleCreateInvoice(e) {
  e.preventDefault();

  const itemRows = document.querySelectorAll('.item-row');
  const items = Array.from(itemRows).map((row) => ({
    description: row.querySelector('.item-description').value,
    quantity: parseFloat(row.querySelector('.item-quantity').value),
    rate: parseFloat(row.querySelector('.item-rate').value),
    amount: parseFloat(row.querySelector('.item-amount').textContent),
  }));

  const invoiceData = {
    invoiceNumber: document.getElementById('invoiceNumber').value,
    clientDetails: {
      name: document.getElementById('clientName').value,
      email: document.getElementById('clientEmail').value,
      phone: document.getElementById('clientPhone').value,
      address: document.getElementById('clientAddress').value,
    },
    items,
    tax: parseFloat(document.getElementById('tax').value) || 0,
    dueDate: document.getElementById('dueDate').value || null,
    notes: document.getElementById('notes').value,
  };

  try {
    const response = await fetch('/api/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoiceData),
    });

    if (response.ok) {
      alert('Invoice created successfully!');
      invoiceForm.reset();
      itemsContainer.innerHTML = `
        <div class="item-row">
          <input type="text" class="item-description" placeholder="Description" required>
          <input type="number" class="item-quantity" placeholder="Qty" value="1" min="1" required>
          <input type="number" class="item-rate" placeholder="Rate" min="0" step="0.01" required>
          <span class="item-amount">0.00</span>
          <button type="button" class="btn-remove-item">Remove</button>
        </div>
      `;
      recalculateTotals();
      loadInvoices();
    } else {
      const error = await response.json();
      alert('Error: ' + error.message);
    }
  } catch (error) {
    alert('Error creating invoice: ' + error.message);
  }
}

// Load all invoices
async function loadInvoices() {
  try {
    const response = await fetch('/api/invoices');
    const invoices = await response.json();

    if (invoices.length === 0) {
      invoicesList.innerHTML = '<p class="no-invoices">No invoices yet. Create one above!</p>';
      return;
    }

    invoicesList.innerHTML = '';
    invoices.forEach((invoice) => {
      const card = document.createElement('div');
      card.className = 'invoice-card';
      card.innerHTML = `
        <h3>${invoice.invoiceNumber}</h3>
        <p class="client-name">Client: ${invoice.clientDetails.name}</p>
        <p>Items: ${invoice.items.length}</p>
        <p class="invoice-total">Total: $${invoice.total.toFixed(2)}</p>
      `;
      card.addEventListener('click', () => showInvoiceDetail(invoice._id));
      invoicesList.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading invoices:', error);
  }
}

// Show invoice details in modal
async function showInvoiceDetail(id) {
  try {
    const response = await fetch(`/api/invoices/${id}`);
    const invoice = await response.json();
    currentInvoiceId = id;

    let itemsHtml = '';
    invoice.items.forEach((item) => {
      itemsHtml += `
        <tr>
          <td>${item.description}</td>
          <td>${item.quantity}</td>
          <td>$${item.rate.toFixed(2)}</td>
          <td>$${item.amount.toFixed(2)}</td>
        </tr>
      `;
    });

    const invoiceDetail = document.getElementById('invoiceDetail');
    invoiceDetail.innerHTML = `
      <h2>Invoice ${invoice.invoiceNumber}</h2>
      
      <div class="detail-section">
        <h3>Client Information</h3>
        <div class="detail-item">
          <span class="detail-label">Name:</span>
          <span class="detail-value">${invoice.clientDetails.name}</span>
        </div>
        ${invoice.clientDetails.email ? `
          <div class="detail-item">
            <span class="detail-label">Email:</span>
            <span class="detail-value">${invoice.clientDetails.email}</span>
          </div>
        ` : ''}
        ${invoice.clientDetails.phone ? `
          <div class="detail-item">
            <span class="detail-label">Phone:</span>
            <span class="detail-value">${invoice.clientDetails.phone}</span>
          </div>
        ` : ''}
        ${invoice.clientDetails.address ? `
          <div class="detail-item">
            <span class="detail-label">Address:</span>
            <span class="detail-value">${invoice.clientDetails.address}</span>
          </div>
        ` : ''}
      </div>

      <div class="detail-section">
        <h3>Invoice Items</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </div>

      <div class="detail-section">
        <div class="detail-item">
          <span class="detail-label">Subtotal:</span>
          <span class="detail-value">$${invoice.subtotal.toFixed(2)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Tax:</span>
          <span class="detail-value">$${invoice.tax.toFixed(2)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label"><strong>Total:</strong></span>
          <span class="detail-value"><strong>$${invoice.total.toFixed(2)}</strong></span>
        </div>
        ${invoice.dueDate ? `
          <div class="detail-item">
            <span class="detail-label">Due Date:</span>
            <span class="detail-value">${new Date(invoice.dueDate).toLocaleDateString()}</span>
          </div>
        ` : ''}
      </div>

      ${invoice.notes ? `
        <div class="detail-section">
          <h3>Notes</h3>
          <p>${invoice.notes}</p>
        </div>
      ` : ''}
    `;

    modal.style.display = 'block';
  } catch (error) {
    alert('Error loading invoice details: ' + error.message);
  }
}

// Close modal
function closeModal() {
  modal.style.display = 'none';
  currentInvoiceId = null;
}

// Download PDF
function downloadPDF() {
  if (!currentInvoiceId) return;
  window.location.href = `/api/invoices/${currentInvoiceId}/pdf`;
}

// Delete Invoice
async function deleteInvoice() {
  if (!currentInvoiceId) return;

  if (!confirm('Are you sure you want to delete this invoice?')) return;

  try {
    const response = await fetch(`/api/invoices/${currentInvoiceId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert('Invoice deleted successfully!');
      closeModal();
      loadInvoices();
    } else {
      alert('Error deleting invoice');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadInvoices();
  recalculateTotals();
});
