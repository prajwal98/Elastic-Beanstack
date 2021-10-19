import React, { useState } from 'react'
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
import TextField from '@material-ui/core/TextField';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';




import logo from '../../assets/images/logo.jpg'
const schema = yup.object().shape({
  name: yup.string().required(),
  age: yup.number().required(),
});

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
    border: '1px solid #000',
    height: "500px",
    width: "600px",
    borderRadius: "3px",

    padding: theme.spacing(2, 4, 3)
  },
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));


function LoginModal(props) {
  alert("hi", props)
  return (

    <div></div>

    /* const [open, setOpen] = React.useState(false);
    const { errors,register, handleSubmit } = useForm({
        resolver: yupResolver(schema),
      });
      alert(open)
      const classes = useStyles();
    
   
        
       
       
        const handleOpen = () => {
          setOpen(true);
        };
        const handleClose = () => {
          setOpen(false);
        };
        const onSubmit = data => alert(data);
        
        return(
           <>
      <Modal
       aria-labelledby="transition-modal-title"
       aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.open}
        
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}><span style={{float:"right",cursor:"pointer"}} onClick={() => {handleClose()}}>x</span>
          <Image size='small' src={logo} style={{ marginLeft: '190px',marginTop:"80px" ,marginBottom:"50px"}} />
          <form onSubmit={handleSubmit(onSubmit)} className={classes.root} noValidate autoComplete="off" >
            <TextField style={{width:"400px",marginLeft:"80px"}} type="text" required id="standard-required" label="User Name"  placeholder="User Name" ref={register}  name="firstName"/>
            <p>{errors.firstName?.message}</p>
        <TextField
        style={{width:"400px",marginLeft:"80px"}}
          id="standard-password-input"
          label="Password"
          type="password"
       
          ref={register}
          name="age"
        /><br />
        <a style={{marginLeft:"350px"}}>Forgot password?</a><br />
        <input style={{backgroundColor:"#3372B5",marginLeft:"230px", color:"white" , height:"30px",width:"70px",borderRadius:"3px" }} type="submit" value="Login" />
        </form>
          </div>
        </Fade>
      </Modal> */

  )
}


export default LoginModal;