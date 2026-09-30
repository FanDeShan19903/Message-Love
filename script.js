/**
 * ========================================================
 * THE SOUND OF MY HEART - SCRIPT
 * Màn hình code rain "iLoveU" tươi sáng giải mã thành lời tỏ tình
 * Dành riêng cho: THANH HÀ
 * Tối ưu âm thanh tức thì (0ms latency) & hỗ trợ hoàn hảo khi xoay ngang
 * Link YouTube: https://youtu.be/ZzRKtUK-hlw
 * ========================================================
 */

// ========================================================
// CẤU HÌNH CÁ NHÂN HÓA (CHỈ CẦN THAY ĐỔI Ở ĐÂY)
// ========================================================
const CONFIG = {
  senderName: "TÊN ANH",
  receiverName: "Thanh Hà",
  specialDate: "30 • 09 • 2026",
  youtubeVideoId: "ZzRKtUK-hlw", // Link nhạc người dùng cung cấp

  messages: [
    "Anh có một điều muốn nói...",
    "Anh đã suy nghĩ về điều này rất lâu...",
    "Có một người đã khiến những ngày bình thường trở nên đặc biệt và làm anh nhớ nhung không thôi...",
    "ANH THÍCH EM ❤️",
    "Anh muốn được ở bên em!!!"
  ]
};

// ========================================================
// TYPEWRITER TEXT ENGINE (HIỆU ỨNG ĐÁNH CHỮ TỐC ĐỘ VỪA PHẢI)
// ========================================================
function typewriterText(element, finalText, options = {}) {
  return new Promise((resolve) => {
    const {
      charDelay = 60, // Tốc độ vừa phải (~60ms mỗi ký tự)
      kicker = "",
      pausePunctuation = true
    } = options;

    const kickerEl = document.getElementById("textKicker");
    if (kickerEl) {
      kickerEl.textContent = kicker;
      kickerEl.style.display = kicker ? "block" : "none";
    }

    // Tách đúng chuỗi Unicode/Emoji bằng Array.from
    const chars = Array.from(finalText);
    element.innerHTML = '<span class="typewriter-content"></span><span class="typewriter-cursor"></span>';
    const contentSpan = element.querySelector(".typewriter-content");
    const cursorSpan = element.querySelector(".typewriter-cursor");

    let currentIndex = 0;
    let accumulatedText = "";

    function typeNextChar() {
      if (currentIndex >= chars.length) {
        resolve();
        return;
      }

      const char = chars[currentIndex];
      currentIndex++;

      if (char === "\n") {
        accumulatedText += "<br/>";
      } else {
        accumulatedText += escapeHtml(char);
      }

      if (contentSpan) {
        contentSpan.innerHTML = accumulatedText;
      }

      // Nhịp gõ chữ mượt mà, dừng tự nhiên ở dấu phẩy và chấm câu
      let delay = charDelay;
      if (char === " ") {
        delay = Math.round(charDelay * 0.7);
      } else if (pausePunctuation) {
        if (char === "," || char === ";") {
          delay = Math.round(charDelay * 2.8); // Dừng nhẹ ~170ms
        } else if (char === "." || char === "!" || char === "?") {
          if (currentIndex < chars.length && chars[currentIndex] === ".") {
            delay = Math.round(charDelay * 1.1);
          } else {
            delay = Math.round(charDelay * 3.8); // Dừng cuối câu ~230ms
          }
        }
      }

      setTimeout(typeNextChar, delay);
    }

    setTimeout(typeNextChar, 100);
  });
}

