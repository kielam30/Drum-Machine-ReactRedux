
import './App.scss';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from "redux";
import { Provider, connect } from "react-redux";

const soundBank = {
    "bank-1": [
      {
        keyTrigger: 'Q',
        id: 'Heater-1',
        url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'
      },
      {
        keyTrigger: 'W',
        id: 'Heater-2',
        url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'
      },
      {
        keyTrigger: 'E',
        id: 'Heater-3',
        url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'
      },
      {
        keyTrigger: 'A',
        id: 'Heater-4',
        url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'
      },
      {
        keyTrigger: 'S',
        id: 'Clap',
        url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'
      },
      {
        keyTrigger: 'D',
        id: 'Open-HH',
        url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'
      },
      {
        keyTrigger: 'Z',
        id: "Kick-n'-Hat",
        url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'
      },
      {
        keyTrigger: 'X',
        id: 'Kick',
        url: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'
      },
      {
        keyTrigger: 'C',
        id: 'Closed-HH',
        url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'
      }
    ],
    "bank-2": [
      {
        keyTrigger: 'Q',
        id: 'Chord-1',
        url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3'
      },
      {
        keyTrigger: 'W',
        id: 'Chord-2',
        url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3'
      },
      {
        keyTrigger: 'E',
        id: 'Chord-3',
        url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3'
      },
      {
        keyTrigger: 'A',
        id: 'Shaker',
        url: 'https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3'
      },
      {
        keyTrigger: 'S',
        id: 'Open-HH',
        url: 'https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3'
      },
      {
        keyTrigger: 'D',
        id: 'Closed-HH',
        url: 'https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3'
      },
      {
        keyTrigger: 'Z',
        id: 'Punchy-Kick',
        url: 'https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3'
      },
      {
        keyTrigger: 'X',
        id: 'Side-Stick',
        url: 'https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3'
      },
      {
        keyTrigger: 'C',
        id: 'Snare',
        url: 'https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3'
      }
    ]
}

//redux
//action
const LOADING = "LOADING";
const LOADED_BANK = "LOADED_BANK";
const SHOW_IN_DISPLAY = "SHOW_IN_DISPLAY";
const ADJ_VOL = "ADJ_VOL";
const CLEAR_DISPLAY = "CLEAR_DISPLAY";

const preLoad = bank => {
    for (let i in soundBank[bank]) {
    let audio = new Audio();
    audio.src = soundBank[bank][i].url
    };
};

const loadBank = bank => dispatch => {
    dispatch({type: LOADING});
    preLoad(bank);
    dispatch({
        type: LOADED_BANK, 
        bank: bank,
        display: bank.toUpperCase(),
        pad: soundBank[bank]
    });
};

const showInDisplay = element => dispatch => {
    dispatch({
        type: SHOW_IN_DISPLAY,
        display: element.replace(/-/g, ' ')
    });
    setTimeout(() => {dispatch(clearDisplay())}, 2000);
};

const adjustVol = event => dispatch => {
    dispatch({
        type: ADJ_VOL,
        display: "Volume: " + Math.round(event.target.value * 100),
        vol: event.target.value 
    });
    setTimeout(() => {dispatch(clearDisplay())}, 2000);
};

const clearDisplay = () => {
    return {
        type: CLEAR_DISPLAY
    };
};

//reducer
const padReducer = (state = defaultState, action) => {
    switch (action.type) {
        case LOADING:
            return {
                ...state,
                loading: true
            };
        case LOADED_BANK:
            return {
                ...state,
                bank: action.bank,
                loading: false,
                display: action.display,
                pad: action.pad
            };
        case SHOW_IN_DISPLAY:
            return {
                ...state,
                display: action.display
            };
        case ADJ_VOL:
            return {
                ...state,
                display: action.display,
                vol: action.vol
            };
        case CLEAR_DISPLAY:
            return {
                ...state,
                display: state.bank.toUpperCase()
            };
        default:
            return state;
    };
};

//store
const defaultState = {
    bank: "",
    loading: false,
    display: String.fromCharCode(160),
    vol: 0.1,
    pad: []
};

const store = createStore(padReducer, applyMiddleware(thunk)); //handle async

//react
//app
const App = () => {
    return (
        <Provider store={store}>
            <DrumAppApp />
        </Provider>
    );
}

const Display = ({display="LOADING..."}) => {
    return (
        <div id="display">
            {display}
        </div>
    );
};

const VolBar = props => {
    return (
        <div className="volume-ctrl">
            <span>- Volume +</span>
            <input 
                max="1"
                min="0"
                onChange={props.onChange}
                step="0.01"
                type="range"
                value={props.value}
            />
        </div>
    );
};

