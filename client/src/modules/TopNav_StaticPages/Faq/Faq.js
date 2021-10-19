// Dependencies imports
import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { API } from "aws-amplify";
import { Tab } from 'semantic-ui-react';
import Skeleton from '@material-ui/lab/Skeleton';
import { Link } from 'react-router-dom';

// Local imports
import Footer from "../../../components/Footer/Footer";
import AppHeader from "../../../components/Header/AppHeader";
import { Constants } from "../../../config/constants";
import config from "../../../config/aws-exports";
import { ReactComponent as BackArrow } from '../../../assets/svg/arrow_back_black_24dp.svg';

// style imports
import Faq from "./Faq.module.scss";


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    paddingTop: "20px",
    height:"60vh",
    overflowY:"auto"
  },
  heading: {
    fontSize: "16px",
    color: config.main_color_1,
    fontWeight: theme.typography.fontWeightRegular,
  },
  heading2: {
    fontSize: "12px",
    color: config.main_color_1,
    fontWeight: theme.typography.fontWeightRegular,
  },
}));




// Start of main Faq component
const Faqs = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [faq, setFaq] = useState({});
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    getFaq();
  }, []);

  const scrollRef = useRef();

  const accRef = useRef();

  // API for faq
  async function getFaq() {
    setLoading(true);
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
        Constants.GET_FAQ,
        bodyParam
      );
      setFaq(response);
      console.log(response);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    scrollRef.current.scrollTo(0, (document.getElementById("acc"+panel).offsetTop));
  };

  function mapFunction(data) {

    return (
      <div className={classes.root} ref={scrollRef}>
        {data.map((item, idx) => {
          return (
            <Accordion
            key={idx}
            expanded={expanded === `${idx}`}
            onChange={handleChange(`${idx}`)}
            ref={accRef} 
            id={"acc"+idx}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>{item.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {item.value.map((subitem1) => {
                  if (subitem1.value == undefined) {
                    return (
                      <Typography style={{fontSize: "14px", fontWeight: "400px" , paddingTop: "5px"}}>
                        {subitem1.title}
                      </Typography>
                    );
                  }
                  else {
                    return (
                      <div>
                          <h3 className={classes.heading} style={{marginTop: "10px"}}>{subitem1.title}</h3>
                          {subitem1.value.map((subitem2) => {
                          return(
                          <h4 style={{fontSize: "14px", fontWeight: "400px" , paddingTop: "10px"}}>
                            {subitem2.title}
                          </h4>)})}
                      </div>
                    )
                  }
                })}

              </AccordionDetails>
            </Accordion>
          )
        })}
      </div>
    );
  };

  const panes = [
    {
      menuItem: 'Student',
      render: () => (
        <Tab.Pane >
          {mapFunction(faq.Student)}
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Instructor',
      render: () => (
        <Tab.Pane >
          {mapFunction(faq.Instructor)}
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Program Coordinator',
      render: () => (
        <Tab.Pane >
          {mapFunction(faq["Program coordinator"])}
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Admin',
      render: () => (
        <Tab.Pane >
          {mapFunction(faq.Admin)}
        </Tab.Pane>
      ),
    }
  ];


  return (
    <div className={Faq.maincontainer} >
      <AppHeader />
      <div className={Faq.subcontainer} >
      <div className={Faq.backbuttonholder}>
            <Link to={`/`} style={{display: "flex", alingItems: "center", justifyContent: "flex-start", gap: "3px",fontSize:"14px", fontWeight: "bold", fontFamily:"nunito"}}><BackArrow className={Faq.backbutton}/>Back to Home</Link>
        </div>
        <div className={Faq.headingholder}>
          <h3 className={Faq.heading}>FAQs</h3>
        </div>
        {loading === false ?
        <Tab panes={panes} style={{ marginTop: "20px" }} onTabChange={() => {setExpanded(0)}}/> : <div style={{width:"100%", height:"500px", display:"flex", alignItems:"flex-start", justifyContent:"flex-start"}}><Skeleton width="100%" height={700} style={{marginTop:"-150px"}}/></div>}
      </div>
      <Footer />
    </div>
  );
};

export default Faqs;