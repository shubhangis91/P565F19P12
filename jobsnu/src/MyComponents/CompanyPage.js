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
import Alert from "react-bootstrap/Alert";
import images from "../img/images";

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
    
  };
  const [image, setImage] = React.useState('https://icon-library.net/images/facebook-icon-square/facebook-icon-square-8.jpg');

  const handleImage = () => {
    if(props.companyName == "Walmart") {
      setImage('https://5qevh96ime-flywheel.netdna-ssl.com/wp-content/uploads/2018/12/Walmart-Logo.jpg');
      //console.log("wall")
    }
    if (props.companyName == "Facebook, Inc.") {
      setImage("https://icon-library.net/images/facebook-icon-square/facebook-icon-square-8.jpg");
    }
    if (props.companyName == "Google") {
      setImage("https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg");
    }
  }
  
  useEffect(() => {
    handleImage();
    console.log(props)
  }, []);
  return (
    <div>
      <Card>
        <CardActionArea onClick={show}>
          <CardContent>
            
            <OverflowScrolling
              className="overflow-scrolling"
              style={{ height: "40vh" }}
            >
              <img
              style={{ width: "15vh",cursor: "pointer", }}
              //onClick={() => imageClick()}
              src={image}
            />
              <h3>{props.companyName}</h3> 
              <h4>For more info, go to: {props.website}</h4>
              {/* <p>Company size :{props.companySize}</p> */}
              <p>Company Domain:{props.domain} </p>
               <p>Support Email id:{props.emailId}</p> 
               <p>Date Founded:{props.establishedDate}</p> 
               <p>Located at:{props.headquarters}</p> 
               <p>{props.about} </p>
              
            </OverflowScrolling>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}
