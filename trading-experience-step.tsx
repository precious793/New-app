"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { AccountFormData } from "../../types/auth"

interface TradingExperienceStepProps {
  formData: AccountFormData
  errors: Record<string, string>
  onUpdate: (field: keyof AccountFormData, value: any) => void
}

const INVESTMENT_GOALS = [
  "Long-term wealth building",
  "Retirement planning",
  "Income generation",
  "Capital preservation",
  "Speculation/Trading",
  "Education funding",
  "Emergency fund",
  "Real estate investment",
]

export function TradingExperienceStep({ formData, errors, onUpdate }: TradingExperienceStepProps) {
  const handleInvestmentGoalChange = (goal: string, checked: boolean) => {
    const currentGoals = formData.investmentGoals
    if (checked) {
      onUpdate("investmentGoals", [...currentGoals, goal])
    } else {
      onUpdate(
        "investmentGoals",
        currentGoals.filter((g) => g !== goal),
      )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
            3
          </span>
          <span>Trading Experience</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Trading Experience Level</Label>
          <Select value={formData.tradingExperience} onValueChange={(value) => onUpdate("tradingExperience", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
              <SelectItem value="intermediate">Intermediate (1-5 years)</SelectItem>
              <SelectItem value="advanced">Advanced (5+ years)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-base font-medium">Investment Goals *</Label>
          <p className="text-sm text-gray-600 mb-3">Select all that apply to your investment objectives</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {INVESTMENT_GOALS.map((goal) => (
              <div key={goal} className="flex items-center space-x-2">
                <Checkbox
                  id={goal}
                  checked={formData.investmentGoals.includes(goal)}
                  onCheckedChange={(checked) => handleInvestmentGoalChange(goal, checked as boolean)}
                />
                <Label htmlFor={goal} className="text-sm font-normal">
                  {goal}
                </Label>
              </div>
            ))}
          </div>
          {errors.investmentGoals && <p className="text-red-500 text-sm mt-1">{errors.investmentGoals}</p>}
        </div>

        <div>
          <Label className="text-base font-medium">Risk Tolerance</Label>
          <p className="text-sm text-gray-600 mb-3">How comfortable are you with investment risk?</p>
          <RadioGroup
            value={formData.riskTolerance}
            onValueChange={(value) => onUpdate("riskTolerance", value)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="conservative" id="conservative" />
              <Label htmlFor="conservative" className="font-normal">
                <div>
                  <div className="font-medium">Conservative</div>
                  <div className="text-sm text-gray-600">Prefer stable, low-risk investments</div>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderate" id="moderate" />
              <Label htmlFor="moderate" className="font-normal">
                <div>
                  <div className="font-medium">Moderate</div>
                  <div className="text-sm text-gray-600">Balanced approach to risk and return</div>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="aggressive" id="aggressive" />
              <Label htmlFor="aggressive" className="font-normal">
                <div>
                  <div className="font-medium">Aggressive</div>
                  <div className="text-sm text-gray-600">Comfortable with high-risk, high-reward investments</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}
