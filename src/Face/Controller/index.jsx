import React, { useState } from "react";
import styled from "styled-components";
import { HexColorPicker, HexColorInput } from "react-colorful";

const Swatch = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 3px solid #fff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

export default function Controller({ color, onChange, name }) {
  const [isOpen, setIsOpen] = useState(false);

  function changeColor(color) {
    setIsOpen(false);
    onChange(color);
  }
  return (
    <div>
      <div>
        <span>{name} 화장</span>
        <Swatch
          style={{ backgroundColor: color }}
          onClick={() => setIsOpen(true)}
        />
      </div>
      {isOpen && (
        <div>
          <HexColorPicker color={color} onChange={changeColor} />
          <HexColorInput color={color} onChange={changeColor} />
        </div>
      )}
    </div>
  );
}
