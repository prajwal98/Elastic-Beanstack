import React, { useState, useEffect, useRef } from "react";
import "./Course.scss";
import { FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCookie } from "react-use-cookie";
import CoursePlayer from "./CoursePlayer";
import { awsSignIn, authData, awsSignOut } from "../../redux/auth/authSlice";
import UserHeader from "../Header/UserHeader/UserHeader";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import CircularProgress from "@material-ui/core/CircularProgress";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import NothingHereYet from "../../assets/images/nothing-here-icon.png";
import BreadcrumbShorthand from "../../modules/Breadcrumb/BreadcrumbShorthand";
import { Button, Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import ReactPlayer from "react-player";
import useWindowDimensions from "../../modules/Window/Window";
import QuizIc from "../../assets/svgjs/Quiz";
import PdfIcon from "../../assets/svgjs/Pdf";
import YouTubeVideo from "../../assets/svgjs/Youtube";
import YouTubeVideoGray from "../../assets/svgjs/YoutubeGray";
import ClockGray from "../../assets/svgjs/ClockGray";
import Done from "../../assets/svgjs/Done";
import { Constants } from "../../config/constants";
import config from "../../config/aws-exports";
import { API } from "aws-amplify";
// import CourseTab from "../../components/Tabs/courseTab";
import { Tab } from "semantic-ui-react";
import Video from "../../assets/svgjs/Video";
import Audio from "../../assets/svgjs/Audio";
import Review from "../../assets/svgjs/Review";
import Html from "../../assets/svgjs/Html";
import Discussion from "./Discussion/Discussion";
import Assessment from "../../modules/Assessment/Assessment";
import Skeleton from "@material-ui/lab/Skeleton";
import Assignment from "../../modules/Assignment/Assignment";
import Vimeo from "../../assets/svgjs/Vimeo";
import moment from "moment";
import References from "./References";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import useMediaQuery from "@material-ui/core/useMediaQuery";

// import UserHeader from "../../components/Header/UserHeader/UserHeader";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    paddingTop: "20px",
    height: "40vh",
    overflowY: "auto",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  paper: {
    "& .MuiDialog-paperWidthSm": {
      minWidth: "1100px",
      minHeight: "660px",
      overflowX: "hidden",
    },
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "40%",
    flexShrink: 0,
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    border: "none",
    transform: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
  },
  "MuiAccordionSummary-content": {
    width: "100%",
  },
}));

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
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

