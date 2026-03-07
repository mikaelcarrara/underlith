/* 
  CSS-in-JS Consumption (styled-components / emotion)
  Uses tokens as strings within template literals.
*/

import styled from 'styled-components';

export const Card = styled.div`
  padding: var(--ul-space-4);
  background: var(--ul-color-surface);
  color: var(--ul-color-text-primary);
  border-radius: var(--ul-radius-md);
  box-shadow: var(--ul-shadow-sm);
`;

export const Button = styled.button`
  padding: var(--ul-space-2) var(--ul-space-4);
  background: var(--ul-color-brand-primary);
  color: var(--ul-color-text-inverse);
  font-family: var(--ul-font-family-base);
  border-radius: var(--ul-radius-sm);
  border: none;
  cursor: pointer;

  &:hover {
    background: var(--ul-color-brand-hover);
  }
`;
