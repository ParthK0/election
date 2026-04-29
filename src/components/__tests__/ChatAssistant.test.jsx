import React from 'react';
import { render, screen, fireEvent } from '../../tests/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChatAssistant from '../ChatAssistant';
import * as ChatContextModule from '../../context/ChatContext';

vi.mock('react-markdown', () => ({
  default: ({ children }) => <div>{children}</div>
}));

describe('ChatAssistant Component', () => {
  beforeEach(() => {
    vi.spyOn(ChatContextModule, 'useChat').mockReturnValue({
      chatHistory: [],
      setChatHistory: vi.fn(),
      isLoading: false,
      error: null,
      clearHistory: vi.fn()
    });
  });

  it('renders initial state correctly', () => {
    render(<ChatAssistant />);
    expect(screen.getByText('ElectIQ AI')).toBeInTheDocument();
    expect(screen.getByText('How can I guide you?')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
  });

  it('updates input correctly', () => {
    render(<ChatAssistant />);
    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'Hello AI' } });
    expect(input.value).toBe('Hello AI');
  });

  it('sanitizes XSS from bot messages using DOMPurify', () => {
    const maliciousContent = "Hello <script>alert('xss')</script>World <img src=x onerror=alert(1)>";
    
    vi.spyOn(ChatContextModule, 'useChat').mockReturnValue({
      chatHistory: [{ role: 'bot', content: maliciousContent }],
      setChatHistory: vi.fn(),
      isLoading: false,
      error: null,
      clearHistory: vi.fn()
    });

    render(<ChatAssistant />);
    
    const textContent = screen.getByText(/Hello/).textContent;
    
    expect(textContent).not.toContain('<script>');
    expect(textContent).not.toContain("alert('xss')");
    expect(textContent).not.toContain("onerror");
    expect(textContent).toContain("Hello");
    expect(textContent).toContain("World");
  });
});
