import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import EducationPostComponent from "./ProfilePageComp/EducationPostComponent";
import WorkPostComponent from "./ProfilePageComp/WorkPostComponent";
import OverflowScrolling from "react-overflow-scrolling";
import ChatIcon from "@material-ui/icons/Chat";
import {
  VerticalTimeline,
  VerticalTimelineElement
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { textAlign } from "@material-ui/system";
import { Tab } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import { useCookies } from "react-cookie";

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`
  };
}
const useStyles = makeStyles({
  card: {
    maxWidth: 345
  },
  media: {
    height: 140
  }
});
export default function ProfilePage(props) {

  //   const show = () => {
  //     console.log(props.education)
  //     console.log(props.workExp)
  //     console.log(props.user)
  //     console.log(props.skill)
  //   };
  return (
    <div>
      <Card style={{ borderRadius: "4vh" }}>
        {/* <CardActionArea onClick={show}> */}
        <CardContent style={{ backgroundColor: "#F4F4F4" }}>
          <p>
            {props.user.firstName} {props.user.lastName}
          </p>
          <p>
            {props.user.primaryContact} {props.user.secondaryContact}
          </p>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={props.value}
            onChange={props.handleChange}
            aria-label="Vertical tabs example"
            //className={classes.tabs}
          >
            <Tab label="" {...a11yProps(0)} disabled style={{display:"none"}} />
            <Tab label="" {...a11yProps(1)} disabled style={{display:"none"}}/>
            <Tab
              label="Message"
              {...a11yProps(2)}
              onClick={props.handleClosePerson}
            />
          </Tabs>
          <ChatIcon /> Message
          <br />
          <br />
          <div style={{ display: "block", textAlign: "center" }}>
            <h4 style={{ color: "#ff4081", fontWeight: "300" }}>
              {" "}
              Here's the User's Time Line:{" "}
            </h4>
          </div>
          <OverflowScrolling
            className="overflow-scrolling"
            style={{
              height: "70vh",
              backgroundColor: "#c3b9b0",
              borderRadius: "4vh"
            }}
          >
            <VerticalTimeline>
              {props.education.map((edu, i) => (
                <EducationPostComponent
                  key={i}
                  userId={edu.userId}
                  eduLevel={edu.eduLevel}
                  eduField={edu.eduField}
                  institute={edu.institute}
                  startDate={edu.startDate}
                  endDate={edu.endDate}
                  percentage={edu.percentage}
                />
              ))}
              {props.workExp.map((work, i) => (
                <WorkPostComponent
                  key={i}
                  userId={work.userId}
                  company={work.company}
                  startDate={work.startDate}
                  endDate={work.endDate}
                  description={work.description}
                  designation={work.designation}
                  location={work.location}
                />
              ))}
            </VerticalTimeline>
          </OverflowScrolling>
        </CardContent>
        {/* </CardActionArea> */}
      </Card>
    </div>
  );
}
