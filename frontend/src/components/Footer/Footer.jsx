import React, { Component } from "react";

import styled from "styled-components";
import { Box } from "@material-ui/core";
import Stylitelogo from "./assets/Stylite.png";
import Xinuxlogo from "./assets/Xinux.png";

const FooterContainer = styled.div`
  text-align: center;
  position: absolut;
  bottom: 0;
  width: 100% !important;
  height: 100px !important ;
`;

class Footer extends Component {
  render() {
    return (
      <FooterContainer>
        <Box display="flex" sx={{ m: 3 }}>
          <img src={Stylitelogo} width="200" height="50" alt="logo" />
        </Box>

        <Box display="flex" sx={{ m: 3 }}>
          <img src={Xinuxlogo} width="200" height="50" alt="logo" />
        </Box>
      </FooterContainer>
    );
  }
}

export default Footer;
