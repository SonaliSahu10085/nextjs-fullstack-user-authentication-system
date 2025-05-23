"use client"
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from "axios";
import { toast } from 'sonner';

export default function Login() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [buttonDisabled, setButtonDisabled] = React.useState(true);

    const [user, setUser] = React.useState({
        email: "",
        password: "",
    });

    React.useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    const handleOnSubmit = async (event: React.FormEvent) => {
        try {
            setLoading(true);
            event.preventDefault();
            const response = await axios.post("/api/users/login", user);
            console.log("user login successfully.", response.data);
            setUser({
                email: "",
                password: "",
            })
            router.push("/verify");
        } catch (err: any) {
            console.log("Login Failed", err);
            toast.error(err?.response?.data?.error);
            setUser({
                email: "",
                password: "",
            })
            router.push("/login")
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className='flex justify-center items-center min-h-screen px-4 bg-gray-900'>
            <form className='w-full max-w-md md:max-w-lg lg:max-w-xl' onSubmit={handleOnSubmit}>

                <h1 className='text-white text-4xl md:text-5xl md:text-left lg:text-6xl mb-6 text-center'>{loading ? "Loading..." : "Login"}</h1>

                <div className="mb-4 flex flex-col">
                    <label className="mb-2 text-white" htmlFor='email'>Email</label>
                    <input type="email" className="bg-white shadow-amber-400 shadow-inner text-black p-2 rounded" name='email' id='email' value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
                </div>

                <div className="mb-6 flex flex-col">
                    <label className="mb-2 text-white" htmlFor='password'>Password</label>
                    <input type="text" className="bg-white shadow-amber-400 shadow-inner text-black p-2 rounded" name='password' id='password' value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
                </div>

                <button type="submit"
                    disabled={buttonDisabled}
                    className={`w-full px-6 py-2 rounded transition 
                  ${buttonDisabled
                            ? 'bg-amber-200 text-black cursor-not-allowed opacity-50'
                            : 'bg-amber-200 text-black hover:bg-amber-300 cursor-pointer transition'}
                `}
                >
                    Login
                </button>

                <div className='flex flex-row justify-between'>
                <p className='mt-4'>
                    <Link href="/signup"
                        className=" text-blue-600 hover:underline">
                        Don't have an account?
                    </Link>
                </p>
                <p className='mt-4'>
                    <Link href="/verify"
                        className=" text-blue-600 hover:underline">
                        Forgot Password?
                    </Link>
                </p>
               </div>

            </form>
        </div>
    );
}