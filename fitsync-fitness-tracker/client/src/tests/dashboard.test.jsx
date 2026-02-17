import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../features/dashboard/components/Dashboard';
import { DashboardDisplayHeader } from '../features/dashboard/components/DashboardDisplay/DashboardDisplayHeader';
import { DashboardDisplayFooter } from '../features/dashboard/components/DashboardDisplay/DashboardDisplayFooter';
import GraphCarousel from '../features/dashboard/components/DashboardDisplay/GraphCarousel';
import Graph from '../features/dashboard/components/DashboardDisplay/Graph';
import { MetricChart } from '../features/dashboard/components/DashboardDisplay/MetricChart';

// Mock Chart.js
vi.mock('react-chartjs-2', () => ({
  Chart: ({ type, data }) => <div data-testid={`chart-${type}`}>Chart: {type}</div>,
  Line: ({ data }) => <div data-testid="line-chart">Line Chart</div>,
  Bar: ({ data }) => <div data-testid="bar-chart">Bar Chart</div>,
}));

// Mock Chart.js registration
vi.mock('chart.js', () => {
  const mockRegister = vi.fn();
  
  return {
    Chart: {
      register: mockRegister,
    },
    CategoryScale: vi.fn(),
    LinearScale: vi.fn(),
    PointElement: vi.fn(),
    LineElement: vi.fn(),
    BarElement: vi.fn(),
    ArcElement: vi.fn(),
    Title: vi.fn(),
    Tooltip: vi.fn(),
    Legend: vi.fn(),
    Filler: vi.fn(),
    register: mockRegister,
  };
});

// Mock dashboard hook
vi.mock('../features/dashboard/hooks/useDashboard', () => ({
  useDashboard: vi.fn(),
}));

// Mock context hook
vi.mock('../features/dashboard/hooks/useDashboardContext', () => ({
  useDashboardDisplayContext: vi.fn(),
}));

// Import the mocked hooks
import { useDashboard } from '../features/dashboard/hooks/useDashboard';
import { useDashboardDisplayContext } from '../features/dashboard/hooks/useDashboardContext';

describe('Dashboard Component', () => {
  // Mock data for dashboard context
  const mockDashboardData = {
    activeView: 'nutrition',
    handleActiveChange: vi.fn(),
    nutritionQuery: { isLoading: false, data: null, error: null },
    workoutQuery: { isLoading: false, data: null, error: null },
    activeQuery: { isLoading: false, data: null, error: null },
    recommendationsQuery: { isLoading: false, data: null, error: null },
  };

  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
    useDashboard.mockReturnValue(mockDashboardData);
    useDashboardDisplayContext.mockReturnValue(mockDashboardData);
  });

  describe('Dashboard Main Component', () => {
    it('should render dashboard container with proper styling', () => {
      render(<Dashboard />);

      // Check for the main container div with expected classes
      expect(screen.getByTestId('dashboard-container')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-container')).toHaveClass('mx-auto', 'max-w-7xl', 'px-6', 'py-10');
    });

    it('should render all dashboard sections', () => {
      render(<Dashboard />);

      // The component structure should be present
      expect(screen.getByTestId('dashboard-display-header')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-display-body')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-display-footer')).toBeInTheDocument();
    });
  });
});

