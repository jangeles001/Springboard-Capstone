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
    // Use fake timers for testing setInterval and clearInterval
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Clear all timers and restore real timers after each test
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should render all images with clones', () => {
    render(<Carousel items={mockItems} interval={3000} />);

    // Should render original 3 images plus 2 clones (1 at the beginning and 1 at the end)
    const images = screen.getAllByRole('img');

    // 3 original + 2 clones = 5 images total
    expect(images).toHaveLength(5);
  });

  it('should render prev and next buttons', () => {
    render(<Carousel items={mockItems} interval={3000} />);

    // Check for buttons by their aria-labels
    const prevButton = screen.getByRole('button', { name: /prev/i });
    const nextButton = screen.getByRole('button', { name: /next/i });

    // Check that both buttons are rendered
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('should advance to next slide when next button is clicked', () => {
    render(<Carousel items={mockItems} interval={3000} />);

    // Get the next button and the carousel track
    const nextButton = screen.getByRole('button', { name: /next slide/i });

    // Initial transform should be -100% (showing the first original slide)
    const track = screen.getByTestId('carousel-track');
    expect(track.style.transform).toBe('translateX(-100%)');

    // Click the next button
    fireEvent.click(nextButton);

    // After clicking next, it should transition to the next slide (translateX(-200%))
    expect(track.style.transform).toBe('translateX(-200%)');

  });

  it('should go to previous slide when prev button is clicked', () => {
    render(<Carousel items={mockItems} interval={3000} />);

    // Check that prev button is rendered
    const prevButton = screen.getByRole('button', { name: /previous slide/i });
    expect(prevButton).toBeInTheDocument();    

    // Initial transform should be -100% (showing the first original slide)
    const track = screen.getByTestId('carousel-track');
    expect(track.style.transform).toBe('translateX(-100%)');
    
    // Advance to the next slide and check that it transitions to the next slide (translateX(-200%))
    act(() => vi.advanceTimersByTime(3000));
    expect(track.style.transform).toBe('translateX(-200%)');
    
    // Initiates transition end event and clicks prev button to go back to the previous slide
    fireEvent.transitionEnd(track);
    fireEvent.click(prevButton);
    expect(track.style.transform).toBe('translateX(-100%)');
  });

  it('should advance slides and loop', () => {
    render(<Carousel items={mockItems} interval={3000} />);

    // Initial transform should be -100% (showing the first original slide)
    const track = screen.getByTestId('carousel-track');
    expect(track.style.transform).toBe('translateX(-100%)');

    // Advance through all slides and check that it loops back to the first slide
    act(() =>vi.advanceTimersByTime(3000));
    expect(track.style.transform).toBe('translateX(-200%)');
    act(() => vi.advanceTimersByTime(3000));
    expect(track.style.transform).toBe('translateX(-300%)');
    act(() => vi.advanceTimersByTime(3000));
    expect(track.style.transform).toBe('translateX(-400%)');
    fireEvent.transitionEnd(track);
    expect(track.style.transform).toBe('translateX(-100%)');
  });

  it('should reset timer when next button is clicked', () => {
    // Spy on clearInterval and setInterval to check if they are called when next button is clicked
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    const setIntervalSpy = vi.spyOn(global, 'setInterval');

    render(<Carousel items={mockItems} interval={3000} />);

    // Get the next button
    const nextButton = screen.getByRole('button', { name: /next slide/i });

    // Advance time short of the interval timer to ensure the timer is active
    act(() => vi.advanceTimersByTime(1500));

    // Click the next button to reset the timer
    fireEvent.click(nextButton);

    // Check that clearInterval was called to clear the existing timer and setInterval was called to start a new timer
    expect(clearIntervalSpy).toHaveBeenCalled();
    expect(setIntervalSpy).toHaveBeenCalledTimes(2);
  });

  it('should prevent rapid clicking during transition', () => {
    render(<Carousel items={mockItems} interval={3000} />);

    // Get the next button and the carousel track
    const nextButton = screen.getByRole('button', { name: /next slide/i });
    const track = screen.getByTestId('carousel-track');

    // Check that next button is rendered
    expect(nextButton).toBeInTheDocument();

    // Click the next button multiple times rapidly
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    // During the transition, the activeIndex should only advance once, so it should only move to the next slide (translateX(-200%)) and not skip slides
    expect(track.style.transform).toBe('translateX(-200%)');
    
  });

  it('should handle interval prop change', () => {
    const { rerender } = render(<Carousel items={mockItems} interval={3000} />);

    // Rerender the component with a new interval value
    rerender(<Carousel items={mockItems} interval={5000} />);
    const track = screen.getByTestId('carousel-track');

    // Advance time by the new interval
    act(() => vi.advanceTimersByTime(5000));

    // After advancing time by the new interval, it should transition to the next slide (translateX(-200%))
    expect(track.style.transform).toBe('translateX(-200%)');
  });

  it('should display correct src for images', () => {
    render(<Carousel items={mockItems} interval={3000} />);

    expect(screen.getByAltText('Slide 0')).toBeInTheDocument();
    expect(screen.getByAltText('Slide 1')).toBeInTheDocument();
    expect(screen.getByAltText('Slide 2')).toBeInTheDocument();
  });

  it('should cleanup timer on unmount', () => {
    // Destructure the unmount function from the render result to unmount the component after rendering
    const { unmount } = render(<Carousel items={mockItems} interval={3000} />);
   
    // Spy on clearInterval to check if it is called when the component unmounts
    const clearInterval = vi.spyOn(global, 'clearInterval');

    // Unmount the component to trigger cleanup
    unmount();

    // Check that clearInterval was called to clean up the timer
    expect(clearInterval).toHaveBeenCalled();
  });

  it('should render with custom interval', () => {
    render(<Carousel items={mockItems} interval={5000} />);
    // Get the carousel track
    const track = screen.getByTestId('carousel-track');

    // Initial transform should be -100% (showing the first original slide)
    expect(track.style.transform).toBe('translateX(-100%)');

    // Advance time by the custom interval and check that it transitions to the next slide (translateX(-200%))
    act(() => vi.advanceTimersByTime(4000));

    // Should still be on the first slide
    expect(track.style.transform).toBe('translateX(-100%)');
    
    // Advance time by the remaining time to reach the custom interval
    act(() => vi.advanceTimersByTime(1000));

    // Should transition to the next slide (translateX(-200%))
    expect(track.style.transform).toBe('translateX(-200%)');

  });

  it('should use default interval when not provided', () => {
    render(<Carousel items={mockItems} />);
    
    // Get the carousel track
    const track = screen.getByTestId('carousel-track');

    // Initial transform should be -100% (showing the first original slide)
    expect(track.style.transform).toBe('translateX(-100%)');

    // Advance time by the default interval (3000ms) and check that it transitions to the next slide (translateX(-200%))
    act(() => vi.advanceTimersByTime(3000));

    // Should transition to the next slide (translateX(-200%))
    expect(track.style.transform).toBe('translateX(-200%)');
  });
});