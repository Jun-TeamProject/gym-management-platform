import React from "react";
import Calender from '../component/Calender';
import Button from '../component/attendanceButton'

function HomePage() {
    return(
        <div className="">
            <div>
            {/* <h1>Homepage</h1>
            <a href="/login">login</a><br></br>
            <a href="/register">register</a> */}
                <Calender />
            </div>
            <div>
                <Button/>
            </div>
        </div>
    );
}

export default HomePage;