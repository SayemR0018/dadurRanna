/**
 * Authentic Bengali heirloom recipes for Dadur Ranna demonstration.
 * Fully playable offline without requiring an API key.
 */

const DEMO_RECIPES = [
  {
    id: 'demo-shorshe-ilish',
    title_bn: 'দাদুর স্পেশাল সর্ষে ইলিশ',
    title_en: "Dadu's Royal Mustard Hilsa Curry",
    servings: 4,
    time_minutes: 25,
    image_url: 'assets/recipes/shorshe-ilish.svg',
    ingredients: [
      { name_bn: 'তাজা পদ্মার ইলিশ মাছ', name_en: 'Fresh Hilsa steaks', quantity: '4', unit: 'pieces' },
      { name_bn: 'হলুদ ও কালো সর্ষে বাটা', name_en: 'Mustard paste (yellow & black mix)', quantity: '3', unit: 'tbsp' },
      { name_bn: 'কাঁচা লঙ্কা চেরা', name_en: 'Slit green chillies', quantity: '6', unit: 'pieces' },
      { name_bn: 'খাঁটি ঝাঁঝালো সর্ষের তেল', name_en: 'Pure pungent mustard oil', quantity: '3', unit: 'tbsp' },
      { name_bn: 'কালো জিরে', name_en: 'Nigella seeds (kalo jeere)', quantity: '0.5', unit: 'tsp' },
      { name_bn: 'হলুদ গুঁড়ো', name_en: 'Turmeric powder', quantity: '0.5', unit: 'tsp' },
      { name_bn: 'স্বাদমতো নুন', name_en: 'Salt to taste', quantity: '1', unit: 'tsp' }
    ],
    steps_bn: [
      'মাছের টুকরোগুলো ভালো করে ধুয়ে জল ঝরিয়ে এক চিমটি নুন ও সামান্য হলুদ মাখিয়ে ১০ মিনিট রেখে দিন।',
      'কড়াইয়ে খাঁটি সর্ষের তেল ধোঁয়া ওঠা পর্যন্ত গরম করে গ্যাস সামান্য কমিয়ে কালো জিরে ও তিনটি চেরা কাঁচা লঙ্কা ফোড়ন দিন।',
      'এক কাপ কুসুম গরম জলে সর্ষে বাটা, বাকি হলুদ ও নুন গুলে কড়াইতে ঢালুন। ঝোল ফুটে উঠলে সাবধানে মাছের টুকরো ছেড়ে দিন।',
      'ঢাকা দিয়ে মাঝারি আঁচে ৭-৮ মিনিট রান্না করুন যাতে মাছ নরম হয় কিন্তু ভেঙে না যায়।',
      'নামানোর ঠিক আগে উপর থেকে বাকি ৩টি কাঁচা লঙ্কা ও ১ চামচ কাঁচা সর্ষের তেল ছড়িয়ে গ্যাস বন্ধ করে ৫ মিনিট ঢেকে রাখুন।'
    ],
    steps_en: [
      'Gently wash fish steaks, drain completely, and lightly rub with a pinch of salt and turmeric; let rest for 10 minutes.',
      'Heat mustard oil in a traditional kadai until smoking hot. Lower heat and temper with nigella seeds and 3 slit green chillies.',
      'Dissolve the freshly ground mustard paste in 1 cup warm water with turmeric and salt; pour gently into the bubbling oil.',
      'Slide the hilsa steaks into the gravy. Cover and simmer gently on medium heat for 7-8 minutes.',
      'Drizzle 1 tbsp raw virgin mustard oil and top with remaining fresh slit chillies right before taking off the heat; rest covered.'
    ],
    notes: 'সর্ষে বাটার সময় অবশ্যই এক চিমটি নুন আর একটা কাঁচা লঙ্কা দিয়ে বাটবে, নইলে তেতো হয়ে যেতে পারে। আর নামানোর আগে কাঁচা সর্ষের তেলের ঝাঁঝ ছাড়া এই রান্নার কোনো প্রাণ নেই!',
    uncertain: []
  },
  {
    id: 'demo-aloo-posto',
    title_bn: 'দাদুর সাবেক আলু পোস্ত',
    title_en: "Dadu's Traditional Aloo Posto (Poppy Seed Potatoes)",
    servings: 4,
    time_minutes: 30,
    image_url: 'assets/recipes/aloo-posto.svg',
    ingredients: [
      { name_bn: 'নতুন আলু ছোট ডুমো করে কাটা', name_en: 'Potatoes (peeled and diced into cubes)', quantity: '400', unit: 'g' },
      { name_bn: 'পোস্ত বাটা (মিহি করে বাটা)', name_en: 'White poppy seeds ground to smooth paste', quantity: '4', unit: 'tbsp' },
      { name_bn: 'কাঁচা লঙ্কা বাটা', name_en: 'Fresh green chilli paste', quantity: '1', unit: 'tsp' },
      { name_bn: 'কালো জিরে', name_en: 'Nigella seeds', quantity: '0.5', unit: 'tsp' },
      { name_bn: 'শুকনো লঙ্কা', name_en: 'Whole dried red chilli', quantity: '1', unit: 'pieces' },
      { name_bn: 'খাঁটি সর্ষের তেল', name_en: 'Mustard oil', quantity: '2', unit: 'tbsp' },
      { name_bn: 'চিনি', name_en: 'Sugar', quantity: '0.25', unit: 'tsp' },
      { name_bn: 'লবণ', name_en: 'Salt', quantity: '1', unit: 'tsp' }
    ],
    steps_bn: [
      'কড়াইয়ে সর্ষের তেল গরম করে শুকনো লঙ্কা ও কালো জিরে ফোড়ন দিয়ে সুবাস বের হওয়া পর্যন্ত ভাজুন।',
      'ডুমো করে কাটা আলু দিয়ে হালকা নুন ও সামান্য হলুদ (অথবা বিনা হলুদে সাদা সাবেক স্টাইলে) দিয়ে মাঝারি আঁচে ৪-৫ মিনিট সোনালী করে ভাজুন।',
      'আধা কাপ গরম জল দিয়ে ঢাকা দিয়ে আলু সেদ্ধ হওয়া পর্যন্ত রান্না করুন।',
      'আলু নরম হলে ঢাকনা খুলে কাঁচা লঙ্কা বাটা ও পোস্ত বাটা দিন। বেশি ফোটাবেন না, শুধু আলুর গায়ে মাখামাখা করে নিন।',
      'নামানোর আগে সামান্য চিনি এবং এক চা চামচ কাঁচা সর্ষের তেল ছড়িয়ে নামিয়ে গরম ভাতের সাথে পরিবেশন করুন।'
    ],
    steps_en: [
      'Heat mustard oil in a pan; add dried red chilli and nigella seeds until aromatic.',
      'Add the cubed potatoes with salt and sauté for 5 minutes until lightly golden.',
      'Add 1/2 cup warm water, cover with lid and cook until potatoes are tender and cooked through.',
      'Uncover and fold in the poppy seed paste and green chilli paste. Stir gently for 2 minutes to coat every cube.',
      'Finish with a drop of raw mustard oil and a hint of sugar. Serve with piping hot steamed rice and biulir dal.'
    ],
    notes: 'পোস্ত কখনোই অতিরিক্ত ফোটানো বা কড়া করে ভাজা চলবে না। পোস্তর যে মিষ্টি মিষ্টি সুবাস থাকে তা বেশি আঁচে উবে যায়। আলু সেদ্ধ হওয়ার পরেই পোস্ত মেশাবে।',
    uncertain: []
  },
  {
    id: 'demo-bhoger-khichuri',
    title_bn: 'দাদুর বর্ষাকালের ভুনা খিচুড়ি',
    title_en: "Dadu's Monsoon Roasted Moong Khichuri",
    servings: 6,
    time_minutes: 45,
    image_url: 'assets/recipes/khichuri.svg',
    ingredients: [
      { name_bn: 'সোনা মুগ ডাল', name_en: 'Yellow split moong dal', quantity: '1.5', unit: 'cup' },
      { name_bn: 'গোবিন্দভোগ চাল', name_en: 'Gobindobhog aromatic short rice', quantity: '1.5', unit: 'cup' },
      { name_bn: 'খাঁটি গাওয়া ঘি', name_en: 'Pure Bengali desi ghee', quantity: '3', unit: 'tbsp' },
      { name_bn: 'সর্ষের তেল', name_en: 'Mustard oil', quantity: '2', unit: 'tbsp' },
      { name_bn: 'আদা বাটা', name_en: 'Fresh ginger paste', quantity: '1.5', unit: 'tbsp' },
      { name_bn: 'জিরে গুঁড়ো', name_en: 'Cumin powder', quantity: '1', unit: 'tsp' },
      { name_bn: 'তেজপাতা ও গোটা গরম মশলা', name_en: 'Bay leaf, cardamom, cinnamon, cloves', quantity: '4', unit: 'pieces' },
      { name_bn: 'কাঁচা লঙ্কা চেরা', name_en: 'Green chillies slit', quantity: '5', unit: 'pieces' },
      { name_bn: 'চিনি', name_en: 'Sugar', quantity: '1', unit: 'tbsp' },
      { name_bn: 'লবণ', name_en: 'Salt', quantity: '2', unit: 'tsp' }
    ],
    steps_bn: [
      'শুকনো কড়াইতে মুগ ডাল মাঝারি আঁচে সোনালী রঙ ও মিষ্টি সুবাস আসা পর্যন্ত ভেজে নিয়ে ঠাণ্ডা জলে ধুয়ে নিন। গোবিন্দভোগ চালও ধুয়ে জল ঝরিয়ে রাখুন।',
      'বড় হাঁড়িতে সর্ষের তেল ও ১ চামচ ঘি গরম করে তেজপাতা ও গোটা গরম মশলা ফোড়ন দিন।',
      'আদা বাটা ও জিরে গুঁড়ো সামান্য জল দিয়ে কষিয়ে চাল ও ভাজা ডাল ঢেলে দিন। মশলার সঙ্গে চাল-ডাল ২ মিনিট হালকা হাতে ভাজুন।',
      '৬ কাপ ফুটন্ত গরম জল, নুন ও কাঁচা লঙ্কা দিন। ফুটে উঠলে আঁচ কমিয়ে ঢাকা দিয়ে ১৫ মিনিট রান্না হতে দিন।',
      'চাল-ডাল নরম ও মাখা মাখা হয়ে এলে উপর থেকে বাকি খাঁটি গাওয়া ঘি ও চিনি ছড়িয়ে দিন। ঢাকা দিয়ে ৫ মিনিট দমে রেখে পরিবেশন করুন।'
    ],
    steps_en: [
      'Dry roast the moong dal on medium flame until golden pink and fragrant. Wash immediately and drain alongside Gobindobhog rice.',
      'In a heavy handi, heat mustard oil and 1 tbsp ghee; add bay leaves, cardamom pods, cinnamon, and cloves until aromatic.',
      'Add ginger paste and cumin powder; sauté until oil separates, then add rice and dal, coating them in spice for 2 minutes.',
      'Pour in 6 cups of boiling hot water, salt, and slit chillies. Cover tightly and cook on low heat for 15 minutes.',
      'When creamy and tender, finish with remaining aromatic desi ghee and sugar. Keep tightly covered off the flame for 5 minutes.'
    ],
    notes: 'চাল আর ডালের মাপ সবসময় ১:১ সমান হওয়া চাই। আর মনে রাখবে—খিচুড়িতে কখনো ঠাণ্ডা জল দেবে না, ডাল শক্ত হয়ে দানা বেঁধে যাবে। সবসময় ফুটন্ত জল ঢালবে।',
    uncertain: []
  },
  {
    id: 'demo-chingri-malai',
    title_bn: 'দাদুর গলদা চিংড়ির মালাই কারি',
    title_en: "Dadu's Jumbo Prawn Coconut Malai Curry",
    servings: 4,
    time_minutes: 35,
    image_url: 'assets/recipes/chingri-malai.svg',
    ingredients: [
      { name_bn: 'গলদা চিংড়ি (খোসা ছাড়িয়ে লেজ রাখা)', name_en: 'Jumbo freshwater tiger prawns', quantity: '6', unit: 'pieces' },
      { name_bn: 'ঘন নারকেলের দুধ', name_en: 'Thick coconut milk', quantity: '1.5', unit: 'cup' },
      { name_bn: 'পেঁয়াজ বাটা', name_en: 'Finely pureed onion', quantity: '2', unit: 'tbsp' },
      { name_bn: 'আদা বাটা', name_en: 'Fresh ginger paste', quantity: '1', unit: 'tbsp' },
      { name_bn: 'রসুন বাটা', name_en: 'Garlic paste', quantity: '0.5', unit: 'tsp' },
      { name_bn: 'কাশ্মীরি লঙ্কা গুঁড়ো', name_en: 'Kashmiri red chilli powder', quantity: '1', unit: 'tsp' },
      { name_bn: 'ঘি ও সর্ষের তেল', name_en: 'Equal parts ghee and mustard oil', quantity: '2', unit: 'tbsp' },
      { name_bn: 'সবুজ এলাচ ও দারচিনি', name_en: 'Green cardamom & cinnamon stick', quantity: '3', unit: 'pieces' },
      { name_bn: 'লবণ ও চিনি', name_en: 'Salt and sugar balanced', quantity: '1', unit: 'tsp' }
    ],
    steps_bn: [
      'চিংড়ি মাছের মাথা ও পিঠের কালো সুতো পরিষ্কার করে নুন-হলুদ মাখিয়ে নিন।',
      'তেল ও ঘিয়ের মিশ্রণ গরম করে চিংড়িগুলো উভয় পাশে মাত্র ৩০-৪০ সেকেন্ড হালকা ভেজে তুলে রাখুন (বেশি ভাজবেন না)।',
      'একই তেলে গোটা গরম মশলা ফোড়ন দিয়ে পেঁয়াজ বাটা, আদা-রসুন বাটা ও লঙ্কা গুঁড়ো দিয়ে তেল ছাড়া পর্যন্ত কষান।',
      'আস্তে আস্তে ঘন নারকেলের দুধ ঢেলে নাড়তে থাকুন। নুন ও চিনি দিন। ঝোল ফুটতে শুরু করলে ভাজা চিংড়িগুলো ছেড়ে দিন।',
      'মাঝারি আঁচে ঢাকা দিয়ে ৫-৬ মিনিট ফোটান যাতে নারকেলের দুধের মালাই চিংড়ির ভেতরে ঢোকে। উপর থেকে কাঁচা লঙ্কা দিয়ে নামিয়ে নিন।'
    ],
    steps_en: [
      'Devein the jumbo prawns, keeping the shell on the tail; season with a hint of salt and turmeric.',
      'Heat ghee and mustard oil, flash fry prawns for only 30-40 seconds per side, and immediately remove to a plate.',
      'In the same fragrant oil, temper with whole cardamoms and cinnamon; sauté onion, ginger, garlic pastes and Kashmiri chilli.',
      'Gently pour in thick coconut milk while stirring continuously. Season with salt and sugar, bring to a velvety boil.',
      'Slide the prawns into the simmering coconut gravy, cover and cook for 5-6 minutes until tender and glossy.'
    ],
    notes: 'চিংড়ি মাছ কখনো কড়া করে ভাজবে না! তেলে দিয়েই লালচে হতেই তুলে নেবে। শক্ত হয়ে গেলে নারকেলের দুধ আর কোনোদিন চিংড়ির পেটের ভেতর ঢুকবে না।',
    uncertain: []
  },
  {
    id: 'demo-notun-gur-payesh',
    title_bn: 'দাদুর নতুন নলেন গুড়ের পায়েশ',
    title_en: "Dadu's Winter Date Palm Jaggery Payesh (Kheer)",
    servings: 6,
    time_minutes: 50,
    image_url: 'assets/recipes/payesh.svg',
    ingredients: [
      { name_bn: 'খাঁটি ঘন গরুর দুধ', name_en: 'Full cream whole dairy milk', quantity: '1.5', unit: 'litre' },
      { name_bn: 'সুগন্ধি গোবিন্দভোগ চাল', name_en: 'Gobindobhog fragrant rice', quantity: '0.5', unit: 'cup' },
      { name_bn: 'খাঁটি নলেন পাটালি বা ঝোলা গুড়', name_en: 'Pure winter date palm jaggery (Nolen Gur)', quantity: '1', unit: 'cup' },
      { name_bn: 'তেজপাতা', name_en: 'Fresh bay leaf', quantity: '1', unit: 'pieces' },
      { name_bn: 'কাজু বাদাম ও কিশমিশ', name_en: 'Cashews & golden raisins', quantity: '2', unit: 'tbsp' },
      { name_bn: 'ঘি (চাল মাখানোর জন্য)', name_en: 'Desi ghee (for coating rice grains)', quantity: '1', unit: 'tsp' },
      { name_bn: 'ছোট এলাচ গুঁড়ো', name_en: 'Cardamom powder', quantity: '0.25', unit: 'tsp' }
    ],
    steps_bn: [
      'গোবিন্দভোগ চাল ধুয়ে জল শুকিয়ে নিয়ে ১ চামচ খাঁটি ঘি মাখিয়ে রাখুন। এতে চালে চমৎকার সুবাস তৈরি হয়।',
      'ভারী তলার হাঁড়িতে দুধ ও তেজপাতা দিয়ে ফুটিয়ে এক-তৃতীয়াংশ কমিয়ে ঘন করে নিন।',
      'ঘি মাখানো চাল দুধে দিয়ে হালকা আঁচে ক্রমাগত নাড়তে থাকুন যাতে হাঁড়ির তলায় চাল না লেগে যায়।',
      'চাল পুরোপুরি নরম ও সেদ্ধ হয়ে দুধের সাথে মিশে ক্ষীরের মতো হলে গ্যাস বন্ধ করে দিন।',
      'হাঁড়ি নামিয়ে ৫ মিনিট সামান্য জুড়িয়ে নিন। এবার কুরিয়ে রাখা নলেন গুড় ও কাজু-কিশমিশ মিশিয়ে আস্তে আস্তে নেড়ে দিন।'
    ],
    steps_en: [
      'Gently wash and air-dry the Gobindobhog rice, then coat thoroughly with 1 tsp ghee; this keeps the grains intact and adds aroma.',
      'In a heavy-bottomed brass or steel vessel, bring whole milk and bay leaf to a slow rolling simmer, reducing by one-third.',
      'Add the ghee-coated rice and simmer on low heat, stirring frequently so the rice cooks gently without catching at the bottom.',
      'Once the rice grains are completely tender and melting into the thickened milk, TURN OFF THE STOVE.',
      'Allow the pot to cool down slightly for 5 minutes. Fold in the grated date palm jaggery, nuts, and raisins until dissolved into a silky caramel hue.'
    ],
    notes: 'খুব সাবধান! টগবগ করে ফোটা দুধে সরাসরি গুড় ঢাললে দুধ কেটে ছানা হয়ে পায়েশ নষ্ট হয়ে যেতে পারে! চাল সেদ্ধ হলে গ্যাস নিভিয়ে একটু জুড়িয়ে গুড় মেশাবে।',
    uncertain: []
  },
  {
    id: 'demo-begun-bhaja-uncertain',
    title_bn: 'দাদুর মুচমুচে বেগুন ভাজা (গোপন মশলাসহ)',
    title_en: "Dadu's Crispy Spiced Eggplant Rounds (With Mystery Spice)",
    servings: 4,
    time_minutes: 15,
    image_url: 'assets/recipes/begun-bhaja.svg',
    ingredients: [
      { name_bn: 'গোল বেগুন চাক চাক করে কাটা', name_en: 'Round purple eggplant cut into 1/2-inch disks', quantity: '2', unit: 'pieces' },
      { name_bn: 'চালের গুঁড়ো (মুচমুচে করার জন্য)', name_en: 'Rice flour for outer crust', quantity: '2.5', unit: 'tbsp' },
      { name_bn: 'বেসন', name_en: 'Gram flour (besan)', quantity: '1', unit: 'tbsp' },
      { name_bn: 'হলুদ গুঁড়ো', name_en: 'Turmeric powder', quantity: '0.5', unit: 'tsp' },
      { name_bn: 'কাশ্মীরি লঙ্কা গুঁড়ো', name_en: 'Red chilli powder', quantity: '0.5', unit: 'tsp' },
      { name_bn: 'চিনি', name_en: 'Granulated sugar', quantity: '0.5', unit: 'tsp' },
      { name_bn: 'খাঁটি সর্ষের তেল ভাজার জন্য', name_en: 'Mustard oil for pan-frying', quantity: '4', unit: 'tbsp' },
      { name_bn: 'লবণ', name_en: 'Salt', quantity: '1', unit: 'tsp' },
      { name_bn: 'দাদুর গোপন ফোড়ন মশলা (রাধুনি/কালো জিরে?)', name_en: 'Grandma secret heirloom spice seed', quantity: '0.5', unit: 'tsp' }
    ],
    steps_bn: [
      'বেগুনের চাকগুলোতে ছুরির ডগা দিয়ে উভয় পিঠে হালকা করে বরফির মতো দাগ কেটে নিন।',
      'নুন, হলুদ, চিনি ও লঙ্কা গুঁড়ো মেখে বেগুনের টুকরোগুলো ১৫ মিনিট রেখে দিন। যে রস বের হবে তা ফেলে দিন।',
      'ভাজার ঠিক আগে শুকনো চালের গুঁড়ো ও বেসনের মিশ্রণে উভয় পিঠ হালকা কোট করে নিন।',
      'কড়াইয়ে সর্ষের তেল গরম করে গোপন মশলা ফোড়ন দিয়ে মাঝারি আঁচে উভয় পিঠ গাঢ় সোনালী ও মচমচে হওয়া পর্যন্ত ভাজুন।',
      'তেল ঝরিয়ে গরম গরম খিচুড়ি বা লুচির সঙ্গে পরিবেশন করুন।'
    ],
    steps_en: [
      'Lightly score the eggplant disks in a diamond criss-cross pattern using the tip of a paring knife.',
      'Rub with salt, turmeric, chilli powder, and sugar; rest for 15 minutes and drain off the extracted bitter water.',
      'Just before frying, dust both sides lightly with the rice flour and besan blend for an ultra-crispy shatter.',
      'Heat mustard oil, add the mystery seeds, and shallow-fry on medium flame until deep mahogany and crisp on both sides.',
      'Drain on parchment paper and serve piping hot alongside khichuri or luchi.'
    ],
    notes: 'বেগুন কাটার পর নুন মাখিয়ে রেখে যে কালো জলটা বের হয় সেটা অবশ্যই ঝরিয়ে ফেলে দেবে। এতে বেগুন ভাজলে তেল অনেক কম টানে আর ভীষণ মুচমুচে থাকে।',
    uncertain: [
      'গোপন ফোড়ন মশলা: দাদুর নোটবুকে "রাধুনি নাকি কালো জিরে" শব্দটি অস্পষ্ট ও কাটাছেঁড়া ছিল (দয়া করে পরিবারের সাথে নিশ্চিত করুন)',
      'চালের গুঁড়োর অনুপাত: নোটে লেখা ছিল "অন্দাজমতো ২ বা ৩ চামচ চালের গুঁড়ো"'
    ]
  }
];

