import React, { ReactComponent, useState, useEffect } from "react";
import axios from "axios"
import JobPostComponent from "./JobPostComponent"
import { useCookies } from "react-cookie";
function UserJobApplications() {
    const [jobs,setJobs]=useState([])
    const [cookies,setCookie]=useCookies(['userId'])
    const handleLoad = (event) => {
        var strJob = "";
        var str2 = "?userId="
        var str3 = cookies['userId'];
        var Appn = strJob.concat(str2,str3)
        axios
            .get("/jobSeekerApplications?userId="+cookies["userId"])
            .then(res => {
                //console.log(Appn)
                //console.log(res.data) 
                //console.log(res.data.jobPosts)
                if(res.data.jsApplications!=null){
                setJobs(res.data.jsApplications)}
            })
    }
useEffect(() => {handleLoad()},[])
        return (
            <React.Fragment>
            <div>
                    {jobs.map((job,i) => <JobPostComponent 
                        city={job.city}
                        companyName={job.companyName}
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
                        jobName={job.jobName}
                        postedById={job.postedById}
                        skillName={job.skillName}
                        apply={false}
                    />)}
            </div>
            </React.Fragment>
        )
}
export default UserJobApplications