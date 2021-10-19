import React from "react";
import styles from "./ProgramCard.module.scss";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { awsSignIn, authData } from "../../redux/auth/authSlice";
import ProgressBar from "../ProgressBar/ProgressBar";
import Info from "../../assets/svgjs/Info";
import Syllabus from "../../assets/svgjs/Syllabus";
import Announcements from "../../assets/svgjs/Announcements";
import AcademicSchedule from "../../assets/svgjs/AcademicSchedule";
import { Constants } from "../../config/constants";
import config from "../../config/aws-exports";
import { blue } from "@material-ui/core/colors";

const ProgramCard = ({ Value }) => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  let userDetails = useSelector(authData);

  function titleclick() {
    let pdata = userDetails.data.bpdata;
    let sdata = { ...userDetails };
    for (let i = 0; i < pdata.length; i++) {
      if (Value.bpid == pdata[i].bpid) {
        sdata.curprg = pdata[i];
      }
    }
    // dispatch(awsSignIn(sdata));
    // navigate("/MyPrograms/programs");
    breadClick(sdata,"/MyPrograms/programs",Value.ptitle);
  }



  function seta(a) {
    let sdata = { ...userDetails };
    sdata.pgcdactive = {
      a: a,
      pid: Value.pid,
      bpid: Value.bpid,
    };
    // dispatch(awsSignIn(sdata));
    breadClick(sdata,"/myPrograms/programinfo", "Program Info");

    // navigate("/myPrograms/programinfo");
  }

  function breadClick(sdata,navnext, title){
    if(sdata.breadcrumb == undefined){
      sdata.breadcrumb = [];
      let temp = [...sdata.breadcrumb];
      temp[0] = {
          name:'My Programs',
          path:'/myPrograms'
      };
      temp[1] = {
          name: title,
          path: navnext
      };
      sdata.breadcrumb = temp;
  }else{
      let temp = [...sdata.breadcrumb];
      temp[0] = {
          name:'My Programs',
          path:'/myPrograms'
      };
      temp[1] = {
          name: title,
          path: navnext
      };
      sdata.breadcrumb = temp;
  }

  dispatch(awsSignIn(sdata));
if(navnext == "/MyPrograms/programs"){
  navigate(navnext);
}
  
  }

  return (
    <div className={styles.maincontainer}>
      <div className={styles.program}>
        <div
          onClick={titleclick}
          className={styles.program__img}
          style={{
            cursor: "pointer",
            backgroundImage: `url('https://${config.DOMAIN
              }/${config.aws_org_id.toLowerCase()}-resources/images/program-images/${Value.pid
              }.png')`,
          }}
        ></div>
        <div className={styles.program__details}>
          <div
            className={styles.h1}
            style={{ marginBottom: "14px", paddingLeft: "20px" }}
          >
            <h1
              onClick={titleclick}
              style={{ color: "blue", cursor: "pointer", fontSize: "20px" }}
            >
              <strong style={{ color: config.main_color_1 }}>
                {Value.ptitle}
              </strong>
            </h1>
          </div>
          <div className={styles.program_info__container}>
            <div className={styles.program_info}>
              <div className={styles.individual_info}>
                <Link
                  to="/myPrograms/programinfo"
                  onClick={() => {
                    seta(0);
                  }}
                >
                  <span>
                    <Info
                      className={styles.icon_size}
                      cls1={styles.info_cls_1}
                      cls2={styles.info_cls_2}
                    />
                  </span>
                  <span
                    style={{ fontSize: "15px", color: config.main_color_1 }}
                  >
                    {" "}
                    Program info
                  </span>
                </Link>
                <Link
                  to="/myPrograms/programinfo"
                  style={{ paddingRight: "7.4rem" }}
                  onClick={() => {
                    seta(2);
                  }}
                >
                  <span>
                    <Syllabus
                      className={styles.icon_size}
                      cls1={styles.Syb_cls_1}
                    />
                  </span>
                  <span
                    style={{
                      fontSize: "15px",
                      marginLeft: "0px",
                      color: config.main_color_1,
                    }}
                  >
                    {" "}
                    Syllabus
                  </span>
                </Link>
              </div>
              <div className={styles.individual_info}>
                <Link
                  to="/myPrograms/programinfo"
                  onClick={() => {
                    seta(3);
                  }}
                >
                  <span>
                    <Announcements
                      className={styles.icon_size}
                      cls1={styles.Ans_cls_1}
                    />
                  </span>
                  <span
                    style={{ fontSize: "15px", color: config.main_color_1 }}
                  >
                    {" "}
                    Announcements
                  </span>
                </Link>
                <Link
                  to="/myPrograms/programinfo"
                  onClick={() => {
                    seta(4);
                  }}
                >
                  <span>
                    <AcademicSchedule
                      className={styles.icon_size}
                      cls1={styles.AS_cls_1}
                      cls2={styles.AS_cls_2}
                      cls3={styles.AS_cls_3}
                      cls4={styles.AS_cls_4}
                    />
                  </span>
                  <span
                    style={{ fontSize: "15px", color: config.main_color_1 }}
                  >
                    Academic schedule
                  </span>
                </Link>
              </div>
            </div>
            <div className={styles.time_info}>
              <p style={{ fontSize: "15px" }}>Duration: {Value.pdur}</p>
              <p style={{ fontSize: "15px" }}>
                Start date:{" "}
                {Value.sd == !undefined
                  ? Value.sd.toString().length === 10
                    ? moment(Value.sd * 1000).format("DD MMM YYYY")
                    : moment(Value.sd).format("DD MMM YYYY")
                  : null}{" "}
              </p>
            </div>
          </div>
          <div className={styles.width}>
            <ProgressBar color="orange" percent={Value.per ?? 0} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
