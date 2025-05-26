export interface UserAccount {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  dateOfBirth: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  accountType: "individual" | "business"
  tradingExperience: "beginner" | "intermediate" | "advanced"
  investmentGoals: string[]
  riskTolerance: "conservative" | "moderate" | "aggressive"
  annualIncome: string
  netWorth: string
  employmentStatus: string
  createdAt: Date
  isVerified: boolean
  kycStatus: "pending" | "approved" | "rejected"
}

export interface AccountFormData {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string

  // Address Information
  street: string
  city: string
  state: string
  zipCode: string
  country: string

  // Account Details
  accountType: "individual" | "business"
  tradingExperience: "beginner" | "intermediate" | "advanced"
  investmentGoals: string[]
  riskTolerance: "conservative" | "moderate" | "aggressive"

  // Financial Information
  annualIncome: string
  netWorth: string
  employmentStatus: string

  // Security
  password: string
  confirmPassword: string

  // Agreements
  termsAccepted: boolean
  privacyAccepted: boolean
  marketingConsent: boolean
}
