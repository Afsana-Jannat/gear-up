export interface ICreateRental {
  gearId: string;
  startDate: Date;
  endDate: Date;
}

export interface IUpdateRentalStatus {
  status:
    | 'PLACED'
    | 'CONFIRMED'
    | 'PAID'
    | 'PICKED_UP'
    | 'RETURNED'
    | 'CANCELLED';
}
