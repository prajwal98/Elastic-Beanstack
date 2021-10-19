import React, { useState, useEffect, useRef } from "react";
import config from "../../config/aws-exports";
import { API, Auth } from "aws-amplify";
import { useSelector, useDispatch } from "react-redux";
import { awsSignIn, authData } from "../../redux/auth/authSlice";
import Image from "react-bootstrap/Image";
import moment from "moment";
import assessStyle from "../Assignment/Assignment.module.scss";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
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
import "./Assign.scss";
import { ImageSearchTwoTone } from "@material-ui/icons";
import TablePagination from '@material-ui/core/TablePagination';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

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


const Assignment = ({ courseId, progId }) => {
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: "absolute",
      width: 700,
      backgroundColor: "transparent",
      padding: 0,
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
    },
  }));
  //const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD h:mm:ss a'));

  //const [time, setTime] = useState('20:00:00');
  //const [finishedAssessment, setFinishedAssessment] = useState(false);
  const [assessmentData, setAssessmentData] = useState([]);
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userReponse, setUserReponse] = useState([]);
  const [score, setScore] = useState(0);
  const [quizQuestion, setQuizQuestion] = useState([]);
  const [btnClick, setBtnClick] = useState(false);
  const [assess, setAssess] = useState({});
  const [imgUrl, setImgUrl] = useState("");
  const [correct, setCorrect] = useState();
  const [instructions, setInstructions] = useState([]);
  const [hoursv, setHoursv] = useState("");
  const [minutev, setMinutev] = useState("");
  const [secv, setSecv] = useState("");
  const [qsubmitted, setQsubmitted] = useState(false);
  const setIntervalRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [tscore, setTscore] = useState(0);
  let userDetails = useSelector(authData);
  const dispatch = useDispatch();
  const [checkboxes, setCheckboxes] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    getAssessmentData(userDetails);

    let sdata = { ...userDetails };

    dispatch(awsSignIn(sdata));
  }, []);

  const formik = useFormik({
    initialValues: {
      response: "",
      file: null,
    },

    onSubmit: (values, { setSubmitting, resetForm }) => {
      async function getPreSignedUrl(value) {
        var folder = "assignment";
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
        quiztype: "assign",
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    try {
      console.log("Assignmentbody===",bodyParam.body);
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        `/getAssessment`,
        bodyParam
      );
      const { assessment } = response;
      console.log("Assignment===", JSON.stringify(assessment))
      let dummyAssess = ""

      if(assessment === undefined || assessmentData === []){
        setAssessmentData(dummyAssess);
      } else{
      setAssessmentData(assessment)
      }
      setIsLoading(false);
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

  const handleOpen = (assess) => {
    setOpen(true);
    setAssess(assess);
    getQuiz(assess);
  };

  const handleClose = () => {
    setOpen(false);
    setUserReponse([]);
    setQuizQuestion([]);
    setCheckboxes([]);
    setCurrentQuestion(0);
    setBtnClick(false);
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
        quiztype: "assign",
        tscore,
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
    console.log(response);
  }
  async function getQuiz(assess1) {
    setQsubmitted(false);

    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        assessid: courseId,
        quizid: assess1.assessid,
        eid: userDetails.eid,
        quiztype: "assign",
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
      imagSet(assess1.assessid);
      setInstructions(assess1.instructions);
      setQuizQuestion(response.qitems);
      let totalscore = 0; 
      for(var l=0;l<response.qitems.length;l++){
        totalscore += parseInt(response.qitems[l].qscore);
      }
      setTscore(totalscore);
      if (response.qitems[0].atype == 3 || response.qitems[0].atype == 5) {
        setCheckboxes(response.qitems[0].iopts);
      }
      console.log(response.qitems);
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
        /* const imgUrl = `https://${
          config.DOMAIN
        }/${config.aws_org_id.toLowerCase()}-resources/images/assignment-images/${courseId}/${
          assess1.assessid
        }/`;
        setImgUrl(imgUrl);
        console.log(imgUrl); */
        imagSet(assess1.assessid);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  console.log(JSON.stringify(assessmentData));

  function tableview(){
    return(
      assessmentData.length >= 1 ?
                <TableBody>
                    {(rowsPerPage > 0
            ? assessmentData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : assessmentData
          ).map((assess, index) => {
                        return (
                          <TableRow>
                            <TableCell style={{width: "80%"}}>
                              <p style={{ fontSize: "16px", fontWeight: 400}} alignItems="flex-start" >{assess.title}
              </p>
              <p style={{ fontSize: "14px", fontWeight: 400}}>Answer Reveal Date: {moment(assess.answerdate).format("MMMM Do YYYY, h:mm:ss a")}</p>
              </TableCell>
              <TableCell style={{width: "20%"}}>
                  {assess.userlist !== undefined ? (
                    <>
                       {assess.userlist[0].score === -1 && <p style={{
                        fontSize: "14px",
                        fontWeight: 400,
                      }}
                      >
                        Not graded
                      </p>} 
                      {assess.userlist[0].score !== -1 && <p style={{
                        fontSize: "14px",
                        fontWeight: 400,
                      }}
                      >
                        Score : {assess.userlist[0].score}
                      </p>} 
                      </>
                  ) : (
                    <button
                      className={assessStyle.startbutton}
                      onClick={() => {
                        handleOpen(assess);
                      }}
                    >
                      Start
                    </button>
                  )}
                </TableCell>
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

  function imagSet(assess) {
    console.log("ggg", assess);
    const imgUrl = `https://${
      config.DOMAIN
    }/${config.aws_org_id.toLowerCase()}-resources/images/assignment-images/${courseId}/${assess}/`;
    setImgUrl(imgUrl);
  }
  console.log("jhjhdddd", imgUrl);
  return (
    <div className={"container " + assessStyle.assesscon}>
      <Typography component="list" variant="h1">
        {isLoading ? <Skeleton /> : null}
      </Typography>
      <Typography component="list" variant="h1">
        {isLoading ? <Skeleton /> : null}
      </Typography>
      <div className={assessStyle.unitAssesment} style={{ width: "100%" }}>
            <div style={{width: "100%"}}>
            <Table style={{width: "100%"}}>
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
            </div>
        
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
                    Assignment already submitted.
                  </Box>
                </>
              ) : (
                <>
                  {btnClick ? (
                    <div className={assessStyle.app1}>
                      <>
                        {/* <p className={assessStyle.assesstimertext}><Box component="div" display="inline" p={1} m={1} bgcolor="background.paper" >{hoursv} </Box>
                        <Box component="div" display="inline" p={1} m={1} bgcolor="background.paper">{minutev}</Box>
                        <Box component="div" display="inline" p={1} m={1} bgcolor="background.paper">{secv}</Box>

                      </p> */}
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
                            {quizQuestion[currentQuestion].atype == 6 ? (
                              <></>
                            ) : (
                              quizQuestion[currentQuestion].istem
                            )}

                            {quizQuestion[currentQuestion].img ? (
                              <div className="img_container">
                                <img
                                  src={`${imgUrl}${quizQuestion[currentQuestion].img}`}
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
                                                  event.target.files[0]
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
                                          style={{ color: green[500] }}
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
                              >
                                Start Quiz
                              </Button>
                              <br />
                              <br />
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
      </div>
      <hr />
    </div>
  );
};

export default Assignment;
