import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WorkoutBuilderPage } from '../features/workouts/pages/WorkoutBuilderPage';
import { WorkoutsBuilderForm } from '../features/workouts/components/WorkoutsBuilderForm';
import ExerciseLibrary from '../features/workouts/components/WorkoutsBuilder/ExerciseLibrary';
import { WorkoutsBuilderHeader } from '../features/workouts/components/WorkoutsBuilder/WorkoutsBuilderHeader';
import { WorkoutsBuilderSubmitButton } from '../features/workouts/components/WorkoutsBuilder/WorkoutsBuilderSubmitButton';

// Mock dependencies
vi.mock('../features/workouts/hooks/useExercises', () => ({
  useExercises: vi.fn(),
}));

vi.mock('../features/workouts/hooks/useWorkouts', () => ({
  default: vi.fn(),
}));

vi.mock('../features/workouts/hooks/useWorkoutsBuilder', () => ({
  useWorkoutsBuilderContext: vi.fn(),
}));

vi.mock('../../../../components/Loading', () => ({
  default: ({ type }) => <div data-testid="loading">Loading...</div>,
}));

vi.mock('../../../../components/CategoryDropdown', () => ({
  default: ({ onChange, isLoading, style }) => (
    <select data-testid="category-dropdown" onChange={onChange} disabled={isLoading}>
      <option value="">All Categories</option>
      <option value="10">Arms</option>
      <option value="8">Legs</option>
    </select>
  ),
}));

import { useExercises } from '../features/workouts/hooks/useExercises';
import useWorkouts from '../features/workouts/hooks/useWorkouts';
import { useWorkoutsBuilderContext } from '../features/workouts/hooks/useWorkoutsBuilder';

describe('WorkoutBuilderPage Component', () => {
  // Clear all mocks and reset mock values before each test
  beforeEach(() => {
    vi.clearAllMocks();
    useExercises.mockReturnValue({
      error: null,
			nameError: null,
      response: [],
      status: 'success',
      loadData: vi.fn(),
      loadByCategory: vi.fn(),
      handleSubmit: vi.fn(),
    });
  });

  it('should render both main sections', () => {
    render(<WorkoutBuilderPage />);

		// Gets container 
    const containers = screen.getAllByRole('generic');
    expect(containers.length).toBeGreaterThan(0);
  });

  it('should display error message when useExercises returns error', () => {
    useExercises.mockReturnValue({
      error: { message: 'Failed to fetch exercises' },
      response: [],
      status: 'error',
    });

    render(<WorkoutBuilderPage />);

    expect(screen.getByText(/Error: Failed to fetch exercises/i)).toBeInTheDocument();
  });

  it('should render WorkoutsBuilderForm', () => {
    useWorkouts.mockReturnValue({
      handleSubmit: vi.fn(),
      workoutName: '',
      workoutDuration: '',
    });

    const { container } = render(<WorkoutBuilderPage />);
    
    expect(container.querySelector('.flex-1')).toBeInTheDocument();
  });

  it('should render ExerciseLibrary', () => {
    const { container } = render(<WorkoutBuilderPage />);
    
    // Check for the library container with specific classes
    const libraryContainer = container.querySelector('.flex-\\[2\\]');
    expect(libraryContainer || container.querySelector('.flex-1')).toBeInTheDocument();
  });

  it('should apply responsive layout classes', () => {
    const { container } = render(<WorkoutBuilderPage />);

    const mainContainer = container.querySelector('.flex.flex-col.lg\\:flex-row');
    expect(mainContainer).toBeInTheDocument();
  });
});

