// 弦の配列（6弦から1弦）
const strings = ["e", "B", "G", "D", "A", "E"]; // ← これが1弦→6弦の順！
const frets = 13; // 0フレット〜12フレットまで

// クロマチック（半音）スケール
const chromaticScale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// 各弦の開放弦の音（6弦→1弦）
const openStrings = ["e", "B", "G", "D", "A", "E"];

//スケール辞書
const scaleMap = {
    C_MAJOR: ["C", "D", "E", "F", "G", "A", "B"],
    G_MAJOR: ["G", "A", "B", "C", "D", "E", "F#"],
    A_MINOR: ["A", "B", "C", "D", "E", "F", "G"]
};

const fretboard = document.getElementById("fretboard");
console.log("🎸 fretboard:", fretboard); // ← 確認用！

//音名 → 周波数に変換する関数
function noteToFrequency(note) {
    const A4 = 440;
    const notes = [
      "C", "C#", "D", "D#", "E", "F",
      "F#", "G", "G#", "A", "A#", "B"
    ];
  
    // すべてのオクターブに対応するため簡略処理
    let octave = 4;
    if (note === "e") note = "E"; // 高音eへの対応
  
    // オクターブをつけないとA440基準だけに近くなるので仮にA4基準
    const index = notes.indexOf(note);
    if (index === -1) return null;
  
    const noteNumber = notes.indexOf(note);
    const midiNumber = 12 * (octave + 1) + noteNumber;
    return A4 * Math.pow(2, (midiNumber - 69) / 12);
  }

  //音を鳴らす関数
  function playTone(frequency) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
  
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
  
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    oscillator.start();
  
    // 音の長さ
    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    oscillator.stop(audioCtx.currentTime + 0.5);
  }

//追加部分
function renderFretboard(scaleName) {
  const scaleNotes = scaleMap[scaleName];
  fretboard.innerHTML = "";

  // フレット番号行を作成
  const fretNumberRow = document.createElement("div");
  fretNumberRow.classList.add("string");

  const labelCell = document.createElement("div");
  labelCell.classList.add("fret");
  labelCell.innerText = " ";
  fretNumberRow.appendChild(labelCell);

  for (let fret = 0; fret < frets; fret++) {
    const fretNumDiv = document.createElement("div");
    fretNumDiv.classList.add("fret");
    fretNumDiv.innerText = fret;
    fretNumberRow.appendChild(fretNumDiv);
  }

  fretboard.appendChild(fretNumberRow);

  // 弦ごとに描画
  strings.forEach((stringName, stringIndex) => {
    const stringRow = document.createElement("div");
    stringRow.classList.add("string");

    const openNote = openStrings[stringIndex].toUpperCase();
    const startIndex = chromaticScale.indexOf(openNote);

    const labelDiv = document.createElement("div");
    labelDiv.classList.add("fret");
    labelDiv.innerText = stringName.toUpperCase();
    stringRow.appendChild(labelDiv);

    for (let fret = 0; fret < frets; fret++) {
      const fretDiv = document.createElement("div");
      fretDiv.classList.add("fret");

      const noteIndex = (startIndex + fret) % chromaticScale.length;
      const note = chromaticScale[noteIndex];

      fretDiv.innerText = note;

      if (scaleNotes.includes(note)) {
        fretDiv.classList.add("note");
        if (note === scaleNotes[0]) {
          fretDiv.classList.add("root");
        }
      }

      //各フレットを押した時に音が鳴るようにする処理
      fretDiv.addEventListener("click", () => {
        const freq = noteToFrequency(note);
        if (freq) playTone(freq);
      });

      stringRow.appendChild(fretDiv);
    }

    fretboard.appendChild(stringRow);
  });
}

    // strings.forEach((stringName, stringIndex) => { 
    //     const stringRow = document.createElement("div");
    //     stringRow.classList.add("string");

    //     // 各弦の開放音を取得（大文字に統一）
    //     const openNote = openStrings[stringIndex].toUpperCase();
    //     const startIndex = chromaticScale.indexOf(openNote);

    //     for (let fret = 0; fret < frets; fret++) {
    //       const fretDiv = document.createElement("div");
    //       fretDiv.classList.add("fret");

    //       // このフレットの音を算出
    //       const noteIndex = (startIndex + fret) % chromaticScale.length;
    //       const note = chromaticScale[noteIndex];

    //       // 音名を表示
    //       fretDiv.innerText = note;

    //       // Cメジャースケールに含まれる音だけ色付け
    //       if (scaleNotes.includes(note)) {
    //         // 新コード ✅
    //         fretDiv.classList.add("note"); // 水色
    //       }

    //       // ルート音Cは別色に！
    //       if (note === "C") {
    //         fretDiv.classList.add("root"); // ピンク
    //       }

    //       stringRow.appendChild(fretDiv);
    //     }

    //     fretboard.appendChild(stringRow);
    //   });

    //スケール変更イベント
    const scaleSelect = document.getElementById("scaleSelect");
    scaleSelect.addEventListener("change", (e) => {
        renderFretboard(e.target.value);
    });

    // イベント設定
    document.getElementById("scaleSelect").addEventListener("change", (e) => {
        renderFretboard(e.target.value);
    });

    // 初期表示（Cメジャー）
    renderFretboard("C_MAJOR");