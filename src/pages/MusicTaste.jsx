import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, ChevronLeft, ChevronRight, Sparkles, RefreshCw, Guitar } from 'lucide-react';
import CyberCard from '../components/ui/CyberCard';
import NeonButton from '../components/ui/NeonButton';
import confetti from 'canvas-confetti';

const allArtistTrios = [
  { trio: ['אריק איינשטיין', 'שלמה ארצי', 'יהודה פוליקר'], genres: ['רוק ישראלי קלאסי', 'פופ ישראלי', 'רוק ישראלי'] },
  { trio: ['בוב דילן', 'לאונרד כהן', 'ג\'וני מיטשל'], genres: ['פולק', 'שירה פיוטית', 'פולק'] },
  { trio: ['פינק פלויד', 'לד זפלין', 'דיפ פרפל'], genres: ['רוק פרוגרסיבי', 'הארד רוק', 'הארד רוק'] },
  { trio: ['נירוונה', 'פרל ג\'אם', 'אליס אין צ\'יינס'], genres: ['גראנג\'', 'רוק אלטרנטיבי', 'גראנג\''] },
  { trio: ['מטאליקה', 'מגאדת\'', 'סלייר'], genres: ['מטאל', 'תראש מטאל', 'תראש מטאל'] },
  { trio: ['ביונסה', 'ריהאנה', 'ארת\'ה פרנקלין'], genres: ['R&B', 'פופ מודרני', 'סול'] },
  { trio: ['דרייק', 'קנדריק למאר', 'ג\'יי זי'], genres: ['היפ הופ', 'ראפ', 'היפ הופ'] },
  { trio: ['קולדפליי', 'יו טו', 'רדיוהד'], genres: ['רוק אלטרנטיבי', 'אינדי רוק', 'ארט רוק'] },
  { trio: ['אד שירן', 'ג\'ון מאייר', 'ג\'ון לג\'נד'], genres: ['סינגר סונגרייטר', 'פופ', 'R&B'] },
  { trio: ['סטיבי וונדר', 'מרווין גיי', 'אל גרין'], genres: ['סול', 'Motown', 'סול'] },
  { trio: ['AC/DC', 'גאנס אנד רוזס', 'אירוסמית'], genres: ['הארד רוק', 'רוק קלאסי', 'הארד רוק'] },
  { trio: ['דיפטי מוד', 'דה קיור', 'ניו אורדר'], genres: ['ניו ווייב', 'פוסט-פאנק', 'ניו ווייב'] },
  { trio: ['בילי אייליש', 'לורד', 'לאנה דל ריי'], genres: ['אלקטרו-פופ', 'אלט-פופ', 'דרים פופ'] },
  { trio: ['טיילור סוויפט', 'אריאנה גרנדה', 'סלינה גומז'], genres: ['פופ', 'R&B', 'פופ'] },
  { trio: ['די ביטלס', 'די רולינג סטונס', 'די הו'], genres: ['רוק קלאסי', 'בלוז רוק', 'רוק'] },
  { trio: ['בוב מארלי', 'פיטר טוש', 'ג\'ימי קליף'], genres: ['רגאיי', 'רגאיי', 'רגאיי'] },
  { trio: ['מייקל ג\'קסון', 'פרינס', 'ג\'ורג\' מייקל'], genres: ['פופ', 'פאנק', 'פופ'] },
  { trio: ['מוזס', 'רדיוהד', 'בלאר'], genres: ['רוק אלטרנטיבי', 'ארט רוק', 'ברית-פופ'] },
  { trio: ['איימי ווינהאוס', 'אדל', 'סם סמית\''], genres: ['סול', 'פופ סול', 'פופ סול'] },
  { trio: ['דייוויד בואי', 'אלביס פרסלי', 'רוי אורביסון'], genres: ['גלאם רוק', 'רוקבילי', 'רוק'] },
  { trio: ['אברהם טל', 'עומר אדם', 'סטטיק ובן אל'], genres: ['מזרחית', 'מזרחית מודרנית', 'פופ'] },
  { trio: ['עידן רייכל', 'אסף אמדורסקי', 'אביב גפן'], genres: ['וורלד מיוזיק', 'רוק', 'רוק ישראלי'] },
  { trio: ['דודו טסה', 'משה פרץ', 'אייל גולן'], genres: ['מזרחית', 'מזרחית', 'מזרחית'] },
  { trio: ['ברי סחרוף', 'יהודה פוליקר', 'מוקי'], genres: ['רוק ישראלי', 'רוק ישראלי', 'רוק ישראלי'] },
  { trio: ['אהוד בנאי', 'יוסי בנאי', 'מאיר אריאל'], genres: ['שיר עברי', 'תיאטרון שירה', 'שיר עברי'] },
  { trio: ['נועה קירל', 'עדן בן זקן', 'עדן חסון'], genres: ['פופ ישראלי', 'פופ ישראלי', 'פופ ישראלי'] },
  { trio: ['בילי הולידיי', 'אלה פיצג\'רלד', 'סרה ווהן'], genres: ['ג\'אז', 'ג\'אז', 'ג\'אז'] },
  { trio: ['לואי ארמסטרונג', 'דיוק אלינגטון', 'מיילס דייויס'], genres: ['ג\'אז', 'ג\'אז', 'ג\'אז'] },
  { trio: ['ג\'וני קאש', 'וילי נלסון', 'מרל האגארד'], genres: ['קאנטרי', 'אאוטלו קאנטרי', 'קאנטרי'] },
  { trio: ['דולי פרטון', 'שאניה טוויין', 'קארי אנדרווד'], genres: ['קאנטרי', 'קאנטרי פופ', 'קאנטרי'] },
  { trio: ['סנופ דוג', 'דר. דרה', '2Pac'], genres: ['וסט קואסט ראפ', 'היפ הופ', 'ראפ'] },
  { trio: ['אמינם', 'טופאק', '50 סנט'], genres: ['ראפ', 'ראפ', 'היפ הופ'] },
  { trio: ['איירון מיידן', 'ג\'ודאס פריסט', 'בלק סבאת\''], genres: ['הבי מטאל', 'הבי מטאל', 'הבי מטאל'] },
  { trio: ['סליפנוט', 'קורן', 'לימפ ביזקיט'], genres: ['נו-מטאל', 'נו-מטאל', 'נו-מטאל'] },
  { trio: ['דפט פאנק', 'די קמיכל ברדרס', 'פטבוי סלים'], genres: ['אלקטרו', 'ביג ביט', 'אלקטרוניקה'] },
  { trio: ['ארקטיק מאנקיס', 'די סטרוקס', 'די קילרס'], genres: ['אינדי רוק', 'גראז\' רוק', 'אינדי רוק'] },
];

