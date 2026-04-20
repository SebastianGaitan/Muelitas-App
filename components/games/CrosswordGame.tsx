// components/games/CrosswordGame.tsx
import { useState, useRef, useCallback, ReactElement } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  IconX,
  IconCoin,
  IconCheck,
  IconTrophy,
  IconLetterCase,
} from '@tabler/icons-react-native';
import rawData from '../../assets/data/crossword.json';
import {
  crosswordStyles as s,
  CELL_SIZE,
} from '@/styles/games/crosswordStyles';

// ── Types ─────────────────────────────────────────────
type WordDef = {
  id: number;
  number: number;
  direction: 'across' | 'down';
  row: number;
  col: number;
  answer: string;
  clue: string;
};
type CellPos = { row: number; col: number };

// ── Data ──────────────────────────────────────────────
const ROWS = (rawData as any).rows as number;
const COLS = (rawData as any).cols as number;
const WORDS = (rawData as any).words as WordDef[];
const WIN_COINS = 15;

// ── Grid helpers ──────────────────────────────────────
function getWordCells(word: WordDef): CellPos[] {
  return Array.from({ length: word.answer.length }, (_, i) => ({
    row: word.direction === 'across' ? word.row : word.row + i,
    col: word.direction === 'across' ? word.col + i : word.col,
  }));
}

// Pre-compute active cells and numbers
const ACTIVE: boolean[][] = Array.from({ length: ROWS }, () =>
  Array(COLS).fill(false),
);
const NUMBERS: (number | null)[][] = Array.from({ length: ROWS }, () =>
  Array(COLS).fill(null),
);

WORDS.forEach((word) => {
  getWordCells(word).forEach(({ row, col }) => {
    ACTIVE[row][col] = true;
  });
  if (!NUMBERS[word.row][word.col]) NUMBERS[word.row][word.col] = word.number;
});

// For each cell, which words contain it?
function wordsAtCell(row: number, col: number): WordDef[] {
  return WORDS.filter((w) =>
    getWordCells(w).some((c) => c.row === row && c.col === col),
  );
}

function emptyGrid(): string[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(''));
}

// ── Component ─────────────────────────────────────────
type Props = { accentColor: string; onWin: () => void };

