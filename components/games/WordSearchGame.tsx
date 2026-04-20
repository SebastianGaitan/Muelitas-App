// components/games/WordSearchGame.tsx
import { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StatusBar,
  ScrollView,
  PanResponder,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  IconX,
  IconCoin,
  IconTrophy,
  IconSearch,
} from '@tabler/icons-react-native';
import rawData from '../../assets/data/wordsearch.json';
import {
  wordSearchStyles as s,
  CELL_SIZE,
  GRID_COLS,
} from '@/styles/games/wordSearchStyles';

// ── Types ─────────────────────────────────────────────
type CellPos = [number, number];
type WordEntry = { word: string; clue: string; cells: CellPos[] };

// ── Data ──────────────────────────────────────────────
const GRID = (rawData as any).grid as string[][];
const ROWS = (rawData as any).rows as number;
const WORDS = (rawData as any).words as WordEntry[];
const WIN_COINS = 20;

// ── Helpers ───────────────────────────────────────────
function cellKey(r: number, c: number) {
  return `${r},${c}`;
}

function getCellsInLine(
  startR: number,
  startC: number,
  endR: number,
  endC: number,
): CellPos[] {
  const dr = endR - startR;
  const dc = endC - startC;
  const len = Math.max(Math.abs(dr), Math.abs(dc));
  if (len === 0) return [[startR, startC]];

  const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
  const stepC = dc === 0 ? 0 : dc / Math.abs(dc);

  // Only allow straight lines (H, V, diagonal)
  if (
    Math.abs(dr) !== 0 &&
    Math.abs(dc) !== 0 &&
    Math.abs(dr) !== Math.abs(dc)
  ) {
    return [[startR, startC]];
  }

  return Array.from(
    { length: len + 1 },
    (_, i) => [startR + i * stepR, startC + i * stepC] as CellPos,
  );
}

function cellsToWord(cells: CellPos[]): string {
  return cells.map(([r, c]) => GRID[r]?.[c] ?? '').join('');
}

function cellPosEqual(a: CellPos, b: CellPos) {
  return a[0] === b[0] && a[1] === b[1];
}

function arraysMatch(a: CellPos[], b: CellPos[]): boolean {
  if (a.length !== b.length) return false;
  const sortKey = (p: CellPos) => p[0] * 1000 + p[1];
  const sa = [...a].sort((x, y) => sortKey(x) - sortKey(y));
  const sb = [...b].sort((x, y) => sortKey(x) - sortKey(y));
  return sa.every((p, i) => cellPosEqual(p, sb[i]));
}

// ── Component ─────────────────────────────────────────
type Props = { accentColor: string; onWin: () => void };

