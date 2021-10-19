// Dependencies imports
import React, { useState, useEffect } from 'react';
import { API } from "aws-amplify";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";
import LinearProgress from "@material-ui/core/LinearProgress";
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

// Local imports
import { awsSignIn, authData } from "../../redux/auth/authSlice";
import config from "../../config/aws-exports";
import { Constants } from "../../config/constants";

// style imports
import Course from './CourseProgress.module.scss';
import { object } from 'yup';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "inline-block",
    width: "100%",
    paddingTop: "20px",
  },
  root1: {
    width: "100%",
  },
  programtitle: {
    fontSize: "18px",
    color: config.main_color_1,
  },
  heading: {
    fontSize: "18px",
    fontWeight: 400,
    color: config.main_color_1,
  },
  coursetitle: {
    fontSize: "16px",
    fontWeight: 400,
    color: config.main_color_2,
  },
  modulename: {
    fontSize: "14px",
    fontWeight: 400,
    color: "black",
    width: "60%"
  },
  subheading: {
    color: "black",
    fontFamily: "nunito",
    fontSize: "14px",
    fontWeight: "600px",
  },
  "MuiAccordionDetails-root": {
    display: "inline-block",
    width: "100%",
    padding: "10px 20px",
  },
}));

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress
          variant="determinate"
          color="primary"
          style={{ backgroundColor: "whitesmoke" }}
          {...props}
        />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

// start of main coures Progress component
const CourseProgress = () => {
  const [bpdata, setBpData] = useState([]);
  const [courseData, setCourseData] = useState(null);
  const [ttitle, setTtitle] = useState([]);
  const [pid, setPid] = useState([]);
  const [bid, setBid] = useState([]);
  const [ptitle, setPtitle] = useState([]);
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  let userDetails = useSelector(authData);

  useEffect(() => {
    getuserprogress();
    return () => {};
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
        let {bpdata} = topic;
        console.log("bpdata",bpdata);
        setBpData(bpdata);
    } catch (error) {
      console.error(error);
    }
  }

// API to course progress details for the selected coures
  async function getCourse(event) {
    setIsLoading(true);
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        eid: userDetails.eid,
        pid: pid,
        bpid: bid,
        courseid: ttitle[event.target.value].tid,
        bcourseid: ttitle[event.target.value].bcid,
        ptitle: ptitle,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.GET_COURSE,
        bodyParam
      );
      console.log("response", response);
      if(response === undefined || response === null || response["errorType"] === "TypeError" || Object.keys(response).length === 0 ){
        setCourseData(null);
        setIsLoading(false);
      }
      else{
        setCourseData(response);
        setIsLoading(false);
      }

    } catch (error) {
      console.error(error);
    }
  }

function AccordionList(){
  return courseData.unit.map((value) => (
    <div className={Course.accholder}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.programtitle}>{value.unitname}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {value.nuggets.map((nug) => (
              <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.coursetitle}>{nug.ntitle}</Typography>
              </AccordionSummary>
              {nug.objects.map((obj) => {
                let newvalue = parseInt(obj.oduration);
                let percent = (Math.round(obj.userOP.timespent)/newvalue) * 100;
                return(
                <AccordionDetails>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "30px" }}>
                  <Typography className={classes.modulename}>{obj.otitle}</Typography>
                  <div style={{ width: "60%" }}>
                    {obj.userOP.timespent === 0 ? <LinearProgressWithLabel value={0}/> : newvalue < obj.userOP.timespent ? <LinearProgressWithLabel value={100} />  :   <LinearProgressWithLabel value={percent}/>}
                  </div>
                </div>
              </AccordionDetails>
              )})}
            </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      </div>
    ))
}

function renderDetails(event){
  setTtitle(bpdata[event.target.value].tcourses);  
  setBid(bpdata[event.target.value].bpid)
  setPid(bpdata[event.target.value].pid)
  setPtitle(bpdata[event.target.value].ptitle)  
}


  return (
    <div className={Course.tabcontainer}>
      <div className={Course.dropdownselect}>
      <div className={Course.select}>
        <label for="course-select" className={Course.label}>Select a Program</label>
        <select id="coselect" className={Course.courseselect} onChange={(event) => renderDetails(event)}>
          <option selected="selected" disabled>Select Program</option>
        {bpdata.map((value,index) => (
          <option value={index} key={"cour"+index}>{value.ptitle.substring(0,40)}{value.ptitle.length > 40 ? "..." : null}</option>
        ))};
        </select>
      </div>
      <div className={Course.select}>
        <label for="course-select" className={Course.label}>Select a Course</label>
        <select id="course-select" className={Course.courseselect} width={300} style={{width: "300px"}} onChange={(event) => getCourse(event)}>
          <option selected="selected" width={300} style={{width: "100px"}} disabled className={Course.option}>Select Course</option>
        {ttitle.map((value, index) => (
          <option value={index} key={"prog"+index} width={300} style={{width: "300px"}} className={Course.option}>{value.ttitle.substring(0, 50)}{value.ttitle.length > 50 ? "..." : null}</option>
        ))};
        </select>
      </div>
      </div>
      {isLoading === false ? courseData === null ? null : <AccordionList /> : <Skeleton height={500} width={"100%"}/>}
    </div>
  )
}

export default CourseProgress;


