import './Login.css';
import React, { Component } from 'react';
import {useNavigate} from 'react-router-dom';
import {Link} from "react-router-dom";


export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pseudo : '',
      password: ''
    };
  }
  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }
  render() {
    return (
      <div className="Login">
        <div className="form">
          <form onSubmit={this.onSubmit} class="form-example">
            <h2>Login!</h2>
            <div className='test'>
              <label for="pseudo">Nickname : </label><br/>
              <input
                type="name"
                name="pseudo"
                placeholder="Enter pseudo"
                value={this.state.pseudo}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className='test'>
              <label for="password">Password : </label><br/>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={this.state.password}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className='button-form'>
                <input className='button' type="submit" value="&#10003;"/>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  onSubmit = (event) => {
    event.preventDefault();
    const user = {
        pseudo: this.state.pseudo,
        password: this.state.password
    }

    fetch('http://localhost:8080/api/users/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)}
    ).then(res => { 
      if (res.status !== 200) {
          const error = new Error(res.error);
          throw error;
      }
      return(res.json())
    }).then(data => {
      alert('Succefull login !');
      localStorage.setItem("token", JSON.stringify(data.user_id));
      window.location.href = "http://localhost:3000/";
    }).catch(err => {
      console.error(err);
      alert('Error logging in please try again');
    });
  }
}
