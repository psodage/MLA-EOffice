'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('departments', [
      { id: 1,  name_en: 'District Collector Office',          name_mr: 'जिल्हाधिकारी कार्यालय',              short_code: 'COLLECTOR',        officer_designation: 'जिल्हाधिकारी',                          sort_order: 1,  is_active: true },
      { id: 2,  name_en: 'Tahsildar Office',                   name_mr: 'तहसीलदार कार्यालय',                   short_code: 'TAHSILDAR',        officer_designation: 'तहसीलदार',                               sort_order: 2,  is_active: true },
      { id: 3,  name_en: 'Zilla Parishad',                     name_mr: 'जिल्हा परिषद',                        short_code: 'ZP',               officer_designation: 'मुख्य कार्यकारी अधिकारी',              sort_order: 3,  is_active: true },
      { id: 4,  name_en: 'Panchayat Samiti',                   name_mr: 'पंचायत समिती',                        short_code: 'PANCHAYAT_SAMITI', officer_designation: 'गट विकास अधिकारी',                      sort_order: 4,  is_active: true },
      { id: 5,  name_en: 'Gram Panchayat',                     name_mr: 'ग्रामपंचायत',                          short_code: 'GRAM_PANCHAYAT',   officer_designation: 'ग्रामसेवक / सरपंच',                     sort_order: 5,  is_active: true },
      { id: 6,  name_en: 'Municipal Corporation',              name_mr: 'महानगरपालिका',                        short_code: 'MUNICIPAL_CORP',   officer_designation: 'आयुक्त',                                 sort_order: 6,  is_active: true },
      { id: 7,  name_en: 'Municipal Council',                  name_mr: 'नगरपरिषद',                            short_code: 'MUNICIPAL_COUNCIL',officer_designation: 'मुख्याधिकारी',                          sort_order: 7,  is_active: true },
      { id: 8,  name_en: 'Nagar Panchayat',                    name_mr: 'नगरपंचायत',                            short_code: 'NAGAR_PANCHAYAT',  officer_designation: 'मुख्याधिकारी',                          sort_order: 8,  is_active: true },
      { id: 9,  name_en: 'Public Works Department',            name_mr: 'सार्वजनिक बांधकाम विभाग',             short_code: 'PWD',              officer_designation: 'कार्यकारी अभियंता',                     sort_order: 9,  is_active: true },
      { id: 10, name_en: 'Water Supply Department',            name_mr: 'पाणीपुरवठा विभाग',                    short_code: 'WATER_DEPT',       officer_designation: 'कार्यकारी अभियंता',                     sort_order: 10, is_active: true },
      { id: 11, name_en: 'MSEDCL / Electricity Board',         name_mr: 'महावितरण',                             short_code: 'MSEDCL',           officer_designation: 'अधीक्षक अभियंता',                      sort_order: 11, is_active: true },
      { id: 12, name_en: 'Revenue Department',                 name_mr: 'महसूल विभाग',                          short_code: 'REVENUE',          officer_designation: 'जिल्हाधिकारी / तहसीलदार',             sort_order: 12, is_active: true },
      { id: 13, name_en: 'Education Department',               name_mr: 'शिक्षण विभाग',                        short_code: 'EDUCATION_DEPT',   officer_designation: 'शिक्षणाधिकारी',                         sort_order: 13, is_active: true },
      { id: 14, name_en: 'Health Department',                  name_mr: 'आरोग्य विभाग',                        short_code: 'HEALTH_DEPT',      officer_designation: 'जिल्हा आरोग्य अधिकारी',               sort_order: 14, is_active: true },
      { id: 15, name_en: 'Social Welfare Department',          name_mr: 'समाजकल्याण विभाग',                    short_code: 'SOCIAL_WELFARE',   officer_designation: 'समाजकल्याण अधिकारी',                   sort_order: 15, is_active: true },
      { id: 16, name_en: 'Agriculture Department',             name_mr: 'कृषी विभाग',                          short_code: 'AGRICULTURE_DEPT', officer_designation: 'जिल्हा कृषी अधिकारी',                  sort_order: 16, is_active: true },
      { id: 17, name_en: 'Police Department',                  name_mr: 'पोलीस विभाग',                         short_code: 'POLICE_DEPT',      officer_designation: 'पोलीस अधीक्षक',                        sort_order: 17, is_active: true },
      { id: 18, name_en: 'Tribal Development Department',      name_mr: 'आदिवासी विकास विभाग',                 short_code: 'TRIBAL_DEPT',      officer_designation: 'प्रकल्प अधिकारी',                      sort_order: 18, is_active: true },
      { id: 19, name_en: 'Women and Child Development',        name_mr: 'महिला व बालविकास',                     short_code: 'WOMEN_CHILD',      officer_designation: 'जिल्हा महिला व बालविकास अधिकारी',    sort_order: 19, is_active: true },
      { id: 20, name_en: 'Food and Civil Supplies',            name_mr: 'अन्न व नागरी पुरवठा',                 short_code: 'FOOD_SUPPLY',      officer_designation: 'जिल्हा पुरवठा अधिकारी',               sort_order: 20, is_active: true },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('departments', null, {});
  },
};
