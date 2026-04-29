import React from 'react';
import { render, screen, fireEvent } from '../../tests/test-utils';
import { describe, it, expect, vi } from 'vitest';
import QuickPrompts from '../QuickPrompts';
import * as ElectionContextModule from '../../context/ElectionContext';

describe('QuickPrompts Component', () => {
  it('does not render if no quickQuestions are provided', () => {
    vi.spyOn(ElectionContextModule, 'useElection').mockReturnValue({ electionData: null });
    const { container } = render(<QuickPrompts onPromptSelect={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders quick prompts and calls handler on click', () => {
    const mockData = {
      quickQuestions: ['How to vote?', 'Where is my polling booth?']
    };
    vi.spyOn(ElectionContextModule, 'useElection').mockReturnValue({ electionData: mockData });
    
    const handlePromptSelect = vi.fn();
    render(<QuickPrompts onPromptSelect={handlePromptSelect} />);
    
    expect(screen.getByText('How to vote?')).toBeInTheDocument();
    expect(screen.getByText('Where is my polling booth?')).toBeInTheDocument();

    fireEvent.click(screen.getByText('How to vote?'));
    expect(handlePromptSelect).toHaveBeenCalledWith('How to vote?');
  });
});
