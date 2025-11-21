"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import axios from "@/lib/apiClient";
import { useAuth } from "../app/features/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { Spinner } from "./ui/spinner";

export function LoginForm({ className, ...props }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ password: "", email: "" });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUsernameMessage("");
    setMessage("");

    if (form.email.trim() === "") {
      setUsernameMessage("Invalid email");
      setTimeout(() => setUsernameMessage(""), 3000);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/auth/login", form);
      console.log("Login response:", res.data);

      login(res.data.token, res.data.user._id);
      router.push("/");
    } catch (err) {
      console.log("error login user", err);
      if (err.response?.status === 400) {
        setUsernameMessage("Invalid username or password");
      } else {
        setMessage(err.response?.message || "Server error");
      }
      setTimeout(() => {
        setUsernameMessage("");
        setMessage("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 shadow-lg", className)} {...props}>
      <Card className="border-[rgb(0,0,0,0.2)]">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="Email">Email</Label>
                <Input
                  onChange={handleChange}
                  name="email"
                  id="email"
                  type="email"
                  placeholder="email"
                  value={form.email}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/features/auth/forgotPassword"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline w-fit"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  onChange={handleChange}
                  placeholder="Password"
                  name="password"
                  id="password"
                  type="password"
                  value={form.password}
                  required
                />
              </div>

              {usernameMessage && (
                <p className="w-full p-2 bg-[rgba(249,103,103,0.7)] text-white font-semibold rounded-md">
                  {usernameMessage}
                </p>
              )}

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full bg-[#1e1e1e] cursor-pointer text-white hover:bg-[#141414] transition duration-200"
                >
                  {loading ? <Spinner /> : "Login"}
                </Button>

                {message && (
                  <p className="w-full p-2 bg-[rgba(249,103,103,0.7)] text-white font-semibold rounded-md">
                    {message}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/features/auth/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
