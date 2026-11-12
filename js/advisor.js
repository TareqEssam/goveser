/**
 * GOVESER Advisor v7 — الدليل الافتراضي لنموذج إقامة المستثمر
 *
 *  • عمود إرشاد جانبي لا يحجب حقول النموذج (على الشاشات العريضة)، ولوحة سفلية مدمجة على الجوال.
 *  • شخصية رسمية (صورة مقسّمة) تتبع الحقل النشط، ويمتد ذراعها فعليًا نحوه مع نظرة وإيماءات.
 *  • بطاقة إرشاد لكل حقل: المطلوب، مصدر البيان، مثال، تنبيه هام، شرح الخيارات، وتحقق فوري من القيمة.
 *  • النصوص بالعربية والإنجليزية بصياغة رسمية مهذبة، وتتبع لغة الصفحة.
 *  • نطق صوتي (Web Speech API) بحسب لغة المستخدم: يقسّم الجمل عند علامات الترقيم ويضع وقفات
 *    مناسبة بينها، مع كتم الصوت (يُحفظ)، وزر استماع، وسرعة وصوت قابلان للاختيار.
 *  • بلا مكتبات خارجية. يحترم prefers-reduced-motion. يمكن إخفاؤه (يُحفظ في localStorage).
 *  • لا يعدّل بيانات النموذج ولا يسرق التركيز؛ يراقب الصفحة فقط ويستعيد نفسه بعد كل إعادة رسم.
 *
 * الواجهة العامة (متوافقة مع الإصدار السابق، مع إضافات الصوت):
 *   GOVESER_Advisor.show / hide / mute / unmute / isMuted / alertFor / showDetail
 *   GOVESER_Advisor.voiceOn / voiceOff / isVoiceOn / listen / stopSpeech
 *   (ملاحظة: mute/unmute تعني إخفاء/إظهار المرشد نفسه، أما كتم الصوت فهو voiceOff.)
 */
