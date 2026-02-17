import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MealsBuilderPage from '../features/meals/pages/MealsBuilderPage';
import { MealsFormHeader } from '../features/meals/components/MealsForm/MealsFormHeader';
import { MealsFormDescription } from '../features/meals/components/MealsForm/MealsFormDescription';
import { MealsFormIngredientSearch } from '../features/meals/components/MealsForm/MealsFormIngredientSearch';
import { MealsFormIngredients } from '../features/meals/components/MealsForm/MealsFormIngredients';
import { MealsFormMacros } from '../features/meals/components/MealsForm/MealsFormMacros';
import { MealsFormFooter } from '../features/meals/components/MealsForm/MealsFormFooter';
import IngredientItem from '../features/meals/components/IngredientItem';

// ============================================================
// MOCKS
// ============================================================

vi.mock('../features/meals/hooks/useMealsForm', () => ({
  useMealsForm: vi.fn(),
}));

vi.mock('../features/meals/hooks/useMealsFormContext', () => ({
  useMealsFormContext: vi.fn(),
}));

vi.mock('../features/meals/hooks/useSearch', () => ({
  default: vi.fn(),
}));

vi.mock('../components/Notification', () => ({
  Notification: ({ message, visible }) =>
    visible ? <div data-testid="notification">{message}</div> : null,
}));

// Mock the entire MealsForm composer so MealsBuilderPage tests
// don't need to worry about internal form context setup
vi.mock('../features/meals/components/MealsForm/index', () => ({
  MealsForm: Object.assign(
    ({ children }) => <div data-testid="meals-form">{children}</div>,
    {
      Header: () => <div data-testid="meals-form-header">Header</div>,
      Description: () => <div data-testid="meals-form-description">Description</div>,
      IngredientSearch: () => <div data-testid="meals-form-search">Search</div>,
      Ingredients: () => <div data-testid="meals-form-ingredients">Ingredients</div>,
      Macros: () => <div data-testid="meals-form-macros">Macros</div>,
      Footer: () => <div data-testid="meals-form-footer">Footer</div>,
    }
  ),
}));

import { useMealsFormContext } from '../features/meals/hooks/useMealsFormContext';
import useSearch from '../features/meals/hooks/useSearch';

// ============================================================
// SHARED MOCK DATA
// ============================================================

const mockFormContext = {
  mealName: '',
  mealDescription: '',
  ingredients: [],
  mealMacros: {},
  formErrors: {},
  hasErrors: false,
  message: null,
  handleChange: vi.fn(),
  handleClick: vi.fn(),
  handleRemoveClick: vi.fn(),
  handleIngredientQuantityChange: vi.fn(),
  handleSubmit: vi.fn((e) => e.preventDefault()),
  getIngredientField: vi.fn(),
};

// ============================================================
// MealsBuilderPage
// ============================================================

describe('MealsBuilderPage Component', () => {
  it('should render page title', () => {
    render(<MealsBuilderPage />);

    expect(screen.getByText('Create Meal')).toBeInTheDocument();
  });

  it('should render page description', () => {
    render(<MealsBuilderPage />);

    expect(
      screen.getByText(/Add ingredients and automatically calculate nutrition macros/i)
    ).toBeInTheDocument();
  });

  it('should render all form subcomponents', () => {
    render(<MealsBuilderPage />);

    expect(screen.getByTestId('meals-form-header')).toBeInTheDocument();
    expect(screen.getByTestId('meals-form-description')).toBeInTheDocument();
    expect(screen.getByTestId('meals-form-search')).toBeInTheDocument();
    expect(screen.getByTestId('meals-form-ingredients')).toBeInTheDocument();
    expect(screen.getByTestId('meals-form-macros')).toBeInTheDocument();
    expect(screen.getByTestId('meals-form-footer')).toBeInTheDocument();
  });

  it('should apply proper layout classes', () => {
    const { container } = render(<MealsBuilderPage />);

    const outerContainer = container.querySelector('.mx-auto.max-w-7xl');
    expect(outerContainer).toBeInTheDocument();
  });

  it('should render form inside max-w-3xl container', () => {
    const { container } = render(<MealsBuilderPage />);

    const formContainer = container.querySelector('.max-w-3xl');
    expect(formContainer).toBeInTheDocument();
  });
});

// ============================================================
// MealsFormHeader
// ============================================================

