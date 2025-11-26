import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import chatService from "../services/chat";
import authService from "../services/auth";

const AdminChatPage = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputMessage, setInputMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);
  const subscriptions = useRef({});

  const location = useLocation();
  const navigate = useNavigate();

  // const role = authService.getRole();
  // const adminId = getCurrentAdminId();
  const adminId = 1;
  const WEBSOCKET_ENDPOINT = "/api/ws";

  useEffect(() => {
    const socket = new SockJS(WEBSOCKET_ENDPOINT);
    stompClient.current = Stomp.over(socket);

    stompClient.current.connect(
      {},
      (frame) => {
        setIsConnected(true);
        console.log("ADMIN Connected: " + frame);
      },
      (error) => {
        console.error("Connection error: ", error);
        setIsConnected(false);
      }
    );

    fetchRooms();

    return () => {
      Object.values(subscriptions.current).forEach((sub) => sub.unsubscribe());
      if (stompClient.current && isConnected) {
        stompClient.current.disconnect(() => console.log("Disconnected"));
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchRooms = async () => {
    setChatRooms(await chatService.getAllChatRoom());
    setLoading(false);
    // if (chatRooms.length > 0) {
    //     handleRoomSelect(chatRooms[0]);
    // }

    const roomIdToOpen = location.state?.roomIdToOpen;
    if (roomIdToOpen) {
      const roomToSelect = rooms.find((room) => room.id === roomIdToOpen);
      if (roomToSelect) {
        await handleRoomSelect(roomToSelect);
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  };

  const handleRoomSelect = async (newroom) => {
    if (selectedRoom?.id === newroom.id) return;

    if (selectedRoom && subscriptions.current[selectedRoom.id]) {
      subscriptions.current[selectedRoom.id].unsubscribe();
      delete subscriptions.current[selectedRoom.id];
    }

    setSelectedRoom(newroom);
    setMessages([]);

    await chatService.updateUnread(newroom.id, newroom.userId);

    setChatRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === newroom.id ? { ...room, unreadCount: 0 } : room
      )
    );
    setChatRooms(await chatService.getAllChatRoom());
    setMessages(await chatService.getChatHistory(newroom.id));

    if (stompClient.current && isConnected) {
      const destination = `/topic/${newroom.id}`;

      const subscription = stompClient.current.subscribe(
        destination,
        (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, receivedMessage]);
        }
      );
      subscriptions.current[newroom.id] = subscription;
    }
    fetchRooms();
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !isConnected || !selectedRoom) return;

    const messageToSend = {
      roomId: selectedRoom.id.toString(),
      senderId: adminId,
      userId: selectedRoom.userId,
      adminId: adminId,
      content: inputMessage.trim(),
      sentAt: new Date().toISOString(),
    };

    stompClient.current.send(
      "/app/chat.sendMessage",
      {},
      JSON.stringify(messageToSend)
    );
    setInputMessage("");
    fetchRooms();
  };

  if (loading)
    return <div className="p-6 text-center">채팅방 목록 로딩 중...</div>;

  return (
    <div className="flex h-[80vh] antialiased bg-gray-100 p-6">
      <div className="flex w-full rounded-xl shadow-2xl overflow-hidden bg-white">
        <div className="flex-none w-80 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-800">
              활성 채팅 ({chatRooms.length})
            </h3>
          </div>

          <div className="overflow-y-auto flex-grow divide-y divide-gray-100">
            {chatRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => handleRoomSelect(room)}
                className={`p-4 cursor-pointer hover:bg-indigo-50 transition duration-150 
                                            ${
                                              selectedRoom?.id === room.id
                                                ? "bg-indigo-100 border-l-4 border-indigo-600"
                                                : ""
                                            }`}
              >
                <div className="flex justify-between items-center">
                  <div className="font-bold text-gray-800">{room.username}</div>
                  {room.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      {room.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate mt-1">
                  {room.lastMessage}
                </p>
                <p>{new Date(room.lastMessageAt).toLocaleTimeString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-auto flex flex-col">
          {selectedRoom ? (
            <>
              <div className="p-4 border-b bg-white shadow-sm">
                <div className="text-xl font-semibold text-gray-800">
                  <Link
                    to={`/admin/users/detail/${selectedRoom.userId}`}
                    state={{ from: "/a" }}
                  >
                    {selectedRoom.username}님과의 대화
                  </Link>
                </div>
                <p className="text-sm text-gray-500">
                  회원 ID: {selectedRoom.userId}
                </p>
              </div>

              <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50">
                {messages.map((msg, index) => (
                  <div key={index} className="chat-message">
                    {msg.senderId === adminId ? (
                      <div className="flex justify-end">
                        <div className="bg-indigo-500 text-white rounded-xl p-3 max-w-xs break-words shadow-md">
                          {msg.content}
                          <div className="text-xs mt-1 opacity-70 text-right">
                            {new Date(msg.sentAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-start">
                        <div className="bg-white text-gray-800 rounded-xl p-3 max-w-xs break-words shadow-md border border-gray-200">
                          <div className="font-semibold text-sm mb-1 text-indigo-600">
                            회원
                            <Link
                              to={`/admin/users/detail/${selectedRoom.userId}`}
                              state={{ from: "/a" }}
                            >
                              ({selectedRoom.username})
                            </Link>
                          </div>
                          {msg.content}
                          <div className="text-xs mt-1 opacity-70 text-right">
                            {new Date(msg.sentAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t bg-white flex">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="회원에게 메시지 보내기..."
                  disabled={!isConnected}
                  className="flex-grow border rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!isConnected}
                  className={`ml-2 rounded-xl text-white px-4 py-1 flex-shrink-0 transition duration-300 ${
                    isConnected
                      ? "bg-indigo-500 hover:bg-indigo-600"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  전송
                </button>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-full text-gray-500">
              좌측 목록에서 대화방을 선택해주세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChatPage;
