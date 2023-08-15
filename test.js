function transposeNotes(inputNotes, numTones) {
  const sharpsNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const flatsNotes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

  const transposedNotes = inputNotes.map((note) => {
    const sharpsIndex = sharpsNotes.indexOf(note);
    const flatsIndex = flatsNotes.indexOf(note);

    if (sharpsIndex !== -1) {
      const transposedIndex = (sharpsIndex + Math.round(numTones * 2)) % 12;
      return sharpsNotes[transposedIndex];
    } else if (flatsIndex !== -1) {
      const transposedIndex = (flatsIndex + Math.round(numTones * 2)) % 12;
      return flatsNotes[transposedIndex];
    } else {
      return note;
    }
  });

  return transposedNotes;
}

const inputSong = [
  'E',
  'F#',
  'G',
  'C',
  'D',
  'E',
  'F#',
  'B',
  'Bb',
  'B',
  'C',
  'D',
  'E',
  'A',
  'A',
  'G',
  'F#',
  'B',
  'Eb',
  'F#',
  'G',
  'F#',
  'G',
  'G',
  'E',
  'F#',
  'F#',
  'G',
  'D',
  'C#',
  'C',
  'C',
  'D',
  'E',
  'F#',
  'E',
  'D',
  'C',
  'A',
  'Bb',
  'B',
  'B',
  'C',
  'B',
  'A',
  'G#',
  'B',
  'A',
  'A',
  'G',
  'F#',
  'F#',
  'G',
  'E',
  'E',
];

const numTonesToTranspose = -1.5;

const transposedSong = transposeNotes(inputSong, numTonesToTranspose);
console.log(transposedSong.join(' '));
