import { SignupForm } from "@/components/signup-form"

export default function Page() {
  return (
    <div className="flex w-full items-center justify-center min-h-screen p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
}
