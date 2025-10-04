import { ChatMessage, Sender } from '../types';

// The JSON data is now embedded directly in the service to avoid fetch/import issues.
const faqs: Record<string, { q: string; a: string }[]> = {
  "en": [
    { "q": "What crops grow best with irrigation in the Middle East?", "a": "Wheat, maize, barley, vegetables, and dates" },
    { "q": "Is drip irrigation effective in deserts?", "a": "Yes, it saves water and increases crop yield" },
    { "q": "How often should I water my crops?", "a": "Usually once or twice a week, check soil moisture" },
    { "q": "Can solar energy power irrigation pumps?", "a": "Yes, solar panels are common and cost-saving" },
    { "q": "How do I check for soil salinity?", "a": "Use an EC meter or get the soil tested" },
    { "q": "Are government subsidies available for irrigation?", "a": "Many countries offer support—ask your local authority" },
    { "q": "What is fertigation?", "a": "It means applying fertilizer through the irrigation system" },
    { "q": "What’s the cheapest way to irrigate a small farm?", "a": "Use hose, timers, and manual drip lines" },
    { "q": "Should I reuse wastewater for irrigation?", "a": "Only if it’s treated, otherwise unsafe" },
    { "q": "How do I prevent crop diseases from irrigation?", "a": "Keep pipes clean, avoid water on leaves" },
    { "q": "Do greenhouses need frequent irrigation?", "a": "Yes, but use sensors to avoid overwatering" },
    { "q": "What is smart irrigation?", "a": "Systems that use sensors and data to control watering" },
    { "q": "How much water is too much?", "a": "If water pools or soil stays wet for days, it’s too much" },
    { "q": "What crops suffer most from salt in water?", "a": "Leafy greens, tomatoes, and beans" },
    { "q": "Can soil moisture sensors save money?", "a": "Yes, they prevent waste and reduce bills" },
    { "q": "Is rainwater safe for irrigation?", "a": "Yes, it’s usually the best source" },
    { "q": "How much does a simple drip system cost?", "a": "About 100–400 QAR for a small plot" },
    { "q": "What’s the biggest risk with irrigation in Qatar?", "a": "Water scarcity and high summer evaporation" },
    { "q": "How do I avoid salty groundwater?", "a": "Test water and use desalination or blending" },
    { "q": "What crops use less water?", "a": "Onions, millet, barley, many herbs" },
    { "q": "Can I get profit from irrigated farming?", "a": "Yes, with efficient systems and good crop planning" },
    { "q": "Will irrigation increase my farm’s value?", "a": "Yes, productive land is worth more" },
    { "q": "What is precision irrigation?", "a": "Watering only based on exact crop need" },
    { "q": "Can I automate irrigation?", "a": "Yes, use timers, sensors, and controllers" },
    { "q": "How do I maintain my irrigation system?", "a": "Clean filters, check pipes, fix leaks monthly" },
    { "q": "What crops grow all year with irrigation?", "a": "Tomatoes, peppers, greens, cucumbers, herbs" },
    { "q": "Will drought affect my irrigated crops?", "a": "Less, but always monitor water reserves" },
    { "q": "How deep should drip lines be?", "a": "Usually 5–10 cm below soil surface" },
    { "q": "What’s the best time to irrigate?", "a": "Early morning or late evening" },
    { "q": "Can irrigation water be too cold or hot?", "a": "Extreme temperatures can harm roots" },
    { "q": "Can humidity affect irrigation needs?", "a": "Yes, high humidity means less irrigation needed" },
    { "q": "What is a pivot irrigation system?", "a": "A moving system that waters big fields in circles" },
    { "q": "Can I use mobile apps to manage irrigation?", "a": "Yes, many apps control smart systems" },
    { "q": "Does irrigation increase greenhouse gas emissions?", "a": "Not much, unless pumps use fossil fuels" },
    { "q": "Can I use brackish water for irrigation?", "a": "Sometimes, for salt-tolerant crops only" },
    { "q": "How do I design my irrigation plan?", "a": "Calculate crop area, water needs, and soil type" },
    { "q": "What do flow meters do in irrigation?", "a": "They measure how much water is delivered" },
    { "q": "Does wind affect irrigation?", "a": "Yes, it can cause water loss through evaporation" },
    { "q": "What’s the first step to starting irrigation?", "a": "Test soil and water, then plan the system" },
    { "q": "How much does irrigation increase yield?", "a": "Can double or triple harvests in arid zones" },
    { "q": "Can I make irrigation profitable with small land?", "a": "Yes, choose high-value crops and efficient systems" },
    { "q": "Will irrigated farming help food security?", "a": "Yes, it ensures more stable production" },
    { "q": "What fertilizers work best with irrigation?", "a": "Water-soluble fertilizers are ideal" },
    { "q": "How do I know a field is over-irrigated?", "a": "Soil feels spongy, plants may yellow" },
    { "q": "Can irrigation be used for tree crops?", "a": "Yes, date palms, citrus, olives benefit" },
    { "q": "How do I reduce irrigation costs?", "a": "Monitor leaks, use timers, optimize schedule" },
    { "q": "Can I export irrigated crops abroad?", "a": "Yes, especially vegetables and dates" },
    { "q": "Do I need a license for drilling irrigation wells?", "a": "Usually yes, ask local water authority" },
    { "q": "How do I measure irrigation efficiency?", "a": "Compare water use to crop yield and losses" },
    { "q": "What’s the role of mulch in irrigation?", "a": "Mulch keeps soil moist and reduces need for watering" },
    { "q": "Can I grow organic crops with irrigation?", "a": "Yes, just use organic fertilizers in your system" },
    { "q": "How does drip compare to flood irrigation?", "a": "Drip is more efficient, saves water and costs" },
    { "q": "Can drones help with irrigation?", "a": "Yes, drones monitor crop health and water needs" }
  ],
  "ar": [
    { "q": "ما هي أفضل المحاصيل مع الري في الشرق الأوسط؟", "a": "القمح والذرة والشعير والخضار والتمور" },
    { "q": "هل الري بالتنقيط فعال في الصحراء؟", "a": "نعم، يوفر الماء ويزيد الإنتاج" },
    { "q": "كم مرة أسقي المحاصيل؟", "a": "مرة أو مرتين أسبوعيًا حسب رطوبة الأرض" },
    { "q": "هل الطاقة الشمسية تشغل مضخات الري؟", "a": "نعم، الألواح الشمسية منتشرة وتوفر المال" },
    { "q": "كيف أعرف ملوحة التربة؟", "a": "استخدم جهاز قياس أو اختبر التربة" },
    { "q": "هل يوجد دعم حكومي للري؟", "a": "كثير من الدول تقدم دعم، اسأل الجهات المحلية" },
    { "q": "ما هو الفرتيجاشن؟", "a": "إعطاء السماد عن طريق نظام الري" },
    { "q": "ما أرخص طريقة لري مزرعة صغيرة؟", "a": "استخدم خرطوم ومؤقتات وشبكة تنقيط بسيطة" },
    { "q": "هل أستعمل مياه الصرف لري المحاصيل؟", "a": "فقط إذا كانت معالجة وإلا فهي غير آمنة" },
    { "q": "كيف أمنع أمراض المحاصيل بسبب الري؟", "a": "نظف الأنابيب ولاتسقي الأوراق مباشرة" },
    { "q": "هل البيوت المحمية تحتاج ري مستمر؟", "a": "نعم، لكن استخدم حساسات لتجنب السقي الزائد" },
    { "q": "ما هو الري الذكي؟", "a": "أنظمة حساسات وبيانات تتحكم بالسقي" },
    { "q": "كمية الماء الزائدة؟", "a": "إذا تجمعت المياه أو بقيت الأرض رطبة أيام، زائدة" },
    { "q": "ما المحاصيل المتضررة من ملوحة الماء؟", "a": "الخضار الورقية والطماطم والفاصوليا" },
    { "q": "هل حساسات رطوبة التربة توفر المال؟", "a": "نعم، تمنع الهدر وتقلل تكلفة الماء" },
    { "q": "هل مياه الأمطار آمنة للري؟", "a": "نعم، غالبًا هي أفضل مصدر" },
    { "q": "كم يكلف نظام تقطير بسيط؟", "a": "حوالي 100-400 ريال لقطعة أرض صغيرة" },
    { "q": "ما أكبر المخاطر في ري قطر؟", "a": "نقص الماء وتبخره الشديد بالصيف" },
    { "q": "كيف أتجنب المياه الجوفية المالحة؟", "a": "اختبر المياه واستخدم تحلية أو خلطها" },
    { "q": "ما هي المحاصيل قليلة الاستهلاك للماء؟", "a": "البصل والدخن والشعير وبعض الأعشاب" },
    { "q": "هل الزراعة المروية مربحة؟", "a": "نعم، إذا تم التخطيط واستخدام ري فعال" },
    { "q": "هل يزيد الري قيمة المزرعة؟", "a": "نعم، الأرض المنتجة أغلى" },
    { "q": "ما هو الري الدقيق؟", "a": "السقي حسب حاجة النبات فقط" },
    { "q": "هل أستطيع أتمتة الري؟", "a": "نعم، عبر مؤقتات وحساسات" },
    { "q": "كيف أحافظ على نظام الري؟", "a": "نظف الفلاتر وافحص الأنابيب وأصلح التسربات شهريًا" },
    { "q": "ما المحاصيل التي تزرع طوال العام مع الري؟", "a": "الطماطم والفلفل والخضار والخيار والأعشاب" },
    { "q": "هل يؤثر الجفاف على المحاصيل المروية؟", "a": "أقل، لكن راقب احتياطي الماء دائماً" },
    { "q": "ما عمق خطوط التنقيط المناسبة؟", "a": "5-10 سم تحت سطح التربة" },
    { "q": "ما أفضل وقت للري؟", "a": "الصباح الباكر أو المساء" },
    { "q": "هل درجة حرارة ماء الري تضر النباتات؟", "a": "الحرارة الشديدة للماء تضر الجذور" },
    { "q": "هل الرطوبة تؤثر على حاجة الري؟", "a": "نعم، الرطوبة العالية تقلل الحاجة للماء" },
    { "q": "ما هو نظام الري المحوري؟", "a": "نظام متحرك يسقي الحقول بشكل دائري" },
    { "q": "هل توجد تطبيقات للتحكم في الري؟", "a": "نعم، كثير من التطبيقات تدير الأنظمة الذكية" },
    { "q": "هل يزيد الري من الغازات المسببة للاحتباس الحراري؟", "a": "لا كثير، إلا إذا كانت المضخات تستخدم طاقة غير نظيفة" },
    { "q": "هل أستطيع استخدام مياه مالحة قليلاً للري؟", "a": "أحيانًا، فقط للمحاصيل المقاومة للملح" },
    { "q": "كيف أصمم خطة الري؟", "a": "احسب مساحة المحصول واحتياج الماء ونوع التربة" },
    { "q": "ما هي وظيفة عداد التدفق في الري؟", "a": "يقيس كمية الماء التي تعطى للنبات" },
    { "q": "هل يؤثر الرياح على الري؟", "a": "نعم، تسبب فقدان الماء بالتبخر" },
    { "q": "ما أول خطوة للبدء في الري؟", "a": "اختبر التربة والماء ثم خطط النظام" },
    { "q": "كم يزيد الري من الإنتاجية؟", "a": "يضاعف أو يثلث الحصاد في المناطق الجافة" },
    { "q": "هل يمكن أن يكون الري مربحاً للأراضي الصغيرة؟", "a": "نعم، اختر محاصيل غالية وأنظمة فعالة" },
    { "q": "هل الزراعة المروية تفيد الأمن الغذائي؟", "a": "نعم، تؤمن إنتاج مستقر أكثر" },
    { "q": "ما هي أفضل الأسمدة مع الري؟", "a": "الأسمدة الذائبة في الماء هي الأفضل" },
    { "q": "كيف أعرف أن الحقل معرض لري زائد؟", "a": "الأرض إسفنجية والنباتات قد تصفر" },
    { "q": "هل يمكن استخدام الري للمحاصيل الشجرية؟", "a": "نعم، النخيل والحمضيات والزيتون تستفيد" },
    { "q": "كيف أوفر في تكلفة الري؟", "a": "راقب التسربات، واستخدم مؤقتات، وجدول السقي بدقة" },
    { "q": "هل أستطيع تصدير المحاصيل المروية؟", "a": "نعم، خاصة الخضار والتمور" },
    { "q": "هل أحتاج رخصة لحفر آبار الري؟", "a": "غالبًا نعم، اسأل الجهة المسؤولة" },
    { "q": "كيف أقيس كفاءة الري؟", "a": "قارن استخدام الماء بالإنتاج والفواقد" },
    { "q": "ما دور التغطية الأرضية في الري؟", "a": "تحافظ على رطوبة التربة وتقلل الحاجة للماء" },
    { "q": "هل أستطيع زراعة محاصيل عضوية مع الري؟", "a": "نعم، فقط استخدم أسمدة عضوية في النظام" },
    { "q": "كيف يقارن الري بالتنقيط مع الغمر؟", "a": "التنقيط أوفر وأكثر كفاءة ويوفر الماء والتكاليف" },
    { "q": "هل الطائرات بدون طيار تساعد في الري؟", "a": "نعم، تراقب صحة المحاصيل واحتياجات الماء" }
  ]
};

// This function is now synchronous.
export const getRuleBasedResponse = (prompt: string, language: string): ChatMessage | null => {
    const userPrompt = prompt.trim().toLowerCase().replace(/[?.,!]/g, '');
    let matchedIndex = -1;

    // Check English questions first as a base
    matchedIndex = faqs.en.findIndex(faq => faq.q.trim().toLowerCase().replace(/[?.,!]/g, '') === userPrompt);

    // If not found in English, check the selected language (e.g., Arabic)
    if (matchedIndex === -1) {
        const faqsForLang = faqs[language];
        if (faqsForLang) {
            matchedIndex = faqsForLang.findIndex(faq => faq.q.trim().toLowerCase().replace(/[?.,!]/g, '') === userPrompt);
        }
    }

    // If a match was found in either language list (assuming they are aligned)
    if (matchedIndex !== -1) {
        const targetLangFaqs = faqs[language] || faqs['en'];
        const answer = targetLangFaqs[matchedIndex]?.a;
        
        if (answer) {
             return {
                id: Date.now().toString(),
                sender: Sender.AI,
                content: [{ type: 'text', value: answer }],
            };
        }
    }

    return null;
};