"use client";

import * as React from "react";

// ============================================================================
// useLocalPlaylist -- semua logic player musik lokal (upload file audio,
// upload sampul per lagu, play/pause/next/prev, seek, volume) dipisah dari
// tampilan biar bisa dipakai di 2 tempat sekaligus:
//   1. Card musik yang tampil DI DALAM mockup HP (cuma visual player-nya)
//   2. Panel kontrol (Tambah Lagu / Ganti Sampul / daftar putar) yang tampil
//      DI LUAR mockup HP, di halaman biasa
//
// Kedua komponen tinggal makan 1 instance hook ini yang sama biar state-nya
// nyambung (upload lagu di panel luar -> otomatis keputar & keliatan di
// card dalam HP).
// ============================================================================

function cleanName(filename) {
  return filename.replace(/\.[^/.]+$/, "");
}

let trackIdSeq = 0;

export function useLocalPlaylist() {
  const audioRef = React.useRef(null);
  const seekingRef = React.useRef(false);
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

  function skip(deltaSeconds) {
    const audio = audioRef.current;
    if (!audio) return;
    const next = Math.min(Math.max((audio.currentTime || 0) + deltaSeconds, 0), duration || 0);
    audio.currentTime = next;
    setCurrentTime(next);
    setSeekPct(duration ? (next / duration) * 100 : 0);
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

  return {
    audioRef,
    fileInputRef,
    coverInputRef,
    playlist,
    currentIndex,
    current,
    isPlaying,
    currentTime,
    duration,
    remaining,
    seekPct,
    volume,
    setVolume,
    togglePlay,
    skip,
    goPrev,
    goNext,
    loadTrack,
    handleFilesSelected,
    removeTrack,
    handleCoverSelected,
    handleSeekChange,
    setSeeking: (v) => (seekingRef.current = v),
  };
}
