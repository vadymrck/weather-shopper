export interface PaymentData {
  readonly email: string;
  readonly cardNumber: string;
  readonly expiry: string;
  readonly cvc: string;
  readonly zip: string;
}

export const validPayment: PaymentData = {
  email: "checkout@test.com",
  cardNumber: "4242 4242 4242 4242",
  expiry: "01/29",
  cvc: "123",
  zip: "12345",
};

export const expiredPayment: PaymentData = {
  ...validPayment,
  expiry: "01/20",
};
