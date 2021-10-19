import {
  Backdrop,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Slide,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import ClockOrange from "../../assets/svgjs/ClockOrange";
import Rupee from "../../assets/svgjs/Rupee";
import { awsSignIn, authData } from "../../redux/auth/authSlice";
import UserHeader from "../Header/UserHeader/UserHeader";
import progIbfo from "./LiveSession.module.scss";
import config from "../../config/aws-exports";
import EventsIcon from "../../assets/svgjs/EventsIcon";
import { Constants } from "../../config/constants";
import { API } from "aws-amplify";
import { produce } from "immer";
import swal from "sweetalert";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Close } from "@material-ui/icons";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const initialValidation = {
  error1: false,
  error2: false,
  error3: false,
};

const useStyles = makeStyles((theme) => ({
  backdrop: { zIndex: theme.zIndex.drawer + 1, color: "#fff" },
}));
const getRazorPayment = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    document.body.appendChild(script);
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
  });
};
export default function LiveSession({ handleToggleSidebar }) {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [backdrop, setBackdrop] = useState(true);
  const userDetails = useSelector(authData);
  const [open, setOpen] = React.useState(false);
  const [gray, setGray] = useState(true);
  const [liveSessionCompleted, setLiveSessionCompleted] = useState(false);
  const [spin, setSpin] = useState(false);
  const [registerfields, setRegisterFields] = useState({});
  const [regerror, setRegError] = useState(initialValidation);
  const [join, setJoin] = useState(false);
  const [meetingopen, setMeetingOpen] = useState(false);
  const navigate = useNavigate();
  const [payment, setPay] = useState(false);
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };
  useEffect(() => {
    breadcrumb();
    getusersessions();
    return () => {};
  }, []);

  function breadcrumb() {
    let sdata = { ...userDetails };
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
    dispatch(awsSignIn(sdata));
  }

  const handleRegister = async () => {
    setSpin(true);
    let { cursession } = { ...userDetails };
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        eid: cursession.eid,
        start: cursession.start,
        userid: userDetails.eid,
        title: cursession.title,
        bpid: cursession.bpid,
        cbyid: cursession.cbyid,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    try {
      console.log(JSON.stringify(bodyParam.body));
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.REG_USER,
        bodyParam
      );
      setSpin(false);
      swal({
        title: "Success",
        text: "User Registered successfully",
        icon: "success",
        dangerMode: false,
      }).then((willDelete) => {
        if (willDelete) {
          window.location.reload();
          handleClose();
        }
      });
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleJoin = (cursession) => {
    let details = { ...userDetails };
    setMeetingOpen(true);
    if (cursession.link != undefined) {
      dispatch(awsSignIn(details));
      // navigate("/livemeeting");
    }
  };

  const getusersessions = async () => {
    setBackdrop(true);
    let { cursession } = { ...userDetails };
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        eid: userDetails.eid,
        bpid: cursession.bpid,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.GET_SESSION,
        bodyParam
      );

      let sessions = response.sessions;
      let curtime = response.curtime;
      let filteredsession = sessions.filter(
        (session) => session.eid == cursession.eid
      );
    
      let timeDuration = moment(cursession.start)
        .add(cursession.duration, "m")
        .toDate();
      let before10Min = moment(cursession.start).subtract(10, "m").toDate();
      let JoinTime = moment(curtime).toDate();

      console.log(before10Min);
      if (filteredsession.length != 0) {
        
        if (curtime > timeDuration.getTime()) {
          setLiveSessionCompleted(true);
        }
        if (
          cursession.payment != undefined &&
          cursession.payment != "free" &&
          filteredsession[0].paid != true
        ) {
          setPay(true);
        } else {
          
          setJoin(true);
          console.log(
            JoinTime.getTime() >= before10Min.getTime() &&
              JoinTime.getTime() <= cursession.start
          );

          if (
            JoinTime.getTime() <= timeDuration.getTime() &&
            JoinTime.getTime() >= cursession.start
          ) {
            setGray(false);
          } else {
            if (
              JoinTime.getTime() >= before10Min.getTime() &&
              JoinTime.getTime() <= cursession.start
            ) {
              setGray(false);
            } else {
              setGray(true);
            }
          }
          setPay(false);
        }
      } else {
        setJoin(false);
        setPay(false);
      }
      setIsLoading(false);
      setBackdrop(false);
    } catch (error) {
      console.error(error);
    }
  };
  const updatePaymentStatus = async (payid) => {
    let { cursession } = { ...userDetails };
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        eid: cursession.eid,
        payid: payid,
        userid: userDetails.eid,
        bpid: cursession.bpid,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    try {
      console.log(JSON.stringify(bodyParam));
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.UPDATE_PAYMENT_STATUS,
        bodyParam
      );
      window.location.reload();
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  const handlePayment = async (cursession) => {
    const response = await getRazorPayment(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!response) {
      console.log("error");
      return;
    }
    var options = {
      key: "rzp_test_RVamYi3E1ZD5lQ", // Enter the Key ID generated from the Dashboard
      amount: cursession.amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Enhanzed",
      description: "Test Transaction",
      image: `https://${
        config.DOMAIN
      }/${config.aws_org_id.toLocaleLowerCase()}-resources/images/org-images/logo-dark.jpg`,

      handler: function (response) {
        if (response) {
          updatePaymentStatus(response.razorpay_payment_id);
        }
      },
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: "",
      },
      notes: {
        address: "Enahnzed Education pvt. ltd.",
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.open();
  };
  return (
    <div className={progIbfo.containermain}>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        onBackdropClick="false"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ marginLeft: "3rem" }}>Please fill in your details</h2>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </div>

        <DialogContent>
          <DialogContentText>
            <table className={progIbfo.containLivesSession}>
              <tr>
                <td>
                  <h3>Name</h3>
                  <span>*</span>
                </td>
                <td>
                  <div>
                    <input
                      disabled
                      type="text"
                      value={userDetails.name}
                      className={progIbfo.inputLiveSession}
                    />
                  </div>
                  {regerror.error1 && (
                    <p className={progIbfo.firstViewValidation}>
                      Name cannot be empty
                    </p>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <h3>Email</h3>
                  <span>*</span>
                </td>
                <td>
                  <div>
                    <input
                      value={userDetails.email}
                      disabled
                      type="email"
                      className={progIbfo.inputLiveSession}
                    />
                  </div>
                  {regerror.error2 && (
                    <p className={progIbfo.firstViewValidation}>
                      Email cannot be empty
                    </p>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <h3>Ph. No.</h3>
                </td>
                <td>
                  <div>
                    <input
                      onChange={(e) => {
                        const re = /^[0-9\b]+$/;
                        if (e.target.value === "" || re.test(e.target.value)) {
                          setRegisterFields((currState) =>
                            produce(currState, (v) => {
                              v.phno = e.target.value;
                            })
                          );
                        }
                      }}
                      type="text"
                      maxLength="10"
                      value={registerfields.phno}
                      className={progIbfo.inputLiveSession}
                    />
                  </div>
                  {regerror.error3 && (
                    <p className={progIbfo.firstViewValidation}>
                      Phone number cannot be empty
                    </p>
                  )}
                </td>
              </tr>
            </table>
          </DialogContentText>
        </DialogContent>
        <DialogActions
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            style={{
              fontSize: "15px",
              fontWeight: "bold",
              borderRadius: "5px",
              maxWidth: "150px",
              height: "35px",
              padding: "0 15px",
            }}
            className={progIbfo.btn_colorLiveSession}
            onClick={handleRegister}
            disabled={spin}
          >
            {spin ? "Loading..." : "Next"}
          </button>
        </DialogActions>
      </Dialog>
      <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
        <FaBars />
      </div>
      <UserHeader Bindex={1} />
      <div className={progIbfo.overview}>
        <div>
          <Typography component="div" key="h2" variant="h2">
            {isLoading ? (
              <Skeleton />
            ) : (
              <h2 style={{ textTransform: "capitalize" }}>
                {userDetails.cursession.title}
              </h2>
            )}
          </Typography>
        </div>

        <div>
          <div className={progIbfo.overview__card}>
            <div
              className={progIbfo.overview__cardContent}
              style={{ display: "grid", placeItems: "center" }}
            >
              <div className={progIbfo.content} style={{ width: "70%" }}>
                <div className={progIbfo.content__details}>
                  <div className={progIbfo.align_self}></div>
                  <div className={progIbfo.items}>
                    <div
                      style={{
                        width: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <strong style={{ width: "150px" }}>
                        <span>
                          <EventsIcon className={progIbfo.EventFill} />
                        </span>
                        {isLoading ? (
                          <Skeleton />
                        ) : (
                          <span style={{ marginLeft: "1rem" }}>
                            {moment(userDetails.cursession.start).format(
                              "DD-MM-YYYY"
                            )}
                          </span>
                        )}
                      </strong>
                    </div>
                    <div
                      style={{
                        width: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        marginLeft: "50%",
                        gap: "10px",
                        minWidth: "150px",
                      }}
                    >
                      <span>
                        <ClockOrange
                          className={progIbfo.clock_size}
                          cls1={progIbfo.cls_1}
                          cls2={progIbfo.cls_2}
                        />
                      </span>
                      <strong>
                        {isLoading ? (
                          <Skeleton />
                        ) : (
                          moment(userDetails.cursession.start).format("hh:mm a")
                        )}
                      </strong>
                    </div>
                  </div>
                  <div className={progIbfo.items}>
                    <div
                      style={{
                        width: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        minWidth: "150px",
                      }}
                    >
                      <strong>
                        <span>
                          <Rupee
                            className={{
                              size: progIbfo.rupee_size,
                              fill: "#0f80a4",
                            }}
                          />
                        </span>{" "}
                        {isLoading ? (
                          <Skeleton />
                        ) : userDetails.cursession.payment == "free" ? (
                          "Free"
                        ) : (
                          <>
                            {userDetails.cursession.payment == "free"
                              ? "Free"
                              : `${userDetails.cursession.amount + "/-"}`}
                          </>
                        )}
                      </strong>
                    </div>
                    <div
                      style={{
                        width: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        marginLeft: "50%",
                        gap: "10px",
                        minWidth: "150px",
                      }}
                    >
                      Duration:
                      <strong>
                        {isLoading ? (
                          <Skeleton />
                        ) : (
                          userDetails.cursession.duration + " min"
                        )}
                      </strong>
                    </div>
                  </div>
                  <div className={progIbfo.align_self}>
                    {isLoading ? (
                      <Skeleton />
                    ) : userDetails.role == "Instructors" ||
                      userDetails.role == "Coordinators" ? null : (
                      <>
                        {!liveSessionCompleted && (
                          <>
                            {join ? (
                              <>
                                {gray ? (
                                  <button
                                    className={`${progIbfo.btn_color}`}
                                    disabled
                                    // onClick={() => handleJoin(userDetails.cursession)}
                                  >
                                    Join
                                  </button>
                                ) : (
                                  <a
                                    className={`${progIbfo.btn_color}`}
                                    href={
                                      userDetails.cursession.link
                                        ? userDetails.cursession.link
                                        : "#"
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    // onClick={() => handleJoin(userDetails.cursession)}
                                  >
                                    Join
                                  </a>
                                )}
                              </>
                            ) : (
                              <div>
                                {!payment ? (
                                  <button
                                    className={progIbfo.btn_color}
                                    onClick={handleClickOpen}
                                  >
                                    Register
                                  </button>
                                ) : (
                                  <button
                                    className={progIbfo.btn_color}
                                    onClick={() =>
                                      handlePayment(userDetails.cursession)
                                    }
                                  >
                                    Pay
                                  </button>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </>
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
                  src={`https://${
                    config.aws_content_delivery_cloudfront_domain
                  }/${config.aws_org_id.toLowerCase()}-resources/images/program-images/${userDetails.cursession.bpid.substring(
                    0,
                    3
                  )}.png`}
                  alt=""
                />
              </div>
            )}
          </div>
          <div style={{ marginTop: "3rem" }}>
            <h2>Overview</h2>
            <p
              style={{
                marginTop: "2rem",
                textAlign: "justify",
                fontSize: "15px",
              }}
            >
              {userDetails.cursession.description}
            </p>
          </div>
        </div>
      </div>
      <Backdrop
        sx={{ color: "#fff" }}
        open={backdrop}
        className={classes.backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