function escapeHtml(str) {
  if (str === "<") return "&lt;";
  if (str === ">") return "&gt;";
  if (str === "&") return "&amp;";
  return str;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ========================================================
// BACKGROUND CODE RAIN ("iLoveU" CANVAS SYSTEM)
// Mật độ dày đặc bao phủ toàn màn hình, tốc độ rơi chậm dịu dàng
// ========================================================
class CodeRain {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.phrase = "iLoveU♥";
    this.phraseChars = this.phrase.split("");
    this.fontSize = 8.5;
    this.colWidth = 14;
    this.rowHeight = 12;
    this.columns = 0;
    this.streams = [];
    this.speedMultiplier = 1;
    this.isRunning = true;
    this.isSparkleMode = false;
    this.isHeartPhase = false;

    this.resize();
    window.addEventListener("resize", () => this.resize());
    window.addEventListener("orientationchange", () => {
      setTimeout(() => this.resize(), 150);
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.max(16, Math.floor(this.canvas.width / this.colWidth));
    const totalRows = Math.ceil(this.canvas.height / this.rowHeight);
    
    // Giảm mật độ để tạo khoảng cách thanh thoát tựa như mưa sao băng
    // Thay vì 3 luồng mỗi cột, trung bình chỉ khoảng 1.1 luồng/cột với độ cao ngẫu nhiên
    this.streams = [];

    for (let c = 0; c < this.columns; c++) {
      // 75% cột có 1 vệt sao băng, một số cột thưa thoáng tạo cảm giác trời đêm sao băng rơi
      if (Math.random() < 0.78) {
        const initialY = Math.random() * totalRows - 10;
        this.streams.push({
          col: c,
          y: initialY,
          speed: 0.48 + Math.random() * 0.32,
          trailLength: 6 + Math.floor(Math.random() * 9), // Đuôi sao băng từ 6 - 14 ký tự
          offset: Math.floor(Math.random() * this.phraseChars.length)
        });
      }
      // Thi thoảng một vệt sao băng thứ hai rơi đuổi theo
      if (Math.random() < 0.28) {
        const initialY = Math.random() * totalRows - 30;
        this.streams.push({
          col: c,
          y: initialY,
          speed: 0.52 + Math.random() * 0.35,
          trailLength: 7 + Math.floor(Math.random() * 8),
          offset: Math.floor(Math.random() * this.phraseChars.length)
        });
      }
    }
  }

  start() {
    const render = () => {
      if (!this.isRunning) return;
      this.draw();
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  setSpeed(multiplier) {
    this.speedMultiplier = multiplier;
  }

  setHeartPhase(isHeart) {
    this.isHeartPhase = isHeart;
  }

  enableSparkleMode() {
    this.isSparkleMode = true;
  }

  draw() {
    // Xóa nền với hiệu ứng vệt mờ sao băng (motion blur lấp lánh)
    if (this.isHeartPhase) {
      this.ctx.fillStyle = "rgba(255, 245, 248, 0.22)";
    } else {
      this.ctx.fillStyle = this.isSparkleMode
        ? "rgba(255, 240, 245, 0.26)"
        : "rgba(255, 242, 246, 0.22)";
    }
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = `600 ${this.fontSize}px 'JetBrains Mono', monospace`;

    for (let i = 0; i < this.streams.length; i++) {
      const stream = this.streams[i];
      const x = stream.col * this.colWidth;
      const headY = stream.y;
      const trail = stream.trailLength;

      // Vẽ vệt đuôi sao băng: Đầu sao băng phát sáng rực rỡ, đuôi vệt sao tan biến dần
      for (let t = 0; t < trail; t++) {
        const charRow = Math.floor(headY - t);
        const y = charRow * this.rowHeight;

        if (y >= 0 && y <= this.canvas.height + this.rowHeight) {
          const charIndex = Math.abs(charRow + stream.offset + 1000) % this.phraseChars.length;
          const char = this.phraseChars[charIndex];

          if (this.isSparkleMode) {
            this.ctx.fillStyle = t === 0 ? "#be123c" : `rgba(236, 72, 153, ${(1 - t / trail) * 0.7})`;
          } else if (this.isHeartPhase) {
            this.ctx.fillStyle = t === 0 ? "#be123c" : `rgba(244, 114, 182, ${(1 - t / trail) * 0.6})`;
          } else {
            if (t === 0) {
              // Đầu sao băng: Hồng Ruby đậm nét rực sáng
              this.ctx.fillStyle = "#9f1239";
            } else if (t === 1) {
              this.ctx.fillStyle = "#e11d48";
            } else {
              // Đuôi sao băng vuốt mờ thanh mảnh
              const alpha = Math.max(0.04, Math.pow(1 - t / trail, 1.4) * 0.75);
              this.ctx.fillStyle = `rgba(225, 29, 72, ${alpha})`;
            }
          }

          this.ctx.fillText(char, x, y);
        }
      }

      // Tốc độ lướt sao băng theo frame
      stream.y += stream.speed * this.speedMultiplier;

      // Khi vệt sao băng bay qua khỏi màn hình, hồi sinh lại trên đỉnh với độ trễ ngẫu nhiên
      if ((stream.y - trail) * this.rowHeight > this.canvas.height) {
        stream.y = -Math.floor(Math.random() * 25) - 4;
        stream.trailLength = 6 + Math.floor(Math.random() * 9);
        stream.speed = 0.48 + Math.random() * 0.32;
        stream.offset = (stream.offset + 1) % this.phraseChars.length;
      }
    }
  }
}

// ========================================================
// CELEBRATION HEARTS & PARTICLES (POST-YES ANIMATION)
// ========================================================
class CelebrationSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.isActive = false;
    this.resize();
    window.addEventListener("resize", () => this.resize());
    window.addEventListener("orientationchange", () => {
      setTimeout(() => this.resize(), 150);
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  start() {
    this.isActive = true;
    this.canvas.classList.add("active");
    this.particles = [];

    const count = 140;
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(true));
    }

    const loop = () => {
      if (!this.isActive) return;
      this.update();
      this.draw();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  createParticle(isInitialBurst = false) {
    const isHeart = Math.random() > 0.3;
    const startX = isInitialBurst
      ? this.canvas.width / 2 + (Math.random() - 0.5) * 120
      : Math.random() * this.canvas.width;
    const startY = isInitialBurst
      ? this.canvas.height / 2 + (Math.random() - 0.5) * 120
      : this.canvas.height + 20;

    const colors = ["#e11d48", "#f472b6", "#ec4899", "#db2777", "#ffffff"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    return {
      x: startX,
      y: startY,
      vx: (Math.random() - 0.5) * (isInitialBurst ? 3.6 : 1.2),
      vy: isInitialBurst
        ? -(Math.random() * 3.2 + 1.6)
        : -(Math.random() * 1.8 + 0.8),
      size: isHeart ? Math.random() * 14 + 10 : Math.random() * 3.5 + 1.5,
      alpha: 1,
      color: color,
      isHeart: isHeart,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.04,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.04 + 0.02
    };
  }

  update() {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx + Math.sin(p.wobble) * 0.6;
      p.y += p.vy;
      p.wobble += p.wobbleSpeed;
      p.rotation += p.rotationSpeed;

      if (p.y < 120) {
        p.alpha -= 0.015;
      }

      if (p.y < -30 || p.alpha <= 0) {
        this.particles[i] = this.createParticle(false);
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);

      if (p.isHeart) {
        this.ctx.fillStyle = p.color;
        this.ctx.shadowColor = p.color;
        this.ctx.shadowBlur = 12;
        this.drawHeart(0, 0, p.size);
      } else {
        this.ctx.fillStyle = "#ffffff";
        this.ctx.shadowColor = p.color;
        this.ctx.shadowBlur = 8;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }
  }

  drawHeart(x, y, size) {
    const scale = size / 24;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - 6 * scale);
    this.ctx.bezierCurveTo(
      x - 12 * scale, y - 18 * scale,
      x - 22 * scale, y + 2 * scale,
      x, y + 16 * scale
    );
    this.ctx.bezierCurveTo(
      x + 22 * scale, y + 2 * scale,
      x + 12 * scale, y - 18 * scale,
      x, y - 6 * scale
    );
    this.ctx.fill();
  }
}

// ========================================================
// INSTANT AUDIO ENGINE: "NƠI NÀY CÓ ANH | Instrumental"
// Sẵn sàng kích hoạt 0ms ngay khi mở lá thư tình
// ========================================================
class YouTubeAudioManager {
  constructor(videoId = "ZzRKtUK-hlw") {
    this.videoId = videoId;
    this.player = null;
    this.isReady = false;
    this.isYouTubePlaying = false;
    this.synthActive = false;
    this.synthContext = null;
    this.masterGain = null;
    this.hasUnlocked = false;

    // Khởi tạo YouTube Iframe API sẵn trong nền
    this.initYouTube();
  }

  initYouTube() {
    if (window.YT && window.YT.Player) {
      this.setupPlayer();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }

      window.onYouTubeIframeAPIReady = () => {
        this.setupPlayer();
      };
    }
  }

  setupPlayer() {
    try {
      this.player = new window.YT.Player("youtube-player", {
        height: "1",
        width: "1",
        videoId: this.videoId,
        playerVars: {
          autoplay: 0,
          loop: 1,
          playlist: this.videoId,
          playsinline: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0
        },
        events: {
          onReady: (event) => {
            this.isReady = true;
            try {
              event.target.setVolume(85);
              // Nếu người dùng đã mở lá thư trước khi YouTube tải xong, phát ngay lập tức
              if (this.hasUnlocked) {
                event.target.playVideo();
              }
            } catch (err) {}
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              this.isYouTubePlaying = true;
              // Chuyển mượt (cross-fade) từ synth sang YouTube
              this.fadeOutSynth(1.2);
            }
          }
        }
      });
    } catch (e) {}
  }

  play() {
    this.hasUnlocked = true;

    // 1. Đảm bảo Web Audio Synth phát ngay lập tức 0ms không độ trễ
    if (!this.synthActive && !this.isYouTubePlaying) {
      this.startFallbackSynth();
    } else if (this.synthContext && this.synthContext.state === "suspended") {
      this.synthContext.resume();
    }

    // 2. Kích hoạt YouTube
    if (this.player && typeof this.player.playVideo === "function") {
      try {
        this.player.setVolume(85);
        this.player.playVideo();
      } catch (e) {}
    }
  }

  startFallbackSynth() {
    if (this.synthActive) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!this.synthContext) {
        this.synthContext = new AudioCtx();
      }

      if (this.synthContext.state === "suspended") {
        this.synthContext.resume().catch(() => {});
      }

      this.masterGain = this.synthContext.createGain();
      this.masterGain.gain.setValueAtTime(0.08, this.synthContext.currentTime);
      this.masterGain.connect(this.synthContext.destination);

      this.synthActive = true;

      // Nốt nhạc bài "NƠI NÀY CÓ ANH"
      const N = {
        D3: 146.83, E3: 164.81, Fs3: 185.00, G3: 196.00, A3: 220.00, B3: 246.94,
        D4: 293.66, E4: 329.63, Fs4: 369.99, G4: 392.00, A4: 440.00, B4: 493.88,
        Cs5: 554.37, D5: 587.33, E5: 659.25, Fs5: 739.99, A5: 880.00
      };

      const melody = [
        { note: N.Fs4, dur: 0.5, chord: [N.B3, N.D4, N.Fs4] },
        { note: N.A4,  dur: 0.5 },
        { note: N.B4,  dur: 0.75 },
        { note: N.D5,  dur: 0.75 },
        { note: N.Cs5, dur: 0.5 },
        { note: N.B4,  dur: 0.5 },
        { note: N.A4,  dur: 0.75, chord: [N.G3, N.B3, N.D4] },
        { note: N.Fs4, dur: 0.5 },
        { note: N.E4,  dur: 0.5 },
        { note: N.D4,  dur: 0.5 },
        { note: N.Fs4, dur: 0.75 },
        { note: N.E4,  dur: 1.0 },

        { note: N.Fs4, dur: 0.5, chord: [N.D3, N.Fs3, N.A3] },
        { note: N.A4,  dur: 0.5 },
        { note: N.B4,  dur: 0.75 },
        { note: N.D5,  dur: 0.75 },
        { note: N.Cs5, dur: 0.5 },
        { note: N.B4,  dur: 0.5 },
        { note: N.A4,  dur: 0.75, chord: [N.A3, N.Cs4, N.E4] },
        { note: N.B4,  dur: 0.5 },
        { note: N.D5,  dur: 0.75 },
        { note: N.Cs5, dur: 0.5 },
        { note: N.B4,  dur: 0.75 },
        { note: N.A4,  dur: 1.0 },

        { note: N.Fs4, dur: 0.5, chord: [N.B3, N.D4, N.Fs4] },
        { note: N.A4,  dur: 0.5 },
        { note: N.B4,  dur: 0.75 },
        { note: N.D5,  dur: 0.75 },
        { note: N.Cs5, dur: 0.5 },
        { note: N.B4,  dur: 0.5 },
        { note: N.A4,  dur: 0.75, chord: [N.G3, N.B3, N.D4] },
        { note: N.B4,  dur: 0.5 },
        { note: N.D5,  dur: 0.75 },
        { note: N.Cs5, dur: 0.5 },
        { note: N.B4,  dur: 0.5 },
        { note: N.A4,  dur: 0.5 },
        { note: N.Fs4, dur: 1.0 },

        { note: N.D5,  dur: 0.5, chord: [N.D3, N.Fs3, N.A3] },
        { note: N.E5,  dur: 0.5 },
        { note: N.Fs5, dur: 0.75 },
        { note: N.E5,  dur: 0.5 },
        { note: N.D5,  dur: 0.5 },
        { note: N.Cs5, dur: 0.5 },
        { note: N.B4,  dur: 0.75, chord: [N.A3, N.Cs4, N.E4] },
        { note: N.A4,  dur: 0.5 },
        { note: N.Fs4, dur: 0.5 },
        { note: N.D4,  dur: 0.5 },
        { note: N.E4,  dur: 0.75 },
        { note: N.D4,  dur: 1.5 }
      ];

      const beatMs = 450;
      const playMelody = () => {
        if (!this.synthActive || !this.synthContext || this.isYouTubePlaying) return;

        let accumTime = 0;
        melody.forEach((item) => {
          setTimeout(() => {
            if (!this.synthActive || this.isYouTubePlaying) return;
            this.playAcousticChime(item.note, item.dur * 0.9);

            if (item.chord) {
              item.chord.forEach((cFreq, idx) => {
                setTimeout(() => {
                  if (this.synthActive && !this.isYouTubePlaying) {
                    this.playWarmBass(cFreq, 1.8);
                  }
                }, idx * 35);
              });
            }
          }, accumTime);

          accumTime += item.dur * beatMs;
        });

        setTimeout(playMelody, accumTime + 1200);
      };

      playMelody();
    } catch (e) {}
  }

  playAcousticChime(freq, duration = 1.0) {
    if (!this.synthContext || !this.masterGain) return;
    try {
      const now = this.synthContext.currentTime;

      // Hài âm 1 (gốc sine)
      const osc1 = this.synthContext.createOscillator();
      const gain1 = this.synthContext.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(freq, now);
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.35, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + duration);

      // Hài âm 2 (quãng 8 triangle cho tiếng ấm vang)
      const osc2 = this.synthContext.createOscillator();
      const gain2 = this.synthContext.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(freq * 2, now);
      gain2.gain.setValueAtTime(0, now);
      gain2.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.7);

      osc1.connect(gain1);
      gain1.connect(this.masterGain);

      osc2.connect(gain2);
      gain2.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration + 0.05);
      osc2.stop(now + duration + 0.05);
    } catch (err) {}
  }

  playWarmBass(freq, duration = 1.6) {
    if (!this.synthContext || !this.masterGain) return;
    try {
      const now = this.synthContext.currentTime;
      const osc = this.synthContext.createOscillator();
      const gain = this.synthContext.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    } catch (err) {}
  }

  fadeOutSynth(fadeSec = 1.5) {
    if (!this.masterGain || !this.synthContext) return;
    try {
      const now = this.synthContext.currentTime;
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + fadeSec);
      setTimeout(() => {
        this.synthActive = false;
      }, fadeSec * 1000);
    } catch (e) {
      this.synthActive = false;
    }
  }
}

