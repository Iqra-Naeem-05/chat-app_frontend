import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { useLoader } from '../context/LoaderContext';
import { ErrorText } from '../components/ErrorText';

function Login() {

    const { setLoading } = useLoader();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({
        email: "",
        password: ""
    });

    const [showpassword, setShowPassword] = useState(false);
    // const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors(prev => ({ ...prev, [name]: "" })); // clears error as user types
    };

    const validate = () => {
        let tempErrors = {};
        let isValid = true;

        if (!formData.email) {
            tempErrors.email = "Email is required";
            isValid = false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                tempErrors.email = "Invalid email format";
                isValid = false;
            }
        }
        if (!formData.password) {
            tempErrors.password = "Password is required";
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors("")
        setLoading(true);
        if (!validate()) {
            setLoading(false);
            return;
        }

        try {

            const res = await axiosInstance.post('/login', formData);
            login(res.data.user);
            navigate('/chats')

        } catch (error) {
            console.log(error);

            setErrors(prev => ({
                ...prev,
                [error.response?.data?.field]: error.response?.data?.message || "Login failed"
            }))
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg border border-gray-300">

                <h1 className="text-2xl font-semibold text-center mb-6 text-orange-500">  Login </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                    <div className='relative'>
                        <input
                            type="email"
                            name='email'
                            placeholder="Enter your Email"
                            className="p-3 pl-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition w-full"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 '>
                            <EnvelopeIcon className='w-5 h-5' />
                        </div>
                    </div>
                    <ErrorText field="email" errors={errors} />

                    <div className='relative'>
                        <input
                            type={showpassword ? "text" : "password"}
                            name='password'
                            placeholder="Enter your Password"
                            className="p-3 px-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition w-full"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 '>
                            <LockClosedIcon className='w-5 h-5' />
                        </div>

                        <button type='button' className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600'
                            onClick={() => setShowPassword(!showpassword)}
                        >
                            {showpassword ? (
                                <EyeSlashIcon className='w-5 h-5' />
                            ) : (
                                <EyeIcon className='w-5 h-5' />
                            )}
                        </button >
                    </div>
                    <ErrorText field="password" errors={errors} />

                    <ErrorText field="form" errors={errors} />
                    <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg w-full transition font-medium"
                    >
                        Login
                    </button>

                    <div className='mt-1'>
                        <p className='text-gray-600 text-sm '>
                            Don't have an acount?
                            <button
                                type='button'
                                className='text-orange-500 font-medium hover:underline cursor-pointer ml-1'
                                onClick={() => navigate("/signup")}
                            >
                                Sign up
                            </button>
                        </p>

                    </div>
                </form>
            </div>
        </div>
    );

}

export default Login