import React, { useState, useEffect, useRef } from "react";
import config from "../../config/aws-exports";
import { API, Auth } from "aws-amplify";
import { useSelector, useDispatch } from "react-redux";
import { awsSignIn, authData } from "../../redux/auth/authSlice";
import Image from "react-bootstrap/Image";
import moment from "moment";
import assessStyle from "./Assessment.module.scss";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import {
  List,
  ListItem,
  ListItemIcon,
  TextareaAutosize,
  Typography,
  FormGroup,
  Checkbox,
  FormControlLabel,
  FormControl,
  Grid,
  Modal,
  Button,
  Box,
} from "@material-ui/core";
import StarOutlineIcon from "@material-ui/icons/StarOutline";
import Skeleton from "@material-ui/lab/Skeleton";
import { green } from "@material-ui/core/colors";
import { useFormik } from "formik";
import { Constants } from "../../config/constants";
import axios from "axios";
import Reject from "../../assets/svgjs/Reject";
import Done from "../../assets/svgjs/Done";
import TablePagination from '@material-ui/core/TablePagination';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Assess from './Assessment.module.scss';
import "./Assign.scss";
import { each } from "jquery";
import { Tab } from "bootstrap";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}


const Assessment = ({ courseId, progId }) => {
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: "absolute",
      width: 700,
      backgroundColor: "transparent",
      padding: 0,
      height: "auto",
    },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      transform: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
    },
    root: {
      width: "100%",
      backgroundColor: "transparent",
      "& .MuiBox-root": {
        margin: "-7px",
        padding: "8px",
        backgroundColor: "white",
      },
    },
  }));
  //const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD h:mm:ss a'));
  const [formatCurDate, setFormatCurDate] = useState(0);
  //const [time, setTime] = useState('20:00:00');
  //const [finishedAssessment, setFinishedAssessment] = useState(false);
  const [assessmentData, setAssessmentData] = useState([]);
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [openAnswer, setOpenAnswer] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userReponse, setUserReponse] = useState([]);
  const [score, setScore] = useState(0);
  const [quizQuestion, setQuizQuestion] = useState([]);
  const [btnClick, setBtnClick] = useState(false);
  const [assess, setAssess] = useState({});
  const [assessAns, setAssessAns] = useState({});
  const [imgUrl, setImgUrl] = useState("");
  const [correct, setCorrect] = useState();
  const [instructions, setInstructions] = useState([]);
  const [hoursv, setHoursv] = useState("");
  const [minutev, setMinutev] = useState("");
  const [secv, setSecv] = useState("");
  const [qsubmitted, setQsubmitted] = useState(false);
  const setIntervalRef = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const [intervaltimer, setIntervaltimer] = useState();
  const [timerDelay, setTimerDelay] = useState(10000);
  const apiTime = useRef("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [tscore, setTscore] = useState(0);
  let userDetails = useSelector(authData);
  const dispatch = useDispatch();
  const [checkboxes, setCheckboxes] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    getAssessmentData(userDetails);
    // formatDate();
    // getTimerModal();
    getTime();
    let sdata = { ...userDetails };

    dispatch(awsSignIn(sdata));
  }, []);

  // Styles for Pagination
const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

