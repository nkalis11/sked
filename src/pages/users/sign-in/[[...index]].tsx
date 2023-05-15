import { SignIn } from "@clerk/nextjs";
import SignInForm from "~/components/Forms/signInForm";

const SignInPage = () => {
    return (
        <div className="flex justify-center">
            <SignIn signUpUrl="/sign-up" redirectUrl="/dashboard/maintenance"
                appearance={{
                    elements: {
                        formButtonPrimary: 'bg-indigo-600',
                    }
                }}
            />
        </div>

    );
};
export default SignInPage;