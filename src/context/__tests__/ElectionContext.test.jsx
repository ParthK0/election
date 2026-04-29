import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { ElectionProvider, useElection } from '../ElectionContext';

const TestComponent = () => {
  const { country, setCountry, role, setRole, checklist, toggleChecklistItem, currentPhase, setCurrentPhase } = useElection();
  return (
    <div>
      <div data-testid="country">{country}</div>
      <div data-testid="role">{role}</div>
      <div data-testid="phase">{currentPhase}</div>
      <div data-testid="checklist-item">{checklist['item-1'] ? 'done' : 'pending'}</div>
      <button onClick={() => setCountry('usa')}>Set USA</button>
      <button onClick={() => setRole('candidate')}>Set Candidate</button>
      <button onClick={() => setCurrentPhase('voting')}>Set Voting</button>
      <button onClick={() => toggleChecklistItem('item-1')}>Toggle Item</button>
    </div>
  );
};

describe('ElectionContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides default values and updates state', () => {
    render(
      <ElectionProvider>
        <TestComponent />
      </ElectionProvider>
    );
    
    expect(screen.getByTestId('country').textContent).toBe('india');
    expect(screen.getByTestId('role').textContent).toBe('voter'); // Default from localStorage mock or init
    
    fireEvent.click(screen.getByText('Set USA'));
    expect(screen.getByTestId('country').textContent).toBe('usa');
    
    fireEvent.click(screen.getByText('Set Candidate'));
    expect(screen.getByTestId('role').textContent).toBe('candidate');
  });

  it('persists role and checklist to localStorage', async () => {
    render(
      <ElectionProvider>
        <TestComponent />
      </ElectionProvider>
    );
    
    fireEvent.click(screen.getByText('Set Candidate'));
    fireEvent.click(screen.getByText('Toggle Item'));
    
    expect(screen.getByTestId('checklist-item').textContent).toBe('done');
    
    await waitFor(() => {
      expect(localStorage.getItem('electiq_role')).toBe('candidate');
      expect(JSON.parse(localStorage.getItem('electiq_checklist'))['item-1']).toBe(true);
    });
  });

  it('updates current phase properly', () => {
    render(
      <ElectionProvider>
        <TestComponent />
      </ElectionProvider>
    );
    
    expect(screen.getByTestId('phase').textContent).toBe('registration');
    fireEvent.click(screen.getByText('Set Voting'));
    expect(screen.getByTestId('phase').textContent).toBe('voting');
  });
});
