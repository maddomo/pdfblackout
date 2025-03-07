import { SignInForm } from "~/app/_components/auth/signin"
export default function SignIn(){
    return(
        <div className="flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            <h1>Login</h1>
            <SignInForm />
        </div>
    )
}