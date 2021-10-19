import React, { useState, useRef, useEffect } from "react";
import { API, Auth } from "aws-amplify";
import Cryptr from "cryptr";
import { useDispatch } from "react-redux";
import { Constants } from "../../config/constants";
import config from "../../config/aws-exports";
import { awsSignIn } from "../../redux/auth/authSlice";
import swal from "sweetalert";
import {ReactComponent as Close} from "../../assets/svg/close_black_24dp.svg";
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
  Button,
} from "semantic-ui-react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { CircularProgress } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import "./a.scss";
import Password from "../../assets/svgjs/password";

import appHeaderStyle from "./appHeader.module.scss";

import logo from "../../assets/images/logo.jpg";
import EmailIcon from "../../assets/svgjs/email";

const useStyles = makeStyles((theme) => ({
  modal: {
    "& .MuiInputBase-input": {
      fontSize: "medium ",
      paddingLeft: "34px",
    },
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
    backgroundColor: theme.palette.background.paper,

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
  ResetPasswordPaperFirst: {
    backgroundColor: theme.palette.background.paper,

    height: "auto",
    width: "600px",
    borderRadius: "4px",
    border: "none",
    padding: theme.spacing(2, 4, 3),
  },

  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

let main_color_11 = "linear-gradient(#0f80a4, #0f80a4)";
let main_color_12 = "linear-gradient(#0f8089, #0f8568)";

function AppHeader(props) {
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
  const [resetPasswordOpenFirst, setResetPasswordOpenFirst] = useState(false);
  const [cognitoErrorUsername, setcognitoErrorUsername] = useState("");
  const [cognitoErrorPassword, setcognitoErrorPassword] = useState("");
  let navigate = useNavigate();
  const emailInput = useRef();
  const passwordInput = useRef();
  const clearEmail = () => emailInput.current.clear();

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
  //reset first time

  const [resetPasswordFirst, setResetPasswordFirst] = useState("");
  const [confirmResetPasswordFirst, setConfirmResetPasswordFirst] =
    useState("");
  const [resetPassVerificationCodeFirst, setResetPassVerificationCodeFirst] =
    useState("");
  const [resetPasswordCodeIssueFirst, setResetPasswordCodeIssueFirst] =
    useState("");
  const [resetPasswordMatchFirst, setResetPasswordMatchFirst] = useState("");

  const dispatch = useDispatch();
  const classes = useStyles();

  const [list, setList] = useState([]);
  const [certificateData, setCertificateData] = useState([]);
  const [diplomaData, setDiplomaData] = useState([]);
  const [graduateData, setGraduateData] = useState([]);
  const [pgDiplomaData, setPgDiplomaData] = useState([]);
  const [underGraduateData, setUnderGraduateData] = useState([]);

  const cryptr = new Cryptr("myTotalySecretKey");

  useEffect(() => {
    getProgramsList();
  }, []);

  async function getProgramsList() {
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
        Constants.ALL_PROGRAM,
        bodyParam
      );
      const ProgramsList = response;

      setList(ProgramsList.list);

      console.log("Apply1", ProgramsList);
    } catch (error) {
      console.error(error);
    }
  }

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

  const emailOnKeyPress = () => {
    setcognitoErrorUsername("");
  };
  const passwordOnKeyPress = () => {
    setcognitoErrorPassword("");
  };

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
        const user = await Auth.signIn(email.trim(), password);
        console.log("user ", user);

        if (
          user.challengeName === "SMS_MFA" ||
          user.challengeName === "SOFTWARE_TOKEN_MFA"
        ) {
          //
        } else if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
          setResetPasswordOpenFirst(true);
          setOpen(false);
        } else if (user.challengeName === "MFA_SETUP") {
          //
        }

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
          await localStorage.setItem("sessionStore", false);
          analyticsAPI(user);
          navigate("/dashboard");
        } catch (error) {
          //alert(JSON.stringify(error))
          console.error(error);
          dispatch(awsSignIn(userdata));
          await localStorage.setItem("sessionStore", false);
          navigate("/dashboard");
        }
        //let encryptedString = cryptr.encrypt(JSON.stringify(userdata));
        // dispatch(awsSignIn(userdata));

        // navigate('/dashboard');
      } catch (error) {
        console.log(error.code);
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
        if(error.message){
          setcognitoErrorPassword(error.message);
        }
      }
      
    }

    async function analyticsAPI(datagot) {
      //console.log("lda ", datagot.attributes.sub);
      const bodyParam = {
        body: {
          oid: config.aws_org_id,
          id: datagot.attributes.id,
          eventtype: "AuthenticatedViaCognito",
          email: datagot.attributes.sub,
          emailid: datagot.attributes.email,
          name: datagot.attributes.name,
        },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      try {
        const response = await API.post(
          config.aws_cloud_logic_custom_name,
          Constants.ANALYTICS_WEB_APP,
          bodyParam
          //`${Constants.GET_MY_PROGRAMS}`, bodyParam,
        );
      } catch (error) {
        console.log("getCategoryError", error);
      }
    }

    function setPasswordFocus(event) {
      if (event.key === "Tab") {
        clearEmail();
        passwordInput.current.focus();
      }
    }

    function validateEmail() {
      let trimmedEmail = email.trim();
      /* let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; */
      if (trimmedEmail === "" /* || re.test(email) */) {
        setEmailTextIssue("Please enter a valid email");
      } else {
        setEmailTextIssue("");
      }
      setEmail(trimmedEmail);
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
      console.log("text", emailTextIssue);
      console.log("textp", passTextIssue);

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
              {loading && <CircularProgress style={styles.spinnerStyle} />}
              <span
                style={{
                  float: "right",
                  cursor: "pointer",
                  fontSize: "large",
                  fontWeight: "bold",
                }}
                
              >
                <Close onClick={() => {handleClose();}} style={{cursor:"pointer"}}/>
              </span>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "40px 0px", padding: "10px" }}>
                <Image
                  size="small"
                  src={`https://${config.DOMAIN
                    }/${config.aws_org_id.toLocaleLowerCase()}-resources/images/org-images/logo-dark.jpg`}
                  style={{
                    width: "auto",
                    height: "80px",
                  }}
                />
              </div>
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
                  style={{ marginLeft: "95px", marginBottom: "-20px" }}
                  className={appHeaderStyle.labelForIssue}
                >
                  {emailTextIssue}
                </label>
                <br />
                {/*  <EmailIcon  className={appHeaderStyle.emailIc}/> */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <EmailIcon className={appHeaderStyle.emailIc} />
                  <TextField
                    style={{
                      width: "360px",
                    }} /* style={{ width: "350px", marginLeft: "90px", fontSize: "14px", position: "fixed", marginBottom: "10px", paddingLeft:"10px" }} */
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
                    marginLeft: "95px",
                    position: "fixed",
                    marginTop: "-15px",
                  }}
                  className={appHeaderStyle.labelForIssue}
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
                  <Password className={appHeaderStyle.passIc} />
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
                    marginLeft: "336px",
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

                     {/* <input
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
                /> */}
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

    const nameOnKeyPress = () => { };

    const emailOnKeyPress = () => { };

    const passwordOnKeyPress = () => { };

    const confirmPasswordOnKeyPress = () => { };

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
        console.log("err", error);
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
      const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
      const format1 = /[ 1234567890]/;
      const format2 = /[ abcdefghijklmnopqrstuvwxyz]/;
      var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      const re = /^\S+@\S+$/;
      if (regEmail === "" || !reg.test(regEmail) || regEmail.trim() === "") {
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
      if (regPassword=== "" ) {
        setRegConfrimPassTextIssue("Please enter a password");
        return;
      } 
      if (regConfirmPassword === ""){
        setRegConfrimPassTextIssue("Please enter a confirmation password")
      }
      if (regPassword !== regConfirmPassword) {
        setRegConfrimPassTextIssue("Passwords don't Match!");
        return;
      } 
        setRegConfrimPassTextIssue("");
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
                <Close onClick={() => {handleClose();}} style={{cursor:"pointer"}} />
              </span>
              {loading && <CircularProgress style={styles.spinnerStyle} />}
              <Image
                size="small"
                src={`https://${config.DOMAIN
                  }/${config.aws_org_id.toLocaleLowerCase()}-resources/images/org-images/logo-dark.jpg`}
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
                  className={appHeaderStyle.labelForIssue}
                >
                  {regNameTextIssue}
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
                  <EmailIcon className={appHeaderStyle.emailIc} />
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
                  className={appHeaderStyle.labelForIssue}
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
                  <EmailIcon className={appHeaderStyle.emailIc} />
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
                  className={appHeaderStyle.labelForIssue}
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
                  <Password className={appHeaderStyle.passIc} />
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
                  className={appHeaderStyle.labelForIssue}
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
                  <Password className={appHeaderStyle.passIc} />
                  <TextField
                    style={{
                      width: "360px",
                    }}
                    className={classes.textBox}
                    id="standard-password-input"
                    placeholder="Confirm Password"
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
                <p
                  style={{
                    fontSize: "10px",
                    width: "360px",
                    textAlign: "center",
                    marginLeft: "90px",
                    color: "rgba(0, 0, 0, 0.4)",
                  }}
                >
                  *Password should be at least 8 characters, contain at least one number & one special character.
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
                <br /> <br />
                <div
                  style={{
                    cursor: "pointer",
                    textAlign: "center",
                    fontSize: "16px",
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

    const emailOnKeyPress = () => { };

    const forgotPasswordHandler = async () => {
      try {
        setLoading(true);
        /*  setResetPasswordOpen(true); */
        const forgot = await Auth.forgotPassword(forgotPasswordEmail.replace(/\s/g,''));
        if (forgot) {
          setResetPasswordOpen(true);
          setOpen(false);
          //setForgotPasswordEmail("");
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.code === "UserNotFoundException") {
          setForgotPasswordCognitoErrorUsername("User does not exist");
        } else {
          setForgotPasswordCognitoErrorUsername("");
        }
        if(error.message){
          setForgotPasswordCognitoErrorUsername(error.message);
        }
      }
      /*   setResetPasswordOpen(true);
      setOpen(false); */
    };

    function validateEmail() {
      console.log("email before" ,JSON.stringify(forgotPasswordEmail));
      let trimedEmail = forgotPasswordEmail.replace(/\s/g,'')
      console.log("email after" ,JSON.stringify(trimedEmail));
      if (trimedEmail === "") {
        setForgotPasswordEmailTextIssue("Please enter a valid email");
      } else {
        setForgotPasswordEmailTextIssue("");
      }
      setForgotPasswordEmail(trimedEmail);
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
                
              >
                <Close onClick={() => {handleClose();}} style={{cursor:"pointer"}} />
              </span>
              {loading && <CircularProgress style={styles.spinnerStyle} />}
              <Image
                size="small"
                src={`https://${config.DOMAIN
                  }/${config.aws_org_id.toLocaleLowerCase()}-resources/images/org-images/logo-dark.jpg`}
                style={{
                  marginLeft: "190px",
                  marginTop: "80px",
                  marginBottom: "50px",
                }}
              />
              <h3 style={{fontSize: "18px", fontWeight: "400px", margin: "auto", textAlign:"center", paddingBottom: "10px"}}>Forgot password? Please enter your email</h3>
              <form
                /* onSubmit={handleSubmit(onSubmit)} */ className={classes.root}
                Validate
                autoComplete="off"
              >
                
                <label
                  style={{ marginLeft: "80px", marginBottom: "-80px" }}
                  className={appHeaderStyle.labelForIssue}
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
                  <EmailIcon className={appHeaderStyle.emailIc} />
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
                    fontSize: "15px",
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
      let trimedCode = verificationCode.trim();
      if (trimedCode === "") {
        setResetPassVerificationCode("Please enter the code");
        return;
      }
      setResetPassVerificationCode("");
      samePassVerify();
    }
    const passwordVerificationHandler = async (event) => {
      try {
        setLoading(true);
        await Auth.forgotPasswordSubmit(
          forgotPasswordEmail,
          verificationCode.trim(),
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
        console.log("err", error);
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

    const passwordOnKeyPress = () => { };

    const VerificationcodeOnKeyPress = () => { };
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
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
      if (resetPassword === "") {
        setResetPasswordMatch("Please enter a password");
        return;
      } 
      if (confirmResetPassword === ""){
        setResetPasswordMatch("Please enter a Confirmation password");
        return;
      }
      if (resetPassword !== confirmResetPassword) {
        setResetPasswordMatch("Passwords don't Match!");
        return;
      } 
      if (!regularExpression.test(resetPassword)) {
        setResetPasswordMatch("Please match password pattern");
        return;
      } 
      setResetPasswordMatch("");
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
                
              >
                <Close onClick={() => {handleClose();}} style={{cursor:"pointer"}} />
              </span>
              {loading && <CircularProgress style={styles.spinnerStyle} />}
              <Image
                size="small"
                src={`https://${config.DOMAIN
                  }/${config.aws_org_id.toLocaleLowerCase()}-resources/images/org-images/logo-dark.jpg`}
                style={{
                  marginLeft: "190px",
                  marginTop: "80px",
                  marginBottom: "20px",
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
                  className={appHeaderStyle.labelForIssue}
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
                    autocomplete="off"
                  //onKeyPress={nameOnKeyPress}
                  />
                </div>
                <label
                  style={{ marginLeft: "80px", marginBottom: "-80px" }}
                  className={appHeaderStyle.labelForIssue}
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
                  <Password className={appHeaderStyle.passIc} />
                  <TextField
                    style={{ width: "360px" }}
                    /* style={{ width: "350px", marginLeft: "90px", marginTop: "0px", marginBottom: "10px", }} */
                    className={classes.textBox}
                    type="password"
                    required
                    id="standard-required"
                    value={resetPassword}
                    autocomplete="off"
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
                  <Password className={appHeaderStyle.passIc} />
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
                  *Password should be at least 8 characters, contain at least one number & one special character.
                </p>
                <br /> <br />
                <input
                  type="button"
                  onClick={() => {
                    resetHandler();
                  }}
                  style={{
                    backgroundColor: config.main_color_1,
                    marginLeft: "220px",
                    color: "white",
                    height: "30px",
                    width: "100px",
                    borderRadius: "3px",
                    border: "none",
                    fontWeight: "bold",
                    fontSize: "15px",
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

  function ResetPasswordModalFirstTime() {
    
      useEffect(() => {
        setResetPassVerificationCodeFirst(resetPasswordCodeIssue);
      }, [resetPasswordCodeIssue]);

      function resetHandlerFirst() {
        samePassVerifyFirst();
      }
      const passwordVerificationHandlerFirst = async (event) => {
        try {
          setLoading(true);
          await Auth.signIn(email, password).then((users) => {
            if (users.challengeName === "NEW_PASSWORD_REQUIRED") {
              Auth.completeNewPassword(users, confirmResetPasswordFirst);
            }
          });

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
          setResetPasswordOpenFirst(false);
          setPassword("");
          setcognitoErrorPassword("");
          setForgotPasswordCognitoErrorUsername("");
          setResetPasswordFirst("");
          setConfirmResetPasswordFirst("");

          setResetPasswordCodeIssueFirst("");
          setResetPasswordMatchFirst("");
        } catch (error) {
          setLoading(false);
          console.log("err", error);
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

      const passwordOnKeyPress = () => { };

      const VerificationcodeOnKeyPress = () => { };
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
        setResetPasswordOpenFirst(false);
        setPassTextIssue("");
      };

      function samePassVerifyFirst() {
        var regularExpression =
          /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

        if ( resetPasswordFirst === "") {
          setResetPasswordMatchFirst("Please enter a password");
          return;
        } 
        if (confirmResetPasswordFirst === "" ){
          setResetPasswordMatchFirst("Please enter a Confirmation password");
          return;
        }
        if (resetPasswordFirst !== confirmResetPasswordFirst) {
          setResetPasswordMatchFirst("Passwords don't Match!");
          return;
        }
        if (!regularExpression.test(resetPasswordFirst)) {
          setResetPasswordMatchFirst("Please match password pattern");
          return;
        } 
        passwordVerificationHandlerFirst();
      }
      return (
        <>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={resetPasswordOpenFirst}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={resetPasswordOpenFirst}>
              <div className={classes.ResetPasswordPaperFirst}>
                <span
                  style={{ float: "right", cursor: "pointer" }}
                  onClick={() => {
                    handleClose();
                  }}
                >
                  <Close onClick={() => {handleClose();}} style={{cursor:"pointer"}} />
                </span>
                {loading && <CircularProgress style={styles.spinnerStyle} />}
                <Image
                  size="small"
                  src={`https://${config.DOMAIN
                    }/${config.aws_org_id.toLocaleLowerCase()}-resources/images/org-images/logo-dark.jpg`}
                  style={{
                    marginLeft: "190px",
                    marginTop: "80px",
                    marginBottom: "20px",
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
                  Please complete rest password
                </p>
                <br />
                <form
                  /* onSubmit={handleSubmit(onSubmit)} */ className={
                    classes.root
                  }
                  Validate
                  autoComplete="off"
                >
                  <label
                    style={{ marginLeft: "80px", marginBottom: "-80px" }}
                    className={appHeaderStyle.labelForIssue}
                  >
                    {resetPasswordMatchFirst}
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
                    <Password className={appHeaderStyle.passIc} />
                    <TextField
                      style={{ width: "360px" }}
                      /* style={{ width: "350px", marginLeft: "90px", marginTop: "0px", marginBottom: "10px", }} */
                      className={classes.textBox}
                      type="password"
                      required
                      id="standard-required"
                      value={resetPasswordFirst}
                      autocomplete="off"
                      placeholder={"New password"}
                      onChange={(e) => setResetPasswordFirst(e.target.value)}
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
                    <Password className={appHeaderStyle.passIc} />
                    <TextField
                      style={{ width: "360px" }}
                      /* style={{ width: "350px", marginLeft: "90px", marginTop: "0px", marginBottom: "10px", }} */
                      className={classes.textBox}
                      type="password"
                      required
                      id="standard-required"
                      value={confirmResetPasswordFirst}
                      placeholder={"Confirm password"}
                      onChange={(e) =>
                        setConfirmResetPasswordFirst(e.target.value)
                      }
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
                    *Password should be at least 8 characters, contain at least one number & one special character.
                  </p>
                  <br /> <br />
                  <input
                    type="button"
                    onClick={() => {
                      resetHandlerFirst();
                    }}
                    style={{
                      backgroundColor: config.main_color_1,
                      marginLeft: "220px",
                      color: "white",
                      height: "30px",
                      width: "100px",
                      borderRadius: "3px",
                      border: "none",
                      fontWeight: "bold",
                      fontSize: "15px",
                    }}
                    value="Submit"
                  />
                </form>
              </div>
            </Fade>
          </Modal>
        </>
      );
    }
  

  function toNavigate(item) {
    localStorage.setItem("bpid", item.bpid);
    localStorage.setItem("pid", item.pid);
    navigate("/myProg");
    window.location.reload();
  }

  function renderList() {
    return (
      <Dropdown.Menu style={{fontSize: "14px",fontWeight: "600"}}>
        {list !== undefined ?
          list.map((item) =>
            item.list !== undefined ? (
              <Dropdown simple className="link item" text={item.pname} style={{ fontSize: "14px",fontWeight: "600"}}>
                <Dropdown.Menu direction="left" position="left" style={{ fontSize: "14px"}}>
                  {item.list.map((item) => (
                    <Dropdown.Item onClick={() => toNavigate(item)} style={{width: "350px", fontSize: "14px"}}>
                      {item.pname}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Dropdown.Item className={appHeaderStyle.dropnow + " link item " } >
                <div onClick={() => toNavigate(item)} style={{fontSize: "14px", lineHeight: "normal"}}>{item.pname}</div>
              </Dropdown.Item>
            )
          ) : null}
      </Dropdown.Menu>
    );
  }

  return (
    <div>
      {LoginModal()}
      {SignInModal()}
      {ForgotPasswordModal()}
      {ResetPasswordModal()}
      {ResetPasswordModalFirstTime()}
      <Menu
        secondary
        fixed="top"
        className={appHeaderStyle.headerStyle}
        style={styles.headerStyle}
      >
        <div className={appHeaderStyle.imageholder}>
          <div style={{ height: "100%", width: "auto" }}>
            <Image
              size="small"
              src={`https://${config.DOMAIN
                }/${config.aws_org_id.toLocaleLowerCase()}-resources/images/org-images/logo-light.jpg`}
              style={{ height: "100%", width: "auto" }}
            />
          </div>
        </div>
        <div className={appHeaderStyle.menuholder}>
          <div>
            <Menu.Item
              as="a"
              direction="left"
              position="left"
              header
              style={{ color: "white", padding: "0px", margin: "0px" }}
            ></Menu.Item>

            <Dropdown
              position="left"
              direction="bottom"
              className="link item"
              text="Programs"
              style={{ color: "#fff", marginRight: "0px", padding: "0px"}}
            >
              {renderList()}
            </Dropdown>
          </div>
          {/* <Dropdown
          className="link item"
          text="Admissions"
          style={{ color: "white" }}
        >
          <Dropdown.Menu>
            <Link
              to={`/onlineProgram`}
              style={{ color: "white", marginTop: "12px" }}
            >
              {" "}
              <Dropdown.Item>Online Program</Dropdown.Item>
            </Link>
          </Dropdown.Menu>
        </Dropdown> */}
          {/* <Menu.Item
          as="a"
          href="http://www.infoblog.jssuni.edu.in/"
          target="_blank"
          style={{ color: "white" }}
        >
          Research forum
        </Menu.Item> */}
        <div>
        <Link
          to={`/faqs`}
          style={{
            color: "white",
            marginTop: "12px",
            textDecoration: "none",
          }}
        >
          <Menu.Item style={{ color: "white" }}>FAQ</Menu.Item>
        </Link>
        </div>
          <div>
            <Link
              to={`/contactUs`}
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              <Menu.Item style={{ color: "white" }}>Contact us</Menu.Item>
            </Link>
          </div>
          <div>
            <Button
              //className={appHeaderStyle.loginButton}
              onClick={() => setOpen(true)}
              style={styles.loginButton}
            >
              Login
            </Button>
          </div>
        </div>
      </Menu>
    </div>
  );
}

export default AppHeader;

let styles = {
  headerStyle: {
    backgroundImage: config.platform_main_theme,
    height: "70px ",
    fontSize: "17px ",
  },
  loginButton: {
    color: config.main_color_2,
    borderStyle: "solid ",
    borderColor: config.main_color_2,
    height: "30px ",
    lineHeight: "0px ",
    backgroundColor: "white ",
    fontSize: "16px ",
    borderRadius: "5px ",
    borderWidth: "1.5px ",
    fontWeight: "bolder ",
  },
  emailStyle: {
    fill: "#e35f14",

    width: "2px",
    height: "2px",
  },
  spinnerStyle: {
    width: "40px ",
    height: "40px ",
    /* left: 200px; */
    marginLeft: "252px ",
    zIndex: "999 ",
    marginTop: "187px ",
    overflow: "visible ",
    position: "fixed ",
  },

  labelForIssue: {
    fontSize: "12.5px ",

    whiteSpace: "nowrap ",
    height: "20px ",
    color: "#f64242 ",
  },

  emailIc: {
    width: "30px",
    height: "30px",
    position: "absolute ",
    left: "17%",
  },
  passIc: {
    width: "26px",
    height: "26px",
    position: "absolute ",
    left: "17%",
  },
};
