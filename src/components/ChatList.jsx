import React, { useEffect, useState, useRef } from 'react'
import axiosInstance from '../api/axios'
import { useAuth } from '../context/AuthContext';
import ProfileDisplay from './ProfileDisplay';
import { useLoader } from '../context/LoaderContext';
import { useNavigate } from 'react-router-dom';

function ChatList({ onSelectUser,onlineUsers, socket }) {
    const [contacts, setContacts] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const { user } = useAuth();
    const { setLoading } = useLoader()
    const isOpen = searchResult?.length > 0;
    const searchRef = useRef(null);
    const navigate = useNavigate();

    const handleSelectUser = (user) => {
        onSelectUser(user); 
        if (window.innerWidth < 768) { 
            navigate(`/chats/${user.user._id}`);
        }
    };

    useEffect(() => {
        if (!user) return;

        const fetchContacts = async () => {
            try {
                setLoading(true)
                const res = await axiosInstance.get("/profile");
                setContacts(res.data.data.contacts);
                setLoading(false)

            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        };

        fetchContacts();


        socket.on("contact_added", fetchContacts);

        return () => {
            socket.off("contact_added", fetchContacts);

        }
    }, [user, socket]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResult([]);
            return;
        }
        const timer = setTimeout(async () => {
            setLoading(true);
            const res = await axiosInstance.get(`/users/search?email=${searchQuery}`);
            setSearchResult(res.data.user);

            setLoading(false)
        }, 500);

        return () => clearTimeout(timer)
    }, [searchQuery])

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!searchRef.current.contains(event.target)) {
                setSearchResult([])
            }
        }
        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        }
    }, [])

    const handleNewContact = (newContact) => {
        setSearchQuery("");
        setSearchResult([]);
        onSelectUser({
            user: {
                _id: newContact._id,
                name: newContact.name,
                email: newContact.email,
            }
        })
        if (window.innerWidth < 768) { 
            navigate(`/chats/${newContact._id}`);
        }
    }

    return (
        <div className=' h-full overflow-y-auto '>

            <ProfileDisplay />
            <div className='flex justify-between px-4 py-2 border-b'>

                <h2 className='font-semibold text-orange-800 my-auto'>Contacts</h2>
                <div ref={searchRef} className='relative'>
                    <input
                        type="text"
                        placeholder='Search contact to chat!'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full border border-orange-800 px-3 py-1 focus:outline-none 
                                    ${isOpen ? "rounded-t-2xl rounded-b-none" : " rounded-2xl"}   `}
                    />
                    {searchResult?.length > 0 && (
                        <div
                            className={`absolute top-full inset-x-0 pt-1 bg-white border border-t-0 border-gray-300 rounded-b-2xl 
                        shadow-lg z-50 max-h-60 overflow-y-auto
                        `}
                        >

                            {searchResult.map(result => (
                                <div
                                    key={result._id}
                                    className='px-3 py-1 text-orange-800 hover:bg-gray-100 cursor-pointer rounded-2xl'
                                    onClick={() => handleNewContact(result)}
                                >

                                    <p>{result.email}</p>

                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
            {contacts.map(user => (

                <div
                    key={user.user._id}
                    onClick={() => handleSelectUser(user)}
                    className='p-4 shadow-md hover:bg-gray-100  cursor-pointer flex justify-between'
                >
                    <p className='text-orange-800'>{user.user.email}</p>
                    <span>
                        {onlineUsers.has(user.user._id) && "🟢"}
                    </span>
                </div>
            ))}
        </div>
    )
}

export default ChatList