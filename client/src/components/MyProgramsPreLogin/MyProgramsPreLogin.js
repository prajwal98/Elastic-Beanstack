import React, { Component, useState, useEffect } from "react";
import { Tab } from "semantic-ui-react";
import Rating from "@material-ui/lab/Rating";
import InstructorsCard from "../../modules/Cards/Instructors/InstructorsCard";

import "../../modules/Tabs/Tabs.scss";
import AppHeader from "../Header/AppHeader";
import config from "../../config/aws-exports";
import { Constants } from "../../config/constants";
import { API } from "aws-amplify";
import Footer from "../Footer/Footer";
import bio from "../../assets/images/P1 - PG Diploma in bioinformatics.jpg";

import Rupee from "../../assets/svgjs/Rupee";
import PlaceholderParagraph from "../../modules/Placeholder/PlaceholderParagraph";

import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import ClockOrange from "../../assets/svgjs/ClockOrange";

import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import img1 from '../../assets/images/1img.png';
import img2 from '../../assets/images/2img.png';
import img3 from '../../assets/images/3img.png';
import img4 from '../../assets/images/4img.png';
import img5 from '../../assets/images/5img.png';


import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Link, useNavigate } from "react-router-dom";
import myProgPreLoginStyle from "./MyProgramsPreLogin.module.scss";
import { height } from "@material-ui/system";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",

    "& .MuiAccordionDetails-root": {
      display: "block",
    },
  },
  heading: {
    fontSize: theme.typography.pxToRem(13),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

function MyProgramsPreLogin() {
  const classes = useStyles;
  const [activeIndex, setActiveIndex] = useState(0);
  const [programsJSON, setProgramsJSON] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [value, setValue] = React.useState(4);

  useEffect(() => {
    getProgramJson();
  }, []);
  console.log("prog", programsJSON);
  let htmlT =
    ` <table style='width: 100%;;border: 3px solid black ' >
    <tr style='border: 1px solid black;padding:10px'>
    <th style='padding:10px'>Diploma in Pharmacy (Part-I)</th>
    </tr>
    <th style='border: 1px solid black ;padding:10px' rowspan='2'>Subject</th> 
    <th style='border: 1px solid black ;padding:10px' colspan='2'>Theory</th>
    <th colspan='2' style='border: 1px solid black ;padding:10px'  >Practical</th>
    </tr>
    <tr>
    <td style='border: 1px solid black ;padding:10px'>Hrs/week</td>
    <td style='border: 1px solid black ;padding:10px'>Hrs/year</td>
    <td style='border: 1px solid black ;padding:10px'>Hrs/week</td>
    <td style='border: 1px solid black ;padding:10px'>Hrs/week</td>
    </tr>
    <tr>
    <td style='border: 1px solid black ;padding:10px;'><img style='height: 200px;padding-right:20px' src = ${img1}/>Subject 1</td>
    <td style='border: 1px solid black ;padding:10px;text-align:center'>75</td>
    <td style='border: 1px solid black ;padding:10px;text-align:center'>3</td>
    <td style='border: 1px solid black ;padding:10px;text-align:center'>100</td>
    <td style='border: 1px solid black ;padding:10px;text-align:center'>4</td>
    </tr>
    <tr>
    <td style='border: 1px solid black ;padding:10px'><img style='height: 200px;padding-right:20px' src = 'https://d1if2pjtoq2sst.cloudfront.net/learned-resources/images/org-images/logo-light.jpg' />Subject 2</td>
    <td style='border: 1px solid black ;padding:10px; text-align:center'>75</td>
    <td style='border: 1px solid black ;padding:10px;text-align:center'>1</td> 
    <td style='border: 1px solid black ;padding:10px;text-align:center'>100</td>
    <td style='border: 1px solid black ;padding:10px;text-align:center'>1</td>
    </tr>
    <tr>
    <td style='border: 1px solid black ;padding:10px'><img style='height: 200px;padding-right:20px' src = ${img3}/>Subject 3</td>
    <td style='border: 1px solid black ;padding:10px;text-align:center'>75</td>
    <td style='border: 1px solid black ;padding:10px;text-align:center'>1</td>
    <td style='border: 1px solid black ;padding:10px;text-align:center'>100</td>
    <td style='border: 1px solid black ;padding:10px;text-align:center'>1</td>
    </tr>
    <tr><td style='border: 1px solid black ;padding:10px'><img style='height: 200px;padding-right:20px' src = ${img4}/>Subject 4</td>
    <td style='border: 1px solid black ;padding:10px;text-align:center'>75</td>
    <td style='border: 1px solid black ;padding:10px;text-align:center'>1</td>
    <td style='border: 1px solid black ;padding:10px;text-align:center'>100</td>
    <td style='border: 1px solid black ;padding:10px;text-align:center'>1</td>
    </tr>
    <tr><td style='border: 1px solid black ;padding:10px'><img style='height: 200px;padding-right:20px' src = ${img5}/>Subject 5</td>
    <td style='border: 1px solid black ;padding:10px;text-align:center'>75</td>
    <td style='border: 1px solid black ;padding:10px;text-align:center'>1</td>
    <td style='border: 1px solid black ;padding:10px;text-align:center'>100</td>
    <td style='border: 1px solid black ;padding:10px;text-align:center'>1</td>
    </tr>
    <tr><td style='border: 1px solid black ;padding:10px;'></td>
    <td style='border: 1px solid black ;padding:10px;text-align:center'>400</td>
    <td style='border: 1px solid black ;padding:10px;text-align:center'>16</td>
    <td style='border: 1px solid black ;padding:10px;text-align:center'>375</td>
    <td style='border: 1px solid black ;padding:10px;text-align:center'>15</td>
    </tr>
    </table> `;

  const panes = [
    {
      menuItem: "Overview",
      render: () => (
        <Tab.Pane className={myProgPreLoginStyle.overview}>
         <div style={{width:"100%",display:"inline-block"}}>
         <img style={{
             height:"200px",float:"right",marginLeft:"2rem",width:"300px"}} alt=""  src={`https://${
              config.DOMAIN
            }/${config.aws_org_id.toLowerCase()}-resources/images/program-images/${
              programsJSON.pid
            }.png`} />
       
            {isLoading ? (
              <div style={{ width: "100%", overflow: "hidden" }}>
                <PlaceholderParagraph />
              </div>
            ) : (
              <div><p
                className={myProgPreLoginStyle.p_text}
                dangerouslySetInnerHTML={{ __html: programsJSON.poverview }}
              ></p>
            </div>
            )}
            {programsJSON.pinstructors !== undefined && programsJSON.pinstructors.length > 0 && <div className="instructors">
                <div className="instructors__h1">
                  <h2 style={{ marginLeft: "20px", marginTop: "20px" }}>
                    Program Instructors
                  </h2>
                </div>
                <div>
                  <div
                    className="card-container"
                    style={{ float: "left", marginLeft: "50px" }}
                  >
                    {programsJSON.pinstructors.map(
                      ({ name, designation, org, pic }, idx) => (
                        <InstructorsCard
                          key={idx}
                          name={name}
                          designation={designation}
                          org={org}
                          pic={pic}
                          pid={programsJSON.pid}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>}
<h2
              style={{ fontSize: "18px" }}
              className={myProgPreLoginStyle.h2_margin}
            >
              Duration of Program
            </h2>
            {isLoading ? (
              <div style={{ width: "100%", overflow: "hidden" }}>
                <PlaceholderParagraph />
              </div>
            ) : (
              <p
                className={myProgPreLoginStyle.p_text}
                dangerouslySetInnerHTML={{ __html: programsJSON.pfeatures }}
              ></p>
            )}
             <hr style={{width:"70%"}} />
          <div>
            <h2
              style={{ fontSize: "18px" }}
              className={myProgPreLoginStyle.h2_margin}
            >
              Medium of instruction and examinations
            </h2>
            {isLoading ? (
              <PlaceholderParagraph />
            ) : (
              <p
                className={myProgPreLoginStyle.p_text}
                dangerouslySetInnerHTML={{ __html: programsJSON.poutcomes }}
              ></p>
            )}
          </div>

         
         </div>
        </Tab.Pane>
      ),
    },
    /* {
      menuItem: "Instructors",
      render: () => (
        <Tab.Pane>
          <div>
            <div>
              <div className="instructors">
                <div className="instructors__h1">
                  <h2
                    style={{
                      marginLeft: "20px",
                      marginTop: "20px",
                      fontSize: "18px",
                    }}
                  >
                    Program coordinators
                  </h2>
                </div>
                <div>
                  <div
                    className="card-container"
                    style={{ float: "left", marginLeft: "50px" }}
                  >
                    {programsJSON.pinstructors.map(
                      ({ name, designation, org, pic }, idx) => (
                        <InstructorsCard
                          key={idx}
                          name={name}
                          designation={designation}
                          org={org}
                          pic={pic}
                          pid={programsJSON.pid}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              {programsJSON.ccoordinator === undefined ? (
                <div></div>
              ) : (
                <div className="instructors">
                  <div className="instructors__h1">
                    <h2
                      style={{
                        marginLeft: "20px",
                        marginTop: "20px",
                        fontSize: "18px",
                      }}
                    >
                      Course coordinators
                    </h2>
                  </div>
                  <div>
                    <div
                      className="card-container"
                      style={{ float: "left", marginLeft: "50px" }}
                    >
                      {programsJSON.ccoordinator.map(
                        ({ name, designation, org, pic }, idx) => (
                          <InstructorsCard
                            key={idx}
                            name={name}
                            designation={designation}
                            org={org}
                            pic={pic}
                            pid={programsJSON.pid}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {programsJSON.cmentor === undefined ? null : (
              <div className="instructors">
                <div className="instructors__h1">
                  <h2
                    style={{
                      marginLeft: "20px",
                      marginTop: "20px",
                      fontSize: "18px",
                    }}
                  >
                    Course Mentor
                  </h2>
                </div>
                <div>
                  <div
                    className="card-container"
                    style={{ float: "left", marginLeft: "50px" }}
                  >
                    {programsJSON.cmentor.map(
                      ({ name, designation, org, pic }, idx) => (
                        <InstructorsCard
                          key={idx}
                          name={name}
                          designation={designation}
                          org={org}
                          pic={pic}
                          pid={programsJSON.pid}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Tab.Pane>
      ),
    }, */
    {
      menuItem: "Curriculum",
      render: () => (
        <Tab.Pane>
           {programsJSON
            ? programsJSON.pcurriculum.map(
                ({ tlabel, tduration, ttitle, tunits, tid }) => (
                  <div className={myProgPreLoginStyle.pcurriculum}>
                    <div className={myProgPreLoginStyle.courses_container}>
                      <div className={myProgPreLoginStyle.ID_container}>
                        <div
                          className={myProgPreLoginStyle.image_container}
                          style={{
                            backgroundImage: `url('https://${
                              config.DOMAIN
                            }/${config.aws_org_id.toLowerCase()}-resources/images/topic-images/${tid}.png')`,
                          }}
                        ></div>
                        <div className={myProgPreLoginStyle.details_container}>
                          <div>
                            <h3
                              style={{ fontSize: "15px", marginBottom: "10px" }}
                            >
                              {tlabel}
                            </h3>
                            <h2
                              style={{ fontSize: "15px", fontWeight: "bold" }}
                            >
                              {ttitle}
                            </h2>
                          </div>
                          <div>
                            <p style={{ marginTop: "-12px" }}>
                              <span>
                                <ClockOrange
                                  className={myProgPreLoginStyle.clock_size__s}
                                  cls1={myProgPreLoginStyle.cls1_s}
                                  cls2={myProgPreLoginStyle.cls2_s}
                                />
                              </span>
                              <span style={{ fontSize: "small" }}>
                                {tduration} Weeks
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                )
              )
            : null}
          
        </Tab.Pane>
      ),
    },
    /*  {
      menuItem: "FAQs",
      render: () => (
        <Tab.Pane>
          <div style={{ paddingBottom: "22%" }}>
            {programsJSON
              ? programsJSON.pfaq.map(({ title, questions }, idx) => (
                  <div className={classes.root} key={idx}>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography className={classes.heading}>
                          <h2 style={{ fontSize: "15px", fontWeight: "bold" }}>
                            {title}
                          </h2>
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {questions.map(({ ques, ans }, id) => (
                          <div className={classes.root} key={id}>
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                              >
                                <h3 style={{ fontSize: "15px" }}>{ques}</h3>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Typography style={{ fontSize: "13px" }}>
                                  {ans}
                                </Typography>
                              </AccordionDetails>
                            </Accordion>
                          </div>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  </div>
                ))
              : null}
          </div>
        </Tab.Pane>
      ),
    }, */
  ];
  console.log("aaaa", localStorage.getItem("bpid"));
  console.log("aaaa", localStorage.getItem("pid"));
  const handleTabChange = (e, { activeIndex }) => setActiveIndex(activeIndex);
  async function getProgramJson() {
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        bpid: localStorage.getItem("bpid"),
        pid: localStorage.getItem("pid"),
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    
    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.GET_PROGRAM,
        bodyParam
        //`${Constants.GET_MY_PROGRAMS}`, bodyParam,
      );
      const programsJSON = response;
      console.log(programsJSON);
      setProgramsJSON(programsJSON);

      setIsLoading(false);
    } catch (error) {
      console.log("getCategoryError", error);
    }
    
  }
  return (
    <div>
      <div style={{ marginTop: "10rem" }}>
        <AppHeader />
      </div>

      <div className={myProgPreLoginStyle.overview}>
        <div className={myProgPreLoginStyle.overview__h1}>
          <Link to={`/`}>
            <p
              style={{
                color: config.main_color_1,
                fontSize: "small",
                marginTop: "-20px",
                marginBottom: "20px",
                textDecoration: "none",
              }}
            >{`< Back To Home`}</p>
          </Link>
          <Typography component="div" key="h2" variant="h2">
            {isLoading ? (
              <Skeleton />
            ) : (
              <h1 style={{ fontSize: "20px", marginBottom: "20px" }}>
                <strong> {programsJSON.pname}</strong>
              </h1>
            )}
          </Typography>
        </div>
      {/*   <div className={myProgPreLoginStyle.overview__card}>
          <div className={myProgPreLoginStyle.overview__cardContent}>
            <div className={myProgPreLoginStyle.content}></div>
          </div>
          {isLoading ? (
            <Skeleton variant="rect" width="100%">
              <div style={{ paddingTop: "57%" }} />
            </Skeleton>
          ) : (
            <div className={myProgPreLoginStyle.overview__cardImage}>
              <img
                style={{
                  backgroundImage: `url('https://${
                    config.DOMAIN
                  }/${config.aws_org_id.toLowerCase()}-resources/images/program-images/${
                    programsJSON.pid
                  }.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
                alt=""
              />
            </div>
          )}
        </div> */}
      </div>

      <div className={myProgPreLoginStyle.tabMargin}>
        {isLoading === false ?
        <Tab
          panes={panes}
          activeIndex={activeIndex}
          onTabChange={handleTabChange}
          style={{height: "70vh", overflowY: "auto"}}
        /> : <div style={{display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: 800}}><Skeleton height={800} width="100%" style={{marginTop: "-350px"}}/></div>}
      </div>
      <Footer />
    </div>
  );
}

// class MyProgramsPreLogin extends Component {
//   state = {
//     activeIndex: 0,
//     programsJSON: [],
//     isLoading: true,
//   };

//   async componentDidMount() {

//   }

//   render() {
//     const { activeIndex, programsJSON, isLoading } = this.state;
//     const classes = this.useStyles;
//     console.log("render");

//     return (

//     );
//   }
// }

export default MyProgramsPreLogin;
