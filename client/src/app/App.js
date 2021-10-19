import React, { useEffect, useState } from "react";
import { API, Auth } from "aws-amplify";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Link } from "react-router-dom";

import { awsSignIn, authData, awsSignOut } from "../redux/auth/authSlice";
import config from "../config/aws-exports";
import { Constants } from "../config/constants";

import LandingScreen from "../components/LandingScreen/LandingScreen";

//import Constants from '../config/constants';
//import logo from './logo.svg';

import EventLayout from "../Layouts/EventLayout";
// import IndividualProgram from "../components/MyPrograms/IndividualProgram";

import MyApplicationLayout from "../Layouts/MyApplicationLayout";
import MyProgramsPreLogin from "../components/MyProgramsPreLogin/MyProgramsPreLogin";
import Warning from '../assets/svgjs/Warning';
import "./App.scss";
import Layout from "../components/HomeScreen/Dashboard/Layout";
import MyProgramsLayout from "../Layouts/MyProgramsLayout";
import CourseLayout from "../Layouts/CourseLayout";
import CoursePlayerLayout from "../Layouts/CoursePlayerLayout";
import IndividualProgramLayout from "../Layouts/IndividualProgramLayout";
import NotificationLayout from "../Layouts/NotificationLayout";
import ReportsAndAnalyticsLayout from "../Layouts/ReportsAndAnalyticsLayout";
import SyllabusLayout from "../Layouts/SyllabusLayout";
import AnnouncementsLayout from "../Layouts/AnnouncementsLayout";
import AcademicScheduleLayout from "../Layouts/AcademicScheduleLayout";
import ProgramInfoLayout from "../Layouts/ProgramInfoLayout";
import OnlineProgram from "../modules/TopNav_StaticPages/Admissions/OnlineProgram";
import AboutJSSAHER from "../modules/TopNav_StaticPages/AboutUs/AboutJSSAHER";
import AboutOnlineLearning from "../modules/TopNav_StaticPages/AboutUs/OnlineLearning";
import ContactUs from "../modules/TopNav_StaticPages/ContactUs/ContactUs";
import Faqs from "../modules/TopNav_StaticPages/Faq/Faq";
import Application from "../components/MyApplication/Application";
import AllPrograms from "../components/AllPrograms/AllPrograms";
import AllProgramsLayout from "../Layouts/AllProgramsLayout";
import AllProgramsInfoLayout from "../Layouts/ApplyProgramInfoLayout";
import FaqinsideLayout from "../Layouts/FaqinsideLayout";
import ApplicationLayout from "../Layouts/ApplicationLayout";
import QuickTourPreLogin from "../components/QuickTour/QuickTourPreLogin";
import QuickTourLayout from "../Layouts/QuickTourLayout";
import ReportsLayout from "../Layouts/ReportsLayout";
import LiveMeeting from "../components/LiveSession/LiveMeeting";
import LiveSessionLayout from "../Layouts/LiveSessionLayout";
import { useNavigatorStatus } from 'react-navigator-status';

