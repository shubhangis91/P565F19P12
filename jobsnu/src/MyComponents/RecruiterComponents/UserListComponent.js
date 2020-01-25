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
export default function UserListComponent(props) {
  return (
    <div>
      <Card>
        <CardActionArea>
          <CardContent>
            <p>{props.currDesignation}</p>
            <p>{props.jobSeekerName}</p>
            <p>{props.location}</p>
            <p>{props.workEx}</p>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}
