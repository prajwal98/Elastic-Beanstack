import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { useDispatch, useSelector } from "react-redux";
import { awsSignOut, authData , awsSignIn} from "../../../redux/auth/authSlice";
import { Link , useNavigate} from "react-router-dom";
import { Button, Dropdown } from "semantic-ui-react";
import "./UserHeader.scss";
import { Constants } from "../../../config/constants";
import { makeStyles } from "@material-ui/core/styles";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Notifications from "../../../assets/images/imageedit_5_9734520186 (1).png";
import Avatar from "@material-ui/core/Avatar";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';



const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  root1: {
    '& > * + *': {
      marginTop: theme.spacing(2), 
    },
    paddingBottom: "15px"
  }
}));



const UserHeader = ({ Bindex }) => {
  const dispatch = useDispatch();
  let userDetails = useSelector(authData);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  let navigate = useNavigate();


  useEffect(() => {
    breadcrumb();
  }, []);


  function breadcrumb() {
    let breadcrumb = [];
    if (userDetails.breadcrumb !== undefined){
      breadcrumb = { ...userDetails.breadcrumb };
    }
    if (Bindex != undefined) {
      let temp = [];
      for (let i = 0; i <= Bindex; i++) {
        temp.push(breadcrumb[i]);
      }
      if (temp !== undefined){
        setBreadcrumbs(temp);
      }
      // alert(JSON.stringify(temp));
      
    }
    // alert(Bindex+JSON.stringify(breadcrumb))
  }

  function signingOut() {
    Auth.signOut();
    dispatch(awsSignOut());
    navigate("/");
  }
  const classes = useStyles();


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="header">
      <div className={classes.root1}>
        {breadcrumbs !== undefined ? 
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        {
        breadcrumbs.map((item,i) => {
          return (
          breadcrumbs.length - 1 !== i ?
          <Link className="bread" to={item.path} >
            {item.name}
          </Link> : <div className="bread1">{item.name}</div>
          )
          })};
        </Breadcrumbs>
        : null}
      </div>
      {/* <div>
        <Link to="/quickTour">
          <Button
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: config.main_color_1,
            }}
            basic
            content="Quick tour"
          // color="blue"
          />
        </Link>
      </div> */}
      <div style={{display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "30px"}}>
      <div>
        <Link to="/notification">
          <img src={Notifications} onClick={() => {let notificationfalse = {...userDetails};notificationfalse.sideactive = "/notification";dispatch (awsSignIn(notificationfalse));}}alt="headerIcon" className="header__icon" />
        </Link>
      </div>
      <div className="header">
      <div style={{ fontSize: "15px", color: "#333333", marginRight: "-20px" }}>
        {userDetails.name}
      </div>
      <Avatar style={{  cursor: "pointer" }} name="user" onClick={handleClick} />
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          style={{ marginTop: "45px", marginLeft: "-15px" }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <Link to={`/faqs`} style={{color: "black", textDecoration: "none"}}><MenuItem style={{ fontSize: "14px", color: "black", textDecoration: "none" }} onClick={() => {let faqfalse = {...userDetails};faqfalse.sideactive = "/faqs";dispatch (awsSignIn(faqfalse));}}>FAQ</MenuItem></Link>
          <MenuItem onClick={() => { signingOut(); }} style={{ fontSize: "14px" }}>Signout</MenuItem>
        </Menu>
        </div>
    </div>
    </div>
  );
};

export default UserHeader;
