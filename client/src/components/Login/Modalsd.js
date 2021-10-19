
import React, { useState, useRef, useEffect } from 'react'
import { API, Auth } from 'aws-amplify';
import { useDispatch } from 'react-redux';
import { awsSignIn, } from '../../redux/auth/authSlice';
import swal from "sweetalert";
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
  Button
} from 'semantic-ui-react';
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { CircularProgress } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    border: 'none',
    transform: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,

    height: "500px",
    width: "600px",
    borderRadius: "4px",
    border: "none",
    padding: theme.spacing(2, 4, 3)
  },
  SignInPaper: {

    backgroundColor: theme.palette.background.paper,

    height: "600px",
    width: "600px",
    borderRadius: "4px",
    border: "none",
    padding: theme.spacing(2, 4, 3)
  },
  forgotPasswordPaper: {

    backgroundColor: theme.palette.background.paper,

    height: "400px",
    width: "600px",
    borderRadius: "4px",
    border: "none",
    padding: theme.spacing(2, 4, 3)
  },

  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));


const Modalsd = ({ isOpened }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailTextIssue, setEmailTextIssue] = useState("");
  const [passTextIssue, setPassTextIssue] = useState("");
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(isOpened);
  const [close, setClose] = useState(false)
  const [signInOpen, setSignInOpen] = useState(false)
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false)
  const [cognitoErrorUsername, setcognitoErrorUsername] = useState("");
  const [cognitoErrorPassword, setcognitoErrorPassword] = useState("");
  let navigate = useNavigate();
  const emailInput = useRef();
  const passwordInput = useRef();
  const clearEmail = () => emailInput.current.clear();

  //register
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regCognitoErrorUsername, setRegCognitoErrorUsername] = useState("");
  const [regCognitoErrorPassword, setRegCognitoErrorPassword] = useState("");
  const [regEmailTextIssue, setRegEmailTextIssue] = useState("");
  const [regNameTextIssue, setRegNameTextIssue] = useState("");
  const [regPassTextIssue, setRegPassTextIssue] = useState("");
  const [regConfirmpassTextIssue, setRegConfrimPassTextIssue] = useState("");

  //forgot password
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordEmailTextIssue, setForgotPasswordEmailTextIssue] = useState("");
  const [forgotPasswordCognitoErrorUsername, setForgotPasswordCognitoErrorUsername] = useState("");

  //Reset password
  const [verificationCode, setVerificationCode] = useState("");
  const [resetPassword, setResetPassword] = useState("")
  const [confirmResetPassword, setConfirmResetPassword] = useState('');

  const dispatch = useDispatch();
  const classes = useStyles();
  console.log(isOpened)

  const openSignIn = () => {
    setSignInOpen(true)
    setOpen(false)
  }


  const forgotPasswordSwap = () => {
    setForgotPasswordOpen(true)
    setOpen(false)
  }

  const resetPasswordOpenFunction = () => {
    setResetPasswordOpen(true)
    setOpen(false)
  }

  const emailOnKeyPress = () => {

  };

  let LoginModal = () => {

    useEffect(() => {
      setEmailTextIssue(cognitoErrorUsername)
      setPassTextIssue(cognitoErrorPassword)
    }, [cognitoErrorUsername, cognitoErrorPassword])

    const handleOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
    async function onClickLogin(event) {



      try {
        const user = await Auth.signIn(email, password);

        const info = await Auth.currentUserInfo();
        let userdata = user.attributes;
        userdata.username = user.username;
        userdata.id = info.id;
        setUser(JSON.stringify(userdata));

        dispatch(awsSignIn(userdata));

        navigate('dashboard');

      }
      catch (error) {
        if (error.code === "UserNotFoundException") {
          setcognitoErrorUsername("User does not exist")
        }
        else if (error.code === "UserNotConfirmedException") {
          setcognitoErrorUsername("User Not Confirmed")
        }
        else {
          setcognitoErrorUsername("")
        }
        if (error.code === "NotAuthorizedException") {
          setcognitoErrorPassword("Invalid Password")
        } else {
          setcognitoErrorPassword("")
        }
        if(error.message){
          setcognitoErrorPassword(error.message);
        }
      }
    }
    function setPasswordFocus(event) {
      if (event.key === 'Tab') {
        clearEmail()
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
        onClickLogin()
      }
    }

    function passwordClick(event) {
      if (event.key === 'Enter') {
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

    return (
      <>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={isOpened}

          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500
          }}
        >

          <Fade in={isOpened}>

            <div className={classes.paper}>
              {/* {loading&& <CircularProgress className="spinnerStyle"/>} */}
              <span style={{ float: "right", cursor: "pointer" }} onClick={() => { setOpen(false) }}>x</span>
              <Image size='small' style={{ marginLeft: '190px', marginTop: "80px", marginBottom: "50px" }} />
              <form className={classes.root} Validate autoComplete="off" >
                <label className="labelForIssue">{emailTextIssue}</label>
                <TextField style={{ width: "400px", marginLeft: "40px", }}
                  type="text"
                  required id="standard-required"
                  placeholder="User Name"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  onKeyPress={(event) => { emailOnKeyPress(); setPasswordFocus(event) }}>

                </TextField>


                <label className="labelForIssue"  >{passTextIssue}</label>
                <TextField
                  style={{ width: "400px", marginLeft: "40px", marginTop: "30px" }}
                  placeholder="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  onClick={(event) => { passwordClick(event) }}
                /><br />
                <a href style={{ marginLeft: "350px", marginBottom: "10px", cursor: "pointer" }} onClick={() => { forgotPasswordSwap() }}>Forgot password?</a><br />
                <input
                  type="button"
                  style={{ backgroundColor: "#3372B5", marginLeft: "180px", color: "white", height: "30px", width: "80px", borderRadius: "3px", border: "none" }}
                  onClick={() => { loginClick() }}
                  value="Login" />

                <input style={{ backgroundColor: "white", color: "black", height: "30px", width: "80px", borderRadius: "3px", marginLeft: "20px" }} type="submit" value="SignIn" onClick={() => { openSignIn() }} />

              </form>
            </div>
          </Fade>
        </Modal>
      </>
    )
  }

  let SignInModal = () => {

    useEffect(() => {
      setRegEmailTextIssue(regCognitoErrorUsername)
      setRegPassTextIssue(regCognitoErrorPassword)
    }, [regCognitoErrorUsername, regCognitoErrorPassword])


    const handleOpen = () => {
      setSignInOpen(true);
    };
    const handleClose = () => {
      setSignInOpen(false);
    };
    const onClickRegister = async () => {
      try {

        const signUpResponse = await Auth.signUp({
          username: regEmail.toLowerCase(),
          password: regPassword,
          attributes: {
            email: regEmail,
            name: name
          }
        });
        if (signUpResponse) {
          alert("Registered Succesfully. Please Verify Using Your Email.")
        }
      } catch (error) {
        if (error.code === "InvalidParameterException") {
          setRegCognitoErrorPassword("Password must be at least 8 characters")
        }
        else {
          setRegCognitoErrorPassword("")
        }
        if (error.code === "UsernameExistsException") {
          setRegCognitoErrorUsername("An account with the given email already exists.")
        }
        else if (error.message === "Invalid email address format.") {
          setRegCognitoErrorUsername("Invalid email address format.")
        }
        else {
          setRegCognitoErrorUsername("")
        }

      }
    }
    function setRegPasswordFocus(event) {
      if (event.key === 'Tab') {
        passwordInput.current.focus();
      }
    }

    function validateEmail() {
      if (regEmail === "") {
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
      if (regPassword !== "" && regEmail !== "" && regConfirmPassword !== "" && name !== "") {
        onClickRegister()
      }
    }

    function passwordClick(event) {
      if (event.key === 'Enter') {
        validateName();
        validateEmail();
        validatePass();
        samePassVerify();
        getSignedUp();
      }
    }
    function confirmPasswordClick(event) {
      if (event.key === 'Enter') {
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
            timeout: 500
          }}
        >
          <Fade in={signInOpen}>
            <div className={classes.SignInPaper}><span style={{ float: "right", cursor: "pointer" }} onClick={() => { handleClose() }}>x</span>
              <Image size='small' style={{ marginLeft: '190px', marginTop: "80px", marginBottom: "50px" }} />
              <form /* onSubmit={handleSubmit(onSubmit)} */ className={classes.root} Validate autoComplete="off" >
                <label className="labelForIssue" >{regNameTextIssue}</label>
                <TextField
                  style={{ width: "400px", marginLeft: "80px" }}
                  type="text"
                  required id="standard-required"
                  placeholder="Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                //onKeyPress={nameOnKeyPress}
                />
                <label className="labelForIssue" >{regEmailTextIssue}</label>
                <TextField
                  style={{ width: "400px", marginLeft: "80px" }}
                  type="text"
                  required id="standard-required"
                  placeholder="Email"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  onClick={() => { resetEmailPassIssueText(0) }}
                  onKeyPress={(event) => { emailOnKeyPress() }}
                />
                <label className="labelForIssue" >{regPassTextIssue}</label>
                <TextField
                  style={{ width: "400px", marginLeft: "80px" }}
                  id="standard-password-input"
                  type="password"
                  label="Password"
                  autoComplete="current-password"
                  value={regPassword}
                  onClick={() => { resetEmailPassIssueText(1) }}
                  onChange={e => setRegPassword(e.target.value)}
                  onKeyPress={(event) => { passwordClick(event) }}
                />
                <label className="labelForIssue" >{regConfirmpassTextIssue}</label>
                <TextField
                  style={{ width: "400px", marginLeft: "80px" }}
                  id="standard-password-input"
                  label="ConfirmPassword"
                  type="password"
                  autoComplete="current-password"
                  value={regConfirmPassword}
                  onClick={() => { resetEmailPassIssueText(1) }}
                  onChange={e => setRegConfirmPassword(e.target.value)}
                  onKeyPress={(event) => { confirmPasswordClick(event) }}

                /><br />

                <input style={{ backgroundColor: "white", marginLeft: "230px", marginTop: "20px", color: "black", height: "30px", width: "80px", borderRadius: "3px", border: "none" }} onClick={() => { registerClick() }} value="SignIn" />
              </form>
            </div>
          </Fade>
        </Modal>
      </>
    )
  }
  let ForgotPasswordModal = () => {
    useEffect(() => {
      setForgotPasswordEmailTextIssue(forgotPasswordCognitoErrorUsername)
    }, [forgotPasswordCognitoErrorUsername])

    const emailOnKeyPress = () => {

    };

    const forgotPasswordHandler = async () => {

      try {

        setResetPasswordOpen(true)
        const forgot = await Auth.forgotPassword(forgotPasswordEmail);
        setResetPasswordOpen(true); setOpen(false);




      } catch (error) {

        if (error.code === "UserNotFoundException") {
          setForgotPasswordCognitoErrorUsername("User does not exist")
        }
        else {
          setForgotPasswordCognitoErrorUsername("")

        }
        if(error.message){
          setForgotPasswordCognitoErrorUsername(error.message);
        }

      }
    }

    function validateEmail() {
      if (forgotPasswordEmail === "") {
        setForgotPasswordEmailTextIssue("Please enter a valid email");
      } else {
        setForgotPasswordEmailTextIssue("");
      }
    }
    function getForgotPass() {

      if (forgotPasswordEmail !== "") {
        forgotPasswordHandler()
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
            timeout: 500
          }}
        >
          <Fade in={forgotPasswordOpen}>
            <div className={classes.forgotPasswordPaper}><span style={{ float: "right", cursor: "pointer" }} onClick={() => { handleClose() }}>x</span>
              <Image size='small' style={{ marginLeft: '190px', marginTop: "80px", marginBottom: "50px" }} />
              <form /* onSubmit={handleSubmit(onSubmit)} */ className={classes.root} Validate autoComplete="off" >
                <label className="labelForIssue" >{forgotPasswordEmailTextIssue}</label>
                <TextField
                  style={{ width: "400px", marginLeft: "80px" }}
                  type="text"
                  required id="standard-required"
                  label="Email"
                  placeholder="Email"
                  value={forgotPasswordEmail}
                  onChange={e => setForgotPasswordEmail(e.target.value)}
                  onClick={() => { resetEmailPassIssueText(0) }}
                //onKeyPress={(event) => { emailOnKeyPress(); }}
                />

                <br />

                <input style={{ backgroundColor: "#3372B5", marginLeft: "235px", color: "white", height: "30px", width: "80px", borderRadius: "3px", marginTop: "10px", border: "none" }} onClick={() => { forgotClick() }} value="Next" />


              </form>
            </div>
          </Fade>
        </Modal>
      </>
    )
  }
  let ResetPasswordModal = () => {




    const passwordVerificationHandler = async event => {
      try {
        await Auth.forgotPasswordSubmit(
          forgotPasswordEmail
          , verificationCode,
          resetPassword
        )

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
      } catch (error) {
        console.log(error);
      }
    }

    const passwordOnKeyPress = () => {

    };

    const VerificationcodeOnKeyPress = () => {

    };
    const handleOpen = () => {
      setResetPasswordOpen(true);
    };
    const handleClose = () => {
      setResetPasswordOpen(false);
    };
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
            timeout: 500
          }}
        >
          <Fade in={resetPasswordOpen}>
            <div className={classes.forgotPasswordPaper}><span style={{ float: "right", cursor: "pointer" }} onClick={() => { handleClose() }}>x</span>
              <Image size='small' style={{ marginLeft: '190px', marginTop: "80px", marginBottom: "50px" }} />
              <form /* onSubmit={handleSubmit(onSubmit)} */ className={classes.root} Validate autoComplete="off" >

                <TextField
                  style={{ width: "400px", marginLeft: "80px" }}
                  type="text"
                  required id="standard-required"
                  value={verificationCode}

                  placeholder={'Verification Code'}
                  onChange={e => setVerificationCode(e.target.value)}
                  onKeyPress={VerificationcodeOnKeyPress}
                //onKeyPress={nameOnKeyPress}
                />
                <TextField
                  style={{ width: "400px", marginLeft: "80px" }}
                  type="password"
                  required id="standard-required"
                  value={resetPassword}

                  placeholder={'New password'}
                  onChange={e => setResetPassword(e.target.value)}
                  onKeyPress={passwordOnKeyPress}
                //onKeyPress={nameOnKeyPress}
                />
                <TextField
                  style={{ width: "400px", marginLeft: "80px" }}
                  type="password"
                  required id="standard-required"
                  value={confirmResetPassword}

                  placeholder={'Confirm password'}
                  onChange={e => setConfirmResetPassword(e.target.value)}
                  onKeyPress={VerificationcodeOnKeyPress}
                //onKeyPress={nameOnKeyPress}
                />
                <input onClick={() => { passwordVerificationHandler() }} value="change" />
              </form>
            </div>
          </Fade>
        </Modal>
      </>
    )
  }
  return (
    <div>

      {LoginModal()}
      {SignInModal()}
      {ForgotPasswordModal()}
      {ResetPasswordModal()}

    </div>
  );
};

export default Modalsd;


