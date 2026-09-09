# WELL WAY 2027 — سجل المحتوى التجاري الأولي

الحالة: سجل هجرة ومراجعة، وليس إذنًا لملء قاعدة البيانات  
التاريخ: 2026-09-08  
المرحلة: إعداد محتوى الصفحة الرئيسية العربية ومراجعته

## قواعد التحكم

- الموقع القديم مصدر للهجرة وليس دليلًا تلقائيًا على صحة المحتوى أو إذن نشره.
- اعتماد المالك في 2026-09-08 شمل بيانات الشركة والتواصل التي عُرضت عليه، وتصنيف الخدمات التسع، وأسماء العملاء والمشاريع، والسماح بعرض هذه الأسماء.
- لم يشمل الاعتماد الإحصائيات، والشهادات، ونتائج المشاريع، وحقوق الوسائط، والترجمات الإنجليزية.
- الحقول `null` مقصودة ولا تستكمل بالتخمين.

الحالات: `VERIFIED`، `NEEDS_CONFIRMATION`، `UNVERIFIED`؛ والنشر: `DRAFT`، `REVIEW`، `PUBLISHED`؛ والإذن: `CONFIRMED`، `UNKNOWN`، `NOT_ALLOWED`، `NOT_APPLICABLE`.

## 1. الشركة

```yaml
internal_key: company_well_way
legal_name_ar: null
legal_name_en: null
display_name_ar: "ويل واي"
display_name_en: "WELL WAY"
short_name_ar: "ويل واي"
short_name_en: "WELL WAY"
tagline_ar: "تسويق سعودي يوصلك بالعالم"
tagline_en: null
short_description_ar: null
short_description_en: null
full_description_ar: null
full_description_en: null
methodology_ar: null
methodology_en: null
positioning_ar: null
positioning_en: null
country: "المملكة العربية السعودية"
city: "الرياض"
address_ar: "طريق الأمير محمد بن سلمان بن عبدالعزيز، الربيع، الرياض 13316، المملكة العربية السعودية"
address_en: null
business_email: "bussiness@wellwaysa.com"
phone: "+966550519484"
unified_business_phone: "920014568"
whatsapp: null
website: "https://wellwaysa.com"
social_links: null
source_reference: ["CURRENT_SITE:/", "CURRENT_SITE:/about/", "USER_CONFIRMED:company/contact approved 2026-09-08"]
verification_status: VERIFIED
publication_permission: CONFIRMED
publication_status: REVIEW
```

الوصف والمنهجية والاسم القانوني والترجمة الإنجليزية ما زالت مطلوبة.

## 2. التواصل والشبكات الاجتماعية

| field | value | source_reference | verification_status | publication_permission | publication_status |
| --- | --- | --- | --- | --- | --- |
| primary_phone | `+966550519484` | `CURRENT_SITE:/`; `USER_CONFIRMED:2026-09-08` | VERIFIED | CONFIRMED | REVIEW |
| unified_phone | `920014568` | `CURRENT_SITE:/`; `USER_CONFIRMED:2026-09-08` | VERIFIED | CONFIRMED | REVIEW |
| business_email | `bussiness@wellwaysa.com` | `CURRENT_SITE:/`; `USER_CONFIRMED:2026-09-08` | VERIFIED | CONFIRMED | REVIEW |
| address_ar | العنوان أعلاه | `CURRENT_SITE:/`; `USER_CONFIRMED:2026-09-08` | VERIFIED | CONFIRMED | REVIEW |
| whatsapp | null | `CURRENT_SITE:/` | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| address_en | null | `CURRENT_SITE:/` | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| google_maps_url | null | `CURRENT_SITE:/` | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| instagram | null | `CURRENT_SITE:/` | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| x | null | `CURRENT_SITE:/` | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| tiktok | null | `CURRENT_SITE:/` | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| snapchat | null | `CURRENT_SITE:/` | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| linkedin | null | `CURRENT_SITE:/` | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| youtube | null | `CURRENT_SITE:/` | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| facebook | null | `CURRENT_SITE:/` | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |

لأغراض العد يمثل الجدول سجل إعدادات واحدًا، واعتمدت القيم المعبأة فقط.

## 3. الخدمات

