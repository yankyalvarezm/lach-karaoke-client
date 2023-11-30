import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSongs } from "../context/Songs.context";
import { AuthContext } from "../context/auth.context";

const Cantar = () => {
  const {
    toggleIsPlaying,
    isPlaying,
    queueSongs,
    fetchActiveSession,
    handlePlayPauseClick,
  } = useSongs();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchActiveSession();
  }, [fetchActiveSession]);

  console.log("isPlaying", isPlaying);

  const currentUserId = user?._id;

  console.log("queueSongs:", queueSongs);
  console.log("currentUserId:", currentUserId);

  const userPositionInQueue = queueSongs?.findIndex(
    (song) =>
      song.user?._id === currentUserId || song.tempUser?._id === currentUserId
  );

  console.log("userPositionInQueue:", userPositionInQueue);

  const songsBeforeUser = userPositionInQueue >= 0 ? userPositionInQueue : null;
  const isUserTurn = userPositionInQueue === 0;
  const queueMessage =
    songsBeforeUser > 0
      ? `Faltan ${songsBeforeUser} canciones para cantar`
      : "Ya es tu turno, presiona play cuando estes listo";

  console.log("queueMessage:", queueMessage);

  //   const handlePlayPauseClick = () => {
  //     toggleIsPlaying();
  //   };

  return (
    <div>
      <div className="user-play-btn-cont">
        {songsBeforeUser !== null && !isPlaying && (
          <div className="queueMessage">{queueMessage}</div>
        )}

        {isUserTurn ? (
          <Button
            variant="dark"
            className="user-play-btn"
            onClick={handlePlayPauseClick}
          >
            {isPlaying ? <p>Pause</p> : <p>Play</p>}
          </Button>
        ) : (
          <div>
            <Button
              variant="dark"
              className="user-play-btn disabled"
              onClick={handlePlayPauseClick}
              disabled={true}
            >
              {isPlaying ? <p>Pause</p> : <p>Play</p>}
            </Button>
            <p>El botón se habilitará cuando sea tu turno.</p>
          </div>
        )}
      </div>
      <div className="cellphone-viewport">
        <Link to="/mysongs">
          <Button className="inactive-cell">My Songs</Button>
        </Link>
        <Link to="/cantar">
          <Button className="active-cell">Cantar</Button>
        </Link>
        <Link to="/queue">
          <Button className="inactive-cell">Queue</Button>
        </Link>
      </div>
    </div>
  );
};

export default Cantar;
