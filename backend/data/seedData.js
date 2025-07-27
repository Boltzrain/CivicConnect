const seedDepartments = [
  // Mumbai Departments
  {
    city: "Mumbai",
    issueType: "Water",
    name: "Municipal Water Department - Mumbai",
    contactEmail: "water.complaints@mumbai.gov.in",
    contactPhone: "+91-22-2266-8899",
    address: "Hydraulic Engineer's Office, 2nd Floor, Municipal Building, Fort, Mumbai - 400001",
    website: "https://portal.mcgm.gov.in",
    workingHours: "9:00 AM - 6:00 PM (Mon-Fri)"
  },
  {
    city: "Mumbai",
    issueType: "Electricity",
    name: "Mumbai Electric Department - BEST",
    contactEmail: "electricity@bestundertaking.com",
    contactPhone: "+91-22-2266-7788",
    address: "BEST House, Colaba, Mumbai - 400005",
    website: "https://www.bestundertaking.com",
    workingHours: "24/7 Emergency Services"
  },
  {
    city: "Mumbai",
    issueType: "Road",
    name: "Public Works Department - Mumbai",
    contactEmail: "roads@mumbai.gov.in",
    contactPhone: "+91-22-2266-6677",
    address: "PWD Office, Worli, Mumbai - 400018",
    website: "https://portal.mcgm.gov.in",
    workingHours: "9:00 AM - 5:00 PM (Mon-Fri)"
  },
  {
    city: "Mumbai",
    issueType: "Sanitation",
    name: "Solid Waste Management Department - Mumbai",
    contactEmail: "sanitation@mumbai.gov.in",
    contactPhone: "+91-22-2266-5566",
    address: "SWM Office, Dadar, Mumbai - 400014",
    website: "https://portal.mcgm.gov.in",
    workingHours: "24/7 Services"
  },
  {
    city: "Mumbai",
    issueType: "Street Lights",
    name: "Street Lighting Department - Mumbai",
    contactEmail: "streetlights@mumbai.gov.in",
    contactPhone: "+91-22-2266-4455",
    address: "Electrical Department, BMC Building, Mumbai - 400001",
    website: "https://portal.mcgm.gov.in",
    workingHours: "9:00 AM - 6:00 PM (Mon-Fri)"
  },
  {
    city: "Mumbai",
    issueType: "Garbage Collection",
    name: "Waste Management Department - Mumbai",
    contactEmail: "waste@mumbai.gov.in",
    contactPhone: "+91-22-2266-3344",
    address: "Waste Management Office, Bandra, Mumbai - 400050",
    website: "https://portal.mcgm.gov.in",
    workingHours: "6:00 AM - 10:00 PM (Daily)"
  },
  {
    city: "Mumbai",
    issueType: "Public Transport",
    name: "BEST Transport Department",
    contactEmail: "transport@bestundertaking.com",
    contactPhone: "+91-22-2266-2233",
    address: "BEST Transport Division, Mumbai - 400005",
    website: "https://www.bestundertaking.com",
    workingHours: "24/7 Services"
  },
  {
    city: "Mumbai",
    issueType: "Parks",
    name: "Parks and Gardens Department - Mumbai",
    contactEmail: "parks@mumbai.gov.in",
    contactPhone: "+91-22-2266-1122",
    address: "Garden Department, Shivaji Park, Mumbai - 400016",
    website: "https://portal.mcgm.gov.in",
    workingHours: "6:00 AM - 6:00 PM (Daily)"
  },
  {
    city: "Mumbai",
    issueType: "Noise Pollution",
    name: "Pollution Control Department - Mumbai",
    contactEmail: "pollution@mumbai.gov.in",
    contactPhone: "+91-22-2266-0011",
    address: "Environment Department, BMC, Mumbai - 400001",
    website: "https://portal.mcgm.gov.in",
    workingHours: "9:00 AM - 5:00 PM (Mon-Fri)"
  },
  {
    city: "Mumbai",
    issueType: "Other",
    name: "General Municipal Office - Mumbai",
    contactEmail: "general@mumbai.gov.in",
    contactPhone: "+91-22-2266-0000",
    address: "Municipal Commissioner Office, Mumbai - 400001",
    website: "https://portal.mcgm.gov.in",
    workingHours: "9:00 AM - 5:00 PM (Mon-Fri)"
  },

  // Delhi Departments
  {
    city: "Delhi",
    issueType: "Water",
    name: "Delhi Jal Board",
    contactEmail: "complaints@delhijalboard.delhi.gov.in",
    contactPhone: "+91-11-2345-6789",
    address: "Varunalaya Phase-II, Karol Bagh, New Delhi - 110005",
    website: "https://www.delhijalboard.nic.in",
    workingHours: "9:00 AM - 5:00 PM (Mon-Fri)"
  },
  {
    city: "Delhi",
    issueType: "Electricity",
    name: "Delhi Electricity Regulatory Commission",
    contactEmail: "electricity@derc.gov.in",
    contactPhone: "+91-11-2345-6788",
    address: "DERC Building, Vinay Marg, Chanakyapuri, New Delhi - 110021",
    website: "https://www.derc.gov.in",
    workingHours: "24/7 Emergency Services"
  },
  {
    city: "Delhi",
    issueType: "Road",
    name: "Public Works Department - Delhi",
    contactEmail: "pwd@delhi.gov.in",
    contactPhone: "+91-11-2345-6787",
    address: "PWD Building, IP Estate, New Delhi - 110002",
    website: "https://pwd.delhi.gov.in",
    workingHours: "9:00 AM - 5:00 PM (Mon-Fri)"
  },
  {
    city: "Delhi",
    issueType: "Sanitation",
    name: "Municipal Corporation of Delhi - Sanitation",
    contactEmail: "sanitation@mcdonline.gov.in",
    contactPhone: "+91-11-2345-6786",
    address: "MCD Building, Town Hall, Delhi - 110006",
    website: "https://mcdonline.gov.in",
    workingHours: "24/7 Services"
  },
  {
    city: "Delhi",
    issueType: "Street Lights",
    name: "Street Lighting Department - Delhi",
    contactEmail: "streetlights@delhi.gov.in",
    contactPhone: "+91-11-2345-6785",
    address: "Electrical Division, Secretariat, Delhi - 110054",
    website: "https://delhi.gov.in",
    workingHours: "9:00 AM - 6:00 PM (Mon-Fri)"
  },
  {
    city: "Delhi",
    issueType: "Garbage Collection",
    name: "East Delhi Municipal Corporation",
    contactEmail: "waste@eastdelhi.gov.in",
    contactPhone: "+91-11-2345-6784",
    address: "EDMC Building, Preet Vihar, Delhi - 110092",
    website: "https://eastdelhi.gov.in",
    workingHours: "6:00 AM - 10:00 PM (Daily)"
  },
  {
    city: "Delhi",
    issueType: "Public Transport",
    name: "Delhi Transport Corporation",
    contactEmail: "dtc@delhi.gov.in",
    contactPhone: "+91-11-2345-6783",
    address: "DTC Building, IP Estate, New Delhi - 110002",
    website: "https://dtc.delhi.gov.in",
    workingHours: "24/7 Services"
  },
  {
    city: "Delhi",
    issueType: "Parks",
    name: "Horticulture Department - Delhi",
    contactEmail: "parks@delhi.gov.in",
    contactPhone: "+91-11-2345-6782",
    address: "Udyog Bhawan, New Delhi - 110011",
    website: "https://delhi.gov.in",
    workingHours: "6:00 AM - 6:00 PM (Daily)"
  },
  {
    city: "Delhi",
    issueType: "Noise Pollution",
    name: "Delhi Pollution Control Committee",
    contactEmail: "dpcc@delhi.gov.in",
    contactPhone: "+91-11-2345-6781",
    address: "ISBT Building, Kashmere Gate, Delhi - 110006",
    website: "https://dpcc.delhigovt.nic.in",
    workingHours: "9:00 AM - 5:00 PM (Mon-Fri)"
  },
  {
    city: "Delhi",
    issueType: "Other",
    name: "Delhi Secretariat - General",
    contactEmail: "general@delhi.gov.in",
    contactPhone: "+91-11-2345-6780",
    address: "Delhi Secretariat, IP Estate, New Delhi - 110002",
    website: "https://delhi.gov.in",
    workingHours: "9:00 AM - 5:00 PM (Mon-Fri)"
  },

  // Bangalore Departments
  {
    city: "Bangalore",
    issueType: "Water",
    name: "Bangalore Water Supply and Sewerage Board",
    contactEmail: "complaints@bwssb.gov.in",
    contactPhone: "+91-80-4567-8901",
    address: "BWSSB Building, Cauvery Bhavan, K.G. Road, Bangalore - 560009",
    website: "https://www.bwssb.gov.in",
    workingHours: "9:00 AM - 5:00 PM (Mon-Fri)"
  },
  {
    city: "Bangalore",
    issueType: "Electricity",
    name: "Bangalore Electricity Supply Company",
    contactEmail: "complaints@bescom.co.in",
    contactPhone: "+91-80-4567-8902",
    address: "BESCOM Corporate Office, K.R. Circle, Bangalore - 560001",
    website: "https://bescom.co.in",
    workingHours: "24/7 Emergency Services"
  },
  {
    city: "Bangalore",
    issueType: "Road",
    name: "Bruhat Bengaluru Mahanagara Palike - Roads",
    contactEmail: "roads@bbmp.gov.in",
    contactPhone: "+91-80-4567-8903",
    address: "BBMP Head Office, N.R. Square, Bangalore - 560002",
    website: "https://bbmp.gov.in",
    workingHours: "9:00 AM - 5:00 PM (Mon-Fri)"
  },
  {
    city: "Bangalore",
    issueType: "Sanitation",
    name: "Solid Waste Management - BBMP",
    contactEmail: "sanitation@bbmp.gov.in",
    contactPhone: "+91-80-4567-8904",
    address: "SWM Office, BBMP, Bangalore - 560002",
    website: "https://bbmp.gov.in",
    workingHours: "24/7 Services"
  },
  {
    city: "Bangalore",
    issueType: "Street Lights",
    name: "Street Lighting Department - BBMP",
    contactEmail: "streetlights@bbmp.gov.in",
    contactPhone: "+91-80-4567-8905",
    address: "Electrical Section, BBMP, Bangalore - 560002",
    website: "https://bbmp.gov.in",
    workingHours: "9:00 AM - 6:00 PM (Mon-Fri)"
  },
  {
    city: "Bangalore",
    issueType: "Garbage Collection",
    name: "Waste Management - BBMP",
    contactEmail: "waste@bbmp.gov.in",
    contactPhone: "+91-80-4567-8906",
    address: "Waste Management Office, BBMP, Bangalore - 560002",
    website: "https://bbmp.gov.in",
    workingHours: "6:00 AM - 10:00 PM (Daily)"
  },
  {
    city: "Bangalore",
    issueType: "Public Transport",
    name: "Bangalore Metropolitan Transport Corporation",
    contactEmail: "complaints@bmtc.co.in",
    contactPhone: "+91-80-4567-8907",
    address: "BMTC Building, Shantinagar, Bangalore - 560027",
    website: "https://www.mybmtc.com",
    workingHours: "24/7 Services"
  },
  {
    city: "Bangalore",
    issueType: "Parks",
    name: "Horticulture Department - BBMP",
    contactEmail: "parks@bbmp.gov.in",
    contactPhone: "+91-80-4567-8908",
    address: "Horticulture Wing, BBMP, Bangalore - 560002",
    website: "https://bbmp.gov.in",
    workingHours: "6:00 AM - 6:00 PM (Daily)"
  },
  {
    city: "Bangalore",
    issueType: "Noise Pollution",
    name: "Karnataka State Pollution Control Board",
    contactEmail: "pollution@kspcb.gov.in",
    contactPhone: "+91-80-4567-8909",
    address: "KSPCB Building, Paryavaran Bhavan, Bangalore - 560010",
    website: "https://kspcb.gov.in",
    workingHours: "9:00 AM - 5:00 PM (Mon-Fri)"
  },
  {
    city: "Bangalore",
    issueType: "Other",
    name: "BBMP General Office",
    contactEmail: "general@bbmp.gov.in",
    contactPhone: "+91-80-4567-8910",
    address: "BBMP Commissioner Office, Bangalore - 560002",
    website: "https://bbmp.gov.in",
    workingHours: "9:00 AM - 5:00 PM (Mon-Fri)"
  },

  // Chennai Departments
  {
    city: "Chennai",
    issueType: "Water",
    name: "Chennai Metropolitan Water Supply",
    contactEmail: "complaints@chennaimetrowater.gov.in",
    contactPhone: "+91-44-2345-6789",
    address: "Metro Water Building, Chintadripet, Chennai - 600002",
    website: "https://www.chennaimetrowater.gov.in",
    workingHours: "9:00 AM - 5:00 PM (Mon-Fri)"
  },
  {
    city: "Chennai",
    issueType: "Electricity",
    name: "Tamil Nadu Electricity Board",
    contactEmail: "complaints@tneb.gov.in",
    contactPhone: "+91-44-2345-6788",
    address: "TNEB Building, Anna Salai, Chennai - 600002",
    website: "https://www.tnebnet.org",
    workingHours: "24/7 Emergency Services"
  },
  {
    city: "Chennai",
    issueType: "Road",
    name: "Greater Chennai Corporation - Roads",
    contactEmail: "roads@chennai.gov.in",
    contactPhone: "+91-44-2345-6787",
    address: "Corporation Building, Parry's Corner, Chennai - 600001",
    website: "https://www.chennaicorporation.gov.in",
    workingHours: "9:00 AM - 5:00 PM (Mon-Fri)"
  },
  {
    city: "Chennai",
    issueType: "Sanitation",
    name: "Chennai Corporation - Sanitation",
    contactEmail: "sanitation@chennai.gov.in",
    contactPhone: "+91-44-2345-6786",
    address: "Health Department, Corporation Building, Chennai - 600001",
    website: "https://www.chennaicorporation.gov.in",
    workingHours: "24/7 Services"
  },
  {
    city: "Chennai",
    issueType: "Street Lights",
    name: "Street Lighting Department - Chennai",
    contactEmail: "streetlights@chennai.gov.in",
    contactPhone: "+91-44-2345-6785",
    address: "Electrical Section, Corporation Building, Chennai - 600001",
    website: "https://www.chennaicorporation.gov.in",
    workingHours: "9:00 AM - 6:00 PM (Mon-Fri)"
  },
  {
    city: "Chennai",
    issueType: "Garbage Collection",
    name: "Waste Management - Chennai Corporation",
    contactEmail: "waste@chennai.gov.in",
    contactPhone: "+91-44-2345-6784",
    address: "SWM Department, Chennai Corporation, Chennai - 600001",
    website: "https://www.chennaicorporation.gov.in",
    workingHours: "6:00 AM - 10:00 PM (Daily)"
  },
  {
    city: "Chennai",
    issueType: "Public Transport",
    name: "Metropolitan Transport Corporation",
    contactEmail: "mtc@chennai.gov.in",
    contactPhone: "+91-44-2345-6783",
    address: "MTC Building, Pallavan Salai, Chennai - 600002",
    website: "https://www.mtcbus.org",
    workingHours: "24/7 Services"
  },
  {
    city: "Chennai",
    issueType: "Parks",
    name: "Parks and Recreation - Chennai",
    contactEmail: "parks@chennai.gov.in",
    contactPhone: "+91-44-2345-6782",
    address: "Parks Department, Corporation Building, Chennai - 600001",
    website: "https://www.chennaicorporation.gov.in",
    workingHours: "6:00 AM - 6:00 PM (Daily)"
  },
  {
    city: "Chennai",
    issueType: "Noise Pollution",
    name: "Tamil Nadu Pollution Control Board",
    contactEmail: "pollution@tnpcb.gov.in",
    contactPhone: "+91-44-2345-6781",
    address: "TNPCB Building, Guindy, Chennai - 600032",
    website: "https://tnpcb.gov.in",
    workingHours: "9:00 AM - 5:00 PM (Mon-Fri)"
  },
  {
    city: "Chennai",
    issueType: "Other",
    name: "Chennai Corporation - General",
    contactEmail: "general@chennai.gov.in",
    contactPhone: "+91-44-2345-6780",
    address: "Commissioner Office, Chennai Corporation, Chennai - 600001",
    website: "https://www.chennaicorporation.gov.in",
    workingHours: "9:00 AM - 5:00 PM (Mon-Fri)"
  },

  // Kolkata Departments
  {
    city: "Kolkata",
    issueType: "Water",
    name: "Kolkata Municipal Corporation - Water",
    contactEmail: "water@kmcgov.in",
    contactPhone: "+91-33-2234-5678",
    address: "KMC Building, 5 S.N. Banerjee Road, Kolkata - 700013",
    website: "https://www.kmcgov.in",
    workingHours: "9:00 AM - 5:00 PM (Mon-Fri)"
  },
  {
    city: "Kolkata",
    issueType: "Electricity",
    name: "West Bengal State Electricity Board",
    contactEmail: "complaints@wbseb.gov.in",
    contactPhone: "+91-33-2234-5679",
    address: "Vidyut Bhavan, Salt Lake, Kolkata - 700091",
    website: "https://wbseb.gov.in",
    workingHours: "24/7 Emergency Services"
  },
  {
    city: "Kolkata",
    issueType: "Road",
    name: "Public Works Department - Kolkata",
    contactEmail: "roads@kmcgov.in",
    contactPhone: "+91-33-2234-5680",
    address: "PWD Building, Writers' Building, Kolkata - 700001",
    website: "https://www.kmcgov.in",
    workingHours: "9:00 AM - 5:00 PM (Mon-Fri)"
  },
  {
    city: "Kolkata",
    issueType: "Sanitation",
    name: "KMC Sanitation Department",
    contactEmail: "sanitation@kmcgov.in",
    contactPhone: "+91-33-2234-5681",
    address: "Health Department, KMC, Kolkata - 700013",
    website: "https://www.kmcgov.in",
    workingHours: "24/7 Services"
  },
  {
    city: "Kolkata",
    issueType: "Street Lights",
    name: "Street Lighting - KMC",
    contactEmail: "streetlights@kmcgov.in",
    contactPhone: "+91-33-2234-5682",
    address: "Electrical Department, KMC, Kolkata - 700013",
    website: "https://www.kmcgov.in",
    workingHours: "9:00 AM - 6:00 PM (Mon-Fri)"
  },
  {
    city: "Kolkata",
    issueType: "Garbage Collection",
    name: "Waste Management - KMC",
    contactEmail: "waste@kmcgov.in",
    contactPhone: "+91-33-2234-5683",
    address: "SWM Department, KMC, Kolkata - 700013",
    website: "https://www.kmcgov.in",
    workingHours: "6:00 AM - 10:00 PM (Daily)"
  },
  {
    city: "Kolkata",
    issueType: "Public Transport",
    name: "Calcutta State Transport Corporation",
    contactEmail: "transport@cstc.gov.in",
    contactPhone: "+91-33-2234-5684",
    address: "CSTC Building, Esplanade, Kolkata - 700001",
    website: "https://cstc.gov.in",
    workingHours: "24/7 Services"
  },
  {
    city: "Kolkata",
    issueType: "Parks",
    name: "Parks and Gardens - KMC",
    contactEmail: "parks@kmcgov.in",
    contactPhone: "+91-33-2234-5685",
    address: "Parks Department, KMC, Kolkata - 700013",
    website: "https://www.kmcgov.in",
    workingHours: "6:00 AM - 6:00 PM (Daily)"
  },
  {
    city: "Kolkata",
    issueType: "Noise Pollution",
    name: "West Bengal Pollution Control Board",
    contactEmail: "pollution@wbpcb.gov.in",
    contactPhone: "+91-33-2234-5686",
    address: "WBPCB Building, Salt Lake, Kolkata - 700091",
    website: "https://wbpcb.gov.in",
    workingHours: "9:00 AM - 5:00 PM (Mon-Fri)"
  },
  {
    city: "Kolkata",
    issueType: "Other",
    name: "KMC General Office",
    contactEmail: "general@kmcgov.in",
    contactPhone: "+91-33-2234-5687",
    address: "Mayor Office, KMC, Kolkata - 700013",
    website: "https://www.kmcgov.in",
    workingHours: "9:00 AM - 5:00 PM (Mon-Fri)"
  },

  // Bhubaneswar Departments
  {
    city: "Bhubaneswar",
    issueType: "Water",
    name: "Bhubaneswar Municipal Corporation - Water",
    contactEmail: "water@bmcbbsr.gov.in",
    contactPhone: "+91-674-2345-678",
    address: "BMC Building, Unit-3, Bhubaneswar - 751001",
    website: "https://www.bmcbbsr.gov.in",
    workingHours: "9:00 AM - 5:00 PM (Mon-Fri)"
  },
  {
    city: "Bhubaneswar",
    issueType: "Electricity",
    name: "Odisha State Electricity Board",
    contactEmail: "complaints@oseb.gov.in",
    contactPhone: "+91-674-2345-679",
    address: "Vidyut Bhavan, Janpath, Bhubaneswar - 751007",
    website: "https://oseb.gov.in",
    workingHours: "24/7 Emergency Services"
  },
  {
    city: "Bhubaneswar",
    issueType: "Road",
    name: "Bhubaneswar Development Authority",
    contactEmail: "roads@bda.gov.in",
    contactPhone: "+91-674-2345-680",
    address: "BDA Building, Chandrasekharpur, Bhubaneswar - 751023",
    website: "https://bda.gov.in",
    workingHours: "9:00 AM - 5:00 PM (Mon-Fri)"
  },
  {
    city: "Bhubaneswar",
    issueType: "Sanitation",
    name: "BMC Sanitation Department",
    contactEmail: "sanitation@bmcbbsr.gov.in",
    contactPhone: "+91-674-2345-681",
    address: "Health Wing, BMC, Bhubaneswar - 751001",
    website: "https://www.bmcbbsr.gov.in",
    workingHours: "24/7 Services"
  },
  {
    city: "Bhubaneswar",
    issueType: "Street Lights",
    name: "Street Lighting - BMC",
    contactEmail: "streetlights@bmcbbsr.gov.in",
    contactPhone: "+91-674-2345-682",
    address: "Electrical Section, BMC, Bhubaneswar - 751001",
    website: "https://www.bmcbbsr.gov.in",
    workingHours: "9:00 AM - 6:00 PM (Mon-Fri)"
  },
  {
    city: "Bhubaneswar",
    issueType: "Garbage Collection",
    name: "Waste Management - BMC",
    contactEmail: "waste@bmcbbsr.gov.in",
    contactPhone: "+91-674-2345-683",
    address: "SWM Wing, BMC, Bhubaneswar - 751001",
    website: "https://www.bmcbbsr.gov.in",
    workingHours: "6:00 AM - 10:00 PM (Daily)"
  },
  {
    city: "Bhubaneswar",
    issueType: "Public Transport",
    name: "Capital Region Urban Transport",
    contactEmail: "transport@crut.gov.in",
    contactPhone: "+91-674-2345-684",
    address: "CRUT Building, Master Canteen Square, Bhubaneswar - 751001",
    website: "https://crut.gov.in",
    workingHours: "6:00 AM - 10:00 PM (Daily)"
  },
  {
    city: "Bhubaneswar",
    issueType: "Parks",
    name: "Parks and Gardens - BMC",
    contactEmail: "parks@bmcbbsr.gov.in",
    contactPhone: "+91-674-2345-685",
    address: "Horticulture Wing, BMC, Bhubaneswar - 751001",
    website: "https://www.bmcbbsr.gov.in",
    workingHours: "6:00 AM - 6:00 PM (Daily)"
  },
  {
    city: "Bhubaneswar",
    issueType: "Noise Pollution",
    name: "Odisha State Pollution Control Board",
    contactEmail: "pollution@ospcb.gov.in",
    contactPhone: "+91-674-2345-686",
    address: "OSPCB Building, Paribesh Bhavan, Bhubaneswar - 751012",
    website: "https://ospcb.gov.in",
    workingHours: "9:00 AM - 5:00 PM (Mon-Fri)"
  },
  {
    city: "Bhubaneswar",
    issueType: "Other",
    name: "BMC General Office",
    contactEmail: "general@bmcbbsr.gov.in",
    contactPhone: "+91-674-2345-687",
    address: "Commissioner Office, BMC, Bhubaneswar - 751001",
    website: "https://www.bmcbbsr.gov.in",
    workingHours: "9:00 AM - 5:00 PM (Mon-Fri)"
  }
];

module.exports = seedDepartments; 