/* 
  vanilla-extract Consumption
  Uses tokens as string values in type-safe style definitions.
*/

import { style } from '@vanilla-extract/css';

export const card = style({
    padding: 'var(--ul-space-4)',
    background: 'var(--ul-color-surface)',
    color: 'var(--ul-color-text-primary)',
    borderRadius: 'var(--ul-radius-md)',
    boxShadow: 'var(--ul-shadow-sm)',
});

export const button = style({
    padding: 'var(--ul-space-2) var(--ul-space-4)',
    backgroundColor: 'var(--ul-color-brand-primary)',
    color: 'var(--ul-color-text-inverse)',
    fontFamily: 'var(--ul-font-family-base)',
    borderRadius: 'var(--ul-radius-sm)',
    border: 'none',
    selectors: {
        '&:hover': {
            backgroundColor: 'var(--ul-color-brand-hover)',
        }
    }
});
