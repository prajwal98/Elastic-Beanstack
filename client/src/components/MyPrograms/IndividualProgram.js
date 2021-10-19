import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Skeleton from "@material-ui/lab/Skeleton";
import { awsSignIn, authData, awsSignOut } from "../../redux/auth/authSlice";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import ProgressBar from "../../modules/ProgressBar/ProgressBar";
import config from "../../config/aws-exports";
import { Constants } from "../../config/constants";
import { API } from "aws-amplify";
import ClockGray from "../../assets/svgjs/ClockGray";

import SideNav from "../../modules/SideNav/SideNav";
import UserHeader from "../Header/UserHeader/UserHeader";

import i1 from "../../assets/images/i1.jpg";
import i2 from "../../assets/images/i2.jpg";
import { FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import IndProgStyle from "./IndividualProgram.module.scss";

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
    flexGrow: 1,
    marginTop: "20px"
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    width: "540px"
  },
}));

function IndividualProgram({ handleToggleSidebar }) {
  const [programJSON, setProgramJSON] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [course, setCourse] = useState([]);

  let navigate = useNavigate();

  let userDetails = useSelector(authData);
  console.log("user", userDetails)
  const dispatch = useDispatch();

  //alert(JSON.stringify(userDetails.curprg));
  useEffect(() => {
    breadcrumb();
    //getProgramsDetails();
    if (userDetails.curprg === undefined) {
      navigate("/dashboard");
    } else if (userDetails.curprg.scourses != undefined) {
      setCourse(userDetails.curprg.scourses);
    }
  }, []);

  function breadcrumb() {
    let sdata = { ...userDetails };
    let temp = [...sdata.breadcrumb];
    
    temp[1] = {
        name: sdata.curprg.ptitle ,
        path:'/MyPrograms/programs'
    };

    sdata.breadcrumb = temp;

    dispatch(awsSignIn(sdata));
}

  const classes = useStyles();
  var settingsAllPrograms = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    draggable: true,
  };

  function titleclick1(data) {
    let ldata = data;
    ldata.bcid = ldata.btid;
    let pdata = userDetails.curprg;
    let sdata = { ...userDetails };
    // for(let i = 0; i < pdata.length; i++){
    //   if(data.bpid == pdata[i].bpid){
    //     sdata.curprgcou = pdata[i];
    //   }
    // }
    sdata.curprgcou = { ...ldata };
    sdata.curprgcou.pid = pdata.pid;
    sdata.curprgcou.bpid = pdata.bpid;
    sdata.curprgcou.ptitle = pdata.ptitle;

    // alert(JSON.stringify(sdata));

    dispatch(awsSignIn(sdata));

    navigate("/course");
  }

  function titleclick(data) {
    let pdata = userDetails.curprg;
    let sdata = { ...userDetails };
    // for(let i = 0; i < pdata.length; i++){
    //   if(data.bpid == pdata[i].bpid){
    //     sdata.curprgcou = pdata[i];
    //   }
    // }
    sdata.curprgcou = { ...data };
    sdata.curprgcou.pid = pdata.pid;
    sdata.curprgcou.bpid = pdata.bpid;
    sdata.curprgcou.ptitle = pdata.ptitle;

    // alert(JSON.stringify(sdata.curprgcou));
    if(sdata.breadcrumb == undefined){
      sdata.breadcrumb = [];
      let temp = [...sdata.breadcrumb];
      temp[0] = {
          name:'My Programs',
          path:'/myPrograms'
      };
      temp[1] = {
          name:`${sdata.curprgcou.ptitle}`,
          path:'/MyPrograms/programs'
      };
      temp[2] = {
        name:`${sdata.curprgcou.ttitle}`,
        path:'/course'
    };
      sdata.breadcrumb = temp;
  }else{
      let temp = [...sdata.breadcrumb];
      temp[0] = {
          name:'My Programs',
          path:'/myPrograms'
      };
      temp[1] = {
          name:`${sdata.curprgcou.ptitle}`,
          path:'/MyPrograms/programs'
      };
      temp[2] = {
        name:`${sdata.curprgcou.ttitle}`,
        path:'/course'
    };
      sdata.breadcrumb = temp;
  }
    dispatch(awsSignIn(sdata));

    navigate("/course");
  }

  async function getProgramsDetails() {
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        bpid: userDetails.curprg.bpid,
        pid: userDetails.curprg.pid,
        // eid:userDetails.eid
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    try {
      let response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.GET_PROGRAM,
        bodyParam
        //`${Constants.GET_MY_PROGRAMS}`, bodyParam,
      );
      let sem = groupByKey(response.pcurriculum, "semester");
      let scourses = [];
      for (let [key, value] of Object.entries(sem)) {
        scourses.push(sem[key]);
      }
      response.scourses = scourses;
      console.log(response);
      setProgramJSON(response);
      setIsLoading(false);
    } catch (error) {
      console.log("getCategoryError", error);
    }
  }

  function groupByKey(array, key) {
    return array.reduce((hash, obj) => {
      if (obj[key] === undefined) return hash;
      return Object.assign(hash, {
        [obj[key]]: (hash[obj[key]] || []).concat(obj),
      });
    }, {});
  }
  console.log("course", course);

  function semesterView() {
    return (
      <div className="container" style={{ height: "100vh" }}>
        {course.map((Value, index, array) => {
          return (
            <div className={IndProgStyle.sliderholder}>
              <p
                className={IndProgStyle.programsHeader}
                style={{
                  fontWeight: "bolder",
                  fontSize: "large",
                  alignItems: "flex-start",
                  color: "black",
                }}
              >
                {userDetails.curprg.year_sem} {index + 1}
              </p>
              <Slider
                spacing={3}
                className={classes.root}
                {...settingsAllPrograms}
                style={{ width: "100%", marginTop: "20px" }}
              >
                {Value.map((Value, index, array) => {
                  return (
                    <div>
                      <div
                        onClick={() => {
                          titleclick(Value);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <Card
                          className={IndProgStyle.card}
                          style={{ cursor: "pointer", marginBottom: "10px" }}
                        >
                          <img
                            alt=""
                            className={IndProgStyle.imageCard}
                            src={`https://${config.DOMAIN
                              }/${config.aws_org_id.toLowerCase()}-resources/images/topic-images/${Value.tid
                              }.png`}
                          />
                          <div className={IndProgStyle.progressbar}>
                            <ProgressBar color="orange" percent={Value.per} />
                          </div>
                          <p style={styles.topicNameIndProg}>{Value.ttitle}</p>
                          <div>
                            <p style={{ marginTop: "80px" }}>
                              <span style={{ marginLeft: "10px" }}>
                                <ClockGray
                                  className={IndProgStyle.clock}
                                  cls1="cls1"
                                  cls2="cls2"
                                />
                              </span>
                              <span
                                style={{
                                  fontSize: "12px",
                                  color: "rgba(0, 0, 0, 0.6)",
                                  marginLeft: "-10px",
                                  marginBottom: "10px",
                                }}
                              >
                                {Value.tdur} weeks
                              </span>
                            </p>
                          </div>
                        </Card>
                      </div>
                    </div>
                  );
                })}
              </Slider>
              <br />
              <br />
              <br />
            </div>
          );
        })}
      </div>
    );
  }

  

  return (
    <div className={IndProgStyle.maincontainer}>
      <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
        <FaBars />
      </div>
      <UserHeader Bindex={1}/>
      <div className={IndProgStyle.divholder}>
        {isLoading ? (
          <div>
            <Skeleton />{" "}
          </div>
        ) : (
          semesterView()
        )}
      </div>
    </div>
  );
}
export default IndividualProgram;

let styles = {
  topicNameIndProg: {
    marginTop: "15px ",
    fontSize: "15px ",
    float: "left ",
    marginLeft: "20px ",
    fontWeight: "bold ",
    color: config.main_color_1,
    marginRight: "20px",
  },
};
