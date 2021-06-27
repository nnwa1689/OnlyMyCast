import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import HomeSelf from './Component/Home/HomeSelf'
import Account from './Component/Account/Account'
import Player from './Component/Player/Player'
import Navbar from './Component/NavBar/Navbar';
import PodcastAccount from './Component/Account/PodcastAccount';
import Subreq from './Component/Account/Subreq';

function App() {
  var basename = "/";
  document.body.style.backgroundColor = "#f7f7f7"
  return (
    <div className="App">
        <BrowserRouter basename={ basename }>
          <Player url={"https://firebasestorage.googleapis.com/v0/b/noteshazuya.appspot.com/o/testmusic.mp3?alt=media&token=4dd8d990-9ec3-4f40-863d-6381793afed8"} podcastName={"音樂頻道"} singleName={"簡單愛"} coverUrl={"https://i.ytimg.com/vi/uqPo5Dy-9zI/hqdefault.jpg"}>
              <Navbar></Navbar>
              <Route exact path="/" component={HomeSelf} />
              <Route exact path="/account" component={Account} />
              <Route exact path="/podcastaccount" component={PodcastAccount} />
              <Route exact path="/subreq" component={Subreq} />
            </Player>
        </BrowserRouter> 
    </div>
  );
}
export default App;
