import React from "react"
import MyNavBar from "./MyNavBar"
import Cont1 from "./HomePageComp/Cont1"
import Cont2 from "./HomePageComp/Cont2"
function MyHomePage()   {
    return(
        <div>
            <MyNavBar />
            <Cont1/>
            <Cont2/>
        </div>
    )
}

export default MyHomePage