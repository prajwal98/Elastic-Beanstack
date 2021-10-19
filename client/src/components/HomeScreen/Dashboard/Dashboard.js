import React, { useState, useEffect } from "react";
import { API, JS } from "aws-amplify";
import Cryptr from "cryptr";
import { awsSignIn, authData } from "../../../redux/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { Constants } from "../../../config/constants";
import config from "../../../config/aws-exports";

import ClockGray from "../../../assets/svgjs/ClockGray";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import ReactPlayer from "react-player";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { List } from "semantic-ui-react";
import ProgressBar from "../../../modules/ProgressBar/ProgressBar";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Document, Page, pdfjs } from "react-pdf";
import { Link, useNavigate } from "react-router-dom";

import UserHeader from "../../Header/UserHeader/UserHeader";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

import dashboardStyle from "./Dashboard.module.scss";
import "./dashboard.scss";

import moment from "moment";

import Skeleton from "@material-ui/lab/Skeleton";
import i1 from "../../../assets/images/i1.jpg";
import i2 from "../../../assets/images/i2.jpg";
import image from "./Events 1.png";
import Announcements from "../../../assets/svgjs/Announcements";
import { FaBars } from "react-icons/fa";
import { getQueriesForElement } from "@testing-library/dom";
import PdfIcon from "../../../assets/svgjs/Pdf";
import Video from "../../../assets/svgjs/Video";
import Audio from "../../../assets/svgjs/Audio";
import ImageIcon from "@material-ui/icons/Image";

import { DialogTitle, useMediaQuery } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
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
    "& .MuiGrid-root": {},
    "& .MuiGrid-item": {},
    "& .MuiGrid-grid-xs-12": {
      padding: "30px",
      width: "100%",
    },
    "& .MuiGrid-grid-xs-6": {},
    marginTop: "20px",
    width: "100%",
  },
  paperAnnounce: {
    padding: theme.spacing(2),
    textAlign: "start",
    color: theme.palette.text.secondary,
    width: "100%",
  },
  paperEvents: {
    padding: theme.spacing(2),
    textAlign: "start",
    color: theme.palette.text.secondary,
    width: "100%",
    /*  overflow: "scroll",
    height: "60%", */
  },
  paper: {
    "& .MuiDialog-paperWidthSm": {
      minWidth: "1100px",
      height: "670px",
      padding: "50px 30px 30px 30px",
    },
  },
  content: {
    ".MuiDialogContent-root": {
      overflowY: "hidden",
    },
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    border: "none",
    transform: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
  },
  paperModal: {
    backgroundColor: theme.palette.background.paper,

    height: "500px",
    width: "1200px",
    borderRadius: "4px",
    border: "none",
    padding: theme.spacing(2, 4, 3),
  },
}));

