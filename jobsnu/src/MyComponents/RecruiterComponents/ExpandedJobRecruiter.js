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
const useStyles = makeStyles({
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
  }
});

export default function ExpandedJobRecruiter(props) {
  const [cookies, setCookie] = useCookies(["userId"]);
  const [users, setUsers] = useState([]);
  const classes = useStyles();
  const getUserApplications = () => {
    axios.get("/recruiterJobPostApplicants?jobId"+props.jobId).then(res => {
      console.log(res);
      console.log(res.data);
      setUsers(res.data);
    });
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
  //useEffect(() => {
  //  getUserApplications();
  //}, []);
  return (
    <Card className={classes.card}>
      <CardContent>
        <Row>
          <Col xs="auto">
            <img
              style={{ width: "15vh" }}
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
              {users.map((user, i) => (
                <UserListComponent
                  currDesignation={user.currDesignation}
                  jobSeekerName={user.jobSeekerName}
                  location={user.location}
                  workEx={user.workEx}
                />
              ))}
              <UserListComponent />
              <UserListComponent />
              <UserListComponent />
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
    </Card>
  );
}