export default function Course({ handleToggleSidebar }) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  //const [course, setCourse] = useState({tdescription:"Course Description"});
  const [courseDetails, setCourseDetails] = useState({
    tdescription: "Course Description",
  });
  const [objectData, setObjectData] = useState({});
  const [oIndex, setOIndex] = useState(0);
  const [curObject, setcurObject] = useState({});
  const curObRef = useRef({});
  const [assignment, setAssignment] = useState(false);
  const [assignmentLoad, setAssignmentLoad] = useState(true);

  //const [objects, setObjects] = useState([]);
  const [nuggets, setNuggets] = useState([]);
  const [units, setUnits] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPage, setShowPage] = useState(true);
  const [summative, setSummative] = useState(false);
  const [sumScore, setSumScore] = useState(false);

  const { height, width } = useWindowDimensions();

  const [live, setLive] = useState([]);
  const [liveLoad, setLiveLoad] = useState(true);
  const [liveopen, setLiveOpen] = useState(false);
  const live_url = useRef("");
  const [qisLoading, setQIsLoading] = useState(false);
  const [sMiniScore, setSMiniScore] = useState(false);
  const [miniScore, setMiniScore] = useState(0);

  const redux = useRef({});

  let navigate = useNavigate();
  let userDetails = useSelector(authData);
  const dispatch = useDispatch();
  let lcourseDetails = userDetails.curprgcou;

  //console.log("l",lcourseDetails);
  //console.log(userDetails);

  const scrollRef = useRef();
  const accRef = useRef();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    getCourse();
    getCourseVideo();
    breadcrumb();
    reduxRestore();
  }, []);

  function reduxRestore() {
    let sdata = { ...userDetails };
    redux.current = sdata;
  }
  async function getCourseVideo() {
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        cid: lcourseDetails.bcid,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    // alert(JSON.stringify(bodyParam.body));
    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        // Constants.GET_COURSE_VIDEO,
        "/getcoursevideo",
        bodyParam
      );

      // alert(JSON.stringify(response));
      console.log(response);
      setLiveLoad(false);
      setLive(response.video);
    } catch (error) {
      console.error(error);
    }
  }
  async function getCourse() {
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
    console.log(JSON.stringify(bodyParam.body));
    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.GET_COURSE,
        bodyParam
      );
      //alert(JSON.stringify(response));

      const topicsJSON = response.unit;
      // function groupByKey(array, key) {
      //   return array.reduce((hash, obj) => {
      //     if (obj[key] === undefined) return hash;
      //     return Object.assign(hash, {
      //       [obj[key]]: (hash[obj[key]] || []).concat(obj),
      //     });
      //   }, {});
      // }
      // var result = groupByKey(topicsJSON, "unit");
      let temp = [];
      for (let i = 0; i < topicsJSON.length; i++) {
        for (let h = 0; h < topicsJSON[i].nuggets.length; h++) {
          for (let j = 0; j < topicsJSON[i].nuggets[h].objects.length; j++) {
            temp.push(topicsJSON[i].nuggets[h].objects[j]);
          }
        }
      }
      //setNuggets(result);
      setUnits(topicsJSON);
      console.log("setCourseDetails==",response);
     
      setCourseDetails(response);
      setShowPage(response.tenabled);
      setObjectData(temp);
      saveLocale(response);
      setIsLoading(false);
      let sdata = { ...redux.current };
      dispatch(awsSignIn(sdata));
    } catch (error) {
      // alert(JSON.stringify(error));
      console.error(error);
    }
  }

  async function syncUserProgress(userProgressData) {
    // let lcourseDetails = userDetails.curprgcou;
    setIsLoading(true);
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        eid: userDetails.eid,
        pid: lcourseDetails.pid,
        bpid: lcourseDetails.bpid,
        courseid: courseDetails.tid,
        bcourseid: courseDetails.btid,
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

      console.log(response);
      analyticsWebApp();
      getCourse();
      get();
    } catch (error) {
      // alert(JSON.stringify(error));
      console.error(error);
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

      console.log("HIb " + JSON.stringify(response));
      //response.bpdata[0].tcourses[0].per = 100;
      userdata.data = response;
      //let encryptedString = cryptr.encrypt(JSON.stringify(userDetails));
      //dispatch(awsSignIn(userdata));
      //getEvents(UserProgressDetailsJSON);
      dispatch(awsSignIn(userdata));
    } catch (error) {
      //alert(JSON.stringify(error))
      console.error(error);
    }
  }

  async function analyticsWebApp() {
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        topicid: lcourseDetails.tid,
        bcid: lcourseDetails.bcid,
        eventtype: "Topic Subscribed",
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
      console.log("start ANALYTICS_WEB_APP==",JSON.stringify(bodyParam.body))
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

  const saveLocale = (data) => {
    //alert(data.Policy)
    const expires = new Date().getTime() + 60 * 60 * 1000;
    setCookie("CloudFront-Expires", expires);
    setCookie("CloudFront-Policy", data.Policy);
    setCookie("CloudFront-Signature", data.Signature);
    setCookie("CloudFront-Key-Pair-Id", data.KeyPairId);
  };
  const getAssignmentDataPost = async (quizid) => {
    setQIsLoading(true);
    setSMiniScore(false);
    setAssignmentLoad(true);
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
      setAssignmentLoad(false);
      // return response;
    } catch (error) {
      console.log("getCategoryError", error);
    }
  };

  async function getQuizScore(curobj) {
    // alert(JSON.stringify(curobj));
    setSummative(false);
    setQIsLoading(true);
    const bodyParam = {
      body: {
        eid: userDetails.eid,
        obid: curobj.oid,
        oid: config.aws_org_id,
        rtype: "get",
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    console.log(JSON.stringify(bodyParam.body, null, 2));
    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.QUIZ_SCORE,
        bodyParam
        //`${Constants.GET_MY_PROGRAMS}`, bodyParam,
      );
      // alert('hello');

      console.log(response);
      if (response != undefined || response != null) {
        setSumScore(response);
        setSummative(true);
      }

      setQIsLoading(false);
    } catch (error) {
      console.log("getCategoryError", error);
    }
  }

  function CourseStructure() {
    return (
      <div className={classes.root} ref={scrollRef}>
        <Typography component="div" variant="h1">
          {isLoading ? <Skeleton /> : null}
        </Typography>
        <Typography component="div" variant="h1">
          {isLoading ? <Skeleton /> : null}
        </Typography>
        <Typography component="div" variant="h1">
          {isLoading ? <Skeleton /> : null}
        </Typography>
        <Typography component="div" variant="h1">
          {isLoading ? <Skeleton /> : null}
        </Typography>
        {/* <pre>{JSON.stringify(topics, null, 2)}</pre> */}
        {units.map((unit, idx) => (
          <Accordion
            key={idx}
            expanded={expanded === `${idx}`}
            onChange={handleChange(`${idx}`)}
            style={{ width: "100%" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
              className={classes["MuiAccordionSummary-content"]}
            >
              <Typography className={classes.heading} style={{ width: "100%" }}>
                <h2 className="size-m-b">{unit.unitname}</h2>
              </Typography>
            </AccordionSummary>
            {unit.nuggets.map(
              ({ nid, ntitle, nduration, objects, nenabled }, idx) => (
                <div>
                  <div className="display-flex padding2">
                    <h3 className="item" style={{ fontWeight: "bold" }}>
                      {/* <span style={{ paddingRight: '1rem' }}>{idx + 1}.</span>{' '} */}
                      {ntitle}
                    </h3>
                    <p style={{ fontSize: "14px" }}>
                      <span>
                        <ClockGray
                          className="clock-size--s"
                          cls1="cls1-s"
                          cls2="cls2-s"
                        />
                      </span>
                      {nduration} min
                    </p>
                  </div>
                  {objects.map(
                    ({
                      oid,
                      otitle,
                      odescription,
                      otype,
                      oduration,
                      ourl,
                      userOP,
                    }) => (
                      <div
                        className="flex size"
                        style={{
                          justifyContent: "space-between",
                          width: "calc(100% - 4.5%)",
                        }}
                      >
                        <p style={{ cursor: "pointer" }}>
                          <span>
                            {userOP.op === 2 || userOP.op === 1
                              ? renderSwitch(otype)
                              : renderSwitchGray(otype)}
                          </span>
                          <a
                            style={{ paddingLeft: "10px" }}
                            href
                            onClick={() => {
                              onClickObject(oid);
                            }}
                          >
                            {otitle}
                          </a>
                        </p>
                        <span>
                          {userOP.op === 2 ? (
                            <Done
                              className="Done_size"
                              cls1="cls1_D"
                              cls2="cls2_D"
                            />
                          ) : null}
                        </span>
                      </div>
                    )
                  )}
                </div>
              )
            )}
          </Accordion>
        ))}
      </div>
    );
  }

  function onClickObject(oid) {
    //alert(JSON.stringify(rowData));
    let temp = 0;
    for (let i = 0; i <= objectData.length; i++) {
      if (oid == objectData[i].oid) {
        temp = i;
        break;
      }
    }
    //alert(temp);
    setOIndex(temp);
    setcurObject(objectData[temp]);
    if (objectData[temp].otype === "quiz") {
      getAssignmentDataPost(objectData[temp].oid);
      getQuizScore(objectData[temp]);
    }
    curObRef.current = objectData[temp];
    // let sdata = {...userDetails};
    // sdata.oindex = temp;
    // dispatch(awsSignIn(sdata));
    //setOpen(true);
    //navigate("/coursePlayer");
    //alert("objectDetailsDATA "+JSON.stringify(temp));
    if (courseDetails.userTP != 0) {
      //dispatch(awsSignIn(sdata));
      setOpen(true);
      //navigate("/coursePlayer");
      // navigation.navigate('CoursePlayer', { topicId: topicId.current, courseDetails: courseDetailsRef.current, objectDetails: objectDetails, index: temp, exit });
    }
  }

  const handleClose = () => {
    getCourse();
    setOpen(false);
  };

  const handleLiveClose = () => {
    setLiveOpen(false);
  };

  const renderSwitch = (param) => {
    if (param === "video") {
      return <Video className="video-size" cls1="cls-1--v" cls2="cls-2--v" />;
    } else if (param === "audio") {
      return <Audio className="video-size" cls1="cls-1--a" cls2="cls-2--a" />;
    } else if (param === "quiz") {
      return <QuizIc className="quizAct" />;
    } else if (param === "html") {
      return (
        <Html
          className="video-size"
          cls1="cls-1--H"
          cls2="cls-2--H"
          cls3="cls-3--H"
        />
      );
    } else if (param === "Interactivity") {
      return <Review className="video-size" cls1="cls-1--R" cls2="cls-2--R" />;
    } else if (param === "pdf") {
      return <PdfIcon className="pdfAct" />;
    } else if (param === "youtube") {
      return <YouTubeVideo />;
    } else if (param === "vimeo") {
      return <Vimeo color="st0" size="stSiz" />;
    }
  };
  const renderSwitchGray = (param) => {
    if (param === "video") {
      return (
        <Video className="video-size" cls1="cls-1--v-g" cls2="cls-2--v-g" />
      );
    } else if (param === "audio") {
      return (
        <Audio className="video-size" cls1="cls-1--a-g" cls1="cls-2--a-g" />
      );
    } else if (param === "quiz") {
      return <QuizIc className="quizdark" />;
    } else if (param === "html") {
      return (
        <Html
          className="video-size"
          cls1="cls-1--H-g"
          cls2="cls-2--H-g"
          cls3="cls-3--H-g"
        />
      );
    } else if (param === "Interactivity") {
      return (
        <Review className="video-size" cls1="cls-1--R-g" cls2="cls-2--R-g" />
      );
    } else if (param === "pdf") {
      return <PdfIcon className="pdfGray" />;
    } else if (param === "youtube") {
      return <YouTubeVideoGray />;
    } else if (param === "vimeo") {
      return <Vimeo color="st1" size="stSiz" />;
    }
  };
  const panes = [
    {
      menuItem: "Course structure",
      render: () => (
        <Tab.Pane>
          <CourseStructure />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Discussion",
      render: () => (
        <Tab.Pane>
          <Discussion courseId={lcourseDetails.bcid} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Assignment",
      render: () => (
        <Tab.Pane>
          <Assignment
            courseId={lcourseDetails.bcid}
            progId={lcourseDetails.bpid}
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Assessment",
      render: () => (
        <Tab.Pane>
          <Assessment
            courseId={lcourseDetails.bcid}
            progId={lcourseDetails.bpid}
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Recorded session",
      render: () => (
        <Tab.Pane>
          <LiveSession />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "References",
      render: () => (
        <Tab.Pane>
          <References />
        </Tab.Pane>
      ),
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function tableview() {
    return live.length >= 1 ? (
      <TableBody>
        {(rowsPerPage > 0
          ? live.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          : live
        ).map((Value, index, array) => {
          return live === undefined || live.length === 0 ? (
            <TableRow>
              <TableCell>No Data</TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell>
                <h3 style={{ fontSize: "16px", fontWeight: "400px" }}>
                  {Value.title}
                </h3>
                <a
                  href={Value.link}
                  target="blank"
                  style={{ fontSize: "14px" }}
                >
                  {Value.link}
                </a>
                <p style={{ fontSize: "14px", fontWeight: "400px" }}>
                  {moment(Value.date).format("DD-MM-YYYY hh:mm:ss a")}
                </p>
              </TableCell>
              <TableCell>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  {Value.fname === undefined ? (
                    <button className="nobutton">No Session</button>
                  ) : (
                    <button
                      className="viewbutton"
                      onClick={() => {
                        viewLive(Value.ourl);
                      }}
                    >
                      View Session
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    ) : (
      <TableBody>
        <TableRow>
          <TableCell></TableCell>
          <TableCell>
            <p style={{ paddingLeft: "25%" }}>No Data</p>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  function LiveSession() {
    console.log("live", live);
    return (
      <Table>
        {isLoading ? "" : tableview()}
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={3}
              count={live.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { "aria-label": "rows per page" },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    );
  }

  function viewLive(id) {
    live_url.current = `https://${
      config.DOMAIN
    }/${config.aws_org_id.toLowerCase()}-resources/videos/coursevideos/${id}`;
    setLiveOpen(true);
  }

  function VideoView() {
    return (
      <div style={{ display: "flex", height: "78%", backgroundColor: "white" }}>
        <div style={{ height: "100%", width: "100%" }}>
          <div style={{ width: "100%", height: "26px" }}>
            <span
              style={{
                float: "right",
                cursor: "pointer",
                color: "black",
                fontSize: "26px",
                paddingRight: "20px",
              }}
              onClick={() => {
                handleLiveClose();
              }}
            >
              x
            </span>
          </div>
          <div
            style={{ height: height - 300, width: width - 300, padding: "2%" }}
          >
            <div
              className="player-wrapper"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <ReactPlayer
                url={live_url.current}
                controls={true}
                width="100%"
                height={height - 300}
                config={{
                  file: {
                    attributes: {
                      controlsList: "nodownload", //<- this is the important bit
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderButton() {
    if (courseDetails.userTP == 0) {
      return (
        <div
          style={{
            display: "flex",
            marginTop: '20px ',
            width: "100%",
            height: "50px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            // style={{
            //   color: "white",
            //   borderStyle: "groove ",
            //   borderColor: config.main_color_2,
            //   height: "30px ",
            //   lineHeight: "0px ",
            //   width: "150px",

            //   backgroundColor: config.main_color_2,
            //   fontSize: "16px ",
            //   borderRadius: "3px ",

            //   fontWeight: "bold",
            // }}
            onClick={startCourse}
            className={window.navigator.onLine === true ? "btn_color" : "btn_colordis" }
            disabled={!window.navigator.onLine}
          >
            Start Course
          </button>
        </div>
      );
    }
  }

  function breadcrumb() {
    let sdata = { ...userDetails };
    if (sdata.breadcrumb == undefined) {
      sdata.breadcrumb = [];
      let temp = [...sdata.breadcrumb];
      temp[0] = {
        name: "Dashboard",
        path: "/dashboard",
      };
      temp[1] = {
        name: `${sdata.curprgcou.ptitle}`,
        path: "/course",
      };
      temp[2] = {
        name: `${sdata.curprgcou.ttitle}`,
        path: "/course",
      };
      sdata.breadcrumb = temp;
    } else {
      let temp = [...sdata.breadcrumb];
      temp[0] = {
        name: "Dashboard",
        path: "/dashboard",
      };
      if (temp[1] !== null) {
      } else {
        temp[1] = {
          name: `${sdata.curprgcou.ptitle}`,
          path: "/course",
        };
      }
      temp[2] = {
        name: `${sdata.curprgcou.ttitle}`,
        path: "/course",
      };
      sdata.breadcrumb = temp;
    }
    dispatch(awsSignIn(sdata));
  }

  function startCourse() {
    let data = courseDetails.userProgressData;
    //alert(JSON.stringify(data));
    data[courseDetails.btid].tp = 1;
    data[courseDetails.btid].td.sd = Math.round(new Date().getTime() / 1000);
    data[courseDetails.btid].objects[
      courseDetails.unit[0].nuggets[0].objects[0].oid
    ].op = 1;
    syncUserProgress(data);
  }
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <div className="maincontainer">
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* <pre> {JSON.stringify(user, null, 2)}</pre> */}

      <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
        <FaBars />
      </div>
      <UserHeader Bindex={2} />
      <Dialog
        fullScreen={fullScreen}
        open={open}
        scroll={"body"}
        className={classes.paper}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        onBackdropClick="false"
      >
        <DialogTitle id="responsive-dialog-title" style={{ textAlign: "left" }}>
          <h1 style={{ fontSize: "18px", textAlign: "left" }}>
            {curObject.otitle}
          </h1>
        </DialogTitle>
        <DialogContent>
          <CoursePlayer
            handleClose={handleClose}
            courseDetails={courseDetails}
            setCourseDetails={setCourseDetails}
            objectData={objectData}
            setObjectData={setObjectData}
            oIndex={oIndex}
            setOIndex={setOIndex}
            curObject={curObject}
            setcurObject={setcurObject}
            curObRef={curObRef}
            assignment={assignment}
            setAssignment={setAssignment}
            summative={summative}
            setSummative={setSummative}
            sumScore={sumScore}
            setSumScore={setSumScore}
            miniScore={miniScore}
            setMiniScore={setMiniScore}
            sMiniScore={sMiniScore}
            setSMiniScore={setSMiniScore}
            qisLoading={qisLoading}
            setQIsLoading={setQIsLoading}
            getQuizScore={getQuizScore}
            getAssignmentDataPost={getAssignmentDataPost}
            assignmentLoad={assignmentLoad}
            setAssignmentLoad={setAssignmentLoad}
          />
        </DialogContent>
      </Dialog>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={liveopen}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={liveopen}>
          <VideoView />
        </Fade>
      </Modal>
      <div className="text-align">{/*  <BreadcrumbShorthand /> */}</div>
      {showPage == true || showPage == "true" ? (
        <div className="management">
          <div className="h1">
            <h1 style={{ color: config.main_color_2, fontSize: "20px" }}>
              <strong>{isLoading ? <Skeleton /> : courseDetails.ttitle}</strong>
            </h1>
          </div>
          <div className="management-info">
            <div className="flex-box">
              <div className="flex-box__container">
                <div className="time-line">
                  <div>
                    <span>
                      <ClockGray
                        className="clock-size"
                        cls1="cls1"
                        cls2="cls2"
                      />
                    </span>
                    <p>
                      {isLoading ? <Skeleton /> : courseDetails.tduration} weeks
                    </p>
                  </div>
                  {/* <div>
                  <RatingStar />
                </div>
                <div>
                  <p>500 students</p>
                </div>
              
              <div>
                <p>
                  Author: <strong>Mr.Shekar</strong>
                </p>
              </div> */}
                </div>
                <div>
                  <p
                    style={{ fontSize: "15px", width: "95%" }}
                    dangerouslySetInnerHTML={{
                      __html: courseDetails.tdescription,
                    }}
                  >
                    {/*  dgfgjh dfgdfhgf erHTML=hgejreghrkejri jkhdewg gdfhgf erHTML=hgejreghrkejri jkhdewg */}
                  </p>
                  {isLoading ? <Skeleton /> : renderButton()}
                </div>
              </div>
              {isLoading ? (
                <Skeleton variant="rect" width="100%">
                  <div style={{ paddingTop: "57%" }} />
                </Skeleton>
              ) : (
                <div
                  className="management__image"
                  style={{
                    backgroundImage: `url('https://${
                      config.DOMAIN
                    }/${config.aws_org_id.toLowerCase()}-resources/images/topic-images/${
                      courseDetails.tid
                    }.png')`,
                  }}
                ></div>
              )}
            </div>
          </div>
          {/* {topics.map((topic) => console.log(topic.unit))} */}
          <Tab panes={panes} />
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1>The Course Is Disabled From Admin.</h1>
        </div>
      )}
    </div>
  );
}
