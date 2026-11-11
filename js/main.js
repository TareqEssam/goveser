/* ============================================================
   GOVESER — Main JavaScript
   v1.0
   ============================================================ */

'use strict';

/* ─── Translation Data ─── */
const translations = {
  ar: {
    // Utility Bar
    'util.portal':    'دليل تقديم الطلبات للإدارة',
    'util.phone':     'اتصل بنا: 16035',
    'util.hours':     'أوقات العمل: الأحد – الخميس، 9 ص – 3 م',

    // Header
    'logo.name':      'الإدارة العامة للخدمات الحكومية',
    'logo.name.en':   'General Administration of Government Services',
    'logo.sub':       'مركز خدمات المستثمرين',
    'nav.home':       'الرئيسية',
    'nav.services':   'الخدمات',
    'nav.investor':   'إقامة مستثمر',
    'nav.work':       'تراخيص العمل',
    'nav.car':        'سيارة مستثمر',
    'nav.dependents': 'التابعات (عمالة منزلية)',
    'nav.partner':    'ترخيص غير مساهم',
    'nav.law159':     'ترخيص 159',
    'nav.offices':    'مكاتب التمثيل',
    'nav.branches':   'فروع الشركات الأجنبية',
    'nav.assistant':  'مساعد الإدارة',
    'nav.contact':    'تواصل معنا',
    'nav.inquiry':    'استعلام عن طلباتي',
    'nav.login':      'تسجيل الدخول',

    // Hero
    'hero.badge':     'الإدارة العامة للخدمات الحكومية',
    'hero.title1':    'ضوابط وإجراءات',
    'hero.title2':    'خدمات الإدارة',
    'hero.desc':      'تُعد إدارة الخدمات الحكومية بمركز خدمات المستثمرين الإدارة المعنية بخدمة المستثمرين الأجانب في مصر من حيث إقامات المستثمرين، وتراخيص العمل للعمال والتابعين الأجانب، وسيارات المستثمرين الأجانب بنظام الإفراج المؤقت، وفتح فروع الشركات الأجنبية، وقيد مكاتب التمثيل للشركات الأجنبية، واستخراج تراخيص عمل المستثمرين الأجانب بشركات قانون 159 لسنة 1981.',
    'hero.btn.services': 'تعرف على خدمات الإدارة',
    'hero.btn.contact':  'تواصل معنا',
    'hero.stat1.num': '+٥٠٠٠',
    'hero.stat1.lbl': 'مستثمر نخدمه',
    'hero.stat2.num': '٨',
    'hero.stat2.lbl': 'خدمات متكاملة',
    'hero.stat3.num': '١٥',
    'hero.stat3.lbl': 'دولة ممثَّلة',
    'hero.video.caption': 'تعرف على خدمات الإدارة',
    'hero.orient': 'دليل إلكتروني لخدمات الإدارة لمعرفة كافة الخدمات والضوابط والإجراءات قبل التقديم.',
    'hero.chip.residency': 'إقامة / تأشيرة مستثمر (قانون الاستثمار)',
    'hero.chip.work': 'ترخيص عمل (استثمار أو 159)',
    'hero.chip.foreign': 'فرع شركة أجنبية / مكتب تمثيل',

    // Services Section
    'sec.services.eyebrow': 'اختصاص الإدارة',
    'sec.services.title':   'خدمات الإدارة العامة للخدمات الحكومية',
    'sec.services.desc':    'إذا كانت شركتك خاضعة للهيئة العامة للاستثمار أو تحتاج قيد مكتب تمثيل أو فرع شركة أجنبية، فهذه الإدارة هي المختصة. تعرّف على الضوابط والإجراءات قبل التقديم.',
    'tab.law72':   'قانون الاستثمار 72/2017',
    'tab.law159':  'قانون الشركات 159/1981',
    'tab.foreign': 'الشركات الأجنبية',

    // Service Cards — Law 72
    'card.investor.cat':   'إقامة',
    'card.investor.title': 'إقامة المستثمر',
    'card.investor.desc':  'إقامة خاصة للمستثمرين الأجانب في مصر مرتبطة بالشركة المؤسسة وفق قانون الاستثمار.',
    'card.investor.tag1':  'سريعة',
    'card.investor.tag2':  'متجددة',
    'card.investor.link':  'التفاصيل الكاملة',

    'card.work.cat':       'عمل',
    'card.work.title':     'تراخيص العمل للعمال الأجانب',
    'card.work.desc':      'تصاريح العمل للعمال والموظفين الأجانب العاملين في شركات قانون الاستثمار.',
    'card.work.tag1':      'للموظفين',
    'card.work.tag2':      'سنوية',
    'card.work.link':      'التفاصيل الكاملة',

    'card.partner.cat':    'ترخيص',
    'card.partner.title':  'ترخيص غير مساهم أو شريك',
    'card.partner.desc':   'ترخيص عمل مخصص للأجانب غير المساهمين أو الشركاء في شركات الاستثمار.',
    'card.partner.tag1':   'غير مساهم',
    'card.partner.tag2':   'شريك',
    'card.partner.link':   'التفاصيل الكاملة',

    'card.car.cat':        'مركبات',
    'card.car.title':      'سيارة المستثمر',
    'card.car.desc':       'السماح للمستثمر الأجنبي بإدخال سيارته الخاصة بنظام الإفراج المؤقت.',
    'card.car.tag1':       'إفراج مؤقت',
    'card.car.tag2':       'معفاة من الجمارك',
    'card.car.link':       'التفاصيل الكاملة',

    'card.dep.cat':        'عمالة منزلية',
    'card.dep.title':      'إقامة التابعات (العمالة المنزلية)',
    'card.dep.desc':       'إقامة التابعات من العمالة المنزلية التي تعمل في منزل المستثمر الأجنبي — وليست أفراد أسرته.',
    'card.dep.tag1':       'عمالة منزلية',
    'card.dep.tag2':       'منزل المستثمر',
    'card.dep.link':       'التفاصيل الكاملة',

    // Law 159
    'card.l159.cat':       'ترخيص',
    'card.l159.title':     'ترخيص العمل — قانون 159',
    'card.l159.desc':      'ترخيص عمل للمستثمرين الأجانب في الشركات المؤسسة وفق قانون الشركات رقم ١٥٩ لسنة ١٩٨١.',
    'card.l159.tag1':      'قانون 159',
    'card.l159.tag2':      'مستثمر',
    'card.l159.link':      'التفاصيل الكاملة',

    // Foreign Companies
    'card.branch.cat':     'شركات أجنبية',
    'card.branch.title':   'فروع الشركات الأجنبية',
    'card.branch.desc':    'تسجيل وفتح فروع للشركات الأجنبية العاملة في مصر وفق الإجراءات القانونية المعتمدة.',
    'card.branch.tag1':    'فروع',
    'card.branch.tag2':    'تسجيل',
    'card.branch.link':    'التفاصيل الكاملة',

    'card.office.cat':     'مكاتب',
    'card.office.title':   'مكاتب التمثيل',
    'card.office.desc':    'قيد وتسجيل مكاتب التمثيل للشركات الأجنبية الراغبة في تأسيس حضور في مصر.',
    'card.office.tag1':    'تمثيل',
    'card.office.tag2':    'قيد',
    'card.office.link':    'التفاصيل الكاملة',

    'card.more': 'اعرف المزيد',

    // Laws Section
    'sec.laws.eyebrow': 'مقارنة القوانين',
    'sec.laws.title':   'ما الفرق بين القانونين؟',
    'sec.laws.desc':    'قبل تأسيس شركتك، تعرّف على الاختلافات الجوهرية بين قانوني الاستثمار',

    'law72.num':   '72 / 2017',
    'law72.title': 'قانون الاستثمار',
    'law72.sub':   'الشركات الخاضعة لهيئة الاستثمار',
    'law72.f1': 'إقامة مستثمر متجددة',
    'law72.f2': 'تراخيص عمل للعمال الأجانب',
    'law72.f3': 'سيارة مستثمر بالإفراج المؤقت',
    'law72.f4': 'إقامة التابعات (عمالة منزلية لدى المستثمر)',
    'law72.f5': 'خدمات مركز خدمات المستثمرين',

    'law159.num':   '159 / 1981',
    'law159.title': 'قانون الشركات',
    'law159.sub':   'الشركات العادية (غير خاضعة للهيئة)',
    'law159.f1': 'ترخيص عمل للمستثمر فقط',
    'law159.f2': 'لا يشمل تراخيص عمل للعمال',
    'law159.f3': 'لا يشمل سيارة مستثمر',
    'law159.f4': 'لا يشمل إقامة التابعات (عمالة منزلية)',
    'law159.f5': 'إجراءات من خلال الجهات العادية',

    // CTA
    'cta.title': 'هل تحتاج مساعدة في اختيار الخدمة المناسبة؟',
    'cta.desc':  'فريقنا المتخصص جاهز للإجابة على جميع استفساراتك ومساعدتك في اختيار الخدمة الأنسب لاحتياجات شركتك.',
    'cta.btn.assistant': 'مساعد الإدارة الذكي',
    'cta.btn.contact':   'تواصل مباشرة',

    // Footer
    'footer.desc': 'الإدارة المعنية بتوضيح خدمات الإدارة العامة للخدمات الحكومية وإجراءاتها ومستنداتها للمستثمرين.',
    'footer.links': 'روابط سريعة',
    'footer.contact.title': 'تواصل معنا',
    'footer.phone': 'خط ساخن: 16035',
    'footer.location': 'مركز خدمات المستثمرين، القاهرة',
    'footer.rights': '© 2025 الإدارة العامة للخدمات الحكومية — جميع الحقوق محفوظة',
  },

  en: {
    // Utility Bar
    'util.portal':    'Guide to submitting requests to the Administration',
    'util.phone':     'Call us: 16035',
    'util.hours':     'Working hours: Sun – Thu, 9 AM – 3 PM',

    // Header
    'logo.name':      'General Administration of Government Services',
    'logo.name.en':   'General Administration of Government Services',
    'logo.sub':       'Investor Services Center',
    'nav.home':       'Home',
    'nav.services':   'Services',
    'nav.investor':   'Investor Residency',
    'nav.work':       'Work Permits',
    'nav.car':        'Investor Car',
    'nav.dependents': 'Domestic household staff',
    'nav.partner':    'Non-Shareholder Permit',
    'nav.law159':     'Law 159 Permit',
    'nav.offices':    'Representative Offices',
    'nav.branches':   'Foreign Company Branches',
    'nav.assistant':  'AI Assistant',
    'nav.contact':    'Contact Us',
    'nav.inquiry':    'Track My Request',
    'nav.login':      'Login',

    // Hero
    'hero.badge':     'General Administration of Government Services',
    'hero.title1':    'Rules and procedures',
    'hero.title2':    'of Administration services',
    'hero.desc':      'The Government Services Administration at the Investor Services Center is the authority responsible for serving foreign investors in Egypt regarding investor residencies, work permits for foreign employees and dependents, investor vehicles under temporary release, opening foreign company branches, registering foreign company representative offices, and issuing work permits for foreign investors in companies under Law No. 159 of 1981.',
    'hero.btn.services': 'Explore Administration services',
    'hero.btn.contact':  'Contact Us',
    'hero.stat1.num': '+5,000',
    'hero.stat1.lbl': 'Investors Served',
    'hero.stat2.num': '8',
    'hero.stat2.lbl': 'Integrated Services',
    'hero.stat3.num': '15',
    'hero.stat3.lbl': 'Countries Represented',
    'hero.video.caption': 'Learn about the Administration’s services',
    'hero.orient': 'An electronic guide to the Administration’s services — to learn all services, rules, and procedures before applying.',
    'hero.chip.residency': 'Investor residency / visa (Investment Law)',
    'hero.chip.work': 'Work permit (Investment Law or 159)',
    'hero.chip.foreign': 'Foreign branch / representative office',

    // Services Section
    'sec.services.eyebrow': 'Administration mandate',
    'sec.services.title':   'Services of the General Administration of Government Services',
    'sec.services.desc':    'If your company falls under the General Authority for Investment, or you need to register a representative office or a foreign company branch, this Administration is the competent body. Review the rules and procedures before applying.',
    'tab.law72':   'Investment Law 72/2017',
    'tab.law159':  'Companies Law 159/1981',
    'tab.foreign': 'Foreign Companies',

    // Service Cards — Law 72
    'card.investor.cat':   'Residency',
    'card.investor.title': 'Investor Residency',
    'card.investor.desc':  'Special residency for foreign investors in Egypt linked to their company registered under the Investment Law.',
    'card.investor.tag1':  'Fast',
    'card.investor.tag2':  'Renewable',
    'card.investor.link':  'Full Details',

    'card.work.cat':       'Work',
    'card.work.title':     'Work Permits for Foreign Workers',
    'card.work.desc':      'Work authorization for foreign employees and workers in companies registered under the Investment Law.',
    'card.work.tag1':      'Employees',
    'card.work.tag2':      'Annual',
    'card.work.link':      'Full Details',

    'card.partner.cat':    'Permit',
    'card.partner.title':  'Non-Shareholder / Partner Permit',
    'card.partner.desc':   'Work permit for foreigners who are non-shareholders or non-partners in investment companies.',
    'card.partner.tag1':   'Non-Shareholder',
    'card.partner.tag2':   'Partner',
    'card.partner.link':   'Full Details',

    'card.car.cat':        'Vehicles',
    'card.car.title':      'Investor Vehicle',
    'card.car.desc':       'Allows foreign investors to import their personal vehicle on a temporary admission basis.',
    'card.car.tag1':       'Temp Admission',
    'card.car.tag2':       'Customs Exempt',
    'card.car.link':       'Full Details',

    'card.dep.cat':        'Domestic staff',
    'card.dep.title':      'Domestic household staff residency',
    'card.dep.desc':       'Residency for domestic household workers employed in the foreign investor’s home — not family members.',
    'card.dep.tag1':       'Domestic staff',
    'card.dep.tag2':       'Investor’s home',
    'card.dep.link':       'Full Details',

    // Law 159
    'card.l159.cat':       'Permit',
    'card.l159.title':     'Work Permit — Law 159',
    'card.l159.desc':      'Work permit for foreign investors in companies established under Companies Law No. 159 of 1981.',
    'card.l159.tag1':      'Law 159',
    'card.l159.tag2':      'Investor',
    'card.l159.link':      'Full Details',

    // Foreign Companies
    'card.branch.cat':     'Foreign Companies',
    'card.branch.title':   'Foreign Company Branches',
    'card.branch.desc':    'Registration and opening of branches for foreign companies operating in Egypt under approved legal procedures.',
    'card.branch.tag1':    'Branches',
    'card.branch.tag2':    'Registration',
    'card.branch.link':    'Full Details',

    'card.office.cat':     'Offices',
    'card.office.title':   'Representative Offices',
    'card.office.desc':    'Registration of representative offices for foreign companies seeking to establish a presence in Egypt.',
    'card.office.tag1':    'Representative',
    'card.office.tag2':    'Registration',
    'card.office.link':    'Full Details',

    'card.more': 'Learn More',

    // Laws Section
    'sec.laws.eyebrow': 'Law Comparison',
    'sec.laws.title':   'What is the Difference Between the Two Laws?',
    'sec.laws.desc':    'Before establishing your company, understand the key differences between the two investment laws',

    'law72.num':   '72 / 2017',
    'law72.title': 'Investment Law',
    'law72.sub':   'Companies subject to the Investment Law',
    'law72.f1': 'Renewable investor residency',
    'law72.f2': 'Work permits for foreign workers',
    'law72.f3': 'Investor car on temporary admission',
    'law72.f4': 'Domestic household staff residency (investor’s home)',
    'law72.f5': 'Full Investor Services Center benefits',

    'law159.num':   '159 / 1981',
    'law159.title': 'Companies Law',
    'law159.sub':   'Companies subject to Law No. 159 of 1981',
    'law159.f1': 'Work permit for investor only',
    'law159.f2': 'No work permits for employees',
    'law159.f3': 'No investor vehicle',
    'law159.f4': 'No domestic household staff residency',
    'law159.f5': 'Procedures through regular authorities',

    // CTA
    'cta.title': 'Need Help Choosing the Right Service?',
    'cta.desc':  'Our specialized team is ready to answer all your inquiries and help you select the most appropriate service for your company\'s needs.',
    'cta.btn.assistant': 'AI Administration Assistant',
    'cta.btn.contact':   'Contact Directly',

    // Footer
    'footer.desc': 'The administration that explains government service procedures and required documents to investors.',
    'footer.links': 'Quick Links',
    'footer.contact.title': 'Contact Us',
    'footer.phone': 'Hotline: 16035',
    'footer.location': 'Investor Services Center, Cairo',
    'footer.rights': '© 2025 General Administration of Government Services — All rights reserved',
  }
};

