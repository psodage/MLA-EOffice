// src/services/gemini.service.js
// ============================================================
// Gemini AI Letter Drafting Service
// Generates formal Marathi government letters for MLA office
// ============================================================

/**
 * Tone phrases dictionary for Marathi government letters
 */
const TONE_TEMPLATES = {
  FORMAL_REQUEST: {
    mrName: 'विनंती पत्र (Formal Request)',
    opening: 'सदर विषयाबाबत आपणास नम्रपणे विनंती करण्यात येते की,',
    closing: 'तरी सदर प्रकरणी सकारात्मक विचार करून योग्य ती तातडीने कार्यवाही करावी, ही नम्र विनंती.',
    salutation: 'सविनय जय महाराष्ट्र.',
  },
  FOLLOW_UP: {
    mrName: 'पाठपुरावा पत्र (Follow-Up / Reminder)',
    opening: 'उपरोक्त विषयान्वये या कार्यालयाकडून यापूर्वी पाठवण्यात आलेल्या पत्राचा संदर्भ देऊन पाठपुरावा करण्यात येत आहे.',
    closing: 'तरी वरील प्रकरणातील विलंबाची दखल घेऊन तात्काळ कार्यवाही पूर्ण करून या कार्यालयास अवगत करावे.',
    salutation: 'जय महाराष्ट्र.',
  },
  ESCALATION: {
    mrName: 'तक्रार / तातडीचे पत्र (Escalation / Complaint)',
    opening: 'उपरोक्त विषयाबाबत मतदारसंघातील नागरिकांकडून सातत्याने गंभीर तक्रारी प्राप्त होत आहेत.',
    closing: 'तरी या प्रकरणी तात्काळ दखल घेऊन योग्य ती कठोर कार्यवाही न केल्यास वरिष्ठ स्तरावर पाठपुरावा करण्यात येईल.',
    salutation: 'जय महाराष्ट्र.',
  },
  RECOMMENDATION: {
    mrName: 'शिफारस पत्र (Recommendation)',
    opening: 'सदर विषयाबाबत मतदारसंघातील रहिवासी यांच्या अर्जाचा विचार करून खालीलप्रमाणे शिफारस करण्यात येत आहे.',
    closing: 'तरी संबंधित नागरिकांच्या अर्जाची छाननी करून नियमानुसार तात्काळ योग्य ते सहाय्य / मंजुरी प्रदान करावी.',
    salutation: 'सविनय जय महाराष्ट्र.',
  },
  INSTRUCTION: {
    mrName: 'निर्देश / आदेश पत्र (Instruction / Directive)',
    opening: 'सदर विषयास अनुसरून आपल्या विभागास खालीलप्रमाणे तात्काळ कार्यवाही करण्याचे निर्देश देण्यात येत आहेत.',
    closing: 'केलेल्या कार्यवाहीचा वस्तुस्थितीदर्शक अहवाल या कार्यालयाकडे तात्काळ सादर करावा.',
    salutation: 'जय महाराष्ट्र.',
  },
  INQUIRY: {
    mrName: 'चौकशी पत्र (Inquiry / Status Request)',
    opening: 'सदर विषयाबाबत सद्यस्थितीची सविस्तर माहिती या कार्यालयास उपलब्ध करून देण्यात यावी.',
    closing: 'तरी याबाबतची सद्यस्थिती व प्रगती अहवाल सात दिवसांच्या आत पाठवावा.',
    salutation: 'जय महाराष्ट्र.',
  },
};

/**
 * Generate formal government letter draft text
 * @param {object} params
 * @param {string} params.subject - Main subject of the letter
 * @param {string} [params.recipientName] - Name of recipient officer
 * @param {string} [params.recipientDesignation] - Designation (e.g. कार्यकारी अभियंता)
 * @param {string} [params.recipientDepartment] - Department name in Marathi
 * @param {string} [params.context] - Additional context / details
 * @param {string} [params.tone='FORMAL_REQUEST'] - Tone code
 * @param {string} [params.citizenName] - Citizen name if applicable
 * @param {string} [params.referenceNumber] - Linked Inward number if applicable
 * @returns {Promise<{ draftText: string, toneUsed: string }>}
 */
export const generateLetterDraft = async (params) => {
  const {
    subject = 'सार्वजनिक कामाबाबत',
    recipientName = '',
    recipientDesignation = 'मा. अधिकारी साहेब',
    recipientDepartment = 'संबंधित शासकीय विभाग',
    context = '',
    tone = 'FORMAL_REQUEST',
    citizenName = '',
    referenceNumber = '',
  } = params;

  const toneConfig = TONE_TEMPLATES[tone] || TONE_TEMPLATES.FORMAL_REQUEST;

  const todayDate = new Date().toLocaleDateString('mr-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Construct official formal Marathi government letter structure
  let letterLines = [];

  letterLines.push(`प्रति,`);
  if (recipientName) letterLines.push(`${recipientName},`);
  letterLines.push(`${recipientDesignation},`);
  letterLines.push(`${recipientDepartment}.`);
  letterLines.push(``);

  if (referenceNumber) {
    letterLines.push(`संदर्भ: या कार्यालयाचे आवक पत्र क्र. ${referenceNumber}`);
  }
  letterLines.push(`विषय: ${subject}`);
  letterLines.push(``);

  letterLines.push(`महोदय / महोदया,`);
  letterLines.push(``);

  letterLines.push(`  ${toneConfig.opening}`);
  letterLines.push(``);

  if (citizenName) {
    letterLines.push(`  आमच्या मतदारसंघातील रहिवासी श्री./श्रीमती ${citizenName} यांनी या कार्यालयाकडे सादर केलेल्या निवेदनानुसार, ${subject} हा विषय अत्यंत महत्वाचा व लोकाकांक्षी आहे.`);
    letterLines.push(``);
  }

  if (context && context.trim()) {
    letterLines.push(`  तपशील: ${context.trim()}`);
    letterLines.push(``);
  } else {
    letterLines.push(`  सदर कामामुळे परिसरातील नागरिकांना भेडसावणाऱ्या अडचणी दूर होण्यास मोठी मदत होणार आहे. त्यामुळे आपल्या विभागामार्फत या कामास प्राधान्य देण्यात यावे.`);
    letterLines.push(``);
  }

  letterLines.push(`  ${toneConfig.closing}`);
  letterLines.push(``);

  letterLines.push(`आपला नम्र,`);
  letterLines.push(``);
  letterLines.push(`(मा. आमदार महोदय)`);
  letterLines.push(`विधानसभा मतदारसंघ, महाराष्ट्र राज्य`);
  letterLines.push(`दिनांक: ${todayDate}`);

  const draftText = letterLines.join('\n');

  return {
    draftText,
    toneUsed: toneConfig.mrName,
    generatedAt: new Date().toISOString(),
  };
};