// Pagination function
function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
      <div className={classes.root}>
          <IconButton
              onClick={handleFirstPageButtonClick}
              disabled={page === 0}
              aria-label="first page"
          >
              {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
          </IconButton>
          <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
          </IconButton>
          <IconButton
              onClick={handleNextButtonClick}
              disabled={page >= Math.ceil(count / rowsPerPage) - 1}
              aria-label="next page"
          >
              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </IconButton>
          <IconButton
              onClick={handleLastPageButtonClick}
              disabled={page >= Math.ceil(count / rowsPerPage) - 1}
              aria-label="last page"
          >
              {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
          </IconButton>
      </div>
  );
}

  const formik = useFormik({
    initialValues: {
      response: "",
      file: null,
    },

    onSubmit: (values, { setSubmitting, resetForm }) => {
      async function getPreSignedUrl(value) {
        const jwttoken = (await Auth.currentSession()).idToken.jwtToken;

        console.log(jwttoken);
        var folder = "assessment";
        console.log(assess);
        const bodyParam = {
          body: {
            type: "workbook",
            wbtype: "js",
            filename: value.file.name,
            filetype: value.file.type,
            oid: config.aws_org_id,
            eid: userDetails.eid,
            quizid: courseId,
            assessid: assess.assessid,
            folder: folder,
          },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: jwttoken,
          },
        };
        console.log(bodyParam.body);
        try {
          const response = await API.post(
            config.aws_cloud_logic_custom_name,
            Constants.GET_PRESIGNED_URL,
            bodyParam
            //`${Constants.GET_MY_PROGRAMS}`, bodyParam,
          );

          console.log(response);
          console.log(value.file.name);
          fileUpload(value.file, response);
          console.log(value.file);
          quizQuestion[currentQuestion].orgname = value.file.name;
          quizQuestion[currentQuestion].name = value.file.name;
          setSubmitting(false);
          resetForm();
        } catch (error) {
          console.log("getCategoryError", error);
        }
      }
      getPreSignedUrl(values);
    },
  });

  async function fileUpload(file, url) {
    console.log(url);
    console.log(file);
    console.log(file.type);
    await axios
      .put(url, file, { headers: { "Content-Type": file.type } })
      .then((res) => {
        console.log(res);
        handleAnswerBtnClick();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async function getAssessmentData(userDetails) {
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        eid: userDetails.eid,
        bpid: progId,
        assessid: courseId,
        quiztype: "assess",
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    try {
      console.log("GET_ASSESSMENT===",bodyParam.body);
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.GET_ASSESSMENT,
        bodyParam
      );
      const { assessment } = response;
      let dummyAssess = null;

      console.log("response_ASSESSMENT===",assessment);
         if(assessment === undefined || assessment === []){
        setAssessmentData(dummyAssess);
      } else{
      setAssessmentData(assessment)
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  function toTimestamp(strDate) {
    var datum = Date.parse(strDate);
    return datum / 1;
  }

  function formatDate() {
    console.log("function");
    //let some = toTimestamp(moment().format('YYYY-MM-DD h:mm:ss a'));
    /*  console.log("function");
    console.log("timest", toTimestamp(moment().format("YYYY-MM-DD h:mm:ss a"))); */
   // setFormatCurDate(toTimestamp(moment().format("YYYY-MM-DD h:mm:ss a")))
    setInterval(() => {
      getTime();
    }, 10000);

    /* console.log(currentDate);
  let res = currentDate.split("-");
      if(res[1] != 0){
        res[1] = res[1] - 1;
      }
  let d = new Date(res[0], res[1], res[2]);
  setFormatCurDate(d.getTime());
  console.log("d",formatCurDate);
  console.log("date",moment(formatCurDate).format("DD/MM/YYYY  h:mm:ss a")) */
  }

  useInterval(() => {
    // Your custom logic here
    getTime();
  }, timerDelay);

  async function getTime() {
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        eid: userDetails.eid,
        bpid: progId,
        assessid: courseId,
        quiztype: "assess",
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    try {
      //console.log(bodyParam.body);
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.INDIAN_TIME,
        bodyParam
      );
      let date = new Date().getTime();
      console.log("Response" , response);
      console.log("date",date);
      setFormatCurDate(response.itime);
      apiTime.current = response.itime;
      //apiTime.current = response;
      //setApiTime(response)
     if(timerDelay != response.delay){
       console.log(response.delay)
      setTimerDelay(response.delay);
     }


      //setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }
  async function getTimerModal() {
    setIsLoading(true);
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        eid: userDetails.eid,
        bpid: progId,
        assessid: courseId,
        quiztype: "assess",
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    try {
      //console.log(bodyParam.body);
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.INDIAN_TIME,
        bodyParam
      );
      console.log("time", response);
      //setFormatCurDate(toTimestamp(response));
      apiTime.current = response;
      console.log("set", apiTime.current)
      //setApiTime(response)
      setIsLoading(false);
      //setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  // Assessment Timer
  function timerCount(valCheck) {
    console.log("valcheck");
    if (valCheck === undefined) {
      let interval = setInterval(() => {
        setIntervalRef.current = setIntervalRef.current - 1;
        let hours = Math.floor(setIntervalRef.current / 3600); // get hours
        let minutes = Math.floor((setIntervalRef.current - hours * 3600) / 60); // get minutes
        let seconds = setIntervalRef.current - hours * 3600 - minutes * 60;
/* console.log("t",setIntervalRef.current) */
        hours < 10 ? setHoursv("0" + hours) : setHoursv(hours);
        minutes < 10 ? setMinutev("0" + minutes) : setMinutev(minutes);
        seconds.toFixed() < 10
          ? setSecv("0" + seconds.toFixed())
          : setSecv(seconds.toFixed());

        if (setIntervalRef.current <= 2) {
          if (valCheck === undefined) {
            //setOpen(false);
            setQsubmitted(true);
            clearInterval(intervaltimer);
          }
        }
      }, 1000);
      setIntervaltimer(interval);
    }
    if (valCheck === true) {
      clearInterval(intervaltimer);
    }
  }

  const handleOpen = (assess) => {
    // moment().format("YYYY-MM-DD h:mm:ss a")
    setOpen(true);
    setAssess(assess);
    setIntervalRef.current =
      (assess.enddate - (new Date().getTime())) /
      1000;
    getQuiz(assess);
  };

  const handleAnswerModal = (assessAns) => {
    getAssessmentAns(assessAns);
    setOpenAnswer(true);
  };

  async function getAssessmentAns(assessAnsR) {
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        eid: userDetails.eid,
        quizid: assessAnsR.assessid,
        assessid: courseId,
        quiztype: "assess",
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    try {
      console.log(bodyParam.body);
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.GET_ASSESSMENT_ANSWERS,
        bodyParam
      );

      console.log("assessA", response);
      setAssessAns(response);
    } catch (error) {
      console.error(error);
    }
  }

  const handleClose = () => {
    setOpen(false);
    setUserReponse([]);
    setQuizQuestion([]);
    setCheckboxes([]);
    //setAssessmentData([]);
    setCurrentQuestion(0);
    setBtnClick(false);
    // window.location.reload(true);
    //getTimerModal();
    timerCount(true);
  };

  const handleAnswerOptionClick = (correct, index) => {
    quizQuestion[currentQuestion].response = index;
    console.log(quizQuestion[currentQuestion].response);
    setCorrect(correct);
  };

  function setCheckbox(index, checked) {
    console.log(checkboxes);
    const newCheckboxes = [...checkboxes];

    if (newCheckboxes[index].checked === undefined) {
      newCheckboxes[index].checked = false;
    }
    newCheckboxes[index].checked = checked;
    setCheckboxes(newCheckboxes);
    let tmp = 0;
    for (let k = 0; k < checkboxes.length; k++) {
      if (
        checkboxes[k].checked !== undefined &&
        checkboxes[k].checked === true
      ) {
        tmp = 1;
        setCorrect(true);
      }
      if (tmp === 0 && k == checkboxes.length - 1) {
        setCorrect(undefined);
      }
    }
  }

  const handleAnswerBtnClick = () => {
    if (correct === "true" || correct === true) {
      setScore(score + 1);
    }
    ansaddedtmp();
    const nextQuestion = currentQuestion + 1;

    if (nextQuestion < quizQuestion.length) {
      setCurrentQuestion(nextQuestion);
      if (
        quizQuestion[nextQuestion].atype == 3 ||
        quizQuestion[nextQuestion].atype == 5
      ) {
        setCheckboxes(quizQuestion[nextQuestion].iopts);
      }
    } else {
      handleClose();
    }
    setCorrect(undefined);
  };

  async function ansaddedtmp() {
    let tmpobj = {};

    if (
      quizQuestion[currentQuestion].atype == 5 ||
      quizQuestion[currentQuestion].atype == 3
    ) {
      tmpobj.response = [];
      checkboxes.forEach(function (element, index, array) {
        if (element.checked === true || element.checked === "true") {
          tmpobj.iid = quizQuestion[currentQuestion].iid;
          tmpobj.response.push(index);
        }
      });
    }

    if (quizQuestion[currentQuestion].atype == 7) {
      tmpobj.iid = quizQuestion[currentQuestion].iid;
      tmpobj.response = quizQuestion[currentQuestion].response;
    }
    if (
      quizQuestion[currentQuestion].atype == 2 ||
      quizQuestion[currentQuestion].atype == 1
    ) {
      tmpobj.iid = quizQuestion[currentQuestion].iid;
      tmpobj.response = quizQuestion[currentQuestion].response;
    }

    if (quizQuestion[currentQuestion].atype == 8) {
      tmpobj.iid = quizQuestion[currentQuestion].iid;
      tmpobj.fname = quizQuestion[currentQuestion].name;
      tmpobj.orgname = quizQuestion[currentQuestion].orgname;
    }
    tmpobj.atype = quizQuestion[currentQuestion].atype;
    console.log("tmpobj" + JSON.stringify(tmpobj));
    userReponse.push(tmpobj);

    setUserReponse(userReponse);
    responsesave(userReponse);
  }

  async function responsesave(jsondata) {
    var obj = {};
    obj.response = jsondata;

    if (quizQuestion.length === jsondata.length) {
      obj.status = 1;
    } else {
      obj.status = 0;
    }

    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        bpid: progId,
        cid: courseId,
        quizid: assess.assessid,
        eid: userDetails.eid,
        quizdata: obj,
        quiztype: "assess",
        tscore
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    console.log("UPDATE_ASSESSMENT==",JSON.stringify(bodyParam.body));
    const response = await API.post(
      config.aws_cloud_logic_custom_name,
      Constants.UPDATE_ASSESSMENT,
      bodyParam
    );
    console.log("response" ,response);
  }

  async function getQuiz(assess1) {
    setQsubmitted(false);
    timerCount();
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        assessid: courseId,
        quizid: assess1.assessid,
        eid: userDetails.eid,
        quiztype: "assess",
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    try {
      console.log(JSON.stringify(bodyParam.body));

      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.GET_ASSESSMENT_QUIZ,
        bodyParam
      );

      setInstructions(assess1.instructions);

      setQuizQuestion(response.qitems);
      if (response.qitems[0].atype == 3 || response.qitems[0].atype == 5) {
        setCheckboxes(response.qitems[0].iopts);
      }
      console.log("qitms", response.qitems);
      let totalscore = 0; 
      for(var l=0;l<response.qitems.length;l++){
        totalscore += parseInt(response.qitems[l].qscore);
      }
      setTscore(totalscore);
      if (response.response !== undefined && response.response !== "") {
        var resp = JSON.stringify(response.response);

        resp = JSON.parse(resp);
        //currentQuestion = response.length  + 1;

        if (resp.status == 1) {
          setQsubmitted(true);
        } else {
          setQsubmitted(false);
        }

        setUserReponse(resp.response === undefined ? [] : resp.response);
        setCurrentQuestion(
          resp.response === undefined ? 0 : resp.response.length
        );
        //setBtnClick(true);

        if (
          response.qitems[resp.response.length].atype == 3 ||
          response.qitems[resp.response.length].atype == 5
        ) {
          setCheckboxes(response.qitems[resp.response.length].iopts);
        }
        //let img = config.aws_content_delivery_cloudfront_domain+"jssaher-resources/images/assessment-images/"+userDetails.data.bcids[0]+"/"+assess1.assessid+"/";
        const imgUrl = `https://${
          Constants.DOMAIN
        }/${config.aws_org_id.toLowerCase()}-resources/images/assessment-images/${courseId}/${
          assess1.assessid
        }/`;
        setImgUrl(imgUrl);
        console.log(imgUrl);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function answerPrev() {
    console.log("curr", currentQuestion);
    const prevQuestion = currentQuestion - 1;

    setCurrentQuestion(prevQuestion);
  }

  function answerNext() {
    // console.log("curr", currentQuestion);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < assessAns.qitems.length) {
      setCurrentQuestion(nextQuestion);
    }
    console.log("curr", currentQuestion);
  }

  function viewAns() {
    if (
      assessAns.response !== undefined &&
      assessAns.response.response !== undefined
    ) {
      let l = assessAns.response.response.length - 1;
      let questionsA = assessAns.qitems.length;
      if (l >= currentQuestion) {
        if (
          assessAns.response.response[currentQuestion].iid ===
          assessAns.qitems[currentQuestion].iid
        ) {
          return assessAns.qitems[currentQuestion].iopts[
            assessAns.response.response[currentQuestion].response
          ].content;
        } else {
          return null;
        }
      } else {
        return <div style={{ color: "red" }}> You have not answerd </div>;
      }
    } else {
      return <div style={{ color: "red" }}> You have not answerd </div>;
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function secondcell(assess){
    var options = { timeZone: 'Asia/Kolkata',hour12: false,day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit" };
    let indianTimeZoneVal = new Date(assess.startdate).toLocaleString('en-US', options);
    let endndianTimeZoneVal = new Date(assess.enddate).toLocaleString('en-US', options);
    let answerFormat = new Date(assess.answerdate).toLocaleString('en-US', options);

    return(
      <TableCell style={{width: "30%"}}>
      {formatCurDate >= indianTimeZoneVal && formatCurDate <= endndianTimeZoneVal ?
      <button onClick={() => {handleOpen(assess)}} className={Assess.startbutton}>Start</button> : 
      (formatCurDate > endndianTimeZoneVal ? 
      (assess.userlist !== undefined ? 
        <>
     
        {assess.userlist[0].score === -1 ? 
        <p style={{fontSize:"16px", fontWeight: "bold"}}>Not Graded</p> :
          <p style={{fontSize:"16px", fontWeight: "bold"}}>Score: {assess.userlist[0].score}</p>}</>
        
       : null) : null)}
    {formatCurDate >= answerFormat ? 
    <p onClick={() => {handleAnswerModal(assess);}} style={{color:"blue", fontSize:"16px", textDecoration: "underline", paddingTop: "10px", cursor:"pointer"}}>Answers</p> : null}
    </TableCell>
    );
  }
 
  function tableview(){
    return(
      assessmentData.length >= 1 ?
      <TableBody>
      {(rowsPerPage > 0
        ? assessmentData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : assessmentData
      ).map((assess, index) => {
        return(
          assessmentData === undefined || assessmentData.length === 0 ? 
            <TableRow><TableCell>No Data</TableCell></TableRow>
            :
            <TableRow>
              <TableCell style={{width: "70%"}}>
                <div style={{display:"flex", aligntItems: "center", justifyContent:"flex-start", gap: "10px", flexDirection: "column"}}>
                  <h4 style={{fontSize: "18px", fontWeight: "400px"}}>{assess.title}</h4>
                  <p style={{fontSize:"14px"}}>Start: {moment(assess.startdate).format("DD/MM/YYYY  h:mm:ss a")}</p>
                  <p style={{fontSize:"14px"}}>End: {moment(assess.enddate).format("DD/MM/YYYY  h:mm:ss a")}</p>
                </div>
              </TableCell>
              {secondcell(assess)}
            </TableRow>
        ); 
      })}
      </TableBody> :
      <TableBody>
      <TableRow>
          <TableCell ></TableCell>
          <TableCell ><p style={{ paddingLeft: "25%" }}>No Data</p></TableCell>
      </TableRow>
    </TableBody>
    );
    };
  

  //console.log("err", assessmentData);
  return (
    <div className={"container " + assessStyle.assesscon}>
      <Typography component="list" variant="h1">
        {isLoading ? <Skeleton /> : null}
      </Typography>
      <Typography component="list" variant="h1">
        {isLoading ? <Skeleton /> : null}
      </Typography>
      <div className={assessStyle.unitAssesment} style={{ width: "100%" }}>
        <Table>
        {assessmentData === null ? 
              <TableBody>
                <TableRow><TableCell>No Data</TableCell></TableRow>
              </TableBody>  : isLoading ? '' : tableview()}
        <TableFooter>
                <TableRow>
                {assessmentData === null ? null :
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                        colSpan={3}
                        count={assessmentData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        SelectProps={{
                            inputProps: { 'aria-label': 'rows per page' },
                            native: true,
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                    />}
                </TableRow>
            </TableFooter>
        </Table>
        <Modal
          disableBackdropClick
          disablePortal
          disableEnforceFocus
          disableAutoFocus
          open={open}
          className={classes.modal}
          backdrop="static"
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div style={modalStyle} className={classes.paper}>
            <div className={assessStyle.body}>
              {qsubmitted ? (
                <>
                  <Box
                    component="div"
                    display="inline"
                    p={1}
                    m={1}
                    className={assessStyle.closestyle1}
                  >
                    <Button
                      className={assessStyle.closebtn}
                      onClick={handleClose}
                    >
                      X
                    </Button>
                  </Box>
                  <Box
                    component="div"
                    display="inline"
                    p={1}
                    m={1}
                    style={{ "font-size": "25px" }}
                  >
                    Assessment already submitted.
                  </Box>
                </>
              ) : (
                <>
                  {btnClick ? (
                    <div className={assessStyle.app1}>
                      <>
                        <p className={assessStyle.assesstimertext}>
                          <Box
                            display="inline"
                            p={1}
                            bgcolor="background.paper"
                          >
                            {hoursv}h
                          </Box>
                          <Box
                            display="inline"
                            p={1}
                            bgcolor="background.paper"
                          >
                            {minutev}m
                          </Box>
                          <Box
                            display="inline"
                            p={1}
                            bgcolor="background.paper"
                          >
                            {secv}s
                          </Box>
                        </p>
                        <Box
                          component="div"
                          display="inline"
                          p={1}
                          m={1}
                          className={assessStyle.closestyle}
                        >
                          <Button
                            className={assessStyle.closebtn}
                            onClick={handleClose}
                          >
                            X
                          </Button>
                        </Box>

                        <div className={assessStyle.questionsection}>
                          <div className={assessStyle.questioncount}>
                            <span>Question {currentQuestion + 1}</span>/
                            {quizQuestion.length}
                          </div>
                          <div className={assessStyle.questiontext}>
                            {quizQuestion.length !== 0 ||
                            quizQuestion !== undefined ||
                            quizQuestion[currentQuestion] !== undefined ? (
                              quizQuestion[currentQuestion].istem ==
                              undefined ? (
                                <></>
                              ) : quizQuestion[currentQuestion].atype ==
                                  undefined ||
                                quizQuestion[currentQuestion].atype == 6 ? (
                                <></>
                              ) : (
                              <div style={{fontSize:"15px"}}> <p  dangerouslySetInnerHTML={{ __html:  quizQuestion[currentQuestion].istem }}></p></div>
                              )
                            ) : null}

                            {quizQuestion[currentQuestion].img ? (
                              <div className="img_container">
                                <img
                                  src=
                                  {`${`https://${
                                    Constants.DOMAIN
                                  }/${config.aws_org_id.toLowerCase()}-resources/images/assessment-images/${courseId}/${
                                    assess.assessid
                                  }/`}${quizQuestion[currentQuestion].img}`}
                                  alt="item"
                                />
                              </div>
                            ) : null}
                          </div>
                        </div>
                        {quizQuestion[currentQuestion].atype == 7 ? (
                          <>
                            <TextareaAutosize
                              className={assessStyle.textarea}
                              rowsMax={6}
                              aria-label="maximum height"
                              placeholder="minimum 6 rows"
                              onChange={(e) => {
                                setCorrect("true");
                                quizQuestion[currentQuestion].response =
                                  e.target.value;
                              }}
                            />
                          </>
                        ) : (
                          <>
                            {quizQuestion[currentQuestion].atype == 1 ||
                            quizQuestion[currentQuestion].atype == 2 ||
                            quizQuestion[currentQuestion].atype == 4 ? (
                              <>
                                <div className={assessStyle.answersection}>
                                  <div
                                    className={
                                      "btn-group " +
                                      assessStyle.btngroupvertical
                                    }
                                  >
                                    {quizQuestion[currentQuestion].iopts.map(
                                      (answerOption, index, arrayobj) => (
                                        <>
                                          {quizQuestion[currentQuestion]
                                            .atype == 4 ? (
                                            <>
                                              <div>
                                                <input
                                                  type="radio"
                                                  className="btn-check"
                                                  name="options"
                                                  id={answerOption.content}
                                                />
                                                <label
                                                  className={
                                                    assessStyle.labelstyle +
                                                    " " +
                                                    assessStyle.buttonQuiz
                                                  }
                                                  for={answerOption.content}
                                                  onClick={() =>
                                                    handleAnswerOptionClick(
                                                      answerOption.correct,
                                                      index
                                                    )
                                                  }
                                                >
                                                  <Image
                                                    src={
                                                      imgUrl + answerOption.url
                                                    }
                                                    rounded
                                                  />
                                                </label>
                                              </div>
                                            </>
                                          ) : (
                                            <>
                                              <input
                                                type="radio"
                                                className="btn-check"
                                                name="options"
                                                id={answerOption.content}
                                                value={answerOption.content}
                                                checked={answerOption.Selected}
                                                onChange={() => {
                                                  for (
                                                    let i = 0;
                                                    i <
                                                    quizQuestion[
                                                      currentQuestion
                                                    ].iopts.length;
                                                    i++
                                                  ) {
                                                    quizQuestion[
                                                      currentQuestion
                                                    ].iopts[i].Selected = false;
                                                  }
                                                  answerOption.Selected = true;
                                                }}
                                              />
                                              <label
                                                className={
                                                  assessStyle.labelstyle +
                                                  " " +
                                                  assessStyle.buttonQuiz
                                                }
                                                for={answerOption.content}
                                                onClick={() =>
                                                  handleAnswerOptionClick(
                                                    answerOption.correct,
                                                    index
                                                  )
                                                }
                                              >
                                                {answerOption.content}
                                              </label>
                                              {/* <Button className={assessStyle.buttonQuiz + ' ' +className}
                                                            onClick={() => 
                                                              handleAnswerOptionClick(answerOption.correct,index)
                                                            } >
                                                            {answerOption.content}
                                                            {quizQuestion[currentQuestion].atype }
                                                          </Button> */}
                                            </>
                                          )}
                                        </>
                                      )
                                    )}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                {quizQuestion[currentQuestion].atype == 3 ||
                                quizQuestion[currentQuestion].atype == 5 ? (
                                  <div className={assessStyle.answersection}>
                                    <FormControl component="fieldset">
                                      <FormGroup aria-label="position" row>
                                        {quizQuestion[
                                          currentQuestion
                                        ].iopts.map(
                                          (answerOption, index, arrayobj) => (
                                            <>
                                              {quizQuestion[currentQuestion]
                                                .atype == 5 ? (
                                                <>
                                                  <div>
                                                    <FormControlLabel
                                                      className={
                                                        assessStyle.buttonQuiz
                                                      }
                                                      value={
                                                        <Image
                                                          src={
                                                            imgUrl +
                                                            answerOption.url
                                                          }
                                                          rounded
                                                        />
                                                      }
                                                      control={
                                                        <Checkbox color="primary" />
                                                      }
                                                      label={
                                                        <Image
                                                          src={
                                                            imgUrl +
                                                            answerOption.url
                                                          }
                                                          rounded
                                                        />
                                                      }
                                                      onChange={(e) => {
                                                        setCheckbox(
                                                          index,
                                                          e.target.checked
                                                        );
                                                      }}
                                                      labelPlacement="end"
                                                    />
                                                  </div>
                                                </>
                                              ) : (
                                                <>
                                                  <FormControlLabel
                                                    className={
                                                      assessStyle.buttonQuiz
                                                    }
                                                    value={answerOption.content}
                                                    control={
                                                      <Checkbox color="primary" />
                                                    }
                                                    label={answerOption.content}
                                                    onChange={(e) => {
                                                      setCheckbox(
                                                        index,
                                                        e.target.checked
                                                      );
                                                    }}
                                                    labelPlacement="end"
                                                  />
                                                </>
                                              )}
                                            </>
                                          )
                                        )}
                                      </FormGroup>
                                    </FormControl>
                                  </div>
                                ) : (
                                  <>
                                    {quizQuestion[currentQuestion].atype ==
                                    8 ? (
                                      <>
                                        <form onSubmit={formik.handleSubmit}>
                                          <div className="file-input">
                                            <input
                                              type="file"
                                              id="file"
                                              name="file"
                                              className="file"
                                              onChange={(event) => {
                                                formik.setFieldValue(
                                                  "file",
                                                  event.currentTarget.files[0]
                                                );
                                              }}
                                              multiple
                                              required
                                            />
                                            <label for="file">
                                              Select file
                                              <p className="file-name"></p>
                                            </label>
                                          </div>

                                          {currentQuestion + 1 ===
                                          quizQuestion.length ? (
                                            <Button
                                              color="primary"
                                              variant="contained"
                                              fullWidth
                                              type="submit"
                                            >
                                              {formik.isSubmitting
                                                ? "Loading..."
                                                : "Submit"}
                                            </Button>
                                          ) : (
                                            <Button
                                              color="primary"
                                              variant="contained"
                                              fullWidth
                                              type="submit"
                                            >
                                              {formik.isSubmitting
                                                ? "Loading..."
                                                : "Next"}
                                            </Button>
                                          )}
                                        </form>
                                      </>
                                    ) : (
                                      <>
                                        {quizQuestion[currentQuestion].atype ==
                                        6 ? (
                                          <>
                                            <p
                                              className={assessStyle.matchThe}
                                              dangerouslySetInnerHTML={{
                                                __html:
                                                  quizQuestion[currentQuestion]
                                                    .istem,
                                              }}
                                            ></p>{" "}
                                            {quizQuestion[
                                              currentQuestion
                                            ].iopts.map(
                                              (
                                                answerOption,
                                                index,
                                                arrayobj
                                              ) => (
                                                <>
                                                  {quizQuestion[currentQuestion]
                                                    .atype == 4 ? (
                                                    <>
                                                      <div>
                                                        <input
                                                          type="radio"
                                                          className="btn-check"
                                                          name="options"
                                                          id={
                                                            answerOption.content
                                                          }
                                                        />
                                                        <label
                                                          className={
                                                            assessStyle.labelstyle +
                                                            " " +
                                                            assessStyle.buttonQuiz
                                                          }
                                                          for={
                                                            answerOption.content
                                                          }
                                                          onClick={() =>
                                                            handleAnswerOptionClick(
                                                              answerOption.correct,
                                                              index
                                                            )
                                                          }
                                                        >
                                                          <Image
                                                            src={
                                                              imgUrl +
                                                              answerOption.url
                                                            }
                                                            rounded
                                                          />
                                                        </label>
                                                      </div>
                                                    </>
                                                  ) : (
                                                    <>
                                                      <input
                                                        type="radio"
                                                        className="btn-check"
                                                        name="options"
                                                        id={
                                                          answerOption.content
                                                        }
                                                      />
                                                      <label
                                                        className={
                                                          assessStyle.labelstyle +
                                                          " " +
                                                          assessStyle.buttonQuiz
                                                        }
                                                        for={
                                                          answerOption.content
                                                        }
                                                        onClick={() =>
                                                          handleAnswerOptionClick(
                                                            answerOption.correct,
                                                            index
                                                          )
                                                        }
                                                      >
                                                        {answerOption.content}
                                                      </label>
                                                      {/* <Button className={assessStyle.buttonQuiz + ' ' +className}
                                                            onClick={() => 
                                                              handleAnswerOptionClick(answerOption.correct,index)
                                                            } >
                                                            {answerOption.content}
                                                            {quizQuestion[currentQuestion].atype }
                                                          </Button> */}
                                                    </>
                                                  )}
                                                </>
                                              )
                                            )}
                                          </>
                                        ) : (
                                          <>d</>
                                        )}
                                      </>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </>
                        )}
                        {quizQuestion[currentQuestion].atype == 8 ? (
                          <></>
                        ) : (
                          <>
                            <Button
                              variant="contained"
                              color="primary"
                              className={assessStyle.nextbtn}
                              disabled={correct === undefined}
                              onClick={() => handleAnswerBtnClick()}
                            >
                              {currentQuestion == quizQuestion.length - 1
                                ? "Submit"
                                : "Next"}
                            </Button>
                          </>
                        )}
                      </>
                    </div>
                  ) : (
                    <>
                      {quizQuestion.length === 0 ? (
                        <>
                          <Typography component="div" key="h2" variant="h2">
                            <Skeleton />
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Grid container spacing={1}>
                            <Box
                              component="div"
                              display="inline"
                              p={1}
                              m={1}
                              className={assessStyle.closestyle1}
                            >
                              <Button
                                className={assessStyle.closebtn}
                                onClick={handleClose}
                              >
                                X
                              </Button>
                            </Box>
                            <Grid item xs={12} className={assessStyle.grid1}>
                              <List
                                component="nav"
                                className={classes.root}
                                aria-label="contacts"
                              >
                                <h1 className={assessStyle.heading}>
                                  Instruction
                                </h1>
                                {instructions.map((arritem) => (
                                  <>
                                    <ListItem
                                      className={assessStyle.MuiListItembutton}
                                    >
                                      <ListItemIcon>
                                        <StarOutlineIcon
                                          style={{
                                            color: green[500],
                                            height: 20,
                                          }}
                                        />
                                      </ListItemIcon>
                                      <p>{arritem}</p>
                                    </ListItem>
                                  </>
                                ))}
                              </List>
                            </Grid>
                            <Grid item xs={12} className={assessStyle.grid2}>
                              <Button
                                variant="contained"
                                color="primary"
                                className={assessStyle.nextbtn}
                                onClick={() => {
                                  setBtnClick(true);
                                }}
                                style={{
                                  paddingBottom: "10px",
                                  marginRight: "20px",
                                }}
                              >
                                Start Quiz
                              </Button>

                              <Button
                                variant="contained"
                                color="primary"
                                className={assessStyle.nextbtn}
                                onClick={() => {
                                  setOpen(false);
                                }}
                              >
                                Close
                              </Button>
                            </Grid>
                          </Grid>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </Modal>
        <Modal
          disableBackdropClick
          disablePortal
          disableEnforceFocus
          disableAutoFocus
          open={openAnswer}
          className={classes.modal}
          backdrop="static"
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div style={modalStyle} className={classes.paper}>
            <div className={assessStyle.bodyAns}>
              {/*  <pre style={{ color: "white" }}>
                {quizQuestion === undefined || quizQuestion.length === 0 ? (
                  <p>p </p>
                ) : quizQuestion.istem === undefined ? null : (
                  <pre>
                    {console.log("ll", quizQuestion[currentQuestion].istem)}
                  </pre>
                )}
              </pre> */}
              {assessAns.qitems === undefined ||
              assessAns.qitems.length === 0 ? (
                <div style={{ fontSize: "15px" }}>Loading.. </div>
              ) : assessAns.qitems[currentQuestion].atype == "2" ? (
                <div>
                  <div className={assessStyle.questionsection}>
                    <div
                      style={{
                        fontWeight: "bold",
                        float: "right",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setOpenAnswer(false);
                        setCurrentQuestion(0);

                        setAssessAns([]);
                      }}
                    >
                      {" "}
                      X{" "}
                    </div>
                    <div className={assessStyle.questioncount}>
                      <span>Question {currentQuestion + 1}</span>/
                      {assessAns.qitems.length}
                    </div>
                    <div className={assessStyle.questiontext}>
                      {assessAns.qitems[currentQuestion].istem}
                      {assessAns.qitems[currentQuestion].img ? (
                        <div className="img_container">
                          <img
                            src={`${imgUrl}${assessAns.qitems[currentQuestion].img}`}
                            alt="item"
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className={assessStyle.answersection}>
                    <div
                      className={"btn-group " + assessStyle.btngroupvertical}
                    >
                      {assessAns.qitems[currentQuestion].iopts.map(
                        (answerOption, index, arrayobj) => (
                          <>
                            <div style={{}}>
                              <div>
                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="options"
                                  id={answerOption.content}
                                />
                                <div style={{ display: "flex" }}>
                                  <label
                                    className={
                                      assessStyle.labelstyleAns +
                                      " " +
                                      assessStyle.buttonQuizAns
                                    }
                                    for={answerOption.content}
                                  >
                                    {answerOption.content}
                                  </label>
                                  <span>
                                    {answerOption.correct === "true" ? (
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
                                  </span>
                                </div>
                              </div>
                            </div>
                          </>
                        )
                      )}
                    </div>
                  </div>
                  <br />

                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      display: "flex",
                      marginBottom: "10px",
                    }}
                  >
                    Your Answer :{" "}
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        paddingLeft: "15px",
                      }}
                    >
                      {
                        viewAns()

                        /*  */
                      }
                    </div>
                  </div>
                  {currentQuestion > 0 ? (
                    <Button
                      color="primary"
                      variant="contained"
                      className="btn-size"
                      onClick={() => answerPrev()}
                      style={{ fontSize: "12px" }}
                    >
                      Prev
                    </Button>
                  ) : null}
                  {currentQuestion + 1 === assessAns.qitems.length ? (
                    <div></div>
                  ) : (
                    <Button
                      color="primary"
                      variant="contained"
                      className="btn-siz"
                      onClick={() => answerNext()}
                      style={{ float: "right", fontSize: "12px" }}
                    >
                      Next
                    </Button>
                  )}
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      fontWeight: "bold",
                      float: "right",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setOpenAnswer(false);
                      setCurrentQuestion(0);
                      setAssessAns([]);
                    }}
                  >
                    {" "}
                    X{" "}
                  </div>
                  <div style={{}}>
                    <p
                      style={{
                        textAlign: "center",
                        fontSize: "18px",
                      }}
                    >
                      {" "}
                      No Answers
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>
      </div>
      <hr />
    </div>
  );
};

export default Assessment;
