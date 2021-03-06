import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  card: {
    maxWidth: 345
  },
  media: {
    height: 140
  }
});
export default function ApplicantsListComponent(props) {
  const show = () => {
    props.showUserDetails(props);
  };
  return (
    <div style={{marginBottom:"3vh", marginTop:"3vh"}}>
      <Card style={{borderRadius:"2vh",backgroundColor:"#c5df9b"}}>
        <CardActionArea onClick={show}>
          <CardContent>
            <p>{props.applicantName}</p>
            <p>Application Date: {props.appliedOn}</p>
            <p>{props.applicantEmail}</p>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}
