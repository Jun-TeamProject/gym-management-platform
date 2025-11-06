import FullCalender from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState, useEffect, memo } from 'react';
import attendService from '../services/attend';
import authService from '../services/auth';
import calendarService from '../services/calendar';
import AttendanceButton from './attendanceButton';
import { useRef } from 'react';

const Calender = () => {
    const [events, setEvents] = useState([]);
    const [attendanceEvents, setAttendanceEvents] = useState([]);
    const [memoEvents, setMemoEvents] = useState([]);

    useEffect(() => {
        // fetchAttendances();
    }, []);

    const calendarRef = useRef(null);
    
    const handleDatesSet = (dateInfo) => {
        const dateObject = dateInfo.view.currentStart; 
    
        const year = dateObject.getFullYear();
        const month = dateObject.getMonth() + 1; 

        const formattedYearMonth = `${year}-${String(month).padStart(2, '0')}`;
        // console.log("현재 뷰의 연도-월:", formattedYearMonth); 
    
        fetchAttendances(formattedYearMonth);
    };

    const handleDateClick = async(info) => {//메모 생성(빈공간 클릭)
        const YearMonth = (info.dateStr).substring(0,7);
        const calendarApi = calendarRef.current.getApi();
        const eventsOnDate = calendarApi.getEvents().filter(event => {
            return event.startStr === info.dateStr; 
        });
        // console.log(eventsOnDate.length);
        if (eventsOnDate.length > 0) {
            const firstTitle = eventsOnDate[0].title;
            if((firstTitle === "출석" || firstTitle === "결석")&&(eventsOnDate.length < 2)){
                const title = prompt(`메모를 입력하세요: `);
                if (title) {
                    // setEvents(prevEvents => [
                    //     ...prevEvents,
                    //     { title: title, date: info.dateStr}
                    // ]);
                    await calendarService.update({date: info.dateStr},{memo: title});
                }
                fetchAttendances(YearMonth);
                return;
            }else{
                alert("이미 메모가 존재합니다");
                return; 
            }
            
        }
        const title = prompt(`메모를 입력하세요: `);
            if (title) {
                // setEvents(prevEvents => [
                //     ...prevEvents,
                //     { title: title, date: info.dateStr}
                // ]);
                await calendarService.update(info.dateStr,{memo: title});
            }
        await fetchAttendances(YearMonth);
    }

    const handleEventClick = async(info) => {//메모 수정(메모 클릭)
        const clickedEvent = info.event;
        // console.log(clickedEvent);
        const clickedDate = clickedEvent.startStr;
        // console.log(clickedDate)
        const YearMonth = clickedDate.substring(0,7);
        if(clickedEvent.title === "출석" || clickedEvent.title === "결석") return;
        const newTitle = prompt(`수정할 내용을 입력하세요: `, clickedEvent.title);

        if(newTitle === ''){
            // clickedEvent.remove();
            await calendarService.update(clickedDate,{memo: newTitle});
            alert("메모 삭제되었습니다");
        }

        if (newTitle !== null && newTitle !== clickedEvent.title) {
            // clickedEvent.setProp('title', newTitle);
            await calendarService.update(clickedDate, {memo: newTitle});
        }
        await fetchAttendances(YearMonth);
    }
    const fetchAttendances = async (info) =>{//db내용 불러오기
        // console.log("update!");
        // console.log(info);
        try {
            // const userId = authService.getCurrentUser()?.id;
            const records = await attendService.checkAttend(info);
            const presentRecords = records.filter(
                record => record.status === 'PRESENT'
            );
            const events = presentRecords.map(record => ({
                id: record.id,
                start: record.logDate,
                title: '<출석>',
                allDay: true,
                backgroundColor: 'green', 
            }));

            setAttendanceEvents(events);

            const memos = records.map(record => ({
                // id: record.id, id필요없음.
                start: record.logDate,
                title: record.memo,
                allDay: true,
            }));

            setMemoEvents(memos);

        } catch (error) {
            console.error("출석을 불러올 수 없습니다", error);
        }
    }
    return (
        <div className='flex justify-center'>
            <div className='w-full max-w-1xl lg:max-w-5xl p-4 bg-white rounded-xl shadow-2xl border border-gray-100'>
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
                datesSet={handleDatesSet}//얘가 제공하는 info랑
                dateClick={handleDateClick}//얘랑 밑에꺼가 제공하는 info 형태가 다르니 주의..
                eventClick={handleEventClick}
                />
                <div className="flex justify-center mt-8">
                    <AttendanceButton />
                </div>
            </div>
        </div>
    );
};
export default Calender;