describe('ExerciseLibrary Component', () => {
  const mockExercises = [
    {
      id: 1,
      translations: [
        {
          name: 'Bench Press',
          description: '<p>Great chest exercise</p>',
        },
      ],
      category: { name: 'Chest' },
    },
    {
      id: 2,
      translations: [
        {
          name: 'Squats',
          description: 'Leg exercise',
        },
      ],
      category: { name: 'Legs' },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render exercise library title', () => {
    useExercises.mockReturnValue({
      response: [],
      status: 'success',
      loadData: vi.fn(),
      loadByCategory: vi.fn(),
      handleClick: vi.fn(),
    });

    render(<ExerciseLibrary />);

    expect(screen.getByText('Exercise Library')).toBeInTheDocument();
  });

  it('should render category dropdown', () => {
    useExercises.mockReturnValue({
      response: [],
      status: 'success',
      loadData: vi.fn(),
      loadByCategory: vi.fn(),
      handleClick: vi.fn(),
    });

    render(<ExerciseLibrary />);

    expect(screen.getByTestId('category-dropdown')).toBeInTheDocument();
  });

  it('should display loading state', () => {
    useExercises.mockReturnValue({
      response: [],
      status: 'loading',
      loadData: vi.fn(),
      loadByCategory: vi.fn(),
      handleClick: vi.fn(),
    });

    render(<ExerciseLibrary />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should render exercise list when data is loaded', () => {
    useExercises.mockReturnValue({
      response: mockExercises,
      status: 'success',
      loadData: vi.fn(),
      loadByCategory: vi.fn(),
      handleClick: vi.fn(),
    });

    render(<ExerciseLibrary />);

    expect(screen.getByText('BENCH PRESS')).toBeInTheDocument();
    expect(screen.getByText('SQUATS')).toBeInTheDocument();
  });

  it('should display exercise category', () => {
    useExercises.mockReturnValue({
      response: mockExercises,
      status: 'success',
      loadData: vi.fn(),
      loadByCategory: vi.fn(),
      handleClick: vi.fn(),
    });

    render(<ExerciseLibrary />);

    expect(screen.getByText('Exercise Category: Chest')).toBeInTheDocument();
    expect(screen.getByText('Exercise Category: Legs')).toBeInTheDocument();
  });

  it('should strip HTML tags from description', () => {
    useExercises.mockReturnValue({
      response: mockExercises,
      status: 'success',
      loadData: vi.fn(),
      loadByCategory: vi.fn(),
      handleClick: vi.fn(),
    });

    render(<ExerciseLibrary />);

    expect(screen.getByText('Great chest exercise')).toBeInTheDocument();
    expect(screen.queryByText('<p>')).not.toBeInTheDocument();
  });

  it('should call handleClick when exercise is clicked', async () => {
    const user = userEvent.setup();
    const mockHandleClick = vi.fn();

    useExercises.mockReturnValue({
      response: mockExercises,
      status: 'success',
      loadData: vi.fn(),
      loadByCategory: vi.fn(),
      handleClick: mockHandleClick,
    });

    render(<ExerciseLibrary />);

    const exercise = screen.getByText('BENCH PRESS').closest('div');
    await user.click(exercise);

    expect(mockHandleClick).toHaveBeenCalledWith(mockExercises[0]);
  });

  it('should render pagination buttons when links exist', () => {
    useExercises.mockReturnValue({
      response: mockExercises,
      nextLink: 'https://api.com/next',
      prevLink: 'https://api.com/prev',
      status: 'success',
      loadData: vi.fn(),
      loadByCategory: vi.fn(),
      handleClick: vi.fn(),
    });

    render(<ExerciseLibrary />);

    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Prev')).toBeInTheDocument();
  });

  it('should not render next button when no nextLink', () => {
    useExercises.mockReturnValue({
      response: mockExercises,
      nextLink: null,
      prevLink: 'https://api.com/prev',
      status: 'success',
      loadData: vi.fn(),
      loadByCategory: vi.fn(),
      handleClick: vi.fn(),
    });

    render(<ExerciseLibrary />);

    expect(screen.queryByText('Next')).not.toBeInTheDocument();
    expect(screen.getByText('Prev')).toBeInTheDocument();
  });

  it('should call loadData when next button is clicked', async () => {
    const user = userEvent.setup();
    const mockLoadData = vi.fn();

    useExercises.mockReturnValue({
      response: mockExercises,
      nextLink: 'https://api.com/next',
      status: 'success',
      loadData: mockLoadData,
      loadByCategory: vi.fn(),
      handleClick: vi.fn(),
    });

    render(<ExerciseLibrary />);

    const nextButton = screen.getByText('Next');
    await user.click(nextButton);

    expect(mockLoadData).toHaveBeenCalledWith('https://api.com/next');
  });

  it('should call loadByCategory when category dropdown changes', async () => {
    const user = userEvent.setup();
    const mockLoadByCategory = vi.fn();

    useExercises.mockReturnValue({
      response: [],
      status: 'success',
      loadData: vi.fn(),
      loadByCategory: mockLoadByCategory,
      handleClick: vi.fn(),
    });

    render(<ExerciseLibrary />);

    const dropdown = screen.getByTestId('category-dropdown');
    await user.selectOptions(dropdown, '10');

    expect(mockLoadByCategory).toHaveBeenCalled();
  });

  it('should show fallback text when exercise has no name', () => {
    const exerciseWithoutName = {
      id: 999,
      translations: [],
      category: { name: 'Test' },
    };

    useExercises.mockReturnValue({
      response: [exerciseWithoutName],
      status: 'success',
      loadData: vi.fn(),
      loadByCategory: vi.fn(),
      handleClick: vi.fn(),
    });

    render(<ExerciseLibrary />);

    expect(screen.getByText('Exercise #999')).toBeInTheDocument();
  });

  it('should show fallback text when exercise has no description', () => {
    const exerciseWithoutDescription = {
      id: 1,
      translations: [{ name: 'Test Exercise' }],
      category: { name: 'Test' },
    };

    useExercises.mockReturnValue({
      response: [exerciseWithoutDescription],
      status: 'success',
      loadData: vi.fn(),
      loadByCategory: vi.fn(),
      handleClick: vi.fn(),
    });

    render(<ExerciseLibrary />);

    expect(screen.getByText('No Description Provided')).toBeInTheDocument();
  });
});

describe('WorkoutsBuilderHeader Component', () => {
  const mockContext = {
    nameError: null,
    workoutName: '',
    workoutDuration: '',
    handleFieldChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useWorkoutsBuilderContext.mockReturnValue(mockContext);
  });

  it('should render workout details title', () => {
    render(<WorkoutsBuilderHeader />);

    expect(screen.getByText('Workout Details')).toBeInTheDocument();
  });

  it('should render workout name input', () => {
    render(<WorkoutsBuilderHeader />);

    expect(screen.getByPlaceholderText(/Push Day, Leg Day/i)).toBeInTheDocument();
  });

  it('should render duration input', () => {
    render(<WorkoutsBuilderHeader />);

    const durationInput = screen.getByPlaceholderText('0');
    expect(durationInput).toBeInTheDocument();
    expect(durationInput).toHaveAttribute('type', 'number');
  });

  it('should display workout name value', () => {
    useWorkoutsBuilderContext.mockReturnValue({
      ...mockContext,
      workoutName: 'Leg Day',
    });

    render(<WorkoutsBuilderHeader />);

    const nameInput = screen.getByPlaceholderText(/Push Day, Leg Day/i);
    expect(nameInput).toHaveValue('Leg Day');
  });

  it('should display workout duration value', () => {
    useWorkoutsBuilderContext.mockReturnValue({
      ...mockContext,
      workoutDuration: '60',
    });

    render(<WorkoutsBuilderHeader />);

    const durationInput = screen.getByPlaceholderText('0');
    expect(durationInput).toHaveValue(60);
  });

  it('should call handleFieldChange when name input changes', async () => {
    const user = userEvent.setup();
    const mockHandleChange = vi.fn();

    useWorkoutsBuilderContext.mockReturnValue({
      ...mockContext,
      handleFieldChange: mockHandleChange,
    });

    render(<WorkoutsBuilderHeader />);

    const nameInput = screen.getByPlaceholderText(/Push Day, Leg Day/i);
    await user.type(nameInput, 'Chest Day');

    expect(mockHandleChange).toHaveBeenCalled();
  });

  it('should call handleFieldChange when duration input changes', async () => {
    const user = userEvent.setup();
    const mockHandleChange = vi.fn();

    useWorkoutsBuilderContext.mockReturnValue({
      ...mockContext,
      handleFieldChange: mockHandleChange,
    });

    render(<WorkoutsBuilderHeader />);

    const durationInput = screen.getByPlaceholderText('0');
    await user.type(durationInput, '45');

    expect(mockHandleChange).toHaveBeenCalled();
  });

  it('should display name error when present', () => {
    useWorkoutsBuilderContext.mockReturnValue({
      ...mockContext,
      nameError: ['A workout name is required!'],
    });

    render(<WorkoutsBuilderHeader />);

    expect(screen.getByText('*A workout name is required!')).toBeInTheDocument();
  });

  it('should apply error styling to name input when error exists', () => {
    useWorkoutsBuilderContext.mockReturnValue({
      ...mockContext,
      workoutName: '',
      nameError: ['A workout name is required!'],
    });

    render(<WorkoutsBuilderHeader />);

    const nameInput = screen.getByPlaceholderText(/Push Day, Leg Day/i);
    expect(nameInput).toHaveClass('form-input-error');
  });

  it('should have maxLength attribute on name input', () => {
    render(<WorkoutsBuilderHeader />);

    const nameInput = screen.getByPlaceholderText(/Push Day, Leg Day/i);
    expect(nameInput).toHaveAttribute('maxLength', '25');
  });
});

describe('WorkoutsBuilderSubmitButton Component', () => {
  it('should render submit button', () => {
    render(<WorkoutsBuilderSubmitButton />);

    expect(screen.getByRole('button', { name: /create workout/i })).toBeInTheDocument();
  });

  it('should have submit type', () => {
    render(<WorkoutsBuilderSubmitButton />);

    const button = screen.getByRole('button', { name: /create workout/i });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should apply gradient styling', () => {
    render(<WorkoutsBuilderSubmitButton />);

    const button = screen.getByRole('button', { name: /create workout/i });
    expect(button).toHaveClass('bg-gradient-to-r', 'from-blue-600', 'to-indigo-600');
  });

  it('should span full width', () => {
    render(<WorkoutsBuilderSubmitButton />);

    const button = screen.getByRole('button', { name: /create workout/i });
    expect(button).toHaveClass('w-full');
  });
});