export interface ICreateReview {
  rentalOrderId: string;
  gearId: string;
  rating: number;
  comment?: string;
}