const songRecommendations = {
  'רוק ישראלי קלאסי': ['אבא - אריק איינשטיין', 'סוף העולם - שלמה ארצי', 'רכבת הלילה לקהיר - יהודה פוליקר'],
  'רוק ישראלי': ['רוקדים עם עצמנו - ברי סחרוף', 'להיות או לא להיות - יהודה פוליקר', 'שיר לשלום - מתי כספי'],
  'פופ ישראלי': ['מיליון דולר - סטטיק ובן אל', 'גן עדן - עומר אדם', 'על איזה קו - נועה קירל'],
  'מזרחית': ['ניסים - אייל גולן', 'מזל טוב - משה פרץ', 'שלא תלכי - אברהם טל'],
  'רוק קלאסי': ['Stairway to Heaven - Led Zeppelin', 'Hotel California - Eagles', 'Bohemian Rhapsody - Queen'],
  'הארד רוק': ['Smoke on the Water - Deep Purple', 'Back in Black - AC/DC', 'Sweet Child O Mine - Guns N Roses'],
  'רוק פרוגרסיבי': ['Comfortably Numb - Pink Floyd', 'Close to the Edge - Yes', '21st Century Schizoid Man - King Crimson'],
  'מטאל': ['Master of Puppets - Metallica', 'Iron Man - Black Sabbath', 'Holy Diver - Dio'],
  'תראש מטאל': ['Raining Blood - Slayer', 'Peace Sells - Megadeth', 'Angel of Death - Slayer'],
  'גראנג\'': ['Smells Like Teen Spirit - Nirvana', 'Black - Pearl Jam', 'Man in the Box - Alice in Chains'],
  'פולק': ['Blowin in the Wind - Bob Dylan', 'The Sound of Silence - Simon & Garfunkel', 'Big Yellow Taxi - Joni Mitchell'],
  'פופ': ['Thriller - Michael Jackson', 'Like a Prayer - Madonna', 'Billie Jean - Michael Jackson'],
  'R&B': ['Superstition - Stevie Wonder', 'Respect - Aretha Franklin', 'Lets Get It On - Marvin Gaye'],
  'סול': ['A Change Is Gonna Come - Sam Cooke', 'Lets Stay Together - Al Green', 'I Say a Little Prayer - Aretha Franklin'],
  'היפ הופ': ['Juicy - Notorious B.I.G', 'Nuthin but a G Thang - Dr. Dre', 'Lose Yourself - Eminem'],
  'ראפ': ['California Love - 2Pac', 'In Da Club - 50 Cent', 'Humble - Kendrick Lamar'],
  'ג\'אז': ['Take Five - Dave Brubeck', 'So What - Miles Davis', 'Round Midnight - Thelonious Monk'],
  'קאנטרי': ['Ring of Fire - Johnny Cash', 'Jolene - Dolly Parton', 'Always on My Mind - Willie Nelson'],
  'רגאיי': ['No Woman No Cry - Bob Marley', 'Redemption Song - Bob Marley', 'The Harder They Come - Jimmy Cliff'],
  'אלקטרוניקה': ['One More Time - Daft Punk', 'Windowlicker - Aphex Twin', 'Firestarter - The Prodigy'],
  'אינדי רוק': ['Mr. Brightside - The Killers', 'Do I Wanna Know? - Arctic Monkeys', 'Last Nite - The Strokes'],
};

