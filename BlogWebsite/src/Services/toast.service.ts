import { Injectable } from '@angular/core';
declare var bootstrap: any;

@Injectable({
  providedIn: 'root'
})
export class ToastService {
show(message: string, type: 'success' | 'danger' | 'info' = 'success') {
    const toastContainer = document.createElement('div');
    toastContainer.innerHTML = `
      <div class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    `;
    toastContainer.classList.add('toast-container', 'position-fixed', 'bottom-0', 'end-0', 'p-3');
    document.body.appendChild(toastContainer);
    const toastElement = toastContainer.querySelector('.toast');
    if (toastElement) {
      const toast = new bootstrap.Toast(toastElement);
      toast.show();

      // Remove after toast is hidden
      toastElement.addEventListener('hidden.bs.toast', () => {
        document.body.removeChild(toastContainer);
      });
    }
  }
}
