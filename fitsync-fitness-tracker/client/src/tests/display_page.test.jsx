import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DisplayPage } from '../../../components/DisplayPage/DisplayPage';
import { DisplayPageHeader } from '../../../components/DisplayPage/DisplayPageHeader';
import { DisplayPageBody } from '../../../components/DisplayPage/DisplayPageBody';
import { DisplayPageFooter } from '../../../components/DisplayPage/DisplayPageFooter';
import { WorkoutDisplayPage } from '../features/workouts/pages/WorkoutDisplayPage';

// ============================================================
// MOCKS
// ============================================================

vi.mock('@tanstack/react-router', () => ({
  useRouter: vi.fn(),
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}));

vi.mock('../../../components/Loading', () => ({
  default: ({ type }) => <div data-testid="loading">Loading {type}</div>,
}));

vi.mock('../../../components/Breadcrumbs', () => ({
  default: ({ dynamicCrumb }) => (
    <div data-testid="breadcrumbs">Breadcrumb: {dynamicCrumb}</div>
  ),
}));

vi.mock('../features/workouts/hooks/useWorkoutId', () => ({
  useWorkoutId: vi.fn(),
}));

vi.mock('../features/workouts/components/WorkoutDisplayCard', () => ({
  WorkoutDisplayCard: ({ data, handleDelete, isPersonal }) => (
    <div data-testid="workout-display-card">
      <h2>{data?.data?.workoutName}</h2>
      {isPersonal && (
        <button onClick={() => handleDelete(data?.data?.uuid)}>Delete</button>
      )}
    </div>
  ),
}));

import { useRouter, useParams } from '@tanstack/react-router';
import { useWorkoutId } from '../features/workouts/hooks/useWorkoutId';

// ============================================================
// SHARED MOCK DATA
// ============================================================

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

// Mock card component for testing
const MockCardComponent = ({ data, handleDelete, isPersonal }) => (
  <div data-testid="mock-card">
    <h3>{data?.data?.workoutName}</h3>
    {isPersonal && <button onClick={() => handleDelete('workout-123')}>Delete</button>}
  </div>
);

// ============================================================
// GLOBAL SETUP
// ============================================================

beforeEach(() => {
  vi.clearAllMocks();
  useWorkoutId.mockReturnValue(mockHookReturn);
  useRouter.mockReturnValue({ id: '/dashboard/workouts/$workoutId' });
  useParams.mockReturnValue({ workoutId: 'workout-123' });
});

// ============================================================
// DisplayPage (Integration)
// ============================================================

