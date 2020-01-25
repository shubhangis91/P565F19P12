import StripeCheckout from 'react-stripe-checkout'
import React, { ReactComponent } from "react";
export default class PaymentComponent extends React.Component {

    constructor(props) {
      super(props)
      this.state = {
        amount: this.props.amount
      }
      this.handleToken = this.handleToken.bind(this);
      this.handleAmount = this.handleAmount.bind(this);
    }
    handleToken(token, addresses) {
    this.props.toggleDonateModal()
  
    console.log({ token, addresses });
    }
  
  handleAmount(event){
  this.setState({amount: event.target.value});
  
  };
  
  render(){
    return (
      <div className='container p-2'>
        <div className='row mt-1'>
          <div className='col'>
        <input
          label="Donation Amount"
          type="text"
          name="amount"
          className='form-control '
          value={this.state.amount}
          onChange={this.handleAmount}
        /></div></div>
        <div className='row text-right mt-1'>
          <div className='col'>
        <StripeCheckout
          stripeKey="pk_test_nWEYHY1YKt8OyJ1qukWgVXJJ00ctw76Cvm"
          token={this.handleToken}
          billingAddress
          shippingAddress
          amount={this.state.amount * 100} //need to convert to cents while working with stripe
          name="Get Jobsnu Premium"
        />
  </div>
  </div>
      </div>
    );
  }
  
  }