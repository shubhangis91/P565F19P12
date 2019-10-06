import React, { ReactComponent } from "react";
import LogIn from "./LogIn"
import Register from "./Register"




class Cont1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLogin: true,
          };
          this.hideLogin=this.hideLogin.bind(this)
        }
      hideLogin() {
        this.setState({showLogin: !this.state.showLogin});
      };
    render()  {
        return(
        <div>
            <div className="row"> 
                <div className="col-7">
                  <h1 style= {{marginTop: "25%",marginLeft:"1%",color:"#c2b9b0"}}> Find the right job or internship for you </h1>
                  <img style={{width:"100%",marginTop:"35%", marginLeft:"1%"}} src="https://www.aperianglobal.com/content/uploads/2019/09/Blog-Header_-How-to-Be-Inclusive-of-Refugees-in-the-Workplace.png" />
                </div>
              {  (this.state.showLogin) && < LogIn hideLogin={this.hideLogin} />}
              {  !(this.state.showLogin) && < Register hideLogin={this.hideLogin} />}
                
            </div>
        </div>
    )
  }
}

export default Cont1