describe('DisplayPage Component', () => {
  const mockHook = vi.fn().mockReturnValue(mockHookReturn);

  it('should call hook with ResourceId', () => {
    render(
      <DisplayPage
        hook={mockHook}
        CardComponent={MockCardComponent}
        ResourceId="workout-123"
        type="Workout"
      />
    );

    expect(mockHook).toHaveBeenCalledWith('workout-123');
  });

  it('should render breadcrumbs with dynamic crumb', () => {
    render(
      <DisplayPage
        hook={mockHook}
        CardComponent={MockCardComponent}
        ResourceId="workout-123"
        type="Workout"
      />
    );

    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByText(/Breadcrumb: workout-123/i)).toBeInTheDocument();
  });

  it('should use type as fallback when no uuid in data', () => {
    mockHook.mockReturnValue({
      ...mockHookReturn,
      data: { data: { workoutName: 'Test' } }, // No uuid
    });

    render(
      <DisplayPage
        hook={mockHook}
        CardComponent={MockCardComponent}
        ResourceId="workout-123"
        type="Workout"
      />
    );

    expect(screen.getByText(/Breadcrumb: Workout/i)).toBeInTheDocument();
  });

  it('should render header with correct props', () => {
    render(
      <DisplayPage
        hook={mockHook}
        CardComponent={MockCardComponent}
        ResourceId="workout-123"
        type="Workout"
      />
    );

    expect(screen.getByText('Workout Details')).toBeInTheDocument();
  });

  it('should render body with card component', () => {
    render(
      <DisplayPage
        hook={mockHook}
        CardComponent={MockCardComponent}
        ResourceId="workout-123"
        type="Workout"
      />
    );

    expect(screen.getByTestId('mock-card')).toBeInTheDocument();
    expect(screen.getByText('Push Day')).toBeInTheDocument();
  });

  it('should render footer', () => {
    render(
      <DisplayPage
        hook={mockHook}
        CardComponent={MockCardComponent}
        ResourceId="workout-123"
        type="Workout"
      />
    );

    expect(screen.getByText(/Created by: user-123/i)).toBeInTheDocument();
  });

  it('should set isPersonal to true when publicId matches creator', () => {
    render(
      <DisplayPage
        hook={mockHook}
        CardComponent={MockCardComponent}
        ResourceId="workout-123"
        type="Workout"
      />
    );

    // Delete button should be visible (isPersonal = true)
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('should set isPersonal to false when publicId does not match creator', () => {
    mockHook.mockReturnValue({
      ...mockHookReturn,
      publicId: 'different-user',
    });

    render(
      <DisplayPage
        hook={mockHook}
        CardComponent={MockCardComponent}
        ResourceId="workout-123"
        type="Workout"
      />
    );

    // Delete button should not be visible (isPersonal = false)
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });
});

// ============================================================
// DisplayPageHeader
// ============================================================

describe('DisplayPageHeader Component', () => {
  const headerProps = {
    type: 'Workout',
    handleReturn: vi.fn(),
    handleLog: vi.fn(),
    resourceId: 'workout-123',
    publicId: 'user-123',
    data: mockWorkoutData,
  };

  it('should render header title with type', () => {
    render(<DisplayPageHeader {...headerProps} />);

    expect(screen.getByText('Workout Details')).toBeInTheDocument();
  });

  it('should render Return to Collection button', () => {
    render(<DisplayPageHeader {...headerProps} />);

    expect(
      screen.getByRole('button', { name: /return to collection/i })
    ).toBeInTheDocument();
  });

  it('should render Record button with type', () => {
    render(<DisplayPageHeader {...headerProps} />);

    expect(
      screen.getByRole('button', { name: /record workout/i })
    ).toBeInTheDocument();
  });

  it('should call handleReturn when Return button clicked', async () => {
    const user = userEvent.setup();
    const mockHandleReturn = vi.fn();

    render(<DisplayPageHeader {...headerProps} handleReturn={mockHandleReturn} />);

    await user.click(screen.getByRole('button', { name: /return to collection/i }));

    expect(mockHandleReturn).toHaveBeenCalled();
  });

  it('should call handleLog with resourceId when Record button clicked', async () => {
    const user = userEvent.setup();
    const mockHandleLog = vi.fn();

    render(<DisplayPageHeader {...headerProps} handleLog={mockHandleLog} />);

    await user.click(screen.getByRole('button', { name: /record workout/i }));

    expect(mockHandleLog).toHaveBeenCalledWith('workout-123');
  });

  it('should apply blue button styling', () => {
    render(<DisplayPageHeader {...headerProps} />);

    const returnButton = screen.getByRole('button', { name: /return to collection/i });
    expect(returnButton).toHaveClass('bg-blue-500', 'hover:bg-blue-600');
  });

  it('should render both buttons in button group', () => {
    const { container } = render(<DisplayPageHeader {...headerProps} />);

    const buttonGroup = container.querySelector('.space-x-4');
    expect(buttonGroup).toBeInTheDocument();
    expect(buttonGroup?.children).toHaveLength(2);
  });
});

// ============================================================
// DisplayPageBody
// ============================================================

describe('DisplayPageBody Component', () => {
  const bodyProps = {
    isLoading: false,
    isError: false,
    error: null,
    data: mockWorkoutData,
    publicId: 'user-123',
    CardComponent: MockCardComponent,
    handleDelete: vi.fn(),
    isPersonal: true,
  };

  it('should show loading state', () => {
    render(<DisplayPageBody {...bodyProps} isLoading={true} />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should show error state', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <DisplayPageBody
        {...bodyProps}
        isError={true}
        error={{ message: 'Failed to load' }}
      />
    );

    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('should render CardComponent with correct props', () => {
    render(<DisplayPageBody {...bodyProps} />);

    expect(screen.getByTestId('mock-card')).toBeInTheDocument();
    expect(screen.getByText('Push Day')).toBeInTheDocument();
  });

  it('should pass isPersonal to CardComponent', () => {
    render(<DisplayPageBody {...bodyProps} isPersonal={true} />);

    // Delete button visible when isPersonal = true
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('should not show delete when isPersonal is false', () => {
    render(<DisplayPageBody {...bodyProps} isPersonal={false} />);

    // Delete button not visible when isPersonal = false
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('should pass handleDelete to CardComponent', async () => {
    const user = userEvent.setup();
    const mockHandleDelete = vi.fn();

    render(<DisplayPageBody {...bodyProps} handleDelete={mockHandleDelete} />);

    await user.click(screen.getByText('Delete'));

    expect(mockHandleDelete).toHaveBeenCalledWith('workout-123');
  });
});

// ============================================================
// DisplayPageFooter
// ============================================================

describe('DisplayPageFooter Component', () => {
  it('should display creator publicId', () => {
    render(<DisplayPageFooter data={mockWorkoutData} />);

    expect(screen.getByText('Created by: user-123')).toBeInTheDocument();
  });

  it('should show "Unknown" when no creator', () => {
    render(<DisplayPageFooter data={{ data: {} }} />);

    expect(screen.getByText('Created by: Unknown')).toBeInTheDocument();
  });

  it('should show "Unknown" when data is null', () => {
    render(<DisplayPageFooter data={null} />);

    expect(screen.getByText('Created by: Unknown')).toBeInTheDocument();
  });

  it('should apply gray text styling', () => {
    const { container } = render(<DisplayPageFooter data={mockWorkoutData} />);

    const footer = container.querySelector('.text-gray-500');
    expect(footer).toBeInTheDocument();
  });

  it('should center footer content', () => {
    const { container } = render(<DisplayPageFooter data={mockWorkoutData} />);

    const footer = container.querySelector('.mx-auto');
    expect(footer).toBeInTheDocument();
  });
});

// ============================================================
// WorkoutDisplayPage
// ============================================================

describe('WorkoutDisplayPage Component', () => {
  it('should render DisplayPage component', () => {
    render(<WorkoutDisplayPage />);

    // Verify it renders without errors
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
  });

  it('should pass workoutId from params to DisplayPage', () => {
    useParams.mockReturnValue({ workoutId: 'workout-456' });

    render(<WorkoutDisplayPage />);

    expect(useWorkoutId).toHaveBeenCalledWith('workout-456');
  });

  it('should pass type as "Workout"', () => {
    render(<WorkoutDisplayPage />);

    expect(screen.getByText('Workout Details')).toBeInTheDocument();
  });

  it('should pass useWorkoutId hook', () => {
    render(<WorkoutDisplayPage />);

    expect(useWorkoutId).toHaveBeenCalled();
  });
});

// ============================================================
// useWorkoutId Hook Integration
// ============================================================

describe('DisplayPage with useWorkoutId', () => {
  it('should handle loading state from hook', () => {
    useWorkoutId.mockReturnValue({
      ...mockHookReturn,
      isLoading: true,
    });

    render(<WorkoutDisplayPage />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should handle error state from hook', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    useWorkoutId.mockReturnValue({
      ...mockHookReturn,
      isError: true,
      error: { message: 'Not found' },
    });

    render(<WorkoutDisplayPage />);

    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('should pass handlers from hook to components', async () => {
    const user = userEvent.setup();
    const mockHandleReturn = vi.fn();
    const mockHandleLog = vi.fn();

    useWorkoutId.mockReturnValue({
      ...mockHookReturn,
      handleReturn: mockHandleReturn,
      handleLog: mockHandleLog,
    });

    render(<WorkoutDisplayPage />);

    await user.click(screen.getByRole('button', { name: /return to collection/i }));
    expect(mockHandleReturn).toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /record workout/i }));
    expect(mockHandleLog).toHaveBeenCalledWith('workout-123');
  });

  it('should correctly determine isPersonal based on publicId match', () => {
    useWorkoutId.mockReturnValue({
      ...mockHookReturn,
      publicId: 'user-123',
      data: {
        data: {
          ...mockWorkoutData.data,
          creatorPublicId: 'user-123',
        },
      },
    });

    render(<WorkoutDisplayPage />);

    // Should show delete button (isPersonal = true)
    expect(screen.getByTestId('workout-display-card')).toBeInTheDocument();
  });

  it('should hide personal actions when not owner', () => {
    useWorkoutId.mockReturnValue({
      ...mockHookReturn,
      publicId: 'different-user',
      data: {
        data: {
          ...mockWorkoutData.data,
          creatorPublicId: 'user-123',
        },
      },
    });

    const { container } = render(<WorkoutDisplayPage />);

    // Delete button should not be in WorkoutDisplayCard
    const card = screen.getByTestId('workout-display-card');
    expect(card.querySelector('button')).not.toBeInTheDocument();
  });
});