const Dashboard = ({ handleToggleSidebar }) => {
  const [events, setevents] = useState([]);
  const [upEvents, setupEvents] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [dataToModal, setDataToModal] = useState({ type: "", url: "" });
  const [obj, setObj] = useState({});
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [file, setFile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [announcementsAll, setAnnouncementsAll] = useState([]);

  let navigate = useNavigate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  // Function to pass on breadcrumbs
  function titleclick(data, PValue) {
    console.log("data", data);
    let sdata = { ...userDetails };
    // for(let i = 0; i < pdata.length; i++){
    //   if(data.bpid == pdata[i].bpid){
    //     sdata.curprgcou = pdata[i];
    //   }
    // }
    sdata.curprgcou = { ...data };
    sdata.curprgcou.pid = PValue.pid;
    sdata.curprgcou.bpid = PValue.bpid;
    sdata.curprgcou.ptitle = PValue.ptitle;

    console.log("dhfdf", sdata.curprgcou);
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
      temp[1] = {
        name: `${sdata.curprgcou.ptitle}`,
        path: "/course",
      };
      temp[2] = {
        name: `${sdata.curprgcou.ttitle}`,
        path: "/course",
      };
      sdata.breadcrumb = temp;
    }

    dispatch(awsSignIn(sdata));

    navigate("/course");
  }

  const cryptr = new Cryptr(Constants.SecretKey);

  let userDetails = useSelector(authData);
  //let userDetails = cryptr.decrypt(tempData);
  const dispatch = useDispatch();
  useEffect(() => {
    getPrograms();
    getEvents();
    get();
    getAnnouncements();
    getfiles();
    setClass("/dashboard");
  }, []);

  async function getPrograms() {
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
        Constants.GET_USER_PROGRESS,
        bodyParam
      );
      userDetails.data = response;
      dispatch(awsSignIn(userDetails));
    } catch (error) {
      console.error(error);
    }
  }
  const handleNavigate = (obj) => {
    let sdata = { ...userDetails };
    sdata.cursession = obj;
    if (sdata.breadcrumb == undefined) {
      sdata.breadcrumb = [];
      let temp = [...sdata.breadcrumb];
      temp[0] = {
        name: "Dashboard",
        path: "/dashboard",
      };
      temp[1] = {
        name: "Live Session",
        path: "/eventView",
      };
      sdata.breadcrumb = temp;
    } else {
      let temp = [...sdata.breadcrumb];
      temp[0] = {
        name: "Calendar",
        path: "/event",
      };
      temp[1] = {
        name: "Live Session",
        path: "/eventView",
      };
      sdata.breadcrumb = temp;
    }
    if (obj.type == "livesession") {
      dispatch(awsSignIn(sdata));
      navigate("/eventView");
    }
  };
  function setClass(val) {
    let sdata = { ...userDetails };
    sdata.sideactive = val;
    dispatch(awsSignIn(sdata));
  }
  const handleClose = () => {
    setOpen(false);
  };
  async function getEvents() {
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        rtype: "get",
        batchjson: userDetails.data.bpids,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.GET_EVENTS,
        bodyParam
      );

      setIsLoading(false);
      console.log("response", response.result.events);
      filter(response.result.events);
    } catch (error) {
      console.error(error);
    }
  }

  function filter(data) {
    let m = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let temp = [];
    for (let i = 0; i < data.length; i++) {
      let res = data[i].start;
      let timestamp = new Date(res);
      let time = timestamp.getTime();
      let eventDate = timestamp.getDate();
      let seventhday = new Date().setDate(new Date().getDate() + 7);
      let d = new Date().getTime();
      let mon = new Date().getMonth();
      let yea = new Date().getFullYear();
      let date = new Date().getDate();
      let month = 0;
      let dd = timestamp.getDate();
      let mm = timestamp.getMonth() + 1;
      let yyyy = timestamp.getFullYear();
      month = mm;
      if (
        eventDate >= date &&
        time < seventhday &&
        parseInt(yyyy) == yea &&
        month >= mon &&
        parseInt(dd) >= date
      ) {
        let obj = {
          title: data[i].title,
          link: data[i].link,
          start: data[i].start,
          payment: data[i].payment,
          amount: data[i].amount,
          description: data[i].description,
          duration: data[i].duration,
          eid: data[i].eid,
          bpid: data[i].bpid,
          type: data[i].type,
          cbyid: data[i].cbyid,
          month: m[month],
          day: yyyy,
        };
        temp.push(obj);
      }
    }
    console.log("temp", temp);
    setevents(temp);
  }

  console.log("userdet", userDetails);
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
      console.error(error);
    }
  }

  const classes = useStyles();

  var settingsAllPrograms = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    draggable: true,
  };

  var settingsAllPrograms3 = {
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    draggable: true,
  };

  var settingsAllPrograms2 = {
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    draggable: true,
  };

  var settingsAllPrograms1 = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: true,
  };

  async function getAnnouncements() {
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        bpid: userDetails.data.bpids,
        rtype: "getall",
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.POST_ANNOUNCEMENT,
        bodyParam
      );
      const AnnouncementsJSON = response.Response;
      setAnnouncementsAll(AnnouncementsJSON);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function getfiles(fname) {
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        fname: fname,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        `/getAnnouncementFile`,
        bodyParam
      );
      const AnnouncementsJSONfile = response;
      //setAnnouncementsAll(AnnouncementsJSON);

      setFile(AnnouncementsJSONfile);
    } catch (error) {
      console.error(error);
    }
  }

  function programlist() {
    let data = [];
    if (userDetails.data != undefined) {
      if (userDetails.data.bpdata != undefined) {
        data = [...userDetails.data.bpdata];
      }
    }

    return (
      <Grid
        container
        direction="column"
        spacing={6}
        className={dashboardStyle.maingridholder}
      >
        {data.map((PValue, index, array) => {
          return (
            <Grid item xs={12} style={{ width: "100%" }}>
              <div className={dashboardStyle.grid}>
                <h3
                  style={{
                    marginLeft: "0px",
                    color: config.main_color_2,
                    fontWeight: "bold",
                    fontSize: "19px",
                    marginBottom: "20px",
                  }}
                  //className={dashboardStyle.gridHeaderCourse}
                >
                  {PValue.ptitle}
                </h3>
                <Slider
                  {...(PValue.tcourses.length == 1
                    ? settingsAllPrograms1
                    : PValue.tcourses.length == 2
                    ? settingsAllPrograms2
                    : PValue.tcourses.length == 3
                    ? settingsAllPrograms3
                    : settingsAllPrograms)}
                  style={{ width: "100%" }}
                >
                  {PValue.tcourses.map((Value, index, array) => {
                    return (
                      <div
                        onClick={() => {
                          titleclick(Value, PValue);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <Card
                          className={dashboardStyle.card}
                          style={{ cursor: "pointer" }}
                        >
                          <img
                            alt=""
                            className={dashboardStyle.imageCard}
                            src={`https://${
                              config.DOMAIN
                            }/${config.aws_org_id.toLowerCase()}-resources/images/topic-images/${
                              Value.tid
                            }.png`}
                          />
                          <div className={dashboardStyle.progressbar}>
                            <ProgressBar color="orange" percent={Value.per} />
                          </div>
                          <p style={styles.topicNameDashboard}>
                            {Value.ttitle}
                          </p>
                          <div>
                            <p
                              style={{
                                marginTop: "100px" /* padding: "10px" */,
                              }}
                            >
                              <span style={{ marginLeft: "10px" }}>
                                <ClockGray
                                  className={dashboardStyle.clock}
                                  cls1="cls1"
                                  cls2="cls2"
                                />
                              </span>
                              <span
                                style={{
                                  fontSize: "12px",
                                  color: "rgba(0, 0, 0, 0.6)",
                                  marginLeft: "-10px",
                                  marginBottom: "-10px",
                                }}
                              >
                                {Value.tdur} weeks
                              </span>
                            </p>
                          </div>
                        </Card>
                      </div>
                    );
                  })}
                </Slider>
              </div>
            </Grid>
          );
        })}
      </Grid>
    );
  }

  function courselist(courses) {
    return (
      <>
        {courses.map((Value, index, array) => {
          return (
            <div>
              <Card className={dashboardStyle.card}>
                <img alt="" className={dashboardStyle.imageCard} src={i1} />
                <div className={dashboardStyle.progressbar}>
                  <ProgressBar color="orange" percent="20" />
                </div>
                <p className={dashboardStyle.topicNameDashboard}>
                  {Value.ttitle}
                </p>
              </Card>
            </div>
          );
        })}
      </>
    );
  }

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const handleClickOpen = (full) => {
    setOpen(true);

    setObj(full);
  };
  function renderObjects(curObject) {
    let objType = curObject.type;
    console.log(curObject);
    switch (objType) {
      case "video":
        return VideoView(curObject); // loadVideoView(curObject);
      case "audio":
        return AudioView(curObject); // loadAudioView(curObject);
      case "pdf":
        return PdfView(curObject);
      case "image":
        return imageView(curObject); // loadMultimediaView(curObject);
      case "html":
        return WebView(curObject); // loadMultimediaView(curObject);
      case "Interactivity":
        return WebView(curObject); // loadInteractivityView(curObject);

      case "vimeo":
        return VimeoView(curObject); // loadVimeoView(curObject);
      case "youtube":
        return youtubeView(curObject); // loadYoutubeView(curObject);
      default:
        return null;
    }
  }
  function VideoView(curObject) {
    return (
      <div
        className="player-wrapper"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <ReactPlayer
          url={`https://${
            config.DOMAIN
          }/${config.aws_org_id.toLowerCase()}-resources/images/announcement-images/${
            curObject.mfname
          }`}
          controls={true}
          width="100%"
          config={{
            file: {
              attributes: {
                controlsList: "nodownload", //<- this is the important bit
              },
            },
          }}
        />
      </div>
    );
  }

  function AudioView(curObject) {
    return (
      <div>
        <div
          className="player-wrapper"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <ReactPlayer
            url={`https://${
              config.DOMAIN
            }/${config.aws_org_id.toLowerCase()}-resources/images/announcement-images/${
              curObject.mfname
            }`}
            controls={true}
          />
        </div>
      </div>
    );
  }

  function VimeoView(curObject) {
    return (
      <div>
        <div
          className="player-wrapper"
          style={{
            display: "flex",
            justifyContent: "center",
            width: "1000px",
            height: "600px",
          }}
        >
          <ReactPlayer
            url={
              curObject.otype !== "vimeo"
                ? `https://youtu.be/${curObject.embeddedcode}`
                : `https://player.vimeo.com/video/${curObject.embeddedcode}?title=0&loop=0`
            }
            controls={true}
            width="100%"
            height="100%"
          />
        </div>
      </div>
    );
  }

  function youtubeView(curObject) {
    return (
      <div
        className="youtube-wrapper"
        style={{
          display: "flex",
          justifyContent: "center",
          height: "660px",
          width: "1100px",
          alignItems: "center",
        }}
      >
        <ReactPlayer
          url={`https://youtu.be/${curObject.embeddedcode}`}
          controls={true}
          width="100%"
          height="100%"
          style={{ paddingTop: "10px", paddingBottom: "5px" }}
        />
      </div>
    );
  }

  function PdfView(curObject) {
    console.log(curObject);
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          overflowX: "hidden",
        }}
      >
        <iframe
          frameBorder="0"
          src={`https://${
            config.DOMAIN
          }/${config.aws_org_id.toLowerCase()}-resources/images/announcement-images/${
            curObject.mfname
          }`}
          height="100%"
          width="100%"
          title="pdf"
        />
      </div>
    );
  }
  function imageView(curObject) {
    console.log(curObject);
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          overflowX: "hidden",
        }}
      >
        <iframe
          frameBorder="0"
          src={`https://${
            config.DOMAIN
          }/${config.aws_org_id.toLowerCase()}-resources/images/announcement-images/${
            curObject.mfname
          }`}
          height="100%"
          width="100%"
          title="pdf"
        />
      </div>
    );
  }
  function WebView(curObject) {
    // let source = curObject.;
    // if (curObject.url === "") {
    //   source = curObject.ourl;
    // } else {
    //   source = curObject.url;
    // }
    // console.log(curObject);
    return (
      <div
        style={{
          display: "flex",
          width: "1100px",

          height: "660px",
          justifyContent: "center",
        }}
      >
        <iframe
          frameBorder="0"
          src={`https://${
            config.DOMAIN
          }/${config.aws_org_id.toLowerCase()}-resources/images/announcement-images/${
            curObject.mfname
          }`}
          width={"100%"}
          height="100%"
          //height={height - 300}
          title="WebView"
        />
      </div>
    );
  }
  function modalO() {
    const handleClose = () => {
      setOpen(false);
    };
    console.log("obj", obj);

    function onDocumentLoadSuccess({ numPages }) {
      setNumPages(numPages);
    }

    return <></>;
  }
  function programNameAnc(prog) {
    for (let i = 0; i < userDetails.data.bpdata.length; i++) {
      console.log("iii", userDetails.data.bpdata[i].ptitle);
      if (announcementsAll[prog].tid === userDetails.data.bpdata[i].bpid) {
        return <h2>{userDetails.data.bpdata[i].ptitle}</h2>;
      }
    }
  }
  console.log("eveee", events);

  return (
    <div className={dashboardStyle.maincontainer}>
      <div
        className="btn-toggle"
        style={{ width: "100%", margin: "0px", padding: "0px" }}
        onClick={() => handleToggleSidebar(true)}
      >
        <FaBars />
      </div>
      <div style={{ width: "100%" }}>
        <UserHeader />
        <div style={{ height: "100vh", width: "100%" }}>
          {/* <h2>Continue Learning..</h2> */}
          <div className={classes.root}>
            {programlist()}
            {modalO()}
          </div>

          <div className={classes.root}>
            <Grid
              container
              spacing={5}
              /* style={{marginRight:"-30px"}} */
            >
              <Grid item xs={6}>
                <h2
                  style={{
                    color: config.main_color_1,
                    marginTop: "20px",
                    fontWeight: "Bold",
                    fontSize: "19px",
                    marginBottom: "20px",
                  }}
                  //className={dashboardStyle.gridHeader}
                >
                  Announcements
                </h2>
                <Paper className={classes.paperAnnounce}>
                  <Typography component="list" variant="h1">
                    {isLoading ? <Skeleton /> : null}
                  </Typography>
                  <Typography component="list" variant="h1">
                    {isLoading ? <Skeleton /> : null}
                  </Typography>
                  <Typography component="list" variant="h1">
                    {isLoading ? <Skeleton /> : null}
                  </Typography>
                  <Typography component="list" variant="h1">
                    {isLoading ? <Skeleton /> : null}
                  </Typography>

                  {announcementsAll.length !== 0 ? (
                    <div>
                      {Object.keys(announcementsAll).map((prog, idx) => (
                        <Accordion
                          key={idx}
                          expanded={expanded === `${idx}`}
                          onChange={handleChange(`${idx}`)}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                          >
                            <Typography className={classes.heading}>
                              {programNameAnc(prog)}
                            </Typography>
                          </AccordionSummary>
                          {announcementsAll[prog].json.map((full, idx, arr) => (
                            <div>
                              {/* <List>
            <div className={dashboardStyle.announcements}>
              
              <button onClick={() => {setOpen(true); setObj(full)} } style={{fontSize:"small"}}>{full.title}</button>
            </div>
          </List> */}
                              {full.type === "text" ? (
                                <div>
                                  <ListItem alignItems="flex-start">
                                    <div style={{ width: "50px" }}>
                                      <Announcements
                                        className={
                                          dashboardStyle.announcementIcon
                                        }
                                      />{" "}
                                    </div>
                                    <ListItemText
                                      style={{ marginLeft: "20px" }}
                                      primary={
                                        <p
                                          style={{
                                            fontSize: "small",
                                            marginTop: "-20px",
                                          }}
                                        >
                                          {moment(full.sdate * 1000).format(
                                            "DD/MM/YYYY"
                                          )}
                                        </p>
                                      }
                                      secondary={
                                        <React.Fragment>
                                          <p
                                            style={{
                                              fontSize: "medium",
                                              marginTop: "10px",
                                            }}
                                          >
                                            {full.title}
                                          </p>
                                          <br />
                                          <Typography
                                            component="span"
                                            variant="body2"
                                            color="textPrimary"
                                          >
                                            <p style={{ fontSize: "medium" }}>
                                              {full.description}{" "}
                                            </p>
                                          </Typography>
                                        </React.Fragment>
                                      }
                                    />
                                  </ListItem>
                                  <hr style={{ marginBottom: "20px" }} />
                                </div>
                              ) : null || full.type === "file" ? (
                                <div>
                                  <ListItem alignItems="flex-start">
                                    <div style={{ width: "50px" }}>
                                      {" "}
                                      <Announcements
                                        className={
                                          dashboardStyle.announcementIcon
                                        }
                                      />{" "}
                                    </div>
                                    <ListItemText
                                      style={{ marginLeft: "20px" }}
                                      primary={
                                        <p
                                          style={{
                                            fontSize: "small",
                                            marginTop: "-20px",
                                          }}
                                        >
                                          {moment(full.sdate * 1000).format(
                                            "DD/MM/YYYY"
                                          )}
                                        </p>
                                      }
                                      secondary={
                                        <React.Fragment>
                                          <p
                                            style={{
                                              fontSize: "medium",
                                              marginTop: "10px",
                                            }}
                                          >
                                            {full.title}
                                          </p>
                                          <br />
                                          <Typography
                                            component="span"
                                            variant="body2"
                                            color="textPrimary"
                                          >
                                            <p style={{ fontSize: "medium" }}>
                                              {full.description}{" "}
                                            </p>

                                            <span
                                              onClick={() => {
                                                setOpen(true);
                                                setObj(full);
                                              }}
                                              style={{
                                                fontSize: "small",
                                                float: "right",
                                              }}
                                            >
                                              <PdfIcon
                                                className={
                                                  dashboardStyle.pdfIcon
                                                }
                                              />
                                            </span>
                                          </Typography>
                                        </React.Fragment>
                                      }
                                    />
                                  </ListItem>
                                  <hr style={{ marginBottom: "20px" }} />
                                </div>
                              ) : null || full.type === "web" ? (
                                <div>
                                  <ListItem alignItems="flex-start">
                                    <div style={{ width: "50px" }}>
                                      <Announcements
                                        className={
                                          dashboardStyle.announcementIcon
                                        }
                                      />{" "}
                                    </div>
                                    <ListItemText
                                      style={{ marginLeft: "20px" }}
                                      primary={
                                        <p
                                          style={{
                                            fontSize: "small",
                                            marginTop: "-20px",
                                          }}
                                        >
                                          {moment(full.sdate * 1000).format(
                                            "DD/MM/YYYY "
                                          )}
                                        </p>
                                      }
                                      secondary={
                                        <React.Fragment>
                                          <p
                                            style={{
                                              fontSize: "medium",
                                              marginTop: "10px",
                                            }}
                                          >
                                            {full.title}
                                          </p>
                                          <br />
                                          <Typography
                                            component="span"
                                            variant="body2"
                                            color="textPrimary"
                                          >
                                            <p style={{ fontSize: "medium" }}>
                                              {full.webtext}{" "}
                                            </p>
                                            <p style={{ fontSize: "medium" }}>
                                              {" "}
                                              Web url :{" "}
                                              <a
                                                href={`${full.weburl}`}
                                                target="blank"
                                              >
                                                {full.weburl}
                                              </a>
                                            </p>
                                          </Typography>
                                        </React.Fragment>
                                      }
                                    />
                                  </ListItem>
                                  <hr style={{ marginBottom: "20px" }} />
                                </div>
                              ) : null || full.type === "video" ? (
                                <div>
                                  <ListItem
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      handleClickOpen(full);
                                    }}
                                    alignItems="flex-start"
                                  >
                                    <div style={{ width: "50px" }}>
                                      {" "}
                                      <Announcements
                                        className={
                                          dashboardStyle.announcementIcon
                                        }
                                      />{" "}
                                    </div>
                                    <ListItemText
                                      style={{ marginLeft: "20px" }}
                                      primary={
                                        <p
                                          style={{
                                            fontSize: "small",
                                            marginTop: "-20px",
                                          }}
                                        >
                                          {moment(full.sdate * 1000).format(
                                            "DD/MM/YYYY  "
                                          )}
                                        </p>
                                      }
                                      secondary={
                                        <React.Fragment>
                                          <p
                                            style={{
                                              fontSize: "medium",
                                              marginTop: "10px",
                                              display: "flex",
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                            }}
                                          >
                                            <span>{full.title}</span>
                                            <span>
                                              {" "}
                                              <Video
                                                className="video-size"
                                                cls1="cls-1--v"
                                                cls2="cls-2--v"
                                              />
                                            </span>
                                          </p>
                                          <br />
                                          <Typography
                                            component="span"
                                            variant="body2"
                                            color="textPrimary"
                                          ></Typography>
                                        </React.Fragment>
                                      }
                                    />
                                  </ListItem>
                                  <hr style={{ marginBottom: "20px" }} />
                                </div>
                              ) : null || full.type === "audio" ? (
                                <div>
                                  <ListItem
                                    onClick={() => {
                                      handleClickOpen(full);
                                    }}
                                    style={{ cursor: "pointer" }}
                                    alignItems="flex-start"
                                  >
                                    <div style={{ width: "50px" }}>
                                      {" "}
                                      <Announcements
                                        className={
                                          dashboardStyle.announcementIcon
                                        }
                                      />{" "}
                                    </div>
                                    <ListItemText
                                      style={{ marginLeft: "20px" }}
                                      primary={
                                        <p
                                          style={{
                                            fontSize: "small",
                                            marginTop: "-20px",
                                          }}
                                        >
                                          {moment(full.sdate * 1000).format(
                                            "DD/MM/YYYY  "
                                          )}
                                        </p>
                                      }
                                      secondary={
                                        <React.Fragment>
                                          <p
                                            style={{
                                              fontSize: "medium",
                                              marginTop: "10px",
                                              display: "flex",
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                            }}
                                          >
                                            <span>{full.title}</span>
                                            <span>
                                              {" "}
                                              <Audio
                                                className="video-size"
                                                cls1="cls-1--a"
                                                cls2="cls-2--a"
                                              />
                                            </span>
                                          </p>
                                          <br />
                                          <Typography
                                            component="span"
                                            variant="body2"
                                            color="textPrimary"
                                          ></Typography>
                                        </React.Fragment>
                                      }
                                    />
                                  </ListItem>
                                  <hr style={{ marginBottom: "20px" }} />
                                </div>
                              ) : null || full.type === "image" ? (
                                <div>
                                  <ListItem
                                    onClick={() => {
                                      handleClickOpen(full);
                                    }}
                                    style={{ cursor: "pointer" }}
                                    alignItems="flex-start"
                                  >
                                    <div style={{ width: "50px" }}>
                                      {" "}
                                      <Announcements
                                        className={
                                          dashboardStyle.announcementIcon
                                        }
                                      />{" "}
                                    </div>
                                    <ListItemText
                                      style={{ marginLeft: "20px" }}
                                      primary={
                                        <p
                                          style={{
                                            fontSize: "small",
                                            marginTop: "-20px",
                                          }}
                                        >
                                          {moment(full.sdate * 1000).format(
                                            "DD/MM/YYYY  "
                                          )}
                                        </p>
                                      }
                                      secondary={
                                        <React.Fragment>
                                          <p
                                            style={{
                                              fontSize: "medium",
                                              marginTop: "10px",
                                              display: "flex",
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                            }}
                                          >
                                            <span>{full.title}</span>
                                            <span>
                                              {" "}
                                              <ImageIcon
                                                style={{
                                                  fill: "#f18121",
                                                  height: "2.5rem",
                                                }}
                                              />
                                            </span>
                                          </p>
                                          <br />
                                          <Typography
                                            component="span"
                                            variant="body2"
                                            color="textPrimary"
                                          ></Typography>
                                        </React.Fragment>
                                      }
                                    />
                                  </ListItem>
                                  <hr style={{ marginBottom: "20px" }} />
                                </div>
                              ) : null || full.type === "pdf" ? (
                                <div>
                                  <ListItem
                                    onClick={() => {
                                      handleClickOpen(full);
                                    }}
                                    style={{ cursor: "pointer" }}
                                    alignItems="flex-start"
                                  >
                                    <div style={{ width: "50px" }}>
                                      {" "}
                                      <Announcements
                                        className={
                                          dashboardStyle.announcementIcon
                                        }
                                      />{" "}
                                    </div>
                                    <ListItemText
                                      style={{ marginLeft: "20px" }}
                                      primary={
                                        <p
                                          style={{
                                            fontSize: "small",
                                            marginTop: "-20px",
                                          }}
                                        >
                                          {moment(full.sdate * 1000).format(
                                            "DD/MM/YYYY  "
                                          )}
                                        </p>
                                      }
                                      secondary={
                                        <React.Fragment>
                                          <p
                                            style={{
                                              fontSize: "medium",
                                              marginTop: "10px",
                                              display: "flex",
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                            }}
                                          >
                                            <span>{full.title}</span>
                                            <span>
                                              {" "}
                                              <PdfIcon className="pdfAct" />
                                            </span>
                                          </p>
                                          <br />
                                          <Typography
                                            component="span"
                                            variant="body2"
                                            color="textPrimary"
                                          ></Typography>
                                        </React.Fragment>
                                      }
                                    />
                                  </ListItem>
                                  <hr style={{ marginBottom: "20px" }} />
                                </div>
                              ) : null}
                            </div>
                          ))}
                        </Accordion>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: "medium", textAlign: "center" }}>
                      No Announcements
                    </p>
                  )}
                  <div className={dashboardStyle.announcmentDivider} />
                </Paper>
                <Dialog
                  fullScreen={fullScreen}
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="responsive-dialog-title"
                  className={classes.paper}
                >
                  <div>
                    <DialogTitle
                      style={{
                        position: "absolute",
                        top: "0",
                        left: "30px",
                        maxWidth: "800px",
                      }}
                    >
                      {obj.title}
                    </DialogTitle>
                    <IconButton
                      style={{ position: "absolute", top: "0", right: "0" }}
                      component="span"
                      onClick={() => {
                        handleClose();
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                  <DialogContent className={classes.content}>
                    {renderObjects(obj)}
                  </DialogContent>
                  <DialogActions></DialogActions>
                </Dialog>
              </Grid>

              <Grid item xs={6}>
                <h2
                  style={{
                    color: config.main_color_1,
                    marginTop: "20px",
                    fontWeight: "bold",
                    fontSize: "19px",
                    marginBottom: "20px",
                  }}
                  //className={dashboardStyle.gridHeader}
                >
                  Events
                </h2>
                <Paper className={classes.paperEvents}>
                  <Typography component="list" variant="h1">
                    {isLoading ? <Skeleton /> : null}
                  </Typography>
                  <Typography component="list" variant="h1">
                    {isLoading ? <Skeleton /> : null}
                  </Typography>
                  <Typography component="list" variant="h1">
                    {isLoading ? <Skeleton /> : null}
                  </Typography>
                  <Typography component="list" variant="h1">
                    {isLoading ? <Skeleton /> : null}
                  </Typography>
                  {events.length === 0 ? (
                    <p style={{ fontSize: "16px", textAlign: "center" }}>
                      {" "}
                      No Upcoming Events
                    </p>
                  ) : (
                    events.map((event) => (
                      <div
                        style={{ marginTop: "30px", cursor: "pointer" }}
                        onClick={() => {
                          if (event.type !== "event") handleNavigate(event);
                        }}
                      >
                        <Typography component="list" variant="h1">
                          {isLoading ? <Skeleton /> : null}
                        </Typography>
                        <Typography component="list" variant="h1">
                          {isLoading ? <Skeleton /> : null}
                        </Typography>
                        <div>
                          <div className={dashboardStyle.iconTop}>
                            {moment(event.start).format("ddd")}
                          </div>
                          <div className={dashboardStyle.iconBottom}>
                            {" "}
                            {moment(event.start).format("D")}
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: "medium",
                            whiteSpace: "normal",
                            minHeight: "10px",
                            marginLeft: "61px",
                          }}
                        >
                          <div
                            style={{
                              marginTop: "-22px",
                              color: "#0f80a4",
                              textTransform: "capitalize",
                            }}
                          >
                            {event.title}
                          </div>
                          {event.link === undefined ||
                          event.link === "" ? null : (
                            <div>
                              {event.type !== "event" ? (
                                <p>{event.description}</p>
                              ) : (
                                <a
                                  href={event.link}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {event.link}
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                        <hr className={dashboardStyle.eventsDivider} />
                      </div>
                    ))
                  )}
                </Paper>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

let styles = {
  topicNameDashboard: {
    marginTop: "15px ",
    fontSize: "15px ",
    float: "left ",
    marginLeft: "20px ",
    fontWeight: "bold ",
    color: config.main_color_1,
    marginRight: "20px",
  },
  gridHeader: {
    color: config.main_color_1,
    marginBottom: "30px",
    fontWeight: "bolder",
    fontSize: "large",
    marginLeft: "-530px",
  },
  gridHeaderCourse: {
    color: config.main_color_2,
    marginBottom: "30px",
    fontWeight: "bolder",
    fontSize: "large",
    //margin-left: -530px;
  },
};