export default function WordSearchGame({ accentColor, onWin }: Props) {
  const insets = useSafeAreaInsets();

  const [fullscreen, setFullscreen] = useState(false);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const [selecting, setSelecting] = useState<CellPos[]>([]);
  const [won, setWon] = useState(false);
  const [activeClue, setActiveClue] = useState<string>('');

  // Refs so PanResponder always reads latest state
  const foundWordsRef = useRef<Set<string>>(new Set());
  const foundCellsRef = useRef<Set<string>>(new Set());
  const selectingRef = useRef<CellPos[]>([]);
  const startCellRef = useRef<CellPos | null>(null);
  const onWinRef = useRef(onWin);
  onWinRef.current = onWin;

  const gridRef = useRef<View>(null);
  const gridOriginRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const posToCell = (px: number, py: number): CellPos | null => {
    const col = Math.floor((px - gridOriginRef.current.x) / CELL_SIZE);
    const row = Math.floor((py - gridOriginRef.current.y) / CELL_SIZE);
    if (row >= 0 && row < ROWS && col >= 0 && col < GRID_COLS)
      return [row, col];
    return null;
  };

  const tryFinishSelection = (cells: CellPos[]) => {
    if (cells.length < 2) {
      selectingRef.current = [];
      setSelecting([]);
      return;
    }
    const formed = cellsToWord(cells);
    const reverse = formed.split('').reverse().join('');

    const match = WORDS.find(
      (w) =>
        !foundWordsRef.current.has(w.word) &&
        (w.word === formed || w.word === reverse),
    );

    if (match) {
      const newFound = new Set(foundWordsRef.current);
      const newFoundCells = new Set(foundCellsRef.current);
      newFound.add(match.word);
      cells.forEach(([r, c]) => newFoundCells.add(cellKey(r, c)));

      foundWordsRef.current = newFound;
      foundCellsRef.current = newFoundCells;
      setFoundWords(new Set(newFound));
      setFoundCells(new Set(newFoundCells));
      setActiveClue(`${match.word}: ${match.clue}`);

      if (newFound.size === WORDS.length) {
        setTimeout(() => {
          setWon(true);
          onWinRef.current();
        }, 400);
      }
    } else {
      setActiveClue('');
    }
    selectingRef.current = [];
    setSelecting([]);
  };

  // ── Pan responder for drag selection ──────────────
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { pageX, pageY } = evt.nativeEvent;
        const cell = posToCell(pageX, pageY);
        if (cell) {
          startCellRef.current = cell;
          selectingRef.current = [cell];
          setSelecting([cell]);
        }
      },
      onPanResponderMove: (evt) => {
        const { pageX, pageY } = evt.nativeEvent;
        const cell = posToCell(pageX, pageY);
        if (!cell || !startCellRef.current) return;
        const line = getCellsInLine(
          startCellRef.current[0],
          startCellRef.current[1],
          cell[0],
          cell[1],
        );
        selectingRef.current = line;
        setSelecting([...line]);
      },
      onPanResponderRelease: () => {
        tryFinishSelection(selectingRef.current);
      },
    }),
  ).current;

  const handleExit = () => {
    setFullscreen(false);
    setFoundWords(new Set());
    setFoundCells(new Set());
    setSelecting([]);
    setWon(false);
    setActiveClue('');
    foundWordsRef.current = new Set();
    foundCellsRef.current = new Set();
    selectingRef.current = [];
    startCellRef.current = null;
  };

  const getCellState = (r: number, c: number) => {
    const key = cellKey(r, c);
    const isSelecting = selecting.some(([sr, sc]) => sr === r && sc === c);
    const isFound = foundCells.has(key);
    return { isSelecting, isFound };
  };

  return (
    <>
      {/* Preview button */}
      <TouchableOpacity
        style={[s.previewBtn, { backgroundColor: accentColor }]}
        onPress={() => setFullscreen(true)}
        activeOpacity={0.85}
      >
        <IconSearch stroke="#fff" size={18} strokeWidth={2.5} />
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
            <Text style={s.headerTitle}>🦷 Sopa de Letras</Text>
            <View style={s.scoreBox}>
              <IconSearch stroke="#F39C12" size={14} strokeWidth={2.5} />
              <Text style={s.scoreText}>
                {foundWords.size}/{WORDS.length}
              </Text>
            </View>
          </View>

          {/* Grid */}
          <View
            style={s.gridWrapper}
            ref={gridRef}
            onLayout={() => {
              gridRef.current?.measureInWindow((x, y) => {
                gridOriginRef.current = { x, y };
              });
            }}
            {...panResponder.panHandlers}
          >
            {GRID.map((row, r) => (
              <View key={r} style={s.gridRow}>
                {row.map((letter, c) => {
                  const { isSelecting, isFound } = getCellState(r, c);
                  return (
                    <View
                      key={c}
                      style={[
                        s.cell,
                        isFound && s.cellFound,
                        isSelecting && s.cellSelecting,
                      ]}
                    >
                      <Text
                        style={[s.cellLetter, isFound && s.cellLetterFound]}
                      >
                        {letter}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>

          {/* Clue bar */}
          <View style={s.clueBar}>
            <Text style={s.clueText} numberOfLines={1}>
              {activeClue || 'Arrastra para seleccionar'}
            </Text>
          </View>

          {/* Word list */}
          <ScrollView style={s.wordList} showsVerticalScrollIndicator={false}>
            <Text style={s.wordListTitle}>Encuentra estas palabras</Text>
            <View style={s.wordChips}>
              {WORDS.map((entry) => {
                const found = foundWords.has(entry.word);
                return (
                  <View
                    key={entry.word}
                    style={[s.wordChip, found && s.wordChipFound]}
                  >
                    <Text
                      style={[s.wordChipText, found && s.wordChipTextFound]}
                    >
                      {entry.word}
                    </Text>
                  </View>
                );
              })}
            </View>
            <View style={{ height: insets.bottom + 20 }} />
          </ScrollView>

          {/* Win overlay */}
          {won && (
            <View style={s.overlay}>
              <IconTrophy stroke="#F39C12" size={72} strokeWidth={1.5} />
              <Text style={s.overlayTitle}>¡Las encontraste todas!</Text>
              <Text style={s.overlaySubtitle}>¡Excelente vocabulario dental! 🦷</Text>
              <View style={s.overlayCoins}>
                <IconCoin stroke="#F39C12" size={24} strokeWidth={2} />
                <Text style={s.overlayCoinsText}>+{WIN_COINS} monedas</Text>
              </View>
              <TouchableOpacity
                style={[s.exitOverlayBtn, { backgroundColor: accentColor }]}
                onPress={handleExit}
                activeOpacity={0.85}
              >
                <Text style={s.exitOverlayBtnText}>Volver a Juegos</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
}
