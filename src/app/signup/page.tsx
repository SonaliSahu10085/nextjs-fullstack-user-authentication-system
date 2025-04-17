"use client"
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from "axios";
import { toast } from 'sonner';

export default function Signup() {
    const router = useRouter();

    const [user, setUser] = React.useState({
        username: "",
        email: "",
        password: "",
    });

    const [buttonDisabled, setButtonDisabled] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    const handleOnSubmit = async (event: React.FormEvent) => {
        try {
            event.preventDefault();
            setLoading(true);
            const response = await axios.post("/api/users/signup", user);
            toast.success("User registered successfully.", {
                className: "rounded-lg shadow-md",
            });
            console.log(response.data);
            console.log(user);
            router.push("/login");
            setUser({
                username: "",
                email: "",
                password: "",
            })
        } catch (err: any) {
            toast.error(err.message);
            setUser({
                username: "",
                email: "",
                password: "",
            })
            console.log(err.message);
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        if (user.username.length > 0 && user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);


    return (
        <div className='flex justify-center items-center min-h-screen px-4'>
            <form className='w-full max-w-md md:max-w-lg lg:max-w-xl' onSubmit={handleOnSubmit}>

                <h1 className='text-4xl md:text-5xl md:text-left lg:text-6xl mb-6 text-center'>{loading ? "Loading..." : "Signup"}</h1>

                <div className="mb-4 flex flex-col">
                    <label className="mb-2" htmlFor='username'>Username</label>
                    <input type="text" name='username' className="bg-white shadow-amber-400 shadow-inner text-black p-2 rounded" id='username' value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} />
                </div>

                <div className="mb-4 flex flex-col">
                    <label className="mb-2" htmlFor='email'>Email</label>
                    <input type="text" className="bg-white shadow-amber-400 shadow-inner text-black p-2 rounded" name='email' id='email' value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
                </div>

                <div className="mb-6 flex flex-col">
                    <label className="mb-2" htmlFor='password'>Password</label>
                    <input type="text" className="bg-white shadow-amber-400 shadow-inner text-black p-2 rounded" name='password' id='password' value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
                </div>

                <button type="submit" disabled={buttonDisabled}
                    className={`w-full px-6 py-2 rounded transition 
                  ${buttonDisabled
                            ? 'bg-amber-200 text-black cursor-not-allowed opacity-50'
                            : 'bg-amber-200 text-black hover:bg-amber-300 cursor-pointer transition'}
                `}>Signup</button>

                <p className='mt-4'>Already have an account? <Link href="/login" className="underline text-blue-600 hover:text-blue-800">
                    {" "}Login</Link></p>
            </form>
        </div>
    );
}