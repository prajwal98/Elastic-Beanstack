import React, { useState, useEffect } from "react";
import Footer from "../../../components/Footer/Footer";
import AppHeader from "../../../components/Header/AppHeader";
import "./ContactUs.scss";
import { Link } from "react-router-dom";

import config from "../../../config/aws-exports";
import { Constants } from "../../../config/constants";
import { API } from "aws-amplify";

function ContactUs() {
  const [contactus, setContactus] = useState([]);

  useEffect(() => {
    getpageData();
  }, []);

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

      console.log(dataJSON.contact_us);
      setContactus(dataJSON.contact_us);
    } catch (error) {
      console.log("Error", error);
    }
  }

  let htmlTry =
    "<strong >Contact us</strong><br><br><strong>JSS Medical Institutions Campus</strong><br> Sri Shivarathreeshwara Nagara ";

  return (
    <div>
      <AppHeader />
      <div align="left" style={{ padding: "5% 20% 13% 20%" }}>
        <Link to={`/`}>
          <p
            style={{
              color: config.main_color_1,
              fontSize: "small",
              marginBottom: "30px",
              marginTop: "20px",
            }}
          >
            {" "}
            {`< Back To Home`}
          </p>
        </Link>

        <div style={{ fontSize: "16px" }}>
          <p dangerouslySetInnerHTML={{ __html: contactus }}></p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
export default ContactUs;
