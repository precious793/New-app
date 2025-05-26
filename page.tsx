"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { useAccountCreation } from "../../hooks/useAccountCreation"
import { PersonalInfoStep } from "../../components/account-creation/personal-info-step"
import { AddressStep } from "../../components/account-creation/address-step"
import { TradingExperienceStep } from "../../components/account-creation/trading-experience-step"
import { FinancialInfoStep } from "../../components/account-creation/financial-info-step"
import { SecurityStep } from "../../components/account-creation/security-step"

export default function CreateAccountPage() {
  const { formData, currentStep, isSubmitting, errors, updateFormData, nextStep, prevStep, submitAccount } =
    useAccountCreation()

  const [isComplete, setIsComplete] = useState(false)

  const handleSubmit = async () => {
    try {
      await submitAccount()
      setIsComplete(true)
    } catch (error) {
      alert("Failed to create account. Please try again.")
    }
  }

  const progress = (currentStep / 5) * 100

  const stepComponents = {
    1: <PersonalInfoStep formData={formData} errors={errors} onUpdate={updateFormData} />,
    2: <AddressStep formData={formData} errors={errors} onUpdate={updateFormData} />,
    3: <TradingExperienceStep formData={formData} errors={errors} onUpdate={updateFormData} />,
    4: <FinancialInfoStep formData={formData} errors={errors} onUpdate={updateFormData} />,
    5: <SecurityStep formData={formData} errors={errors} onUpdate={updateFormData} />,
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Created Successfully!</h1>
            <p className="text-gray-600 mb-6">
              Welcome to TradingEngine! Your account has been created and is pending verification.
            </p>
            <div className="space-y-3">
              <Button className="w-full" onClick={() => (window.location.href = "/")}>
                Go to Dashboard
              </Button>
              <p className="text-sm text-gray-500">You'll receive an email with verification instructions shortly.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
            <div className="text-sm text-gray-500">Step {currentStep} of 5</div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">{stepComponents[currentStep as keyof typeof stepComponents]}</div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          {currentStep < 5 ? (
            <Button onClick={nextStep} className="flex items-center space-x-2">
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Create Account</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