// ========================================================
// STORY SEQUENCE ORCHESTRATOR
// ========================================================
class StorySequence {
  constructor(codeRain, celebration, audioManager) {
    this.codeRain = codeRain;
    this.celebration = celebration;
    this.audioManager = audioManager;
    this.letterStage = document.getElementById("letterStage");
    this.envelopeBtn = document.getElementById("envelopeBtn");
    this.envelope = document.getElementById("envelope");
    this.paperRecipient = document.getElementById("paperRecipient");
    this.decryptBox = document.getElementById("decryptBox");
    this.decryptText = document.getElementById("decryptText");
    this.heartStage = document.getElementById("heartStage");
    this.questionBox = document.getElementById("questionBox");
    this.successStage = document.getElementById("successStage");
    this.vignette = document.getElementById("vignette");
    this.heartOutline = document.getElementById("heartOutline");
    this.questionRecipient = document.getElementById("questionRecipient");
    this.btnAccept = document.getElementById("btnAccept");
    this.btnThink = document.getElementById("btnThink");
    this.thinkResponse = document.getElementById("thinkResponse");
    this.replayBtn = document.getElementById("replayBtn");
    this.isLetterOpened = false;

    if (this.paperRecipient) {
      this.paperRecipient.textContent = CONFIG.receiverName || "Thanh Hà";
    }

    this.initEvents();
  }

