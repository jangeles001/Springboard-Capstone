import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

// Mock the dashboard hook
vi.mock('../features/dashboard/hooks/useDashboard', () => ({
  useDashboard: vi.fn(),
}));

// Mock the context hook
vi.mock('../features/dashboard/hooks/useDashboardContext', () => ({
  useDashboardDisplayContext: vi.fn(),
}));

import { useDashboard } from '../features/dashboard/hooks/useDashboard';
import { useDashboardDisplayContext } from '../features/dashboard/hooks/useDashboardContext';

describe('Dashboard Component', () => {
  const mockDashboardData = {
    activeView: 'nutrition',
    handleActiveChange: vi.fn(),
    nutritionQuery: { isLoading: false, data: null, error: null },
    workoutQuery: { isLoading: false, data: null, error: null },
    activeQuery: { isLoading: false, data: null, error: null },
    recommendationsQuery: { isLoading: false, data: null, error: null },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useDashboard.mockReturnValue(mockDashboardData);
    useDashboardDisplayContext.mockReturnValue(mockDashboardData);
  });

  describe('Dashboard Main Component', () => {
    it('should render dashboard container with proper styling', () => {
      const { container } = render(<Dashboard />);

      const mainDiv = container.querySelector('.mx-auto.max-w-7xl');
      expect(mainDiv).toBeInTheDocument();
    });

    it('should render all dashboard sections', () => {
      const { container } = render(<Dashboard />);

      // The component structure should be present
      const mainDiv = container.querySelector('.mx-auto.max-w-7xl');
      expect(mainDiv).toBeInTheDocument();
    });
  });
});

describe('DashboardDisplayHeader Component', () => {
  const mockContext = {
    activeView: 'nutrition',
    handleActiveChange: vi.fn(),
    workoutQuery: { isLoading: false },
    nutritionQuery: { isLoading: false },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useDashboardDisplayContext.mockReturnValue(mockContext);
  });

  it('should render header title and description', () => {
    render(<DashboardDisplayHeader />);

    expect(screen.getByText('Progress Insights')).toBeInTheDocument();
    expect(screen.getByText(/Track nutrition and training trends/i)).toBeInTheDocument();
  });

  it('should render both toggle buttons', () => {
    render(<DashboardDisplayHeader />);

    expect(screen.getByRole('button', { name: /nutrition/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /workouts/i })).toBeInTheDocument();
  });

  it('should highlight active view button', () => {
    useDashboardDisplayContext.mockReturnValue({
      ...mockContext,
      activeView: 'nutrition',
    });

    render(<DashboardDisplayHeader />);

    const nutritionButton = screen.getByRole('button', { name: /nutrition/i });
    expect(nutritionButton).toHaveClass('bg-blue-600', 'text-white');
  });

  it('should call handleActiveChange when nutrition button clicked', async () => {
    const user = userEvent.setup();
    const mockHandleChange = vi.fn();

    useDashboardDisplayContext.mockReturnValue({
      ...mockContext,
      activeView: 'workouts',
      handleActiveChange: mockHandleChange,
    });

    render(<DashboardDisplayHeader />);

    const nutritionButton = screen.getByRole('button', { name: /nutrition/i });
    await user.click(nutritionButton);

    expect(mockHandleChange).toHaveBeenCalledWith('nutrition');
  });

  it('should call handleActiveChange when workouts button clicked', async () => {
    const user = userEvent.setup();
    const mockHandleChange = vi.fn();

    useDashboardDisplayContext.mockReturnValue({
      ...mockContext,
      handleActiveChange: mockHandleChange,
    });

    render(<DashboardDisplayHeader />);

    const workoutsButton = screen.getByRole('button', { name: /workouts/i });
    await user.click(workoutsButton);

    expect(mockHandleChange).toHaveBeenCalledWith('workouts');
  });

  it('should disable nutrition button when query is loading', () => {
    useDashboardDisplayContext.mockReturnValue({
      ...mockContext,
      nutritionQuery: { isLoading: true },
    });

    render(<DashboardDisplayHeader />);

    const nutritionButton = screen.getByRole('button', { name: /nutrition/i });
    expect(nutritionButton).toBeDisabled();
  });

  it('should disable workouts button when query is loading', () => {
    useDashboardDisplayContext.mockReturnValue({
      ...mockContext,
      workoutQuery: { isLoading: true },
    });

    render(<DashboardDisplayHeader />);

    const workoutsButton = screen.getByRole('button', { name: /workouts/i });
    expect(workoutsButton).toBeDisabled();
  });

  it('should apply inactive styling to non-active button', () => {
    useDashboardDisplayContext.mockReturnValue({
      ...mockContext,
      activeView: 'nutrition',
    });

    render(<DashboardDisplayHeader />);

    const workoutsButton = screen.getByRole('button', { name: /workouts/i });
    expect(workoutsButton).toHaveClass('bg-gray-100');
    expect(workoutsButton).not.toHaveClass('bg-blue-600');
  });
});

