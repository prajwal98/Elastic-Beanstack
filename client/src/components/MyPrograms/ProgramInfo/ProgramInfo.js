import React, { useEffect, useState } from "react";

import moment from "moment";

import { Tab } from "semantic-ui-react";
import { Rating } from "semantic-ui-react";
import InstructorsCard from "../../../modules/Cards/Instructors/InstructorsCard";
import { useSelector, useDispatch } from "react-redux";

import { awsSignIn, authData, awsSignOut } from "../../../redux/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";

import "../../../modules/Tabs/Tabs.scss";
import { Document, Page, pdfjs } from "react-pdf";
import bio from "../../../assets/images/P1 - PG Diploma in bioinformatics.jpg";

import "./ProgramInfo.scss";
import Rupee from "../../../assets/svgjs/Rupee";
import PdfIcon from "../../../assets/svgjs/Pdf";
import Video from "../../../assets/svgjs/Video";
import Audio from "../../../assets/svgjs/Audio";
import ImageIcon from '@material-ui/icons/Image';
import PlaceholderParagraph from "../../../modules/Placeholder/PlaceholderParagraph";

import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import ClockOrange from "../../../assets/svgjs/ClockOrange";
import Announcements from "../../../assets/svgjs/Announcements";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Paper from "@material-ui/core/Paper";
import ReactPlayer from "react-player";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import Grid from "@material-ui/core/Grid";

import { FaBars } from "react-icons/fa";
import UserHeader from "../../Header/UserHeader/UserHeader";
import config from "../../../config/aws-exports";
import { a, API } from "aws-amplify";
import { Constants } from "../../../config/constants";
import progIbfo from "./ProgramInfo.module.scss";
import { DialogTitle, useMediaQuery } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",

    "& .MuiAccordionDetails-root": {
      display: "list-item",
      padding: "8px 16px 16px",
    },
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
  heading: {
    fontSize: theme.typography.pxToRem(13),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));
