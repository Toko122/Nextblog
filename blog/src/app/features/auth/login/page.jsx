"use client"

import React from "react"
import { LoginForm } from "@/components/login-form"

export default function Login() {
  return (
    <div className="flex w-full items-center justify-center min-h-screen px-6 md:px-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}