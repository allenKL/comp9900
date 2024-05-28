import React from 'react';
import axios from "axios";

export default class HelloWorld extends React.Component {
    state = {
      greet: "Hello World!"
    }
  
    componentDidMount() {
      axios.get('api/hello-react/')
        .then(res => {
          console.log(res.data);
          const greet = res.data;
          this.setState({ greet })
        })
        .catch(err => {
          console.log(err);
        })
    }
  
    render() {
      return (
        <h1>{ this.state.greet }</h1>
      )
    }
  }