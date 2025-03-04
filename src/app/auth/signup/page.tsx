import { SignupForm } from "~/app/_components/auth/signup"
export default function SignUpPage() {
    return (

        <div className=" flex flex-col items-center justify-center gap-12 px-4 py-16 border border-red-200 rounded-xl bg-white/10 ">
            <h1>Sign Up</h1>
            <SignupForm />
        </div>
    )
}