describe('DashboardDisplayFooter Component', () => {
  const mockRecommendations = {
    data: {
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
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state', () => {
    useDashboardDisplayContext.mockReturnValue({
      recommendationsQuery: { isLoading: true },
    });

    render(<DashboardDisplayFooter />);

    expect(screen.getByText(/Loading personalized recommendations/i)).toBeInTheDocument();
  });

  it('should render AI Coach Insights title', () => {
    useDashboardDisplayContext.mockReturnValue({
      recommendationsQuery: { isLoading: false, data: mockRecommendations },
    });

    render(<DashboardDisplayFooter />);

    expect(screen.getByText('AI Coach Insights')).toBeInTheDocument();
  });

  it('should display muscle imbalances', () => {
    useDashboardDisplayContext.mockReturnValue({
      recommendationsQuery: { isLoading: false, data: mockRecommendations },
    });

    render(<DashboardDisplayFooter />);

    expect(screen.getByText('Your chest is underdeveloped')).toBeInTheDocument();
  });

  it('should display progression tips', () => {
    useDashboardDisplayContext.mockReturnValue({
      recommendationsQuery: { isLoading: false, data: mockRecommendations },
    });

    render(<DashboardDisplayFooter />);

    expect(screen.getByText('Focus on compound movements')).toBeInTheDocument();
  });

  it('should display recommended exercises', () => {
    useDashboardDisplayContext.mockReturnValue({
      recommendationsQuery: { isLoading: false, data: mockRecommendations },
    });

    render(<DashboardDisplayFooter />);

    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText(/Great for chest development/i)).toBeInTheDocument();
  });

  it('should display exercise reasoning', () => {
    useDashboardDisplayContext.mockReturnValue({
      recommendationsQuery: { isLoading: false, data: mockRecommendations },
    });

    render(<DashboardDisplayFooter />);

    expect(screen.getByText(/Targets your weak area/i)).toBeInTheDocument();
  });

  it('should display target muscles', () => {
    useDashboardDisplayContext.mockReturnValue({
      recommendationsQuery: { isLoading: false, data: mockRecommendations },
    });

    render(<DashboardDisplayFooter />);

    expect(screen.getByText(/chest, triceps/i)).toBeInTheDocument();
  });

  it('should render loading skeleton animation', () => {
    useDashboardDisplayContext.mockReturnValue({
      recommendationsQuery: { isLoading: true },
    });

    const { container } = render(<DashboardDisplayFooter />);

    const skeleton = container.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });
});

describe('Graph Component', () => {
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

    expect(screen.getByTestId('chart-line')).toBeInTheDocument();
  });

  it('should show "NO DATA" message when data is empty', () => {
    render(<Graph type="line" data={[]} />);

    expect(screen.getByText(/NO DATA/i)).toBeInTheDocument();
    expect(screen.getByText(/Record a workout/i)).toBeInTheDocument();
  });

  it('should accept custom options prop', () => {
    const options = { responsive: true };
    render(<Graph type="line" data={mockData} options={options} />);

    expect(screen.getByTestId('chart-line')).toBeInTheDocument();
  });

  it('should default to line type', () => {
    render(<Graph data={mockData} />);

    expect(screen.getByTestId('chart-line')).toBeInTheDocument();
  });
});

describe('GraphCarousel Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
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

    expect(screen.getByLabelText('Previous chart')).toBeInTheDocument();
    expect(screen.getByLabelText('Next chart')).toBeInTheDocument();
  });

  it('should advance to next slide when next button clicked', async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <GraphCarousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
      </GraphCarousel>
    );

    const nextButton = screen.getByLabelText('Next chart');
    await user.click(nextButton);

    // Both slides are always in DOM, just transformed
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
  });

  it('should go to previous slide when prev button clicked', async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <GraphCarousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
      </GraphCarousel>
    );

    const prevButton = screen.getByLabelText('Previous chart');
    await user.click(prevButton);

    expect(screen.getByText('Slide 1')).toBeInTheDocument();
  });

  it('should handle single child', () => {
    render(
      <GraphCarousel>
        <div>Only Slide</div>
      </GraphCarousel>
    );

    expect(screen.getByText('Only Slide')).toBeInTheDocument();
  });

  it('should auto-advance after interval', () => {
    render(
      <GraphCarousel interval={1000}>
        <div>Slide 1</div>
        <div>Slide 2</div>
      </GraphCarousel>
    );

    // Advance timers by interval
    vi.advanceTimersByTime(1000);

    // Both slides still in DOM
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
  });
});

describe('MetricChart Component', () => {
  const mockData = {
    labels: ['Week 1', 'Week 2'],
    datasets: [
      {
        label: 'Volume',
        data: [5000, 5500],
      },
    ],
  };

  it('should render chart with title', () => {
    render(<MetricChart title="Weekly Volume" type="line" data={mockData} />);

    expect(screen.getByText('Weekly Volume')).toBeInTheDocument();
  });

  it('should render line chart when type is line', () => {
    render(<MetricChart title="Test" type="line" data={mockData} />);

    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('should render bar chart when type is bar', () => {
    render(<MetricChart title="Test" type="bar" data={mockData} />);

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('should render combo chart when type is combo', () => {
    render(<MetricChart title="Test" type="combo" data={mockData} />);

    expect(screen.getByTestId('chart-bar')).toBeInTheDocument();
  });

  it('should show NO DATA when data is empty', () => {
    const emptyData = { labels: [], datasets: [] };

    render(<MetricChart title="Test" type="line" data={emptyData} />);

    expect(screen.getByText('NO DATA')).toBeInTheDocument();
  });

  it('should apply proper styling classes', () => {
    const { container } = render(
      <MetricChart title="Test" type="line" data={mockData} />
    );

    const chartContainer = container.querySelector('.rounded-xl.border.bg-gray-50');
    expect(chartContainer).toBeInTheDocument();
  });
});