| internal_key | title_ar | title_en | current_site_url | source_reference | verification_status | publication_permission | publication_status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| marketing_consulting | الاستشارات التسويقية والاستراتيجية | Marketing Consulting & Strategy | `/consultation/` | `CURRENT_SITE:/consultation/`; `USER_CONFIRMED:2026-09-08` | VERIFIED | CONFIRMED | REVIEW |
| paid_advertising | إدارة الحملات الإعلانية المدفوعة | Paid Advertising Campaign Management | `/ads/` | `CURRENT_SITE:/ads/`; `USER_CONFIRMED:2026-09-08` | VERIFIED | CONFIRMED | REVIEW |
| web_ecommerce | تطوير المواقع والمتاجر الإلكترونية | Website & E-commerce Development | `/websites/` | `CURRENT_SITE:/websites/`; `USER_CONFIRMED:2026-09-08` | VERIFIED | CONFIRMED | REVIEW |
| influencer_marketing | التسويق عبر المؤثرين | Influencer Marketing | `/influencer/` | `CURRENT_SITE:/influencer/`; `USER_CONFIRMED:2026-09-08` | VERIFIED | CONFIRMED | REVIEW |
| creative_visual_content | إنتاج المحتوى الإبداعي والمرئي | Creative & Visual Content Production | `/creative/` | `CURRENT_SITE:/creative/`; `USER_CONFIRMED:2026-09-08` | VERIFIED | CONFIRMED | REVIEW |
| social_media | إدارة حسابات التواصل الاجتماعي | Social Media Management | `/social/` | `CURRENT_SITE:/social/`; `USER_CONFIRMED:2026-09-08` | VERIFIED | CONFIRMED | REVIEW |
| brand_identity | تصميم الهوية التجارية | Brand Identity | `/branding/` | `CURRENT_SITE:/branding/`; `USER_CONFIRMED:2026-09-08` | VERIFIED | CONFIRMED | REVIEW |
| company_profile | تصميم الملف التعريفي للشركات | Company Profile Design | `/profile/` | `CURRENT_SITE:/profile/`; `USER_CONFIRMED:2026-09-08` | VERIFIED | CONFIRMED | REVIEW |
| seo | تحسين محركات البحث | Search Engine Optimization (SEO) | `/seo/` | `CURRENT_SITE:/seo/`; `USER_CONFIRMED:2026-09-08` | VERIFIED | CONFIRMED | REVIEW |

لكل خدمة: `slug_ar:null`، `slug_en:null`، `summary_ar:null`، `summary_en:null`، `body_ar:null`، `body_en:null`، وجميع حقول SEO `null`. ملاحظات الهجرة: يلخص معنى الصفحة القديمة بعد مراجعة النص وإزالة التكرار. المعلومات الناقصة: النص العربي، الترجمة، المسارات، SEO، والوسائط.

## 4. العملاء

أسماء العرض وإذن عرضها معتمدان؛ الاسم الرسمي والموقع وحقوق الشعارات غير معتمدة.

| internal_key | verified_name | name_ar | name_en | website | light_logo_filename | dark_logo_filename | source_reference | verification_status | publication_permission | publication_status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| client_catcator | null | كاتكاتور | Catcator | null | null | null | `CURRENT_SITE:/portfolio/`; `USER_CONFIRMED:2026-09-08` | VERIFIED | CONFIRMED | REVIEW |
| client_safwat_aljouf | null | صفوة الجوف | null | null | null | null | same | VERIFIED | CONFIRMED | REVIEW |
| client_jeddah_deaf_club | null | نادي الصم في جدة | null | null | null | null | same | VERIFIED | CONFIRMED | REVIEW |
| client_sehatak_aham | null | مختبرات صحتك أهم | null | null | null | null | same | VERIFIED | CONFIRMED | REVIEW |
| client_sanad | null | سند | SANAD | null | null | null | same | VERIFIED | CONFIRMED | REVIEW |
| client_rare_feather | null | الريشة النادرة | null | null | null | null | same | VERIFIED | CONFIRMED | REVIEW |
| client_oud_ban | null | عود بان | OUD BAN | null | null | null | same | VERIFIED | CONFIRMED | REVIEW |
| client_lafhah | null | لفحة للعطور | LAFHAH | null | null | null | same | VERIFIED | CONFIRMED | REVIEW |
| client_casafelo | null | كازافيلو | Casafelo | null | null | null | same | VERIFIED | CONFIRMED | REVIEW |
| client_layan_home | null | ليان هوم | Layan Home | null | null | null | same | VERIFIED | CONFIRMED | REVIEW |
| client_al_fawaz | null | الفواز للأقمشة | Al Fawaz | null | null | null | same | VERIFIED | CONFIRMED | REVIEW |
| client_jstore | null | جي ستور | JStore | null | null | null | same | VERIFIED | CONFIRMED | REVIEW |
| client_art_square | null | آرت سكوير | Art Square | null | null | null | same | VERIFIED | CONFIRMED | REVIEW |

