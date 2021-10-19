// Dependencies imports
import { Add } from '@material-ui/icons';
import React from 'react';
import ReactPlayer from "react-player";
// Local imports
import { ReactComponent as Close } from "../../assets/svg/close_black_24dp.svg";
import { Constants } from "../../config/constants";
import config from "../../config/aws-exports";
import { authData } from "../../redux/auth/authSlice";
// Styles imports
import Ann from "./ReferencePopUp.module.scss";

const ReferencePopUp = (props) => {
    let { handleClose,obj } = props;
console.log("data"+JSON.stringify(obj));


    return (
        <div className={Ann.mainpopup}>
            <div className={Ann.iconholder}>
                <Close onClick={handleClose} className={Ann.icon} />
            </div>
            <div className={Ann.mediaholder} style={{display:"flex", alignItems:"center", justifyItems: "center", height:"100% !important", width:"100% !important", overflowY:"auto"}}>
            <div>
                {obj.otype === "pdf" ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100% !important",
                        height: "500px",
                        overflowX: "hidden",
                        paddingBottom:"20px",
                        objectFit: "cover"
                      }}
                    >
                      <iframe
                        src={`https://${config.DOMAIN}/${config.aws_org_id.toLowerCase()}-resources/coursereferences/${obj.ourl}`}
                        
                        width={600}
                        title="Iframe Example"
                      ></iframe>
                      {/* <Document
                      file={`https://${config.DOMAIN}/${config.aws_org_id.toLowerCase()}-resources/images/announcement-images/0047786524-3.pdf`}
                      onLoadSuccess={onDocumentLoadSuccess}
                    >
                      <Page pageNumber={pageNumber} />
                    </Document> */}
                    </div>
                  </>
                ) : null || obj.otype === "video" ? (
                  <div
                    className="player-wrapper"
                    style={{ display: "flex", justifyContent: "center", width:"100%" ,alignItems: "center"}}
                  >
                    <ReactPlayer url={`https://${config.DOMAIN}/${config.aws_org_id.toLowerCase()}-resources/coursereferences/${obj.ourl}`} controls={true} width="100%" />
                  </div>
                ) : null || obj.otype === "audio" ? (
                  <div
                    className="player-wrapper"
                   
                  >
                    <ReactPlayer url={`https://${config.DOMAIN}/${config.aws_org_id.toLowerCase()}-resources/coursereferences/${obj.ourl}`} controls={true} height="50px" />
                  </div>
                ) : null || obj.otype === "image" ? (
                  <div style={{width:"100%", height: "300px", margin:"auto", display:"flex", alignItems:"center", justifyContent:"center"}}
                  > 
                  <img src={`https://${config.DOMAIN}/${config.aws_org_id.toLowerCase()}-resources/coursereferences/${obj.ourl}`} style={{objectFit:"cover"}} />
                  </div>)  : null }
              </div>
            </div>
        </div>
    );

};

export default ReferencePopUp;