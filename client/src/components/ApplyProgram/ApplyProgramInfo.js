import React, { useEffect, useState } from "react";
import { Tab } from "semantic-ui-react";
import { Rating } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import { awsSignIn, authData } from "../../redux/auth/authSlice";
import InstructorsCard from "../../modules/Cards/Instructors/InstructorsCard";
//import "./ApplyProgramInfo.scss";
import "../../modules/Tabs/Tabs.scss";
import AppHeader from "../Header/AppHeader";
import config from "../../config/aws-exports";
import { Constants } from "../../config/constants";
import { API } from "aws-amplify";
import bio from "../../assets/images/P1 - PG Diploma in bioinformatics.jpg";
import { Link, useNavigate } from "react-router-dom";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import Rupee from "../../assets/svgjs/Rupee";
import PlaceholderParagraph from "../../modules/Placeholder/PlaceholderParagraph";

import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import ClockOrange from "../../assets/svgjs/ClockOrange";

import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import UserHeader from "../Header/UserHeader/UserHeader";
import Card from "@material-ui/core/Card";

import ApplyProgramInfoStyle from "./ApplyProgramInfo.module.scss";

export default function ApplyProgramInfo() {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  let userDetails = useSelector(authData);

  const [activeIndex, setActiveIndex] = useState(0);
  const [programsJSON, setProgramsJSON] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      "& .MuiAccordionDetails-root": {
        display: "block",
      },
    },
    heading: {
      fontSize: theme.typography.pxToRem(13),
      fontWeight: theme.typography.fontWeightRegular,
    },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      border: "none",
      transform: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,

      height: "400px",
      width: "600px",
      borderRadius: "4px",
      border: "none",
      padding: theme.spacing(2, 4, 3),
    },
  }));

  /*  handleTabChange = (e, { activeIndex }) => this.setState({ activeIndex }); */
  useEffect(() => {
    getProgramsDetails();
  }, []);

  async function getProgramsDetails() {
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        pid: userDetails.applypid,
        bpid: userDetails.applybpid,
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
        Constants.GET_PROGRAM,
        bodyParam
        //`${Constants.GET_MY_PROGRAMS}`, bodyParam,
      );
      const programsJSON = response;
      console.log(programsJSON);
      setProgramsJSON(programsJSON);
      setIsLoading(false);
    } catch (error) {
      console.log("getCategoryError", error);
    }
    console.log("Mount");
  }

  const classes = useStyles();

  function selectType() {
    const handleClose = () => {
      setOpen(false);
    };
    return (
      <>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              <span
                style={{ float: "right", cursor: "pointer" }}
                onClick={() => {
                  handleClose();
                }}
              >
                x
              </span>

              <div style={{ display: "flex" }}>
                <div style={{ width: "350px", marginTop: "70px" }}>
                  <Card
                    className="{AllProgStyle.card}"
                    style={{ height: "250px" }}
                  >
                    <button
                      style={{
                        marginTop: "60px",
                        marginLeft: "70px",
                        width: "100px",
                      }}
                      onClick={applyEvbabApplication}
                      className="evbab"
                    >
                      e-VBAB
                    </button>

                    <p
                      style={{
                        fontSize: "small",
                        paddingLeft: "15px",
                        paddingRight: "15px",
                        marginTop: "10px",
                      }}
                    >
                      e-VBAB Network Project is completely funded by Government
                      of India. It is open for participation to all India’s
                      partner countries in Africa. This project will provide
                      free tele-education courses to 4000 students every year
                      from African countries
                    </p>
                  </Card>
                </div>
                <div style={{ width: "350px", marginTop: "70px" }}>
                  <Card
                    className="{AllProgStyle.card}"
                    style={{ height: "250px" }}
                  >
                    <button
                      style={{
                        marginTop: "60px",
                        marginLeft: "70px",
                        width: "100px",
                      }}
                      onClick={applyNonEvbabApplication}
                      className="evbab"
                    >
                      Non e-VBAB
                    </button>

                    <p
                      style={{
                        fontSize: "small",
                        paddingLeft: "15px",
                        paddingRight: "15px",
                        marginTop: "10px",
                      }}
                    >
                      Registration for all Indian Students
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </Fade>
        </Modal>
      </>
    );
  }

  const panes = [
    {
      menuItem: "Overview",
      render: () => (
        <Tab.Pane className={ApplyProgramInfoStyle.overview}>
          {isLoading ? (
            <PlaceholderParagraph />
          ) : (
            <p
              className={ApplyProgramInfoStyle.p_text}
              dangerouslySetInnerHTML={{ __html: programsJSON.poverview }}
            ></p>
          )}
          <div></div>
          <div>
            <h2 className={ApplyProgramInfoStyle.h2_margin}>
              Program features
            </h2>
            {isLoading ? (
              <div style={{ width: "100%", overflow: "hidden" }}>
                <PlaceholderParagraph />
              </div>
            ) : (
              <p
                className={ApplyProgramInfoStyle.p_text}
                dangerouslySetInnerHTML={{ __html: programsJSON.pfeatures }}
              ></p>
            )}
          </div>
          <hr />
          <div>
            <h2 className={ApplyProgramInfoStyle.h2_margin}>
              Program outcomes
            </h2>
            {isLoading ? (
              <PlaceholderParagraph />
            ) : (
              <p
                className={ApplyProgramInfoStyle.p_text}
                dangerouslySetInnerHTML={{ __html: programsJSON.poutcomes }}
              ></p>
            )}
          </div>
        </Tab.Pane>
      ),
    },
    // {
    //   menuItem: "Instructors",
    //   render: () => (
    //     <Tab.Pane>
    //       <div>
    //         <div>
    //           <div className="instructors">
    //             <div className="instructors__h1">
    //               <h2 style={{ marginLeft: "20px", marginTop: "20px" }}>
    //                 Program coordinators
    //               </h2>
    //             </div>
    //             <div>
    //               <div
    //                 className="card-container"
    //                 style={{ float: "left", marginLeft: "50px" }}
    //               >
    //                 {programsJSON.pinstructors.map(
    //                   ({ name, designation, org, pic }, idx) => (
    //                     <InstructorsCard
    //                       key={idx}
    //                       name={name}
    //                       designation={designation}
    //                       org={org}
    //                       pic={pic}
    //                       pid={programsJSON.pid}
    //                     />
    //                   )
    //                 )}
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //         <div>
    //           {programsJSON.ccoordinator === undefined ? (
    //             <div></div>
    //           ) : (
    //             <div className="instructors">
    //               <div className="instructors__h1">
    //                 <h2 style={{ marginLeft: "20px", marginTop: "20px" }}>
    //                   Course coordinators
    //                 </h2>
    //               </div>
    //               <div>
    //                 <div
    //                   className="card-container"
    //                   style={{ float: "left", marginLeft: "50px" }}
    //                 >
    //                   {programsJSON.ccoordinator.map(
    //                     ({ name, designation, org, pic }, idx) => (
    //                       <InstructorsCard
    //                         key={idx}
    //                         name={name}
    //                         designation={designation}
    //                         org={org}
    //                         pic={pic}
    //                         pid={programsJSON.pid}
    //                       />
    //                     )
    //                   )}
    //                 </div>
    //               </div>
    //             </div>
    //           )}
    //         </div>
    //         {programsJSON.cmentor === undefined ? null : (
    //           <div className="instructors">
    //             <div className="instructors__h1">
    //               <h2 style={{ marginLeft: "20px", marginTop: "20px" }}>
    //                 Course Mentor
    //               </h2>
    //             </div>
    //             <div>
    //               <div
    //                 className="card-container"
    //                 style={{ float: "left", marginLeft: "50px" }}
    //               >
    //                 {programsJSON.cmentor.map(
    //                   ({ name, designation, org, pic }, idx) => (
    //                     <InstructorsCard
    //                       key={idx}
    //                       name={name}
    //                       designation={designation}
    //                       org={org}
    //                       pic={pic}
    //                       pid={programsJSON.pid}
    //                     />
    //                   )
    //                 )}
    //               </div>
    //             </div>
    //           </div>
    //         )}
    //       </div>
    //     </Tab.Pane>
    //   ),
    // },
    {
      menuItem: "Curriculum",
      render: () => (
        <Tab.Pane>
          {programsJSON
            ? programsJSON.pcurriculum.map(
                ({ tlabel, tduration, ttitle, tunits, tid }) => (
                  <div className={ApplyProgramInfoStyle.pcurriculum}>
                    <div className={ApplyProgramInfoStyle.courses_container}>
                      <div className={ApplyProgramInfoStyle.ID_container}>
                        <div
                          className={ApplyProgramInfoStyle.image_container}
                          style={{
                            backgroundImage: `url('https://${
                              config.DOMAIN
                            }/${config.aws_org_id.toLowerCase()}-resources/images/topic-images/${tid}.png')`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                          }}
                        ></div>
                        <div
                          className={ApplyProgramInfoStyle.details_container}
                        >
                          <div>
                            <h3
                              style={{ fontSize: "15px", marginBottom: "10px" }}
                            >
                              {tlabel}
                            </h3>
                            <h2
                              style={{ fontSize: "15px", fontWeight: "bold" }}
                            >
                              {ttitle}
                            </h2>
                          </div>
                          <div>
                            <p style={{ marginTop: "-12px" }}>
                              <span>
                                <ClockOrange
                                  className={
                                    ApplyProgramInfoStyle.clock_size__s
                                  }
                                  cls1={ApplyProgramInfoStyle.cls1_s}
                                  cls2={ApplyProgramInfoStyle.cls2_s}
                                />
                              </span>
                              <span style={{ fontSize: "small" }}>
                                {tduration} Weeks
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                      {tunits.map((units) => (
                        <div>
                          <p className={ApplyProgramInfoStyle.tunits}>
                            {units}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )
            : null}
        </Tab.Pane>
      ),
    },
    // {
    //   menuItem: "FAQs",
    //   render: () => (
    //     <Tab.Pane>
    //       {programsJSON
    //         ? programsJSON.pfaq.map(({ title, questions }, idx) => (
    //             <div className={classes.root} key={idx}>
    //               <Accordion>
    //                 <AccordionSummary
    //                   expandIcon={<ExpandMoreIcon />}
    //                   aria-controls="panel1a-content"
    //                   id="panel1a-header"
    //                 >
    //                   <Typography className={classes.heading}>
    //                     <h2 style={{ fontSize: "16px" }}>{title}</h2>
    //                   </Typography>
    //                 </AccordionSummary>
    //                 <AccordionDetails>
    //                   {questions.map(({ ques, ans }, id) => (
    //                     <div className={classes.root} key={id}>
    //                       <Accordion>
    //                         <AccordionSummary
    //                           expandIcon={<ExpandMoreIcon />}
    //                           aria-controls="panel1a-content"
    //                           id="panel1a-header"
    //                         >
    //                           <h3 style={{ fontSize: "15px" }}>{ques}</h3>
    //                         </AccordionSummary>
    //                         <AccordionDetails>
    //                           <Typography style={{ fontSize: "14px" }}>
    //                             {ans}
    //                           </Typography>
    //                         </AccordionDetails>
    //                       </Accordion>
    //                     </div>
    //                   ))}
    //                 </AccordionDetails>
    //               </Accordion>
    //             </div>
    //           ))
    //         : null}
    //     </Tab.Pane>
    //   ),
    // },
  ];

  function renderButton() {
    // let programButton = (
    //   <button
    //     className={ApplyProgramInfoStyle.btn_color}
    //     onClick={() => {
    //       setOpen(true);
    //     }}
    //   >
    //     Apply
    //   </button>
    // );

    let programButton = null;

    if (programsJSON.enrolled == false || programsJSON.enrolled == "false") {
      if (programsJSON.etype == 1 || programsJSON.etype == "1") {
        if (programsJSON.pstatus == 0 || programsJSON.pstatus == "0") {
          // programButton = (
          //   <button
          //     style={{
          //       fontSize: "18px",
          //       fontWeight: "bold",
          //       width: "100px",
          //       borderRadius: "6px",
          //       height: "30px",
          //     }}
          //     className={ApplyProgramInfoStyle.btn_color}
          //     onClick={() => {
          //       setOpen(true);
          //     }}
          //   >
          //     Apply
          //   </button>
          // );
          programButton = null;
        }
        if (programsJSON.pstatus == 1 || programsJSON.pstatus == "1") {
          // programButton = (
          //   <button
          //     className={ApplyProgramInfoStyle.btn_color}
          //     onClick={continueApplication}
          //     style={{
          //       fontSize: "18px",
          //       fontWeight: "bold",
          //       width: "200px",
          //       borderRadius: "6px",
          //       height: "50px",
          //     }}
          //   >
          //     Continue Application
          //   </button>
          // );
          programButton = null;
        }
        if (programsJSON.pstatus == 2 || programsJSON.pstatus == "2") {
          programButton = (
            <button
              className={ApplyProgramInfoStyle.btn_color}
              style={{
                fontSize: "15px",
                fontWeight: "bold",
                width: "150px",
                borderRadius: "6px",
                height: "30px",
              }}
            >
              Under Review
            </button>
          );
        }
        if (programsJSON.pstatus == 3 || programsJSON.pstatus == "3") {
          programButton = (
            <button
              className={ApplyProgramInfoStyle.btn_color}
              onClick={startProgram}
              style={{
                fontSize: "15px",
                fontWeight: "bold",
                width: "100px",
                borderRadius: "6px",
                height: "30px",
              }}
            >
              Start
            </button>
          );
        }
      } else {
        programButton = (
          <button
            className={ApplyProgramInfoStyle.btn_color}
            onClick={startProgram}
            style={{
              fontSize: "15px",
              fontWeight: "bold",
              width: "100px",
              borderRadius: "6px",
              height: "30px",
            }}
          >
            Start
          </button>
        );
      }
    } else {
      programButton = (
        <button
          className={ApplyProgramInfoStyle.btn_color}
          onClick={continueLearning}
          style={{
            fontSize: "15px",
            fontWeight: "bold",
            width: "200px",
            borderRadius: "6px",
            height: "30px",
          }}
        >
          Continue Learning
        </button>
      );
    }

    return programButton;
  }

  async function applyEvbabApplication() {
    // localStorage.setItem("eVBAB", false);
    setIsLoading(true);
    const bodyParam = {
      body: {},
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.GCP_RESPONSE,
        bodyParam
        //`${Constants.GET_MY_PROGRAMS}`, bodyParam,
      );

      let json = JSON.stringify(response);

      let ptoken = json.toString();

      ptoken = JSON.parse(ptoken);

      getprofileresponse(ptoken.token);
    } catch (error) {
      console.log("getCategoryError", error);
    }
    console.log("Mount");
  }

  async function getprofileresponse(token) {
    // localStorage.setItem("eVBAB", false);
    setIsLoading(true);
    const bodyParam = {
      body: {},
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.GET_HTTP_RESPONSE,
        bodyParam
        //`${Constants.GET_MY_PROGRAMS}`, bodyParam,
      );
      setIsLoading(false);

      var json = JSON.stringify(response);

      var presonse = json.toString();
      try {
        presonse = JSON.parse(presonse).replace(")]}'", "");
        presonse = JSON.parse(presonse);

        var msg = JSON.parse(presonse.payload);
        // alert(msg.message)
        if (msg.message != "Successful") {
          alert(
            "To apply for scholarship, you need to register in the  https://ilearn.gov.in iLearn portal first"
          );
          // swal({
          //     html:
          //     '<p style="color:#484848">To apply for scholarship,<br> you need to register in the  <a href="https://ilearn.gov.in" target="_blank">iLearn portal</a> first</p>',
          //     // text: "To apply for scholarship, you need to register in the iLearn portal first",
          // type: "warning", width: '400px',
          // showConfirmButton: true, confirmButtonText: 'Ok', confirmButtonColor: "#E77C2D" });
          // $scope.drpscholarship.drpval = 'No';
        } else {
          let sdata = { ...userDetails };

          sdata.evbab = true;
          sdata.evbabdata = msg;
          sdata.pid = programsJSON.pid;
          sdata.bpid = programsJSON.bpid;
          sdata.pname = programsJSON.pname;
          sdata.applicationid = undefined;
          sdata.pstatus = programsJSON.pstatus;
          sdata.apply = true;

          dispatch(awsSignIn(sdata));

          navigate("/myApplication/application");
        }
      } catch (err) {}
    } catch (error) {
      console.log("getCategoryError", error);
    }
    console.log("Mount");
  }

  function applyNonEvbabApplication() {
    // localStorage.setItem("eVBAB", false);
    let sdata = { ...userDetails };

    sdata.evbab = false;
    sdata.pid = programsJSON.pid;
    sdata.bpid = programsJSON.bpid;
    sdata.pname = programsJSON.pname;
    sdata.applicationid = undefined;
    sdata.pstatus = programsJSON.pstatus;
    dispatch(awsSignIn(sdata));

    navigate("/myApplication/application");
  }

  function continueApplication() {
    let sdata = { ...userDetails };

    sdata.pid = programsJSON.pid;
    sdata.bpid = programsJSON.bpid;
    sdata.evbab = programsJSON.evbab;
    sdata.pname = programsJSON.pname;
    sdata.applicationid = programsJSON.applicationid;
    sdata.pstatus = programsJSON.pstatus;
    sdata.apply = false;

    dispatch(awsSignIn(sdata));

    navigate("/myApplication/application");
  }

  function startProgram() {
    setIsLoading(true);
    let pcourse = programsJSON.pcurriculum;

    let progData = {};
    progData.pd = {
      tp: 0,
      pid: programsJSON.pid,
      bpid: programsJSON.bpid,
      ptitle: programsJSON.pname,
      pdur: programsJSON.pinfo.duration,
      year_sem: programsJSON.year_sem,
      sd: Math.round(new Date().getTime() / 1000),
    };

    progData.courses = {};
    for (let i = 0; i < pcourse.length; i++) {
      let obj = {};
      obj.tp = 0;
      obj.td = {
        ttitle: pcourse[i].ttitle,
        tid: pcourse[i].tid,
        bcid: pcourse[i].btid,
        tdur: pcourse[i].tduration,
        sem: pcourse[i].semester == undefined ? "1" : pcourse[i].semester,
      };
      progData.courses[pcourse[i].btid] = obj;
    }
    syncProgramProgress(progData);
    // alert(JSON.stringify(progData));
    console.log("progData " + JSON.stringify(progData));
  }

  async function syncProgramProgress(progData) {
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        eid: userDetails.eid,
        bpid: programsJSON.bpid,
        programProgress: progData,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.SYNC_PROGRAM,
        bodyParam
        //`${Constants.GET_MY_PROGRAMS}`, bodyParam,
      );

      analyticsWebApp();
      get();
    } catch (error) {
      console.log("getCategoryError", error);
    }
  }

  async function analyticsWebApp() {
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        bpid: programsJSON.bpid,
        pname: programsJSON.pname,
        eventtype: "Program Subscribed",
        email: userDetails.eid,
        id: userDetails.id,
        gender: "Unknown",
        logintype: "Cognito",
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.ANALYTICS_WEB_APP,
        bodyParam
        //`${Constants.GET_MY_PROGRAMS}`, bodyParam,
      );
    } catch (error) {
      console.log("getCategoryError", error);
    }
  }

  async function get() {
    let userdata = { ...userDetails };

    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        eid: userdata.eid,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    try {
      let response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.GET_USER_PROGRESS,
        bodyParam
      );

      userdata.data = response;
      dispatch(awsSignIn(userdata));

      getProgramsDetails();
      // continueLearning();
    } catch (error) {
      console.error(error);
    }
  }

  function continueLearning() {
    let pdata = userDetails.data.bpdata;
    if (pdata == undefined) {
      navigate("/dashboard");
      return;
    }
    let sdata = { ...userDetails };
    for (let i = 0; i < pdata.length; i++) {
      if (programsJSON.bpid == pdata[i].bpid) {
        sdata.curprg = pdata[i];
      }
    }

    dispatch(awsSignIn(sdata));

    navigate("/MyPrograms/programs");
  }

  return (
    <main>
      {selectType()}
      <UserHeader />

      <div className={ApplyProgramInfoStyle.overview}>
        <div className={ApplyProgramInfoStyle.overview__h1}>
          <Typography component="div" key="h2" variant="h2">
            {isLoading ? (
              <Skeleton />
            ) : (
              <h1 style={{ fontSize: "22px", marginBottom: "20px" }}>
                <strong>{programsJSON.pname}</strong>
              </h1>
            )}
          </Typography>
        </div>
        <div className={ApplyProgramInfoStyle.overview__card}>
          <div className={ApplyProgramInfoStyle.overview__cardContent}>
            <div className={ApplyProgramInfoStyle.content}>
              <div className={ApplyProgramInfoStyle.content__details}>
                <div className={ApplyProgramInfoStyle.align_self}>
                  {/* <Rating
                        icon="star"
                        defaultRating={4}
                        maxRating={5}
                        size="huge"
                      /> */}
                </div>
                <div className={ApplyProgramInfoStyle.items}>
                  <div>
                    <strong>
                      <span>
                        <ClockOrange
                          className={ApplyProgramInfoStyle.clock_size}
                          cls1={ApplyProgramInfoStyle.cls_1}
                          cls2={ApplyProgramInfoStyle.cls_2}
                        />
                      </span>
                      {isLoading ? <Skeleton /> : programsJSON.pinfo.duration}
                    </strong>
                  </div>
                  <div>
                    Format:{" "}
                    <strong>
                      {isLoading ? <Skeleton /> : programsJSON.pinfo.format}
                    </strong>
                  </div>
                </div>
                <div className={ApplyProgramInfoStyle.items}>
                  <div>
                    <strong>
                      <span>
                        <Rupee
                          className={{
                            size: ApplyProgramInfoStyle.rupee_size,
                            fill: "#e35f14",
                          }}
                        />
                      </span>{" "}
                      {isLoading ? <Skeleton /> : programsJSON.pinfo.price}
                    </strong>
                  </div>
                  <div className={ApplyProgramInfoStyle.align_credits}>
                    Credits:{" "}
                    <strong>
                      {isLoading ? <Skeleton /> : programsJSON.pinfo.credits}
                    </strong>
                  </div>
                </div>
                <div className={ApplyProgramInfoStyle.align_self}>
                  {isLoading ? <Skeleton /> : renderButton()}
                </div>
              </div>
            </div>
          </div>
          {isLoading ? (
            <Skeleton variant="rect" width="100%">
              <div style={{ paddingTop: "57%" }} />
            </Skeleton>
          ) : (
            <div className={ApplyProgramInfoStyle.overview__cardImage}>
              <img
                src={`https://${
                  config.DOMAIN
                }/${config.aws_org_id.toLowerCase()}-resources/images/program-images/${
                  programsJSON.pid
                }.png`}
                alt=""
              />
            </div>
          )}
        </div>
      </div>

      <div className={ApplyProgramInfoStyle.tabMargin}>
        <Tab panes={panes} />
      </div>
    </main>
  );
}
