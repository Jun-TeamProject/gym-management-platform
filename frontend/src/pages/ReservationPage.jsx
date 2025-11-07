import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import useAuthStore from "../stores/authStore";
import { ReservationApi } from "../services/reservationApi";
import ReservationModal from "../component/ReservationModal";

const ReservationPage = () => {
  const { user } = useAuthStore();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  const fetchReservations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await ReservationApi.getMyReservations(
        user.id,
        user.role
      );

      // FullCalendar
      const formattedEvents = response.data.content.map((res) => ({
        id: res.id,
        title:
          user.role === "TRAINER"
            ? `${res.member.username} 회원님`
            : `PT (${res.trainer.username})`,
        start: res.startTime,
        end: res.endTime,
        backgroundColor: getStatusColor(res.status),
        borderColor: getStatusColor(res.status),
        extendedProps: {
          status: res.status,
          memo: res.memo,
          memberId: res.member.id,
        },
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error(" ", error);
      alert(" ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchReservations();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#f59e0b";
      case "RESERVED":
        return "#10b981";
      case "COMPLETED":
        return "#6b7280";
      case "CANCELED":
        return "#ef4444";
      default:
        return "#3b82f6";
    }
  };

  const handleDateClick = (arg) => {
    if (user.role !== "MEMBER") return;

    if (arg.date < new Date(new Date().setHours(0, 0, 0, 0))) {
      alert("지난 날은 선택 할 수 없습니다.");
      return;
    }

    setSelectedTime(arg.date);
    setModalOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    const { id, title, extendedProps } = clickInfo.event;
    const status = extendedProps.status;
    // const memberId = extendedProps.memberId;

    let message = `[${title}]\n시간: ${clickInfo.event.start.toLocaleString()}\n상태: ${status}\n메모: ${
      extendedProps.memo || "없음"
    }`;

    if (user.role === "TRAINER" && status === "PENDING") {
      if (window.confirm(message + "\n\n 예약을 확정하시겠습니까?")) {
        ReservationApi.confirmReservation(id)
          .then(() => {
            alert("예약이 확정되었습니다. ");
            fetchReservations();
          })
          .catch((err) => {
            console.error("실패: ", err);
            alert("예약 확정에 실패했습니다.");
          });
      }
    } else if (
      status !== "COMPLETED" &&
      (user.role === "ADMIN" || user.id === clickInfo.event.member?.id)
    ) {
      if (window.confirm(message + "\n\n 예약을 취소 하시겠습니까?")) {
        ReservationApi.deleteReservation(id)
          .then(() => {
            alert("예약이 취소되었습니다. ");
            fetchReservations();
          })
          .catch((err) => {
            console.error("취소 실패: ", err);
            alert("예약 취소에 실패 했습니다.");
          });
      }
    } else {
      alert(message);
    }
  };

  const handleModalSubmit = () => {
    setModalOpen(false);
    fetchReservations();
  };

  return (
    <div className="reservation-page bg-white p-6 rounded-2xl shadow border">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
        📅 PT 예약 캘린더
      </h2>

      {loading && <p>캘린더 로딩 중...</p>}

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        editable={false}
        selectable={true}
        locale="ko"
        slotMinTime="08:00:00"
        slotMaxTime="23:00:00"
        allDaySlot={false}
        height="auto"
      />

      {modalOpen && (
        <ReservationModal
          initialTime={selectedTime}
          onClose={() => setModalOpen(false)}
          onSubmitSuccess={handleModalSubmit}
        />
      )}
    </div>
  );
};

export default ReservationPage;
