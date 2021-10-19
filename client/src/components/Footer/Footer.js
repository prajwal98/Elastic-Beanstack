import React from "react";
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
import footerStyle from "./Footer.module.scss";
import logo from "../../assets/images/logo.jpg";
import { Constants } from "../../config/constants";
import config from "../../config/aws-exports";

import edLogo from "../../assets/images/edlogo.png";
function Footer() {
  return (
    <div>
      <Menu
        secondary
        fixed="bottom"
        className={footerStyle.footerStyle}
        style={styles.footerStyle}
      >
        <div style={{ height: "100%", width: "auto", padding: "10px" }}>
          <Image
            size="small"
            src={`https://${config.DOMAIN
              }/${config.aws_org_id.toLocaleLowerCase()}-resources/images/org-images/logo-light.jpg`}
            style={{
              marginRight: "1.5em",
              height: "100%",
              width: "auto",
            }}
          />
        </div>
        <Menu.Item
          position="right"
          className="sidebar-btn-wrapper"
          style={{
            padding: "8px 24px",
            float: "right",
          }}
        >
          <a
            href="https://enhanzed.com/"
            target="_blank"
            className="sidebar-btn"
            rel="noopener noreferrer"
          >
            <div className="legal" style={{ fontSize: "14px" }}>
              &copy; 2021 Powered by <img src={edLogo} alt="" />
            </div>
          </a>
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default Footer;

let styles = {
  footerStyle: {
    backgroundImage: config.platform_main_theme,
    height: "50px ",
    fontSize: "17px ",

  },
};
