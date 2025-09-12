import Swal from "sweetalert2";

// Custom SweetAlert2 utility functions to replace toast notifications

export const showSuccess = (message, title = "Success!") => {
  return Swal.fire({
    icon: "success",
    title: title,
    text: message,
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
    toast: true,
    position: "top-end",
    background: "#f8f9fa",
    color: "#155724",
    iconColor: "#28a745",
  });
};

export const showError = (message, title = "Error!") => {
  return Swal.fire({
    icon: "error",
    title: title,
    text: message,
    timer: 4000,
    timerProgressBar: true,
    showConfirmButton: false,
    toast: true,
    position: "top-end",
    background: "#f8f9fa",
    color: "#721c24",
    iconColor: "#dc3545",
  });
};

export const showWarning = (message, title = "Warning!") => {
  return Swal.fire({
    icon: "warning",
    title: title,
    text: message,
    timer: 4000,
    timerProgressBar: true,
    showConfirmButton: false,
    toast: true,
    position: "top-end",
    background: "#f8f9fa",
    color: "#856404",
    iconColor: "#ffc107",
  });
};

export const showInfo = (message, title = "Info") => {
  return Swal.fire({
    icon: "info",
    title: title,
    text: message,
    timer: 3500,
    timerProgressBar: true,
    showConfirmButton: false,
    toast: true,
    position: "top-end",
    background: "#f8f9fa",
    color: "#0c5460",
    iconColor: "#17a2b8",
  });
};

// Confirmation dialog (not a toast)
export const showConfirmation = (message, title = "Are you sure?") => {
  return Swal.fire({
    title: title,
    text: message,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
  });
};

// Loading dialog
export const showLoading = (message = "Please wait...") => {
  return Swal.fire({
    title: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const closeLoading = () => {
  Swal.close();
};

// Payment method selection dialog
export const showPaymentMethodDialog = (employeeName) => {
  return Swal.fire({
    title: "Mark as Paid",
    html: `
      <div style="text-align: left;">
        <p style="margin-bottom: 15px;">Mark salary as paid for <strong>${employeeName}</strong></p>
        <label for="paymentMethod" style="display: block; margin-bottom: 5px; font-weight: 500;">Payment Method:</label>
        <select id="paymentMethod" class="swal2-input" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
          <option value="BankTransfer">Bank Transfer</option>
          <option value="Cash">Cash</option>
          <option value="Cheque">Cheque</option>
          <option value="UPI">UPI</option>
        </select>
      </div>
    `,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#28a745",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Confirm & Mark Paid",
    cancelButtonText: "Cancel",
    focusConfirm: false,
    preConfirm: () => {
      const paymentMethod = document.getElementById("paymentMethod").value;
      if (!paymentMethod) {
        Swal.showValidationMessage("Please select a payment method");
        return false;
      }
      return paymentMethod;
    },
  });
};

// Custom toast object to match the existing toast API
export const toast = {
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
  warn: showWarning, // alias for warning
};
