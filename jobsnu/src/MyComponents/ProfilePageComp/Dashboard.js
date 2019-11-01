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
                console.log(jobs)
            })
    }
useEffect(() => {handleLoad()},[])
        return (
            <React.Fragment>
            <div>
                    {jobs.map((job,i) => <JobPostComponent 
                        description={job.description}
                        city={job.city}
                        companyId={job.companyId}
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

                    />)}
            </div>
            </React.Fragment>
        )
}
export default Dashboard