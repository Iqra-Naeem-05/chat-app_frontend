
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Cog8ToothIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../context/LoaderContext";

function ProfileDisplay() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const profileRef = useRef(null);
  const { setLoading } = useLoader()

  if (!user) return setLoading(true);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if(!profileRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleOutsideClick)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [])
  

  return (
    <div ref={profileRef} className="flex justify-between p-4 border-b ">
      <h1 className="text-xl font-semibold text-orange-800">{user?.name}</h1>

      <div className="relative">
        <button onClick={() => setIsOpen(!isOpen)}>
          <Cog8ToothIcon className="text-orange-800 size-6 cursor-pointer" />
        </button>

        {isOpen && (
          <div className="absolute right-0 z-20 bg-white  flex flex-col p-4 gap-4 shadow-lg shadow-gray-400">
            {/* <button className="hover:text-gray-500  bg-pink-40 cursor-pointer " onClick={() => navigate('/profile')}>Profile</button> */}
            <button className="hover:text-red-500 text-red-600 font-medium  cursor-pointer" onClick={logout}>Logout</button>
          </div>
        )}
      </div>

    </div>
  );
}

export default ProfileDisplay;