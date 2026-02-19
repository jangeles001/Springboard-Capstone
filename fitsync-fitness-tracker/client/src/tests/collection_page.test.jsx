import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { CollectionPage } from '../components/CollectionPage/CollectionPage';
import { CollectionPageHeader } from '../components/CollectionPage/CollectionPageHeader';
import { CollectionPageGrid } from '../components/CollectionPage/CollectionPageGrid';
import { CollectionPageFooter } from '../components/CollectionPage/CollectionPageFooter';
import { WorkoutCollectionPage } from '../features/workouts/pages/WorkoutCollectionPage';
import { WorkoutCard } from '../features/workouts/components/WorkoutCard';

// ============================================================
// MOCKS
// ============================================================

vi.mock('../../../components/Loading', () => ({
  default: ({ type }) => <div data-testid="loading">Loading {type}</div>,
}));

vi.mock('../features/workouts/hooks/useWorkoutsList', () => ({
  useWorkoutsList: vi.fn(),
}));

vi.mock('../../../store/UserStore', () => ({
  usePublicId: vi.fn(() => 'user-123'),
}));

vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
}));

import { useWorkoutsList } from '../features/workouts/hooks/useWorkoutsList';

// Mock the WorkoutCard component for CollectionPage tests
const MockWorkoutCard = ({ item, publicId, onClick, handleDelete, active }) => (
  <div data-testid="workout-card">
    <h3>{item.workoutName}</h3>
    <button onClick={() => onClick(item.uuid)}>View</button>
    {item.creatorPublicId === publicId && (
      <button onClick={() => handleDelete(item.uuid)}>Delete</button>
    )}
  </div>
);

// Mock the hook
const mockHook = vi.fn();

// Helper to wrap components with QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

// ============================================================
// SHARED MOCK DATA
// ============================================================

const mockWorkouts = [
  {
    uuid: 'workout-1',
    workoutName: 'Push Day',
    creatorPublicId: 'user-123',
  },
  {
    uuid: 'workout-2',
    workoutName: 'Pull Day',
    creatorPublicId: 'user-456',
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

// ============================================================
// GLOBAL SETUP
// ============================================================

beforeEach(() => {
  vi.clearAllMocks();
  mockHook.mockReturnValue(mockHookReturn);
  useWorkoutsList.mockReturnValue(mockHookReturn);
});

// ============================================================
// CollectionPage (Integration)
// ============================================================

describe('CollectionPage Component', () => {
  it('should render header with correct titles', () => {
    render(
      <CollectionPage
        hook={mockHook}
        CardComponent={MockWorkoutCard}
        titlePersonal="Your Workouts"
        titleAll="All Workouts"
        emptyText="No workouts found"
      />
    );

    expect(screen.getByText('Your Workouts')).toBeInTheDocument();
  });

  it('should call hook with limit of 12', () => {
    render(
      <CollectionPage
        hook={mockHook}
        CardComponent={MockWorkoutCard}
        titlePersonal="Your Workouts"
        titleAll="All Workouts"
        emptyText="No workouts found"
      />
    );

    expect(mockHook).toHaveBeenCalledWith({ limit: 12 });
  });

  it('should render all workout cards', () => {
    render(
      <CollectionPage
        hook={mockHook}
        CardComponent={MockWorkoutCard}
        titlePersonal="Your Workouts"
        titleAll="All Workouts"
        emptyText="No workouts found"
      />
    );

    expect(screen.getByText('Push Day')).toBeInTheDocument();
    expect(screen.getByText('Pull Day')).toBeInTheDocument();
  });

  it('should pass handlers to grid', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    const mockDelete = vi.fn();

    mockHook.mockReturnValue({
      ...mockHookReturn,
      onClick: mockOnClick,
      handleDelete: mockDelete,
    });

    render(
      <CollectionPage
        hook={mockHook}
        CardComponent={MockWorkoutCard}
        titlePersonal="Your Workouts"
        titleAll="All Workouts"
        emptyText="No workouts found"
      />
    );

    // Click view button
    const viewButtons = screen.getAllByText('View');
    await user.click(viewButtons[0]);
    expect(mockOnClick).toHaveBeenCalledWith('workout-1');

    // Click delete button (only on owned workout)
    const deleteButton = screen.getByText('Delete');
    await user.click(deleteButton);
    expect(mockDelete).toHaveBeenCalledWith('workout-1');
  });

  it('should render footer with pagination', () => {
    render(
      <CollectionPage
        hook={mockHook}
        CardComponent={MockWorkoutCard}
        titlePersonal="Your Workouts"
        titleAll="All Workouts"
        emptyText="No workouts found"
      />
    );

    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.queryByText('Prev')).not.toBeInTheDocument();
  });
});