describe('DashboardDisplayHeader Component', () => {
  // Mock context values for header tests
  const mockContext = {
    activeView: 'nutrition',
    handleActiveChange: vi.fn(),
    workoutQuery: { isLoading: false },
    nutritionQuery: { isLoading: false },
  };

  beforeEach(() => {
    // Clear mocks and set default context values before each test
    vi.clearAllMocks();
    useDashboardDisplayContext.mockReturnValue(mockContext);
  });

  it('should render header title and description', () => {
    render(<DashboardDisplayHeader />);

    // Check for title and description text
    expect(screen.getByText('Progress Insights')).toBeInTheDocument();
    expect(screen.getByText(/Track nutrition and training trends/i)).toBeInTheDocument();
  });

  it('should render both toggle buttons', () => {
    render(<DashboardDisplayHeader />);

    // Check for presence of both buttons
    expect(screen.getByRole('button', { name: /nutrition/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /workouts/i })).toBeInTheDocument();
  });

  it('should highlight active view button', () => {
    // Set active view to nutrition
    useDashboardDisplayContext.mockReturnValue({
      ...mockContext,
      activeView: 'nutrition',
    });

    render(<DashboardDisplayHeader />);

    // Check if nutrition button has active styling
    const nutritionButton = screen.getByRole('button', { name: /nutrition/i });
    expect(nutritionButton).toHaveClass('bg-blue-600', 'text-white');
  });

  it('should call handleActiveChange when nutrition button clicked', async () => {
    // Use userEvent to simulate user interactions
    const user = userEvent.setup();
    const mockHandleChange = vi.fn();

    // Set active view to workouts
    useDashboardDisplayContext.mockReturnValue({
      ...mockContext,
      activeView: 'workouts',
      handleActiveChange: mockHandleChange,
    });

    render(<DashboardDisplayHeader />);

    // Click the nutrition button
    const nutritionButton = screen.getByRole('button', { name: /nutrition/i });
    await user.click(nutritionButton);

    // Expect the handleActiveChange function to be called with 'nutrition'
    expect(mockHandleChange).toHaveBeenCalledWith('nutrition');
  });

  it('should call handleActiveChange when workouts button clicked', async () => {
    // Use userEvent to simulate user interactions
    const user = userEvent.setup();
    const mockHandleChange = vi.fn();

    // Set active view to nutrition
    useDashboardDisplayContext.mockReturnValue({
      ...mockContext,
      handleActiveChange: mockHandleChange,
    });

    render(<DashboardDisplayHeader />);

    // Click the workouts button
    const workoutsButton = screen.getByRole('button', { name: /workouts/i });
    await user.click(workoutsButton);

    // Expect the handleActiveChange function to be called with 'workouts'
    expect(mockHandleChange).toHaveBeenCalledWith('workouts');
  });

  it('should disable nutrition button when query is loading', () => {
    // Set nutrition query to loading state
    useDashboardDisplayContext.mockReturnValue({
      ...mockContext,
      nutritionQuery: { isLoading: true },
    });

    render(<DashboardDisplayHeader />);

    // Check if nutrition button is disabled
    const nutritionButton = screen.getByRole('button', { name: /nutrition/i });
    expect(nutritionButton).toBeDisabled();
  });

  it('should disable workouts button when query is loading', () => {
    // Set workout query to loading state
    useDashboardDisplayContext.mockReturnValue({
      ...mockContext,
      workoutQuery: { isLoading: true },
    });

    render(<DashboardDisplayHeader />);

    // Check if workouts button is disabled
    const workoutsButton = screen.getByRole('button', { name: /workouts/i });
    expect(workoutsButton).toBeDisabled();
  });

  it('should apply inactive styling to non-active button', () => {
    // Set active view to nutrition
    useDashboardDisplayContext.mockReturnValue({
      ...mockContext,
      activeView: 'nutrition',
    });

    render(<DashboardDisplayHeader />);

    // Check if workouts button has inactive styling
    const workoutsButton = screen.getByRole('button', { name: /workouts/i });
    expect(workoutsButton).toHaveClass('bg-gray-100');
    expect(workoutsButton).not.toHaveClass('bg-blue-600');
  });
});