export default function CrosswordGame({ accentColor, onWin }: Props) {
  const insets = useSafeAreaInsets();

  const [fullscreen, setFullscreen] = useState(false);
  const [letters, setLetters] = useState<string[][]>(emptyGrid);
  const [activeWordId, setActiveWordId] = useState<number | null>(null);
  const [activeCell, setActiveCell] = useState<CellPos | null>(null);
  const [checked, setChecked] = useState(false);
  const [won, setWon] = useState(false);

  const inputRef = useRef<TextInput>(null);

  const activeWord = WORDS.find((w) => w.id === activeWordId) ?? null;
  const activeWordCells = activeWord ? getWordCells(activeWord) : [];

  const isCellInActiveWord = (row: number, col: number) =>
    activeWordCells.some((c) => c.row === row && c.col === col);

  const isActiveCell = (row: number, col: number) =>
    activeCell?.row === row && activeCell?.col === col;

  // ── Select cell ────────────────────────────────────
  const handleCellPress = useCallback(
    (row: number, col: number) => {
      if (!ACTIVE[row][col]) return;

      const candidates = wordsAtCell(row, col);
      if (candidates.length === 0) return;

      // If already selected a word that contains this cell, toggle to next word
      let next: WordDef;
      const currentIdx = candidates.findIndex((w) => w.id === activeWordId);
      if (currentIdx >= 0 && isActiveCell(row, col)) {
        next = candidates[(currentIdx + 1) % candidates.length];
      } else if (
        activeWordId &&
        candidates.some((w) => w.id === activeWordId)
      ) {
        // Tap on cell in current word → move cursor there
        next = candidates.find((w) => w.id === activeWordId)!;
      } else {
        next = candidates[0];
      }

      setActiveWordId(next.id);
      setActiveCell({ row, col });
      setChecked(false);
      inputRef.current?.focus();
    },
    [activeWordId, activeCell],
  );

  // ── Advance cursor to next empty cell in word ──────
  const advanceCursor = useCallback(
    (word: WordDef, currentRow: number, currentCol: number) => {
      const cells = getWordCells(word);
      const idx = cells.findIndex(
        (c) => c.row === currentRow && c.col === currentCol,
      );
      if (idx < cells.length - 1) {
        setActiveCell(cells[idx + 1]);
      }
    },
    [],
  );

  const retreatCursor = useCallback(
    (word: WordDef, currentRow: number, currentCol: number) => {
      const cells = getWordCells(word);
      const idx = cells.findIndex(
        (c) => c.row === currentRow && c.col === currentCol,
      );
      if (idx > 0) {
        setActiveCell(cells[idx - 1]);
      }
    },
    [],
  );

  // ── Key input ──────────────────────────────────────
  const handleKey = useCallback(
    (key: string) => {
      if (!activeCell || !activeWord) return;
      const { row, col } = activeCell;

      if (key === 'Backspace') {
        setLetters((prev) => {
          const next = prev.map((r) => [...r]);
          if (next[row][col] !== '') {
            next[row][col] = '';
          } else {
            retreatCursor(activeWord, row, col);
            const cells = getWordCells(activeWord);
            const idx = cells.findIndex((c) => c.row === row && c.col === col);
            if (idx > 0) next[cells[idx - 1].row][cells[idx - 1].col] = '';
          }
          return next;
        });
      } else if (/^[a-zA-Z]$/.test(key)) {
        const letter = key.toUpperCase();
        setLetters((prev) => {
          const next = prev.map((r) => [...r]);
          next[row][col] = letter;
          return next;
        });
        advanceCursor(activeWord, row, col);
      }
    },
    [activeCell, activeWord, advanceCursor, retreatCursor],
  );

  // ── Check answers ──────────────────────────────────
  const handleCheck = useCallback(() => {
    setChecked(true);
    const allCorrect = WORDS.every((word) =>
      getWordCells(word).every(
        ({ row, col }, i) => letters[row][col] === word.answer[i],
      ),
    );
    if (allCorrect) {
      setWon(true);
      onWin();
    }
  }, [letters, onWin]);

  const handleExit = () => {
    setFullscreen(false);
    setLetters(emptyGrid());
    setActiveWordId(null);
    setActiveCell(null);
    setChecked(false);
    setWon(false);
  };

  // ── Cell color ─────────────────────────────────────
  const getCellStyle = (row: number, col: number) => {
    if (!ACTIVE[row][col]) return s.cellBlack;
    if (isActiveCell(row, col)) return s.cellActive;
    if (isCellInActiveWord(row, col)) return s.cellSelected;
    if (checked && letters[row][col]) {
      const word = WORDS.find((w) =>
        getWordCells(w).some(
          (c, i) =>
            c.row === row && c.col === col && w.answer[i] === letters[row][col],
        ),
      );
      if (checked) {
        // find if this cell is correct
        const correct = WORDS.some((w) =>
          getWordCells(w).some(
            (c, i) =>
              c.row === row &&
              c.col === col &&
              w.answer[i] === letters[row][col],
          ),
        );
        return correct ? s.cellCorrect : s.cellWrong;
      }
    }
    return undefined;
  };

  const acrossClues = WORDS.filter((w) => w.direction === 'across');
  const downClues = WORDS.filter((w) => w.direction === 'down');

  // ── Render ─────────────────────────────────────────
  return (
    <>
      {/* Preview button */}
      <TouchableOpacity
        style={[s.previewBtn, { backgroundColor: accentColor }]}
        onPress={() => setFullscreen(true)}
        activeOpacity={0.85}
      >
        <IconLetterCase stroke="#fff" size={18} strokeWidth={2} />
        <Text style={s.previewBtnText}>¡Jugar ahora!</Text>
      </TouchableOpacity>

      {/* Fullscreen modal */}
      <Modal
        visible={fullscreen}
        animationType="slide"
        statusBarTranslucent
        onRequestClose={handleExit}
      >
        <StatusBar hidden />
        <View style={s.fullscreen}>
          {/* Header */}
          <View style={[s.header, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity
              style={s.exitBtn}
              onPress={handleExit}
              activeOpacity={0.8}
            >
              <IconX stroke="#555" size={18} strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={s.headerTitle}>🦷 Crucigrama Dental</Text>
            <TouchableOpacity
              style={[s.checkBtn, { backgroundColor: accentColor }]}
              onPress={handleCheck}
              activeOpacity={0.85}
            >
              <IconCheck stroke="#fff" size={14} strokeWidth={2.5} />
              <Text style={s.checkBtnText}>Revisar</Text>
            </TouchableOpacity>
          </View>

          {/* Grid */}
          <View style={s.gridContainer}>
            {Array.from({ length: ROWS }, (_, row) => (
              <View key={row} style={s.gridRow}>
                {Array.from({ length: COLS }, (_, col) => {
                  const active = ACTIVE[row][col];
                  const number = NUMBERS[row][col];
                  const letter = letters[row][col];
                  const cellStyle = getCellStyle(row, col);
                  const isActive = isActiveCell(row, col);

                  return (
                    <TouchableOpacity
                      key={col}
                      style={[s.cell, cellStyle]}
                      onPress={() => handleCellPress(row, col)}
                      activeOpacity={active ? 0.7 : 1}
                      disabled={!active}
                    >
                      {number !== null && (
                        <Text style={s.cellNumber}>{number}</Text>
                      )}
                      {active && (
                        <Text
                          style={[s.cellLetter, isActive && s.cellLetterActive]}
                        >
                          {letter}
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          {/* Hidden input */}
          <TextInput
            ref={inputRef}
            style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={1}
            value=""
            onKeyPress={({ nativeEvent }) => handleKey(nativeEvent.key)}
          />

          {/* Clues */}
          <ScrollView style={s.cluesScroll} keyboardShouldPersistTaps="always">
            <View style={s.cluesSection}>
              <Text style={s.cluesSectionTitle}>Horizontal</Text>
              {acrossClues.map((word) => (
                <TouchableOpacity
                  key={word.id}
                  style={[
                    s.clueRow,
                    activeWordId === word.id && s.clueRowActive,
                  ]}
                  onPress={() => {
                    setActiveWordId(word.id);
                    setActiveCell({ row: word.row, col: word.col });
                    inputRef.current?.focus();
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={s.clueNumber}>{word.number}</Text>
                  <Text
                    style={[
                      s.clueText,
                      activeWordId === word.id && s.clueTextActive,
                    ]}
                  >
                    {word.clue}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={s.cluesSection}>
              <Text style={s.cluesSectionTitle}>Vertical</Text>
              {downClues.map((word) => (
                <TouchableOpacity
                  key={word.id}
                  style={[
                    s.clueRow,
                    activeWordId === word.id && s.clueRowActive,
                  ]}
                  onPress={() => {
                    setActiveWordId(word.id);
                    setActiveCell({ row: word.row, col: word.col });
                    inputRef.current?.focus();
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={s.clueNumber}>{word.number}</Text>
                  <Text
                    style={[
                      s.clueText,
                      activeWordId === word.id && s.clueTextActive,
                    ]}
                  >
                    {word.clue}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ height: insets.bottom + 20 }} />
          </ScrollView>

          {/* Win overlay */}
          {won && (
            <View style={s.overlay}>
              <IconTrophy stroke="#F39C12" size={72} strokeWidth={1.5} />
              <Text style={s.overlayTitle}>¡Lo resolviste!</Text>
              <Text style={s.overlaySubtitle}>¡Excelente conocimiento dental!</Text>
              <View style={s.overlayCoins}>
                <IconCoin stroke="#F39C12" size={24} strokeWidth={2} />
                <Text style={s.overlayCoinsText}>+{WIN_COINS} monedas</Text>
              </View>
              <TouchableOpacity
                style={[s.playAgainBtn, { backgroundColor: accentColor }]}
                onPress={handleExit}
                activeOpacity={0.85}
              >
                <Text style={s.playAgainBtnText}>Volver a Juegos</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
}
