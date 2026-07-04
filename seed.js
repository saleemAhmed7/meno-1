const fs = require('fs');
const path = require('path');

const menuPath = path.join(__dirname, 'public', 'menu');

// Paths to generated images
const imgBreakfast = "C:\\Users\\hamza\\.gemini\\antigravity-ide\\brain\\e9b4ce8d-fd40-42f9-9005-02026356f93c\\breakfast_template_1783161059595.png";
const imgDish = "C:\\Users\\hamza\\.gemini\\antigravity-ide\\brain\\e9b4ce8d-fd40-42f9-9005-02026356f93c\\dish_template_1783161998352.png";
const imgLunch = "C:\\Users\\hamza\\.gemini\\antigravity-ide\\brain\\e9b4ce8d-fd40-42f9-9005-02026356f93c\\lunch_template_1783162009791.png";
const imgDrinks = "C:\\Users\\hamza\\.gemini\\antigravity-ide\\brain\\e9b4ce8d-fd40-42f9-9005-02026356f93c\\drinks_template_1783162021771.png";
const imgHeroBg = "C:\\Users\\hamza\\.gemini\antigravity-ide\\brain\\e9b4ce8d-fd40-42f9-9005-02026356f93c\\hero_bg_1783162032966.png";
const imgPlaceholder = "C:\\Users\\hamza\\.gemini\\antigravity-ide\\brain\\e9b4ce8d-fd40-42f9-9005-02026356f93c\\placeholder_food_1783162045288.png";

// Setup base directories
fs.mkdirSync(path.join(__dirname, 'public'), { recursive: true });

// Wipe the existing menu directory to avoid conflicts
if (fs.existsSync(menuPath)) {
  fs.rmSync(menuPath, { recursive: true, force: true });
}
fs.mkdirSync(menuPath, { recursive: true });

// Copy global assets
if (fs.existsSync(imgHeroBg)) {
  fs.copyFileSync(imgHeroBg, path.join(__dirname, 'public', 'hero_bg.jpg'));
}
if (fs.existsSync(imgPlaceholder)) {
  fs.copyFileSync(imgPlaceholder, path.join(__dirname, 'public', 'placeholder-food.jpg'));
}

