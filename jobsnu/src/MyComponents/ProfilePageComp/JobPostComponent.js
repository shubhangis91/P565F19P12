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
import { LinearProgress } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";
import OverflowScrolling from "react-overflow-scrolling";
import images from "../../img/images";

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
    border: "2px solid #ff4081",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

export default function JobPostComponent(props) {
  const [cookies, setCookie] = useCookies(["userId"]);
  const classes = useStyles();
  const [skills, setSkills] = useState(props.skillName);

  const handleOpenSucc = () => {
    setOpenSucc(true);
  };
  const handleCloseSucc = () => {
    setOpenSucc(false);
    window.location.reload(false);
  };

  const [openSucc, setOpenSucc] = React.useState(false);

  const handleOpenFail = () => {
    setOpenFail(true);
  };
  const handleCloseFail = () => {
    setOpenFail(false);
    window.location.reload(false);
  };

  const [openFail, setOpenFail] = React.useState(false);

  const applyJob = event => {
    const user = {
      userId: parseInt(cookies["userId"]),
      jobId: props.jobId
    };
    console.log(user);
    axios.post("/applyJob", { user }).then(res => {
      console.log(res);
      console.log(res.data);
      if (res.data.jobApplied == "1") {
        handleOpenSucc();
      }
      if (res.data.jobApplied == "0") {
        handleOpenFail();
      }
    });
  };
  const learnMore = () => {
    props.handleExpand(props);
  };
  const [image, setImage] = React.useState('https://5qevh96ime-flywheel.netdna-ssl.com/wp-content/uploads/2018/12/Walmart-Logo.jpg');

  const handleImage = () => {
    if(props.companyId == "Walmart") {
      setImage('https://5qevh96ime-flywheel.netdna-ssl.com/wp-content/uploads/2018/12/Walmart-Logo.jpg');
      //console.log("wall")
    }
    if (props.companyId == "Facebook") {
      setImage("https://www.ebusinessweekly.co.zw/wp-content/uploads/sites/23/2018/09/amazon_logo_500500._V323939215_-e1536167552323.png");
    }
  }
  useEffect(() => {
    handleImage();
  }, []);
  return (
    <Card className={classes.card} style={{minWidth:"40vh",backgroundColor:"#fff0f2"}}>
      <CardActionArea onClick={learnMore}>
        <CardMedia
          className={classes.media}
          component="img"
          alt="Company logo {props.companyName}"
          image={image}
          title="{props.companyName}"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.jobName}
            <br/>

            {props.skillName.map((skill, i) => (
              <Tooltip title="This skill is required">
                <Chip style={{marginRight:'1%'}} label={skill} color="secondary" />
              </Tooltip>
            ))}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            <LocationOnIcon /> {props.city}, {props.state}, {props.country}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {props.apply && (
          <Button onClick={applyJob} size="small" color="primary">
            Apply
          </Button>
        )}
        <Button onClick={learnMore} size="small" color="primary">
          Details
        </Button>
        <div>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={openSucc}
            onClose={handleCloseSucc}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500
            }}
          >
            <Fade in={openSucc}>
              <div className={classes.paper}>
                <h3>
                  Your application was a Success, the Recruiter has been
                  Notified!
                </h3>
                <Button variant="primary" onClick={handleCloseSucc}>
                  Okay
                </Button>
              </div>
            </Fade>
          </Modal>
        </div>
        <div>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={openFail}
            onClose={handleCloseFail}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500
            }}
          >
            <Fade in={openFail}>
              <div className={classes.paper}>
                <h3>Your application was a Failure, You have already applied to Job!</h3>
                <Button variant="primary" onClick={handleCloseFail}>
                  Okay
                </Button>
              </div>
            </Fade>
          </Modal>
        </div>
      </CardActions>
    </Card>
  );
}
