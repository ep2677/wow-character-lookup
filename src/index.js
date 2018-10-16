import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import logo from './images/eagleDreamLogo.png';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      charError: false,
    };
  }
  fetchData(url) {
    fetch(url)
      .then(this.handleErrors.bind(this))
      .then(response => {
        return response.json();
      })
      .then(response => {
        this.setState({
          data: response
        })
      })
      .catch(error => { console.log(error + "Character not found") })
  }
  handleErrors(response) {
    if (!response.ok) {
      this.setState({ data: "" });
      this.setState({ charError: true });
    }
    else {
      return response;
    }
  }
  userSearch() {
    var charName = document.getElementById('searchComponent').childNodes[1].value;
    var charRealm = document.getElementById('searchComponent').childNodes[2].value;
    this.fetchData("https://us.api.battle.net/wow/character/" + charRealm + "/" + charName + "?fields=stats&fields=items&locale=en_US&apikey=ja3xtnfpsk3ht5b4cg76e6rb3zxwnjks");
  }
  render() {
    if (this.state.data != "") {
      return (
        <div>
          <Search submit={this.userSearch.bind(this)} />
          <div class="userContainer">
            <Stats data={this.state.data} />
            <Items data={this.state.data} />
          </div>
        </div>
      )
    }
    else if (this.state.charError == true) {
      return (
        <div>
          <Search submit={this.userSearch.bind(this)} />
          <div class="userContainer">
            <div class="instructions">
              Character not found.  Please try again.
        </div>
          </div>
        </div>
      )
    }
    else {
      return (
        <div>
          <Search submit={this.userSearch.bind(this)} />
          <div class="userContainer">
            <div class="instructions"> Enter character name for information.</div>
          </div>
        </div>
      )
    }
  }
}
function Search(props) {
  return (
    <div id="searchComponent">
      <img src={logo} />
      <input type="text" placeholder="Character Name" />
      <input type="text" placeholder="Realm Name" />
      <button type="submit" onClick={props.submit}> Search </button>
    </div>
  )
}

function Stats(props) {
  return (
    <div id="statsDiv">
      <div id="bio">
        <ul>
          <img id="thumbnail" style={{ display: "block" }} src={"http://render-us.worldofwarcraft.com/character/" + props.data.thumbnail + ""} />
          <li class="name">{props.data.name}</li>
          <li> Level <span style={{ color: "white" }}>{props.data.level}</span></li>
        </ul>
      </div>
      <div id="lists">
        <div>
          <ul>
            <li> Health </li>
            <li> Strength </li>
            <li>Agillity </li>
            <li> Intelligence </li>
            <li> Stamina </li>
            <li> Haste </li>
          </ul>
        </div>
        <div>
          <ul id="statValues">
            <li> {props.data.stats.health}</li>
            <li> {props.data.stats.str}</li>
            <li> {props.data.stats.agi}</li>
            <li> {props.data.stats.int}</li>
            <li> {props.data.stats.sta}</li>
            <li> {(props.data.stats.haste).toFixed(2)}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
class Items extends React.Component {

  render(props) {
    var data = this.props.data.items;
    const itemList = Object.keys(data).map(function (item, i) {
      if (i == 0) {
        return (<li class="averageLevel title">Average Item Level <span class="value">{data[item]}</span></li>)
      } else if (i == 1) {
        return (
          <li class="averageLevel title">Average Item Level Equipped <span class="value">{data[item]}</span></li>
        )
      }
      else {
        return (
          <ul key={i}>
            <h4 class="title">{item}</h4>
            <li>Item <span class="value">{data[item]["name"]} </span></li>
            <li>Armor<span class="value">{data[item]["armor"]}</span></li>
            <li>Item Level  <span class="value">{data[item]["itemLevel"]}</span></li>
            <li>Item ID <span class="value">{data[item]["id"]}</span></li>
            <li>Quality <span class="value">{data[item]["quality"]}</span></li>
          </ul>
        )
      }
    }
    )
    return (
      <div id="itemsDiv">
        <h4> My Item Sets </h4>
        {itemList}
      </div>
    );
  }
}


ReactDOM.render(<App />, document.getElementById('root'));
