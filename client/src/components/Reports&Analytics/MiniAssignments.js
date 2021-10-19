import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody} from '@material-ui/core';
import { API } from "aws-amplify";
import { useSelector } from "react-redux";
import Skeleton from "@material-ui/lab/Skeleton";


// Local imports
import config from "../../config/aws-exports";
import ClockGray from '../../assets/svgjs/ClockGray';
import DoneCircle from '../../assets/svgjs/DoneCircle';
import Remove from '../../assets/svgjs/Remove';
import { Constants } from "../../config/constants";
import { authData } from "../../redux/auth/authSlice";

// style imports
import Mini from './MiniAssignments.module.scss';

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: "20px",
    fontWeight: 400,
    color: config.main_color_1,
  },
  coursetitle: {
    fontSize: "14px",
    fontWeight: 400,
    color: config.main_color_2,
  },
  modulename: {
    fontSize: "12px",
    fontWeight: 400,
    color: "black",
  },
  tableheader: {
    background: config.main_color_1,
    color: "white",
    fontSize: "16px"
  }
}));

const MiniAssignments = () => {
  const classes = useStyles();
  const [index, setIndex] = useState(-1);
  const [expanded, setExpanded] = useState(false);
  const [bpdata, setBpData] = useState([]);
  const [bpid, setBpid] = useState();
  const [ttitle, setTtitle] = useState([]);
  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newGrade, setNewGrade] = useState(null);
  const [view, setView] = useState(false);
  const [messageView, setMessageView] = useState(false);

  let userDetails = useSelector(authData);

  console.log("userdetails", userDetails);
  

  useEffect(() => {
    getuserprogress();
    return () => { };
  }, []);

  // api to get programs and course select
  async function getuserprogress() {
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
      let topic = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.GET_USER_PROGRESS,
        bodyParam
      );
      console.log("getUserProgress", topic);
      let { bpdata } = topic;
      console.log("bpdata", bpdata);
      setBpData(bpdata);
    } catch (error) {
      console.error(error);
    }
  }


  // API to get miniassignment details for the selected course
  async function getMiniAssignment(event) {
    setIsLoading(true);
    setMessageView(true);
    setExpanded(false);
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        eid: userDetails.eid,
        bpid: bpid,
        cid: ttitle[event.target.value].tid,
        bcid: ttitle[event.target.value].bcid,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.GET_USER_MINI_ASSIGNMENT,
        bodyParam
      );
      console.log("response", response);
      if (response === undefined || response === null || response["errorType"] === "TypeError" || Object.keys(response).length === 0) {
        setCourseData(null);
        setIsLoading(false);
      }
      else {
        setCourseData(response);
        console.log("coursedate", courseData)
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    setIndex(-1);
  };


  function accordionList() {
    return (
      <div className={Mini.leftaccordionholder}>
        {courseData.map((value, i) => (
        <Accordion 
        className={classes.programname}
        expanded={expanded === `${i}`}
        onChange={handleChange(`${i}`)}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>{value.ntitle}</Typography>
          </AccordionSummary>
          
          <AccordionDetails>
          {value.objects.map((mini,i) => {
            return(
              <Typography > 
                <h3 className={i === index ? Mini.assignmentactive : Mini.assignmentnotactive}   onClick={() => {setNewGrade(mini.grade) ;setIndex(i); setView(true)}}>{mini.otitle}</h3>
            </Typography>
            )
          })}
          </AccordionDetails>
        </Accordion>
        ))}
    </div>
        
    )};

  function renderDetails(event) {
    setTtitle(bpdata[event.target.value].tcourses);
    setBpid(bpdata[event.target.value].bpid);
  }

  return (
    <div className={Mini.tabcontainer}>
      <div className={Mini.dropdownselect}>
        <div className={Mini.select}>
          <label for="course-select" className={Mini.label}>Select a Program</label>
          <select id="course-select" className={Mini.courseselect} onChange={(event) => renderDetails(event)}>
            <option selected="selected" disabled>Select Program</option>
            {bpdata.map((value, index) => (
              <option value={index} key={"prog" + index}>{value.ptitle.substring(0,40)}{value.ptitle.length > 40 ? "..." : null}</option>
            ))}
          </select>
        </div>
        <div className={Mini.select}>
          <label for="course-select" className={Mini.label}>Select a Course</label>
          <select id="course-select" className={Mini.courseselect} onChange={(event) => {getMiniAssignment(event);setView(false)}}>
            <option selected="selected" disabled>Select Course</option>
            {ttitle.map((value, index) => (
              <option value={index} key={"prog" + index}>{value.ttitle.substring(0, 50)}{value.ttitle.length > 50 ? "..." : null}</option>
            ))};
          </select>
        </div>
      </div>
      {isLoading === false ? 
      <div className={Mini.twotableholder}>
        {courseData === null ? (messageView === true ? <h3>No Mini Assignments</h3> : null ) : accordionList() }

        {courseData === null ? null : view === true ? 
        <div className={Mini.rightaccordionholder}>
          <TableContainer style={{ borderRadius: "5px" }}>
            <Table>
              <TableHead>
                <TableRow className={classes.tableheader}>
                  <TableCell style={{ color: "white", fontSize: "16px" }}>Status</TableCell>
                  <TableCell style={{ color: "white", fontSize: "16px" }}>Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell style={{ width: "30%" }}>
                    {newGrade === undefined ? <Remove className={Mini.Remove} fill={Constants.main_color_2}/> : newGrade === -1 ? <ClockGray className={Mini.clock} cls1={Mini.cls1} cls2={Mini.cls2} /> : newGrade >= 0 ? <DoneCircle className={Mini.tick}/> : null }</TableCell>
                  <TableCell style={{ fontSize: "14px", width: "70%", fontWeight: "400" }}>{
                  newGrade === undefined ? "Not Submitted" : newGrade === -1 ? "Not Graded" : newGrade >= 0 ? newGrade : null }</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div> : null }
      </div> :  <Skeleton height={500} width={"100%"}/>}
    </div>
  );
};

export default MiniAssignments;
