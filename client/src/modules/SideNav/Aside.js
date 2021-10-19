import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authData, awsSignIn, awsSignOut } from "../../redux/auth/authSlice";
import { Auth } from "aws-amplify";
import { Constants } from "../../config/constants";
import config from "../../config/aws-exports";
import DashboardIcon from "../../assets/svgjs/DashboardIcon";
import MyProgramsIcon from "../../assets/svgjs/MyProgramsIcon";
import ReportIcon from "../../assets/svgjs/ReportIcon";
import EventsIcon from "../../assets/svgjs/EventsIcon";
import MyApplicationsIcon from "../../assets/svgjs/MyApplicationsIcon";
import JssLogo from "../../assets/images/logo.jpg";
import edLogo from "../../assets/images/edlogo.png";
import swal from "sweetalert";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";

import { Link, useLocation, useNavigate } from "react-router-dom";

const Aside = ({ toggled, handleToggleSidebar }) => {
  const [active, setactive] = useState("");
  let location = useLocation();
  let navigate = useNavigate();
  let userDetails = useSelector(authData);
  // console.log("path " + JSON.stringify(location))

  const dispatch = useDispatch();

  useEffect(() => {
    setactive(userDetails.sideactive);
    return () => {};
  }, []);

  useEffect(() => {
    get();
    CheckSession();
    return () => {};
  }, [location]);

  async function CheckSession() {
    const sessionCheck = await localStorage.getItem("sessionStore");
    console.log("check", sessionCheck);
    try {
      let session = await Auth.currentSession();
      // alert(JSON.stringify(session))
      if (sessionCheck === null || sessionCheck === false) {
        console.log("session", session);
        if (session == undefined) {
          await localStorage.setItem("sessionStore", true);

          Auth.signOut();
          dispatch(awsSignOut());
          swal("Session Time Out");
        }
      }
    } catch {
      if (sessionCheck === null || sessionCheck === false) {
        await localStorage.setItem("sessionStore", true);

        Auth.signOut();
        dispatch(awsSignOut());
        swal("Session Time Out");
      }
    }
  }

  function get() {
    //  alert(location.pathname)
    let sdata = { ...userDetails };

    if (location.pathname == "/dashboard") {
      sdata.sideactive = "/dashboard";
      dispatch(awsSignIn(sdata));
      setactive("/dashboard");
    } else if (
      location.pathname == "/myPrograms" ||
      location.pathname == "/MyPrograms/programs"
    ) {
      sdata.sideactive = "/myPrograms";
      dispatch(awsSignIn(sdata));
      setactive("/myPrograms");
    } else if (location.pathname == "/event") {
      sdata.sideactive = "/event";
      dispatch(awsSignIn(sdata));
      setactive("/event");
    }
  }

  function setClass(val) {
    let sdata = { ...userDetails };
    sdata.sideactive = val;
    dispatch(awsSignIn(sdata));
    setactive(val);
  }

  let key = "y4w7sUpFysaA1PiVUrYz_qJNXjiF4NVSRCVDIJcMZk3CyrXV";
  let oid = config.aws_org_id;
  let t1 = "1618471200";
  let t2 = "1618478400";
  let eid = userDetails.eid;

  console.log("key", key.concat(oid, t1, t2, eid));

  return (
    <ProSidebar
      toggled={toggled}
      breakPoint="md"
      onToggle={handleToggleSidebar}
      style={styles.headerStyle}
    >
      <SidebarHeader>
        <div
          style={{
            padding: "24px 0px 24px 0px ",
            textTransform: "uppercase",
            fontWeight: "bold",
            //fontSize: 14,
            letterSpacing: "1px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Link
            to="/dashboard"
            className="sidebar-btn"
            rel="noopener noreferrer"
            onClick={() => {
              setClass("/dashboard");
            }}
          >
            <img
              src={`https://${
                config.DOMAIN
              }/${config.aws_org_id.toLowerCase()}-resources/images/org-images/logo-light.jpg`}
              alt=""
              style={{ height: "7.5rem", width: "auto" }}
            />
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <Menu>
          <MenuItem
            className={`${
              active === "/dashboard" ? "side-nav__item--active" : "null"
            }`}
            icon={<DashboardIcon className="side-nav__icon" />}
            onClick={() => {
              setClass("/dashboard");
            }}
          >
            {/* side-nav__item--active */}
            Dashboard
            <Link to="/dashboard" />
          </MenuItem>

          <MenuItem
            className={`${
              active === "/myPrograms" ? "side-nav__item--active" : "null"
            }`}
            icon={<MyProgramsIcon className="side-nav__icon" />}
            onClick={() => {
              setClass("/myPrograms");
            }}
          >
            My Programs
            <Link to="/myPrograms" />
          </MenuItem>

          {/* <MenuItem
            className={`${
              active === "/reportsAndAnalytics"
                ? "side-nav__item--active"
                : "null"
            }`}
            icon={<ReportIcon className="side-nav__icon" />}
            onClick={()=>{setClass("/reportsAndAnalytics")}}
          >
            Reports & Analytics
            <Link to="/reportsAndAnalytics" />
          </MenuItem> */}

          <MenuItem
            className={`${
              active === "/event" ? "side-nav__item--active" : "null"
            }`}
            icon={<EventsIcon className="side-nav__icon" />}
            onClick={() => {
              setClass("/event");
            }}
          >
            Calendar
            <Link to="/event" />
          </MenuItem>

          <MenuItem
            className={`${
              active === "/reports" ? "side-nav__item--active" : "null"
            }`}
            icon={<ReportIcon className="side-nav__icon" />}
            onClick={() => {
              setClass("/reports");
            }}
          >
            Reports
            <Link to="/reports" />
          </MenuItem>

         {/*     <MenuItem
            className={`${
              active === "/myApplication" ? "side-nav__item--active" : "null"
            }`}
            icon={<MyApplicationsIcon className="side-nav__icon" />}
            onClick={() => {
              setClass("/myApplication");
            }}
          >
            My Applications
            <Link to="/myApplication" />
          </MenuItem> */}

          {/*   <MenuItem
            className={`${
              active === "/allPrograms" ? "side-nav__item--active" : "null"
            }`}
            icon={<MyApplicationsIcon className="side-nav__icon" />}
            onClick={()=>{setClass("/allPrograms")}}
          >
            All Programs
            <Link to="/allPrograms" />
          </MenuItem> */}
        </Menu>
      </SidebarContent>

      <SidebarFooter style={{ textAlign: "center" }}>
        <div
          className="sidebar-btn-wrapper"
          style={{
            padding: "20px 24px",
          }}
        >
          <a
            href="https://enhanzed.com/"
            target="_blank"
            className="sidebar-btn"
            rel="noopener noreferrer"
          >
            <div className="legal">
              <p>&copy; 2021</p>
              Powered by <img src={edLogo} alt="" />
            </div>
          </a>
        </div>
      </SidebarFooter>
    </ProSidebar>
  );
};

export default Aside;

let styles = {
  headerStyle: {
    backgroundImage: config.platform_main_theme,
  },
};
