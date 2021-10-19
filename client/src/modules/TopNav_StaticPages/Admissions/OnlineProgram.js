import React from 'react';
import Footer from '../../../components/Footer/Footer';
import AppHeader from '../../../components/Header/AppHeader';
import './OnlineProgram.scss'
import { Link } from "react-router-dom";

function OnlineProgram() {
    return (
        <div>
            <AppHeader />

            <div align="left" style={{ padding: "5% 5% 5% 5%", align: "center" }}>
                <Link to={`/`} >
                    <p style={{ color: "#01498e",marginTop:"10px", fontSize: "small" }}>{`< Back To Home`}</p>
                </Link>

                <p className="headingStyle" >Online Program</p>
                <p className="subHeader">Admissions</p>
                <p className="contentStyle"  >For All the Post Graduate Diploma Programs across different specializations, you need to have formal qualifications - a Bachelors degree in the respective specialization from a UGC recognized University.
 <br />
For postgraduate degrees you will be required to hold a Bachelors degree from a UGC Recognized University.
 <br /> <br />
For all online studies with JSS Academy of Higher Education & Research (JSS AHER), you will need the following:
 <br /> <br />

   Medium of Instruction at Bachelors Degree to be in English.<br />
  Comfortable to work on a computer (Laptop/Desktop/Tablet/Smartphone) with broadband internet access.  This is vital for online learning.

 <br /> <br />
Next you should decide on the course you'd like to study.
<br /><br />
Click on Programs to see Programs that are available based on your specialization and Interest to learn further. <br /><br />

                </p>
                <p className="subHeader" >Application</p>
                <p className="contentStyle" >
                    Once you have decided on a course, then register with JSS AHER's easy application process.
</p>
                <p className="subHeader">How to apply</p>
                <p className="contentStyle" >
                    Enrolling with The JSS AHER's Online Education Program is quick and easy:<br /><br />
                </p>
                <ul className="listPoints">
                    <li>Register on our Online Learning Portal: <a href >Click here</a> to register on our online-learning portal</li>
                    <li>Choose your Program: View our Programs and choose them, based on your qualification and experience.</li>
                    <li>For all Instructor led programs, You can fill the application form by clicking the <strong>Apply Button</strong> on the specific program page.</li>
                    <li>Our Program Counsellors would validate your application:  You would get an e-mail confirmation on your registered mail address within 3 working days upon submitting your application.  The email would have a link to the payment gateway for you to make course fees payment</li>
                    <li>Start accessing Couse-1 of the Program/s): Next, we'll ask you to select your first Unit. (Note, unless completion of previous sub-topic, the platform would not allow you to navigate to the next sub-topic.</li>
                    <li>Start Learning: Welcome to JSS Academy of Higher Education & Research - Online Education Programme!</li>
                </ul>


            </div>

            <Footer />
        </div>
    )
}
export default OnlineProgram;