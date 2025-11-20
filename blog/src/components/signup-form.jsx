"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "../app/features/auth/axios"
import { Spinner } from "./ui/spinner"

export function SignupForm({ ...props }) {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    phone: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    try {
      const res = await axios.post("/auth/signup", form)
      router.push("/features/auth/login")
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong"

      let newErrors = {}
      if (msg.toLowerCase().includes("email")) newErrors.email = msg
      else if (msg.toLowerCase().includes("username")) newErrors.username = msg
      else if (msg.toLowerCase().includes("phone")) newErrors.phone = msg
      else if (msg.toLowerCase().includes("password")) newErrors.password = msg
      else newErrors.general = msg

      setErrors(newErrors)

      setTimeout(() => setErrors({}), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card {...props} className="border border-gray-200 shadow-xl rounded-2xl">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-semibold">Create an Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldGroup className="space-y-4">

            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                name="username"
                onChange={handleChange}
                type="text"
                placeholder="John Doe"
                required
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              <FieldDescription>We'll never share your email with anyone else.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
              <Input
                id="phone"
                type="tel"
                name="phone"
                onChange={handleChange}
                placeholder="+995 555 123 456"
                required
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </Field>


            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                name="password"
                onChange={handleChange}
                placeholder="********"
                required
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              <FieldDescription>Must be at least 8 characters long.</FieldDescription>
            </Field>

          </FieldGroup>

          {errors.general && (
            <p className="text-red-500 text-sm text-center mt-2">{errors.general}</p>
          )}

          <div className="flex flex-col gap-3 mt-6">
            <Button
              type="submit"
              className="w-full bg-black text-white cursor-pointer hover:bg-[#151515] transition duration-300"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner /> Loading
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
            <Button variant="outline" type="button" className="w-full">
              Sign up with Google
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/features/auth/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
