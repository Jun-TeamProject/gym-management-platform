import FullCalender from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState } from 'react';

const Calender = () => {
    const [events, setEvents] = useState([
        { title: '기존 미팅', date: '2025-11-03' },
        { title: '팀 회식', date: '2025-11-05' }
    ]);
    const handleDateClick = (info) => {
        const title = prompt(`메모를 입력하세요: `);
        if (title) {
            setEvents(prevEvents => [
                ...prevEvents,
                { title: title, date: info.dateStr, id: Date.now().toString() }
            ]);
        }
    }
    const handleEventClick = (info) => {
        const clickedEvent = info.event;
        const newTitle = prompt(`수정할 내용을 입력하세요: `, clickedEvent.title);

        if (newTitle !== null && newTitle !== clickedEvent.title) {
            clickedEvent.setProp('title', newTitle);
        }
    }
    return (
        <div>
            <FullCalender
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
                left: 'prev',
                center: 'title',
                right: 'next'
            }}
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            />
        </div>
    );
};
export default Calender;