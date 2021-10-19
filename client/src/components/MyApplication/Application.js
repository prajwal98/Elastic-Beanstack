import React, { useEffect, useState } from "react";
import { Tab } from "semantic-ui-react";
import { FaBars } from "react-icons/fa";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { awsSignIn, authData } from "../../redux/auth/authSlice";
import UserHeader from "../Header/UserHeader/UserHeader";
import config from "../../config/aws-exports";
import { Constants } from "../../config/constants";
import { API } from "aws-amplify";
import axios from "axios";
import ApplicationStyle from "./Application.module.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    alignItems: "center",
  },
  paper: {
    padding: theme.spacing(2),

    color: theme.palette.text.secondary,
    marginLeft: "20%",
  },
}));

export default function Application({ handleToggleSidebar }) {
  const [truee, settruee] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState({ ccode: 0, telephone: 0 });
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [parents, setParents] = useState({ fathername: "", mothername: "" });
  const [internationalStu, setInternationalStu] = useState(true);
  const [passport, setPassport] = useState(0);
  const [otherGovt, setOtherGovt] = useState(null);
  const [detailsid, setDetailsid] = useState("");
  const [perAddr, setPerAddr] = useState({
    addr1: "",
    addr2: "",
    addr3: "",
    state: "",
    city: "",
    pin: "",
  });
  const [presAddr, setPresAddr] = useState({
    addr1: "",
    addr2: "",
    addr3: "",
    state: "",
    city: "",
    pin: "",
  });
  const [sameAddr, setSameAddr] = useState(false);
  const [pastNationality, setPastNationality] = useState("");
  const [h, H] = useState(false);
  const [uploadDisable, setUploadDisable] = useState(true);
  const [scholarshipDisable, setScholarshipDisable] = useState(false);
  const [reviewDisable, setReviewDisable] = useState(false);
  const [issueText, setIssueText] = useState("");
  const [issueTextEducation, setIssueTextEducation] = useState("");
  const [issueTextUpload, setIssueTextUpload] = useState("");

  //Issuetexts

  const [nameIsseText, setNameIssueText] = useState("");
  const [emailIsseText, setEmailIssueText] = useState("");
  const [phoneIsseText, setPhoneIssueText] = useState("");
  const [dobIsseText, setDOBIssueText] = useState("");
  const [parentsIsseText, setParentsIssueText] = useState("");
  const [govtIsseText, setGovtIssueText] = useState("");
  const [addressIsseText, setAddressIssueText] = useState("");

  //Education variables declaration

  const [schoolName, setSchoolName] = useState("");
  const [schAddr, setSchAddr] = useState({
    addr1: "",
    addr2: "",
    addr3: "",
    country: "",
    zip: "",
  });
  const [university, setUniversity] = useState("");
  const [uniAddr, setUniAddr] = useState({
    addr1: "",
    addr2: "",
    addr3: "",
    country: "",
    zip: "",
  });
  const [edType, setEdType] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experiance, setExperiance] = useState("");
  const [experianceDesc, setExperianceDesc] = useState("");

  //Scholarship

  const [scholarship, setScholarship] = useState("");
  const [learningCenter, setLearningCenter] = useState("");

  //files

  const [certificate, setCertificate] = useState(null);
  const [transcripts, setTranscripts] = useState(null);
  const [passportFile, setPassportFile] = useState(null);
  const [otherGovtFile, setOtherGovtFile] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const [certificateN, setCertificateN] = useState("");
  const [transcriptsN, setTranscriptsN] = useState("");
  const [passportFileN, setPassportFileN] = useState("");
  const [otherGovtFileN, setOtherGovtFileN] = useState("");
  const [profilePhotoN, setProfilePhotoN] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  let navigate = useNavigate();
  const dispatch = useDispatch();
  let userDetails = useSelector(authData);

  // console.log("get", localStorage.getItem("eVBAB"))
  const classes = useStyles();
  let infoObj = {};

  useEffect(() => {
    if (userDetails.pstatus != 0 && userDetails.pstatus != 1) {
      navigate("/applyProgram");
    }
    getUserApplication();
    if (userDetails.apply == true) {
      if (userDetails.evbab == true) {
        setScholarship("Yes");
        setLearningCenter(userDetails.learning_center_name.trim());
        let objtype = "scholarship";
        let action = 0;
        let pstatus = 1;
        let obj = {
          scholarship: "Yes",
          learningCenter: userDetails.learning_center_name.trim(),
        };

        updateUserApplication(obj, objtype, action, pstatus, () => { }, 0);

        setScholarshipDisable(true);
      }
    }
  }, []);

  async function getUserApplication() {
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        eid: userDetails.eid,
        pid: userDetails.pid,
        bpid: userDetails.bpid,
        action: 1,
        appid: userDetails.applicationid,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    try {
      let response = await API.post(
        config.aws_cloud_logic_custom_name,
        //Constants.GET_PROGRAM,
        "/updateUserApplication",
        bodyParam
        //`${Constants.GET_MY_PROGRAMS}`, bodyParam,
      );

      console.log("response " + JSON.stringify(response));
      updateStates(response);
      setIsLoading(false);
    } catch (error) {
      console.log("getCategoryError", error);
    }
  }

  function updateStates(R) {
    if (R.generalinfo != undefined) {
      setFirstName(R.generalinfo["First Name"]);
      setFirstName(R.generalinfo["First Name"]);
      setLastName(R.generalinfo["Last Name"]);
      setEmail(R.generalinfo["Email"]);
      setPhoneNo({
        ccode: R.generalinfo["Country Code"],
        telephone: R.generalinfo["Contact"],
      });
      setGender(R.generalinfo["Gender"]);
      setDob(R.generalinfo["Date of Birth"]);
      setParents({
        fathername: R.generalinfo["Father Name"],
        mothername: R.generalinfo["Mother Name"],
      });
      setInternationalStu(R.generalinfo["International Student"]);
      setPassport(R.generalinfo["Passport"]);
      setOtherGovt(R.generalinfo["Other Id"]);
      setPerAddr({
        addr1: R.generalinfo["Permanent Address 1"],
        addr2: R.generalinfo["Permanent Address 2"],
        addr3: R.generalinfo["Permanent Address 3"],
        state: R.generalinfo["Permanent State"],
        city: R.generalinfo["Permanent City"],
        pin: R.generalinfo["Permanent Pin"],
      });
      setPastNationality(R.generalinfo["Permanent Nation"]);
      setSameAddr(R.generalinfo["Permanent Same Address"]);
      setPresAddr({
        addr1: R.generalinfo["Present Address 1"],
        addr2: R.generalinfo["Present Address 2"],
        addr3: R.generalinfo["Present Address 3"],
        state: R.generalinfo["Present State"],
        city: R.generalinfo["Present City"],
        pin: R.generalinfo["Present Pin"],
      });

      H(true);
      setActiveIndex(1);
    }

    if (R.education != undefined) {
      setSchoolName(R.education["School Name"]);
      setSchAddr({
        addr1: R.education["School Address 1"],
        addr2: R.education["School Address 2"],
        addr3: R.education["School Address 3"],
        country: R.education["School Address Country"],
        zip: R.education["School Address pincode"],
      });
      setUniversity(R.education["University"]);
      setUniAddr({
        addr1: R.education["University Address 1"],
        addr2: R.education["University Address 2"],
        addr3: R.education["University Address 3"],
        country: R.education["University Country"],
        zip: R.education["University ZIP"],
      });
      setEdType(R.education["Education Type"]);
      setSpecialization(R.education["Specialization"]);
      setExperiance(R.education["Experience"]);
      setExperianceDesc(R.education["Experience Designation"]);

      setUploadDisable(true);
      setActiveIndex(2);
    }

    if (R.uploaddoc != undefined) {
      setCertificateN(R.uploaddoc["Cetificates"]);
      setTranscriptsN(R.uploaddoc["Transcripts"]);
      setPassportFileN(R.uploaddoc["Passport"]);
      setOtherGovtFileN(R.uploaddoc["Other Government Proof"]);
      setProfilePhotoN(R.uploaddoc["Profile Photo"]);

      setReviewDisable(true);
      setActiveIndex(4);
    }

    if (R.scholarship != undefined) {
      setScholarship(R.scholarship["Scholarship"]);
      setLearningCenter(R.scholarship["Learning Center"]);
      setScholarshipDisable(true);
      setReviewDisable(true);
      setActiveIndex(4);
    }
  }

  async function updateUserApplication(obj, objtype, action, pstatus, H, ind) {
    let applicationid;
    if (userDetails.applicationid != undefined) {
      applicationid = userDetails.applicationid;
    } else {
      applicationid =
        userDetails.bpid + "-" + Math.round(new Date().getTime() / 1000);

      let sdata = { ...userDetails };
      sdata.applicationid = applicationid;
      dispatch(awsSignIn(sdata));
    }

    setIsLoading(true);
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        eid: userDetails.eid,
        action: action,
        pid: userDetails.pid,
        bpid: userDetails.bpid,
        bname: userDetails.bname,
        pname: userDetails.pname,
        psname: userDetails.psname,
        typeobj: objtype,
        appobj: obj,
        appid: applicationid,
        pstatus: pstatus,
        uname: userDetails.username,
        evbab: userDetails.evbab,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    try {
      const response = await API.post(
        config.aws_cloud_logic_custom_name,
        //Constants.GET_PROGRAM,
        "/updateUserApplication",
        bodyParam
        //`${Constants.GET_MY_PROGRAMS}`, bodyParam,
      );

      console.log("response " + JSON.stringify(response));
      H(true);
      setIsLoading(false);

      if (action == 2 || pstatus == 2) {
        let sdata = { ...userDetails };
        sdata.pstatus = pstatus;
        dispatch(awsSignIn(sdata));
        navigate("/applyProgram");
      } else {
        setActiveIndex(ind);
      }
    } catch (error) {
      console.log("getCategoryError", error);
    }
  }

  function generalInfoValidation() {
    if (firstName === "" || lastName === "") {
      setIssueText("Name cannot be empty");
    } else if (email === "") {
      setIssueText("Email cannot be empty");
    } else if (phoneNo.ccode === "" || phoneNo.telephone === "") {
      setIssueText("Phone number cannot be empty");
    } else if (dob === "") {
      setIssueText("DateofBirth cannot be empty");
    } else if (parents.fathername === "" || parents.mothername === "") {
      setIssueText("Father name or Mother name cannot be empty");
    } else if (otherGovt === "") {
      setIssueText("Govt ID  cannot be empty");
    } else if (
      perAddr.addr1 === "" ||
      perAddr.state === "" ||
      perAddr.city === "" ||
      perAddr.pin === ""
    ) {
      setIssueText("Please fill address according to the requirement");
    } else {
      setIssueText("");
      infoObj.name = firstName;
      infoObj.lname = lastName;
      infoObj.email = email;
      infoObj.phoneNo = phoneNo.telephone;
      infoObj.gender = gender;
      infoObj.dob = dob;
      infoObj.fathername = parents.fathername;
      infoObj.mothername = parents.mothername;
      infoObj.internation = internationalStu;
      infoObj.permanentAddr1 = perAddr.addr1;
      infoObj.permanentAddr2 = perAddr.addr2;
      infoObj.permanentAddr3 = perAddr.addr3;
      infoObj.permanentCity = perAddr.city;
      infoObj.permanentState = perAddr.state;
      infoObj.permanentPin = perAddr.pin;
      infoObj.pastNationality = pastNationality;

      saveGeneralInfo();
    }
  }

  function saveGeneralInfo() {
    // let sdata = {...userDetails};
    // if(sdata.applicationid == undefined){
    //   sdata.applicationid = sdata.bpid+"-"+Math.round((new Date()).getTime() / 1000);
    // }
    // dispatch(awsSignIn(sdata));

    let objtype = "generalinfo";
    let action = 0;
    let pstatus = 1;
    let obj = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      ccode: phoneNo.ccode,
      phoneNo: phoneNo.telephone,
      gender: gender,
      dob: dob,
      fathername: parents.fathername,
      mothername: parents.mothername,
      internationalStu: internationalStu,
      passport: passport,
      otherid: otherGovt,
      perm_addr1: perAddr.addr1,
      perm_addr2: perAddr.addr2,
      perm_addr3: perAddr.addr3,
      perm_state: perAddr.state,
      perm_city: perAddr.city,
      perm_pin: perAddr.pin,
      perm_pastNat: pastNationality,
      perm_sameAddr: sameAddr,
      pres_addr1: presAddr.addr1,
      pres_addr2: presAddr.addr2,
      pres_addr3: presAddr.addr3,
      pres_state: presAddr.state,
      pres_city: presAddr.city,
      pres_pin: presAddr.pin,
    };

    updateUserApplication(obj, objtype, action, pstatus, H, 1);
  }

  function EducationValidation() {
    if (schoolName === "") {
      setIssueTextEducation("School Name cannot be empty");
    } else if (schAddr.addr1 === "") {
      setIssueTextEducation("School address cannot be empty");
    } else if (schAddr.country === "") {
      setIssueTextEducation("School country cannot be empty");
    } else if (schAddr.zip === "") {
      setIssueTextEducation("School zip cannot be empty");
    } else if (university === "") {
      setIssueTextEducation("University Name cannot be empty");
    } else if (uniAddr.addr1 === "") {
      setIssueTextEducation("University address cannot be empty");
    } else if (uniAddr.country === "") {
      setIssueTextEducation("University country cannot be empty");
    } else if (experiance === "") {
      setIssueTextEducation("Experience cannot be empty");
    } else if (experianceDesc === "") {
      setIssueTextEducation("Work description cannot be empty");
    } else {
      saveEducationInfo();
    }
  }

  function saveEducationInfo() {
    let objtype = "education";
    let action = 0;
    let pstatus = 1;
    let obj = {
      schoolName: schoolName,
      schAddr1: schAddr.addr1,
      schAddr2: schAddr.addr2,
      schAddr3: schAddr.addr3,
      schAddr_country: schAddr.country,
      schAddr_zip: schAddr.zip,
      university: university,
      uniAddr1: uniAddr.addr1,
      uniAddr2: uniAddr.addr2,
      uniAddr3: uniAddr.addr3,
      uniAddr_country: uniAddr.country,
      uniAddr_zip: uniAddr.zip,
      edType: edType,
      specialization: specialization,
      experiance: experiance,
      experianceDesc: experianceDesc,
    };

    updateUserApplication(obj, objtype, action, pstatus, setUploadDisable, 2);
  }

  function handleCertificateFile(e) {
    console.log(e.target.files);
    console.log("-1h", e.target.files[0]);
    let file = e.target.files[0];
    setCertificate(file);

    uploadDocsToServer(file, setCertificateN);
  }
  function handleTranscripts(e) {
    console.log(e.target.files);
    console.log("-h", e.target.files[0]);
    let file = e.target.files[0];
    setTranscripts(file);

    uploadDocsToServer(file, setTranscriptsN);
  }
  function handlePassport(e) {
    console.log(e.target.files);
    console.log("h", e.target.files[0]);
    let file = e.target.files[0];
    setPassportFile(file);

    uploadDocsToServer(file, setPassportFileN);
  }
  function handleGovtFiles(e) {
    console.log(e.target.files);
    console.log("h2", e.target.files[0]);
    let file = e.target.files[0];
    setOtherGovtFile(file);

    uploadDocsToServer(file, setOtherGovtFileN);
  }
  function handleProfilePhoto(e) {
    console.log(e.target.files);
    console.log("h3", e.target.files[0]);
    let file = e.target.files[0];
    setProfilePhoto(file);

    uploadDocsToServer(file, setProfilePhotoN);
  }

  async function uploadDocsToServer(file, setName) {
    const bodyParam = {
      body: {
        oid: config.aws_org_id,
        eid: userDetails.eid,
        type: "application",
        filetype: file.type,
        filename: file.name,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    try {
      let response = await API.post(
        config.aws_cloud_logic_custom_name,
        Constants.GET_PRESIGNED_URL,
        bodyParam
        //`${Constants.GET_MY_PROGRAMS}`, bodyParam,
      );

      console.log("response " + JSON.stringify(response));
      fileUpload(file, response, setName);
    } catch (error) {
      console.log("getCategoryError", error);
    }
  }

  async function fileUpload(file, url, setName) {
    await axios
      .put(url, file, { headers: { "Content-Type": file.type } })
      .then((res) => {
        console.log(res);
        setName(file.name);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function docValidation() {
    if (certificateN == "") {
      setIssueTextUpload("Please upload Certificate");
    } else if (transcriptsN == "") {
      setIssueTextUpload("Please upload Transcripts");
    } else if (passportFileN == "") {
      setIssueTextUpload("Please upload Passport Document");
    } else if (otherGovtFile == "") {
      setIssueTextUpload("Please upload Other Govt Files");
    } else if (profilePhotoN == "") {
      setIssueTextUpload("Please upload Profile photo");
    } else {
      saveDocuments();
    }
  }

  function saveDocuments() {
    let objtype = "uploaddoc";
    let action = 0;
    let pstatus = 1;
    let obj = {
      certificateN: "",
      transcriptsN: "",
      passportFileN: "",
      otherGovtN: "",
      profilePhotoN: "",
    };

    if (certificate != null) {
      obj.certificateN = certificate.name;
    } else {
      obj.certificateN = certificateN;
    }
    if (transcripts != null) {
      obj.transcriptsN = transcripts.name;
    } else {
      obj.transcriptsN = transcriptsN;
    }
    if (passportFile != null) {
      obj.passportFileN = passportFile.name;
    } else {
      obj.passportFileN = passportFileN;
    }
    if (otherGovtFile != null) {
      obj.otherGovtN = otherGovtFile.name;
    } else {
      obj.otherGovtN = otherGovtFileN;
    }
    if (profilePhoto != null) {
      obj.profilePhotoN = profilePhoto.name;
    } else {
      obj.profilePhotoN = profilePhotoN;
    }

    if (userDetails.evbab == true) {
      updateUserApplication(
        obj,
        objtype,
        action,
        pstatus,
        setScholarshipDisable,
        3
      );
    } else {
      updateUserApplication(obj, objtype, action, pstatus, setReviewDisable, 4);
    }
  }

  function saveScholarship() {
    let objtype = "scholarship";
    let action = 0;
    let pstatus = 1;
    let obj = {
      scholarship: "",
      learningCenter: "",
    };

    updateUserApplication(obj, objtype, action, pstatus, setReviewDisable, 4);
  }

  function SubmitApplication() {
    let objtype = undefined;
    let action = 2;
    let pstatus = 2;
    let obj = undefined;

    updateUserApplication(obj, objtype, action, pstatus, setReviewDisable, 4);
  }

  const panes = [
    {
      menuItem: "General Information",
      render: () => <Tab.Pane>{GeneralF()}</Tab.Pane>,
    },
    {
      menuItem: "Education",
      render: () => <Tab.Pane disabled={h === false}>{EducationF()}</Tab.Pane>,
    },
    {
      menuItem: "Upload Documents",
      render: () => (
        <Tab.Pane disabled={uploadDisable === false}>{UploadF()}</Tab.Pane>
      ),
    },
    {
      menuItem: "Scholarship",
      render: () => (
        <Tab.Pane disabled={scholarshipDisable === false}>
          {ScholarshipF()}
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Review",
      render: () => (
        <Tab.Pane disabled={reviewDisable === false}>{ReviewF()}</Tab.Pane>
      ),
    },
  ];

  function GeneralF() {
    return (
      <div>
        <Grid item xs={10}>
          <Paper className={classes.paper}>
            <form>
              <div>
                <h3>General Info</h3>
                <label className={ApplicationStyle.lableText}>
                  <span style={{ color: "red" }}>*</span> First Name (As per
                  records):
                  <br />
                </label>
                <input
                  className={ApplicationStyle.textBox}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <br />
              </div>
              <div>
                <label className={ApplicationStyle.lableText}>
                  <span style={{ color: "red" }}>*</span>Second Name (As per
                  records):
                  <br />
                </label>
                <input
                  className={ApplicationStyle.textBox}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                <br />
              </div>
              <div>
                <label className={ApplicationStyle.lableText}>
                  <span style={{ color: "red" }}>*</span>Email:
                  <br />
                </label>
                <input
                  className={ApplicationStyle.textBox}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <br />
                <br />
              </div>

              <div style={{ display: "flex" }}>
                <label className={ApplicationStyle.lableText}>
                  <span style={{ color: "red" }}>*</span>Country code:
                </label>
                <br />
                <input
                  style={{
                    fontSize: "medium",
                    width: "10%",
                    borderColor: "grey",
                    height: "30px",
                    paddingTop: "8px",
                    borderWidth: "thin",
                  }}
                  value={phoneNo.ccode}
                  onChange={(e) =>
                    setPhoneNo({ ...phoneNo, ccode: e.target.value })
                  }
                  required
                />

                <label
                  style={{ marginLeft: "20px" }}
                  className={ApplicationStyle.lableText}
                >
                  <span style={{ color: "red" }}>*</span>Mobile No:
                </label>
                <input
                  type="number"
                  style={{
                    fontSize: "medium",
                    width: "45%",
                    borderColor: "grey",
                    height: "30px",
                    paddingTop: "8px",
                    borderWidth: "thin",
                  }}
                  value={phoneNo.telephone}
                  onChange={(e) =>
                    setPhoneNo({ ...phoneNo, telephone: e.target.value })
                  }
                  required
                />

                <br />
                <br />
                <br />
              </div>
              <div>
                <label className={ApplicationStyle.lableText}>
                  <span style={{ color: "red" }}>*</span>Gender:
                  <br />
                </label>
                <select
                  className={ApplicationStyle.textBox}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Transgender">Transgender</option>
                </select>
                <br />
              </div>
              <div>
                <label className={ApplicationStyle.lableText}>
                  <span style={{ color: "red" }}>*</span>Date of Birth(As per
                  records):
                  <br />
                </label>
                <input
                  type="date"
                  className={ApplicationStyle.textBox}
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
                <br />
              </div>
              <div>
                <label className={ApplicationStyle.lableText}>
                  <span style={{ color: "red" }}>*</span>Father Name (As per
                  records):
                  <br />
                </label>
                <input
                  className={ApplicationStyle.textBox}
                  value={parents.fathername}
                  onChange={(e) =>
                    setParents({ ...parents, fathername: e.target.value })
                  }
                  required
                />
                <br />
              </div>
              <div>
                <label className={ApplicationStyle.lableText}>
                  <span style={{ color: "red" }}>*</span>Mother Name (As per
                  records):
                  <br />
                </label>
                <input
                  className={ApplicationStyle.textBox}
                  value={parents.mothername}
                  onChange={(e) =>
                    setParents({ ...parents, mothername: e.target.value })
                  }
                  required
                />
                <br />
              </div>
              <div>
                <label className={ApplicationStyle.lableText}>
                  <span style={{ color: "red" }}>*</span>Are you International
                  student?:
                  <br />
                </label>
                <select
                  className={ApplicationStyle.textBox}
                  onChange={(e) => setInternationalStu(e.target.value)}
                >
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
                <br />
              </div>
              <div>
                <label className={ApplicationStyle.lableText}>
                  <span style={{ color: "red" }}>*</span>Passport:
                  <br />
                </label>
                <input
                  className={ApplicationStyle.textBox}
                  value={passport}
                  onChange={(e) => setPassport(e.target.value)}
                  required
                />
                <br />
              </div>
              <div>
                <label className={ApplicationStyle.lableText}>
                  <span style={{ color: "red" }}>*</span>Other Govt ID #
                  (National ID/ Voter ID/ Taxation ID/Birth Certificate) Any
                  one:
                  <br />
                </label>
                <input
                  className={ApplicationStyle.textBox}
                  value={otherGovt}
                  onChange={(e) => setOtherGovt(e.target.value)}
                  required
                />
                <br />
              </div>
              <h2>Permanent Address</h2>
              <div>
                <label className={ApplicationStyle.lableText}>
                  <span style={{ color: "red" }}>*</span>Address Line 1:
                  <br />
                </label>
                <input
                  className={ApplicationStyle.textBox}
                  value={perAddr.addr1}
                  onChange={(e) =>
                    setPerAddr({ ...perAddr, addr1: e.target.value })
                  }
                  required
                />
                <br />
              </div>
              <div>
                <label className={ApplicationStyle.lableText}>
                  <span style={{ color: "red" }}>*</span>Address Line 2:
                  <br />
                </label>
                <input
                  className={ApplicationStyle.textBox}
                  value={perAddr.addr2}
                  onChange={(e) =>
                    setPerAddr({ ...perAddr, addr2: e.target.value })
                  }
                  required
                />
                <br />
              </div>
              <div>
                <label className={ApplicationStyle.lableText}>
                  <span style={{ color: "red" }}>*</span>Address Line 3:
                  <br />
                </label>
                <input
                  className={ApplicationStyle.textBox}
                  value={perAddr.addr3}
                  onChange={(e) =>
                    setPerAddr({ ...perAddr, addr3: e.target.value })
                  }
                  required
                />
                <br />
              </div>
              <div>
                <label className={ApplicationStyle.lableText}>
                  <span style={{ color: "red" }}>*</span>State:
                  <br />
                </label>
                <input
                  className={ApplicationStyle.textBox}
                  value={perAddr.state}
                  onChange={(e) =>
                    setPerAddr({ ...perAddr, state: e.target.value })
                  }
                  required
                />
                <br />
              </div>
              <div>
                <label className={ApplicationStyle.lableText}>
                  <span style={{ color: "red" }}>*</span>City :<br />
                </label>
                <input
                  className={ApplicationStyle.textBox}
                  value={perAddr.city}
                  onChange={(e) =>
                    setPerAddr({ ...perAddr, city: e.target.value })
                  }
                  required
                />
                <br />
              </div>
              <div>
                <label className={ApplicationStyle.lableText}>
                  <span style={{ color: "red" }}>*</span>PIN:
                  <br />
                </label>
                <input
                  className={ApplicationStyle.textBox}
                  value={perAddr.pin}
                  onChange={(e) =>
                    setPerAddr({ ...perAddr, pin: e.target.value })
                  }
                  required
                />
                <br />
              </div>
              <div>
                <label className={ApplicationStyle.lableText}>
                  <span style={{ color: "red" }}>*</span>Past Nationality:
                  <br />
                </label>
                <select
                  className={ApplicationStyle.textBox}
                  onChange={(e) => setPastNationality(e.target.value)}
                >
                  <option value="NotApplicable">Not Applicable</option>
                  <option value="Benin">Benin</option>
                  <option value="Comoros">Comoros</option>
                  <option value="Cote d'Ivoire">Cote d'Ivoire</option>
                  <option value="Democratic Republic of Congo">
                    Democratic Republic of Congo
                  </option>
                  <option value="Eritrea">Eritrea</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Malawi">Malawi</option>
                  <option value="Mali">Mali</option>
                  <option value="Mauritius">Mauritius</option>
                  <option value="Mazambique">Mazambique</option>
                  <option value="Republic of Guinea">Republic of Guinea</option>
                  <option value="Republic of Sudan">Republic of Sudan</option>
                  <option value="Seychelles">Seychelles</option>
                  <option value="Sierra Leone">Sierra Leone</option>
                  <option value="The Gambia">The Gambia</option>
                  <option value="Uganda">Uganda</option>
                  <option value="Zambia">Zambia</option>
                </select>
                <br />
              </div>
              <div>
                <label className={ApplicationStyle.lableText}>
                  <span style={{ color: "red" }}>*</span>Is the Present Address
                  same as Permanent Address? :<br />
                </label>
                <select
                  className={ApplicationStyle.textBox}
                  onChange={(e) => setSameAddr(e.target.value)}
                >
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
                <br />
              </div>
              <h2>Present Address</h2>
              <div>
                <label className={ApplicationStyle.lableText}>
                  <span style={{ color: "red" }}>*</span>Address Line 1:
                  <br />
                </label>
                <input
                  className={ApplicationStyle.textBox}
                  value={sameAddr ? perAddr.addr1 : presAddr.addr1}
                  onChange={(e) =>
                    setPresAddr({ ...presAddr, addr1: e.target.value })
                  }
                  required
                />
                <br />
              </div>
              <div>
                <label className={ApplicationStyle.lableText}>
                  <span style={{ color: "red" }}>*</span>Address Line 2:
                  <br />
                </label>
                <input
                  className={ApplicationStyle.textBox}
                  value={sameAddr ? perAddr.addr2 : presAddr.addr2}
                  onChange={(e) =>
                    setPresAddr({ ...presAddr, addr2: e.target.value })
                  }
                  required
                />
                <br />
              </div>
              <div>
                <label className={ApplicationStyle.lableText}>
                  <span style={{ color: "red" }}>*</span>Address Line 3:
                  <br />
                </label>
                <input
                  className={ApplicationStyle.textBox}
                  value={sameAddr ? perAddr.addr3 : presAddr.addr3}
                  onChange={(e) =>
                    setPresAddr({ ...presAddr, addr3: e.target.value })
                  }
                  required
                />
                <br />
              </div>
              <div>
                <label className={ApplicationStyle.lableText}>
                  <span style={{ color: "red" }}>*</span>State:
                  <br />
                </label>
                <input
                  className={ApplicationStyle.textBox}
                  value={sameAddr ? perAddr.state : presAddr.state}
                  onChange={(e) =>
                    setPresAddr({ ...presAddr, state: e.target.value })
                  }
                  required
                />
                <br />
              </div>
              <div>
                <label className={ApplicationStyle.lableText}>
                  <span style={{ color: "red" }}>*</span>City :<br />
                </label>
                <input
                  className={ApplicationStyle.textBox}
                  value={sameAddr ? perAddr.city : presAddr.city}
                  onChange={(e) =>
                    setPresAddr({ ...presAddr, city: e.target.value })
                  }
                  required
                />
                <br />
              </div>
              <div>
                <label className={ApplicationStyle.lableText}>
                  <span style={{ color: "red" }}>*</span>PIN:
                  <br />
                </label>
                <input
                  className={ApplicationStyle.textBox}
                  value={sameAddr ? perAddr.pin : presAddr.pin}
                  onChange={(e) =>
                    setPresAddr({ ...presAddr, pin: e.target.value })
                  }
                  required
                />
                <br />
              </div>
              <input
                type="button"
                onClick={() =>
                  console.log(
                    "first",
                    firstName,
                    "l",
                    lastName,
                    parents,
                    perAddr
                  )
                }
                value="Next"
                className={ApplicationStyle.nextButton}
                style={{ float: "right" }}
              />
              <input
                type="button"
                onClick={() => generalInfoValidation()}
                value="Save"
                className={ApplicationStyle.saveButton}
                style={{ float: "right" }}
              />
              <span className={ApplicationStyle.issueText}>{issueText}</span>
            </form>
          </Paper>
        </Grid>
      </div>
    );
  }

  function EducationF() {
    return (
      <Grid item xs={10}>
        <Paper className={classes.paper} disabled>
          <form>
            <div>
              <h3>Education</h3>
              <label className={ApplicationStyle.lableText}>
                <span style={{ color: "red" }}>*</span> Name of School Attended
                :<br />
              </label>
              <input
                disabled={h === false}
                className={ApplicationStyle.textBox}
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                required
              />
              <br />
            </div>
            <div>
              <label className={ApplicationStyle.lableText}>
                <span style={{ color: "red" }}>*</span>Address of School Line 1:
                <br />
              </label>
              <input
                disabled={h === false}
                className={ApplicationStyle.textBox}
                value={schAddr.addr1}
                onChange={(e) =>
                  setSchAddr({ ...schAddr, addr1: e.target.value })
                }
                required
              />
              <br />
            </div>
            <div>
              <label className={ApplicationStyle.lableText}>
                Address of School Line 2:
                <br />
              </label>
              <input
                disabled={h === false}
                className={ApplicationStyle.textBox}
                value={schAddr.addr2}
                onChange={(e) =>
                  setSchAddr({ ...schAddr, addr2: e.target.value })
                }
                required
              />
              <br />
            </div>
            <div>
              <label className={ApplicationStyle.lableText}>
                Address of School Line 3:
                <br />
              </label>
              <input
                disabled={h === false}
                className={ApplicationStyle.textBox}
                value={schAddr.addr3}
                onChange={(e) =>
                  setSchAddr({ ...schAddr, addr3: e.target.value })
                }
                required
              />
              <br />
            </div>
            <div>
              <label className={ApplicationStyle.lableText}>
                <span style={{ color: "red" }}>*</span>Country of School:
                <br />
              </label>
              <input
                disabled={h === false}
                className={ApplicationStyle.textBox}
                value={schAddr.country}
                onChange={(e) =>
                  setSchAddr({ ...schAddr, country: e.target.value })
                }
                required
              />
              <br />
            </div>
            <div>
              <label className={ApplicationStyle.lableText}>
                <span style={{ color: "red" }}>*</span>School ZIP/PIN Code :
                <br />
              </label>
              <input
                disabled={h === false}
                className={ApplicationStyle.textBox}
                value={schAddr.zip}
                onChange={(e) =>
                  setSchAddr({ ...schAddr, zip: e.target.value })
                }
                required
              />
              <br />
            </div>

            <div>
              <label className={ApplicationStyle.lableText}>
                <span style={{ color: "red" }}>*</span>Name of University:
                <br />
              </label>
              <input
                disabled={h === false}
                className={ApplicationStyle.textBox}
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                required
              />
              <br />
            </div>
            <div>
              <label className={ApplicationStyle.lableText}>
                <span style={{ color: "red" }}>*</span>Address of University
                Line 1 :<br />
              </label>
              <input
                disabled={h === false}
                className={ApplicationStyle.textBox}
                value={uniAddr.addr1}
                onChange={(e) =>
                  setUniAddr({ ...uniAddr, addr1: e.target.value })
                }
                required
              />
              <br />
            </div>

            <div>
              <label className={ApplicationStyle.lableText}>
                Address of University Line 2:
                <br />
              </label>
              <input
                disabled={h === false}
                className={ApplicationStyle.textBox}
                value={uniAddr.addr2}
                onChange={(e) =>
                  setUniAddr({ ...uniAddr, addr2: e.target.value })
                }
                required
              />
              <br />
            </div>
            <div>
              <label className={ApplicationStyle.lableText}>
                Address of University Line 3:
                <br />
              </label>
              <input
                disabled={h === false}
                className={ApplicationStyle.textBox}
                value={uniAddr.addr3}
                onChange={(e) =>
                  setUniAddr({ ...uniAddr, addr3: e.target.value })
                }
                required
              />
              <br />
            </div>
            <div>
              <label className={ApplicationStyle.lableText}>
                <span style={{ color: "red" }}>*</span>Country of University:
                <br />
              </label>
              <input
                disabled={h === false}
                className={ApplicationStyle.textBox}
                value={uniAddr.country}
                onChange={(e) =>
                  setUniAddr({ ...uniAddr, country: e.target.value })
                }
                required
              />
              <br />
            </div>
            <div>
              <label className={ApplicationStyle.lableText}>
                <span style={{ color: "red" }}>*</span>ZIP/PIN Code:
                <br />
              </label>
              <input
                disabled={h === false}
                className={ApplicationStyle.textBox}
                value={uniAddr.zip}
                onChange={(e) =>
                  setUniAddr({ ...uniAddr, zip: e.target.value })
                }
                required
              />
              <br />
            </div>
            <div>
              <label className={ApplicationStyle.lableText}>
                <span style={{ color: "red" }}>*</span>Type of Education :<br />
              </label>
              <select
                className={ApplicationStyle.textBox}
                onChange={(e) => {
                  setEdType(e.target.value);
                }}
                disabled={h === false}
              >
                <option value="Graduation">Graduation</option>
                <option value="Post Graduation">Post Graduation</option>
                <option value="Others">Others</option>
              </select>
              <br />
            </div>
            <div>
              <label className={ApplicationStyle.lableText}>
                <span style={{ color: "red" }}>*</span>Specialization:
                <br />
              </label>
              <select
                className={ApplicationStyle.textBox}
                onChange={(e) => setSpecialization(e.target.value)}
                disabled={h === false}
              >
                <option value="Science">Science</option>
                <option value="Arts">Arts</option>
                <option value="Commerce">Commerce</option>
                <option value="Medicine">Medicine</option>
                <option value="Dentistry">Dentistry</option>
                <option value="Pharma">Pharma</option>
                <option value="Management">Management</option>
                <option value="Others">Others</option>
              </select>
              <br />
            </div>
            <div>
              <label className={ApplicationStyle.lableText}>
                <span style={{ color: "red" }}>*</span>Experience : (If You Have
                No Work Experience, Type NIL):
                <br />
              </label>
              <input
                disabled={h === false}
                className={ApplicationStyle.textBox}
                value={experiance}
                onChange={(e) => setExperiance(e.target.value)}
                required
              />
              <br />
            </div>

            <div>
              <label className={ApplicationStyle.lableText}>
                <span style={{ color: "red" }}>*</span>Work Experience :
                (Description) :<br />
              </label>
              <input
                disabled={h === false}
                rows="4"
                className={ApplicationStyle.textBox}
                value={experianceDesc}
                onChange={(e) => setExperianceDesc(e.target.value)}
                required
              />
              <br />
            </div>
            <span className={ApplicationStyle.issueText}>
              {issueTextEducation}
            </span>
            <input
              type="button"
              disabled={h === false}
              onClick={() =>
                console.log("first", firstName, "l", lastName, parents, perAddr)
              }
              value="Next"
              style={{ float: "right" }}
              className={ApplicationStyle.nextButton}
            />
            <input
              type="button"
              disabled={h === false}
              onClick={() => EducationValidation()}
              value="Save"
              style={{ float: "right" }}
              className={ApplicationStyle.saveButton}
            />
          </form>
        </Paper>
      </Grid>
    );
  }

  function UploadF() {
    return (
      <Grid item xs={10} disabled={uploadDisable === false}>
        <Paper className={classes.paper} disabled>
          <form>
            <div>
              <h3>Uplaod files</h3>
              <br />
              <br />
              <label className={ApplicationStyle.lableText}>
                <span style={{ color: "red" }}>*</span>Highest Degree
                Certificate <small>(Scanned Copy)</small> <br />
              </label>
              <br />
              <input
                disabled={uploadDisable === false}
                style={{ width: "75px" }}
                //className={ApplicationStyle.textBox}
                type="file"
                name="file"
                className={ApplicationStyle.browse}
                onChange={(e) => handleCertificateFile(e)}
                required
              />
              <span style={{ color: "green" }}>{certificateN}</span>
              <br />
              <br />
              <br />
              <label className={ApplicationStyle.lableText}>
                <span style={{ color: "red" }}>*</span>Transcripts: <br />
              </label>
              <br />
              <input
                disabled={uploadDisable === false}
                style={{ width: "75px" }}
                //className={ApplicationStyle.textBox}
                type="file"
                name="file"
                className={ApplicationStyle.browse}
                onChange={(e) => handleTranscripts(e)}
                required
              />
              <span style={{ color: "green" }}>{transcriptsN}</span>
              <br />
              <br />
              <br />
              <label className={ApplicationStyle.lableText}>
                <span style={{ color: "red" }}>*</span>Passport{" "}
                <small>(Scanned Copy):</small> <br />
              </label>
              <br />
              <input
                disabled={uploadDisable === false}
                style={{ width: "75px" }}
                //className={ApplicationStyle.textBox}
                type="file"
                name="file"
                className={ApplicationStyle.browse}
                onChange={(e) => handlePassport(e)}
                required
              />
              <span style={{ color: "green" }}>{passportFileN}</span>
              <br />
              <br />
              <br />
              <label className={ApplicationStyle.lableText}>
                <span style={{ color: "red" }}>*</span>Other Govt{" "}
                <small>(Scanned Copy):</small> <br />
              </label>
              <br />
              <input
                disabled={uploadDisable === false}
                style={{ width: "75px" }}
                //className={ApplicationStyle.textBox}
                type="file"
                name="file"
                className={ApplicationStyle.browse}
                onChange={(e) => handleGovtFiles(e)}
                required
              />
              <span style={{ color: "green" }}>{otherGovtFileN}</span>
              <br />
              <br />
              <br />
              <label className={ApplicationStyle.lableText}>
                <span style={{ color: "red" }}>*</span>Profile Photo:
                <br />
              </label>
              <br />
              <input
                disabled={uploadDisable === false}
                style={{ width: "75px" }}
                //className={ApplicationStyle.textBox}
                type="file"
                name="file"
                className={ApplicationStyle.browse}
                onChange={(e) => handleProfilePhoto(e)}
                required
              />
              <span style={{ color: "green" }}>{profilePhotoN}</span>
              <br />
              <br />
              <input
                type="button"
                disabled={uploadDisable === false}
                value="Next"
                style={{ float: "right" }}
                className={ApplicationStyle.nextButton}
              />
              <input
                type="button"
                disabled={uploadDisable === false}
                onClick={docValidation}
                value="Save"
                style={{ float: "right", marginBottom: "40px" }}
                className={ApplicationStyle.saveButton}
              />
              <span className={ApplicationStyle.issueText}>
                {issueTextUpload}
              </span>
            </div>
            <br />
          </form>
        </Paper>
      </Grid>
    );
  }

  function ScholarshipF() {
    return (
      <Grid item xs={10}>
        <Paper className={classes.paper}>
          <form>
            <div>
              <h3>Scholarship</h3>
            </div>

            <div>
              <label className={ApplicationStyle.lableText}>
                <span style={{ color: "red" }}>*</span>Do you want to apply for
                Scholarship? :<br />
              </label>
              <select
                className={ApplicationStyle.textBox}
                onChange={(e) => setScholarship(e.target.value)}
                disabled={scholarshipDisable === false}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              <br />
            </div>
            <div>
              <label className={ApplicationStyle.lableText}>
                <span style={{ color: "red" }}>*</span>Learning Center:
                <br />
              </label>
              <select
                className={ApplicationStyle.textBox}
                onChange={(e) => setLearningCenter(e.target.value)}
                disabled={scholarshipDisable === false}
              >
                <option value="KWAME NKRUMAH UNIVERSITY OF SCIENCE & TECHNOLOGY">
                  KWAME NKRUMAH UNIVERSITY OF SCIENCE & TECHNOLOGY
                </option>
                <option value="Universitéd'Abomey-Calavi (UAC), 01 B.P. 526 Cotonou Bénin">
                  Universitéd'Abomey-Calavi (UAC), 01 B.P. 526 Cotonou Bénin
                </option>
                <option value="Has to be updated in iLearn">
                  Has to be updated in iLearn
                </option>
                <option value="University de Man,BP 20 Man, Kassiapleu, Côte d'Ivoire">
                  University de Man,BP 20 Man, Kassiapleu, Côte d'Ivoire
                </option>
                <option value="University of Kinshasa, Lemba Commune, Kinshasa, DRC BP 127, Kinshasa XI">
                  University of Kinshasa, Lemba Commune, Kinshasa, DRC BP 127,
                  Kinshasa XI
                </option>
                <option value="Orotta College of Medicine and Health Sciences, Mai Bela Avenue, Zoba Michael Street, PO Box No. 8566, Asmara, Eritrea">
                  Orotta College of Medicine and Health Sciences, Mai Bela
                  Avenue, Zoba Michael Street, PO Box No. 8566, Asmara, Eritrea
                </option>
                <option value="Kwame Nkrumah University of Science and Technology">
                  Kwame Nkrumah University of Science and Technology
                </option>
                <option value="National College of IT, PO Box 30133, Blantyre, Malawi">
                  National College of IT, PO Box 30133, Blantyre, Malawi
                </option>
                <option value="Mulungushi University, Kabwe Campus">
                  Mulungushi University, Kabwe Campus
                </option>
                <option value="National College of Information Technology (NACIT), Blantyre">
                  National College of Information Technology (NACIT), Blantyre
                </option>
                <option value="Open University of Mauritius, Réduit, Moka, Republic of Mauritius">
                  Open University of Mauritius, Réduit, Moka, Republic of
                  Mauritius
                </option>
                <option value="Eduardo Mondlane University (UEM), Computer Centre of Eduardo Mondlane University and Medicine Faculty, Av. Julius Nyerere, nr. 3453 Maputo, Moçambique">
                  Eduardo Mondlane University (UEM), Computer Centre of Eduardo
                  Mondlane University and Medicine Faculty, Av. Julius Nyerere,
                  nr. 3453 Maputo, Moçambique
                </option>
                <option value="L'Université Gamal Abdel Nasser de Conakry, Dixinn, Rue 14, 00224 Conakry, Guinea">
                  L'Université Gamal Abdel Nasser de Conakry, Dixinn, Rue 14,
                  00224 Conakry, Guinea
                </option>
                <option value="University of Seychelles (UniSey), P.O. Box 1348, Anse Royale, Mahe, Seychelles">
                  University of Seychelles (UniSey), P.O. Box 1348, Anse Royale,
                  Mahe, Seychelles
                </option>
                <option value="Africa City of Technology, Central Amlak East, Street 2/4A, Blue Nile Bridge, P. Box 13332, Bahri, Khartoum-11111, Sudan">
                  Africa City of Technology, Central Amlak East, Street 2/4A,
                  Blue Nile Bridge, P. Box 13332, Bahri, Khartoum-11111, Sudan
                </option>
                <option value="University of Sierra Leone, University House, Fourah Bay College, Mount Aureol, Freetown, Sierra Leone">
                  University of Sierra Leone, University House, Fourah Bay
                  College, Mount Aureol, Freetown, Sierra Leone
                </option>
                <option value="University of The Gambia, Serrekunda">
                  University of The Gambia, Serrekunda
                </option>
                <option value="College of Computing & Information Science (CoCIS), Makerere University Wandegeya,Makerere Hill, Kampala, Uganda">
                  College of Computing & Information Science (CoCIS), Makerere
                  University Wandegeya,Makerere Hill, Kampala, Uganda
                </option>
                <option value="Mulungushi University, P O Box 0415. Kabwe, Zambia">
                  Mulungushi University, P O Box 0415. Kabwe, Zambia
                </option>
              </select>
              <br />
            </div>

            <span className={ApplicationStyle.issueText}>""</span>
            <input
              type="button"
              disabled={scholarshipDisable === false}
              value="Next"
              style={{ float: "right" }}
              className={ApplicationStyle.nextButton}
            />
            <input
              type="button"
              onClick={saveScholarship}
              disabled={scholarshipDisable === false}
              value="Save"
              style={{ float: "right" }}
              className={ApplicationStyle.saveButton}
            />
          </form>
        </Paper>
      </Grid>
    );
  }

  function ReviewF() {
    return (
      <Grid item xs={10} disabled={reviewDisable === false}>
        <Paper className={classes.paper} disabled={reviewDisable === false}>
          <form>
            <h3>General Info</h3>
            <p className={ApplicationStyle.reviewText}>
              Name :{" "}
              <span
                style={{ marginLeft: "380px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {firstName}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              Email :{" "}
              <span
                style={{ marginLeft: "385px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {email}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              Phone No :{" "}
              <span
                style={{ marginLeft: "356px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {phoneNo.telephone}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              Gender :{" "}
              <span
                style={{ marginLeft: "374px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {gender}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              DOB :{" "}
              <span
                style={{ marginLeft: "394px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {dob}
              </span>
            </p>
            <p className={ApplicationStyle.reviewText}>
              Father Name :{" "}
              <span
                style={{ marginLeft: "334px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {parents.fathername}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              Mother Name :{" "}
              <span
                style={{ marginLeft: "328px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {parents.mothername}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              Are you International Student :{" "}
              <span
                style={{ marginLeft: "328px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {internationalStu}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              Passport :{" "}
              <span
                style={{ marginLeft: "362px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {passport}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              Other GovtID :{" "}
              <span
                style={{ marginLeft: "330px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {otherGovt}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              Permanent Address, Address Line 1 :{" "}
              <span
                style={{ marginLeft: "168px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {perAddr.addr1}{" "}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              Permanent Address, Address Line 2 :{" "}
              <span
                style={{ marginLeft: "168px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {" "}
                {perAddr.addr2}{" "}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              Permanent Address, Address Line 3 :{" "}
              <span
                style={{ marginLeft: "168px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {perAddr.addr3}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              Permanent Address, City :{" "}
              <span
                style={{ marginLeft: "248px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {perAddr.city}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              Permanent Address, State :{" "}
              <span
                style={{ marginLeft: "238px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {perAddr.state}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              Permanent Address, Pin :{" "}
              <span
                style={{ marginLeft: "252px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {perAddr.pin}
              </span>
            </p>
            <br />
            <br />
            <br />
            <br />
            <h3>Education</h3>
            <p className={ApplicationStyle.reviewText}>
              Name of School Attended :{" "}
              <span
                style={{ marginLeft: "240px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {schoolName}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              School Address, Address Line 1 :{" "}
              <span
                style={{ marginLeft: "198px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {schAddr.addr1}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              School Address, Address Line 2 :{" "}
              <span
                style={{ marginLeft: "198px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {schAddr.addr2}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              School Address, Address Line 3 :{" "}
              <span
                style={{ marginLeft: "198px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {schAddr.addr3}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              School Address, Country :{" "}
              <span
                style={{ marginLeft: "248px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {schAddr.country}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              School Address, ZIP/PIN :{" "}
              <span
                style={{ marginLeft: "252px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {schAddr.zip}
              </span>
            </p>
            <br />

            <p className={ApplicationStyle.reviewText}>
              Name of University :{" "}
              <span
                style={{ marginLeft: "288px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {university}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              Address of University, Address Line 1 :{" "}
              <span
                style={{ marginLeft: "158px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {uniAddr.addr1}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              Address of University, Address Line 2 :{" "}
              <span
                style={{ marginLeft: "158px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {uniAddr.addr2}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              Address of University, Address Line 3 :{" "}
              <span
                style={{ marginLeft: "158px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {uniAddr.addr3}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              Address of University, Country :{" "}
              <span
                style={{ marginLeft: "208px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {uniAddr.country}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              Address of University, ZIP/PIN :{" "}
              <span
                style={{ marginLeft: "210px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {uniAddr.zip}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              Type of Education :{" "}
              <span
                style={{ marginLeft: "295px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {edType}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              Specialization :{" "}
              <span
                style={{ marginLeft: "326px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {specialization}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              Experience :{" "}
              <span
                style={{ marginLeft: "346px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {experiance}
              </span>
            </p>
            <br />

            <p className={ApplicationStyle.reviewText}>
              Work Experirnce :{" "}
              <span
                style={{ marginLeft: "308px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {experianceDesc}
              </span>
            </p>
            <br />
            <br />
            <h3>Uploaded Documents</h3>
            <br />
            <p className={ApplicationStyle.reviewText}>
              Highest Degree Certificate :{" "}
              <span
                style={{ marginLeft: "226px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {/* certificateN === null ? "" : */ certificateN}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              Transcripts :{" "}
              <span
                style={{ marginLeft: "338px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {/* transcriptsN === null ? "" : */ transcriptsN}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              Passport :{" "}
              <span
                style={{ marginLeft: "353px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {passportFileN}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              Other Govt File :{" "}
              <span
                style={{ marginLeft: "308px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {otherGovtFileN}
              </span>
            </p>
            <br />
            <p className={ApplicationStyle.reviewText}>
              Profile Photo :{" "}
              <span
                style={{ marginLeft: "324px" }}
                className={ApplicationStyle.reviewTextSpan}
              >
                {profilePhotoN}
              </span>
            </p>
            <br />
            {scholarshipDisable === false ? (
              ""
            ) : (
              <div>
                <h3>Scholarship</h3>
                <br />
                <p className={ApplicationStyle.reviewText}>
                  Do you want to apply for Scholarship? :{" "}
                  <span
                    style={{ marginLeft: "144px" }}
                    className={ApplicationStyle.reviewTextSpan}
                  >
                    {scholarship}
                  </span>
                </p>
                <br />
                <p className={ApplicationStyle.reviewText}>
                  Lerning Center :{" "}
                  <span
                    style={{ marginLeft: "310px" }}
                    className={ApplicationStyle.reviewTextSpan}
                  >
                    {learningCenter}
                  </span>
                </p>
                <br />
              </div>
            )}

            <input
              type="button"
              onClick={SubmitApplication}
              disabled={reviewDisable === false}
              value="Save"
              style={{ float: "right" }}
              className={ApplicationStyle.saveButton}
            />
          </form>
        </Paper>
      </Grid>
    );
  }

  let handleTabChange = (e, { activeIndex }) => setActiveIndex(activeIndex);

  return (
    <main>
      <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
        <FaBars />
      </div>
      <UserHeader />
      <div>
        <h1>Application</h1>
        <div className={ApplicationStyle.management}>
          <div className={ApplicationStyle.h1}>
            <h1>
              <strong></strong>
            </h1>
          </div>

          <Tab
            panes={panes}
            activeIndex={activeIndex}
            onTabChange={handleTabChange}
          />
        </div>
      </div>
    </main>
  );
}