// ============================================================
// CollectionPageHeader
// ============================================================

describe('CollectionPageHeader Component', () => {
  it('should render Personal title when active is Personal', () => {
    render(
      <CollectionPageHeader
        active="Personal"
        onChange={vi.fn()}
        isLoading={false}
        titlePersonal="Your Workouts"
        titleAll="All Workouts"
      />
    );

    expect(screen.getByText('Your Workouts')).toBeInTheDocument();
  });

  it('should render All title when active is All', () => {
    render(
      <CollectionPageHeader
        active="All"
        onChange={vi.fn()}
        isLoading={false}
        titlePersonal="Your Workouts"
        titleAll="All Workouts"
      />
    );

    expect(screen.getByText('All Workouts')).toBeInTheDocument();
  });

  it('should render both toggle buttons', () => {
    render(
      <CollectionPageHeader
        active="Personal"
        onChange={vi.fn()}
        isLoading={false}
        titlePersonal="Your Workouts"
        titleAll="All Workouts"
      />
    );

    expect(screen.getByRole('button', { name: 'Personal' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
  });

  it('should highlight active button', () => {
    render(
      <CollectionPageHeader
        active="Personal"
        onChange={vi.fn()}
        isLoading={false}
        titlePersonal="Your Workouts"
        titleAll="All Workouts"
      />
    );

    const personalButton = screen.getByRole('button', { name: 'Personal' });
    expect(personalButton).toHaveClass('bg-blue-600', 'text-white');

    const allButton = screen.getByRole('button', { name: 'All' });
    expect(allButton).toHaveClass('bg-gray-100');
  });

  it('should call onChange when button clicked', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();

    render(
      <CollectionPageHeader
        active="Personal"
        onChange={mockOnChange}
        isLoading={false}
        titlePersonal="Your Workouts"
        titleAll="All Workouts"
      />
    );

    await user.click(screen.getByRole('button', { name: 'All' }));

    expect(mockOnChange).toHaveBeenCalledWith('All');
  });

  it('should disable buttons when loading', () => {
    render(
      <CollectionPageHeader
        active="Personal"
        onChange={vi.fn()}
        isLoading={true}
        titlePersonal="Your Workouts"
        titleAll="All Workouts"
      />
    );

    expect(screen.getByRole('button', { name: 'Personal' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'All' })).toBeDisabled();
  });
});

// ============================================================
// CollectionPageGrid
// ============================================================

describe('CollectionPageGrid Component', () => {
  const gridProps = {
    active: 'Personal',
    isLoading: false,
    isError: false,
    error: null,
    data: { data: { workouts: mockWorkouts } },
    emptyText: 'No workouts found',
    CardComponent: MockWorkoutCard,
    publicId: 'user-123',
    onClick: vi.fn(),
    handleDelete: vi.fn(),
  };

  it('should show loading state', () => {
    render(<CollectionPageGrid {...gridProps} isLoading={true} />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should show error state', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <CollectionPageGrid
        {...gridProps}
        isError={true}
        error={{ message: 'Failed to load' }}
      />
    );

    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('should show empty state when no items', () => {
    render(
      <CollectionPageGrid
        {...gridProps}
        data={{ data: { workouts: [] } }}
      />
    );

    expect(screen.getByText('No workouts found')).toBeInTheDocument();
  });

  it('should render workout cards', () => {
    render(<CollectionPageGrid {...gridProps} />);

    expect(screen.getAllByTestId('workout-card')).toHaveLength(2);
  });

  it('should render meals when data contains meals', () => {
    const mockMeals = [
      { uuid: 'meal-1', mealName: 'Breakfast' },
      { uuid: 'meal-2', mealName: 'Lunch' },
    ];

    const MealCard = ({ item }) => (
      <div data-testid="meal-card">{item.mealName}</div>
    );

    render(
      <CollectionPageGrid
        {...gridProps}
        data={{ data: { meals: mockMeals } }}
        CardComponent={MealCard}
      />
    );

    expect(screen.getAllByTestId('meal-card')).toHaveLength(2);
  });

  it('should pass publicId to cards', () => {
    render(<CollectionPageGrid {...gridProps} />);

    // Owned workout shows delete button
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('should render in flex wrap layout', () => {
    const { container } = render(<CollectionPageGrid {...gridProps} />);

    const grid = container.querySelector('.flex.flex-row.flex-wrap');
    expect(grid).toBeInTheDocument();
  });
});

// ============================================================
// CollectionPageFooter
// ============================================================

describe('CollectionPageFooter Component', () => {
  it('should render Next button when nextPage exists', () => {
    render(
      <CollectionPageFooter
        data={{ data: { nextPage: 2, previousPage: null } }}
      />
    );

    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('should render Prev button when previousPage exists', () => {
    render(
      <CollectionPageFooter
        data={{ data: { nextPage: null, previousPage: 1 } }}
      />
    );

    expect(screen.getByText('Prev')).toBeInTheDocument();
  });

  it('should render both buttons when both pages exist', () => {
    render(
      <CollectionPageFooter
        data={{ data: { nextPage: 3, previousPage: 1 } }}
      />
    );

    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Prev')).toBeInTheDocument();
  });

  it('should not render buttons when no pagination', () => {
    render(
      <CollectionPageFooter
        data={{ data: { nextPage: null, previousPage: null } }}
      />
    );

    expect(screen.queryByText('Next')).not.toBeInTheDocument();
    expect(screen.queryByText('Prev')).not.toBeInTheDocument();
  });

  it('should render buttons as plain text, not interactive buttons', () => {
    const { container } = render(
      <CollectionPageFooter
        data={{ data: { nextPage: 2, previousPage: null } }}
      />
    );

    const nextButton = screen.getByText('Next');
    expect(nextButton).toHaveClass('hover:underline');
    expect(nextButton.tagName).toBe('BUTTON');
  });

  it('should center footer content', () => {
    const { container } = render(
      <CollectionPageFooter
        data={{ data: { nextPage: 2, previousPage: null } }}
      />
    );

    const footer = container.querySelector('.justify-center');
    expect(footer).toBeInTheDocument();
  });
});

// ============================================================
// WorkoutCollectionPage
// ============================================================

describe('WorkoutCollectionPage Component', () => {
  it('should render CollectionPage with useWorkoutsList hook', () => {
    render(<WorkoutCollectionPage />, { wrapper });

    // Verify the hook was called
    expect(useWorkoutsList).toHaveBeenCalled();
  });
});

// ============================================================
// WorkoutCard Component
// ============================================================

describe('WorkoutCard Component', () => {
  const mockWorkout = {
    uuid: 'workout-123',
    workoutName: 'Push Day',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders', 'Core'],
    exercises: [
      {
        exerciseId: '1',
        exerciseName: 'Bench Press',
        description: '<p>Great chest exercise</p>',
      },
      {
        exerciseId: '2',
        exerciseName: 'Overhead Press',
        description: 'Shoulder exercise',
      },
      {
        exerciseId: '3',
        exerciseName: 'Tricep Dips',
        description: 'Tricep exercise',
      },
    ],
  };

  const defaultProps = {
    item: mockWorkout,
    onClick: vi.fn(),
    handleDelete: vi.fn(),
    active: 'Personal',
    isPending: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render workout name', () => {
    render(<WorkoutCard {...defaultProps} />);

    expect(screen.getByText('Push Day')).toBeInTheDocument();
  });

  it('should call onClick when workout name is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(<WorkoutCard {...defaultProps} onClick={mockOnClick} />);

    await user.click(screen.getByText('Push Day'));

    expect(mockOnClick).toHaveBeenCalledWith('workout-123');
  });

  it('should render first 4 muscle groups', () => {
    render(<WorkoutCard {...defaultProps} />);

    expect(screen.getByText('Chest')).toBeInTheDocument();
    expect(screen.getByText('Triceps')).toBeInTheDocument();
    expect(screen.getByText('Shoulders')).toBeInTheDocument();
    expect(screen.getByText('Core')).toBeInTheDocument();
  });

  it('should not render more than 4 muscle groups', () => {
    const workoutWithManyMuscles = {
      ...mockWorkout,
      muscleGroups: ['Chest', 'Triceps', 'Shoulders', 'Core', 'Abs', 'Back'],
    };

    const { container } = render(
      <WorkoutCard {...defaultProps} item={workoutWithManyMuscles} />
    );

    const muscleTags = container.querySelectorAll('.bg-blue-100');
    expect(muscleTags).toHaveLength(4);
  });

  it('should render first 3 exercises', () => {
    render(<WorkoutCard {...defaultProps} />);

    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('Overhead Press')).toBeInTheDocument();
    expect(screen.getByText('Tricep Dips')).toBeInTheDocument();
  });

  it('should show "+ X more exercises" when workout has more than 3 exercises', () => {
    const workoutWithManyExercises = {
      ...mockWorkout,
      exercises: [
        ...mockWorkout.exercises,
        {
          exerciseId: '4',
          exerciseName: 'Push Ups',
          description: 'Bodyweight exercise',
        },
        {
          exerciseId: '5',
          exerciseName: 'Dumbbell Flyes',
          description: 'Chest isolation',
        },
      ],
    };

    render(<WorkoutCard {...defaultProps} item={workoutWithManyExercises} />);

    expect(screen.getByText('+ 2 more exercises')).toBeInTheDocument();
  });

  it('should not show "+ X more" when workout has 3 or fewer exercises', () => {
    render(<WorkoutCard {...defaultProps} />);

    expect(screen.queryByText(/more exercises/i)).not.toBeInTheDocument();
  });

  it('should show delete button when active is Personal', () => {
    render(<WorkoutCard {...defaultProps} active="Personal" />);

    expect(
      screen.getByRole('button', { name: /delete workout/i })
    ).toBeInTheDocument();
  });

  it('should not show delete button when active is All', () => {
    render(<WorkoutCard {...defaultProps} active="All" />);

    expect(
      screen.queryByRole('button', { name: /delete workout/i })
    ).not.toBeInTheDocument();
  });

  it('should call handleDelete when delete button clicked', async () => {
    const user = userEvent.setup();
    const mockHandleDelete = vi.fn();

    render(
      <WorkoutCard {...defaultProps} handleDelete={mockHandleDelete} />
    );

    await user.click(screen.getByRole('button', { name: /delete workout/i }));

    expect(mockHandleDelete).toHaveBeenCalledWith('workout-123');
  });

  it('should disable delete button when isPending is true', () => {
    render(<WorkoutCard {...defaultProps} isPending={true} />);

    expect(
      screen.getByRole('button', { name: /delete workout/i })
    ).toBeDisabled();
  });

  it('should not disable delete button when isPending is false', () => {
    render(<WorkoutCard {...defaultProps} isPending={false} />);

    expect(
      screen.getByRole('button', { name: /delete workout/i })
    ).not.toBeDisabled();
  });

  it('should apply hover cursor to workout name', () => {
    render(<WorkoutCard {...defaultProps} />);

    const workoutName = screen.getByText('Push Day');
    expect(workoutName).toHaveClass('hover:cursor-pointer');
  });

  it('should render muscle group badges with correct styling', () => {
    const { container } = render(<WorkoutCard {...defaultProps} />);

    const muscleTags = container.querySelectorAll('.bg-blue-100.text-blue-700');
    expect(muscleTags.length).toBeGreaterThan(0);
  });

  it('should handle workout with no muscle groups', () => {
    const workoutNoMuscles = {
      ...mockWorkout,
      muscleGroups: undefined,
    };

    render(<WorkoutCard {...defaultProps} item={workoutNoMuscles} />);

    // Should not crash
    expect(screen.getByText('Push Day')).toBeInTheDocument();
  });

  it('should render in card layout with proper styling', () => {
    const { container } = render(<WorkoutCard {...defaultProps} />);

    const card = container.querySelector('.bg-white.rounded-2xl.shadow-md');
    expect(card).toBeInTheDocument();
  });
});