  initEvents() {
    if (this.envelopeBtn) {
      const openHandler = (e) => {
        if (e) e.preventDefault();
        this.openLetter();
      };
      this.envelopeBtn.addEventListener("click", openHandler);
    }

    if (this.letterStage) {
      const ctaBtn = this.letterStage.querySelector(".letter-tap-cta");
      if (ctaBtn) {
        ctaBtn.addEventListener("click", (e) => {
          if (e) e.preventDefault();
          this.openLetter();
        });
      }
    }

    if (this.btnAccept) {
      this.btnAccept.addEventListener("click", () => this.handleAccept());
    }
    if (this.btnThink) {
      this.btnThink.addEventListener("click", () => this.handleThink());
    }
    if (this.replayBtn) {
      this.replayBtn.addEventListener("click", () => this.restart());
    }
  }

  async openLetter() {
    if (this.isLetterOpened) return;
    this.isLetterOpened = true;

    // 1. CÙNG LÚC: Bật nhạc tức thì (0ms) với cử chỉ chạm trực tiếp
    if (this.audioManager) {
      this.audioManager.play();
    }

    // 2. Chuyển mưa chữ sang nhịp điệu tình yêu êm đềm
    this.codeRain.setSpeed(1.0);

    // 3. Hiệu ứng mở lá thư: Nắp phong bì mở ra, lá thư trượt lên
    if (this.envelope) {
      this.envelope.classList.add("opened");
    }

    // Đợi 800ms cho hiệu ứng mở thư hoàn tất
    await sleep(800);

    // 4. Mờ dần lá thư và biến mất
    if (this.letterStage) {
      this.letterStage.classList.add("fade-out");
    }
    await sleep(450);

    if (this.letterStage) {
      this.letterStage.style.display = "none";
    }

    // 5. CÙNG LÚC: Bắt đầu chạy hiệu ứng đánh chữ lời nhắn!
    this.decryptBox.style.display = "flex";
    this.run();
  }

