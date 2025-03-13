import { SignInForm } from "~/app/_components/auth/signin"
export default function SignIn(){
    return(
        <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100">
            <h1 className="text-4xl font-bold">Login</h1>
            <SignInForm />
        </div>
    )
}