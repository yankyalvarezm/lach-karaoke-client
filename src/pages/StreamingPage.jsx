import React from "react";
import YouTube from "../components/YouTube";
import YouTubeSearch from "../components/YouTubeSearch";
import MySongs from "../components/MySongs";
import WhosNext from "../components/WhosNext";
import ActiveSession from "../components/ActiveSession";
import LiveHolder from "../components/LiveHolder";
import { useSongs } from "../context/Songs.context";
import SessionId from "../components/SessionId";
import cantico from "../assets/cantico.png";

const StreamingPage = () => {
  const { addSong, queueSongs } = useSongs();

  console.log("queueSogns", queueSongs);

  return (
    <div className="streaming">
      StreamingPage
      <h1 className="streamin-title">CANTICO</h1>
      {/* <div className="youtube-blocker">.</div> */}
      {/* <div className="user-content">
        <ActiveSession />
        <LiveHolder />
      </div> */}
      <div className="streaming-display">
        <div className="video-size-streaming">
          <YouTube hideControls={true} className="video-yt-streaming" />
        </div>

        <hr />

        <div className="streaming-container">
          <div className="streaming-session-queue">
            <div>
              {queueSongs.map(
                (song, index) =>
                  index === 1 && (
                    <div key={index}>
                      <div className="display-flex">
                        <h4> Siguiente en fila</h4>
                      </div>
                      <p>{song.name}</p>
                      <p>{song.user ? song.user.name : song.tempUser.name}</p>
                    </div>
                  )
              )}

              {queueSongs.map((song, index) => {
                if (index === 2 || index === 3 || index === 4) {
                  return (
                    <div key={index}>
                      <div className="display-flex ">
                        <h4>
                          {index}- {song.name}
                        </h4>
                      </div>
                      <p className="streaming-index">{song.user ? song.user.name : song.tempUser.name}</p>
                    </div>
                  );
                }
                return null; // No devuelve nada si los índices no son 2, 3 o 4
              })}
            </div>
            <SessionId />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamingPage;
