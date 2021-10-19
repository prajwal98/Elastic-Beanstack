import React, { useEffect, useState } from "react";
import config from "../../../config/aws-exports";
import { API } from "aws-amplify";
import { Constants } from "../../../config/constants";

import { useSelector} from "react-redux";
import { authData } from "../../../redux/auth/authSlice";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Paper from "@material-ui/core/Paper";

import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import UserHeader from "../../Header/UserHeader/UserHeader";
import announceStyle from "./Announcements.module.scss";
import { FaBars } from "react-icons/fa";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: "3%"

  },
  inline: {
    display: 'inline',
    float: "left"
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  demo: {
    backgroundColor: theme.palette.background.paper
  }
}));

function generate(element) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value
    })
  );
}
export default function Announcements({ handleToggleSidebar }) {
  const classes = useStyles();
  let userDetails = useSelector(authData);
  alert(JSON.stringify(userDetails))

  useEffect(() => {
    getAnnouncementLoad();
  }, []);

  async function getAnnouncementLoad() {
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        bpid: userDetails.bid,
        rtype: "get"
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.GET_ANNOUNCEMENTS,
        bodyParam
      );
      const AnnouncementsJSON = response;
      console.log("Announce", AnnouncementsJSON);
    } catch (error) {
      console.error(error);
    }
  }
  return (

    <main>
      <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
        <FaBars />
      </div>
      <UserHeader />

      <div className="container" style={{ height: "100vh" }}>
        <p>Announcements - MBA in Hospital Administrations</p>
        <div className={classes.root}>
          <Grid item xs={12}  >
            <Paper className={classes.paper}>
              <div className={classes.demo}>
                <List>
                  {generate(
                    <div>
                      <ListItem alignItems="flex-start"  >
                        <ListItemAvatar>

                        </ListItemAvatar>
                        <ListItemText style={{ marginTop: "30px" }}
                          primary="22/02/2021"
                          secondary={
                            <React.Fragment>


                              {" Topic title "}
                              <br />
                              <Typography
                                component="span"
                                variant="body2"

                                color="textPrimary"
                              >
                                description about the upcomming announcement
              </Typography>


                            </React.Fragment>

                          }
                        />
                      </ListItem>
                      <hr style={{ marginBottom: "20px" }} />
                    </div>,

                  )}
                </List>
              </div>
            </Paper>
          </Grid>
        </div>
      </div>
    </main>

  );
}