const Toggler = props => {
    return (
        <div className="toggler">
            <div className={props.toggleBank1Class}
                onClick={props.onClickBank1}
                >
                {props.toggleBank1Text}
            </div>
            <div className={props.toggleBank2Class} 
                onClick={props.onClickBank2}
                >
                {props.toggleBank2Text}
            </div>
        </div>
    );
};

const DrumPad = props => {
    return (
        <div className="drum-pad" 
            id={props.clipId}
            onClick={props.onClickProp}
            >
            <audio 
                className="clip"
                id={props.keyTrigger}
                src={props.clip}
            />
            {props.keyTrigger}
        </div>
    );
};

const DrumPads = props => {
    return (
    <div className="drum-pads">
        {props.pad.map((padObj, i, padFuncArr) => (
            <DrumPad key={padFuncArr[i].id}              
                clipId={padFuncArr[i].id}
                keyTrigger={padFuncArr[i].keyTrigger}
                clip={padFuncArr[i].url}
                onClickProp={props.onClick}
            />
        ))}
    </div>
    );
};

class DrumApp extends React.Component {
    componentDidMount() {
        this.props.loadBank("bank-1");
        document.addEventListener("keydown", this.handleKeyPress);
    };
    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyPress);
    };

    playSound = pad => {
        const { vol, showInDisplay } = this.props;
        let sound = document.getElementById(pad);
        sound.currentTime = 0;
        sound.volume = vol;
        showInDisplay("MUTED");
        sound.play();
    };
    handleKeyPress = event => {
        const { pad, vol, showInDisplay } = this.props;
        for (let i in pad) {
            if (event.key.toUpperCase() === pad[i].keyTrigger) {
                let elem = document.getElementById(pad[i].id);
                elem.classList.toggle("activate-pad");
                setTimeout(() => elem.classList.toggle("activate-pad"), 100);
                this.playSound(pad[i].keyTrigger);
                if (vol > 0) {
                    showInDisplay(pad[i].id);
                    ;}
                };
            };
    };
    handleClick = event => {
        const { pad, vol, showInDisplay } = this.props;
        for (let i in pad) {
            if (event.target.id === pad[i].id) {
                this.playSound(pad[i].keyTrigger);
                if (vol > 0) {
                    showInDisplay(pad[i].id);
                    };
                };
            };
    };

    render () {
        const {bank, loading, display, vol, pad, adjustVol, loadBank} = this.props;
        let toggleBank1 = (bank.toUpperCase() === "bank-1".toUpperCase()) ? "bank-btn active" : "bank-btn";
        let toggleBank2 = (bank.toUpperCase() === "bank-2".toUpperCase()) ? "bank-btn active" : "bank-btn";
        
        return (
            <div className="container">
                <div  id="drum-machine">
                    <p>~~~~~~~~~~~~~~~~~~ Drum Machine ~~~~~~~~~~~~~~~~~~~</p>
                    <DrumPads 
                        pad={pad} 
                        onClick={this.handleClick} 
                    />
                    <div className="ctrl-area">
                        <VolBar 
                            onChange={adjustVol} 
                            value={vol} />
                        { loading ? <Display /> :
                            (<Display display={display} />)
                        }                       
                        <Toggler 
                            toggleBank1Class={toggleBank1}
                            onClickBank1={() => loadBank("bank-1")}
                            toggleBank1Text="Bank 1"
                            toggleBank2Class={toggleBank2}
                            onClickBank2={() => loadBank("bank-2")}
                            toggleBank2Text="Bank 2"
                        />
                    </div>
                    <p>~~~~~~~~~~~~~~~~ Jackie Lam - 14 Jul 2021 ~~~~~~~~~~~~~~~~</p>
                </div>
            </div>
        );
    };
};

//react-redux
const mapStateToProps = state => {
    return {
        bank: state.bank,
        loading: state.loading,
        display: state.display,
        vol: state.vol,
        pad: state.pad
    };
};

const mapDispatchToProps = dispatch => {
    return {
    loadBank: bank  => dispatch(loadBank(bank)),
    showInDisplay: element => dispatch(showInDisplay(element)),
    adjustVol: event => dispatch(adjustVol(event)),
    clearDisplay: () => dispatch(clearDisplay())
    }
};
  
const DrumAppApp = connect(mapStateToProps, mapDispatchToProps)(DrumApp);

ReactDOM.render(<App />, document.getElementById("root"))
export default App;
