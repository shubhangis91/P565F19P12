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
export default function CompanyPage(props) {
  const show = () => {
    console.log(props)
  };
  return (
    <div>
      <Card>
        <CardActionArea onClick={show}>
          <CardContent>
            <p>{props.companyName}</p>
            <h1>oye</h1>
            <OverflowScrolling
              className="overflow-scrolling"
              style={{ height: "70vh" }}
            >
            </OverflowScrolling>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}