  async run() {
    await sleep(350);
    this.decryptText.className = "decrypt-text";
    this.setBoxVisibility(true);

    // Mở đầu đánh chữ gửi đến người ấy với tốc độ vừa phải (~60ms)
    await this.transitionText(
      `Gửi em, ${CONFIG.receiverName || "Thanh Hà"}... 🌸`,
      "A LETTER FOR YOU",
      1600,
      true,
      62
    );

    // STEP 1: "Anh có một điều muốn nói..."
    await this.transitionText(
      CONFIG.messages[0] || "Anh có một điều muốn nói...",
      "",
      1800,
      true,
      58
    );

    // STEP 2: "Anh đã suy nghĩ về điều này rất lâu..."
    await this.transitionText(
      CONFIG.messages[1] || "Anh đã suy nghĩ về điều này rất lâu...",
      "",
      2000,
      true,
      56
    );

    // STEP 3: "Có một người đã khiến những ngày bình thường trở nên đặc biệt và làm anh nhớ nhung không thôi..."
    await this.transitionText(
      CONFIG.messages[2] || "Có một người đã khiến những ngày bình thường trở nên đặc biệt và làm anh nhớ nhung không thôi...",
      "",
      2200,
      true,
      52
    );

    // STEP 4: Tên người nhận [THANH HÀ] - Chữ lớn ở giữa màn hình
    this.decryptText.className = "decrypt-text large-name";
    await this.transitionText(
      CONFIG.receiverName || "Thanh Hà",
      "FOR YOU",
      2400,
      false,
      75
    );
    this.decryptText.className = "decrypt-text";

    // STEP 5: Ngày đặc biệt "30 • 09 • 2026"
    this.decryptText.className = "decrypt-text special-date";
    await this.transitionText(
      CONFIG.specialDate || "30 • 09 • 2026",
      "SPECIAL MOMENT",
      2400,
      false,
      70
    );
    this.decryptText.className = "decrypt-text";

    // STEP 6: "Và hôm nay..." -> "Anh muốn nói với em một điều..."
    await this.transitionText("Và hôm nay...", "", 1500, true, 65);
    await this.transitionText("Anh muốn nói với em một điều...", "", 1800, true, 58);

    // STEP 7: Màn hình chuyển tone hồng ấm rực rỡ, mưa chữ iLoveU nhẹ nhàng tăng tốc, hiện "ANH THÍCH EM ❤️"
    this.vignette.classList.add("darker");
    this.codeRain.setSpeed(1.2);

    this.decryptText.className = "decrypt-text huge-confession";
    await this.transitionText(
      CONFIG.messages[3] || "ANH THÍCH EM ❤️",
      "CONFESSION",
      2800,
      false,
      72
    );
    this.decryptText.className = "decrypt-text";

    // Trở lại tốc độ êm dịu
    this.codeRain.setSpeed(1);
    this.vignette.classList.remove("darker");

    // STEP 8: "Anh không biết em sẽ trả lời thế nào..." -> "Nhưng anh vẫn muốn nói."
    await this.transitionText("Anh không biết em sẽ trả lời thế nào...", "", 1800, true, 56);
    await this.transitionText("Nhưng anh vẫn muốn nói...", "", 1800, true, 56);

    // STEP 9: "Anh muốn được ở bên em."
    await this.transitionText(
      CONFIG.messages[4] || "Anh muốn được ở bên em❤️",
      "FROM MY HEART",
      2200,
      true,
      60
    );

    // STEP 10: Chuyển sang không gian hoa hồng pastel sáng lung linh. Trái tim neon xuất hiện
    await this.setBoxVisibility(false);
    this.vignette.classList.add("near-black");
    this.codeRain.setHeartPhase(true);
    await sleep(600);

    // Vẽ trái tim neon
    this.showNeonHeart();
  }

