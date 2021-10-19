import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import Cryptr from "cryptr";
import { awsSignIn, authData } from "../../redux/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { Constants } from "../../config/constants";
import config from "../../config/aws-exports";
import moment from "moment";

import SideNav from "../../modules/SideNav/SideNav";
import UserHeader from "../Header/UserHeader/UserHeader";

import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Paper from "@material-ui/core/Paper";

import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";

import Grid from "@material-ui/core/Grid";

import DeleteIcon from "@material-ui/icons/Delete";

import notificationStyle from "./Notification.module.scss";
import { FaBars } from "react-icons/fa";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: "3%",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
}));

function Notification({ handleToggleSidebar }) {
  let userDetails = useSelector(authData);
  const [notificationData, setNotificationData] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    let notificationfalse = {...userDetails};
    notificationfalse.sideactive = "/notification";
    dispatch (awsSignIn(notificationfalse));
    getNotification();
  }, []);

  async function getNotification() {
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
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.GET_NOTIFICATIONS,
        bodyParam
      );
      const Notification = response;
      setNotificationData(Notification);
      console.log("Notify", Notification);
    } catch (error) {
      console.error(error);
    }
  }

  //console.log("DC",notificationData.notifications)
  const classes = useStyles();
  return (
    <main>
      <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
        <FaBars />
      </div>
      <UserHeader />
      <div className="container" style={{ height: "100vh" }}>
        <p style={{ fontSize: "large" }}>Notifications</p>
        <div className={classes.root}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <div className={classes.demo}>
                {notificationData.notifications === false ||
                notificationData.notifications === undefined ? (
                  <div style={{ fontSize: "medium" }}>No notifications yet</div>
                ) : (
                  <List>
                    {notificationData.notifications.map((notify) => {
                      return (
                        <div>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar></Avatar>
                              {/*  <span className="profileName">Profile</span>
                              <br />
                              <span className="role">Role</span> */}
                            </ListItemAvatar>
                            <div>
                              <div>
                                <div style={{ fontSize: "15px" }}>
                                  {notify.title}
                                </div>

                                <div style={{ fontSize: "13px" }}>
                                  {notify.msg}
                                </div>
                                {notify.link === undefined ? null : (
                                  <div>
                                    Link :{" "}
                                    <a target="_blank" href={notify.link}>
                                      {" "}
                                      {notify.link}
                                    </a>{" "}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              {/*  <p style={{ justifyContent: "flex-end" }}>
                                {moment(notify.time).fromNow()}
                              </p> */}
                            </div>
                          </ListItem>
                          <hr style={{ marginBottom: "20px" }} />
                        </div>
                      );
                    })}
                  </List>
                )}
              </div>
            </Paper>
          </Grid>
        </div>
      </div>
    </main>
  );
}
export default Notification;
