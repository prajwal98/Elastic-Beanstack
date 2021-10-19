import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import BreadcrumbShorthand from "../../modules/Breadcrumb/BreadcrumbShorthand";

import RatingStar from "../../modules/Rating/Rating";

import { FaBars } from "react-icons/fa";
// import CourseTab from "../../components/Tabs/courseTab";
import "./Management.scss";
import UserHeader from "../../components/Header/UserHeader/UserHeader";

import ClockGray from "../../components/SVG/ClockGray";
import { Constants } from "../../config/constants";
import config from "../../config/aws-exports";
import { API } from "aws-amplify";
import CourseTab from "../../components/Tabs/courseTab";
import { Tab } from "semantic-ui-react";
import CourseStructure from "../../components/CourseStructure/CourseStructure";
import Discussion from "../../components/CourseStructure/Discussion/Discussion";
import Assessment from "../../modules/Assessment/Assessment";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
}));

function Management({ handleToggleSidebar }) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [topics, setTopics] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const api = "https://jsonplaceholder.typicode.com/users";
  useEffect(() => {
    getTopics();
    console.log("useEffect");
  }, [api, topics]);
  async function getTopics() {
    fetch(api)
      .then((res) => res.json())
      .then((users) => setTopics(users));
    // const bodyParam = {
    //   body: {
    //     oid: config.aws_org_id,
    //     btopicid: "CR0750135698526",
    //     eid: "154dbad3-f3d8-45ad-9519-2dbf628afd95",
    //     topicid: "CR075",
    //   },
    //   headers: {
    //     "Content-Type": "application/json",
    //     Accept: "application/json",
    //   },
    // };
    // try {
    //   console.log(bodyParam);
    //   const response = await API.post(
    //     config.aws_cloud_logic_custom_name,
    //     Constants.GET_TOPIC,
    //     bodyParam
    //   );
    //   const topicsJSON = JSON.parse(JSON.stringify(response.nuggets));
    //   console.log(response);
    //   setTopics(topicsJSON);
    //   setIsLoading(false);
    // } catch (error) {
    //   console.error(error);
    // }
  }

  const panes = [
    {
      menuItem: "Course structure",
      render: () => (
        <Tab.Pane>
          {/* <pre>{JSON.stringify(topics, null, 2)}</pre> */}
          {topics.map((topic, idx) => (
            <Accordion
              expanded={expanded === `${idx}`}
              onChange={handleChange(`${idx}`)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography className={classes.heading}>
                  {topic.name}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{topic.username}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Discussion",
      render: () => (
        <Tab.Pane active={true}>
          <Discussion />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Assessment",
      render: () => (
        <Tab.Pane>
          <Assessment />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Live Structure",
      render: () => <Tab.Pane>Tab 3 Content</Tab.Pane>,
    },
  ];
  return (
    <main>
      <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
        <FaBars />
      </div>
      <UserHeader />
      <div className="text-align">
        <BreadcrumbShorthand />
      </div>
      <div className="management">
        <div className="h1">
          <h1>
            <strong>Management principles and practice</strong>
          </h1>
        </div>
        <div className="management-info">
          <div className="flex-box">
            <div className="flex-box__container">
              <div className="time-line">
                <div>
                  <span>
                    <ClockGray className="clock-size" cls1="cls1" cls2="cls2" />
                  </span>
                  <p>26 weeks</p>
                </div>
                <div>
                  <p>
                    <RatingStar />
                  </p>
                </div>
                <div>
                  <p>500 students</p>
                </div>
              </div>
              <div>
                <p>
                  Author: <strong>Mr.Shekar</strong>
                </p>
              </div>
              <div>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Deleniti placeat assumenda veritatis itaque voluptatibus natus
                  ex illum consequuntur aut fugiat? Eligendi iure voluptates
                  impedit hic quam fugit eum qui laborum. Lorem ipsum dolor sit
                  amet consectetur adipisicing elit. Deleniti placeat assumenda
                  veritatis itaque voluptatibus natus ex illum consequuntur aut
                  fugiat? Eligendi iure voluptates impedit hic quam fugit eum
                  qui laborum.
                </p>
              </div>
            </div>

            <div className="management__image"></div>
          </div>
        </div>
        {/* {topics.map((topic) => console.log(topic.unit))} */}
        <Tab panes={panes} />
      </div>
    </main>
  );
}

export default Management;
