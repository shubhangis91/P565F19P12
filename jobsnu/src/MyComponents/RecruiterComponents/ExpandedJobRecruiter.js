import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import axios from "axios";
import { useCookies } from "react-cookie";
import OverflowScrolling from "react-overflow-scrolling";
import UserListComponent from "./UserListComponent.js";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";
import ApplicantsListComponent from "./ApplicantsListComponent";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import ProfilePage from "../ProfilePage.js";
import CompanyPage from "../CompanyPage.js";

const useStyles = makeStyles(theme => ({
  card: {
    display: "flex",
    marginBottom: "5%",
    marginRight: "5%",
    background: "#F4F4F4",
    borderRadius: "4%"
  },
  media: {
    height: "15%",
    width: "15%"
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

export default function ExpandedJobRecruiter(props) {
  const [open, setOpen] = React.useState(false);
  const [education, setEducation] = React.useState([]);
  const [workExp, setWorkExp] = React.useState([]);
  const [skills, setSkills] = React.useState([]);
  const [user, setUser] = React.useState([]);
  const [compDetails, setCompDetails] = useState({
    companyName:'',
    companySize:'',
    domain:'',
    emailId:'',
    establishedDate:'',
    headquarters:'',
    primaryContact:'',
    industry:'',
    website:'',
    about:'',
  });
  const handleOpenPerson = id => {
    setOpen(true);
    console.log(id.applicantId);
    var strUser = "/userDetails";
    var strEdu = "/showEducation";
    var strWork = "showWorkExperience";
    var str2 = "?userId=";
    var str3 = id.applicantId;
    var getUserdetails = strUser.concat(str2, str3);
    var getEducation = strEdu.concat(str2, str3);
    var getWork = strWork.concat(str2, str3);
    axios.get(getUserdetails).then(res => {
      console.log(res.data);
      setUser(res.data);
      console.log(user);
      console.log(user.dob);
    });
    axios.get(getEducation).then(res => {
      console.log(res.data.educationList);
      setEducation(res.data.educationList);
      //         console.log(education)
    });
    axios.get(getWork).then(res => {
      //console.log(res.data.workExperiences)
      setWorkExp(res.data.workExperiences);
      //console.log(workExp)
    });
  };

  const handleClosePerson = () => {
    setOpen(false);
  };

  const [openComp, setOpenComp] = React.useState(false);

  const handleOpenCompany = () => {
    if (props.companyName == "Walmart") {
      getCompanyDetails("1");
    }
    if (props.companyName == "Facebook") {
      getCompanyDetails("2");
    }
    setOpenComp(true);
  };
  const getCompanyDetails = companyId => {
    console.log("/companyDetails?companyId=" + companyId);
    axios.get("/companyDetails?companyId=" + companyId).then(res => {
      console.log(res.data);
      setCompDetails(res.data);
    });
  };

  const handleCloseCompany = () => {
    setOpenComp(false);
  };

  const [cookies, setCookie] = useCookies(["userId"]);
  const classes = useStyles();
  const showUserDetails = id => {
    console.log(id);
    handleOpenPerson(id);
  };
  const descriptionShow = () => {
    if (isExpanded == true) {
      setDescription(description.substring(0, 100).concat("..."));
      setExpanded(false);
    } else {
      setExpanded(true);
      setDescription(props.description);
    }
  };
  const [isExpanded, setExpanded] = React.useState(false);
  const [description, setDescription] = useState(
    props.description.substring(0, 100).concat("...")
  );
  const imageClick = () => {
    console.log(props.companyName);
    handleOpenCompany();
  } 
  return (
    <Card className={classes.card}>
      <CardContent>
        <Row>
          <Col xs="auto">
            <img
              style={{ width: "15vh",cursor: "pointer", }}
              onClick={() => imageClick()}
              src="https://5qevh96ime-flywheel.netdna-ssl.com/wp-content/uploads/2018/12/Walmart-Logo.jpg"
            />
          </Col>
          <Col>
            <h3 style={{ marginTop: "4vh" }}>{props.jobName}</h3>
            <p style={{ color: "grey" }}>
              <LocationOnIcon /> {props.city},{props.state},{props.country}
            </p>
          </Col>
          <Col xs="auto"></Col>
        </Row>

        <Row>
          <Col xs="9">
            {description} <UnfoldMoreIcon onClick={descriptionShow} />
            <br />
            <h5 style={{ color: "#7e865a" }}>
              {" "}
              People that have applied for the Job:{" "}
            </h5>
            <OverflowScrolling
              className="overflow-scrolling"
              style={{ height: "35vh" }}
            >
              {console.log(props.users)}
              {props.users.map((user, i) => (
                <ApplicantsListComponent
                  applicantId={user.applicantId}
                  applicantName={user.applicantName}
                  appliedOn={user.appliedOn}
                  applicantEmail={user.applicantEmail}
                  showUserDetails={showUserDetails}
                />
              ))}
              <ApplicantsListComponent
                applicantId="{us1er.applicantId}"
                applicantName="{us1er.applicantName}"
                appliedOn="{user.a1ppliedOn}"
                applicantEmail="{u1ser.applicantEmail}"
                showUserDetails={showUserDetails}
              />
              <ApplicantsListComponent
                applicantId="{user.ap2plicantId}"
                applicantName="{user.2applicantName}"
                appliedOn="{user.appli2edOn}"
                applicantEmail="{user.ap2plicantEmail}"
                showUserDetails={showUserDetails}
              />
              <ApplicantsListComponent
                applicantId="{user.appli3cantId}"
                applicantName="{user.appl3icantName}"
                appliedOn="{user.appliedO3n}"
                applicantEmail="{user.appl3icantEmail}"
                showUserDetails={showUserDetails}
              />
            </OverflowScrolling>
          </Col>
          <Col
            xs="3"
            style={{ borderLeftStyle: "solid", borderColor: "#7e685A" }}
          >
            <div>
              <Typography gutterBottom variant="body1" component="h2">
                What Industry: {props.industry}
              </Typography>
              <Typography gutterBottom variant="body1" component="p">
                Job Domain: {props.domain}
              </Typography>
              <Typography gutterBottom variant="body1" component="h2">
                What Function you will perform? {props.function}
              </Typography>
              <Typography gutterBottom variant="body1" component="h2">
                Job Type: {props.jobType}
              </Typography>
              <Typography gutterBottom variant="body1" component="h2">
                Job Type: {props.jobType}
              </Typography>
            </div>
          </Col>
        </Row>
      </CardContent>
      <CardActions></CardActions>
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClosePerson}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              <ProfilePage
                education={education}
                workExp={workExp}
                user={user}
                skills={skills}
              />
            </div>
          </Fade>
        </Modal>
      </div>
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={openComp}
          onClose={handleCloseCompany}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500
          }}
        >
          <Fade in={openComp}>
            <div className={classes.paper}>
            <CompanyPage
                companyName={compDetails.companyName}
                companySize={compDetails.companySize}
                domain={compDetails.domain}
                emailId={compDetails.emailId}
                establishedDate={compDetails.establishedDate}
                headquarters={compDetails.headquarters}
                primaryContact={compDetails.primaryContact}
                industry={compDetails.industry}
                website={compDetails.website}
                about={compDetails.about}
              />
            </div>
          </Fade>
        </Modal>
      </div>
    </Card>
  );
}
