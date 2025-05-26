"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Shield, Lock } from "lucide-react"
import { useState } from "react"
import type { AccountFormData } from "../../types/auth"

interface SecurityStepProps {
  formData: AccountFormData
  errors: Record<string, string>
  onUpdate: (field: keyof AccountFormData, value: any) => void
}

export function SecurityStep({ formData, errors, onUpdate }: SecurityStepProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"]
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
            5
          </span>
          <span>Security & Agreements</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-blue-600">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Account Security</span>
          </div>

          <div>
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => onUpdate("password", e.target.value)}
                className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {formData.password && (
              <div className="mt-2">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded ${
                        i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Strength: {strengthLabels[passwordStrength - 1] || "Very Weak"}
                </p>
              </div>
            )}
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => onUpdate("confirmPassword", e.target.value)}
                className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-blue-600">
            <Lock className="w-5 h-5" />
            <span className="font-medium">Legal Agreements</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="termsAccepted"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) => onUpdate("termsAccepted", checked)}
                className={errors.termsAccepted ? "border-red-500" : ""}
              />
              <Label htmlFor="termsAccepted" className="text-sm leading-relaxed">
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  User Agreement
                </a>
                *
              </Label>
            </div>
            {errors.termsAccepted && <p className="text-red-500 text-sm">{errors.termsAccepted}</p>}

            <div className="flex items-start space-x-2">
              <Checkbox
                id="privacyAccepted"
                checked={formData.privacyAccepted}
                onCheckedChange={(checked) => onUpdate("privacyAccepted", checked)}
                className={errors.privacyAccepted ? "border-red-500" : ""}
              />
              <Label htmlFor="privacyAccepted" className="text-sm leading-relaxed">
                I acknowledge that I have read and understand the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
                *
              </Label>
            </div>
            {errors.privacyAccepted && <p className="text-red-500 text-sm">{errors.privacyAccepted}</p>}

            <div className="flex items-start space-x-2">
              <Checkbox
                id="marketingConsent"
                checked={formData.marketingConsent}
                onCheckedChange={(checked) => onUpdate("marketingConsent", checked)}
              />
              <Label htmlFor="marketingConsent" className="text-sm leading-relaxed">
                I consent to receive marketing communications and updates about new features (optional)
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