/* ─── Language Manager ─── */
const Lang = {
  current: 'ar',

  init() {
    const saved = localStorage.getItem('goveser-lang') || 'ar';
    this.set(saved, false);
  },

  set(lang, animate = true) {
    this.current = lang;
    localStorage.setItem('goveser-lang', lang);

    document.documentElement.lang = lang;
    document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('lang-en', lang === 'en');

    // Update lang buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
      if (btn.dataset.lang === 'ar') btn.textContent = lang === 'en' ? 'AR' : 'عربي';
      if (btn.dataset.lang === 'en') btn.textContent = 'EN';
    });

    // Translate all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const text = translations[lang][key];
      if (text !== undefined) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          el.textContent = text;
        }
      }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      const text = translations[lang][key];
      if (text) el.placeholder = text;
    });

    // Translate aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.dataset.i18nAria;
      const text = translations[lang][key];
      if (text) el.setAttribute('aria-label', text);
    });

    if (animate) {
      document.body.style.transition = 'opacity 0.2s';
      document.body.style.opacity = '0.8';
      setTimeout(() => { document.body.style.opacity = '1'; }, 200);
    }
  },

  toggle() {
    this.set(this.current === 'ar' ? 'en' : 'ar');
  }
};

/* ─── Navigation ─── */
const Nav = {
  init() {
    // Mobile menu
    const menuBtn    = document.getElementById('menuBtn');
    const mobileNav  = document.getElementById('mobileNav');
    const mobileClose = document.getElementById('mobileClose');

    if (menuBtn && mobileNav) {
      menuBtn.addEventListener('click', () => {
        mobileNav.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    }
    if (mobileClose && mobileNav) {
      mobileClose.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    // Close mobile nav on outside click
    if (mobileNav) {
      mobileNav.addEventListener('click', (e) => {
        if (e.target === mobileNav) {
          mobileNav.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    }

    // Close mobile nav on link click
    document.querySelectorAll('.mobile-nav a').forEach(link => {
      link.addEventListener('click', () => {
        if (mobileNav) mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Sticky header shadow
    const header = document.querySelector('.site-header');
    if (header) {
      window.addEventListener('scroll', () => {
        header.style.boxShadow = window.scrollY > 20
          ? '0 4px 20px rgba(27,58,107,0.15)'
          : '0 2px 8px rgba(27,58,107,0.08)';
      }, { passive: true });
    }
  }
};

/* ─── Tabs ─── */
const Tabs = {
  init() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const content = document.getElementById(target);
        if (content) {
          content.classList.add('active');
          // Animate cards
          content.querySelectorAll('.service-card').forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(16px)';
            setTimeout(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, i * 80);
          });
        }
      });
    });
  }
};

/* ─── Scroll to Top ─── */
const ScrollTop = {
  init() {
    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};

/* ─── Intersection Observer — Fade Up ─── */
const Animations = {
  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.observe-me').forEach(el => observer.observe(el));
  }
};

/* ─── Init ─── */
document.addEventListener('DOMContentLoaded', () => {
  Lang.init();
  Nav.init();
  Tabs.init();
  ScrollTop.init();
  Animations.init();

  // Lang toggle buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => Lang.set(btn.dataset.lang));
  });
});

document.addEventListener('click',function(e){
  var a=e.target.closest('[data-tab-jump]');
  if(!a)return;
  var id=a.getAttribute('data-tab-jump');
  var btn=document.querySelector('.tab-btn[data-tab="'+id+'"]');
  if(btn){btn.click(); var sec=document.getElementById('services'); if(sec)sec.scrollIntoView({behavior:'smooth'});}
});
