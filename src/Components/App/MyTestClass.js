import React from 'react'

/*function MyTest(props) {
    return (<div>MyTestDivFunc {props.name}</div>);
}*/

class MyTest extends React.Component{
    constructor(props) {
        super(props);
        this.state = {date: new Date()};
    }
    tick(){
        this.setState({date: new Date()});
    }
    componentDidMount() {
        this.timerId = setInterval(()=> this.tick(), 1000);
    }
    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    render(){
        return (<div>MyTestDivClass {this.props.name} time is {this.state.date.toLocaleTimeString()}</div>);
    }
}

export default MyTest;