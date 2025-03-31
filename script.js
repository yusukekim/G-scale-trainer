// 弦の配列（6弦から1弦）
const strings = ["E", "A", "D", "G", "B", "e"];
const frets = 13; // 0フレット〜12フレットまで

const fretboard = document.getElementById("fretboard");

// 弦ごとに処理
strings.forEach((stringName, stringIndex) => {
  const stringRow = document.createElement("div");
  stringRow.classList.add("string");

  for (let fret = 0; fret < frets; fret++) {
    const fretDiv = document.createElement("div");
    fretDiv.classList.add("fret");
    fretDiv.dataset.string = stringName;
    fretDiv.dataset.fret = fret;

    fretDiv.innerText = ""; // 今は何も表示しない

    stringRow.appendChild(fretDiv);
  }

  fretboard.appendChild(stringRow);
});