describe('DashboardDisplayFooter Component', () => {
  // Mock context values for footer tests
  const mockRecommendations = {
    data: {
      insights: {
        muscleImbalances: 'Your chest is underdeveloped',
        progressionTips: 'Focus on compound movements',
      },
      recommendations: [
        {
          exerciseName: 'Bench Press',
          description: 'Great for chest development',
          reasoning: 'Targets your weak area',
          targetMuscles: ['chest', 'triceps'],
        },
      ],
    },
  }

  beforeEach(() => {
    // Clear mocks before each test
    vi.clearAllMocks();
  });

  it('should show loading state', () => {
    // Set recommendations query to loading state
    useDashboardDisplayContext.mockReturnValue({
      recommendationsQuery: { isLoading: true },
    });

    // Destructure container from render to check for loading skeleton
    const { container } = render(<DashboardDisplayFooter />);

    // Check for loading text and pulse animation
    expect(screen.getByText(/Loading personalized recommendations/i)).toBeInTheDocument();
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('should render AI Coach Insights title', () => {
    // Set recommendations query with mock data
    useDashboardDisplayContext.mockReturnValue({
      recommendationsQuery: { isLoading: false, data: mockRecommendations },
    });

    render(<DashboardDisplayFooter />);

    // Check for the presence of the AI Coach Insights title
    expect(screen.getByText('AI Coach Insights')).toBeInTheDocument();
  });

  it('should display muscle imbalances', () => {
    // Set recommendations query with mock data
    useDashboardDisplayContext.mockReturnValue({
      recommendationsQuery: { isLoading: false, data: mockRecommendations },
    });

    render(<DashboardDisplayFooter />);

    // Check for the existance of the muscle imbalances insight text from the mock data
    expect(screen.getByText('Your chest is underdeveloped')).toBeInTheDocument();
  });

  it('should display progression tips', () => {
    // Set recommendations query with mock data
    useDashboardDisplayContext.mockReturnValue({
      recommendationsQuery: { isLoading: false, data: mockRecommendations },
    });

    render(<DashboardDisplayFooter />);

    // Check for the existance of the progression tips insight text from the mock data
    expect(screen.getByText('Focus on compound movements')).toBeInTheDocument();
  });

  it('should display recommended exercises', () => {
    // Set recommendations query with mock data
    useDashboardDisplayContext.mockReturnValue({
      recommendationsQuery: { isLoading: false, data: mockRecommendations },
    });

    render(<DashboardDisplayFooter />);

    // Check for the existance of the recommended exercise name and description from the mock data
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText(/Great for chest development/i)).toBeInTheDocument();
  });

  it('should display exercise reasoning', () => {
    // Set recommendations query with mock data
    useDashboardDisplayContext.mockReturnValue({
      recommendationsQuery: { isLoading: false, data: mockRecommendations },
    });

    render(<DashboardDisplayFooter />);

    // Check for the existance of the recommended exercise reasoning from the mock data
    expect(screen.getByText(/Targets your weak area/i)).toBeInTheDocument();
  });

  it('should display target muscles', () => {
    // Set recommendations query with mock data
    useDashboardDisplayContext.mockReturnValue({
      recommendationsQuery: { isLoading: false, data: mockRecommendations },
    });

    render(<DashboardDisplayFooter />);

    // Check for the existance of the target muscles text and the specific muscles from the mock data
    expect(screen.getByText(/target muscles:/i)).toBeInTheDocument();
    expect(screen.getByText(/chest, triceps/i)).toBeInTheDocument();
  });
});

describe('Graph Component', () => {
  // Mock data for graph tests
  const mockData = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Calories',
        data: [2000, 2100, 2200],
      },
    ],
  };

  it('should render line chart when type is line', () => {
    render(<Graph type="line" data={mockData} />);

    // 
    expect(screen.getByTestId('chart-line')).toBeInTheDocument();
  });

  it('should show "NO DATA" message when data is empty', () => {
    render(<Graph type="line" data={[]} />);

    // Check for the existance of the NO DATA message and prompt to record a workout
    expect(screen.getByText(/NO DATA/i)).toBeInTheDocument();
    expect(screen.getByText(/Record a workout/i)).toBeInTheDocument();
  });

  it('should accept custom options prop', () => {
    // Set custom options for the graph
    const options = { responsive: true };
    render(<Graph type="line" data={mockData} options={options} />);

    // Check for the existance of the line chart
    expect(screen.getByTestId('chart-line')).toBeInTheDocument();
  });

  it('should default to line type', () => {
    render(<Graph data={mockData} />);

    // Check for the existance of the line chart when no type is provided
    expect(screen.getByTestId('chart-line')).toBeInTheDocument();
  });
});

