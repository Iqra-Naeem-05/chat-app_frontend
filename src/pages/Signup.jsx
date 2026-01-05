import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/solid';
import { useLoader } from '../context/LoaderContext';
import { ErrorText } from '../components/ErrorText';

function Signup() {

    const { loading, setLoading } = useLoader();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirm_password: ""
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        confirm_password: ""
    });

    const [showpassword, setShowPassword] = useState(false);
    const [showCnfmPass, setShowCnfmPass] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors(prev => ({ ...prev, [name]: "" })); 
    };

    const validate = () => {
        
        let tempErrors = {};
        let isValid = true;

        if (!formData.name) {
            tempErrors.name = "Name is required";
            isValid = false;
        } else {

            const name = /^(?=.{3,15}$)[A-Za-z]+(?: [A-Za-z]+)*$/;
            if (!name.test(formData.name)) {
                tempErrors.name = "only characters and space allowed";
                isValid = false;
            }
        }
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
        } else {
            const passwordRegex = /^(?=.*\d)(?=.*[@$!%*?&#])[^\s]{6,}$/;
            if (!passwordRegex.test(formData.password)) {
                tempErrors.password = "Invalid password format";
                isValid = false;
            }
        }
        if (!formData.confirm_password) {
            tempErrors.confirm_password = "Confirm Password is required";
            isValid = false;
        } else if (formData.confirm_password !== formData.password) {
            tempErrors.confirm_password = "Confirm Password doesn't matches";
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({})
        setLoading(true);
        if (!validate()) {
            setLoading(false);
            return;
        }

        try {

            const res = await axiosInstance.post('/signup', formData);

            navigate('/login')


        } catch (error) {
            console.log(error.response);
            setErrors(prev => ({
                ...prev,
                [error.response?.data?.field]: error.response?.data?.message || "Signup failed"
            }));

        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg border border-gray-300">

                <h1 className="text-2xl font-semibold text-center mb-6 text-orange-500"> Signup</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                    <div className='relative'>
                        <input
                            type="text"
                            name='name'
                            placeholder="Name"
                            className="p-1.5 pl-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition w-full"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 '>
                            <UserIcon className='w-5 h-5' />
                        </div>
                    </div>
                    <ErrorText field="name" errors={errors} />

                    <div className='relative'>
                        <input
                            type="email"
                            name='email'
                            placeholder="Email"
                            className="p-1.5 pl-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition w-full"
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
                            placeholder="Password"
                            className="p-1.5 px-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition w-full"
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
                        </button>
                    </div>
                    <ErrorText field="password" errors={errors} />

                    <div className='relative'>
                        <input
                            type={showCnfmPass ? "text" : "password"}
                            name='confirm_password'
                            placeholder="Confirm Password"
                            className="p-1.5 px-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition w-full"
                            value={formData.confirm_password}
                            onChange={handleChange}
                        />
                        <div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 '>
                            <LockClosedIcon className='w-5 h-5' />
                        </div>

                        <button type='button' className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600'
                            onClick={() => setShowCnfmPass(!showCnfmPass)}
                        >
                            {showCnfmPass ? (
                                <EyeSlashIcon className='w-5 h-5' />
                            ) : (
                                <EyeIcon className='w-5 h-5' />
                            )}
                        </button>
                    </div>
                    <ErrorText field="confirm_password" errors={errors} />

                    <ErrorText field="form" errors={errors} />

                    <button
                        disabled={loading}
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg w-full transition font-medium"
                    >
                        Signup
                    </button>

                    <div className='mt-1'>
                        <p className='text-gray-600 text-sm '>
                            Already have an acount?
                            <button
                                className='text-orange-500 font-medium hover:underline cursor-pointer ml-1'
                                onClick={() => navigate("/login")}
                                type='button'
                            >
                                Login
                            </button>
                        </p>

                    </div>
                </form>
            </div>
        </div>
    );

}

export default Signup