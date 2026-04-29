import React from 'react';
import { render, screen } from '../../tests/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CountdownTimer from '../CountdownTimer';
import * as ElectionContextModule from '../../context/ElectionContext';

describe('CountdownTimer Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('does not render if no targetDate is provided', () => {
    vi.spyOn(ElectionContextModule, 'useElection').mockReturnValue({ electionData: {} });
    const { container } = render(<CountdownTimer />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders countdown if targetDate is provided and in the future', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 2); // 2 days in future
    
    vi.spyOn(ElectionContextModule, 'useElection').mockReturnValue({
      electionData: { targetDate: futureDate.toISOString(), electionName: 'Mock Election' }
    });
    
    render(<CountdownTimer />);
    
    expect(screen.getByText('Mock Election')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('Days')).toBeInTheDocument();
  });

  it('renders inactive message if targetDate is in the past', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // 1 day in past
    
    vi.spyOn(ElectionContextModule, 'useElection').mockReturnValue({
      electionData: { targetDate: pastDate.toISOString(), electionName: 'Past Election' }
    });
    
    render(<CountdownTimer />);
    
    expect(screen.getByText('No active election date set')).toBeInTheDocument();
    // Days should be 00
    const zeros = screen.getAllByText('00');
    expect(zeros.length).toBe(4); // Days, Hours, Min, Sec
  });
});
