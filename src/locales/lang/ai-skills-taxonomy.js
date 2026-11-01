const keys = [
  'aiSkills.categoryLabels.automation',
  'aiSkills.categoryLabels.backtest',
  'aiSkills.categoryLabels.broker',
  'aiSkills.categoryLabels.data',
  'aiSkills.categoryLabels.indicator',
  'aiSkills.categoryLabels.integration',
  'aiSkills.categoryLabels.jobs',
  'aiSkills.categoryLabels.macro',
  'aiSkills.categoryLabels.market',
  'aiSkills.categoryLabels.mcp',
  'aiSkills.categoryLabels.operations',
  'aiSkills.categoryLabels.portfolio',
  'aiSkills.categoryLabels.research',
  'aiSkills.categoryLabels.risk',
  'aiSkills.categoryLabels.strategy',
  'aiSkills.categoryLabels.trading',
  'aiSkills.categoryLabels.workspace',
  'aiSkills.riskLabels.read',
  'aiSkills.riskLabels.runtime_control',
  'aiSkills.riskLabels.trading',
  'aiSkills.riskLabels.write_config',
  'aiSkills.riskLabels.write_draft'
]

const translations = {
  'ar-SA': [
    'الأتمتة', 'الاختبار التاريخي', 'الوسيط', 'البيانات', 'المؤشرات', 'التكامل', 'المهام', 'الاقتصاد الكلي', 'السوق', 'MCP', 'العمليات', 'المحفظة', 'الأبحاث', 'المخاطر', 'الاستراتيجية', 'التداول', 'مساحة العمل',
    'للقراءة فقط', 'التحكم في وقت التشغيل', 'تنفيذ التداول', 'كتابة الإعدادات', 'كتابة المسودات'
  ],
  'de-DE': [
    'Automatisierung', 'Rücktest', 'Wertpapiermakler', 'Daten', 'Indikator', 'Systemanbindung', 'Aufgaben', 'Makroökonomie', 'Markt', 'MCP', 'Betrieb', 'Anlageportfolio', 'Recherche', 'Risiko', 'Strategie', 'Handel', 'Arbeitsbereich',
    'Nur Lesen', 'Laufzeitsteuerung', 'Handelsausführung', 'Konfiguration schreiben', 'Entwurf schreiben'
  ],
  'fr-FR': [
    'Automatisation', 'Test rétrospectif', 'Courtier', 'Données', 'Indicateur', 'Intégration', 'Tâches', 'Macroéconomie', 'Marché', 'MCP', 'Opérations', 'Portefeuille', 'Recherche', 'Risque', 'Stratégie', 'Négociation', 'Espace de travail',
    'Lecture seule', 'Contrôle d’exécution', 'Exécution des ordres', 'Modification de la configuration', 'Modification des brouillons'
  ],
  'ja-JP': [
    '自動化', 'バックテスト', 'ブローカー', 'データ', 'インジケーター', '連携', 'ジョブ', 'マクロ', '市場', 'MCP', '運用', 'ポートフォリオ', 'リサーチ', 'リスク', 'ストラテジー', '取引', 'ワークスペース',
    '読み取り専用', '実行制御', '取引実行', '設定の書き込み', '下書きの書き込み'
  ],
  'ko-KR': [
    '자동화', '백테스트', '브로커', '데이터', '지표', '연동', '작업', '거시경제', '시장', 'MCP', '운영', '포트폴리오', '리서치', '리스크', '전략', '거래', '작업 공간',
    '읽기 전용', '런타임 제어', '거래 실행', '설정 쓰기', '초안 쓰기'
  ],
  'ru-RU': [
    'Автоматизация', 'Бэктест', 'Брокер', 'Данные', 'Индикаторы', 'Интеграции', 'Задания', 'Макроэкономика', 'Рынок', 'MCP', 'Операции', 'Портфель', 'Исследования', 'Риск', 'Стратегия', 'Торговля', 'Рабочая область',
    'Только чтение', 'Управление выполнением', 'Исполнение сделок', 'Изменение конфигурации', 'Изменение черновиков'
  ],
  'th-TH': [
    'ระบบอัตโนมัติ', 'แบ็กเทสต์', 'โบรกเกอร์', 'ข้อมูล', 'อินดิเคเตอร์', 'การเชื่อมต่อ', 'งาน', 'มหภาค', 'ตลาด', 'MCP', 'การดำเนินงาน', 'พอร์ตโฟลิโอ', 'การวิจัย', 'ความเสี่ยง', 'กลยุทธ์', 'การเทรด', 'พื้นที่ทำงาน',
    'อ่านอย่างเดียว', 'ควบคุมการทำงาน', 'ดำเนินการเทรด', 'เขียนการตั้งค่า', 'เขียนฉบับร่าง'
  ],
  'vi-VN': [
    'Tự động hóa', 'Kiểm thử quá khứ', 'Nhà môi giới', 'Dữ liệu', 'Chỉ báo', 'Tích hợp', 'Tác vụ', 'Vĩ mô', 'Thị trường', 'MCP', 'Vận hành', 'Danh mục', 'Nghiên cứu', 'Rủi ro', 'Chiến lược', 'Giao dịch', 'Không gian làm việc',
    'Chỉ đọc', 'Điều khiển thời gian chạy', 'Thực thi giao dịch', 'Ghi cấu hình', 'Ghi bản nháp'
  ],
  'zh-TW': [
    '自動化', '回測', '券商帳戶', '資料', '指標', '整合', '任務', '總體經濟', '市場', 'MCP', '系統維運', '投資組合', '投研', '風險控制', '策略', '交易', '工作區',
    '唯讀', '執行控制', '交易執行', '寫入設定', '寫入草稿'
  ]
}

export default Object.fromEntries(
  Object.entries(translations).map(([locale, values]) => [
    locale,
    Object.fromEntries(keys.map((key, index) => [key, values[index]]))
  ])
)
