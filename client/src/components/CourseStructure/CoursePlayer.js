import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Dropdown, ModalActions } from "semantic-ui-react";
import Tooltip from "@material-ui/core/Tooltip";
import { Document, Page, pdfjs } from "react-pdf";
import ReactPlayer from "react-player";
import { awsSignIn, authData, awsSignOut } from "../../redux/auth/authSlice";
import UserHeader from "../Header/UserHeader/UserHeader";
import useWindowDimensions from "../../modules/Window/Window";
import ProgramCard from "../../modules/ProgramCard/ProgramCard";
// import "./MyPrograms.scss";
import { FaBars } from "react-icons/fa";
import { Constants } from "../../config/constants";
import config from "../../config/aws-exports";
import { API, button, Auth } from "aws-amplify";
import "./CoursePlayer.scss";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import { IconButton } from "@material-ui/core";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import Fullscreen from "@material-ui/icons/Fullscreen";

import Fade from "@material-ui/core/Fade";
import Done from "../../assets/svgjs/Done";
import screenfull from "screenfull";
import { ReactComponent as Close } from "../../assets/svg/close_black_24dp.svg";

import { Formik, useField, useFormik, Form, Field } from "formik";
import CustomImageInput from "../../modules/CustomImageInput/CustomImageInput";
import * as Yup from "yup";
import { valHooks } from "jquery";
import quizImage from "../../assets/images/5img.png";

import axios from "axios";
import Reject from "../../assets/svgjs/Reject";
import CloseIcon from "@material-ui/icons/Close";
import produce from "immer";

