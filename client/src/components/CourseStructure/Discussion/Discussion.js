import React, { useState, useEffect } from "react";
import config from "../../../config/aws-exports";
import { Constants } from "../../../config/constants";
import { API } from "aws-amplify";
import { useSelector, useDispatch } from "react-redux";
import { awsSignIn, authData } from "../../../redux/auth/authSlice";
import discussionStyle from "./Discussion.module.scss";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Skeleton from "@material-ui/lab/Skeleton";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ReactComponent as Close} from '../../../assets/svg/close_black_24dp.svg';
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import swal from "sweetalert";

import Delete from "../../../assets/svgjs/Delete";
import Reply from "../../../assets/svgjs/Reply";
import { AddAlertSharp } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
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
    width: "500px",
    borderRadius: "4px",
    border: "none",
    padding: theme.spacing(2, 4, 3),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));
const Accordion = withStyles({
  root: {
    "& .MuiAccordionDetails-root": {
      display: "block",
    },

    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

//Main Function
function Discussion({ courseId }) {
  const [open, setOpen] = useState(false);
  const [txtQuestion, setTxtQuestion] = useState("");
  const [txtAnswer, setTxtAnswer] = useState("");
  const [discussion, setDiscussion] = useState([]);
  const classes = useStyles();
  const [expanded, setExpanded] = useState("panel1");
  const [Index, setIndex] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  let userDetails = useSelector(authData);
  const [alertSpan , setAlertSpan] = useState("");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    getDiscussionData();
  }, []);

  async function getDiscussionData() {
    setIsLoading(true);
    const bodyParam = {
      body: {
        oid: config.aws_org_id,

        bpid: courseId,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        `/getDiscussion`,
        bodyParam
      );
      const { discussion } = response;
      console.log("discussion", discussion);
      setDiscussion(discussion);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  function postQuestionValidation(e) {
    e.preventDefault();
    if (txtQuestion.split(" ").length <= 80) {
      setAlertSpan("");
  } 
    if (txtQuestion === "" || txtQuestion == null ) {
      swal("Cannot be empty");
    } 
    else if (!txtQuestion.trim()) {
      setAlertSpan("Cannot submit only white spaces");
    }
     else if (txtQuestion.split(" ").length >= 80) {
      setAlertSpan("Should be less then 80 words");
    } else postQuestion(e);
  }

  function postAnswerValidate(e) {
    e.preventDefault();
    if (txtAnswer.split(" ").length <= 80) {
      setAlertSpan("");
  } 
    if (txtAnswer === "" || txtAnswer == null ) {
      swal("Cannot be empty");
    } 
    else if (!txtAnswer.trim()) {
      setAlertSpan("Cannot submit only white spaces");
    }
     else if (txtAnswer.split(" ").length >= 80) {
      setAlertSpan("Should be less then 80 words");
    } else postAnswer(e);
    setOpen(false);
  }

  const postQuestion = (e) => {
    e.preventDefault();
    if (txtQuestion === "") console.log(userDetails);
    console.log("m", txtQuestion);

    let discusobj = {};
    discusobj.qid = discussion.length == 0 ? 1 : discussion.length + 1;
    discusobj.question = txtQuestion;
    discusobj.emailId = userDetails.email;
    discusobj.username = userDetails.name;
    discusobj.answers = [];

    console.log("obj", discusobj);

    getJsonFile(discusobj, 0);
    setTxtQuestion("");

    //listDiscussion();
  };
  function postAnswer(e) {
    e.preventDefault();
    console.log("ind", Index);
    var discusobj = {};
    discusobj.aid =
      discussion[Index].answers != undefined &&
        discussion[Index].answers.length != 0
        ? discussion[Index].answers[discussion[Index].answers.length - 1].aid +
        1
        : 1;
    discusobj.answer = txtAnswer;
    discusobj.emailId = userDetails.email;
    discusobj.username = userDetails.name;
    console.log("obj", discusobj);

    getJsonFile(discusobj, 1, discussion[Index].qid);
    setTxtAnswer("");
  }

  function getJsonFile(obj, type, qind) {
    var body = {};

    body = {
      bpid: courseId,
      oid: config.aws_org_id,
      qtype: type,
      jdata: obj,
    };
    if (type !== 0) {
      body.qid = qind;
    } else {
      body.qid = "";
    }
    if (type === 3) {
      body.aid = obj;
    } else {
      body.aid = "";
    }

    updateDiscussion(body);
    document.getElementById("textQ").value = "";
  }

  async function updateDiscussion(bodyObj) {
    setIsLoading(true);
    const bodyParam = {
      body: bodyObj,

      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        `/updateDiscussion
        `,
        bodyParam
      );

      getDiscussionData();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
    // listDiscussion();
  }
  console.log("openO", open);

  function answerModal() {
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
              >
                <Close onClick={() => { handleClose();}} style={{cursor: "pointer"}}/>
              </span>
              <p style={{ fontSize: "26px", textAlign: "center" }}>
                Post Answer
              </p>
              <form>
                <div className={discussionStyle.embedsubmitfields}>
                  <input
                    className={discussionStyle.disscussionInputPopup}
                    type="text"
                    placeholder="Post your answer here"
                    onChange={(event) => setTxtAnswer(event.target.value)}
                  />
                  <button
                    style={{ marginTop: "40%" }}
                    className={discussionStyle.buttonPost}
                    onClick={(e) => {
                      postAnswerValidate(e);
                    }}
                  >
                    Post Answer
                  </button>
                  <span
                    style={{
                      marginTop: "40%",
                      marginRight: "65%",
                      cursor: "pointer",
                      width: "120px",
                      height: "29px",
                      padding: "5px 0px 0px 28px",
                    }}
                    className={discussionStyle.buttonCancel}
                    onClick={() => {
                      handleClose();
                    }}
                  >
                    Cancel
                  </span>
                  {/*  <button
            style={{marginTop: "40%",marginRight:"78%"}}
            className={discussionStyle.buttonPost}
              onClick={() => {
                handleClose()
              }}
            >
              Cancel
            </button> */}
                </div>
              </form>
            </div>
          </Fade>
        </Modal>
      </>
    );
  }

  function deleteQuestion(index) {
    let question = discussion[index];
    getJsonFile(question, 2, question.qid);
  }

  function deleteAnswer(index, ansIndex) {
    console.log("hjas");
    console.log("qid", index);
    console.log("aid", ansIndex);
    getJsonFile(
      discussion[index].answers[ansIndex].aid,
      3,
      discussion[index].qid
    );
  }

  console.log(discussion);
  function listDiscussion() {
    return (
      <List className={classes.root}>
        {discussion.map(({ question, username, emailId }, index) => {
          return (
            <div>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        marginBottom: "9px",
                        color: "#333333",
                      }}
                    >
                      {username}
                    </p>
                  }
                  secondary={
                    <div
                      className={discussionStyle.messageContent}
                      style={{ fontSize: "16px" }}
                    >
                      {question}

                      <p>
                        {discussion[index].answers.length > 0 ? (
                          <Accordion square onChange={handleChange("panel1")}>
                            <AccordionSummary
                              aria-controls="panel1d-content"
                              id="panel1d-header"
                            >
                              <a
                                style={{ fontSize: "small", color: config.main_color_1 }}
                                href
                              >
                                {discussion[index].answers.length} answers
                              </a>
                              <hr />
                            </AccordionSummary>

                            <AccordionDetails>
                              {discussion[index].answers.map(
                                ({ answer, username, emailId }, ansIndex) => {
                                  return (
                                    <div style={{ width: "100%" }}>
                                      <ListItem alignItems="flex-start">
                                        <ListItemAvatar>
                                          <Avatar />
                                        </ListItemAvatar>
                                        <ListItemText
                                          primary={
                                            <p
                                              style={{
                                                fontSize: "small",
                                                color: config.main_color_1,
                                                marginBottom: "5px",
                                              }}
                                            >
                                              {username}
                                            </p>
                                          }
                                          secondary={
                                            <div
                                              className={
                                                discussionStyle.messageContent
                                              }
                                              style={{ fontSize: "medium", paddingRight: "10px" }}
                                            >
                                              {answer}
                                            </div>
                                          }
                                        />
                                        {userDetails.email == emailId ? <div
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            deleteAnswer(index, ansIndex)
                                          }
                                        >
                                          <Delete
                                            className={
                                              discussionStyle.deleteIcon
                                            }
                                          />
                                        </div> : null}
                                      </ListItem>
                                      <hr />
                                      <br />
                                    </div>
                                  );
                                }
                              )}
                            </AccordionDetails>
                          </Accordion>
                        ) : (
                          <p>
                            <a style={{ fontSize: "small" }} href>
                              0 answers
                            </a>
                          </p>
                        )}
                      </p>
                    </div>
                  }
                />
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setOpen(true);
                    setIndex(index);
                  }}
                >
                  <Reply className={discussionStyle.replyIcon} />
                </div>
                {userDetails.email == emailId ? <div
                  style={{ cursor: "pointer" }}
                  onClick={() => deleteQuestion(index)}
                >
                  <Delete className={discussionStyle.deleteIcon} />
                </div> : null}
              </ListItem>
              <hr />
            </div>
          );
        })}
      </List>
    );
  }

  return (
    <div>
      {answerModal()}
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div>
        <form>
          <div className={discussionStyle.embedsubmitfield}>
            <span className={discussionStyle.alertspan}>{alertSpan}</span><br/>
            <input
              className={discussionStyle.disscussionInput}
              type="text"
              placeholder="Post your question.."
              id="textQ"
              onChange={(event) => setTxtQuestion(event.target.value)}
            /><br/><br/>
            <button
              className={discussionStyle.buttonPost}
              onClick={(e) => {
                postQuestionValidation(e);
              }}
            >
              Post question
            </button>
          </div>
        </form>
      </div>

      <div>
        {listDiscussion()}
      </div>

      {/*   <List className={classes.root}>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar />
          </ListItemAvatar>
          <ListItemText
            style={{ marginTop: "30px" }}
            primary="User Name"
            secondary={
              <div
                  className="messageContent"
                  style={{ fontSize: "large" }}
                >
                  {"the question posted by student"}
               
                <p>.</p>
                <p>
                  <Accordion
                    square
                   
                    onChange={handleChange("panel1")}
                  >
                    <AccordionSummary
                      aria-controls="panel1d-content"
                      id="panel1d-header"
                    >
                      <a href>1 answers</a>
                      <hr />
                    </AccordionSummary>
                    <AccordionDetails>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar />
                        </ListItemAvatar>
                        <ListItemText
                          primary="User Name"
                          secondary={
                            <div
                                className="messageContent"
                                style={{ fontSize: "large" }}
                              >
                                {"the question posted by student"}
                              
                              <p>.</p>
                              <p>
                                <a href>0 answers</a>
                              </p>
                            </div>
                          }
                        />
                        <Reply className="replyIcon" />
                        <Delete className="deleteIcon" />
                      </ListItem>
                    </AccordionDetails>
                  </Accordion>
                </p>
              </div>
            }
          />
          <Reply className="replyIcon" />
          <Delete className="deleteIcon" />
        </ListItem>
        <hr />
      </List> */}
    </div>
  );
}

export default Discussion;
