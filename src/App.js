import React, { useState } from 'react';
// Morse
import { text2morse, morse2text } from './morse-pro/src/morse-pro.js';
import MorseCWWave                from './morse-pro/src/morse-pro-cw-wave.js';
import MorsePlayerWAALight        from './morse-pro/src/morse-pro-player-waa-light.js';
// Components
import { CopyToClipboard } from 'react-copy-to-clipboard';
import MorseModal          from './components/MorseModal.js';
import Button              from './components/Button.js';
//--Toastify
import { ToastContainer, toast, Slide, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Helpers
import download from './helpers/download.js';
// CSS
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const explanation =
  `
  Morse code translater
  ===================
  Translation
  -------------------
  ❌  If text contains letters translate text2morse
      otherwise translate morse2text

  Morse
  -----------
  ❌  Type . & - for morse code
  ❌  a space separates letters of the same word
  ❌  / separates morse words
  ❌  # is an unrecognized character
  `;
  const [input, setInput]             = useState('');
  const [output, setOutput]           = useState(text2morse(input).morse);
  const [audioPlayer, setAudioPlayer] = useState(false);
  const [modalShow, setModalShow]     = React.useState(false);


  const translate = (value) => (value.match(/\w/)) ? text2morse(value).morse : morse2text(value).message;


  const handleReset = () => {
    setInput('');
    setOutput('');
    document.querySelector('#input').focus();
  };


  const handleChange = ({currentTarget}) => {
    let value = currentTarget.value;
    setInput(value);
    setOutput(translate(value));
  };


  const handleSwap = () => {
    setInput(output);
    setOutput(input);
    //rotate 180° Swap btn
    document.querySelector('#swap').animate([
      {transform: "rotate(0deg)"},
      {transform: "rotate(180deg)"}
    ], {duration: 300});
  };


  const handleCopy = () => {
    if(output.length === 0) {
      toast.error('Nothing to copy !', { autoClose: 1500 });
    } else {
      toast.info('Copied to clipboard !', { autoClose: 1500 });
    }
  };


  const handleDownload = () => {
    if(output.length === 0) {
      toast.error('Nothing to download !', { autoClose: 1500 });
    } else {
      download("morse.txt", output);
    }
  };


  const handleAudio = () => {
    //is playing already ?
    if(audioPlayer.isPlaying === true) {
      audioPlayer.stop();
      return false;
    }
    //------------------------------------------
    //create sine-wave
    let morseCWWave = new MorseCWWave();
    try {
      morseCWWave.translate(output);
    } catch(error) {
      toast.error("# Unrecognized character !");
      return false;
    }
    //=============================================
    //style button
    let audioBtn = document.querySelector('#audio');
    audioBtn.setAttribute('style', 'transition: all 0s ease !important;');
    const toggleIcon = () => {
      audioBtn.firstElementChild.classList.toggle('fa-play');
      audioBtn.firstElementChild.classList.toggle('fa-stop');
    };
    toggleIcon();
    //=============================================
    //setup player & light
    let morsePlayerWAALight = new MorsePlayerWAALight();
    setAudioPlayer(morsePlayerWAALight);
    //blink button
    const lightOn      = () => audioBtn.classList.add('active');
    const lightOff     = () => audioBtn.classList.remove('active');
    //audio end
    const soundStopped = () => {
      toggleIcon();
      audioBtn.setAttribute('style', '');
    };
    //assignment
    morsePlayerWAALight.soundOnCallback = lightOn;
    morsePlayerWAALight.soundOffCallback = lightOff;
    morsePlayerWAALight.soundStoppedCallback = soundStopped;
    morsePlayerWAALight.volume = 1;
    //=============================================
    //play sine-wave
    morsePlayerWAALight.loadCWWave(morseCWWave);
    morsePlayerWAALight.playFromStart();
  };

  return (
    <>
    <main className="container h-90 d-flex justify-content-center align-items-center">
      <div className="row w-100 h-75 flex-lg-row flex-column-reverse">
        {/*LEFT BUTTONS*/}
        <nav className="row col-lg-1 py-lg-3 py-1 justify-content-center flex-lg-column justify-content-lg-start">
          {/*reset input*/}
          <Button
          icon="times"
          title="Reset"
          onClick={handleReset}/>
          {/*morse code table*/}
          <Button
          icon="font"
          title="Morse Table"
          data-toggle="modal"
          data-target="#alphabet"
          onClick={() => setModalShow(true)}/></nav>

        {/*INPUT*/}
        <textarea
        id="input"
        className="col m-2 p-3 h-100 border bg-light thin-scrollbar fz-16"
        onChange={handleChange}
        autoFocus
        placeholder={explanation}
        value={input}></textarea>

        {/*SWAP*/}
        <nav className="row col-lg-1 py-1 flex-column justify-content-center align-items-center">
          <Button
          id="swap"
          icon="sync-alt"
          title="Swap"
          onClick={handleSwap}/></nav>

        {/*OUTPUT*/}
        <pre
        id="output"
        className="col m-2 p-3 h-100 border bg-light thin-scrollbar text-wrap fz-16">
        {output}</pre>

        {/*RIGHT BUTTONS*/}
        <nav className="row col-lg-1 py-lg-3 py-1 justify-content-center flex-lg-column justify-content-lg-start">
          {/*copy to clipboard*/}
          <CopyToClipboard
          text={output}>
            <Button
            icon="copy"
            title="Copy"
            onClick={handleCopy}/>
          </CopyToClipboard>
          {/*download output*/}
          <Button
          icon="save"
          title="Download"
          onClick={handleDownload}/>
          {/*audio play*/}
          <Button
          id="audio"
          icon="play"
          title="Play Audio"
          onClick={handleAudio}/></nav>
      </div>

      {/*OVERLAYS*/}
      <MorseModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        transition={Slide}
        pauseOnHover={false}
      />
    </main>

    <footer className="container-fluid text-center fz-12">
        <p>This app is a personnal training for React & Bootstrap.</p>
        <p>The morse API is provided by <a href="https://github.com/scp93ch/morse-pro">@scp93ch</a>, go check his website <a href="https://morsecode.world/international/translator.html">MorseCode.world</a>.</p>
    </footer>
    </>
  );
}

export default App;
