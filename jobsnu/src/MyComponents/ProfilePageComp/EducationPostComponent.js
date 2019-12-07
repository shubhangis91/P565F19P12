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
import LocationCityIcon from "@material-ui/icons/LocationCity";
import { Paper } from "@material-ui/core";
import Collapse from '@material-ui/core/Collapse';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import SchoolIcon from '@material-ui/icons/School';const useStyles = makeStyles({
  card: {
    display: "flex",
    marginTop: "5%",
    minWidth:"",
    background:'#F4F4F4',

  },
  media: {
    height: "15%",
    width: "15%"
  },
});

export default function EducationPostComponent(props) {
  //const classes = useStyles();
  const show = () => {
    console.log(props)
    showDescription(!description)
  }
  //console.log(props)
  const [description,showDescription]=useState(false)
  const[date,setDate]=useState(props.startDate.substring(0, 4) + " - " + props.endDate.substring(0, 4))
  return (
    <VerticalTimelineElement
    className="vertical-timeline-element--work"
    contentStyle={{ background: '#e7717d', color: '#fff'}}
    contentArrowStyle={{ borderRight: '7px solid  #e7717d' }}
    date={date}
    iconStyle={{ background: '#e7717d', color: '#fff' }}
    icon={<SchoolIcon />}
  >
    <div>
    <h3 className="vertical-timeline-element-title">{props.eduLevel} {props.eduField}</h3>
    <h4 className="vertical-timeline-element-subtitle"><LocationCityIcon /> {props.institute}</h4>
    <p>
    Grade:{props.percentage} <br/>
    </p>
    </div>
  </VerticalTimelineElement>
    // <div>
    // <Card className={classes.card}>
    //   <CardActionArea
    //   //  onClick={show}
    //   >
    //     <CardContent>
    //       <Typography gutterBottom variant="h5" component="h2">
    //         {props.eduLevel} {props.eduField}
    //       </Typography>
    //       <Typography variant="body2" color="textSecondary" component="p">
    //         <LocationCityIcon /> {props.institute}
    //       </Typography>
    //     </CardContent>
    //   </CardActionArea>
    //   <CardActions>
    //     <Typography gutterBottom>
    //       {props.startDate.substring(0, 7)} {props.endDate.substring(0, 7)}
    //     </Typography>
    //     <Typography gutterBottom >
    //       Grade: <br/> <div style={{textAlign:"center"}}>{props.percentage}</div>
    //     </Typography>
    //     {/* <Button size="small" color="primary" onClick={show}>
    //       Learn More
    //     </Button> */}
    //   </CardActions>
    // </Card>
    // <Paper>
    // <Collapse in={description} timeout="auto" unmountOnExit>
    //     <Typography paragraph style={{marginLeft:"1%"}}>
    //     {props.description}
    //     </Typography>
    // </Collapse>
    // </Paper>
    // </div>
  );
}