describe('MealsFormHeader Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useMealsFormContext.mockReturnValue(mockFormContext);
  });

  it('should render Meal Details title', () => {
    render(<MealsFormHeader />);

    expect(screen.getByText('Meal Details')).toBeInTheDocument();
  });

  it('should render meal name input', () => {
    render(<MealsFormHeader />);

    expect(
      screen.getByPlaceholderText(/Chicken bowl, protein shake/i)
    ).toBeInTheDocument();
  });

  it('should display current meal name value', () => {
    useMealsFormContext.mockReturnValue({
      ...mockFormContext,
      mealName: 'Protein Shake',
    });

    render(<MealsFormHeader />);

    expect(screen.getByPlaceholderText(/Chicken bowl/i)).toHaveValue('Protein Shake');
  });

  it('should call handleChange when meal name input changes', async () => {
    const user = userEvent.setup();
    const mockHandleChange = vi.fn();

    useMealsFormContext.mockReturnValue({
      ...mockFormContext,
      handleChange: mockHandleChange,
    });

    render(<MealsFormHeader />);

    await user.type(screen.getByPlaceholderText(/Chicken bowl/i), 'Oats');

    expect(mockHandleChange).toHaveBeenCalled();
  });

  it('should display meal name error when present', () => {
    useMealsFormContext.mockReturnValue({
      ...mockFormContext,
      formErrors: { mealName: ['Meal name is required!'] },
    });

    render(<MealsFormHeader />);

    expect(screen.getByText('*Meal name is required!')).toBeInTheDocument();
  });

  it('should apply error styling to input when error exists', () => {
    useMealsFormContext.mockReturnValue({
      ...mockFormContext,
      mealName: '',
      formErrors: { mealName: ['Meal name is required!'] },
    });

    render(<MealsFormHeader />);

    expect(screen.getByPlaceholderText(/Chicken bowl/i)).toHaveClass('form-input-error');
  });
});

// ============================================================
// MealsFormDescription
// ============================================================

describe('MealsFormDescription Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useMealsFormContext.mockReturnValue(mockFormContext);
  });

  it('should render description textarea', () => {
    render(<MealsFormDescription />);

    expect(
      screen.getByPlaceholderText(/Enter meal description here/i)
    ).toBeInTheDocument();
  });

  it('should display current description value', () => {
    useMealsFormContext.mockReturnValue({
      ...mockFormContext,
      mealDescription: 'High protein post-workout meal',
    });

    render(<MealsFormDescription />);

    expect(
      screen.getByPlaceholderText(/Enter meal description here/i)
    ).toHaveValue('High protein post-workout meal');
  });

  it('should call handleChange when textarea changes', async () => {
    const user = userEvent.setup();
    const mockHandleChange = vi.fn();

    useMealsFormContext.mockReturnValue({
      ...mockFormContext,
      handleChange: mockHandleChange,
    });

    render(<MealsFormDescription />);

    await user.type(
      screen.getByPlaceholderText(/Enter meal description here/i),
      'test description'
    );

    expect(mockHandleChange).toHaveBeenCalled();
  });

  it('should have maxLength of 430', () => {
    render(<MealsFormDescription />);

    const textarea = screen.getByPlaceholderText(/Enter meal description here/i);
    expect(textarea).toHaveAttribute('maxLength', '430');
  });

  it('should apply error styling when description error exists', () => {
    useMealsFormContext.mockReturnValue({
      ...mockFormContext,
      formErrors: { mealDescription: ['Description is required!'] },
    });

    render(<MealsFormDescription />);

    const textarea = screen.getByPlaceholderText(/Enter meal description here/i);
    expect(textarea).toHaveClass('form-input-error');
  });

  it('should apply default styling when no error', () => {
    render(<MealsFormDescription />);

    const textarea = screen.getByPlaceholderText(/Enter meal description here/i);
    expect(textarea).toHaveClass('form-input');
  });
});

// ============================================================
// MealsFormIngredientSearch
// ============================================================

