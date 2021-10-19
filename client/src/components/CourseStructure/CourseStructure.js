import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
// import { Constants } from "../../config/constants";
// import config from "../../config/aws-exports";
// import { API } from "aws-amplify";

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

export default function CourseStructure({ topics }) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [nuggets, setNuggets] = useState(null);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {}, []);

  // const groupBy = (key) => (array) =>
  //   array.reduce((objectsByKeyValue, obj) => {
  //     const value = obj[key];
  //     objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
  //     return objectsByKeyValue;
  //   }, {});
  // const groupByUnit = groupBy("unit");
  // const result = groupByUnit(topics.nuggets);
  // setNuggets(result);
  // if (!topics) {
  //   return null;
  // } else {
  //   function groupByKey(array, key) {
  //     return array.reduce((hash, obj) => {
  //       if (obj[key] === undefined) return hash;
  //       return Object.assign(hash, {
  //         [obj[key]]: (hash[obj[key]] || []).concat(obj),
  //       });
  //     }, {});
  //   }
  //   var result = groupByKey(topics.nuggets, "unit");
  //   setNuggets(result);
  // }

  // function groupByKey(array, key) {
  //   return array.reduce((hash, obj) => {
  //     if (obj[key] === undefined) return hash;
  //     return Object.assign(hash, {
  //       [obj[key]]: (hash[obj[key]] || []).concat(obj),
  //     });
  //   }, {});
  // }
  // var result = groupByKey(topics.nuggets, "unit");
  // setNuggets(result);
  console.log(topics.nuggets);
  return (
    <div className={classes.root}>
      <pre>{topics ? JSON.stringify(topics.nuggets, null, 2) : null}</pre>
      {/* {topics
        ? topics.nuggets.map((nugget) => (
            <Accordion
              expanded={expanded === `Panel 1`}
              onChange={handleChange(`Panel 1`)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography className={classes.heading}>{nugget}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Nulla facilisi. Phasellus sollicitudin nulla et quam mattis
                  feugiat. Aliquam eget maximus est, id dignissim quam. Nulla
                  facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
                  Aliquam eget maximus est, id dignissim quam. Nulla facilisi.
                  Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam
                  eget maximus est, id dignissim quam. Nulla facilisi. Phasellus
                  sollicitudin nulla et quam mattis feugiat. Aliquam eget
                  maximus est, id dignissim quam. Nulla facilisi. Phasellus
                  sollicitudin nulla et quam mattis feugiat. Aliquam eget
                  maximus est, id dignissim quam. Nulla facilisi. Phasellus
                  sollicitudin nulla et quam mattis feugiat. Aliquam eget
                  maximus est, id dignissim quam. Lorem
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))
        : null} */}
    </div>
  );
}