const SAMPLE_MESSY_TEXTS = [
  `দাদুর ডায়েরি থেকে (শ্রাবণ ১৩৯১):
ইলিশের সর্ষে ঝাল...
বাজার থেকে পদ্মার ইলিশ আনবে ৪ টুকরো। ধুয়ে নুন হলুদ মাখাও সামান্য।
সর্ষের তেল কড়াইতে ধোঁয়া ওঠা গরম করে কালোজিরে ১/২ চামচ আর ৪টে কাঁচা লঙ্কা চিরে ফোড়ন দাও।
সাদা আর কালো সর্ষে একসাথে বেটে ২.৫ চামচ... সাথে একটু নুন আর লঙ্কা দিয়ে বাটবে (নইলে কিন্তু তিতকুটে হবে!)
১ কাপ জল দিয়ে ঝোল ফুটলে মাছ ছাড়ো। ৭ মিনিট ঢাকা থাকবে।
নামানোর আগে অবশ্যই ১ চামচ কাঁচা ঝাঁঝালো তেল ওপর দিয়ে ঢালবে আর ২টো লঙ্কা দেবে।
বিঃদ্রঃ জলের মাপ অন্দাজমতো এক বাটি। লঙ্কা যে যেমন ঝাল খায়।`,

  `Dadur Purono Khata Notes:
Aloo Posto ranna:
Alu 400 gram choto choto chowko kore kata.
Posto bata 4 chamoch, kacha lonka 3te diye shil noray bata.
Kalojire ar 1ta shukno lonka tel e phoron debe.
Alu ta tel e ektu bhaje jol diye dhaka dao. Alu shedho hole posto ar lonka bata ta meshate hobe.
Namabar age ektu chini ar 1 chamoch kacha shorsher tel choriye neme felo.
NB: Posto beshi fotale gondho thakbe na!`
];

window.DEMO_RECIPES = DEMO_RECIPES;
window.SAMPLE_MESSY_TEXTS = SAMPLE_MESSY_TEXTS;
