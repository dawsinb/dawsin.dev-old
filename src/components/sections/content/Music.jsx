import { DynamicText } from "../../DynamicText";
import styled from "styled-components";
import { Playback } from "@ninefour/euphony";
import { SongSelection } from "../../SongSelection";
import { useState } from "react";

const TextContainer = styled("div")`
  width: 100%;
  height: 55%;
  margin-bottom: 5%;
`;

const MusicContainer = styled("div")`
  width: 100%;
  height: 40%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
`;

const MusicItem = styled("div")`
  flex-basis: 50%;
  width: 50%;
  height: 50%;
`;

// load songs
const pm836 = new Playback();
const okchristmas = new Playback();
const kakin = new Playback();
const bioluminescence = new Playback();

Promise.all([
  pm836.load("/music/836pm.mp3"),
  okchristmas.load("/music/okchristmas.mp3"),
  kakin.load("/music/kakin.mp3"),
  bioluminescence.load("/music/bioluminescence.mp3")
]);

const songs = [
  {
    playback: pm836,
    id: "pm836",
    title: "8:36 pm"
  },
  {
    playback: okchristmas,
    id: "okchristmas",
    title: "an ok christmas"
  },
  {
    playback: kakin,
    id: "kakin",
    title: "kakin"
  },
  {
    playback: bioluminescence,
    id: "bioluminescence",
    title: "bioluminescence"
  }
];

function Music() {
  const songTracker = {};
  songs.forEach((song) => (songTracker[song.id] = false));

  const [isPlaying, setIsPlaying] = useState({ ...songTracker });

  const updateIsPlaying = (id) => {
    // create new copy of song tracker
    let temp = { ...songs };
    // invert play status of selected song
    temp[id] = !isPlaying[id];

    // update state
    setIsPlaying(temp);
  };

  const handler = (id) => () => {
    songs.forEach((song) => {
      // change play state of given id
      if (song.id === id) {
        if (song.playback.getPlaybackTime() > 0) {
          song.playback.stop();
        } else {
          song.playback.play();
        }
      }
      // stop all songs that dont match id
      else {
        song.playback.stop();
      }
    });

    // update state
    updateIsPlaying(id);
  };

  return (
    <>
      <TextContainer>
        <DynamicText>
          This one isn’t programming related, but one of my biggest passions in
          life is <em>music</em>
          . I love discovering new things to listen to, playing piano, and even
          making some music myself.
          <br />
          <br />
          If I ever get around to making a more official platform to post my
          music I’ll link it here, but for now press the buttons below if you
          want to have a listen.
        </DynamicText>
      </TextContainer>
      <MusicContainer>
        {songs.map((song) => (
          <MusicItem>
            <SongSelection
              playback={song.playback}
              id={song.id}
              title={song.title}
              handler={handler}
              isPlaying={false}
              scale={0.9}
              color={"#D40749"}
            />
          </MusicItem>
        ))}
      </MusicContainer>
    </>
  );
}

export { Music };
