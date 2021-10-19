import React, { useState, useEffect } from "react";
import { API, Auth } from "aws-amplify";
import { useSelector, useDispatch } from "react-redux";
import { awsSignIn, authData, awsSignOut } from "../../redux/auth/authSlice";
import { Constants } from "../../config/constants";
import config from "../../config/aws-exports";
import SideNav from "../../modules/SideNav/SideNav";
import UserHeader from "../Header/UserHeader/UserHeader";
import Button from "@material-ui/core/Button";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Skeleton from "@material-ui/lab/Skeleton";
import Typography from "@material-ui/core/Typography";
import { useNavigate } from "react-router-dom";
import {
  Inject,
  ScheduleComponent,
  Day,
  Month,
  Week,
  WorkWeek,
  EventSettingsModel,
} from "@syncfusion/ej2-react-schedule";

import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-calendars/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-dropdowns/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-lists/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-navigations/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-popups/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-react-schedule/styles/material.css";

import "./Events.scss";
import EventStyle from "./Events.module.scss";
import image from "./Events 1.png";
import { FaBars } from "react-icons/fa";
import { Navigate } from "react-router";
import swal from "@sweetalert/with-react";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "start",
    color: theme.palette.text.secondary,
  },
  paperEvents: {
    padding: theme.spacing(2),
    textAlign: "start",
    color: theme.palette.text.secondary,
    overflow: "auto",
    height: "83 %",
  },
}));

const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.date.setMonth(toolbar.date.getMonth() - 1);
    toolbar.onNavigate("prev");
  };

  const goToNext = () => {
    toolbar.date.setMonth(toolbar.date.getMonth() + 1);
    toolbar.onNavigate("next");
  };

  const goToCurrent = () => {
    const now = new Date();
    toolbar.date.setMonth(now.getMonth());
    toolbar.date.setYear(now.getFullYear());
    toolbar.onNavigate("current");
  };

  const label = () => {
    const date = moment(toolbar.date);
    return (
      <span>
        <b>{date.format("MMMM")}</b>
        <span> {date.format("YYYY")}</span>
      </span>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", width: "100%" }}>
        <Button onClick={goToBack}>&#8249;</Button>
        <Button onClick={goToCurrent}>today</Button>
        <Button onClick={goToNext}>&#8250;</Button>
        <label className={EventStyle.monthLabel}>{label()}</label>
      </div>
    </div>
  );
};
const localizer = momentLocalizer(moment);
moment.locale("en-GB");

