import { GeoJSONGeometry, Finding } from './analysis-service';
import { ChangeFinding, ComparisonResult } from './comparison-service';
import { LangCode } from '@/lib/i18n/config';

export interface AIQuestionContext {
  locationId: string;
  areaName: string;
  language?: LangCode;
  beforeDate?: string;
  afterDate?: string;
  findings?: Finding[] | ChangeFinding[];
  selectedFindingId?: string;
  comparison?: ComparisonResult;
}

export interface AIResponse {
  answer: string;
  findingIds?: string[];
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  findingIds?: string[];
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function datesLabel(dateId?: string): string {
  if (!dateId) return '';
  if (dateId === 'may-2022') return 'May 2022';
  if (dateId === 'may-2025') return 'May 2025';
  return dateId;
}

export const aiService = {
  /**
   * Submit a contextual query to the mock assistant.
   * Supports deterministic testing failure when question is "trigger-failure".
   */
  askQuestion: async (question: string, context: AIQuestionContext): Promise<AIResponse> => {
    await delay(600); // Simulate network latency

    const q = question.toLowerCase().trim();
    const lang = context.language || 'en';

    // Deterministic test trigger for error state testing
    if (q === "trigger-failure") {
      throw new Error("Simulated deterministic AI assistant error.");
    }

    const locName = context.areaName;
    const isComparison = !!context.beforeDate;

    // Helper to find ID by category in the current active findings context
    const findIdByCategory = (cat: 'vegetation' | 'built-up' | 'water'): string[] => {
      if (!context.findings) return [];
      const match = context.findings.find(f => f.category === cat);
      return match ? [match.id] : [];
    };

    if (isComparison) {
      // Comparison Context Responses
      if (q.includes("vegetation") || q.includes("forest") || q.includes("crops") || q.includes("plants") || q.includes("वनस्पति") || q.includes("झाडे")) {
        const ids = findIdByCategory('vegetation');
        const answers: Record<LangCode, string> = {
          en: `Vegetation cover in ${locName} dropped from 64% in May 2022 to 52% in May 2025. The decline is most noticeable in the northern vineyard plots.`,
          hi: `${locName} में वनस्पति क्षेत्र मई 2022 के 64% से घटकर मई 2025 में 52% हो गया। यह कमी उत्तरी बागों में सबसे स्पष्ट है।`,
          mr: `${locName} मधील वनस्पती क्षेत्र मे 2022 मधील 64% वरून मे 2025 मध्ये 52% पर्यंत कमी झाले. ही घट उत्तरेकडील शेतात सर्वाधिक स्पष्ट आहे.`
        };
        return {
          answer: answers[lang] || answers.en,
          findingIds: ids
        };
      }
      
      if (q.includes("built-up") || q.includes("buildings") || q.includes("urban") || q.includes("construction") || q.includes("houses") || q.includes("इमारत") || q.includes("बांधकाम")) {
        const ids = findIdByCategory('built-up');
        const answers: Record<LangCode, string> = {
          en: `Developed built-up surfaces in ${locName} expanded by 8% (growing from 18% in May 2022 to 26% in May 2025) due to warehouse sorting construction on the eastern agricultural boundary.`,
          hi: `${locName} में निर्मित क्षेत्र में 8% की वृद्धि हुई है (मई 2022 के 18% से बढ़कर मई 2025 में 26%) पूर्वी कृषि सीमा पर गोदाम निर्माण के कारण।`,
          mr: `${locName} मधील बांधकाम क्षेत्रात 8% वाढ झाली आहे (मे 2022 मधील 18% वरून मे 2025 मध्ये 26%) पूर्वेकडील शेतीच्या सीमेवर गोदामांच्या बांधकामामुळे.`
        };
        return {
          answer: answers[lang] || answers.en,
          findingIds: ids
        };
      }
      
      if (q.includes("water") || q.includes("river") || q.includes("lake") || q.includes("canal") || q.includes("पानी") || q.includes("पाणी")) {
        const ids = findIdByCategory('water');
        const answers: Record<LangCode, string> = {
          en: `Surface water levels in the central river channel are stable compared to the May 2022 baseline records, showing no major shrinkage.`,
          hi: `केंद्रीय नदी चैनल में सतह के पानी का स्तर मई 2022 के रिकॉर्ड की तुलना में स्थिर है।`,
          mr: `मध्यवर्ती नदीच्या पात्रातील पाण्याच्या पृष्ठभागाची पातळी मे 2022 च्या नोंदींच्या तुलनेत स्थिर आहे.`
        };
        return {
          answer: answers[lang] || answers.en,
          findingIds: ids
        };
      }

      if (q.includes("biggest") || q.includes("most") || q.includes("largest") || q.includes("maximum") || q.includes("बड़ा") || q.includes("मोठा")) {
        const ids = findIdByCategory('vegetation');
        const answers: Record<LangCode, string> = {
          en: `The largest spatial change detected was the 12% decrease in vegetation cover, situated in the northern farming tracts of ${locName}.`,
          hi: `सबसे बड़ा बदलाव ${locName} के उत्तरी कृषि क्षेत्रों में वनस्पति आवरण में 12% की कमी था।`,
          mr: `${locName} च्या उत्तरेकडील शेतजमिनीत वनस्पती आच्छादनात 12% ची घट हा सर्वात मोठा बदल आढळला.`
        };
        return {
          answer: answers[lang] || answers.en,
          findingIds: ids
        };
      }

      // Default Comparison response
      const vegIds = findIdByCategory('vegetation');
      const answers: Record<LangCode, string> = {
        en: `Between ${datesLabel(context.beforeDate)} and ${datesLabel(context.afterDate)} in ${locName}, vegetation cover declined (-12%) and built-up areas expanded (+8%). Water remained stable.`,
        hi: `${datesLabel(context.beforeDate)} और ${datesLabel(context.afterDate)} के बीच ${locName} में, वनस्पति घटी (-12%) और निर्मित क्षेत्र बढ़े (+8%)। पानी स्थिर रहा।`,
        mr: `${datesLabel(context.beforeDate)} आणि ${datesLabel(context.afterDate)} दरम्यान ${locName} मध्ये, वनस्पती घटली (-12%) आणि बांधकाम क्षेत्र वाढले (+8%). पाणी स्थिर राहिले.`
      };
      return {
        answer: answers[lang] || answers.en,
        findingIds: vegIds.length > 0 ? vegIds : undefined
      };
    } else {
      // Analysis Context Responses
      if (q.includes("vegetation") || q.includes("forest") || q.includes("crops") || q.includes("plants") || q.includes("वनस्पति") || q.includes("झाडे")) {
        const ids = findIdByCategory('vegetation');
        const answers: Record<LangCode, string> = {
          en: `Vegetation foliage density has decreased in the northern tracts of ${locName} compared to the baseline season.`,
          hi: `${locName} के उत्तरी क्षेत्रों में वनस्पति घनत्व में कमी आई है।`,
          mr: `${locName} च्या उत्तरेकडील भागात वनस्पतींची घनता कमी झाली आहे.`
        };
        return {
          answer: answers[lang] || answers.en,
          findingIds: ids
        };
      }
      
      if (q.includes("built-up") || q.includes("buildings") || q.includes("urban") || q.includes("construction") || q.includes("houses") || q.includes("इमारत") || q.includes("बांधकाम")) {
        const ids = findIdByCategory('built-up');
        const answers: Record<LangCode, string> = {
          en: `New developed structures are visible along the eastern boundary of ${locName}, consisting of farm warehouses and access tracks.`,
          hi: `${locName} की पूर्वी सीमा पर नए निर्माण कार्य और गोदाम दिखाई दे रहे हैं।`,
          mr: `${locName} च्या पूर्वेकडील सीमेवर नवीन बांधकामे आणि गोदामे दिसत आहेत.`
        };
        return {
          answer: answers[lang] || answers.en,
          findingIds: ids
        };
      }
      
      if (q.includes("water") || q.includes("river") || q.includes("lake") || q.includes("canal") || q.includes("पानी") || q.includes("पाणी")) {
        const ids = findIdByCategory('water');
        const answers: Record<LangCode, string> = {
          en: `Water body dimensions are stable. Canals and central river reservoirs show typical seasonal margins.`,
          hi: `जल निकायों का आकार स्थिर है। नहरें और नदी के जलाशय सामान्य मौसमी स्तर पर हैं।`,
          mr: `जलाशयांचे आकारमान स्थिर आहे. कालवे आणि नदीचे जलाशय सामान्य हंगामाच्या पातळीवर आहेत.`
        };
        return {
          answer: answers[lang] || answers.en,
          findingIds: ids
        };
      }

      // Default Analysis response
      const vegIds = findIdByCategory('vegetation');
      const answers: Record<LangCode, string> = {
        en: `The analysis of ${locName} indicates a localized decrease in vegetation and expansion of built-up developed structures. Water margins are stable.`,
        hi: `${locName} का विश्लेषण वनस्पति में कमी और निर्मित क्षेत्रों में वृद्धि दर्शाता है। जल स्तर स्थिर है।`,
        mr: `${locName} चे विश्लेषण वनस्पतींमधील घट आणि बांधकाम क्षेत्रातील वाढ दर्शवते. पाण्याची पातळी स्थिर आहे.`
      };
      return {
        answer: answers[lang] || answers.en,
        findingIds: vegIds.length > 0 ? vegIds : undefined
      };
    }
  }
};
