import React from "react";
import styled from "styled-components";

const Head = styled.div`
  text-align: center;
  font-size: 4rem;
  font-weight: bold;
  color: #333;
`;
const Wrap = styled.div`
  height: 100vh;
`;
const Content = styled.div`
  margin: 0;
  display: flex;
  justify-content: center; /* 가로로 가운데 정렬 */
  align-items: center; /* 세로로 가운데 정렬 */
`;
export default function Layout(props) {
  return (
    <Wrap>
      <Head>
        <h>화장 시뮬레이터</h>
      </Head>
      <hr />
      <Content>{props.children}</Content>
    </Wrap>
  );
}
