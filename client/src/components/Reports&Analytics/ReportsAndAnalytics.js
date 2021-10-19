import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import "./ReportsAndAnalytics.scss";
import { FaBars } from "react-icons/fa";
import UserHeader from "../../components/Header/UserHeader/UserHeader";
import BarChart from "../../modules/BarChart/BarChart";

export default function ReportsAndAnalytics({ handleToggleSidebar }) {
  return (
    <main>
      <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
        <FaBars />
      </div>
      <UserHeader />

      <div className="reportsAndAnalytics">
        <div className="PnA-card">
          <div className="programs">
            <div className="inProgressNComp">
              <div>
                <h1>2</h1>
                <p>Programs in progress</p>
              </div>
              <div>
                <h1>5</h1>
                <p>Programs completed</p>
              </div>
            </div>
          </div>
          <div className="Assignments">
            <div className="submittedNPastDLine">
              <div>
                <h1>10</h1>
                <p>Assignments submitted</p>
              </div>
              <div>
                <h1>3</h1>
                <p>Assignments past deadline</p>
              </div>
            </div>
          </div>
        </div>

        <div className="assessmentAnalysis">
          <div className="analysis-head">
            <h3>Assignment analysis</h3>
            <div className="flex">
              <div className="flex">
                <span className="square col--red"></span>
                <p>Very low</p>
              </div>
              <div className="flex">
                <span className="square col--yellow"></span>
                <p>Need improvement</p>
              </div>
              <div className="flex">
                <span className="square col--green"></span>
                <p>Good work!</p>
              </div>
            </div>
          </div>
          <div className="analysis-container" >
            <h4>Semester</h4>
            <Grid
              container
              spacing={7}
              style={{ marginLeft: "3px", width: "100%" }}
            >
              <Grid item xs={3}>
                <BarChart />
              </Grid>
              <Grid item xs={3}>
                <BarChart />
              </Grid>
              <Grid item xs={3}>
                <BarChart />
              </Grid>
              <Grid item xs={3}>
                <BarChart />
              </Grid> <Grid item xs={3}>
                <BarChart />
              </Grid>
              <Grid item xs={3}>
                <BarChart />
              </Grid> <Grid item xs={3}>
                <BarChart />
              </Grid>
              <Grid item xs={3}>
                <BarChart />
              </Grid>
            </Grid>

          </div>
        </div>
      </div>
    </main>
  );
}
