import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { awsSignIn, authData, awsSignOut } from "../../redux/auth/authSlice";

 const LiveMeeting = () =>{
     let userDetails = useSelector(authData);
console.log(userDetails);
  return (<div style={{height:'100vh',width:"100vw"}}><iframe height="100%" width="100%" src={userDetails.cursession.link}/>
 </div>)
}
export default LiveMeeting;