describe('MealsFormIngredientSearch Component', () => {
  const mockSearchData = {
    query: '',
    debouncedSetQuery: vi.fn(),
    handleScroll: vi.fn(),
    results: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useMealsFormContext.mockReturnValue(mockFormContext);
    useSearch.mockReturnValue(mockSearchData);
  });

  it('should render ingredient search label', () => {
    render(<MealsFormIngredientSearch isOpen={false} setIsOpen={vi.fn()} />);

    expect(screen.getByText('Enter Ingredient')).toBeInTheDocument();
  });

  it('should render search input', () => {
    render(<MealsFormIngredientSearch isOpen={false} setIsOpen={vi.fn()} />);

    expect(
      screen.getByPlaceholderText(/Type to search for ingredients/i)
    ).toBeInTheDocument();
  });

  it('should call debouncedSetQuery when typing in search input', async () => {
    const user = userEvent.setup();
    const mockDebouncedSetQuery = vi.fn();

    useSearch.mockReturnValue({
      ...mockSearchData,
      debouncedSetQuery: mockDebouncedSetQuery,
    });

    render(<MealsFormIngredientSearch isOpen={false} setIsOpen={vi.fn()} />);

    await user.type(
      screen.getByPlaceholderText(/Type to search for ingredients/i),
      'chicken'
    );

    expect(mockDebouncedSetQuery).toHaveBeenCalled();
  });

  it('should call setIsOpen(true) when input is focused', async () => {
    const user = userEvent.setup();
    const mockSetIsOpen = vi.fn();

    render(
      <MealsFormIngredientSearch isOpen={false} setIsOpen={mockSetIsOpen} />
    );

    await user.click(
      screen.getByPlaceholderText(/Type to search for ingredients/i)
    );

    expect(mockSetIsOpen).toHaveBeenCalledWith(true);
  });

  it('should not show dropdown when isOpen is false', () => {
    render(<MealsFormIngredientSearch isOpen={false} setIsOpen={vi.fn()} />);

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('should show dropdown when isOpen is true', () => {
    useSearch.mockReturnValue({
      ...mockSearchData,
      results: [
        { fdcId: 1, description: 'Chicken Breast' },
        { fdcId: 2, description: 'Brown Rice' },
      ],
    });

    render(<MealsFormIngredientSearch isOpen={true} setIsOpen={vi.fn()} />);

    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('should render results in dropdown when isOpen', () => {
    useSearch.mockReturnValue({
      ...mockSearchData,
      results: [
        { fdcId: 1, description: 'Chicken Breast' },
        { fdcId: 2, description: 'Brown Rice' },
      ],
    });

    render(<MealsFormIngredientSearch isOpen={true} setIsOpen={vi.fn()} />);

    expect(screen.getByText('Chicken Breast')).toBeInTheDocument();
    expect(screen.getByText('Brown Rice')).toBeInTheDocument();
  });

  it('should call handleClick and close dropdown when result is clicked', async () => {
    const user = userEvent.setup();
    const mockHandleClick = vi.fn();
    const mockSetIsOpen = vi.fn();
    const mockDebouncedSetQuery = vi.fn();

    useMealsFormContext.mockReturnValue({
      ...mockFormContext,
      handleClick: mockHandleClick,
    });

    useSearch.mockReturnValue({
      ...mockSearchData,
      debouncedSetQuery: mockDebouncedSetQuery,
      results: [{ fdcId: 1, description: 'Chicken Breast' }],
    });

    render(
      <MealsFormIngredientSearch isOpen={true} setIsOpen={mockSetIsOpen} />
    );

    await user.click(screen.getByText('Chicken Breast'));

    expect(mockHandleClick).toHaveBeenCalled();
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
    expect(mockDebouncedSetQuery).toHaveBeenCalledWith('');
  });
});

// ============================================================
// MealsFormIngredients
// ============================================================

describe('MealsFormIngredients Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useMealsFormContext.mockReturnValue(mockFormContext);
  });

  it('should render Selected Ingredients label', () => {
    render(<MealsFormIngredients />);

    expect(screen.getByText('Selected Ingredients')).toBeInTheDocument();
  });

  it('should render double-click instruction text', () => {
    render(<MealsFormIngredients />);

    expect(
      screen.getByText(/Double-click on the ingredient name to remove/i)
    ).toBeInTheDocument();
  });

  it('should render empty list when no ingredients', () => {
    render(<MealsFormIngredients />);

    const ingredientContainer = screen.getByText('Selected Ingredients')
      .closest('span')
      .nextSibling;

    expect(ingredientContainer).toBeInTheDocument();
  });

  it('should render ingredient items when ingredients exist', () => {
    useMealsFormContext.mockReturnValue({
      ...mockFormContext,
      ingredients: [
        {
          ingredientId: '123',
          ingredientName: 'Chicken Breast',
          quantity: 200,
          macros: { protein: 62, fat: 7, carbs: 0, calories: 330 },
        },
      ],
      getIngredientField: vi.fn(),
    });

    render(<MealsFormIngredients />);

    expect(screen.getByText('Chicken Breast')).toBeInTheDocument();
  });

  it('should render ingredients error when formErrors.ingredients exists', () => {
    useMealsFormContext.mockReturnValue({
      ...mockFormContext,
      formErrors: {
        ingredients: ['At least one ingredient is required!'],
      },
    });

    render(<MealsFormIngredients />);

    expect(
      screen.getByText('*At least one ingredient is required!')
    ).toBeInTheDocument();
  });

  it('should apply error label styling when ingredients error exists', () => {
    useMealsFormContext.mockReturnValue({
      ...mockFormContext,
      formErrors: { ingredients: ['At least one ingredient is required!'] },
    });

    render(<MealsFormIngredients />);

    const label = screen.getByText('Selected Ingredients');
    expect(label).toHaveClass('form-label-error');
  });
});

// ============================================================
// MealsFormMacros
// ============================================================

