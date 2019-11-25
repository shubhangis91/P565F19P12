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
import ChatIcon from '@material-ui/icons/Chat';
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
      <Card>
        {/* <CardActionArea onClick={show}> */}
          <CardContent>
            <p>{props.user.firstName} {props.user.lastName}</p>
            <p>{props.user.primaryContact} {props.user.secondaryContact}</p>
            <Button style={{backgroundColor:"#e7717d"}}>
                <ChatIcon/> Message
            </Button>
            <OverflowScrolling
              className="overflow-scrolling"
              style={{ height: "70vh" }}
            >
            <Typography>
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
            </Typography>
            <Typography>
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
            </Typography>
            </OverflowScrolling>
          </CardContent>
        {/* </CardActionArea> */}
      </Card>
    </div>
  );
}
