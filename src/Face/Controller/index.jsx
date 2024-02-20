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
const Wrap = styled.div`
  display: flex;
  align-items: center;
`;

export default function Controller({ color, onChange, name }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Wrap>
        <span>{name} 화장</span>
        <Swatch
          style={{ backgroundColor: color }}
          onClick={() => setIsOpen((prv) => !prv)}
        />
      </Wrap>
      {isOpen && (
        <div>
          <HexColorPicker color={color} onChange={onChange} />
          <HexColorInput color={color} onChange={onChange} />
          <button onClick={() => setIsOpen(false)}>확인</button>
        </div>
      )}
    </div>
  );
}
