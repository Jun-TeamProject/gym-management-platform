import React, { useState, useEffect, useRef,useCallback } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs'; 
import chatService from '../services/chat';
import authService from '../services/auth';
const ADMIN_ID = 1; 

const UserChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false); 
    
    const stompClient = useRef(null); 
    const subscriptions = useRef({}); 
    const messagesEndRef = useRef(null);

    const currentUserId = authService.getCurrentUser()?.id;
    const roomId = `${currentUserId}${ADMIN_ID}`;

    const fetchInitialMessages = useCallback(async (roomId) => {
        try{
            await chatService.updateUnread(roomId, ADMIN_ID);
            const history = await chatService.getChatHistory(roomId);
            console.log(history);
            setMessages(history);
        }catch(error){
            console.error(error);
        }
    },[chatService]);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws'); 
        stompClient.current = Stomp.over(socket);

        stompClient.current.connect({}, (frame) => {
            setIsConnected(true);
            console.log('Connected: ' + frame);

            if (!subscriptions.current[roomId]) {
                const sub = stompClient.current.subscribe(`/topic/${roomId}`, (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    setMessages(prev => [...prev, receivedMessage]);
                });
                subscriptions.current[roomId] = sub;
            }

            fetchInitialMessages(roomId);
        }, (error) => {
            console.error("Connection error: ", error);
            setIsConnected(false);
        });

        return () => {
            console.log('Cleanup triggered');

            try {
                const sub = subscriptions.current[roomId];
                if (sub && typeof sub.unsubscribe === 'function') {
                    sub.unsubscribe();
                    delete subscriptions.current[roomId];
                    console.log('Unsubscribed from room', roomId);
                }

                if (stompClient.current && stompClient.current.connected) {
                    stompClient.current.disconnect(() => {
                        console.log('Disconnected');
                    });
                }

                stompClient.current = null;
            } catch (err) {
                console.warn('WebSocket cleanup error:', err);
            }
        };
    }, [roomId, fetchInitialMessages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    
    

    const handleSendMessage = () => {
        if (!inputMessage.trim() || !isConnected) return;
        
        const messageToSend = {
            roomId: roomId,
            userId: currentUserId,
            adminId: ADMIN_ID,
            senderId: currentUserId,
            content: inputMessage.trim(),
            sentAt: new Date().toISOString(),
        };

        stompClient.current.send("/app/chat.sendMessage", {}, JSON.stringify(messageToSend)); 

        setInputMessage('');
    };

    return (
        <div className="flex h-[80vh] antialiased bg-gray-100 p-6"> 
            <div className="flex flex-row h-full w-full overflow-x-hidden">
                <div className="flex flex-col flex-auto flex-shrink-0 rounded-xl bg-white h-full shadow-2xl"> 
                    
                    <div className="flex items-center justify-between p-3 border-b border-black-200">
                        <div className="text-xl font-semibold text-gray-700">관리자 1:1 채팅 문의</div>
                        <div className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                            상태: {isConnected ? '연결됨' : '연결 끊김'}
                        </div>
                    </div>

                    <div className="flex flex-col h-full overflow-y-auto mt-4 space-y-4 bg-gray-50 p-3  border-b"> 
                        {messages.map((message, index) => (
                            <div key={index} className="chat-message"> 
                                {message.senderId === currentUserId ? (
                                    <div className="flex justify-end">
                                        <div className="bg-indigo-600 text-white rounded-xl p-3 max-w-xs break-words shadow-md">
                                            {message.content}
                                            <div className="text-xs mt-1 opacity-70 text-right">{new Date(message.sentAt).toLocaleTimeString()}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-start">
                                        <div className="bg-white text-gray-800 rounded-xl p-3 max-w-xs break-words shadow-md border border-gray-200">
                                            <div className="font-semibold text-sm mb-1 text-indigo-600">Admin</div>
                                            {message.content}
                                            <div className="text-xs mt-1 opacity-70 text-right">{new Date(message.sentAt).toLocaleTimeString()}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} /> 
                    </div>

                    <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full p-4  shadow-md ">
                        <div className="flex-grow ml-4 ">
                            {/* <div className="relative w-full"> */}
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="메시지를 입력하세요..."
                                    className="flex w-full border rounded-xl focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 pl-4 h-10"
                                />
                            {/* </div> */}
                        </div>
                        <div className="ml-4">
                            <button
                                onClick={handleSendMessage}
                                disabled={!isConnected}
                                className={`flex items-center justify-center rounded-xl text-white p-2 flex-shrink-0 transition duration-300 ${isConnected ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-gray-400 cursor-not-allowed'}`}
                            >
                                <span>전송</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserChatPage;