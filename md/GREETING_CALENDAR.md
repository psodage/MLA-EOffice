# MLA E-Office — Greeting Calendar

> **Festival & Greeting Schedule — Indian National Holidays + Hindu Festivals with Auto-Send Configuration, Dynamic Date Handling, and Cron Job Implementation**
>
> This document defines every festival and holiday that triggers an automated WhatsApp greeting to active karyakartas. Lunar-calendar festivals (Diwali, Holi, etc.) use dynamically pre-entered dates per year. PA configures send times per festival via the Settings page.
>
> *Related Documents:* [WHATSAPP_TEMPLATES.md](file:///s:/MLA%20E%20-%20Office/WHATSAPP_TEMPLATES.md) | [AUTO_ROUTING_RULES.md](file:///s:/MLA%20E%20-%20Office/AUTO_ROUTING_RULES.md) | [PROJECT_SECTIONS_BREAKDOWN.md](file:///s:/MLA%20E%20-%20Office/PROJECT_SECTIONS_BREAKDOWN.md) | [MASTER_DATA.md](file:///s:/MLA%20E%20-%20Office/MASTER_DATA.md)

---

## 1. Overview

| Property | Value |
|----------|-------|
| **Purpose** | Auto-send festival/holiday WhatsApp greetings to active karyakartas |
| **Recipients** | Active karyakartas only (`karyakartas.is_active = true`) |
| **Send Time** | Configurable per festival — PA sets in Settings → Greeting Calendar |
| **Default Send Time** | 08:00 AM IST (if PA hasn't configured a custom time) |
| **Date Handling** | Fixed-date holidays: stored as `MM-DD`. Lunar festivals: PA pre-enters exact date each year via admin panel |
| **Template Used** | Festival-specific Marathi message (from `WHATSAPP_TEMPLATES.md` — `FESTIVAL_GREETING` template group) |
| **Cron Trigger** | Daily at 12:00 AM IST — checks `greeting_calendar` table for today's festivals → queues sends at configured time |
| **Total Festivals** | 30 events (13 national holidays + 17 Hindu festivals) |
| **Karyakarta Birthdays** | Handled separately by the birthday engine — NOT part of this calendar |

---

## 2. Date Type Classification

| Type | Description | Storage | Example |
|------|-------------|---------|---------|
| **FIXED** | Same date every year (Gregorian) | `MM-DD` in DB | Republic Day — always 26 Jan |
| **DYNAMIC** | Changes every year (lunar/Islamic) | PA enters full `YYYY-MM-DD` each year | Diwali — varies |
| **COMPUTED** | Calculated from rule (e.g., 2nd Saturday) | Formula stored | _(none in this system)_ |

---

## 3. Part A — Indian National Holidays (राष्ट्रीय सण)

All national holidays are **FIXED** dates — same every year.

| # | Festival Code | English Name | Marathi Name | Date | Type | Default Message Theme |
|---|--------------|-------------|-------------|------|------|-----------------------|
| 1 | `REPUBLIC_DAY` | Republic Day | प्रजासत्ताक दिन | 26 Jan | FIXED | Constitutional pride, democracy |
| 2 | `INDEPENDENCE_DAY` | Independence Day | स्वातंत्र्य दिन | 15 Aug | FIXED | Patriotism, freedom fighters |
| 3 | `GANDHI_JAYANTI` | Gandhi Jayanti | गांधी जयंती | 2 Oct | FIXED | Non-violence, truth, Bapu |

### 3A. Festival Message Templates — National Holidays

#### Republic Day (प्रजासत्ताक दिन) — 26 January

```
🇮🇳 प्रजासत्ताक दिनाच्या हार्दिक शुभेच्छा! 🇮🇳

आपल्या महान संविधानाने आपल्याला स्वातंत्र्य, समता आणि बंधुत्वाचा
मार्ग दाखवला. या पवित्र दिनी आपण सर्वांनी संविधानाशी बांधिलकी
ठेवण्याची प्रतिज्ञा घेऊया.

जय हिंद! 🙏

— {mla_name}
   आमदार, {constituency}
```

#### Independence Day (स्वातंत्र्य दिन) — 15 August

```
🇮🇳 स्वातंत्र्य दिनाच्या हार्दिक शुभेच्छा! 🇮🇳

आपल्या महान स्वातंत्र्यसैनिकांच्या बलिदानाने मिळालेल्या
स्वातंत्र्याचा अभिमान बाळगूया आणि देशाच्या प्रगतीसाठी
एकत्रितपणे कार्य करूया.

वंदे मातरम्! 🙏

— {mla_name}
   आमदार, {constituency}
```

#### Gandhi Jayanti (गांधी जयंती) — 2 October

```
🕊️ गांधी जयंतीच्या हार्दिक शुभेच्छा!

महात्मा गांधीजींच्या सत्य, अहिंसा आणि सेवेच्या तत्त्वांनी
जगाला मार्ग दाखवला. त्यांचे विचार आपल्या जीवनात आत्मसात
करूया.

बापूजींना विनम्र अभिवादन 🙏

— {mla_name}
   आमदार, {constituency}
```

---

## 4. Part B — Hindu Festivals (हिंदू सण)

All Hindu festivals follow the **Hindu lunar calendar** — dates change every year. PA must enter exact dates annually via **Settings → Greeting Calendar → Update Dates for {Year}**.

| # | Festival Code | English Name | Marathi Name | Approx. Month | Type | Significance |
|---|--------------|-------------|-------------|--------------|------|--------------|
| 1 | `MAKAR_SANKRANTI` | Makar Sankranti | मकर संक्रांती | Jan 14–15 | FIXED* | Harvest festival, sun transition |
| 2 | `REPUBLIC_DAY` | _(see Part A)_ | — | 26 Jan | FIXED | — |
| 3 | `MAHA_SHIVRATRI` | Maha Shivratri | महाशिवरात्री | Feb–Mar | DYNAMIC | Lord Shiva |
| 4 | `HOLI` | Holi / Rangapanchami | होळी / रंगपंचमी | Mar | DYNAMIC | Festival of colors |
| 5 | `GUDHI_PADWA` | Gudi Padwa | गुढीपाडवा | Mar–Apr | DYNAMIC | Marathi New Year 🎊 |
| 6 | `RAM_NAVAMI` | Ram Navami | राम नवमी | Apr | DYNAMIC | Lord Ram's birthday |
| 7 | `AKSHAYA_TRITIYA` | Akshaya Tritiya | अक्षय्य तृतीया | Apr–May | DYNAMIC | Auspicious farming/gold day |
| 8 | `ASHADHI_EKADASHI` | Ashadhi Ekadashi | आषाढी एकादशी | Jun–Jul | DYNAMIC | Vari pilgrimage — Pandharpur |
| 9 | `NAGA_PANCHAMI` | Naga Panchami | नागपंचमी | Jul–Aug | DYNAMIC | Snake deity worship |
| 10 | `BAIL_POLA` | Bail Pola | बैलपोळा | Aug | DYNAMIC | Bullock worship — farmers' day 🐂 |
| 11 | `GANESH_CHATURTHI` | Ganesh Chaturthi | गणेश चतुर्थी | Aug–Sep | DYNAMIC | Lord Ganesha — major Maharashtra festival 🐘 |
| 12 | `NAVRATRI` | Navratri | नवरात्री | Sep–Oct | DYNAMIC | Nine nights of Devi worship |
| 13 | `DUSSEHRA` | Dussehra / Vijayadashami | दसरा / विजयादशमी | Oct | DYNAMIC | Victory of good over evil |
| 14 | `KOJAGIRI` | Kojagiri Purnima | कोजागिरी पौर्णिमा | Oct | DYNAMIC | Full moon celebration |
| 15 | `DIWALI_DHANTERAS` | Dhanteras | धनत्रयोदशी | Oct–Nov | DYNAMIC | First day of Diwali |
| 16 | `DIWALI_LAKSHMI_PUJAN` | Lakshmi Pujan | लक्ष्मीपूजन | Oct–Nov | DYNAMIC | Main Diwali night 🪔 |
| 17 | `DIWALI_BALI_PRATIPADA` | Bali Pratipada | बलिप्रतिपदा | Oct–Nov | DYNAMIC | Day after Diwali |
| 18 | `BHAU_BEEJ` | Bhau Beej / Bhai Dooj | भाऊबीज | Oct–Nov | DYNAMIC | Brother-sister bond |
| 19 | `KARTIKI_EKADASHI` | Kartiki Ekadashi | कार्तिकी एकादशी | Oct–Nov | DYNAMIC | End of Vari pilgrimage |
| 20 | `MAKAR_SANKRANTI` | Makar Sankranti _(repeat)_ | — | _(year starts again)_ | — | — |

> *Makar Sankranti is **FIXED** at January 14th (occasionally 15th). System defaults to Jan 14.

### 4A. Festival Message Templates — Hindu Festivals

#### Makar Sankranti (मकर संक्रांती)

```
🪁 मकर संक्रांतीच्या हार्दिक शुभेच्छा! 🌾

तिळगुळ घ्या, गोड गोड बोला.
या नवीन वर्षाची सुरुवात गोडव्याने होवो.

— {mla_name}
   आमदार, {constituency}
```

#### Maha Shivratri (महाशिवरात्री)

```
🔱 महाशिवरात्रीच्या हार्दिक शुभेच्छा! 🔱

भगवान शंकराची कृपा आपल्यावर सदैव राहो.
हर हर महादेव! 🙏

— {mla_name}
   आमदार, {constituency}
```

#### Holi / Rangapanchami (होळी / रंगपंचमी)

```
🎨 होळीच्या / रंगपंचमीच्या रंगीत शुभेच्छा! 🎨

आपले जीवन या रंगांप्रमाणेच आनंदी, उत्साही आणि
सुंदर होवो. वाईट विचारांची होळी करूया, चांगल्या
विचारांचा रंग लावूया.

— {mla_name}
   आमदार, {constituency}
```

#### Gudi Padwa (गुढीपाडवा) — Marathi New Year

```
🎊 गुढीपाडव्याच्या हार्दिक शुभेच्छा! 🎊

मराठी नववर्षाच्या शुभारंभी आपणास आणि
आपल्या कुटुंबास सुख, समृद्धी आणि आरोग्याच्या
शुभकामना. हे नवीन वर्ष आपल्यासाठी अत्यंत
शुभ आणि यशस्वी ठरो.

— {mla_name}
   आमदार, {constituency}
```

#### Ram Navami (राम नवमी)

```
🙏 राम नवमीच्या हार्दिक शुभेच्छा!

प्रभू श्रीरामांचे पावन जन्मदिनी आपणास त्यांचा
आशीर्वाद लाभो. सत्य आणि धर्माचा मार्ग
सदैव उज्ज्वल राहो.

जय श्री राम! 🙏

— {mla_name}
   आमदार, {constituency}
```

#### Akshaya Tritiya (अक्षय्य तृतीया)

```
✨ अक्षय्य तृतीयेच्या हार्दिक शुभेच्छा!

या पुण्यपर्वावर आपल्या घरात सुख, समृद्धी
आणि वैभव अक्षय्य राहो. शेतकरी बांधवांना
या कृषी पर्वाच्या विशेष शुभेच्छा!

— {mla_name}
   आमदार, {constituency}
```

#### Ashadhi Ekadashi (आषाढी एकादशी)

```
🚩 आषाढी एकादशीच्या हार्दिक शुभेच्छा!

पंढरपुरच्या विठुरायाच्या पायी कोटी कोटी
वारकऱ्यांचा जयजयकार. पांडुरंग आपल्यावर
कृपाशीर्वाद ठेवो.

पुंडलीक वरदा हरी विठ्ठल! 🙏

— {mla_name}
   आमदार, {constituency}
```

#### Naga Panchami (नागपंचमी)

```
🐍 नागपंचमीच्या हार्दिक शुभेच्छा!

नागदेवतेची पूजा करूया आणि निसर्गाशी
सुसंवाद साधूया. आपल्या घरावर नागदेवतेचा
आशीर्वाद राहो. 🙏

— {mla_name}
   आमदार, {constituency}
```

#### Bail Pola (बैलपोळा) — Farmers' Festival

```
🐂 बैलपोळ्याच्या हार्दिक शुभेच्छा! 🐂

शेतकरी बांधवांच्या जीवनाचा आधार असलेल्या
बैलांप्रती कृतज्ञता व्यक्त करण्याचा हा पवित्र
सण. बळीराजाला या सणाच्या विशेष शुभेच्छा!

जय शेतकरी! 🙏

— {mla_name}
   आमदार, {constituency}
```

#### Ganesh Chaturthi (गणेश चतुर्थी)

```
🐘 गणेश चतुर्थीच्या हार्दिक शुभेच्छा! 🐘

गणपती बाप्पा मोरया! मंगलमूर्ती मोरया!

विघ्नहर्त्या गणपती बाप्पांची कृपा आपल्यावर
सदैव राहो. बाप्पा आपले सर्व विघ्न दूर करोत
आणि सुख-समृद्धी देवोत.

गणपती बाप्पा मोरया! 🙏

— {mla_name}
   आमदार, {constituency}
```

#### Navratri (नवरात्री)

```
🙏 नवरात्रीच्या हार्दिक शुभेच्छा!

शक्तीची उपासना करण्याचे हे नऊ पवित्र दिवस
आपल्यासाठी शुभ आणि मंगलमय ठरोत.
आदिशक्तीचा आशीर्वाद आपल्यावर सदैव असो.

जय माता दी! 🙏

— {mla_name}
   आमदार, {constituency}
```

#### Dussehra / Vijayadashami (दसरा / विजयादशमी)

```
🎉 दसऱ्याच्या / विजयादशमीच्या हार्दिक शुभेच्छा!

असत्यावर सत्याचा, अधर्मावर धर्माचा विजय
झाल्याचा हा पवित्र दिवस. आपल्या जीवनातील
सर्व अडचणींवर विजय मिळवा.

शुभेच्छा! 🙏

— {mla_name}
   आमदार, {constituency}
```

#### Kojagiri Purnima (कोजागिरी पौर्णिमा)

```
🌕 कोजागिरी पौर्णिमेच्या हार्दिक शुभेच्छा!

या पौर्णिमेच्या उजळलेल्या चंद्रप्रकाशात
आपले जीवन सुखी, शांत आणि समृद्ध होवो.

— {mla_name}
   आमदार, {constituency}
```

#### Dhanteras (धनत्रयोदशी)

```
🪔 धनत्रयोदशीच्या हार्दिक शुभेच्छा!

धन-धान्य, सुख आणि समृद्धी सदैव आपल्या
घरात नांदो. लक्ष्मीमातेची कृपा आपणावर
सदैव राहो. 🙏

— {mla_name}
   आमदार, {constituency}
```

#### Lakshmi Pujan / Diwali (लक्ष्मीपूजन / दीपावली)

```
🪔✨ दीपावलीच्या हार्दिक शुभेच्छा! ✨🪔

दिव्यांचा हा सण आपल्या जीवनात आनंद,
समृद्धी आणि शांती घेऊन येवो. लक्ष्मीमातेची
कृपा आपल्या कुटुंबावर सदैव राहो.

दीपावलीच्या खूप खूप शुभेच्छा! 🙏

— {mla_name}
   आमदार, {constituency}
```

#### Bali Pratipada (बलिप्रतिपदा)

```
🎊 बलिप्रतिपदेच्या हार्दिक शुभेच्छा!

हे नवीन वर्ष आपल्यासाठी सुख, समृद्धी
आणि यशाने भरलेले असो.

— {mla_name}
   आमदार, {constituency}
```

#### Bhau Beej / Bhai Dooj (भाऊबीज)

```
💛 भाऊबीजेच्या हार्दिक शुभेच्छा!

भाऊ-बहिणीच्या पवित्र नात्याचा हा उत्सव
सदैव आपल्या जीवनात प्रेम आणि आनंद
घेऊन येवो.

— {mla_name}
   आमदार, {constituency}
```

#### Kartiki Ekadashi (कार्तिकी एकादशी)

```
🚩 कार्तिकी एकादशीच्या हार्दिक शुभेच्छा!

वारकऱ्यांच्या पंढरीच्या यात्रेची सांगता होताना
विठुरायाचे आशीर्वाद आपल्यावर सदैव राहोत.

पुंडलीक वरदा हरी विठ्ठल! 🙏

— {mla_name}
   आमदार, {constituency}
```

---

## 5. Database Schema — greeting_calendar Table

```sql
CREATE TABLE greeting_calendar (
  id                  INT AUTO_INCREMENT PRIMARY KEY,

  -- Festival identity
  festival_code       VARCHAR(50)  NOT NULL UNIQUE,   -- e.g., 'GANESH_CHATURTHI'
  festival_name_en    VARCHAR(100) NOT NULL,
  festival_name_mr    VARCHAR(100) NOT NULL,

  -- Date configuration
  date_type           ENUM('FIXED', 'DYNAMIC') NOT NULL,
  fixed_month_day     CHAR(5) NULL,                   -- 'MM-DD' format (for FIXED only)
  dynamic_dates       JSON NULL,                       -- {"2026":"2026-08-27","2027":"2027-08-16"}
                                                       -- PA populates this annually

  -- Messaging configuration
  message_template_mr TEXT NOT NULL,                  -- Marathi message text with {mla_name}, {constituency}
  send_time           TIME NOT NULL DEFAULT '08:00:00', -- IST — configurable by PA

  -- Audience
  recipient_type      ENUM('ACTIVE_KARYAKARTAS') NOT NULL DEFAULT 'ACTIVE_KARYAKARTAS',

  -- Status
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,  -- PA can disable a festival
  last_sent_date      DATE NULL,                      -- Last date message was sent (prevents duplicate sends)

  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 6. Seed Data — SQL Insert Statements

```sql
-- ============================================================
-- greeting_calendar seed data
-- Dynamic dates for 2026 must be manually updated by PA.
-- Fixed festivals are pre-loaded and never need updating.
-- ============================================================

INSERT INTO greeting_calendar
  (festival_code, festival_name_en, festival_name_mr, date_type, fixed_month_day, dynamic_dates, send_time, message_template_mr)
VALUES

-- ── FIXED FESTIVALS ──────────────────────────────────────────

('REPUBLIC_DAY',
 'Republic Day', 'प्रजासत्ताक दिन',
 'FIXED', '01-26', NULL, '08:00:00',
 '🇮🇳 प्रजासत्ताक दिनाच्या हार्दिक शुभेच्छा! 🇮🇳\n\nआपल्या महान संविधानाने आपल्याला स्वातंत्र्य, समता आणि बंधुत्वाचा मार्ग दाखवला. जय हिंद! 🙏\n\n— {mla_name}\n   आमदार, {constituency}'),

('INDEPENDENCE_DAY',
 'Independence Day', 'स्वातंत्र्य दिन',
 'FIXED', '08-15', NULL, '08:00:00',
 '🇮🇳 स्वातंत्र्य दिनाच्या हार्दिक शुभेच्छा! 🇮🇳\n\nवंदे मातरम्! 🙏\n\n— {mla_name}\n   आमदार, {constituency}'),

('GANDHI_JAYANTI',
 'Gandhi Jayanti', 'गांधी जयंती',
 'FIXED', '10-02', NULL, '08:00:00',
 '🕊️ गांधी जयंतीच्या हार्दिक शुभेच्छा!\n\nमहात्मा गांधीजींना विनम्र अभिवादन 🙏\n\n— {mla_name}\n   आमदार, {constituency}'),

('MAKAR_SANKRANTI',
 'Makar Sankranti', 'मकर संक्रांती',
 'FIXED', '01-14', NULL, '08:00:00',
 '🪁 मकर संक्रांतीच्या हार्दिक शुभेच्छा! 🌾\n\nतिळगुळ घ्या, गोड गोड बोला.\n\n— {mla_name}\n   आमदार, {constituency}'),

-- ── DYNAMIC FESTIVALS (2026 dates pre-loaded) ────────────────

('MAHA_SHIVRATRI',
 'Maha Shivratri', 'महाशिवरात्री',
 'DYNAMIC', NULL, '{"2026":"2026-02-26","2027":"2027-02-15"}', '08:00:00',
 '🔱 महाशिवरात्रीच्या हार्दिक शुभेच्छा! 🔱\n\nहर हर महादेव! 🙏\n\n— {mla_name}\n   आमदार, {constituency}'),

('HOLI',
 'Holi / Rangapanchami', 'होळी / रंगपंचमी',
 'DYNAMIC', NULL, '{"2026":"2026-03-22","2027":"2027-03-12"}', '08:00:00',
 '🎨 होळीच्या / रंगपंचमीच्या रंगीत शुभेच्छा! 🎨\n\n— {mla_name}\n   आमदार, {constituency}'),

('GUDHI_PADWA',
 'Gudi Padwa (Marathi New Year)', 'गुढीपाडवा',
 'DYNAMIC', NULL, '{"2026":"2026-03-30","2027":"2027-03-19"}', '07:00:00',
 '🎊 गुढीपाडव्याच्या हार्दिक शुभेच्छा! 🎊\n\nमराठी नववर्षाच्या शुभारंभी आपणास सुख, समृद्धी आणि आरोग्याच्या शुभकामना.\n\n— {mla_name}\n   आमदार, {constituency}'),

('RAM_NAVAMI',
 'Ram Navami', 'राम नवमी',
 'DYNAMIC', NULL, '{"2026":"2026-04-06","2027":"2027-03-27"}', '08:00:00',
 '🙏 राम नवमीच्या हार्दिक शुभेच्छा!\n\nजय श्री राम! 🙏\n\n— {mla_name}\n   आमदार, {constituency}'),

('AKSHAYA_TRITIYA',
 'Akshaya Tritiya', 'अक्षय्य तृतीया',
 'DYNAMIC', NULL, '{"2026":"2026-04-29","2027":"2027-04-18"}', '08:00:00',
 '✨ अक्षय्य तृतीयेच्या हार्दिक शुभेच्छा!\n\nशेतकरी बांधवांना या कृषी पर्वाच्या विशेष शुभेच्छा!\n\n— {mla_name}\n   आमदार, {constituency}'),

('ASHADHI_EKADASHI',
 'Ashadhi Ekadashi', 'आषाढी एकादशी',
 'DYNAMIC', NULL, '{"2026":"2026-07-06","2027":"2027-06-26"}', '06:00:00',
 '🚩 आषाढी एकादशीच्या हार्दिक शुभेच्छा!\n\nपुंडलीक वरदा हरी विठ्ठल! 🙏\n\n— {mla_name}\n   आमदार, {constituency}'),

('NAGA_PANCHAMI',
 'Naga Panchami', 'नागपंचमी',
 'DYNAMIC', NULL, '{"2026":"2026-07-26","2027":"2027-07-14"}', '08:00:00',
 '🐍 नागपंचमीच्या हार्दिक शुभेच्छा! 🙏\n\n— {mla_name}\n   आमदार, {constituency}'),

('BAIL_POLA',
 'Bail Pola', 'बैलपोळा',
 'DYNAMIC', NULL, '{"2026":"2026-08-10","2027":"2027-08-29"}', '08:00:00',
 '🐂 बैलपोळ्याच्या हार्दिक शुभेच्छा! 🐂\n\nजय शेतकरी! 🙏\n\n— {mla_name}\n   आमदार, {constituency}'),

('GANESH_CHATURTHI',
 'Ganesh Chaturthi', 'गणेश चतुर्थी',
 'DYNAMIC', NULL, '{"2026":"2026-08-22","2027":"2027-08-11"}', '07:00:00',
 '🐘 गणेश चतुर्थीच्या हार्दिक शुभेच्छा! 🐘\n\nगणपती बाप्पा मोरया! 🙏\n\n— {mla_name}\n   आमदार, {constituency}'),

('NAVRATRI',
 'Navratri', 'नवरात्री',
 'DYNAMIC', NULL, '{"2026":"2026-10-02","2027":"2027-09-21"}', '08:00:00',
 '🙏 नवरात्रीच्या हार्दिक शुभेच्छा!\n\nजय माता दी! 🙏\n\n— {mla_name}\n   आमदार, {constituency}'),

('DUSSEHRA',
 'Dussehra / Vijayadashami', 'दसरा / विजयादशमी',
 'DYNAMIC', NULL, '{"2026":"2026-10-11","2027":"2027-10-01"}', '08:00:00',
 '🎉 दसऱ्याच्या हार्दिक शुभेच्छा!\n\nविजयादशमीच्या शुभेच्छा! 🙏\n\n— {mla_name}\n   आमदार, {constituency}'),

('KOJAGIRI',
 'Kojagiri Purnima', 'कोजागिरी पौर्णिमा',
 'DYNAMIC', NULL, '{"2026":"2026-10-13","2027":"2027-10-03"}', '20:00:00',
 '🌕 कोजागिरी पौर्णिमेच्या हार्दिक शुभेच्छा!\n\n— {mla_name}\n   आमदार, {constituency}'),

('DIWALI_DHANTERAS',
 'Dhanteras', 'धनत्रयोदशी',
 'DYNAMIC', NULL, '{"2026":"2026-10-28","2027":"2027-10-17"}', '08:00:00',
 '🪔 धनत्रयोदशीच्या हार्दिक शुभेच्छा! 🙏\n\n— {mla_name}\n   आमदार, {constituency}'),

('DIWALI_LAKSHMI_PUJAN',
 'Lakshmi Pujan (Diwali)', 'लक्ष्मीपूजन (दीपावली)',
 'DYNAMIC', NULL, '{"2026":"2026-10-30","2027":"2027-10-19"}', '07:00:00',
 '🪔✨ दीपावलीच्या हार्दिक शुभेच्छा! ✨🪔\n\nलक्ष्मीमातेची कृपा आपल्यावर सदैव राहो. 🙏\n\n— {mla_name}\n   आमदार, {constituency}'),

('DIWALI_BALI_PRATIPADA',
 'Bali Pratipada', 'बलिप्रतिपदा',
 'DYNAMIC', NULL, '{"2026":"2026-10-31","2027":"2027-10-20"}', '08:00:00',
 '🎊 बलिप्रतिपदेच्या हार्दिक शुभेच्छा!\n\n— {mla_name}\n   आमदार, {constituency}'),

('BHAU_BEEJ',
 'Bhau Beej / Bhai Dooj', 'भाऊबीज',
 'DYNAMIC', NULL, '{"2026":"2026-11-01","2027":"2027-10-21"}', '08:00:00',
 '💛 भाऊबीजेच्या हार्दिक शुभेच्छा!\n\n— {mla_name}\n   आमदार, {constituency}'),

('KARTIKI_EKADASHI',
 'Kartiki Ekadashi', 'कार्तिकी एकादशी',
 'DYNAMIC', NULL, '{"2026":"2026-11-10","2027":"2027-10-30"}', '06:00:00',
 '🚩 कार्तिकी एकादशीच्या हार्दिक शुभेच्छा!\n\nपुंडलीक वरदा हरी विठ्ठल! 🙏\n\n— {mla_name}\n   आमदार, {constituency}');
```

---

## 7. 2026 Festival Calendar — Quick Reference

| Date | Festival | Marathi Name | Send Time |
|------|----------|-------------|-----------|
| 14 Jan | Makar Sankranti | मकर संक्रांती | 08:00 AM |
| 26 Jan | Republic Day | प्रजासत्ताक दिन | 08:00 AM |
| 26 Feb | Maha Shivratri | महाशिवरात्री | 08:00 AM |
| 22 Mar | Holi / Rangapanchami | होळी / रंगपंचमी | 08:00 AM |
| 30 Mar | Gudi Padwa | गुढीपाडवा | 07:00 AM |
| 06 Apr | Ram Navami | राम नवमी | 08:00 AM |
| 29 Apr | Akshaya Tritiya | अक्षय्य तृतीया | 08:00 AM |
| 06 Jul | Ashadhi Ekadashi | आषाढी एकादशी | 06:00 AM |
| 26 Jul | Naga Panchami | नागपंचमी | 08:00 AM |
| 10 Aug | Bail Pola | बैलपोळा | 08:00 AM |
| 15 Aug | Independence Day | स्वातंत्र्य दिन | 08:00 AM |
| 22 Aug | Ganesh Chaturthi | गणेश चतुर्थी | 07:00 AM |
| 02 Oct | Gandhi Jayanti | गांधी जयंती | 08:00 AM |
| 02 Oct | Navratri begins | नवरात्री | 08:00 AM |
| 11 Oct | Dussehra | दसरा / विजयादशमी | 08:00 AM |
| 13 Oct | Kojagiri Purnima | कोजागिरी पौर्णिमा | 08:00 PM |
| 28 Oct | Dhanteras | धनत्रयोदशी | 08:00 AM |
| 30 Oct | Diwali (Lakshmi Pujan) | लक्ष्मीपूजन | 07:00 AM |
| 31 Oct | Bali Pratipada | बलिप्रतिपदा | 08:00 AM |
| 01 Nov | Bhau Beej | भाऊबीज | 08:00 AM |
| 10 Nov | Kartiki Ekadashi | कार्तिकी एकादशी | 06:00 AM |

> **Total: 21 events in 2026** (Navratri counted once at start; multiple Diwali days counted separately)

---

## 8. Cron Job Implementation

### 8A. Cron Schedule

```javascript
// cron/greetingEngine.cron.js

const cron = require('node-cron');
const greetingService = require('../services/greeting.service');

// Run every minute to check if any festival message should be sent NOW
// (Checks DB for festivals whose send_time matches current HH:MM)
cron.schedule('* * * * *', async () => {
  await greetingService.processGreetingsForNow();
}, {
  timezone: 'Asia/Kolkata'  // IST — all times configured in IST
});
```

### 8B. Greeting Service

```javascript
// services/greeting.service.js

const dayjs   = require('dayjs');
const utc     = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

const { GreetingCalendar, Karyakarta, WhatsAppLog } = require('../models');
const whatsappService  = require('./whatsapp.service');
const constituencyConfig = require('../config/constituency.config');

/**
 * Called every minute by the cron job.
 * Finds all festivals scheduled to send at the current IST HH:MM
 * and dispatches WhatsApp messages to active karyakartas.
 */
async function processGreetingsForNow() {
  const nowIST        = dayjs().tz('Asia/Kolkata');
  const todayDate     = nowIST.format('YYYY-MM-DD');   // e.g., "2026-10-30"
  const currentTime   = nowIST.format('HH:mm');        // e.g., "07:00"
  const currentYear   = nowIST.format('YYYY');         // e.g., "2026"

  // 1. Find all active festivals
  const festivals = await GreetingCalendar.findAll({
    where: { is_active: true }
  });

  for (const festival of festivals) {
    // 2. Determine today's festival date
    const festivalDate = getFestivalDate(festival, currentYear);
    if (!festivalDate) continue;  // No date configured for this year

    // 3. Check if today is the festival day AND current time matches send_time
    const sendTime = festival.send_time.substring(0, 5);  // 'HH:MM'
    if (festivalDate !== todayDate) continue;
    if (sendTime !== currentTime)   continue;

    // 4. Prevent duplicate sends (already sent today)
    if (festival.last_sent_date === todayDate) {
      console.log(`[GreetingEngine] Already sent ${festival.festival_code} today. Skipping.`);
      continue;
    }

    // 5. Fetch all active karyakartas with mobile numbers
    const karyakartas = await Karyakarta.findAll({
      where: { is_active: true },
      attributes: ['id', 'name', 'mobile']
    });

    console.log(`[GreetingEngine] Sending ${festival.festival_code} to ${karyakartas.length} karyakartas`);

    // 6. Personalize and send each message
    const messageText = festival.message_template_mr
      .replace('{mla_name}',    constituencyConfig.mla_name_mr)
      .replace('{constituency}', constituencyConfig.constituency_name_mr);

    for (const karyakarta of karyakartas) {
      await whatsappService.sendFreeFormMessage({
        mobile:  karyakarta.mobile,
        message: messageText,
        linkedEntity:   'greeting_calendar',
        linkedEntityId:  festival.id,
      });
    }

    // 7. Update last_sent_date to prevent duplicate sends
    await festival.update({ last_sent_date: todayDate });

    console.log(`[GreetingEngine] ✅ Sent ${festival.festival_code} — ${karyakartas.length} messages queued.`);
  }
}

/**
 * Resolves the festival date for a given year.
 * FIXED festivals: parse from fixed_month_day + year.
 * DYNAMIC festivals: look up from dynamic_dates JSON.
 */
function getFestivalDate(festival, year) {
  if (festival.date_type === 'FIXED') {
    return `${year}-${festival.fixed_month_day}`;  // e.g., "2026-01-26"
  }

  if (festival.date_type === 'DYNAMIC') {
    const dates = festival.dynamic_dates;           // JSON object
    return dates?.[year] ?? null;                   // e.g., "2026-10-30" or null
  }

  return null;
}

module.exports = { processGreetingsForNow };
```

---

## 9. Admin Panel — Greeting Calendar Settings

PA can manage the greeting calendar through **Settings → Greeting Calendar**:

### 9A. Features Available to PA

| Feature | Description |
|---------|-------------|
| **View Calendar** | List all 30 festivals with dates, send times, active status |
| **Update Dynamic Dates** | Every December, PA enters next year's festival dates for all DYNAMIC festivals |
| **Edit Send Time** | Change send time for any festival (e.g., Diwali to 6 AM) |
| **Enable / Disable** | Toggle any festival on/off without deleting it |
| **Preview Message** | See exactly what the message will look like before the festival |
| **Send Test** | Send the festival message to a test number immediately |
| **Manual Send** | Trigger the greeting right now (if auto-send was missed) |
| **Recipient Count** | Shows how many active karyakartas will receive the message |

### 9B. Annual Date Update Workflow (Every December)

```
December 1st each year → PA receives in-app reminder:
  "⏰ Please update festival dates for {next_year}."

PA opens Settings → Greeting Calendar → Update {next_year} Dates

For each DYNAMIC festival:
  PA enters the exact Gregorian date (YYYY-MM-DD)
  System validates: date must be in {next_year}, format correct

PA clicks "Save All Dates for {next_year}"

System updates dynamic_dates JSON for each festival:
  {"2026": "2026-08-22", "2027": "2027-08-11"}  ← adds 2027 entry

Done. Cron job will automatically use the new dates.
```

### 9C. Dynamic Date Sources

PA can refer to these sources for accurate festival dates each year:

| Source | URL | Notes |
|--------|-----|-------|
| India Government Calendar | `https://www.india.gov.in/calendar` | Official national holidays |
| Maharashtra Government | `https://maharashtra.gov.in` | State holidays |
| Drik Panchang | `https://www.drikpanchang.com` | Accurate Hindu festival dates |
| Time and Date | `https://www.timeanddate.com/holidays/india/` | Comprehensive Indian holidays |

---

## 10. Duplicate Send Protection

The system has multiple layers of protection against sending the same greeting twice:

| Layer | Mechanism |
|-------|-----------|
| **`last_sent_date` field** | If `last_sent_date = today`, cron skips the festival |
| **Per-minute cron** | Even if cron fires multiple times at the same minute, `last_sent_date` check prevents double send |
| **WhatsApp log check** | `whatsapp_message_log` deduplicates by `(recipient_mobile, linked_entity_id, DATE(sent_at))` |
| **Idempotent message IDs** | Each message is given a unique `idempotency_key = {festival_code}_{karyakarta_id}_{date}` |

---

## 11. Festival Count Summary

| Category | Count | Date Type |
|----------|:-----:|-----------|
| Indian National Holidays | 3 | FIXED |
| Fixed Hindu (Makar Sankranti) | 1 | FIXED |
| Dynamic Hindu Festivals | 17 | DYNAMIC |
| **Total** | **21** | — |

> **Note:** Karyakarta birthdays are handled by a **separate birthday engine** in `birthdayGreeting.service.js` — not part of this calendar. That service runs daily, checks `karyakartas.dob` for today's date, and sends the `KK_BIRTHDAY` WhatsApp template.
