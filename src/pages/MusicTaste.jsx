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
  'רוק ישראלי קלאסי': [
    'אבא - אריק איינשטיין (ריף פתיחה קלאסי)', 
    'סוף העולם - שלמה ארצי (אקורדים פשוטים)',
    'רכבת הלילה לקהיר - יהודה פוליקר (ריף אייקוני)',
    'יושב על הגדר - אריק איינשטיין (אקורדים בסיסיים)',
    'אני ואתה - אריק איינשטיין (שיר פופולרי)',
    'חום יולי אוגוסט - שלמה ארצי (ריף מזוהה)'
  ],
  'רוק ישראלי': [
    'רוקדים עם עצמנו - ברי סחרוף (ריף אייקוני)', 
    'להיות או לא להיות - יהודה פוליקר (אקורדים פשוטים)',
    'פצצה - ברי סחרוף (ריף פאואר)',
    'קח לי הביתה - מוקי (מנגינה קלה)',
    'הרכבת - בנימין חיים (ריף מזוהה)',
    'סוף המסיבה - טיפקס (אקורדים בסיסיים)'
  ],
  'פופ ישראלי': [
    'מיליון דולר - סטטיק ובן אל (אקורדים פופולריים)', 
    'גן עדן - עומר אדם (ריף קליט)',
    'על איזה קו - נועה קירל (מנגינה פשוטה)',
    'בואי - סטטיק ובן אל (אקורדים קלים)',
    'מה איתך - עדן חסון (ריף מזוהה)',
    'לא מזמן - עדן בן זקן (מנגינה פופולרית)'
  ],
  'מזרחית': [
    'ניסים - אייל גולן (ריף קליט)', 
    'מזל טוב - משה פרץ (אקורדים פשוטים)',
    'שלא תלכי - אברהם טל (מנגינה מזוהה)',
    'כמו פרחים - משה פרץ (ריף אייקוני)',
    'אמא אני רוצה - אייל גולן (אקורדים בסיסיים)',
    'לא נותן לך לעזוב - דודו טסה (מנגינה פופולרית)'
  ],
  'רוק קלאסי': [
    'Stairway to Heaven - Led Zeppelin (ריף אגדי)', 
    'Hotel California - Eagles (סולו אייקוני)',
    'Smoke on the Water - Deep Purple (ריף הכי מפורסם)',
    'Come As You Are - Nirvana (ריף פשוט ומזוהה)',
    'Wonderwall - Oasis (אקורדים קלים)',
    'Knockin on Heavens Door - Bob Dylan (3 אקורדים)'
  ],
  'הארד רוק': [
    'Smoke on the Water - Deep Purple (ריף נדבי הראשון)', 
    'Back in Black - AC/DC (ריף אייקוני)',
    'Sweet Child O Mine - Guns N Roses (ריף מזוהה)',
    'Enter Sandman - Metallica (ריף קליט)',
    'Paranoid - Black Sabbath (ריף מהיר)',
    'You Shook Me All Night Long - AC/DC (ריף פשוט)'
  ],
  'רוק פרוגרסיבי': [
    'Comfortably Numb - Pink Floyd (סולו אגדי)', 
    'Another Brick in the Wall - Pink Floyd (ריף מזוהה)',
    'Money - Pink Floyd (ריף בייס אייקוני)',
    'Wish You Were Here - Pink Floyd (אקורדים פשוטים)',
    'Kashmir - Led Zeppelin (ריף אפי)',
    'Roundabout - Yes (ריף מזוהה)'
  ],
  'מטאל': [
    'Master of Puppets - Metallica (ריף אגדי)', 
    'Iron Man - Black Sabbath (ריף אייקוני)',
    'Enter Sandman - Metallica (ריף קליט)',
    'Crazy Train - Ozzy Osbourne (ריף מזוהה)',
    'One - Metallica (אקורדים דרמטיים)',
    'Breaking the Law - Judas Priest (ריף פשוט)'
  ],
  'תראש מטאל': [
    'Raining Blood - Slayer (ריף אגרסיבי)', 
    'Peace Sells - Megadeth (ריף בייס אייקוני)',
    'Symphony of Destruction - Megadeth (ריף קליט)',
    'Angel of Death - Slayer (ריף מהיר)',
    'Holy Wars - Megadeth (ריף מורכב)',
    'South of Heaven - Slayer (ריף כבד)'
  ],
  'גראנג\'': [
    'Smells Like Teen Spirit - Nirvana (ריף אייקוני)', 
    'Come As You Are - Nirvana (ריף פשוט ומזוהה)',
    'Black - Pearl Jam (אקורדים רגשיים)',
    'Man in the Box - Alice in Chains (ריף כבד)',
    'Even Flow - Pearl Jam (ריף קליט)',
    'Lithium - Nirvana (אקורדים פשוטים)'
  ],
  'פולק': [
    'Blowin in the Wind - Bob Dylan (3 אקורדים)', 
    'The Sound of Silence - Simon & Garfunkel (אקורדים פשוטים)',
    'Knockin on Heavens Door - Bob Dylan (אקורדים בסיסיים)',
    'House of the Rising Sun - The Animals (ארפג\'יו מזוהה)',
    'Where Did You Sleep Last Night - Nirvana (פינגרסטייל פשוט)',
    'Hallelujah - Leonard Cohen (אקורדים קלים)'
  ],
  'פופ': [
    'Billie Jean - Michael Jackson (ריף בייס אייקוני)', 
    'Beat It - Michael Jackson (סולו מפורסם)',
    'Shape of You - Ed Sheeran (ריף פופולרי)',
    'Thinking Out Loud - Ed Sheeran (אקורדים פשוטים)',
    'Perfect - Ed Sheeran (בלדה קלה)',
    'Someone Like You - Adele (פסנתר/גיטרה פשוט)'
  ],
  'R&B': [
    'Superstition - Stevie Wonder (ריף פאנקי)', 
    'Respect - Aretha Franklin (ריף קליט)',
    'Lets Get It On - Marvin Gaye (אקורדים רומנטיים)',
    'Aint No Sunshine - Bill Withers (אקורדים פשוטים)',
    'Lean On Me - Bill Withers (3 אקורדים)',
    'Stand By Me - Ben E. King (ריף בייס מזוהה)'
  ],
  'סול': [
    'A Change Is Gonna Come - Sam Cooke (בלדה סול)', 
    'Lets Stay Together - Al Green (ריף רומנטי)',
    'Aint No Mountain High Enough - Marvin Gaye (ריף אופטימי)',
    'My Girl - The Temptations (ריף קליט)',
    'I Heard It Through the Grapevine - Marvin Gaye (ריף אייקוני)',
    'What\'s Going On - Marvin Gaye (אקורדים פשוטים)'
  ],
  'היפ הופ': [
    'Gin and Juice - Snoop Dogg (ריף פאנקי)', 
    'Nuthin but a G Thang - Dr. Dre (ריף מזוהה)',
    'Still D.R.E - Dr. Dre (ריף פסנתר אייקוני)',
    'California Love - 2Pac (ריף קליט)',
    'In Da Club - 50 Cent (בייס קליט)',
    'Forgot About Dre - Dr. Dre (ריף מזוהה)'
  ],
  'ראפ': [
    'Lose Yourself - Eminem (ריף גיטרה מוכר)', 
    'Humble - Kendrick Lamar (בייס כבד)',
    'Stan - Eminem (סמפל דידו)',
    'DNA - Kendrick Lamar (בייס אגרסיבי)',
    'The Real Slim Shady - Eminem (ריף קליט)',
    'Swimming Pools - Kendrick Lamar (סינת\' מזוהה)'
  ],
  'ג\'אז': [
    'Take Five - Dave Brubeck (ריתם 5/4 מפורסם)', 
    'So What - Miles Davis (מודלי)',
    'Autumn Leaves - פופולרי לג\'אם (סטנדרט)',
    'Blue Bossa - קני דורהם (בוסה נובה)',
    'Fly Me to the Moon - פרנק סינטרה (סטנדרט קל)',
    'Summertime - ג\'ורג\' גרשווין (סטנדרט קלאסי)'
  ],
  'קאנטרי': [
    'Ring of Fire - Johnny Cash (ריף אייקוני)', 
    'Jolene - Dolly Parton (אקורדים פשוטים)',
    'Wagon Wheel - Old Crow Medicine Show (אקורדים קלים)',
    'Take Me Home, Country Roads - John Denver (שיר פופולרי)',
    'Folsom Prison Blues - Johnny Cash (ריף מזוהה)',
    'Hey Good Lookin - Hank Williams (קאנטרי קלאסי)'
  ],
  'רגאיי': [
    'No Woman No Cry - Bob Marley (אקורדים פשוטים)', 
    'Redemption Song - Bob Marley (בלדה אקוסטית)',
    'Three Little Birds - Bob Marley (אקורדים בסיסיים)',
    'Could You Be Loved - Bob Marley (ריתם רגאיי)',
    'Buffalo Soldier - Bob Marley (ריף מזוהה)',
    'One Love - Bob Marley (שיר פופולרי)'
  ],
  'אלקטרוניקה': [
    'Get Lucky - Daft Punk (ריף פאנקי)', 
    'One More Time - Daft Punk (ריתם דאנס)',
    'Around the World - Daft Punk (בייסליין חוזר)',
    'Firestarter - The Prodigy (ריף אגרסיבי)',
    'Breathe - The Prodigy (בייס כבד)',
    'Block Rockin Beats - Chemical Brothers (ברייק ביט)'
  ],
  'אינדי רוק': [
    'Mr. Brightside - The Killers (ריף אייקוני)', 
    'Do I Wanna Know? - Arctic Monkeys (ריף כבד)',
    'Last Nite - The Strokes (ריף גראז\')',
    'Reptilia - The Strokes (ריף מהיר)',
    'Seven Nation Army - White Stripes (ריף נדבי)',
    'Take Me Out - Franz Ferdinand (ריף קליט)'
  ],
  'אלט-פופ': [
    'Bad Guy - Billie Eilish (בייסליין מינימלי)', 
    'Everything I Wanted - Billie Eilish (מלודיה עדינה)',
    'Lovely - Billie Eilish (בלדה פשוטה)',
    'Royals - Lorde (ריתם מינימלי)',
    'Green Light - Lorde (סינת\' פופ)',
    'Summertime Sadness - Lana Del Rey (בלדה דרמטית)'
  ],
  'ניו ווייב': [
    'Just Like Heaven - The Cure (ריף דרימי)', 
    'Love Cats - The Cure (בייס קופץ)',
    'Friday Im in Love - The Cure (אקורדים עליזים)',
    'Enjoy the Silence - Depeche Mode (סינת\' פופ)',
    'Personal Jesus - Depeche Mode (ריף מזוהה)',
    'Blue Monday - New Order (בייסליין אייקוני)'
  ],
};

