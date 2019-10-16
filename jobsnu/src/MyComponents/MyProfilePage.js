import React from "react"
import MyNavBar from "./MyNavBar"
import Cont1 from "./ProfilePageComp/Cont1"
import Cont2 from "./ProfilePageComp/Cont2"
function MyProfilePage()   {
    return(
        <div>
            <MyNavBar />
            <Cont1/>
            <Cont2/>
        </div>
    )
}

export default MyProfilePage