// Dependencies imports
import React, { useState,useEffect } from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import Backdrop from "@material-ui/core/Backdrop";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import moment from "moment";
import Skeleton from "@material-ui/lab/Skeleton";
import { Typography } from "@material-ui/core";

// Local imports
import { Constants } from "../../config/constants";
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
// import { Constants } from "../../../config/constants";
import config from "../../config/aws-exports";
import { API } from "aws-amplify";
import { useSelector, useDispatch } from "react-redux";

// Style imports
import { awsSignIn, authData, awsSignOut } from "../../redux/auth/authSlice";
import ReferencePopUp from './ReferencePopUp';

// Styles for Tables
const useStyles = makeStyles((theme) => ({
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        transform: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
    },
}));

// Styles for Pagination
const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}));

// Pagination function
function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}

// Styling for table cell
const programnames = {
    color: config.main_color_1,
    fontFamily: "nunito",
    fontSize: "16px",
    fontWeight: "500px",
    width: "70%"
}

// Start of RecordSession Component
const References = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    let userDetails = useSelector(authData);
    const [tableData, setTableData] = useState([]);
    const [liveLoad, setLiveLoad] = useState(true);
    const [openSession, setOpenSession] = useState(false);
    const[obj,setObj] = useState();
    const  [isLoading, setIsLoading] = useState(false);
    let lcourseDetails = userDetails.curprgcou;
    const classes = useStyles();

    useEffect(() => {
        getCourseVideo()
      }, []);
      
    console.log("userdetails" , JSON.stringify(userDetails));
    async function getCourseVideo() {
        setIsLoading(true);
        const bodyParam = {
          body: {
            oid: config.aws_org_id,
            cid: lcourseDetails.bcid,
            action:"get"
          },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        };
        // alert(JSON.stringify(bodyParam.body));
        try {
          const response = await API.post(
            config.aws_cloud_logic_custom_name,
            // Constants.GET_COURSE_VIDEO,
            Constants.REFERENCES,
            bodyParam
          );
        
          // alert(JSON.stringify(response));
          console.log(response);
            setLiveLoad(false);
            if (response != undefined && response.refer != undefined ) {
                setTableData(response.refer);
            }
            else {
                setTableData([]);
            }
         setIsLoading(false);
        } catch (error) {
          console.error(error);
          setIsLoading(false);
        }
      }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleSessionOpen = () => {
        setOpenSession(true);
    };
    const handleSessionClose = () => {
        setOpenSession(false);
    };
    function viewLive(item) {
        // alert("hiii")
        setObj(item);
        handleSessionOpen();
    }
    

    function sessionList() {

        return (
           
             <TableBody>
             {(rowsPerPage > 0
                 ? tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                 : tableData
             ).map((item, index) => {
                 return (
                     <TableRow>
                         <TableCell style={programnames}>
                             {item.otype != undefined ? <div onClick={() => {
                            viewLive(item);
                             }}><p style={{ cursor: "pointer" }}>{item.title}</p>
                             </div> :<div><p>{item.title}</p></div>}
                         <div>
                          {/* <h4 style={{ marginBottom: "4px", fontSize: "14px" }}>
                            {moment(item.date).format("YYYY-MM-DD h:mm:ss a")}
                                    
                                     
                          </h4> */}
                        </div>
                       {item.link !== undefined ?<div >
                          <h4 style={{ marginBottom: "4px", fontSize: "14px" }}>
                          <a  href={item.link} target="blank">{item.link}</a>
                          </h4>
                        </div>:null} </TableCell>
                     </TableRow>
                 )
             })}
         </TableBody>
        );
        
    }

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={openSession}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openSession}>
                    <ReferencePopUp handleClose={handleSessionClose} obj = {obj} />
                </Fade>
            </Modal>
            <Typography component="list" variant="h1">
                {isLoading ? <Skeleton /> : null}
            </Typography>
            <Typography component="list" variant="h1">
                {isLoading ? <Skeleton /> : null}
            </Typography>
            <TableContainer component={Paper}>

                <Table aria-label="custom pagination table">
                   {sessionList()}
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={tableData.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: { 'aria-label': 'rows per page' },
                                    native: true,
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </div>
    );
};

export default References;