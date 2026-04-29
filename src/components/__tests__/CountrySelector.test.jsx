import React from 'react';
import { render, screen, fireEvent } from '../../tests/test-utils';
import { describe, it, expect } from 'vitest';
import CountrySelector from '../CountrySelector';

describe('CountrySelector Component', () => {
  it('renders the default country correctly', () => {
    render(<CountrySelector />);
    expect(screen.getByText('India')).toBeInTheDocument();
    expect(screen.getByText('🇮🇳')).toBeInTheDocument();
  });

  it('opens dropdown on click', () => {
    render(<CountrySelector />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('USA')).toBeInTheDocument();
    expect(screen.getByText('UK')).toBeInTheDocument();
  });

  it('shows disabled states for upcoming countries', () => {
    render(<CountrySelector />);
    fireEvent.click(screen.getByRole('button', { name: /India/i }));
    
    // USA should be disabled
    const usaButton = screen.getByRole('button', { name: /USA/i });
    expect(usaButton).toBeDisabled();
    expect(screen.getAllByText('Soon').length).toBeGreaterThan(0);
  });
});
