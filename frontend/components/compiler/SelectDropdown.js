import React from "react";
import Select from "react-select";
import monacoThemes from "monaco-themes/themes/themelist";

const ThemeDropdown = ({ handleSelectChange }) => {
  const options = [
    {
      value: 'png("out.png", width = 800, height = 600',
      label: "Plot Compiler",
    },
    { value: "#write the code bellow", label: "String Compiler" },
  ];

  return (
    <Select
      placeholder={`Select Complier Type`}
      // options={languageOptions}
      options={options}
      isSearchable={false}
      //   styles={customStyles}
      onChange={handleSelectChange}
    />
  );
};

export default ThemeDropdown;
