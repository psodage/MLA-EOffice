/**
 * convert_all_sample_data_to_english.cjs
 * Translates all Marathi strings in SAMPLE_DATA/ and SAMPLE_DATA/KOLHAPUR/ to English.
 *
 * Run: node src/convert_all_sample_data_to_english.cjs
 */

const fs = require('fs');
const path = require('path');

const ROOT_SAMPLE_DIR = path.resolve(__dirname, '../../SAMPLE_DATA');
const KOLHAPUR_SAMPLE_DIR = path.resolve(__dirname, '../../SAMPLE_DATA/KOLHAPUR');

// Comprehensive dictionary for replacing Marathi text with English in sample SQL files
const REPLACEMENTS = [
  // User Full Names
  { from: 'आ. राजेश नाईक', to: 'Hon. Rajesh Naik' },
  { from: 'सुनीता शिंदे', to: 'Sunita Shinde' },
  { from: 'सुरेश कांबळे', to: 'Suresh Kamble' },
  { from: 'मीरा पाटील', to: 'Meera Patil' },
  { from: 'गणपत चौगले', to: 'Ganpat Chaugule' },
  { from: 'विकास पाटील (Test Citizen)', to: 'Vikas Patil (Test Citizen)' },

  // Nivedan Citizen Names & Addresses
  { from: 'संगीता विठ्ठल पवार', to: 'Sangeeta Vithal Pawar' },
  { from: 'बाळकृष्ण नामदेव काळे', to: 'Balkrishna Namdev Kale' },
  { from: 'तुकाराम हरिभाऊ शेळके', to: 'Tukaram Haribhau Shelke' },
  { from: 'अर्चना दत्तात्रय देशपांडे', to: 'Archana Dattatray Deshpande' },
  { from: 'सचिन अनंत कुलकर्णी', to: 'Sachin Anant Kulkarni' },
  { from: 'वैशाली विनायक जोशी', to: 'Vaishali Vinayak Joshi' },
  { from: 'सुरेश भिकू माने', to: 'Suresh Bhiku Mane' },
  { from: 'रमेश मारुती चौगुले', to: 'Ramesh Maruti Chaugule' },
  { from: 'प्रकाश बळवंत सुतार', to: 'Prakash Balwant Sutar' },
  { from: 'गणेश रामचंद्र पाटील', to: 'Ganesh Ramchandra Patil' },
  { from: 'सुमन विनायक मोरे', to: 'Suman Vinayak More' },
  { from: 'प्रदीप ज्ञानदेव कदम', to: 'Pradeep Dnyandev Kadam' },
  { from: 'अजित बाळू चव्हाण', to: 'Ajit Balu Chavan' },
  { from: 'सुमना रमेश जाधव', to: 'Suman Ramesh Jadhav' },
  { from: 'प्रकाश विठ्ठल पाटील', to: 'Prakash Vithal Patil' },
  { from: 'मारुती रामचंद्र पाटील', to: 'Maruti Ramchandra Patil' },
  { from: 'रेखा विनायक माने', to: 'Rekha Vinayak Mane' },
  { from: 'संतोष दादा पाटील', to: 'Santosh Dada Patil' },
  { from: 'श्रीमती द्रौपदाबाई कदम', to: 'Mrs. Draupadabai Kadam' },
  { from: 'गोपाळ शंकर कांबळे', to: 'Gopal Shankar Kamble' },
  { from: 'श्रीमती शांताबाई माने', to: 'Mrs. Shantabai Mane' },
  { from: 'दिलीप भाऊराव शिंदे', to: 'Dilip Bhaurao Shinde' },
  { from: 'सविता प्रकाश कांबळे', to: 'Savita Prakash Kamble' },
  { from: 'सुनील ज्ञानदेव कांबळे', to: 'Sunil Dnyandev Kamble' },
  { from: 'अशोक बापूसाहेब माने', to: 'Ashok Bapusaheb Mane' },
  { from: 'संजय बाळकृष्ण पाटील', to: 'Sanjay Balakrishna Patil' },
  { from: 'दिपक रघुनाथ सूर्यवंशी', to: 'Deepak Raghunath Suryavanshi' },
  { from: 'गीता बाळकृष्ण माळकर', to: 'Geeta Balakrishna Malkar' },
  { from: 'विनोद रामचंद्र शेळके', to: 'Vinod Ramchandra Shelke' },
  { from: 'प्रमोद गजानन जोशी', to: 'Pramod Gajanan Joshi' },
  { from: 'सुरेश गणपत पवार', to: 'Suresh Ganpat Pawar' },
  { from: 'विष्णू पांडुरंग गायकवाड', to: 'Vishnu Pandurang Gaikwad' },
  { from: 'अनिल यशवंत शिंदे', to: 'Anil Yashwant Shinde' },
  { from: 'मीना सतीश काळे', to: 'Meena Satish Kale' },
  { from: 'रवींद्र किसन जाधव', to: 'Ravindra Kisan Jadhav' },
  { from: 'दीपक तानाजी थोरात', to: 'Deepak Tanaji Thorat' },
  { from: 'मंगेश मारुती जाधव', to: 'Mangesh Maruti Jadhav' },
  { from: 'प्रिया सचिन देशमुख', to: 'Priya Sachin Deshmukh' },
  { from: 'सुनील बाळकृष्ण मोरे', to: 'Sunil Balakrishna More' },
  { from: 'विजय बापुसाहेब भोसले', to: 'Vijay Bapusaheb Bhosale' },
  { from: 'आनंद विठ्ठल कांबळे', to: 'Anand Vithal Kamble' },
  { from: 'महेश ज्ञानदेव पोवार', to: 'Mahesh Dnyandev Powar' },
  { from: 'दिपक सर्जेराव गुरव', to: 'Deepak Sarjerao Gurav' },
  { from: 'सुजाता प्रकाश माने', to: 'Sujata Prakash Mane' },
  { from: 'पवित्र संभाजी घाटगे', to: 'Pavitra Sambhaji Ghatge' },
  { from: 'शिवाजी बापूजी कदम', to: 'Shivaji Bapuji Kadam' },
  { from: 'नितीन गणपत कांबळे', to: 'Nitin Ganpat Kamble' },
  { from: 'संतोष मारुती चौगुले', to: 'Santosh Maruti Chaugule' },
  { from: 'श्री.संदीप प्रकाश पाटील', to: 'Mr. Sandeep Prakash Patil' },

  // Addresses
  { from: 'प्लॉट क्र. १२, शिवाजी नगर, कुसुंबी', to: 'Plot No. 12, Shivaji Nagar, Kusumbi' },
  { from: 'घर क्र. ५, मेन रोड, बोपखेल', to: 'House No. 5, Main Road, Bopkhel' },
  { from: 'मौजे वरुडी, ता. करवीर', to: 'Varudi Village, Karveer Taluka' },
  { from: 'सर्वे नं. ४५, चिखलदरा रोड', to: 'Survey No. 45, Chikhaldara Road' },
  { from: 'शाहूनगर, कोल्हापूर', to: 'Shahunagar, Kolhapur' },
  { from: 'अवचीतनगर, करवीर', to: 'Avachitnagar, Karveer' },
  { from: 'राजारामपुरी ४ थी गल्ली', to: 'Rajarampuri 4th Lane' },
  { from: 'सांगवडे गाव', to: 'Sangavde Village' },
  { from: 'पाचगाव रस्ता, करवीर', to: 'Pachgaon Road, Karveer' },
  { from: 'नेर्ली गाव, ता. करवीर', to: 'Nerli Village, Karveer Taluka' },
  { from: 'राजेंद्रनगर, कोल्हापूर', to: 'Rajendranagar, Kolhapur' },
  { from: 'वसगडे गाव, करवीर', to: 'Vasagade Village, Karveer' },
  { from: 'नंदगाव, ता. करवीर', to: 'Nandgaon, Karveer Taluka' },
  { from: 'लक्ष्मी नगर, कोल्हापूर', to: 'Lakshmi Nagar, Kolhapur' },
  { from: 'अवचीतनगर, कोल्हापूर', to: 'Avachitnagar, Kolhapur' },
  { from: 'लक्षतीर्थ वसाहत, कोल्हापूर', to: 'Lakshatirth Colony, Kolhapur' },
  { from: 'तामगाव, ता. करवीर', to: 'Tamgaon, Karveer Taluka' },
  { from: 'वाशी गाव, करवीर', to: 'Vashi Village, Karveer' },
  { from: 'फुलेवाडी, कोल्हापूर', to: 'Phulewadi, Kolhapur' },
  { from: 'कसबा बावडा, कोल्हापूर', to: 'Kasaba Bawada, Kolhapur' },
  { from: 'वडकशिवाले, करवीर', to: 'Vadakshivale, Karveer' },
  { from: 'पाचगाव रोड, कोल्हापूर', to: 'Pachgaon Road, Kolhapur' },
  { from: 'शिवाजी पेठ, कोल्हापूर', to: 'Shivaji Peth, Kolhapur' },
  { from: 'कोल्हापूर', to: 'Kolhapur' },

  // Nivedan Subjects & Descriptions
  { from: 'गेल्या ३ दिवसांपासून पाणीपुरवठा बंद आहे', to: 'Water supply disruption for the last 3 days' },
  { from: 'आमच्या भागात गेल्या ३ दिवसांपासून पाण्याचा थेंबही येत नाही. नळ कोरडा आहे. घरात लहान मुले व वृद्ध आहेत. पाण्याशिवाय खूप अडचण होत आहे. कृपया तातडीने व्यवस्था करावी.', to: 'There has been no water supply in our area for the last 3 days. Taps are completely dry causing immense hardship for children and elderly. Kindly arrange immediate water tanker supply.' },
  { from: 'बोपखेल PHC मध्ये डॉक्टर गेल्या महिन्यापासून नाहीत', to: 'Doctor unavailable at Bopkhel Primary Health Centre for past month' },
  { from: 'बोपखेल प्राथमिक आरोग्य केंद्रात गेल्या महिन्यापासून डॉक्टर उपलब्ध नाहीत. आजारी रुग्णांना पुण्याला न्यावे लागते, ज्यासाठी खूप खर्च होतो. गरीब कुटुंबांसाठी हे परवडत नाही.', to: 'Doctors have been absent at Bopkhel Primary Health Centre for over a month. Sick patients are forced to travel to Pune at high cost. Kindly appoint a medical officer urgently.' },
  { from: 'पीक विमा दावा ३ महिन्यांपासून प्रलंबित आहे', to: 'Crop insurance claim pending for 3 months' },
  { from: 'गेल्या खरीप हंगामात अतिवृष्टीमुळे माझी सोयाबीन शेती पूर्णपणे नष्ट झाली. पीक विम्याचा दावा दाखल केला परंतु ३ महिने उलटले तरी अजून पैसे मिळाले नाहीत. कृपया मदत करावी.', to: 'Heavy rains completely destroyed soybean crops during last Kharif season. Crop insurance claim submitted 3 months ago remains pending. Kindly expedite payout.' },
  { from: 'चिखलदरा रस्त्यावर मोठे खड्डे — अपघाताची भीती', to: 'Dangerous potholes on Chikhaldara road' },
  { from: 'चिखलदरा ते मुळशी दरम्यानच्या रस्त्यावर इतके मोठे खड्डे पडले आहेत की दुचाकीस्वार घसरून पडत आहेत. गेल्या आठवड्यात दोन अपघात झाले. तातडीने डांबरीकरण व्हावे.', to: 'Huge potholes on Chikhaldara to Mulshi road are causing frequent two-wheeler accidents. Two crashes occurred last week. Immediate asphalt road repair required.' },
  { from: 'शाहूनगरातील अंतर्गत रस्त्यावर खड्डे', to: 'Potholes on internal roads in Shahunagar' },
  { from: 'शाहूनगर परिसरातील अंतर्गत रस्त्यांवर मोठे खड्डे पडले आहेत. पावसाळ्यात पाणी साचून डबकी झाली आहेत. तातडीने डांबरीकरण करावे.', to: 'Internal roads in Shahunagar have severe potholes filled with rainwater, making travel hazardous. Requesting urgent resurfacing and repairs.' },
  { from: 'प्राथमिक आरोग्य केंद्रात डॉक्टर उपलब्ध नाहीत', to: 'Doctor unavailable at Primary Health Centre' },
  { from: 'अवचीतनगर प्राथमिक आरोग्य केंद्रात दररोज रुग्ण येतात परंतु डॉक्टर उपस्थित नसतात. परिचारिकांमार्फतच उपचार सुरू आहेत. कायमस्वरूपी डॉक्टर नेमावा.', to: 'Avachitnagar Primary Health Centre lacks a attending doctor, forcing nurses to manage critical cases. Requesting full-time doctor placement.' },
  { from: 'राजारामपुरी भागात ४ दिवसांपासून पाणीपुरवठा बंद', to: 'Water supply disruption in Rajarampuri ward for 4 days' },
  { from: 'राजारामपुरी ४ थी गल्ली परिसरात मुख्य पाईपलाईन फुटल्याने ४ दिवसांपासून पाणीपुरवठा बंद आहे. तातडीने दुरुस्ती करून टँकरद्वारे पाणी द्यावे.', to: 'Main water pipeline burst in Rajarampuri 4th Lane leading to 4 days without water. Kindly arrange emergency repair and tanker supply.' },
  { from: 'सांगवडे गावात वारंवार वीज खंडन होते', to: 'Frequent power outages in Sangavde village' },
  { from: 'सांगवडे गावात दररोज ५ ते ६ तास अघोषित वीज खंडन होते. विद्यार्थ्यांना अभ्यासात व शेतकऱ्यांना शेतीपंपासाठी त्रास होत आहे. ट्रान्सफॉर्मरची क्षमता वाढवावी.', to: 'Sangavde village suffers 5-6 hours of daily unannounced load shedding, hampering student studies and farming pumps. Transformer upgrade requested.' },
  { from: 'पाचगाव जिल्हा परिषद शाळेत शिक्षक नाहीत', to: 'Lack of teachers in Pachgaon ZP Primary School' },
  { from: 'पाचगाव जि.प. प्राथमिक शाळेत वर्ग ५ वी ते ७ वी साठी गणित व विज्ञान विषयाचे शिक्षक नाहीत. मुलांचे शैक्षणिक नुकसान होत आहे. तातडीने शिक्षक नियुक्त करावेत.', to: 'Pachgaon ZP Primary School lacks Math and Science teachers for classes 5 to 7. Requesting immediate teacher deployment to prevent academic loss.' },
  { from: 'जमिनीचा सातबारा उतारा मिळत नाही', to: 'Delay in issuing 7/12 land extract document' },
  { from: 'नेर्ली येथील शेतजमिनीचा ७/१२ उतारा मिळवण्यासाठी ऑनलाइन अर्ज केला आहे. परंतु १ महिना उलटला तरी तलाठी कार्यालयातून उतारा मिळत नाही.', to: 'Online application for 7/12 land extract at Nerli village has been pending for over a month at Talathi office. Expedited issuance requested.' },
  { from: 'वृद्धापकाळ निवृत्तीवेतन ४ महिने थकबाकी', to: 'Pension arrears pending for 4 months' },
  { from: 'श्रावणबाळ निवृत्तीवेतन योजनेचे मागील ४ महिन्यांचे मानधन बँक खात्यात जमा झाले नाही. वृद्ध नागरिकांना औषधोपचारासाठी अडचणी येत आहेत.', to: 'Senior citizen Shravanbal pension scheme funds have not been credited for the past 4 months causing medical hardship. Requesting pension release.' },
  { from: 'नवीन रेशनकार्ड अर्ज प्रलंबित आहे', to: 'Pending new ration card application' },
  { from: 'वसगडे येथील गरीब कुटुंबाचा नवीन रेशनकार्ड अर्ज तहसीलदार कार्यालयात ३ महिन्यांपासून प्रलंबित आहे. धान्य मिळण्यास अडचण येत आहे.', to: 'Ration card application for an underprivileged family in Vasagade is pending at Tehsildar office for 3 months. Fast-track approval needed.' },
  { from: 'प्रधानमंत्री आवास योजना हप्ता मिळालेला नाही', to: 'Pending PMAY housing subsidy instalment' },
  { from: 'नंदगाव येथील लाभार्थी घराचे काम लवकरात लवकर पूर्ण करण्यासाठी PMAY योजनेचा दुसरा हप्ता त्वरित बँक खात्यात जमा करावा.', to: 'Second instalment of PMAY housing scheme for Nandgaon resident has not been credited. Requesting immediate disbursement to finish house.' },
  { from: 'गावात पिण्याच्या पाण्याचा टँकर सुरू करावा', to: 'Request to deploy drinking water tanker in village' },
  { from: 'उन्हाळ्यामुळे विहिरी कोरड्या पडल्या असून विहिरीचे पाणी आटले आहे. गावाला दिवसातून २ वेळेस टँकरद्वारे पाणीपुरवठा करावा.', to: 'Wells have dried up due to summer heat. Requesting twice-daily municipal water tanker delivery to the village.' },
  { from: 'शाळेची इमारत पडझड — तातडीने दुरुस्ती व्हावी', to: 'School building repair requirement' },
  { from: 'जि.प. प्राथमिक शाळा छताचे सिमेंट पत्रा फुटला असून पावसाळ्यात वर्गात पाणी साचते. अपघात होण्यापूर्वी छत दुरुस्त करावे.', to: 'ZP Primary School roof sheets are damaged causing rainwater leakage inside classrooms. Urgent roof repair requested before accidents occur.' },
  { from: 'बेकायदेशीर दारू विक्रीवर कडक कारवाई करावी', to: 'Action against illegal liquor sales in colony' },
  { from: 'लक्षतीर्थ वसाहतीत उघड्यावर अवैध दारूविक्री सुरू असून महिला व नागरिकांना नाहक त्रास होत आहे. पोलीस प्रशासनाने कडक कारवाई करावी.', to: 'Open illegal alcohol trade in Lakshatirth Colony is harassing local residents and women. Requesting strict police patrolling and crackdown.' },
  { from: 'सामुदायिक शौचालय स्वच्छतेचा अभाव', to: 'Community toilet sanitation maintenance' },
  { from: 'तामगाव येथील सार्वजनिक शौचालय नियमित साफ होत नाही. पाणी व दिव्यांची सोय नाही. ग्रामपंचायतीने त्वरित स्वच्छता करावी.', to: 'Community toilet in Tamgaon lacks regular cleaning, water supply, and lighting. Gram Panchayat intervention requested.' },
  { from: 'शेतीपंपासाठी रात्री ऐवजी दिवसा वीज मिळावी', to: 'Request for daytime agricultural power supply' },
  { from: 'शेतकऱ्यांना रात्रीच्या वेळी विजेचा पुरवठा होत असल्याने विहिरीवर पाणी सोडताना जंगली प्राण्यांची भीती असते. दिवसा ८ तास सलग वीज द्यावी.', to: 'Night-time power supply for agricultural pumps poses dangers from wild animals. Requesting 8 hours of uninterrupted daytime electricity.' },
  { from: 'स्मशानभूमी शेड व रस्ता बांधकाम करणेबाबत', to: 'Crematorium shed and access road construction' },
  { from: 'वाशी गावातील स्मशानभूमीत पावसाळ्यात अंत्यसंस्कार करताना अडचण येते. शेड उभारणी व पक्का रस्ता तयार करण्यासाठी निधी मंजूर करावा.', to: 'Rainy season creates severe difficulties at Vashi village crematorium due to absence of roof shed and paved road. Sanction of funds requested.' },
  { from: 'रस्त्यावरील विजेचे दिवे (स्ट्रीट लाईट) बसवणे', to: 'Installation of street lights on main road' },
  { from: 'फुलेवाडी मुख्य रस्त्यावर पथदिवे नसल्यामुळे रात्रीच्या वेळी अंधार असतो. चोरीच्या घटना वाढल्या आहेत. एलईडी स्ट्रीट लाईट बसवावेत.', to: 'Absence of street lights on Phulewadi main road causes darkness and theft risks. Requesting installation of LED street lights.' },
  { from: 'वडकशिवाले जि.प. शाळेला संगणक संच मिळणेबाबत', to: 'Request for computer sets for Vadakshivale ZP school' },
  { from: 'शाळेतील विद्यार्थ्यांना संगणक शिक्षण देण्यासाठी ५ नवीन कॉम्प्युटर संच व प्रिंटर आमदार फंडातून उपलब्ध करून द्यावेत.', to: 'Requesting 5 desktop computers and printer for Vadakshivale ZP School students under MLALAD funds for digital education.' },

  // Timeline / Status Notes
  { from: 'नागरिकाने दूरध्वनीद्वारे समस्या मांडली', to: 'Citizen reported issue via phone call' },
  { from: 'अधिकारी नियुक्त केला: सुरेश पाटील (PA)', to: 'Assigned official: Suresh Patil (PA)' },
  { from: 'पाणी पुरवठा विभागाकडे पत्र रवाना', to: 'Letter dispatched to Water Supply Department' },
  { from: 'संबंधित विभागाशी संपर्क साधून समस्येचा पाठपुरावा सुरू आहे.', to: 'Followed up with respective department for issue resolution.' },
  { from: 'नवीन पाणी टँकर रवाना करण्यात आला व समस्या सोडवली.', to: 'Dispatched emergency water tanker and resolved issue.' },

  // Inward Subjects & Organizations
  { from: 'जिल्हाधिकारी कार्यालय, कोल्हापूर', to: 'District Collector Office, Kolhapur' },
  { from: 'कार्यकारी अभियंता, PWD कोल्हापूर', to: 'Executive Engineer, PWD Kolhapur' },
  { from: 'तहसीलदार कार्यालय, करवीर', to: 'Tehsildar Office, Karveer' },
  { from: 'शिक्षणाधिकारी (प्राथमिक), जि.प. कोल्हापूर', to: 'Education Officer (Primary), ZP Kolhapur' },
  { from: 'कार्यकारी अभियंता, महावितरण कोल्हापूर', to: 'Executive Engineer, MSEDCL Kolhapur' },
  { from: 'गट विकास अधिकारी, करवीर', to: 'Block Development Officer, Karveer' },
  { from: 'जिल्हा आरोग्य अधिकारी, कोल्हापूर', to: 'District Health Officer, Kolhapur' },
  { from: 'अध्यक्ष, गाव विकास समिती, सांगवडे', to: 'President, Village Dev Committee, Sangavde' },
  { from: 'सरपंच, ग्रामपंचायत नेर्ली', to: 'Sarpanch, Gram Panchayat Nerli' },
  { from: 'जिल्हा नियोजन अधिकारी, कोल्हापूर', to: 'District Planning Officer, Kolhapur' },
  { from: 'कार्यकारी अभियंता, जलसंपदा विभाग', to: 'Executive Engineer, Water Resources Department' },
  { from: 'मुख्य कार्यकारी अधिकारी, जि.प. कोल्हापूर', to: 'Chief Executive Officer, ZP Kolhapur' },
  { from: 'जिल्हा पुरवठा अधिकारी, कोल्हापूर', to: 'District Supply Officer, Kolhapur' },
  { from: 'जिल्हा समाजकल्याण अधिकारी, कोल्हापूर', to: 'District Social Welfare Officer, Kolhapur' },
  { from: 'पोलीस अधीक्षक, कोल्हापूर', to: 'Superintendent of Police, Kolhapur' },

  // Outward Subjects & Content
  { from: 'कार्यकारी अभियंता, महावितरण', to: 'Executive Engineer, MSEDCL' },
  { from: 'सांगवडे गावातील वीज खंडन समस्येबाबत तातडीने उपाययोजना करणेबाबत.', to: 'Urgent measures for power supply restoration in Sangavde village.' },
  { from: 'महोदय, कोल्हापूर दक्षिण मतदारसंघातील सांगवडे गावातील ग्रामस्थांनी सादर केलेल्या निवेदनानुसार गावात वारंवार वीज पुरवठा खंडित होत आहे. तरी तातडीने योग्य ती दुरुस्ती करून नियमित वीज पुरवठा सुरू करावा.', to: 'Sir, as per petition received from residents of Sangavde village in Kolhapur South constituency, power outages are frequent. Kindly carry out immediate repairs and ensure continuous electricity.' },
  { from: 'तहसीलदार, करवीर', to: 'Tehsildar, Karveer' },
  { from: 'नेर्ली येथील शेतजमिनीचे ७/१२ उतारे वेळेवर मिळणेबाबत.', to: 'Timely issuance of 7/12 land extracts in Nerli.' },
  { from: 'महोदय, नेर्ली गावातील शेतकरी श्री. संतोष दादा पाटील यांनी सादर केलेल्या निवेदनानुसार जमिनीचा सातबारा उतारा मिळण्यास विलंब होत आहे. त्वरित कारवाई करून ७/१२ उतारा देण्यात यावा.', to: 'Sir, as per representation by farmer Mr. Santosh Dada Patil of Nerli village, 7/12 land extract issuance is delayed. Kindly expedite and issue the land document.' },
  { from: 'पाचगाव जिल्हा परिषद शाळेत शिक्षकांची नियुक्ती करणेबाबत.', to: 'Appointment of teachers in Pachgaon ZP Primary School.' },
  { from: 'महोदय, पाचगाव जि.प. शाळेत वर्ग ५ ते ७ साठी शिक्षक उपलब्ध नसल्यामुळे विद्यार्थ्यांचे शैक्षणिक नुकसान होत आहे. तात्पुरत्या किंवा कायमस्वरूपी शिक्षकांची नियुक्ती करावी.', to: 'Sir, absence of teachers for classes 5 to 7 at Pachgaon ZP School is hampering education. Kindly appoint permanent or temporary teachers immediately.' },
  { from: 'वृद्धापकाळ निवृत्तीवेतन थकबाकी जमा करणेबाबत.', to: 'Disbursement of senior citizen pension arrears.' },
  { from: 'महोदय, राजेंद्रनगर येथील श्रीमती द्रौपदाबाई कदम यांचे मागील ४ महिन्यांचे वृद्धापकाळ निवृत्तीवेतन खात्यात जमा झाले नाही. कृपया सदर रक्कम तात्काळ मंजूर करून वितरित करावी.', to: 'Sir, senior citizen pension for Mrs. Draupadabai Kadam of Rajendranagar has been delayed for 4 months. Kindly sanction and credit the pension arrears.' },
  { from: 'वसगडे येथील नागरिकांचे नवीन रेशनकार्ड मंजूर करणेबाबत.', to: 'Approval of new ration cards for citizens in Vasagade.' },
  { from: 'महोदय, वसगडे येथील श्री. गोपाळ शंकर कांबळे यांचा रेशनकार्ड अर्ज प्रलंबित आहे. कुटुंबास धान्याचा लाभ मिळण्यासाठी तातडीने रेशनकार्ड वितरीत करावे.', to: 'Sir, ration card application of Mr. Gopal Shankar Kamble of Vasagade is pending. Kindly issue ration card so the family gets subsidized food grains.' },
  { from: 'प्रधानमंत्री आवास योजना हप्ता वितरणबाबत.', to: 'Release of PMAY housing subsidy instalment.' },
  { from: 'महोदय, नंदगाव येथील श्रीमती शांताबाई माने यांच्या अपूर्ण घरासाठी पुढील अनुदानाचा हप्ता तातडीने वर्ग करण्यात यावा.', to: 'Sir, kindly release the next financial instalment of PMAY housing scheme for Mrs. Shantabai Mane of Nandgaon to complete construction.' },
  { from: 'लक्षतीर्थ वसाहत परिसरातील अवैध दारूविक्रीवर कठोर कारवाईबाबत.', to: 'Strict action against illegal alcohol sales in Lakshatirth Colony.' },
  { from: 'महोदय, लक्षतीर्थ वसाहतीत उघड्यावर चालणाऱ्या अवैध दारूविक्रीमुळे स्थानिक नागरिक त्रस्त आहेत. परिसरात गस्त वाढवून कडक कारवाई करावी.', to: 'Sir, open illegal alcohol sale in Lakshatirth Colony is causing distress to residents. Kindly increase police patrolling and take strict legal action.' },
  { from: 'तामगाव येथील सामुदायिक शौचालय दुरुस्तीसाठी निधी देण्याबाबत.', to: 'Sanction of funds for community toilet repairs in Tamgaon.' },
  { from: 'महोदय, तामगाव येथील बंद असलेले सामुदायिक शौचालय दुरुस्त करून तातडीने वापरायोग्य करावे.', to: 'Sir, kindly repair the non-functional community toilet at Tamgaon village and restore water and light facilities.' },
  { from: 'राजारामपुरी मुख्य रस्त्यावरील खड्डे बुजविणेबाबत.', to: 'Repair of potholes on Rajarampuri main road.' },
  { from: 'महोदय, राजारामपुरी परिसरातील मुख्य रस्त्यावर पडलेले खड्डे पावसाळ्यापूर्वी डांबरीकरणाने बुजवून घ्यावेत.', to: 'Sir, kindly fill and asphalt dangerous potholes on Rajarampuri main road prior to monsoon.' },
  { from: 'अवचीतनगर प्राथमिक आरोग्य केंद्रात डॉक्टर नियुक्तीबाबत.', to: 'Appointment of doctor at Avachitnagar Primary Health Centre.' },
  { from: 'महोदय, अवचीतनगर आरोग्य केंद्रात नियमित वैद्यकीय अधिकारी उपस्थित राहतील अशी व्यवस्था करावी.', to: 'Sir, kindly ensure regular attendance of medical officer at Avachitnagar Primary Health Centre.' },
  { from: 'राधानगरी धरण पाणी साठा व सिंचन आवर्तन पत्र.', to: 'Radhanagari Dam water storage and irrigation rotation schedule.' },
  { from: 'महोदय, ऑगस्ट महिन्यात शेतीपंपासाठी राधानगरी धरणातून योग्य प्रमाणात सिंचन आवर्तन सोडण्याबाबत मागणी.', to: 'Sir, request to release adequate irrigation rotation water from Radhanagari Dam for agricultural pumps in August.' },
  { from: '२०२६-२७ जिल्हा नियोजन निधी प्रस्तावांचे शिफारस पत्र.', to: 'Recommendation letter for 2026-27 District Planning Fund proposals.' },
  { from: 'महोदय, कोल्हापूर दक्षिण मतदारसंघातील १० विकासकामांचे प्रस्ताव जिल्हा नियोजन समितीकडे मंजुरीसाठी पाठवत आहे.', to: 'Sir, submitting recommendation letter for 10 key infrastructure development proposals for Kolhapur South constituency under DPC funds.' },
  { from: 'बचत गटांच्या थकीत कर्ज सवलत अर्जाबाबत शिफारस पत्र.', to: 'Recommendation letter for women self-help group loan restructuring.' },
  { from: 'महोदय, नेर्ली गावातील महिला बचत गटांना थकीत कर्जावर सवलत व पुनर्गठन देण्याबाबत सकारात्मक विचार व्हावा.', to: 'Sir, recommending favorable consideration of loan restructuring and interest relief for women SHGs in Nerli village.' },
  { from: 'वडकशिवाले शाळेत डिजिटल संगणक संच पुरविणेबाबत.', to: 'Provision of digital computer sets for Vadakshivale School.' },
  { from: 'महोदय, वडकशिवाले जि.प. प्राथमिक शाळेत लोकसहभाग व शासनाच्या योजनेतून संगणक उपलब्ध करून द्यावेत.', to: 'Sir, recommending provision of 5 computer sets for Vadakshivale ZP Primary School under MLALAD funds.' },
  { from: 'पंचगंगा नदी प्रदूषण व नियंत्रण तातडीची बैठक पत्र.', to: 'Urgent meeting request regarding Panchganga river pollution control.' },
  { from: 'महोदय, पंचगंगा नदीतील प्रदूषण वाढल्याने कोल्हापूर दक्षिण मतदारसंघातील गावांमध्ये पिण्याच्या पाण्याचा प्रश्न गंभीर बनला आहे. यावर तातडीने बैठक आयोजित करावी.', to: 'Sir, rising pollution in Panchganga river has triggered severe drinking water crises in riverside villages. Requesting an urgent review meeting.' },

  // Development Works Titles & Descriptions
  { from: 'NH-4 जंक्शन रस्ता रुंदीकरण व डांबरीकरण', to: 'NH-4 Junction Road Widening & Asphalt Paving' },
  { from: 'वडगाव ग्रामपंचायत नवीन पाणीपुरवठा टाकी बांधणे', to: 'Wadgaon Village New Overhead Water Tank Construction' },
  { from: 'कोल्हापूर सीपीआर रुग्णालय नवीन विभाग विस्तार', to: 'Sub-District Hospital CPR Extension Ward' },
  { from: 'जि.प. शाळा सौर ऊर्जा प्रकल्प बसवणे', to: 'Zilla Parishad Primary School Solarization Project' },
  { from: 'शाहूनगर जलनिस्सारण गटार लाईन बांधणे', to: 'Shahunagar Underground Drainage Pipeline Project' },
  { from: 'राजारामपुरी सार्वजनिक क्रीडा संकुल उभारणी', to: 'Rajarampuri Public Sports Complex Construction' },
  { from: 'उचगाव प्राथमिक आरोग्य केंद्र इमारत दुरुस्ती', to: 'Uchgaon Primary Health Centre Building Renovation' },
  { from: 'सांगवडे गाव जोड रस्ता डांबरीकरण', to: 'Sangavde Village Connecting Road Asphalt Work' },
  { from: 'नेर्ली गाव सामुदायिक समाजमंदिर बांधकाम', to: 'Nerli Village Community Hall Construction' },
  { from: 'वसगडे पिण्याच्या पाण्याची पाईपलाईन बदलणे', to: 'Vasagade Drinking Water Pipeline Replacement' },
  { from: 'कामापूर्वीची परिस्थिती', to: 'Site Condition Before Construction' },
  { from: 'काम सुरू असताना', to: 'Work Progress During Execution' },
  { from: 'पूर्ण झालेली पाणी टाकी (जून २०२६)', to: 'Completed Overhead Water Tank (June 2026)' },

  // Visitors Purpose
  { from: 'सामान्य चौकशी', to: 'General Inquiry' },
  { from: 'वैयक्तिक काम', to: 'Personal Work' },
  { from: 'तक्रार निवारण', to: 'Grievance Redressal' },
  { from: 'विकास कामे मागण्या', to: 'Development Work Request' },
  { from: 'निमंत्रण पत्र देणे', to: 'Event Invitation Delivery' },
  { from: 'आभार व्यक्त करणे', to: 'Courtesy Visit & Thanks' },

  // Calendar Events
  { from: 'राधानगरी धरण पाहणी दौरा', to: 'Radhanagari Dam Inspection Tour' },
  { from: 'पाणी वाटप आणि जलसाठा आढाव्यासाठी राधानगरी धरण भेट. जलसंपदा विभागाचे अधिकारी सोबत.', to: 'Radhanagari Dam visit for water distribution and storage audit with Water Resources Dept officials.' },
  { from: 'करवीर तालुका कार्यकर्ता मेळावा', to: 'Karveer Taluka Karyakarta Convention' },
  { from: 'करवीर तालुक्यातील बूथ प्रमुख, शक्तीकेंद्र प्रमुख आणि कार्यकर्त्यांचा मासिक मेळावा.', to: 'Monthly convention of booth pramukhs and party workers in Karveer taluka.' },
  { from: 'जिल्हा नियोजन समिती बैठक', to: 'District Planning Committee Meeting' },
  { from: '२०२६-२७ वार्षिक योजना आराखड्यावर जिल्हा नियोजन समिती बैठक. कोल्हापूर दक्षिण मतदारसंघाचे प्रस्ताव सादर करायचे आहेत.', to: 'District Planning Committee meeting on 2026-27 annual plan. Proposals for Kolhapur South constituency to be submitted.' },
  { from: 'लक्षतीर्थ वसाहत — जनसंपर्क दिवस', to: 'Lakshatirth Colony — Public Outreach Day' },
  { from: 'लक्षतीर्थ वसाहत परिसरात जनसंपर्क कार्यक्रम. नागरिकांच्या तक्रारी ऐकणे व मदत करणे.', to: 'Public outreach program in Lakshatirth Colony area. Listening to citizen grievances and assisting.' },
  { from: 'स्वातंत्र्य दिन ध्वजारोहण कार्यक्रम', to: 'Independence Day Flag Hoisting Ceremony' },
  { from: '१५ ऑगस्ट स्वातंत्र्य दिन निमित्त ध्वजारोहण व सांस्कृतिक कार्यक्रम. शाळा विद्यार्थी व नागरिकांचा सहभाग.', to: 'Flag hoisting and cultural program on 15th August Independence Day. Participation of school students and citizens.' },
  { from: 'राधानगरी धरण, कोल्हापूर', to: 'Radhanagari Dam, Kolhapur' },
  { from: 'करवीर पंचायत समिती सभागृह, कोल्हापूर', to: 'Karveer Panchayat Samiti Hall, Kolhapur' },
  { from: 'जिल्हाधिकारी कार्यालय, कोल्हापूर', to: 'District Collector Office, Kolhapur' },
  { from: 'लक्षतीर्थ वसाहत सामुदायिक सभागृह, कोल्हापूर', to: 'Lakshatirth Colony Community Hall, Kolhapur' },
  { from: 'शाहूनगर मैदान, कोल्हापूर', to: 'Shahunagar Ground, Kolhapur' },

  // Common designation / roles
  { from: 'कार्यकारी अभियंता', to: 'Executive Engineer' },
  { from: 'तहसीलदार', to: 'Tehsildar' },
  { from: 'शिक्षणाधिकारी', to: 'Education Officer' },
  { from: 'जिल्हा समाजकल्याण अधिकारी', to: 'District Social Welfare Officer' },
  { from: 'जिल्हा पुरवठा अधिकारी', to: 'District Supply Officer' },
  { from: 'नोडल अधिकारी', to: 'Nodal Officer' },
  { from: 'पोलीस निरीक्षक', to: 'Inspector of Police' },
  { from: 'गट विकास अधिकारी', to: 'Block Development Officer' },
  { from: 'जिल्हा आरोग्य अधिकारी', to: 'District Health Officer' },
  { from: 'जिल्हा नियोजन अधिकारी', to: 'District Planning Officer' },
  { from: 'शाखा व्यवस्थापक', to: 'Branch Manager' },
  { from: 'गट शिक्षण अधिकारी', to: 'Block Education Officer' },
  { from: 'जिल्हाधिकारी', to: 'District Collector' },
  { from: 'अध्यक्ष', to: 'President' },
  { from: 'सरपंच', to: 'Sarpanch' },
  { from: 'सदस्य', to: 'Member' },
  { from: 'ग्रामसेवक', to: 'Gram Sevak' },
];

function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.sql'));

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    let content = fs.readFileSync(fullPath, 'utf8');

    let count = 0;
    for (const r of REPLACEMENTS) {
      if (content.includes(r.from)) {
        content = content.split(r.from).join(r.to);
        count++;
      }
    }

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Updated ${file} in ${path.relative(__dirname, dirPath)} (${count} terms replaced)`);
  }
}

console.log('🚀 Starting conversion of sample SQL files from Marathi to English...');
processDirectory(ROOT_SAMPLE_DIR);
processDirectory(KOLHAPUR_SAMPLE_DIR);
console.log('🎉 All sample data files successfully converted to English!');