const CoursePlayer = (props) => {
  let {
    handleClose,
    courseDetails,
    setCourseDetails,
    objectData,
    setObjectData,
    oIndex,
    setOIndex,
    curObject,
    setcurObject,
    curObRef,
    assignment,
    setAssignment,
    summative,
    sumScore,
    setSumScore,
    miniScore,
    setMiniScore,
    sMiniScore,
    setSMiniScore,
    qisLoading,
    setQIsLoading,
    getQuizScore,
    getAssignmentDataPost,
    assignmentLoad,
    setAssignmentLoad,
  } = props;

  // pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [quizQuestion, setQuizQuestion] = useState([]);
  const [btnClick, setBtnClick] = useState(false);
  const [qtype, setQtype] = useState("");
  const [answerReveal, setAnswerReveal] = useState(false);
  const [popUp, setPopup] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const submitScore = useRef(0);
  const formData = useRef([]);
  const full = useRef(null);
  const [settingnull, setSettingnull] = useState(0);
  const [first, setFirst] = useState(true);

  const { height, width } = useWindowDimensions();
  const [fullscreen, setFullScreen] = useState(true);
  const [tryAgain, setTryAgain] = useState(false);
  const [formativeAns, setFormativeAns] = useState([]);
  const [isSubmittingg, setSubmittingg] = useState(false);
  const [feedback, setFeedback] = useState(false);
  // const courseDetails = useRef({});
  // const objectData = useRef({});
  const [ansShow, setAnsShow] = useState(false);

  const [loaded, setLoaded] = useState(false);
  const [markObjectAsComplete, setMarkObjectAsCompleted] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState(false);
  const [open, setOpen] = useState(false);
  // let h = true;
  // const [courseDetails, setCourseDetails] = useState({});
  // const [objectData, setObjectData] = useState({});
  // const [oIndex, setOIndex] = useState(0);
  // const [curObject, setcurObject] = useState({});

  const [feedbackButton, setFeedbackButton] = useState({
    disableSubmit: true,
    hideNext: true,
    hideSubmit: false,
    submitted: false,
  });
  const startTime = useRef(0);

  let userDetails = useSelector(authData);
  let objData = userDetails.curprgcouobj;
  const dispatch = useDispatch();

  const useStyles = makeStyles((theme) => ({
    root: {
      "& .MuiTextField-root": {
        color: "black !important",
      },
      "& .MuiFormLabel-root": {
        color: "black !important",
      },
    },
    textarea11: {
      "& .MuiInputBase-input": {
        color: " #black !important",
        fontSize: "12.5px !important",
      },
    },
    paper: {
      backgroundColor: theme.palette.background.paper,

      height: "200px",
      width: "500px",
      borderRadius: "4px",
      border: "none",
      padding: theme.spacing(2, 4, 3),
    },
    modalConfirm: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      border: "none",
      transform: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
    },

    tooltipFull: {
      fontSize: 30,
    },
    bottomIcons: {
      color: "#000",
      "&:hover": {
        color: "#777",
      },
    },
    volumeButton: {
      color: "#000",
      fontSize: 40,
      transform: "scale(0.9)",
      "&:hover": {
        color: "#777",
        transform: "scale(1.03)",
        transitionTimingFunction: "cubic-bezier(0.1, 0.1, 0.25, 1)",
      },
    },
    volumeButtonExit: {
      color: "lightgray",
      fontSize: 40,
      transform: "scale(0.9)",
      "&:hover": {
        color: "#777",
        transform: "scale(1.03)",
        transitionTimingFunction: "cubic-bezier(0.1, 0.1, 0.25, 1)",
      },
    },
  }));
  const classes = useStyles();

  useEffect(() => {
    //alert(JSON.stringify(userDetails.curprgcouobj))

    startTime.current = Math.round(new Date().getTime());
    setLoaded(true);
    // courseDetails.current = objData.course;
    // objectData.current = objData.objects;

    // setCourseDetails(objData.course);
    // setObjectData(objData.objects);

    //getCourse();
    //setOIndex(userDetails.oindex);
  }, []);

  async function getCourse() {
    let lcourseDetails = userDetails.curprgcou;
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        eid: userDetails.eid,
        pid: lcourseDetails.pid,
        bpid: lcourseDetails.bpid,
        courseid: lcourseDetails.tid,
        bcourseid: lcourseDetails.bcid,
        ptitle: lcourseDetails.ptitle,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    //alert(JSON.stringify(bodyParam.body));
    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.GET_COURSE,
        bodyParam
      );
      //alert(JSON.stringify(response));
      const topicsJSON = response.nuggets;
      function groupByKey(array, key) {
        return array.reduce((hash, obj) => {
          if (obj[key] === undefined) return hash;
          return Object.assign(hash, {
            [obj[key]]: (hash[obj[key]] || []).concat(obj),
          });
        }, {});
      }
      var result = groupByKey(topicsJSON, "unit");
      let temp = [];
      for (let i = 0; i < topicsJSON.length; i++) {
        for (let j = 0; j < topicsJSON[i].objects.length; j++) {
          temp.push(topicsJSON[i].objects[j]);
        }
      }

      // alert(JSON.stringify(response));
      // alert(JSON.stringify(userDetails.oindex));
      console.log(response);
      setCourseDetails(response);
      setObjectData(temp);
      setcurObject(temp[userDetails.oindex]);
      curObRef.current = temp[userDetails.oindex];
      setLoaded(true);
    } catch (error) {
      // alert(JSON.stringify(error));
      console.error(error);
    }
  }
  async function getQuiz(obj) {
    console.log(obj);
    setAssignmentLoad(true);
    setQIsLoading(true);
    const bodyParam = {
      body: {
        quizid: obj.oid,
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
        Constants.GET_QUIZ,
        bodyParam
      );
      console.log(response);
      const { qitems, qtype } = response;
      // console.log("cutoff" + cutoff);

      setQtype(qtype);
      setQuizQuestion(qitems);

      setBtnClick(true);
      setQIsLoading(false);
      setAssignmentLoad(false);
    } catch (error) {
      // alert(JSON.stringify(error));
      console.error(error);
    }
  }

  async function syncUserProgress(userProgressData) {
    let lcourseDetails = userDetails.curprgcou;
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        eid: userDetails.eid,
        pid: lcourseDetails.pid,
        bpid: lcourseDetails.bpid,
        courseid: lcourseDetails.tid,
        bcourseid: lcourseDetails.bcid,
        ptitle: lcourseDetails.ptitle,
        courseProgress: userProgressData,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    //alert(JSON.stringify(bodyParam.body));
    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.SYNC_USER_PROGRESS,
        bodyParam
      );
      if (userProgressData[lcourseDetails.bcid].tp == 2) {
        analyticsWebApp();
      }
      startTime.current = Math.round(new Date().getTime());
      console.log(response);
    } catch (error) {
      startTime.current = Math.round(new Date().getTime());
      // alert(JSON.stringify(error));
      console.error(error);
    }
  }
  async function analyticsWebApp() {
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        topicid: userDetails.curprgcou.tid,
        bcid: userDetails.curprgcou.bcid,
        eventtype: "Topic Completed",
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
    console.log("ANALYTICS_WEB_APP==", JSON.stringify(bodyParam.body));
    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.ANALYTICS_WEB_APP,
        bodyParam
      );
    } catch (error) {
      console.log("analyticsWebAppError", error);
    }
  }
  function setMarkComplete() {
    setTimeout(() => {
      console.log("sT " + curObRef.current.userOP.op);
      if (
        curObRef.current.userOP.op == 0 &&
        (courseDetails.freenavigation == "false" ||
          courseDetails.freenavigation == false)
      ) {
        setMarkObjectAsCompleted(false);
      } else if (curObRef.current.userOP.op != 2) {
        let check = checkQuiz(curObRef.current);

        if (check) {
          if (markObjectAsComplete == false) {
            setMarkObjectAsCompleted(true);
          }
        }
      }
      // if (curObRef.current.userOP.op != 2) {
      //   setMarkObjectAsCompleted(true);
      // }
    }, 5000);
  }

  function checkQuiz(obj) {
    if (obj.otype === "quiz") {
    }
    return true;
  }

  function renderObjects() {
    //alert(JSON.stringify(curObject));

    let objType = curObject.otype;
    //alert(objType);
    console.log("s " + curObject);
    if (
      curObject.userOP.op == 0 &&
      (courseDetails.freenavigation == "false" ||
        courseDetails.freenavigation == false)
    ) {
      let tobjectData = [...objectData];
      let toIndex = oIndex;
      if (toIndex != 0) {
        if (tobjectData[toIndex - 1].userOP.op == 2) {
          if (markObjectAsComplete == false) {
            setTimeout(() => {
              setMarkObjectAsCompleted(true);
            }, 5000);
          }
        } else {
          return LockView();
        }
      } else {
        return LockView();
      }
      // if(tobjectData[toIndex].userOP.op == 0)
    } else if (curObject.userOP.op != 2) {
      setMarkComplete();
    }

    switch (objType) {
      case "video":
        return VideoView(); // loadVideoView(curObject);
      case "audio":
        return AudioView(); // loadAudioView(curObject);
      case "pdf":
        return PdfView(); // loadMultimediaView(curObject);
      case "html":
        return WebView(); // loadMultimediaView(curObject);
      case "Interactivity":
        return WebView(); // loadInteractivityView(curObject);
      case "quiz":
        return quizView();
      case "vimeo":
        return VimeoView(); // loadVimeoView(curObject);
      case "youtube":
        return VimeoView(); // loadYoutubeView(curObject);
      default:
        return null;
    }
  }

  function renderButtons() {
    console.log("online", navigator.onLine);
    // console.log("render", oIndex);
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-around",
          //paddingTop: "100px",
          // paddingBottom: "50px",
        }}
      >
        <div>
          {oIndex === 0 ? (
            <div></div>
          ) : navigator.onLine ? (
            <button
              onClick={prev}
              style={{
                background: config.main_color_2,
                padding: "10px 20px",
                color: "white",
                fontSize: "16px",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Prev
            </button>
          ) : null}
        </div>
        <div>
          {markObjectAsComplete == true ? (
            curObject.qtype === 2 ||
            curObject.qtype === 1 ||
            curObject.qtype === "2" ||
            curObject.qtype === "1" ? (
              <div></div>
            ) : navigator.onLine ? (
              <button
                onClick={markComplete}
                style={{
                  background: config.main_color_2,
                  padding: "10px 20px",
                  color: "white",
                  fontSize: "16px",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Mark Complete
              </button>
            ) : null
          ) : (
            <div></div>
          )}
        </div>
        <div>
          {curObject.userOP.op == 2 ? (
            navigator.onLine ? (
              <button
                onClick={next}
                style={{
                  background: config.main_color_2,
                  padding: "10px 20px",
                  color: "white",
                  fontSize: "16px",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Next
              </button>
            ) : null
          ) : null}
        </div>
      </div>
    );
  }

  function prev() {
    setMarkObjectAsCompleted(false);
    setBtnClick(false);
    setTryAgain(true);
    setFormativeAns([]);
    setFeedbackButton({
      disableSubmit: true,
      hideNext: true,
      hideSubmit: false,
      submitted: false,
    });
    console.log("index", oIndex);

    //var newObject = JSON.parse(JSON.stringify(oldObject));
    let tcourseDetails = JSON.parse(JSON.stringify(courseDetails));
    let tobjectData = [...objectData];
    let toIndex = oIndex;

    startTime.current = Math.round(new Date().getTime());

    let l = tobjectData.length - 1;
    if (toIndex > 0) {
      toIndex = toIndex - 1;
      setOIndex(toIndex);
      setcurObject(tobjectData[toIndex]);
      curObRef.current = tobjectData[toIndex];
      if (tobjectData[toIndex].otype === "quiz") {
        getAssignmentDataPost(tobjectData[toIndex].oid);
        getQuizScore(tobjectData[toIndex]);
      }
    }

    saveredux(toIndex);
  }

  function next() {
    setBtnClick(false);
    setFeedbackButton({
      disableSubmit: true,
      hideNext: true,
      hideSubmit: false,
      submitted: false,
    });
    setMarkObjectAsCompleted(false);

    setTryAgain(true);
    setFormativeAns([]);

    let tcourseDetails = JSON.parse(JSON.stringify(courseDetails));
    let tobjectData = [...objectData];
    let toIndex = oIndex;

    startTime.current = Math.round(new Date().getTime());

    let l = tobjectData.length - 1;
    if (toIndex < l) {
      toIndex = toIndex + 1;
      setOIndex(toIndex);
      setcurObject(tobjectData[toIndex]);
      curObRef.current = tobjectData[toIndex];
      if (tobjectData[toIndex].otype === "quiz") {
        getAssignmentDataPost(tobjectData[toIndex].oid);
        getQuizScore(tobjectData[toIndex]);
      }
    }

    saveredux(toIndex);
  }

  function markComplete() {
    setMarkObjectAsCompleted(false);
    setBtnClick(false);
    setCurrentQuestion(0);

    let tcourseDetails = JSON.parse(JSON.stringify(courseDetails));
    let tobjectData = [...objectData];
    let toIndex = oIndex;

    let userProgressEndTime = Math.round(new Date().getTime());
    let totalTimeTaken = userProgressEndTime - startTime.current;
    totalTimeTaken = totalTimeTaken / 1000;

    tcourseDetails.userProgressData[tcourseDetails.btid].objects[
      tobjectData[toIndex].oid
    ].op = 2;

    tobjectData[toIndex].userOP.op = 2;

    tcourseDetails.userProgressData[tcourseDetails.btid].objects[
      tobjectData[toIndex].oid
    ].timespent = totalTimeTaken;
    tobjectData[toIndex].userOP.timespent = totalTimeTaken;

    let l = tobjectData.length - 1;
    if (toIndex < l) {
      toIndex = toIndex + 1;

      if (
        tcourseDetails.userProgressData[tcourseDetails.btid].objects[
          tobjectData[toIndex].oid
        ].op != 2
      ) {
        tcourseDetails.userProgressData[tcourseDetails.btid].objects[
          tobjectData[toIndex].oid
        ].op = 1;
        tobjectData[toIndex].userOP.op = 1;
      }

      setOIndex(toIndex);
      setcurObject(tobjectData[toIndex]);

      if (tobjectData[toIndex].otype === "quiz") {
        getAssignmentDataPost(tobjectData[toIndex].oid);
        getQuizScore(tobjectData[toIndex]);
        console.log("formdata", formData.current);
        formData.current = [];
        // getQuiz(curObject);
        // getQuizScore(tobjectData[toIndex]);
      }

      curObRef.current = tobjectData[toIndex];
    } else if (toIndex == l) {
      if (
        tcourseDetails.freenavigation == "true" ||
        tcourseDetails.freenavigation == true
      ) {
        tcourseDetails.userProgressData[tcourseDetails.btid].tp = 2;
        // pushCustomAnalytics('complete');
      } else {
        let length = 0;
        for (let i = 0; i < tobjectData.length; i++) {
          if (tobjectData[i].userOP.op == 2) {
            length++;
          } else if (tobjectData[i].userOP.op == 0) {
            tcourseDetails.userProgressData[tcourseDetails.btid].objects[
              tobjectData[i].oid
            ].op = 1;
            tobjectData[i].userOP.op = 1;
          }
        }
        if (length == tobjectData.length) {
          tcourseDetails.userProgressData[tcourseDetails.btid].tp = 2;
          //pushCustomAnalytics('complete');
        } else {
          tcourseDetails.userProgressData[tcourseDetails.btid].objects[
            tobjectData[toIndex].oid
          ].op = 1;
          tobjectData[toIndex].userOP.op = 1;
          alert(
            "Ongoing Course was edited, Please complete the Course Objects and complete the last object "
          );
        }
      }
    }
    // courseDetails.current = objData.course;
    // objectData.current = objData.objects;

    setCourseDetails(tcourseDetails);
    setObjectData(tobjectData);
    syncUserProgress(tcourseDetails.userProgressData);
    saveredux(toIndex);
  }

  function saveredux(toIndex) {
    let sdata = { ...userDetails };
    sdata.oindex = toIndex;
    dispatch(awsSignIn(sdata));
    //navigate("/coursePlayer");
  }

  function LockView() {
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <h1>Please Mark Complete previously viewed object.</h1>
        </div>
      </div>
    );
  }
  function unitLockedView() {
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <h1>This Module is disabled from Admin</h1>
        </div>
      </div>
    );
  }

  const [selected, setSelected] = useState();
  function VideoView() {
    return (
      <ReactPlayer
        url={curObject.ourl}
        controls={true}
        width="100%"
        height="100%"
        config={{
          file: {
            attributes: {
              controlsList: "nodownload", //<- this is the important bit
            },
          },
        }}
      />
    );
  }

  function AudioView() {
    return <ReactPlayer url={curObject.ourl} controls={true} />;
  }

  function VimeoView() {
    return (
      <iframe
        src={
          curObject.otype !== "vimeo"
            ? `https://www.youtube.com/embed/${curObject.embeddedcode}?rel=0&showinfo=0`
            : `https://player.vimeo.com/video/${curObject.embeddedcode}?title=0&loop=0`
        }
        title="youandvimeo"
        controls={true}
        width="100%"
        height="100%"
      />
    );
  }

  function PdfView() {
    return (
      <iframe src={curObject.ourl} height="100%" width="100%" title="pdfView" />
    );
  }

  function WebView() {
    return (
      <iframe
        src={curObject.ourl}
        width={"100%"}
        height="100%"
        title="WebView"
      />
    );
  }

  function toggleFullScreen() {
    screenfull.toggle(full.current);
  }

  function onFullScreen() {
    setFullScreen(!fullscreen);
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // const [green, setGreen] = useState({});
  // const [red, setRed] = useState({});
  if (quizQuestion == undefined) {
    alert("No Quiz Present");
    handleClose();
    return;
  }

  let percent = (score / quizQuestion.length) * 100;

  // responseSave(formData);
  function handleAnswerOption(ques) {
    return ques;
  }

  const getAssignmentDataPost1 = async (quizid) => {
    setQIsLoading(true);
    setSMiniScore(false);

    setMiniScore(0);
    const bodyParam = {
      body: {
        quizid: quizid,
        oid: config.aws_org_id,
        eid: userDetails.eid,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    console.log(bodyParam);
    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.GET_ASSIGNMENT_DATA,
        bodyParam
        //`${Constants.GET_MY_PROGRAMS}`, bodyParam,
      );
      // alert('hello');

      // alert(JSON.stringify(response.score));

      if (response.errorMessage !== undefined) {
        setAssignment(true);
      } else {
        if (response.score !== undefined) {
          setSMiniScore(true);
          // alert(response.score);
          setMiniScore(response.score);
        }
        setAssignment(false);
      }
      setQIsLoading(false);
      return response;
    } catch (error) {
      console.log("getCategoryError", error);
    }
  };

  function submitS() {
    setShowScore(true);
  }
  async function saveResponse(data, obj1) {
    const obj = {};
    obj.response = data;

    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        quizdata: obj,
        eid: userDetails.eid,
        objid: obj1.oid,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    if (userDetails.curprgcou !== undefined) {
      bodyParam.body.bpid = userDetails.curprgcou.bpid;
      bodyParam.body.bcid = userDetails.curprgcou.bcid;
      bodyParam.body.cid = userDetails.curprgcou.tid;
    }
    console.log("body param" + JSON.stringify(bodyParam));
    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.UPDATE_MINI_ASSIGNMENT,
        bodyParam
        //`${Constants.GET_MY_PROGRAMS}`, bodyParam,
      );
      // alert('hello');

      console.log(response);
    } catch (error) {
      console.log("getCategoryError", error);
    }
  }

  async function postQuizScorePost(score) {
    let objsr = {};
    let lcourseDetails = userDetails.curprgcou;

    const bodyParam = {
      body: {
        eid: userDetails.eid,
        scorejson: objsr,
        oid: config.aws_org_id,
        rtype: "put",
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    if (lcourseDetails.bpid !== undefined) {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let date1 = date.getDate();
      let sdate = date1 + "." + month + "." + year;
      objsr.bpid = lcourseDetails.bpid;
      objsr.name = curObject.otitle;
      objsr.cdate = sdate;
      objsr.score = score;
      objsr[curObject.oid] = score;
      bodyParam.body.scorejson = objsr;
    }

    console.log(JSON.stringify(bodyParam));
    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.POST_QUIZ,
        bodyParam
        //`${Constants.GET_MY_PROGRAMS}`, bodyParam,
      );
      // alert('hello');
      console.log(response);
      getQuizScore(curObject);
    } catch (error) {
      console.log("getCategoryError", error);
    }
  }

  function modallans() {
    const handleClosePop = () => {
      setOpen(false);
    };
    const showScore = () => {
      setOpen(false);
      setShowScore(true);
      console.log(formData.current);
      saveResponse(formData.current, curObject);
    };
    return (
      <>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modalConfirm}
          open={open}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              <h3 style={{ padding: "33px 33px 0px 63px", fontSize: "20px" }}>
                Are you sure you want to submit?
              </h3>
              <button
                style={{
                  position: "relative",
                  right: "40px",
                  top: "70px",
                  color: config.main_color_1,
                  backgroundColor: "white",
                  borderRadius: "8px",
                  fontSize: "15px",
                  height: "28px",
                  lineHeight: "13px",
                  float: "right",
                  width: "100px",
                  border: "2px solid #3372B5",
                }}
                onClick={() => {
                  showScore();
                  //setCurrentQuestion(0);
                }}
              >
                Confirm
              </button>
              <br />
              <button
                style={{
                  position: "relative",
                  right: "-28px",
                  top: "55px",
                  color: "lightcoral",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  fontSize: "15px",
                  height: "28px",
                  lineHeight: "13px",
                  float: "left",
                  width: "100px",
                  border: "2px solid lightcoral",
                }}
                onClick={() => {
                  setBtnClick(false);
                  //getQuiz(curObject);
                  /*
                  setScore(0);
                  setShowScore(false);
                  setCurrentQuestion(0); */
                  setScore(0);
                  setShowScore(false);
                  setCurrentQuestion(0);
                  handleClosePop();
                }}
              >
                Cancel
              </button>
            </div>
          </Fade>
        </Modal>
      </>
    );
  }

  const handleNextQuestionClick = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizQuestion.length) {
      setCurrentQuestion(nextQuestion);
    } else if (curObject.qtype === 3 || curObject.qtype === "3") {
      setOpen(true);
    } else {
      /*   setShowScore(true);
      console.log(formData.current);
      saveResponse(formData.current, curObject);
      if (qtype === 1) {
        let percent = (score / quizQuestion.length) * 100;
        percent = Math.round(percent);
        postQuizScorePost(percent);
      } */
      setShowScore(true);
      console.log(formData.current);
      console.log("to check", formData.current, curObject);
      saveResponse(formData.current, curObject);
      if (qtype === 1 || qtype === "1") {
        let percent = (submitScore.current / quizQuestion.length) * 100;
        percent = Math.round(percent);
        console.log("percent", percent);
        postQuizScorePost(percent);
      }
    }
  };

  const handlePrevQuestion = () => {
    console.log("prev", formData.current);
    //saveResponse(formData.current, curObject);
    console.log("curr", currentQuestion);
    const prevQuestion = currentQuestion - 1;
    /*  if (prevQuestion > 0) { */
    setCurrentQuestion(prevQuestion);
    /*   } */
  };

  const handleAnswerOptionClick = (ansOpts, idx) => {
    if (ansOpts.correct === "true" || ansOpts.correct === true) {
      setScore(score + 1);
      if (curObject.qtype == 1 || curObject.qtype == "1") {
        submitScore.current += 1;
      }
      // setFeedback(true);
    }
    let answer = [...formativeAns];
    answer.push(idx);
    setFormativeAns(answer);
    //alert(idx);
    console.log(typeof qtype);

    handleNextQuestionClick();

    //alert("1");
  };

  let qobj = curObject.oid.split("-");
  const imgUrl = `https://${
    config.DOMAIN
  }/${config.aws_org_id.toLowerCase()}-resources/images/quiz-images/${
    qobj[0]
  }/`;

  const FILE_SIZE = 16000 * 1024;
  const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/png",
    "application/pdf",
  ];
  const validationSchema = Yup.object().shape({
    text: Yup.string().required(
      <div style={{ fontSize: "12px" }}>"A text is required"</div>
    ),
    /* file: Yup.mixed() */
    /* .test(
        "fileSize",
        "File Size is too large",
        (value) => value.size <= FILE_SIZE
      ) */
    /* .test(
        "fileFormat",
        "Unsupported File Format",
        (value) => value == true && SUPPORTED_FORMATS.includes(value.type)
      ), */
  });

  function validateEmail(value) {
    let error;
    if (value) {
      console.log("val", value.type);
      if (
        value.type === "image/png" ||
        value.type === "image/jpg" ||
        value.type === "application/pdf" ||
        value.type === "image/jpeg"
      ) {
        error = "";
      } else {
        error = `*File not supported, please match requested type.`;
      }
      return error;
    }
  }

  function validateUsername(value) {
    let error;
    console.log("val1", value);
    if (value === "" || value.replace(/\s/g, "").length === 0) {
      error = "*A text is required";
    } else {
      error = "";
    }
    return error;
  }

  const getPreSignedUrl = async (value, obj) => {
    setSubmittingg(true);
    console.log("obj" + JSON.stringify(obj));
    console.log("val" + JSON.stringify(value));

    console.log("hii");

    console.log(config.aws_org_id);

    // const jwttoken = (await Auth.currentSession()).idToken.jwtToken;
    let fileName = new Date().getTime();

    let quest = handleAnswerOption(quizQuestion[currentQuestion]);
    quest.response = value.response;
    quest.filename = fileName + value.file.name;
    formData.current.push(quest);
    if (value.file) {
      const bodyParam = {
        body: {
          type: "minassign",
          filename: fileName + value.file.name,
          filetype: value.file.type,
          oid: config.aws_org_id,
          eid: userDetails.eid,
          quizid: obj.oid,
        },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // Authorization: jwttoken,
        },
      };
      console.log(bodyParam);
      try {
        const response = await API.post(
          config.aws_cloud_logic_custom_name,
          Constants.GET_PRESIGNED_URL,
          bodyParam
        );

        // console.log(response);
        /* if (currentQuestion + 1 === quizQuestion.length) {
          setShowScore(true);
          console.log(formData.current);
          saveResponse(formData.current, curObject);
        } */
        handleNextQuestionClick();
        setSubmittingg(false);
        //alert("2");
        /* if (currentQuestion === quizQuestion.length) {
          setOpen(true);
        } */

        // console.log(response);

        fileUpload(value.file, response);
      } catch (error) {
        console.log("getCategoryError", error);
      }
    } else {
      handleNextQuestionClick();
      setSubmittingg(false);
    }
  };

  /*   function handleConfirm() {
    const nextQuestion1 = currentQuestion + 1;
    if (nextQuestion1 < quizQuestion.length) {
      setSettingnull(1);
    } else if (curObject.qtype === 3) {
      setPopup(true);
    }
  } */

  async function fileUpload(file, url) {
    await axios
      .put(url, file, { headers: { "Content-Type": file.type } })
      .then((res) => {
        // alert('hi');
        console.log(res);
        //setOpen(false);
        /* handleConfirm(); */
        //handleNextQuestionClick();
        //alert("3");
        //setOpen(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const TextInputComponent = ({ field, ...props }) => {
    // console.log(field);
    // console.log(props);
    const { errorMessage, touched } = props;
    const { name, value, onChange, onBlur } = field;
    return (
      <div className={classes.root}>
        <TextField
          fullWidth
          className={classes.textarea11}
          placeholder="Type your response here..."
          multiline
          rows={4}
          name={name}
          variant="outlined"
          color="primary"
          error={touched && errorMessage ? true : false}
          label="Insert some text"
          helperText={touched && errorMessage ? errorMessage : undefined}
          onChange={onChange}
        />
      </div>
    );
  };

  function answerPrev() {
    console.log("curr", currentQuestion);
    const prevQuestion = currentQuestion - 1;

    setCurrentQuestion(prevQuestion);
  }

  function answerNext() {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizQuestion.length) {
      setCurrentQuestion(nextQuestion);
    }
    setAnsShow(false);
    setFirst(true);
  }

  const handleSelect = (i) => {
    if (selected == i.correct) {
      return "buttonQuizFb2";
    } else if (selected != i.correct) {
      return "buttonQuizFb3";
    }
  };

  const handleCheck = (i, idx) => {
    setQuizQuestion((currentQues) =>
      produce(currentQues, (v) => {
        v[currentQuestion].iopts.forEach((opt) => {
          opt.Selected = false;
        });
      })
    );
    setQuizQuestion((currentQues) =>
      produce(currentQues, (v) => {
        v[currentQuestion].iopts[idx].Selected = true;
      })
    );
    setFeedbackButton({ ...feedbackButton, disableSubmit: false });
  };
  function quizView() {
    //console.log("current", curObject);
    return (
      <div className="body" style={{ height: height - 400 }}>
        <div className="heading1">
          <h1
            style={{
              justifyContent: "start",
              color: "black",
            }}
          >
            {curObject.otitle}
          </h1>
        </div>

        {btnClick ? (
          <div className="app1">
            {showScore ? (
              <div className="score-section">
                {qtype != 3 ? (
                  <div>
                    You scored {score} out of {quizQuestion.length}
                    {/* ;
                    {(score / quizQuestion.length) * 100} */}
                    {qtype == 2 &&
                    ((score / quizQuestion.length) * 100 >= 75 || tryAgain) ? (
                      <div>
                        <button
                          className="btnQuizLD"
                          style={{
                            width: "200px",
                            border: "3px solid white",
                            fontSize: "15px",
                          }}
                          onClick={() => {
                            markComplete();
                            setScore(0);
                            setTryAgain(false);
                            setFormativeAns([]);
                          }}
                        >
                          Mark Complete
                        </button>
                        <button
                          className="btnQuizLD"
                          style={{
                            width: "200px",
                            border: "3px solid white",
                            fontSize: "15px",
                          }}
                          onClick={() => {
                            getQuiz(curObject);
                            setCurrentQuestion(0);
                            setAnswerReveal(true);
                            setShowScore(false);
                            //setQIsLoading(true);
                          }}
                        >
                          {qisLoading ? (
                            <CircularProgress color="default" size={30} />
                          ) : (
                            "Answers"
                          )}
                        </button>
                      </div>
                    ) : qtype == 2 ? (
                      <div style={{ fontSize: "16px" }}>
                        {" "}
                        You should score more than 75% to complete this Quiz.
                      </div>
                    ) : (
                      <div>Submitted</div>
                    )}
                  </div>
                ) : (
                  <div>
                    <h3>Goto Home Page</h3>
                    <div>
                      <button
                        className="buttonQuizCt"
                        onClick={() => {
                          handleClose();
                          setScore(0);
                          setCurrentQuestion(0);
                          getQuiz(curObject);
                        }}
                      >
                        Exit Assignment
                      </button>
                    </div>
                  </div>
                )}
                {qtype != 1 &&
                qtype != 3 &&
                (score / quizQuestion.length) * 100 < 75 &&
                tryAgain === false ? (
                  <div>
                    <button
                      className="buttonQuizCt"
                      onClick={() => {
                        setBtnClick(false);
                        getQuiz(curObject);
                        setScore(0);
                        setShowScore(false);
                        setCurrentQuestion(0);
                        setTryAgain(true);
                        setFormativeAns([]);
                      }}
                    >
                      Try Again
                    </button>
                    <button
                      className="buttonQuizCt"
                      onClick={() => {
                        getAssignmentDataPost();
                        setBtnClick(false);
                        handleClose();
                        setScore(0);
                        setCurrentQuestion(0);
                        setTryAgain(false);
                        setFormativeAns([]);
                      }}
                    >
                      Exit Assignment
                    </button>
                  </div>
                ) : qtype == 1 ? (
                  <div>
                    {" "}
                    <button
                      className="buttonQuizCt"
                      onClick={() => {
                        getAssignmentDataPost();
                        setBtnClick(false);
                        handleClose();
                        setScore(0);
                        setCurrentQuestion(0);
                      }}
                    >
                      Exit Assignment
                    </button>
                  </div>
                ) : null}
              </div>
            ) : answerReveal ? (
              <div>
                <div className="scrollQuiz">
                  <div className="question-section">
                    <div className="question-count">
                      <span>Question {currentQuestion + 1}</span>/
                      {quizQuestion.length}
                    </div>
                    <div
                      className="question-text"
                      dangerouslySetInnerHTML={{
                        __html: quizQuestion[currentQuestion].istem,
                      }}
                    >
                      {/* {quizQuestion[currentQuestion].istem} */}
                    </div>

                    {quizQuestion[currentQuestion].imageurl ? (
                      <div className="img_container">
                        <img
                          src={`${imgUrl}${quizQuestion[currentQuestion].imageurl}`}
                          alt="item"
                        />
                      </div>
                    ) : null}
                  </div>
                  {qtype != 3 ? (
                    <div className="answer-section">
                      {quizQuestion[currentQuestion].iopts.map(
                        (answerOption, idx) => (
                          <div style={{ display: "flex" }}>
                            {" "}
                            {formativeAns[currentQuestion] !== idx ? (
                              <button className={`buttonQuizAR`}>
                                {answerOption.content}
                              </button>
                            ) : (
                              <button
                                className={`buttonQuizAR`}
                                style={{
                                  backgroundColor: "lightgray",
                                  border: "2px solid #234668",
                                }}
                              >
                                {answerOption.content}
                              </button>
                            )}
                            {answerOption.correct == true ||
                            answerOption.correct == "true" ? (
                              <Done
                                className="right_size"
                                cls1="cls1_D"
                                cls2="cls2_D"
                              />
                            ) : (
                              <Reject
                                className="Wrong_size"
                                cls1="cls1_D"
                                cls2="cls2_D"
                              />
                            )}
                            {formativeAns[currentQuestion] !== idx ? null : (
                              <p
                                style={{
                                  fontSize: "14px",
                                  paddingLeft: "8px",
                                  paddingTop: "8px",
                                }}
                              >
                                Your Response
                              </p>
                            )}
                          </div>
                        )
                      )}
                      <br />
                    </div>
                  ) : null}
                  {currentQuestion > 0 ? (
                    <Button
                      color="primary"
                      variant="contained"
                      fullWidth
                      className="btn-size"
                      onClick={() => answerPrev()}
                      style={{ fontSize: "12px" }}
                    >
                      Prev
                    </Button>
                  ) : null}
                  {currentQuestion + 1 === quizQuestion.length ? (
                    <div></div>
                  ) : (
                    <Button
                      color="primary"
                      variant="contained"
                      fullWidth
                      className="btn-siz"
                      onClick={() => answerNext()}
                      style={{ float: "right", fontSize: "12px" }}
                    >
                      Next
                    </Button>
                  )}

                  <br />
                  <br />
                  <br />

                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    className="btn-sizeClose"
                    style={{
                      backgroundColor: "white",
                      color: "black",
                      border: "1px solid black",
                      width: "100px",
                      marginLeft: "45%",
                      fontSize: "12px",
                    }}
                    onClick={() => {
                      //handleClose();
                      setCurrentQuestion(0);
                      setShowScore(true);
                      setAnswerReveal(false);
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <div className="scrollQuiz">
                <div className="question-section">
                  <div className="question-count">
                    <span>Question {currentQuestion + 1}</span>/
                    {quizQuestion.length}
                  </div>
                  <div
                    className="question-text"
                    dangerouslySetInnerHTML={{
                      __html: quizQuestion[currentQuestion].istem,
                    }}
                  >
                    {/* {quizQuestion[currentQuestion].istem} */}
                  </div>
                </div>
                {qtype != 3 ? (
                  <div className="answer-section">
                    {qtype == 0 ? (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: `${
                            quizQuestion[currentQuestion].imageurl
                              ? "3fr 1fr"
                              : "1fr"
                          } `,
                          gridGap: "2rem",
                        }}
                      >
                        <div style={{ width: "100%" }}>
                          {quizQuestion[currentQuestion].iopts.map(
                            (answerOption, idx) => (
                              <React.Fragment key={"aaa" + idx}>
                                <div style={{ display: "flex" }}>
                                  <button
                                    // className="buttonQuiz"
                                    className={`buttonQuizFb ${
                                      answerOption.Selected ? "ddd" : ""
                                    }`}
                                    onClick={() => {
                                      handleCheck(answerOption, idx);
                                      console.log("ans", answerOption, idx);
                                    }}
                                    disabled={feedbackButton.submitted}
                                  >
                                    {answerOption.content}
                                  </button>
                                  {feedbackButton.submitted &&
                                  answerOption.correct == true ? (
                                    <Done
                                      className="right_size"
                                      cls1="cls1_D"
                                      cls2="cls2_D"
                                    />
                                  ) : (
                                    feedbackButton.submitted && (
                                      <Reject
                                        className="Wrong_size"
                                        cls1="cls1_D"
                                        cls2="cls2_D"
                                      />
                                    )
                                  )}
                                </div>
                                {answerOption.Selected &&
                                  feedbackButton.submitted && (
                                    <button className={`buttonQuizSq`}>
                                      {answerOption.feedback}
                                    </button>
                                  )}
                              </React.Fragment>
                            )
                          )}
                        </div>
                        <div style={{ width: "270px" }}>
                          {quizQuestion[currentQuestion].imageurl ? (
                            <div className="img_container">
                              <img
                                src={`${imgUrl}${quizQuestion[currentQuestion].imageurl}`}
                                // src={quizImage}
                                alt="item"
                              />
                            </div>
                          ) : null}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "3rem",
                          }}
                        >
                          <div>
                            {!feedbackButton.hideSubmit && (
                              <button
                                className="buttonFb"
                                disabled={feedbackButton.disableSubmit}
                                onClick={() => {
                                  feedbackButton.disableSubmit = true;
                                  feedbackButton.hideNext = false;
                                  feedbackButton.hideSubmit = true;
                                  feedbackButton.submitted = true;
                                  setFeedbackButton({
                                    ...feedbackButton,
                                  });
                                }}
                              >
                                Submit
                              </button>
                            )}
                            {!feedbackButton.hideNext && (
                              <>
                                {currentQuestion !== quizQuestion.length - 1 ? (
                                  <button
                                    className="buttonFb"
                                    onClick={() => {
                                      answerNext();
                                      setFeedbackButton({
                                        disableSubmit: true,
                                        hideNext: true,
                                        hideSubmit: false,
                                        submitted: false,
                                      });
                                      setQuizQuestion((currentQues) =>
                                        produce(currentQues, (v) => {
                                          v[currentQuestion].iopts.forEach(
                                            (opt) => {
                                              opt.Selected = false;
                                            }
                                          );
                                        })
                                      );
                                    }}
                                  >
                                    Next
                                  </button>
                                ) : (
                                  <button
                                    className="buttonFb"
                                    onClick={() => {
                                      markComplete();
                                      setScore(0);
                                      setTryAgain(false);
                                      setFormativeAns([]);
                                    }}
                                  >
                                    Completed
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                          <div>
                            <button
                              className="buttonFb-a"
                              onClick={() => {
                                if (
                                  currentQuestion !==
                                  quizQuestion.length - 1
                                ) {
                                  getAssignmentDataPost();
                                  setBtnClick(false);
                                  handleClose();
                                  setScore(0);
                                  setCurrentQuestion(0);
                                  setTryAgain(false);
                                  setFormativeAns([]);
                                } else {
                                  if (!feedbackButton.hideNext) {
                                    markComplete();
                                    setScore(0);
                                    setTryAgain(false);
                                    setFormativeAns([]);
                                  } else {
                                    getAssignmentDataPost();
                                    setBtnClick(false);
                                    handleClose();
                                    setScore(0);
                                    setCurrentQuestion(0);
                                    setTryAgain(false);
                                    setFormativeAns([]);
                                  }
                                }
                              }}
                            >
                              Exit
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {quizQuestion[currentQuestion].iopts.map(
                          (answerOption, idx) => (
                            <button
                              key={"a" + idx}
                              // className="buttonQuiz"
                              className={`buttonQuiz`}
                              data-id={`${
                                answerOption.correct == true
                                  ? answerOption.correct
                                  : null
                              }`}
                              onClick={() => {
                                handleAnswerOptionClick(answerOption, idx);
                                console.log("ans", answerOption, idx);
                              }}
                            >
                              {answerOption.content}
                            </button>
                          )
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div>
                    {!quizQuestion[currentQuestion].iopts ||
                    quizQuestion[currentQuestion].iopts.length === 0 ? (
                      <div className={classes.root}>
                        <Formik
                          initialValues={{
                            file: "",
                            text: "",
                            email: "",
                          }}
                          //validationSchema={validationSchema}
                          validateOnBlur={true}
                          onSubmit={async (
                            values,
                            { setSubmitting, resetForm }
                          ) => {
                            // setSubmittingg(true);
                            getPreSignedUrl(
                              {
                                file: values.file,
                                response: values.text,
                                email: values.email,
                              },
                              curObject
                            );
                            //handleNextQuestionClick();

                            setTimeout(() => resetForm(), 1500);
                            //setSubmitting(false);
                            //setSubmittingg(false);
                          }}
                          render={({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleSubmit,
                            handleBlur,
                            setFieldValue,
                            isSubmitting,
                          }) => {
                            // console.log(errors);
                            return (
                              <form
                                onSubmit={handleSubmit}
                                style={{
                                  display: "flex",
                                  gap: "2rem",
                                  flexDirection: "column",
                                }}
                              >
                                <Field
                                  validate={validateUsername}
                                  name="text"
                                  component={TextInputComponent}
                                  //errorMessage={errors["text"]}
                                  touched={touched["text"]}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  //value={formData.current[currentQuestion]}
                                />
                                {errors.text && (
                                  <div
                                    style={{
                                      //paddingRight: "50px",
                                      fontSize: "12px",
                                      color: "red",
                                    }}
                                  >
                                    {errors.text}
                                  </div>
                                )}
                                {errors.file && (
                                  <div
                                    style={{
                                      float: "right",
                                      textAlign: "end",
                                      //paddingRight: "50px",
                                      fontSize: "12px",
                                      color: "red",
                                      marginBottom: "-35px",
                                    }}
                                  >
                                    {errors.file}
                                  </div>
                                )}
                                <Field
                                  validate={validateEmail}
                                  name="file"
                                  component={CustomImageInput}
                                  title="Select a file"
                                  setFieldValue={setFieldValue}
                                  /* errorMessage={
                                    errors["file"] ? errors["file"] : undefined
                                  } */
                                  touched={touched["file"]}
                                  style={{ display: "flex" }}
                                  onBlur={handleBlur}
                                />

                                {currentQuestion + 1 === quizQuestion.length ? (
                                  navigator.onLine ? (
                                    <Button
                                      color="primary"
                                      variant="contained"
                                      fullWidth
                                      type="submit"
                                      disabled={isSubmittingg === true}
                                      className="btn-size"
                                    >
                                      {isSubmittingg ? "Loading..." : "Submit"}
                                    </Button>
                                  ) : (
                                    <p>You are offline</p>
                                  )
                                ) : (
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Button
                                      color="primary"
                                      variant="contained"
                                      fullWidth
                                      type="submit"
                                      disabled={isSubmittingg === true}
                                      className="btn-size"
                                    >
                                      {isSubmittingg ? "Loading..." : "Next"}
                                    </Button>
                                    {/* {currentQuestion > 0 ? (
                                      <Button
                                        color="default"
                                        variant="contained"
                                        fullWidth
                                        className="btn-siz"
                                        onClick={() => handlePrevQuestion()}
                                      >
                                        Prev
                                      </Button>
                                    ) : null} */}
                                  </div>
                                )}
                              </form>
                            );
                          }}
                        />
                      </div>
                    ) : (
                      <div className="answer-section">
                        {quizQuestion[currentQuestion].iopts.map(
                          (answerOption, id) => (
                            <button
                              key={"b" + id}
                              // className="buttonQuiz"
                              className={`buttonQuiz`}
                              data-id={`${
                                answerOption.correct == true
                                  ? answerOption.correct
                                  : null
                              }`}
                              onClick={() =>
                                handleAnswerOptionClick(answerOption)
                              }
                            >
                              {answerOption.content}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            {curObject.qtype == 3 ? (
              <div>
                {assignment ? (
                  assignmentLoad ? (
                    <CircularProgress color="default" size={30} />
                  ) : navigator.onLine ? (
                    <button
                      className="btnQuizLD"
                      onClick={() => {
                        getQuiz(curObject);
                        setShowScore(false);
                        setQIsLoading(true);
                        setAssignmentLoad(true);
                      }}
                    >
                      Assignment
                    </button>
                  ) : (
                    <p>you are offline</p>
                  )
                ) : (
                  <div>
                    {sMiniScore ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                          textAlign: "center",
                        }}
                      >
                        <h1
                          style={{
                            color: "#000",
                            textAlign: "center",
                            margin: "2.5rem 0",
                            boxShadow: "0 0 0 5px #e35f14",
                            borderRadius: "100%",
                            height: "100px",
                            width: "100px",
                            position: "relative",
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                            }}
                          >
                            {miniScore}/10
                          </span>
                        </h1>
                      </div>
                    ) : null}
                    <div style={{ color: "black" }}>
                      {assignmentLoad ? (
                        <CircularProgress color="default" size={30} />
                      ) : (
                        <h1>Assignment submitted..!</h1>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {summative ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      textAlign: "center",
                    }}
                  >
                    <h1
                      style={{
                        color: "#000",
                        textAlign: "center",
                        margin: "2.5rem 0",
                        boxShadow: "0 0 0 5px #e35f14",
                        borderRadius: "100%",
                        height: "120px",
                        width: "120px",
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        {sumScore} %
                      </span>
                    </h1>
                  </div>
                ) : (
                  <>
                    <br />
                    {curObject.qtype == 2 ? (
                      <div>
                        <h3 style={{ marginLeft: "-14px" }}>Instructions:</h3>
                        <div style={{ fontSize: "14px" }}>
                          <ol>
                            <li>
                              {" "}
                              Unit formative quiz consists of Multiple Choice
                              Questions.
                            </li>
                            <li> Click on "START QUIZ" button.</li>
                            <li>
                              {" "}
                              On starting the quiz, One question appears at a
                              time.
                            </li>
                            <li>
                              {" "}
                              Once you select an answer, you will get the next
                              question.
                            </li>
                            <li>
                              On answering all the questions, you should get a
                              score of 75% or more to view the right answers and
                              then click on "MARK COMPLETE" button.
                            </li>
                            <li>
                              Once you click on "MARK COMPLETE", the system
                              would allow you to move to the next Unit.
                            </li>
                            <li>
                              If you get {`< 75%`} score, you must click on "TRY
                              AGAIN" button to retake the quiz and improve your
                              score.
                            </li>
                          </ol>
                        </div>
                        <br />
                      </div>
                    ) : (
                      <div></div>
                    )}
                    <button
                      className="btnQuizLD"
                      onClick={() => {
                        getQuiz(curObject);
                        setShowScore(false);
                        setQIsLoading(true);
                        setFeedbackButton({
                          disableSubmit: true,
                          hideNext: true,
                          hideSubmit: false,
                          submitted: false,
                        });
                      }}
                    >
                      {qisLoading ? (
                        <CircularProgress color="default" size={30} />
                      ) : (
                        "Start Quiz"
                      )}
                    </button>{" "}
                    <br />
                    {/* <button
                      className="btnQuizLD"
                      onClick={() => {
                        getQuiz(curObject);
                        setAnswerReveal(true);
                        setShowScore(false);
                        //setQIsLoading(true);
                      }}
                    >
                      {qisLoading ? (
                        <CircularProgress color="default" size={30} />
                      ) : (
                        "Answers"
                      )}
                    </button> */}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  function answerView(curObject) {
    console.log("currentbody", quizQuestion);
    return (
      <div className="body" style={{ height: height - 400 }}>
        {/*    <div className="heading1">
          <h1
            style={{
              justifyContent: "start",
              color: "black",
            }}
          >
            {curObject.otitle}
          </h1>
        </div>

        <div className="app1">
          {
            <div className="scrollQuiz">
              <div className="question-section">
                <div className="question-count">
                  <span>Question {currentQuestion + 1}</span>/
                  {quizQuestion.length}
                </div>
                <div
                  className="question-text"
                  dangerouslySetInnerHTML={{
                    __html: quizQuestion[currentQuestion].istem,
                  }}
                > */}
        {/* {quizQuestion[currentQuestion].istem} */}
        {/*   </div>
                {quizQuestion[currentQuestion].imageurl ? (
                  <div className="img_container">
                    <img
                      src={`${imgUrl}${quizQuestion[currentQuestion].imageurl}`}
                      alt="item"
                    />
                  </div>
                ) : null}
              </div>
              {qtype == 2 ? (
                <div className="answer-section">
                  {quizQuestion[currentQuestion].iopts.map(
                    (answerOption, idx) => (
                      <button>{answerOption.content}</button>
                    )
                  )}
                </div>
              ) : null}
            </div>
          }
        </div> */}
      </div>
    );
  }

  return (
    <div>
      <div>
        {modallans()}
        <div style={{ position: "absolute", top: "0", right: "0" }}>
          <IconButton
            onClick={() => {
              handleClose();
              setTryAgain(false);
              setFormativeAns([]);
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </div>

      {loaded == true ? (
        <div>
          <div
            ref={full}
            style={{
              height: "600px",
              width: "1050px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            // style={
            //   curObject.otype == "quiz"
            //     ? {
            //         width: width - 300,
            //         height: height - 300,
            //         position: "relative",
            //       }
            //     : {
            //         height: height - 300,
            //         width: width - 300,
            //         padding: "2%",
            //         position: "relative",
            //         overflowY: "hidden",
            //         display: "flex",
            //         justifyContent: "center",
            //       }
            // }
          >
            {curObject.nenabled == true || curObject.nenabled == "true"
              ? renderObjects()
              : unitLockedView()}

            {curObject.otype === "Interactivity" ||
            curObject.otype === "pdf" ? (
              <IconButton
                style={{ position: "absolute", bottom: "28px", right: "50px" }}
                onClick={() => {
                  toggleFullScreen();
                  onFullScreen();
                }}
                className={classes.bottomIcons}
              >
                {fullscreen ? (
                  <Tooltip
                    title={
                      <p style={{ fontSize: "13px" }}>
                        Click here for full-screen mode
                      </p>
                    }
                    placement="top"
                  >
                    <Fullscreen
                      fontSize="large"
                      className={classes.volumeButton}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip
                    title={
                      <p style={{ fontSize: "13px" }}>
                        Click here for exit full-screen mode
                      </p>
                    }
                    placement="top"
                  >
                    <FullscreenExitIcon
                      fontSize="large"
                      className={classes.volumeButtonExit}
                      style={{ bottom: "200px" }}
                    />
                  </Tooltip>
                )}
              </IconButton>
            ) : null}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              padding: "2%",
            }}
          >
            {curObject.nenabled == true || curObject.nenabled == "true"
              ? renderButtons()
              : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CoursePlayer;
