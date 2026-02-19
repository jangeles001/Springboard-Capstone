import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CollectionPage } from '../components/CollectionPage/CollectionPage';
import { WorkoutCollectionPage } from '../features/workouts/pages/WorkoutCollectionPage';
import { WorkoutCard } from '../features/workouts/components/WorkoutCard';
import { useWorkoutsList } from '../features/workouts/hooks/useWorkoutsList';

// Mock the necessary hooks and components
vi.mock('../features/workouts/hooks/useWorkoutsList', () => ({
  useWorkoutsList: vi.fn(),
}));

vi.mock('../../../store/UserStore', () => ({
  usePublicId: vi.fn(() => 'user-123'),
}));

vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
}));

// Create a QueryClient instance for testing
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

// Wrapper to provide QueryClient context for components that use React Query
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const mockWorkouts = [
  {
    uuid: 'workout-1',
    workoutName: 'Push Day',
    creatorPublicId: 'user-123',
    muscleGroups: ['Chest'],
    exercises: [],
  },
  {
    uuid: 'workout-2',
    workoutName: 'Pull Day',
    creatorPublicId: 'user-456',
    muscleGroups: ['Back'],
    exercises: [],
  },
];

const mockHookReturn = {
  active: 'Personal',
  publicId: 'user-123',
  isLoading: false,
  handleActiveChange: vi.fn(),
  onClick: vi.fn(),
  handleDelete: vi.fn(),
  data: {
    data: {
      workouts: mockWorkouts,
      nextPage: 2,
      previousPage: null,
    },
  },
  isError: false,
  error: null,
};

beforeEach(() => {
  vi.clearAllMocks();
  useWorkoutsList.mockReturnValue(mockHookReturn);
});

describe('CollectionPage Component', () => {
  it('renders personal title', () => {
    render(
      <CollectionPage
        hook={useWorkoutsList}
        CardComponent={WorkoutCard}
        titlePersonal="Your Workouts"
        titleAll="All Workouts"
        emptyText="No workouts found"
      />
    );

    // Checks that the personal title is rendered
    expect(screen.getByText('Your Workouts')).toBeInTheDocument();
  });

  it('renders workouts from hook data', () => {
    render(
      <CollectionPage
        hook={useWorkoutsList}
        CardComponent={WorkoutCard}
        titlePersonal="Your Workouts"
        titleAll="All Workouts"
        emptyText="No workouts found"
      />
    );

    // Check that workout names from the mock data are rendered
    expect(screen.getByText('Push Day')).toBeInTheDocument();
    expect(screen.getByText('Pull Day')).toBeInTheDocument();
  });

  it('calls onClick when a workout is selected', async () => {
    const user = userEvent.setup();

    render(
      <CollectionPage
        hook={useWorkoutsList}
        CardComponent={WorkoutCard}
        titlePersonal="Your Workouts"
        titleAll="All Workouts"
        emptyText="No workouts found"
      />
    );

    // Click workout name
    await user.click(screen.getByText('Push Day'));

    // Check that the onClick handler was called with the correct workout ID
    expect(mockHookReturn.onClick).toHaveBeenCalledWith('workout-1');
  });

  it('should not render delete button when active state is "All"', () => {
    // Mocks the hook to return "All" active state to show all workouts
    useWorkoutsList.mockReturnValue({
      ...mockHookReturn,
      active: 'All', 
    });

    render(
      <CollectionPage
        hook={useWorkoutsList}
        CardComponent={WorkoutCard}
        titlePersonal="Your Workouts"
        titleAll="Personal Workouts"
        emptyText="No workouts found"
      />
    );

    // Queries for delete buttons in the rendered output
    const deleteButtons = screen.queryAllByRole('button', { name: /delete workout/i });

    // Checks that no delete buttons are rendered when active state is "All"
    expect(deleteButtons.length).toBe(0);
  });

  it('calls handleDelete when delete button clicked', async () => {
    const user = userEvent.setup();

    render(
      <CollectionPage
        hook={useWorkoutsList}
        CardComponent={WorkoutCard}
        titlePersonal="Your Workouts"
        titleAll="All Workouts"
        emptyText="No workouts found"
      />
    );



    // Clicks the delete button for the owned workout
    await user.click(
      screen.getByTestId(`delete-button-${mockWorkouts[0].uuid}`)
    );

    // Checks that the delete handler was called with the correct workout ID
    expect(mockHookReturn.handleDelete).toHaveBeenCalledWith('workout-1');
  });

  it('renders pagination footer', () => {
    render(
      <CollectionPage
        hook={useWorkoutsList}
        CardComponent={WorkoutCard}
        titlePersonal="Your Workouts"
        titleAll="All Workouts"
        emptyText="No workouts found"
      />
    );

    // Checks that the "Next" button is rendered and "Prev" button is not rendered
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.queryByText('Prev')).not.toBeInTheDocument();
  });
});

describe('WorkoutCollectionPage', () => {
  it('renders using useWorkoutsList hook', () => {
    render(<WorkoutCollectionPage />, { wrapper });

    // Checks that the useWorkoutsList hook was called to fetch workout data
    expect(useWorkoutsList).toHaveBeenCalled();
  });
});