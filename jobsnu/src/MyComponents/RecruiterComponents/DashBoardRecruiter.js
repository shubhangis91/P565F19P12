import React, { ReactComponent, useState,useEffect } from "react";
import axios from "axios"
import { makeStyles } from '@material-ui/core/styles';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import OverflowScrolling from 'react-overflow-scrolling';
import JobPostComponent from "../ProfilePageComp/JobPostComponent"
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import Button from 'react-bootstrap/Button'
import MenuItem from '@material-ui/core/MenuItem';
import ExpandedJob from "./ExpandedJobRecruiter.js"
import ExpandedJobRecruiter from "./ExpandedJobRecruiter.js";
const useStyles = makeStyles(theme=>({
    centercol: {
            overflowY: 'scroll',
        
    },
    rightcol: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        //background: "#e7e7e7",
        

      },
      textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
      },

  })
);

function DashboardRecruiter() {
    const [jobs,setJobs]=useState([])
    const classes = useStyles();
    const handleChange = (name) => event => {
        setSearch({ ...search, [name]: event.target.value });
        console.log(search)
      };
      const [isExpand,expandJob]=useState()
      const [isExpanded,expandedJob]=useState(false)

      const [search, setSearch] = React.useState({
        skill:'',
        location:'',
        name:'',
        Designation:'',
      });
      const handleExpand = (id) => {
        expandJob(id)
        console.log(expandJob)
        expandedJob(true)
    }
    const handleLoad = (event) => {
        axios
            .get("/jobPosts")
            .then(res => {
                //console.log(res.data) 
                //console.log(res.data.jobPosts)
                setJobs(res.data.jobPosts)
            })
    }
    const handleSearch = () => {
        axios
            .post("/",{search})
            .then(res=>{
                setJobs(res.data.jobPosts)
            })
    }  
useEffect(() => {handleLoad()},[])
        return (
            <React.Fragment>
                <h4 style= {{marginLeft:"1%",color:"#c2b9b0"}}> Search for People here: </h4>
                <TextField
                    id="standard-basic"
                    className={classes.textField}
                    label="Name"
                    margin="normal"
                    onChange={handleChange('name')}
                />
                <TextField
                    id="standard-basic"
                    className={classes.textField}
                    label="Location"
                    margin="normal"
                    onChange={handleChange('location')}
                />
                <TextField
                    id="standard-basic"
                    className={classes.textField}
                    label="Required Skill"
                    margin="normal"
                    onChange={handleChange('skill')}
                />
                <TextField
                    id="standard-basic"
                    className={classes.textField}
                    label="Current Designation"
                    onChange={handleChange('designation')}
                    margin="normal"
                />
                <Button onClick={handleSearch} style={{marginTop:"2.2%",marginBottom:"2%",backgroundColor:"#e7717d",border:"#e7717d"}}>
                        <SearchIcon/>
                    </Button>
                    <h4 style= {{marginLeft:"1%",color:"#c2b9b0"}}> Here are Jobs you posted: </h4>
            <Row>
            <Col>
            <OverflowScrolling className='overflow-scrolling' style={{  height: "70vh"}}>
                    {jobs.map((job,i) => <JobPostComponent 
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

                    />)}
            <JobPostComponent 
                            city="job.city"
                            companyId="job.companyName1"
                            country="job.country1"
                            description="job.description1"
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
            {isExpanded&&<ExpandedJobRecruiter
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
                        />}
            </div>
            </Col>
            </Row>
        </React.Fragment>

        )
}
export default DashboardRecruiter