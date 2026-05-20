"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/client";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

const authValidationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const setLoggedInUser = useAuthStore((state) => state.setLoggedInUser);
  const cartItems = useCartStore((state) => state.items);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: authValidationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        if (isLogin) {
          const { error, data } = await supabase.auth.signInWithPassword({
            email: values.email.trim(),
            password: values.password,
          });

          if (error) {
            toast.error(error.message || "Failed to sign in");
            return;
          }
          console.log("see the logged in user detail", data);
          if (data.user && data.session) {
            setLoggedInUser(data.user, data.session);

            if (cartItems.length) {
              await axios.post("/api/cart", {
                userId: data.user.id,
                userEmail: data.user.email,
                items: cartItems.map((item) => ({
                  productId: item.id,
                  quantity: item.quantity,
                })),
              });
            }
          }

          toast.success("Signed in successfully!");
          router.push("/checkout");
          return;
        }

        const { error, data } = await supabase.auth.signUp({
          email: values.email.trim(),
          password: values.password,
        });

        if (error) {
          toast.error(error.message || "Failed to sign up");
          return;
        }

        if (data?.user === null && data?.session === null) {
          toast.info(
            "Check your email to confirm your account before signing in.",
          );
          return;
        }

        toast.success("Account created! Please check your email to confirm.");
        resetForm();
        setIsLogin(true);
      } catch (err) {
        toast.error("An unexpected error occurred");
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const loading = formik.isSubmitting;
  const getFieldError = (field: keyof typeof formik.values) =>
    formik.touched[field] && formik.errors[field] ? formik.errors[field] : null;

  // if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4 p-3 bg-blue-100 rounded-full">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-slate-600">
              {isLogin
                ? "Sign in to your account to continue"
                : "Join us today to get started"}
            </p>
          </div>

          {/* Form Card */}
          <Card className="bg-white border-slate-200 shadow-lg p-8 mb-6">
            <form onSubmit={formik.handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-slate-700 flex items-center gap-2 font-semibold"
                >
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={loading}
                    aria-invalid={Boolean(getFieldError("email"))}
                    className="bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 pl-4"
                  />
                </div>
                {getFieldError("email") ? (
                  <p className="text-sm text-red-400">
                    {getFieldError("email")}
                  </p>
                ) : null}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-slate-700 flex items-center gap-2 font-semibold"
                >
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={
                    isLogin ? "Enter your password" : "At least 6 characters"
                  }
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                  aria-invalid={Boolean(getFieldError("password"))}
                  className="bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                />
                {getFieldError("password") ? (
                  <p className="text-sm text-red-400">
                    {getFieldError("password")}
                  </p>
                ) : null}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-primary to-yellow-500 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 mt-6 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Spinner className="w-4 h-4" />
                    <span>
                      {isLogin ? "Signing in..." : "Creating account..."}
                    </span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? "Sign In" : "Sign Up"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Toggle */}
          <div className="text-center">
            <p className="text-slate-600 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  formik.resetForm();
                }}
                disabled={loading}
                type="button"
                className="text-primary hover:text-yellow-600 font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>

          {/* Security Note */}
          <p className="text-xs text-slate-500 text-center mt-8">
            Your data is encrypted and secure. We never share your information.
          </p>
        </div>
      </div>
    </div>
  );
}
