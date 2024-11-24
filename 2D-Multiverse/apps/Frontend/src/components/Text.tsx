
import styled from 'styled-components';

const Text = () => {
  return (
    <StyledWrapper>
      <button className="button" data-text="Awesome">
        <span className="actual-text">&nbsp;Multiverse&nbsp;</span>
        <span aria-hidden="true" className="hover-text">&nbsp;Multiverse&nbsp;</span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button {
    margin: 0;
    height: auto;
    background: transparent;
    padding: 0;
    border: none;
    cursor: pointer;
  }
  .button {
    --border-right: 6px;
    --text-stroke-color: #e14f5b;
    --animation-color: #2C3E50;
    --fs-size: 2em;
    letter-spacing: 3px;
    text-decoration: none;
    font-size: var(--fs-size);
    font-family: "Arial";
    position: relative;
    text-transform: uppercase;
    color: #e14f5b;
    font-weigth:"Bold";
        padding-right:20px;
    -webkit-text-stroke: 6px var(--text-stroke-color);
  }
  .hover-text {
  
    position: absolute;
    box-sizing: border-box;
    content: attr(data-text);
    color: var(--animation-color);
    width: 0%;
    inset: 0;
    border-right: var(--border-right) solid var(--animation-color);
    overflow: hidden;
    transition: 0.5s;
    -webkit-text-stroke: 1px var(--animation-color);
  }
  .button:hover .hover-text {
    padding-right:20px;
    width: 100%;
    filter: drop-shadow(0 0 23px var(--animation-color))
  }`;

export default Text;