describe('GraphCarousel Component', () => {
  beforeEach(() => {
    // Use fake timers for testing auto-advance functionality
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Restore real timers after each test
    vi.useRealTimers();
  });

  it('should render children slides', () => {
    render(
      <GraphCarousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </GraphCarousel>
    );

    // Check for the existance of all slides in the carousel
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
    expect(screen.getByText('Slide 3')).toBeInTheDocument();
  });

  it('should render navigation buttons', () => {
    render(
      <GraphCarousel>
        <div>Slide 1</div>
      </GraphCarousel>
    );

    // Check for the existance of both previous and next navigation buttons
    expect(
      screen.getByRole('button', { name: /previous chart button/i })
    ).toBeInTheDocument();
  
    expect(
      screen.getByRole('button', { name: /next chart button/i })
    ).toBeInTheDocument();
  });

  it('should advance to next slide when next button clicked', async () => {
    // Use real timers for this test to allow state updates to occur
    vi.useRealTimers();

    // Use userEvent to simulate user interactions
    const user = userEvent.setup();

    render(
      <GraphCarousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
      </GraphCarousel>
    );

    // Select the track element that has the translateX style for slide movement
    const track = screen.getByTestId('graph-carousel-track');
    
    // Check initial position is at the first slide
    expect(track.style.transform).toBe('translateX(-0%)');
    
    // Click the next button
    const nextButton = screen.getByRole('button', { name: /next chart button/i });
    
    // Wait for the click event and check if the carousel has moved to the next slide
    await user.click(nextButton);
    expect(track.style.transform).toBe('translateX(-100%)');
  });

  it('should go to previous slide when prev button clicked', async () => {
    // Use real timers for this test to allow state updates to occur
    vi.useRealTimers();

    // Use userEvent to simulate user interactions
		const user = userEvent.setup();

    render(
      <GraphCarousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
      </GraphCarousel>
    );

    // Select the track element that has the translateX style for slide movement
  	const track = screen.getByTestId('graph-carousel-track');
    
    // Check initial position is at the first slide
  	expect(track.style.transform).toBe('translateX(-0%)');

  	// Click next to move to second slide
  	const nextButton = screen.getByRole('button', { name: /next chart button/i });
  	await user.click(nextButton);

    // Confirm if we are on the second slide
  	expect(track.style.transform).toBe('translateX(-100%)');

    // Wait for the animation to complete before clicking previous
		await act( async ()=> await new Promise(resolve => setTimeout(resolve, 700)));
    const prevButton = screen.getByRole('button', { name: /previous chart button/i });
  	await user.click(prevButton);

  	// Check if we are back on the first slide
  	expect(track.style.transform).toBe('translateX(-0%)');
  });

  it('should handle single child', () => {
    render(
      <GraphCarousel>
        <div>Only Slide</div>
      </GraphCarousel>
    );

    // Check for the existance of the single slide and ensure it is rendered properly
    expect(screen.getByText('Only Slide')).toBeInTheDocument();
  });

  it('should auto-advance after interval', () => {
    render(
      <GraphCarousel interval={1000}>
        <div>Slide 1</div>
        <div>Slide 2</div>
      </GraphCarousel>
    );

    // Select the track element that has the translateX style for slide movement
    const track = screen.getByTestId('graph-carousel-track');
    
    // Check initial position is at the first slide
    expect(track.style.transform).toBe('translateX(-0%)');

    // Advance timers by interval time to trigger auto-advance  
    act(() => vi.advanceTimersByTime(1000));

    // Check if the carousel has moved to the next slide
    expect(track.style.transform).toBe('translateX(-100%)');

  });
});

describe('MetricChart Component', () => {
  // Mock data for metric chart tests
  const mockData = {
    labels: ['Week 1', 'Week 2'],
    datasets: [
      {
        label: 'Volume',
        data: [5000, 5500],
      },
    ],
  };

  it('renders the chart title', () => {
    // Render the MetricChart component with a title prop
    render(<MetricChart title="Weekly Volume" type="line" data={mockData} />);
    // Check if the title is rendered in the document
    expect(screen.getByText('Weekly Volume')).toBeInTheDocument();
  });

  it('should render line chart when type is line', () => {
    // Render the MetricChart component with type set to line
    render(<MetricChart title="Test" type="line" data={mockData} />);

    // Check for the existance of the line chart element in the document
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('should render bar chart when type is bar', () => {
    // Render the MetricChart component with type set to bar
    render(<MetricChart title="Test" type="bar" data={mockData} />);

    // Check for the existance of the bar chart element in the document
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('should render combo chart when type is combo', () => {
    // Render the MetricChart component with type set to combo
    render(<MetricChart title="Test" type="combo" data={mockData} />);

    // Check for the existance of both line and bar chart elements in the document
    expect(screen.getByTestId('chart-bar')).toBeInTheDocument();
  });

  it('shows NO DATA when dataset is empty', () => {
    // Render the MetricChart component with empty data to trigger the NO DATA message
    render(<MetricChart title="Test" type="line" data={{ labels: [], datasets: [] }} />);

    // Check for the existance of the NO DATA message and checks for the absence of any chart elements
    expect(screen.getByText(/no data/i)).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});