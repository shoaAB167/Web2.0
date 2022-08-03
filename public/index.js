class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      'total amount' : 1000
    }
  }
  render(){
    return(
    <div>
        <h1>Lottery Application 2.0 </h1>
      <div>
      <p> Total lottery amount is {this.state.total_amount}</p>
      </div>
      <form>
      <input placeholder="amount" />
      <input placeholder="email" />
      </form>
    </div>
    )
  }
};

ReactDOM.render(<div><App /></div>,
  document.getElementById('reactBinding')
);
