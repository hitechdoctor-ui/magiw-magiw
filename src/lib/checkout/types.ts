export type CheckoutStep = "contact" | "shipping" | "review" | "payment" | "done";

export type CheckoutDraft = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  city: string;
  postalCode: string;
  country: string;
  notes: string;
  discountCode: string;
};

export const emptyCheckoutDraft = (): CheckoutDraft => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  addressLine1: "",
  city: "",
  postalCode: "",
  country: "GR",
  notes: "",
  discountCode: "",
});
