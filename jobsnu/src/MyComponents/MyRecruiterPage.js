import React from "react"
import MyNavBarRecruiter from "./MyNavBarRecruiter"
import Cont1 from "./ProfilePageComp/Cont1"
import RecruiterPage from "./RecruiterComponents/RecruiterPage"
function MyProfilePage()   {
    return(
        <div>
            <MyNavBarRecruiter/>
            <RecruiterPage/>
            
        </div>
    )
}

export default MyProfilePage