`same` يعني `CURRENT_SITE:/portfolio/` مع `USER_CONFIRMED:client/project display names approved 2026-09-08`.

## 5. المشاريع

| internal_key | client_internal_key | service_internal_keys | title_ar | title_en | source_reference | verification_status | publication_permission | publication_status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| project_catcator | client_catcator | `[]` | كاتكاتور | Catcator | `CURRENT_SITE:/portfolio/`; `USER_CONFIRMED:2026-09-08` | VERIFIED | CONFIRMED | REVIEW |
| project_safwat_aljouf | client_safwat_aljouf | `[]` | صفوة الجوف | null | same | VERIFIED | CONFIRMED | REVIEW |
| project_jeddah_deaf_club_profile | client_jeddah_deaf_club | `[company_profile]` | الملف التعريفي لنادي الصم في جدة | null | same | VERIFIED | CONFIRMED | REVIEW |
| project_sehatak_aham_profile | client_sehatak_aham | `[company_profile]` | ملف تعريفي لمختبرات صحتك أهم | null | same | VERIFIED | CONFIRMED | REVIEW |
| project_sanad | client_sanad | `[]` | سند | SANAD | same | VERIFIED | CONFIRMED | REVIEW |
| project_rare_feather | client_rare_feather | `[]` | الريشة النادرة | null | same | VERIFIED | CONFIRMED | REVIEW |
| project_oud_ban | client_oud_ban | `[]` | عود بان | OUD BAN | same | VERIFIED | CONFIRMED | REVIEW |
| project_lafhah | client_lafhah | `[]` | لفحة للعطور | LAFHAH | same | VERIFIED | CONFIRMED | REVIEW |
| project_national_day_96_landing | null | `[web_ecommerce]` | صفحة هبوط اليوم الوطني 96 | null | same | VERIFIED | CONFIRMED | REVIEW |
| project_casafelo | client_casafelo | `[]` | كازافيلو | Casafelo | same | VERIFIED | CONFIRMED | REVIEW |
| project_layan_home | client_layan_home | `[]` | ليان هوم | Layan Home | same | VERIFIED | CONFIRMED | REVIEW |
| project_al_fawaz | client_al_fawaz | `[]` | الفواز للأقمشة | Al Fawaz | same | VERIFIED | CONFIRMED | REVIEW |
| project_jstore | client_jstore | `[]` | جي ستور | JStore | same | VERIFIED | CONFIRMED | REVIEW |
| project_art_square | client_art_square | `[]` | آرت سكوير | Art Square | same | VERIFIED | CONFIRMED | REVIEW |

لكل مشروع: `slug_ar:null`، `slug_en:null`، الملخصان والنصان `null`، `verified_outcomes:[]`، `ordered_image_filenames:[]`. الناقص: نطاق الخدمة، النصوص، الوسائط وحقوقها، وأدلة النتائج. لا ينشر المشروع كدراسة حالة قبل اعتماد ذلك.

## 6. علاقات المشاريع والعملاء والخدمات

الأسماء معتمدة، أما نطاق الخدمة والعلاقة التفصيلية فتحتاج تأكيدًا.

| project_internal_key | client_internal_key | service_internal_keys | relationship_source | verification_status | publication_permission | publication_status |
| --- | --- | --- | --- | --- | --- | --- |
| project_catcator | client_catcator | `[]` | `CURRENT_SITE:/portfolio/` | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| project_safwat_aljouf | client_safwat_aljouf | `[]` | same | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| project_jeddah_deaf_club_profile | client_jeddah_deaf_club | `[company_profile]` | same | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| project_sehatak_aham_profile | client_sehatak_aham | `[company_profile]` | same | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| project_sanad | client_sanad | `[]` | same | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| project_rare_feather | client_rare_feather | `[]` | same | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| project_oud_ban | client_oud_ban | `[]` | same | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| project_lafhah | client_lafhah | `[]` | same | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| project_national_day_96_landing | null | `[web_ecommerce]` | same | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| project_casafelo | client_casafelo | `[]` | same | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| project_layan_home | client_layan_home | `[]` | same | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| project_al_fawaz | client_al_fawaz | `[]` | same | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| project_jstore | client_jstore | `[]` | same | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| project_art_square | client_art_square | `[]` | same | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |

## 7. القطاعات المحتملة

