import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../main"
import { useDispatch, useSelector } from "react-redux"
import { setMessages } from "../redux/messageSlice"

const getMessage = () => {
    let dispatch = useDispatch()
    let {userData, selectedUser} = useSelector(state => state.user)

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedUser || !userData) {
                dispatch(setMessages([]));
                return;
            }

            try {
                let result = await axios.get(
                    `${serverUrl}/api/message/get/${selectedUser._id}`,
                    {withCredentials: true}
                );
                
                if (Array.isArray(result.data)) {
                    dispatch(setMessages(result.data));
                } else {
                    console.error("Received invalid messages data:", result.data);
                    dispatch(setMessages([]));
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
                dispatch(setMessages([]));
            }
        }

        fetchMessages();
    }, [selectedUser, userData, dispatch]);
}

export default getMessage