// Setup categories data in Arabic
const categories = {
  'الإفطار': {
    meta: {
      name: { ar: "🍳 الإفطار", tr: "Kahvaltı", en: "Breakfast" },
      order: 1
    },
    cover: imgBreakfast,
    products: {
      'الفطور الشامل': {
        name: { ar: "فطور كامل", tr: "Tam Kahvaltı", en: "Full Breakfast" },
        description: { ar: "طبق فطور كامل غني بالبيض، الأجبان، الزيتون، والعسل", tr: "Zengin yumurta, peynir, zeytin ve bal ile tam kahvaltı tabağı", en: "A complete breakfast platter rich in eggs, cheeses, olives, and honey" },
        price: 120,
        available: true,
        featured: true,
        bestSeller: true,
        order: 1,
        spicyLevel: 0,
        tags: ["breakfast", "egg", "premium"],
        multiImages: [imgDish, imgLunch]
      },
      'فول': {
        name: { ar: "فول مدمس", tr: "Foul Medames", en: "Foul Medames" },
        description: { ar: "فول مدمس بالزيت الحار والليمون والكمون", tr: "Baharatlar ve zeytinyağı ile sıcak servis edilen geleneksel bakla", en: "Traditional fava beans served hot with spices and olive oil" },
        price: 45,
        available: true,
        order: 2,
        tags: ["beans", "traditional"]
      },
      'حمص': {
        name: { ar: "حمص بالطحينة", tr: "Humus", en: "Hummus" },
        description: { ar: "حمص ناعم مع الطحينة وعصير الليمون وزيت الزيتون البكر", tr: "Tahin, limon suyu ve sızma zeytinyağı ile kremsi nohut mezesi", en: "Creamy chickpea puree with tahini, lemon juice, and virgin olive oil" },
        price: 40,
        available: true,
        order: 3,
        tags: ["vegan", "cold-appetizer"]
      },
      'شكشوكة': {
        name: { ar: "شكشوكة", tr: "Şakşuka", en: "Shakshuka" },
        description: { ar: "بيض مطبوخ ببطء في صلصة الطماطم الغنية والفلفل والتوابل", tr: "Baharatlı domates ve biber sosunda yavaşça pişirilmiş yumurta", en: "Eggs poached in a spiced tomato, pepper, and onion sauce" },
        price: 50,
        available: true,
        order: 4,
        spicyLevel: 1,
        tags: ["egg", "spicy"]
      },
      'نوتيلا': {
        name: { ar: "فطيرة نوتيلا", tr: "Nutella Krep", en: "Nutella Pancake" },
        price: 60,
        available: true,
        order: 5,
        tags: ["sweet", "chocolate"]
      },
      'جبن': {
        name: { ar: "أجبان مشكلة", tr: "Karışık Peynir Tabağı", en: "Assorted Cheeses" },
        price: 55,
        available: true,
        order: 6,
        tags: ["cheese"]
      },
      'عسل': {
        name: { ar: "عسل طبيعي وقشطة", tr: "Doğal Bal ve Kaymak", en: "Natural Honey & Kaymak" },
        price: 70,
        available: true,
        order: 7,
        tags: ["sweet"]
      },
      'براد شاي': {
        name: { ar: "إبريق شاي أحمر", tr: "Demlik Çay", en: "Tea Pot" },
        price: 30,
        available: true,
        order: 8,
        tags: ["tea", "hot-drink"]
      },
      'دلة مع التمر والطحين': {
        name: { ar: "دلة قهوة عربية مع التمر والدقيق", tr: "Hurma ve Un Helvalı Arap Kahvesi", en: "Arabic Coffee Pot with Dates & Flour" },
        price: 85,
        available: true,
        order: 9,
        featured: true,
        tags: ["coffee", "traditional"]
      }
    }
  },
  'الأطباق الفردية': {
    meta: {
      name: { ar: "🍽 أطباق منفردة", tr: "Tek Kişilik Tabaklar", en: "Individual Dishes" },
      order: 2
    },
    cover: imgDish,
    products: {
      'فول': {
        name: { ar: "طبق فول منفرد", tr: "Porsiyon Foul", en: "Individual Foul" },
        price: 35,
        available: true,
        order: 1,
        tags: ["beans"]
      },
      'حمص': {
        name: { ar: "طبق حمص منفرد", tr: "Porsiyon Humus", en: "Individual Hummus" },
        price: 30,
        available: true,
        order: 2,
        tags: ["cold-appetizer"]
      },
      'شكشوكة': {
        name: { ar: "طبق شكشوكة منفرد", tr: "Porsiyon Şakşuka", en: "Individual Shakshuka" },
        price: 40,
        available: false,
        order: 3,
        spicyLevel: 1,
        tags: ["egg"]
      }
    }
  },
  'الغداء': {
    meta: {
      name: { ar: "🍚 الغداء", tr: "Öğle Yemeği", en: "Lunch" },
      order: 3
    },
    cover: imgLunch,
    products: {
      'كبسة عرب كافيه (لحم)': {
        name: { ar: "كبسة عرب كافيه (لحم)", tr: "Arab Cafe Kabsa (Et)", en: "Arab Cafe Kabsa (Meat)" },
        description: { ar: "أرز بسمتي مبهر مع لحم الضأن الطري المطهو ببطء والمكسرات المحمصة", tr: "Yavaş pişmiş kuzu eti, baharatlı basmati pirinci ve kavrulmuş kuruyemiş", en: "Spiced basmati rice topped with slow-cooked tender lamb and toasted nuts" },
        price: 150,
        oldPrice: 180,
        available: true,
        featured: true,
        bestSeller: true,
        order: 1,
        tags: ["rice", "lamb", "premium"]
      },
      'كبسة عرب كافيه (دجاج)': {
        name: { ar: "كبسة عرب كافيه (دجاج)", tr: "Arab Cafe Kabsa (Tavuk)", en: "Arab Cafe Kabsa (Chicken)" },
        description: { ar: "أرز الكبسة الشهير يقدم مع نصف دجاجة مشوية متبلة بالبهارات الخاصة", tr: "Özel baharatlarla marine edilmiş yarım kızarmış tavuk eşliğinde meşhur kabsa", en: "Spiced basmati rice served with roasted half chicken marinated in chef's spices" },
        price: 95,
        available: true,
        order: 2,
        tags: ["rice", "chicken"]
      },
      'كفتة عرب كافيه مع الرز': {
        name: { ar: "كفتة عرب كافيه مع الأرز", tr: "Arab Cafe Köfte ve Pilav", en: "Arab Cafe Kofta with Rice" },
        description: { ar: "أصابع الكفتة المشوية على الفحم تقدم فوق الأرز المتبل مع صلصة الطماطم", tr: "Kömür ateşinde pişmiş köfteler, baharatlı pilav ve domates sosu eşliğinde", en: "Charcoal-grilled minced meat kofta served over spiced rice with tomato salsa" },
        price: 110,
        available: true,
        order: 3,
        spicyLevel: 2,
        tags: ["kofta", "grill"]
      }
    }
  },
  'المشروبات': {
    meta: {
      name: { ar: "🥤 المشروبات", tr: "İçecekler", en: "Drinks" },
      order: 4
    },
    cover: imgDrinks,
    products: {
      'دلة صغيرة': {
        name: { ar: "دلة قهوة عربية صغيرة", tr: "Küçük Boy Arap Kahvesi", en: "Small Arabic Coffee Pot" },
        price: 40,
        available: true,
        order: 1
      },
      'دلة وسط': {
        name: { ar: "دلة قهوة عربية متوسطة", tr: "Orta Boy Arap Kahvesi", en: "Medium Arabic Coffee Pot" },
        price: 60,
        available: true,
        order: 2
      },
      'دلة كبيرة': {
        name: { ar: "دلة قهوة عربية كبيرة", tr: "Büyük Boy Arap Kahvesi", en: "Large Arabic Coffee Pot" },
        price: 80,
        available: true,
        order: 3
      },
      'اسبريسو': {
        name: { ar: "إسبريسو", tr: "Espresso", en: "Espresso" },
        price: 35,
        available: true,
        order: 4
      },
      'كبتشينو': {
        name: { ar: "كابتشينو", tr: "Kapuçino", en: "Cappuccino" },
        price: 45,
        available: true,
        order: 5
      },
      'قهوة تركي': {
        name: { ar: "قهوة تركية", tr: "Türk Kahvesi", en: "Turkish Coffee" },
        price: 40,
        available: true,
        order: 6
      },
      'شاي عرب كافيه': {
        name: { ar: "شاي عرب كافيه المميز", tr: "Arab Cafe Özel Çayı", en: "Arab Cafe Special Tea" },
        price: 25,
        available: true,
        order: 7
      },
      'موهيتو': {
        name: { ar: "موخيتو منعش", tr: "Nane Limonlu Mojito", en: "Refreshing Mojito" },
        price: 50,
        available: true,
        order: 8
      },
      'موية': {
        name: { ar: "مياه معدنية", tr: "Su", en: "Water" },
        price: 15,
        available: true,
        order: 9
      },
      'كولا': {
        name: { ar: "كوكا كولا", tr: "Kola", en: "Cola" },
        price: 25,
        available: true,
        order: 10
      },
      'سبرايت': {
        name: { ar: "سبرايت", tr: "Sprite", en: "Sprite" },
        price: 25,
        available: true,
        order: 11
      },
      'مشروب عرب كافيه': {
        name: { ar: "مشروب عرب كافيه الخاص", tr: "Arab Cafe Özel Kokteyli", en: "Arab Cafe Special Drink" },
        description: { ar: "مزيج سري ومنعش من الفواكه الاستوائية والأعشاب الطازجة", tr: "Tropikal meyveler ve taze otların gizli, serinletici karışımı", en: "A secret, refreshing blend of tropical fruits and fresh herbs" },
        price: null,
        available: true,
        featured: true,
        order: 12,
        tags: ["special", "signature"]
      }
    }
  }
};