describe('MealsFormMacros Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Estimated Macros title', () => {
    useMealsFormContext.mockReturnValue({
      ...mockFormContext,
      mealMacros: {},
    });

    render(<MealsFormMacros />);

    expect(screen.getByText('Estimated Macros')).toBeInTheDocument();
  });

  it('should render all macro values', () => {
    useMealsFormContext.mockReturnValue({
      ...mockFormContext,
      mealMacros: {
        protein: 30,
        fat: 10,
        carbs: 45,
        calories: 390,
      },
    });

    render(<MealsFormMacros />);

    expect(screen.getByText('PROTEIN: 30')).toBeInTheDocument();
    expect(screen.getByText('FAT: 10')).toBeInTheDocument();
    expect(screen.getByText('CARBS: 45')).toBeInTheDocument();
    expect(screen.getByText('CALORIES: 390')).toBeInTheDocument();
  });

  it('should render macro keys in uppercase', () => {
    useMealsFormContext.mockReturnValue({
      ...mockFormContext,
      mealMacros: { netCarbs: 40 },
    });

    render(<MealsFormMacros />);

    expect(screen.getByText('NETCARBS: 40')).toBeInTheDocument();
  });

  it('should render nothing when mealMacros is null', () => {
    useMealsFormContext.mockReturnValue({
      ...mockFormContext,
      mealMacros: null,
    });

    render(<MealsFormMacros />);

    expect(screen.getByText('Estimated Macros')).toBeInTheDocument();

    // No macro tags rendered
    const tags = document.querySelectorAll('.rounded-full');
    expect(tags.length).toBe(0);
  });
});

// ============================================================
// MealsFormFooter
// ============================================================

describe('MealsFormFooter Component', () => {
  it('should render Create Meal button', () => {
    render(<MealsFormFooter />);

    expect(
      screen.getByRole('button', { name: /create meal/i })
    ).toBeInTheDocument();
  });

  it('should have submit type', () => {
    render(<MealsFormFooter />);

    expect(screen.getByRole('button', { name: /create meal/i })).toHaveAttribute(
      'type',
      'submit'
    );
  });

  it('should apply gradient styling', () => {
    render(<MealsFormFooter />);

    const button = screen.getByRole('button', { name: /create meal/i });
    expect(button).toHaveClass('bg-gradient-to-r', 'from-blue-600', 'to-indigo-600');
  });

  it('should span full width', () => {
    render(<MealsFormFooter />);

    expect(screen.getByRole('button', { name: /create meal/i })).toHaveClass('w-full');
  });
});

// ============================================================
// IngredientItem
// ============================================================

describe('IngredientItem Component', () => {
  const mockItem = {
    ingredientId: '123',
    ingredientName: 'Chicken Breast',
    quantity: 200,
  };

  const defaultProps = {
    item: mockItem,
    getIngredientField: vi.fn().mockReturnValue(200),
    handleRemoveClick: vi.fn(),
    handleIngredientQuantityChange: vi.fn(),
    formErrors: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render ingredient name', () => {
    render(<IngredientItem {...defaultProps} />);

    expect(screen.getByText('Chicken Breast')).toBeInTheDocument();
  });

  it('should render quantity input', () => {
    render(<IngredientItem {...defaultProps} />);

    const quantityInput = screen.getByPlaceholderText('');
    expect(quantityInput).toBeInTheDocument();
    expect(quantityInput).toHaveAttribute('type', 'number');
  });

  it('should call handleRemoveClick on double click of ingredient name', async () => {
    const user = userEvent.setup();
    const mockHandleRemoveClick = vi.fn();

    render(
      <IngredientItem
        {...defaultProps}
        handleRemoveClick={mockHandleRemoveClick}
      />
    );

    await user.dblClick(screen.getByText('Chicken Breast'));

    expect(mockHandleRemoveClick).toHaveBeenCalledWith('123');
  });

  it('should call handleIngredientQuantityChange when quantity changes', async () => {
    const user = userEvent.setup();
    const mockQuantityChange = vi.fn();

    render(
      <IngredientItem
        {...defaultProps}
        handleIngredientQuantityChange={mockQuantityChange}
      />
    );

    const quantityInput = screen.getByPlaceholderText('');
    await user.type(quantityInput, '5');

    expect(mockQuantityChange).toHaveBeenCalled();
  });

  it('should call getIngredientField with correct args', () => {
    const mockGetField = vi.fn().mockReturnValue(200);

    render(
      <IngredientItem {...defaultProps} getIngredientField={mockGetField} />
    );

    expect(mockGetField).toHaveBeenCalledWith('123', 'quantity');
  });

  it('should have max attribute of 999 on quantity input', () => {
    render(<IngredientItem {...defaultProps} />);

    const quantityInput = screen.getByPlaceholderText('');
    expect(quantityInput).toHaveAttribute('max', '999');
  });
});