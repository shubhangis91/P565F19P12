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
                  <h1 style= {{marginTop: "18%",marginBottom:"5%",marginLeft:"2.5%",color:"#c2b9b0"}}> Find the right job or internship for you </h1>
                  <img style={{width:"100%",}} src="https://static-vectorplace-com.ams3.digitaloceanspaces.com/uploads/works/78312/preview_78312.jpg" />
                </div>
              {  (this.state.showLogin) && < LogIn hideLogin={this.hideLogin} />}
              {  !(this.state.showLogin) && < Register hideLogin={this.hideLogin} />}
                
            </div>
        </div>
    )
  }
}

export default Cont1