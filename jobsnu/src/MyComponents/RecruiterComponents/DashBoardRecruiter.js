import React, { ReactComponent, useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import OverflowScrolling from "react-overflow-scrolling";
import JobPostComponent from "../ProfilePageComp/JobPostComponent";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import Button from "react-bootstrap/Button";
import MenuItem from "@material-ui/core/MenuItem";
import ExpandedJob from "./ExpandedJobRecruiter.js";
import ExpandedJobRecruiter from "./ExpandedJobRecruiter.js";
import UserListComponent from "./UserListComponent";
const useStyles = makeStyles(theme => ({
  centercol: {
    overflowY: "scroll"
  },
  rightcol: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
    //background: "#e7e7e7",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  }
}));

function DashboardRecruiter() {
  const experiences = [
    {
      value: "0",
      label: "0-1 year"
    },
    {
      value: "1",
      label: "1-3 years"
    },
    {
      value: "2",
      label: "3-5 years"
    },
    {
      value: "3",
      label: "5-10 years"
    },
    {
      value: "4",
      label: "10+ years"
    }
  ];
  const [jobs, setJobs] = useState([]);
  const [searchRes, setSearchRes] = useState(false);
  const classes = useStyles();
  const handleChange = name => event => {
    setSearch({ ...search, [name]: event.target.value });
    console.log(search);
  };
  const [isExpand, expandJob] = useState();
  const [isExpanded, expandedJob] = useState(false);
  const [userRes, setUserRes] = useState([]);
  const [showRecruiterJobs, setShowRecruiterJobs] = useState(true);
  const [search, setSearch] = React.useState({
    location: false,
    experience: false,
    keyword: false
  });
  const handleExpand = id => {
    expandJob(id);
    //console.log(expandJob);
    expandedJob(true);
  };
  const handleLoad = event => {
    axios.get("/jobPosts").then(res => {
      //console.log(res.data)
      //console.log(res.data.jobPosts)
      setJobs(res.data.jobPosts);
    });
  };
  const handleSearch = () => {
    var url = "/searchRecruiter?";
    if (search.keyword != false) {
      url = url.concat("keyword=", search.keyword);
      if (search.location != false)
        url = url.concat("&location=", search.location);
      if (search.experience == "0")
        url = url.concat("&workExFrom=", "0", "&workExTo=", "1");
      if (search.experience == "1")
        url = url.concat("&workExFrom=", "1", "&workExTo=", "3");
      if (search.experience == "2")
        url = url.concat("&workExFrom=", "3", "&workExTo=", "5");
      if (search.experience == "3")
        url = url.concat("&workExFrom=", "5", "&workExTo=", "10");
      if (search.experience == "4")
        url = url.concat("&workExFrom=", "10", "&workExTo=", "50");

      console.log(url);
      axios.get(url).then(res => {
        console.log(res.data);
        console.log(res.data.matchedJobSeekers);
        if (res.data.matchedJobSeekers != null) {
          setSearchRes(true);
          setShowRecruiterJobs(false);
          setUserRes(res.data.matchedJobSeekers);
        } else {
          setShowRecruiterJobs(false);
          setSearchRes(false);
        }
      });
    }
  };
  const showRecruiterJobsFunction = () => {
    setShowRecruiterJobs(true);
  };
  useEffect(() => {
    handleLoad();
  }, []);
  return (
    <React.Fragment>
      <h4 style={{ marginLeft: "1%", color: "#c2b9b0" }}>
        {" "}
        Search for People here:{" "}
      </h4>
      <TextField
        id="standard-basic"
        className={classes.textField}
        label="Keywords"
        required
        onChange={handleChange("keyword")}
        margin="normal"
        helperText="Enter Designation, skills, etc."
      />
      <TextField
        id="standard-basic"
        className={classes.textField}
        label="Location"
        margin="normal"
        onChange={handleChange("location")}
      />

      <TextField
        id="standard-select-currency"
        select
        label="Select"
        className={classes.textField}
        value={search.experience}
        onChange={handleChange("experience")}
        SelectProps={{
          MenuProps: {
            className: classes.menu
          }
        }}
        helperText="Please select required experience"
        margin="normal"
      >
        {experiences.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <Button
        onClick={handleSearch}
        style={{
          marginTop: "2.2%",
          marginBottom: "2%",
          backgroundColor: "#e7717d",
          border: "#e7717d"
        }}
      >
        <SearchIcon />
      </Button>
      <Button
        onClick={showRecruiterJobsFunction}
        style={{
          marginTop: "2.2%",
          marginBottom: "2%",
          backgroundColor: "#e7717d",
          border: "#e7717d"
        }}
      >
        Back
      </Button>
      {showRecruiterJobs && (
        <div>
          <h4 style={{ marginLeft: "1%", color: "#c2b9b0" }}>
            {" "}
            Here are Jobs you posted:{" "}
          </h4>
          <Row>
            <Col>
              <OverflowScrolling
                className="overflow-scrolling"
                style={{ height: "70vh" }}
              >
                {jobs.map((job, i) => (
                  <JobPostComponent
                    city={job.city}
                    companyId={job.companyName}
                    country={job.country}
                    description={job.description}
                    domain={job.domain}
                    function={job.function}
                    industry={job.industry}
                    isActive={job.isActive}
                    jobId={job.jobId}
                    jobType={job.jobType}
                    postedById={job.postedById}
                    state={job.state}
                    jobName={job.jobName}
                    postedById={job.postedById}
                    skillLevel={job.skillLevel}
                    skillName={job.skillName}
                    apply={false}
                    handleExpand={handleExpand}
                  />
                ))}
                <JobPostComponent
                  city="job.city"
                  companyId="job.companyName1"
                  country="job.country1"
                  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor. Maecenas nisl est, ultrices nec congue eget, auctor vitae massa. Fusce luctus vestibulum augue ut aliquet. Mauris ante ligula, facilisis sed ornare eu, lobortis in odio. Praesent convallis urna a lacus interdum ut hendrerit risus congue. Nunc sagittis dictum nisi, sed ullamcorper ipsum dignissim ac"
                  domain="job.domain1"
                  function="job.function1"
                  industry="job.industry1"
                  isActive="job.isActive1"
                  jobId="job.jobId1"
                  jobType="{job.jobType}1"
                  postedById="{job.postedById}1"
                  state="{job.state}1"
                  jobName="{job.jobName}1"
                  postedById="{job.postedById}1"
                  skillLevel="{job.skillLevel}1"
                  skillName="{job.skillName}1"
                  apply={false}
                  handleExpand={handleExpand}
                />

                <JobPostComponent
                  city="job.city"
                  companyId="job.companyName2"
                  country="job.country2"
                  description="job.description2"
                  domain="job.domain2"
                  function="job.function2"
                  industry="job.industry2"
                  isActive="job.isActive2"
                  jobId="job.jobId2"
                  jobType="{job.jobType2"
                  postedById="{job.postedById}2"
                  state="{job.state}2"
                  jobName="{job.jobName}2"
                  postedById="{job.postedById}2"
                  skillLevel="{job.skillLevel}2"
                  skillName="{job.skillName2}"
                  apply={false}
                  handleExpand={handleExpand}
                />
                <JobPostComponent
                  city="job.city"
                  companyId="job.companyName3"
                  country="job.country3"
                  description="job.descripti3on"
                  domain="job.domai3n"
                  function="job.functi3on"
                  industry="job.industr3y}"
                  isActive="job.isActiv3e"
                  jobId="job.jobId3"
                  jobType="{job.jobTy3pe}"
                  postedById="{job.pos3tedById}"
                  state="{job.state}3"
                  jobName="{job.jobNa3me}"
                  postedById="{job.pos3tedById}"
                  skillLevel="{job.skil3lLevel}"
                  skillName="{job.skill3Name}"
                  apply={false}
                  handleExpand={handleExpand}
                />
                <JobPostComponent
                  city="job.ci4ty"
                  companyId="job.comp4anyName"
                  country="job.country4"
                  description="job.de4scription"
                  domain="job.doma4in"
                  function="job.funct4ion"
                  industry="job.indus4try}"
                  isActive="job.isAct4ive"
                  jobId="job.job4Id4"
                  jobType="{job.jobT4ype}"
                  postedById="{job.po4stedById}"
                  state="{job.stat4e}"
                  jobName="{job.jobN4ame}"
                  postedById="{job.pos4tedById}"
                  skillLevel="{job.ski4llLevel}"
                  skillName="{job.skil4lName}"
                  apply={false}
                  handleExpand={handleExpand}
                />
              </OverflowScrolling>
            </Col>

            <Col>
              <div className={classes.rightcol}>
                {expandJob.jobId}
                {expandJob.companyName}
                {isExpanded && (
                  <ExpandedJobRecruiter
                    city={isExpand.city}
                    companyId={isExpand.companyName}
                    country={isExpand.country}
                    description={isExpand.description}
                    domain={isExpand.domain}
                    function={isExpand.function}
                    industry={isExpand.industry}
                    isActive={isExpand.isActive}
                    jobId={isExpand.jobId}
                    jobType={isExpand.jobType}
                    postedById={isExpand.postedById}
                    state={isExpand.state}
                    jobName={isExpand.jobName}
                    postedById={isExpand.postedById}
                    skillLevel={isExpand.skillLevel}
                    skillName={isExpand.skillName}
                  />
                )}
              </div>
            </Col>
          </Row>
        </div>
      )}
      {searchRes && !showRecruiterJobs && (
        <OverflowScrolling
          className="overflow-scrolling"
          style={{ height: "70vh" }}
        >
          {userRes.map((user, i) => (
            <UserListComponent
              currDesignation={user.currDesignation}
              jobSeekerName={user.jobSeekerName}
              location={user.location}
              workEx={user.workEx}
            />
          ))}
        </OverflowScrolling>
      )}
      {!searchRes && !showRecruiterJobs && (
        <h4 style={{ marginLeft: "1%", color: "#c2b9b0" }}>
          {" "}
          Search returned no results, Try searching again:{" "}
        </h4>
      )}
    </React.Fragment>
  );
}
export default DashboardRecruiter;
