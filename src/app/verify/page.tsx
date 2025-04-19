"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
import { toast } from 'sonner';

export default function Verify() {
    const [code, setCode] = useState(Array(6).fill(''));
    const [timeLeft, setTimeLeft] = useState(2 * 60); // 2:00 = 120 in seconds
    const [isExpired, setIsExpired] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const router = useRouter();

    // Format MM:SS
    const formatTime = (seconds: number) => {
        const m = String(Math.floor(seconds / 60)).padStart(2, "0");
        const s = String(seconds % 60).padStart(2, "0");
        return `${m}:${s}`;
    };

    useEffect(() => {
        if (!code.includes('')) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [code]);

    // Countdown logic
    useEffect(() => {
        if (timeLeft === 0) {
            setIsExpired(true);
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer); // cleanup
    }, [timeLeft]);

    const onHandleChange = (value: string, index: number) => {
        if (!/^[0-9]?$/.test(value)) return; // only allow numeric
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // move to next input
        const next = document.getElementById(`code-${index + 1}`);
        if (next && value) (next as HTMLElement).focus();
    };

    const handleVerify = async() => {
        try {
            if (isExpired) {
                toast.error("OTP has expired. Please resend the code.");
                setCode(Array(6).fill(''));
                return;
            }
            const enteredCode = code.join('');
            // toast.success(`Verifying code: ${enteredCode}`);
            const response = await axios.post("/api/users/verify-email", { token: enteredCode });
            console.log(response.data);
            toast.success(response.data.message);
    
            // Proceed with verification (API call etc.)
            // alert("OTP verified ✅");
            // Add your API call here
    
            router.push("/profile");
        } catch (error:any) {
            toast.error(error?.response?.data?.error || error.message);
            console.log(error);
        }
    };

    const onResend = async() => {
        toast.success("Resending code to your email...");
        setTimeLeft(2 * 60);
        await handleVerify();
        // Add your API call here
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-950 p-8 rounded shadow-md w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="text-3xl mb-2">📧</div>
                    <h1 className="text-xl font-semibold text-gray-200">VERIFY YOUR EMAIL ADDRESS</h1>
                    <hr className='my-4 text-gray-300' />
                    <p className="text-sm mt-4 text-gray-400">
                        A verification code has been sent to <br />
                        <span className="font-semibold">*****@gmail.com</span>
                    </p>
                    <p className="text-sm text-gray-400 mt-2 text-left">
                        Please check your inbox and enter the verification code below to verify your email address.The code will expire in <span className="font-medium text-gray-300">{formatTime(timeLeft)}</span>.
                    </p>

                </div>

                <div className="flex justify-center gap-2 mb-6">
                    {code.map((val, i) => (
                        <input
                            key={i}
                            id={`code-${i}`}
                            type="text"
                            value={val}
                            maxLength={1}
                            onChange={(e) => onHandleChange(e.target.value, i)}
                            className="w-12 h-12 text-xl text-center text-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-200"
                        />
                    ))}
                </div>

                <button
                    onClick={handleVerify}
                    disabled={buttonDisabled}
                    className={buttonDisabled ? "w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded font-semibold cursor-not-allowed opacity-50" : "w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded font-semibold"}
                >
                    Verify
                </button>

                <div className="flex justify-center text-sm text-green-600 mt-4">
                    <button className="hover:underline" onClick={onResend}>Resend code</button>
                </div>
            </div>
        </div>
    );
}
