const locale = values => ({
  'strategyV2.factorResearch.eligibleUniverses': values.eligibleUniverses,
  'strategyV2.factorResearch.universe': values.universe,
  'strategyV2.factorResearch.universeTitle': values.universeTitle,
  'strategyV2.factorResearch.universePlaceholder': values.universePlaceholder,
  'strategyV2.factorResearch.universeMode': values.universeMode,
  'strategyV2.factorResearch.universeModeDesc': values.universeModeDesc,
  'strategyV2.factorResearch.universeCheck': values.universeCheck,
  'strategyV2.factorResearch.frequency': values.frequency,
  'strategyV2.factorResearch.selectUniverseTitle': values.selectUniverseTitle,
  'strategyV2.factorResearch.selectUniverseDesc': values.selectUniverseDesc,
  'strategyV2.factorResearch.universeRequired': values.universeRequired,
  'strategyV2.factorResearch.runtimeHint': values.runtimeHint,
  'strategyV2.factorResearch.incompatibleDesc': values.incompatibleDesc
})

export default {
  'en-US': locale({
    eligibleUniverses: ' eligible universes', universe: 'Universe', universeTitle: 'Research universe',
    universePlaceholder: 'Select a universe', universeMode: 'Independent universe research',
    universeModeDesc: 'The selected universe and frequency define the research sample. No strategy code, rebalance rule, capital, or leverage setting is executed.',
    universeCheck: 'Universe selected', frequency: 'Research frequency',
    selectUniverseTitle: 'Select a research universe', selectUniverseDesc: 'Choose a universe with at least three members, then select a factor and run the research.',
    universeRequired: 'Select a research universe first.',
    runtimeHint: 'The universe, frequency, dates, and execution costs define this independent research run.',
    incompatibleDesc: 'Use a universe with at least three eligible symbols.'
  }),
  'zh-CN': locale({
    eligibleUniverses: ' 个可研究标的池', universe: '标的池', universeTitle: '研究标的池',
    universePlaceholder: '请选择标的池', universeMode: '独立标的池研究',
    universeModeDesc: '本次研究只使用所选标的池和周期，不执行任何策略源码、调仓规则、资金或杠杆设置。',
    universeCheck: '标的池已选择', frequency: '研究周期',
    selectUniverseTitle: '请选择研究标的池', selectUniverseDesc: '选择至少包含三个标的的标的池，再选择因子并运行研究。',
    universeRequired: '请先选择研究标的池。',
    runtimeHint: '本次独立研究由标的池、周期、日期区间和成交费用共同确定。',
    incompatibleDesc: '请选择至少包含三个有效标的的标的池。'
  }),
  'zh-TW': locale({
    eligibleUniverses: ' 個可研究標的池', universe: '標的池', universeTitle: '研究標的池',
    universePlaceholder: '請選擇標的池', universeMode: '獨立標的池研究',
    universeModeDesc: '本次研究只使用所選標的池與週期，不執行任何策略原始碼、再平衡規則、資金或槓桿設定。',
    universeCheck: '標的池已選擇', frequency: '研究週期',
    selectUniverseTitle: '請選擇研究標的池', selectUniverseDesc: '選擇至少包含三個標的的標的池，再選擇因子並執行研究。',
    universeRequired: '請先選擇研究標的池。',
    runtimeHint: '本次獨立研究由標的池、週期、日期區間與成交費用共同決定。',
    incompatibleDesc: '請選擇至少包含三個有效標的的標的池。'
  }),
  'de-DE': locale({
    eligibleUniverses: ' geeignete Universen', universe: 'Universum', universeTitle: 'Forschungsuniversum',
    universePlaceholder: 'Universum auswählen', universeMode: 'Unabhängige Universumsanalyse',
    universeModeDesc: 'Universum und Frequenz bestimmen die Stichprobe. Strategiecode, Rebalancing, Kapital und Hebel werden nicht ausgeführt.',
    universeCheck: 'Universum ausgewählt', frequency: 'Forschungsfrequenz',
    selectUniverseTitle: 'Forschungsuniversum auswählen', selectUniverseDesc: 'Wählen Sie ein Universum mit mindestens drei Titeln und anschließend einen Faktor.',
    universeRequired: 'Wählen Sie zuerst ein Forschungsuniversum.',
    runtimeHint: 'Universum, Frequenz, Zeitraum und Ausführungskosten bestimmen diesen unabhängigen Forschungslauf.',
    incompatibleDesc: 'Verwenden Sie ein Universum mit mindestens drei geeigneten Titeln.'
  }),
  'fr-FR': locale({
    eligibleUniverses: ' univers éligibles', universe: 'Univers', universeTitle: 'Univers de recherche',
    universePlaceholder: 'Sélectionner un univers', universeMode: 'Recherche indépendante par univers',
    universeModeDesc: 'L’univers et la fréquence définissent l’échantillon. Aucun code de stratégie, rééquilibrage, capital ou levier n’est exécuté.',
    universeCheck: 'Univers sélectionné', frequency: 'Fréquence de recherche',
    selectUniverseTitle: 'Sélectionnez un univers de recherche', selectUniverseDesc: 'Choisissez un univers d’au moins trois actifs, puis un facteur.',
    universeRequired: 'Sélectionnez d’abord un univers de recherche.',
    runtimeHint: 'L’univers, la fréquence, les dates et les coûts d’exécution définissent cette recherche indépendante.',
    incompatibleDesc: 'Utilisez un univers comportant au moins trois actifs éligibles.'
  }),
  'ja-JP': locale({
    eligibleUniverses: ' 個の研究対象ユニバース', universe: 'ユニバース', universeTitle: '研究ユニバース',
    universePlaceholder: 'ユニバースを選択', universeMode: '独立ユニバース研究',
    universeModeDesc: '選択したユニバースと頻度だけで標本を定義し、戦略コード、リバランス、資本、レバレッジは実行しません。',
    universeCheck: 'ユニバース選択済み', frequency: '研究頻度',
    selectUniverseTitle: '研究ユニバースを選択', selectUniverseDesc: '3銘柄以上のユニバースを選び、因子を選択して研究を実行します。',
    universeRequired: '先に研究ユニバースを選択してください。',
    runtimeHint: 'ユニバース、頻度、期間、取引コストがこの独立研究を定義します。',
    incompatibleDesc: '対象銘柄が3つ以上あるユニバースを使用してください。'
  }),
  'ko-KR': locale({
    eligibleUniverses: '개 연구 가능 유니버스', universe: '유니버스', universeTitle: '연구 유니버스',
    universePlaceholder: '유니버스 선택', universeMode: '독립 유니버스 연구',
    universeModeDesc: '선택한 유니버스와 주기가 표본을 정의하며 전략 코드, 리밸런싱, 자본 및 레버리지는 실행하지 않습니다.',
    universeCheck: '유니버스 선택됨', frequency: '연구 주기',
    selectUniverseTitle: '연구 유니버스를 선택하세요', selectUniverseDesc: '종목이 3개 이상인 유니버스와 팩터를 선택한 뒤 연구를 실행하세요.',
    universeRequired: '먼저 연구 유니버스를 선택하세요.',
    runtimeHint: '유니버스, 주기, 날짜 범위 및 거래 비용이 이 독립 연구를 정의합니다.',
    incompatibleDesc: '대상 종목이 3개 이상인 유니버스를 사용하세요.'
  }),
  'ru-RU': locale({
    eligibleUniverses: ' доступных вселенных', universe: 'Вселенная', universeTitle: 'Исследуемая вселенная',
    universePlaceholder: 'Выберите вселенную', universeMode: 'Независимое исследование вселенной',
    universeModeDesc: 'Выборка задаётся вселенной и частотой. Код стратегии, ребалансировка, капитал и плечо не выполняются.',
    universeCheck: 'Вселенная выбрана', frequency: 'Частота исследования',
    selectUniverseTitle: 'Выберите вселенную для исследования', selectUniverseDesc: 'Выберите вселенную минимум из трёх инструментов, затем фактор.',
    universeRequired: 'Сначала выберите вселенную для исследования.',
    runtimeHint: 'Вселенная, частота, даты и торговые издержки задают это независимое исследование.',
    incompatibleDesc: 'Используйте вселенную как минимум с тремя доступными инструментами.'
  }),
  'th-TH': locale({
    eligibleUniverses: ' จักรวาลที่วิจัยได้', universe: 'จักรวาลสินทรัพย์', universeTitle: 'จักรวาลสำหรับวิจัย',
    universePlaceholder: 'เลือกจักรวาล', universeMode: 'การวิจัยจักรวาลแบบอิสระ',
    universeModeDesc: 'จักรวาลและความถี่ที่เลือกจะกำหนดกลุ่มตัวอย่าง โดยไม่เรียกใช้โค้ดกลยุทธ์ การปรับสมดุล เงินทุน หรือเลเวอเรจ',
    universeCheck: 'เลือกจักรวาลแล้ว', frequency: 'ความถี่การวิจัย',
    selectUniverseTitle: 'เลือกจักรวาลสำหรับวิจัย', selectUniverseDesc: 'เลือกจักรวาลที่มีอย่างน้อยสามสินทรัพย์ แล้วเลือกปัจจัยเพื่อเริ่มวิจัย',
    universeRequired: 'โปรดเลือกจักรวาลสำหรับวิจัยก่อน',
    runtimeHint: 'จักรวาล ความถี่ ช่วงวันที่ และต้นทุนการซื้อขายจะกำหนดการวิจัยอิสระนี้',
    incompatibleDesc: 'ใช้จักรวาลที่มีสินทรัพย์ที่เข้าเกณฑ์อย่างน้อยสามรายการ'
  }),
  'vi-VN': locale({
    eligibleUniverses: ' tập tài sản hợp lệ', universe: 'Tập tài sản', universeTitle: 'Tập tài sản nghiên cứu',
    universePlaceholder: 'Chọn tập tài sản', universeMode: 'Nghiên cứu tập tài sản độc lập',
    universeModeDesc: 'Tập tài sản và tần suất xác định mẫu nghiên cứu; không chạy mã chiến lược, tái cân bằng, vốn hay đòn bẩy.',
    universeCheck: 'Đã chọn tập tài sản', frequency: 'Tần suất nghiên cứu',
    selectUniverseTitle: 'Chọn tập tài sản nghiên cứu', selectUniverseDesc: 'Chọn tập có ít nhất ba tài sản, sau đó chọn nhân tố và chạy nghiên cứu.',
    universeRequired: 'Hãy chọn tập tài sản nghiên cứu trước.',
    runtimeHint: 'Tập tài sản, tần suất, khoảng ngày và chi phí giao dịch xác định nghiên cứu độc lập này.',
    incompatibleDesc: 'Hãy dùng tập có ít nhất ba tài sản hợp lệ.'
  }),
  'ar-SA': locale({
    eligibleUniverses: ' أكوان مؤهلة', universe: 'كون الأصول', universeTitle: 'كون البحث',
    universePlaceholder: 'اختر كوناً', universeMode: 'بحث مستقل للكون',
    universeModeDesc: 'يحدد الكون والتكرار عينة البحث، ولا يتم تشغيل كود الاستراتيجية أو إعادة الموازنة أو رأس المال أو الرافعة.',
    universeCheck: 'تم اختيار الكون', frequency: 'تكرار البحث',
    selectUniverseTitle: 'اختر كون البحث', selectUniverseDesc: 'اختر كوناً يضم ثلاثة أصول مؤهلة على الأقل، ثم اختر العامل وشغّل البحث.',
    universeRequired: 'اختر كون البحث أولاً.',
    runtimeHint: 'يحدد الكون والتكرار ونطاق التاريخ وتكاليف التنفيذ هذا البحث المستقل.',
    incompatibleDesc: 'استخدم كوناً يضم ثلاثة أصول مؤهلة على الأقل.'
  })
}
