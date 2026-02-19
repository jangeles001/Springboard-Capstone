import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DisplayPage from '../components/DisplayPage/DisplayPage';
import { WorkoutDisplayPage } from '../features/workouts/pages/WorkoutDisplayPage';
import { WorkoutDisplayCard } from '../features/workouts/components/WorkoutDisplayCard';

// Mock the necessary hooks and components
vi.mock('@tanstack/react-router', () => ({
  useRouter: vi.fn(),
  useParams: vi.fn(),
  useNavigate: vi.fn(),
  useMatches: vi.fn(() => []),
}));

vi.mock('../components/Loading', () => ({
  default: ({ type }) => <div>Loading {type}</div>,
}));

vi.mock('../components/Breadcrumbs', () => ({
  default: ({ dynamicCrumb }) => (
    <div>Breadcrumb: {dynamicCrumb}</div>
  ),
}));

vi.mock('../features/workouts/hooks/useWorkoutId', () => ({
  useWorkoutId: vi.fn(),
}));

import { useRouter, useParams } from '@tanstack/react-router';
import { useWorkoutId } from '../features/workouts/hooks/useWorkoutId';

// Mock data for testing
const mockWorkoutData = {
  data: {
    uuid: 'workout-123',
    workoutName: 'Push Day',
    workoutDuration: 60,
    creatorPublicId: 'user-123',
    exercises: [
      { exerciseId: '1', exerciseName: 'Bench Press' },
      { exerciseId: '2', exerciseName: 'Overhead Press' },
    ],
  },
};

// Common mock return value for the hook
const mockHookReturn = {
  publicId: 'user-123',
  data: mockWorkoutData,
  isLoading: false,
  isError: false,
  error: null,
  isPending: false,
  handleDelete: vi.fn(),
  handleReturn: vi.fn(),
  handleLog: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  useWorkoutId.mockReturnValue(mockHookReturn);
  useRouter.mockReturnValue({
    id: '/dashboard/workouts/$workoutId',
  });

  useParams.mockReturnValue({
    workoutId: 'workout-123',
  });
});

describe('DisplayPage Component (User-Focused)', () => {
  const mockHook = vi.fn().mockReturnValue(mockHookReturn);

  it('calls hook with ResourceId', () => {
    render(
      <DisplayPage
        hook={mockHook}
        CardComponent={WorkoutDisplayCard}
        ResourceId="workout-123"
        type="Workout"
      />
    );

    // Verify the hook is called with the correct ResourceId
    expect(mockHook).toHaveBeenCalledWith('workout-123');
  });

  it('renders breadcrumbs', () => {
    render(
      <DisplayPage
        hook={mockHook}
        CardComponent={WorkoutDisplayCard}
        ResourceId="workout-123"
        type="Workout"
      />
    );

    // Verify the breadcrumb is rendered with the correct dynamic crumb
    expect(
      screen.getByText(/Breadcrumb: workout-123/i)
    ).toBeInTheDocument();
  });

  it('renders header title', () => {
    render(
      <DisplayPage
        hook={mockHook}
        CardComponent={WorkoutDisplayCard}
        ResourceId="workout-123"
        type="Workout"
      />
    );

    // Verify the header title is rendered correctly
    expect(screen.getByText('Workout Details')).toBeInTheDocument();
  });

  it('renders workout details from data', () => {
    render(
      <DisplayPage
        hook={mockHook}
        CardComponent={WorkoutDisplayCard}
        ResourceId="workout-123"
        type="Workout"
      />
    );

    // Verify workout details are rendered from the mock data
    expect(screen.getByText('Push Day')).toBeInTheDocument();
    expect(screen.getByText(/Bench Press/i)).toBeInTheDocument();
  });

  it('shows personal actions when owner', () => {
    render(
      <DisplayPage
        hook={mockHook}
        CardComponent={WorkoutDisplayCard}
        ResourceId="workout-123"
        type="Workout"
      />
    );

    // Verify that the delete button is rendered for the owner
    expect(
      screen.getByRole('button', { name: /delete/i })
    ).toBeInTheDocument();
  });

  it('hides personal actions when not owner', () => {
    mockHook.mockReturnValue({
      ...mockHookReturn,
      publicId: 'different-user',
    });

    render(
      <DisplayPage
        hook={mockHook}
        CardComponent={WorkoutDisplayCard}
        ResourceId="workout-123"
        type="Workout"
      />
    );

    // Verify that the delete button is not rendered for non-owners
    expect(
      screen.queryByRole('button', { name: /delete/i })
    ).not.toBeInTheDocument();
  });

  it('renders creator footer', () => {
    render(
      <DisplayPage
        hook={mockHook}
        CardComponent={WorkoutDisplayCard}
        ResourceId="workout-123"
        type="Workout"
      />
    );

    // Verify that the creator information is rendered in the footer
    expect(
      screen.getByText(/Created by: user-123/i)
    ).toBeInTheDocument();
  });
});

describe('WorkoutDisplayPage', () => {
  it('uses workoutId from params', () => {
    useParams.mockReturnValue({ workoutId: 'workout-456' });

    render(<WorkoutDisplayPage />);

    // Verify the hook is called with the correct workoutId from params
    expect(useWorkoutId).toHaveBeenCalledWith('workout-456');
  });

  it('handles loading state', () => {
    useWorkoutId.mockReturnValue({
      ...mockHookReturn,
      isLoading: true,
    });

    render(<WorkoutDisplayPage />);

    // Verify that the loading state is rendered correctly
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('handles error state', () => {
    // Spy on console.error to suppress error logs during testing
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    // Mock the hook to return an error state
    useWorkoutId.mockReturnValue({
      ...mockHookReturn,
      isError: true,
      error: { message: 'Not found' },
    });

    render(<WorkoutDisplayPage />);

    // Verify that the error message is rendered correctly
    expect(consoleError).toHaveBeenCalled();
    expect(screen.getByText(/Error loading data/i)).toBeInTheDocument();

    // Restore the original console.error implementation
    consoleError.mockRestore();
  });

  it('wires handlers from hook to UI', async () => {
    const user = userEvent.setup();

    render(<WorkoutDisplayPage />);

    // Simulate clicking the "Return to Collection" button
    await user.click(
      screen.getByRole('button', {
        name: /return to collection/i,
      })
    );

    // Verify that the handleReturn function from the hook is called
    expect(mockHookReturn.handleReturn).toHaveBeenCalled();

    // Simulate clicking the "Record Workout" button
    await user.click(
      screen.getByRole('button', {
        name: /record workout/i,
      })
    );

    // Verify that the handleLog function from the hook is called with the correct workoutId
    expect(mockHookReturn.handleLog).toHaveBeenCalledWith(
      'workout-123'
    );
  });
});