function App() {
  const [api, setApi] = useState([{}]);
  const [user, setUser] = useState("");
  const userAuthStateValue = useSelector(authData);
  const dispatch = useDispatch();
  const isOnline = useNavigatorStatus();

  useEffect(() => {
    return () => {};
  }, []);

  async function signIn() {
    try {
      const user = await Auth.signIn("sumana@enhanzed.com", "qwerty@1");

      const info = await Auth.currentUserInfo();
      let userdata = user.attributes;
      userdata.username = user.username;
      userdata.id = info.id;
      setUser(JSON.stringify(userdata));
      dispatch(awsSignIn(userdata));
    } catch (error) {
      console.log("error signing in", error);
    }
  }

  function Home() {
    return (
      <div>
        <button onClick={signIn}>Login</button>
        <pre>{JSON.stringify(userAuthStateValue, null, 2)}</pre>
        <button
          onClick={() => {
            Auth.signOut();
            dispatch(awsSignOut());
          }}
        >
          signOut
        </button>
        <h1>Home</h1>
        <nav>
          <Link to="/">Home</Link>
          {" | "}
          <Link to="/LandingScreen">LandingScreen</Link>
          {" | "}
          <Link to="/about">About</Link>
          {" | "}
          <Link to="/dashboard">Dashboard </Link>
          {" | "}
          <Link to="/event">Events </Link>
          {" | "}
          <Link to="/MyPrograms/programs">Programs </Link>
          {" | "}
          <Link to="/myPrograms">Myprograms</Link>
          {" | "}
          <Link to="/course">Course</Link>
          {" | "}
          <Link to="/myProg">PreLogin</Link>
          {" | "}
          <Link to="/event">Event</Link>
        </nav>

        <div
          style={{ padding: 20, height: 300, width: "100%", overflow: "auto" }}
        ></div>
      </div>
    );
  }

  function About() {
    return (
      <div>
        <button
          onClick={() => {
            Auth.signOut();
            dispatch(awsSignOut());
          }}
        >
          signOut
        </button>
        <h1>About</h1>
        <nav>
          <Link to="/">Home</Link> {" | "}
          <Link to="/LandingScreen">LandingScreen</Link> {" | "}
          <Link to="/about">About</Link>
        </nav>
      </div>
    );
  }


  const Alert = ({ isOnline }) => {
    const [showAlert, setShowAlert] = React.useState(false);

    React.useEffect(() => {
      let isMounted = true;

      if (isOnline && showAlert && isMounted) {
        setShowAlert(true);

        setTimeout(() => {
          if (isMounted) {
            setShowAlert(false);
          }
        }, 4000);
      }

      if (!isOnline && isMounted) {
        setShowAlert(true);
      }

      return () => {
        isMounted = false;
      };
    }, [isOnline]);

    return (
      <div
        style={{
          fontFamily: `sans-serif`,
          fontWeight: "500",
          fontSize: "14px",
          padding: "5px 10px",
          width: "fit-content",
          height: "fit-content",
          position: "absolute",
          right: "35%",
          top: 10,
          zIndex: 1000,
          border: "1px solid red",
          borderRadius: "5px",
          background: "red"
        }}
      >
        {showAlert && (
          <div
            style={{
              color: 'white',
              background: isOnline ? `red` : 'red',
            }}
          ><Warning style={{ height: "4%", width: "4%" }} />{"  "}
            {isOnline
              ? `You are online`
              : `You are offline! Please check your connection`}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      {isOnline === false ? <Alert isOnline={isOnline} /> : null}
      <Routes>
        {userAuthStateValue === 0 ? (
          <>
            <Route path="/" element={<LandingScreen />} />
            <Route path="*" element={<LandingScreen />} />
            <Route path="/onlineProgram" element={<OnlineProgram />} />
            <Route path="/aboutJssaher" element={<AboutJSSAHER />} />
            <Route path="/aboutOEP" element={<AboutOnlineLearning />} />
            <Route path="/contactUs" element={<ContactUs />} />
            <Route path="/faqs" element={<Faqs />} />
            <Route path="/myProg" element={<MyProgramsPreLogin />} />
            <Route path="/quickTourPreLogin" element={<QuickTourPreLogin />} />
          </>
        ) : (
          <>
            <Route path="/quickTour" element={<QuickTourLayout />} />
            <Route path="/" element={<Layout />} />
            <Route path="/dashboard" element={<Layout />} />
            <Route path="/contactUs" element={<ContactUs />} />
            <Route path="/onlineProgram" element={<OnlineProgram />} />
            <Route path="/aboutJssaher" element={<AboutJSSAHER />} />
            <Route path="/aboutOEP" element={<AboutOnlineLearning />} />
            <Route path="/LandingScreen" element={<LandingScreen />} />
            <Route path="about" element={<About />} />

            {/* <Route path="/event" element={<Event />} /> */}
            <Route
              path="/MyPrograms/programs"
              element={<IndividualProgramLayout />}
            />

            <Route path="/myPrograms" element={<MyProgramsLayout />} />
            <Route path="/course" element={<CourseLayout />} />
            <Route path="/coursePlayer" element={<CoursePlayerLayout />} />
            <Route path="/myApplication" element={<MyApplicationLayout />} />
            <Route path="/faqs" element={<FaqinsideLayout />} />
            <Route path="/myProg" element={<MyProgramsPreLogin />} />
            <Route path="/event" element={<EventLayout />} />
            <Route path="/notification" element={<NotificationLayout />} />
            <Route
              path="/reportsAndAnalytics"
              element={<ReportsAndAnalyticsLayout />}
            />
            <Route
              path="myPrograms/programinfo"
              element={<ProgramInfoLayout />}
            />
            <Route path="/myPrograms/syllabus" element={<SyllabusLayout />} />
            <Route
              path="/myPrograms/announcements"
              element={<AnnouncementsLayout />}
            />
            <Route
              path="/myPrograms/academicSchedule"
              element={<AcademicScheduleLayout />}
            />
            <Route path="/reports" element={<ReportsLayout />} />
            {/* // <Route path="/myApplication/application" element={<Application />} /> */}
            <Route path="/allPrograms" element={<AllProgramsLayout />} />
            <Route path="/applyProgram" element={<AllProgramsInfoLayout />} />
            <Route
              path="/myApplication/application"
              element={<ApplicationLayout />}
            />
            <Route path="/eventView" element={<LiveSessionLayout />} />
            <Route path="/livemeeting" element={<LiveMeeting />} />
            <Route path="*" element={<LandingScreen />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;

// import React from 'react';

// import Layout from '../Layout';

// import './App.scss';

// function App() {
//   return (
//     <div>
//       <Layout />
//     </div>
//   );
// }

// export default App;
