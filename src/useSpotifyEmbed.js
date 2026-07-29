import { useCallback, useEffect, useRef, useState } from "react";

const IFRAME_API_SRC = "https://open.spotify.com/embed/iframe-api/v1";

// Module-level singleton: the Spotify iFrame API script + its readiness
// promise are shared across every useSpotifyEmbed() caller, since Spotify
// only supports one global `window.onSpotifyIframeApiReady` callback.
let iframeApiPromise = null;

function loadSpotifyIframeApi() {
  if (iframeApiPromise) return iframeApiPromise;

  iframeApiPromise = new Promise((resolve, reject) => {
    if (window.Spotify?.IFrameAPI) {
      resolve(window.Spotify.IFrameAPI);
      return;
    }

    const previousCallback = window.onSpotifyIframeApiReady;
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      previousCallback?.(IFrameAPI);
      resolve(IFrameAPI);
    };

    if (document.getElementById("spotify-iframe-api")) return;

    const script = document.createElement("script");
    script.id = "spotify-iframe-api";
    script.src = IFRAME_API_SRC;
    script.async = true;
    script.onerror = () => reject(new Error("Failed to load Spotify iFrame API"));
    document.body.appendChild(script);
  });

  return iframeApiPromise;
}

/**
 * Wraps a single Spotify embed player behind a small, controllable API,
 * so the app's own play/pause/skip/progress-bar UI can drive real,
 * licensed Spotify playback instead of bundling audio files.
 *
 * Note: the iFrame API exposes no volume control, and playback (like any
 * embedded media) needs a prior user gesture before `play()` will work.
 */
export function useSpotifyEmbed(initialUri) {
  const containerRef = useRef(null);
  const controllerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!initialUri) return;
    let cancelled = false;

    loadSpotifyIframeApi()
      .then((IFrameAPI) => {
        if (cancelled || !containerRef.current) return;
        IFrameAPI.createController(
          containerRef.current,
          { uri: initialUri, width: "1", height: "1" },
          (EmbedController) => {
            if (cancelled) {
              EmbedController.destroy();
              return;
            }
            controllerRef.current = EmbedController;
            EmbedController.addListener("ready", () => setReady(true));
            EmbedController.addListener("playback_update", (e) => {
              setIsPlaying(!e.data.isPaused);
              setIsBuffering(e.data.isBuffering);
              setPosition(e.data.position / 1000);
              setDuration(e.data.duration / 1000);
            });
          }
        );
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
    // Only the very first URI seeds the controller — later track changes
    // go through loadTrack() so we don't tear down/recreate the iframe.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const play = useCallback(() => controllerRef.current?.play(), []);
  const pause = useCallback(() => controllerRef.current?.pause(), []);
  const togglePlay = useCallback(() => controllerRef.current?.togglePlay(), []);
  const seek = useCallback((seconds) => controllerRef.current?.seek(seconds), []);
  const loadTrack = useCallback((uri) => {
    setPosition(0);
    setDuration(0);
    controllerRef.current?.loadUri(uri);
  }, []);

  return {
    containerRef,
    ready,
    failed,
    isPlaying,
    isBuffering,
    position,
    duration,
    play,
    pause,
    togglePlay,
    seek,
    loadTrack,
  };
}
