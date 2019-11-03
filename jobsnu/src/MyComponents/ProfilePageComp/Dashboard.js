import React, { ReactComponent, useState, useEffect } from "react";
import axios from "axios"
import JobPostComponent from "./JobPostComponent"
function Dashboard() {
    const [jobs,setJobs]=useState([])

    const handleLoad = (event) => {
        axios
            .get("/jobPosts")
            .then(res => {
                console.log(res.data) 
                console.log(res.data.jobPosts)
                setJobs(res.data.jobPosts)
            })
    }
useEffect(() => {handleLoad()},[])
        return (
            <React.Fragment>
            <div>
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
    
                    />)}
            </div>
            </React.Fragment>
        )
}
export default Dashboard