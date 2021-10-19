import React from 'react';
import ReactPlayer from "react-player";
import { FaBars } from "react-icons/fa";
import UserHeader from "../../components/Header/UserHeader/UserHeader";
import { awsSignIn, authData } from "../../redux/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { Constants } from "../../config/constants";
import config from "../../config/aws-exports";
import AppHeader from '../Header/AppHeader';
import Footer from '../Footer/Footer';
import QuickTourPreStyle from './QuickTour.module.scss'
function QuickTourPreLogin() {
  let userDetails = useSelector(authData);
  return (
    <div>

      <AppHeader />
      <div>
        <h2 className={QuickTourPreStyle.headingStyle} >Quick Tour</h2>
        <ReactPlayer
          url={`https://${config.DOMAIN}/jssaher-resources/videos/QUICKTOUR1.mp4`}
          controls={true}
          width="70%"
          height="70%"
          style={{ marginLeft: "15%" }}
        />
      </div>
      <Footer />
    </div>
  )
}

export default QuickTourPreLogin;