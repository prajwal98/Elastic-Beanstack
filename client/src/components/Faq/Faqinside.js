// Dependencies imports
import React, { useState, useEffect, useRef} from "react";
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useSelector, useDispatch } from "react-redux";
import { authData, awsSignIn, awsSignOut } from "../../redux/auth/authSlice";
import { API } from "aws-amplify";
import { Tab } from 'semantic-ui-react';
import Skeleton from '@material-ui/lab/Skeleton';
import { Link } from 'react-router-dom';

// Local imports
import { ReactComponent as BackArrow } from '../../assets/svg/arrow_back_black_24dp.svg';
import { Constants } from "../../config/constants";
import config from "../../config/aws-exports";
import UserHeader from "../Header/UserHeader/UserHeader";

// style imports
import Faq from "./Faqinside.module.scss";


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    paddingTop: "20px"
  },
  heading: {
    fontSize: "16px",
    color: config.main_color_1,
    fontWeight: theme.typography.fontWeightRegular,
    fontFamily: "nunito",
  },
  heading2: {
    fontSize: "12px",
    color: config.main_color_1,
    fontWeight: theme.typography.fontWeightRegular,
    fontFamily: "nunito"
  },
}));




// Start of main Faq component
const Faqinside = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [faq, setFaq] = useState({});
  const [loading, setLoading] = useState(true);
  let userDetails = useSelector(authData);
  // console.log("path " + JSON.stringify(location))

  const dispatch = useDispatch();


  useEffect(() => {
    let faqfalse = {...userDetails};
    faqfalse.sideactive = "/faqs";

    dispatch (awsSignIn(faqfalse));
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
    
    scrollRef.current.scrollTo(0, (document.getElementById("acc"+panel).offsetTop) - 100);
    
    // const scrollHeight = window.pageYOffset - window.innerHeight;

    // window.scrollTo({
    //   top: scrollHeight ,
    //   left: 0,
    //   behavior: "smooth",
    // });
    // let fixFocus = document.getElementById(panel).offsetTop;
    // alert(JSON.stringify(fixFocus));
    // window.scrollTo(0,fixFocus);
  };

  function mapFunction(data) {
    return (
      <div className={classes.root} >
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
                <Typography className={classes.heading} id={idx} >{item.title}</Typography>
              </AccordionSummary>
              <AccordionDetails style={{display: "flex", justifyContent:"flex-start", alignItems: "flex-start", flexDirection: "column", gap:"5px", width: "100%", marginTop:"-10px"}}>
                {item.value.map((subitem1) => {
                  if (subitem1.value == undefined) {
                    return (
                      <Typography style={{fontSize: "14px", fontWeight: "400px" , paddingTop: "5px", fontFamily: "nunito"}}>
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
    <div className={Faq.maincontainer} ref={scrollRef}>
        <UserHeader />
        <div className={Faq.subcontainer}>
        <div className={Faq.headingholder}>
          <h3 className={Faq.heading}>FAQs</h3>
        </div>
        {loading === false ?
        <Tab panes={panes} style={{ marginTop: "20px", zIndex: "-1" }} onTabChange={() => {setExpanded(0)}}/> : <div style={{width:"100%", height:"500px", display:"flex", alignItems:"flex-start", justifyContent:"flex-start"}}><Skeleton width="100%" height={700} style={{marginTop:"-150px"}}/></div>}
      </div>
    </div>
  );
};

export default Faqinside;