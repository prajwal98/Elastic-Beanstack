import React from "react";
import { Constants } from "../../../config/constants";
import config from "../../../config/aws-exports";

import "./InstructorsCard.scss";

const InstructorsCard = ({ name, designation, org, pic, pid }) => (
  <div className="instructor-card-container">
    <div className="instructor-card__image" style={{ marginBottom: "20px" }}>
      <img
        src={`https://${
          config.DOMAIN
        }/${config.aws_org_id.toLowerCase()}-resources/images/program-images/${pid}/${pic}`}
        alt="instructors"
      />
    </div>
    <div className="instructor-card__details" style={{ fontSize: "small" }}>
      <div className="instructor-card__details--h1">
        <h5>{name}</h5>
      </div>
      <div className="instructor-card__details--p">
        <p>{designation}</p>
        <p>{org}</p>
      </div>
    </div>
  </div>
);

export default InstructorsCard;