export default function MusicTaste() {
  const [shuffledTrios, setShuffledTrios] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selections, setSelections] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [skippedCount, setSkippedCount] = useState(0);
  const [justReached15, setJustReached15] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [askedCombinations, setAskedCombinations] = useState([]);
  const [aiReview, setAiReview] = useState('');
  const [loadingReview, setLoadingReview] = useState(false);

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
      }))
      .filter(trio => {
        const key = trio.trio.sort().join('|');
        return !askedCombinations.includes(key);
      });
    
    if (shuffled.length === 0) {
      setAskedCombinations([]);
      setShuffledTrios([...allArtistTrios]
        .sort(() => Math.random() - 0.5)
        .map(trio => ({
          ...trio,
          trio: [...trio.trio].sort(() => Math.random() - 0.5)
        })));
    } else {
      setShuffledTrios(shuffled);
    }
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
    const currentTrio = shuffledTrios[currentIndex];
    const key = [...currentTrio.trio].sort().join('|');
    
    const newSelections = [...selections, { 
      trio: currentTrio.trio, 
      selected: artist,
      genres: currentTrio.genres 
    }];
    setSelections(newSelections);
    setAskedCombinations([...askedCombinations, key]);

    if (currentIndex < shuffledTrios.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      shuffleTrios();
      setCurrentIndex(0);
    }
  };

  const handleSkip = () => {
    const currentTrio = shuffledTrios[currentIndex];
    const key = [...currentTrio.trio].sort().join('|');
    
    setSkippedCount(skippedCount + 1);
    setAskedCombinations([...askedCombinations, key]);
    
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
    setAskedCombinations([]);
    shuffleTrios();
  };

  const handleViewResults = async () => {
    setShowResults(true);
    setLoadingReview(true);
    
    try {
      const topGenres = getTopGenres();
      const topArtists = getMostSelectedArtists();
      
      const prompt = `אתה DJ מקצועי ומבקר מוזיקה מנוסה שעובד ברדיו מסחרי גדול כמו גלגלצ. 
אתה מכיר כל שיר עדכני וחדש, כל האמנים המובילים, וכל הז'אנרים המוזיקליים.

תלמיד שלנו עשה מבחן טעם מוזיקלי וענה על ${selections.length} שאלות.

האמנים שהכי אהב:
${topArtists.slice(0, 5).map((a, i) => `${i + 1}. ${a}`).join('\n')}

הז'אנרים שהכי אהב:
${topGenres.slice(0, 5).map((g, i) => `${i + 1}. ${g.genre} (${g.count} בחירות)`).join('\n')}

כתוב תגובה מקצועית, אנרגטית ומרגשת (2-3 משפטים) בסגנון DJ רדיו שמסכם את הטעם המוזיקלי שלו.
תהיה מדויק, ספציפי, ומעניין. תציין את הז'אנרים והאמנים שבחר.
כתוב בעברית בלבד, בסגנון צעיר ואנרגטי.`;

      const response = await base44.integrations.Core.InvokeLLM({ 
        prompt,
        add_context_from_internet: false 
      });
      
      setAiReview(response);
    } catch (error) {
      setAiReview('אווו, זה טעם מוזיקלי מעולה! יש לך עין טובה למוזיקה איכותית 🎸🔥');
    } finally {
      setLoadingReview(false);
    }
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

  const getMostSelectedArtists = () => {
    const artistCounts = {};
    selections.forEach(s => {
      artistCounts[s.selected] = (artistCounts[s.selected] || 0) + 1;
    });
    return Object.entries(artistCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([artist]) => artist);
  };

  const getRecommendedSongs = () => {
    const topArtists = getMostSelectedArtists();
    const topGenres = getTopGenres();
    const recommendations = [];
    
    // Find trios that contain the top artists
    const relevantTrios = allArtistTrios.filter(trio => 
      trio.trio.some(artist => topArtists.includes(artist))
    );
    
    // Get genres from relevant trios
    const artistGenres = [];
    relevantTrios.forEach(trio => {
      trio.trio.forEach((artist, idx) => {
        if (topArtists.includes(artist)) {
          artistGenres.push(trio.genres[idx]);
        }
      });
    });
    
    // Use artist-related genres first, then top genres
    const allGenres = [...new Set([...artistGenres, ...topGenres.map(g => g.genre)])];
    
    allGenres.forEach((genre) => {
      const songs = songRecommendations[genre];
      if (songs) {
        recommendations.push(...songs);
      }
    });

    return [...new Set(recommendations)].slice(0, 24);
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
    const topArtists = getMostSelectedArtists();
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
            {loadingReview ? (
              <div className="mb-6 p-6 bg-gradient-to-r from-[#00F0FF]/10 to-[#BD00FF]/10 rounded-xl border border-[#00F0FF]/30">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-4 border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
                  <p className="text-slate-300">המומחה שלנו מנתח את הטעם המוזיקלי שלך...</p>
                </div>
              </div>
            ) : aiReview && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-6 bg-gradient-to-r from-[#00F0FF]/10 to-[#BD00FF]/10 rounded-xl border border-[#00F0FF]/30"
              >
                <div className="flex items-start gap-3 mb-3">
                  <Music className="w-6 h-6 text-[#00F0FF] mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#00F0FF] mb-2">🎙️ המומחה שלנו אומר:</h3>
                    <p className="text-slate-200 text-lg leading-relaxed">{aiReview}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <h2 className="text-2xl font-bold mb-4 neon-text">הז'אנרים האהובים עליך:</h2>
            <div className="space-y-3 mb-6">
              {topGenres.map((item, idx) => (
                <motion.div
                  key={item.genre}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.08 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00F0FF] to-[#BD00FF] flex items-center justify-center text-xl font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1 bg-[#0F172A] rounded-xl p-3 border border-[#334155]">
                    <p className="text-lg font-bold">{item.genre}</p>
                    <p className="text-xs text-slate-400">{item.count} בחירות</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {recommendedSongs.length > 0 && (
              <div className="border-t border-[#334155] pt-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Guitar className="w-6 h-6 text-[#00F0FF]" />
                  <h3 className="text-xl font-bold neon-text">שירים וריפים אייקוניים מותאמים אישית:</h3>
                  <span className="text-sm text-slate-400">({recommendedSongs.length} המלצות)</span>
                </div>
                <p className="text-sm text-slate-400 mb-4">
                  כל השירים האלה נבחרו במיוחד בשבילך, עם דגש על ריפים מזוהים, אקורדים פשוטים וטאבים קלים ללמידה 🎸
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto">
                  {recommendedSongs.map((song, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + idx * 0.03 }}
                      className="bg-[#0F172A] rounded-lg p-3 border border-[#334155] hover:border-[#00F0FF] transition-all cursor-pointer"
                    >
                      <p className="text-sm text-slate-300">{song}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center pt-4">
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