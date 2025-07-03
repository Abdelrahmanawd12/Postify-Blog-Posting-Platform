import { Injectable } from '@angular/core';
declare var bootstrap: any; // Declare bootstrap for modal usage
@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }
  private modalRef: any;
  private confirmCallback!: () => void;

  openModal(message: string, callback: () => void) {
    const modalEl = document.getElementById('confirmModal');
    this.confirmCallback = callback;
    if (modalEl) {
      this.modalRef = new bootstrap.Modal(modalEl);
      (document.getElementById('modalMessage') as HTMLElement).innerText = message;
      this.modalRef.show();
    }
  }

  confirm() {
    if (this.confirmCallback) this.confirmCallback();
    if (this.modalRef) this.modalRef.hide();
  }
}
