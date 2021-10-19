import React from "react";
import ReactPlayer from "react-player";
import { FaBars } from "react-icons/fa";
import UserHeader from "../../components/Header/UserHeader/UserHeader";
import { awsSignIn, authData } from "../../redux/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { Constants } from "../../config/constants";
import config from "../../config/aws-exports";

function QuickTour({ handleToggleSidebar }) {
  let userDetails = useSelector(authData);
  return (
    <div>
      <div>
        <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
          <FaBars />
        </div>
        <UserHeader />
        <ReactPlayer
          url={`https://${
            config.DOMAIN
          }/${config.aws_org_id.toLowerCase()}-resources/videos/QuickTour2.mp4`}
          controls={true}
          width="70%"
          height="70%"
          style={{ marginTop: "6%", marginLeft: "15%" }}
        />
      </div>
    </div>
  );
}

export default QuickTour;
