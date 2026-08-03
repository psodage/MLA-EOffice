'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // ── Talukas (2) ─────────────────────────────────────────────
    await queryInterface.bulkInsert('talukas', [
      { id: 1, name_en: 'Amravati',  name_mr: 'अमरावती' },
      { id: 2, name_en: 'Daryapur',  name_mr: 'दर्यापूर' },
    ]);

    // ── Gram Panchayats (4 — 2 per taluka) ──────────────────────
    await queryInterface.bulkInsert('gram_panchayats', [
      { id: 1, name_en: 'Vadali Bhoi',     name_mr: 'वडाळी भोई',     taluka_id: 1 },
      { id: 2, name_en: 'Shendurjana Ghat', name_mr: 'शेंदूरजना घाट', taluka_id: 1 },
      { id: 3, name_en: 'Talegaon Dashasar', name_mr: 'तळेगाव दशासर', taluka_id: 2 },
      { id: 4, name_en: 'Yelgaon',          name_mr: 'येळगाव',         taluka_id: 2 },
    ]);

    // ── Villages (8 — 2 per GP) ─────────────────────────────────
    await queryInterface.bulkInsert('villages', [
      { id: 1, name_en: 'Vadali Bhoi',      name_mr: 'वडाळी भोई',        gram_panchayat_id: 1 },
      { id: 2, name_en: 'Sawangi Meghe',    name_mr: 'सावंगी (मेघे)',     gram_panchayat_id: 1 },
      { id: 3, name_en: 'Shendurjana Ghat', name_mr: 'शेंदूरजना घाट',    gram_panchayat_id: 2 },
      { id: 4, name_en: 'Badnera',          name_mr: 'बडनेरा',            gram_panchayat_id: 2 },
      { id: 5, name_en: 'Talegaon Dashasar',name_mr: 'तळेगाव दशासर',     gram_panchayat_id: 3 },
      { id: 6, name_en: 'Walgaon',          name_mr: 'वळगाव',              gram_panchayat_id: 3 },
      { id: 7, name_en: 'Yelgaon',          name_mr: 'येळगाव',             gram_panchayat_id: 4 },
      { id: 8, name_en: 'Nandura Bk.',      name_mr: 'नांदुरा बु.',        gram_panchayat_id: 4 },
    ]);

    // ── Wards (10 — urban wards for Amravati city) ──────────────
    await queryInterface.bulkInsert('wards', [
      { id: 1,  ward_number: 1,  name_en: 'Ward 1 - Rajapeth',      name_mr: 'प्रभाग १ - राजापेठ',       city_name: 'Amravati' },
      { id: 2,  ward_number: 2,  name_en: 'Ward 2 - Camp Area',     name_mr: 'प्रभाग २ - कॅम्प परिसर',   city_name: 'Amravati' },
      { id: 3,  ward_number: 3,  name_en: 'Ward 3 - Gadge Nagar',   name_mr: 'प्रभाग ३ - गाडगे नगर',     city_name: 'Amravati' },
      { id: 4,  ward_number: 4,  name_en: 'Ward 4 - Dastur Nagar',  name_mr: 'प्रभाग ४ - दस्तूर नगर',    city_name: 'Amravati' },
      { id: 5,  ward_number: 5,  name_en: 'Ward 5 - Jawahar Gate',  name_mr: 'प्रभाग ५ - जवाहर गेट',     city_name: 'Amravati' },
      { id: 6,  ward_number: 6,  name_en: 'Ward 6 - Cotton Market', name_mr: 'प्रभाग ६ - कापूस मार्केट',  city_name: 'Amravati' },
      { id: 7,  ward_number: 7,  name_en: 'Ward 7 - Shivaji Nagar', name_mr: 'प्रभाग ७ - शिवाजी नगर',    city_name: 'Amravati' },
      { id: 8,  ward_number: 8,  name_en: 'Ward 8 - Ambapeth',      name_mr: 'प्रभाग ८ - अंबापेठ',        city_name: 'Amravati' },
      { id: 9,  ward_number: 9,  name_en: 'Ward 9 - Benoda',        name_mr: 'प्रभाग ९ - बेनोडा',         city_name: 'Amravati' },
      { id: 10, ward_number: 10, name_en: 'Ward 10 - Rukhmini Nagar', name_mr: 'प्रभाग १० - रुक्मिणी नगर', city_name: 'Amravati' },
    ]);

    // ── Booths (20 — mix of rural and urban) ────────────────────
    await queryInterface.bulkInsert('booths', [
      // Rural booths (village-linked)
      { id: 1,  booth_number: 1,   booth_name: 'Vadali ZP School',           village_id: 1, ward_id: null, gram_panchayat_id: 1, total_voters: 850,  verification_status: 'NOT_VERIFIED' },
      { id: 2,  booth_number: 2,   booth_name: 'Vadali Gram Panchayat',      village_id: 1, ward_id: null, gram_panchayat_id: 1, total_voters: 920,  verification_status: 'NOT_VERIFIED' },
      { id: 3,  booth_number: 3,   booth_name: 'Sawangi Primary School',     village_id: 2, ward_id: null, gram_panchayat_id: 1, total_voters: 780,  verification_status: 'NOT_VERIFIED' },
      { id: 4,  booth_number: 4,   booth_name: 'Shendurjana Community Hall', village_id: 3, ward_id: null, gram_panchayat_id: 2, total_voters: 1100, verification_status: 'NOT_VERIFIED' },
      { id: 5,  booth_number: 5,   booth_name: 'Shendurjana ZP School',      village_id: 3, ward_id: null, gram_panchayat_id: 2, total_voters: 950,  verification_status: 'NOT_VERIFIED' },
      { id: 6,  booth_number: 6,   booth_name: 'Badnera Railway Colony',     village_id: 4, ward_id: null, gram_panchayat_id: 2, total_voters: 1200, verification_status: 'NOT_VERIFIED' },
      { id: 7,  booth_number: 7,   booth_name: 'Talegaon GP Office',         village_id: 5, ward_id: null, gram_panchayat_id: 3, total_voters: 670,  verification_status: 'NOT_VERIFIED' },
      { id: 8,  booth_number: 8,   booth_name: 'Walgaon Primary School',     village_id: 6, ward_id: null, gram_panchayat_id: 3, total_voters: 590,  verification_status: 'NOT_VERIFIED' },
      { id: 9,  booth_number: 9,   booth_name: 'Yelgaon ZP School',          village_id: 7, ward_id: null, gram_panchayat_id: 4, total_voters: 720,  verification_status: 'NOT_VERIFIED' },
      { id: 10, booth_number: 10,  booth_name: 'Nandura Community Hall',      village_id: 8, ward_id: null, gram_panchayat_id: 4, total_voters: 880,  verification_status: 'NOT_VERIFIED' },
      // Urban booths (ward-linked)
      { id: 11, booth_number: 101, booth_name: 'Rajapeth Municipal School',     village_id: null, ward_id: 1,  gram_panchayat_id: null, total_voters: 1050, verification_status: 'NOT_VERIFIED' },
      { id: 12, booth_number: 102, booth_name: 'Camp Area Community Hall',      village_id: null, ward_id: 2,  gram_panchayat_id: null, total_voters: 980,  verification_status: 'NOT_VERIFIED' },
      { id: 13, booth_number: 103, booth_name: 'Gadge Nagar School',            village_id: null, ward_id: 3,  gram_panchayat_id: null, total_voters: 1150, verification_status: 'NOT_VERIFIED' },
      { id: 14, booth_number: 104, booth_name: 'Dastur Nagar ZP School',        village_id: null, ward_id: 4,  gram_panchayat_id: null, total_voters: 900,  verification_status: 'NOT_VERIFIED' },
      { id: 15, booth_number: 105, booth_name: 'Jawahar Gate Municipal Office', village_id: null, ward_id: 5,  gram_panchayat_id: null, total_voters: 1080, verification_status: 'NOT_VERIFIED' },
      { id: 16, booth_number: 106, booth_name: 'Cotton Market Hall',            village_id: null, ward_id: 6,  gram_panchayat_id: null, total_voters: 750,  verification_status: 'NOT_VERIFIED' },
      { id: 17, booth_number: 107, booth_name: 'Shivaji Nagar School',          village_id: null, ward_id: 7,  gram_panchayat_id: null, total_voters: 1200, verification_status: 'NOT_VERIFIED' },
      { id: 18, booth_number: 108, booth_name: 'Ambapeth Primary School',       village_id: null, ward_id: 8,  gram_panchayat_id: null, total_voters: 870,  verification_status: 'NOT_VERIFIED' },
      { id: 19, booth_number: 109, booth_name: 'Benoda Community Center',       village_id: null, ward_id: 9,  gram_panchayat_id: null, total_voters: 960,  verification_status: 'NOT_VERIFIED' },
      { id: 20, booth_number: 110, booth_name: 'Rukhmini Nagar School',         village_id: null, ward_id: 10, gram_panchayat_id: null, total_voters: 1100, verification_status: 'NOT_VERIFIED' },
    ]);
  },

  async down(queryInterface) {
    // Delete in reverse FK order
    await queryInterface.bulkDelete('booths', null, {});
    await queryInterface.bulkDelete('wards', null, {});
    await queryInterface.bulkDelete('villages', null, {});
    await queryInterface.bulkDelete('gram_panchayats', null, {});
    await queryInterface.bulkDelete('talukas', null, {});
  },
};
