import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  ja: {
    title: "Calendar Generator",
    subtitle: "Your artwork · Your month",
    template: "テンプレート",
    artwork: "アートワーク",
    chooseImage: "画像を選択",
    replaceImage: "画像を入れ替え",
    detected: "検出:",
    portrait: "縦長",
    landscape: "横長",
    month: "月",
    year: "年",
    infoLine1: "縦長の絵 → 枠 170 × 119.5 mm（絵: 左 / カレンダー: 右）",
    infoLine2: "横長の絵 → 枠 119.5 × 170 mm（絵: 上 / カレンダー: 下）",
    exportPng: "PNG 出力",
    exporting: "出力中...",
    ikeaFrame: "IKEAフォトフレーム",
    ikeaSub: "170×119.5 / 119.5×170 mm",
    smartphoneWallpaper: "スマホ壁紙",
    ipadWallpaper: "iPad壁紙",
    pcWallpaper: "PC壁紙",
    customSize: "カスタムサイズ",
    customSub: "印刷用(mm) / 画面用(px) 自由設定",
    printUse: "印刷用 (mm)",
    screenUse: "画面用 (px)",
    width: "幅",
    height: "高さ",
    aspectRatio: "アスペクト比",
    cmykNotice: "（印刷用・CMYK推奨）",
    rgbNotice: "（画面用・RGB）",
    a4Portrait: "A4 縦",
    a4Landscape: "A4 横",
    a3Portrait: "A3 縦",
    square: "正方形",
    fhd: "FHD",
    k4: "4K",
    mobile: "スマホ",
    ipad: "iPad",
  },
  en: {
    title: "Calendar Generator",
    subtitle: "Your artwork · Your month",
    template: "Template",
    artwork: "Artwork",
    chooseImage: "Choose Image",
    replaceImage: "Replace Image",
    detected: "Detected:",
    portrait: "Portrait",
    landscape: "Landscape",
    month: "Month",
    year: "Year",
    infoLine1: "Portrait → 170 × 119.5 mm (Art: Left / Calendar: Right)",
    infoLine2: "Landscape → 119.5 × 170 mm (Art: Top / Calendar: Bottom)",
    exportPng: "Export PNG",
    exporting: "Exporting...",
    ikeaFrame: "IKEA Photo Frame",
    ikeaSub: "170×119.5 / 119.5×170 mm",
    smartphoneWallpaper: "Smartphone Wallpaper",
    ipadWallpaper: "iPad Wallpaper",
    pcWallpaper: "PC Wallpaper",
    customSize: "Custom Size",
    customSub: "Free setting for Print(mm) / Screen(px)",
    printUse: "For Print (mm)",
    screenUse: "For Screen (px)",
    width: "W",
    height: "H",
    aspectRatio: "Aspect Ratio",
    cmykNotice: "(Print use · CMYK recommended)",
    rgbNotice: "(Screen use · RGB)",
    a4Portrait: "A4 Port.",
    a4Landscape: "A4 Land.",
    a3Portrait: "A3 Port.",
    square: "Square",
    fhd: "FHD",
    k4: "4K",
    mobile: "Mobile",
    ipad: "iPad",
  }
};

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [locale, setLocale] = useState(localStorage.getItem('locale') || 'ja');

  useEffect(() => {
    localStorage.setItem('locale', locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const t = (key) => {
    return translations[locale][key] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
