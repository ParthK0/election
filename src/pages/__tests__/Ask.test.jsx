import React from 'react';
import { render, screen } from '../../tests/test-utils';
import { describe, it, expect, vi } from 'vitest';
import Ask from '../Ask';
import * as ElectionContextModule from '../../context/ElectionContext';

describe('Ask Page', () => {
  it('renders header and context info', () => {
    vi.spyOn(ElectionContextModule, 'useElection').mockReturnValue({
      country: 'india',
      currentPhase: 'registration',
      role: 'voter',
      checklist: {}
    });
    
    render(<Ask />);
    expect(screen.getByText('Election Assistant')).toBeInTheDocument();
    expect(screen.getByText('registration', { selector: '.capitalize' })).toBeInTheDocument();
    expect(screen.getByText('Neutrality Guaranteed')).toBeInTheDocument();
  });
});
