import React, { useState, useEffect } from "react";
import { API, JS } from "aws-amplify";

import { awsSignIn, authData } from "../../redux/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { Constants } from "../../config/constants";
import config from "../../config/aws-exports";
import myAppStyle from "./MyApplication.module.scss";

import SideNav from "../../modules/SideNav/SideNav";
import UserHeader from "../Header/UserHeader/UserHeader";
import { useNavigate, Link } from "react-router-dom";
import Approved from "../../assets/svgjs/Approved";
import UnderReview from "../../assets/svgjs/UnderReview";
import FillYourDetails from "../../assets/svgjs/FillYourDetails";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";

import UnderRevie from "./Under review.png";
import { FaBars } from "react-icons/fa";
const MyApplication = ({ handleToggleSidebar }) => {
  const [applicationData, setApplicationData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  let navigate = useNavigate();
  const dispatch = useDispatch();
  let userDetails = useSelector(authData);

  useEffect(() => {
    getMyApplication();
  }, []);

  async function getMyApplication() {
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        eid: userDetails.eid,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.GET_APPLICATION,
        bodyParam
      );
      const ApplicationJSON = response;
      setApplicationData(ApplicationJSON);
      console.log("Apply", ApplicationJSON);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  function cardClick(course) {
    let sdata = { ...userDetails };
    sdata.applypid = course.pid;
    sdata.applybpid = course.bpid;

    dispatch(awsSignIn(sdata));

    navigate("/applyProgram");
  }

  return (
    <main>
      <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
        <FaBars />
      </div>
      <UserHeader />
      <div className="container" style={{ height: "100vh" }}>
        <h3
          style={{
            color: "black",
            marginLeft: "6px",
            fontSize: "20px",
            paddingTop: "30px",
            paddingBottom: "-10px",
          }}
        >
          My Application
        </h3>
        <Typography component="div" variant="rect">
          {isLoading ? <Skeleton width={1100} height={200} /> : null}
        </Typography>
        <Typography component="div" variant="rect">
          {isLoading ? <Skeleton width={1100} height={200} /> : null}
        </Typography>
        <Typography component="div" variant="rect">
          {isLoading ? <Skeleton width={1100} height={200} /> : null}
        </Typography>
        <Typography component="div" variant="rect">
          {isLoading ? <Skeleton width={1100} height={200} /> : null}
        </Typography>
        {applicationData.map((program) => {
          return (
            <div className={myAppStyle.program}>
              <div
                className={myAppStyle.program__img}
                style={{
                  cursor: "pointer",
                  backgroundImage: `url('https://${
                    config.DOMAIN
                  }/${config.aws_org_id.toLowerCase()}-resources/images/program-images/${
                    program.pid
                  }.png')`,
                }}
              ></div>
              <div className={myAppStyle.program__details}>
                <div className="h1">
                  <h1
                    style={{
                      fontWeight: "bolder",
                      fontSize: "large",
                      paddingLeft: "10px",
                    }}
                  >
                    {program.pname}
                  </h1>
                </div>
                <div className={myAppStyle.program_info__container}>
                  <FillYourDetails
                    className={
                      program.pstatus >= 1
                        ? myAppStyle.fillYourDetailsIcon
                        : myAppStyle.fillYourDetailsIconDis
                    }
                  />
                  <p
                    style={{
                      marginTop: "80px",
                      marginRight: "-8px",
                      marginLeft: "-55px",
                      width: "50px",
                      whiteSpace: "nowrap",
                      fontSize: "small",
                    }}
                  >
                    Fill Your Details
                  </p>
                  <div className={myAppStyle.hr_line}></div>
                  <UnderReview
                    className={
                      program.pstatus >= 2
                        ? myAppStyle.overviewIcon
                        : myAppStyle.overviewIconDis
                    }
                  />
                  <p
                    style={{
                      marginTop: "80px",
                      marginRight: "-20px",
                      marginLeft: "-60px",
                      whiteSpace: "nowrap",
                      fontSize: "small",
                    }}
                  >
                    Under Review
                  </p>
                  <div className={myAppStyle.hr_line}></div>
                  <Approved
                    className={
                      program.pstatus >= 3
                        ? myAppStyle.approvedIcon
                        : myAppStyle.approvedIconDis
                    }
                  />
                  <p
                    style={{
                      marginTop: "80px",
                      marginRight: "-8px",
                      marginLeft: "-51px",
                      whiteSpace: "nowrap",
                      fontSize: "small",
                    }}
                  >
                    Approved
                  </p>

                  <a
                    onClick={() => {
                      cardClick(program);
                    }}
                    style={{
                      marginLeft: "80px",
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                      marginRight: "50px",
                      textDecoration: " underline",
                      fontSize: "medium",
                    }}
                  >
                    Open
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default MyApplication;