  async transitionText(text, kicker = "", holdTime = 2000, resetClass = true, charDelay = 58) {
    this.setBoxVisibility(true);
    await typewriterText(this.decryptText, text, { kicker, charDelay });
    await sleep(holdTime);
    await this.setBoxVisibility(false);
    await sleep(400);
    if (resetClass) {
      this.decryptText.className = "decrypt-text";
    }
  }

  setBoxVisibility(visible) {
    return new Promise((resolve) => {
      if (visible) {
        this.decryptBox.classList.remove("fade-out");
        this.decryptBox.classList.add("fade-in");
        setTimeout(resolve, 300);
      } else {
        this.decryptBox.classList.remove("fade-in");
        this.decryptBox.classList.add("fade-out");
        setTimeout(resolve, 500);
      }
    });
  }

  showNeonHeart() {
    this.decryptBox.style.display = "none";
    this.heartStage.classList.add("visible");

    this.heartOutline.classList.remove("filled");
    this.heartOutline.classList.add("drawn");

    const heartFill = document.getElementById("heartFill");
    const heartSvgWrapper = document.getElementById("heartSvgWrapper");

    if (heartFill) {
      heartFill.classList.remove("filled");
    }
    if (heartSvgWrapper) {
      heartSvgWrapper.classList.remove("pulsing");
    }

    this.createHeartSparkles();

    setTimeout(() => {
      this.heartOutline.classList.add("filled");
      if (heartFill) {
        heartFill.classList.add("filled");
      }
      if (heartSvgWrapper) {
        heartSvgWrapper.classList.add("pulsing");
      }
      this.showFinalQuestion();
    }, 2200);
  }