(function () {
  'use strict';

  var STORAGE_MUTE = 'goveser_advisor_muted';
  var STORAGE_VOICE = 'goveser_advisor_voice';        // '0' = الصوت مكتوم
  var STORAGE_RATE = 'goveser_advisor_rate';          // slow | normal | fast
  var STORAGE_VSEL = 'goveser_advisor_voicesel_';     // + ar | en  → معرّف الصوت المختار
  var RAIL_MIN_WIDTH = 1100;           // أقل عرض يظهر فيه العمود الجانبي
  var HEADER_OFFSET = 132;             // ارتفاع الشريط العلوي الثابت تقريبًا
  var NS = 'http://www.w3.org/2000/svg';

  /* ───────────────────────── حالة عامة ───────────────────────── */
  var mount = null, stage = null, main = null, rail = null, actor = null, figBox = null,
      brief = null, plate = null, pfig = null, tipDot = null, beam = null, beamPath = null, beamGrad = null, beamLine = null, pill = null;
  var muted = false, reduced = false, dockMode = false;
  var cur = null;                      // الحقل النشط { el, name, key }
  var stepInfo = { index: 0, total: 6, title: '' };
  var run = { ay: 0, aty: 0, th: 0, thWant: 0, flip: null, raf: 0, pointer: null, speakT: 0, nodT: 0 };
  var expanded = false, obs = null, builtOnce = false, introShown = false, refreshT = 0;

  try { muted = localStorage.getItem(STORAGE_MUTE) === '1'; } catch (_) {}

  var mqReduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function syncReduced() { reduced = !!(mqReduce && mqReduce.matches); }
  syncReduced();
  if (mqReduce && mqReduce.addEventListener) { try { mqReduce.addEventListener('change', syncReduced); } catch (_) {} }

  function lang() {
    if (document.body && document.body.classList.contains('lang-en')) return 'en';
    try { if (localStorage.getItem('goveser-lang') === 'en') return 'en'; } catch (_) {}
    return 'ar';
  }
  function L2(pair) { return lang() === 'en' ? (pair[1] != null ? pair[1] : pair[0]) : pair[0]; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

  /* ───────────────────────── نصوص الواجهة ───────────────────────── */
  var T = {
    ar: {
      name: 'المرشد الافتراضي', role: 'مساعد إرشادي',
      step: 'الخطوة', of: 'من', what: 'المطلوب', where: 'مصدر البيان', example: 'مثال على الصيغة', tip: 'تنبيه هام',
      choose: 'شرح الخيارات', next: 'الحقل التالي', prev: 'الحقل السابق', hide: 'إخفاء المرشد', show: 'إظهار المرشد',
      req: 'إلزامي', opt: 'اختياري', filled: 'تم إدخال البيان', more: 'عرض التفاصيل', less: 'إخفاء التفاصيل',
      start: 'البدء بأول حقل إلزامي', done: 'اكتملت بيانات هذه الخطوة',
      pressNext: 'يُرجى الضغط على زر «التالي» للانتقال إلى الخطوة التالية.',
      progress: 'حقول إلزامية مكتملة', bring: 'المستندات المطلوب تجهيزها',
      disclaimer: 'هذا إرشاد آلي استرشادي، والمرجع النهائي هو مستنداتكم الرسمية وضوابط الجهة المختصة.',
      welcome: 'أهلًا بكم. أنا المرشد الافتراضي، وسأصحبكم خطوةً بخطوة. يُرجى اختيار أي حقل لأشير إليه، وأوضح لكم البيان المطلوب إدخاله ومكان وجوده في مستنداتكم.',
      generic: 'يُرجى إدخال البيان كما هو مدوَّن في المستند الرسمي المعني، دون أي اجتهاد أو تعديل.',
      goNext: 'الانتقال إلى زر «التالي»', close: 'إغلاق', allSet: 'جميع الحقول الإلزامية في هذه الخطوة مكتملة.',
      /* الصوت */
      vOn: 'الصوت مفعّل — اضغطوا لكتمه', vOff: 'الصوت مكتوم — اضغطوا لتفعيله',
      vListen: 'استماع إلى شرح هذا الحقل', vStop: 'إيقاف الاستماع',
      vSet: 'إعدادات الصوت', vRate: 'سرعة النطق', vSlow: 'بطيئة', vNormal: 'عادية', vFast: 'سريعة', vVoice: 'الصوت المستخدم', vAuto: 'اختيار تلقائي',
      vNoVoice: 'لا يتوفر على هذا الجهاز صوت عربي للقراءة. يمكنكم تثبيت حزمة صوت عربية من إعدادات النظام ثم إعادة تحميل الصفحة.',
      vNoMale: 'لا يتوفر على هذا الجهاز صوت عربي لرجل، فيُستخدم أقرب صوت متاح بنبرة أخفض. لأفضل نتيجة ثبّتوا صوتًا عربيًا لرجل من إعدادات النظام (مثل Microsoft Naayf أو Hamed) أو استعملوا متصفح Edge.',
      /* عبارات تُنطق فقط */
      sReq: 'هذا الحقل إلزامي.', sOpt: 'هذا الحقل اختياري.', sWhere: 'مصدر البيان:', sTip: 'تنبيه هام:',
      sWarn: 'ملاحظة:', sErr: 'يوجد خطأ:', sOptions: 'شرح الخيارات المتاحة:', sExample: 'مثال على الصيغة:',
      sBring: 'المستندات المطلوب تجهيزها:', sStep: 'الخطوة {n} من {m}.'
    },
    en: {
      name: 'Virtual guide', role: 'Guidance assistant',
      step: 'Step', of: 'of', what: 'What is required', where: 'Where to find it', example: 'Format example', tip: 'Important note',
      choose: 'Explanation of the options', next: 'Next field', prev: 'Previous field', hide: 'Hide guide', show: 'Show guide',
      req: 'Required', opt: 'Optional', filled: 'Entry recorded', more: 'Show details', less: 'Hide details',
      start: 'Start with the first required field', done: 'This step is complete',
      pressNext: 'Please press “Next” to proceed to the next step.',
      progress: 'required fields completed', bring: 'Documents to have ready',
      disclaimer: 'This is automated, indicative guidance only. Your official documents and the rules of the competent authority remain the final reference.',
      welcome: 'Welcome. I am your virtual guide and will accompany you step by step. Please select any field and I will point to it, explain what to enter, and show you where to find it in your documents.',
      generic: 'Please enter the information exactly as it appears in the relevant official document, without interpretation or alteration.',
      goNext: 'Go to the “Next” button', close: 'Close', allSet: 'All required fields in this step are complete.',
      vOn: 'Voice is on — click to mute', vOff: 'Voice is muted — click to turn on',
      vListen: 'Listen to the explanation of this field', vStop: 'Stop listening',
      vSet: 'Voice settings', vRate: 'Speaking speed', vSlow: 'Slow', vNormal: 'Normal', vFast: 'Fast', vVoice: 'Voice', vAuto: 'Automatic',
      vNoVoice: 'No English voice is available on this device. You may install a voice pack from your system settings and reload the page.',
      vNoMale: 'No male English voice is available on this device, so the closest voice is used with a lower pitch. For the best result install a male voice (e.g. Microsoft David or Guy) from your system settings, or use Edge.',
      sReq: 'This field is required.', sOpt: 'This field is optional.', sWhere: 'Where to find it:', sTip: 'Important note:',
      sWarn: 'Please note:', sErr: 'There is an error:', sOptions: 'Explanation of the available options:', sExample: 'Format example:',
      sBring: 'Documents to have ready:', sStep: 'Step {n} of {m}.'
    }
  };
  function t(k) { return (T[lang()] && T[lang()][k]) || T.ar[k] || k; }

  /* ───────────────────────── محتوى الخطوات ───────────────────────── */
  var STEPS = [
    { ar: ['بيانات الشركة', 'تبدأ هذه الخطوة بتعريف الشركة. يُرجى إدخال بياناتها مطابقةً لما هو مدوَّن في سجلاتها الرسمية.', ['السجل التجاري', 'عقد التأسيس وآخر تعديل عليه']],
      en: ['Company details', 'This step identifies the company. Please enter its details exactly as they appear in its official records.', ['Commercial register', 'Incorporation deed and latest amendment']] },
    { ar: ['الموقف التنفيذي والنشاط', 'تُحدَّد في هذه الخطوة حالة النشاط وموقع ممارسته، وهما عنصران يؤثران في حساب الوزن النسبي.', ['مستندات لجنة بدء النشاط أو لجنة المعاينة (إن وُجدت)', 'سند حيازة موقع ممارسة النشاط']],
      en: ['Operational status and activity', 'This step records the status of the activity and the site where it is carried out; both affect the relative-weight calculation.', ['Commencement or inspection committee records (if any)', 'Proof of occupancy of the activity site']] },
    { ar: ['رأس المال والعمالة', 'تُعدّ أرقام رأس المال والعمالة الأساس الذي يُحسب عليه الوزن النسبي؛ لذا يُرجى مراجعتها بدقة قبل إدخالها.', ['السجل التجاري (رأس المال)', 'شهادة إثبات رأس المال', 'برنت التأمينات الحديث']],
      en: ['Capital and workforce', 'The capital and workforce figures form the basis of the relative-weight calculation; please review them carefully before entering them.', ['Commercial register (capital)', 'Capital evidence certificate', 'Recent social-insurance statement']] },
    { ar: ['نتيجة الوزن النسبي', 'تُحتسب هذه النتيجة تلقائيًا من البيانات التي أدخلتموها، ولا يُطلب منكم إدخال أي بيان هنا. يُرجى مراجعة النتيجة؛ وإذا بدت غير متوقعة فيُرجى الرجوع إلى الخطوات السابقة والتحقق من الأرقام.', []],
      en: ['Relative-weight result', 'This result is calculated automatically from the data you entered, and nothing needs to be entered here. Please review the result; if it appears unexpected, kindly go back to the previous steps and verify your figures.', []] },
    { ar: ['بيانات المستثمرين', 'يُرجى إدخال بيانات كل مستثمر طالب للخدمة كما وردت في جواز سفره.', ['جواز سفر كل مستثمر', 'عقد التأسيس أو آخر تعديل عليه (لبيان الصفة والنسبة)']],
      en: ['Investor details', 'Please enter the details of each investor applying for the service exactly as shown in his or her passport.', ['Each investor’s passport', 'Incorporation deed or latest amendment (for capacity and share)']] },
    { ar: ['بيانات مقدِّم الطلب', 'هذه هي الخطوة الأخيرة، وتتعلق ببيانات من يتقدّم بالطلب ووسيلة التواصل معه.', ['توكيل رسمي أو تفويض موثَّق (إذا كان مقدِّم الطلب غير صاحب الشأن)']],
      en: ['Applicant details', 'This is the final step. It concerns the person submitting the request and how to contact him or her.', ['Official power of attorney or authenticated delegation (if the applicant is not the principal)']] }
  ];

  /* ───────────────────────── كتالوج الحقول ─────────────────────────
     w = المطلوب، f = مصدر البيان، e = مثال على الصيغة، t = تنبيه هام، o = شرح الخيارات (قيمة الخيار → نص)
     المصدر: نصوص النموذج الحالية ومنطقه البرمجي. تحتاج مراجعة الجهة المختصة قبل الاعتماد الرسمي.
     ملاحظة للنطق: تُقرأ النصوص صوتيًا؛ لذا تُكتب جملًا تامة بعلامات ترقيم سليمة، وتُتجنَّب الرموز والاختصارات. */
  var G = {
    companyName: {
      ar: { w: 'يُرجى كتابة اسم الشركة مطابقًا حرفيًا للاسم الوارد في السجل التجاري.', f: 'السجل التجاري، أو عقد تأسيس الشركة.', e: 'شركة المثال للاستثمار (ش.ذ.م.م)', t: 'يُرجى عدم اختصار الاسم أو ترجمته؛ فأي اختلاف عمّا ورد في السجل قد تترتب عليه ملاحظات على الطلب.' },
      en: { w: 'Please type the company name exactly as it appears in the commercial register.', f: 'The commercial register, or the company’s incorporation deed.', e: 'Example Investment Co. (LLC)', t: 'Please do not abbreviate or translate the name; any difference from the register may give rise to remarks on the request.' } },
    companyLaw: {
      ar: { w: 'يُرجى اختيار القانون الذي تخضع له الشركة، كما هو مذكور في مستنداتها وفي آخر تعديل عليها.', f: 'السجل التجاري (بجوار اسم الشركة)، أو عقد التأسيس.', t: 'يُرجى عدم الاختيار على سبيل التخمين. وإذا لم تكونوا متأكدين فاختاروا «لست متأكدًا»، وسيوضح لكم النموذج كيفية التحقق من القانون.',
        o: { '159': 'الشركات المنشأة وفقًا للقانون رقم 159 لسنة 1981 يمكنها الحصول على مزايا قانون الاستثمار بشرط التقدم بطلب للتمتع بها، ولا بد من قرار التمتع قبل طلب خدمات إقامة المستثمر.', '72': 'قانون الاستثمار رقم 72 لسنة 2017، وهو القانون الحالي للاستثمار.', '8': 'قانون ضمانات وحوافز الاستثمار رقم 8 لسنة 1997، وهو قانون أقدم؛ يُرجى اختياره فقط إذا ورد صراحةً في مستندات الشركة.', '230': 'قانون الاستثمار رقم 230 لسنة 1989، وهو قانون أقدم؛ يُرجى اختياره فقط إذا ورد صراحةً في مستندات الشركة.', '43': 'القانون رقم 43 لسنة 1974 بشأن نظام استثمار المال العربي والأجنبي والمناطق الحرة، وهو قانون أقدم؛ يُرجى اختياره فقط إذا ورد صراحةً في مستندات الشركة.', unknown: 'سيعرض عليكم النموذج طريقة التحقق من القانون الذي تخضع له الشركة.' } },
      en: { w: 'Please select the law to which the company is subject, as stated in its documents and latest amendment.', f: 'The commercial register (beside the company name), or the incorporation deed.', t: 'Please do not guess. If you are not certain, select “Not sure” and the form will explain how to verify the law.',
        o: { '159': 'Companies established under Law No. 159 of 1981 can obtain the benefits of the Investment Law if they apply to enjoy them; the benefits decision is required before applying for investor-residence services.', '72': 'Investment Law No. 72 of 2017, which is the current investment law.', '8': 'Investment Guarantees and Incentives Law No. 8 of 1997, an earlier law; please select it only if it is expressly stated in the company documents.', '230': 'Investment Law No. 230 of 1989, an earlier law; please select it only if it is expressly stated in the company documents.', '43': 'Law No. 43 of 1974 on Arab and Foreign Capital Investment and Free Zones, an earlier law; please select it only if it is expressly stated in the company documents.', unknown: 'The form will show you how to verify the law to which the company is subject.' } } },
    zone: {
      ar: { w: 'يُرجى اختيار «استثمار داخلي» ما لم تكن الشركة واقعة داخل منطقة حرة أو منطقة استثمارية معتمدة.', f: 'عنوان الشركة ونظام الاستثمار الخاضعة له، كما هو مدوَّن في السجل التجاري أو عقد التأسيس.', t: 'يُرجى اختيار منطقة حرة أو منطقة استثمارية فقط إذا كانت الشركة واقعة فعليًا داخل منطقة معتمدة من هذا النوع.',
        o: { internal: 'للشركات الواقعة خارج المناطق الحرة والمناطق الاستثمارية.', free: 'للشركات الواقعة داخل منطقة حرة معتمدة.', investment: 'للشركات الواقعة داخل منطقة استثمارية معتمدة.' } },
      en: { w: 'Please select “Domestic investment” unless the company is located inside a designated free zone or investment zone.', f: 'The company address and the investment regime to which it is subject, as stated in the commercial register or incorporation deed.', t: 'Please select a free zone or an investment zone only if the company is actually located inside a designated zone of that type.',
        o: { internal: 'For companies located outside free zones and investment zones.', free: 'For companies located inside a designated free zone.', investment: 'For companies located inside a designated investment zone.' } } },
    legalForm: {
      ar: { w: 'يُرجى اختيار الشكل القانوني للشركة كما يظهر في مستنداتها.', f: 'السجل التجاري (العمود الثاني من اليمين)، أو عقد التأسيس.', t: 'يترتب على هذا الاختيار تحديد صفتكم في الشركة، والحد الأدنى لرأس المال، وعدد الإقامات المتاحة.',
        o: { joint: 'الحد الأدنى لرأس المال وفق وثيقة الوزن النسبي: 250,000 جنيه مصري.', llc: 'الحد الأدنى لرأس المال: 50,000 جنيه مصري.', one: 'الحد الأدنى لرأس المال: 50,000 جنيه مصري.', partnership: 'الحد الأدنى لرأس المال: 300,000 جنيه مصري.', limitedShares: 'الحد الأدنى لرأس المال: 300,000 جنيه مصري.', sole: 'الحد الأدنى لرأس المال: 100,000 جنيه مصري، ويُتاح كحد أقصى إقامة واحدة.', unknown: 'يُرجى مراجعة السجل التجاري أو عقد التأسيس قبل المتابعة.' } },
      en: { w: 'Please select the legal form of the company as it appears in its documents.', f: 'The commercial register (second column from the right), or the incorporation deed.', t: 'This selection determines your capacity in the company, the minimum capital, and the number of residences available.',
        o: { joint: 'Minimum capital per the relative-weight document: 250,000 Egyptian pounds.', llc: 'Minimum capital: 50,000 Egyptian pounds.', one: 'Minimum capital: 50,000 Egyptian pounds.', partnership: 'Minimum capital: 300,000 Egyptian pounds.', limitedShares: 'Minimum capital: 300,000 Egyptian pounds.', sole: 'Minimum capital: 100,000 Egyptian pounds, and at most one residence is available.', unknown: 'Please check the commercial register or incorporation deed before continuing.' } } },
    oneOwnerType: {
      ar: { w: 'يُرجى اختيار «شخص طبيعي» إذا كان مالك الشركة فردًا، أو «شخص اعتباري» إذا كان المالك شركة.', f: 'عقد تأسيس شركة الشخص الواحد.', t: 'إذا كان المالك شخصًا طبيعيًا فتُحتسب للشركة إقامة واحدة فقط.',
        o: { natural: 'المالك فرد؛ وتُحتسب للشركة إقامة واحدة فقط.', legal: 'المالك شركة أو كيان اعتباري.' } },
      en: { w: 'Please select “Natural person” if the owner of the company is an individual, or “Legal person” if the owner is a company.', f: 'The incorporation deed of the one-person company.', t: 'If the owner is a natural person, the company is counted for a single residence only.',
        o: { natural: 'The owner is an individual; the company is counted for a single residence only.', legal: 'The owner is a company or other legal entity.' } } },
    companyStart: {
      ar: { w: 'يُرجى إدخال تاريخ تأسيس الشركة. ويمكنكم اختياره من التقويم أو كتابته بالصيغة المعروضة في الحقل.', f: 'مستند تأسيس الشركة، أو السجل التجاري.', t: 'المقصود هو تاريخ التأسيس وليس تاريخ بدء النشاط. ويؤثر هذا التاريخ في الخيارات التي ستظهر لاحقًا في الموقف التنفيذي، بحسب ما إذا كان قد مضى على التأسيس عام أو لم يمضِ.' },
      en: { w: 'Please enter the company’s incorporation date. You may pick it from the calendar or type it in the format shown in the field.', f: 'The company’s incorporation document, or the commercial register.', t: 'This is the incorporation date, not the date the activity started. It also affects the operational-status options shown later, depending on whether one year has passed since incorporation.' } },
    activityStatus: {
      ar: { w: 'يُرجى اختيار الحالة التي تثبتها مستندات الشركة ولجنة بدء النشاط أو لجنة المعاينة.', f: 'محضر لجنة بدء النشاط، أو تقرير لجنة المعاينة.', t: 'يُرجى عدم الإفادة ببدء النشاط أو بثبوت الجدية ما لم تثبتهما لجنة مختصة. وإذا لم يثبت أيٌّ منهما فيمكن المتابعة، مع التقدم بطلب لتشكيل لجنة وإرفاق إيصال سداد رسومها.',
        o: { start: 'بدأت الشركة نشاطها، وثبت ذلك من خلال لجنة بدء النشاط.', serious: 'ثبتت جدية الشركة من خلال لجنة معاينة، دون أن يكون النشاط قد بدأ بعد.', none: 'لم يبدأ النشاط ولم تثبت الجدية. يمكن المتابعة مع الالتزام بالتقدم بطلب تشكيل لجنة وإرفاق إيصال السداد.', 'new': 'موافقة حديثة لم يمضِ عليها عام.', operating: 'بدأت الشركة نشاطها، وثبت ذلك من خلال لجنة معاينة أو مستند معتمد.', under: 'لم تتقدم الشركة من قبل بما يثبت الجدية أو بدء النشاط.' } },
      en: { w: 'Please select the status that is supported by the company documents and by the commencement or inspection committee.', f: 'The commencement committee report, or the inspection committee report.', t: 'Please do not state that the activity has commenced, or that seriousness has been verified, unless a competent committee has verified it. If neither has been verified you may continue, provided you apply for a committee to be formed and attach the fee receipt.',
        o: { start: 'The company has started its activity, as verified through the commencement committee.', serious: 'The company’s seriousness has been verified by an inspection committee, but the activity has not yet started.', none: 'The activity has not started and seriousness has not been verified. You may continue, with an undertaking to apply for a committee and to attach the fee receipt.', 'new': 'A recent approval, issued less than one year ago.', operating: 'The company has started its activity, as verified by an inspection committee or an approved document.', under: 'The company has not previously submitted proof of seriousness or of commencement.' } } },
    inspectionStatus: {
      ar: { w: 'يُرجى اختيار النتيجة المسجَّلة في تقرير لجنة المعاينة.', f: 'تقرير لجنة المعاينة.', t: 'إذا لم تُجرَ معاينة، أو لم يثبت بها شيء، فيُرجى اختيار الخيار الأخير.',
        o: { start: 'ثبت بدء النشاط بتقرير لجنة المعاينة.', serious: 'ثبتت الجدية أو الموقف التنفيذي دون بدء النشاط.', no: 'لم تُجرَ المعاينة، أو لم يثبت بها شيء.' } },
      en: { w: 'Please select the result recorded in the inspection committee report.', f: 'The inspection committee report.', t: 'If no inspection took place, or nothing was verified, please select the last option.',
        o: { start: 'Commencement of the activity was verified by the inspection committee report.', serious: 'Seriousness or implementation status was verified, without commencement of the activity.', no: 'No inspection took place, or nothing was verified.' } } },
    activityStartDate: {
      ar: { w: 'يُرجى إدخال تاريخ بدء النشاط كما هو مثبت بالمستندات.', f: 'محضر لجنة بدء النشاط، أو شهادة بدء النشاط.', t: 'يجب ألا يكون التاريخ لاحقًا لتاريخ اليوم.' },
      en: { w: 'Please enter the date the activity commenced, as supported by the documents.', f: 'The commencement committee report, or the commencement certificate.', t: 'The date must not be later than today’s date.' } },
    inspectionDate: {
      ar: { w: 'يُرجى إدخال تاريخ آخر لجنة معاينة.', f: 'تقرير آخر لجنة معاينة.', t: 'تُحسب مدة الخمس سنوات عند ثبوت بدء النشاط، وتُحسب مدة السنة عند ثبوت الجدية دون بدء النشاط.' },
      en: { w: 'Please enter the date of the latest inspection committee.', f: 'The report of the latest inspection committee.', t: 'A five-year period is counted when commencement has been verified, and a one-year period when only seriousness has been verified.' } },
    activityCertificate: {
      ar: { w: 'يُرجى اختيار «نعم» إذا توافر مستند معتمد يثبت بدء النشاط، و«لا» في غير ذلك.', f: 'شهادة أو مستند معتمد من الجهة المختصة.',
        o: { yes: 'يتوافر مستند معتمد يثبت بدء النشاط.', no: 'لا يتوافر مستند معتمد يثبت بدء النشاط.' } },
      en: { w: 'Please select “Yes” if an approved document proving the commencement of the activity is available, and “No” otherwise.', f: 'A certificate or approved document issued by the competent authority.',
        o: { yes: 'An approved document proving commencement is available.', no: 'No approved document proving commencement is available.' } } },
    activityDescription: {
      ar: { w: 'يُرجى كتابة النشاط الفعلي كما هو مدوَّن في مستندات الشركة، مع بيان المنتج أو الخدمة الرئيسية.', f: 'السجل التجاري (خانة النشاط)، أو ترخيص النشاط.', e: 'تصنيع مواد التعبئة والتغليف البلاستيكية', t: 'يُرجى كتابة ما تمارسه الشركة فعليًا، وليس ما يوحي به اسمها.' },
      en: { w: 'Please describe the actual activity as recorded in the company documents, stating the main product or service.', f: 'The commercial register (activity field), or the activity licence.', e: 'Manufacture of plastic packaging materials', t: 'Please write what the company actually does, not what its name suggests.' } },
    activityTypeIndustry: {
      ar: { w: 'يُرجى اختيار «نعم» إذا كان النشاط صناعيًا، و«لا» في غير ذلك.', f: 'ترخيص النشاط، أو السجل الصناعي.', t: 'يؤثر هذا الاختيار في مستندات إيجار الموقع، إذ يلزم التصديق على العقد من الشهر العقاري.',
        o: { yes: 'نشاط صناعي؛ ويلزم عند الإيجار إدخال رقم التصديق وتاريخه.', no: 'نشاط غير صناعي.' } },
      en: { w: 'Please select “Yes” if the activity is industrial, and “No” otherwise.', f: 'The activity licence, or the industrial register.', t: 'This choice affects the lease paperwork, as the contract must be authenticated by the Real Estate Registry.',
        o: { yes: 'Industrial activity; for a lease, the authentication number and date must be entered.', no: 'Non-industrial activity.' } } },
    activityType: {
      ar: { w: 'يُرجى مطابقة النشاط الفعلي مع الأنشطة المستهدفة الواردة في وثيقة الوزن النسبي، أو فتح الدليل لمراجعتها.', f: 'ترخيص النشاط ومستندات الشركة.', t: 'يُرجى عدم الاعتماد على اسم الشركة. ويُحتسب الغرض بنسبة 20% عند ثبوت بدء النشاط أو الجدية، وبنسبة 10% في غير ذلك.',
        o: { review: 'يفتح دليلًا خطوة بخطوة لمراجعة كل نشاط وشروطه.' } },
      en: { w: 'Please match the actual activity against the targeted activities listed in the relative-weight document, or open the guide to review them.', f: 'The activity licence and the company documents.', t: 'Please do not rely on the company name. The purpose is counted at 20 percent when commencement or seriousness has been verified, and at 10 percent otherwise.',
        o: { review: 'Opens a step-by-step guide to review each activity and its conditions.' } } },
    locationCategory: {
      ar: { w: 'يُرجى تحديد ما إذا كان موقع ممارسة النشاط ضمن المواقع المستهدفة، أو فتح الدليل لمراجعتها.', f: 'عنوان موقع ممارسة النشاط في مستندات الحيازة.', t: 'المقصود هو الموقع الذي يُنفَّذ فيه النشاط فعليًا، وليس عنوان المراسلات أو المقر الإداري.',
        o: { review: 'يفتح دليلًا لمراجعة المحافظات والمناطق المحددة.' } },
      en: { w: 'Please indicate whether the activity site is within the targeted locations, or open the guide to review them.', f: 'The site address stated in the occupancy documents.', t: 'This means the site where the activity is actually carried out, not the correspondence address or the administrative headquarters.',
        o: { review: 'Opens a guide to review the specified governorates and areas.' } } },
    siteName: {
      ar: { w: 'يُرجى كتابة العنوان التفصيلي لمكان ممارسة النشاط، متضمنًا المحافظة، والمدينة أو المركز، والمنطقة، والشارع.', f: 'عقد الإيجار، أو التمليك، أو التخصيص، أو الانتفاع.', e: 'القاهرة – العاشر من رمضان – المنطقة الصناعية الثالثة – قطعة 12', t: 'ليس المقصود عنوان المقر الإداري إذا كان مختلفًا عن موقع ممارسة النشاط.' },
      en: { w: 'Please write the detailed address of the place where the activity is carried out, including the governorate, city or district, area, and street.', f: 'The lease, ownership, allocation, or usufruct document.', e: 'Cairo – 10th of Ramadan – Industrial Zone 3 – Plot 12', t: 'This is not the administrative headquarters address, if that is different from the activity site.' } },
    siteProof: {
      ar: { w: 'يُرجى اختيار نوع السند الذي تحوزون به موقع ممارسة النشاط.', f: 'عقد الموقع الذي تمارس فيه الشركة نشاطها.', t: 'في حالة الإيجار يجب أن يكون العقد ساريًا، ومصدَّقًا عليه من الشهر العقاري أو مرفقًا بموافقة جهة الولاية. وفي النشاط الصناعي يلزم إدخال رقم التصديق وتاريخه.',
        o: { ownership: 'عقد ملكية للموقع.', allocation: 'عقد تخصيص صادر من جهة الولاية.', rent: 'عقد إيجار ساري؛ وسيُطلب منكم تاريخ البدء وتاريخ الانتهاء.', usufruct: 'عقد انتفاع بالموقع.' } },
      en: { w: 'Please select the type of document under which you occupy the activity site.', f: 'The contract for the site where the company carries out its activity.', t: 'For a lease, the contract must be valid and either authenticated by the Real Estate Registry or accompanied by the approval of the competent authority. For an industrial activity, the authentication number and date must be entered.',
        o: { ownership: 'An ownership title for the site.', allocation: 'An allocation contract issued by the competent authority.', rent: 'A valid lease; the start date and end date will be requested.', usufruct: 'A usufruct contract for the site.' } } },
    leaseStartDate: {
      ar: { w: 'يُرجى إدخال تاريخ بداية عقد الإيجار كما هو وارد بالعقد.', f: 'بند المدة في عقد الإيجار.' },
      en: { w: 'Please enter the lease start date exactly as stated in the contract.', f: 'The term clause of the lease contract.' } },
    siteExpiry: {
      ar: { w: 'يُرجى إدخال التاريخ بحسب نوع السند: تاريخ عقد التخصيص، أو تاريخ عقد الانتفاع، أو تاريخ انتهاء عقد الإيجار.', f: 'العقد نفسه (بند المدة، أو تاريخ التحرير).', t: 'يجب أن يكون عقد الإيجار ساريًا.' },
      en: { w: 'Please enter the date that matches the type of proof: the allocation contract date, the usufruct contract date, or the lease end date.', f: 'The contract itself (the term clause, or the date of issue).', t: 'A lease must still be valid.' } },
    usdDeposit: {
      ar: { w: 'يُرجى إدخال قيمة الوديعة الدولارية المجمدة بالدولار الأمريكي.', f: 'شهادة البنك بالوديعة المجمدة.', t: 'المطلوب وديعة لا تقل عن 200,000 دولار أمريكي.' },
      en: { w: 'Please enter the amount of the frozen deposit in US dollars.', f: 'The bank certificate for the frozen deposit.', t: 'A deposit of at least 200,000 US dollars is required.' } },
    leaseNotaryNumber: {
      ar: { w: 'يُرجى إدخال رقم تصديق عقد الإيجار لدى الشهر العقاري.', f: 'ختم التصديق على عقد الإيجار.', t: 'هذا البيان إلزامي للنشاط الصناعي عند وجود عقد إيجار.' },
      en: { w: 'Please enter the Real Estate Registry authentication number of the lease.', f: 'The authentication stamp on the lease contract.', t: 'This is mandatory for an industrial activity operating under a lease.' } },
    leaseNotaryDate: {
      ar: { w: 'يُرجى إدخال تاريخ تصديق عقد الإيجار لدى الشهر العقاري.', f: 'ختم التصديق على عقد الإيجار.' },
      en: { w: 'Please enter the date on which the lease was authenticated by the Real Estate Registry.', f: 'The authentication stamp on the lease contract.' } },
    companyCapital: {
      ar: { w: 'يُرجى إدخال رأس المال كما هو مؤشَّر به في السجل التجاري، مع اختيار العملة.', f: 'السجل التجاري (خانة رأس المال).', t: 'في الشركة المساهمة يُدخَل رأس المال المرخص به، وفي المنشأة الفردية رأس مال المنشأة، وفي غير ذلك رأس مال الشركة.' },
      en: { w: 'Please enter the capital as recorded in the commercial register, and select the currency.', f: 'The commercial register (capital field).', t: 'For a joint-stock company, enter the authorised capital; for a sole proprietorship, the establishment capital; for any other form, the company capital.' } },
    capitalEvidence: {
      ar: { w: 'يُرجى اختيار المستند الذي يثبت رأس المال.', f: 'السجل التجاري، أو الشهادة البنكية، أو شهادة قطاع الأداء الاقتصادي.', t: 'يجب أن تطابق القيمة التي ستدخلونها في الحقل التالي المستند الذي تختارونه هنا.',
        o: { paid_register: 'المبلغ المسدد والمؤشَّر به في السجل التجاري.', bank: 'شهادة بنكية صادرة باسم الشركة.', economic: 'شهادة صادرة عن قطاع الأداء الاقتصادي.', bank_previous: 'سبق تقديم شهادة بنكية؛ وسيُطلب منكم بيانات المستفيد السابق.', economic_previous: 'سبق تقديم شهادة من قطاع الأداء الاقتصادي؛ وسيُطلب منكم بيانات المستفيد السابق.' } },
      en: { w: 'Please select the document that proves the capital.', f: 'The commercial register, the bank certificate, or the Economic Performance Sector certificate.', t: 'The value you enter in the next field must match the document you select here.',
        o: { paid_register: 'The paid-up amount recorded in the commercial register.', bank: 'A bank certificate issued in the company’s name.', economic: 'A certificate issued by the Economic Performance Sector.', bank_previous: 'A bank certificate was submitted previously; details of the previous beneficiary will be requested.', economic_previous: 'A certificate was submitted previously; details of the previous beneficiary will be requested.' } } },
    capitalAmount: {
      ar: { w: 'يُرجى إدخال القيمة المطابقة للمستند الذي اخترتموه، مع اختيار العملة.', f: 'المستند المختار (السجل التجاري أو الشهادة).', t: 'يجب ألا تقل القيمة عن 50,000 جنيه مصري أو ما يعادلها، وألا تتجاوز رأس المال المؤشَّر به.' },
      en: { w: 'Please enter the value that matches the document you selected, and select the currency.', f: 'The selected document (the register or the certificate).', t: 'The value must be at least 50,000 Egyptian pounds or the equivalent, and must not exceed the registered capital.' } },
    exchangeRate: {
      ar: { w: 'يُرجى إدخال سعر صرف الدولار الأمريكي مقابل الجنيه المصري.', f: 'سعر الصرف المعتمد وقت إعداد الطلب.', t: 'يُستخدم هذا السعر مرة واحدة لتحويل المبالغ المدخلة بالدولار إلى جنيه مصري عند حساب الوزن النسبي.' },
      en: { w: 'Please enter the exchange rate of the US dollar against the Egyptian pound.', f: 'The official rate applicable at the time the request is prepared.', t: 'This rate is used once, to convert any amounts entered in dollars into Egyptian pounds when calculating the relative weight.' } },
    insuredWorkers: {
      ar: { w: 'يُرجى إدخال عدد العمالة المصرية المؤمن عليها.', f: 'برنت التأمينات الحديث.', t: 'إذا كان العدد أكبر من صفر فسيُطلب منكم تاريخ إصدار البرنت وصورته، وإذا كان صفرًا فلن يُطلب ذلك.' },
      en: { w: 'Please enter the number of insured Egyptian employees.', f: 'The recent social-insurance statement.', t: 'If the number is greater than zero, you will be asked for the statement’s issue date and a copy of it. If it is zero, neither will be required.' } },
    insuranceStatementDate: {
      ar: { w: 'يُرجى إدخال تاريخ الإصدار المطبوع على برنت التأمينات.', f: 'أعلى برنت التأمينات.', t: 'يجب أن يكون البرنت حديثًا وفق متطلبات المستندات.' },
      en: { w: 'Please enter the issue date printed on the social-insurance statement.', f: 'The top of the social-insurance statement.', t: 'The statement must be recent, in accordance with the document requirements.' } },
    registerDate: {
      ar: { w: 'يُرجى إدخال تاريخ إصدار السجل التجاري.', f: 'السجل التجاري (تاريخ الإصدار).' },
      en: { w: 'Please enter the issue date of the commercial register.', f: 'The commercial register (issue date).' } },
    registerRenewalDate: {
      ar: { w: 'يُرجى إدخال تاريخ تجديد السجل التجاري.', f: 'السجل التجاري (آخر تجديد).' },
      en: { w: 'Please enter the renewal date of the commercial register.', f: 'The commercial register (latest renewal).' } },
    unifiedRegister: {
      ar: { w: 'يُرجى إدخال الرقم الموحَّد للسجل التجاري، ويتكون من 15 رقمًا بالضبط.', f: 'أعلى السجل التجاري (الرقم الموحَّد).', e: '123456789012345', t: 'أرقام فقط، دون مسافات أو شرطات. ويمكن الكتابة بالأرقام العربية.' },
      en: { w: 'Please enter the unified commercial register number, which consists of exactly 15 digits.', f: 'The top of the commercial register (unified number).', e: '123456789012345', t: 'Digits only, with no spaces or dashes. Arabic digits are accepted.' } },
    companyExpiry: {
      ar: { w: 'يُرجى إدخال تاريخ انتهاء مدة الشركة.', f: 'عقد التأسيس (بند المدة)، أو السجل التجاري.' },
      en: { w: 'Please enter the date on which the company’s term expires.', f: 'The incorporation deed (term clause), or the commercial register.' } },
    boardExpiryDate: {
      ar: { w: 'يُرجى إدخال تاريخ انتهاء مدة مجلس الإدارة.', f: 'محضر الجمعية العامة العادية.', t: 'تُحتسب المدة من تاريخ انعقاد الجمعية العامة، وليس من تاريخ التأشير بالسجل التجاري. ويجب أن يكون التاريخ المدخل مستقبليًا.' },
      en: { w: 'Please enter the date on which the board’s term expires.', f: 'The minutes of the ordinary general assembly.', t: 'The term is counted from the date of the general assembly meeting, not from the date of endorsement in the commercial register. The date entered must be in the future.' } },
    residencyBeneficiaries: {
      ar: { w: 'يُرجى إدخال عدد الحاصلين على إقامات من خلال الشركة، بخلاف مقدِّم الطلب الحالي.', f: 'سجلاتكم الداخلية، وإقامات المستثمرين الحاليين.', e: '0', t: 'تُحتسب الإقامات السارية فقط. وإذا لم يوجد أحد فيُرجى إدخال صفر.' },
      en: { w: 'Please enter the number of people who hold residence through the company, excluding the current applicant.', f: 'Your internal records and the current investors’ residences.', e: '0', t: 'Only valid residences are counted. If there are none, please enter zero.' } },
    visaBeneficiaries: {
      ar: { w: 'يُرجى إدخال عدد الحاصلين على تأشيرات دخول من خلال الشركة، بخلاف مقدِّم الطلب الحالي.', f: 'سجلاتكم، وتأشيرات المستثمرين الحالية.', e: '0', t: 'تُحتسب التأشيرات السارية فقط. وإذا لم يوجد أحد فيُرجى إدخال صفر.' },
      en: { w: 'Please enter the number of people who hold entry visas through the company, excluding the current applicant.', f: 'Your records and the current investors’ visas.', e: '0', t: 'Only valid visas are counted. If there are none, please enter zero.' } },
    name: {
      ar: { w: 'يُرجى كتابة اسم المستثمر كما هو مدوَّن في جواز السفر.', f: 'صفحة البيانات في جواز السفر.', t: 'يُرجى الالتزام بترتيب الأسماء الوارد في الجواز، دون ألقاب أو اختصارات.' },
      en: { w: 'Please type the investor’s name exactly as shown in the passport.', f: 'The data page of the passport.', t: 'Please keep the same order of names as in the passport, without titles or abbreviations.' } },
    nationality: {
      ar: { w: 'يُرجى كتابة اسم الدولة كما هو وارد في جواز السفر.', f: 'خانة الجنسية في جواز السفر.', e: 'تركيا', t: 'يُرجى كتابة اسم الدولة مباشرةً.' },
      en: { w: 'Please enter the name of the country as shown in the passport.', f: 'The nationality field of the passport.', e: 'Türkiye', t: 'Please enter the name of the country directly.' } },
    passport: {
      ar: { w: 'يُرجى كتابة رقم جواز السفر.', f: 'صفحة البيانات في جواز السفر.', t: 'يُرجى كتابته دون مسافات أو رموز، مع مراجعة الحروف والأرقام المتشابهة، مثل الحرف O والرقم صفر، والحرف I والرقم واحد.' },
      en: { w: 'Please enter the passport number.', f: 'The data page of the passport.', t: 'Please enter it without spaces or symbols, and double-check look-alike characters, such as the letter O and the digit zero, or the letter I and the digit one.' } },
    passportExpiry: {
      ar: { w: 'يُرجى إدخال تاريخ انتهاء جواز السفر.', f: 'صفحة البيانات في جواز السفر.', t: 'الجواز المنتهي غير مقبول. وإذا كان سريان الجواز أقل من 6 أشهر فيلزم الإقرار الموضح في النموذج.' },
      en: { w: 'Please enter the passport expiry date.', f: 'The data page of the passport.', t: 'An expired passport is not accepted. If the passport has less than 6 months of validity remaining, the undertaking shown in the form is required.' } },
    role: {
      ar: { w: 'يُرجى اختيار صفة المستثمر في الشركة بما يتفق مع شكلها القانوني.', f: 'عقد التأسيس، أو آخر تعديل عليه، أو محضر مجلس الإدارة.', t: 'إذا اخترتم صفة «ممثل عن شركة» فسيظهر حقل لإدخال اسم الشركة التي يمثلها المستثمر.',
        o: { joint_shareholder_chair: 'مساهم بصفته الشخصية، ويشغل منصب رئيس مجلس الإدارة.', joint_shareholder_deputy: 'مساهم بصفته الشخصية، ويشغل منصب نائب رئيس مجلس الإدارة.', joint_shareholder_member: 'مساهم بصفته الشخصية، ويشغل عضوية مجلس الإدارة.', joint_rep_chair: 'يمثِّل شركةً مساهمة، ويشغل منصب رئيس مجلس الإدارة.', joint_rep_deputy: 'يمثِّل شركةً مساهمة، ويشغل منصب نائب رئيس مجلس الإدارة.', joint_rep_member: 'يمثِّل شركةً مساهمة، ويشغل عضوية مجلس الإدارة.', general_partner_manager: 'شريك متضامن يتولى الإدارة.', llc_partner_manager: 'شريك في الشركة ويتولى إدارتها.', llc_rep_manager: 'يمثِّل شركةً شريكة، ويتولى الإدارة.', sole_owner: 'صاحب المنشأة الفردية.', one_owner_manager: 'مالك الشركة، ويتولى إدارتها.', one_rep_manager: 'يمثِّل الشركة المالكة، ويتولى الإدارة.', partner: 'شريك في الشركة.', manager: 'مدير له حق الإدارة والتوقيع.', legalRep: 'ممثل عن شركة.' } },
      en: { w: 'Please select the investor’s capacity in the company, in line with its legal form.', f: 'The incorporation deed, its latest amendment, or the board minutes.', t: 'If you select a company-representative capacity, a field will appear for the name of the company the investor represents.',
        o: { joint_shareholder_chair: 'A shareholder in his or her own right, who also serves as Chairman of the Board.', joint_shareholder_deputy: 'A shareholder in his or her own right, who also serves as Vice Chairman of the Board.', joint_shareholder_member: 'A shareholder in his or her own right, who also serves as a Board Member.', joint_rep_chair: 'Represents a shareholding company, and serves as Chairman of the Board.', joint_rep_deputy: 'Represents a shareholding company, and serves as Vice Chairman of the Board.', joint_rep_member: 'Represents a shareholding company, and serves as a Board Member.', general_partner_manager: 'A general partner who manages the company.', llc_partner_manager: 'A partner in the company who also manages it.', llc_rep_manager: 'Represents a partner company, and manages the company.', sole_owner: 'The owner of the sole proprietorship.', one_owner_manager: 'The owner of the company, who also manages it.', one_rep_manager: 'Represents the owning company, and manages the company.', partner: 'A partner in the company.', manager: 'A manager with management and signing authority.', legalRep: 'A company representative.' } } },
    representedCompany: {
      ar: { w: 'يُرجى كتابة اسم الشركة التي يمثلها المستثمر.', f: 'السجل التجاري لتلك الشركة.', t: 'يجب أن يكون الاسم مطابقًا للسجل حرفيًا.' },
      en: { w: 'Please enter the name of the company that the investor represents.', f: 'The commercial register of that company.', t: 'The name must match the register exactly.' } },
    sharePercent: {
      ar: { w: 'يُرجى إدخال نسبة ملكية المستثمر في رأس المال، بالمئة.', f: 'عقد التأسيس، أو آخر تعديل عليه.', e: '25', t: 'يجب أن تكون النسبة أكبر من صفر، ولا تزيد على مئة.' },
      en: { w: 'Please enter the investor’s ownership percentage of the capital.', f: 'The incorporation deed, or its latest amendment.', e: '25', t: 'The percentage must be greater than zero and no more than one hundred.' } },
    shareValue: {
      ar: { w: 'يُرجى إدخال قيمة مساهمة المستثمر أو مشاركته في الشركة.', f: 'عقد التأسيس، أو آخر تعديل عليه.', t: 'هذا الحقل إلزامي، ولا يجوز تركه فارغًا.' },
      en: { w: 'Please enter the value of the investor’s shareholding or participation in the company.', f: 'The incorporation deed, or its latest amendment.', t: 'This field is mandatory and must not be left empty.' } },
    previousBenefit: {
      ar: { w: 'يُرجى الإجابة بحسب ما حصل عليه المستثمر سابقًا من إقامة أو ترخيص عمل، من خلال شركة خاضعة للهيئة العامة للاستثمار.', f: 'جواز السفر، وبيانات الإقامة السابقة.', t: 'إذا لم يسبق للمستثمر الحصول على شيء من ذلك فيُرجى اختيار الخيار الأخير.',
        o: { residence_investment: 'سبق للمستثمر الحصول على إقامة من خلال شركة خاضعة لقانون الاستثمار.', work_159: 'سبق للمستثمر الحصول على ترخيص عمل من خلال شركة خاضعة لقانون رقم 159 لسنة 1981.', work_investment: 'سبق للمستثمر الحصول على ترخيص عمل من خلال شركة خاضعة لقانون الاستثمار.', none: 'لم يسبق للمستثمر الحصول على إقامة أو ترخيص عمل من خلال الهيئة العامة للاستثمار.' } },
      en: { w: 'Please answer according to any residence or work permit the investor previously obtained through a company subject to the General Authority for Investment.', f: 'The passport, and the records of the previous residence.', t: 'If the investor has not previously obtained any of these, please select the last option.',
        o: { residence_investment: 'The investor previously obtained residence through a company subject to the Investment Law.', work_159: 'The investor previously obtained a work permit through a company subject to Law No. 159 of 1981.', work_investment: 'The investor previously obtained a work permit through a company subject to the Investment Law.', none: 'The investor has not previously obtained residence or a work permit through the General Authority for Investment.' } } },
    previousCompanyName: {
      ar: { w: 'يُرجى كتابة اسم الشركة السابقة التي حصل المستثمر من خلالها على الإقامة أو ترخيص العمل.', f: 'بيانات الإقامة أو ترخيص العمل السابق، أو السجل التجاري لتلك الشركة.', t: 'يجب أن يكون الاسم مطابقًا للسجل التجاري حرفيًا.' },
      en: { w: 'Please enter the name of the previous company through which the investor obtained the residence or work permit.', f: 'The records of the previous residence or work permit, or that company’s commercial register.', t: 'The name must match the commercial register exactly.' } },
    previousCompanyProof: {
      ar: { w: 'يُرجى الإفادة بما إذا كانت الشركة السابقة قد أثبتت بدء النشاط أو الجدية.', f: 'مستندات الشركة السابقة، ومحاضر لجنة بدء النشاط أو لجنة المعاينة الخاصة بها.', t: 'إذا لم يثبت أيٌّ منهما فقد يُطلب منكم التعهد بالتقدم بطلب لتشكيل لجنة معاينة وإرفاق إيصال سداد رسومها.',
        o: { start: 'أثبتت الشركة السابقة بدء النشاط.', serious: 'أثبتت الشركة السابقة جديتها.', no: 'لم يثبت بدء النشاط ولا الجدية.' } },
      en: { w: 'Please state whether the previous company has proved the commencement of its activity or its seriousness.', f: 'The previous company’s documents, and the reports of its commencement or inspection committee.', t: 'If neither has been proved, you may be asked to undertake to apply for an inspection committee and to attach the fee receipt.',
        o: { start: 'The previous company has proved the commencement of its activity.', serious: 'The previous company has proved its seriousness.', no: 'Neither commencement nor seriousness has been proved.' } } },
    insideEgypt: {
      ar: { w: 'يُرجى اختيار «نعم» فقط إذا كان المستثمر موجودًا داخل مصر وقت تقديم الطلب.', f: 'موقع المستثمر الفعلي وقت التقديم.', t: 'منح الإقامة وتجديدها لا يكونان إلا للمستثمر الموجود داخل البلاد.',
        o: { yes: 'المستثمر داخل مصر وقت تقديم الطلب.', no: 'المستثمر خارج مصر؛ ولا يمكن استكمال هذه الخدمة.' } },
      en: { w: 'Please select “Yes” only if the investor is inside Egypt at the time the request is submitted.', f: 'The investor’s actual location at the time of submission.', t: 'Residence grant and renewal are only for an investor inside the country.',
        o: { yes: 'The investor is inside Egypt at the time of submission.', no: 'The investor is outside Egypt; this service cannot be continued.' } } },
    enjoymentDecisionNumber: {
      ar: { w: 'يُرجى إدخال رقم قرار التمتع بمزايا قانون الاستثمار كما هو مطبوع على القرار.', f: 'قرار التمتع الصادر للشركة.', t: 'أرقام فقط. لا تُقبل الشركة الخاضعة للقانون 159 دون هذا القرار.' },
      en: { w: 'Please enter the Investment Law benefits decision number as printed on the decision.', f: 'The benefits decision issued to the company.', t: 'Digits only. A Law 159 company cannot continue without this decision.' } },
    enjoymentDecisionYear: {
      ar: { w: 'يُرجى إدخال سنة صدور قرار التمتع.', f: 'قرار التمتع الصادر للشركة.', t: 'أربعة أرقام؛ لا تسبق سنة تأسيس الشركة.' },
      en: { w: 'Please enter the year the benefits decision was issued.', f: 'The benefits decision issued to the company.', t: 'Four digits; it cannot precede the incorporation year.' } },
    outsideEgypt: {
      ar: { w: 'يُرجى اختيار «نعم» فقط إذا كان المستثمر خارج مصر وقت تقديم طلب تأشيرة الدخول.', f: 'موقع المستثمر الفعلي وقت التقديم.',
        o: { yes: 'المستثمر خارج مصر وقت تقديم الطلب.', no: 'المستثمر داخل مصر وقت تقديم الطلب.' } },
      en: { w: 'Please select “Yes” only if the investor is outside Egypt at the time the entry-visa request is submitted.', f: 'The investor’s actual location at the time of submission.',
        o: { yes: 'The investor is outside Egypt at the time of submission.', no: 'The investor is inside Egypt at the time of submission.' } } },
    firstOnCompany: {
      ar: { w: 'يُرجى اختيار «نعم» إذا لم يسبق للمستثمر الحصول على إقامة من خلال هذه الشركة تحديدًا.', f: 'سجل إقامات المستثمر السابقة.', t: 'وإلا فيُرجى اختيار خدمة التجديد.',
        o: { yes: 'هذه أول إقامة للمستثمر على هذه الشركة.', no: 'سبق للمستثمر الحصول على إقامة على الشركة نفسها؛ ويلزم اختيار خدمة التجديد.' } },
      en: { w: 'Please select “Yes” if the investor has never held residence through this specific company.', f: 'The investor’s previous residence records.', t: 'Otherwise, please choose the renewal service.',
        o: { yes: 'This is the investor’s first residence through this company.', no: 'The investor previously held residence through the same company; the renewal service must be chosen.' } } },
    previousResidence: {
      ar: { w: 'يُرجى الإجابة بحسب الإقامة السابقة المثبتة على الشركة نفسها.', f: 'صورة الإقامة السابقة في جواز السفر.',
        o: { yes: 'الإقامة السابقة صادرة من خلال الشركة نفسها.', no: 'الإقامة السابقة غير صادرة من خلال الشركة نفسها.' } },
      en: { w: 'Please answer according to the previous residence recorded for the same company.', f: 'The previous residence page in the passport.',
        o: { yes: 'The previous residence was issued through the same company.', no: 'The previous residence was not issued through the same company.' } } },
    lastResidenceExpiry: {
      ar: { w: 'يُرجى إدخال تاريخ انتهاء الإقامة كما هو مطبوع على المستند.', f: 'صفحة الإقامة في جواز السفر.' },
      en: { w: 'Please enter the expiry date exactly as printed on the residence document.', f: 'The residence page in the passport.' } },
    birthDate: {
      ar: { w: 'يُرجى إدخال تاريخ ميلاد المستثمر.', f: 'صفحة البيانات في جواز السفر.' },
      en: { w: 'Please enter the investor’s date of birth.', f: 'The data page of the passport.' } },
    departureDate: {
      ar: { w: 'يُرجى إدخال تاريخ مغادرة مصر.', f: 'ختم المغادرة في جواز السفر، أو مستندات السفر.' },
      en: { w: 'Please enter the date of departure from Egypt.', f: 'The departure stamp in the passport, or the travel documents.' } },
    companyStatus: {
      ar: { w: 'يُرجى الإفادة بما إذا كان المستفيد السابق ما زال بالشركة أم خرج منها.', f: 'آخر تعديل على عقد التأسيس، أو السجل التجاري المحدَّث.', t: 'يترتب على هذا الاختيار مراجعة متطلبات إضافية، مثل إثبات الخروج في السجل التجاري، أو تقديم إقرار، مع صحة توقيع بنكي، بعدم طلب إقامة على الشركة نفسها لحين زيادة الوزن النسبي.',
        o: { remains: 'المستفيد السابق لا يزال بالشركة.', exited: 'المستفيد السابق خرج من الشركة؛ ويلزم إثبات خروجه في السجل التجاري.' } },
      en: { w: 'Please state whether the previous beneficiary is still with the company or has left it.', f: 'The latest amendment of the incorporation deed, or the updated commercial register.', t: 'This choice may lead to additional requirements, such as evidence of the exit in the commercial register, or an undertaking, with a bank-verified signature, not to request residence through the same company until its relative weight increases.',
        o: { remains: 'The previous beneficiary is still with the company.', exited: 'The previous beneficiary has left the company; the exit must be evidenced in the commercial register.' } } },
    priorName: {
      ar: { w: 'يُرجى كتابة الاسم الكامل للمستفيد السابق كما هو مدوَّن في جواز سفره.', f: 'جواز السفر، أو بيانات الإقامة أو التأشيرة السابقة.', t: 'دون ألقاب أو اختصارات.' },
      en: { w: 'Please enter the full name of the previous beneficiary exactly as shown in his or her passport.', f: 'The passport, or the records of the previous residence or visa.', t: 'Without titles or abbreviations.' } },
    priorNationality: {
      ar: { w: 'يُرجى كتابة اسم الدولة كما هو وارد في جواز سفر المستفيد السابق.', f: 'خانة الجنسية في جواز السفر.', e: 'تركيا' },
      en: { w: 'Please enter the name of the country as shown in the previous beneficiary’s passport.', f: 'The nationality field of the passport.', e: 'Türkiye' } },
    priorResidenceStart: {
      ar: { w: 'يُرجى إدخال تاريخ بداية الإقامة السابقة.', f: 'صفحة الإقامة في جواز السفر.' },
      en: { w: 'Please enter the start date of the previous residence.', f: 'The residence page in the passport.' } },
    priorResidenceEnd: {
      ar: { w: 'يُرجى إدخال تاريخ انتهاء الإقامة السابقة.', f: 'صفحة الإقامة في جواز السفر.', t: 'تُحتسب الإقامات السارية فقط عند تحديد الأماكن المتاحة.' },
      en: { w: 'Please enter the expiry date of the previous residence.', f: 'The residence page in the passport.', t: 'Only valid residences are counted when determining the available places.' } },
    priorVisaStart: {
      ar: { w: 'يُرجى إدخال تاريخ بداية التأشيرة السابقة.', f: 'صفحة التأشيرة في جواز السفر.' },
      en: { w: 'Please enter the start date of the previous visa.', f: 'The visa page in the passport.' } },
    priorVisaEnd: {
      ar: { w: 'يُرجى إدخال تاريخ انتهاء التأشيرة السابقة.', f: 'صفحة التأشيرة في جواز السفر.', t: 'تُحتسب التأشيرات السارية فقط عند تحديد الأماكن المتاحة.' },
      en: { w: 'Please enter the expiry date of the previous visa.', f: 'The visa page in the passport.', t: 'Only valid visas are counted when determining the available places.' } },
    applicantName: {
      ar: { w: 'يُرجى كتابة اسم مقدِّم الطلب كاملًا.', f: 'بطاقة الرقم القومي، أو التوكيل أو التفويض.', t: 'هو من سيُدرج اسمه في الطلب، وهو من سيتواصل مع الجهة المختصة.' },
      en: { w: 'Please enter the full name of the applicant.', f: 'The national ID card, or the power of attorney or delegation.', t: 'This person will be named in the request and will be the point of contact with the competent authority.' } },
    applicantRole: {
      ar: { w: 'يُرجى اختيار صفة مقدِّم الطلب وسند حقه في تمثيل الشركة.', f: 'السجل التجاري، أو التوكيل، أو التفويض.', t: 'يلزم الوكيلَ توكيلٌ رسمي موثَّق، ويلزم المفوَّضَ تفويضٌ مُثبَتة صحة التوقيع عليه من البنك.',
        o: { principal: 'صاحب الحق في التوقيع عن الشركة؛ ولا يُطلب منه توكيل.', agent: 'يلزم توكيل رسمي موثَّق من صاحب الحق في التوقيع.', delegate: 'يلزم تفويض مُثبَتة صحة التوقيع عليه من البنك.' } },
      en: { w: 'Please select the applicant’s capacity and the basis of his or her authority to represent the company.', f: 'The commercial register, the power of attorney, or the delegation.', t: 'An agent needs a notarised power of attorney, and a delegate needs a delegation whose signature has been verified by the bank.',
        o: { principal: 'The holder of signing authority for the company; no power of attorney is required.', agent: 'A notarised power of attorney from the holder of signing authority is required.', delegate: 'A delegation with a bank-verified signature is required.' } } },
    phone: {
      ar: { w: 'يُرجى إدخال رقم هاتف مصري صحيح، محمول أو أرضي.', f: 'رقم التواصل مع مقدِّم الطلب.', e: '01012345678', t: 'يمكن أيضًا استخدام الصيغة الدولية (+20).' },
      en: { w: 'Please enter a valid Egyptian telephone number, mobile or landline.', f: 'The applicant’s contact number.', e: '01012345678', t: 'The international format (+20) is also accepted.' } },
    email: {
      ar: { w: 'يُرجى إدخال بريد إلكتروني صحيح يمكنكم الوصول إليه.', f: 'البريد الإلكتروني لمقدِّم الطلب.', e: 'name@example.com', t: 'يلزم إدخال بريد صحيح قبل ظهور خيارات التنزيل والمشاركة.' },
      en: { w: 'Please enter a valid email address that you can access.', f: 'The applicant’s email address.', e: 'name@example.com', t: 'A valid email address is required before the download and share options appear.' } },
    notes: {
      ar: { w: 'يمكنكم إضافة أي ملاحظة ترغبون في إظهارها مع الطلب. وهذا الحقل اختياري.', t: 'يُرجى عدم كتابة بيانات سرية.' },
      en: { w: 'You may add any note you wish to appear with the request. This field is optional.', t: 'Please do not write confidential information.' } },
    currency: {
      ar: { w: 'يُرجى اختيار عملة المبلغ: الجنيه المصري، أو الدولار الأمريكي.', t: 'عند اختيار الدولار سيُطلب منكم سعر الصرف.' },
      en: { w: 'Please select the currency of the amount: the Egyptian pound, or the US dollar.', t: 'If you select the dollar, you will be asked for the exchange rate.' } }
  };
  /* حقول المستفيدين السابقين: تأخذ إرشاد الحقول المقابلة أو إرشادًا خاصًا بها */
  var PRIOR_MAP = { name: 'priorName', nationality: 'priorNationality', role: 'role', shareValue: 'shareValue', sharePercent: 'sharePercent',
    residenceStart: 'priorResidenceStart', residenceEnd: 'priorResidenceEnd', validFrom: 'priorVisaStart', validTo: 'priorVisaEnd', companyStatus: 'companyStatus' };

  /* رسائل التنبيه القديمة (تُستخدم عند alertFor) */
  var ALERTS = {
    companyLaw: ['يجب تحديد القانون قبل المتابعة. يُرجى مراجعة السجل التجاري أو عقد التأسيس.', 'The law must be identified before you continue. Please check the commercial register or the incorporation deed.'],
    legalForm: ['لا يمكن حساب الوزن النسبي دون تحديد الشكل القانوني.', 'The relative weight cannot be calculated without identifying the legal form.'],
    companyCapital: ['رأس المال أقل من الحد الأدنى المقرر لهذا الشكل القانوني.', 'The capital is below the minimum prescribed for this legal form.'],
    capitalAmount: ['القيمة أقل من الحد الأدنى، أو تتجاوز رأس المال المسجَّل.', 'The value is below the minimum, or exceeds the registered capital.'],
    exchangeRate: ['سعر الصرف مطلوب عند وجود مبالغ بالدولار.', 'The exchange rate is required whenever any amount is entered in dollars.'],
    activityStatus: ['ستحتاجون إلى مستند يثبت الجدية، أو إيصال سداد رسوم لجنة المعاينة.', 'You will need a document proving seriousness, or the inspection committee fee receipt.']
  };

  /* ───────────────────────── أدوات القيم والتحقق ───────────────────────── */
  var AR_DIGITS = '٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹';
  function normDigits(s) { return String(s == null ? '' : s).replace(/[٠-٩۰-۹]/g, function (ch) { return String(AR_DIGITS.indexOf(ch) % 10); }); }
  function num(s) { var v = parseFloat(normDigits(s).replace(/[, ]/g, '')); return isFinite(v) ? v : NaN; }
  function fmt(n) { try { return Number(n).toLocaleString(lang() === 'en' ? 'en-US' : 'ar-EG'); } catch (_) { return String(n); } }
  function parseDate(v) { if (!v) return null; var d = new Date(String(v) + 'T12:00:00'); return isNaN(d.getTime()) ? null : d; }
  function today() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function ctl(name) { return mount ? mount.querySelector('[name="' + name + '"]') : null; }
  function formState(name) {
    try { var st = window.GOVESER_FormState && window.GOVESER_FormState.get(); return st && st[name] != null ? String(st[name]) : ''; } catch (_) { return ''; }
  }
  /* قيمة الحقل: من الشاشة الحالية، وإن لم يكن ظاهرًا (خطوة أخرى) فمن حالة النموذج المحفوظة */
  function val(name) { var e = ctl(name); return e ? e.value : formState(name); }

  var LEGAL_MIN = { joint: 250000, llc: 50000, one: 50000, partnership: 300000, limitedShares: 300000, sole: 100000 };
  function isEmail(v) { return /^[A-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}$/i.test(String(v || '').trim()); }
  function isEgPhone(value) {
    var n = normDigits(String(value || '').trim()).replace(/[\s().-]/g, '');
    if (n.indexOf('+20') === 0) n = '0' + n.slice(3); else if (n.indexOf('0020') === 0) n = '0' + n.slice(4);
    if (!/^[0-9]+$/.test(n)) return false;
    return /^01[0125][0-9]{8}$/.test(n) || /^(?:02[0-9]{8}|03[0-9]{8}|0(?:13|40|45|46|47|48|50|55|57|62|64|65|66|68|69|82|84|86|88|92|93|95|96|97)[0-9]{7})$/.test(n);
  }
  function res(s, ar, en) { return { s: s, m: [ar, en] }; }
  var OK_DATE = ['التاريخ مقبول.', 'The date is acceptable.'];
  function futureCheck(v) {
    var d = parseDate(v); if (!d) return null;
    if (d > today()) return res('err', 'هذا التاريخ يقع في المستقبل. يُرجى مراجعة اليوم والشهر والسنة.', 'This date is in the future. Please check the day, month and year.');
    if (d.getFullYear() < 1950) return res('warn', 'السنة تبدو بعيدة جدًا. يُرجى التأكد منها.', 'The year looks very early. Please verify it.');
    return res('ok', OK_DATE[0], OK_DATE[1]);
  }

  /* كل دالة تعيد null (لا حكم بعد) أو { s: ok|warn|err, m:[ar,en] } */
  var V = {
    companyLaw: function (v) {
      if (v !== '159') return null;
      return res('warn',
        'الشركات المنشأة وفقًا لأحكام القانون رقم 159 لسنة 1981 يمكنها الحصول على مزايا قانون الاستثمار، بشرط أن تتقدم بطلب للتمتع بمزايا قانون الاستثمار. فإذا كانت الشركة تمارس نشاطًا خاضعًا لقانون الاستثمار، فيمكنها التقدم إلى اللجنة المختصة للحصول على قرار بالتمتع. وبعد حصولها على هذا القرار يمكنها التقدم بطلب للحصول على خدمات إقامة المستثمر. لذلك يُرجى إدخال رقم قرار التمتع وسنة صدوره، وإذا لم تحصل الشركة عليه بعد فلا يمكن استكمال الخدمة الآن.',
        'Companies established under Law No. 159 of 1981 can obtain the benefits of the Investment Law, provided that they apply to enjoy those benefits. If the company carries on an activity that falls under the Investment Law, it can apply to the competent committee for a decision granting it the benefits. Once it has that decision, it can apply for investor-residence services. So please enter the decision number and year; if the company has not obtained it yet, the service cannot be completed now.');
    },
    enjoymentDecisionNumber: function (v) {
      var d = normDigits(v).trim(); if (!d) return null;
      if (!/^[0-9][0-9\/-]{0,14}$/.test(d)) return res('err', 'رقم القرار يجب أن يتكون من أرقام فقط.', 'The decision number must consist of digits only.');
      return res('ok', 'تم إدخال رقم القرار.', 'Decision number entered.');
    },
    enjoymentDecisionYear: function (v) {
      var d = normDigits(v).trim(); if (!d) return null;
      var cy = new Date().getFullYear();
      if (d.length < 4) return res('warn', 'أدخل السنة من أربعة أرقام.', 'Enter the year as four digits.');
      var y = parseInt(d, 10);
      if (!/^[0-9]{4}$/.test(d) || y < 1981 || y > cy) return res('err', 'سنة غير صحيحة؛ يجب أن تكون بين 1981 و' + cy + '.', 'Invalid year; it must be between 1981 and ' + cy + '.');
      var inc = parseDate(val('companyStart'));
      if (inc && y < inc.getFullYear()) return res('err', 'لا يمكن أن يصدر قرار التمتع قبل تأسيس الشركة. راجع السنة.', 'The benefits decision cannot be issued before the company was incorporated. Please check the year.');
      return res('ok', 'سنة القرار مقبولة.', 'Decision year accepted.');
    },
    outsideEgypt: function (v) {
      if (v === 'no') return res('err', 'المستثمر داخل مصر، وتأشيرة الدخول لا تكون إلا للمستثمر الموجود خارجها؛ فلا يمكن استكمال هذه الخدمة.', 'The investor is inside Egypt, and an entry visa is only for an investor outside it; this service cannot be continued.');
      return null;
    },
    insideEgypt: function (v) {
      if (v === 'no') return res('err', 'المستثمر خارج مصر، ومنح الإقامة أو تجديدها لا يكونان إلا للمستثمر الموجود داخلها؛ فلا يمكن استكمال هذه الخدمة.', 'The investor is outside Egypt, and residence can only be granted or renewed for an investor inside it; this service cannot be continued.');
      return null;
    },
    unifiedRegister: function (v) {
      var d = normDigits(v).replace(/\D/g, ''); if (!d) return null;
      if (d.length < 15) return res('warn', 'أُدخل ' + d.length + ' من أصل 15 رقمًا. يُرجى استكمال باقي الأرقام.', d.length + ' of 15 digits entered. Please complete the remaining digits.');
      return res('ok', 'تم إدخال 15 رقمًا، وهو العدد المطلوب.', 'Fifteen digits entered, as required.');
    },
    companyStart: function (v) { return futureCheck(v); },
    activityStartDate: function (v) { return futureCheck(v); },
    inspectionDate: function (v) { return futureCheck(v); },
    leaseStartDate: function (v) { return futureCheck(v); },
    registerDate: function (v) { return futureCheck(v); },
    insuranceStatementDate: function (v) { return futureCheck(v); },
    leaseNotaryDate: function (v) { return futureCheck(v); },
    birthDate: function (v) { return futureCheck(v); },
    priorResidenceStart: function (v) { return futureCheck(v); },
    priorVisaStart: function (v) { return futureCheck(v); },
    siteExpiry: function (v) {
      var d = parseDate(v); if (!d) return null;
      if (val('siteProof') === 'rent' && d < today()) return res('err', 'عقد الإيجار منتهي، ويجب أن يكون ساريًا.', 'The lease has expired; it must still be valid.');
      return res('ok', OK_DATE[0], OK_DATE[1]);
    },
    boardExpiryDate: function (v) {
      var d = parseDate(v); if (!d) return null;
      if (d <= today()) return res('err', 'مدة المجلس منتهية. يجب أن يكون التاريخ مستقبليًا؛ لذا يُرجى تجديد المجلس قبل المتابعة.', 'The board’s term has ended. The date must be in the future; please renew the board before continuing.');
      return res('ok', OK_DATE[0], OK_DATE[1]);
    },
    companyExpiry: function (v) {
      var d = parseDate(v); if (!d) return null;
      if (d < today()) return res('warn', 'هذا التاريخ قد مضى بالفعل. يُرجى مراجعة مدة الشركة.', 'This date has already passed. Please check the company’s term.');
      return res('ok', OK_DATE[0], OK_DATE[1]);
    },
    departureDate: function (v) {
      var d = parseDate(v); if (!d) return null;
      if (d > today()) return res('warn', 'تاريخ المغادرة يقع في المستقبل. يُرجى التأكد منه.', 'The departure date is in the future. Please verify it.');
      return res('ok', OK_DATE[0], OK_DATE[1]);
    },
    passportExpiry: function (v) {
      var d = parseDate(v); if (!d) return null;
      var t0 = today(), six = new Date(t0); six.setMonth(six.getMonth() + 6);
      if (d <= t0) return res('err', 'جواز السفر منتهي الصلاحية، وهو غير مقبول.', 'The passport has expired and is not accepted.');
      if (d < six) return res('warn', 'سريان الجواز أقل من 6 أشهر؛ وسيُطلب منكم الإقرار الموضح في النموذج.', 'The passport has less than 6 months of validity; the undertaking shown in the form will be requested.');
      return res('ok', 'جواز السفر ساري.', 'The passport is valid.');
    },
    companyCapital: function (v) {
      var n = num(v); if (!isFinite(n)) return null;
      if (n <= 0) return res('err', 'يُرجى إدخال قيمة أكبر من صفر.', 'Please enter a value greater than zero.');
      var cur = val('companyCapitalCurrency') || 'EGP', rate = cur === 'USD' ? num(val('exchangeRate')) : 1;
      var form = val('legalForm'), min = LEGAL_MIN[form];
      if (cur === 'USD' && !(rate > 0)) return res('warn', 'المبلغ بالدولار؛ يُرجى إدخال سعر الصرف لاحقًا ليكتمل التحقق من الحد الأدنى.', 'The amount is in dollars; please enter the exchange rate later so that the minimum can be verified.');
      if (min && n * rate < min) return res('err', 'المبلغ أقل من الحد الأدنى لهذا الشكل القانوني، وهو ' + fmt(min) + ' جنيه مصري، وفق وثيقة الوزن النسبي.', 'The amount is below the minimum for this legal form, which is ' + fmt(min) + ' Egyptian pounds, per the relative-weight document.');
      return res('ok', 'القيمة مقبولة.', 'The value is accepted.');
    },
    capitalAmount: function (v) {
      var n = num(v); if (!isFinite(n)) return null;
      if (n <= 0) return res('err', 'يُرجى إدخال قيمة أكبر من صفر.', 'Please enter a value greater than zero.');
      var cur = val('capitalAmountCurrency') || 'EGP', rate = cur === 'USD' ? num(val('exchangeRate')) : 1;
      if (cur === 'USD' && !(rate > 0)) return res('warn', 'المبلغ بالدولار؛ يُرجى إدخال سعر الصرف ليكتمل التحقق.', 'The amount is in dollars; please enter the exchange rate to complete the verification.');
      var egp = n * rate;
      if (egp < 50000) return res('err', 'القيمة أقل من الحد الأدنى، وهو 50,000 جنيه مصري أو ما يعادلها.', 'The value is below the minimum of 50,000 Egyptian pounds or the equivalent.');
      var cc = num(val('companyCapital')), ccRate = (val('companyCapitalCurrency') === 'USD') ? num(val('exchangeRate')) : 1;
      if (isFinite(cc) && cc > 0 && ccRate > 0 && egp > cc * ccRate) return res('warn', 'القيمة تتجاوز رأس المال المؤشَّر به؛ وسيُحتسب رأس المال المؤشَّر به فقط، إلى أن يُؤشَّر بالزيادة.', 'The value exceeds the registered capital; only the registered capital will be counted until the increase is recorded.');
      return res('ok', 'القيمة مقبولة.', 'The value is accepted.');
    },
    exchangeRate: function (v) {
      var n = num(v); if (!isFinite(n)) return null;
      return n > 0 ? res('ok', 'القيمة مقبولة.', 'The value is accepted.') : res('err', 'يُرجى إدخال قيمة موجبة.', 'Please enter a positive value.');
    },
    insuredWorkers: function (v) {
      var n = num(v); if (!isFinite(n)) return null;
      if (n < 0 || Math.floor(n) !== n) return res('err', 'يُرجى إدخال عدد صحيح لا يقل عن صفر.', 'Please enter a whole number, zero or more.');
      return n > 0 ? res('ok', 'سيُطلب منكم تاريخ إصدار البرنت وصورته.', 'The statement’s issue date and a copy of it will be requested.') : res('ok', 'العدد صفر؛ ولن يُطلب البرنت.', 'The number is zero; the statement will not be required.');
    },
    residencyBeneficiaries: function (v) { return beneficiaryCheck(v); },
    visaBeneficiaries: function (v) { return beneficiaryCheck(v); },
    usdDeposit: function (v) {
      var n = num(v); if (!isFinite(n)) return null;
      return n >= 200000 ? res('ok', 'القيمة مقبولة.', 'The value is accepted.') : res('err', 'المطلوب وديعة لا تقل عن 200,000 دولار أمريكي.', 'A deposit of at least 200,000 US dollars is required.');
    },
    sharePercent: function (v) {
      var n = num(v); if (!isFinite(n)) return null;
      return (n > 0 && n <= 100) ? res('ok', 'النسبة مقبولة.', 'The percentage is accepted.') : res('err', 'يجب أن تكون النسبة أكبر من صفر، ولا تزيد على مئة.', 'The percentage must be greater than zero and no more than one hundred.');
    },
    shareValue: function (v) {
      var n = num(v); if (!isFinite(n)) return null;
      return n >= 0 ? res('ok', 'القيمة مقبولة.', 'The value is accepted.') : res('err', 'لا يجوز أن تكون القيمة سالبة.', 'The value cannot be negative.');
    },
    phone: function (v) {
      if (!String(v || '').trim()) return null;
      return isEgPhone(v) ? res('ok', 'رقم الهاتف صحيح.', 'The telephone number is valid.') : res('err', 'رقم الهاتف غير مكتمل أو غير صحيح. مثال على الصيغة الصحيحة: 01012345678.', 'The telephone number is incomplete or invalid. An example of the correct format: 01012345678.');
    },
    email: function (v) {
      if (!String(v || '').trim()) return null;
      return isEmail(v) ? res('ok', 'البريد الإلكتروني صحيح.', 'The email address is valid.') : res('err', 'صيغة البريد الإلكتروني غير صحيحة. مثال على الصيغة الصحيحة: name@example.com.', 'The email address format is invalid. An example of the correct format: name@example.com.');
    },
    name: function (v) { return nameCheck(v); },
    priorName: function (v) { return nameCheck(v); },
    applicantName: function (v) { return nameCheck(v); },
    nationality: function (v) { return countryCheck(v); },
    priorNationality: function (v) { return countryCheck(v); },
    passport: function (v) {
      var s = String(v || '').trim(); if (!s) return null;
      if (/[^A-Za-z0-9؀-ۿ]/.test(s)) return res('warn', 'يُرجى حذف المسافات والرموز؛ فرقم الجواز يتكون من حروف وأرقام فقط.', 'Please remove spaces and symbols; the passport number consists of letters and digits only.');
      if (s.length < 5) return res('warn', 'الرقم يبدو قصيرًا. يُرجى مراجعة جواز السفر.', 'The number looks short. Please check the passport.');
      return res('ok', 'تم إدخال رقم الجواز.', 'The passport number has been entered.');
    },
    siteName: function (v) {
      var s = String(v || '').trim(); if (!s) return null;
      if (s.length < 14) return res('warn', 'يُرجى إضافة المحافظة والمدينة والمنطقة والشارع.', 'Please add the governorate, city, area and street.');
      return res('ok', 'العنوان تفصيلي بالقدر الكافي.', 'The address is sufficiently detailed.');
    },
    representedCompany: function (v) { return String(v || '').trim().length >= 3 ? res('ok', 'تم إدخال اسم الشركة.', 'The company name has been entered.') : null; },
    previousCompanyName: function (v) { return String(v || '').trim().length >= 3 ? res('ok', 'تم إدخال اسم الشركة. يُرجى التأكد من مطابقته للسجل.', 'The company name has been entered. Please make sure it matches the register.') : null; },
    companyName: function (v) {
      var s = String(v || '');
      if (!s.trim()) return null;
      if (/\s{2,}/.test(s)) return res('warn', 'توجد مسافات زائدة. يُرجى مطابقة الاسم مع السجل.', 'Extra spaces were found. Please match the name with the register exactly.');
      return s.trim().length < 4 ? res('warn', 'الاسم قصير. يُرجى التأكد منه.', 'The name is short. Please verify it.') : res('ok', 'يُرجى التأكد من أن الاسم مطابق للسجل التجاري حرفيًا.', 'Please make sure the name matches the commercial register exactly.');
    }
  };
  function beneficiaryCheck(v) {
    var n = num(v); if (!isFinite(n)) return null;
    if (n < 0 || n > 30 || Math.floor(n) !== n) return res('err', 'يُرجى إدخال عدد صحيح بين صفر و30.', 'Please enter a whole number between zero and 30.');
    return res('ok', n === 0 ? 'العدد صفر؛ لا يوجد مستفيدون سابقون.' : 'سيُطلب منكم تسجيل بيانات كل مستفيد.', n === 0 ? 'The number is zero; there are no previous beneficiaries.' : 'The details of each beneficiary will be requested.');
  }
  function nameCheck(v) {
    var s = String(v || '').trim(); if (!s) return null;
    if (/[0-9٠-٩]/.test(s)) return res('err', 'لا يجوز أن يحتوي الاسم على أرقام.', 'A name cannot contain digits.');
    if (s.split(/\s+/).length < 2) return res('warn', 'يُرجى التأكد من كتابة الاسم كاملًا كما ورد في جواز السفر.', 'Please make sure you have written the full name as shown in the passport.');
    return res('ok', 'تم إدخال الاسم.', 'The name has been entered.');
  }
  function countryCheck(v) {
    if (!String(v || '').trim()) return null;
    return /[0-9٠-٩]/.test(v) ? res('err', 'يُرجى كتابة اسم الدولة دون أرقام.', 'Please enter the country name without digits.') : res('ok', 'تم إدخال اسم الدولة.', 'The country name has been entered.');
  }

  /* ───────────────────────── تحليل الحقل ───────────────────────── */
  function keyOf(name) {
    if (!name) return '';
    var m = name.match(/^investor_\d+_(.+)$/); if (m) return m[1];
    m = name.match(/^previous(?:Residence|Visa)_\d+_(.+)$/);
    if (m) return PRIOR_MAP[m[1]] || (G[m[1]] ? m[1] : 'prior');
    if (/Currency$/.test(name)) return 'currency';
    return name;
  }
  function labelOf(el) {
    var f = el.closest('.rf-field'); if (!f) return '';
    var sp = f.querySelector(':scope > span') || f.querySelector('span');
    return sp ? sp.textContent.replace(/\*/g, '').replace(/\s+/g, ' ').trim() : '';
  }
  function isGuidable(el) {
    if (!el || !el.name || !mount || !mount.contains(el)) return false;
    var tag = el.tagName;
    if (tag !== 'INPUT' && tag !== 'SELECT' && tag !== 'TEXTAREA') return false;
    if (el.type === 'checkbox' || el.type === 'radio' || el.type === 'hidden' || el.type === 'button') return false;
    return !!el.closest('.rf-field');
  }
  function entry(key) { var g = G[key]; return g ? (g[lang()] || g.ar) : null; }
  function isFilled(el) { return String(el.value || '').trim() !== ''; }
  function visibleControls() {
    if (!mount) return [];
    return Array.prototype.filter.call(mount.querySelectorAll('input[name],select[name],textarea[name]'), function (e) {
      if (!isGuidable(e) || e.disabled) return false;
      var r = e.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
  }
  function requiredProgress() {
    var list = visibleControls().filter(function (e) { return e.required; });
    var done = list.filter(isFilled).length;
    return { done: done, total: list.length, firstEmpty: list.filter(function (e) { return !isFilled(e); })[0] || null };
  }
  function readStep() {
    var dots = mount ? mount.querySelectorAll('.rf-step-dot') : [];
    var idx = 0;
    for (var i = 0; i < dots.length; i++) if (dots[i].classList.contains('active')) idx = i;
    stepInfo.index = idx; stepInfo.total = dots.length || 6;
    var h = mount && mount.querySelector('.rf-group > h3'); stepInfo.title = h ? h.textContent.trim() : '';
  }

  /* ───────────────────────── الشخصية (طبقات صورة) ───────────────────────── */
  // الصورة مقسّمة إلى جسم + ساعد/يد (يدور حول المرفق) + رأس (يدور حول الرقبة).
  // الإحداثيات أدناه بوحدات الصورة المقصوصة (424×592).
  var CW = 424, CH = 592;
  var PIV = { x: 132, y: 504 };          // مرفق الذراع المشيرة — لا يتغير الجسم أو الذراع
  var TIP0 = { x: 24, y: 322 };          // رأس الإصبع في الوضع الأصلي
  var FINGER_DEG = -116;                 // اتجاه الإصبع في الوضع الأصلي (0 = يمين، -90 = أعلى)
  var HEAD_SCALE = 0.62;                // تصغير طبقات الرأس حول قاعدة الرقبة فقط
  var HEAD_PIVOT = { x: CW * 0.552, y: CH * 0.552 };
  var FACE_BASE = { x: 237, y: 182 };    // مركز الوجه قبل التصغير
  var FACE = {                            // مركز الوجه بعد التصغير حول محور الرقبة
    x: HEAD_PIVOT.x + (FACE_BASE.x - HEAD_PIVOT.x) * HEAD_SCALE,
    y: HEAD_PIVOT.y + (FACE_BASE.y - HEAD_PIVOT.y) * HEAD_SCALE
  };
  var TH_MIN = -50, TH_MAX = 6;          // مدى دوران الساعد (درجات)
  var ASSET_BASE = (function () {
    var s = document.currentScript || document.querySelector('script[src*="advisor.js"]');
    try { return new URL('../assets/advisor/', s && s.src ? s.src : location.href).href; } catch (_) { return '../assets/advisor/'; }
  })();
  var FIG = '' +
'<div class="adv-pfig" id="advPfig" aria-hidden="true">' +
  '<img class="adv-p-body" src="' + ASSET_BASE + 'body.webp" alt="" draggable="false">' +
  '<div class="adv-p-arm"><div class="adv-p-poke"><img src="' + ASSET_BASE + 'forearm.webp" alt="" draggable="false"></div></div>' +
  '<div class="adv-p-head"><div class="adv-p-head-act">' +
    '<div class="adv-p-head-sway">' +
      '<img class="adv-p-head-base" src="' + ASSET_BASE + 'head.webp" alt="" draggable="false">' +
      '<img class="adv-p-eyes" src="' + ASSET_BASE + 'eyes.webp" alt="" draggable="false">' +
      '<img class="adv-p-mouth" src="' + ASSET_BASE + 'mouth.webp" alt="" draggable="false">' +
      '<canvas class="adv-p-face" width="848" height="1184" aria-hidden="true"></canvas>' +
    '</div>' +
  '</div></div>' +
'</div>';

  /* ───────────────────────── بناء الواجهة ───────────────────────── */
  /* نظام حركة الوجه (js/advisor-face.js): جفون/قزحية/فم/رأس. إن تعذّر تحميله تبقى الصور الثابتة مع حركات CSS القديمة. */
  var face = null;
  function initFace() {
    face = null;
    if (!window.GOVESER_AdvisorFace || !pfig) return;
    try {
      face = window.GOVESER_AdvisorFace.create({
        canvas: pfig.querySelector('.adv-p-face'),
        headAct: pfig.querySelector('.adv-p-head-sway'),
        base: ASSET_BASE,
        reduced: function () { return reduced; },
        visible: function () { return !!(stage && stage.isConnected && !stage.hidden); },
        onReady: function () { if (pfig) pfig.classList.add('is-rig'); },
        onFail: function () { face = null; }
      });
    } catch (_) { face = null; }
  }
  function buildStage() {
    if (stage || !mount) return;
    stage = document.createElement('div');
    stage.id = 'advStage'; stage.className = 'adv-stage';
    mount.parentNode.insertBefore(stage, mount);
    main = document.createElement('div'); main.className = 'adv-main';
    stage.appendChild(main); main.appendChild(mount);

    rail = document.createElement('aside');
    rail.className = 'adv-rail'; rail.setAttribute('aria-label', t('name'));
    rail.innerHTML =
      '<div class="adv-actor" id="advActor">' +
        '<div class="adv-figure" id="advFigure">' + FIG + '<div class="adv-plate" id="advPlate"></div></div>' +
        '<section class="adv-brief" id="advBrief" role="region"></section>' +
      '</div>';
    stage.appendChild(rail);
    actor = rail.querySelector('#advActor'); figBox = rail.querySelector('#advFigure'); brief = rail.querySelector('#advBrief'); plate = rail.querySelector('#advPlate'); plate.addEventListener('click', onBriefClick);
    pfig = figBox.querySelector('#advPfig');
    pfig.style.setProperty('--head-scale', String(HEAD_SCALE));
    initFace();

    beam = document.createElementNS(NS, 'svg');
    beam.setAttribute('class', 'adv-beam'); beam.setAttribute('aria-hidden', 'true');
    beam.innerHTML = '<defs><linearGradient id="advBeamG" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f97316" stop-opacity=".20"/><stop offset="1" stop-color="#f97316" stop-opacity=".03"/></linearGradient></defs><path id="advBeamP" d="" fill="url(#advBeamG)"/><circle id="advTipDot" r="0" fill="#f97316" fill-opacity=".9"/><path id="advBeamL" d="" fill="none" stroke="#f97316" stroke-opacity=".4" stroke-width="1.4" stroke-dasharray="3 6" stroke-linecap="round"/>';
    stage.appendChild(beam);
    tipDot = beam.querySelector('#advTipDot'); beamPath = beam.querySelector('#advBeamP'); beamLine = beam.querySelector('#advBeamL'); beamGrad = beam.querySelector('#advBeamG');

    pill = document.createElement('button');
    pill.type = 'button'; pill.className = 'adv-pill'; pill.hidden = true;
    pill.addEventListener('click', unmute);
    document.body.appendChild(pill);

    brief.addEventListener('click', onBriefClick);
    brief.addEventListener('change', onBriefChange);
    rail.addEventListener('pointerdown', function () { run.railPtr = Date.now(); }, true);
    applyMode();
  }
  function onBriefChange(e) {
    var el = e.target; if (!el || !el.classList) return;
    if (el.classList.contains('adv-v-rate')) setRate(el.value);
    else if (el.classList.contains('adv-v-voice')) { setVoiceChoice(el.value); if (sp.playing) stopSpeech(); toggleListen(); }
  }

  function applyMode() {
    if (!stage) return;
    var wide = window.innerWidth >= RAIL_MIN_WIDTH;
    dockMode = !wide;
    stage.classList.toggle('adv-off', muted);
    stage.classList.toggle('adv-rail-on', !muted && wide);
    stage.classList.toggle('adv-dock', !muted && !wide);
    document.body.classList.toggle('adv-dock-open', !muted && !wide && !stage.hidden);
    pill.textContent = t('show');
    pill.hidden = !muted || stage.hidden;
    rail.hidden = muted;
    if (beam) beam.style.display = (muted || dockMode) ? 'none' : '';
  }

  /* ───────────────────────── بطاقة الإرشاد ───────────────────────── */
  function statusFor(el, key) {
    var v = el.value;
    var fn = V[key];
    var r = null;
    if (fn) { try { r = fn(v, el); } catch (_) { r = null; } }
    if (r) return { s: r.s, m: L2(r.m) };
    if (el.tagName === 'SELECT') {
      if (!v) return null;
      var g = entry(key);
      if (key === 'companyLaw' && v === 'unknown') return { s: 'warn', m: lang() === 'en' ? 'Not identified yet. Check the commercial register.' : 'لم تُحدّد القانون بعد. راجع السجل التجاري.' };
      if (key === 'legalForm' && v === 'unknown') return { s: 'warn', m: lang() === 'en' ? 'Not identified yet. Check the register or deed.' : 'لم تُحدّد الشكل بعد. راجع السجل أو عقد التأسيس.' };
      return { s: 'ok', m: (g && g.o && g.o[v]) || t('filled') };
    }
    if (el.type === 'date' && v) return { s: 'ok', m: t('filled') };
    if (isFilled(el)) return { s: 'ok', m: t('filled') };
    return null;
  }

  function neighbors() {
    var list = visibleControls(), i = list.indexOf(cur && cur.el);
    return { prev: i > 0 ? list[i - 1] : null, next: (i >= 0 && i < list.length - 1) ? list[i + 1] : null, list: list, i: i };
  }

  function renderBrief(opts) {
    if (!brief) return;
    opts = opts || {};
    readStep();
    var ar = lang() === 'ar';
    brief.setAttribute('dir', ar ? 'rtl' : 'ltr');
    var st = STEPS[Math.min(stepInfo.index, STEPS.length - 1)];
    var stx = st ? st[ar ? 'ar' : 'en'] : ['', '', []];
    var prog = requiredProgress();
    var pct = prog.total ? Math.round(prog.done / prog.total * 100) : 0;

    var hideBtn = '<button type="button" class="adv-x" data-act="hide" title="' + esc(t('hide')) + '" aria-label="' + esc(t('hide')) + '"><svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>';
    plate.innerHTML =
      '<div class="adv-b-id"><strong>' + esc(t('name')) + '</strong><small>' + esc(t('role')) + '</small></div>' +
      '<div class="adv-tools">' + voiceBtns() + hideBtn + '</div>';
    var stepBar =
      '<div class="adv-b-step"><span>' + esc(t('step')) + ' ' + (stepInfo.index + 1) + ' ' + esc(t('of')) + ' ' + stepInfo.total + '</span>' +
      '<i class="adv-bar" aria-hidden="true"><b style="width:' + pct + '%"></b></i>' +
      '<span class="adv-b-pct">' + prog.done + '/' + prog.total + '</span></div>';

    var body = '';
    if (cur && cur.el && document.contains(cur.el)) {
      var key = cur.key, g = entry(key), label = labelOf(cur.el) || key;
      var req = cur.el.required;
      var rows = '';
      var what = g && g.w ? g.w : t('generic');
      rows += '<p class="adv-what">' + esc(what) + '</p>';
      var meta = '';
      if (g && g.f) meta += '<div class="adv-row"><span>' + esc(t('where')) + '</span><p>' + esc(g.f) + '</p></div>';
      if (g && g.e) meta += '<div class="adv-row"><span>' + esc(t('example')) + '</span><p class="adv-ex" dir="ltr">' + esc(g.e) + '</p></div>';
      if (g && g.t) meta += '<div class="adv-row adv-row-tip"><span>' + esc(t('tip')) + '</span><p>' + esc(g.t) + '</p></div>';
      var optsHtml = '';
      if (g && g.o && cur.el.tagName === 'SELECT') {
        var items = Array.prototype.filter.call(cur.el.options, function (o) { return o.value && g.o[o.value]; });
        if (items.length) {
          optsHtml = '<details class="adv-opts"' + (opts.openOpts ? ' open' : '') + '><summary>' + esc(t('choose')) + '</summary><ul>' +
            items.map(function (o) { return '<li' + (o.value === cur.el.value ? ' class="is-sel"' : '') + '><b>' + esc(o.textContent.trim()) + '</b><span>' + esc(g.o[o.value]) + '</span></li>'; }).join('') + '</ul></details>';
        }
      }
      body =
        '<div class="adv-b-title"><h3>' + esc(label) + '</h3><em class="adv-tag ' + (req ? 'is-req' : 'is-opt') + '">' + esc(req ? t('req') : t('opt')) + '</em></div>' +
        '<div class="adv-status" id="advStatus" role="status" aria-live="polite"></div>' +
        rows + ((meta || optsHtml) ? '<button type="button" class="adv-more" data-act="more">' + esc(t(expanded ? 'less' : 'more')) + '</button>' : '') + '<div class="adv-meta">' + meta + '</div>' + optsHtml;
    } else if (opts.complete) {
      body =
        '<div class="adv-b-title"><h3>' + esc(t('done')) + '</h3></div>' +
        '<p class="adv-what">' + esc(t('pressNext')) + '</p><button type="button" class="adv-go" data-act="gonext">' + esc(t('goNext')) + '</button>';
    } else {
      var intro = '<div class="adv-b-title"><h3>' + esc(stx[0]) + '</h3></div><p class="adv-what">' + esc(!introShown ? t('welcome') : stx[1]) + '</p>';
      var bring = (stx[2] && stx[2].length) ? '<div class="adv-bring"><span>' + esc(t('bring')) + '</span><ul>' + stx[2].map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' : '';
      var go = prog.firstEmpty ? '<button type="button" class="adv-go" data-act="start">' + esc(t('start')) + '</button>' : '';
      body = intro + bring + go;
    }

    var nb = neighbors();
    var foot = '';
    if (cur && cur.el) {
      foot =
        '<footer class="adv-b-foot">' +
          '<button type="button" class="adv-nav" data-act="prev"' + (nb.prev ? '' : ' disabled') + '>' + esc(t('prev')) + '</button>' +
          '<button type="button" class="adv-nav adv-nav-main" data-act="next"' + (nb.next ? '' : ' disabled') + '>' + esc(t('next')) + '</button>' +
        '</footer>';
    }
    brief.classList.toggle('is-open', expanded);
    brief.innerHTML = '<div class="adv-tools adv-tools-dock">' + voiceBtns() + hideBtn + '</div>' + stepBar + '<p class="adv-v-note" hidden></p><div class="adv-b-body">' + body + '</div>' + voiceSettingsHtml() + foot + ((cur && cur.el) ? '' : '<p class="adv-disc">' + esc(t('disclaimer')) + '</p>');
    refreshStatus();
    updateVoiceUi();
  }

  function refreshStatus() {
    var box = brief && brief.querySelector('#advStatus');
    if (!box || !cur || !cur.el) return;
    var s = cur.forced || statusFor(cur.el, cur.key);
    var req = cur.el.required;
    if (!s) { box.className = 'adv-status'; box.innerHTML = ''; box.hidden = true; return; }
    box.hidden = false;
    box.className = 'adv-status is-' + s.s;
    var icon = s.s === 'ok' ? '<path d="M3.5 8.5l3 3 6-7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
      : s.s === 'warn' ? '<path d="M8 3v6M8 12v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
      : '<path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
    box.innerHTML = '<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">' + icon + '</svg><span>' + esc(s.m) + '</span>';
    void req;
  }

  function onBriefClick(e) {
    var b = e.target.closest && e.target.closest('[data-act]'); if (!b) return;
    var act = b.getAttribute('data-act');
    if (act === 'hide') { mute(); return; }
    if (act === 'vmute') { setVoiceOn(!voiceOn); return; }
    if (act === 'listen') { toggleListen(); return; }
    if (act === 'more') { expanded = !expanded; brief.classList.toggle('is-open', expanded); b.textContent = t(expanded ? 'less' : 'more'); layout(); return; }
    if (act === 'gonext') { var nx = mount && mount.querySelector('#rfNext'); if (nx) { try { nx.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' }); } catch (_) {} setTimeout(function () { aim(); }, 450); } return; }
    if (act === 'start') { var p = requiredProgress(); if (p.firstEmpty) goTo(p.firstEmpty); return; }
    if (act === 'next' || act === 'prev') { var nb = neighbors(); var tg = act === 'next' ? nb.next : nb.prev; if (tg) goTo(tg); }
  }
  function goTo(el) {
    try { el.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' }); } catch (_) {}
    try { el.focus({ preventScroll: true }); } catch (_) { el.focus(); }
  }

  /* ───────────────────────── تنشيط الحقل ───────────────────────── */
  function activate(el, force) {
    if (muted || !stage || !isGuidable(el)) return;
    var key = keyOf(el.name);
    var same = cur && cur.name === el.name;
    if (!same) relaxFace();
    cur = { el: el, name: el.name, key: key, forced: null };
    markTarget(el);
    if (!same || force) {
      expanded = false; renderBrief();
      if (!scheduleSpeech(function () { return cardParts(false); })) speak();   // بلا صوت: حركة فم قصيرة فقط
    } else { refreshStatus(); }
    aim();
  }
  function deactivate() {
    if (!cur) return;
    relaxFace();
    cur = null;
    clearTarget();
    renderBrief(complete() ? { complete: true } : {});
    aim();
    autoIntroSpeech();
  }
  function complete() { var p = requiredProgress(); return p.total > 0 && p.done === p.total; }

  function markTarget(el) {
    clearTarget();
    var f = el.closest('.rf-field'); if (f) f.classList.add('advisor-target');
  }
  function clearTarget() {
    if (!mount) return;
    var list = mount.querySelectorAll('.advisor-target,.advisor-pulse');
    for (var i = 0; i < list.length; i++) { list[i].classList.remove('advisor-target'); list[i].classList.remove('advisor-pulse'); }
  }

  /* ───────────────────────── الحركة والتوجيه ───────────────────────── */
  function pointerTarget() {
    // يعيد { el, x, y, h } بإحداثيات الشاشة: أقرب حافة لعنصر التحكم
    var el = cur && cur.el;
    if (!el || !document.contains(el)) {
      var nb = mount && mount.querySelector('#rfNext');
      if (cur === null && nb && complete()) el = nb; else return null;
    }
    var r = el.getBoundingClientRect(); if (!r.width && !r.height) return null;
    var rr = rail.getBoundingClientRect(), railOnRight = rr.left + rr.width / 2 > window.innerWidth / 2;
    return { el: el, x: railOnRight ? r.right : r.left, y: r.top + r.height / 2, h: r.height, w: r.width, railOnRight: railOnRight };
  }

  function aim() {
    if (!stage || muted) return;
    run.pointer = null;
    if (!cur) {
      var te = currentTargetEl();
      clearTarget();
      if (te && te.id === 'rfNext') te.classList.add('advisor-pulse');
      else if (te) { var f = te.closest('.rf-field'); if (f) f.classList.add('advisor-target'); }
    }
    kick();
  }
  function introPoint() {
    // في بداية الخطوة: أشِر إلى أول حقل مطلوب فارغ إن كان ظاهرًا على الشاشة
    if (cur) return false;
    var p = requiredProgress(); if (!p.firstEmpty) return false;
    var r = p.firstEmpty.getBoundingClientRect();
    return r.top > HEADER_OFFSET && r.bottom < window.innerHeight - 20;
  }
  function currentTargetEl() {
    if (cur && cur.el && document.contains(cur.el)) return cur.el;
    if (!cur) {
      if (complete()) { var nx = mount.querySelector('#rfNext'); if (nx) { var nr = nx.getBoundingClientRect(); if (nr.top > HEADER_OFFSET && nr.bottom < window.innerHeight - 10) return nx; } return null; }
      if (introPoint()) return requiredProgress().firstEmpty;
    }
    return null;
  }

  function kick() { if (!run.raf) run.raf = requestAnimationFrame(tick); }
  function ease(x) { return x * x * (3 - 2 * x); }

  function tick() {
    run.raf = 0;
    if (!stage || muted || stage.hidden) return;
    var moving = false;

    if (dockMode) { updateGaze(null); return; }

    // 1) ارتفاع الممثل داخل المسرح
    var tel = currentTargetEl();
    var sr = stage.getBoundingClientRect();
    var pf0 = pfig.getBoundingClientRect(), sc = pf0.width / CW;
    var actorH = actor.offsetHeight;
    var tgt = null;
    if (tel) {
      var tr = tel.getBoundingClientRect();
      tgt = tr;
      var wantTop = (tr.top + tr.height / 2 - sr.top) - (PIV.y - 70) * sc;
      var vTop = HEADER_OFFSET - sr.top + 8, vBot = window.innerHeight - sr.top - actorH - 80;
      if (vBot < vTop) vBot = vTop;
      wantTop = Math.max(vTop, Math.min(vBot, wantTop));
      wantTop = Math.max(0, Math.min(Math.max(0, sr.height - actorH), wantTop));
      run.aty = wantTop;
    } else {
      var vT = HEADER_OFFSET - sr.top + 8;
      run.aty = Math.max(0, Math.min(Math.max(0, sr.height - actorH), vT));
    }
    var dy = run.aty - run.ay;
    if (reduced || Math.abs(dy) < 0.5) run.ay = run.aty; else { run.ay += dy * 0.2; moving = true; }
    actor.style.transform = 'translate3d(0,' + run.ay.toFixed(1) + 'px,0)';

    // 2) الاتجاه (انعكاس الصورة) ثم دوران الساعد حول المرفق
    var rrect = rail.getBoundingClientRect(), onRight = rrect.left + rrect.width / 2 > window.innerWidth / 2;
    var flip = !onRight;                       // الصورة الأصلية تشير لليسار
    if (flip !== run.flip) { run.flip = flip; figBox.classList.toggle('is-flip', flip); pf0 = pfig.getBoundingClientRect(); }
    var pf = pf0;
    var T = null, Pl = null;
    if (tel && tgt) {
      T = { x: onRight ? tgt.right : tgt.left, y: tgt.top + tgt.height / 2, h: tgt.height };
      Pl = { x: flip ? pf.right - T.x : T.x - pf.left, y: T.y - pf.top };      // إحداثيات محلية (بلا انعكاس)
    }
    run.thWant = Pl ? solveTheta(Pl.x, Pl.y, sc) : 0;
    var dth = run.thWant - run.th;
    if (reduced || Math.abs(dth) < 0.15) run.th = run.thWant; else { run.th += dth * 0.2; moving = true; }
    pfig.style.setProperty('--th', run.th.toFixed(2));

    var tip = null;
    if (Pl && Math.abs(run.thWant - run.th) < 14) {
      var tp = tipAt(run.th, sc);
      tip = { x: flip ? pf.right - tp.x : pf.left + tp.x, y: pf.top + tp.y };
    }
    pfig.classList.toggle('is-pointing', !!tip);

    // 3) الشعاع
    drawBeam(tip, T, sr);

    // 4) النظرة والرأس
    updateGaze(Pl, sc);

    if (moving) kick();
  }

  function drawBeam(tip, T, sr) {
    if (!beamPath) return;
    if (!tip || !T) { beamPath.setAttribute('d', ''); beamLine.setAttribute('d', ''); tipDot.setAttribute('r', 0); return; }
    var x0 = tip.x - sr.left, y0 = tip.y - sr.top, x1 = T.x - sr.left, y1 = T.y - sr.top;
    tipDot.setAttribute('cx', x0.toFixed(1)); tipDot.setAttribute('cy', y0.toFixed(1)); tipDot.setAttribute('r', 3.4);
    var hh = Math.min(26, Math.max(14, T.h / 2 + 4));
    var gap = Math.hypot(x1 - x0, y1 - y0);
    if (gap < 26) { beamPath.setAttribute('d', ''); beamLine.setAttribute('d', ''); tipDot.setAttribute('r', 0); return; }
    beamPath.setAttribute('d', 'M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + 'L' + x1.toFixed(1) + ' ' + (y1 - hh).toFixed(1) + 'L' + x1.toFixed(1) + ' ' + (y1 + hh).toFixed(1) + 'Z');
    beamLine.setAttribute('d', 'M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + 'L' + x1.toFixed(1) + ' ' + y1.toFixed(1));
    beamGrad.setAttribute('x1', x0.toFixed(1)); beamGrad.setAttribute('y1', y0.toFixed(1));
    beamGrad.setAttribute('x2', x1.toFixed(1)); beamGrad.setAttribute('y2', y1.toFixed(1));
  }

  function tipAt(th, sc) {
    var r = th * Math.PI / 180, c = Math.cos(r), sn = Math.sin(r);
    var vx = (TIP0.x - PIV.x) * sc, vy = (TIP0.y - PIV.y) * sc;
    return { x: PIV.x * sc + vx * c - vy * sn, y: PIV.y * sc + vx * sn + vy * c };
  }
  // أفضل زاوية للساعد بحيث يتجه الإصبع نحو الهدف (بالإحداثيات المحلية)
  function solveTheta(lx, ly, sc) {
    var best = 0, bestE = 1e9;
    for (var th = TH_MAX; th >= TH_MIN; th -= 1) {
      var tp = tipAt(th, sc);
      var want = Math.atan2(ly - tp.y, lx - tp.x) * 180 / Math.PI;
      var e = Math.abs(((want - (FINGER_DEG + th)) % 360 + 540) % 360 - 180);
      if (tp.x < lx - 4) e += 40;                    // لا يتجاوز الإصبع الحقل
      if (e < bestE) { bestE = e; best = th; }
    }
    return best;
  }

  function updateGaze(Pl, sc) {
    if (!pfig) return;
    var hr = 0, hx = 0, hy = 0;
    if (Pl && sc) {
      var dx = Pl.x / sc - FACE.x, dy = Pl.y / sc - FACE.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
      // التفات محدود وهادئ من الرقبة؛ لا ندوّر الجذع ولا نبالغ في ميل الرأس.
      hr = Math.max(-2.4, Math.min(2.4, dx / 120));
      hx = dx / d * 1.5; hy = Math.max(-0.8, Math.min(1.1, dy / d * 1.3));
    }
    pfig.style.setProperty('--hr', hr.toFixed(2)); pfig.style.setProperty('--hx', hx.toFixed(2)); pfig.style.setProperty('--hy', hy.toFixed(2));
    if (face) {
      if (Pl && sc) { var gdx = Pl.x / sc - FACE.x, gdy = Pl.y / sc - FACE.y, gd = Math.sqrt(gdx * gdx + gdy * gdy) || 1; face.look({ nx: gdx / gd, ny: gdy / gd }); }
      else face.look(null);
    }
  }

  /* ───────────────────────── النطق الصوتي (Web Speech API) ─────────────────────────
     • اللغة: تتبع لغة الصفحة (عربي/إنجليزي)، ويُختار أفضل صوت متاح للغة تلقائيًا (أو الصوت الذي اختاره المستخدم).
     • الوقفات: يُقسَّم النص عند علامات الترقيم إلى مقاطع قصيرة، وتُفصل بينها وقفات مختلفة المدة
       (نهاية الجملة > السؤال > النقطتان والفاصلة المنقوطة > الفاصلة)، وتُترك وقفة أطول بين أجزاء الشرح.
     • التهيئة: تُحوَّل الرموز (٪ و+20 وEGP وUSD والأقواس والشرطات والشرطة المائلة) إلى كلمات تُنطق نطقًا سليمًا.
     • الكتم: زر مستقل عن إخفاء المرشد، يُحفظ في المتصفح. زر «استماع» يعمل دائمًا بطلب صريح من المستخدم.
     • الأمان: لا ينطق إلا إذا وُجد صوت للغة؛ ويتوقف عند إخفاء التبويب أو مغادرة الصفحة أو تغيير اللغة. */
  var synth = null, canSpeak = false;
  try { synth = window.speechSynthesis || null; canSpeak = !!(synth && window.SpeechSynthesisUtterance); } catch (_) { synth = null; canSpeak = false; }
  // الصوت السحابي لا يحتاج speechSynthesis (مثل متصفحات التطبيقات الداخلية)
  try { var C0 = window.GOVESER_ADVISOR_CONFIG; if (C0 && C0.ttsEndpoint && window.fetch) canSpeak = true; } catch (_) {}
  var voiceOn = true, rateKey = 'normal';
  try { voiceOn = localStorage.getItem(STORAGE_VOICE) !== '0'; } catch (_) {}
  try { var rk0 = localStorage.getItem(STORAGE_RATE); if (rk0 === 'slow' || rk0 === 'fast') rateKey = rk0; } catch (_) {}
  var RATES = { slow: 0.8, normal: 0.95, fast: 1.12 };
  var PAUSE = { sentence: 480, question: 540, colon: 300, comma: 190, section: 720, none: 320 };
  var LOCALE_PREF = { ar: ['ar-sa', 'ar-eg', 'ar-ae', 'ar-xa'], en: ['en-us', 'en-gb', 'en-au', 'en-ca'] };
  var sp = { q: [], tok: 0, playing: false, curAlert: false, timer: 0, wd: 0, autoT: 0, utter: null, voices: [], ready: false, code: 'ar', lastKey: '', welcomed: false };

  function loadVoices() {
    if (!canSpeak) return;
    try { sp.voices = synth.getVoices() || []; } catch (_) { sp.voices = []; }
    if (sp.voices.length) sp.ready = true;
  }
  function vid(v) { return (v && (v.voiceURI || v.name)) || ''; }
  function langVoices(code) {
    return sp.voices.filter(function (v) { return String(v.lang || '').toLowerCase().replace('_', '-').split('-')[0] === code; });
  }
  function scoreVoice(v, code) {
    var n = (v.name || '') + ' ' + (v.voiceURI || ''), s = 0, loc = String(v.lang || '').toLowerCase().replace('_', '-');
    if (/natural|neural|online|premium|enhanced|wavenet|studio/i.test(n)) s += 40;
    if (/google|microsoft/i.test(n)) s += 10;
    var i = LOCALE_PREF[code].indexOf(loc); if (i >= 0) s += 12 - i * 2;
    if (v.localService) s += 1;
    if (/compact|espeak/i.test(n)) s -= 20;
    return s;
  }
  /* تصنيف الجنس من اسم الصوت (المتصفحات لا تكشف الجنس صراحة) */
  var MALE_RE = /(^|[^a-z])(naayf|nayef|hamed|hamdan|shakir|fahed|moaz|jaber|laith|taim|bassel|rami|ismael|abdullah|omar|saleh|salem|maged|majed|tarik|tareq|youssef|yousef|khaled|zayd|zaid|david|mark|george|richard|james|guy|ryan|christopher|eric|roger|steffan|brian|andrew|davis|jason|tony|daniel|alex|fred|aaron|arthur|gordon|oliver|thomas|rishi|ravi|sean|liam|william|neil|alfie|mitchell|prabhat|male|man)([^a-z]|$)/i;
  var FEMALE_RE = /(^|[^a-z])(zira|hazel|susan|samantha|victoria|karen|moira|tessa|fiona|aria|jenny|michelle|sonia|libby|natasha|clara|emma|nancy|allison|ava|joanna|salli|kendra|kimberly|ivy|female|woman|zoe|catherine|heera|neerja|laura|linda|siri|amy|jane|sara|salma|zariyah|laila|layla|mariam|maryam|amina|aysha|noura|fatima|reem|amany|sana|rana|iman|amal|hoda|nora|kate|serena|veena|ioana|lekha|mia|lucy|olivia|sophia)([^a-z]|$)/i;
  function genderOf(v) {
    var n = ((v && v.name) || '') + ' ' + ((v && v.voiceURI) || '');
    if (/\bfemale\b|\bwoman\b/i.test(n)) return 'female';
    if (/\bmale\b|\bman\b/i.test(n)) return 'male';
    if (FEMALE_RE.test(n)) return 'female';
    if (MALE_RE.test(n)) return 'male';
    return 'unknown';
  }
  var CFG = window.GOVESER_ADVISOR_CONFIG || { ttsEndpoint: 'https://goveser-tts.ai-chat-bot-2030.workers.dev/tts', strictMale: true, ttsAlways: true };
  function remoteAvail() { return !!(CFG.ttsEndpoint && window.fetch); }
  // الأصوات المقترحة: الرجال أولًا؛ تُستبعد الأصوات النسائية المعروفة ما دام يوجد غيرها
  function candidates(code) {
    var list = langVoices(code), ok = list.filter(function (v) { return genderOf(v) !== 'female'; });
    if (ok.length) list = ok;
    return list.slice().sort(function (a, b) {
      var ga = genderOf(a) === 'male' ? 1 : 0, gb = genderOf(b) === 'male' ? 1 : 0;
      return (gb - ga) || (scoreVoice(b, code) - scoreVoice(a, code));
    });
  }
  function voiceFor(code) {
    var list = candidates(code); if (!list.length) return null;
    var saved = ''; try { saved = localStorage.getItem(STORAGE_VSEL + code) || ''; } catch (_) {}
    if (saved) for (var i = 0; i < list.length; i++) if (vid(list[i]) === saved) return list[i];
    return list[0];
  }
  function maleVoice(code) { var v = voiceFor(code); return !!(v && genderOf(v) === 'male'); }
  // هل نستعمل الصوت السحابي (رجل) لهذه اللغة؟ عند عدم وجود صوت رجل في الجهاز، أو إن طُلب دائمًا
  function useRemote(code) { return remoteAvail() && (CFG.ttsAlways === true || !maleVoice(code)); }
  function voiceUsable() { return canSpeak && voiceOn && !muted && (!!voiceFor(lang()) || remoteAvail()); }

  /* ── تهيئة النص للنطق ── */
  function prepSpeech(str, code) {
    var ar = code === 'ar';
    var s = String(str == null ? '' : str);
    s = s.replace(/[«»“”"]/g, '').replace(/[‘’]/g, "'");
    s = s.replace(/\+\s?20(?=\D|$)/g, ar ? 'زائد عشرين' : 'plus twenty');
    s = s.replace(/(\d+(?:\.\d+)?)\s*(?:%|٪)/g, ar ? '$1 بالمئة' : '$1 percent');
    var prev; do { prev = s; s = s.replace(/(\d),(?=\d{3}(?!\d))/g, '$1'); } while (s !== prev);
    s = s.replace(/\bEGP\s*(\d+)/g, '$1 Egyptian pounds').replace(/\bUSD\s*(\d+)/g, '$1 US dollars').replace(/\bEGP\b/g, 'Egyptian pounds').replace(/\bUSD\b/g, 'US dollars');
    var cm = ar ? '،' : ',';
    s = s.replace(/\s*[()（）]\s*/g, cm + ' ');
    s = s.replace(/\s+[–—-]\s+/g, cm + ' ');
    s = s.replace(/\s*\/\s*/g, ar ? ' أو ' : ' or ');
    s = s.replace(/…|\.{3}/g, cm + ' ');
    s = s.replace(/[,،]\s*[,،]+/g, cm).replace(/[,،]\s*([.؟?؛;:!])/g, '$1').replace(/^[,،]\s*/, '').replace(/\s+([،,.؟?؛;:!])/g, '$1').replace(/\s{2,}/g, ' ');
    return s.trim();
  }

  /* ── التقطيع الذكي عند علامات الترقيم ── */
  function splitSentences(s) {
    var out = [], buf = '', i, ch, nx, rest;
    for (i = 0; i < s.length; i++) {
      ch = s.charAt(i); buf += ch;
      if (ch === '.' || ch === '!' || ch === '?' || ch === '؟') {
        nx = s.charAt(i + 1);
        if (nx === '' || /\s/.test(nx)) {
          rest = s.slice(i + 1).replace(/^\s+/, '');
          if (rest === '' || !/^\d/.test(rest)) { out.push(buf.trim()); buf = ''; }   // لا يُقسَّم عند «No. 72»
        }
      }
    }
    if (buf.trim()) out.push(buf.trim());
    return out;
  }
  function splitKeep(str, re, minLen) {
    var out = [], buf = '', i, ch, pv, nx;
    for (i = 0; i < str.length; i++) {
      ch = str.charAt(i); buf += ch;
      if (re.test(ch)) {
        pv = str.charAt(i - 1); nx = str.charAt(i + 1);
        if (/\d/.test(pv) && /\d/.test(nx)) continue;                              // 10:30 أو 1,000
        if (buf.trim().length >= minLen && str.slice(i + 1).trim().length >= minLen) { out.push(buf.trim()); buf = ''; }
      }
    }
    if (buf.trim()) out.push(buf.trim());
    return out;
  }
  function hardSplit(p, max) {
    var out = [];
    while (p.length > max) {
      var cut = p.lastIndexOf(' ', max); if (cut < max * 0.5) cut = max;
      out.push(p.slice(0, cut).trim()); p = p.slice(cut).trim();
    }
    if (p) out.push(p);
    return out;
  }
  function chunkText(text) {
    var out = [];
    splitSentences(text).forEach(function (sent) {
      splitKeep(sent, /[؛;:]/, 12).forEach(function (p) {
        (p.length > 70 ? splitKeep(p, /[،,]/, 24) : [p]).forEach(function (q) {
          hardSplit(q, 190).forEach(function (z) { out.push(z); });
        });
      });
    });
    return out.filter(function (x) { return /[0-9A-Za-z؀-ۿ]/.test(x); });
  }
  function pauseFor(chunk) {
    var c = chunk.slice(-1);
    if (c === '؟' || c === '?') return PAUSE.question;
    if (c === '.' || c === '!') return PAUSE.sentence;
    if (c === ':' || c === '؛' || c === ';') return PAUSE.colon;
    if (c === '،' || c === ',') return PAUSE.comma;
    return PAUSE.none;
  }
  function segmentize(parts, code, isAlert) {
    var segs = [];
    parts.forEach(function (part) {
      var text = prepSpeech(part, code); if (!text) return;
      var chunks = chunkText(text);
      chunks.forEach(function (c, i) {
        var p = pauseFor(c);
        if (i === chunks.length - 1) p = Math.max(p, PAUSE.section);
        segs.push({ t: c, p: p, a: !!isAlert });
      });
    });
    if (segs.length) segs[segs.length - 1].p = 0;
    return segs;
  }

  /* ── التشغيل والإيقاف ── */
  function setTalking(on) { if (actor) actor.classList.toggle('is-speaking', !!on); }
  function alertPending() { return sp.curAlert || sp.q.some(function (x) { return x.a; }); }

  function stopSpeech() {
    sp.tok++; clearTimeout(sp.timer); clearTimeout(sp.wd); clearTimeout(sp.autoT);
    sp.q = []; sp.playing = false; sp.curAlert = false; sp.utter = null;
    if (canSpeak) { try { synth.cancel(); } catch (_) {} }
    stopRemote(); if (face) face.speakEnd();
    setTalking(false); updateVoiceUi();
  }
  /* صوت سحابي لرجل (اختياري): GOVESER_ADVISOR_CONFIG.ttsEndpoint — انظر tools/tts-worker */
  var remote = { el: null, audio: null, node: null, ctx: null, an: null, buf: null, raf: 0, url: '', cache: {}, n: 0 };
  /* عنصر صوت واحد دائم، يُفتح بأول لمسة من المستخدم (شرط iOS وAndroid لتشغيل الصوت بعد جلب غير متزامن) */
  function actx() {
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    try { remote.ctx = remote.ctx || new AC(); if (remote.ctx.state === 'suspended') remote.ctx.resume(); } catch (_) {}
    return remote.ctx;
  }
  function audioEl() {
    if (!remote.audio) { remote.audio = new Audio(); remote.audio.preload = 'auto'; try { remote.audio.setAttribute('playsinline', ''); } catch (_) {} }
    var c = remote.ctx;   // تحليل الشدة (لحركة الفم) فقط إن كان السياق يعمل، وإلا يبقى الصوت مباشرًا بلا Web Audio
    if (!remote.node && c && c.state === 'running') {
      try { remote.node = c.createMediaElementSource(remote.audio); remote.an = c.createAnalyser(); remote.an.fftSize = 512; remote.buf = new Uint8Array(remote.an.fftSize); remote.node.connect(remote.an); remote.an.connect(c.destination); } catch (_) { remote.node = null; remote.an = null; }
    }
    return remote.audio;
  }
  var SILENT = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
  function unlockAudio() {
    if (remote.unlocked || !CFG.ttsEndpoint) return; remote.unlocked = true;
    actx();
    try { var a = audioEl(); a.src = SILENT; var pr = a.play(); if (pr && pr.catch) pr.catch(function () {}); } catch (_) {}
  }
  ['pointerdown', 'touchend', 'keydown', 'click'].forEach(function (ev) { try { document.addEventListener(ev, unlockAudio, { once: true, passive: true, capture: true }); } catch (_) {} });
  /* جلب مسبق: يبدأ جلب المقطعين التاليين أثناء نطق الحالي فلا يوجد انتظار بين المقاطع */
  function remoteUrl(seg, code) { return CFG.ttsEndpoint + (CFG.ttsEndpoint.indexOf('?') < 0 ? '?' : '&') + 'lang=' + encodeURIComponent(code) + '&rate=' + (RATES[rateKey] || 0.95) + '&text=' + encodeURIComponent(seg.t); }
  function getBlob(seg, code) {
    var u = remoteUrl(seg, code), c = remote.cache;
    if (!c[u]) {
      if (remote.n > 40) { remote.cache = c = {}; remote.n = 0; }
      remote.n++;
      c[u] = fetch(u, { credentials: 'omit' }).then(function (r) { if (!r.ok) throw new Error('tts ' + r.status); return r.blob(); });
      c[u].catch(function () { if (c[u]) delete c[u]; });
    }
    return c[u];
  }
  function prefetchRemote(code) { if (!useRemote(code)) return; for (var i = 0; i < sp.q.length && i < 2; i++) { try { getBlob(sp.q[i], code).catch(function () {}); } catch (_) {} } }
  function stopRemote() {
    cancelAnimationFrame(remote.raf); remote.raf = 0;
    if (remote.el) { try { remote.el.pause(); remote.el.onended = remote.el.onerror = null; } catch (_) {} remote.el = null; }
    if (remote.url) { try { URL.revokeObjectURL(remote.url); } catch (_) {} remote.url = ''; }
    if (face) face.audioLevel(null);
  }
  function meterLoop() {
    if (!remote.el || !remote.an) return;
    remote.an.getByteTimeDomainData(remote.buf);
    var i, sum = 0, v; for (i = 0; i < remote.buf.length; i++) { v = (remote.buf[i] - 128) / 128; sum += v * v; }
    if (face) face.audioLevel(Math.min(1, Math.sqrt(sum / remote.buf.length) * 5.2));
    remote.raf = requestAnimationFrame(meterLoop);
  }
  function playRemote(seg, tok, code, done, fallback) {
    getBlob(seg, code).then(function (blob) {
      if (tok !== sp.tok) return;
      stopRemote();
      remote.url = URL.createObjectURL(blob);
      actx();
      var a = audioEl(); remote.el = a;
      a.onended = function () { stopRemote(); done(); };
      a.onerror = function () { stopRemote(); fallback(); };
      a.src = remote.url;
      var pr = a.play();
      if (pr && pr.then) pr.then(function () { if (tok !== sp.tok) return; clearTimeout(sp.wd); sp.wd = setTimeout(done, 90000); setTalking(true); if (face) face.speak(seg.t, code, RATES[rateKey] || 0.95); if (remote.an) meterLoop(); }).catch(function (e) { if (CFG.debug && window.console) console.warn('[advisor] audio play blocked:', e && e.message); stopRemote(); fallback(); });
    }).catch(function (e) { if (CFG.debug && window.console) console.warn('[advisor] remote TTS failed:', e && e.message); if (tok === sp.tok) fallback(); });
  }
  function pump(tok) {
    if (tok !== sp.tok) return;
    var seg = sp.q.shift();
    if (!seg) { sp.playing = false; sp.curAlert = false; sp.utter = null; setTalking(false); updateVoiceUi(); return; }
    var code = sp.code, v = voiceFor(code), finished = false;
    sp.curAlert = !!seg.a;
    function done() {
      if (finished || tok !== sp.tok) return;
      finished = true; clearTimeout(sp.wd); setTalking(false); if (face) face.speakEnd();
      sp.timer = setTimeout(function () { pump(tok); }, seg.p);
    }
    function viaSystem() {
      if (finished || tok !== sp.tok) return;
      if (!v) { stopSpeech(); return; }
      var u, male = genderOf(v) === 'male';
      if (CFG.strictMale && !male) { stopSpeech(); return; }   // وضع الضمان: لا صوت غير مؤكَّد الرجولة (الصوت السحابي هو البديل)
      try { u = new window.SpeechSynthesisUtterance(seg.t); } catch (_) { stopSpeech(); return; }
      u.voice = v; u.lang = v.lang || (code === 'ar' ? 'ar-SA' : 'en-US');
      u.rate = (RATES[rateKey] || 0.95) * (male ? 1 : 0.96);
      u.pitch = male ? 1 : 0.6;                               // لا يوجد صوت رجل: نخفض النبرة لأقرب جرس رجولي
      u.volume = 1;
      sp.utter = u;                                           // إبقاء مرجع للكائن يمنع جمعه مبكرًا في بعض المتصفحات
      u.onstart = function () { if (tok === sp.tok) { setTalking(true); if (face) face.speak(seg.t, code, u.rate); } };
      u.onboundary = function (e) { if (tok === sp.tok && face && e && (e.name === 'word' || e.name == null)) face.boundary(e.charIndex || 0); };
      u.onend = done;
      u.onerror = function (e) {
        if (tok !== sp.tok) return;
        var er = e && e.error;
        if (er === 'interrupted' || er === 'canceled') return;
        if (er === 'not-allowed') { stopSpeech(); return; }   // المتصفح يشترط تفاعلًا من المستخدم أولًا
        done();
      };
      sp.wd = setTimeout(done, Math.round(seg.t.length * 150 / (u.rate || 1)) + 4000);   // حارس ضد توقف onend
      setTalking(true); if (face) face.speak(seg.t, code, u.rate);
      try { synth.speak(u); } catch (_) { done(); }
    }
    if (useRemote(code)) {
      sp.wd = setTimeout(function () { stopRemote(); viaSystem(); }, 12000 + seg.t.length * 120);
      playRemote(seg, tok, code, done, function () { clearTimeout(sp.wd); viaSystem(); });
      prefetchRemote(code);
      return;
    }
    if (!v) { stopSpeech(); return; }
    viaSystem();
  }
  function enqueue(parts, opts) {
    if (!canSpeak) return false;
    var code = lang(), v = voiceFor(code); if (!v && !remoteAvail()) { updateVoiceUi(); return false; }
    if (opts.alert && face) face.mood('serious', 3800);
    var segs = segmentize(parts, code, opts.alert); if (!segs.length) return false;
    if (opts.replace) stopSpeech();
    else if (opts.dropStale) sp.q = sp.q.filter(function (x) { return x.a; });
    sp.code = code;
    sp.q = sp.q.concat(segs);
    if (!sp.playing) {
      sp.playing = true;
      var tok = sp.tok;
      sp.timer = setTimeout(function () { pump(tok); }, opts.replace ? 90 : 0);
    }
    updateVoiceUi();
    return true;
  }
  /* جدولة نطق تلقائي (بتأخير بسيط كي لا يتكلم المرشد أثناء التنقل السريع بين الحقول) */
  function scheduleSpeech(build, opts) {
    opts = opts || {};
    if (!voiceUsable()) return false;
    clearTimeout(sp.autoT);
    sp.autoT = setTimeout(function () {
      if (!voiceUsable()) return;
      var parts = build(); if (!parts || !parts.length) return;
      var keep = !opts.alert && alertPending();          // لا نقاطع تنبيهًا لم يكتمل نطقه
      enqueue(parts, { replace: !keep, dropStale: keep, alert: !!opts.alert });
    }, opts.delay != null ? opts.delay : 380);
    return true;
  }

  /* ── ما يُنطق ── */
  function listJoin(arr) { return arr.join(lang() === 'ar' ? '، ' : ', '); }
  function cardParts(full) {
    var parts = [], ar = lang() === 'ar';
    if (cur && cur.el && document.contains(cur.el)) {
      var g = entry(cur.key), label = labelOf(cur.el), st = cur.forced || statusFor(cur.el, cur.key);
      if (label) parts.push(label + '.');
      parts.push(cur.el.required ? t('sReq') : t('sOpt'));
      if (st && (st.s === 'warn' || st.s === 'err')) parts.push(t(st.s === 'err' ? 'sErr' : 'sWarn') + ' ' + st.m);
      parts.push(g && g.w ? g.w : t('generic'));
      if (g && g.f) parts.push(t('sWhere') + ' ' + g.f);
      if (g && g.t) parts.push(t('sTip') + ' ' + g.t);
      if (full && g && g.o && cur.el.tagName === 'SELECT') {
        var items = Array.prototype.filter.call(cur.el.options, function (o) { return o.value && g.o[o.value]; });
        if (items.length) {
          parts.push(t('sOptions'));
          items.forEach(function (o) { parts.push(o.textContent.trim() + ': ' + g.o[o.value]); });
        }
      }
      return parts;
    }
    readStep();
    var prog = requiredProgress();
    if (prog.total > 0 && prog.done === prog.total) { parts.push(t('done') + '.'); parts.push(t('pressNext')); return parts; }
    var st0 = STEPS[Math.min(stepInfo.index, STEPS.length - 1)], stx = st0 ? st0[ar ? 'ar' : 'en'] : ['', '', []];
    if (!sp.welcomed) { sp.welcomed = true; parts.push(t('welcome')); }
    parts.push(t('sStep').replace('{n}', stepInfo.index + 1).replace('{m}', stepInfo.total));
    parts.push(stx[0] + '.');
    parts.push(stx[1]);
    if (stx[2] && stx[2].length) parts.push(t('sBring') + ' ' + listJoin(stx[2]) + '.');
    return parts;
  }
  /* نطق تمهيد الخطوة (أو اكتمالها) مرة واحدة لكل خطوة ولغة */
  function autoIntroSpeech() {
    if (!voiceUsable() || cur) return;
    var prog = requiredProgress(), key = ((prog.total > 0 && prog.done === prog.total) ? 'c|' : 'i|') + stepInfo.index + '|' + lang();
    if (key === sp.lastKey) return;
    sp.lastKey = key;
    scheduleSpeech(function () { return cardParts(false); }, { delay: 650 });
  }
  /* تعليق صوتي فوري على تغيّر القيمة: شرح الخيار المختار، أو الملاحظة/الخطأ */
  function onChangeSpeech(e) {
    if (muted || !canSpeak || !cur || e.target !== cur.el) return;
    var s = null;
    try { s = statusFor(cur.el, cur.key); } catch (_) { s = null; }
    if (!s) return;
    var isSel = cur.el.tagName === 'SELECT';
    if (s.s === 'ok' && (!isSel || s.m === t('filled'))) return;
    var parts = [s.s === 'err' ? t('sErr') + ' ' + s.m : s.s === 'warn' ? t('sWarn') + ' ' + s.m : s.m];
    scheduleSpeech(function () { return parts; }, { alert: s.s !== 'ok', delay: 200 });
  }

  /* ── أوامر المستخدم ── */
  function setVoiceOn(on) {
    voiceOn = !!on;
    try { localStorage.setItem(STORAGE_VOICE, voiceOn ? '1' : '0'); } catch (_) {}
    if (!voiceOn) stopSpeech();
    updateVoiceUi();
    if (voiceOn && stage && !stage.hidden && !muted) scheduleSpeech(function () { return cardParts(false); }, { delay: 150 });
  }
  function toggleListen() {
    if (sp.playing) { stopSpeech(); return; }
    if (!canSpeak || (!voiceFor(lang()) && !remoteAvail())) { updateVoiceUi(); return; }
    clearTimeout(sp.autoT);
    enqueue(cardParts(true), { replace: true });
  }
  function setRate(k) {
    if (!RATES[k]) return;
    rateKey = k;
    try { localStorage.setItem(STORAGE_RATE, k); } catch (_) {}
  }
  function setVoiceChoice(id) {
    var code = lang();
    try { if (id) localStorage.setItem(STORAGE_VSEL + code, id); else localStorage.removeItem(STORAGE_VSEL + code); } catch (_) {}
  }

  /* ── عناصر الواجهة الصوتية ── */
  var ICON_ON = '<svg class="i-on" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M2 6h2.5L8 3v10L4.5 10H2z" fill="currentColor"/><path d="M10.5 5.6a3.5 3.5 0 010 4.8M12.4 3.8a6 6 0 010 8.4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
  var ICON_OFF = '<svg class="i-off" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M2 6h2.5L8 3v10L4.5 10H2z" fill="currentColor"/><path d="M10.5 6l4 4M14.5 6l-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  var ICON_PLAY = '<svg class="i-play" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M5 3l8 5-8 5z" fill="currentColor"/></svg>';
  var ICON_STOP = '<svg class="i-stop" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><rect x="4" y="4" width="8" height="8" rx="1.4" fill="currentColor"/></svg>';
  function voiceBtns() {
    if (!canSpeak) return '';
    return '<button type="button" class="adv-vb adv-vb-mute" data-act="vmute" aria-pressed="false">' + ICON_ON + ICON_OFF + '</button>' +
           '<button type="button" class="adv-vb adv-vb-listen" data-act="listen">' + ICON_PLAY + ICON_STOP + '</button>';
  }
  function voiceSettingsHtml() {
    if (!canSpeak) return '';
    return '<details class="adv-vset"><summary>' + esc(t('vSet')) + '</summary>' +
      '<label><span>' + esc(t('vRate')) + '</span><select class="adv-v-rate" aria-label="' + esc(t('vRate')) + '">' +
        ['slow', 'normal', 'fast'].map(function (k) { return '<option value="' + k + '"' + (k === rateKey ? ' selected' : '') + '>' + esc(t(k === 'slow' ? 'vSlow' : k === 'fast' ? 'vFast' : 'vNormal')) + '</option>'; }).join('') +
      '</select></label>' +
      '<label class="adv-v-voice-wrap"><span>' + esc(t('vVoice')) + '</span><select class="adv-v-voice" aria-label="' + esc(t('vVoice')) + '"></select></label>' +
    '</details>';
  }
  function fillVoiceSelect() {
    if (!rail) return;
    var sel = rail.querySelector('.adv-v-voice'); if (!sel) return;
    var code = lang(), list = candidates(code), wrap = sel.closest('.adv-v-voice-wrap'), saved = '';
    try { saved = localStorage.getItem(STORAGE_VSEL + code) || ''; } catch (_) {}
    var sig = code + '|' + list.length + '|' + saved;
    if (sel.getAttribute('data-sig') === sig) { if (wrap) wrap.hidden = list.length < 2; return; }   // لا نُعيد البناء إن لم يتغير شيء
    sel.setAttribute('data-sig', sig);
    sel.innerHTML = '<option value="">' + esc(t('vAuto')) + '</option>' + list.map(function (v) {
      return '<option value="' + esc(vid(v)) + '"' + (vid(v) === saved ? ' selected' : '') + '>' + esc((genderOf(v) === 'male' ? '♂ ' : '') + v.name + ' (' + v.lang + ')') + '</option>';
    }).join('');
    if (wrap) wrap.hidden = list.length < 2;
  }
  function updateVoiceUi() {
    if (!rail) return;
    var usable = canSpeak && (!!voiceFor(lang()) || remoteAvail()), playing = sp.playing, i, b, list;
    list = rail.querySelectorAll('[data-act="vmute"]');
    for (i = 0; i < list.length; i++) {
      b = list[i]; b.classList.toggle('is-off', !voiceOn); b.setAttribute('aria-pressed', String(!voiceOn));
      b.title = t(voiceOn ? 'vOn' : 'vOff'); b.setAttribute('aria-label', t(voiceOn ? 'vOn' : 'vOff'));
    }
    list = rail.querySelectorAll('[data-act="listen"]');
    for (i = 0; i < list.length; i++) {
      b = list[i]; b.classList.toggle('is-playing', playing); b.disabled = !usable;
      b.title = t(playing ? 'vStop' : 'vListen'); b.setAttribute('aria-label', t(playing ? 'vStop' : 'vListen'));
    }
    var note = rail.querySelector('.adv-v-note');
    if (note) {
      var noVoice = canSpeak && sp.ready && !usable, notMale = canSpeak && sp.ready && usable && !maleVoice(lang()) && !useRemote(lang()), showNote = noVoice || notMale;
      note.hidden = !showNote; if (showNote) note.textContent = t(noVoice ? 'vNoVoice' : 'vNoMale');
    }
    fillVoiceSelect();
  }
  if (canSpeak) {
    loadVoices();
    try { synth.addEventListener('voiceschanged', function () { loadVoices(); updateVoiceUi(); }); } catch (_) { try { synth.onvoiceschanged = function () { loadVoices(); updateVoiceUi(); }; } catch (__) {} }
    setTimeout(function () { sp.ready = true; loadVoices(); updateVoiceUi(); }, 2000);
  }

  /* إيماءات */
  function speak() {
    if (!actor || reduced) return;
    actor.classList.add('is-speaking'); if (face) face.talk(true);
    clearTimeout(run.speakT);
    run.speakT = setTimeout(function () { actor && actor.classList.remove('is-speaking'); if (face && !sp.playing) face.talk(false); }, 1400);
  }
  /* عدم الرضا: لا ابتسامة + هزّ الرأس يمينًا ويسارًا (للوجه المتحرك) أو اهتزاز CSS احتياطي */
  var lastRejectAt = 0;
  function disapprove() {
    if (!actor || muted) return;
    var t = Date.now(); if (t - lastRejectAt < 1200) return; lastRejectAt = t;
    if (face && face.disapprove) face.disapprove();
    if (!reduced && !face) {
      actor.classList.remove('is-shake'); void actor.offsetWidth; actor.classList.add('is-shake');
      clearTimeout(run.shakeT); run.shakeT = setTimeout(function () { actor && actor.classList.remove('is-shake'); }, 1500);
    }
  }
  function relaxFace() { if (face && face.relax) face.relax(); if (actor) actor.classList.remove('is-shake'); }
  function nod() {
    if (!actor || reduced) return;
    if (face) face.nod();
    actor.classList.remove('is-nod'); void actor.offsetWidth; actor.classList.add('is-nod');
    clearTimeout(run.nodT);
    run.nodT = setTimeout(function () { actor && actor.classList.remove('is-nod'); }, 700);
  }

  /* ───────────────────────── ربط الأحداث ───────────────────────── */
  function onFocusIn(e) {
    if (muted) return;
    var el = e.target;
    if (!isGuidable(el)) return;
    ensureStage();
    clearTimeout(onFocusIn._t);
    onFocusIn._t = setTimeout(function () { if (document.activeElement === el) activate(el); }, 90);
  }
  function onFocusOut(e) {
    if (muted || !cur || e.target !== cur.el) return;
    var el = cur.el, f = el.closest('.rf-field');
    // عند مغادرة الحقل: إيماءة إيجابية إن كانت القيمة سليمة
    var s = statusFor(el, cur.key);
    if (s && s.s === 'ok' && isFilled(el) && !cur.nodded) { cur.nodded = true; nod(); }
    void f;
    clearTimeout(onFocusOut._t);
    onFocusOut._t = setTimeout(function () {
      var a = document.activeElement;
      if (!cur || muted) return;
      if (Date.now() - (run.railPtr || 0) < 700) return;                     // نقرة داخل عمود المرشد (مثل زر «استماع») لا تُنهي الحقل النشط
      if (a && ((rail && rail.contains(a)) || isGuidable(a))) return;
      if (a && mount && mount.contains(a) && a !== document.body) return;   // أزرار النموذج نفسها
      deactivate();
    }, 220);
  }
  function onInput(e) {
    if (muted || !cur || e.target !== cur.el) return;
    cur.forced = null;
    clearTimeout(onInput._t);
    onInput._t = setTimeout(function () {
      refreshStatus();
      var s = statusFor(cur.el, cur.key);
      if (s && s.s === 'ok' && cur.lastS !== 'ok') nod();
      cur.lastS = s ? s.s : '';
      updateProgress();
      handleRejection(e, s);
    }, 140);
  }
  /* بيان خاطئ: يُظهر المرشد عدم الرضا فور اعتماد القيمة (اختيار/خروج من الحقل)، أو بعد توقف الكتابة ثانية تقريبًا — لا أثناء الكتابة */
  function handleRejection(e, s) {
    clearTimeout(onInput._rt);
    if (!s || s.s !== 'err') { cur.rejKey = ''; relaxFace(); return; }
    var key = JSON.stringify(s.m);
    if (cur.rejKey === key) return;
    var committed = e.type === 'change' || (e.target && e.target.tagName === 'SELECT');
    var nm = cur.name;
    function fire() {
      if (!cur || cur.name !== nm) return;          // النموذج يُعاد رسمه عند الاختيار فيتبدّل العنصر؛ نتحقق بالاسم لا بالمرجع
      var again = statusFor(cur.el, cur.key);
      if (again && again.s === 'err') { cur.rejKey = JSON.stringify(again.m); disapprove(); }
    }
    if (committed) fire(); else onInput._rt = setTimeout(fire, 1000);
  }
  function updateProgress() {
    if (!brief) return;
    var prog = requiredProgress(), pct = prog.total ? Math.round(prog.done / prog.total * 100) : 0;
    var b = brief.querySelector('.adv-bar b'), p = brief.querySelector('.adv-b-pct');
    if (b) b.style.width = pct + '%';
    if (p) p.textContent = prog.done + '/' + prog.total;
  }

  function onMountMutation() {
    if (!mount || !stage) return;
    stage.hidden = mount.hidden;
    applyMode();
    if (mount.hidden) { cur = null; clearTarget(); stopSpeech(); sp.lastKey = ''; return; }
    clearTimeout(refreshT);
    refreshT = setTimeout(afterRender, 30);
  }
  function afterRender() {
    readStep();
    if (cur) {
      var again = ctl(cur.name);
      if (again && isGuidable(again)) {
        cur.el = again; markTarget(again);
        var key = cur.key; void key;
        renderBriefKeepOpen();
      } else {
        cur = null; clearTarget();
        renderBrief(complete() ? { complete: true } : {});
      }
    } else {
      renderBrief(complete() ? { complete: true } : {});
    }
    if (!introShown && !mount.hidden) introShown = true;
    layout(); aim();
    if (!cur) autoIntroSpeech();            // تمهيد الخطوة صوتيًا، مرة واحدة لكل خطوة
  }
  function renderBriefKeepOpen() {
    var open = brief && brief.querySelector('.adv-opts[open]');
    renderBrief({ openOpts: !!open });
  }
  function layout() {
    if (!rail || !actor) return;
    rail.style.minHeight = dockMode ? '' : (actor.offsetHeight + 140) + 'px';
    if (dockMode) {
      var h = rail.offsetHeight;
      document.documentElement.style.setProperty('--adv-dock-h', h + 'px');
    }
    // أقصى ارتفاع للبطاقة بحيث لا تخرج من الشاشة
    if (!dockMode && figBox && brief) {
      var avail = window.innerHeight - HEADER_OFFSET - figBox.offsetHeight - 40;
      brief.style.setProperty('--adv-brief-max', Math.max(190, Math.min(380, avail)) + 'px');
    }
  }

  var scrollRaf = 0;
  function onScrollResize() {
    if (!stage || muted || stage.hidden) return;
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(function () { scrollRaf = 0; layout(); kick(); });
  }
  function onResize() { applyMode(); layout(); onScrollResize(); }

  function ensureStage() {
    if (!mount) mount = document.getElementById('residencyWizardMount');
    if (!mount) return false;
    if (!stage) {
      buildStage();
      obs = new MutationObserver(onMountMutation);
      obs.observe(mount, { childList: true, attributes: true, attributeFilter: ['hidden'] });
      stage.hidden = mount.hidden;
      var bo = new MutationObserver(function () { if (stage) { renderBriefLang(); } });
      bo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      if (window.ResizeObserver) { var ro = new ResizeObserver(function () { layout(); kick(); }); ro.observe(stage); ro.observe(actor); }
      applyMode(); renderBrief(); layout();
    }
    return true;
  }
  var lastLang = lang();
  function renderBriefLang() {
    rail.setAttribute('aria-label', t('name'));
    applyMode();
    renderBrief();
    var l = lang();
    if (l !== lastLang) {                    // تغيّرت لغة الصفحة فعلًا: أوقف النطق القديم وأعد الشرح باللغة الجديدة
      lastLang = l; stopSpeech(); sp.lastKey = '';
      if (cur) scheduleSpeech(function () { return cardParts(false); }, { delay: 450 }); else autoIntroSpeech();
    }
  }

  function init() {
    mount = document.getElementById('residencyWizardMount');
    if (!mount) return;
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    document.addEventListener('input', onInput, true);
    document.addEventListener('change', onInput, true);
    document.addEventListener('change', onChangeSpeech, true);
    window.addEventListener('scroll', onScrollResize, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', function () { if (document.hidden) stopSpeech(); else kick(); });
    window.addEventListener('pagehide', stopSpeech);
    window.addEventListener('beforeunload', stopSpeech);
    // ابنِ المسرح حالما يظهر المعالج
    var boot = new MutationObserver(function () {
      if (!mount.hidden) { boot.disconnect(); ensureStage(); onMountMutation(); }
    });
    if (!mount.hidden) { ensureStage(); onMountMutation(); } else boot.observe(mount, { attributes: true, attributeFilter: ['hidden'] });
  }

  /* ───────────────────────── الواجهة العامة ───────────────────────── */
  function show(key, mode, targetEl) {
    if (muted) return;
    if (!ensureStage()) return;
    var el = targetEl && isGuidable(targetEl) ? targetEl : (key && ctl(key)) || null;
    if (!el) return;
    activate(el, true);
    if (mode === 'alert' && cur) { var a = ALERTS[cur.key]; if (a) { cur.forced = { s: 'err', m: L2(a) }; refreshStatus(); } disapprove(); }
  }
  function hide() { if (cur) { cur = null; clearTarget(); renderBrief(); aim(); } }
  function mute() {
    muted = true;
    try { localStorage.setItem(STORAGE_MUTE, '1'); } catch (_) {}
    stopSpeech();
    cur = null; clearTarget();
    if (stage) { applyMode(); }
    document.body.classList.remove('adv-dock-open');
  }
  function unmute() {
    muted = false;
    try { localStorage.removeItem(STORAGE_MUTE); } catch (_) {}
    if (stage) { applyMode(); renderBrief(); layout(); aim(); }
    var a = document.activeElement; if (a && isGuidable(a)) activate(a, true);
  }
  function isMuted() { return muted; }
  function alertFor(fieldName, force, targetEl) {
    if (muted && !force) return;
    if (muted && force) unmute();
    var key = String(fieldName || '').replace(/^investor_\d+_/, '');
    show(key, 'alert', targetEl);
  }
  function showDetail() { var d = brief && brief.querySelector('.adv-opts'); if (d) d.open = true; }

  window.GOVESER_Advisor = {
    reject: disapprove, show: show, hide: hide, mute: mute, unmute: unmute, isMuted: isMuted, alertFor: alertFor, showDetail: showDetail,
    voiceOn: function () { setVoiceOn(true); }, voiceOff: function () { setVoiceOn(false); },
    isVoiceOn: function () { return voiceOn; }, listen: toggleListen, stopSpeech: stopSpeech
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
