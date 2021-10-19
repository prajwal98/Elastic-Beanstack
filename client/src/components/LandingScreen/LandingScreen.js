import React, { useEffect, useRef, useState } from "react";
import { API, Auth } from "aws-amplify";
import Cryptr from "cryptr";
import { awsSignIn, authData } from "../../redux/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { Constants } from "../../config/constants";
import logo from "../../assets/images/logo.jpg";
import io from "socket.io-client";

import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment,
} from "semantic-ui-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import swal from "sweetalert";
import img1 from "../../assets/images/1img.png";
import img2 from "../../assets/images/2img.png";
import img3 from "../../assets/images/3img.png";
import img4 from "../../assets/images/4img.png";
import img5 from "../../assets/images/5img.png";
import i1 from "../../assets/images/i1.jpg";
import i2 from "../../assets/images/i2.jpg";
import i3 from "../../assets/images/i3.png";
import i4 from "../../assets/images/i4.jpg";
import landingStyle from "./landingScreen.module.scss";
import config from "../../config/aws-exports";
import AppHeader from "../Header/AppHeader";
import Footer from "../Footer/Footer";
import { makeStyles } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { CircularProgress } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import ClockGray from "../../assets/svgjs/ClockGray";
import EmailIcon from "../../assets/svgjs/email";
import Password from "../../assets/svgjs/password";
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
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
    "& .MuiInputBase-input": {
      fontSize: "medium ",
      paddingLeft: "34px",
    },
  },

  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    border: "none",
    transform: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
    textBox: {
      "& .MuiInputBase-input": {
        fontSize: "medium ",
        paddingLeft: "34px",
      },
    },
  },

  paper: {
    backgroundColor: "white",

    height: "auto",
    width: "600px",
    borderRadius: "4px",
    border: "none",
    padding: theme.spacing(2, 4, 3),
  },
  SignInPaper: {
    backgroundColor: theme.palette.background.paper,

    height: "auto",
    width: "600px",
    borderRadius: "4px",
    border: "none",
    padding: theme.spacing(2, 4, 3),
  },
  forgotPasswordPaper: {
    backgroundColor: theme.palette.background.paper,

    height: "auto",
    width: "600px",
    borderRadius: "4px",
    border: "none",
    padding: theme.spacing(2, 4, 3),
  },
  ResetPasswordPaper: {
    backgroundColor: theme.palette.background.paper,

    height: "auto",
    width: "600px",
    borderRadius: "4px",
    border: "none",
    padding: theme.spacing(2, 4, 3),
  },
}));
let socket;

