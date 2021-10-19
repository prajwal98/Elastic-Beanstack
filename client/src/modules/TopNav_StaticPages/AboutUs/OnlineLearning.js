import React from 'react';
import Footer from '../../../components/Footer/Footer';
import AppHeader from '../../../components/Header/AppHeader';
import onlineLearn from '../../../assets/images/onlinelearn.jpg';
import './AboutUs.scss'
import { Link } from "react-router-dom";
function AboutOnlineLearning() {
    return (
        <div>
            <AppHeader />

            <div align="left" style={{ padding: "5% 5% 5% 5%", align: "center" }}>
                <Link to={`/`} >
                    <p style={{color: "#01498e",marginTop:"10px", fontSize: "small" }}>{`< Back To Home`}</p>
                </Link>

                <p style={{ marginLeft: "30px" }} className="headingStyle" >Online Program</p>
                <div align="left" style={{ margin: "30px 0 5px 0", maxWidth: "100%", minWidth: "700px" }}>
                    <img alt="" src={onlineLearn} style={{ objectFit: "cover", margin: "10px 0px 0 15px", width: "40%", height: "245px", float: "right" }}></img>
                    <p className="paraContent" >The 21st century has seen rapid progress with the Internet and online learning.  Technology can help Universities and Educational Institutions foster the learning process.  <br /><br />
Online Learning Platforms are now used as an aid to deliver e-content and to provide various possibilities for implementing asynchronous learning. Further, online learning is used extensively to complement face to face education. As a matter of fact, its use increases in a direct proportion with the increase of the number of students who enroll for a particular course. <br /><br />
Online learning helps the learners access interactive content that would have a significant effect on the process of learning. Online learning has grown in significance as an educational tool just like technology has developed and progressed over the years. Since successful learning requires that students be motivated to achieve the desired learning goals, efforts are being directed towards
advancing technology to attempt understand the needs and learning styles of individual learners, design online instructional environments in order to enhance students' learning. <br /><br />
Online learning has transformed the higher education sector by enabling students to share information and data, the digital way. <br /> <br />
It is said that the learning performance in an online learning environment is influenced by students' readiness to adopt this innovative learning approach.  The current day students', known as "Digital Natives", are exceedingly comfortable with this learning paradigm. <br /> <br />
We at JSS Academy of Higher Education & Research, believe in this online Education Paradigm and therefore have taken the step to embrace technology whole-heartedly by providing Digital Online Programs to stakeholders in the Academia and Industry.

<br /><br />
                    </p>
                </div>

            </div>

            <Footer />
        </div>
    )
}
export default AboutOnlineLearning;