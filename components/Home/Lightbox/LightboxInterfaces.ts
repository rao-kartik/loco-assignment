export interface ILightbox {
  open: boolean;
  onClose: any | null;
  currentImageData: any;
  onNext: any;
  onPrev: any;
  prevDisabled: boolean;
  isLoading: boolean;
}
