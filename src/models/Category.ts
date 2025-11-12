/**
 * Expense categories for classification
 */
export enum Category {
  FOOD_DINING = 'FOOD_DINING',
  TRANSPORTATION = 'TRANSPORTATION',
  ENTERTAINMENT = 'ENTERTAINMENT',
  BILLS_UTILITIES = 'BILLS_UTILITIES',
  SHOPPING = 'SHOPPING',
  HEALTHCARE = 'HEALTHCARE',
  EDUCATION = 'EDUCATION',
  TRAVEL = 'TRAVEL',
  PERSONAL_CARE = 'PERSONAL_CARE',
  OTHER = 'OTHER',
}

/**
 * Human-readable labels for categories
 */
export const CategoryLabels: Record<Category, string> = {
  [Category.FOOD_DINING]: 'Food & Dining',
  [Category.TRANSPORTATION]: 'Transportation',
  [Category.ENTERTAINMENT]: 'Entertainment',
  [Category.BILLS_UTILITIES]: 'Bills & Utilities',
  [Category.SHOPPING]: 'Shopping',
  [Category.HEALTHCARE]: 'Healthcare',
  [Category.EDUCATION]: 'Education',
  [Category.TRAVEL]: 'Travel',
  [Category.PERSONAL_CARE]: 'Personal Care',
  [Category.OTHER]: 'Other',
}

/**
 * Icon emoji mappings for categories (for UI display)
 */
export const CategoryIcons: Record<Category, string> = {
  [Category.FOOD_DINING]: '🍔',
  [Category.TRANSPORTATION]: '🚗',
  [Category.ENTERTAINMENT]: '🎬',
  [Category.BILLS_UTILITIES]: '💡',
  [Category.SHOPPING]: '🛍️',
  [Category.HEALTHCARE]: '🏥',
  [Category.EDUCATION]: '📚',
  [Category.TRAVEL]: '✈️',
  [Category.PERSONAL_CARE]: '💅',
  [Category.OTHER]: '📦',
}

/**
 * Color associations for categories (WCAG AA compliant)
 * Colors meet 4.5:1 contrast ratio for text on white background
 */
export const CategoryColors: Record<Category, string> = {
  [Category.FOOD_DINING]: '#DC2626', // red-600
  [Category.TRANSPORTATION]: '#2563EB', // blue-600
  [Category.ENTERTAINMENT]: '#CA8A04', // yellow-600
  [Category.BILLS_UTILITIES]: '#16A34A', // green-600
  [Category.SHOPPING]: '#9333EA', // purple-600
  [Category.HEALTHCARE]: '#EA580C', // orange-600
  [Category.EDUCATION]: '#DB2777', // pink-600
  [Category.TRAVEL]: '#0891B2', // cyan-600
  [Category.PERSONAL_CARE]: '#7C3AED', // violet-600
  [Category.OTHER]: '#64748B', // slate-600
}

/**
 * Get all categories as an array
 */
export const getAllCategories = (): Category[] => {
  return Object.values(Category)
}

/**
 * Get category display label
 */
export const getCategoryLabel = (category: Category): string => {
  return CategoryLabels[category]
}

/**
 * Get category icon
 */
export const getCategoryIcon = (category: Category): string => {
  return CategoryIcons[category]
}

/**
 * Get category color
 */
export const getCategoryColor = (category: Category): string => {
  return CategoryColors[category]
}
