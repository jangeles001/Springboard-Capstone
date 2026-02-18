import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CollectionPage } from '../../../components/CollectionPage/CollectionPage';
import { CollectionPageHeader } from '../../../components/CollectionPage/CollectionPageHeader';
import { CollectionPageGrid } from '../../../components/CollectionPage/CollectionPageGrid';
import { CollectionPageFooter } from '../../../components/CollectionPage/CollectionPageFooter';
import { WorkoutCollectionPage } from '../features/workouts/pages/WorkoutCollectionPage';

// ============================================================
// MOCKS
// ============================================================

vi.mock('../../../components/Loading', () => ({
  default: ({ type }) => <div data-testid="loading">Loading {type}</div>,
}));

// Mock the WorkoutCard component
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

  it('should apply hover underline styling', () => {
    render(
      <CollectionPageFooter
        data={{ data: { nextPage: 2, previousPage: null } }}
      />
    );

    const nextButton = screen.getByText('Next');
    expect(nextButton).toHaveClass('hover:underline');
  });
});

// ============================================================
// WorkoutCollectionPage
// ============================================================

describe('WorkoutCollectionPage Component', () => {
  it('should render and pass correct props to CollectionPage', () => {
    const { container } = render(<WorkoutCollectionPage />);

    // Just verify it renders without errors
    expect(container.firstChild).toBeInTheDocument();
  });
});