  createHeartSparkles() {
    const container = document.getElementById("heartParticles");
    if (!container) return;
    container.innerHTML = "";

    const items = [
      { type: "star", delay: 0 },
      { type: "dot", delay: 0.15 },
      { type: "micro-heart", delay: 0.3 },
      { type: "star", delay: 0.5 },
      { type: "dot", delay: 0.7 },
      { type: "star", delay: 0.9 },
      { type: "dot", delay: 1.1 },
      { type: "micro-heart", delay: 1.3 },
      { type: "star", delay: 1.5 },
      { type: "dot", delay: 1.7 },
      { type: "star", delay: 1.9 },
      { type: "dot", delay: 2.1 },
      { type: "micro-heart", delay: 2.3 },
      { type: "star", delay: 2.5 },
      { type: "dot", delay: 2.7 },
      { type: "star", delay: 2.9 }
    ];

    items.forEach((item, i) => {
      const el = document.createElement("div");
      const angle = (i / items.length) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
      const distance = Math.random() * 55 + 40;
      const tx = `${Math.cos(angle) * distance}px`;
      const ty = `${Math.sin(angle) * distance}px`;

      el.style.setProperty("--tx", tx);
      el.style.setProperty("--ty", ty);
      el.style.animationDelay = `${item.delay}s`;

      if (item.type === "star") {
        el.className = "sparkle-star";
        el.innerHTML = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,2 L14,9 L21,12 L14,15 L12,22 L10,15 L3,12 L10,9 Z"/></svg>';
      } else if (item.type === "micro-heart") {
        el.className = "sparkle-mini-heart";
        el.textContent = "❤";
      } else {
        el.className = "sparkle-dot";
      }

      container.appendChild(el);
    });
  }

