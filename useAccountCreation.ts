"use client"

import { useState, useCallback } from "react"
import type { AccountFormData, UserAccount } from "../types/auth"

const initialFormData: AccountFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "United States",
  accountType: "individual",
  tradingExperience: "beginner",
  investmentGoals: [],
  riskTolerance: "moderate",
  annualIncome: "",
  netWorth: "",
  employmentStatus: "",
  password: "",
  confirmPassword: "",
  termsAccepted: false,
  privacyAccepted: false,
  marketingConsent: false,
}

export function useAccountCreation() {
  const [formData, setFormData] = useState<AccountFormData>(initialFormData)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateFormData = useCallback(
    (field: keyof AccountFormData, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }))
      }
    },
    [errors],
  )

  const validateStep = useCallback(
    (step: number): boolean => {
      const newErrors: Record<string, string> = {}

      switch (step) {
        case 1: // Personal Information
          if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
          if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
          if (!formData.email.trim()) newErrors.email = "Email is required"
          else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format"
          if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
          if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
          break

        case 2: // Address Information
          if (!formData.street.trim()) newErrors.street = "Street address is required"
          if (!formData.city.trim()) newErrors.city = "City is required"
          if (!formData.state.trim()) newErrors.state = "State is required"
          if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required"
          break

        case 3: // Trading Experience
          if (formData.investmentGoals.length === 0) newErrors.investmentGoals = "Select at least one investment goal"
          break

        case 4: // Financial Information
          if (!formData.annualIncome) newErrors.annualIncome = "Annual income is required"
          if (!formData.netWorth) newErrors.netWorth = "Net worth is required"
          if (!formData.employmentStatus) newErrors.employmentStatus = "Employment status is required"
          break

        case 5: // Security & Agreements
          if (!formData.password) newErrors.password = "Password is required"
          else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
          if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
          if (!formData.termsAccepted) newErrors.termsAccepted = "You must accept the terms and conditions"
          if (!formData.privacyAccepted) newErrors.privacyAccepted = "You must accept the privacy policy"
          break
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    },
    [formData],
  )

  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5))
    }
  }, [currentStep, validateStep])

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }, [])

  const submitAccount = useCallback(async () => {
    if (!validateStep(5)) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newAccount: UserAccount = {
        id: Date.now().toString(),
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        accountType: formData.accountType,
        tradingExperience: formData.tradingExperience,
        investmentGoals: formData.investmentGoals,
        riskTolerance: formData.riskTolerance,
        annualIncome: formData.annualIncome,
        netWorth: formData.netWorth,
        employmentStatus: formData.employmentStatus,
        createdAt: new Date(),
        isVerified: false,
        kycStatus: "pending",
      }

      console.log("Account created:", newAccount)
      return newAccount
    } catch (error) {
      throw new Error("Failed to create account")
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, validateStep])

  return {
    formData,
    currentStep,
    isSubmitting,
    errors,
    updateFormData,
    nextStep,
    prevStep,
    submitAccount,
    validateStep,
  }
}