export default function ProgramInfo({ handleToggleSidebar }) {
  const classes = useStyles();
  const [activeIndex, setActiveIndex] = useState(0);
  const [programsJSON, setProgramsJSON] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [obj, setObj] = useState({});

  let navigate = useNavigate();

  let userDetails = useSelector(authData);
  console.log("user detailss" + JSON.stringify(userDetails));
  const dispatch = useDispatch();

  let a = userDetails.pgcdactive;
  let b = userDetails.data.bpdata[0].bpid;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  useEffect(() => {
    set();
    getProgramsDetailsPost();
    getAnnouncementLoad();
    breadcrumb();
  }, []);

  function breadcrumb() {
    let sdata = { ...userDetails };
    let temp = [...sdata.breadcrumb];

    temp[1] = {
      name: "Program Info",
      path: "/myPrograms/programinfo",
    };

    sdata.breadcrumb = temp;

    dispatch(awsSignIn(sdata));
  }

  async function set() {
    //let a = await localStorage.getItem("active");

    setActiveIndex(a.a);
  }
  async function getProgramsDetailsPost() {
    const bodyParam = {
      body: { oid: config.aws_org_id, pid: a.pid, bpid: a.bpid },
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

      setProgramsJSON(programsJSON);
      setIsLoading(false);
    } catch (error) {
      console.log("getCategoryError", error);
    }
    console.log("Mount");
  }

  async function getAnnouncementLoad() {
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        bpid: [a.bpid],
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

      setAnnouncements(AnnouncementsJSON);
    } catch (error) {
      console.error(error);
    }
  }

  function continueLearning() {
    let pdata = userDetails.data.bpdata;
    let sdata = { ...userDetails };
    for (let i = 0; i < pdata.length; i++) {
      if (a.bpid == pdata[i].bpid) {
        sdata.curprg = pdata[i];
      }
    }

    dispatch(awsSignIn(sdata));

    navigate("/MyPrograms/programs");
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const handleClickOpen = (full) => {
    setOpen(true);

    setObj(full);
  };

  const handleClose = () => {
    setOpen(false);
  };
  function modalO() {
    const handleClose = () => {
      setOpen(false);
    };

    function onDocumentLoadSuccess({ numPages }) {
      setNumPages(numPages);
    }

    return <>{open}</>;
  }
  function programNameAnc(prog) {
    for (let i = 0; i < userDetails.data.bpdata.length; i++) {
      if (announcements[prog].tid === userDetails.data.bpdata[i].bpid) {
        return <h2>{userDetails.data.bpdata[i].ptitle}</h2>;
      }
    }
  }
  function renderObjects(curObject) {
    //alert(JSON.stringify(curObject));

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
          return imageView(curObject);// loadMultimediaView(curObject);
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
          }/${config.aws_org_id.toLowerCase()}-resources/images/announcement-images/${curObject.mfname}`}
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
          <ReactPlayer url={`https://${
                    config.DOMAIN
                  }/${config.aws_org_id.toLowerCase()}-resources/images/announcement-images/${curObject.mfname}`} controls={true} />
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
        <iframe frameBorder="0" src={`https://${
                    config.DOMAIN
                  }/${config.aws_org_id.toLowerCase()}-resources/images/announcement-images/${curObject.mfname}`} height="100%" width="100%" title="pdf" />
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
        <iframe frameBorder="0" src={`https://${
                    config.DOMAIN
                  }/${config.aws_org_id.toLowerCase()}-resources/images/announcement-images/${curObject.mfname}`} height="100%" width="100%" title="pdf" />
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
        <iframe frameBorder="0"
          src={`https://${
            config.DOMAIN
          }/${config.aws_org_id.toLowerCase()}-resources/images/announcement-images/${curObject.mfname}`}
          width={"100%"}
          height="100%"
          //height={height - 300}
          title="WebView"
        />
      </div>
    );
  }
  const panes = [
    {
      menuItem: "Overview",
      render: () => (
        <Tab.Pane className={progIbfo.overview}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          ></div>
          {isLoading ? (
            <PlaceholderParagraph />
          ) : (
            <p
              className={progIbfo.p_text}
              dangerouslySetInnerHTML={{ __html: programsJSON.poverview }}
            ></p>
          )}
          {programsJSON.pinstructors !== undefined &&
            programsJSON.pinstructors.length > 0 && (
              <div className="instructors">
                <div className="instructors__h1">
                  <h2 style={{ marginLeft: "20px", marginTop: "20px" }}>
                    Program Instructors
                  </h2>
                </div>
                <div>
                  <div
                    className="card-container"
                    style={{ float: "left", marginLeft: "50px" }}
                  >
                    {programsJSON.pinstructors.map(
                      ({ name, designation, org, pic }, idx) => (
                        <InstructorsCard
                          key={idx}
                          name={name}
                          designation={designation}
                          org={org}
                          pic={pic}
                          pid={programsJSON.pid}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <div style={{ width: "60%" }}>
              <div>
                <h2 className={progIbfo.h2_margin}>Program features</h2>
                {isLoading ? (
                  <div style={{ width: "60%", overflow: "hidden" }}>
                    <PlaceholderParagraph />
                  </div>
                ) : (
                  <p
                    className={progIbfo.p_text}
                    dangerouslySetInnerHTML={{ __html: programsJSON.pfeatures }}
                  ></p>
                )}
              </div>
              <hr />
              <div>
                <h2 className={progIbfo.h2_margin}>Program outcomes</h2>
                {isLoading ? (
                  <PlaceholderParagraph />
                ) : (
                  <p
                    className={progIbfo.p_text}
                    dangerouslySetInnerHTML={{ __html: programsJSON.poutcomes }}
                  ></p>
                )}
              </div>
            </div>
            <div style={{ width: "30%" }}>
              {isLoading === false ? (
                <img
                  style={{
                    height: "200px",
                    float: "right",
                    marginLeft: "2rem",
                    width: "300px",
                  }}
                  alt=""
                  src={`https://${
                    config.DOMAIN
                  }/${config.aws_org_id.toLowerCase()}-resources/images/program-images/${
                    programsJSON.pid
                  }.png`}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Skeleton variant="rect" width={300} height={200} />
                </div>
              )}
            </div>
          </div>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Curriculum",
      render: () => (
        <Tab.Pane>
          {programsJSON
            ? programsJSON.pcurriculum.map(
                ({ tlabel, tduration, ttitle, tunits, tid }) => (
                  <div className={progIbfo.pcurriculum}>
                    <div className={progIbfo.courses_container}>
                      <div className={progIbfo.ID_container}>
                        <div
                          className={progIbfo.image_container}
                          style={{
                            backgroundImage: `url('https://${
                              config.DOMAIN
                            }/${config.aws_org_id.toLowerCase()}-resources/images/topic-images/${tid}.png')`,
                          }}
                        ></div>
                        <div className={progIbfo.details_container}>
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
                                  className={progIbfo.clock_size__s}
                                  cls1={progIbfo.cls1_s}
                                  cls2={progIbfo.cls2_s}
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
                          <p className={progIbfo.tunits}>{units}</p>
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
    {
      menuItem: "Syllabus",
      render: () => (
        <Tab.Pane>
          {isLoading === false ? (
            <div style={{ width: "100%", height: "700px" }}>
              <iframe
                style={{ height: "700px" }}
                src={`https://${
                  config.DOMAIN
                }/${config.aws_org_id.toLowerCase()}-resources/pdf/${
                  programsJSON.pid
                }.pdf`}
                height="600"
                width="100%"
              ></iframe>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                width: "100%",
                height: "100%",
              }}
            >
              <Skeleton type="rect" height={700} width={"100%"} />
            </div>
          )}
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Announcements",
      render: () => (
        <Tab.Pane>
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

            {announcements.length !== 0 ? (
              <div>
                {Object.keys(announcements).map((prog, idx) => (
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
                    {announcements[prog].json.map((full, idx, arr) => (
                      <div>
                        {full.type === "text" ? (
                          <>
                            <ListItem alignItems="flex-start">
                              <Announcements
                                className={progIbfo.announcementIcon}
                              />{" "}
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
                          </>
                        ) : null || full.type === "pdf" ? (
                          <>
                            <ListItem alignItems="flex-start">
                              <Announcements
                                className={progIbfo.announcementIcon}
                              />{" "}
                              <ListItemText  onClick={() => {
                                        handleClickOpen(full);
                                      }}
                                style={{ marginLeft: "20px", cursor: "pointer" }}
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
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                      }}
                                    >
                                     <span>{full.title}</span>
                                      <span>  <PdfIcon className="pdfAct" /></span>
                                    </p>
                                    <br />
                                  
                                  </React.Fragment>
                                }
                              />
                            </ListItem>
                            <hr style={{ marginBottom: "20px" }} />
                          </>
                        ) : null || full.type === "web" ? (
                          <>
                            <ListItem alignItems="flex-start">
                              <Announcements
                                className={progIbfo.announcementIcon}
                              />{" "}
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
                                        <a href={`${full.weburl}`}>
                                          {full.weburl}
                                        </a>
                                      </p>
                                    </Typography>
                                  </React.Fragment>
                                }
                              />
                            </ListItem>
                            <hr style={{ marginBottom: "20px" }} />
                          </>
                        ) : null || full.type === "video" ? (
                          <>
                            <ListItem alignItems="flex-start">
                              <Announcements
                                className={progIbfo.announcementIcon}
                              />{" "}
                              <ListItemText onClick={() => {
                                        handleClickOpen(full);
                                      }}
                                style={{ marginLeft: "20px", cursor: "pointer" }}
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
                                        alignItems: "center"
                                      }}
                                    >
                                       <span>{full.title}</span>
                                      <span>  <Video className="video-size" cls1="cls-1--v" cls2="cls-2--v" /></span>
                                      
                                   
                                    </p>
                                    <br />
                                   
                                  </React.Fragment>
                                }
                              />
                            </ListItem>
                            <hr style={{ marginBottom: "20px" }} />
                          </>
                        ) : null || full.type === "audio" ? (
                          <>
                            <ListItem alignItems="flex-start">
                              <Announcements
                                className={progIbfo.announcementIcon}
                              />{" "}
                              <ListItemText 
                                onClick={() => {
                                  handleClickOpen(full);
                                }}
                                style={{ marginLeft: "20px", cursor: "pointer" }}
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
                                        alignItems: "center"
                                      }}
                                    >
                                      <span>{full.title}</span>
                                      <span> <Audio className="video-size" cls1="cls-1--a" cls2="cls-2--a" /></span>
                                      
                                    </p>
                                    <br />
                                   
                                  </React.Fragment>
                                }
                              />
                            </ListItem>
                            <hr style={{ marginBottom: "20px" }} />
                          </>
                        ) : null || full.type === "image" ? (
                          <>
                            <ListItem alignItems="flex-start">
                              <Announcements
                                className={progIbfo.announcementIcon}
                              />{" "}
                              <ListItemText
                                onClick={() => {
                                  handleClickOpen(full);
                                }}
                                style={{ marginLeft: "20px", cursor: "pointer" }}
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
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center"
                                    }}
                                  >
                                    <span>{full.title}</span>
                                    <span> <ImageIcon style={{fill: "#f18121", height: "2.5rem"}} /></span>
                                    
                                  </p>
                                    <br />
                                  
                                  </React.Fragment>
                                }
                              />
                            </ListItem>
                            <hr style={{ marginBottom: "20px" }} />
                          </>
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
            <div className={progIbfo.announcmentDivider} />
          </Paper>
          <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
            className={classes.paper}
          >
            
            <div >
            <DialogTitle style={{ position: "absolute", top: "0", left: "30px", maxWidth: "800px" }}>{obj.title}</DialogTitle>
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
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Academic Schedule",
      render: () => (
        <Tab.Pane>
          {isLoading === false ? (
            <div>
              <iframe frameBorder="0"
                style={{ height: "700px" }}
                src={`https://${
                  config.DOMAIN
                }/${config.aws_org_id.toLowerCase()}-resources/pdf/academic/${
                  programsJSON.pid
                }.pdf`}
                height="600"
                width="100%"
              ></iframe>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                width: "100%",
                height: "100%",
              }}
            >
              <Skeleton type="rect" height={700} width={"100%"} />
            </div>
          )}
          {/*   <Tab.Pane>
            <Document file={`https://${config.DOMAIN}/${config.aws_org_id.toLowerCase()}-resources/pdf/academic/${programsJSON.pid}.pdf`} onLoadSuccess={onDocumentLoadSuccess}> */}

          {/* https://${config.DOMAIN}/jssaher-content/CR017/pdf/009.pdf 
       
       https://${config.DOMAIN}/jssaher-resources/pdf/academic/009.pdf`
       
       
       */}
          {/*  <Page pageNumber={pageNumber} />
            </Document>
          </Tab.Pane> */}
        </Tab.Pane>
      ),
    },
  ];

  let handleTabChange = (e, { activeIndex }) => setActiveIndex(activeIndex);

  return (
    <div className={progIbfo.maincontainer}>
      <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
        <FaBars />
      </div>
      <UserHeader Bindex={1} />
      <div className={progIbfo.overview}>
        <div className={progIbfo.overview__h1}>
          <Typography component="div" key="h2" variant="h2">
            {isLoading ? (
              <Skeleton />
            ) : (
              <h1>
                <strong>{programsJSON.pname}</strong>
              </h1>
            )}
          </Typography>
        </div>
        {/* <div className={progIbfo.overview__card}>
          <div className={progIbfo.overview__cardContent}>
            <div className={progIbfo.content}>
              <div className={progIbfo.content__details}>
                <div className={progIbfo.align_self}>
                  <Rating
                        icon="star"
                        defaultRating={4}
                        maxRating={5}
                        size="huge"
                      />
                </div>
                <div className={progIbfo.items}>
                  <div>
                    <strong>
                      <span>
                        <ClockOrange
                          className={progIbfo.clock_size}
                          cls1={progIbfo.cls_1}
                          cls2={progIbfo.cls_2}
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
                <div className={progIbfo.items}>
                  <div>
                    <strong>
                      <span>
                        <Rupee className={progIbfo.rupee_size} />
                      </span>{" "}
                      {isLoading ? <Skeleton /> : programsJSON.pinfo.price}
                    </strong>
                  </div>
                  <div className={progIbfo.align_credits}>
                    Credits:{" "}
                    <strong>
                      {isLoading ? <Skeleton /> : programsJSON.pinfo.credits}
                    </strong>
                  </div>
                </div>
                <div className={progIbfo.align_self}>
                  {isLoading ? (
                    <Skeleton />
                  ) : (
                    <button
                      style={{
                        fontSize: "15px",
                        fontWeight: "bold",
                        width: "200px",
                        borderRadius: "6px",
                        height: "30px",
                        border: "none"
                      }}
                      className={progIbfo.btn_color}
                      onClick={continueLearning}
                    >
                      Continue Learning
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          {isLoading ? (
            <Skeleton variant="rect" width="100%">
              <div style={{ paddingTop: "57%" }} />
            </Skeleton>
          ) : (
            <div className={progIbfo.overview__cardImage}>
              <img
                src={`https://${config.DOMAIN
                  }/${config.aws_org_id.toLowerCase()}-resources/images/program-images/${programsJSON.pid
                  }.png`}
                alt=""
              />
            </div>
          )}
        </div> */}
        <div className={progIbfo.tabMargin}>
          {isLoading === false ? (
            <Tab
              panes={panes}
              activeIndex={activeIndex}
              onTabChange={handleTabChange}
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: 800,
              }}
            >
              <Skeleton
                height={800}
                width="100%"
                style={{ marginTop: "-350px" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