  showFinalQuestion() {
    if (this.questionRecipient) {
      this.questionRecipient.textContent = CONFIG.receiverName || "Thanh Hà";
    }
    this.questionBox.classList.add("visible");
  }

  handleAccept() {
    this.questionBox.classList.remove("visible");
    this.heartStage.classList.remove("visible");
    this.vignette.classList.remove("near-black");
    this.vignette.classList.add("darker");

    this.codeRain.enableSparkleMode();
    this.celebration.start();

    setTimeout(() => {
      this.successStage.classList.add("visible");
    }, 400);
  }

  handleThink() {
    if (this.thinkResponse) {
      this.thinkResponse.classList.add("visible");
    }
  }

  restart() {
    window.location.reload();
  }
}

// ========================================================
// INITIALIZATION ON DOM READY
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
  const codeCanvas = document.getElementById("codeCanvas");
  const celebrationCanvas = document.getElementById("celebrationCanvas");

  const codeRain = new CodeRain(codeCanvas);
  codeRain.start();

  const celebration = new CelebrationSystem(celebrationCanvas);
  
  // Khởi chạy hệ thống âm thanh sẵn sàng trong nền (sẽ phát ngay khi chạm vào lá thư)
  const audioManager = new YouTubeAudioManager(CONFIG.youtubeVideoId);

  // Khởi tạo kịch bản với lá thư tình tương tác
  new StorySequence(codeRain, celebration, audioManager);
});