const Event = ({ handleToggleSidebar }) => {
  const [events, setevents] = useState([]);
  const [upEvents, setupEvents] = useState([]);
  const userDetails = useSelector(authData);
  const [allEvents, setAllEvents] = useState([]);
  const [upcomingEve, setUpcomingEve] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  let navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    upcoming();
    getEvents();
    return () => {};
  }, []);

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

      //alert(JSON.stringify(response))
      setAllEvents(response.result.events);
      setIsLoading(false);
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
          amount: data[i].amount,
          payment: data[i].payment,
          description: data[i].description,
          duration: data[i].duration,
          eid: data[i].eid,
          type: data[i].type,
          bpid: data[i].bpid,
          cbyid: data[i].cbyid,
          month: m[month],
          day: yyyy,
        };
        temp.push(obj);
      }
    }

    setupEvents(temp);

    let cal = [];

    for (let i = 0; i < data.length; i++) {
      let res = new Date(data[i].start);

      let dd = res.getDate();
      let mm = res.getMonth() + 1;
      let yyyy = res.getFullYear();

      let obj = {
        title: data[i].title,
        start: data[i].start,
        eid: data[i].eid,
        description: data[i].description,
        link: data[i].link,
        bpid: data[i].bpid,
        type: data[i].type,
        amount: data[i].amount,
        payment: data[i].payment,
        duration: data[i].duration,
        cbyid: data[i].cbyid,
        passcode: data[i].passcode,
        webid: data[i].webid,
        //description: 'Summer vacation planned for outstation.',
        startTime: new Date(data[i].start),
        endTime: new Date(data[i].start),
      };

      cal.push(obj);
    }

    setevents(cal);
  }

  function toTimestamp(a) {
    var datum = Date.parse(a);
    return datum / 1;
  }

  let empty = [];

  function upcoming() {
    let upeve = allEvents;
    let a;
    for (let i = 0; i < upeve.length; i++) {
      a = upeve[i].start;
      upeve[i].start = toTimestamp(a);
    }
    setUpcomingEve(upeve);
  }
  const handleNavigate = (obj) => {
    let sdata = { ...userDetails };
    sdata.cursession = obj;
    if (sdata.breadcrumb == undefined) {
      sdata.breadcrumb = [];
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
  const classes = useStyles();

  let fields = {
    subject: { name: "title", default: "Event" },
    // description: { name: 'link' },
    url: { name: "link" },
    startTime: { name: "startTime" },
    endTime: { name: "endTime" },
  };
  function EventOpen(args) {
    args.cancel = true;
    swal({
      buttons: {
        cancel: {
          text: "Close",
          value: null,
          visible: true,
          className: "livesession__btn btn-color-c btn-size-1 btn-hov-c",
          closeModal: true,
        },
        confirm: {
          text: "Next",
          value: true,
          visible: true,
          className: `livesession__btn btn-color-cf btn-size-2 btn-hov-cf ${
            args.event.type == "livesession" ? "" : "hideconfirm"
          }`,
          closeModal: true,
        },
      },
      closeOnClickOutside: false,
      content: (
        <div style={{ textAlign: "left" }}>
          <h2 style={{ textAlign: "justify", marginBottom: "2rem" }}>
            {args.event.title}
          </h2>
          <h3>
            Date & Time: {moment(args.event.start).format("DD-MM-YYYY hh:mm a")}
          </h3>
          <p style={{ textAlign: "justify" }}>{args.event.description}</p>
          <a href={args.event.link} target="_blank" rel="noreferrer">
            {args.event.type !== "livesession" ? args.event.link : ""}
          </a>
        </div>
      ),
    }).then((willDelete) => {
      if (willDelete) {
        handleNavigate(args.event);
      } else {
        // swal("Your imaginary file is safe!");
      }
    });
  }

  return (
    <div className={EventStyle.maincontainer}>
      <UserHeader />
      <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
        <FaBars />
      </div>

      <div style={{ padding: 0, margin: 0 }}>
        <div className={classes.root}>
          <Grid container spacing={5} style={{ paddingTop: 0, marginTop: 0 }}>
            <Grid item xs={7}>
              <p className={EventStyle.titleStyle}>All Events</p>
              <Paper className={classes.paper}>
                <ScheduleComponent
                  currentView="Month"
                  width="100%"
                  readonly={true}
                  eventClick={(e) => EventOpen(e)}
                  //timeScale={{ enable: false}}
                  eventSettings={{
                    dataSource: events,
                    fields: fields,
                    enableTooltip: true,
                  }}
                >
                  <Inject services={[Month, Day, Week, WorkWeek]} />
                </ScheduleComponent>
              </Paper>
            </Grid>

            <Grid item xs={5}>
              <p
                style={{ marginLeft: "-0px" }}
                className={EventStyle.titleStyle}
              >
                Upcoming Events
              </p>
              <Paper className={classes.paperEvents}>
                {upEvents.length === 0 ? (
                  <p style={{ fontSize: "16px", textAlign: "center" }}>
                    {" "}
                    No Upcoming Events
                  </p>
                ) : (
                  upEvents.map((event) => (
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
                        <div className={EventStyle.iconTop}>
                          {moment(event.start).format("ddd")}
                        </div>
                        <div className={EventStyle.iconBottom}>
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
                      <hr className={EventStyle.eventsDivider} />
                    </div>
                  ))
                )}
              </Paper>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};
export default Event;
