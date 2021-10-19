import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, withTheme } from '@material-ui/core';
import { useSelector, useDispatch } from "react-redux";
import Skeleton from "@material-ui/lab/Skeleton";
import { API } from "aws-amplify";


// Local imports
import config from "../../config/aws-exports";
import ClockGray from '../../assets/svgjs/ClockGray';
import { awsSignIn, authData } from "../../redux/auth/authSlice";
import { Constants } from "../../config/constants";
import DoneCircle from '../../assets/svgjs/DoneCircle';
import Remove from '../../assets/svgjs/Remove';

// style imports
import Assign from './Assignments.module.scss';

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

const Assignments = () => {
  const classes = useStyles();
  const [index, setIndex] = useState(-1);
  const [pid, setPid] = useState();
  const [bpid, setBpid] = useState();
  const [score, setScore] = useState();
  const [bpdata, setBpData] = useState([]);
  const [ttitle, setTtitle] = useState([]);
  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState(false);
  const [messageView, setMessageView] = useState(false);
  let userDetails = useSelector(authData);

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

  console.log("bpdata state", bpdata)

  // API to get Assignment details for the selected course
  async function getAssignment(event) {
    setIsLoading(true);
    setMessageView(true);
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        pid: pid,
        bpid: bpid,
        bcid: ttitle[event.target.value].bcid,
        cid: ttitle[event.target.value].tid,
        quiztype: "assign",
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
        Constants.GET_USER_ASSIGN_ASSESS,
        bodyParam
      );
      if (response === undefined || response === null ||  response["errorType"] === "TypeError" || Object.keys(response).length === 0) {
        setCourseData(null);
        setIsLoading(false);
      }
      else {
        setCourseData(response);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  }


  function renderDetails(event) {
    setTtitle(bpdata[event.target.value].tcourses);
    setBpid(bpdata[event.target.value].bpid);
    setPid(bpdata[event.target.value].pid);
  };
  console.log("score", score);
  console.log("courseData", courseData)
  return (
    <div className={Assign.tabcontainer}>
      <div className={Assign.dropdownselect}>
        <div className={Assign.select}>
          <label for="course-select" className={Assign.label}>Select a Program</label>
          <select id="course-select" className={Assign.courseselect} onChange={(event) => renderDetails(event)}>
            <option selected="selected" disabled>Select Program</option>
            {bpdata.map((value, index) => (
              <option value={index} key={"prog" + index}>{value.ptitle.substring(0,40)}{value.ptitle.length > 40 ? "..." : null}</option>
            ))}
          </select>
        </div>
        <div className={Assign.select}>
          <label for="course-select" className={Assign.label}>Select a Course</label>
          <select id="course-select" className={Assign.courseselect} onChange={(event) => getAssignment(event)}>
            <option selected="selected" disabled>Select Course</option>
            {ttitle.map((value, index) => (
              <option value={index} key={"prog" + index}>{value.ttitle.substring(0, 50)}{value.ttitle.length > 50 ? "..." : null}</option>
            ))};
          </select>
        </div>
      </div>
      {isLoading === false ?
      <div className={Assign.twotableholder}>
        <div className={Assign.leftaccordionholder}>
          <Table>
            <TableBody>
                {courseData === null ? (messageView === true ? <h3>No Assignments</h3> : null) : courseData.map((value, i) => (
                   <TableRow key={"assign" + i} className={i === index ? Assign.assignmentactive : Assign.assignmentnotactive} onClick={() => { setIndex(i); setScore(value.score); setView(true); }}>
                  <TableCell >
                    <h3 style={i === index ? {color: "white"} : {color:"black"}}>{value.title}</h3>
                  </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {courseData === null ? null : view === true ?
        <div className={Assign.rightaccordionholder}>
          
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
                    {score === undefined ? <Remove className={Assign.Remove} fill={Constants.main_color_2} /> : score === -1 ? <ClockGray className={Assign.clock} cls1={Assign.cls1} cls2={Assign.cls2} /> :  <DoneCircle className={Assign.tick} /> }</TableCell>
                  <TableCell style={{ fontSize: "14px", width: "70%", fontWeight: "400" }}>
                  
                    {
                    score === undefined ? "Not Submitted" : score === -1 ? "Not Graded" : score }</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div> : null}
      </div> :  <Skeleton height={500} width={"100%"}/>}
    </div>
  );
};

export default Assignments;