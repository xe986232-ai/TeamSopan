"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// LocalMusicPlayer -- konversi 1:1 dari source HTML/CSS/JS "Music Player"
// yang dikasih user, jadi komponen React client-side.
//
// Fitur (semua jalan di browser, tanpa backend -- file diproses lewat
// URL.createObjectURL, jadi playlist/cover ke-reset kalau halaman di-refresh):
//   - Upload banyak file audio sekaligus -> jadi daftar putar
//   - Play / pause / next / prev, progress bar bisa di-seek, volume slider
//   - Ganti sampul (cover) per lagu lewat tombol pensil di pojok artwork
//   - Equalizer/spectrum 5-bar yang beneran nge-react ke frekuensi audio
//     (Web Audio API AnalyserNode), bukan animasi CSS palsu
//   - Background ambient blur di belakang card, ngikutin cover yang aktif
//
// Pemakaian:
//   <LocalMusicPlayer />
//   <LocalMusicPlayer deviceName="iPhone" />
// ============================================================================

function cleanName(filename) {
  return filename.replace(/\.[^/.]+$/, "");
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

let trackIdSeq = 0;

export function LocalMusicPlayer({ deviceName = "iPhone", className }) {
  const audioRef = React.useRef(null);
  const barsRef = React.useRef([]);
  const seekingRef = React.useRef(false);

  const audioCtxRef = React.useRef(null);
  const analyserRef = React.useRef(null);
  const sourceNodeRef = React.useRef(null);
  const freqDataRef = React.useRef(null);
  const rafRef = React.useRef(null);

  const fileInputRef = React.useRef(null);
  const coverInputRef = React.useRef(null);

  const [playlist, setPlaylist] = React.useState([]); // { id, name, url, coverUrl }
  const [currentIndex, setCurrentIndex] = React.useState(-1);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [seekPct, setSeekPct] = React.useState(0);
  const [volume, setVolume] = React.useState(70);

  const current = currentIndex >= 0 ? playlist[currentIndex] : null;
  const remaining = Math.max((duration || 0) - currentTime, 0);

  // ---- sinkronkan volume ke elemen <audio> ----
  React.useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  // ---- bersihin semua object URL pas komponen unmount ----
  React.useEffect(() => {
    return () => {
      playlist.forEach((t) => {
        URL.revokeObjectURL(t.url);
        if (t.coverUrl) URL.revokeObjectURL(t.coverUrl);
      });
      stopSpectrum(false);
      audioCtxRef.current?.close?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- load track pertama otomatis begitu playlist keisi ----
  React.useEffect(() => {
    if (currentIndex === -1 && playlist.length > 0) {
      loadTrack(0, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist.length]);

  // ---- event listener native di elemen <audio> ----
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    function onTimeUpdate() {
      if (seekingRef.current) return;
      setCurrentTime(audio.currentTime);
      const dur = audio.duration || 0;
      setSeekPct(dur ? (audio.currentTime / dur) * 100 : 0);
    }
    function onLoadedMetadata() {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    }
    function onEnded() {
      if (playlist.length > 1) {
        goNext();
      } else {
        setIsPlaying(false);
      }
    }

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist, currentIndex]);

  // ---- spectrum / equalizer via Web Audio API ----
  function ensureAudioGraph() {
    if (audioCtxRef.current || !audioRef.current) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      const source = ctx.createMediaElementSource(audioRef.current);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 32;
      analyser.smoothingTimeConstant = 0.75;
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      sourceNodeRef.current = source;
      freqDataRef.current = new Uint8Array(analyser.frequencyBinCount);
    } catch (err) {
      console.warn("Web Audio API tidak tersedia:", err);
    }
  }

  function startSpectrum() {
    if (rafRef.current) return;
    const barCount = barsRef.current.length;
    const tick = () => {
      const analyser = analyserRef.current;
      const freqData = freqDataRef.current;
      if (analyser && freqData) {
        analyser.getByteFrequencyData(freqData);
        const usableBins = Math.max(1, Math.floor(freqData.length * 0.7));
        for (let i = 0; i < barCount; i++) {
          const binIndex = Math.min(usableBins - 1, Math.floor((i / barCount) * usableBins));
          const value = freqData[binIndex] / 255;
          const heightPct = 15 + value * 85;
          if (barsRef.current[i]) barsRef.current[i].style.height = `${heightPct}%`;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  }

  function stopSpectrum(reset) {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (reset) {
      barsRef.current.forEach((bar) => bar && (bar.style.height = "15%"));
    }
  }

  React.useEffect(() => {
    if (isPlaying) {
      ensureAudioGraph();
      if (audioCtxRef.current?.state === "suspended") audioCtxRef.current.resume();
      startSpectrum();
    } else {
      stopSpectrum(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  // ---- kontrol transport ----
  function loadTrack(i, autoplay) {
    if (i < 0 || i >= playlist.length) return;
    setCurrentIndex(i);
    const track = playlist[i];
    const audio = audioRef.current;
    if (audio) {
      audio.src = track.url;
      audio.load();
      if (autoplay) {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
    setCurrentTime(0);
    setSeekPct(0);
  }

  function playAudio() {
    const audio = audioRef.current;
    if (currentIndex === -1 && playlist.length > 0) {
      loadTrack(0, true);
      return;
    }
    if (!audio || !audio.src) return;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }

  function pauseAudio() {
    audioRef.current?.pause();
    setIsPlaying(false);
  }

  function togglePlay() {
    if (audioRef.current?.paused !== false) {
      playAudio();
    } else {
      pauseAudio();
    }
  }

  function goPrev() {
    if (playlist.length === 0) return;
    const wasPlaying = isPlaying;
    const newIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    loadTrack(newIndex, wasPlaying);
  }

  function goNext() {
    if (playlist.length === 0) return;
    const wasPlaying = isPlaying;
    const newIndex = (currentIndex + 1) % playlist.length;
    loadTrack(newIndex, wasPlaying);
  }

  // ---- playlist: tambah & hapus lagu ----
  function handleFilesSelected(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const newTracks = files.map((file) => ({
      id: ++trackIdSeq,
      name: cleanName(file.name),
      url: URL.createObjectURL(file),
      coverUrl: null,
    }));
    setPlaylist((prev) => [...prev, ...newTracks]);
    e.target.value = "";
  }

  function removeTrack(i) {
    const track = playlist[i];
    if (!track) return;
    const wasCurrent = i === currentIndex;

    URL.revokeObjectURL(track.url);
    if (track.coverUrl) URL.revokeObjectURL(track.coverUrl);

    const next = playlist.slice();
    next.splice(i, 1);
    setPlaylist(next);

    if (next.length === 0) {
      setCurrentIndex(-1);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setSeekPct(0);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
      }
    } else if (wasCurrent) {
      const newIndex = Math.min(i, next.length - 1);
      setCurrentIndex(newIndex);
      const t = next[newIndex];
      if (audioRef.current) {
        audioRef.current.src = t.url;
        audioRef.current.load();
      }
      setCurrentTime(0);
      setSeekPct(0);
    } else if (i < currentIndex) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  // ---- ganti sampul lagu yang lagi aktif ----
  function handleCoverSelected(e) {
    const file = e.target.files?.[0];
    if (!file || currentIndex === -1) {
      e.target.value = "";
      return;
    }
    setPlaylist((prev) => {
      const next = prev.slice();
      const track = { ...next[currentIndex] };
      if (track.coverUrl) URL.revokeObjectURL(track.coverUrl);
      track.coverUrl = URL.createObjectURL(file);
      next[currentIndex] = track;
      return next;
    });
    e.target.value = "";
  }

  function handleCoverEditClick(e) {
    e.stopPropagation();
    if (currentIndex === -1) {
      alert("Tambahkan dan pilih lagu terlebih dahulu sebelum mengganti sampul.");
      return;
    }
    coverInputRef.current?.click();
  }

  // ---- seek progress ----
  function handleSeekChange(e) {
    const pct = Number(e.target.value);
    setSeekPct(pct);
    const dur = duration || 0;
    const nextTime = (pct / 100) * dur;
    setCurrentTime(nextTime);
    if (audioRef.current && Number.isFinite(dur)) {
      audioRef.current.currentTime = nextTime;
    }
  }

  return (
    <div className={cn("lmp-root", className)}>
      <div className="lmp-bg-blur" style={current?.coverUrl ? { backgroundImage: `url("${current.coverUrl}")`, opacity: 1 } : undefined} />

      <div>
        <div className="lmp-phone">
          <div className="lmp-artwork">
            {current?.coverUrl ? (
              <img src={current.coverUrl} alt={`Sampul ${current.name}`} draggable={false} />
            ) : (
              <div className="lmp-placeholder">
                <div className="lmp-note-icon">{current ? "\u266B" : "\u266A"}</div>
                {current ? "Belum ada sampul" : "Belum ada lagu diputar"}
              </div>
            )}

            <button
              type="button"
              className="lmp-cover-edit-btn"
              aria-label="Ganti sampul"
              title="Ganti sampul"
              onClick={handleCoverEditClick}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 5h-3.17L15 3H9L7.17 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-8 13a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
              </svg>
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="lmp-hidden-input"
              onChange={handleCoverSelected}
            />
          </div>

          <div className="lmp-device-row">
            <div className="lmp-device-name">{deviceName}</div>
            <div className={cn("lmp-spectrum", isPlaying && "is-playing")} aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className="lmp-bar" ref={(el) => (barsRef.current[i] = el)} />
              ))}
            </div>
          </div>

          <div className="lmp-track-info">
            <div className="lmp-track-title">{current ? current.name : "Belum ada lagu"}</div>
            <div className="lmp-track-artist">{current ? "File lokal" : "Tambahkan lagu untuk mulai memutar"}</div>
          </div>

          <div className="lmp-progress-wrap">
            <input
              type="range"
              className="lmp-progress-bar"
              min={0}
              max={100}
              step={0.1}
              value={seekPct}
              onChange={handleSeekChange}
              onPointerDown={() => (seekingRef.current = true)}
              onPointerUp={() => (seekingRef.current = false)}
              style={{ "--pct": `${seekPct}%` }}
              aria-label="Posisi audio"
            />
            <div className="lmp-time-row">
              <span>{formatTime(currentTime)}</span>
              <span>-{formatTime(remaining)}</span>
            </div>
          </div>

          <div className="lmp-controls">
            <button type="button" className="lmp-ctrl-btn" aria-label="Sebelumnya" onClick={goPrev}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.5 12 22 5v14zM3 12l9.5-7v14z" />
              </svg>
            </button>
            <button type="button" className="lmp-ctrl-btn lmp-play-btn" aria-label={isPlaying ? "Jeda" : "Putar"} onClick={togglePlay}>
              {isPlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button type="button" className="lmp-ctrl-btn" aria-label="Berikutnya" onClick={goNext}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.5 12 2 19V5zM21 12l-9.5 7V5z" />
              </svg>
            </button>
          </div>

          <div className="lmp-volume-row">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9z" />
            </svg>
            <input
              type="range"
              className="lmp-volume-bar"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              style={{ "--vpct": `${volume}%` }}
              aria-label="Volume"
            />
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9zM16.5 12A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          </div>
        </div>

        <div className="lmp-panel">
          <div className="lmp-panel-header">
            <div className="lmp-panel-title">Daftar Putar</div>
            <button type="button" className="lmp-add-btn" onClick={() => fileInputRef.current?.click()}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z" />
              </svg>
              Tambah Lagu
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              multiple
              className="lmp-hidden-input"
              onChange={handleFilesSelected}
            />
          </div>

          <div className="lmp-playlist">
            {playlist.length === 0 ? (
              <div className="lmp-empty-state">Belum ada lagu. Klik &quot;Tambah Lagu&quot; untuk mengunggah file musik.</div>
            ) : (
              playlist.map((track, i) => (
                <div
                  key={track.id}
                  className={cn("lmp-track-item", i === currentIndex && "active")}
                  onClick={() => {
                    loadTrack(i, true);
                  }}
                >
                  <div className="lmp-track-num">{i + 1}</div>
                  <div className="lmp-track-meta">
                    <div className="lmp-track-name">{track.name}</div>
                  </div>
                  <button
                    type="button"
                    className="lmp-remove-btn"
                    title="Hapus"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTrack(i);
                    }}
                  >
                    &times;
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <audio ref={audioRef} className="lmp-hidden-input" preload="metadata" />

      <style jsx>{`
        .lmp-root {
          --lmp-glass-dark: #17171a;
          --lmp-glass-mid: #2b2b30;
          --lmp-glass-light: #45454c;
          --lmp-text-main: #f5f5f7;
          --lmp-text-dim: #9a9aa2;
          position: relative;
          width: 100%;
          max-width: 430px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: -apple-system, "SF Pro Text", "Segoe UI", Roboto, sans-serif;
          color: var(--lmp-text-main);
        }

        .lmp-bg-blur {
          position: absolute;
          inset: -60px;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          filter: blur(55px) brightness(0.55) saturate(1.3);
          transform: scale(1.15);
          opacity: 0;
          transition: opacity 0.6s ease, background-image 0.3s ease;
          z-index: -1;
          border-radius: 3rem;
        }

        .lmp-phone {
          width: 100%;
          background: linear-gradient(160deg, var(--lmp-glass-light), var(--lmp-glass-dark) 60%);
          border-radius: 46px;
          padding: 24px;
          box-shadow: 0 25px 40px rgba(0, 0, 0, 0.263), inset 0 1px 1px rgba(255, 255, 255, 0.08);
          position: relative;
        }

        .lmp-artwork {
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 22px;
          background: #050505;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03);
        }
        .lmp-artwork img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .lmp-placeholder {
          color: #3a3a40;
          font-size: 13px;
          letter-spacing: 0.5px;
          text-align: center;
          padding: 20px;
        }
        .lmp-note-icon {
          font-size: 52px;
          color: #2c2c31;
          margin-bottom: 6px;
        }

        .lmp-cover-edit-btn {
          position: absolute;
          right: 10px;
          bottom: 10px;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(20, 20, 22, 0.65);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #fff;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.15s ease, transform 0.15s ease, background 0.15s ease;
        }
        .lmp-cover-edit-btn svg {
          width: 17px;
          height: 17px;
        }
        .lmp-artwork:hover .lmp-cover-edit-btn,
        .lmp-cover-edit-btn:focus-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .lmp-cover-edit-btn:hover {
          background: rgba(20, 20, 22, 0.9);
        }
        .lmp-hidden-input {
          display: none;
        }

        .lmp-device-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 16px;
          padding: 0 2px;
        }
        .lmp-device-name {
          font-size: 15px;
          font-weight: 600;
          color: var(--lmp-text-dim);
        }
        .lmp-spectrum {
          display: flex;
          align-items: flex-end;
          gap: 3px;
          height: 20px;
          width: 24px;
        }
        .lmp-bar {
          flex: 1;
          background: var(--lmp-text-dim);
          border-radius: 2px;
          height: 3px;
          transition: background 0.2s ease;
        }
        .lmp-spectrum.is-playing .lmp-bar {
          background: #fff;
        }

        .lmp-track-info {
          margin-top: 14px;
          text-align: left;
        }
        .lmp-track-title {
          font-size: 19px;
          font-weight: 600;
          color: var(--lmp-text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .lmp-track-artist {
          font-size: 14px;
          color: var(--lmp-text-dim);
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .lmp-progress-wrap {
          margin-top: 10px;
        }
        .lmp-progress-bar {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 7px;
          border-radius: 2px;
          background: linear-gradient(to right, #fff var(--pct, 0%), rgba(255, 255, 255, 0.25) var(--pct, 0%));
          outline: none;
          cursor: pointer;
        }
        .lmp-progress-bar::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        }
        .lmp-progress-bar::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fff;
          border: none;
          cursor: pointer;
        }

        .lmp-time-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: var(--lmp-text-dim);
          margin-top: 6px;
          font-variant-numeric: tabular-nums;
        }

        .lmp-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 4px;
          padding: 0 10px;
        }
        .lmp-ctrl-btn {
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 19px;
          transition: transform 0.1s ease, opacity 0.15s ease;
        }
        .lmp-ctrl-btn:active {
          transform: scale(0.88);
          opacity: 0.7;
        }
        .lmp-ctrl-btn svg {
          width: 30px;
          height: 30px;
        }
        .lmp-play-btn svg {
          width: 36px;
          height: 36px;
        }

        .lmp-volume-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 25px;
          color: var(--lmp-text-dim);
        }
        .lmp-volume-row svg {
          width: 22px;
          height: 22px;
          flex-shrink: 0;
        }
        .lmp-volume-bar {
          -webkit-appearance: none;
          appearance: none;
          flex: 1;
          height: 7px;
          border-radius: 2px;
          background: linear-gradient(to right, #fff var(--vpct, 70%), rgba(255, 255, 255, 0.25) var(--vpct, 70%));
          outline: none;
          cursor: pointer;
        }
        .lmp-volume-bar::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
        }
        .lmp-volume-bar::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fff;
          border: none;
          cursor: pointer;
        }

        .lmp-panel {
          width: 100%;
          margin-top: 44px;
        }
        .lmp-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .lmp-panel-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--lmp-text-dim);
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        .lmp-add-btn {
          background: var(--lmp-glass-mid);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          padding: 7px 14px;
          border-radius: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.15s ease;
        }
        .lmp-add-btn:hover {
          background: var(--lmp-glass-light);
        }
        .lmp-add-btn svg {
          width: 14px;
          height: 14px;
        }

        .lmp-playlist {
          max-height: 220px;
          overflow-y: auto;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .lmp-playlist::-webkit-scrollbar {
          width: 6px;
        }
        .lmp-playlist::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 3px;
        }

        .lmp-track-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          cursor: pointer;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          transition: background 0.12s ease;
        }
        .lmp-track-item:last-child {
          border-bottom: none;
        }
        .lmp-track-item:hover {
          background: rgba(255, 255, 255, 0.04);
        }
        .lmp-track-item.active {
          background: rgba(255, 255, 255, 0.08);
        }

        .lmp-track-num {
          width: 20px;
          font-size: 12px;
          color: var(--lmp-text-dim);
          text-align: center;
          flex-shrink: 0;
        }
        .lmp-track-item.active .lmp-track-num {
          color: #fff;
        }
        .lmp-track-meta {
          flex: 1;
          min-width: 0;
        }
        .lmp-track-name {
          font-size: 14.5px;
          color: var(--lmp-text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .lmp-track-item.active .lmp-track-name {
          font-weight: 600;
        }
        .lmp-remove-btn {
          background: none;
          border: none;
          color: var(--lmp-text-dim);
          cursor: pointer;
          font-size: 16px;
          line-height: 1;
          padding: 4px;
          flex-shrink: 0;
        }
        .lmp-remove-btn:hover {
          color: #ff6b6b;
        }

        .lmp-empty-state {
          padding: 26px 16px;
          text-align: center;
          color: var(--lmp-text-dim);
          font-size: 13px;
        }

        @media (max-width: 360px) {
          .lmp-phone {
            padding: 18px;
            border-radius: 38px;
          }
          .lmp-track-title {
            font-size: 17px;
          }
        }
      `}</style>
    </div>
  );
}