| internal_key | title_ar | title_en | related_client_keys | related_project_keys | source_reference | verification_status | publication_permission | publication_status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| healthcare_labs | الرعاية الصحية والمختبرات | Healthcare & Laboratories | `[client_sehatak_aham]` | `[project_sehatak_aham_profile]` | `CURRENT_SITE:/portfolio/` | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |
| fragrance_oud | العطور والعود | Fragrance & Oud | `[client_oud_ban,client_lafhah]` | `[project_oud_ban,project_lafhah]` | same | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |
| textiles | الأقمشة والمنسوجات | Textiles | `[client_al_fawaz]` | `[project_al_fawaz]` | same | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |
| retail_ecommerce | التجزئة والتجارة الإلكترونية | Retail & E-commerce | `[client_jstore]` | `[project_jstore]` | same | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |
| nonprofit | القطاع غير الربحي | Nonprofit | `[client_jeddah_deaf_club]` | `[project_jeddah_deaf_club_profile]` | same | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |
| home_lifestyle | المنزل ونمط الحياة | Home & Lifestyle | `[client_layan_home]` | `[project_layan_home]` | same | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |
| creative_design | التصميم والصناعات الإبداعية | Creative & Design | `[client_art_square]` | `[project_art_square]` | same | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |

هذه استنتاجات من الأسماء فقط وليست قطاعات معتمدة.

## 8. إحصائيات الموقع القديم — تحتاج تأكيدًا

| stat_internal_key | label_ar | label_en | value | unit | source_reference | evidence | verification_status | publication_permission | publication_status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| legacy_stat_1 | null | null | `1` | `million` | `CURRENT_SITE:/` | عداد بلا تسمية موثوقة | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |
| legacy_stat_2 | null | null | `1+` | null | `CURRENT_SITE:/` | عداد بلا تسمية موثوقة | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |
| legacy_stat_3 | null | null | `5/1` | null | `CURRENT_SITE:/` | مخرج مشوه | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |
| legacy_stat_4 | null | null | `0` | years | `CURRENT_SITE:/` | مخرج مشوه | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |

## 9. الشهادات

لم تنسخ الاقتباسات لغياب الموافقة. جميع الحقول `customer_role` و`client_internal_key` و`quote_ar` و`quote_en` و`consent_source` تظل `null` إلا حيث يظهر الدور أدناه.

| internal_key | customer_name | customer_role | source_reference | verification_status | publication_permission | publication_status |
| --- | --- | --- | --- | --- | --- | --- |
| testimonial_abdullah_alenezi | عبدالله العنزي | null | `CURRENT_SITE:/` | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| testimonial_mohammed_almajed | محمد الماجد | null | same | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| testimonial_waleed_alenezi | وليد العنزي | null | same | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| testimonial_sara_mohammed | سارة محمد | null | same | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| testimonial_raghad_alshahri | رغد الشهري | null | same | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| testimonial_hanoof_rabeea | هنوف ربيع | null | same | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| testimonial_adnan_mohammed | عدنان محمد | null | same | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| testimonial_noura_abdullah | نورة عبدالله | null | same | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| testimonial_saud_mohammed | سعود محمد | null | same | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| testimonial_ahmed_abdullah | أحمد عبدالله | null | same | NEEDS_CONFIRMATION | UNKNOWN | DRAFT |
| testimonial_john_doe | John Doe | CEO | `CURRENT_SITE:/portfolio/` | UNVERIFIED | UNKNOWN | DRAFT |

`John Doe` مشتبه بأنه محتوى مؤقت ويحذف ما لم يقدم له دليل موثوق.

## 10. Hero

```yaml
internal_key: legacy_home_hero_1
eyebrow_ar: null
eyebrow_en: null
headline_ar: "تسويق سعودي يوصلك بالعالم"
headline_en: null
description_ar: null
description_en: null
cta_label_ar: null
cta_label_en: null
cta_target: null
media_filename: null
source_reference: ["CURRENT_SITE:/", "USER_CONFIRMED:tagline approved 2026-09-08"]
verification_status: VERIFIED
publication_permission: CONFIRMED
publication_status: REVIEW
```

لا يوجد محتوى Hero جديد معتمد ولا ملف وسائط.

## 11. سجل SEO

