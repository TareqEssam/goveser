/* Dynamic investor-residency wizard. Personal data stays in this browser only. */
(() => {
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  // Replace the empty value with the final YouTube URL when the explanatory video is ready.
  const WEIGHT_HELP_VIDEO_URL = '';
  const mount = $('#residencyWizardMount');
  if (!mount) return;
  const serviceMeta = {
    visa:{ar:'تأشيرة دخول مستثمر',en:'Investor Entry Visa',noteAr:'للمستثمر الموجود خارج مصر، وفق شروط الخدمة.',noteEn:'For an investor currently outside Egypt, subject to service requirements.'},
    grant:{ar:'منح إقامة مستثمر',en:'Grant Investor Residency',noteAr:'تُختار عند طلب الإقامة لأول مرة على هذه الشركة تحديدًا.',noteEn:'Choose this for the first residence through this specific company.'},
    renew:{ar:'تجديد إقامة مستثمر',en:'Renew Investor Residency',noteAr:'يشترط أن تكون الإقامة السابقة صادرة على الشركة نفسها.',noteEn:'The previous residence must have been issued through the same company.'},
    movement:{ar:'شهادة تحركات مستثمر',en:'Investor Movement Certificate',noteAr:'طلب إثبات تحركات المستثمر ومراجعة موقف إقامته.',noteEn:'A request to verify the investor’s movements and residence status.'}
  };
  const docs={
    base:[['طلب الخدمة على مطبوعات الشركة وفق النموذج الاسترشادي، موقعًا ومختومًا','Service request on company letterhead using the guidance form, signed and stamped'],['مستخرج حديث من السجل التجاري والرقم الموحد، وفق متطلبات الخدمة','Recent commercial register extract and unified register number, according to service requirements']],
    visa:[['عدد (2) صورة ضوئية من جواز سفر المستثمر وفق قائمة المستندات','Two photocopies of the investor’s passport, as stated in the checklist']],
    grant:[['عدد (1) صورة من جواز سفر المستثمر','One copy of the investor’s passport']],
    renew:[['صورة جواز السفر موضحًا به الإقامة السابقة','Passport copy showing the previous residence'],['مستخرج حديث من السجل التجاري لم يمر عليه أكثر من ثلاثة أشهر','Recent commercial register extract issued within the last three months']],
    movement:[['طلب شهادة تحركات لمستثمر أجنبي بالشركات الخاضعة لقانون الاستثمار','Movement certificate request for a foreign investor in an Investment Law company'],['بيانات تاريخ المغادرة وتاريخ انتهاء الإقامة','Departure date and residence expiry details'],['بيانات المستثمرين الحاصلين على توصيات إقامة أو تأشيرة بالشركة، وفق النموذج','Details of investors holding residence/visa recommendations through the company, as requested in the form']]
  };
  const copy={
    ar:{choose:'اختر إجابة',next:'التالي',back:'السابق',backServices:'العودة لاختيار خدمة أخرى',save:'حفظ على هذا الجهاز',word:'تنزيل Word',pdf:'تنزيل النموذج الأصلي للطباعة / PDF',shareWa:'مشاركة عبر واتساب',shareEmail:'مشاركة عبر البريد',shareGeneric:'مشاركة عامة',reset:'مسح البيانات المحلية',privacy:'الخصوصية: تحفظ البيانات في هذا المتصفح فقط ولا تُرسل إلى خادم الموقع.',company:'بيانات الشركة',execution:'الموقف التنفيذي والنشاط',capital:'رأس المال والعمالة',weight:'نتيجة الوزن النسبي',investors:'بيانات المستثمرين',applicant:'بيانات مقدم الطلب',documents:'المستندات المناسبة لإجاباتك',notSureLaw:'لمعرفة قانون الشركة: راجع القانون المذكور بجوار اسم الشركة في السجل التجاري، ويمكنك الاستعانة بعقد التأسيس وآخر تعديل. لا يمكن استكمال الخدمة قبل تحديد القانون.',notSureForm:'لمعرفة الشكل القانوني: راجع العمود الثاني من جهة اليمين في السجل التجاري، أو عقد التأسيس، أو آخر عقد تعديل للشكل القانوني.',lawHistory:'قانون الاستثمار الحالي هو القانون رقم 72 لسنة 2017. قد يظهر في مستندات الشركات الأقدم القانونان 8 أو 43؛ اعتمد القانون المثبت بمستندات شركتك ولا تخمّن.',law159:'هذه الخدمة غير متاحة للشركات الخاضعة لقانون 159 لسنة 1981. انتقل إلى خدمات شركات قانون 159.',lawUnknown:'يلزم تحديد قانون الشركة قبل المتابعة. اختر «لست متأكدًا» لعرض الإرشاد، ثم حدد القانون بعد مراجعة مستندات الشركة.',ageUnder:'لم يمض عام على تأسيس الشركة. وفق الضوابط الواردة، قد تكون مدة الإقامة خلال السنة الأولى عامًا من تاريخ موافقة الجهات المعنية. يجب استكمال بيانات الموقف التنفيذي والتحقق من المستندات.',underNotOperating:'مر أكثر من عام على تأسيس الشركة ولم تبدأ النشاط: يلزم بيان موقف لجنة المعاينة وإثبات الجدية، ولا يمكن تحديد المدة تلقائيًا من تاريخ التأسيس وحده.',capitalEvidenceJoint:'للشركة المساهمة، اختر نوع الإثبات: المبالغ المؤداة والمؤشر بها في السجل التجاري، أو شهادة صادرة من قطاع الأداء الاقتصادي، أو شهادة سبق تقديمها من القطاع. أدخل القيمة المطابقة للمستند المحدد.',capitalEvidenceOther:'اختر نوع إثبات رأس المال: رأس المال المسدد والمؤشر به في السجل التجاري، أو شهادة بنكية باسم الشركة، أو شهادة من قطاع الأداء الاقتصادي، أو إحدى الشهادتين اللتين سبق تقديمهما. أدخل القيمة المطابقة للمستند المحدد، وبما لا يجاوز رأس المال المسجل.',scoreIncomplete:'أكمل بيانات رأس المال والعمالة والنشاط والموقع لحساب الوزن النسبي وفق الفئات الواردة في ملف الوزن النسبي.',noResidencies:'إجمالي الوزن النسبي لا يتجاوز 30%؛ وجدول الوزن النسبي لا يتيح منح إقامة ضمن هذه الفئة.',resCount:'عدد الإقامات التي تسمح بها فئة الوزن النسبي',resLimit:'هذا هو الحد الأقصى وفق فئة الوزن النسبي المحسوبة. إذا كنت تحتاج إلى عدد أكبر، فيلزم رفع الوزن النسبي وفق المعايير الرسمية.',addInvestor:'إضافة مستثمر',remove:'حذف',maxReached:'وصلت إلى الحد الأقصى لعدد المستثمرين وفق فئة الوزن النسبي.',helpWeight:'شرح الوزن النسبي',weightHelp:'يتكون الحساب الإرشادي من أربعة معايير: رأس المال (10% أو 15% أو 20% أو 30%)، العمالة المصرية المؤمن عليها (0% أو 5% أو 10% أو 20% أو 30%)، غرض النشاط (10% خارج الأغراض المستهدفة أو 20% للأغراض المستهدفة)، وموقع النشاط (10% خارج المواقع المستهدفة أو 20% بالمواقع المستهدفة). تشمل الأغراض المستهدفة الواردة بالوثيقة الطاقة الجديدة والمتجددة، بعض الصناعات الثقيلة والتكنولوجية والصناعات الدوائية والمغذية، التعليم دون الجامعي، التنمية المتكاملة، استصلاح واستزراع 500 فدان فأكثر، المستشفيات، بعض المشروعات السياحية والبنية الأساسية والبترول وتحلية المياه، وبعض مشروعات المناطق الحرة التي تتجاوز صادراتها 80% وفق الإثباتات المطلوبة. إجمالي الأوزان يصل إلى 100%. لا تُحتسب نسبة 20% للنشاط المستهدف أو الموقع المستهدف إلا بعد إثبات بدء النشاط أو الجدية من خلال لجنة معاينة؛ وإلا فتحتسب 10% لكل منهما. يُحدد وزن الموقع وفق نطاق موقع ممارسة النشاط الفعلي ضمن المناطق المحددة بالتنمية.',notes:'ملاحظات اختيارية',required:'هذا الحقل مطلوب',date:'تاريخ',saved:'تم الحفظ محليًا.',notEligibleRenew:'لا يمكن متابعة التجديد إذا لم تكن الإقامة السابقة على الشركة نفسها.',grantIsRenew:'إذا سبق للمستثمر الحصول على إقامة على الشركة نفسها، اختر خدمة تجديد الإقامة بدلًا من منح إقامة لأول مرة.',visaOutside:'خدمة تأشيرة الدخول مخصصة للمستثمر الموجود خارج مصر وفق ضوابط الخدمة؛ راجع الخدمة المناسبة إذا كان داخل البلاد.',movementNoResidence:'شهادة التحركات هنا مخصصة لمستثمر سبق حصوله على إقامة على هذه الشركة؛ راجع الجهة المختصة إذا لم يسبق له ذلك.',movementNote:'راجع النموذج الرسمي للتحقق من شرط مدة الانقطاع؛ لا تُعد هذه الأداة قرارًا بشأن صلاحية الإقامة أو حق الدخول.',exportIntro:'نموذج إرشادي للمراجعة وليس بديلًا عن النموذج الرسمي المعتمد.'},
    en:{choose:'Choose an answer',next:'Next',back:'Back',backServices:'Choose another service',save:'Save on this device',word:'Download Word',pdf:'Download original form for print / PDF',shareWa:'Share via WhatsApp',shareEmail:'Share via Email',shareGeneric:'Share',reset:'Clear local data',privacy:'Privacy: data is stored in this browser only and is not sent to the website server.',company:'Company details',execution:'Operational status and activity',capital:'Capital and workforce',weight:'Relative-weight result',investors:'Investor details',applicant:'Applicant details',documents:'Documents relevant to your answers',notSureLaw:'To identify the company law, check the law shown beside the company name in the commercial register; the incorporation deed and latest amendment may also help. You must identify the law before continuing.',notSureForm:'To identify the legal form, check the second column from the right in the commercial register, the incorporation deed, or the latest amendment changing the legal form.',lawHistory:'The current Investment Law is No. 72 of 2017. Older companies may have documents referencing Laws No. 8 or 43; use the law shown in your company records rather than guessing.',law159:'This service is not available to companies governed by Law No. 159 of 1981. Go to the services for Law 159 companies.',lawUnknown:'You must identify the company law before continuing. Select “Not sure” to view guidance, then choose the law after checking the company documents.',ageUnder:'The company is less than one year old. Under the supplied rules, residence during the first year may be for one year from the relevant authority approval date. Complete the operational details and verify the documents.',underNotOperating:'The company is over one year old and has not started operating. Provide inspection status and evidence of seriousness; duration cannot be determined from incorporation date alone.',capitalEvidenceJoint:'For a joint-stock company, select the evidence type: paid-up amounts recorded in the commercial register, a certificate issued by the Economic Performance Sector, or a certificate previously submitted by that Sector. Enter the value corresponding to the selected evidence.',capitalEvidenceOther:'Select the capital evidence type: paid-up capital recorded in the commercial register, a bank certificate in the company’s name, an Economic Performance Sector certificate, or either type of certificate previously submitted. Enter the value corresponding to the selected evidence; it must not exceed registered capital.',scoreIncomplete:'Complete capital, workforce, activity, and location details to calculate the relative weight using the supplied weight categories.',noResidencies:'The total relative weight does not exceed 30%; the relative-weight table does not provide for residence in this category.',resCount:'Residence limit for this relative-weight category',resLimit:'This is the maximum number under the calculated band. If more residences are needed, the company must increase its relative weight under the official criteria.',addInvestor:'Add investor',remove:'Remove',maxReached:'The maximum investor count for this weight category has been reached.',helpWeight:'Explain relative weight',weightHelp:'The indicative calculation has four criteria: capital (10%, 15%, 20%, or 30%); insured Egyptian workforce (0%, 5%, 10%, 20%, or 30%); activity purpose (10% outside targeted purposes or 20% for targeted purposes); and activity location (10% outside targeted locations or 20% in targeted locations). Targeted purposes listed in the source include renewable energy, certain heavy/technology/pharmaceutical/supporting industries, non-university education, integrated development, reclaiming/cultivating at least 500 feddans, hospitals, certain tourism and infrastructure projects, petroleum, water desalination, and certain free-zone projects exporting over 80% subject to proof. The total can reach 100%. A targeted activity or location receives 20% only after commencement or seriousness is verified by an inspection committee; otherwise each is counted as 10%. The location weight is determined by the area of the actual business site within the designated development-priority locations.',notes:'Optional notes',required:'This field is required',date:'Date',saved:'Saved locally.',notEligibleRenew:'Renewal cannot continue if the previous residence was not issued through the same company.',grantIsRenew:'If the investor has previously held residence through this same company, choose Renewal instead of First-time Grant.',visaOutside:'The entry-visa service is intended for an investor currently outside Egypt, subject to service rules. Check the appropriate service if the investor is inside Egypt.',movementNoResidence:'This movement-certificate flow is for an investor who previously held residence through this company. Contact the competent office if not.',movementNote:'Check the official form for the absence-period condition; this tool does not decide residence validity or right of entry.',exportIntro:'Guidance form for review, not a substitute for the approved official form.'}
  };
  const lang=()=> (localStorage.getItem('goveser-lang')||'ar')==='en'?'en':'ar';
  const t=k=>copy[lang()][k]||copy.ar[k]||k;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fieldLabelValue=f=>{const pick=lang()==='ar'?(f.ar??f.en??''):(f.en??f.ar??'');return typeof pick==='function'?pick(values):pick;};
  const escLabel=f=>esc(fieldLabelValue(f));
  const storageKey=s=>`goveser-residency-form-v2-${s}`;
  let currentService=null, step=0, values={}, investorCount=1;
  const baseFields=[
    {id:'companyName',ar:'اسم الشركة كما بالسجل التجاري',en:'Company name as shown in commercial register',type:'text',required:true},
    {id:'companyLaw',ar:'القانون الخاضعة له الشركة',en:'Law governing the company',type:'select',required:true,options:[['72','قانون الاستثمار رقم 72 لسنة 2017','Investment Law No. 72 of 2017'],['8','قانون ضمانات وحوافز الاستثمار رقم 8 لسنة 1997','Investment Guarantees and Incentives Law No. 8 of 1997'],['230','قانون الاستثمار رقم 230 لسنة 1989','Investment Law No. 230 of 1989'],['43','قانون نظام استثمار المال العربي والأجنبي والمناطق الحرة رقم 43 لسنة 1974','Law No. 43 of 1974 on Arab and Foreign Capital Investment and Free Zones'],['unknown','لست متأكدًا','Not sure']]},
    {id:'zone',ar:'نظام الاستثمار الخاضعة له الشركة',en:'Investment regime applicable to the company',type:'select',required:true,options:[['internal','استثمار داخلي (خارج المناطق الحرة والاستثمارية)','Domestic investment (outside free/investment zones)'],['free','منطقة حرة','Free zone'],['investment','منطقة استثمارية','Investment zone']]},
    {id:'legalForm',ar:'الشكل القانوني للشركة',en:'Legal form',type:'select',required:true,options:[['joint','شركة مساهمة','Joint-stock company'],['llc','شركة ذات مسؤولية محدودة','Limited liability company'],['one','شركة الشخص الواحد','One-person company'],['partnership','شركة تضامن','General partnership'],['limitedShares','شركة توصية بالأسهم','Limited partnership by shares'],['sole','منشأة فردية','Sole proprietorship'],['unknown','لست متأكدًا','Not sure']]},
    {id:'oneOwnerType',ar:'نوع مالك شركة الشخص الواحد',en:'One-person company owner type',type:'select',required:true,showWhen:v=>v.legalForm==='one',options:[['natural','شخص طبيعي (فرد)','Natural person'],['legal','شخص اعتباري (شركة)','Legal person (company)']]},
    {id:'companyStart',ar:'تاريخ تأسيس الشركة',en:'Company incorporation date',type:'date',required:true}
  ];
  const executionFields=[
    {id:'activityStatus',ar:'الموقف التنفيذي للشركة / المنشأة',en:'Company / establishment operational status',type:'select',required:true,options:v=>activityStatusOptions(v)},
    {id:'inspectionStatus',ar:'نتيجة لجنة المعاينة',en:'Inspection committee outcome',type:'select',required:true,options:[['start','إثبات بدء النشاط','Commencement of activity verified'],['serious','إثبات الجدية / موقف تنفيذي','Seriousness / implementation status verified'],['no','لم تتم المعاينة أو لم يثبت ذلك','No inspection / not verified']],showWhen:v=>currentService!=='renew'&&['start','serious','operating'].includes(v.activityStatus)},
    {id:'activityStartDate',ar:'تاريخ بدء النشاط',en:'Activity commencement date',type:'date',required:true,showWhen:v=>currentService==='renew'&&v.activityStatus==='start'},
    {id:'inspectionDate',ar:'تاريخ آخر لجنة معاينة',en:'Date of latest inspection committee',type:'date',required:true,showWhen:v=>currentService==='renew'?['start','serious'].includes(v.activityStatus):['start','serious','operating'].includes(v.activityStatus)},
    {id:'activityCertificate',ar:'هل توجد شهادة أو مستند معتمد لإثبات بداية النشاط؟',en:'Is there an approved certificate/document proving commencement?',type:'select',options:[['yes','نعم','Yes'],['no','لا','No']],showWhen:v=>currentService!=='renew'&&v.activityStatus==='operating'},
    {id:'activityDescription',ar:'نشاط الشركة المؤشر به بالسجل التجاري',en:'Company activity recorded in the commercial register',type:'text',required:true},
    {id:'activityTypeIndustry',ar:'هل النشاط صناعي؟',en:'Is the activity industrial?',type:'select',required:true,options:[['yes','نعم، نشاط صناعي','Yes, industrial activity'],['no','لا','No, not industrial']]},
    {id:'activityType',ar:'نتيجة مطابقة النشاط لمعايير وثيقة الوزن النسبي',en:'Activity match against the relative-weight criteria',type:'guided-activity',required:true},
    {id:'locationCategory',ar:'نتيجة التحقق من موقع ممارسة النشاط',en:'Business location verification result',type:'guided-location',required:true},
    {id:'siteName',ar:'عنوان موقع ممارسة النشاط بالتفصيل (المحافظة، المدينة/المركز، المنطقة، الشارع)',en:'Full business-site address (governorate, city/district, area, street)',type:'text',required:true},
    {id:'siteProof',ar:'سند حيازة موقع النشاط',en:'Proof of site occupancy',type:'select',required:true,options:[['ownership','تمليك','Ownership'],['allocation','تخصيص','Allocation'],['rent','إيجار','Lease'],['usufruct','انتفاع','Usufruct']]},
    {id:'leaseStartDate',ar:'تاريخ بدء عقد الإيجار',en:'Lease start date',type:'date',required:true,showWhen:v=>v.siteProof==='rent'},
    {id:'siteExpiry',ar:v=>v.siteProof==='allocation'?'تاريخ عقد التخصيص':v.siteProof==='usufruct'?'تاريخ عقد الانتفاع':'تاريخ انتهاء عقد الإيجار',en:v=>v.siteProof==='allocation'?'Allocation contract date':v.siteProof==='usufruct'?'Usufruct contract date':'Lease end date',type:'date',required:true,showWhen:v=>['allocation','rent','usufruct'].includes(v.siteProof)},
    {id:'usdDeposit',ar:'قيمة الوديعة الدولارية المجمدة (المطلوب 200,000 دولار أمريكي)',en:'Frozen USD deposit amount (required: USD 200,000)',type:'number',min:200000,required:true,showWhen:v=>['one','sole'].includes(v.legalForm)&&['under','new','none'].includes(v.activityStatus)&&(currentService==='visa'||currentService==='grant')},
    {id:'leaseNotaryNumber',ar:'رقم تصديق عقد الإيجار بالشهر العقاري',en:'Real Estate Registry lease authentication number',type:'text',required:true,showWhen:v=>v.activityTypeIndustry==='yes'&&v.siteProof==='rent'},
    {id:'leaseNotaryDate',ar:'تاريخ تصديق عقد الإيجار بالشهر العقاري',en:'Real Estate Registry lease authentication date',type:'date',required:true,showWhen:v=>v.activityTypeIndustry==='yes'&&v.siteProof==='rent'},
  ];
  const capitalFields=[
    {id:'companyCapital',ar:v=>v.legalForm==='joint'?'رأس مال الشركة المرخص به والمؤشر به في السجل التجاري':v.legalForm==='sole'?'رأس مال المنشأة المؤشر به في السجل التجاري':'رأس مال الشركة المؤشر به في السجل التجاري',en:v=>v.legalForm==='joint'?'Company authorised capital as recorded in the commercial register':v.legalForm==='sole'?'Establishment capital as recorded in the commercial register':'Company capital as recorded in the commercial register',type:'currency',min:0,required:true},
    {id:'capitalEvidence',ar:'إثبات رأس المال',en:'Capital evidence',type:'select',required:true,options:v=>v.legalForm==='joint'?[['paid_register','المبالغ المؤداة والمؤشر بها في السجل التجاري','Paid-up amounts recorded in the commercial register'],['economic','شهادة صادرة من قطاع الأداء الاقتصادي','Certificate issued by the Economic Performance Sector'],['economic_previous','سبق تقديم شهادة من قطاع الأداء الاقتصادي','Previously submitted certificate from the Economic Performance Sector']]:[['paid_register','رأس المال المسدد والمؤشر به في السجل التجاري','Paid-up capital recorded in the commercial register'],['bank','شهادة بنكية باسم الشركة','Bank certificate issued in the company’s name'],['economic','شهادة من قطاع الأداء الاقتصادي','Certificate from the Economic Performance Sector'],['bank_previous','سبق تقديم شهادة بنكية باسم الشركة','Previously submitted bank certificate issued in the company’s name'],['economic_previous','سبق تقديم شهادة من قطاع الأداء الاقتصادي','Previously submitted certificate from the Economic Performance Sector']]},
    {id:'capitalAmount',ar:'بقيمة',en:'Amount',type:'currency',min:0,required:true},
    {id:'exchangeRate',ar:'سعر صرف الدولار مقابل الجنيه المصري (لحساب الوزن النسبي)',en:'USD to EGP exchange rate (for relative-weight calculation)',type:'number',min:0.01,step:'any',required:true,showWhen:v=>(v.companyCapitalCurrency==='USD'||v.capitalAmountCurrency==='USD')},
    {id:'insuredWorkers',ar:'عدد العمالة المصرية المؤمن عليها وفق برنت التأمينات',en:'Number of insured Egyptian employees per social-insurance statement',type:'number',min:0,required:true},
    {id:'insuranceStatementDate',ar:'تاريخ إصدار برنت التأمينات',en:'Social-insurance statement issue date',type:'date',required:true,showWhen:v=>Number(v.insuredWorkers)>0},
    {id:'registerDate',ar:'تاريخ إصدار السجل التجاري',en:'Commercial register issue date',type:'date'},
    {id:'registerRenewalDate',ar:'تاريخ تجديد السجل التجاري',en:'Commercial register renewal date',type:'date'},
    {id:'unifiedRegister',ar:'الرقم الموحد للسجل التجاري (15 رقمًا بالضبط)',en:'Unified commercial register number (exactly 15 digits)',type:'text',required:true,pattern:'[0-9]{15}'},
    {id:'companyExpiry',ar:'تاريخ انتهاء مدة الشركة',en:'Company term expiry date',type:'date',required:true,showWhen:v=>v.legalForm!=='sole'},
    {id:'boardExpiryDate',ar:'تاريخ انتهاء مدة مجلس الإدارة',en:'Board term expiry date',type:'date',required:true,showWhen:v=>v.legalForm==='joint'&&['visa','grant','renew'].includes(currentService)},
    {id:'residencyBeneficiaries',ar:'عدد الحاصلين على إقامات بالشركة بخلاف مقدم الطلب الحالي',en:'Number of previous residence beneficiaries excluding the current applicant',type:'number',min:0,max:30,step:1,required:true},
    {id:'visaBeneficiaries',ar:'عدد الحاصلين على تأشيرات دخول بالشركة بخلاف مقدم الطلب الحالي',en:'Number of previous entry-visa beneficiaries excluding the current applicant',type:'number',min:0,max:30,step:1,required:true}
  ];
  const investorFields=[
    {id:'name',ar:'اسم المستثمر كما بجواز السفر',en:'Investor name as shown in passport',type:'text',required:true},
    {id:'nationality',ar:'الجنسية (اكتب اسم الدولة)',en:'Nationality (enter the country name)',type:'nationality',required:true},
    {id:'passport',ar:'رقم جواز السفر',en:'Passport number',type:'text',required:true},
    {id:'passportExpiry',ar:'تاريخ انتهاء جواز السفر',en:'Passport expiry date',type:'date',required:true},
    {id:'role',ar:'صفة المستثمر بالشركة وفق الشكل القانوني',en:'Investor’s capacity according to legal form',type:'select',required:true,options:v=>roleOptions(v)},
    {id:'sharePercent',ar:'نسبة مساهمة المستثمر في رأس المال (%) — للشركات المساهمة',en:'Investor shareholding percentage (%) — joint-stock companies',type:'number',min:0,max:100,required:true,showWhen:v=>v.legalForm==='joint'},
    {id:'shareValue',ar:'قيمة المساهمة / المشاركة',en:'Share / participation value',type:'number',min:0,required:true}
  ];
  const applicantFields=[
    {id:'applicantName',ar:'اسم مقدم الطلب',en:'Applicant name',type:'text',required:true},
    {id:'applicantRole',ar:'صفة مقدم الطلب وحقه في تمثيل الشركة',en:'Applicant role and authority to represent company',type:'select',required:true,options:[['principal','صاحب الشأن','Principal / party in interest'],['agent','وكيل بتوكيل رسمي','Agent with official power of attorney'],['delegate','مفوض بصحة توقيع بنكي','Delegate with bank-verified signature']]},
    {id:'phone',ar:'رقم الهاتف المصري',en:'Egyptian phone number',type:'tel',required:true,placeholder:'01012345678'},
    {id:'email',ar:'البريد الإلكتروني',en:'Email address',type:'email',required:true}
  ];
  const serviceFields={
    visa:[{id:'outsideEgypt',ar:'هل المستثمر خارج مصر حاليًا؟',en:'Is the investor currently outside Egypt?',type:'select',required:true,options:[['yes','نعم','Yes'],['no','لا','No']] }],
    grant:[{id:'firstOnCompany',ar:'هل هذه أول إقامة للمستثمر على هذه الشركة تحديدًا؟',en:'Is this the investor’s first residence through this specific company?',type:'select',required:true,options:[['yes','نعم','Yes'],['no','لا، سبق حصوله عليها على الشركة نفسها','No, previously through same company']]}],
    renew:[{id:'previousResidence',ar:'هل الإقامة السابقة صادرة على الشركة نفسها؟',en:'Was the previous residence issued through the same company?',type:'select',required:true,options:[['yes','نعم','Yes'],['no','لا','No']]},{id:'lastResidenceExpiry',ar:'تاريخ انتهاء الإقامة السابقة',en:'Previous residence expiry date',type:'date',required:true}],
    movement:[{id:'previousResidence',ar:'هل سبق للمستثمر الحصول على إقامة على هذه الشركة؟',en:'Has the investor previously held residence through this company?',type:'select',required:true,options:[['yes','نعم','Yes'],['no','لا','No']]},{id:'birthDate',ar:'تاريخ ميلاد المستثمر',en:'Investor date of birth',type:'date',required:true},{id:'lastResidenceExpiry',ar:'تاريخ انتهاء الإقامة',en:'Residence expiry date',type:'date'},{id:'departureDate',ar:'تاريخ مغادرة البلاد',en:'Departure date',type:'date',required:true}]
  };
  function companyAge(v){if(!v.companyStart)return null;const d=new Date(v.companyStart+'T12:00:00');return Number.isNaN(d.getTime())?null:(Date.now()-d.getTime())/86400000;}
  function hasReachedAnniversary(dateValue,years){if(!dateValue)return false;const d=new Date(String(dateValue)+'T12:00:00');if(Number.isNaN(d.getTime()))return false;const threshold=new Date(d);threshold.setFullYear(threshold.getFullYear()+years);const today=new Date();today.setHours(12,0,0,0);return today>=threshold;}
  function committeeRequirement(v){if(currentService!=='renew')return '';if(v.activityStatus==='none')return 'none';if(v.activityStatus==='start'&&hasReachedAnniversary(v.inspectionDate,5))return 'continuity';if(v.activityStatus==='serious'&&hasReachedAnniversary(v.inspectionDate,1))return 'annual';return ''; }
  function underSixMonths(date){if(!date||Number.isNaN(date.getTime()))return false;const now=new Date();now.setHours(0,0,0,0);const monthStart=new Date(now.getFullYear(),now.getMonth()+6,1);const lastDay=new Date(monthStart.getFullYear(),monthStart.getMonth()+1,0).getDate();const limit=new Date(monthStart.getFullYear(),monthStart.getMonth(),Math.min(now.getDate(),lastDay));return date<limit;}
  function activityStatusOptions(v){if(currentService==='renew')return [['start','بدأت النشاط من خلال لجنة بدء النشاط','Activity commenced through a commencement committee'],['serious','لم تبدأ النشاط وتم إثبات الجدية','Activity has not commenced; seriousness has been verified'],['none','لم تبدأ النشاط ولم يتم إثبات الجدية','Activity has not commenced and seriousness has not been verified']];const underYear=companyAge(v)!==null&&companyAge(v)<365.25;return underYear?[['new','موافقة حديثة لم يمر عليها عام','Recently approved — less than one year'],['operating','بدأت النشاط من خلال لجنة معاينة','Activity commenced and verified by inspection'],['serious','إثبات الجدية من خلال لجنة معاينة','Seriousness verified by inspection']]:[['under','لم تتقدم بإثبات جدية أو بدء نشاط من قبل','Has not yet submitted proof of seriousness or commencement'],['operating','بدأت النشاط من خلال لجنة معاينة / مستند معتمد','Operating, verified by inspection / approved document'],['serious','إثبات الجدية من خلال لجنة معاينة','Seriousness verified by inspection']];}
  function roleOptions(v){if(v.legalForm==='joint')return [['joint_shareholder_chair','مساهم ورئيس مجلس إدارة','Shareholder and Chairman of the Board'],['joint_shareholder_deputy','مساهم ونائب رئيس مجلس إدارة','Shareholder and Vice Chairman of the Board'],['joint_shareholder_member','مساهم وعضو مجلس إدارة','Shareholder and Board Member'],['joint_rep_chair','ممثل عن شركة ورئيس مجلس إدارة','Company Representative and Chairman of the Board'],['joint_rep_deputy','ممثل عن شركة ونائب رئيس مجلس إدارة','Company Representative and Vice Chairman of the Board'],['joint_rep_member','ممثل عن شركة وعضو مجلس إدارة','Company Representative and Board Member']];if(v.legalForm==='partnership'||v.legalForm==='limitedShares')return [['general_partner_manager','شريك متضامن ومدير','General Partner and Manager']];if(v.legalForm==='llc')return [['llc_partner_manager','شريك ومدير','Partner and Manager'],['llc_rep_manager','ممثل عن شركة ومدير','Company Representative and Manager']];if(v.legalForm==='sole')return [['sole_owner','صاحب المنشأة','Establishment Owner']];if(v.legalForm==='one')return [['one_owner_manager','صاحب الشركة ومدير','Company Owner and Manager'],['one_rep_manager','ممثل عن شركة ومدير','Company Representative and Manager']];return [['partner','شريك','Partner'],['manager','مدير له حق الإدارة والتوقيع','Manager with management/signing authority'],['legalRep','ممثل عن شركة','Company Representative']];}
  function isCompanyRepresentativeRole(role){return typeof role==='string'&&(/_rep_/.test(role)||role==='llc_rep_manager'||role==='one_rep_manager');}
  function investorRoleDisplay(person,legalForm){const role=String(person&&person.role||'');const options=roleOptions({legalForm});const selected=options.find(o=>o[0]===role);let text=selected?(lang()==='ar'?selected[1]:selected[2]):role;if(isCompanyRepresentativeRole(role)){const company=String(person.representedCompany||'').trim();if(company){if(lang()==='ar')text=text.replace('ممثل عن شركة','ممثل عن شركة '+company);else text=text.replace('Company Representative','Representative of '+company);}}return text;}
  const nationalities=['أفغاني','ألباني','جزائري','أمريكي','أندوري','أنغولي','أرجنتيني','أرميني','أسترالي','نمساوي','أذربيجاني','بحريني','بنغلاديشي','بلجيكي','برازيلي','بريطاني','بلغاري','كاميروني','كندي','تشيلي','صيني','كولومبي','كونغولي','كرواتي','كوبي','قبرصي','تشيكي','دنماركي','سوداني','إثيوبي','فنلندي','فرنسي','ألماني','غاني','يوناني','هندي','إندونيسي','إيراني','عراقي','أيرلندي','إيطالي','ياباني','أردني','كازاخستاني','كيني','كويتي','لبناني','ليبي','ماليزي','مغربي','نيجيري','كوري شمالي','نرويجي','عماني','باكستاني','فلسطيني','فلبيني','بولندي','برتغالي','قطري','روماني','روسي','سعودي','سنغالي','صومالي','جنوب أفريقي','إسباني','سوري','سويدي','سويسري','تونسي','تركي','أوغندي','أوكراني','إماراتي','أوزبكي','فنزويلي','فيتنامي','يمني','جنوب سوداني','تايلاندي','هولندي','أردني','أخرى'];
  // English labels are displayed to English-speaking users while Arabic values remain stored for compatibility.
  const nationalityEnglish={'أفغاني':'Afghan','ألباني':'Albanian','جزائري':'Algerian','أمريكي':'American','أندوري':'Andorran','أنغولي':'Angolan','أرجنتيني':'Argentine','أرميني':'Armenian','أسترالي':'Australian','نمساوي':'Austrian','أذربيجاني':'Azerbaijani','بحريني':'Bahraini','بنغلاديشي':'Bangladeshi','بلجيكي':'Belgian','برازيلي':'Brazilian','بريطاني':'British','بلغاري':'Bulgarian','كاميروني':'Cameroonian','كندي':'Canadian','تشيلي':'Chilean','صيني':'Chinese','كولومبي':'Colombian','كونغولي':'Congolese','كرواتي':'Croatian','كوبي':'Cuban','قبرصي':'Cypriot','تشيكي':'Czech','دنماركي':'Danish','سوداني':'Sudanese','إثيوبي':'Ethiopian','فنلندي':'Finnish','فرنسي':'French','ألماني':'German','غاني':'Ghanaian','يوناني':'Greek','هندي':'Indian','إندونيسي':'Indonesian','إيراني':'Iranian','عراقي':'Iraqi','أيرلندي':'Irish','إيطالي':'Italian','ياباني':'Japanese','أردني':'Jordanian','كازاخستاني':'Kazakhstani','كيني':'Kenyan','كويتي':'Kuwaiti','لبناني':'Lebanese','ليبي':'Libyan','ماليزي':'Malaysian','مغربي':'Moroccan','نيجيري':'Nigerian','كوري شمالي':'North Korean','نرويجي':'Norwegian','عماني':'Omani','باكستاني':'Pakistani','فلسطيني':'Palestinian','فلبيني':'Filipino','بولندي':'Polish','برتغالي':'Portuguese','قطري':'Qatari','روماني':'Romanian','روسي':'Russian','سعودي':'Saudi','سنغالي':'Senegalese','صومالي':'Somali','جنوب أفريقي':'South African','إسباني':'Spanish','سوري':'Syrian','سويدي':'Swedish','سويسري':'Swiss','تونسي':'Tunisian','تركي':'Turkish','أوغندي':'Ugandan','أوكراني':'Ukrainian','إماراتي':'Emirati','أوزبكي':'Uzbek','فنزويلي':'Venezuelan','فيتنامي':'Vietnamese','يمني':'Yemeni','جنوب سوداني':'South Sudanese','تايلاندي':'Thai','هولندي':'Dutch','أخرى':'Other'};
  // Complete ISO country/territory coverage; preserve legacy Arabic values for saved records.
  const additionalNationalityEnglish = {"مواطن من آيسلندا":"Icelander","مواطن من أروبا":"Aruban","مواطن من أنتيغوا وبربودا":"Antiguan and Barbudan","مواطن من أنغويلا":"Anguillian","مواطن من أورغواي":"Uruguayan","مواطن من أوزبكستان":"Uzbekistani","مواطن من إريتريا":"Eritrean","مواطن من إستونيا":"Estonian","مواطن من إسرائيل":"Israeli","مواطن من إسواتيني":"Eswatini national","مواطن من الأرجنتين":"Argentine","مواطن من الإكوادور":"Ecuadorian","مواطن من البوسنة والهرسك":"Bosnian and Herzegovinian","مواطن من الرأس الأخضر":"Cape Verdean","مواطن من السلفادور":"Salvadoran","مواطن من الصحراء الغربية":"Sahrawi","مواطن من الغابون":"Gabonese","مواطن من المكسيك":"Mexican","مواطن من المملكة العربية السعودية":"Saudi Arabian","مواطن من النيجر":"Nigerien","مواطن من بابوا غينيا الجديدة":"Papua New Guinean","مواطن من باراغواي":"Paraguayan","مواطن من بالاو":"Palauan","مواطن من بربادوس":"Barbadian","مواطن من برمودا":"Bermudian","مواطن من بروناي":"Bruneian","مواطن من بليز":"Belizean","مواطن من بنما":"Panamanian","مواطن من بنين":"Beninese","مواطن من بوتان":"Bhutanese","مواطن من بوتسوانا":"Motswana","مواطن من بورتوريكو":"Puerto Rican","مواطن من بوركينا فاسو":"Burkinabe","مواطن من بوروندي":"Burundian","مواطن من بوليفيا":"Bolivian","مواطن من بولينيزيا الفرنسية":"French Polynesian","مواطن من بيرو":"Peruvian","مواطن من بيلاروس":"Belarusian","مواطن من تايوان":"Taiwanese","مواطن من تركمانستان":"Turkmen","مواطن من ترينيداد وتوباغو":"Trinidadian and Tobagonian","مواطن من تشاد":"Chadian","مواطن من تنزانيا":"Tanzanian","مواطن من توغو":"Togolese","مواطن من توفالو":"Tuvaluan","مواطن من توكيلاو":"Tokelauan","مواطن من تونغا":"Tongan","مواطن من تيمور - ليشتي":"East Timorese","مواطن من جامايكا":"Jamaican","مواطن من جبل طارق":"Gibraltarian","مواطن من جزر البهاما":"Bahamian","مواطن من جزر القمر":"Comorian","مواطن من جزر المالديف":"Maldivian","مواطن من جزر بيتكيرن":"Pitcairn Islander","مواطن من جزر سليمان":"Solomon Islander","مواطن من جزر فارو":"Faroese","مواطن من جزر فوكلاند":"Falkland Islander","مواطن من جزر كايمان":"Caymanian","مواطن من جزر كوك":"Cook Islander","مواطن من جزر كوكوس (كيلينغ)":"Cocos Islander","مواطن من جزر مارشال":"Marshallese","مواطن من جزر والس وفوتونا":"Wallis and Futuna Islander","مواطن من جزيرة كريسماس":"Christmas Islander","مواطن من جزيرة مان":"Manx","مواطن من جزيرة نورفولك":"Norfolk Islander","مواطن من جزيرة هيرد وجزر ماكدونالد":"Heard and McDonald Islander","مواطن من جمهورية أفريقيا الوسطى":"Central African","مواطن من جمهورية الدومينيكان":"Dominican Republic national","مواطن من جورجيا":"Georgian","مواطن من جورجيا الجنوبية وجزر ساندويتش الجنوبية":"South Georgia and the South Sandwich Islander","مواطن من جيبوتي":"Djiboutian","مواطن من جيرسي":"Jerseyman","مواطن من دومينيكا":"Dominican","مواطن من رواندا":"Rwandan","مواطن من زامبيا":"Zambian","مواطن من زيمبابوي":"Zimbabwean","مواطن من ساحل العاج":"Ivorian","مواطن من ساموا":"Samoan","مواطن من ساموا الأمريكية":"American Samoan","مواطن من سان مارينو":"Sammarinese","مواطن من سانت فنسنت وجزر غرينادين":"Vincentian","مواطن من سانت كيتس ونيفيس":"Kittian and Nevisian","مواطن من سانت لوسيا":"Saint Lucian","مواطن من سانت هيلينا":"Saint Helenian","مواطن من ساو تومي وبرينسيبي":"São Toméan","مواطن من سريلانكا":"Sri Lankan","مواطن من سلوفاكيا":"Slovak","مواطن من سلوفينيا":"Slovene","مواطن من سنغافورة":"Singaporean","مواطن من سورينام":"Surinamese","مواطن من سيراليون":"Sierra Leonean","مواطن من سيشل":"Seychellois","مواطن من صربيا":"Serbian","مواطن من طاجيكستان":"Tajik","مواطن من غامبيا":"Gambian","مواطن من غرينادا":"Grenadian","مواطن من غرينلاند":"Greenlander","مواطن من غواتيمالا":"Guatemalan","مواطن من غوادلوب":"Guadeloupean","مواطن من غوام":"Guamanian","مواطن من غويانا الفرنسية":"French Guianan","مواطن من غيانا":"Guyanese","مواطن من غيرنزي":"Guernsey resident","مواطن من غينيا":"Guinean","مواطن من غينيا الاستوائية":"Equatorial Guinean","مواطن من غينيا بيساو":"Bissau-Guinean","مواطن من فانواتو":"Ni-Vanuatu","مواطن من فيجي":"Fijian","مواطن من قيرغيزستان":"Kyrgyz","مواطن من كاليدونيا الجديدة":"New Caledonian","مواطن من كمبوديا":"Cambodian","مواطن من كوريا الجنوبية":"South Korean","مواطن من كوستاريكا":"Costa Rican","مواطن من كيريباتي":"I-Kiribati","مواطن من لاتفيا":"Latvian","مواطن من لاوس":"Lao","مواطن من لوكسمبورغ":"Luxembourger","مواطن من ليبيريا":"Liberian","مواطن من ليتوانيا":"Lithuanian","مواطن من ليختنشتاين":"Liechtensteiner","مواطن من ليسوتو":"Mosotho","مواطن من مالطا":"Maltese","مواطن من مالي":"Malian","مواطن من مدغشقر":"Malagasy","مواطن من مصر":"Egyptian","مواطن من مقدونيا الشمالية":"Macedonian","مواطن من ملاوي":"Malawian","مواطن من منغوليا":"Mongolian","مواطن من موريتانيا":"Mauritanian","مواطن من موريشيوس":"Mauritian","مواطن من موزمبيق":"Mozambican","مواطن من مولدوفا":"Moldovan","مواطن من موناكو":"Monegasque","مواطن من مونتسرات":"Montserratian","مواطن من ميكرونيزيا":"Micronesian","مواطن من ناميبيا":"Namibian","مواطن من ناورو":"Nauruan","مواطن من نيبال":"Nepali","مواطن من نيكاراغوا":"Nicaraguan","مواطن من نيوزيلندا":"New Zealander","مواطن من نيوي":"Niuean","مواطن من هايتي":"Haitian","مواطن من هندوراس":"Honduran","مواطن من هنغاريا":"Hungarian","مواطن من الفاتيكان":"Vatican","مواطن من كوسوفو":"Kosovar"};
  nationalities.push(...Object.keys(additionalNationalityEnglish));
  Object.assign(nationalityEnglish, additionalNationalityEnglish);
  // Remove duplicate legacy entries without changing stored values.
  const uniqueNationalities = [...new Set(nationalities)];
  nationalities.splice(0, nationalities.length, ...uniqueNationalities);

  const countryName=value=>String(value??'').trim().replace(/^مواطن\s+من\s+/u,'').trim();
  const nationalityDisplay=value=>lang()==='en'?(nationalityEnglish[value]||countryName(value)):countryName(value);
  const nationalityEnglishText=value=>nationalityEnglish[value]||countryName(value);
  function fieldGuidance(id){id=String(id||'').replace(/^investor_\d+_/,'');const ar={companyName:'اكتب الاسم مطابقًا حرفيًا للاسم الوارد في السجل التجاري.',companyLaw:'اختر القانون المثبت في السجل التجاري أو عقد التأسيس وآخر تعديل؛ لا تختر بناءً على التخمين.',zone:'اختر منطقة حرة أو منطقة استثمارية فقط إذا كانت الشركة داخل منطقة معتمدة من هذا النوع؛ ما عدا ذلك اختر استثمار داخلي.',legalForm:'اختر الشكل القانوني كما يظهر في السجل التجاري أو عقد التأسيس.',companyStart:'أدخل تاريخ التأسيس الوارد في مستند تأسيس الشركة، وليس تاريخ بدء النشاط.',activityStatus:'اختر الحالة المطابقة لما أثبتته لجنة بدء النشاط أو لجنة المعاينة. إذا لم يبدأ النشاط ولم تثبت الجدية، اختر الحالة الثالثة؛ يمكنك استكمال الطلب مع الالتزام بالتقدم بطلب تشكيل لجنة وإرفاق إيصال السداد.',activityStartDate:'أدخل تاريخ بدء النشاط المثبت بالمستندات.',inspectionDate:'أدخل تاريخ آخر لجنة معاينة. تُحسب مدة الخمس سنوات عند ثبوت بدء النشاط، ومدة السنة عند إثبات الجدية دون بدء النشاط.',activityDescription:'اكتب وصف النشاط الفعلي كما هو في مستندات الشركة، مع تحديد المنتج أو الخدمة الرئيسية.',activityType:'يعرض لك الدليل الأنشطة المستهدفة وشروط كل نشاط. اختر الفئة المطابقة لطبيعة النشاط الذي تمارسه الشركة فعليًا.',locationCategory:'يعرض لك الدليل المناطق المحددة باعتبارها أكثر احتياجًا للتنمية. حدّد المحافظة والمنطقة التي يقع بها موقع ممارسة النشاط الفعلي.',siteName:'أدخل العنوان التفصيلي لمكان ممارسة النشاط، وليس عنوان المقر الإداري إن كان مختلفًا.',siteExpiry:'أدخل تاريخ عقد التخصيص أو تاريخ عقد الانتفاع، أو تاريخ انتهاء عقد الإيجار بحسب نوع سند الحيازة. يجب أن يكون عقد الإيجار ساريًا.',leaseStartDate:'أدخل تاريخ بداية عقد الإيجار كما هو وارد بالعقد.',boardExpiryDate:'أدخل تاريخ انتهاء مدة مجلس الإدارة وفق محضر الجمعية العامة العادية. لا يُعتد بتاريخ التأشير في السجل التجاري باعتباره تاريخ بدء احتساب المدة؛ ويجب تجديد المجلس والتأشير بالتجديد قبل انتهاء مدته.',companyCapital:'أدخل رأس المال المرخص به للشركة المساهمة، أو رأس مال المنشأة الفردية، أو رأس مال الشركة بحسب الشكل القانوني، كما هو مؤشر به في السجل التجاري، وحدد العملة.',capitalAmount:'أدخل القيمة المطابقة لنوع إثبات رأس المال الذي اخترته في القائمة السابقة، وحدد العملة. يجب ألا تتجاوز القيمة المحتسبة رأس المال المؤشر به في السجل التجاري.',insuredWorkers:'أدخل عدد العمالة المصرية المؤمن عليها كما يظهر في برنت التأمينات الحديث. إذا كان العدد أكبر من صفر، أدخل تاريخ إصدار البرنت؛ أما إذا كان صفرًا فلن يظهر حقل التاريخ ولن يُطلب البرنت ضمن المستندات.',insuranceStatementDate:'أدخل تاريخ الإصدار المطبوع على برنت التأمينات. يجب أن يكون البرنت حديثًا وفق متطلبات المستندات.',nationality:'اكتب اسم الدولة مباشرة كما هو وارد في جواز السفر.',residencyBeneficiaries:'أدخل عدد الحاصلين على إقامات سابقة بالشركة بخلاف مقدم الطلب الحالي. يُحتسب من لا تزال إقامته سارية فقط. إذا لم يوجد مستفيدون سابقون، أدخل 0.',visaBeneficiaries:'أدخل عدد الحاصلين على تأشيرات دخول سابقة من خلال الشركة بخلاف مقدم الطلب الحالي. يُحتسب من لا تزال تأشيرته سارية فقط. إذا لم يوجد مستفيدون سابقون، أدخل 0.',passportExpiry:'أدخل تاريخ الانتهاء المطبوع في جواز السفر. الجواز المنتهي غير مقبول، والسريان الأقل من 6 أشهر يتطلب الإقرار الموضح.',role:'اختر الصفة المطابقة للشكل القانوني والمستندات. إذا اخترت «ممثل عن شركة»، أدخل اسم الشركة التي تمثلها في الحقل الذي سيظهر.',representedCompany:'أدخل اسم الشركة التي يمثلها المستثمر مطابقًا للمستندات والسجل التجاري.',sharePercent:'أدخل نسبة ملكية المستثمر في رأس مال الشركة المساهمة من واقع عقد التأسيس أو آخر تعديل، بين أكبر من 0 وحتى 100%.',shareValue:'أدخل قيمة مساهمة المستثمر بالشركة المساهمة أو قيمة مشاركته في الشكل القانوني الآخر؛ لا تتركها فارغة.',applicantRole:'اكتب صفة مقدم الطلب وسند حقه في تمثيل الشركة كما هو مثبت بالسجل التجاري أو التوكيل/التفويض.',phone:'أدخل رقم هاتف مصريًا صحيحًا فقط، محمولًا أو أرضيًا، مع مفتاح مصر عند استخدام الصيغة الدولية.',outsideEgypt:'اختر نعم فقط إذا كان المستثمر خارج مصر وقت تقديم طلب تأشيرة الدخول.',firstOnCompany:'اختر نعم إذا لم يسبق للمستثمر الحصول على إقامة على هذه الشركة نفسها؛ وإلا فاختر خدمة التجديد.',previousResidence:'أجب وفق الإقامة السابقة المثبتة على الشركة نفسها.',lastResidenceExpiry:'أدخل تاريخ انتهاء الإقامة كما هو مطبوع على المستند.',departureDate:'أدخل تاريخ مغادرة مصر كما هو مثبت بالمستندات.'};const en={companyName:'Enter the company name exactly as shown in the commercial register.',companyLaw:'Choose the law shown in the register, incorporation deed, or latest amendment; do not guess.',zone:'Choose a free/investment zone only if the company is in a formally designated zone; otherwise choose domestic investment.',legalForm:'Select the legal form shown in the commercial register or incorporation deed.',companyStart:'Enter the incorporation date shown in company documents, not the activity start date.',activityStatus:currentService==='renew'?'Choose one of the three statuses exactly as supported by the company documents and inspection records. If neither commencement nor seriousness has been verified, you may continue but must apply for an inspection committee and attach the fee receipt.':'Choose the status supported by company documents. Do not claim commencement or seriousness unless an inspection committee verified it.',inspectionStatus:'Choose the result recorded in the inspection committee report.',inspectionDate:'Enter the date of the latest inspection report verifying commencement or seriousness.',activityStartDate:'Enter the commencement date supported by company documents.',leaseStartDate:'Enter the lease start date exactly as stated in the contract.',boardExpiryDate:'Enter the board expiry date stated in the ordinary general assembly minutes. The term is calculated from the meeting date, not the commercial-register endorsement date; renew the board and record the renewal before continuing.',activityDescription:'Describe the actual activity as documented, including the main product or service.',activityType:'The in-page guide presents the targeted activities and the conditions for each. Choose the category matching the company’s actual activity.',locationCategory:'The in-page guide presents the areas identified as priorities for development. Select the governorate and area containing the actual business site.',siteName:'Enter the full physical business-site address, not just the administrative office if different.',siteExpiry:'Enter the allocation-contract date, usufruct-contract date, or lease end date according to the selected occupancy document. The lease must remain valid.',companyCapital:'Enter the authorised capital for a joint-stock company, establishment capital for a sole proprietorship, or company capital for other legal forms, as recorded in the commercial register.',capitalAmount:'Enter the value corresponding to the capital evidence type selected above, and select the currency. The counted value must not exceed the capital recorded in the commercial register.',insuredWorkers:'Enter the number of insured Egyptian workers shown on the recent social-insurance statement. If the number is greater than zero, enter the statement issue date and provide the statement; if it is zero, the date field and document requirement are omitted.',insuranceStatementDate:'Enter the issue date printed on the social-insurance statement. The statement must meet the document recency requirements.',nationality:'Enter the country name directly as shown in the passport.',residencyBeneficiaries:'Enter the number of previous residence holders through the company, excluding the current applicant. Only valid residences count. Enter 0 if there are none.',visaBeneficiaries:'Enter the number of previous entry-visa holders through the company, excluding the current applicant. Only valid visas count. Enter 0 if there are none.',passportExpiry:'Enter the expiry date printed on the passport. Expired passports are not accepted; under-six-month validity requires the stated undertaking.',role:'Choose the capacity matching the legal form and company documents. If you choose a company representative role, enter the represented company name in the field that appears.',representedCompany:'Enter the represented company name exactly as shown in the company documents and commercial register.',sharePercent:'Enter the investor ownership percentage from the incorporation deed or latest amendment, greater than 0 and up to 100%.',shareValue:'Enter the investor shareholding value for joint-stock companies or participation value for other legal forms; it is mandatory.',applicantRole:'Enter the applicant capacity and authority to represent the company as evidenced by the register, power of attorney, or delegation.',phone:'Enter a valid Egyptian phone number only, mobile or landline. Use Egypt’s country code when entering the international format.',outsideEgypt:'Select yes only if the investor is outside Egypt when applying for an entry visa.',firstOnCompany:'Select yes if the investor has not previously held residence through this same company; otherwise choose renewal.',previousResidence:'Answer based on the previous residence issued through the same company.',lastResidenceExpiry:'Enter the expiry date shown on the residence document.',departureDate:'Enter the departure date as supported by the travel documents.'};return (lang()==='ar'?ar:en)[id]||'';}
  function showMessage(title,detail,fieldName){let box=$('#rfMessageDialog');if(!box){document.body.insertAdjacentHTML('beforeend',`<div class="rf-modal-backdrop" id="rfMessageDialog" role="dialog" aria-modal="true" aria-labelledby="rfModalTitle"><div class="rf-modal"><div class="rf-modal-icon">!</div><h3 id="rfModalTitle"></h3><p id="rfModalDetail"></p><button type="button" class="primary-action" id="rfModalClose">${lang()==='ar'?'فهمت، متابعة':'Understood'}</button></div></div>`);box=$('#rfMessageDialog');}box.removeAttribute('data-notice');box.setAttribute('dir',lang()==='ar'?'rtl':'ltr');$('#rfModalTitle',box).textContent=title;$('#rfModalDetail',box).textContent=detail+(fieldName&&fieldGuidance(fieldName)?'\n\n'+fieldGuidance(fieldName):'');const target=fieldName?$(`[name="${fieldName}"]`,mount):null;target?.closest('.rf-field')?.classList.add('rf-field-missing');box.hidden=false;$('#rfModalClose',box).onclick=()=>{box.hidden=true;if(fieldName){const el=$(`[name="${fieldName}"]`,mount);el?.focus();el?.scrollIntoView({behavior:'smooth',block:'center'});}};}
  function showBeneficiaryCountNotice(fieldId,invalid=false){
    const ar=lang()==='ar',isVisa=fieldId==='visaBeneficiaries';
    const benefit=ar?(isVisa?'تأشيرات دخول':'إقامات'):(isVisa?'entry visas':'residences');
    const title=ar?(invalid?'عدد المستفيدين غير صحيح':'يلزم تسجيل عدد المستفيدين السابقين'):(invalid?'Invalid beneficiary count':'Previous beneficiary count required');
    const detail=ar
      ? `قبل الانتقال، أدخل عدد الأشخاص الآخرين الذين سبق حصولهم على ${benefit} من خلال هذه الشركة.\n\nيُستخدم هذا العدد لحساب عدد الأماكن المتبقية التي تسمح بها فئة الوزن النسبي، ومعرفة عدد المستثمرين الذين يمكن التقدم لهم بخدمة جديدة.\n\nلا تحتسب المستثمر الحالي الذي يُقدَّم له الطلب الآن ضمن العدد، سواء كانت الخدمة الحالية تأشيرة دخول أو منح إقامة أو تجديد إقامة.\n\nيُحتسب ضمن الحد من لا تزال ${isVisa?'تأشيرته':'إقامته'} سارية فقط. إذا لم يسبق لأي شخص آخر الحصول على ${isVisa?'تأشيرة دخول':'إقامة'} من خلال الشركة، أدخل (0). ويجب إدخال عدد صحيح من 0 إلى 30.`
      : `Before continuing, enter the number of other people who have previously received ${benefit} through this company.\n\nThis number is used to calculate the remaining places allowed by the company’s relative-weight category and how many investors may apply for a new service.\n\nDo not include the current investor whose application is being prepared now, whether the current service is an entry visa, first-time residence grant, or residence renewal.\n\nOnly people whose ${isVisa?'entry visa':'residence'} is still valid count toward the limit. If no other person has previously received an ${isVisa?'entry visa':'residence'} through this company, enter (0). Enter a whole number from 0 to 30.`;
    showMessage(title,detail,fieldId);
    const box=$('#rfMessageDialog');if(box){box.setAttribute('data-notice','beneficiary-count');box.setAttribute('dir',ar?'rtl':'ltr');const icon=$('.rf-modal-icon',box);if(icon)icon.textContent='!';}
  }
  function openEligibilityWizard(kind){
    const ar=lang()==='ar';
    const isActivity=kind==='activityType';
    const items=isActivity?(ar?[
      ['الطاقة الجديدة والمتجددة','مثل مشروعات إنتاج الطاقة الشمسية أو طاقة الرياح. طابق النشاط الفعلي والترخيص مع الفئة الواردة في الوثيقة.'],
      ['الصناعات الثقيلة التي تحددها الهيئة العامة للتنمية الصناعية','لا يكفي وصف النشاط بأنه صناعي؛ يجب أن يكون ضمن الصناعات التي تحددها الجهة المختصة.'],
      ['الصناعات التكنولوجية المستهدفة','الوثيقة تستثني التجميع والبرامج من هذه الفئة؛ راجع النشاط الفعلي والتصنيف الصناعي.'],
      ['صناعة الأدوية والصناعات المغذية','تحقق من أن النشاط الفعلي تصنيع أدوية أو صناعة مغذية، وليس مجرد تجارة أو توزيع.'],
      ['التعليم دون الجامعي','مثل أنشطة التعليم قبل الجامعي، وفق الترخيص وطبيعة النشاط الفعلية.'],
      ['التنمية المتكاملة','مشروعات تنمية متكاملة ذات طابع سياحي أو صناعي أو عمراني أو زراعي.'],
      ['استصلاح واستزراع الأراضي البور أو الصحراوية','يشترط وفق الوثيقة مساحة لا تقل عن 500 فدان وحيازة مستقرة؛ لا تختَرها إذا لم تتحقق الشروط.'],
      ['إقامة المستشفيات','تحقق من أن المشروع لإقامة مستشفى، وليس نشاطًا طبيًا مختلفًا لا تنطبق عليه الفئة.'],
      ['الفنادق والقرى السياحية','القاعدة المذكورة طاقة إيوائية لا تقل عن 500 غرفة، مع استثناءات محددة لبعض المناطق.'],
      ['مشروعات البنية الأساسية','مثل مياه الشرب والصرف الصحي والكهرباء والطرق والاتصالات وخطوط مترو الأنفاق.'],
      ['قطاع البترول أو مشروعات تحلية المياه المتكاملة','في التحلية، تشير الوثيقة إلى المشروع المتكامل: إقامة وتشغيل وإدارة.'],
      ['مشروعات المناطق الحرة ذات الصادرات التي تتجاوز 80%','تحتاج إلى الإثباتات المحددة بالوثيقة من المنطقة الحرة؛ لا يكفي تقدير نسبة التصدير دون مستند.']
    ]:[
      ['Renewable energy','For example, solar or wind power generation. Match the actual activity and licence to the source category.'],
      ['Heavy industries specified by the Industrial Development Authority','Being an industrial business is not enough; it must fall within the industries specified by the competent authority.'],
      ['Targeted technology industries','The source excludes assembly and software from this category; verify the actual activity and industrial classification.'],
      ['Pharmaceutical and supporting industries','Verify that the actual activity is manufacturing, not only trading or distribution.'],
      ['Non-university education','For example, pre-university education, subject to the licence and actual activity.'],
      ['Integrated development','Integrated tourism, industrial, urban, or agricultural development projects.'],
      ['Reclaiming/cultivating barren or desert land','The source specifies at least 500 feddans and stable tenure; do not select unless both conditions apply.'],
      ['Establishing hospitals','Verify that the project is to establish a hospital, not another type of medical activity.'],
      ['Hotels and tourist resorts','The stated baseline is at least 500 rooms, with specified exceptions for certain areas.'],
      ['Infrastructure projects','Drinking water, wastewater, electricity, roads, communications, and metro lines.'],
      ['Petroleum or integrated desalination','For desalination, the source refers to an integrated establish-operate-manage project.'],
      ['Free-zone projects exporting over 80%','Requires evidence specified in the source from the free zone; do not rely on an undocumented estimate.']
    ]):(ar?[
      ['جنوب محافظة الجيزة','تشمل الواحات البحرية والصف والعياط. يُحدد الموقع وفق المنطقة التي يقع بها مقر ممارسة النشاط الفعلي.'],
      ['إقليم قناة السويس','يشمل بورسعيد والإسماعيلية والسويس (شرق القناة)، وفق النطاق المكاني المحدد.'],
      ['المحافظات الحدودية والمناطق المحددة','تشمل أسوان ومرسى مطروح وشمال سيناء وجنوب سيناء والوادي الجديد ومحافظة البحر الأحمر من جنوب سفاجا.'],
      ['محافظات الصعيد','تشمل الفيوم وبني سويف والمنيا وأسيوط وسوهاج وقنا والأقصر وأسوان.']
    ]:[
      ['South Giza','Includes Bahariya Oasis, Saf, and Ayat. The location is identified by the area containing the actual business site.'],
      ['Suez Canal region','Includes Port Said, Ismailia, and Suez (east of the Canal), within the specified geographic scope.'],
      ['Border governorates and specified areas','Includes Aswan, Marsa Matrouh, North Sinai, South Sinai, New Valley, and the Red Sea Governorate south of Safaga.'],
      ['Upper Egypt governorates','Includes Fayoum, Beni Suef, Minya, Assiut, Sohag, Qena, Luxor, and Aswan.']
    ]);
    let index=0;
    const old=document.getElementById('rfEligibilityWizard'); if(old)old.remove();
    const title=isActivity?(ar?'مساعد التحقق من غرض النشاط':'Activity purpose checker'):(ar?'مساعد التحقق من موقع المشروع':'Project location checker');
    const intro=isActivity?(ar?'استعرض فئات الأنشطة وشروط كل فئة. اختر «هذا ينطبق على شركتي» عند مطابقة النشاط الذي تمارسه الشركة فعليًا مع الفئة المعروضة.':'Review the activity categories and their conditions. Select “This matches my company” when the company’s actual activity matches the displayed category.'):(ar?'استعرض المناطق المحددة باعتبارها أكثر احتياجًا للتنمية. اختر المنطقة التي يقع داخل نطاقها موقع ممارسة النشاط الفعلي.':'Review the areas identified as development priorities. Select the area containing the actual business site.');
    const overlay=document.createElement('div'); overlay.id='rfEligibilityWizard'; overlay.className='rf-eligibility-overlay'; overlay.setAttribute('role','dialog'); overlay.setAttribute('aria-modal','true'); overlay.setAttribute('aria-labelledby','rfEligibilityTitle');
    overlay.innerHTML=`<div class="rf-eligibility-dialog" dir="${ar?'rtl':'ltr'}"><div class="rf-eligibility-head"><div class="rf-eligibility-mark">${isActivity?'◎':'⌖'}</div><button type="button" class="rf-eligibility-close" aria-label="${ar?'إغلاق':'Close'}">×</button><span class="rf-eligibility-kicker">${ar?'دليل تفاعلي خطوة بخطوة':'STEP-BY-STEP GUIDE'}</span><h3 id="rfEligibilityTitle">${title}</h3><p>${intro}</p><div class="rf-eligibility-progress"><span></span></div><small class="rf-eligibility-count"></small></div><div class="rf-eligibility-body"><div class="rf-eligibility-number"></div><h4></h4><p></p>${!isActivity?`<div class="rf-eligibility-location-note">${ar?'المناطق المعروضة هي المناطق المحددة بالوثيقة باعتبارها أكثر احتياجًا للتنمية. اختر النطاق الذي يقع فيه موقع ممارسة النشاط الفعلي.':'The areas shown are those identified in the document as development priorities. Select the area containing the actual business site.'}</div>`:''}<div class="rf-eligibility-proof"><span>20%</span><p class="rf-eligibility-proof-note">${ar?(isActivity?'لا يُعتد بالتأشير في السجل التجاري على ممارسة النشاط وحده لاحتساب نسبة 20%. يلزم إثبات بدء النشاط أو الجدية بمحضر لجنة معاينة وفق الضوابط؛ وإلا يُحتسب معيار النشاط بنسبة 10% فقط.':'لا يُعتد بالتأشير في السجل التجاري على موقع ممارسة النشاط وحده لاحتساب نسبة 20%. يلزم إثبات بدء النشاط أو الجدية بمحضر لجنة معاينة وفق الضوابط؛ وإلا يُحتسب معيار الموقع بنسبة 10% فقط.'):(isActivity?'A commercial-register entry for the activity alone is not sufficient for the 20% weight. Commencement or seriousness must be evidenced by an inspection committee under the applicable rules; otherwise, the activity criterion counts as 10%.':'A commercial-register entry for the business location alone is not sufficient for the 20% weight. Commencement or seriousness must be evidenced by an inspection committee under the applicable rules; otherwise, the location criterion counts as 10%.')}</p></div></div><div class="rf-eligibility-actions"><button type="button" class="rf-eligibility-secondary rf-eligibility-prev">${ar?'السابق':'Previous'}</button><button type="button" class="rf-eligibility-secondary rf-eligibility-next">${ar?'الغرض التالي':'Next item'}</button><button type="button" class="rf-eligibility-match">${ar?(isActivity?'هذا هو نشاط شركتي':'هذا هو موقع ممارسة نشاطي'):(isActivity?'This is my company’s activity':'This is my business site')}</button></div><div class="rf-eligibility-footer">${ar?(isActivity?'يُحتسب غرض النشاط بنسبة 20% عند ثبوت بدء النشاط أو الجدية من خلال لجنة معاينة. وفي غير ذلك يُحتسب بنسبة 10%.':'يُحتسب موقع النشاط بنسبة 20% عند ثبوت بدء النشاط أو الجدية من خلال لجنة معاينة. وفي غير ذلك يُحتسب بنسبة 10%.'):(isActivity?'The activity criterion counts as 20% when commencement or seriousness is established by an inspection committee. Otherwise, it counts as 10%.':'The location criterion counts as 20% when commencement or seriousness is established by an inspection committee. Otherwise, it counts as 10%.')}</div></div>`;
    document.body.appendChild(overlay);
    const draw=()=>{const item=items[index];overlay.querySelector('.rf-eligibility-number').textContent=`${String(index+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;overlay.querySelector('.rf-eligibility-body h4').textContent=item[0];overlay.querySelector('.rf-eligibility-body>p').textContent=item[1];overlay.querySelector('.rf-eligibility-count').textContent=ar?`الخطوة ${index+1} من ${items.length}`:`Step ${index+1} of ${items.length}`;overlay.querySelector('.rf-eligibility-progress span').style.width=`${(index+1)/items.length*100}%`;overlay.querySelector('.rf-eligibility-prev').disabled=index===0;overlay.querySelector('.rf-eligibility-next').textContent=index===items.length-1?(ar?'لم أجد ما ينطبق':'None matched'): (ar?'الغرض التالي':'Next item');};
    const finish=value=>{const select=$(`[name="${kind}"]`,mount);if(select)select.value=value;values=getCurrentValues();values[kind]=value;try{localStorage.setItem(storageKey(currentService),JSON.stringify(values));}catch{}overlay.remove();renderStep();};
    overlay.querySelector('.rf-eligibility-close').onclick=()=>{overlay.remove();const select=$(`[name="${kind}"]`,mount);if(select){select.value='';values=getCurrentValues();persist();}};
    overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.querySelector('.rf-eligibility-close').click();});
    overlay.querySelector('.rf-eligibility-prev').onclick=()=>{if(index>0){index--;draw();}};
    overlay.querySelector('.rf-eligibility-next').onclick=()=>{if(index<items.length-1){index++;draw();}else finish('other');};
    overlay.querySelector('.rf-eligibility-match').onclick=()=>finish('targeted');
    draw();
  }
  function fieldHtml(f,v){if(f.showWhen&&!f.showWhen(v))return '';let control='';const val=v[f.id]??'';const opts=typeof f.options==='function'?f.options(v):f.options;
    if(f.type==='guided-activity'||f.type==='guided-location'){
      const ar=lang()==='ar'; const isActivity=f.type==='guided-activity'; const id=f.id;
      const options=ar?[["targeted",isActivity?'ضمن الأغراض المستهدفة':'الموقع ضمن المواقع المستهدفة'],["other",isActivity?'خارج الأغراض المستهدفة':'الموقع خارج المواقع المستهدفة'],["review",'استعرض الدليل التفاعلي']]:[["targeted",isActivity?'Targeted purpose':'Targeted location'],["other",isActivity?'Outside targeted purposes':'Outside targeted locations'],["review",'Open the interactive guide']];
      control=`<select id="rf-${id}" name="${id}" ${f.required?'required':''}><option value="">${ar?'اختر النتيجة أو افتح الدليل':'Choose a result or open the guide'}</option>${options.map(o=>`<option value="${o[0]}" ${val===o[0]?'selected':''}>${o[1]}</option>`).join('')}</select><p class="rf-eligibility-hint">${ar?(isActivity?'يمكنك فتح الدليل التفاعلي لاستعراض كل نشاط وشروطه داخل المنصة.':'يمكنك فتح الدليل التفاعلي لاستعراض المناطق المحددة داخل المنصة.'):(isActivity?'Open the interactive guide to explore each activity and its conditions inside the platform.':'Open the interactive guide to explore the listed areas inside the platform.')}</p>`;
      return `<label class="rf-field rf-field-guided" for="rf-${id}"><span>${escLabel(f)}${f.required?' <em>*</em>':''}</span>${control}</label>`;
    }
    const labelText=`${escLabel(f)}${f.required?' <em>*</em>':''}`;
    if(f.type==='currency'){
      const currencyKey=`${f.id}Currency`, currency=v[currencyKey]||'EGP';
      const currencyLabel=f.id==='capitalAmount'?(lang()==='ar'?'بقيمة':'Amount in'):(lang()==='ar'?'العملة':'Currency');
      control=`<div class="rf-currency-control"><input id="rf-${f.id}" name="${f.id}" type="number" min="0" step="any" value="${esc(val)}" ${f.required?'required':''}><div class="rf-currency-select">${f.id==='capitalAmount'?'':`<span>${currencyLabel}</span>`}<select id="rf-${currencyKey}" name="${currencyKey}"><option value="EGP" ${currency==='EGP'?'selected':''}>${lang()==='ar'?'جنيه مصري (EGP)':'Egyptian pound (EGP)'}</option><option value="USD" ${currency==='USD'?'selected':''}>${lang()==='ar'?'دولار أمريكي (USD)':'US dollar (USD)'}</option></select></div></div>`;
      if((f.id==='companyCapital'&&v.companyCapitalCurrency==='USD')||(f.id==='capitalAmount'&&v.capitalAmountCurrency==='USD'))control+=`<p class="rf-currency-hint">${lang()==='ar'?'سيُحوّل المبلغ إلى الجنيه المصري باستخدام سعر الصرف أدناه لحساب فئة الوزن النسبي.':'The amount will be converted to EGP using the exchange rate below for relative-weight calculation.'}</p>`;
      return `<label class="rf-field" for="rf-${f.id}"><span>${labelText}</span>${control}</label>`;
    }
    if(f.type==='select')control=`<select id="rf-${f.id}" name="${f.id}" ${f.required?'required':''}><option value="">${t('choose')}</option>${opts.map(o=>`<option value="${o[0]}" ${val===o[0]?'selected':''}>${lang()==='ar'?o[1]:o[2]}</option>`).join('')}</select>`;else if(f.type==='nationality')control=`<input id="rf-${f.id}" name="${f.id}" type="text" value="${esc(countryName(val))}" placeholder="${lang()==='ar'?'اكتب اسم الدولة مباشرة':'Enter country name'}" maxlength="80" autocomplete="country-name" dir="auto" ${f.required?'required':''}>`;else control=`<input id="rf-${f.id}" name="${f.id}" type="${f.type||'text'}" value="${esc(val)}" ${f.required?'required':''} ${f.min!==undefined?`min="${f.min}"`:''} ${f.max!==undefined?`max="${f.max}"`:''} ${f.step!==undefined?`step="${f.step}"`:''} ${f.id==='phone'?`inputmode="tel" autocomplete="tel" maxlength="16"`:''} ${f.pattern?`pattern="${f.pattern}"`:''} ${f.id==='unifiedRegister'?`inputmode="numeric" maxlength="15" minlength="15" autocomplete="off" title="${lang()==='ar'?'يجب إدخال 15 رقمًا فقط':'Enter exactly 15 digits'}"`:''}>`;const extraHint=f.id==='boardExpiryDate'?`<p class="rf-small-note">${lang()==='ar'?'مدة مجلس الإدارة الأولى خمس سنوات من تاريخ تأسيس الشركة، ويكون التجديد اللاحق كل ثلاث سنوات. يُحتسب تاريخ المدة من تاريخ انعقاد الجمعية العامة العادية، وليس من تاريخ التأشير بالتجديد في السجل التجاري. يجب أن يكون التاريخ المدخل مستقبليًا، مع تجديد المجلس والتأشير به قبل استكمال الطلب.':'The initial board term is five years from incorporation, with subsequent renewals every three years. The term is calculated from the ordinary general assembly meeting date, not the commercial-register endorsement date. The entered expiry date must be in the future, and the renewal must be recorded before continuing.'}</p>`:'';return `<label class="rf-field" for="rf-${f.id}"><span>${labelText}</span>${control}${extraHint}</label>`;}

  function openWeightVideo(){
    const ar=lang()==='ar';
    const existing=document.getElementById('rfWeightVideoModal'); if(existing)existing.remove();
    const modal=document.createElement('div'); modal.id='rfWeightVideoModal'; modal.className='rf-video-overlay'; modal.setAttribute('role','dialog'); modal.setAttribute('aria-modal','true');
    const videoMatch=String(WEIGHT_HELP_VIDEO_URL).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/);
    const videoId=videoMatch?videoMatch[1]:'';
    modal.innerHTML=`<div class="rf-video-dialog" dir="${ar?'rtl':'ltr'}"><div class="rf-video-head"><div><span>${ar?'دليل مرئي':'VIDEO GUIDE'}</span><h3>${ar?'شرح الوزن النسبي':'Relative-weight explanation'}</h3></div><button type="button" class="rf-video-close" aria-label="${ar?'إغلاق':'Close'}">×</button></div>${videoId?`<div class="rf-video-frame"><iframe src="https://www.youtube-nocookie.com/embed/${videoId}" title="${ar?'شرح الوزن النسبي':'Relative-weight explanation'}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`:`<div class="rf-video-placeholder"><div class="rf-video-play">▶</div><strong>${ar?'سيُضاف فيديو الشرح هنا':'The explanatory video will appear here'}</strong><p>${ar?'نافذة العرض جاهزة. عند تجهيز الفيديو، ضع رابط YouTube في المتغير WEIGHT_HELP_VIDEO_URL أعلى ملف js/residency-forms.js.':'The video window is ready. When your video is available, put its YouTube URL in WEIGHT_HELP_VIDEO_URL near the top of js/residency-forms.js.'}</p><a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">${ar?'فتح YouTube':'Open YouTube'} ↗</a></div>`}</div>`;
    document.body.appendChild(modal);
    modal.querySelector('.rf-video-close').onclick=()=>modal.remove();
    modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});
  }
  function score(v){
    const rate=Number(v.exchangeRate), companyRate=v.companyCapitalCurrency==='USD'?rate:1, amountRate=v.capitalAmountCurrency==='USD'?rate:1;
    const rawCap=Number(v.capitalAmount)*amountRate, companyCap=Number(v.companyCapital)*companyRate, workers=Number(v.insuredWorkers);
    const capitalExceeded=Number.isFinite(rawCap)&&Number.isFinite(companyCap)&&rawCap>companyCap;
    const cap=capitalExceeded?companyCap:rawCap;
    const legalMinimum={joint:250000,llc:50000,one:50000,partnership:300000,limitedShares:300000,sole:100000};
    if(!v.legalForm||!v.activityStatus||!v.activityType||!v.locationCategory||!v.activityTypeIndustry||v.insuredWorkers===''||!Number.isFinite(rawCap)||!Number.isFinite(companyCap)||rawCap<=0||companyCap<=0||((v.companyCapitalCurrency==='USD'||v.capitalAmountCurrency==='USD')&&(!Number.isFinite(rate)||rate<=0)))return {complete:false};
    if(legalMinimum[v.legalForm]&&companyCap<legalMinimum[v.legalForm])return {complete:false,capitalMinimumError:true};
    if(cap<50000)return {complete:false,capitalEvidenceMinimumError:true};
    let capital=cap<=1000000?10:cap<=5000000?15:cap<=15000000?20:30;
    // The one-person company and sole-proprietorship have additional deposit/eligibility conditions in the source document.
    const labor=workers<=4?0:workers<=19?5:workers<=99?10:workers<=500?20:30;
    const proven=currentService==='renew'?['start','serious'].includes(v.activityStatus):(['start','serious','operating'].includes(v.activityStatus)&&(['start','serious'].includes(v.inspectionStatus)||(v.activityStatus==='operating'&&v.inspectionStatus==='start')));
    const purpose=v.activityType==='targeted'&&proven?20:10;
    const location=v.locationCategory==='targeted'&&proven?20:10;
    const total=capital+labor+purpose+location;
    const count=total>90?8:total>75?6:total>50?4:total>=30?2:0;
    return {complete:true,capital,labor,purpose,location,total,count,capitalError:false,capitalExceeded,proven,usedCapital:cap,rawCapital:rawCap,companyCap};
  }
  function effectiveMaxCount(v,s){
    if(!s||!s.complete)return 0;
    if(v.legalForm==='sole')return 1;
    if(v.legalForm==='one'&&v.oneOwnerType==='natural')return 1;
    return s.count;
  }
  function checklist(v,s){
    const a=[];
    const add=(ar,en)=>a.push([ar,en]);
    add('طلب على مطبوعات الشركة موجّه إلى رئيس قطاع خدمات الاستثمار، موقّع ممن له حق التوقيع ومختوم بخاتم الشركة — وهو ملف Word الذي ستقوم بتنزيله وطباعته من هذه الصفحة (النموذج الاسترشادي للخدمة).','Company-letterhead request addressed to the Head of Investment Services Sector, signed and stamped — this is the Word file you download and print from this page (the service guidance form).');
    if(v.applicantRole==='agent'){
      const signerAr=v.legalForm==='sole'?'صاحب المنشأة':v.legalForm==='joint'?'رئيس مجلس الإدارة أو صاحب حق التوقيع':v.legalForm==='one'?'مالك الشركة أو المدير':'الشريك المدير أو صاحب حق التوقيع';
      const signerEn=v.legalForm==='sole'?'the establishment owner':v.legalForm==='joint'?'the board chairman or authorized signatory':v.legalForm==='one'?'the company owner or manager':'the managing partner or authorized signatory';
      add('توكيل رسمي موثق من '+signerAr+' يخوّل الوكيل إنهاء إجراءات إقامة المستثمر والتعامل مع الجهات الحكومية.','Official notarized power of attorney from '+signerEn+' authorizing the agent to complete investor-residency procedures and deal with government bodies.');
    }else if(v.applicantRole==='delegate'){
      const signerAr=v.legalForm==='sole'?'صاحب المنشأة':v.legalForm==='joint'?'رئيس مجلس الإدارة أو صاحب حق التوقيع':v.legalForm==='one'?'مالك الشركة أو المدير':'الشريك المدير أو صاحب حق التوقيع';
      const signerEn=v.legalForm==='sole'?'the establishment owner':v.legalForm==='joint'?'the board chairman or authorized signatory':v.legalForm==='one'?'the company owner or manager':'the managing partner or authorized signatory';
      add('تفويض من '+signerAr+' بعد إثبات صحة التوقيع من البنك، يخوّل المفوض إنهاء إجراءات إقامة المستثمر والتعامل مع الجهات الحكومية.','Delegation from '+signerEn+' with bank-verified signature, authorizing the delegate to complete investor-residency procedures and deal with government bodies.');
    }
    /* صاحب الشأن: لا يُطلب توكيل ولا تفويض */
    if(s==='visa')add('عدد (2) صورة ضوئية من جواز سفر المستثمر.','Two photocopies of the investor’s passport.');
    else if(s==='grant')add('عدد (1) صورة من جواز سفر المستثمر.','One copy of the investor’s passport.');
    else if(s==='renew')add('عدد (1) صورة من جواز سفر المستثمر موضحًا بها الإقامة السابقة.','One passport copy showing the previous residence.');
    else {
      add('جواز سفر المستثمر وبيانات الإقامة السابقة الصادرة على الشركة.','Investor passport and details of the previous residence issued through the company.');
      add('بيانات تاريخ مغادرة البلاد؛ ويشير النموذج إلى شرط انقطاع لا يقل عن ستة أشهر عند سريان مدة الإقامة.','Departure date details; the guidance form notes an absence period of at least six months where residence remains valid.');
    }
    if(s!=='movement'){
      add('صورة ضوئية من مستخرج حديث ومجدّد من السجل التجاري، لم يمر على صدوره أكثر من ثلاثة أشهر.','Copy of a recent, renewed commercial-register extract issued within the last three months.');
      if(v.legalForm==='joint'&&hasReachedAnniversary(v.companyStart,5))add('صورة من محضر الجمعية العامة العادية المتضمن تجديد مدة مجلس الإدارة، مع ما يثبت التأشير بالتجديد في السجل التجاري، ويُقدم الأصل للاطلاع.','Copy of the ordinary general assembly minutes renewing the board term, together with evidence that the renewal has been recorded in the commercial register; original for inspection.');
      {
        const isSole=v.legalForm==='sole';
        const entityAr=isSole?'المنشأة':'الشركة';
        const entityEn=isSole?'establishment':'company';
        let supportAr='', supportEn='';
        if(v.capitalEvidence==='paid_register'){
          supportAr=v.legalForm==='joint'?'المبالغ المؤداة المؤشر بها في السجل التجاري':'رأس المال المسدد المؤشر به في السجل التجاري';
          supportEn=v.legalForm==='joint'?'paid-up amounts indicated in the commercial register':'paid-up capital indicated in the commercial register';
        }else if(v.capitalEvidence==='economic'||v.capitalEvidence==='economic_previous'){
          supportAr=v.capitalEvidence==='economic_previous'?'شهادة سبق تقديمها من قطاع الأداء الاقتصادي':'شهادة من قطاع الأداء الاقتصادي';
          supportEn=v.capitalEvidence==='economic_previous'?'previously submitted Economic Performance Sector certificate':'Economic Performance Sector certificate';
        }else if(v.capitalEvidence==='bank'||v.capitalEvidence==='bank_previous'){
          supportAr=v.capitalEvidence==='bank_previous'?'شهادة بنكية سبق تقديمها باسم '+entityAr:'شهادة بنكية باسم '+entityAr;
          supportEn=v.capitalEvidence==='bank_previous'?'previously submitted bank certificate in the '+entityEn+' name':'bank certificate in the '+entityEn+' name';
        }else{
          supportAr='مستند إثبات رأس المال المحدد في النموذج';
          supportEn='capital evidence document selected in the form';
        }
        if(Number(v.insuredWorkers)>0){
          supportAr+='، وبرنت التأمينات (العمالة المصرية)';
          supportEn+=', and the social-insurance statement (Egyptian workforce)';
        }
        supportAr+='، ومستندات إثبات النشاط/الموقع عند انطباقها';
        supportEn+=', and activity/location evidence where applicable';
        add('نموذج الوزن النسبي ل'+entityAr+' والمستندات المؤيدة لكل فئة وهي: '+supportAr+'.',
           'Relative-weight form for the '+entityEn+' and supporting evidence for each criterion, namely: '+supportEn+'.');
      }
      if(v.legalForm==='joint'){
        const paid=v.capitalAmount?Number(v.capitalAmount):null;
        const cur=v.capitalAmountCurrency==='USD'?'دولار أمريكي':'جنيه مصري';
        const curEn=v.capitalAmountCurrency==='USD'?'USD':'EGP';
        const jointEvidence=v.capitalEvidence==='economic'||v.capitalEvidence==='economic_previous'?'شهادة '+(v.capitalEvidence==='economic_previous'?'سبق تقديمها ':'')+'من قطاع الأداء الاقتصادي':'المبالغ المؤداة للشركة المساهمة والمؤشر بها في السجل التجاري';
        const jointEvidenceEn=v.capitalEvidence==='economic'||v.capitalEvidence==='economic_previous'?'Economic Performance Sector certificate'+(v.capitalEvidence==='economic_previous'?' previously submitted':''):'paid-up amounts for the joint-stock company as indicated in the commercial register';
        if(paid&&paid>0)add(`${jointEvidence} بقيمة ${paid.toLocaleString('en-US')} ${cur} (بما لا يجاوز رأس مال الشركة المسجّل).`,`${jointEvidenceEn}, value ${paid.toLocaleString('en-US')} ${curEn} (not exceeding registered company capital).`);
        else add(jointEvidence+'، بما لا يجاوز رأس مال الشركة.',jointEvidenceEn+', not exceeding registered company capital.');
      }else{
        const paid=v.capitalAmount?Number(v.capitalAmount):null;
        const cur=v.capitalAmountCurrency==='USD'?'دولار أمريكي':'جنيه مصري';
        const curEn=v.capitalAmountCurrency==='USD'?'USD':'EGP';
        const evidenceType=v.capitalEvidence==='paid_register'?'رأس المال المسدد المؤشر به في السجل التجاري':v.capitalEvidence==='economic'||v.capitalEvidence==='economic_previous'?'شهادة قطاع الأداء الاقتصادي'+(v.capitalEvidence==='economic_previous'?' التي سبق تقديمها':''):'شهادة بنكية باسم الشركة/المنشأة'+(v.capitalEvidence==='bank_previous'?' التي سبق تقديمها':'');
        const evidenceTypeEn=v.capitalEvidence==='paid_register'?'Paid-up capital recorded in the commercial register':v.capitalEvidence==='economic'||v.capitalEvidence==='economic_previous'?'Economic Performance Sector certificate'+(v.capitalEvidence==='economic_previous'?' previously submitted':''):'Bank certificate in the company/establishment name'+(v.capitalEvidence==='bank_previous'?' previously submitted':'');
        if(paid&&paid>0){
          add(`${evidenceType} بقيمة ${paid.toLocaleString('en-US')} ${cur}، وفق فئة الوزن النسبي، وبما لا يجاوز رأس المال المسجّل${v.capitalExceedAcknowledged?' (مع ملاحظة أن القيمة المدخلة تتجاوز رأس المال المسجّل ويُحتسب الحد الأقصى برأس المال المؤشر به فقط)':''}.`,
             `${evidenceTypeEn} for ${paid.toLocaleString('en-US')} ${curEn}, matching the relative-weight category and not exceeding registered capital${v.capitalExceedAcknowledged?' (note: entered value exceeds registered capital; only registered capital is counted)':''}.`);
        }else{
          add(evidenceType+' تفيد الرصيد المطلوب وفق فئة الوزن النسبي، بما لا يجاوز رأس المال.',evidenceTypeEn+' evidencing the required balance for the relative-weight category, not exceeding capital.');
        }
      }
      if(Number(v.insuredWorkers)>0)add(`خطاب/برنت تأمينات حديث باسم الشركة عن العام الحالي، صادر بتاريخ ${v.insuranceStatementDate||'يُحدد عند التقديم'}، لم يمر عليه شهر، يوضح إجمالي العمالة المصرية المؤمن عليها (${Number(v.insuredWorkers).toLocaleString('en-US')} عاملًا) وممهور بخاتم النسر.`,`Recent current-year social-insurance statement in the company name, issued on ${v.insuranceStatementDate||'the date to be confirmed at submission'}, within one month, showing insured Egyptian employees (${Number(v.insuredWorkers).toLocaleString('en-US')}) and bearing the official eagle stamp.`);
      if(currentService==='renew'){if(v.activityStatus==='start')add('صورة من محضر لجنة بدء النشاط أو شهادة بدء النشاط والمستندات المؤيدة.','Copy of the commencement committee minutes or commencement certificate and supporting documents.');if(v.activityStatus==='serious')add('صورة من محضر لجنة المعاينة أو المستند المعتمد المثبت للجدية.','Copy of the inspection committee minutes or approved document proving seriousness.');if(committeeRequirement(v))add('صورة ضوئية من إيصال سداد رسم تشكيل لجنة معاينة جديدة؛ لإثبات استمرارية جدية الشركة بعد مرور خمس سنوات على آخر لجنة أثبتت بدء النشاط، أو لإثبات الجدية/بدء النشاط بعد مرور سنة على آخر لجنة أثبتت الجدية، أو لاستكمال إثبات الموقف التنفيذي عند عدم سبق الإثبات.','Copy of the receipt for the fee paid to form a new inspection committee, to prove continued company seriousness after five years from the latest committee that verified commencement, or to prove seriousness/commencement after one year from the latest committee that verified seriousness, or to establish the operational status where it has not previously been verified.');}else{if(v.activityStatus==='operating'||v.inspectionStatus==='start')add('صورة من شهادة بداية النشاط والمستندات الدالة عليها.','Copy of the commencement-of-activity certificate and supporting evidence.');const _ageY=companyAge(v),_overY=_ageY!==null&&_ageY>=365.25;if(_overY&&(v.activityStatus==='under'||v.activityStatus==='new'))add('مستند لجنة معاينة يثبت الموقف التنفيذي أو بداية النشاط (نظرًا لمرور عام أو أكثر على التأسيس دون إثبات بدء النشاط أو الجدية).','Inspection-committee document proving implementation status or commencement (company is one year or older without verified start or seriousness).');if(_overY&&v.activityStatus==='under'&&v.overYearCommitteeUndertaking)add('صورة ضوئية من إيصال سداد رسوم تشكيل لجنة معاينة لإثبات الجدية أو بدء النشاط، وفق التعهد المرفق.','Copy of the receipt for the inspection-committee fee to prove seriousness or commencement, as undertaken.');if(v.activityStatus==='serious'&&v.inspectionStatus!=='start')add('مستند إثبات الجدية الصادر عن لجنة المعاينة.','Document proving seriousness issued by the inspection committee.');}
      if(currentService!=='renew'&&v.inspectionDate)add('احتفظ بمستند لجنة المعاينة؛ وإذا مرّت خمس سنوات على آخر معاينة، يلزم تقديم لجنة موقف تنفيذي وفق القائمة الرسمية.','Keep the inspection-committee document; if five years have passed since the last inspection, submit a new implementation-status inspection under the official checklist.');
      {
        const lf=v.legalForm;
        const inv=(v.investors||[]).filter(x=>x&&x.name);
        const roles=inv.map(x=>x.role||'').filter(Boolean);
        const hasRep=roles.some(r=>/_rep_|legalRep|llc_rep|one_rep|joint_rep/.test(r));
        let ar='', en='';
        if(lf==='joint'){
          ar='عقد تأسيس الشركة أو آخر تعديل عليه، وقائمة المساهمين المعتمدة لإثبات ملكية الأسهم وصفة المساهم وحق الإدارة/العضوية في مجلس الإدارة (وفق الصفة المختارة لكل مستثمر).';
          en='Company incorporation deed or latest amendment, and the approved shareholders list proving share ownership, capacity, and board/management authority (per each investor’s selected capacity).';
        }else if(lf==='sole'){
          ar='عقد تأسيس المنشأة أو آخر تعديل عليه لإثبات صفة صاحب المنشأة وحق الإدارة والتوقيع.';
          en='Establishment incorporation deed or latest amendment proving the owner’s capacity and management/signing authority.';
        }else if(lf==='one'){
          ar='عقد تأسيس شركة الشخص الواحد أو آخر تعديل عليه لإثبات صفة المالك وحق الإدارة والتوقيع'+(hasRep?'، مع مستند تمثيل الشخص الاعتباري المالك إن وُجد.':'.');
          en='One-person company incorporation deed or latest amendment proving owner capacity and management/signing authority'+(hasRep?', with representation evidence for the legal-person owner if applicable.':'.');
        }else if(lf==='llc'){
          ar='عقد تأسيس الشركة ذات المسؤولية المحدودة أو آخر تعديل عليه لإثبات الحصص وصفة الشريك وحق الإدارة والتوقيع'+(hasRep?'، مع مستند تمثيل الشخص الاعتباري إن وُجد.':'.');
          en='LLC incorporation deed or latest amendment proving quotas, partner capacity, and management/signing authority'+(hasRep?', with corporate representation evidence if applicable.':'.');
        }else if(lf==='partnership'||lf==='limitedShares'){
          ar='عقد تأسيس الشركة أو آخر تعديل عليه لإثبات صفة الشريك المتضامن وحق الإدارة والتوقيع.';
          en='Company incorporation deed or latest amendment proving general-partner capacity and management/signing authority.';
        }else{
          ar='عقد تأسيس الشركة/المنشأة أو آخر تعديل عليه لإثبات ملكية الأسهم أو الحصص وصفة المستثمر وحق الإدارة والتوقيع.';
          en='Company/establishment incorporation deed or latest amendment proving ownership of shares/quotas, investor capacity, and management/signing authority.';
        }
        add(ar, en);
      }
      if(v.siteProof==='rent')add('صورة عقد الإيجار موضحًا به تاريخ بدء العقد وانتهاؤه، مع الأصل للاطلاع. ويجب أن يكون العقد مصدقًا من الشهر العقاري أو مرفقًا به موافقة جهة الولاية وفق الحالة. وإذا كان النشاط صناعيًا، تُرفق صورة التصديق موضحًا بها رقم التصديق وتاريخه.','Copy of the lease showing its start and end dates, with the original for inspection. The lease must be authenticated by the Real Estate Registry or accompanied by competent-authority approval as applicable. For industrial activity, attach the authentication document showing its number and date.');
      else if(v.siteProof==='allocation')add('صورة سند تخصيص موقع ممارسة النشاط.','Copy of the business-site allocation document.');
      else if(v.siteProof==='ownership')add('صورة مستند ملكية موقع ممارسة النشاط.','Copy of the business-site ownership document.');
      else if(v.siteProof==='usufruct')add('صورة سند حق الانتفاع بموقع ممارسة النشاط، مع التحقق من سريانه.','Copy of the usufruct document for the business site, verifying validity.')
      if(v.zone==='free'||v.zone==='investment')add('ترخيص مزاولة النشاط الصادر لمشروعات المناطق الحرة أو المناطق الاستثمارية، بحسب نوع المنطقة.','Operating licence issued to a free-zone or investment-zone project, as applicable.');
      
      
      if(['one','sole'].includes(v.legalForm)&&['under','new'].includes(v.activityStatus)&&(s==='visa'||s==='grant'))add('شهادة صادرة من بنك مصري تثبت إيداع وديعة دولارية مجمدة بقيمة 200,000 دولار أمريكي، مع ما يثبت استمرار تجميدها طوال مدة الاستفادة من الخدمة وحتى إثبات بدء النشاط.','Certificate from an Egyptian bank proving a frozen USD 200,000 deposit, with evidence that it remains frozen throughout the service period until commencement is verified.');
    if((v.investors||[]).some(x=>['residence_investment','work_159'].includes(x.previousBenefit)&&x.previousCompanyProof!=='start'&&x.previousCompanyProof!=='serious')&&['under','new'].includes(v.activityStatus))add('صورة ضوئية من إيصال سداد رسوم تشكيل لجنة معاينة لإثبات جدية إحدى الشركتين (الحالية أو السابقة)، وفق التعهد المرفق بالنموذج.','Copy of the receipt for payment of the inspection committee fee to verify seriousness of either the current or previous company, as undertaken in the form.');
    if(s==='grant'||s==='renew')add('إيصال سداد مقابل رسم الخدمة.','Receipt for payment of the service fee.');
      if(s==='renew')add('صورة الإقامة السابقة الصادرة على الشركة نفسها.','Copy of the previous residence issued through the same company.');
    }else{
      add('مستخرج حديث من السجل التجاري وبيانات الرقم الموحد للسجل التجاري (15 رقمًا)، وفق ما يطلبه النموذج.','Recent commercial-register extract and unified commercial-register number (15 digits), as requested in the form.');
      add('بيانات المستثمرين الحاصلين على إقامة بالشركة والبيانات المطلوبة في الجزء الثاني من النموذج الاسترشادي.','Details of investors holding residence through the company, as requested in the second part of the guidance form.');
    }
    return a;
  }
  function isValidEgyptianPhoneNumber(value){
    const raw=String(value||'').trim().replace(/[٠-٩۰-۹]/g,ch=>String('٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹'.indexOf(ch)%10));
    let normalized=raw.replace(/[\s().-]/g,'');
    if(normalized.startsWith('+20'))normalized='0'+normalized.slice(3);
    else if(normalized.startsWith('0020'))normalized='0'+normalized.slice(4);
    if(!/^[0-9]+$/.test(normalized))return false;
    const mobile=/^01[0125][0-9]{8}$/;
    const landline=/^(?:02[0-9]{8}|03[0-9]{8}|0(?:13|40|45|46|47|48|50|55|57|62|64|65|66|68|69|82|84|86|88|92|93|95|96|97)[0-9]{7})$/;
    return mobile.test(normalized)||landline.test(normalized);
  }
  function getCurrentValues(){const out={...values};$$('[name]',mount).forEach(el=>{if(el.type==='radio'&&!el.checked)return;const name=el.name;let m=name.match(/^investor_(\d+)_(.+)$/);if(m){out.investors=out.investors||[];out.investors[Number(m[1])-1]=out.investors[Number(m[1])-1]||{};out.investors[Number(m[1])-1][m[2]]=el.type==='checkbox'?el.checked:el.value;return;}m=name.match(/^previous(Residence|Visa)_(\d+)_(.+)$/);if(m){const key=m[1]==='Residence'?'previousResidences':'previousVisas';out[key]=out[key]||[];out[key][Number(m[2])]=out[key][Number(m[2])]||{};out[key][Number(m[2])][m[3]]=el.value;return;}out[name]=el.value;});out.investors=(out.investors||[]).filter(Boolean);out.investors.forEach(x=>{if(x&&x.nationality)x.nationality=countryName(x.nationality);});out.previousResidences=(out.previousResidences||[]).filter(Boolean);out.previousVisas=(out.previousVisas||[]).filter(Boolean);[...out.previousResidences,...out.previousVisas].forEach(x=>{if(x&&x.nationality)x.nationality=countryName(x.nationality);});if(out.nationality)out.nationality=countryName(out.nationality);return out;}
  function activeBeneficiaries(v,type){const today=new Date();today.setHours(0,0,0,0);const count=Number(v[type==='visa'?'visaBeneficiaries':'residencyBeneficiaries']||0);const list=(type==='visa'?(v.previousVisas||[]):(v.previousResidences||[])).slice(0,count);const endKey=type==='visa'?'validTo':'residenceEnd';return list.filter(x=>{if(!x||!x.name||!x[endKey])return false;const d=new Date(x[endKey]+'T12:00:00');return !Number.isNaN(d.getTime())&&d>=today;}).length;}
  function priorFields(kind,i,v){
    const ar=lang()==='ar',prefix=`previous${kind}_${i}_`,res=kind==='Residence';
    const saved=((res?v.previousResidences:v.previousVisas)||[])[i]||{};
    const roleOpts=roleOptions(v);
    const fields=[
      ['name',ar?'الاسم الكامل':'Full name','text'],
      ['nationality',ar?'الجنسية (اسم الدولة)':'Nationality (country name)','nationality'],
      ['role',ar?'الصفة بالشركة وفق الشكل القانوني':'Company role according to legal form','role'],
      ['shareValue',ar?'قيمة المساهمة / المشاركة (جنيه)':'Share / participation value (EGP)','number'],
      ...(v.legalForm==='joint'?[['sharePercent',ar?'نسبة المساهمة (%)':'Shareholding (%)','number']]:[]),
      [res?'residenceStart':'validFrom',ar?(res?'تاريخ بداية الإقامة':'تاريخ بداية التأشيرة'):(res?'Residence start date':'Visa start date'),'date'],
      [res?'residenceEnd':'validTo',ar?(res?'تاريخ انتهاء الإقامة':'تاريخ انتهاء التأشيرة'):(res?'Residence expiry date':'Visa expiry date'),'date']
    ];
    const requiredKeys=['name','nationality','role',res?'residenceStart':'validFrom',res?'residenceEnd':'validTo'];
    const html=fields.map(([key,label,type])=>{
      const name=prefix+key,value=saved[key]||'',required=requiredKeys.includes(key);
      let control='';
      if(type==='nationality')control=`<input id="rf-${name}" name="${name}" type="text" value="${esc(countryName(value))}" placeholder="${ar?'اكتب اسم الدولة مباشرة':'Enter country name'}" maxlength="80" autocomplete="country-name" dir="auto" ${required?'required':''}>`;
      else if(type==='role')control=`<select id="rf-${name}" name="${name}" ${required?'required':''}><option value="">${t('choose')}</option>${roleOpts.map(o=>`<option value="${esc(o[0])}" ${value===o[0]?'selected':''}>${esc(ar?o[1]:o[2])}</option>`).join('')}</select>`;
      else control=`<input id="rf-${name}" name="${name}" type="${type}" value="${esc(value)}" ${required?'required':''} ${type==='number'?'min="0"':''}>`;
      return `<label class="rf-field" for="rf-${name}"><span>${label}${required?' <em>*</em>':''}</span>${control}</label>`;
    }).join('');
    return html+(res?`<label class="rf-field" for="rf-${prefix}companyStatus"><span>${ar?'هل ما زال المستثمر بالشركة أم خرج منها؟':'Does the investor remain with the company or exit?' } <em>*</em></span><select id="rf-${prefix}companyStatus" name="${prefix}companyStatus" required><option value="">${t('choose')}</option><option value="remains" ${saved.companyStatus==='remains'?'selected':''}>${ar?'ما زال بالشركة':'Still with company'}</option><option value="exited" ${saved.companyStatus==='exited'?'selected':''}>${ar?'خرج من الشركة':'Exited company'}</option></select></label>`:'');
  }
  function priorWarnings(v,type){const ar=lang()==='ar';if(type==='residence'){const list=v.previousResidences||[];return list.map((x,i)=>{if(!x||!x.name)return '';const today=new Date();today.setHours(0,0,0,0);const d=x.residenceEnd?new Date(x.residenceEnd+'T12:00:00'):null;const expired=d&&d<today;if(expired&&x.companyStatus==='exited')return `<div class="rf-warning">${ar?`تنبيه للمستفيد السابق «${esc(x.name)}»: يلزم التحقق من إثبات خروجه/تعديل القيد في السجل التجاري لدى الإدارة المختصة.`:`Former beneficiary “${esc(x.name)}” exited: verify that the exit is evidenced in the commercial register with the competent administration.`}</div>`;if(expired&&x.companyStatus==='remains')return `<div class="rf-warning">${ar?`تنبيه للمستفيد السابق «${esc(x.name)}»: يلزم التحقق من متطلبات الإقرار بعدم طلب إقامة على الشركة نفسها لحين زيادة الوزن النسبي، مع صحة توقيع بنكي، لدى الإدارة المختصة.`:`Former beneficiary “${esc(x.name)}” remains with the company: verify the requirement for a bank-signature-verified undertaking not to request residence through this company until its relative weight increases.`}</div>`;if(d&&d>=today&&x.companyStatus==='exited')return `<div class="rf-warning">${ar?`تنبيه: الإقامة السابقة للمستثمر «${esc(x.name)}» ما زالت سارية رغم خروجه من الشركة؛ تحقق من وجوب إلغاء الإقامة وفق الإجراءات القانونية لدى الإدارة المختصة.`:`“${esc(x.name)}” has an active residence despite exiting the company; verify whether it must be cancelled under applicable procedures.`}</div>`;return '';}).join('');}return '';}

  function persist(){values=getCurrentValues();try{localStorage.setItem(storageKey(currentService),JSON.stringify(values));}catch{}}
  function activeStepFields(v){if(step===0)return baseFields;if(step===1)return executionFields;if(step===2)return capitalFields;if(step===3)return [];if(step===4)return [];if(step===5)return [...(serviceFields[currentService]||[]),...applicantFields];return [];}
  function render(service,override){currentService=service;step=0;try{values=JSON.parse(localStorage.getItem(storageKey(service))||'{}')}catch{values={}}if(override)values={...values,...override};if(values.legalForm==='other')values.legalForm='';if(values.companyLaw==='159')values.companyLaw='';if(['other','unknown'].includes(values.siteProof))values.siteProof='';if(!Array.isArray(values.investors)||!values.investors.length)values.investors=[{}];investorCount=Math.max(1,(values.investors||[]).length||1);renderStep();}
  function getApplicantExportValidation(sourceValues){
    const v=sourceValues||values;
    const fields=[...(serviceFields[currentService]||[]),...applicantFields];
    for(const f of fields){
      if(!f.required||(f.showWhen&&!f.showWhen(v)))continue;
      const value=v[f.id];
      if(value===undefined||value===null||String(value).trim()===''){
        return {valid:false,field:f.id,title:lang()==='ar'?'بيانات مقدم الطلب غير مكتملة':'Applicant details incomplete',message:`${lang()==='ar'?'يرجى استكمال الحقل: ':'Please complete: '}${lang()==='ar'?f.ar:f.en}`};
      }
    }
    const email=String(v.email||'').trim();
    const emailPattern=/^[A-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}$/i;
    if(!emailPattern.test(email))return {valid:false,field:'email',title:lang()==='ar'?'البريد الإلكتروني غير صحيح':'Invalid email address',message:lang()==='ar'?'أدخل عنوان بريد إلكتروني صحيحًا قبل إظهار خيارات التنزيل والمشاركة.':'Enter a valid email address before the download and sharing options become available.'};
    if(!isValidEgyptianPhoneNumber(v.phone))return {valid:false,field:'phone',title:lang()==='ar'?'رقم الهاتف غير صحيح':'Invalid phone number',message:lang()==='ar'?'أدخل رقم هاتف مصريًا كاملًا وصحيحًا قبل إظهار خيارات التنزيل والمشاركة.':'Enter a complete, valid Egyptian phone number before the download and sharing options become available.'};
    return {valid:true};
  }
  function requireApplicantExportValidation(){
    values=getCurrentValues();persist();
    const check=getApplicantExportValidation(values);
    if(check.valid)return true;
    showMessage(check.title,check.message,check.field);
    return false;
  }
  function renderStep(){
    mount.hidden=false;mount.setAttribute('dir',lang()==='ar'?'rtl':'ltr');mount.setAttribute('lang',lang());const m=serviceMeta[currentService];const v=values;const s=score(v);const lawBlocked=v.companyLaw==='159';const lawUnknown=v.companyLaw==='unknown';const formUnknown=v.legalForm==='unknown';
    const stepTitles=[t('company'),t('execution'),t('capital'),t('weight'),t('investors'),t('applicant')];
    let body='';
    if(step===0){body=`<div class="rf-grid">${baseFields.map(f=>fieldHtml(f,v)).join('')}</div>${v.zone==='internal'?`<div class="rf-info">${lang()==='ar'?'إذا كان مقر الشركة خارج المنطقة الحرة والمنطقة الاستثمارية، فتصنيفها هنا «استثمار داخلي».':'If the company is outside a free zone and an investment zone, select Domestic investment.'}</div>`:''}${lawUnknown?`<div class="rf-warning">${t('notSureLaw')}</div>`:''}${['8','43','72'].includes(v.companyLaw)?`<div class="rf-small-note">${t('lawHistory')}</div>`:''}${formUnknown?`<div class="rf-warning">${t('notSureForm')}</div>`:''}${lawBlocked?`<div class="rf-warning rf-blocked">${t('law159')}</div>`:''}`;}
    if(step===1){const age=companyAge(v),date=v.companyStart?new Date(v.companyStart+'T12:00:00'):null,underYear=age!==null&&age>=0&&age<365.25;const activityLabel=v.legalForm==='sole'?(lang()==='ar'?'الموقف التنفيذي للمنشأة':'Establishment operational status'):(lang()==='ar'?'الموقف التنفيذي للشركة':'Company operational status');const duration=(currentService==='grant'||currentService==='renew')?`<div class="rf-duration"><h4>${lang()==='ar'?'كيف تتحدد مدة الإقامة؟':'How is residence duration determined?'}</h4><p>${currentService==='grant'?(v.activityStatus==='operating'||v.activityStatus==='start'?(lang()==='ar'?'بداية النشاط المثبتة تتيح احتساب القيمة الأعلى للنشاط المستهدف والموقع المستهدف، مع بقاء القرار النهائي للمراجعة الرسمية.':'Verified commencement allows the higher weight for targeted activity and location, subject to official review.'):v.activityStatus==='serious'?(lang()==='ar'?'إثبات الجدية بمحضر لجنة معاينة يتيح احتساب القيمة الأعلى وفق الضوابط، مع ضرورة الاحتفاظ بالمستند المؤيد.':'Inspection-confirmed seriousness may qualify for higher targeted weights, subject to the governing rules and evidence.'):(lang()==='ar'?'يلزم توضيح الموقف التنفيذي للشركة وفق المستندات ومحاضر لجان المعاينة.':'Specify the company operational status using its documents and inspection records.')):(v.legalForm==='joint'&&v.activityStatus==='start'?(lang()==='ar'?'بالنسبة للشركة المساهمة التي بدأت النشاط: لا تتجاوز مدة الإقامة مدة مجلس الإدارة، ولا مدة سند حيازة الموقع إذا كان إيجارًا، كما يُراعى ألا يمر خمس سنوات على تاريخ آخر لجنة معاينة أثبتت بدء النشاط.':'For a joint-stock company that has commenced activity, residence cannot exceed the board term or the lease term where the site is leased; the latest committee verifying commencement must also be within five years.') : v.activityStatus==='start'?(lang()==='ar'?'بعد إثبات بدء النشاط، تُحدد مدة الإقامة وفق أقصر مدة واجبة التطبيق من المستندات والتراخيص، مع مراعاة ألا يمر خمس سنوات على آخر لجنة معاينة.':'After commencement is verified, residence is determined by the shortest applicable document or licence term, and the latest inspection committee must be within five years.') : v.activityStatus==='serious'?(lang()==='ar'?'إذا لم تبدأ الشركة النشاط ولكن أثبتت الجدية، تكون مدة الإقامة سنة واحدة أو أقل وفق المستندات والضوابط. ويلزم تجديد إثبات الجدية من خلال لجنة معاينة كل عام ما دام بدء النشاط لم يثبت.':'If the company has not commenced activity but has proven seriousness, residence is limited to one year or less under the applicable documents and rules. Seriousness must be re-verified by an inspection committee every year until commencement is proven.'):(lang()==='ar'?'لم يثبت بدء النشاط أو الجدية حتى الآن. يمكن استكمال الطلب، مع ضرورة التقدم بطلب تشكيل لجنة لبدء النشاط أو لإثبات الجدية على الأقل، وإرفاق إيصال سداد رسم اللجنة. وتكون مدة الإقامة سنة واحدة أو أقل وفق الضوابط.':'Neither commencement nor seriousness has been verified. You may complete the application, but must apply for a committee to verify commencement or at least seriousness and attach the committee-fee receipt. Residence will be limited to one year or less under the applicable rules.'))}</p>${v.legalForm==='joint'?`<p>${lang()==='ar'?'يجب أن يكون تاريخ انتهاء مدة مجلس الإدارة مستقبليًا. مدة المجلس الأولى خمس سنوات من تاريخ تأسيس الشركة، ويكون التجديد اللاحق كل ثلاث سنوات وفق محاضر الجمعيات العامة العادية. ويُحتسب تاريخ المدة من تاريخ انعقاد الجمعية العامة العادية، وليس من تاريخ التأشير بالتجديد في السجل التجاري.':'The board expiry date must be in the future. The initial board term is five years from incorporation; subsequent renewals are for three years under ordinary general assembly minutes. The term is calculated from the ordinary general assembly meeting date, not from the date the renewal is recorded in the commercial register.'}</p>`:''}<p class="rf-small-note">${lang()==='ar'?'المدة النهائية تخضع للمراجعة الرسمية، ولا تتجاوز أقصر مدة من مدد مجلس الإدارة وسند الحيازة والتراخيص والمستندات المنطبقة.':'The final duration remains subject to official review and cannot exceed the shortest applicable board, occupancy, licence, or document term.'}</p></div>`:'';const activityHelp=lang()==='ar'?`<section class="rf-target-guides" aria-label="أدلة تحديد النشاط والموقع">
  <article class="rf-target-guide rf-target-guide-activity"><div class="rf-target-guide-icon" aria-hidden="true">◎</div><div class="rf-target-guide-content"><span class="rf-target-guide-kicker">الدليل الأول · 20%</span><h4>كيف أعرف أن غرض النشاط مستهدف؟</h4><p>يعتمد التحديد على <strong>النشاط الذي تمارسه الشركة فعليًا</strong>، وليس اسم الشركة أو الاسم التجاري. تشمل الأغراض المستهدفة الفئات الموضحة أدناه، ولكل فئة شروطها.</p><details><summary>استعراض الأنشطة المستهدفة وشروطها</summary><ul><li><strong>الطاقة الجديدة والمتجددة:</strong> أنشطة إنتاج الطاقة من المصادر الجديدة والمتجددة، مثل الطاقة الشمسية وطاقة الرياح.</li><li><strong>الصناعات الثقيلة:</strong> الصناعات التي تحددها الهيئة العامة للتنمية الصناعية.</li><li><strong>الصناعات التكنولوجية:</strong> الصناعات التكنولوجية دون أنشطة التجميع أو البرامج.</li><li><strong>صناعة الأدوية والصناعات المغذية.</strong></li><li><strong>التعليم دون الجامعي.</strong></li><li><strong>التنمية المتكاملة:</strong> مشروعات التنمية السياحية أو الصناعية أو العمرانية أو الزراعية المتكاملة.</li><li><strong>استصلاح واستزراع الأراضي البور والصحراوية:</strong> مساحة لا تقل عن 500 فدان مع حيازة مستقرة.</li><li><strong>إقامة المستشفيات.</strong></li><li><strong>الفنادق والقرى السياحية:</strong> طاقة إيوائية لا تقل عن 500 غرفة، وتُخفض إلى 50% للمحافظات الحدودية والمناطق المجاورة للوادي القديم والمناطق النائية وفق الوثيقة.</li><li><strong>مشروعات البنية الأساسية:</strong> مياه الشرب والصرف الصحي والكهرباء والطرق والاتصالات وخطوط مترو الأنفاق.</li><li><strong>قطاع البترول.</strong></li><li><strong>مشروعات تحلية المياه المتكاملة:</strong> إقامة المشروع وتشغيله وإدارته.</li><li><strong>مشروعات المناطق الحرة:</strong> التي تتجاوز صادراتها 80%، بخطاب صادر من المنطقة الحرة وترخيص مزاولة النشاط الصادر للمشروع.</li></ul></details><button type="button" class="rf-guide-open" data-rf-guide="activity">استعرض الأنشطة خطوة بخطوة <span aria-hidden="true">←</span></button></div></article>
  <article class="rf-target-guide rf-target-guide-location"><div class="rf-target-guide-icon" aria-hidden="true">⌖</div><div class="rf-target-guide-content"><span class="rf-target-guide-kicker">الدليل الثاني · 20%</span><h4>كيف أعرف أن موقع النشاط مستهدف؟</h4><p>المقصود هو <strong>موقع ممارسة النشاط الفعلي</strong> داخل المناطق الأكثر احتياجًا للتنمية المحددة بالوثيقة، وليس عنوان المقر الإداري إذا كان النشاط يُمارس في موقع آخر.</p><details><summary>استعراض المناطق المستهدفة</summary><ul><li><strong>جنوب محافظة الجيزة:</strong> الواحات البحرية، الصف، العياط.</li><li><strong>إقليم قناة السويس:</strong> بورسعيد، الإسماعيلية، السويس (شرق القناة).</li><li><strong>المحافظات الحدودية:</strong> أسوان، مرسى مطروح، جنوب سيناء، شمال سيناء، الوادي الجديد، ومحافظة البحر الأحمر من جنوب سفاجا.</li><li><strong>محافظات الصعيد:</strong> الفيوم، بني سويف، المنيا، أسيوط، سوهاج، قنا، الأقصر، أسوان.</li></ul><p>اختر المنطقة التي يقع بها موقع ممارسة النشاط، ثم حدد المحافظة والمركز أو المدينة والقرية أو المنطقة والعنوان التفصيلي في بيانات الشركة.</p></details><button type="button" class="rf-guide-open" data-rf-guide="location">استعرض المناطق خطوة بخطوة <span aria-hidden="true">←</span></button></div></article>
  <div class="rf-target-guide-note"><strong>كيف تُحتسب النسبة؟</strong><span>يحصل كل معيار مستهدف على 20% عند ثبوت بدء النشاط أو الجدية من خلال لجنة معاينة. وفي غير ذلك يُحتسب المعيار بنسبة 10% وفق جدول الوزن النسبي.</span></div>
</section>`:`<section class="rf-target-guides" aria-label="Activity and location guides">
  <article class="rf-target-guide rf-target-guide-activity"><div class="rf-target-guide-icon" aria-hidden="true">◎</div><div class="rf-target-guide-content"><span class="rf-target-guide-kicker">GUIDE 1 · 20%</span><h4>How do I know whether the activity is targeted?</h4><p>Classification is based on the <strong>company’s actual activity</strong>, not its name or trade name. The targeted categories below each have specific conditions.</p><details><summary>View targeted activities and conditions</summary><ul><li><strong>New and renewable energy:</strong> energy generation from renewable sources such as solar and wind.</li><li><strong>Heavy industries:</strong> industries specified by the Industrial Development Authority.</li><li><strong>Technology industries:</strong> excluding assembly and software activities.</li><li><strong>Pharmaceutical and supporting industries.</strong></li><li><strong>Non-university education.</strong></li><li><strong>Integrated development:</strong> integrated tourism, industrial, urban, or agricultural development.</li><li><strong>Reclaiming and cultivating barren/desert land:</strong> at least 500 feddans with stable tenure.</li><li><strong>Establishing hospitals.</strong></li><li><strong>Hotels and tourist villages:</strong> at least 500 rooms, reduced by 50% for border governorates, areas adjacent to the old valley, and remote areas under the document.</li><li><strong>Infrastructure:</strong> drinking water, wastewater, electricity, roads, communications, and metro lines.</li><li><strong>Petroleum sector.</strong></li><li><strong>Integrated desalination:</strong> establishment, operation, and management.</li><li><strong>Free-zone projects:</strong> exports above 80%, supported by a free-zone letter and the project’s operating licence.</li></ul></details><button type="button" class="rf-guide-open" data-rf-guide="activity">Explore activities step by step <span aria-hidden="true">→</span></button></div></article>
  <article class="rf-target-guide rf-target-guide-location"><div class="rf-target-guide-icon" aria-hidden="true">⌖</div><div class="rf-target-guide-content"><span class="rf-target-guide-kicker">GUIDE 2 · 20%</span><h4>How do I know whether the business location is targeted?</h4><p>This means the <strong>actual place where the activity is carried out</strong> within the development-priority areas listed in the document—not the administrative office if operations take place elsewhere.</p><details><summary>View targeted areas</summary><ul><li><strong>South Giza:</strong> Bahariya Oasis, Saf, and Ayat.</li><li><strong>Suez Canal region:</strong> Port Said, Ismailia, and Suez (east of the Canal).</li><li><strong>Border governorates:</strong> Aswan, Marsa Matrouh, South Sinai, North Sinai, New Valley, and the Red Sea Governorate south of Safaga.</li><li><strong>Upper Egypt governorates:</strong> Fayoum, Beni Suef, Minya, Assiut, Sohag, Qena, Luxor, and Aswan.</li></ul><p>Select the area containing the actual business site, then enter its governorate, district/city, village or area, and full address in the company details.</p></details><button type="button" class="rf-guide-open" data-rf-guide="location">Explore areas step by step <span aria-hidden="true">→</span></button></div></article>
  <div class="rf-target-guide-note"><strong>How is the percentage counted?</strong><span>Each targeted criterion receives 20% when commencement or seriousness is established by an inspection committee. Otherwise, the criterion is counted as 10% under the relative-weight table.</span></div>
</section>`;body=`<div class="rf-grid">${executionFields.map(f=>fieldHtml(f.id==='activityStatus'?Object.assign({},f,{ar:activityLabel,en:activityLabel}):f,v)).join('')}</div>${activityHelp}<div class="rf-info">${lang()==='ar'?'مهم: إذا لم يثبت بدء النشاط أو الجدية من خلال لجنة معاينة، يحتسب غرض النشاط والموقع المستهدف كل منهما 10% فقط، حتى لو كان الاختيار «مستهدف». ترتفع النسبة إلى 20% لكل معيار مستهدف بعد إثبات البدء أو الجدية من خلال لجنة معاينة.':'Important: without inspection-verified commencement or seriousness, targeted activity and location each count as 10%, even if marked targeted.'}</div>${(['one','sole'].includes(v.legalForm)&&['under','new'].includes(v.activityStatus)&&(currentService==='visa'||currentService==='grant'))?`<section class="rf-deposit-alert"><h3>${lang()==='ar'?'شرط خاص بالمنشأة الفردية وشركة الشخص الواحد':'Special requirement for sole proprietorships and one-person companies'}</h3><p>${lang()==='ar'?'نظرًا لعدم بدء النشاط، يلزم تقديم شهادة من بنك مصري تفيد إيداع وديعة دولارية مجمدة بقيمة':'Because the activity has not commenced, a certificate from an Egyptian bank is required to confirm a frozen deposit of'} <strong>${lang()==='ar'?'200,000 دولار أمريكي':'USD 200,000'}</strong>${lang()==='ar'?' تظل الوديعة مجمدة طوال مدة الاستفادة من خدمة تأشيرة الدخول أو الإقامة وتجديدها، إلى حين إثبات بدء النشاط وفق الإجراءات المعتمدة.':'. The deposit must remain frozen throughout the use of the entry-visa or residence service, including renewal, until commencement of activity is officially verified.'}</p><p>${lang()==='ar'?'يجب إرفاق ما يثبت الوديعة ضمن مستندات الطلب. لا يكفي إدخال القيمة في هذا النموذج وحده.':'Attach the bank evidence to the application documents. Entering the amount in this form alone is not sufficient.'}</p></section>`:''}${duration}`;}

    if(step===2){const curCap=v.companyCapitalCurrency==='USD'?'دولار أمريكي (USD)':'جنيه مصري (EGP)';
    const curCapEn=v.companyCapitalCurrency==='USD'?'USD':'EGP';
    const curAmt=v.capitalAmountCurrency==='USD'?'دولار أمريكي (USD)':'جنيه مصري (EGP)';
    const curAmtEn=v.capitalAmountCurrency==='USD'?'USD':'EGP';
    const needsFx=v.companyCapitalCurrency==='USD'||v.capitalAmountCurrency==='USD';
    const capLabel=capitalFields.filter(f=>!['residencyBeneficiaries','visaBeneficiaries'].includes(f.id)).map(f=>{
      if(f.id==='companyCapital')return {...f,ar:()=>`${v.legalForm==='joint'?'رأس مال الشركة المرخص به والمؤشر به في السجل التجاري':v.legalForm==='sole'?'رأس مال المنشأة المؤشر به في السجل التجاري':'رأس مال الشركة المؤشر به في السجل التجاري'} (${curCap})`,en:()=>`${v.legalForm==='joint'?'Company authorised capital as recorded in the commercial register':v.legalForm==='sole'?'Establishment capital as recorded in the commercial register':'Company capital as recorded in the commercial register'} (${curCapEn})`};
      if(f.id==='capitalAmount')return {...f,ar:'بقيمة',en:'Amount'};
      if(f.id==='exchangeRate')return {...f,ar:'سعر صرف الدولار مقابل الجنيه المصري (لحساب الوزن النسبي)',en:'USD to EGP exchange rate (for relative-weight calculation)'};
      return f;
    });const resN=Math.max(0,Number(v.residencyBeneficiaries||0)),visaN=Math.max(0,Number(v.visaBeneficiaries||0));const ar=lang()==='ar';const resSection=resN===0?`<div class="rf-info">${ar?'لا يوجد مستفيدون سابقون من الإقامات بخلاف المستثمر الحالي الذي سيُطلب له الخدمة.':'No previous residence beneficiaries, excluding the current applicant.'}</div>`:`<h4>${ar?'بيانات الحاصلين على إقامات سابقة':'Previous residence beneficiaries'}</h4><p class="rf-small-note">${ar?'أدخل بيانات كل مستفيد سابق بخلاف المستثمر الحالي الذي سيتم طلب الخدمة له. تُحتسب الإقامة ضمن العدد فقط إذا كانت سارية.':'Enter each previous beneficiary, excluding the current applicant. Only currently valid residences count toward the limit.'}</p>${Array.from({length:Math.min(resN,30)},(_,i)=>`<section class="rf-investor-card"><h4>${ar?'مستفيد إقامة سابق':'Previous residence beneficiary'} ${i+1}</h4><div class="rf-grid">${priorFields('Residence',i,v)}</div></section>`).join('')}${priorWarnings(v,'residence')}`;const visaSection=visaN===0?`<div class="rf-info">${ar?'لا يوجد مستفيدون سابقون من تأشيرات الدخول بخلاف المستثمر الحالي الذي سيُطلب له الخدمة.':'No previous entry-visa beneficiaries, excluding the current applicant.'}</div>`:`<h4>${ar?'بيانات الحاصلين على تأشيرات دخول سابقة':'Previous entry-visa beneficiaries'}</h4><p class="rf-small-note">${ar?'أدخل بيانات كل مستفيد سابق بخلاف المستثمر الحالي. تُحتسب التأشيرة ضمن العدد فقط إذا كانت سارية.':'Enter each previous beneficiary, excluding the current applicant. Only currently valid visas count toward the limit.'}</p>${Array.from({length:Math.min(visaN,30)},(_,i)=>`<section class="rf-investor-card"><h4>${ar?'مستفيد تأشيرة سابق':'Previous visa beneficiary'} ${i+1}</h4><div class="rf-grid">${priorFields('Visa',i,v)}</div></section>`).join('')}`;body=`<div class="rf-capital-hint">${v.legalForm==='joint'?t('capitalEvidenceJoint'):t('capitalEvidenceOther')}</div><div class="rf-capital-sections">
<section class="rf-capital-block"><h4 class="rf-section-title">${ar?'① رأس المال المسجّل':'① Registered capital'}</h4><div class="rf-grid rf-grid-capital">${capLabel.filter(f=>f.id==='companyCapital').map(f=>fieldHtml(f,v)).join('')}</div></section>
<section class="rf-capital-block"><h4 class="rf-section-title">${ar?'② إثبات رأس المال':'② Capital evidence'}</h4><div class="rf-grid rf-grid-capital">${capLabel.filter(f=>['capitalEvidence','capitalAmount'].includes(f.id)).map(f=>fieldHtml(f,v)).join('')}</div>
${needsFx?`<div class="rf-fx-row">${fieldHtml({id:'exchangeRate',ar:'سعر صرف الدولار مقابل الجنيه المصري (لحساب الوزن النسبي)',en:'USD to EGP exchange rate (for relative-weight calculation)',type:'number',min:0.01,required:true},v)}<p class="rf-currency-hint rf-fx-help">${ar?'أدخل سعر الصرف المستخدم لتحويل المبالغ بالدولار إلى الجنيه عند حساب فئة الوزن النسبي. يظهر هذا الحقل تلقائيًا عند اختيار الدولار في رأس المال أو الشهادة البنكية.':'Enter the USD/EGP rate used for relative-weight calculation. This field appears automatically when USD is selected for capital or the bank certificate.'}</p></div>`:''}
${(Number(v.capitalAmount)>0&&Number(v.companyCapital)>0&&Number(v.capitalAmount)*(v.capitalAmountCurrency==='USD'?Number(v.exchangeRate||0):1)>Number(v.companyCapital)*(v.companyCapitalCurrency==='USD'?Number(v.exchangeRate||0):1))?`<div class="rf-info rf-capital-exceed-note">${ar?'تنويه: قيمة الشهادة تتجاوز رأس المال المسجّل. سيُحتسب الحد الأقصى برأس المال المؤشر به فقط حتى يتم التأشير بالزيادة.':'Note: certificate exceeds registered capital. Only the registered amount will count until an increase is recorded.'}</div>`:''}${['bank_previous','economic_previous'].includes(v.capitalEvidence)&&(currentService==='visa'||currentService==='grant')?`<div class="rf-info rf-prior-certificate-rule">${ar?'عند اختيار «سبق تقديم شهادة»، يجب تسجيل مستفيد سابق واحد على الأقل من خلال الشركة: إما حاصل على إقامة أو حاصل على تأشيرة دخول. يكفي أيٌّ من النوعين، ولا يشترط أن يطابق نوع الخدمة الحالية.':'When “Previously submitted certificate” is selected, at least one previous company beneficiary must be recorded: either a residence holder or an entry-visa holder. Either category is sufficient; it does not have to match the current service.'}</div>`:''}</section>
<section class="rf-capital-block"><h4 class="rf-section-title">${ar?'③ العمالة والسجل التجاري':'③ Workforce and commercial register'}</h4><div class="rf-grid rf-grid-capital">${capLabel.filter(f=>['insuredWorkers','insuranceStatementDate','registerDate','registerRenewalDate','unifiedRegister','companyExpiry','boardExpiryDate'].includes(f.id)).map(f=>fieldHtml(f,v)).join('')}</div></section>
</div><div class="rf-prior-beneficiaries"><h3>${ar?'المستفيدون السابقون من الشركة (بخلاف مقدم الطلب الحالي)':'Previous company beneficiaries (excluding current applicant)'}</h3><div class="rf-grid">${fieldHtml({...capitalFields.find(f=>f.id==='residencyBeneficiaries'),required:true},v)}${fieldHtml({...capitalFields.find(f=>f.id==='visaBeneficiaries'),required:true},v)}</div>${resSection}${visaSection}<p class="rf-small-note rf-beneficiary-explainer">${ar?(currentService==='visa'?'لجميع الخدمات، أدخل العددين: الحاصلون سابقًا على إقامات، والحاصلون سابقًا على تأشيرات دخول من خلال الشركة، كلٌ في حقله. لا تحتسب المستثمر الحالي طالب الخدمة في أيٍّ من العددين. وإذا لم يوجد مستفيدون من إحدى الفئتين، أدخل صفرًا في حقلها.':'لجميع الخدمات، أدخل العددين: الحاصلون سابقًا على إقامات، والحاصلون سابقًا على تأشيرات دخول من خلال الشركة، كلٌ في حقله. لا تحتسب المستثمر الحالي طالب الخدمة في أيٍّ من العددين. وإذا لم يوجد مستفيدون من إحدى الفئتين، أدخل صفرًا في حقلها.'):(currentService==='visa'?'For every service, enter both counts: previous residence beneficiaries and previous entry-visa beneficiaries through the company, each in its own field. Exclude the current applicant from both counts. Enter zero for either category if there are no previous beneficiaries in that category.':'For every service, enter both counts: previous residence beneficiaries and previous entry-visa beneficiaries through the company, each in its own field. Exclude the current applicant from both counts. Enter zero for either category if there are no previous beneficiaries in that category.')}</p></div>`;}
    if(step===3){body=`${!s.complete?`<div class="rf-warning">${s.capitalMinimumError?(lang()==='ar'?'رأس مال الشركة أقل من الحد الأدنى المقرر لشكلها القانوني وفق وثيقة الوزن النسبي.':'Company capital is below the legal-form minimum in the relative-weight document.'):s.capitalEvidenceMinimumError?(lang()==='ar'?'قيمة المبالغ المؤداة أو المسددة أو الشهادة أقل من الحد الأدنى للفئات الوارد بوثيقة الوزن النسبي (50,000 جنيه مصري أو ما يعادله).':'The paid-up/paid amount or certificate is below the minimum relative-weight category (EGP 50,000 or equivalent).'):t('scoreIncomplete')}</div>`:`<div class="rf-score-hero"><span>${lang()==='ar'?'إجمالي الوزن النسبي الإرشادي':'Indicative total relative weight'}</span><strong>${s.total}%</strong><p>${t('resCount')}: <b>${s.count}</b></p></div><div class="rf-score-breakdown"><div><span>${lang()==='ar'?'رأس المال':'Capital'}</span><b>${s.capital}%</b></div><div><span>${lang()==='ar'?'العمالة المصرية':'Egyptian workforce'}</span><b>${s.labor}%</b></div><div><span>${lang()==='ar'?'غرض النشاط':'Activity purpose'}</span><b>${s.purpose}%</b></div><div><span>${lang()==='ar'?'موقع النشاط':'Activity location'}</span><b>${s.location}%</b></div></div>${(!s.proven&&(v.activityType==='targeted'||v.locationCategory==='targeted'))?`<div class="rf-info">${lang()==='ar'?'رغم اختيار نشاط أو موقع مستهدف، لم يتم إثبات بدء النشاط أو الجدية من خلال لجنة معاينة؛ لذلك احتُسب كل معيار مستهدف بنسبة 10% فقط وليس 20%.':'Although a targeted activity/location was selected, commencement or seriousness has not been verified by an inspection committee; each targeted criterion therefore counts as 10%, not 20%.'}</div>`:''}${s.capitalExceeded?`<div class="rf-info rf-capital-exceed-note">${lang()==='ar'?'تنويه: قيمة الشهادة البنكية / المبالغ المؤداة تتجاوز رأس المال المؤشر به في السجل التجاري. يُحتسب معيار رأس المال بحد أقصى يساوي رأس المال المسجّل فقط، ولن يُستفاد من الفارق إلا بعد التأشير بزيادة رأس المال.':'Note: the bank certificate / paid-up amount exceeds registered capital. The capital criterion is capped at the registered capital; the excess will not count until a capital increase is recorded.'}</div>`:''}${s.count===0?`<div class="rf-warning">${t('noResidencies')}</div>`:`<div class="rf-warning">${t('resLimit')}</div>`}<h4 class="rf-bands-title">${lang()==='ar'?'فئات الوزن النسبي وعدد الإقامات':'Relative-weight categories and residence limits'}</h4><div class="rf-table-wrap"><table class="rf-bands-table"><thead><tr><th>${lang()==='ar'?'إجمالي الوزن':'Total weight'}</th><th>${lang()==='ar'?'عدد الإقامات':'Residence limit'}</th></tr></thead><tbody><tr><td>${lang()==='ar'?'أقل من 30%':'Below 30%'}</td><td>0</td></tr><tr><td>30% – 50%</td><td>2</td></tr><tr><td>${lang()==='ar'?'أكثر من 50% – 75%':'Above 50% – 75%'}</td><td>4</td></tr><tr><td>${lang()==='ar'?'أكثر من 75% – 90%':'Above 75% – 90%'}</td><td>6</td></tr><tr><td>${lang()==='ar'?'أكثر من 90%':'Above 90%'}</td><td>8</td></tr></tbody></table></div><div class="rf-weight-actions"><button type="button" class="rf-weight-help-button" id="rfWeightHelp"><span aria-hidden="true">ⓘ</span> ${t('helpWeight')}</button><button type="button" class="rf-weight-video-button" id="rfWeightVideo"><span aria-hidden="true">▶</span> ${lang()==='ar'?'مشاهدة شرح الوزن النسبي':'Watch relative-weight guide'}</button></div><div class="rf-weight-help" id="rfWeightHelpBox" hidden>${t('weightHelp')}</div>`}<p class="rf-small-note">${lang()==='ar'?'يُحتسب الوزن النسبي وفق المعايير والفئات المحددة، مع تطبيق الشروط الخاصة بكل شكل قانوني.':'The relative weight is calculated using the specified criteria and categories, with the conditions applicable to each legal form.'}</p>`;}
    if(step===4){const max=effectiveMaxCount(v,s);const prior=currentService==='visa'?activeBeneficiaries(v,'visa'):activeBeneficiaries(v,'residence');const remaining=Math.max(0,max-prior);let arr=Array.isArray(v.investors)?v.investors:[];if(s.complete&&remaining>0&&!arr.length){arr=[{}];v.investors=arr;values.investors=arr;}const visible= s.complete&&remaining>0 ? arr.slice(0,remaining) : [];body=`${!s.complete||max===0?`<div class="rf-warning">${t('scoreIncomplete')}</div>`:`<div class="rf-investor-limit">${t('resCount')}: <strong>${max}</strong>. ${lang()==='ar'?`المستفيدون السابقون الساريون: ${prior} — المتاح للطلب الحالي: ${remaining}`:`Valid previous beneficiaries: ${prior} — slots available for current applicants: ${remaining}`}. ${t('resLimit')}</div>`}<div class="rf-current-investors-intro"><strong>${lang()==='ar'?'بيانات المستثمرين طالبي الخدمة':'Current service applicants'}</strong><p>${lang()==='ar'?'يظهر المستثمر الأول تلقائيًا عند توافر مكان وفق الوزن النسبي. استخدم زر إضافة مستثمر لإدخال مستثمر آخر ضمن الحد المتاح.':'The first investor appears automatically when a slot is available under the relative-weight limit. Use Add investor to include another applicant within the available limit.'}</p></div><div id="rfInvestorCards" class="rf-investor-table-list">${visible.map((inv,i)=>`<section class="rf-investor-card rf-investor-table-card"><div class="rf-investor-head"><h4>${lang()==='ar'?'المستثمر طالب الخدمة':'Service applicant'} ${i+1}</h4>${visible.length>1?`<button type="button" class="rf-remove-investor" data-remove-investor="${i}">${t('remove')}</button>`:''}</div><div class="rf-investor-table-grid">${investorFields.map(f=>fieldHtml({...f,id:`investor_${i+1}_${f.id}`,options:typeof f.options==='function'?f.options(v):f.options},{...v,[`investor_${i+1}_${f.id}`]:inv[f.id]??''})).join('')}${isCompanyRepresentativeRole(inv.role)?`<label class="rf-field" for="rf-investor_${i+1}_representedCompany"><span>${lang()==='ar'?'اسم الشركة التي يمثلها المستثمر':'Name of represented company'} <em>*</em></span><input id="rf-investor_${i+1}_representedCompany" name="investor_${i+1}_representedCompany" type="text" value="${esc(inv.representedCompany||'')}" required placeholder="${lang()==='ar'?'اكتب اسم الشركة كما هو بالسجل التجاري':'Enter company name as shown in the commercial register'}"></label>`:''}${(()=>{const q=inv.previousBenefit||'';const relevant=['residence_investment','work_159'].includes(q);return `<div class="rf-history-block"><label class="rf-field" for="rf-investor_${i+1}_previousBenefit"><span>${lang()==='ar'?'هل سبق الحصول على إقامة أو ترخيص عمل على شركة خاضعة للهيئة العامة للاستثمار؟':'Has the investor previously held residence or a work permit through a company subject to the General Authority for Investment?'} <em>*</em></span><select id="rf-investor_${i+1}_previousBenefit" name="investor_${i+1}_previousBenefit" required><option value="">${t('choose')}</option><option value="residence_investment" ${q==='residence_investment'?'selected':''}>${lang()==='ar'?'نعم حصلت على إقامة بشركة خاضعة لقانون الاستثمار':'Yes, I held residence through an Investment Law company'}</option><option value="work_159" ${q==='work_159'?'selected':''}>${lang()==='ar'?'نعم حصلت على ترخيص عمل بشركة خاضعة لقانون 159 لسنة 1981':'Yes, I held a work permit through a company subject to Law No. 159 of 1981'}</option><option value="work_investment" ${q==='work_investment'?'selected':''}>${lang()==='ar'?'نعم حصلت على ترخيص عمل بشركة خاضعة لقانون الاستثمار':'Yes, I held a work permit through an Investment Law company'}</option><option value="none" ${q==='none'?'selected':''}>${lang()==='ar'?'لا لم أحصل على إقامة أو ترخيص عمل من خلال الهيئة العامة للاستثمار':'No, I have not held residence or a work permit through the General Authority for Investment'}</option></select></label>${relevant?`<label class="rf-field" for="rf-investor_${i+1}_previousCompanyName"><span>${lang()==='ar'?'اسم الشركة السابقة':'Previous company name'} <em>*</em></span><input id="rf-investor_${i+1}_previousCompanyName" name="investor_${i+1}_previousCompanyName" value="${esc(inv.previousCompanyName||'')}" required></label><label class="rf-field" for="rf-investor_${i+1}_previousCompanyProof"><span>${lang()==='ar'?'هل سبق إثبات بدء النشاط أو الجدية بالشركة السابقة؟':'Has the previous company proven commencement of activity or seriousness?'} <em>*</em></span><select id="rf-investor_${i+1}_previousCompanyProof" name="investor_${i+1}_previousCompanyProof" required><option value="">${t('choose')}</option><option value="start" ${inv.previousCompanyProof==='start'?'selected':''}>${lang()==='ar'?'نعم، الشركة أثبتت بدء النشاط':'Yes, the company proved commencement of activity'}</option><option value="serious" ${inv.previousCompanyProof==='serious'?'selected':''}>${lang()==='ar'?'نعم، الشركة أثبتت جديتها':'Yes, the company proved seriousness'}</option><option value="no" ${inv.previousCompanyProof==='no'?'selected':''}>${lang()==='ar'?'لا، لم يتم إثبات بدء النشاط أو الجدية':'No, commencement or seriousness has not been proven'}</option></select></label>`:''}</div>`;})()}</div>${(()=>{const exp=inv.passportExpiry?new Date(inv.passportExpiry+'T12:00:00'):null;const days=exp?(exp-Date.now())/86400000:null;return days!==null&&days<0?`<div class="rf-warning">${lang()==='ar'?'جواز السفر منتهي الصلاحية. لا يمكن قبول الطلب به؛ يرجى تجديد الجواز وإدخال تاريخ الانتهاء الصحيح.':'This passport has expired. The request cannot proceed; renew it and enter the correct expiry date.'}</div>`:exp&&underSixMonths(exp)?`<div class="rf-warning">${lang()==='ar'?'تنبيه: جواز السفر ساري لأقل من 6 أشهر. الأصل أن تكون مدة السريان 6 أشهر على الأقل. يمكنك المتابعة فقط بعد الإقرار بتحمل مسؤولية تنفيذ التوصية بعد صدورها لدى إدارة الجوازات.':'Warning: passport validity is under six months. The normal requirement is at least six months. Continue only after accepting responsibility to complete the recommendation with the Passports Department.'}<label class="rf-consent"><input type="checkbox" name="investor_${i+1}_passportUndertaking" ${inv.passportUndertaking?'checked':''}> ${lang()==='ar'?'أقر بتحمل المسؤولية وتنفيذ التوصية بعد صدورها لدى إدارة الجوازات':'I accept responsibility to complete the recommendation with the Passports Department after issuance'}</label></div>`:'';})()}</section>`).join('')}</div>${s.complete&&remaining>visible.length?`<button type="button" class="rf-add-investor-button" id="rfAddInvestor"><span aria-hidden="true">＋</span> ${t('addInvestor')} <small>${lang()==='ar'?`متاح ${remaining-visible.length} مكان`:`${remaining-visible.length} slot(s) available`}</small></button>`:''}${remaining===0&&s.complete?`<div class="rf-warning">${lang()==='ar'?'لا توجد أماكن متاحة لمستثمر حالي بعد احتساب المستفيدين السابقين ذوي الإقامة/التأشيرة السارية.':'No slots remain for current applicants after counting previous valid beneficiaries.'}</div>`:''}${visible.length>=remaining&&remaining>0?`<p class="rf-small-note">${t('maxReached')}</p>`:''}`;}
    if(step===5){const applicantCheck=getApplicantExportValidation(v);const applicantOk=applicantCheck.valid;
    const actionsHtml='<div class="rf-actions"><button type="button" class="primary-action" id="rfSave">'+t('save')+'</button>'
      +(applicantOk?('<button type="button" class="secondary-action" id="rfWord">'+t('word')+'</button>'
        +'<div class="rf-share-group">'
        +'<button type="button" class="rf-share-btn rf-share-wa" id="rfShareWa" title="'+t('shareWa')+'"><span class="rf-share-icon" aria-hidden="true">💬</span><span>'+t('shareWa')+'</span></button>'
        +'<button type="button" class="rf-share-btn rf-share-email" id="rfShareEmail" title="'+t('shareEmail')+'"><span class="rf-share-icon" aria-hidden="true">✉️</span><span>'+t('shareEmail')+'</span></button>'
        +'<button type="button" class="rf-share-btn rf-share-generic" id="rfShareGeneric" title="'+t('shareGeneric')+'"><span class="rf-share-icon" aria-hidden="true">↗</span><span>'+t('shareGeneric')+'</span></button>'
        +'</div>')
        :('<p class="rf-info">'+(lang()==='ar'?'أكمل بيانات مقدم الطلب المطلوبة لإظهار خيارات التنزيل والمشاركة.':'Complete the required applicant details to show download and share options.')+'</p>'))
      +'<button type="button" class="rf-reset" id="rfReset">'+t('reset')+'</button></div>';
    body=`<div class="rf-grid">${[...(serviceFields[currentService]||[]),...applicantFields].map(f=>fieldHtml(f,v)).join('')}</div>${currentService==='movement'?`<div class="rf-warning">${t('movementNote')}</div>`:''}${currentService==='renew'&&v.previousResidence==='no'?`<div class="rf-warning">${t('notEligibleRenew')}</div>`:''}<label class="rf-field rf-notes"><span>${t('notes')}</span><textarea id="rfNotes" name="notes" rows="3">${esc(v.notes||'')}</textarea></label><section class="rf-documents"><h3>${t('documents')}</h3><ol>${checklist(v,currentService).map(d=>`<li>${lang()==='ar'?d[0]:d[1]}</li>`).join('')}</ol></section>${actionsHtml}<p id="rfStatus" class="rf-status" role="status"></p>`;}
    if(step===1&&v.siteProof==='rent'&&v.activityTypeIndustry==='yes')body+=`<div class="rf-lease-critical" role="alert"><strong>${lang()==='ar'?'تنبيه مهم جدًا — شرط إلزامي للنشاط الصناعي':'Important — mandatory condition for industrial activity'}</strong><p>${lang()==='ar'?'إذا كان النشاط صناعيًا وسند الحيازة عقد إيجار، فيجب إدخال رقم التصديق وتاريخه وإرفاق صورة مستند التصديق ضمن المستندات، مع تقديم الأصل للاطلاع.':'For an industrial activity with a lease, enter the Real Estate Registry authentication number and date and attach a copy of the authentication document; present the original for inspection.'}</p></div>`;
    const stepProgress=stepTitles.map((x,i)=>`<div class="rf-step-dot ${i===step?'active':i<step?'done':''}"><span>${i+1}</span><small>${x}</small></div>`).join('');
    mount.innerHTML=`<div class="rf-card"><div class="rf-topline"><div><span class="eyebrow">${lang()==='ar'?'الخدمة المختارة':'Selected service'}</span><h2>${lang()==='ar'?m.ar:m.en}</h2><p>${lang()==='ar'?m.noteAr:m.noteEn}</p></div><button type="button" class="rf-back" id="rfBackServices">${t('backServices')}</button></div><div class="rf-notice">${t('privacy')}</div><nav class="rf-stepper" aria-label="${lang()==='ar'?'خطوات النموذج':'Form steps'}">${stepProgress}</nav><section class="rf-group"><h3>${stepTitles[step]}</h3>${body}</section><div class="rf-actions rf-nav-actions">${step>0?`<button type="button" class="secondary-action" id="rfPrev">${t('back')}</button>`:''}${step<5?`<button type="button" class="primary-action" id="rfNext">${t('next')}</button>`:''}</div></div>`;
    $$('[data-rf-guide]',mount).forEach(btn=>btn.addEventListener('click',()=>openEligibilityWizard(btn.dataset.rfGuide==='activity'?'activityType':'locationCategory')));
    $('#rfBackServices',mount).addEventListener('click',()=>{persist();mount.hidden=true;$$('.residency-choice').forEach(b=>b.classList.remove('selected'));$('#residencyStart')?.scrollIntoView({behavior:'smooth'});});
    if(step===2&&currentService&&values.legalForm==='joint'&&['visa','grant','renew'].includes(currentService)&&values.boardExpiryDate&&new Date(values.boardExpiryDate+'T12:00:00')<new Date(new Date().toDateString())){$$('[name]',mount).forEach(el=>{if(el.name!=='boardExpiryDate')el.disabled=true;});if(!values.boardExpiryNoticeSeen){values.boardExpiryNoticeSeen=true;persist();openBoardExpiredModal(values);}}
    $$('[name]',mount).forEach(el=>{el.addEventListener('input',()=>{el.closest('.rf-field')?.classList.remove('rf-field-missing');if(el.name==='unifiedRegister'){const cleaned=el.value.replace(/[٠-٩۰-۹]/g,ch=>String('٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹'.indexOf(ch)%10)).replace(/[^0-9]/g,'').slice(0,15);if(el.value!==cleaned)el.value=cleaned;}values=getCurrentValues();persist();});el.addEventListener('change',()=>{el.closest('.rf-field')?.classList.remove('rf-field-missing');values=getCurrentValues();if(el.name==='legalForm'){values.investors=(values.investors||[]).map(person=>({...person,role:'',representedCompany:''}));}if(['activityStatus','companyName'].includes(el.name)||/^investor_\d+_(previousBenefit|previousCompanyProof|previousCompanyName)$/.test(el.name))values.priorCommitteeUndertaking=false;if(el.name==='activityStatus'&&currentService==='renew'){values.committeeNoticeSeen='';values.inspectionStatus='';values.activityCertificate='';values.activityStartDate=el.value==='start'?values.activityStartDate:'';values.inspectionDate=['start','serious'].includes(el.value)?values.inspectionDate:'';}if(el.name==='activityStatus'&&currentService!=='renew'&&['under','new','none'].includes(el.value)){values.inspectionStatus='';}const passportMatch=el.name.match(/^investor_(\d+)_passportExpiry$/);if(passportMatch&&values.investors[Number(passportMatch[1])-1])values.investors[Number(passportMatch[1])-1].passportUndertaking=false;if(el.name==='companyCapitalCurrency'||el.name==='capitalAmountCurrency'||el.name==='companyCapital'||el.name==='capitalAmount'||el.name==='exchangeRate'){if(el.name==='companyCapitalCurrency'||el.name==='capitalAmountCurrency')values.capitalExceedAcknowledged=false;}if(el.name==='insuredWorkers'&&Number(el.value)===0)values.insuranceStatementDate='';if(currentService!=='renew'&&el.name==='companyStart'&&companyAge(values)!==null&&companyAge(values)<365.25&&!values.activityStatus)values.activityStatus='new';if(currentService!=='renew'&&el.name==='companyStart'&&companyAge(values)!==null&&companyAge(values)>=365.25&&values.activityStatus==='new')values.activityStatus='under';persist();if(el.name==='boardExpiryDate'){values.boardExpiryNoticeSeen=false;if(values.boardExpiryDate&&new Date(values.boardExpiryDate+'T12:00:00')<new Date(new Date().toDateString()))openBoardExpiredModal(values);}if(currentService==='renew'&&el.name==='activityStatus'&&el.value==='none')openCommitteeNotice(values,'none');if(currentService==='renew'&&el.name==='inspectionDate'){values.committeeNoticeSeen='';const req=committeeRequirement(values);if(req)openCommitteeNotice(values,req);}const focusName=el.name;const needsGuide=(focusName==='activityType'||focusName==='locationCategory')&&el.value==='review';renderStep();if(needsGuide){openEligibilityWizard(focusName);return;}const next=$(`[name="${focusName}"]`,mount);if(next){next.focus();}});});
    function openCapitalExceedModal(v){
    let box=document.getElementById('rfCapitalExceedModal');
    if(box)box.remove();
    box=document.createElement('div');
    box.id='rfCapitalExceedModal';
    box.className='rf-prior-modal';
    box.setAttribute('role','dialog');
    box.setAttribute('aria-modal','true');
    const ar=lang()==='ar';
    box.innerHTML='<section class="rf-prior-dialog" dir="'+(ar?'rtl':'ltr')+'"><button type="button" class="rf-prior-close" aria-label="'+(ar?'إغلاق':'Close')+'">×</button>'
      +'<span class="rf-prior-kicker">'+(ar?'تنبيه مهم بخصوص رأس المال':'Important notice about capital')+'</span>'
      +'<h2>'+(ar?'قيمة الشهادة تتجاوز رأس المال المؤشر به':'Certificate value exceeds registered capital')+'</h2>'
      +'<p>'+(ar?'بما أن قيمة شهادة الإيداع البنكي أو المبالغ المؤداة تتجاوز رأس المال المؤشر به في السجل التجاري، فلن يُستفاد من الفارق في حساب فئة الوزن النسبي إلا بعد التأشير بزيادة رأس المال في السجل التجاري.':'Because the bank-certificate or paid-up amount exceeds the capital recorded in the commercial register, the excess will not count toward the relative-weight category until a capital increase is registered.')+'</p>'
      +'<p>'+(ar?'معيار رأس المال يُحتسب بقيمة الشهادة شريطة عدم تجاوز رأس مال الشركة المؤشر به. في حال التجاوز يكون الحد الأقصى المحتسب هو ما تم التأشير به في السجل التجاري فقط. يمكنك تقديم الشهادة بالقيمة الأعلى، لكن الاستفادة تظل محدودة برأس المال المسجّل.':'The capital criterion uses the certificate value provided it does not exceed registered company capital. If it does, only the registered amount is counted. You may still submit the higher certificate; the benefit remains limited to the registered capital.')+'</p>'
      +'<label class="rf-prior-commit"><input type="checkbox" id="rfCapitalExceedAck"><span>'+(ar?'أقر بأنني فهمت أن الفارق لن يُحتسب إلا بعد زيادة رأس المال المؤشر بها في السجل التجاري، وأرغب في المتابعة.':'I understand that the excess will not be counted until a capital increase is registered, and I wish to continue.')+'</span></label>'
      +'<button type="button" class="rf-prior-confirm" id="rfCapitalExceedConfirm">'+(ar?'أقرّ وأفهم، ومتابعة الطلب':'I understand and continue')+'</button></section>';
    document.body.appendChild(box);
    const close=()=>box.remove();
    box.querySelector('.rf-prior-close').onclick=close;
    box.addEventListener('click',e=>{if(e.target===box)close();});
    box.querySelector('#rfCapitalExceedConfirm').onclick=()=>{
      if(!box.querySelector('#rfCapitalExceedAck').checked){showMessage(ar?'الإقرار مطلوب':'Acknowledgement required',ar?'يرجى وضع علامة على مربع الإقرار قبل المتابعة.':'Please check the acknowledgement box before continuing.');return;}
      values.capitalExceedAcknowledged=true;persist();close();renderStep();
    };
  }
  function openCommitteeNotice(v,kind){
    if(v.committeeNoticeSeen===kind)return;v.committeeNoticeSeen=kind;persist();
    const existing=document.getElementById('rfCommitteeNoticeModal');if(existing)existing.remove();
    const box=document.createElement('div');box.id='rfCommitteeNoticeModal';box.className='rf-prior-modal';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');
    const ar=lang()==='ar';
    let titleAr='يلزم التقدم بطلب لتشكيل لجنة معاينة',titleEn='You must apply to form an inspection committee';
    let bodyAr='',bodyEn='';
    if(kind==='none'){bodyAr='لم تبدأ الشركة النشاط ولم يثبت موقف الجدية حتى الآن. يمكنك استكمال طلب تجديد الإقامة، مع ضرورة التقدم بطلب تشكيل لجنة بدء نشاط أو لجنة لإثبات الجدية على الأقل، وإرفاق صورة ضوئية من إيصال سداد رسم تشكيل اللجنة ضمن المستندات.';bodyEn='The company has not commenced activity and its seriousness has not yet been verified. You may continue the renewal application, but must apply for a commencement committee or, at minimum, a committee to verify seriousness, and include a copy of the committee-fee payment receipt in the required documents.';}
    else if(kind==='continuity'){titleAr='تنبيه مهم — لإثبات استمرارية جدية الشركة';titleEn='Important — to verify the company’s continued seriousness';bodyAr='مرّت خمس سنوات أو أكثر على تاريخ آخر لجنة معاينة أثبتت بدء النشاط. يلزم التقدم بطلب لتشكيل لجنة معاينة جديدة لإثبات استمرارية جدية الشركة، وإرفاق صورة ضوئية من إيصال سداد رسم تشكيل اللجنة ضمن المستندات.';bodyEn='Five years or more have elapsed since the latest inspection committee verified commencement. Apply for a new inspection committee to verify the company’s continued seriousness, and attach a copy of the committee-fee payment receipt to the application.';}
    else {titleAr='تنبيه مهم — لإثبات جدية الشركة أو بدء النشاط';titleEn='Important — to verify company seriousness or commencement';bodyAr='مرّت سنة أو أكثر على تاريخ آخر لجنة معاينة أثبتت الجدية دون إثبات بدء النشاط. يلزم التقدم بطلب لتشكيل لجنة جديدة لإثبات بدء النشاط أو إثبات الجدية على الأقل. وطالما لم يثبت بدء النشاط، يجب تجديد إثبات الجدية من خلال لجنة معاينة كل عام، مع إرفاق صورة ضوئية من إيصال سداد رسم تشكيل اللجنة.';bodyEn='One year or more has elapsed since the latest committee verified seriousness, and commencement has not been proven. Apply for a new committee to verify commencement or, at minimum, seriousness. Until commencement is proven, seriousness must be re-verified by an inspection committee every year. Attach a copy of the committee-fee payment receipt.';}
    box.innerHTML=`<section class="rf-prior-dialog" dir="${ar?'rtl':'ltr'}"><button type="button" class="rf-prior-close" aria-label="${ar?'إغلاق':'Close'}">×</button><span class="rf-prior-kicker">${ar?titleAr:titleEn}</span><h2>${ar?titleAr:titleEn}</h2><p>${ar?bodyAr:bodyEn}</p><button type="button" class="rf-prior-confirm" id="rfCommitteeNoticeConfirm">${ar?'فهمت، متابعة الطلب':'I understand, continue'}</button></section>`;
    document.body.appendChild(box);const close=()=>box.remove();box.querySelector('.rf-prior-close').onclick=close;box.querySelector('#rfCommitteeNoticeConfirm').onclick=close;box.addEventListener('click',e=>{if(e.target===box)close();});
  }
  function openBoardExpiredModal(v){
    const existing=document.getElementById('rfBoardExpiredModal');if(existing)existing.remove();
    const box=document.createElement('div');box.id='rfBoardExpiredModal';box.className='rf-prior-modal';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');const ar=lang()==='ar';
    box.innerHTML=`<section class="rf-prior-dialog" dir="${ar?'rtl':'ltr'}"><button type="button" class="rf-prior-close" aria-label="${ar?'إغلاق':'Close'}">×</button><span class="rf-prior-kicker">${ar?'تنبيه مهم — مدة مجلس الإدارة منتهية':'Important — board term has expired'}</span><h2>${ar?'يتعذر استكمال الطلب قبل تجديد مجلس الإدارة':'The application cannot continue until the board is renewed'}</h2><p>${ar?'تاريخ انتهاء مدة مجلس الإدارة الذي أدخلته قد مضى. وبذلك تكون صفة المستثمر المرتبطة بعضوية مجلس الإدارة قد انقضت. يجب تجديد مجلس الإدارة وفق الإجراءات المقررة والتأشير بالتجديد في السجل التجاري، ثم إدخال تاريخ انتهاء المدة الجديدة قبل استكمال الطلب.':'The board expiry date entered has passed. The investor’s capacity based on board membership has therefore expired. Renew the board under the applicable procedures and record the renewal in the commercial register, then enter the new board expiry date before continuing.'}</p><p>${ar?'تُحسب مدة المجلس من تاريخ انعقاد الجمعية العامة العادية، وليس من تاريخ التأشير بالتجديد في السجل التجاري.':'The board term is calculated from the ordinary general assembly meeting date, not from the date the renewal is recorded in the commercial register.'}</p><button type="button" class="rf-prior-confirm" id="rfBoardExpiredConfirm">${ar?'العودة لتصحيح التاريخ':'Return to correct the date'}</button></section>`;
    document.body.appendChild(box);const close=()=>box.remove();box.querySelector('.rf-prior-close').onclick=close;box.querySelector('#rfBoardExpiredConfirm').onclick=close;box.addEventListener('click',e=>{if(e.target===box)close();});
  }
  function priorCompanyUndertakingRequired(v){
      const currentUnproven=currentService==='renew'?!['start','serious'].includes(v.activityStatus):!(['start','serious','operating'].includes(v.activityStatus)&&(['start','serious'].includes(v.inspectionStatus)||(v.activityStatus==='operating'&&v.inspectionStatus==='start')));
      return currentUnproven&&(v.investors||[]).some(x=>['residence_investment','work_159'].includes(x.previousBenefit)&&!['start','serious'].includes(x.previousCompanyProof));
    }
    function openPriorCompanyUndertaking(v){
      const list=(v.investors||[]).filter(x=>['residence_investment','work_159'].includes(x.previousBenefit)&&!['start','serious'].includes(x.previousCompanyProof));
      const priorNames=[...new Set(list.map(x=>String(x.previousCompanyName||'').trim()).filter(Boolean))];
      const ar=lang()==='ar',currentName=esc(v.companyName||(ar?'الشركة الحالية':'the current company'));
      const previousName=esc(priorNames.join(' / ')||(ar?'الشركة السابقة':'the previous company'));
      const modal=document.createElement('div');modal.id='rfPriorCompanyModal';modal.className='rf-prior-modal';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');
      modal.innerHTML=`<section class="rf-prior-dialog" dir="${ar?'rtl':'ltr'}"><button type="button" class="rf-prior-close" aria-label="${ar?'إغلاق':'Close'}">×</button>
        <span class="rf-prior-kicker">${ar?'تنبيه مهم قبل استكمال الطلب':'Important notice before continuing'}</span>
        <h2>${ar?'يلزم التقدم بطلب لإثبات جدية إحدى الشركتين':'An inspection request is required to prove the seriousness of one of the companies'}</h2>
        <p>${ar?`بما أن شركة <strong class="rf-company-highlight">${currentName}</strong> لم يثبت بدء نشاطها أو جديتها، وكذلك شركة <strong class="rf-company-highlight">${previousName}</strong>، فيجب التقدم بطلب إلى إدارة اللجان لإثبات جدية إحدى الشركتين.`:`Neither <strong class="rf-company-highlight">${currentName}</strong> nor <strong class="rf-company-highlight">${previousName}</strong> has documented commencement of activity or seriousness. An inspection-committee request must therefore be submitted to prove the seriousness of one of the two companies.`}</p>
        <p>${ar?'إذا سبق لك الاستفادة من إقامة مستثمر أو ترخيص عمل بشركة خاضعة لقانون 159 لسنة 1981، فلا يحق لك الحصول على خدمات إقامة المستثمر مرة أخرى إلا بعد إثبات جدية إحدى الشركتين وفق الإجراءات المعتمدة.':'If you previously benefited from investor residence or a work permit through a company subject to Law No. 159 of 1981, you may not obtain investor-residency services again until the seriousness of one of the two companies has been established in accordance with the approved procedures.'}</p>
        <label class="rf-prior-commit"><input type="checkbox" id="rfPriorUndertake"><span>${ar?'أتعهد بالتقدم بطلب لتشكيل لجنة معاينة على إحدى الشركتين، وتقديم صورة إيصال سداد رسوم اللجنة مع طلبي إلى الإدارة العامة للخدمات الحكومية.':'I undertake to apply for an inspection committee for one of the two companies and to submit a copy of the committee-fee payment receipt with my application to the General Administration of Government Services.'}</span></label>
        <button type="button" class="rf-prior-confirm" id="rfPriorConfirm">${ar?'أقرّ وأتعهد، ومتابعة الطلب':'I acknowledge and undertake; continue'}</button></section>`;
      document.body.appendChild(modal);const close=()=>modal.remove();modal.querySelector('.rf-prior-close').onclick=close;modal.addEventListener('click',e=>{if(e.target===modal)close();});
      modal.querySelector('#rfPriorConfirm').onclick=()=>{if(!modal.querySelector('#rfPriorUndertake').checked){showMessage(ar?'التعهد مطلوب':'Undertaking required',ar?'يرجى وضع علامة على مربع التعهد قبل استكمال الطلب.':'Please check the undertaking box before continuing.');return;}values=getCurrentValues();values.priorCommitteeUndertaking=true;persist();close();};
    }

    const validateStep=()=>{
      values=getCurrentValues();
      if(step===2){
        // Both historical counts are required for every service: the generated
        // company declaration reports both residence and entry-visa beneficiaries.
        for(const beneficiaryFieldId of ['residencyBeneficiaries','visaBeneficiaries']){
          const beneficiaryInput=$(`[name="${beneficiaryFieldId}"]`,mount);
          const rawCount=beneficiaryInput?String(beneficiaryInput.value??'').trim():'';
          if(rawCount===''){showBeneficiaryCountNotice(beneficiaryFieldId,false);return false;}
          const parsedCount=Number(rawCount);
          if(!Number.isInteger(parsedCount)||parsedCount<0||parsedCount>30){showBeneficiaryCountNotice(beneficiaryFieldId,true);return false;}
          values[beneficiaryFieldId]=parsedCount;
        }
      }
      if(step===0){for(const f of baseFields){if(f.showWhen&&!f.showWhen(values))continue;if(f.required&&!values[f.id]){showMessage(lang()==='ar'?'بيانات الشركة غير مكتملة':'Company details incomplete',`${lang()==='ar'?'يرجى استكمال: ':'Please complete: '}${lang()==='ar'?f.ar:f.en}`,f.id);return false;}}if(values.companyLaw==='159'){renderStep();return false;}if(values.companyStart&&new Date(values.companyStart+'T12:00:00')>new Date()){showMessage(lang()==='ar'?'تاريخ تأسيس غير صحيح':'Invalid incorporation date',lang()==='ar'?'لا يمكن أن يكون تاريخ تأسيس الشركة في المستقبل.':'The company incorporation date cannot be in the future.','companyStart');return false;}if(values.companyLaw==='unknown'){showMessage(lang()==='ar'?'تحديد قانون الشركة':'Identify the company law',t('lawUnknown'),'companyLaw');return false;}if(values.legalForm==='unknown'){showMessage(lang()==='ar'?'تحديد الشكل القانوني':'Identify the legal form',t('notSureForm'),'legalForm');return false;}}
      if(step===1){for(const f of executionFields){if(f.showWhen&&!f.showWhen(values))continue;if(f.required&&(!values[f.id]||values[f.id]==='unknown')){showMessage(lang()==='ar'?'بيانات مطلوبة':'Required information',`${lang()==='ar'?'يرجى استكمال الحقل: ':'Please complete: '}${fieldLabelValue(f)}`,f.id);return false;}}if(currentService==='renew'){if(values.inspectionDate&&new Date(values.inspectionDate+'T12:00:00')>new Date()){showMessage(lang()==='ar'?'تاريخ لجنة المعاينة غير صحيح':'Invalid inspection date',lang()==='ar'?'لا يمكن أن يكون تاريخ آخر لجنة معاينة في المستقبل.':'The latest inspection committee date cannot be in the future.','inspectionDate');return false;}if(values.activityStartDate&&new Date(values.activityStartDate+'T12:00:00')>new Date()){showMessage(lang()==='ar'?'تاريخ بدء النشاط غير صحيح':'Invalid activity commencement date',lang()==='ar'?'لا يمكن أن يكون تاريخ بدء النشاط في المستقبل.':'The activity commencement date cannot be in the future.','activityStartDate');return false;}if(values.activityStatus==='start'&&values.activityStartDate&&new Date(values.activityStartDate+'T12:00:00')<new Date(values.companyStart+'T12:00:00')){showMessage(lang()==='ar'?'تاريخ بدء النشاط يسبق التأسيس':'Activity date precedes incorporation',lang()==='ar'?'راجع تاريخ بدء النشاط؛ لا يمكن أن يسبق تاريخ تأسيس الشركة.':'Check the activity commencement date; it cannot precede company incorporation.','activityStartDate');return false;}}else if((['start','serious'].includes(values.activityStatus)&&values.inspectionStatus!==(values.activityStatus==='start'?'start':'serious'))||(values.activityStatus==='operating'&&values.inspectionStatus!=='start')){showMessage(lang()==='ar'?'تعارض في نتيجة المعاينة':'Inspection status mismatch',lang()==='ar'?'اختر نتيجة لجنة المعاينة المطابقة للموقف التنفيذي وأدخل تاريخ اللجنة.':'Choose the inspection result matching the operational status and enter the inspection date.','inspectionStatus');return false;}if(values.activityTypeIndustry==='yes'&&values.siteProof==='rent'&&(!values.leaseNotaryNumber||!values.leaseNotaryDate)){showMessage(lang()==='ar'?'توثيق عقد الإيجار مطلوب':'Lease authentication required',lang()==='ar'?'لأن النشاط صناعي وسند الحيازة إيجار، يجب إدخال رقم تصديق الشهر العقاري وتاريخه.':'Because the activity is industrial and the occupancy document is a lease, enter the Real Estate Registry authentication number and date.','leaseNotaryNumber');return false;}if(['one','sole'].includes(values.legalForm)&&['under','new','none'].includes(values.activityStatus)&&(currentService==='visa'||currentService==='grant')&&Number(values.usdDeposit)!==200000){showMessage(lang()==='ar'?'الوديعة الدولارية مطلوبة':'Frozen USD deposit required',lang()==='ar'?'لأن النشاط لم يبدأ والشكل القانوني منشأة فردية أو شركة شخص واحد، يجب إدخال قيمة الوديعة المجمدة المطلوبة 200,000 دولار أمريكي، مع تقديم شهادة البنك المصري ضمن المستندات.':'Because the activity has not commenced and the legal form is a sole proprietorship or one-person company, enter the required frozen USD 200,000 deposit and provide a certificate from an Egyptian bank.','usdDeposit');return false;}if(values.siteProof==='rent'&&values.leaseStartDate&&values.siteExpiry&&new Date(values.leaseStartDate+'T12:00:00')>new Date(values.siteExpiry+'T12:00:00')){showMessage(lang()==='ar'?'تواريخ عقد الإيجار غير متسقة':'Lease dates are inconsistent',lang()==='ar'?'يجب أن يكون تاريخ بدء عقد الإيجار سابقًا لتاريخ انتهائه.':'The lease start date must be earlier than its end date.','leaseStartDate');return false;}if(values.siteProof==='rent'&&values.siteExpiry&&new Date(values.siteExpiry+'T12:00:00')<new Date(new Date().toDateString())){showMessage(lang()==='ar'?'عقد الإيجار منتهٍ':'Lease has expired',lang()==='ar'?'لا يمكن استكمال الطلب بعقد إيجار منتهٍ. جدد العقد وأدخل تاريخ الانتهاء الصحيح.':'The request cannot proceed with an expired lease. Renew the lease and enter the correct end date.','siteExpiry');return false;}if(currentService==='renew'){const requirement=committeeRequirement(values);if(requirement)openCommitteeNotice(values,requirement);}}
      if(step===2){if(values.legalForm!=='sole'&&!values.companyExpiry){showMessage(lang()==='ar'?'مدة الشركة مطلوبة':'Company term required',lang()==='ar'?'أدخل تاريخ انتهاء مدة الشركة كما هو مؤشر به في السجل التجاري.':'Enter the company term expiry date as recorded in the commercial register.','companyExpiry');return false;}if(values.legalForm==='joint'&&['visa','grant','renew'].includes(currentService)){if(!values.boardExpiryDate){showMessage(lang()==='ar'?'تاريخ انتهاء مجلس الإدارة مطلوب':'Board expiry date required',lang()==='ar'?'أدخل تاريخ انتهاء مدة مجلس الإدارة كما هو ثابت بمحضر الجمعية العامة العادية.':'Enter the board term expiry date as stated in the ordinary general assembly minutes.','boardExpiryDate');return false;}if(new Date(values.boardExpiryDate+'T12:00:00')<new Date(new Date().toDateString())){openBoardExpiredModal(values);return false;}}for(const f of capitalFields){if(f.showWhen&&!f.showWhen(values))continue;const isRequired=['residencyBeneficiaries','visaBeneficiaries'].includes(f.id)?true:f.required;if(isRequired&&(values[f.id]===undefined||values[f.id]===null||String(values[f.id]).trim()==='')){if(['residencyBeneficiaries','visaBeneficiaries'].includes(f.id))showBeneficiaryCountNotice(f.id,false);else showMessage(lang()==='ar'?'بيانات مطلوبة':'Required information',`${lang()==='ar'?'يرجى استكمال الحقل: ':'Please complete: '}${fieldLabelValue(f)}`,f.id);return false;}}if(values.unifiedRegister&&!/^[0-9]{15}$/.test(String(values.unifiedRegister))){showMessage(lang()==='ar'?'الرقم الموحد غير صحيح':'Invalid unified register number',lang()==='ar'?'يجب أن يتكون الرقم الموحد للسجل التجاري من 15 رقمًا فقط، دون حروف أو رموز.':'The unified commercial-register number must contain exactly 15 digits, with no letters or symbols.','unifiedRegister');return false;}const companyCapitalEGP=Number(values.companyCapital)*(values.companyCapitalCurrency==='USD'?Number(values.exchangeRate):1);const capitalAmountEGP=Number(values.capitalAmount)*(values.capitalAmountCurrency==='USD'?Number(values.exchangeRate):1);if((values.companyCapitalCurrency==='USD'||values.capitalAmountCurrency==='USD')&&(!Number.isFinite(Number(values.exchangeRate))||Number(values.exchangeRate)<=0)){showMessage(lang()==='ar'?'سعر الصرف مطلوب':'Exchange rate required',lang()==='ar'?'أدخل سعر صرف موجبًا وصحيحًا مرة واحدة لاستخدامه في تحويل المبالغ المحددة بالدولار إلى الجنيه المصري.':'Enter one valid positive exchange rate to convert USD amounts into EGP.','exchangeRate');return false;}if(capitalAmountEGP>companyCapitalEGP&&!values.capitalExceedAcknowledged){openCapitalExceedModal(values);return false;}const minimum={joint:250000,llc:50000,one:50000,partnership:300000,limitedShares:300000,sole:100000};if(minimum[values.legalForm]&&companyCapitalEGP<minimum[values.legalForm]){showMessage(lang()==='ar'?'رأس المال أقل من الحد الوارد بالوثيقة': 'Capital is below the stated minimum',lang()==='ar'?`رأس المال أقل من الحد المذكور للشكل القانوني في وثيقة الوزن النسبي (${minimum[values.legalForm].toLocaleString('en-US')} جنيه). راجع المستندات قبل المتابعة.`:`Capital is below the legal-form minimum in the relative-weight document (EGP ${minimum[values.legalForm].toLocaleString('en-US')}). Check the documents before continuing.`,'companyCapital');return false;}if(capitalAmountEGP<50000){showMessage(lang()==='ar'?'قيمة المبالغ أو الشهادة أقل من الحد الأدنى':'Paid-up/certificate value below minimum',lang()==='ar'?'يجب ألا تقل قيمة المبالغ المؤداة أو المسددة أو الشهادة البنكية عن 50,000 جنيه مصري أو ما يعادلها بالدولار وفق سعر الصرف المدخل، مع عدم تجاوز رأس مال الشركة.':'The paid-up/paid amount or bank certificate must be at least EGP 50,000 or its USD equivalent using the entered exchange rate, and must not exceed company capital.','capitalAmount');return false;}}
      if(step===2){for(const [key,label,endKey] of [['previousResidences',lang()==='ar'?'الإقامة السابقة':'previous residence','residenceEnd'],['previousVisas',lang()==='ar'?'تأشيرة الدخول السابقة':'previous entry visa','validTo']]){const count=Number(values[key==='previousResidences'?'residencyBeneficiaries':'visaBeneficiaries']||0),list=values[key]||[];for(let i=0;i<count;i++){const x=list[i]||{};if(!x.name||!x.nationality||!x.role||!x[endKey]||!x[key==='previousResidences'?'residenceStart':'validFrom']){showMessage(lang()==='ar'?'بيانات المستفيد السابق غير مكتملة':'Previous beneficiary information incomplete',lang()==='ar'?`استكمل الاسم والجنسية والصفة وتاريخ البداية والانتهاء للمستفيد رقم ${i+1} (${label}).`:`Complete name, nationality, role, start date and expiry date for beneficiary ${i+1} (${label}).`,`previous${key==='previousResidences'?'Residence':'Visa'}_${i}_name`);return false;}if(key==='previousResidences'&&!x.companyStatus){showMessage(lang()==='ar'?'بيانات المستفيد السابق':'Previous beneficiary information',lang()==='ar'?`حدد ما إذا كان المستفيد رقم ${i+1} ما زال بالشركة أم خرج منها.`:`Specify whether previous beneficiary ${i+1} is still with the company or has left it.`,`previousResidence_${i}_companyStatus`);return false;}}}}
      if(step===2&&['bank_previous','economic_previous'].includes(values.capitalEvidence)&&(currentService==='visa'||currentService==='grant')){
        const residenceCount=Number(values.residencyBeneficiaries||0);
        const visaCount=Number(values.visaBeneficiaries||0);
        const residenceRecords=(values.previousResidences||[]).slice(0,residenceCount);
        const visaRecords=(values.previousVisas||[]).slice(0,visaCount);
        const hasPriorResidence=residenceCount>0&&residenceRecords.some(x=>x&&String(x.name||'').trim());
        const hasPriorVisa=visaCount>0&&visaRecords.some(x=>x&&String(x.name||'').trim());
        if(residenceCount+visaCount<1||(!hasPriorResidence&&!hasPriorVisa)){
          showMessage(lang()==='ar'?'بيانات مستفيد سابق مطلوبة':'Previous beneficiary record required',lang()==='ar'?'اخترت «سبق تقديم شهادة». لذلك يجب تسجيل مستثمر سابق واحد على الأقل حصل من خلال الشركة على إقامة أو تأشيرة دخول؛ يكفي وجود مستفيد في أيٍّ من الفئتين. لا يشترط أن يكون المستفيد من نوع الخدمة الحالية. أدخل العدد في الحقل المناسب وسجّل بيانات المستثمر في القسم المقابل، مع استبعاد مقدم الطلب الحالي.':'You selected “Previously submitted certificate”. At least one previous investor must have received either residence or an entry visa through the company. A beneficiary in either category is sufficient; it does not have to match the current service. Enter the count in the relevant field and complete that investor’s record in the corresponding section, excluding the current applicant.','residencyBeneficiaries');return false;
        }
      }
      if(step===3){const s=score(values);if(!s.complete||s.count===0){showMessage(lang()==='ar'?'بيانات الوزن النسبي غير مكتملة':'Relative-weight information incomplete',t('scoreIncomplete'));return false;}}
      if(step===4){const s=score(values);const maxAllowed=effectiveMaxCount(values,s);if(!s.complete||maxAllowed===0){showMessage(lang()==='ar'?'بيانات الوزن النسبي غير مكتملة':'Relative-weight information incomplete',t('scoreIncomplete'));return false;}const prior=currentService==='visa'?activeBeneficiaries(values,'visa'):activeBeneficiaries(values,'residence');const inv=(values.investors||[]).filter(x=>x&&x.name);if(prior+inv.length>maxAllowed){showMessage(lang()==='ar'?'تجاوز الحد المتاح':'Eligible limit exceeded',lang()==='ar'?`الحد الأقصى ${maxAllowed}، والمستفيدون السابقون الساريون ${prior}؛ لا يمكن أن يتجاوز مجموعهم مع المستثمرين الحاليين الحد.`:`The limit is ${maxAllowed}; ${prior} previous beneficiaries are valid. Previous and current beneficiaries combined cannot exceed the limit.`);return false;}if(!inv.length){showMessage(lang()==='ar'?'بيانات مطلوبة':'Required information',lang()==='ar'?'أضف بيانات مستثمر واحد على الأقل.':'Add at least one investor.');return false;}for(const [i,person] of inv.entries()){for(const f of investorFields){if(f.showWhen&&!f.showWhen(values))continue;if(f.required&&!person[f.id]){showMessage(lang()==='ar'?`بيانات المستثمر رقم ${i+1}`:`Investor ${i+1} information`,`${lang()==='ar'?'يرجى استكمال: ':'Please complete: '}${lang()==='ar'?f.ar:f.en}`,`investor_${i+1}_${f.id}`);return false;}}const exp=person.passportExpiry?new Date(person.passportExpiry+'T12:00:00'):null;const now=new Date();now.setHours(0,0,0,0);if(exp&&exp<now){showMessage(lang()==='ar'?`جواز سفر المستثمر رقم ${i+1} منتهٍ`:`Investor ${i+1} passport expired`,lang()==='ar'?'لا يمكن قبول الطلب بجواز سفر منتهي. أدخل تاريخًا صحيحًا بعد تجديد الجواز.':'An expired passport cannot be accepted. Renew the passport and enter the correct expiry date.',`investor_${i+1}_passportExpiry`);return false;}if(exp&&underSixMonths(exp)&&!person.passportUndertaking){showMessage(lang()==='ar'?`إقرار صلاحية جواز المستثمر رقم ${i+1}`:`Investor ${i+1} passport undertaking`,lang()==='ar'?'مدة السريان أقل من ستة أشهر. أقر بتحمل المسؤولية وتنفيذ التوصية بعد صدورها لدى إدارة الجوازات، أو جدّد الجواز.': 'Passport validity is under six months. Accept the undertaking or renew the passport.',`investor_${i+1}_passportUndertaking`);return false;}if(values.legalForm==='joint'&&(!person.sharePercent||Number(person.sharePercent)<=0||Number(person.sharePercent)>100)){showMessage(lang()==='ar'?`نسبة مساهمة المستثمر رقم ${i+1}`:`Investor ${i+1} share percentage`,lang()==='ar'?'أدخل نسبة مساهمة موجبة لا تتجاوز 100%.':'Enter a positive shareholding percentage no greater than 100%.',`investor_${i+1}_sharePercent`);return false;}if(!person.previousBenefit){showMessage(lang()==='ar'?'بيانات المستثمر السابقة':'Investor’s previous benefits',lang()==='ar'?'يرجى تحديد ما إذا سبق للمستثمر الحصول على إقامة أو ترخيص عمل من خلال الهيئة العامة للاستثمار.':'Specify whether the investor has previously held residence or a work permit through the General Authority for Investment.',`investor_${i+1}_previousBenefit`);return false;}if(['residence_investment','work_159'].includes(person.previousBenefit)){if(!String(person.previousCompanyName||'').trim()||!person.previousCompanyProof){showMessage(lang()==='ar'?'بيانات الشركة السابقة':'Previous company information',lang()==='ar'?'أدخل اسم الشركة السابقة وحدد ما إذا كانت قد أثبتت بدء النشاط أو الجدية.':'Enter the previous company name and specify whether it proved commencement of activity or seriousness.',`investor_${i+1}_previousCompanyName`);return false;}}if(isCompanyRepresentativeRole(person.role)&&!String(person.representedCompany||'').trim()){showMessage(lang()==='ar'?`اسم الشركة التي يمثلها المستثمر رقم ${i+1}`:`Represented company name for investor ${i+1}`,lang()==='ar'?'أدخل اسم الشركة التي يمثلها المستثمر كما هو مثبت في مستندات الشركة.':'Enter the represented company name as shown in company documents.',`investor_${i+1}_representedCompany`);return false;}if(!person.shareValue||Number(person.shareValue)<=0){showMessage(lang()==='ar'?`قيمة مساهمة المستثمر رقم ${i+1}`:`Investor ${i+1} contribution`,lang()==='ar'?'يجب إدخال قيمة مساهمة/مشاركة موجبة؛ لا يمكن تركها فارغة أو كتابة «إن وجدت».': 'Enter a positive share/participation value; it cannot be blank or optional.',`investor_${i+1}_shareValue`);return false;}}}
      if(step===5){if(currentService==='renew'&&values.previousResidence==='no'){showMessage(lang()==='ar'?'لا يمكن استكمال التجديد':'Renewal cannot continue',t('notEligibleRenew'),'previousResidence');return false;}if(currentService==='grant'&&values.firstOnCompany==='no'){showMessage(lang()==='ar'?'اختيار الخدمة غير مناسب':'Select the appropriate service',t('grantIsRenew'),'firstOnCompany');return false;}if(currentService==='visa'&&values.outsideEgypt==='no'){showMessage(lang()==='ar'?'راجع شروط تأشيرة الدخول':'Check entry-visa conditions',t('visaOutside'),'outsideEgypt');return false;}if(currentService==='movement'&&values.previousResidence==='no'){showMessage(lang()==='ar'?'شروط شهادة التحركات':'Movement certificate conditions',t('movementNoResidence'),'previousResidence');return false;}for(const f of [...(serviceFields[currentService]||[]),...applicantFields])if(f.required&&!values[f.id]){showMessage(lang()==='ar'?'بيانات مقدم الطلب غير مكتملة':'Applicant details incomplete',`${lang()==='ar'?'يرجى استكمال: ':'Please complete: '}${lang()==='ar'?f.ar:f.en}`,f.id);return false;}const emailPattern=/^[A-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}$/i;if(!emailPattern.test(String(values.email||'').trim())){showMessage(lang()==='ar'?'البريد الإلكتروني غير صحيح':'Invalid email address',lang()==='ar'?'أدخل عنوان بريد إلكتروني صحيحًا، مثل name@example.com.':'Enter a valid email address, such as name@example.com.','email');return false;}if(!isValidEgyptianPhoneNumber(values.phone)){showMessage(lang()==='ar'?'رقم الهاتف غير مصري أو غير مكتمل':'Invalid or incomplete Egyptian phone number',lang()==='ar'?'أدخل رقمًا مصريًا كاملًا: المحمول 11 رقمًا ويبدأ بـ 010 أو 011 أو 012 أو 015، أو رقمًا أرضيًا مصريًا كاملًا. يمكن استخدام +20 أو 0020 بدل الصفر الأول.':'Enter a complete Egyptian number: mobile numbers must contain 11 digits and start with 010, 011, 012 or 015; a complete Egyptian landline is also accepted. Use +20 or 0020 instead of the initial zero if entering the international format.','phone');return false;}}
      if(step===4&&priorCompanyUndertakingRequired(values)&&!values.priorCommitteeUndertaking){openPriorCompanyUndertaking(values);return false;}
      persist();return true;
    };
    $('#rfNext',mount)?.addEventListener('click',()=>{if(!validateStep())return;step=Math.min(5,step+1);renderStep();requestAnimationFrame(()=>{const top=mount.getBoundingClientRect().top+window.scrollY-100;window.scrollTo({top:Math.max(0,top),left:0,behavior:'smooth'});});});$('#rfPrev',mount)?.addEventListener('click',()=>{values=getCurrentValues();persist();step=Math.max(0,step-1);renderStep();});
    $('#rfAddInvestor',mount)?.addEventListener('click',()=>{const snapshot=getCurrentValues();const s=score(snapshot);const prior=currentService==='visa'?activeBeneficiaries(snapshot,'visa'):activeBeneficiaries(snapshot,'residence');const max=Math.max(0,effectiveMaxCount(snapshot,s)-prior);const a=snapshot.investors||[];if(a.length<max){a.push({});values.investors=a;persist();renderStep();}});
    $$('[data-remove-investor]',mount).forEach(b=>b.addEventListener('click',()=>{const snapshot=getCurrentValues();const cards=Array.isArray(snapshot.investors)?snapshot.investors:[];const i=Number.parseInt(b.dataset.removeInvestor,10);if(!Number.isInteger(i)||i<0||i>=cards.length)return;cards.splice(i,1);values={...snapshot,investors:cards.length?cards:[{}]};try{localStorage.setItem(storageKey(currentService),JSON.stringify(values));}catch{}renderStep();}));
    $('#rfWeightHelp',mount)?.addEventListener('click',()=>{const box=$('#rfWeightHelpBox',mount);box.hidden=!box.hidden;});$('#rfWeightVideo',mount)?.addEventListener('click',()=>openWeightVideo());
    $('#rfSave',mount)?.addEventListener('click',()=>{persist();const st=$('#rfStatus',mount);if(st)st.textContent=t('saved');});
    $('#rfReset',mount)?.addEventListener('click',()=>{if(confirm(lang()==='ar'?'هل تريد مسح البيانات المحفوظة لهذه الخدمة من هذا المتصفح؟':'Clear locally saved data for this service?')){localStorage.removeItem(storageKey(currentService));values={};step=0;renderStep();}});
    $('#rfWord',mount)?.addEventListener('click',()=>{if(!requireApplicantExportValidation())return;exportTemplateDocx(false);});
    const shareText=()=>{const v2=values;const s2=serviceMeta[currentService];const title=(s2?(lang()==='ar'?s2.ar:s2.en):'')+' — '+(v2.companyName||'');
      return [title, lang()==='ar'?'بيانات الطلب محفوظة محليًا. يمكن تنزيل ملف Word ثم مشاركته.':'Request data is stored locally. Download the Word file then share it.', v2.notes?((lang()==='ar'?'ملاحظات: ':'Notes: ')+v2.notes):''].filter(Boolean).join('\n');};
    $('#rfShareWa',mount)?.addEventListener('click',()=>{if(!requireApplicantExportValidation())return;window.open('https://wa.me/?text='+encodeURIComponent(shareText()),'_blank','noopener');});
    $('#rfShareEmail',mount)?.addEventListener('click',()=>{if(!requireApplicantExportValidation())return;const subject=encodeURIComponent((serviceMeta[currentService]?(lang()==='ar'?serviceMeta[currentService].ar:serviceMeta[currentService].en):'طلب')+' — '+(values.companyName||''));window.location.href='mailto:?subject='+subject+'&body='+encodeURIComponent(shareText());});
    $('#rfShareGeneric',mount)?.addEventListener('click',async()=>{if(!requireApplicantExportValidation())return;const text=shareText();if(navigator.share){try{await navigator.share({title:values.companyName||'GOVESER',text});}catch(e){}}else if(navigator.clipboard){await navigator.clipboard.writeText(text);showMessage(lang()==='ar'?'تم النسخ':'Copied',lang()==='ar'?'تم نسخ ملخص الطلب إلى الحافظة.':'Request summary copied to clipboard.');}else showMessage(lang()==='ar'?'المشاركة':'Share',text);});
  }
  async function exportTemplateDocx(printAfterDownload=false){
    values=getCurrentValues();persist();
    if(!requireApplicantExportValidation())return;
    if(!window.JSZip){showMessage(lang()==='ar'?'تعذر إنشاء ملف Word':'Could not create Word file',lang()==='ar'?'مكتبة إنشاء مستند Word غير محملة. أعد تحميل الصفحة ثم حاول مرة أخرى.':'The Word document library did not load. Reload the page and try again.');return;}
    const v=values, s=score(v), person=(v.investors||[])[0]||{}, bilingual=lang()==='en';
    const templateByService={visa:'visa.docx',grant:'grant.docx',renew:'renew.docx',movement:'movement.docx'};
    const templateUrl=`../assets/templates/${templateByService[currentService]||'grant.docx'}`;
    const val=(x)=>x===undefined||x===null?'':String(x).trim();
    const firstStrongDirection=(text)=>{const m=String(text??'').match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]|[A-Za-z]/);return m&&/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(m[0])?'ar':'en';};
    const label=(id,value,preferLang)=>{
      const all=[...baseFields,...executionFields,...capitalFields,...(serviceFields[currentService]||[]),...applicantFields,...investorFields];
      const f=all.find(x=>x.id===id);if(!f||value===undefined||value===null||value==='')return '';
      let opts=typeof f.options==='function'?f.options(v):f.options;
      if(id==='role')opts=roleOptions(v);if(id==='activityStatus')opts=activityStatusOptions(v);
      const o=(opts||[]).find(x=>String(x[0])===String(value));
      if(!o)return String(value);
      const useEn = preferLang==='en' || (preferLang!=='ar' && lang()==='en');
      return useEn ? (o[2]||o[1]) : o[1];
    };
    const bi=(en,ar)=>bilingual ? (String(en||'').trim() + '\n' + String(ar||'').trim()) : String(ar||'');
    const labelAr=(id,value)=>label(id,value,'ar');
    const labelEn=(id,value)=>label(id,value,'en');
    const roleAr=(person)=>{
      const role=String(person&&person.role||'');
      const options=roleOptions({legalForm:v.legalForm});
      const selected=options.find(o=>o[0]===role);
      let text=selected?selected[1]:role;
      if(isCompanyRepresentativeRole(role)){
        const company=String(person.representedCompany||'').trim();
        if(company) text=text.replace('ممثل عن شركة','ممثل عن شركة '+company);
      }
      return text;
    };
    const roleEn=(person)=>{
      const role=String(person&&person.role||'');
      const options=roleOptions({legalForm:v.legalForm});
      const selected=options.find(o=>o[0]===role);
      let text=selected?(selected[2]||selected[1]):role;
      if(isCompanyRepresentativeRole(role)){
        const company=String(person.representedCompany||'').trim();
        if(company) text=text.replace('Company Representative','Representative of '+company);
      }
      return text;
    };
    const W='http://schemas.openxmlformats.org/wordprocessingml/2006/main';
    const getText=p=>Array.from(p.getElementsByTagNameNS(W,'t')).map(n=>n.textContent||'').join('');
    const setP=(p,text)=>{
      const owner=p.ownerDocument,parent=p.parentNode;
      const oldPPr=Array.from(p.childNodes).find(n=>n.nodeType===1&&n.namespaceURI===W&&n.localName==='pPr');
      const firstRun=Array.from(p.getElementsByTagNameNS(W,'r'))[0];
      const oldRPr=firstRun?Array.from(firstRun.childNodes).find(n=>n.nodeType===1&&n.namespaceURI===W&&n.localName==='rPr'):null;
      const setVal=(node,name,value)=>{let e=Array.from(node.childNodes).find(n=>n.nodeType===1&&n.namespaceURI===W&&n.localName===name);if(!e){e=owner.createElementNS(W,'w:'+name);node.appendChild(e);}e.setAttributeNS(W,'w:val',value);};
      const setAttr=(node,name,value)=>node.setAttributeNS(W,'w:'+name,String(value));
      let insertionPoint=p;
      String(text??'').split('\n').forEach((part,index)=>{
        const para=index===0?p:owner.createElementNS(W,'w:p');
        while(para.firstChild)para.removeChild(para.firstChild);
        const pPr=oldPPr?oldPPr.cloneNode(true):owner.createElementNS(W,'w:pPr');
        const paragraphLanguage=firstStrongDirection(part),rtl=paragraphLanguage==='ar';
        setVal(pPr,'jc','start');setVal(pPr,'bidi',rtl?'1':'0');
        let spacing=Array.from(pPr.childNodes).find(n=>n.nodeType===1&&n.namespaceURI===W&&n.localName==='spacing');
        if(!spacing){spacing=owner.createElementNS(W,'w:spacing');pPr.appendChild(spacing);}
        setAttr(spacing,'before','0');setAttr(spacing,'after','90');setAttr(spacing,'line','276');setAttr(spacing,'lineRule','auto');
        for(const propertyName of ['bidi','spacing','ind','contextualSpacing','mirrorIndents','suppressOverlap','jc']){
          const property=Array.from(pPr.childNodes).find(n=>n.nodeType===1&&n.namespaceURI===W&&n.localName===propertyName);
          if(property)pPr.appendChild(property);
        }
        para.appendChild(pPr);
        const run=owner.createElementNS(W,'w:r'),rPr=oldRPr?oldRPr.cloneNode(true):owner.createElementNS(W,'w:rPr');
        setVal(rPr,'rtl',firstStrongDirection(part)==='ar'?'1':'0');
        let fonts=Array.from(rPr.childNodes).find(n=>n.nodeType===1&&n.namespaceURI===W&&n.localName==='rFonts');
        if(!fonts){fonts=owner.createElementNS(W,'w:rFonts');rPr.insertBefore(fonts,rPr.firstChild);}
        setAttr(fonts,'ascii','Arial');setAttr(fonts,'hAnsi','Arial');setAttr(fonts,'cs','Arial');setAttr(fonts,'eastAsia','Arial');
        let ln=Array.from(rPr.childNodes).find(n=>n.nodeType===1&&n.namespaceURI===W&&n.localName==='lang');
        if(!ln){ln=owner.createElementNS(W,'w:lang');rPr.appendChild(ln);}
        ln.setAttributeNS(W,'w:val',rtl?'ar-EG':'en-US');ln.setAttributeNS(W,'w:eastAsia','en-US');ln.setAttributeNS(W,'w:bidi',rtl?'ar-EG':'en-US');run.appendChild(rPr);
        const t=owner.createElementNS(W,'w:t');t.setAttributeNS('http://www.w3.org/XML/1998/namespace','xml:space','preserve');t.textContent=part;run.appendChild(t);para.appendChild(run);
        if(index>0){parent.insertBefore(para,insertionPoint.nextSibling);insertionPoint=para;}
      });
    };
    const paragraphs=doc=>Array.from(doc.getElementsByTagNameNS(W,'p'));
    const put=(doc,marker,text)=>{const p=paragraphs(doc).find(x=>getText(x).includes(marker));if(p)setP(p,text);return !!p;};
    const putNotes=(doc,notes)=>{
      if(!notes||!String(notes).trim())return;
      const text=bi('Notes: '+String(notes).trim(), 'ملاحظات: '+String(notes).trim());
      // Try known markers first
      if(put(doc,'ملاحظات',text))return;
      if(put(doc,'ملاحظة',text))return;
      // Insert a new paragraph after email / phone fields
      const markers=['البريد الالكتروني','البريد الإلكتروني','رقم الواتس','رقم الواتس آب'];
      const ps=paragraphs(doc);
      let anchor=null;
      for(const m of markers){const p=ps.find(x=>getText(x).includes(m));if(p)anchor=p;}
      if(!anchor){anchor=ps[ps.length-1];}
      if(!anchor||!anchor.parentNode)return;
      const Wns=W;
      const np=anchor.ownerDocument.createElementNS(Wns,'w:p');
      const pPr=Array.from(anchor.childNodes).find(n=>n.nodeType===1&&n.namespaceURI===Wns&&n.localName==='pPr');
      if(pPr)np.appendChild(pPr.cloneNode(true));
      const run=anchor.ownerDocument.createElementNS(Wns,'w:r');
      const firstRun=Array.from(anchor.getElementsByTagNameNS(Wns,'r'))[0];
      const rPr=firstRun?Array.from(firstRun.childNodes).find(n=>n.nodeType===1&&n.namespaceURI===Wns&&n.localName==='rPr'):null;
      if(rPr)run.appendChild(rPr.cloneNode(true));
      const t=anchor.ownerDocument.createElementNS(Wns,'w:t');
      t.setAttributeNS('http://www.w3.org/XML/1998/namespace','xml:space','preserve');
      t.textContent='';
      run.appendChild(t);
      np.appendChild(run);
      if(anchor.nextSibling)anchor.parentNode.insertBefore(np,anchor.nextSibling);
      else anchor.parentNode.appendChild(np);
      setP(np,text);
    };
    // The second half of the official template is a separate declaration section.
    // Scope writes to that section so similar text in the main request is never overwritten.
    const putInPriorDeclaration=(doc,marker,text)=>{
      const ps=paragraphs(doc);
      const headingIndex=ps.findIndex(p=>{const text=getText(p);return text.includes('بيانات عن الحاصلين على توصية بالإقامة أو توصية تأشيرة دخول الشركة')||text.includes('بيانات السادة المستثمرين الحاصلين على إقامة بالشركة');});
      if(headingIndex<0)return false;
      const p=ps.slice(headingIndex+1).find(x=>getText(x).includes(marker));
      if(!p)return false;
      setP(p,text);return true;
    };
    const fmtDate=x=>val(x);
    const priorBenefitPeople=(v.investors||[]).filter(x=>['residence_investment','work_159'].includes(x.previousBenefit));
    const priorDeclarationTextAr=priorBenefitPeople.length
      ? priorBenefitPeople.map(x=>x.previousBenefit==='residence_investment'?`سبق لي الحصول على إقامة بشركة خاضعة لقانون الاستثمار / ${val(x.previousCompanyName)}`:`سبق لي الحصول على ترخيص عمل بشركة خاضعة لقانون 159 لسنة 1981 / ${val(x.previousCompanyName)}`).join('، و')+(v.priorCommitteeUndertaking?'، وأتعهد بتقديم صورة ضوئية لإيصال سداد رسوم تشكيل لجنة معاينة لإحدى الشركتين.':'')
      : 'علماً أنني لم يسبق لي الحصول علي إقامة مستثمر بشركة خاضعة لإحكام قانون الاستثمار / ترخيص عمل بشركة خاضعة لإحكام قانون 159 لسنة 1981';
    const priorDeclarationTextEn=priorBenefitPeople.length
      ? priorBenefitPeople.map(x=>x.previousBenefit==='residence_investment'?`I previously obtained residence through an Investment Law company / ${val(x.previousCompanyName)}`:`I previously obtained a work permit through a Law 159 of 1981 company / ${val(x.previousCompanyName)}`).join(', and ')+(v.priorCommitteeUndertaking?', and I undertake to submit a photocopy of the receipt for payment of the inspection committee formation fees for one of the two companies.':'')
      : 'I hereby declare that I have not previously obtained investor residence through a company subject to the Investment Law / a work permit through a company subject to Law No. 159 of 1981';
    const priorDeclarationText=bilingual?bi(priorDeclarationTextEn,priorDeclarationTextAr):priorDeclarationTextAr;
    const scoreTxt=k=>s.complete?`${s[k]}%`:'';
    const statusAr=label('activityStatus',v.activityStatus,'ar');
    const statusEn=label('activityStatus',v.activityStatus,'en');
    const status=bilingual?bi(statusEn,statusAr):statusAr;
    const inspectionAr=currentService==='renew'?(v.activityStatus==='start'?'لجنة بدء النشاط':v.activityStatus==='serious'?'لجنة إثبات الجدية':'لم يسبق إثبات بدء النشاط أو الجدية'):label('inspectionStatus',v.inspectionStatus,'ar');
    const inspectionEn=currentService==='renew'?(v.activityStatus==='start'?'Commencement committee':v.activityStatus==='serious'?'Seriousness verification committee':'Commencement or seriousness has not yet been verified'):label('inspectionStatus',v.inspectionStatus,'en');
    const inspection=bilingual?bi(inspectionEn,inspectionAr):inspectionAr;
    const capitalKindAr=label('capitalEvidence',v.capitalEvidence,'ar')||'إثبات رأس المال';
    const capitalKindEn=label('capitalEvidence',v.capitalEvidence,'en')||'Capital evidence';
    const capitalKind=bilingual?bi(capitalKindEn,capitalKindAr):capitalKindAr;
    const totalBeneficiaries=Number(v[currentService==='visa'?'visaBeneficiaries':'residencyBeneficiaries']||0);
    const investors=(v.investors||[]).filter(x=>x&&val(x.name));
    const people=investors.length?investors:[person];
    const name=val(person.name), nationality=val(person.nationality), passport=val(person.passport), passportExpiry=fmtDate(person.passportExpiry), role=investorRoleDisplay(person,v.legalForm)||val(person.role);
    const company=val(v.companyName), applicant=val(v.applicantName);
    const applicantRoleMapAr={principal:'صاحب الشأن',agent:'وكيل بتوكيل رسمي',delegate:'مفوض بصحة توقيع بنكي'};
    const applicantRoleMapEn={principal:'Principal (concerned party)',agent:'Agent under official power of attorney',delegate:'Authorized representative with bank signature authentication'};
    const applicantRoleAr=applicantRoleMapAr[v.applicantRole]||val(v.applicantRole);
    const applicantRoleEn=applicantRoleMapEn[v.applicantRole]||val(v.applicantRole);
    const applicantRole=bilingual?bi(applicantRoleEn,applicantRoleAr):applicantRoleAr;
    const numbered=(fn)=>people.map((x,i)=>`${i+1}- ${fn(x,i)}`).join('\n');
    try{
      const response=await fetch(templateUrl);if(!response.ok)throw new Error('template fetch failed');
      const zip=await JSZip.loadAsync(await response.arrayBuffer());
      const xmlFile=zip.file('word/document.xml');if(!xmlFile)throw new Error('document.xml missing');
      const xml=await xmlFile.async('text');const doc=new DOMParser().parseFromString(xml,'application/xml');
      if(doc.getElementsByTagName('parsererror').length)throw new Error('template XML invalid');
      // Add reviewed English counterparts for fixed paragraphs in all four official templates.
      // Dynamic paragraphs are filled below and are deliberately excluded from this map.
      const staticEnglish={
        'النموذج الاسترشادي لطلب منح إقامة مستثمر':'Guidance Template for an Investor Residence Grant Request',
        'النموذج الاسترشادي لطلب تأشيره دخول مستثمر':'Guidance Template for an Investor Entry Visa Request',
        'النموذج الاسترشادي لطلب تجديد إقامة مستثمر':'Guidance Template for an Investor Residence Renewal Request',
        'النموذج الاسترشادي لطلب خدمة شهادة تحركات لمستثمر اجنبي بالشركات الخاضعة لقانون الاستثمار':'Guidance Template for an Investor Movement Certificate Request for Companies Subject to the Investment Law',
        'السيد الأستاذ / رئيس قطاع خدمات الاستثمار':'To: The Head of the Investment Services Sector',
        'وذلك للنظر في في عدد الحاصلين على إقامة مستثمر بالشركة':'This request is submitted to review the number of investor residence permits granted through the Company.',
        'تم إرسال نسخة الكترونية كاملة PDF من كافة المستندات وكذا نسخة ورد من الطلب من خلال ( البريد الالكتروني/ الواتساب ) بتاريخ  /  /':'A complete electronic PDF copy of all supporting documents, together with a Word copy of this request, was sent by email / WhatsApp on: ____ / ____ / ______.',
        'مدته الشركة ----------- وذلك حتي ---/---/-----':'Company term: __________________, valid until ____ / ____ / ______.',
        'بالنسبة للشركات المساهمه اخر تجديد لمجلس الادارة  -----/ ------/--------':'For joint-stock companies: date of the latest board renewal: ____ / ____ / ______.',
        'تحيه طيبه وبعد':'Greetings,',
        'تحية طيبة وبعد':'Greetings,',
        'تحية طيبه وبعد':'Greetings,',
        'وتفضلوا بقبول فائق الاحترام ,,,,':'Please accept the assurances of our highest consideration.',
        'وتفضلوا بقبول فائق الاحترام ,,,,,':'Please accept the assurances of our highest consideration.',
        'وتفضلوا بقبول فائق الاحترام ,,,,':'Please accept the assurances of our highest consideration.',
        'مقدمه إلي سيادتكم':'Respectfully submitted to Your Excellency,',
        'مقدمة إلى سيادتكم':'Respectfully submitted to Your Excellency,',
        'مقدمة إلي سيادتكم':'Respectfully submitted to Your Excellency,',
        'بيانات عن الحاصلين على توصية بالإقامة أو توصية تأشيرة دخول الشركة':'Details of Persons Holding a Company Residence Recommendation or Investor Entry-Visa Recommendation',
        'بيانات السادة المستثمرين الحاصلين على إقامة بالشركة':'Details of Investors Holding Residence Through the Company',
        'السيد الأستاذ / رئيس قطاع خدمات الاستثمار':'To: The Head of the Investment Services Sector',
        'تحية طيبة وبعد':'Greetings,',
        'وهم الاتي اسمائهم':'The following persons are listed below:',
        'اولا الحاصلين على تأشيرة دخول :-':'First: Holders of an Investor Entry-Visa Recommendation:',
        'أولا الحاصلين على تأشيرة دخول :-':'First: Holders of an Investor Entry-Visa Recommendation:',
        'ثانياً  الحاصلين على توصية بالإقامة :-':'Second: Holders of an Investor Residence Recommendation:',
        'ثانياً الحاصلين على توصية بالإقامة :-':'Second: Holders of an Investor Residence Recommendation:',
        'ثانياً  الحاصلين على توصية بالإقامة :-':'Second: Holders of an Investor Residence Recommendation:',
        'لابد للموقع على هذا الإقرار أن يكون له الحق في تمثيل الشركة وفقا لما هو مؤشر به في السجل التجاري':'The signatory to this declaration must be legally authorized to represent the Company, as recorded in the commercial register.',
        'لابد للموقع على هذا الإقرار أن يكون له الحق في الإدارة والتوقيع عن الشركة وفقا لما هو مؤشر به في السجل التجاري.':'The signatory to this declaration must be authorized to manage and sign on behalf of the Company, as recorded in the commercial register.',
        '*( صحة التوقيع تقدم مرة واحدة فقط طالما أنها لذات الموقع وذات التوقيع )':'* Signature authentication is submitted only once, provided that the signatory and signature remain the same.',
        '*( صحة التوقيع تقدم مرة واحدة فقط طالما أنه لذات الموقع والتوقيع )':'* Signature authentication is submitted only once, provided that the signatory and signature remain the same.',
        '( صحة التوقيع تقدم مرة واحدة فقط طالما أنه لذات الموقع والتوقيع )':'Signature authentication is submitted only once, provided that the signatory and signature remain the same.',
        '( ملاحظة الكلمات المكتوبة باللون الأخضر يتم الاختيار بينها وفقا للشكل القانوني للشركة وموقفها التنفيذي..... الخ )':'Note: Wording highlighted in green should be selected according to the Company’s legal form and operational status, as applicable.'
      };
      if(bilingual){
        const ps=Array.from(doc.getElementsByTagNameNS(W,'p'));
        ps.forEach(original=>{
          const source=getText(original).trim(),translated=staticEnglish[source];
          if(!translated||!original.parentNode)return;
          const english=original.cloneNode(true);
          original.parentNode.insertBefore(english,original);
          setP(english,translated);
        });
      }
      if(bilingual){
        const cellEnglish={'خاتم الشركة':'Company Seal','صحة توقيع بنكي':'Bank Signature Authentication'};
        Array.from(doc.getElementsByTagNameNS(W,'tc')).forEach(cell=>{
          const original=Array.from(cell.getElementsByTagNameNS(W,'p'))[0];if(!original)return;
          const translated=cellEnglish[getText(original).trim()];if(!translated)return;
          const english=original.cloneNode(true);cell.insertBefore(english,original);setP(english,translated);
        });
      }
      if(currentService==='movement'){
        put(doc,'يرجى التفضل باتخاذ اللازم للاستعلام عن تحركات',people.length>1?bi(
          `Kindly take the necessary action to inquire about the movements of the following:\n${numbered(x=>`Mr./Ms. ${val(x.name)}`)}`,
          `يرجى التفضل باتخاذ اللازم للاستعلام عن تحركات كل من :-\n${numbered(x=>`السيد/ ${val(x.name)}`)}`
        ):bi(
          `Kindly take the necessary action to inquire about the movements of Mr./Ms. ${val(people[0].name)}`,
          `يرجى التفضل باتخاذ اللازم للاستعلام عن تحركات السيد/ ${val(people[0].name)}`
        ));
        put(doc,'من المـــستثمرين الحاصلين علي إقام',bi(
          `Among the investors holding residence with company / ${company}`,
          `من المـــستثمرين الحاصلين علي إقامتــــة بشركة / ${company}`
        ));
        put(doc,'وجنسيته /',numbered(x=>bi(
          `Mr./Ms. ${val(x.name)} — Nationality: ${bilingual?nationalityEnglishText(val(x.nationality)):val(x.nationality)} — Passport No. ${val(x.passport)} — Valid until ${fmtDate(x.passportExpiry)}`,
          `السيد/ ${val(x.name)} — الجنسية / ${val(x.nationality)} — رقم جواز السفر ${val(x.passport)} — ساري حتى ${fmtDate(x.passportExpiry)}`
        )));
        put(doc,'وتاريخ ميلاده',numbered(x=>bi(
          `Mr./Ms. ${val(x.name)} — Date of birth: ${fmtDate(x.birthDate||v.birthDate)} — Capacity: ${roleEn(x)||val(x.role)} in the company — Residence expires on ${fmtDate(v.lastResidenceExpiry)}`,
          `السيد/ ${val(x.name)} — تاريخ الميلاد ${fmtDate(x.birthDate||v.birthDate)} — بصفته/ ${roleAr(x)||val(x.role)} بالشركة — الإقامة تنتهي في ${fmtDate(v.lastResidenceExpiry)}`
        )));
        put(doc,'حيث انه قد غادر البلاد بتاريخ',bi(
          `He/she departed the country on ${fmtDate(v.departureDate)} (the period of absence from Egypt must be no less than 6 months if the residence is still valid)`,
          `حيث إنه قد غادر البلاد بتاريخ ${fmtDate(v.departureDate)} (لابد أن تكون فترة الانقطاع عن دخول البلاد لا تقل عن 6 أشهر في حال سريان مدة الإقامة)`
        ));
        put(doc,'السجل التجاري صادر بتاريخ',bi(
          `Commercial register issued on ${fmtDate(v.registerDate)}; commercial register renewal date ${fmtDate(v.registerRenewalDate)}`,
          `السجل التجاري صادر بتاريخ ${fmtDate(v.registerDate)} وتاريخ تجديد السجل التجاري ${fmtDate(v.registerRenewalDate)}`
        ));
        put(doc,'هام: الرقم الموحد للسجل التجاري',bi(
          `Important: Unified commercial register number (exactly 15 digits): ${val(v.unifiedRegister)}`,
          `هام: الرقم الموحد للسجل التجاري (15 رقمًا): ${val(v.unifiedRegister)}`
        ));
        put(doc,'السيد/ -------------------',bi(`Mr./Ms. ${applicant}`,`السيد/ ${applicant}`));
        put(doc,'بصفتي  ----------------------- بالشركة',bi(
          `In my capacity as ${applicantRoleEn} of the company ${company}`,
          `بصفتي ${applicantRoleAr} بالشركة ${company}`
        ));
        put(doc,'رقم الواتس اب------------------------',bi(`WhatsApp number: ${val(v.phone)}`,`رقم الواتس آب ${val(v.phone)}`));
        put(doc,'البريد الالكتروني------------------------------------------',bi(`Email: ${val(v.email)}`,`البريد الإلكتروني ${val(v.email)}`));
        putNotes(doc,v.notes);
      }else{
        const requestWordAr=currentService==='visa'?'تأشيرة دخول':currentService==='renew'?'تجديد إقامة':'منح إقامة';
        const requestWordEn=currentService==='visa'?'an entry visa':currentService==='renew'?'renewal of residence':'grant of residence';
        put(doc,'برجاء استصدار توصيه',bi(
          `Kindly issue a recommendation for ${requestWordEn} for the investor(s) listed below:`,
          `برجاء استصدار توصية ${requestWordAr} للمستثمر/المستثمرين الآتي بيانهم:`
        ));
        put(doc,'تم إرسال النسخة الإلكترونية','');
        put(doc,'تم إرسال','');
        put(doc,'علماً أنني لم يسبق لي الحصول',priorDeclarationText);
        put(doc,'جنسيته /','');
        put(doc,'حيث أن قيمه',bi(
          `The investor’s shareholding / participation value in the Company is ${val(person.shareValue)} EGP${v.legalForm==='joint'&&val(person.sharePercent)?` (${val(person.sharePercent)}%)`:''}.`,
          `حيث إن قيمة مساهمة/مشاركة المستثمر بالشركة ${val(person.shareValue)} جنيهًا${v.legalForm==='joint'&&val(person.sharePercent)?` بنسبة ${val(person.sharePercent)}%`:''}.`
        ));
        if(currentService==='renew')put(doc,'انتهاء اخر إقامة مستثمر حاصل عليها',bi(
          `Previous investor residence expiry date: ${fmtDate(v.lastResidenceExpiry)}. In his/her capacity as ${roleEn(person)||val(person.role)} with ${company}.`,
          `انتهاء آخر إقامة مستثمر حاصل عليها بتاريخ ${fmtDate(v.lastResidenceExpiry)}، وذلك بصفته / ${roleAr(person)||val(person.role)} بشركة / ${company}`
        ));
        else put(doc,'وذلك بصفته /',bi(`In his/her capacity as ${roleEn(person)||val(person.role)} with ${company}`,`وذلك بصفته / ${roleAr(person)||val(person.role)} بشركة / ${company}`));
        const companyCapitalEGP=Number(v.companyCapital||0)*(v.companyCapitalCurrency==='USD'?Number(v.exchangeRate||0):1); const capitalAmountEGP=Number(v.capitalAmount||0)*(v.capitalAmountCurrency==='USD'?Number(v.exchangeRate||0):1);
        put(doc,'إجمالي رأس مال الشركة',bi(
          `Company capital as recorded in the commercial register: ${val(v.companyCapital)} ${v.companyCapitalCurrency==='USD'?'USD':'EGP'} (equivalent: ${companyCapitalEGP.toLocaleString('en-US',{maximumFractionDigits:2})} EGP). ${capitalKindEn}: ${val(v.capitalAmount)} ${v.capitalAmountCurrency==='USD'?'USD':'EGP'} (equivalent: ${capitalAmountEGP.toLocaleString('en-US',{maximumFractionDigits:2})} EGP) (weight: ${scoreTxt('capital')})`,
          `رأس مال الشركة المؤشر به بالسجل التجاري: ${val(v.companyCapital)} ${v.companyCapitalCurrency==='USD'?'دولار أمريكي':'جنيه مصري'} (المعادل: ${companyCapitalEGP.toLocaleString('en-US',{maximumFractionDigits:2})} جنيه مصري). ${capitalKindAr}: ${val(v.capitalAmount)} ${v.capitalAmountCurrency==='USD'?'دولار أمريكي':'جنيه مصري'} (المعادل: ${capitalAmountEGP.toLocaleString('en-US',{maximumFractionDigits:2})} جنيه مصري) (بنسبة ${scoreTxt('capital')})`
        ));
        put(doc,'نشاط الشركة تفصيليا',bi(
          `Company activity in detail: ${val(v.activityDescription)} (weight: ${scoreTxt('purpose')})`,
          `نشاط الشركة تفصيليًا: ${val(v.activityDescription)} (بنسبة ${scoreTxt('purpose')})`
        ));
        put(doc,'موقع ممارسه النشاط',bi(
          `Business activity location: ${val(v.siteName)} (weight: ${scoreTxt('location')})`,
          `موقع ممارسة النشاط: ${val(v.siteName)} (بنسبة ${scoreTxt('location')})`
        ));
        put(doc,'عدد العمالة المصرية المؤمن عليها',bi(
          `Number of insured Egyptian employees: ${val(v.insuredWorkers)} worker(s) (weight: ${scoreTxt('labor')})`,
          `عدد العمالة المصرية المؤمن عليها: ${val(v.insuredWorkers)} عامل (بنسبة ${scoreTxt('labor')})`
        ));
        put(doc,'ليصبح اجمالي الوزن النسبي',bi(
          `Total relative weight: (${s.complete?`${s.total}%`:'incomplete'})`,
          `ليصبح إجمالي الوزن النسبي (${s.complete?`${s.total}%`:'غير مكتمل'})`
        ));
        put(doc,'عدد الحاصلين علي إقامات',bi(
          `Number of residence / entry-visa beneficiaries through the company (${totalBeneficiaries}) excluding the applicant`,
          `عدد الحاصلين على إقامات / تأشيرة دخول بالشركة (${totalBeneficiaries}) مستفيد بخلاف مقدم الطلب`
        ));
        put(doc,'الموقف التنفيذي للشركة',bi(
          `Company / establishment operational status: ${statusEn}${v.activityStatus==='start'?`\nActivity commencement date: ${fmtDate(v.activityStartDate)}`:''}`,
          `الموقف التنفيذي للشركة / المنشأة: ${statusAr}${v.activityStatus==='start'?`\nتاريخ بدء النشاط: ${fmtDate(v.activityStartDate)}`:''}`
        ));
        if(['one','sole'].includes(v.legalForm)&&['under','new'].includes(v.activityStatus)&&(currentService==='visa'||currentService==='grant'))put(doc,'الموقف التنفيذي للشركة',bi(
          `Company / establishment operational status: ${statusEn}\nFrozen USD deposit: ${val(v.usdDeposit)} US Dollars, pursuant to a certificate issued by an Egyptian bank, to remain frozen until commencement of activity is proven.`,
          `الموقف التنفيذي للشركة / المنشأة: ${statusAr}\nوديعة دولارية مجمدة: ${val(v.usdDeposit)} دولار أمريكي، وفق شهادة صادرة من بنك مصري، وتظل مجمدة حتى إثبات بدء النشاط.`
        ));
        if(v.inspectionDate)put(doc,'تاريخ أخر لجنه معاينه',bi(
          `Date of latest inspection committee: ${fmtDate(v.inspectionDate)} (${inspectionEn})`,
          `تاريخ آخر لجنة معاينة ${fmtDate(v.inspectionDate)} (${inspectionAr})`
        ));
        if(v.legalForm==='joint'&&v.boardExpiryDate)put(doc,'بالنسبة للشركات المساهم',bi(
          `For joint-stock companies: board term expires on ${fmtDate(v.boardExpiryDate)}`,
          `بالنسبة للشركات المساهمة: تاريخ انتهاء مدة مجلس الإدارة ${fmtDate(v.boardExpiryDate)}`
        ));
        if(v.legalForm!=='sole'&&v.companyExpiry)put(doc,'مدته الشركة',bi(
          `Company term until ${fmtDate(v.companyExpiry)}`,
          `مدة الشركة حتى ${fmtDate(v.companyExpiry)}`
        ));
        put(doc,'السجل التجاري صادر بتاريخ',bi(
          `Commercial register issued on ${fmtDate(v.registerDate)}; commercial register renewal date ${fmtDate(v.registerRenewalDate)}`,
          `السجل التجاري صادر بتاريخ ${fmtDate(v.registerDate)} وتاريخ تجديد السجل التجاري ${fmtDate(v.registerRenewalDate)}`
        ));
        put(doc,'هام: الرقم الموحد للسجل التجاري',bi(
          `Important: Unified commercial register number (exactly 15 digits): ${val(v.unifiedRegister)}`,
          `هام: الرقم الموحد للسجل التجاري (15 رقمًا): ${val(v.unifiedRegister)}`
        ));
        put(doc,'سند حيا',bi(
          `Proof of occupancy (${labelEn('siteProof',v.siteProof)})${v.siteProof==='rent'?` — lease from ${fmtDate(v.leaseStartDate)} to ${fmtDate(v.siteExpiry)}`:v.siteExpiry?` — contract date ${fmtDate(v.siteExpiry)}`:''}${v.activityTypeIndustry==='yes'&&v.siteProof==='rent'?`; Real Estate Registry authentication No. ${val(v.leaseNotaryNumber)} dated ${fmtDate(v.leaseNotaryDate)}`:''}`,
          `سند حيازة موقع ممارسة النشاط (${labelAr('siteProof',v.siteProof)})${v.siteProof==='rent'?` — يبدأ عقد الإيجار في ${fmtDate(v.leaseStartDate)} وينتهي في ${fmtDate(v.siteExpiry)}`:v.siteExpiry?` — تاريخ العقد ${fmtDate(v.siteExpiry)}`:''}${v.activityTypeIndustry==='yes'&&v.siteProof==='rent'?`، تصديق الشهر العقاري رقم ${val(v.leaseNotaryNumber)} بتاريخ ${fmtDate(v.leaseNotaryDate)}`:''}`
        ));
        put(doc,'السيد/ -------------------',bi(`Mr./Ms. ${applicant}`,`السيد/ ${applicant}`));
        put(doc,'بصفتى ................................ بالشركة',bi(
          `In my capacity as ${applicantRoleEn} of the company ${company}`,
          `بصفتي ${applicantRoleAr} بالشركة ${company}`
        ));
        put(doc,'رقم الواتس آب  -----------------------------------------',bi(`WhatsApp number: ${val(v.phone)}`,`رقم الواتس آب ${val(v.phone)}`));
        put(doc,'البريد الالكتروني----------------------------------------',bi(`Email: ${val(v.email)}`,`البريد الإلكتروني ${val(v.email)}`));
        putNotes(doc,v.notes);
      }
      const companyUndertakingAr=currentService==='movement'
        ? 'تقر وتتعهد الشركة بأن البيانات المذكورة بعاليه صحيحة وتتحمل المسؤولية القانونية عنها، كما تقر بأنها لن تطلب الإقامة للسيد المذكور بعاليه إلا إذا كان الوزن النسبي يسمح بحصوله على إقامة مستثمر بالشركة.'
        : 'تقر وتتعهد الشركة بأن البيانات المذكورة بعاليه صحيحة وتتحمل المسؤولية القانونية عنها، كما تقر بإلغاء إقامة السيد المذكور بعاليه حال تخارجه منها (انتفاء صفته داخل الشركة)، وموافاة الهيئة بصورة ضوئية من إلغاء تلك الإقامة.';
      const companyUndertakingEn=currentService==='movement'
        ? 'The Company hereby declares and undertakes that the information stated above is true and accurate and accepts full legal responsibility therefor. The Company further undertakes not to request investor residence for the above-named person unless the Company’s relative-weight category permits the grant of such residence.'
        : 'The Company hereby declares and undertakes that the information stated above is true and accurate and accepts full legal responsibility therefor. The Company further undertakes to cancel the above-named investor’s residence permit if the investor ceases to be associated with the Company or no longer holds the relevant capacity therein, and to provide the Authority with a copy of the residence cancellation document.';
      put(doc,'تقر وتتعهد الشركة',bi(companyUndertakingEn,companyUndertakingAr));
      // Fill the separate declaration page's exact placeholders for every service template.
      // These counts are the previously recorded beneficiaries, never current applicants.
      putInPriorDeclaration(doc,'يرجى التفضل بالإحاطة بأن الوزن النسبي للشركة',bi(
        `Kindly be informed that the company's relative weight is (${s.complete?`${s.total}`:''}) %`,
        `يرجى التفضل بالإحاطة بأن الوزن النسبي للشركة (${s.complete?`${s.total}`:''}) %`
      ));
      putInPriorDeclaration(doc,'وأن عدد الحاصلين على إقامة بالشركة',bi(
        `and that the number of residence beneficiaries through the company is (${Number(v.residencyBeneficiaries||0)}) investor(s) and the number of investor entry-visa beneficiaries is (${Number(v.visaBeneficiaries||0)})`,
        `وأن عدد الحاصلين على إقامة بالشركة (${Number(v.residencyBeneficiaries||0)}) مستثمر وعدد الحاصلين على تأشيرة دخول مستثمر (${Number(v.visaBeneficiaries||0)})`
      ));
      putInPriorDeclaration(doc,'السيد/ -------------------',bi('Name: ___________________','السيد/ -------------------'));
      putInPriorDeclaration(doc,'بصفتى ................................ بالشركة',bi('In my capacity as ___________________ of the Company','بصفتى ................................ بالشركة'));
      {
      const priorCompanyUndertakingAr='تقر وتتعهد الشركة بأن البيانات المذكورة بعالية صحيحة وتتحمل المسؤولية القانونية عنها، وأن السادة المذكورين هم فقط من لهم حق الإقامة وفقًا للوزن النسبي للشركة.';
      const priorCompanyUndertakingEn='The Company hereby declares and undertakes that the information stated above is true and accurate and accepts full legal responsibility therefor, and that the persons listed are the only individuals entitled to residence through the Company in accordance with its relative-weight category.';
      putInPriorDeclaration(doc,'تقر وتتعهد الشركة',bi(priorCompanyUndertakingEn,priorCompanyUndertakingAr));
      }
      // In the official Word templates, table[1] is the prior-visa table (5 columns)
      // and table[2] is the prior-residence table (7 columns). The current applicant
      // is written in the main request paragraphs above and MUST NOT be written to either table.
      const tables=Array.from(doc.getElementsByTagNameNS(W,'tbl'));
      const writeCell=(cell,text)=>{const p=Array.from(cell.getElementsByTagNameNS(W,'p'))[0];if(p)setP(p,text);};
      const fillDataTable=(table,rows,headers)=>{
        if(!table)return;let trs=Array.from(table.getElementsByTagNameNS(W,'tr'));if(!trs.length)return;
        const header=trs[0];const headerCells=Array.from(header.getElementsByTagNameNS(W,'tc'));const colCount=headers?headers.length:headerCells.length;
        if(headers)headers.forEach((value,i)=>{if(headerCells[i])writeCell(headerCells[i],value);});
        if(!rows.length){
          let bodyRows=Array.from(table.getElementsByTagNameNS(W,'tr')).slice(1);
          if(!bodyRows.length){const clone=header.cloneNode(true);table.appendChild(clone);bodyRows=[clone];}
          const row=bodyRows[0];bodyRows.slice(1).forEach(r=>r.parentNode.removeChild(r));let cells=Array.from(row.getElementsByTagNameNS(W,'tc'));
          if(!cells.length)return;const first=cells[0];cells.slice(1).forEach(c=>c.parentNode.removeChild(c));
          let tcPr=Array.from(first.getElementsByTagNameNS(W,'tcPr'))[0];if(!tcPr){tcPr=doc.createElementNS(W,'w:tcPr');first.insertBefore(tcPr,first.firstChild);}let span=Array.from(tcPr.getElementsByTagNameNS(W,'gridSpan'))[0];if(!span){span=doc.createElementNS(W,'w:gridSpan');tcPr.appendChild(span);}span.setAttributeNS(W,'w:val',String(colCount));
          writeCell(first,bilingual?bi('None','لا يوجد'):'لا يوجد');return;
        }
        let bodyRows=Array.from(table.getElementsByTagNameNS(W,'tr')).slice(1);const templateRow=bodyRows[0]||header;
        while(bodyRows.length<rows.length){const clone=templateRow.cloneNode(true);table.appendChild(clone);bodyRows=Array.from(table.getElementsByTagNameNS(W,'tr')).slice(1);}
        bodyRows.forEach((row,r)=>{const vals=rows[r]||[];const cells=Array.from(row.getElementsByTagNameNS(W,'tc'));cells.forEach((cell,c)=>writeCell(cell,vals[c]===undefined?'':vals[c]));});
      };
      const makeWordTable=(rows,headers)=>{
        const el=(name)=>doc.createElementNS(W,name);
        const attr=(node,name,value)=>node.setAttributeNS(W,'w:'+name,String(value));
        const tbl=el('w:tbl'),pr=el('w:tblPr'),borders=el('w:tblBorders');
        for(const edge of ['top','left','bottom','right','insideH','insideV']){const b=el('w:'+edge);attr(b,'val','single');attr(b,'sz','5');attr(b,'space','0');attr(b,'color','B7C7D9');borders.appendChild(b);}
        const bidi=el('w:bidiVisual');attr(bidi,'val','1');pr.appendChild(bidi);
        const tableWidth=el('w:tblW');attr(tableWidth,'w','9360');attr(tableWidth,'type','dxa');pr.appendChild(tableWidth);pr.appendChild(borders);const layout=el('w:tblLayout');attr(layout,'type','fixed');pr.appendChild(layout);tbl.appendChild(pr);
        const widths=[420,1560,1080,1150,1100,1120,1600,1330];
        const grid=el('w:tblGrid');for(let i=0;i<headers.length;i++){const gc=el('w:gridCol');attr(gc,'w',widths[i]||1000);grid.appendChild(gc);}tbl.appendChild(grid);
        const addRow=(vals,isHeader)=>{
          const tr=el('w:tr'),trPr=el('w:trPr'),cantSplit=el('w:cantSplit');trPr.appendChild(cantSplit);if(isHeader){const repeat=el('w:tblHeader');attr(repeat,'val','1');trPr.appendChild(repeat);}tr.appendChild(trPr);
          vals.forEach((txt,i)=>{
            const tc=el('w:tc'),tcPr=el('w:tcPr'),width=el('w:tcW');attr(width,'w',widths[i]||1000);attr(width,'type','dxa');tcPr.appendChild(width);
            if(isHeader){const shd=el('w:shd');attr(shd,'fill','1B3A6B');attr(shd,'val','clear');tcPr.appendChild(shd);}
            const mar=el('w:tcMar');for(const side of ['top','start','bottom','end']){const m=el('w:'+side);attr(m,'w',side==='top'||side==='bottom'?'90':'75');attr(m,'type','dxa');mar.appendChild(m);}tcPr.appendChild(mar);const valign=el('w:vAlign');attr(valign,'val','center');tcPr.appendChild(valign);tc.appendChild(tcPr);
            String(txt??'').split('\n').forEach(part=>{
              const p=el('w:p'),pPr=el('w:pPr'),rtl=firstStrongDirection(part)==='ar';
              const bidiP=el('w:bidi');attr(bidiP,'val',rtl?'1':'0');pPr.appendChild(bidiP);
              const spacing=el('w:spacing');attr(spacing,'before','0');attr(spacing,'after','40');attr(spacing,'line','240');attr(spacing,'lineRule','auto');pPr.appendChild(spacing);
              const jc=el('w:jc');attr(jc,'val',isHeader||i===0?'center':'start');pPr.appendChild(jc);p.appendChild(pPr);
              const r=el('w:r'),rPr=el('w:rPr');
              if(isHeader){rPr.appendChild(el('w:b'));const color=el('w:color');attr(color,'val','FFFFFF');rPr.appendChild(color);}
              const sz=el('w:sz');attr(sz,'val',isHeader?'19':'18');rPr.appendChild(sz);
              const rtlRun=el('w:rtl');attr(rtlRun,'val',rtl?'1':'0');rPr.appendChild(rtlRun);
              const lang=el('w:lang');attr(lang,'val',rtl?'ar-EG':'en-US');rPr.appendChild(lang);
              r.appendChild(rPr);const tnode=el('w:t');tnode.setAttributeNS('http://www.w3.org/XML/1998/namespace','xml:space','preserve');tnode.textContent=part;r.appendChild(tnode);p.appendChild(r);tc.appendChild(p);
            });
            tr.appendChild(tc);
          });
          return tr;
        };
        tbl.appendChild(addRow(headers,true));rows.forEach(row=>tbl.appendChild(addRow(row,false)));return tbl;
      };
      const insertCurrentInvestorTable=()=>{
        const paras=Array.from(doc.getElementsByTagNameNS(W,'p'));const target=paras.find(p=>(p.textContent||'').includes('برجاء استصدار توصية'));
        if(!target||currentService==='movement')return;
        const isJoint=v.legalForm==='joint';
        const valueHeaderAr=isJoint?'قيمة المساهمة (جنيه)':'قيمة المشاركة (جنيه)';
        const valueHeaderEn=isJoint?'Share value (EGP)':'Participation value (EGP)';
        const percentHeaderAr=isJoint?'نسبة المساهمة (%)':'نسبة المشاركة (%)';
        const percentHeaderEn=isJoint?'Share %':'Participation %';
        const currentRows=investors.map((x,i)=>[
          String(i+1), val(x.name), bilingual?bi(nationalityEnglishText(val(x.nationality)),val(x.nationality)):val(x.nationality), val(x.passport), fmtDate(x.passportExpiry),
          bilingual?bi(roleEn(x)||val(x.role), roleAr(x)||val(x.role)):(investorRoleDisplay(x,v.legalForm)||val(x.role)),
          val(x.shareValue), isJoint?`${val(x.sharePercent)}%`:'—'
        ]);
        const headers=bilingual
          ? [bi('No.','م'),bi('Investor name','اسم المستثمر'),bi('Nationality','الجنسية'),bi('Passport No.','رقم الجواز'),bi('Passport expiry','انتهاء الجواز'),bi('Capacity','الصفة'),bi(valueHeaderEn,valueHeaderAr),bi(percentHeaderEn,percentHeaderAr)]
          : ['م','اسم المستثمر','الجنسية','رقم جواز السفر','تاريخ انتهاء الجواز','الصفة',valueHeaderAr,percentHeaderAr];
        const table=makeWordTable(currentRows,headers);
        target.parentNode.insertBefore(table,target.nextSibling);
      };
      insertCurrentInvestorTable();
      const priorVisaCount=Number(v.visaBeneficiaries||0);
      const priorResidenceCount=Number(v.residencyBeneficiaries||0);
      const priorVisas=(v.previousVisas||[]).slice(0,priorVisaCount).filter(x=>x&&val(x.name));
      const priorResidences=(v.previousResidences||[]).slice(0,priorResidenceCount).filter(x=>x&&val(x.name));
      const visaRows=priorVisas.map((x,i)=>[
        String(i+1),val(x.name),bilingual?bi(nationalityEnglishText(val(x.nationality)),val(x.nationality)):val(x.nationality),
        bilingual?bi(roleEn(x)||val(x.role), roleAr(x)||val(x.role)):(investorRoleDisplay(x,v.legalForm)||val(x.role)),
        bi(
          `Share/participation value: ${val(x.shareValue)} EGP\nVisa validity from ${fmtDate(x.validFrom)} to ${fmtDate(x.validTo)}`,
          `قيمة المشاركة/المساهمة: ${val(x.shareValue)} جنيهًا\nصلاحية التأشيرة من ${fmtDate(x.validFrom)} إلى ${fmtDate(x.validTo)}`
        )
      ]);
      const residenceRows=priorResidences.map((x,i)=>[
        String(i+1),val(x.name),bilingual?bi(nationalityEnglishText(val(x.nationality)),val(x.nationality)):val(x.nationality),
        bilingual?bi(roleEn(x)||val(x.role), roleAr(x)||val(x.role)):(investorRoleDisplay(x,v.legalForm)||val(x.role)),
        val(x.shareValue),
        fmtDate(x.residenceStart),fmtDate(x.residenceEnd)
      ]);
      fillDataTable(tables[1],visaRows, bilingual
        ? [bi('No.','م'),bi('Name','الاسم'),bi('Nationality','الجنسية'),bi('Capacity','الصفة'),bi('Share/participation value & visa validity','قيمة المشاركة وصلاحية التأشيرة')]
        : ['م','الاسم','الجنسية','الصفة','قيمة المشاركة/المساهمة وصلاحية التأشيرة']);
      fillDataTable(tables[2],residenceRows, bilingual
        ? [bi('No.','م'),bi('Name','الاسم'),bi('Nationality','الجنسية'),bi('Capacity','الصفة'),bi('Share/participation value','قيمة المشاركة'),bi('Residence start','بداية الإقامة'),bi('Residence end','انتهاء الإقامة')]
        : ['م','الاسم','الجنسية','الصفة','قيمة المساهمة/ المشاركة','تاريخ بداية الإقامة','تاريخ انتهاء الإقامة']);
      // Normalize every paragraph in the final document, including untouched source paragraphs.
      // This replaces inherited justified/RTL formatting with language-aware direction.
      const normalizeDocumentFormatting=(documentXml)=>{
        const ensure=(parent,name)=>{
          let node=Array.from(parent.childNodes).find(n=>n.nodeType===1&&n.namespaceURI===W&&n.localName===name);
          if(!node){node=documentXml.createElementNS(W,'w:'+name);parent.appendChild(node);}
          return node;
        };
        const val=(node,name,value)=>node.setAttributeNS(W,'w:'+name,String(value));
        for(const section of Array.from(documentXml.getElementsByTagNameNS(W,'sectPr'))){
          const pageMargins=ensure(section,'pgMar');
          val(pageMargins,'top','720');val(pageMargins,'bottom','720');
        }
        for(const paragraph of Array.from(documentXml.getElementsByTagNameNS(W,'p'))){
          const paragraphText=getText(paragraph);
          if(!paragraphText.trim())continue;
          const rtl=firstStrongDirection(paragraphText)==='ar';
          const pPr=ensure(paragraph,'pPr');
          const jc=ensure(pPr,'jc');
          const existingAlign=jc.getAttributeNS(W,'val')||jc.getAttribute('w:val');
          val(jc,'val',existingAlign==='center'?'center':'start');
          const bidi=ensure(pPr,'bidi');val(bidi,'val',rtl?'1':'0');
          const spacing=ensure(pPr,'spacing');
          val(spacing,'before','0');val(spacing,'after','90');val(spacing,'line','276');val(spacing,'lineRule','auto');
          for(const propertyName of ['bidi','spacing','ind','contextualSpacing','mirrorIndents','suppressOverlap','jc']){
            const property=Array.from(pPr.childNodes).find(n=>n.nodeType===1&&n.namespaceURI===W&&n.localName===propertyName);
            if(property)pPr.appendChild(property);
          }
          for(const run of Array.from(paragraph.getElementsByTagNameNS(W,'r'))){
            const rPr=ensure(run,'rPr');
            let fonts=Array.from(rPr.childNodes).find(n=>n.nodeType===1&&n.namespaceURI===W&&n.localName==='rFonts');
            if(!fonts){fonts=documentXml.createElementNS(W,'w:rFonts');rPr.insertBefore(fonts,rPr.firstChild);}
            val(fonts,'ascii','Arial');val(fonts,'hAnsi','Arial');val(fonts,'cs','Arial');val(fonts,'eastAsia','Arial');
            const runText=Array.from(run.getElementsByTagNameNS(W,'t')).map(n=>n.textContent||'').join('');
            const runRtl=firstStrongDirection(runText)==='ar';
            const rtlNode=ensure(rPr,'rtl');val(rtlNode,'val',runRtl?'1':'0');
            const language=ensure(rPr,'lang');
            val(language,'val',runRtl?'ar-EG':'en-US');
            val(language,'eastAsia','en-US');val(language,'bidi',runRtl?'ar-EG':'en-US');
          }
        }
      };
      normalizeDocumentFormatting(doc);
      // Professional legal-document layout: bilingual paragraphs are presented as
      // one restrained two-language panel (English first, Arabic second).
      // Arabic-only documents retain a clean official form layout without boxes.
      const applyOfficialVisualDesign=(documentXml,withEnglish)=>{
        const ns=W;
        const elements=(parent,name)=>Array.from(parent.childNodes).filter(n=>n.nodeType===1&&n.namespaceURI===ns&&n.localName===name);
        const ensure=(parent,name)=>{let n=elements(parent,name)[0];if(!n){n=documentXml.createElementNS(ns,'w:'+name);parent.appendChild(n);}return n;};
        const set=(node,name,value)=>node.setAttributeNS(ns,'w:'+name,String(value));
        const reorderPPr=(pPr)=>{
          const order=['pStyle','keepNext','keepLines','pageBreakBefore','framePr','widowControl','numPr','suppressLineNumbers','pBdr','shd','tabs','suppressAutoHyphens','kinsoku','wordWrap','overflowPunct','topLinePunct','autoSpaceDE','autoSpaceDN','bidi','adjustRightInd','snapToGrid','spacing','ind','contextualSpacing','mirrorIndents','suppressOverlap','jc','textDirection','textAlignment','outlineLvl','divId','cnfStyle','rPr','sectPr','pPrChange'];
          const rank=new Map(order.map((x,i)=>[x,i]));
          const kids=Array.from(pPr.childNodes).filter(n=>n.nodeType===1&&n.namespaceURI===ns);
          kids.sort((a,b)=>(rank.get(a.localName)??999)-(rank.get(b.localName)??999));
          kids.forEach(n=>pPr.appendChild(n));
        };
        const languageOf=(txt)=>String(txt??'').trim()?firstStrongDirection(txt):'other';
        const setParagraphLanguage=(p,language,align)=>{
          const pPr=ensure(p,'pPr');
          set(ensure(pPr,'jc'),'val',align);
          set(ensure(pPr,'bidi'),'val',language==='ar'?'1':'0');
          set(ensure(pPr,'mirrorIndents'),'val',language==='ar'?'1':'0');
          set(ensure(pPr,'spacing'),'before','35');set(ensure(pPr,'spacing'),'after','45');set(ensure(pPr,'spacing'),'line','276');set(ensure(pPr,'spacing'),'lineRule','auto');
          const paragraphIndent=ensure(pPr,'ind');for(const attr of ['firstLine','hanging','firstLineChars','hangingChars','start','end'])paragraphIndent.removeAttributeNS(ns,attr);set(paragraphIndent,'left','140');set(paragraphIndent,'right','140');
          set(ensure(pPr,'contextualSpacing'),'val','1');
          for(const run of Array.from(p.getElementsByTagNameNS(ns,'r'))){
            const rPr=ensure(run,'rPr');
            let fonts=elements(rPr,'rFonts')[0];if(!fonts){fonts=documentXml.createElementNS(ns,'w:rFonts');rPr.insertBefore(fonts,rPr.firstChild);}
            set(fonts,'ascii','Arial');set(fonts,'hAnsi','Arial');set(fonts,'cs','Arial');set(fonts,'eastAsia','Arial');
            set(ensure(rPr,'sz'),'val','21');set(ensure(rPr,'szCs'),'val','22');
            const runText=Array.from(run.getElementsByTagNameNS(ns,'t')).map(n=>n.textContent||'').join('');
            const runLanguage=firstStrongDirection(runText);
            set(ensure(rPr,'rtl'),'val',runLanguage==='ar'?'1':'0');
            set(ensure(rPr,'cs'),'val',runLanguage==='ar'?'1':'0');
            const l=ensure(rPr,'lang');set(l,'val',runLanguage==='ar'?'ar-EG':'en-US');set(l,'bidi',runLanguage==='ar'?'ar-EG':'en-US');set(l,'eastAsia','en-US');
          }
          reorderPPr(pPr);
        };
        const border=(pPr,edge,color,size)=>{
          const pBdr=ensure(pPr,'pBdr');let e=elements(pBdr,edge)[0];if(!e){e=documentXml.createElementNS(ns,'w:'+edge);pBdr.appendChild(e);}
          set(e,'val','single');set(e,'sz',size);set(e,'space','6');set(e,'color',color);
        };
        const setPairBackground=(p,top,bottom)=>{
          const pPr=ensure(p,'pPr');const shd=ensure(pPr,'shd');set(shd,'val','clear');set(shd,'color','auto');set(shd,'fill','F8FAFD');
          border(pPr,'left','D5DFEA','5');border(pPr,'right','D5DFEA','5');
          if(top)border(pPr,'top','C5D2E0','6');
          if(bottom)border(pPr,'bottom','C5D2E0','6');
          border(pPr,'between','E8EDF3','3');
          if(!top){const b=elements(ensure(pPr,'pBdr'),'top')[0];if(b)set(b,'val','nil');}
          if(!bottom){const b=elements(ensure(pPr,'pBdr'),'bottom')[0];if(b)set(b,'val','nil');}
          set(ensure(pPr,'spacing'),'before',top?'100':'15');set(ensure(pPr,'spacing'),'after',bottom?'105':'15');
          const panelIndent=ensure(pPr,'ind');for(const attr of ['firstLine','hanging','firstLineChars','hangingChars','start','end'])panelIndent.removeAttributeNS(ns,attr);set(panelIndent,'left','150');set(panelIndent,'right','150');
          set(ensure(pPr,'keepLines'),'val','1');
          reorderPPr(pPr);
        };
        const addLanguageLabel=(p,language)=>{
          const run=documentXml.createElementNS(ns,'w:r'),rPr=documentXml.createElementNS(ns,'w:rPr');
          const fonts=documentXml.createElementNS(ns,'w:rFonts');set(fonts,'ascii','Arial');set(fonts,'hAnsi','Arial');set(fonts,'cs','Arial');rPr.appendChild(fonts);
          const bold=documentXml.createElementNS(ns,'w:b');rPr.appendChild(bold);
          const color=documentXml.createElementNS(ns,'w:color');set(color,'val','64758B');rPr.appendChild(color);
          const size=documentXml.createElementNS(ns,'w:sz');set(size,'val','16');rPr.appendChild(size);
          const rtl=documentXml.createElementNS(ns,'w:rtl');set(rtl,'val',language==='ar'?'1':'0');rPr.appendChild(rtl);
          const lang=documentXml.createElementNS(ns,'w:lang');set(lang,'val',language==='ar'?'ar-EG':'en-US');set(lang,'bidi',language==='ar'?'ar-EG':'en-US');rPr.appendChild(lang);
          run.appendChild(rPr);const t=documentXml.createElementNS(ns,'w:t');t.setAttributeNS('http://www.w3.org/XML/1998/namespace','xml:space','preserve');t.textContent=language==='ar'?'العربية  |  ':'ENGLISH  |  ';run.appendChild(t);
          const first=elements(p,'r')[0];if(first)p.insertBefore(run,first);else p.appendChild(run);
        };
        const stylePairGroup=(englishParagraphs,arabicParagraphs)=>{
          const inTableCell=englishParagraphs[0]&&englishParagraphs[0].parentNode&&englishParagraphs[0].parentNode.localName==='tc';
          englishParagraphs.forEach(p=>setParagraphLanguage(p,'en','start'));
          arabicParagraphs.forEach(p=>setParagraphLanguage(p,'ar','start'));
          if(!inTableCell){
            const all=[...englishParagraphs,...arabicParagraphs];
            all.forEach((p,index)=>setPairBackground(p,index===0,index===all.length-1));
          }
          englishParagraphs.forEach(p=>set(ensure(ensure(p,'pPr'),'keepNext'),'val','1'));
          arabicParagraphs.slice(0,-1).forEach(p=>set(ensure(ensure(p,'pPr'),'keepNext'),'val','1'));
          const enText=englishParagraphs.map(getText).join(' ').trim();
          const arText=arabicParagraphs.map(getText).join(' ').trim();
          const isTitle=/Guidance Template for an Investor|النموذج الاسترشادي/.test(enText+' '+arText);
          const isSection=/Details of |بيانات عن |بيانات السادة/.test(enText+' '+arText);
          if(isTitle||isSection){
            for(const p of [englishParagraphs[0],arabicParagraphs[0]]){
              const language=p===englishParagraphs[0]?'en':'ar';
              const pPr=ensure(p,'pPr');set(ensure(pPr,'spacing'),'before',isTitle?'120':'85');set(ensure(pPr,'spacing'),'after',isTitle?'120':'85');
              for(const run of Array.from(p.getElementsByTagNameNS(ns,'r'))){const rPr=ensure(run,'rPr');const labelColor=elements(rPr,'color')[0];if(labelColor&&((labelColor.getAttributeNS(ns,'val')||labelColor.getAttribute('w:val'))==='64758B'))continue;set(ensure(rPr,'b'),'val','1');set(ensure(rPr,'color'),'val','1B3A6B');set(ensure(rPr,'sz'),'val',isTitle?'28':'23');set(ensure(rPr,'szCs'),'val',isTitle?'30':'24');}
              const shd=ensure(pPr,'shd');set(shd,'val','clear');set(shd,'fill',isTitle?'EAF0F7':'F0F4F8');
              if(isTitle){const jc=ensure(pPr,'jc');set(jc,'val','start');}
              reorderPPr(pPr);
            }
          }
        };
        // Group consecutive English paragraphs followed by their Arabic counterpart(s).
        // This handles both one-paragraph translations and multi-line statements/tables.
        const containers=[];
        const body=Array.from(documentXml.getElementsByTagNameNS(ns,'body'))[0];if(body)containers.push(body);
        containers.push(...Array.from(documentXml.getElementsByTagNameNS(ns,'tc')));
        containers.push(...Array.from(documentXml.getElementsByTagNameNS(ns,'sdtContent')));
        const paired=new Set();
        if(withEnglish){
          for(const container of containers){
            const children=Array.from(container.childNodes).filter(n=>n.nodeType===1&&n.namespaceURI===ns);
            for(let i=0;i<children.length;){
              const first=children[i];
              if(first.localName!=='p'||languageOf(getText(first).trim())!=='en'){i++;continue;}
              const englishParagraphs=[];let j=i;
              while(j<children.length&&children[j].localName==='p'&&languageOf(getText(children[j]).trim())==='en')englishParagraphs.push(children[j++]);
              const arabicParagraphs=[];let k=j;
              while(k<children.length&&children[k].localName==='p'&&languageOf(getText(children[k]).trim())==='ar')arabicParagraphs.push(children[k++]);
              if(arabicParagraphs.length){
                stylePairGroup(englishParagraphs,arabicParagraphs);
                englishParagraphs.forEach(p=>paired.add(p));arabicParagraphs.forEach(p=>paired.add(p));
                i=k;
              }else i++;
            }
          }
        }
        // Consistent typography for unpaired paragraphs and Arabic-only output.
        for(const p of Array.from(documentXml.getElementsByTagNameNS(ns,'p'))){
          if(paired.has(p))continue;
          const txt=getText(p).trim();if(!txt)continue;
          const language=languageOf(txt);const pPr=ensure(p,'pPr');
          if(language==='ar'){
            const existing=elements(pPr,'jc')[0];const centered=existing&&((existing.getAttributeNS(ns,'val')||existing.getAttribute('w:val'))==='center');
            set(ensure(pPr,'jc'),'val',centered?'center':'start');set(ensure(pPr,'bidi'),'val','1');
            set(ensure(pPr,'mirrorIndents'),'val','1');
          }else if(language==='en'){
            set(ensure(pPr,'mirrorIndents'),'val','0');
            set(ensure(pPr,'jc'),'val','start');set(ensure(pPr,'bidi'),'val','0');
          }
          // Re-assert direction at run level in the final pass. Word uses the
          // complex-script rtl property separately from paragraph alignment.
          for(const run of Array.from(p.getElementsByTagNameNS(ns,'r'))){
            const runText=Array.from(run.getElementsByTagNameNS(ns,'t')).map(n=>n.textContent||'').join('');
            const runArabic=firstStrongDirection(runText)==='ar';
            const rPr=ensure(run,'rPr');set(ensure(rPr,'rtl'),'val',runArabic?'1':'0');set(ensure(rPr,'cs'),'val',runArabic?'1':'0');
            const runLang=ensure(rPr,'lang');set(runLang,'val','en-US');set(runLang,'bidi',runArabic?'ar-EG':'en-US');
          }
          set(ensure(pPr,'spacing'),'after','100');set(ensure(pPr,'spacing'),'line','276');set(ensure(pPr,'spacing'),'lineRule','auto');
          const isTitle=/النموذج الاسترشادي|Guidance Template/.test(txt);
          const isHeading=/^(بيانات|Details of|اولا|أولا|ثانياً|First:|Second:|هام:|Note:)/.test(txt);
          for(const run of Array.from(p.getElementsByTagNameNS(ns,'r'))){
            const rPr=ensure(run,'rPr');
            set(ensure(rPr,'sz'),'val',isTitle?'28':isHeading?'23':'22');set(ensure(rPr,'szCs'),'val',isTitle?'30':isHeading?'24':'23');
            if(isTitle||isHeading){set(ensure(rPr,'b'),'val','1');set(ensure(rPr,'color'),'val','1B3A6B');}
          }
          if(isTitle||isHeading){const shd=ensure(pPr,'shd');set(shd,'val','clear');set(shd,'fill',isTitle?'EAF0F7':'F0F4F8');border(pPr,'bottom','C5D2E0','5');}
          reorderPPr(pPr);
        }
        // Tables: formal navy headers, subtle alternating rows, light grid and readable padding.
        for(const table of Array.from(documentXml.getElementsByTagNameNS(ns,'tbl'))){
          const rows=Array.from(table.getElementsByTagNameNS(ns,'tr'));if(rows.length<2)continue;
          const headerCells=Array.from(rows[0].getElementsByTagNameNS(ns,'tc'));
          if(headerCells.length<2)continue;
          const tblPr=elements(table,'tblPr')[0]||ensure(table,'tblPr');
          const borders=ensure(tblPr,'tblBorders');
          for(const edge of ['top','left','bottom','right','insideH','insideV']){let b=elements(borders,edge)[0];if(!b){b=documentXml.createElementNS(ns,'w:'+edge);borders.appendChild(b);}set(b,'val','single');set(b,'sz','4');set(b,'space','0');set(b,'color','C8D3DF');}
          for(let ri=0;ri<rows.length;ri++){
            const row=rows[ri];const trPr=elements(row,'trPr')[0]||ensure(row,'trPr');if(!elements(trPr,'cantSplit').length)trPr.appendChild(documentXml.createElementNS(ns,'w:cantSplit'));
            if(ri===0){let repeat=elements(trPr,'tblHeader')[0];if(!repeat){repeat=documentXml.createElementNS(ns,'w:tblHeader');trPr.appendChild(repeat);}set(repeat,'val','1');}
            for(const cell of Array.from(row.getElementsByTagNameNS(ns,'tc'))){
              const tcPr=elements(cell,'tcPr')[0]||ensure(cell,'tcPr');const mar=ensure(tcPr,'tcMar');
              for(const [side,v] of [['top','90'],['bottom','90'],['start','75'],['end','75']]){let m=elements(mar,side)[0];if(!m){m=documentXml.createElementNS(ns,'w:'+side);mar.appendChild(m);}set(m,'w',v);set(m,'type','dxa');}
              const valign=ensure(tcPr,'vAlign');set(valign,'val','center');
              if(ri===0){const shd=ensure(tcPr,'shd');set(shd,'val','clear');set(shd,'fill','1B3A6B');}
              else if(ri%2===0){const shd=ensure(tcPr,'shd');set(shd,'val','clear');set(shd,'fill','F5F8FB');}
              for(const p of Array.from(cell.getElementsByTagNameNS(ns,'p'))){
                const pPr=ensure(p,'pPr');set(ensure(pPr,'spacing'),'before','20');set(ensure(pPr,'spacing'),'after','35');set(ensure(pPr,'spacing'),'line','240');
                if(ri===0){if(!paired.has(p))set(ensure(pPr,'jc'),'val','center');for(const run of Array.from(p.getElementsByTagNameNS(ns,'r'))){const rPr=ensure(run,'rPr');set(ensure(rPr,'b'),'val','1');set(ensure(rPr,'color'),'val','FFFFFF');set(ensure(rPr,'sz'),'val','17');set(ensure(rPr,'szCs'),'val','18');}}
                else if(!paired.has(p)){const txt=getText(p).trim();const lang=languageOf(txt);set(ensure(pPr,'jc'),'val','start');set(ensure(pPr,'bidi'),'val',lang==='ar'?'1':'0');}
                reorderPPr(pPr);
              }
            }
          }
        }
        // Keep the original page size, but use balanced print margins on every service.
        for(const section of Array.from(documentXml.getElementsByTagNameNS(ns,'sectPr'))){
          const pgMar=ensure(section,'pgMar');set(pgMar,'top','780');set(pgMar,'bottom','780');set(pgMar,'left','900');set(pgMar,'right','900');set(pgMar,'header','360');set(pgMar,'footer','360');
        }
      };
      applyOfficialVisualDesign(doc,bilingual);
      // Final Word direction pass: run after every template, translation, table and style edit.
      // Each paragraph follows its own first strong language; Arabic is RTL/right-aligned,
      // English is LTR/left-aligned. Run direction is set independently for mixed text.
      {
        const ensureFinal=(parent,name)=>{let n=Array.from(parent.childNodes).find(x=>x.nodeType===1&&x.namespaceURI===W&&x.localName===name);if(!n){n=doc.createElementNS(W,'w:'+name);parent.appendChild(n);}return n;};
        const setFinal=(node,name,value)=>node.setAttributeNS(W,'w:'+name,String(value));
        for(const paragraph of Array.from(doc.getElementsByTagNameNS(W,'p'))){
          const textValue=getText(paragraph);if(!textValue.trim())continue;
          const paragraphLanguage=firstStrongDirection(textValue),rtl=paragraphLanguage==='ar';
          const pPr=ensureFinal(paragraph,'pPr');
          const jc=ensureFinal(pPr,'jc');
          const priorAlign=jc.getAttributeNS(W,'val')||jc.getAttribute('w:val');
          setFinal(jc,'val',priorAlign==='center'?'center':'start');
          setFinal(ensureFinal(pPr,'bidi'),'val',rtl?'1':'0');
          setFinal(ensureFinal(pPr,'mirrorIndents'),'val',rtl?'1':'0');
          const indent=ensureFinal(pPr,'ind');
          for(const attr of ['firstLine','hanging','firstLineChars','hangingChars','start','end'])indent.removeAttributeNS(W,attr);
          setFinal(indent,'left','0');setFinal(indent,'right','0');
          const pOrder=['pStyle','keepNext','keepLines','pageBreakBefore','framePr','widowControl','numPr','suppressLineNumbers','pBdr','shd','tabs','suppressAutoHyphens','kinsoku','wordWrap','overflowPunct','topLinePunct','autoSpaceDE','autoSpaceDN','bidi','adjustRightInd','snapToGrid','spacing','ind','contextualSpacing','mirrorIndents','suppressOverlap','jc','textDirection','textAlignment','outlineLvl','divId','cnfStyle','rPr','sectPr','pPrChange'];
          const pRank=new Map(pOrder.map((name,index)=>[name,index]));
          Array.from(pPr.childNodes).filter(n=>n.nodeType===1&&n.namespaceURI===W).sort((a,b)=>(pRank.get(a.localName)??999)-(pRank.get(b.localName)??999)).forEach(n=>pPr.appendChild(n));
          for(const run of Array.from(paragraph.getElementsByTagNameNS(W,'r'))){
            const runText=Array.from(run.getElementsByTagNameNS(W,'t')).map(n=>n.textContent||'').join('');
            if(!runText.trim())continue;
            // Keep every run in the paragraph in the paragraph's writing direction.
            // This prevents English company names, numbers or abbreviations embedded
            // in Arabic sentences from flipping the paragraph's bidi flow.
            const runRtl=rtl;
            const rPr=ensureFinal(run,'rPr');
            setFinal(ensureFinal(rPr,'rtl'),'val',runRtl?'1':'0');
            setFinal(ensureFinal(rPr,'cs'),'val',runRtl?'1':'0');
            const language=ensureFinal(rPr,'lang');
            setFinal(language,'val',runRtl?'ar-EG':'en-US');
            setFinal(language,'bidi',runRtl?'ar-EG':'en-US');
            setFinal(language,'eastAsia','en-US');
            const rOrder=['rStyle','rFonts','b','bCs','i','iCs','caps','smallCaps','strike','dstrike','outline','shadow','emboss','imprint','noProof','snapToGrid','vanish','webHidden','color','spacing','w','kern','position','sz','szCs','highlight','u','effect','bdr','shd','fitText','vertAlign','rtl','cs','em','lang','eastAsianLayout','specVanish','oMath','rPrChange'];
            const rRank=new Map(rOrder.map((name,index)=>[name,index]));
            Array.from(rPr.childNodes).filter(n=>n.nodeType===1&&n.namespaceURI===W).sort((a,b)=>(rRank.get(a.localName)??999)-(rRank.get(b.localName)??999)).forEach(n=>rPr.appendChild(n));
          }
        }
        for(const section of Array.from(doc.getElementsByTagNameNS(W,'sectPr'))){
          let bidi=Array.from(section.childNodes).find(n=>n.nodeType===1&&n.namespaceURI===W&&n.localName==='bidi');
          if(!bilingual){if(!bidi){bidi=doc.createElementNS(W,'w:bidi');section.appendChild(bidi);}setFinal(bidi,'val','1');}
          else if(bidi)bidi.parentNode.removeChild(bidi);
          const sectionOrder=['footnotePr','endnotePr','type','pgSz','pgMar','paperSrc','pgBorders','lnNumType','pgNumType','cols','formProt','vAlign','noEndnote','titlePg','textDirection','bidi','rtlGutter','docGrid','printerSettings','sectPrChange'];
          const sectionRank=new Map(sectionOrder.map((name,index)=>[name,index]));
          Array.from(section.childNodes).filter(n=>n.nodeType===1&&n.namespaceURI===W).sort((a,b)=>(sectionRank.get(a.localName)??999)-(sectionRank.get(b.localName)??999)).forEach(n=>section.appendChild(n));
        }
      }
      const out= new XMLSerializer().serializeToString(doc);
      zip.file('word/document.xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+out.replace(/^<\?xml[^>]*\?>/i,''));
      const blob=await zip.generateAsync({type:'blob',mimeType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
      const url=URL.createObjectURL(blob);
      const fileNames={
        visa:{ar:'نموذج-تأشيرة-دخول-مستثمر.docx',en:'Investor_Entry_Visa_Bilingual.docx'},
        grant:{ar:'نموذج-منح-إقامة-مستثمر.docx',en:'Investor_Residency_Grant_Bilingual.docx'},
        renew:{ar:'نموذج-تجديد-إقامة-مستثمر.docx',en:'Investor_Residency_Renewal_Bilingual.docx'},
        movement:{ar:'نموذج-شهادة-تحركات-مستثمر.docx',en:'Investor_Movement_Certificate_Bilingual.docx'}
      };
      const a=document.createElement('a');a.href=url;a.download=(fileNames[currentService]||fileNames.grant)[bilingual?'en':'ar'];document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);if(printAfterDownload)showMessage(lang()==='ar'?'تم تجهيز النموذج الأصلي':'Original form prepared',lang()==='ar'?'تم تنزيل نموذج Word الأصلي للخدمة مع تعبئة البيانات داخله. للحفاظ على تنسيقه الاسترشادي، افتح الملف في Microsoft Word ثم اختر ملف > طباعة > Microsoft Print to PDF (أو حفظ باسم PDF). أوقفنا طباعة الجدول العام حتى لا تحصل على نموذج مختلف عن النموذج الأصلي.':'The original service Word template has been filled and downloaded. To preserve its official layout, open it in Microsoft Word and choose File > Print > Microsoft Print to PDF (or Save As PDF). Generic table printing has been disabled to avoid producing a different-looking form.');
    }catch(err){console.error('Official Word template export failed',err);const localFile=location.protocol==='file:';showMessage(lang()==='ar'?'تعذر إنشاء النموذج الأصلي':'Unable to create original template',lang()==='ar'?(localFile?'المشروع مفتوح مباشرة من القرص (file://)، والمتصفح يمنع JavaScript من قراءة ملفات Word المحلية بهذه الطريقة. لا يلزم رفع المشروع إلى GitHub. شغّل الموقع عبر خادم محلي HTTP ثم افتح الصفحة من عنوان مثل http://localhost:8000/pages/investor-residency.html.':'تعذر قراءة ملف قالب Word الأصلي. تحقق من وجود مجلد assets/templates ومن فتح الموقع عبر HTTP، ثم أعد المحاولة. لم يتم إنشاء نموذج بديل.'):(localFile?'The project is opened directly from disk (file://), and the browser blocks JavaScript from reading local Word templates this way. GitHub is not required. Serve the project over local HTTP, then open a URL such as http://localhost:8000/pages/investor-residency.html.':'Could not read the original Word template. Check assets/templates and serve the site over HTTP, then retry. No substitute form was generated.'));}
  }
  $$('.residency-choice').forEach(btn=>btn.addEventListener('click',()=>{$$('.residency-choice').forEach(b=>b.classList.toggle('selected',b===btn));render(btn.dataset.resService);mount.scrollIntoView({behavior:'smooth',block:'start'});}));
  $$('.lang-btn,[data-lang]').forEach(btn=>btn.addEventListener('click',()=>{if(currentService){values=getCurrentValues();setTimeout(renderStep,0);}}));
  const toggle=$('#residencyEligibilityToggle');if(toggle)toggle.addEventListener('click',()=>{const box=$('#residencyEligibilityHelp');box.hidden=!box.hidden;toggle.setAttribute('aria-expanded',String(!box.hidden));});
  const weightToggle=$('#residencyWeightToggle'),weightSection=$('#weight');if(weightSection){weightSection.hidden=true;if(weightToggle)weightToggle.addEventListener('click',()=>{weightSection.hidden=!weightSection.hidden;weightToggle.setAttribute('aria-expanded',String(!weightSection.hidden));if(!weightSection.hidden)weightSection.scrollIntoView({behavior:'smooth',block:'start'});});}
  $$('.page-main > .service-section').forEach(sec=>{if(sec.id!=='weight')sec.hidden=true;});const subnav=$('.service-subnav');if(subnav)subnav.hidden=true;const initial=location.hash.replace('#','');if(['visa','grant','renew','movement'].includes(initial)){const b=$(`[data-res-service="${initial}"]`);if(b)b.click();}
})();

/* ── Light bridge to GOVESER Advisor (optional enhancement) ── */
(function(){
  if(!window.GOVESER_Advisor) return;
  // When a field is marked missing via validation, also surface advisor alert if available
  // Safer: observe focus + known validation patterns via existing events
  document.addEventListener('click', function(e){
    const btn = e.target.closest && e.target.closest('#rfModalClose');
    if(btn && window.GOVESER_Advisor){
      // After user dismisses a modal, if a field was targeted we already focus it;
      // advisor focus handler will pick it up.
    }
  });
})();
