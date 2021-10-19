import React, { useState, useEffect } from "react";
import { API, JS } from "aws-amplify";

import { awsSignIn, authData } from "../../redux/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { Constants } from "../../config/constants";
import config from "../../config/aws-exports";
import { FaBars } from "react-icons/fa";
import { Tab } from "semantic-ui-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Card from "@material-ui/core/Card";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import UserHeader from "../Header/UserHeader/UserHeader";
import { useNavigate, Link } from "react-router-dom";

import i1 from "../../assets/images/i1.jpg";
import i2 from "../../assets/images/i2.jpg";
import i3 from "../../assets/images/i3.png";
import AllProgStyle from "./AllPrograms.module.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .slick-arrow": {
      color: "black",
    },
    "& .slick-prev:before": {
      color: "revert",
    },
    "& .slick-next:before": {
      color: "revert",
    },
  },
  paper: {
    padding: theme.spacing(2),
    //width:"360px",
    color: theme.palette.text.secondary,
    marginLeft: "15%",
  },
}));

function AllPrograms({ handleToggleSidebar }) {
  const classes = useStyles();
  const [ApplicationCate, setApplicationCate] = useState({});
  const [certificateData, setCertificateData] = useState([]);
  const [diplomaData, setDiplomaData] = useState([]);
  const [graduateData, setGraduateData] = useState([]);
  const [pgDiplomaData, setPgDiplomaData] = useState([]);
  const [underGraduateData, setUnderGraduateData] = useState([]);

  let navigate = useNavigate();
  const dispatch = useDispatch();
  let userDetails = useSelector(authData);

  useEffect(() => {
    getMyApplicationList();
  }, []);

  async function getMyApplicationList() {
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.ALL_PROGRAM,
        bodyParam
      );
      const ApplicationJSON = response;
      setApplicationCate(ApplicationJSON);
      setCertificateData(ApplicationJSON.certificate);
      setDiplomaData(ApplicationJSON.diploma);
      setGraduateData(ApplicationJSON.graduate);
      setPgDiplomaData(ApplicationJSON.pgdiploma);
      setUnderGraduateData(ApplicationJSON.undergraduate);
      console.log("Apply1", ApplicationJSON);
    } catch (error) {
      console.error(error);
    }
  }
  /*  console.log("1",certificateData);
   console.log("2",diplomaData);
   console.log("3",graduateData);
   console.log("4",pgDiplomaData);
   console.log("5",underGraduateData); */

  function cardClick(course) {
    let sdata = { ...userDetails };
    sdata.applypid = course.pid;
    sdata.applybpid = course.bpid;

    dispatch(awsSignIn(sdata));

    navigate("/applyProgram");
  }

  const panes = [
    {
      menuItem: "Certificate",
      render: () => (
        <Tab.Pane>
          <div className="row">
            <div className="row">
              {certificateData.length === 0 ? (
                <h2 style={{ marginLeft: "650px" }}>No courses</h2>
              ) : (
                certificateData.map((course) => {
                  <div style={{ width: "350px", marginTop: "70px" }}>
                    <div
                      onClick={() => {
                        cardClick(course);
                      }}
                    >
                      <Card className={AllProgStyle.card}>
                        <img
                          style={{
                            backgroundImage: `url('https://${
                              config.DOMAIN
                            }/${config.aws_org_id.toLowerCase()}-resources/images/program-images/${
                              course.pid
                            }.png')`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                          }}
                          alt=""
                          className={AllProgStyle.imageCard} /* src={i3} */
                        />
                        <p
                          className={AllProgStyle.topicName}
                          style={{ marginTop: "250px" }}
                        >
                          {" "}
                          {course.pname}
                        </p>
                      </Card>
                    </div>
                  </div>;
                })
              )}
            </div>
          </div>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Diploma",
      render: () => (
        <Tab.Pane>
          <div className="row">
            <div className="row">
              {diplomaData.length === 0 ? (
                <h2 style={{ marginLeft: "650px" }}>No courses</h2>
              ) : (
                diplomaData.map((course) => {
                  return (
                    <div style={{ width: "350px", marginTop: "70px" }}>
                      <div
                        onClick={() => {
                          cardClick(course);
                        }}
                      >
                        <Card className={AllProgStyle.card}>
                          <img
                            style={{
                              backgroundImage: `url('https://${
                                config.DOMAIN
                              }/${config.aws_org_id.toLowerCase()}-resources/images/program-images/${
                                course.pid
                              }.png')`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                            }}
                            alt=""
                            className={AllProgStyle.imageCard} /* src={i3} */
                          />
                          <p
                            className={AllProgStyle.topicName}
                            style={{ marginTop: "250px" }}
                          >
                            {" "}
                            {course.pname}
                          </p>
                        </Card>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "PG Diploma",
      render: () => (
        <Tab.Pane>
          <div className="row">
            <div className="row">
              {pgDiplomaData.length === 0 ? (
                <h2 style={{ marginLeft: "650px" }}>No courses</h2>
              ) : (
                pgDiplomaData.map((course) => {
                  return (
                    <div style={{ width: "350px", marginTop: "70px" }}>
                      <div
                        onClick={() => {
                          cardClick(course);
                        }}
                      >
                        <Card className={AllProgStyle.card}>
                          <img
                            style={{
                              backgroundImage: `url('https://${
                                config.DOMAIN
                              }/${config.aws_org_id.toLowerCase()}-resources/images/program-images/${
                                course.pid
                              }.png')`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                            }}
                            alt=""
                            className={AllProgStyle.imageCard} /* src={i3} */
                          />
                          <p
                            className={AllProgStyle.topicName}
                            style={{ marginTop: "250px" }}
                          >
                            {" "}
                            {course.pname}
                          </p>
                        </Card>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Under Graduate",
      render: () => (
        <Tab.Pane>
          <div className="row">
            <div className="row">
              {underGraduateData.length === 0 ? (
                <h2 style={{ marginLeft: "650px" }}>No courses</h2>
              ) : (
                underGraduateData.map((course) => {
                  return (
                    <div style={{ width: "350px", marginTop: "70px" }}>
                      <div
                        onClick={() => {
                          cardClick(course);
                        }}
                      >
                        <Card className={AllProgStyle.card}>
                          <img
                            style={{
                              backgroundImage: `url('https://${
                                config.DOMAIN
                              }/${config.aws_org_id.toLowerCase()}-resources/images/program-images/${
                                course.pid
                              }.png')`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                            }}
                            alt=""
                            className={AllProgStyle.imageCard} /* src={i3} */
                          />
                          <p
                            className={AllProgStyle.topicName}
                            style={{ marginTop: "250px" }}
                          >
                            {" "}
                            {course.pname}
                          </p>
                        </Card>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Graduate",
      render: () => (
        <Tab.Pane>
          <div className="row">
            <div className="row">
              {graduateData.length === 0 ? (
                <h2>No courses</h2>
              ) : (
                graduateData.map((course) => {
                  return (
                    <div style={{ width: "350px", marginTop: "70px" }}>
                      <div
                        onClick={() => {
                          cardClick(course);
                        }}
                      >
                        <Card className={AllProgStyle.card}>
                          <img
                            style={{
                              backgroundImage: `url('https://${
                                config.DOMAIN
                              }/${config.aws_org_id.toLowerCase()}-resources/images/program-images/${
                                course.pid
                              }.png')`,

                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                            }}
                            alt=""
                            className={AllProgStyle.imageCard} /* src={i3} */
                          />
                          <p
                            className={AllProgStyle.topicName}
                            style={{ marginTop: "250px" }}
                          >
                            {" "}
                            {course.pname}
                          </p>
                        </Card>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </Tab.Pane>
      ),
    },
  ];

  return (
    <main>
      <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
        <FaBars />
      </div>
      <div>
        <UserHeader />
        <div style={{ height: "100vh" }}>
          <div>
            <h1>Application</h1>
          </div>

          <Tab panes={panes} />
        </div>
      </div>
    </main>
  );
}

export default AllPrograms;