// Seed directories and files
Object.entries(categories).forEach(([catKey, catVal]) => {
  const catDir = path.join(menuPath, catKey);
  fs.mkdirSync(catDir, { recursive: true });

  // Write _category.json
  fs.writeFileSync(
    path.join(catDir, '_category.json'),
    JSON.stringify(catVal.meta, null, 2),
    'utf8'
  );

  // Copy cover
  if (fs.existsSync(catVal.cover)) {
    fs.copyFileSync(catVal.cover, path.join(catDir, 'cover.jpg'));
  }

  // Create products
  Object.entries(catVal.products).forEach(([prodKey, prodVal]) => {
    const prodDir = path.join(catDir, prodKey);
    fs.mkdirSync(prodDir, { recursive: true });

    // Write info.json
    fs.writeFileSync(
      path.join(prodDir, 'info.json'),
      JSON.stringify(prodVal, null, 2),
      'utf8'
    );

    // Copy primary image
    if (fs.existsSync(catVal.cover)) {
      fs.copyFileSync(catVal.cover, path.join(prodDir, 'image.jpg'));
    }

    // Copy secondary images if any
    if (prodVal.multiImages) {
      prodVal.multiImages.forEach((imgSrc, index) => {
        if (fs.existsSync(imgSrc)) {
          fs.copyFileSync(imgSrc, path.join(prodDir, `image${index + 2}.jpg`));
        }
      });
    }
  });
});

console.log("Seeding dynamic Arabic menu folders for Arab Cafe completed successfully!");
