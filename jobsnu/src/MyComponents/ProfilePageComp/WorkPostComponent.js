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
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Paper } from "@material-ui/core";
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import BusinessIcon from '@material-ui/icons/Business';
import WorkIcon from '@material-ui/icons/Work';

const useStyles = makeStyles(theme=>({
  card: {
    display: "flex",
    marginTop: "5%",
    maxWidth:"140vh",
    background:'#F4F4F4',

  },
  media: {
    height: "15%",
    width: "15%"
  },
  expand: {
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
}));

export default function WorkPostComponent(props) {
  const classes = useStyles();
  const [description,showDescription]=useState(false)
  const show = () => {
    console.log(props)
    showDescription(!description)
  }
  const[date,setDate]=useState(props.startDate.substring(0, 4) + " - " + props.endDate.substring(0, 4))
  //console.log(date)
  return (
    <VerticalTimelineElement
    className="vertical-timeline-element--work"
    contentStyle={{ background: '#Afd275', color: '#fff' }}
    contentArrowStyle={{ borderRight: '7px solid  #Afd275' }}
    date={date}
    iconStyle={{ background: '#Afd275', color: '#fff' }}
    icon={<WorkIcon />}
  >
    <h3 className="vertical-timeline-element-title">{props.designation}</h3>
    <h4 className="vertical-timeline-element-subtitle"><BusinessIcon/> {props.company}, {props.location}</h4>
    <p>
    {props.description}
      Creative Direction, User Experience, Visual Design, Project Management, Team Leading
    </p>
  </VerticalTimelineElement>
    // <div>
    // <Card className={classes.card}>
    //   <CardActionArea onClick={show}>
    //     <CardMedia
    //       className={classes.media}
    //       component="img"
    //       alt="Company logo {props.companyName}"
    //       image="https://5qevh96ime-flywheel.netdna-ssl.com/wp-content/uploads/2018/12/Walmart-Logo.jpg"
    //       title="{props.companyName}"
    //     />
    //     <CardContent>
    //       <Typography gutterBottom variant="h5" component="h2">
    //         {props.designation}
    //       </Typography>
    //       <Typography variant="body2" color="textSecondary" component="p">
    //         <LocationCityIcon /> {props.company},{props.location}
    //       </Typography>
    //     </CardContent>
    //   </CardActionArea>
    //   <CardActions>
    //     <Typography gutterBottom>
    //       {props.startDate.substring(0, 7)}  {props.endDate.substring(0, 7)}
    //     </Typography>
    //     <Typography gutterBottom>{props.percentage}</Typography>
    //     <Button onClick={show} size="small" color="primary">
    //       Learn More
    //     </Button>
    //   </CardActions>
    //   </Card>
    //   <div style={{background:"#f4f4f4",borderBottomLeftRadius:"4%",borderBottomRightRadius:"4%"}}>
    //   <Collapse in={description} timeout="auto" unmountOnExit>
    //       <Typography paragraph style={{marginLeft:"1%"}}>
    //       {props.description}
    //       </Typography>
    //   </Collapse>
    //   </div>
    //   </div>
  );
}
