import React, { useContext, useEffect, useState, useRef } from "react";
import { Button } from "react-bootstrap";
import { queuePerfom } from "../services/youtube.service";
import { useSongs } from "../context/Songs.context";
import { ErrorsContext } from "../context/Errors.context";
import { useNavigate } from "react-router-dom";
import { updateSongOnListByVideoId } from "../services/songsList.services";

const AddToQueue = ({ perfomId, setSuccess, songInfo }) => {
  const { refreshSongs, activeSession, refreshQueueSongs } = useSongs();
  const { setQueueLimitError, queueLimitError } = useContext(ErrorsContext);
  const navigate = useNavigate();
  const [isVideoAvailable, setIsVideoAvailable] = useState(true);
  const hasUpdatedTitleRef = useRef(false);
  const iframeRef = useRef(null);
  const playerRef = useRef(null);

  const getErrorType = (errorCode) => {
    const errorTypes = {
      2: "ID de video inválido",
      5: "Error de HTML5",
      100: "Video no encontrado",
      101: "Video no permitido en iframes",
      150: "Video no permitido en iframes",
    };
    return errorTypes[errorCode] || `Error desconocido (código: ${errorCode})`;
  };

  useEffect(() => {
    console.log(activeSession);
    if (queueLimitError) {
      setSuccess(false);
    }
  }, [activeSession, queueLimitError]);

  // Resetear hasUpdatedTitleRef cuando cambie el video
  useEffect(() => {
    hasUpdatedTitleRef.current = false;
    setIsVideoAvailable(true);
  }, [songInfo?.videoId]);

  // Cargar YouTube IFrame API
  useEffect(() => {
    if (!songInfo?.videoId) return;

    const initializePlayer = () => {
      if (
        iframeRef.current &&
        songInfo?.videoId &&
        window.YT &&
        window.YT.Player
      ) {
        if (playerRef.current) {
          try {
            playerRef.current.destroy();
          } catch (error) {
            console.error("Error al destruir reproductor anterior:", error);
          }
        }

        playerRef.current = new window.YT.Player(iframeRef.current, {
          videoId: songInfo.videoId,
          width: "100%",
          height: 200,
          playerVars: {
            enablejsapi: 1,
            origin: window.location.origin,
          },
          events: {
            onError: async (event) => {
              console.log("❌ Error en el video de YouTube:", event.data);
              console.log("Video ID:", songInfo.videoId);
              console.log("Tipo de error:", getErrorType(event.data));
              console.log("songInfo completo:", songInfo);
              console.log("songInfo.videoId:", songInfo?.videoId);
              setIsVideoAvailable(false);

              // Actualizar el título de la canción a "----" si no se ha actualizado ya
              if (!hasUpdatedTitleRef.current) {
                console.log("Intentando actualizar título...");
                console.log("songInfo.videoId existe?", !!songInfo?.videoId);

                if (songInfo?.videoId) {
                  hasUpdatedTitleRef.current = true;
                  try {
                    console.log(
                      "Llamando a updateSongOnListByVideoId con videoId:",
                      songInfo.videoId
                    );
                    const result = await updateSongOnListByVideoId(
                      songInfo.videoId,
                      {
                        title: "----",
                        description: songInfo.description || "",
                        videoDuration: songInfo.videoDuration || "",
                        thumbnail: songInfo.thumbnail || "",
                      }
                    );
                    console.log("✅ Título de la canción actualizado a '----'");
                    console.log(
                      "Resultado de updateSongOnListByVideoId:",
                      result
                    );
                  } catch (error) {
                    console.error(
                      "Error al actualizar el título de la canción:",
                      error
                    );
                    hasUpdatedTitleRef.current = false; // Resetear en caso de error para intentar de nuevo
                  }
                } else {
                  console.warn(
                    "⚠️ No se puede actualizar: songInfo.videoId no existe"
                  );
                }
              } else {
                console.log("Ya se intentó actualizar el título anteriormente");
              }
            },
            onReady: async (event) => {
              console.log("✅ Video de YouTube cargado correctamente");
              // Verificar el estado del video después de que esté listo
              try {
                const playerState = event.target.getPlayerState();
                const videoData = event.target.getVideoData();
                console.log("Estado del reproductor:", playerState);
                console.log("Datos del video:", videoData);
                console.log("songInfo.videoId:", songInfo?.videoId);

                // Si el estado es -1 (UNSTARTED) después de un tiempo, puede ser que el video no esté disponible
                setTimeout(async () => {
                  try {
                    const currentState = event.target.getPlayerState();
                    const videoUrl = event.target.getVideoUrl();
                    console.log("Estado después de 3 segundos:", currentState);
                    console.log("URL del video:", videoUrl);

                    // Si el estado sigue siendo -1 o no hay URL válida, el video puede no estar disponible
                    if (
                      currentState === -1 ||
                      !videoUrl ||
                      videoUrl.includes("unavailable")
                    ) {
                      console.log(
                        "⚠️ Video posiblemente no disponible después de verificación"
                      );
                      setIsVideoAvailable(false);

                      // Actualizar el título de la canción a "----" si no se ha actualizado ya
                      if (!hasUpdatedTitleRef.current && songInfo?.videoId) {
                        hasUpdatedTitleRef.current = true;
                        try {
                          await updateSongOnListByVideoId(songInfo.videoId, {
                            title: "----",
                            description: songInfo.description || "",
                            videoDuration: songInfo.videoDuration || "",
                            thumbnail: songInfo.thumbnail || "",
                          });
                          console.log(
                            "✅ Título de la canción actualizado a '----' (desde onReady)"
                          );
                        } catch (error) {
                          console.error(
                            "Error al actualizar el título de la canción:",
                            error
                          );
                          hasUpdatedTitleRef.current = false;
                        }
                      }
                    } else {
                      setIsVideoAvailable(true);
                    }
                  } catch (error) {
                    console.log("Error al verificar estado en onReady:", error);
                  }
                }, 3000);
              } catch (error) {
                console.log("Error al obtener estado del reproductor:", error);
              }
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.UNSTARTED) {
                setTimeout(() => {
                  try {
                    const playerState = event.target.getPlayerState();
                    if (playerState === -1) {
                      console.log("⚠️ Video no disponible o bloqueado");
                      setIsVideoAvailable(false);

                      // Actualizar el título de la canción a "----" si no se ha actualizado ya
                      if (!hasUpdatedTitleRef.current && songInfo?.videoId) {
                        hasUpdatedTitleRef.current = true;
                        (async () => {
                          try {
                            await updateSongOnListByVideoId(songInfo.videoId, {
                              title: "----",
                              description: songInfo.description || "",
                              videoDuration: songInfo.videoDuration || "",
                              thumbnail: songInfo.thumbnail || "",
                            });
                            console.log(
                              "✅ Título de la canción actualizado a '----'"
                            );
                          } catch (error) {
                            console.error(
                              "Error al actualizar el título de la canción:",
                              error
                            );
                            hasUpdatedTitleRef.current = false; // Resetear en caso de error para intentar de nuevo
                          }
                        })();
                      }
                    }
                  } catch (error) {
                    console.log(
                      "⚠️ Error al verificar estado del video:",
                      error
                    );
                    setIsVideoAvailable(false);
                  }
                }, 2000);
              }
            },
          },
        });
      }
    };

    // Verificar si la API ya está cargada
    if (window.YT && window.YT.Player) {
      initializePlayer();
    } else {
      // Cargar el script si no está cargado
      if (
        !document.querySelector(
          'script[src="https://www.youtube.com/iframe_api"]'
        )
      ) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }

      // Configurar callback cuando la API esté lista
      window.onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };

      // Si la API ya estaba lista antes de configurar el callback
      if (window.YT && window.YT.Player) {
        initializePlayer();
      }
    }

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch (error) {
          console.error("Error al destruir el reproductor:", error);
        }
      }
    };
  }, [songInfo?.videoId]);

  const videoUrl = `https://www.youtube.com/watch?v=${songInfo?.videoId}`;
  const embedUrl = songInfo?.videoId
    ? `https://www.youtube.com/embed/${songInfo.videoId}?enablejsapi=1&origin=${window.location.origin}`
    : null;

  const handleAddToQueue = async () => {
    try {
      const result = await queuePerfom(perfomId);
      refreshSongs(activeSession._id);
      refreshQueueSongs(activeSession._id);
      setSuccess(true);
      console.log("Perfom actualizado con éxito:", result);
      navigate("/queue");
    } catch (error) {
      setQueueLimitError(error);
      console.error("Error al actualizar el Perfom:", error);
    }
  };

  return (
    <div className="">
      {embedUrl && (
        <div style={{ marginBottom: "20px" }}>
          <div
            ref={iframeRef}
            style={{ width: "100%", height: "200px", borderRadius: "8px" }}
          />
          {!isVideoAvailable && (
            <p style={{ color: "red", marginTop: "10px" }}>
              ⚠️ Este video no está disponible para reproducir
            </p>
          )}
        </div>
      )}
      {isVideoAvailable && (
        <>
          <Button
            variant="outline-dark"
            className="add-queue-btn"
            onClick={handleAddToQueue}
          >
            Add to queue
          </Button>
          <p className="add-queue-prompt">
            **Toque aquí para agregar a la cola**
          </p>
        </>
      )}
    </div>
  );
};

export default AddToQueue;
