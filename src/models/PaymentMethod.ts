/**
 * Payment methods used for transactions
 */
export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  DIGITAL_WALLET = 'DIGITAL_WALLET',
  BANK_TRANSFER = 'BANK_TRANSFER',
  OTHER = 'OTHER',
}

/**
 * Human-readable labels for payment methods
 */
export const PaymentMethodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'Cash',
  [PaymentMethod.CREDIT_CARD]: 'Credit Card',
  [PaymentMethod.DEBIT_CARD]: 'Debit Card',
  [PaymentMethod.DIGITAL_WALLET]: 'Digital Wallet',
  [PaymentMethod.BANK_TRANSFER]: 'Bank Transfer',
  [PaymentMethod.OTHER]: 'Other',
}

/**
 * Icon emoji mappings for payment methods
 */
export const PaymentMethodIcons: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: '💵',
  [PaymentMethod.CREDIT_CARD]: '💳',
  [PaymentMethod.DEBIT_CARD]: '💳',
  [PaymentMethod.DIGITAL_WALLET]: '📱',
  [PaymentMethod.BANK_TRANSFER]: '🏦',
  [PaymentMethod.OTHER]: '💰',
}

/**
 * Get all payment methods as an array
 */
export const getAllPaymentMethods = (): PaymentMethod[] => {
  return Object.values(PaymentMethod)
}

/**
 * Get payment method display label
 */
export const getPaymentMethodLabel = (paymentMethod: PaymentMethod): string => {
  return PaymentMethodLabels[paymentMethod]
}

/**
 * Get payment method icon
 */
export const getPaymentMethodIcon = (paymentMethod: PaymentMethod): string => {
  return PaymentMethodIcons[paymentMethod]
}
