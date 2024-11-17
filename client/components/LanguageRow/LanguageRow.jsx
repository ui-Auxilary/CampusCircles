import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Language from "./Language";

import langCode from "../../data/lang_code.json";

export default function LanguageRow({ languages }) {
  const [langCodes, setLangCodes] = useState([]);

  const getCode = (label) => {
    return langCode.find((langCode) => langCode.label === label);
  };

  useEffect(() => {
    console.log("Languages", languages);
    if (languages) {
      languages = languages.filter((language) => language);
      for (let language of languages) {
        let code = getCode(language)["value"];
        setLangCodes((prev) => [...prev, [code, language]]);
      }
    }
  }, [languages]);

  useEffect(() => {
    console.log("Languages!", langCodes);
  }, [langCode]);

  return (
    <View style={styles.languageWrapper}>
      {langCodes
        ? langCodes.map(([code, lang], idx) => {
            return (
              <Language key={idx} code={code.toUpperCase()} language={lang} />
            );
          })
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  languageWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
});
