import FullCalender from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState, useEffect, memo } from 'react';
import attendService from '../services/attend';
import authService from '../services/auth';
import calendarService from '../services/calendar';
import { useRef } from 'react';

const Calender = () => {
    const [events, setEvents] = useState([]);
    const [attendanceEvents, setAttendanceEvents] = useState([]);
    const [memoEvents, setMemoEvents] = useState([]);

    useEffect(() => {
        fetchAttendances();
    }, []);

    const calendarRef = useRef(null);

    const handleDateClick = async(info) => {//메모 생성(빈공간 클릭)
        const calendarApi = calendarRef.current.getApi();
        const eventsOnDate = calendarApi.getEvents().filter(event => {
            return event.startStr === info.dateStr; 
        });
        console.log(eventsOnDate.length);
        if (eventsOnDate.length > 0) {
            const firstTitle = eventsOnDate[0].title;
            if((firstTitle === "출석" || firstTitle === "결석")&&(eventsOnDate.length < 2)){
                const title = prompt(`메모를 입력하세요: `);
                if (title) {
                    setEvents(prevEvents => [
                        ...prevEvents,
                        { title: title, date: info.dateStr}
                    ]);
                    // calendarService.create({id: calendarService.id, title: title});
                    
                }
                return;
            }else{
                alert("이미 메모가 존재합니다");
                return; 
            }
            
        }
        const title = prompt(`메모를 입력하세요: `);
            if (title) {
                setEvents(prevEvents => [
                    ...prevEvents,
                    { title: title, date: info.dateStr}
                ]);
                // calendarService.create({id: calendarService.id, title: title});
            }
        // await fetchAttendances();
    }

    const handleEventClick = async(info) => {//메모 수정(메모 클릭)
        const clickedEvent = info.event;
        if(clickedEvent.title === "출석" || clickedEvent.title === "결석") return;
        const newTitle = prompt(`수정할 내용을 입력하세요: `, clickedEvent.title);

        if(newTitle === ''){
            clickedEvent.remove();
            // calendarService.delete({id: calendarService.id});
            alert("메모 삭제되었습니다");

        }

        if (newTitle !== null && newTitle !== clickedEvent.title) {
            clickedEvent.setProp('title', newTitle);
            // calendarService.update({title: newTitle, date: clickedEvent.Date});
        }
        // await fetchAttendances();
    }
    const attendanceRecords = [
        { id: 1 ,Date: "2025-11-01", isAttended: true, memo: "hieverone" },
        { id: 2, Date: "2025-11-03", isAttended: true, memo: "hieverone"},
        { id: 3, Date: "2025-11-04", isAttended: false, memo: "hieve" },
    ];
    const fetchAttendances = async () =>{//db내용 불러오기
        // console.log("update!");
        try {
            // const userId = authService.getCurrentUser()?.id;
            // const records = attendService.checkAttend(userId);
            
            const events = attendanceRecords.map(record => ({
                id: record.id,
                start: record.Date,
                title: record.isAttended === true ? '출석' : '결석',
                allDay: true,
                backgroundColor: record.isAttended === true ? 'green' : 'red', 
            }));

            setAttendanceEvents(events);

            const memos = attendanceRecords.map(record => ({
                // id: record.id, id필요없음.
                start: record.Date,
                title: record.memo,
                allDay: true,
            }));

            setMemoEvents(memos);

        } catch (error) {
            console.error("출석을 불러올 수 없습니다", error);
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
            ref={calendarRef}
            events={[...attendanceEvents, ...memoEvents, ...events]}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            />
        </div>
    );
};
export default Calender;