export default function MusicTaste() {
  const [shuffledTrios, setShuffledTrios] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selections, setSelections] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [skippedCount, setSkippedCount] = useState(0);
  const [justReached15, setJustReached15] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    shuffleTrios();
  }, []);

  useEffect(() => {
    if (selections.length === 15 && !justReached15) {
      setJustReached15(true);
      triggerConfetti();
      setTimeout(() => setShowButton(true), 800);
    }
  }, [selections.length]);

  const shuffleTrios = () => {
    const shuffled = [...allArtistTrios]
      .sort(() => Math.random() - 0.5)
      .map(trio => ({
        ...trio,
        trio: [...trio.trio].sort(() => Math.random() - 0.5)
      }));
    setShuffledTrios(shuffled);
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#00F0FF', '#BD00FF', '#FF00FF', '#00FFFF', '#FFD700']
      }));
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#00F0FF', '#BD00FF', '#FF00FF', '#00FFFF', '#FFD700']
      }));
    }, 250);
  };

  const handleSelect = (artist) => {
    const newSelections = [...selections, { 
      trio: shuffledTrios[currentIndex].trio, 
      selected: artist,
      genres: shuffledTrios[currentIndex].genres 
    }];
    setSelections(newSelections);

    if (currentIndex < shuffledTrios.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      shuffleTrios();
      setCurrentIndex(0);
    }
  };

  const handleSkip = () => {
    setSkippedCount(skippedCount + 1);
    if (currentIndex < shuffledTrios.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      shuffleTrios();
      setCurrentIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      const lastSelection = selections[selections.length - 1];
      if (lastSelection && JSON.stringify(lastSelection.trio.sort()) === JSON.stringify(shuffledTrios[currentIndex - 1]?.trio.sort())) {
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
    setJustReached15(false);
    setShowButton(false);
    shuffleTrios();
  };

  const handleViewResults = () => {
    setShowResults(true);
  };

  const handleContinue = () => {
    setShowResults(false);
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
      .slice(0, 5)
      .map(([genre, count]) => ({ genre, count }));
  };

  const getRecommendedSongs = () => {
    const topGenres = getTopGenres();
    const recommendations = [];
    
    topGenres.slice(0, 3).forEach(({ genre }) => {
      const songs = songRecommendations[genre];
      if (songs) {
        recommendations.push(...songs);
      }
    });

    return [...new Set(recommendations)].slice(0, 6);
  };

  const hasEnoughData = selections.length >= 15;
  const progressPercentage = Math.min((selections.length / 15) * 100, 100);

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
              כדי לקבל תוצאות מדויקות, אנחנו צריכים לפחות 15 בחירות.
            </p>
            <p className="text-lg mb-6 text-slate-400">
              עניתם עד כה על {selections.length} שאלות. המשיכו לענות!
            </p>
            <div className="flex gap-4 justify-center">
              <NeonButton onClick={handleContinue} size="lg">
                המשך לענות
              </NeonButton>
              <NeonButton onClick={handleReset} variant="secondary" size="lg">
                התחל מחדש
              </NeonButton>
            </div>
          </CyberCard>
        </div>
      );
    }

    const topGenres = getTopGenres();
    const recommendedSongs = getRecommendedSongs();
    
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
              {topGenres.map((item, idx) => (
                <motion.div
                  key={item.genre}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F0FF] to-[#BD00FF] flex items-center justify-center text-2xl font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1 bg-[#0F172A] rounded-xl p-4 border border-[#334155]">
                    <p className="text-xl font-bold">{item.genre}</p>
                    <p className="text-sm text-slate-400">{item.count} בחירות</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {recommendedSongs.length > 0 && (
              <div className="border-t border-[#334155] pt-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Guitar className="w-6 h-6 text-[#00F0FF]" />
                  <h3 className="text-xl font-bold neon-text">שירים וריפים מומלצים ללימוד:</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recommendedSongs.map((song, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      className="bg-[#0F172A] rounded-lg p-4 border border-[#334155] hover:border-[#00F0FF] transition-all"
                    >
                      <p className="text-sm text-slate-300">{song}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-[#334155] pt-6 mb-6">
              <h3 className="text-lg font-bold mb-4">הבחירות שלך:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
                {selections.map((s, idx) => (
                  <div key={idx} className="bg-[#0F172A] rounded-lg p-3 text-sm border border-[#334155]">
                    <span className="text-[#00F0FF] font-bold">{s.selected}</span>
                    <span className="text-slate-500"> vs </span>
                    <span className="text-slate-400">{s.trio.filter(p => p !== s.selected).join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <NeonButton onClick={handleContinue} size="lg">
                <Music className="w-5 h-5" />
                המשך לענות
              </NeonButton>
              <NeonButton onClick={handleReset} variant="secondary" size="lg">
                <RefreshCw className="w-5 h-5" />
                התחל מחדש
              </NeonButton>
            </div>
          </CyberCard>
        </motion.div>
      </div>
    );
  }

  if (shuffledTrios.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentTrio = shuffledTrios[currentIndex];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F0FF] to-[#BD00FF] flex items-center justify-center">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">מצא את הטעם המוזיקלי שלך</h1>
            <p className="text-slate-400">בחר את האמן המועדף עליך מכל שלושה</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm">תשובות: {selections.length}</span>
            {selections.length >= 15 && showButton && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <NeonButton variant="secondary" size="sm" onClick={handleViewResults}>
                  <Sparkles size={16} />
                  ראה תוצאות
                </NeonButton>
              </motion.div>
            )}
          </div>
          {currentIndex > 0 && (
            <NeonButton variant="ghost" size="sm" onClick={handlePrevious}>
              <ChevronRight size={16} />
              חזור
            </NeonButton>
          )}
        </div>

        <div className="relative w-full bg-[#1E293B] h-3 rounded-full overflow-hidden mb-2">
          <motion.div
            animate={{ 
              width: `${progressPercentage}%`,
              boxShadow: progressPercentage >= 100 
                ? '0 0 20px rgba(0, 240, 255, 0.8), 0 0 40px rgba(189, 0, 255, 0.6)' 
                : '0 0 10px rgba(0, 240, 255, 0.3)'
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-[#00F0FF] via-[#BD00FF] to-[#00F0FF] relative"
            style={{
              backgroundSize: progressPercentage >= 100 ? '200% 100%' : '100% 100%'
            }}
          >
            {progressPercentage >= 100 && (
              <motion.div
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            )}
          </motion.div>
          {progressPercentage >= 100 && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-[#00F0FF]/20 to-[#BD00FF]/20"
            />
          )}
        </div>
        <p className="text-center text-xs text-slate-500 mb-6">
          {selections.length < 15 
            ? `עוד ${15 - selections.length} תשובות להשלמת המינימום` 
            : 'כל הכבוד! אפשר להמשיך או לצפות בתוצאות'}
        </p>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentTrio.trio.map((artist, idx) => (
                <motion.button
                  key={artist}
                  initial={{ opacity: 0, y: 50, rotateY: -90 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    rotateY: 0,
                  }}
                  transition={{ 
                    delay: idx * 0.15,
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                  whileHover={{ 
                    scale: 1.08,
                    rotateY: 5,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelect(artist)}
                  className="relative group perspective-1000"
                >
                  <motion.div 
                    className="bg-[#0F172A] border-2 border-[#334155] rounded-2xl p-6 hover:border-[#00F0FF] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]"
                    whileHover={{
                      boxShadow: '0 0 40px rgba(0, 240, 255, 0.5), 0 0 60px rgba(189, 0, 255, 0.3)'
                    }}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <motion.div 
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#BD00FF] flex items-center justify-center text-3xl font-bold"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        {artist.charAt(0)}
                      </motion.div>
                      <h3 className="text-xl font-bold text-center">{artist}</h3>
                      <p className="text-xs text-slate-400 text-center">{currentTrio.genres[idx]}</p>
                    </div>
                  </motion.div>
                </motion.button>
              ))}
            </div>

            <div className="mt-6 text-center">
              <NeonButton variant="ghost" onClick={handleSkip}>
                לא מכיר / דלג
              </NeonButton>
              <p className="text-xs text-slate-500 mt-3 max-w-md mx-auto">
                💡 ככל שתענו על יותר שאלות, התוצאות יהיו מדויקות יותר ונוכל להמליץ לכם על שירים וריפים מדויקים יותר שיתאימו לטעם שלכם!
              </p>
            </div>
          </CyberCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}