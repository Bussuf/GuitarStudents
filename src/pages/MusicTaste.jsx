import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import CyberCard from '../components/ui/CyberCard';
import NeonButton from '../components/ui/NeonButton';

const artistPairs = [
  { pair: ['אריק איינשטיין', 'שלמה ארצי'], genres: ['רוק ישראלי קלאסי', 'פופ ישראלי'] },
  { pair: ['בוב דילן', 'לאונרד כהן'], genres: ['פולק', 'שירה פיוטית'] },
  { pair: ['פינק פלויד', 'לד זפלין'], genres: ['רוק פרוגרסיבי', 'הארד רוק'] },
  { pair: ['נירוונה', 'פרל ג\'אם'], genres: ['גראנג\'', 'רוק אלטרנטיבי'] },
  { pair: ['מטאליקה', 'מגאדת\''], genres: ['מטאל', 'תראש מטאל'] },
  { pair: ['ביונסה', 'ריהאנה'], genres: ['R&B', 'פופ מודרני'] },
  { pair: ['דרייק', 'קנדריק למאר'], genres: ['היפ הופ', 'ראפ'] },
  { pair: ['קולדפליי', 'יו טו'], genres: ['רוק אלטרנטיבי', 'אינדי רוק'] },
  { pair: ['אד שירן', 'ג\'ון מאייר'], genres: ['סינגר סונגרייטר', 'פופ'] },
  { pair: ['סטיבי וונדר', 'מרווין גיי'], genres: ['סול', 'Motown'] }
];

export default function MusicTaste() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selections, setSelections] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [skippedCount, setSkippedCount] = useState(0);

  const handleSelect = (artist) => {
    const newSelections = [...selections, { 
      pair: artistPairs[currentIndex].pair, 
      selected: artist,
      genres: artistPairs[currentIndex].genres 
    }];
    setSelections(newSelections);

    if (currentIndex < artistPairs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleSkip = () => {
    setSkippedCount(skippedCount + 1);
    if (currentIndex < artistPairs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      const prevSelection = selections[selections.length - 1];
      if (prevSelection) {
        setSelections(selections.slice(0, -1));
      } else {
        setSkippedCount(Math.max(0, skippedCount - 1));
      }
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelections([]);
    setShowResults(false);
    setSkippedCount(0);
  };

  const getTopGenres = () => {
    const genreCounts = {};
    selections.forEach(s => {
      s.genres.forEach(g => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
    });
    return Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genre]) => genre);
  };

  const hasEnoughData = selections.length >= 3;

  if (showResults) {
    if (!hasEnoughData) {
      return (
        <div className="space-y-6 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F0FF] to-[#BD00FF] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">צריך עוד קצת מידע</h1>
                <p className="text-slate-400">ענית רק על {selections.length} שאלות</p>
              </div>
            </div>
          </motion.div>

          <CyberCard className="p-8 text-center">
            <p className="text-xl mb-6 text-slate-300">
              כדי לקבל תוצאות מדויקות, אנחנו צריכים לפחות 3 בחירות.
            </p>
            <div className="flex gap-4 justify-center">
              <NeonButton onClick={handleReset} size="lg">
                התחל מחדש
              </NeonButton>
            </div>
          </CyberCard>
        </div>
      );
    }

    const topGenres = getTopGenres();
    
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F0FF] to-[#BD00FF] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">הטעם המוזיקלי שלך</h1>
              <p className="text-slate-400">תוצאות מבוססות על {selections.length} בחירות</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <CyberCard className="p-8">
            <h2 className="text-2xl font-bold mb-6 neon-text">הז'אנרים האהובים עליך:</h2>
            <div className="space-y-4 mb-8">
              {topGenres.map((genre, idx) => (
                <motion.div
                  key={genre}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F0FF] to-[#BD00FF] flex items-center justify-center text-2xl font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1 bg-[#0F172A] rounded-xl p-4 border border-[#334155]">
                    <p className="text-xl font-bold">{genre}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-[#334155] pt-6">
              <h3 className="text-lg font-bold mb-4">הבחירות שלך:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selections.map((s, idx) => (
                  <div key={idx} className="bg-[#0F172A] rounded-lg p-3 text-sm border border-[#334155]">
                    <span className="text-[#00F0FF] font-bold">{s.selected}</span>
                    <span className="text-slate-500"> vs </span>
                    <span className="text-slate-400">{s.pair.find(p => p !== s.selected)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <NeonButton onClick={handleReset} size="lg">
                התחל מחדש
              </NeonButton>
            </div>
          </CyberCard>
        </motion.div>
      </div>
    );
  }

  const currentPair = artistPairs[currentIndex];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F0FF] to-[#BD00FF] flex items-center justify-center">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">מצא את הטעם המוזיקלי שלך</h1>
            <p className="text-slate-400">בחר את האמן המועדף עליך בכל זוג</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">שאלה {currentIndex + 1} מתוך {artistPairs.length}</span>
          </div>
          {currentIndex > 0 && (
            <NeonButton variant="ghost" size="sm" onClick={handlePrevious}>
              <ChevronRight size={16} />
              חזור
            </NeonButton>
          )}
        </div>

        <div className="w-full bg-[#1E293B] h-2 rounded-full overflow-hidden mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / artistPairs.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-[#00F0FF] to-[#BD00FF]"
          />
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <CyberCard className="p-8">
            <h2 className="text-2xl font-bold text-center mb-8 neon-text">
              מי מהם מדבר אליך יותר?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentPair.pair.map((artist, idx) => (
                <motion.button
                  key={artist}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelect(artist)}
                  className="relative group"
                >
                  <div className="bg-[#0F172A] border-2 border-[#334155] rounded-2xl p-8 hover:border-[#00F0FF] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#BD00FF] flex items-center justify-center text-4xl font-bold">
                        {artist.charAt(0)}
                      </div>
                      <h3 className="text-2xl font-bold text-center">{artist}</h3>
                      <p className="text-sm text-slate-400 text-center">{currentPair.genres[idx]}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <NeonButton variant="ghost" onClick={handleSkip}>
                לא מכיר / דלג
              </NeonButton>
            </div>
          </CyberCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}