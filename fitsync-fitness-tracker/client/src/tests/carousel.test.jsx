import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act} from '@testing-library/react';
import Carousel from '../components/Carousel';

describe('Carousel Component', () => {
  const mockItems = [
    { src: 'image1.jpg', alt: 'Image 1' },
    { src: 'image2.jpg', alt: 'Image 2' },
    { src: 'image3.jpg', alt: 'Image 3' },
  ];

  beforeEach(() => {
    act(() => vi.useFakeTimers());
  });

  afterEach(() => {
    act(() => vi.clearAllTimers());
    act(() => vi.useRealTimers());
  });

  it('should render all images with clones', () => {
    render(<Carousel items={mockItems} interval={3000} />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(5);
  });

  it('should render prev and next buttons', () => {
    render(<Carousel items={mockItems} interval={3000} />);

    const prevButton = screen.getByRole('button', { name: /prev/i });
    const nextButton = screen.getByRole('button', { name: /next/i });

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('should advance to next slide when next button is clicked', () => {
    render(<Carousel items={mockItems} interval={3000} />);

    const nextButton = screen.getByRole('button', { name: /next slide/i });

    const track = screen.getByTestId('carousel-track');
    expect(track.style.transform).toBe('translateX(-100%)');

    act(() => nextButton.click());

    expect(track.style.transform).toBe('translateX(-200%)');

  });

  it('should go to previous slide when prev button is clicked', () => {
    act(() => vi.useFakeTimers());
    render(<Carousel items={mockItems} interval={3000} />);

    const prevButton = screen.getByRole('button', { name: /previous slide/i });
    expect(prevButton).toBeInTheDocument();    

    const track = screen.getByTestId('carousel-track');
    expect(track.style.transform).toBe('translateX(-100%)');
    act(() => vi.advanceTimersByTime(3000));
    expect(track.style.transform).toBe('translateX(-200%)');
    act(() => fireEvent.transitionEnd(track));
    act(() => prevButton.click());
    expect(track.style.transform).toBe('translateX(-100%)');
  });

  it('should advance slides and loop', () => {
    act(() => vi.useFakeTimers());

    render(<Carousel items={mockItems} interval={3000} />);

    const track = screen.getByTestId('carousel-track');
    expect(track.style.transform).toBe('translateX(-100%)');
    act(() =>vi.advanceTimersByTime(3000));
    expect(track.style.transform).toBe('translateX(-200%)');
    act(() => vi.advanceTimersByTime(3000));
    expect(track.style.transform).toBe('translateX(-300%)');
    act(() => vi.advanceTimersByTime(3000));
    expect(track.style.transform).toBe('translateX(-400%)');
    act(() => fireEvent.transitionEnd(track));
    expect(track.style.transform).toBe('translateX(-100%)');
  });

  it('should reset timer when next button is clicked', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    const setIntervalSpy = vi.spyOn(global, 'setInterval');

    render(<Carousel items={mockItems} interval={3000} />);

    const nextButton = screen.getByRole('button', { name: /next slide/i });

    act(() => vi.advanceTimersByTime(1500));
    act(() => nextButton.click());
    expect(clearIntervalSpy).toHaveBeenCalled();
    expect(setIntervalSpy).toHaveBeenCalledTimes(2);
  });

  it('should prevent rapid clicking during transition', () => {
    render(<Carousel items={mockItems} interval={3000} />);

    const nextButton = screen.getByRole('button', { name: /next slide/i });
    const track = screen.getByTestId('carousel-track');

    expect(nextButton).toBeInTheDocument();

    act(() => nextButton.click());
    act(() => nextButton.click());
    act(() => nextButton.click());
    expect(track.style.transform).toBe('translateX(-200%)');
    
  });

  it('should handle interval prop change', () => {
    const { rerender } = render(<Carousel items={mockItems} interval={3000} />);

    rerender(<Carousel items={mockItems} interval={5000} />);
    const track = screen.getByTestId('carousel-track');

    act(() => vi.advanceTimersByTime(5000));

    expect(track.style.transform).toBe('translateX(-200%)');
  });

  it('should display correct src for images', () => {
    render(<Carousel items={mockItems} interval={3000} />);

    expect(screen.getByAltText('Slide 0')).toBeInTheDocument();
    expect(screen.getByAltText('Slide 1')).toBeInTheDocument();
    expect(screen.getByAltText('Slide 2')).toBeInTheDocument();
  });

  it('should cleanup timer on unmount', () => {
    const { unmount } = render(<Carousel items={mockItems} interval={3000} />);
    const clearInterval = vi.spyOn(global, 'clearInterval');

    unmount();

    expect(clearInterval).toHaveBeenCalled();
  });

  it('should render with custom interval', () => {
    render(<Carousel items={mockItems} interval={5000} />);
    const track = screen.getByTestId('carousel-track');

    act(() => vi.advanceTimersByTime(4000));
    expect(track.style.transform).toBe('translateX(-100%)');
    act(() => vi.advanceTimersByTime(1000));
    expect(track.style.transform).toBe('translateX(-200%)');

  });

  it('should use default interval when not provided', () => {
    render(<Carousel items={mockItems} />);
    const track = screen.getByTestId('carousel-track');

    act(() => vi.advanceTimersByTime(3000));

    expect(track.style.transform).toBe('translateX(-200%)');
  });
});