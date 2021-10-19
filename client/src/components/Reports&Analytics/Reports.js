// Dependencies imports
import React from "react";
import { Tab } from "semantic-ui-react";

// Local imports
import UserHeader from "../Header/UserHeader/UserHeader";
import CourseProgress from './CourseProgress';
import Attendance from './Attendance';
import Assignment from './Assignments';
import Assessment from './Assessments';
import MiniAssignment from './MiniAssignments';

// Style imports
import User from './Reports.module.scss';



// Start of User analytics main component
const Reports = () => {


    const panes = [
        {
          menuItem: "Course Progress",
          render: () => (
            <Tab.Pane>
              <CourseProgress />
            </Tab.Pane>
          ),
        },
        {
          menuItem: "Mini assignments",
          render: () => (
            <Tab.Pane>
              <MiniAssignment />
            </Tab.Pane>
          ),
        },
        {
          menuItem: "Assignments",
          render: () => (
            <Tab.Pane>
              <Assignment />
            </Tab.Pane>
          ),
        },
        {
          menuItem: "Assessments",
          render: () => (
            <Tab.Pane>
              <Assessment />
            </Tab.Pane>
          ),
        },
        {
          menuItem: "Attendance",
          render: () => (
            <Tab.Pane>
              <Attendance />
            </Tab.Pane>
          ),
        },
      ];


    return(
        <div className={User.maincontainer}>
            <UserHeader />
            <h1 className={User.mainheader}>Reports</h1>
            <div className={User.tabholder}>
                <Tab panes={panes} />
            </div>
        </div>
    );
};

export default Reports;