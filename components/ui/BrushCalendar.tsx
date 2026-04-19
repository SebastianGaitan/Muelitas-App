// components/ui/BrushCalendar.tsx
import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react-native';
import { BrushLog, todayKey } from '@/context/UserContext';
import { brushCalendarStyles as s } from '@/styles/ui/brushCalendarStyles';

const SESSION_COLORS = {
  morning: '#F39C12',
  afternoon: '#4A90E2',
  night: '#9B59B6',
};

const SESSION_KEYS = ['morning', 'afternoon', 'night'] as const;

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const WEEK_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

type Props = {
  brushLog: BrushLog;
  accentColor: string;
  mode: 'weekly' | 'monthly';
};

// Count how many sessions done on a given day
function sessionsCount(log: BrushLog, dateKey: string): number {
  const day = log[dateKey];
  if (!day) return 0;
  return [day.morning, day.afternoon, day.night].filter(Boolean).length;
}

function getDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// ── Weekly view ───────────────────────────────────────
function WeeklyCalendar({
  brushLog,
  accentColor,
}: {
  brushLog: BrushLog;
  accentColor: string;
}) {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const todayStr = todayKey();

  return (
    <View style={s.weekRow}>
      {days.map((day, i) => {
        const key = getDateKey(day);
        const count = sessionsCount(brushLog, key);
        const isToday = key === todayStr;
        const isFuture = day > today;

        const boxColor =
          count === 3
            ? accentColor
            : count > 0
              ? accentColor + '55'
              : isToday
                ? '#F0EDE4'
                : 'transparent';

        const borderColor = isToday
          ? accentColor
          : count > 0
            ? accentColor
            : '#E0E0E0';

        return (
          <View key={i} style={s.dayCol}>
            <Text style={s.dayLabel}>{WEEK_LABELS[i].slice(0, 1)}</Text>
            <View
              style={[s.dayBox, { backgroundColor: boxColor, borderColor }]}
            >
              <Text
                style={[
                  s.dayDate,
                  {
                    color:
                      count === 3
                        ? '#fff'
                        : count > 0 || isToday
                          ? accentColor
                          : '#CCCCCC',
                  },
                ]}
              >
                {day.getDate()}
              </Text>
              {!isFuture && count > 0 && (
                <View style={s.dotRow}>
                  {SESSION_KEYS.map((sess) => {
                    const done = brushLog[key]?.[sess];
                    return (
                      <View
                        key={sess}
                        style={[
                          s.dot,
                          {
                            backgroundColor: done
                              ? count === 3
                                ? '#fff'
                                : SESSION_COLORS[sess]
                              : 'rgba(0,0,0,0.1)',
                          },
                        ]}
                      />
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

// ── Monthly view ──────────────────────────────────────
function MonthlyCalendar({
  brushLog,
  accentColor,
}: {
  brushLog: BrushLog;
  accentColor: string;
}) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = todayKey();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => {
    const next = new Date(year, month + 1, 1);
    if (next <= today) setViewDate(next);
  };

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <View>
      {/* Month nav */}
      <View style={s.monthHeader}>
        <TouchableOpacity onPress={prevMonth} style={s.monthNavBtn}>
          <IconChevronLeft stroke="#2D2D2D" size={20} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={s.monthTitle}>
          {MONTH_NAMES[month]} {year}
        </Text>
        <TouchableOpacity onPress={nextMonth} style={s.monthNavBtn}>
          <IconChevronRight
            stroke={
              new Date(year, month + 1, 1) <= today ? '#2D2D2D' : '#E0E0E0'
            }
            size={20}
            strokeWidth={2.5}
          />
        </TouchableOpacity>
      </View>

      {/* Day labels */}
      <View style={{ flexDirection: 'row' }}>
        {DAY_LABELS.map((l, i) => (
          <Text key={i} style={s.monthDayLabel}>
            {l}
          </Text>
        ))}
      </View>

      {/* Grid */}
      <View style={s.monthGrid}>
        {cells.map((day, i) => {
          if (!day) return <View key={i} style={s.monthCell} />;

          const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const count = sessionsCount(brushLog, key);
          const isToday = key === todayStr;
          const isFuture = new Date(year, month, day) > today;

          const bgColor =
            count === 3
              ? accentColor
              : count > 0
                ? accentColor + '44'
                : 'transparent';

          return (
            <View
              key={i}
              style={[
                s.monthCell,
                {
                  backgroundColor: bgColor,
                  borderColor: isToday
                    ? accentColor
                    : count > 0
                      ? accentColor + '88'
                      : '#E0E0E0',
                  borderWidth: isToday ? 2 : 1.5,
                },
              ]}
            >
              <Text
                style={[
                  s.monthCellDate,
                  {
                    color:
                      count === 3
                        ? '#fff'
                        : count > 0
                          ? accentColor
                          : isFuture
                            ? '#DDDDDD'
                            : '#AAAAAA',
                  },
                ]}
              >
                {day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ── Main export ───────────────────────────────────────
export default function BrushCalendar({ brushLog, accentColor, mode }: Props) {
  return (
    <View style={s.wrapper}>
      {mode === 'weekly' ? (
        <WeeklyCalendar brushLog={brushLog} accentColor={accentColor} />
      ) : (
        <MonthlyCalendar brushLog={brushLog} accentColor={accentColor} />
      )}
    </View>
  );
}
