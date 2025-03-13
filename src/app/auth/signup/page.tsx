import { SignupForm } from "~/app/_components/auth/signup"
export default function SignUpPage() {
    return (

        <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100">
            <h1 className="text-4xl font-bold">Sign Up</h1>
            <SignupForm />
        </div>
    )
}