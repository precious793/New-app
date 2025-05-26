"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AccountFormData } from "../../types/auth"

interface FinancialInfoStepProps {
  formData: AccountFormData
  errors: Record<string, string>
  onUpdate: (field: keyof AccountFormData, value: any) => void
}

export function FinancialInfoStep({ formData, errors, onUpdate }: FinancialInfoStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
            4
          </span>
          <span>Financial Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            This information helps us ensure compliance with financial regulations and provide appropriate investment
            recommendations.
          </p>
        </div>

        <div>
          <Label>Annual Income *</Label>
          <Select value={formData.annualIncome} onValueChange={(value) => onUpdate("annualIncome", value)}>
            <SelectTrigger className={errors.annualIncome ? "border-red-500" : ""}>
              <SelectValue placeholder="Select your annual income range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-25k">Under $25,000</SelectItem>
              <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
              <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
              <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
              <SelectItem value="250k-500k">$250,000 - $500,000</SelectItem>
              <SelectItem value="over-500k">Over $500,000</SelectItem>
            </SelectContent>
          </Select>
          {errors.annualIncome && <p className="text-red-500 text-sm mt-1">{errors.annualIncome}</p>}
        </div>

        <div>
          <Label>Net Worth *</Label>
          <Select value={formData.netWorth} onValueChange={(value) => onUpdate("netWorth", value)}>
            <SelectTrigger className={errors.netWorth ? "border-red-500" : ""}>
              <SelectValue placeholder="Select your net worth range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-50k">Under $50,000</SelectItem>
              <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
              <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
              <SelectItem value="250k-500k">$250,000 - $500,000</SelectItem>
              <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
              <SelectItem value="over-1m">Over $1,000,000</SelectItem>
            </SelectContent>
          </Select>
          {errors.netWorth && <p className="text-red-500 text-sm mt-1">{errors.netWorth}</p>}
        </div>

        <div>
          <Label>Employment Status *</Label>
          <Select value={formData.employmentStatus} onValueChange={(value) => onUpdate("employmentStatus", value)}>
            <SelectTrigger className={errors.employmentStatus ? "border-red-500" : ""}>
              <SelectValue placeholder="Select your employment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employed">Employed</SelectItem>
              <SelectItem value="self-employed">Self-Employed</SelectItem>
              <SelectItem value="unemployed">Unemployed</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.employmentStatus && <p className="text-red-500 text-sm mt-1">{errors.employmentStatus}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
