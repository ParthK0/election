import React from 'react';
import { render, screen, fireEvent } from '../../tests/test-utils';
import { describe, it, expect, vi } from 'vitest';
import Home from '../Home';
import * as ElectionContextModule from '../../context/ElectionContext';

describe('Home Page', () => {
  it('renders correctly', () => {
    render(<Home />);
    expect(screen.getByText(/Empowering/i)).toBeInTheDocument();
    expect(screen.getByText(/Democracy with/i)).toBeInTheDocument();
    expect(screen.getByText(/Explore Guide/i)).toBeInTheDocument();
    expect(screen.getByText(/Consult AI/i)).toBeInTheDocument();
  });

  it('allows toggling between Voter and Candidate roles', () => {
    const setRoleMock = vi.fn();
    vi.spyOn(ElectionContextModule, 'useElection').mockReturnValue({
      role: 'voter',
      setRole: setRoleMock,
      country: 'india',
      electionData: { phases: [{ id: 'p1' }] },
      currentPhase: 'p1'
    });

    render(<Home />);
    
    // It should render role selectors
    const candidateBtn = screen.getByText('Candidate').closest('button');
    fireEvent.click(candidateBtn);
    
    expect(setRoleMock).toHaveBeenCalledWith('candidate');
  });
});
