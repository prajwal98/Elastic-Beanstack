import React, { useState, useEffect } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  withTheme,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { API } from "aws-amplify";
import moment from "moment";
import Skeleton from "@material-ui/lab/Skeleton";

// Local imports
import config from "../../config/aws-exports";
import DoneCircle from "../../assets/svgjs/DoneCircle";
import Reject from "../../assets/svgjs/Reject";
import { Constants } from "../../config/constants";
import { awsSignIn, authData } from "../../redux/auth/authSlice";

// style imports
import Attend from "./Attendance.module.scss";

const header = {
  fontSize: "20px",
  background: config.main_color_1,
};

const headercell = {
  fontSize: "18px",
  color: "white",
  fontWeight: "600",
};

const allcell = {
  fontSize: "14px",
  color: config.main_color_1,
  fontWeight: 500,
  width: "10%",
};

const allcell1 = {
  fontSize: "14px",
  color: config.main_color_1,
  fontWeight: 500,
  width: "40%",
};

const allcell2 = {
  fontSize: "14px",
  color: config.main_color_1,
  fontWeight: 500,
  width: "30%",
};

const allcell3 = {
  fontSize: "14px",
  color: config.main_color_1,
  fontWeight: 500,
  width: "20%",
};

const Attendance = () => {
  const [bpdata, setBpData] = useState([]);
  const [bid, setBid] = useState();
  const [courseData, setCourseData] = useState(null);
  const [ttitle, setTtitle] = useState([]);
  let userDetails = useSelector(authData);
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);

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
      let { bpdata } = topic;
      console.log("bpdata", bpdata);
      setBpData(bpdata);
    } catch (error) {
      console.error(error);
    }
  }

  // API to live session details details for the selected coures
  async function getSessions(event) {
    setIsLoading(true);
    setShow(true);
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        eid: userDetails.eid,
        bpid: bpdata[event.target.value].bpid,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    try {
      //alert(JSON.stringify(bodyParam.body));
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.GET_SESSION,
        bodyParam
      );
      console.log(response);
      if (
        response === undefined ||
        response === null ||
        Object.keys(response).length === 0
      ) {
        setCourseData(null);
        setIsLoading(false);
      } else {
        setCourseData(response.sessions);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function renderDetails(event) {
    setBid(bpdata[event.target.value].bpid);
  }

  function totalCount(cours) {
    console.log("cours", cours);
    let newData = [];
    let score = 0;

    for (let i = 0; i < cours.length; i++) {
      console.log("courslength", cours[i]);

      if (cours[i]["regdate"] !== undefined) {
        newData.push(cours[i]);
        console.log("regdate is defined");
        console.log("newdata", newData);
        score = newData.length;
      }
    }
    console.log("score", score);
    return score;
  }
  console.log("coursedata", courseData);

  // Start of main return
  return (
    <div className={Attend.tabcontainer}>
      <div className={Attend.dropdownselect}>
        <div className={Attend.select}>
          <label for="course-select" className={Attend.label}>
            Select a Program
          </label>
          <select
            id="course-select"
            className={Attend.courseselect}
            onChange={(event) => {
              getSessions(event);
            }}
          >
            <option selected="selected" disabled>
              Select Program
            </option>
            {bpdata.map((value, index) => (
              <option value={index} key={"cour" + index}>
                {value.ptitle.substring(0, 40)}
                {value.ptitle.length > 40 ? "..." : null}
              </option>
            ))}
            ;
          </select>
        </div>
      </div>
      {show === true ? (
        isLoading === false ? (
          <div>
            <div className={Attend.totalcount}>
              <h3 className={Attend.count}>
                Total Live Sessions attended: {totalCount(courseData)}
              </h3>
            </div>
            <div className={Attend.tableholder}>
              <Table>
                <TableHead>
                  <TableRow style={header}>
                    <TableCell style={headercell}>Sl.No</TableCell>
                    <TableCell style={headercell}>Live Session Name</TableCell>
                    <TableCell style={headercell}>Live Session Date</TableCell>
                    <TableCell style={headercell}>Attendance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courseData === null || courseData.length === 0 ? (
                    <TableRow>
                      <TableCell style={allcell}></TableCell>
                      <TableCell style={allcell1}>
                        You have no Live sessions yet!
                      </TableCell>
                      <TableCell style={allcell2}></TableCell>
                      <TableCell style={allcell3}></TableCell>
                    </TableRow>
                  ) : (
                    courseData.map((value, idx) => (
                      <TableRow>
                        <TableCell style={allcell}>{idx + 1}</TableCell>
                        <TableCell style={allcell1}>{value.title}</TableCell>
                        <TableCell style={allcell2}>
                          {value.regdate === undefined
                            ? null
                            : moment(value.regdate).format("DD/MM/YYYY  ")}
                        </TableCell>
                        <TableCell style={allcell3}>
                          {value.regdate === undefined ? (
                            <Reject className={Attend.reject} />
                          ) : (
                            <DoneCircle className={Attend.tick} />
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <Skeleton height={500} width={"100%"} />
        )
      ) : null}
    </div>
  );
};

export default Attendance;
