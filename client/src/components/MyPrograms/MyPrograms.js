import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { awsSignIn, authData, awsSignOut } from "../../redux/auth/authSlice";
import UserHeader from "../Header/UserHeader/UserHeader";
import ProgramCard from "../../modules/ProgramCard/ProgramCard";
import MyProgStyle from "./MyPrograms.module.scss";
import { FaBars } from "react-icons/fa";
import { Constants } from "../../config/constants";
import config from "../../config/aws-exports";
import { API } from "aws-amplify";
import { ContactlessOutlined } from "@material-ui/icons";
const MyPrograms = ({ handleToggleSidebar }) => {
  const [programData, setprogramData] = useState(true);

  const userDetails = useSelector(authData);
  const dispatch = useDispatch();

  useEffect(() => {
    // if(userDetails.data == undefined){
    //   getUserProgressDetails();
    // } else {
    //   setprogramData(userDetails.data.progress);
    // }
    //setprogramData(userDetails.data.bpdata);
    //alert(JSON.stringify(userDetails));
  }, []);

  async function getUserProgressDetails() {
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        eid: userDetails.eid,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.GET_USER_PROGRESS,
        bodyParam
      );
      userDetails.data = response;
      
      // setprogramData(userDetails);
      dispatch(awsSignIn(userDetails));

      //getEvents(UserProgressDetailsJSON);
      //alert("HI "+JSON.stringify(response));
    } catch (error) {
      console.error(error);
    }
  }

  console.log("user details" + JSON.stringify(userDetails));

  function programcardmap(programData) {
    // if(userDetails.data == undefined){
    //   return (
    //     <div>

    //     </div>
    //   );
    // }
    // let progress = userDetails.data.progress;

    let data = [];
    if (userDetails.data != undefined) {
      if (userDetails.data.bpdata != undefined) {
        data = [...userDetails.data.bpdata];
      }
    }

    return (
      <div>
        {userDetails.data.bpdata.length > 0 ? <h3
          style={{
            color: "black",
            fontSize: "20px",
            fontWeight: "500"
          }}
        >
          Choose a program{" "}
        </h3> : <h3 style={{color: "black",
            fontSize: "20px",
            fontWeight: "500"}}>You have not been assigned to any batch </h3>}
        {
          data.map((Value, index, array) => {
            return (
              <div style={{ margin: 0 }}>
                <ProgramCard Value={Value} />
              </div>
            );
          })
        }
      </div >
    );
  }
  return (
    <div className={MyProgStyle.maincontainer}>
      <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
        <FaBars />
      </div>
      <UserHeader />
      <div>
        <div style={{ overflow: "auto", height: "88vh", marginTop: "20px" }}>
          {programData == false ? (
            <>
              <div>
                <h1>Loading....</h1>
              </div>
            </>
          ) : (
            programcardmap()
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPrograms;