function LandingScreen(props) {
  const [pageData, setPageData] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTextIssue, setEmailTextIssue] = useState("");
  const [passTextIssue, setPassTextIssue] = useState("");
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [cognitoErrorUsername, setcognitoErrorUsername] = useState("");
  const [cognitoErrorPassword, setcognitoErrorPassword] = useState("");
  let navigate = useNavigate();
  const emailInput = useRef();
  const passwordInput = useRef();
  const clearEmail = () => emailInput.current.clear();
  const [isLoading, setIsLoading] = useState(true);

  //register
  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regCognitoErrorUsername, setRegCognitoErrorUsername] = useState("");
  const [regCognitoErrorPassword, setRegCognitoErrorPassword] = useState("");
  const [regEmailTextIssue, setRegEmailTextIssue] = useState("");
  const [regNameTextIssue, setRegNameTextIssue] = useState("");
  const [regPassTextIssue, setRegPassTextIssue] = useState("");
  const [regConfirmpassTextIssue, setRegConfrimPassTextIssue] = useState("");

  //forgot password
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordEmailTextIssue, setForgotPasswordEmailTextIssue] =
    useState("");
  const [
    forgotPasswordCognitoErrorUsername,
    setForgotPasswordCognitoErrorUsername,
  ] = useState("");

  //Reset password
  const [verificationCode, setVerificationCode] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [confirmResetPassword, setConfirmResetPassword] = useState("");
  const [resetPassVerificationCode, setResetPassVerificationCode] =
    useState("");
  const [resetPasswordCodeIssue, setResetPasswordCodeIssue] = useState("");
  const [resetPasswordMatch, setResetPasswordMatch] = useState("");
  socket = io();
  // admin reg

  const [resetPasswordFirst, setResetPasswordFirst] = useState("");
  const [confirmResetPasswordFirst, setConfirmResetPasswordFirst] =
    useState("");
  const [resetPassVerificationCodeFirst, setResetPassVerificationCodeFirst] =
    useState("");
  const [resetPasswordCodeIssueFirst, setResetPasswordCodeIssueFirst] =
    useState("");
  const [resetPasswordMatchFirst, setResetPasswordMatchFirst] = useState("");

  const cryptr = new Cryptr("myTotalySecretKey");
  const classes = useStyles();
  // let navigate = useNavigate();
  const dispatch = useDispatch();
  let userDetails = useSelector(authData);
  useEffect(() => {
    socket = io();
    socket.on("hello", (message) => {
      console.log(message);
    });
  }, []);

  const [categories, setCategories] = useState([]);
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    adaptiveHeight: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    appendDots: (dots) => (
      <div
        style={{
          backgroundColor: "transparent",
          borderRadius: "10px",
          padding: "10px",
        }}
      >
        <ul style={{ marginBottom: "5%", background: "transparent" }}>
          {" "}
          {dots}{" "}
        </ul>
      </div>
    ),
  };

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "red" }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "green" }}
        onClick={onClick}
      />
    );
  }

  var settingsAllPrograms = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    draggable: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };
  //Api method to fetch All programs

  useEffect(() => {
    fetchCategories();
    getpageData();
  }, []);
  async function fetchCategories() {
    const bodyParam = {
      body: { oid: config.aws_org_id, action: 1 },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        "/getPrograms",
        bodyParam
        //`${Constants.GET_MY_PROGRAMS}`, bodyParam,
      );
      let categoriesJSON = response;
      if (categoriesJSON != null) {
        setCategories(categoriesJSON);
        setIsLoading(false);
        console.log("api in landing", response);
        categoriesJSON = JSON.parse(categoriesJSON);
      }
    } catch (error) {
      console.log("getCategoryError", error);
    }
  }

  async function getpageData() {
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.GET_PAGEDATA,
        bodyParam
      );
      const dataJSON = response;

      console.log(dataJSON);
      setPageData(dataJSON.slide);
    } catch (error) {
      console.log("Error", error);
    }
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block" }}
        onClick={onClick}
      />
    );
  }
  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block" }}
        onClick={onClick}
      />
    );
  }
  function LoginButton() {}

  const openLogin = () => {
    setOpen(true);
    setSignInOpen(false);
  };

  const openSignIn = () => {
    setSignInOpen(true);
    setOpen(false);
  };

  const forgotPasswordSwap = () => {
    setForgotPasswordOpen(true);
    setOpen(false);
    setEmail("");
    setPassword("");
    setEmailTextIssue("");
    setPassTextIssue("");
  };

  const resetPasswordOpenFunction = () => {
    setResetPasswordOpen(true);
    setOpen(false);
  };

  const emailOnKeyPress = () => {};
  const passwordOnKeyPress = () => {};

  function LoginModal() {
    useEffect(() => {
      setEmailTextIssue(cognitoErrorUsername);
      setPassTextIssue(cognitoErrorPassword);
    }, [cognitoErrorUsername, cognitoErrorPassword]);

    const handleOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setEmail("");
      setPassword("");
      setEmailTextIssue("");
      setPassTextIssue("");
      setOpen(false);
    };

    async function onClickLogin(event) {
      try {
        setLoading(true);
        const user = await Auth.signIn(email, password);
        console.log("user ", user);

        const info = await Auth.currentUserInfo();
        let userdata = user.attributes;
        userdata.eid = user.username;
        userdata.id = info.id;
        setUser(JSON.stringify(userdata));
        userdata.sideactive = "/dashboard";

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
          //alert("HIb "+JSON.stringify(response));
          userdata.data = response;
          //let encryptedString = cryptr.encrypt(JSON.stringify(userDetails));
          //dispatch(awsSignIn(userdata));
          //getEvents(UserProgressDetailsJSON);
          dispatch(awsSignIn(userdata));
          localStorage.setItem("sessionStore", false);
          navigate("/dashboard");
        } catch (error) {
          //alert(JSON.stringify(error))
          console.error(error);
          dispatch(awsSignIn(userdata));
          localStorage.setItem("sessionStore", false);
          navigate("/dashboard");
        }
        //let encryptedString = cryptr.encrypt(JSON.stringify(userdata));
        // dispatch(awsSignIn(userdata));

        // navigate('/dashboard');
      } catch (error) {
        setLoading(false);
        if (error.code === "UserNotFoundException") {
          setcognitoErrorUsername("User does not exist");
        } else if (error.code === "UserNotConfirmedException") {
          setcognitoErrorUsername("User Not Confirmed");
        } else {
          setcognitoErrorUsername("");
        }
        if (error.code === "NotAuthorizedException") {
          setcognitoErrorPassword("Invalid Password");
        } else {
          setcognitoErrorPassword("");
        }
        if (error.message) {
          setcognitoErrorPassword(error.message);
        }
      }
    }
    function setPasswordFocus(event) {
      if (event.key === "Tab") {
        clearEmail();
        passwordInput.current.focus();
      }
    }

    function validateEmail() {
      /* let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; */
      if (email === "" /* || re.test(email) */) {
        setEmailTextIssue("Please enter a valid email");
      } else {
        setEmailTextIssue("");
      }
    }

    function validatePass() {
      if (password === "") {
        setPassTextIssue("Please enter a password");
      } else {
        setPassTextIssue("");
      }
    }
    function getLoggedIn() {
      if (password !== "" && email !== "") {
        onClickLogin();
      }
    }

    function passwordClick(event) {
      if (event.key === "Enter") {
        validateEmail();
        validatePass();
        getLoggedIn();
      }
    }

    function loginClick() {
      validateEmail();
      validatePass();
      getLoggedIn();
    }
    function resetEmailPassIssueText(type) {
      if (type === 0) {
        setEmailTextIssue("");
      } else {
        setPassTextIssue("");
      }
    }

    return (
      <>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              {loading && (
                <CircularProgress className={landingStyle.spinnerStyle} />
              )}
              <span
                style={{
                  float: "right",
                  cursor: "pointer",
                  fontSize: "large",
                  fontWeight: "bold",
                }}
                onClick={() => {
                  handleClose();
                }}
              >
                x
              </span>
              <Image
                size="small"
                src={`https://${
                  config.DOMAIN
                }/${config.aws_org_id.toLowerCase()}-resources/images/org-images/logo-dark.jpg`}
                style={{
                  marginLeft: "170px",
                  height: "auto",
                  marginBottom: "30px",
                  width: "200px",
                }}
              />
              <p
                style={{
                  marginLeft: "180px",
                  fontWeight: "bold",
                  fontSize: "18px",
                  marginTop: "-20px",
                  color: "rgba(0, 0, 0, 0.6)",
                }}
              >
                Login to your account
              </p>
              <form className={classes.root} Validate autoComplete="off">
                <label
                  style={{ marginLeft: "85px", marginBottom: "-20px" }}
                  className={landingStyle.labelForIssue}
                >
                  {emailTextIssue}
                </label>
                <br />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <EmailIcon className={landingStyle.emailIc} />
                  <TextField
                    style={{
                      width: "360px",
                    }}
                    className={classes.textBox}
                    type="text"
                    required
                    id="standard-required"
                    placeholder="User Name"
                    value={email}
                    onClick={() => {
                      resetEmailPassIssueText(0);
                    }}
                    onChange={(event) => setEmail(event.target.value)}
                    onKeyPress={(event) => {
                      emailOnKeyPress();
                      setPasswordFocus(event);
                    }}
                  ></TextField>
                </div>
                <br />

                <label
                  style={{
                    marginLeft: "85px",
                    marginTop: "35px",
                    marginBottom: "-30px",
                    position: "fixed",
                  }}
                  className={landingStyle.labelForIssue}
                >
                  {passTextIssue}
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {" "}
                  <Password className={landingStyle.passIc} />
                  <TextField
                    style={{ width: "360px" }}
                    /* style={{ width: "350px", marginLeft: "90px", marginTop: "0px", marginBottom: "10px", }} */
                    className={classes.textBox}
                    placeholder="Password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onClick={() => {
                      resetEmailPassIssueText(1);
                    }}
                    onChange={(event) => setPassword(event.target.value)}
                    onKeyPress={(event) => {
                      passwordOnKeyPress();
                      passwordClick(event);
                    }}
                  />
                </div>
                <br />
                <a
                  href
                  style={{
                    marginLeft: "345px",
                    marginBottom: "10px",
                    cursor: "pointer",
                    fontSize: "small",
                  }}
                  onClick={() => {
                    forgotPasswordSwap();
                  }}
                >
                  Forgot password?
                </a>
                <br />
                <br />
                <input
                  type="button"
                  style={{
                    backgroundColor: config.main_color_1,
                    marginLeft: "220px",
                    color: "white",
                    height: "34px",
                    width: "110px",
                    borderRadius: "3px",
                    border: "none",
                    fontWeight: "bold",
                    fontSize: "15px",
                    marginTop: "20px",
                  }}
                  onClick={() => {
                    loginClick();
                  }}
                  value="Login"
                />
                <br />

                <input
                  type="button"
                  style={{
                    backgroundColor: "white",
                    color: config.main_color_1,
                    height: "34px",
                    width: "110px",
                    borderRadius: "3px",
                    marginLeft: "220px",
                    marginTop: "20px",
                    fontWeight: "bold",
                    fontSize: "15px",
                    borderColor: config.main_color_1,
                  }}
                  value="SignUp"
                  onClick={() => {
                    openSignIn();
                  }}
                />
              </form>
            </div>
          </Fade>
        </Modal>
      </>
    );
  }

  let SignInModal = () => {
    useEffect(() => {
      setRegEmailTextIssue(regCognitoErrorUsername);
      setRegPassTextIssue(regCognitoErrorPassword);
    }, [regCognitoErrorUsername, regCognitoErrorPassword]);

    const nameOnKeyPress = () => {};

    const emailOnKeyPress = () => {};

    const passwordOnKeyPress = () => {};

    const confirmPasswordOnKeyPress = () => {};

    const handleOpen = () => {
      setSignInOpen(true);
    };
    const handleClose = () => {
      setSignInOpen(false);
      openLogin();
      setName("");
      setRegEmail("");
      setRegPassword("");
      setRegConfirmPassword("");
    };
    const onClickRegister = async () => {
      try {
        setLoading(true);

        const signUpResponse = await Auth.signUp({
          username: regEmail.toLowerCase(),
          password: regPassword,
          attributes: {
            email: regEmail,
            name: name,
          },
        });
        if (signUpResponse) {
          alert("Registered Succesfully. Please Verify Using Your Email.");
          setLoading(false);
          setName("");
          setRegEmail("");
          setRegPassword("");
          setRegConfirmPassword("");
        }
      } catch (error) {
        setLoading(false);
        if (error.code === "InvalidParameterException") {
          setRegCognitoErrorPassword("Password must be at least 8 characters");
        } else {
          setRegCognitoErrorPassword("");
        }
        if (error.code === "UsernameExistsException") {
          setRegCognitoErrorUsername(
            "An account with the given email already exists."
          );
        } else if (error.message === "Invalid email address format.") {
          setRegCognitoErrorUsername("Invalid email address format.");
        } else {
          setRegCognitoErrorUsername("");
        }
      }
    };
    function setRegPasswordFocus(event) {
      if (event.key === "Tab") {
        passwordInput.current.focus();
      }
    }

    function validateEmail() {
      var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (regEmail === "" || !reg.test(regEmail)) {
        setRegEmailTextIssue("Please enter a valid email");
      } else {
        setRegEmailTextIssue("");
      }
    }

    function validatePass() {
      if (regPassword === "") {
        setRegPassTextIssue("Please enter a password");
      } else {
        setRegPassTextIssue("");
      }
    }
    function validateName() {
      if (name === "") {
        setRegNameTextIssue("Please enter a Name");
      } else {
        setRegNameTextIssue("");
      }
    }
    function samePassVerify() {
      if (regConfirmPassword === "" || regPassword === "") {
        setRegConfrimPassTextIssue("Please enter a password");
      } else {
        setRegConfrimPassTextIssue("");
      }
      if (regPassword !== regConfirmPassword) {
        setRegConfrimPassTextIssue("Passwords don't Match!");
      } else {
        setRegConfrimPassTextIssue("");
      }
    }
    function getSignedUp() {
      if (
        regPassword !== "" &&
        regEmail !== "" &&
        regConfirmPassword !== "" &&
        name !== ""
      ) {
        onClickRegister();
      }
    }

    function passwordClick(event) {
      if (event.key === "Enter") {
        validateName();
        validateEmail();
        validatePass();
        samePassVerify();
        getSignedUp();
      }
    }
    function confirmPasswordClick(event) {
      if (event.key === "Enter") {
        validateName();
        validateEmail();
        validatePass();
        samePassVerify();
        getSignedUp();
      }
    }

    function registerClick() {
      validateName();
      validateEmail();
      validatePass();
      samePassVerify();
      getSignedUp();
    }

    function resetEmailPassIssueText(type) {
      if (type === 0) {
        setRegEmailTextIssue("");
      } else {
        setRegPassTextIssue("");
      }
    }

    return (
      <>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={signInOpen}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={signInOpen}>
            <div className={classes.SignInPaper}>
              <span
                style={{ float: "right", cursor: "pointer" }}
                onClick={() => {
                  handleClose();
                }}
              >
                x
              </span>
              {loading && (
                <CircularProgress className={landingStyle.spinnerStyle} />
              )}
              <Image
                size="small"
                src={`https://${
                  config.DOMAIN
                }/${config.aws_org_id.toLowerCase()}-resources/images/org-images/logo.jpg`}
                style={{
                  marginLeft: "170px",
                  marginTop: "80px",
                  marginBottom: "50px",
                  width: "200px",
                }}
              />
              <form
                /* onSubmit={handleSubmit(onSubmit)} */ className={classes.root}
                Validate
                autoComplete="off"
              >
                <label
                  style={{ marginLeft: "80px", marginBottom: "-80px" }}
                  className={landingStyle.labelForIssue}
                >
                  {regNameTextIssue}
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <EmailIcon className={landingStyle.emailIc} />
                  <TextField
                    style={{
                      width: "360px",
                    }}
                    className={classes.textBox}
                    type="text"
                    required
                    id="standard-required"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={nameOnKeyPress}
                  />
                </div>
                <label
                  style={{ marginLeft: "80px", marginBottom: "-80px" }}
                  className={landingStyle.labelForIssue}
                >
                  {regEmailTextIssue}
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <EmailIcon className={landingStyle.emailIc} />
                  <TextField
                    style={{
                      width: "360px",
                    }}
                    className={classes.textBox}
                    type="text"
                    required
                    id="standard-required"
                    placeholder="Email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    onClick={() => {
                      resetEmailPassIssueText(0);
                    }}
                    onKeyPress={(event) => {
                      emailOnKeyPress();
                      setRegPasswordFocus(event);
                    }}
                  />
                </div>
                <label
                  style={{ marginLeft: "80px", marginBottom: "-80px" }}
                  className={landingStyle.labelForIssue}
                >
                  {regPassTextIssue}
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <Password className={landingStyle.passIc} />
                  <TextField
                    style={{
                      width: "360px",
                    }}
                    className={classes.textBox}
                    id="standard-password-input"
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    value={regPassword}
                    onClick={() => {
                      resetEmailPassIssueText(1);
                    }}
                    onChange={(e) => setRegPassword(e.target.value)}
                    onKeyPress={(event) => {
                      passwordOnKeyPress();
                      passwordClick(event);
                    }}
                  />
                </div>
                <label
                  style={{ marginLeft: "80px", marginBottom: "-80px" }}
                  className={landingStyle.labelForIssue}
                >
                  {regConfirmpassTextIssue}
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <Password className={landingStyle.passIc} />
                  <TextField
                    style={{
                      width: "360px",
                    }}
                    className={classes.textBox}
                    id="standard-password-input"
                    placeholder="Current Password"
                    type="password"
                    autoComplete="current-password"
                    value={regConfirmPassword}
                    onClick={() => {
                      resetEmailPassIssueText(1);
                    }}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    onKeyPress={(event) => {
                      confirmPasswordOnKeyPress();
                      confirmPasswordClick(event);
                    }}
                  />
                </div>
                <br />
                <p
                  style={{
                    fontSize: "10px",
                    width: "360px",
                    textAlign: "center",
                    marginLeft: "90px",
                    color: "rgba(0, 0, 0, 0.4)",
                  }}
                >
                  *Password should be at least 8 characters, contain at least
                  one lowercase letter & one number & one special character.
                </p>
                <br />
                <input
                  type="button"
                  style={{
                    backgroundColor: "white",
                    marginLeft: "220px",
                    marginTop: "20px",
                    color: config.main_color_1,
                    height: "30px",
                    width: "80px",
                    borderRadius: "3px",
                    borderColor: config.main_color_1,
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                  onClick={() => {
                    registerClick();
                  }}
                  value="SignUp"
                />
                <div
                  style={{
                    cursor: "pointer",
                    textAlign: "center",
                    fontSize: "small",
                  }}
                  onClick={() => {
                    openLogin();
                  }}
                >
                  Already have an account? Login
                </div>
              </form>
            </div>
          </Fade>
        </Modal>
      </>
    );
  };
  let ForgotPasswordModal = () => {
    useEffect(() => {
      setForgotPasswordEmailTextIssue(forgotPasswordCognitoErrorUsername);
    }, [forgotPasswordCognitoErrorUsername]);

    const emailOnKeyPress = () => {};

    const forgotPasswordHandler = async () => {
      try {
        setLoading(true);

        const forgot = await Auth.forgotPassword(forgotPasswordEmail);
        if (forgot) {
          setLoading(false);
          setResetPasswordOpen(true);
          setOpen(false);
          //setForgotPasswordEmail("");
        }
      } catch (error) {
        setLoading(false);
        if (error.code === "UserNotFoundException") {
          setForgotPasswordCognitoErrorUsername("User does not exist");
        } else {
          setForgotPasswordCognitoErrorUsername("");
        }
        if (error.message) {
          setForgotPasswordCognitoErrorUsername(error.message);
        }
      }
    };

    function validateEmail() {
      if (forgotPasswordEmail === "") {
        setForgotPasswordEmailTextIssue("Please enter a valid email");
      } else {
        setForgotPasswordEmailTextIssue("");
      }
    }
    function getForgotPass() {
      if (forgotPasswordEmail !== "") {
        forgotPasswordHandler();
      }
    }

    function forgotClick() {
      validateEmail();
      getForgotPass();
    }

    function resetEmailPassIssueText(type) {
      if (type === 0) {
        setForgotPasswordEmailTextIssue("");
      }
    }

    const handleOpen = () => {
      setForgotPasswordOpen(true);
    };
    const handleClose = () => {
      setForgotPasswordOpen(false);
      setOpen(true);
      setForgotPasswordEmail("");
      setForgotPasswordEmailTextIssue("");
    };

    return (
      <>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={forgotPasswordOpen}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={forgotPasswordOpen}>
            <div className={classes.forgotPasswordPaper}>
              <span
                style={{ float: "right", cursor: "pointer" }}
                onClick={() => {
                  handleClose();
                }}
              >
                x
              </span>
              {loading && (
                <CircularProgress className={landingStyle.spinnerStyle} />
              )}
              <Image
                size="small"
                src={`https://${
                  config.DOMAIN
                }/${config.aws_org_id.toLowerCase()}-resources/images/org-images/logo-dark.jpg`}
                style={{
                  marginLeft: "190px",
                  marginTop: "80px",
                  marginBottom: "50px",
                }}
              />
              <form
                /* onSubmit={handleSubmit(onSubmit)} */ className={classes.root}
                Validate
                autoComplete="off"
              >
                <label
                  style={{ marginLeft: "80px", marginBottom: "-80px" }}
                  className={landingStyle.labelForIssue}
                >
                  {forgotPasswordEmailTextIssue}
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <EmailIcon className={landingStyle.emailIc} />
                  <TextField
                    style={{
                      width: "360px",
                    }}
                    className={classes.textBox}
                    type="text"
                    required
                    id="standard-required"
                    placeholder="Email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    onClick={() => {
                      resetEmailPassIssueText(0);
                    }}
                    //onKeyPress={(event) => { emailOnKeyPress(); }}
                  />
                </div>

                <br />

                <input
                  type="button"
                  style={{
                    backgroundColor: config.main_color_1,
                    marginLeft: "235px",
                    color: "white",
                    height: "30px",
                    width: "80px",
                    borderRadius: "3px",
                    marginTop: "10px",
                    border: "none",
                  }}
                  onClick={() => {
                    forgotClick();
                  }}
                  value="Next"
                />
              </form>
            </div>
          </Fade>
        </Modal>
      </>
    );
  };
  let ResetPasswordModal = () => {
    useEffect(() => {
      setResetPassVerificationCode(resetPasswordCodeIssue);
    }, [resetPasswordCodeIssue]);
    function resetHandler() {
      if (verificationCode === "") {
        setResetPassVerificationCode("Please enter the code");
      }
      samePassVerify();
    }
    const passwordVerificationHandler = async (event) => {
      try {
        setLoading(true);
        await Auth.forgotPasswordSubmit(
          forgotPasswordEmail,
          verificationCode,
          resetPassword
        );
        swal({
          title: "Success",
          text: "Password Changed Successfully",
          icon: "success",
          dangerMode: false,
          closeOnClickOutside: false,
        }).then((willDelete) => {
          if (willDelete) {
          }
        });
        setLoading(false);
        setResetPasswordOpen(false);
        setForgotPasswordOpen(false);
        setOpen(true);
        setVerificationCode("");
        setResetPassword("");
        setConfirmResetPassword("");
        setResetPassVerificationCode("");
        setResetPasswordCodeIssue("");
        setResetPasswordMatch("");
        setForgotPasswordEmail("");
        setcognitoErrorPassword("");
        setForgotPasswordCognitoErrorUsername("");
      } catch (error) {
        setLoading(false);
        console.log(error);
        if (error.code === "InvalidParameterException") {
          setResetPasswordCodeIssue("Invalid code entered");
        } else {
          setResetPasswordCodeIssue("");
        }
        if (error.code === "CodeMismatchException") {
          setResetPasswordCodeIssue("Code mismatch");
        } else if (error.code === "InvalidPasswordException") {
          setResetPasswordCodeIssue("Please match the password type.");
        } else {
          setResetPasswordCodeIssue("");
        }
      }
    };

    const passwordOnKeyPress = () => {};

    const VerificationcodeOnKeyPress = () => {};
    const handleOpen = () => {
      setResetPasswordOpen(true);
    };
    const handleClose = () => {
      setResetPasswordOpen(false);
      setVerificationCode("");
      setResetPassword("");
      setConfirmResetPassword("");
      setResetPassVerificationCode("");
      setResetPasswordCodeIssue("");
      setResetPasswordMatch("");
    };
    function samePassVerify() {
      var regularExpression =
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
      if (resetPassword === "" || confirmResetPassword === "") {
        setResetPasswordMatch("Please enter a password");
      } else {
        setResetPasswordMatch("");
      }
      if (resetPassword !== confirmResetPassword) {
        setResetPasswordMatch("Passwords don't Match!");
      } else {
        setResetPasswordMatch("");
      }
      if (!regularExpression.test(resetPassword)) {
        setResetPasswordMatch("Please match password pattern");
      } else {
        setResetPasswordMatch("");
      }
      passwordVerificationHandler();
    }

    return (
      <>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={resetPasswordOpen}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={resetPasswordOpen}>
            <div className={classes.ResetPasswordPaper}>
              <span
                style={{ float: "right", cursor: "pointer" }}
                onClick={() => {
                  handleClose();
                }}
              >
                x
              </span>
              {loading && (
                <CircularProgress className={landingStyle.spinnerStyle} />
              )}
              <Image
                size="small"
                src={`https://${
                  config.DOMAIN
                }/${config.aws_org_id.toLowerCase()}-resources/images/org-images/logo-dark.jpg`}
                style={{
                  marginLeft: "190px",
                  marginTop: "80px",
                  marginBottom: "50px",
                }}
              />
              <p
                style={{
                  textAlign: "center",
                  fontSize: "16px",
                  color: "rgba(0, 0, 0, 0.6)",
                }}
              >
                Password Reset
              </p>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "14px",
                  color: "rgba(0, 0, 0, 0.6)",
                }}
              >
                {" "}
                Please enter the verification code sent to your email
              </p>
              <br />
              <form
                /* onSubmit={handleSubmit(onSubmit)} */ className={classes.root}
                Validate
                autoComplete="off"
              >
                <label
                  style={{ marginLeft: "80px", marginBottom: "-80px" }}
                  className={landingStyle.labelForIssue}
                >
                  {resetPassVerificationCode}
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <TextField
                    style={{ width: "360px" }}
                    /* style={{ width: "350px", marginLeft: "90px", marginTop: "0px", marginBottom: "10px", }} */
                    className={classes.textBox}
                    type="text"
                    required
                    id="standard-required"
                    value={verificationCode}
                    placeholder={"Verification Code"}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    onKeyPress={VerificationcodeOnKeyPress}
                    //onKeyPress={nameOnKeyPress}
                  />
                </div>
                <label
                  style={{ marginLeft: "80px", marginBottom: "-80px" }}
                  className={landingStyle.labelForIssue}
                >
                  {resetPasswordMatch}
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {" "}
                  <Password className={landingStyle.passIc} />
                  <TextField
                    style={{ width: "360px" }}
                    /* style={{ width: "350px", marginLeft: "90px", marginTop: "0px", marginBottom: "10px", }} */
                    className={classes.textBox}
                    type="password"
                    required
                    id="standard-required"
                    value={resetPassword}
                    placeholder={"New password"}
                    onChange={(e) => setResetPassword(e.target.value)}
                    onKeyPress={passwordOnKeyPress}
                    //onKeyPress={nameOnKeyPress}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {" "}
                  <Password className={landingStyle.passIc} />
                  <TextField
                    style={{ width: "360px" }}
                    /* style={{ width: "350px", marginLeft: "90px", marginTop: "0px", marginBottom: "10px", }} */
                    className={classes.textBox}
                    type="password"
                    required
                    id="standard-required"
                    value={confirmResetPassword}
                    placeholder={"Confirm password"}
                    onChange={(e) => setConfirmResetPassword(e.target.value)}
                    onKeyPress={VerificationcodeOnKeyPress}
                    //onKeyPress={nameOnKeyPress}
                  />
                </div>
                <p
                  style={{
                    fontSize: "10px",
                    width: "360px",
                    textAlign: "center",
                    marginLeft: "90px",
                    color: "rgba(0, 0, 0, 0.4)",
                  }}
                >
                  *Password should be at least 8 characters, contain at least
                  one lowercase letter & one number & one special character.
                </p>
                <br /> <br />
                <input
                  type="button"
                  onClick={() => {
                    resetHandler();
                  }}
                  style={{
                    backgroundColor: config.main_color_1,
                    marginLeft: "240px",
                    color: "white",
                    height: "30px",
                    width: "80px",
                    borderRadius: "3px",
                    border: "none",
                    fontWeight: "bold",
                    fontSize: "small",
                  }}
                  value="Submit"
                />
              </form>
            </div>
          </Fade>
        </Modal>
      </>
    );
  };
  let array = [
    {
      image: img1,
      sent: "Welcome to LEARNED <br> Online Education Portal ",
    },
    {
      image: img2,
      sent: "ADVANCE YOUR CAREER IN HEALTH CARE  <br> Explore Cutting Edge Programs in various Specialities",
    },
    {
      image: img3,
      sent: "LEARN ONLINE, ANYTIME, ANYWHERE <br> Learning made SMART and EASY",
    },
    {
      image: img4,
      sent: "THE REALM OF CONTINUOUS EDUCATION <br> Stay Connected, Update and Upskill yourself",
    },
  ];

  return (
    <div style={{ scrollY: "hidden" }}>
      {LoginModal()}
      {SignInModal()}
      {ForgotPasswordModal()}
      {ResetPasswordModal()}
      <AppHeader />
      <nav>
        <Link to="/">Home</Link>
        {" | "}
      </nav>
      <Slider
        {...settings}
        style={{
          height: "97vh",
          width: "100%",
          marginLeft: "0px",
          background: "transparent",
          scrollY: "hidden",
        }}
      >
        {" "}
        {pageData !== undefined ? (
          pageData.length !== 0 ? (
            pageData.map((value) => (
              <div
                style={{
                  height: "100vh",
                  width: "100%",
                  marginTop: "55px",
                  scrollY: "hidden",
                }}
              >
                {/*   <Card
              style={{
                width: "100%",
                height: " 100%",
                marginTop: "55px",
              }}
            > */}
                <img
                  style={{
                    height: "97vh",
                    width: "100%",
                    /*  backgroundImage: `url( ${img1} )`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat", */
                  }}
                  src={`https://${
                    config.DOMAIN
                  }/${config.aws_org_id.toLowerCase()}-resources/images/org-images/${
                    value.image
                  }`}
                  alt=""
                />
                <div
                  style={{
                    fontSize: "35px",
                    font: "sans-serif",
                    color: config.main_color_2,
                    fontWeight: "bold",
                    width: "5%",
                    position: "fixed",
                    top: "30%",
                    //left: "20%",
                    textAlign: "center",
                    zIndex: "10",
                    //margin: "100px -22%",
                    marginTop: "30px",
                    marginLeft: "25px",
                    lineHeight: "50px",
                    scrollY: "hidden",
                  }}
                >
                  <p dangerouslySetInnerHTML={{ __html: value.text }}></p>
                  <p>
                    {console.log(
                      `('https://${
                        config.DOMAIN
                      }/${config.aws_org_id.toLowerCase()}-resources/images/org-images/${
                        value.image
                      }')`
                    )}
                  </p>
                </div>
                <div></div>
                {/*  </Card> */}
              </div>
            ))
          ) : (
            <div
              style={{
                height: "90vh",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Skeleton animation="wave" variant="rect" width="100%">
                <div style={{ height: "90vh", width: "100%" }} />
              </Skeleton>
            </div>
          )
        ) : null}
      </Slider>
      {/*   <h2
        style={{
          marginTop: "100px",
          marginRight: "80%",
          color: config.main_color_1,
          fontWeight: "bolder",
          fontSize: "20px",
          marginBottom: "20px",
          marginLeft: "6%",
        }}
      >
        All programs
      </h2> */}
      {/* <div style={{ display: "flex" }}>
        <Typography component="div" variant="rect">
          {isLoading ? <Skeleton width={1210} height={200} /> : null}
        </Typography>
        <Typography component="div" variant="rect">
          {isLoading ? <Skeleton width={1210} height={200} /> : null}
        </Typography>
        <Typography component="div" variant="rect">
          {isLoading ? <Skeleton width={1210} height={200} /> : null}
        </Typography>
        <Typography component="div" variant="rect">
          {isLoading ? <Skeleton width={1210} height={200} /> : null}
        </Typography>
      </div> */}

      <Footer />
    </div>
  );
}
export default LandingScreen;

let styles = {
  topicName: {
    marginTop: "20px ",
    fontSize: "15px ",
    float: "left ",
    marginLeft: "20px ",
    fontWeight: "bold ",
    color: config.main_color_1,
    marginRight: "20px",
  },
  loginButtonTitle: {
    color: "white",
    borderStyle: "groove ",
    borderColor: config.main_color_2,
    height: "30px",
    lineHeight: "0px",
    marginTop: "22px",
    backgroundColor: config.main_color_2,
    fontSize: "16px",
    borderRadius: "3px",
    fontWeight: "bold",
    width: "80px",
  },
};