| internal_key | legacy_route | route_ar | route_en | source_reference | verification_status | publication_permission | publication_status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| seo_home | `/` | null | null | `CURRENT_SITE:/` | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |
| seo_about | `/about/` | null | null | `CURRENT_SITE:/about/` | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |
| seo_services_index | null | null | null | `PROJECT_DOC:docs/02-SITE-STRUCTURE.md` | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |
| seo_consulting | `/consultation/` | null | null | `CURRENT_SITE:/consultation/` | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |
| seo_ads | `/ads/` | null | null | `CURRENT_SITE:/ads/` | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |
| seo_websites | `/websites/` | null | null | `CURRENT_SITE:/websites/` | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |
| seo_influencer | `/influencer/` | null | null | `CURRENT_SITE:/influencer/` | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |
| seo_creative | `/creative/` | null | null | `CURRENT_SITE:/creative/` | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |
| seo_social | `/social/` | null | null | `CURRENT_SITE:/social/` | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |
| seo_branding | `/branding/` | null | null | `CURRENT_SITE:/branding/` | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |
| seo_profile | `/profile/` | null | null | `CURRENT_SITE:/profile/` | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |
| seo_service_seo | `/seo/` | null | null | `CURRENT_SITE:/seo/` | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |
| seo_portfolio | `/portfolio/` | null | null | `CURRENT_SITE:/portfolio/` | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |
| seo_blog | `/%D8%A7%D9%84%D9%85%D8%AF%D9%88%D9%86%D8%A9/` | null | null | `CURRENT_SITE:/المدونة/` | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |
| seo_faq | null | null | null | `CURRENT_SITE:/` | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |
| seo_contact | null | null | null | `CURRENT_SITE:/` | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |
| seo_golden_guarantee | null | null | null | `CURRENT_SITE:/about/` | NEEDS_CONFIRMATION | NOT_APPLICABLE | DRAFT |

لكل صفحة: `seo_title_ar:null`، `seo_title_en:null`، `seo_description_ar:null`، `seo_description_en:null`، `canonical_ar:null`، `canonical_en:null`، `index_status:DRAFT`.

## 12. الأصول الناقصة والأسئلة المفتوحة

- **الشركة:** اعتماد الوصف والمنهجية والاسم القانوني والترجمة.
- **التواصل:** تقديم واتساب، العنوان الإنجليزي، Google Maps، وجميع روابط الشبكات.
- **الخدمات:** الأسماء التسعة معتمدة؛ يلزم النص العربي والترجمة والمسارات وSEO.
- **العملاء:** أسماء العرض معتمدة؛ يلزم الاسم الرسمي والمواقع وحقوق الشعارات.
- **المشاريع:** أسماء العرض معتمدة؛ يلزم العميل والخدمات والتفاصيل والنتائج المدعومة.
- **مجموعة أصول 1 — الشعارات:** شعارا WELL WAY موجودان في `public/brand/`؛ شعارات العملاء وحقوقها ناقصة.
- **مجموعة أصول 2 — وسائط المشاريع:** الصور المرتبة وحقوق المصدر والنصوص البديلة ناقصة؛ لم تنزل صور الموقع القديم.
- **الإحصائيات:** تحديد القيم والتسميات وتقديم الأدلة، أو حذفها.
- **الشهادات:** تقديم النص والصفة ودليل الموافقة؛ إزالة `John Doe` ما لم يثبت.
- **SEO:** اعتماد المسارات المحلية والبيانات وسجل التحويلات.
- **الإنجليزية:** اعتماد العربي أولًا ثم ترجمة أمينة.
- **مجموعة أصول 3 — Hero:** ملف الوسائط غير موجود، ولن تنشأ صورة وهمية.
- **مجموعة أصول 4 — الخدمات:** الأيقونات والصور وحقوقها وبياناتها ناقصة.

## ملاحظات الهجرة

الموقع القديم يحتوي معلومات شركة، وتسع خدمات، وأعمالًا وصورًا، وشهادات، وإحصائيات، وتواصلًا، ومحتوى خدمات عربيًا، ومدونة، وأسئلة شائعة، وفكرة الضمان الذهبي. يلزم اعتماد كل ما لم يسجله هذا الملف كـ`VERIFIED` قبل نشره.

## الإجمالي

| المقياس | العدد |
| --- | ---: |
| SOURCE RECORDS FOUND | 92 |
| VERIFIED | 39 |
| NEEDS CONFIRMATION | 52 |
| UNVERIFIED | 1 |
| MISSING ASSETS | 4 مجموعات |

الـ92 سجلًا: شركة 1، تواصل 1، خدمات 9، عملاء 13، مشاريع 14، علاقات 14، قطاعات 7، إحصائيات 4، شهادات 11، Hero واحد، وSEO عدد 17. سجل Hero معتمد لأن المالك اعتمد الشعار النصي أيضًا.

## الإجراء التالي المعتمد

إعداد مسودة الصفحة الرئيسية العربية من البيانات المعتمدة فقط، واستبعاد الإحصائيات والشهادات والنتائج والوسائط غير المعتمدة. تعرض المسودة على المالك قبل الترجمة أو قاعدة البيانات أو تنفيذ التطبيق.
