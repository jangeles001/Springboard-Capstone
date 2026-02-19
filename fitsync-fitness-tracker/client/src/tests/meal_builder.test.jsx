import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MealsForm } from '../features/meals/components/MealsForm/index';
import { MealsFormHeader } from '../features/meals/components/MealsForm/MealsFormHeader';
import { MealsFormDescription } from '../features/meals/components/MealsForm/MealsFormDescription';
import { MealsFormFooter } from '../features/meals/components/MealsForm/MealsFormFooter';
import { MealsFormMacros } from '../features/meals/components/MealsForm/MealsFormMacros';
import { MealsFormIngredients } from '../features/meals/components/MealsForm/MealsFormIngredients';
import { MealsFormIngredientSearch } from '../features/meals/components/MealsForm/MealsFormIngredientSearch';

import { useMealsFormContext } from '../features/meals/hooks/useMealsFormContext';
import useSearch from '../features/meals/hooks/useSearch';

vi.mock('../features/meals/hooks/useMealsFormContext');
vi.mock('../features/meals/hooks/useMealsForm');
vi.mock('../features/meals/hooks/useSearch');

describe('Meals Components', () => {
  const mockContext = {
    mealName: '',
    mealDescription: '',
    mealMacros: { calories: 500, protein: 40, carbs: 50, fats: 20 },
    ingredients: [
      { ingredientId: '123', ingredientName: 'Chicken Breast', quantity: 100 },
      { ingredientId: '124', ingredientName: 'Broccoli', quantity: 50 },
    ],
    formErrors: null,
    isPending: false,
    getIngredientField: vi.fn((id) => mockContext.ingredients.find((i) => i.ingredientId === id)?.quantity || 0),
    handleChange: vi.fn((e) => {
      mockContext.mealName = e.target.value  
    }),
    handleClick: vi.fn(),
    handleSubmit: vi.fn((e) => e.preventDefault()),
    handleIngredientQuantityChange: vi.fn(),
    handleRemoveClick: vi.fn(),
    handleIngredientSelect: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useMealsFormContext.mockReturnValue(mockContext);
  });


  describe('MealsFormHeader', () => {
    it('renders name and description inputs', () => {
      render(<MealsFormHeader />);
      render(<MealsFormDescription />);

      // Checks for presence of name and description inputs
      expect(screen.getByTestId('meal-name-input')).toBeInTheDocument();
      expect(screen.getByTestId('meal-description-input')).toBeInTheDocument();
    });

    it('calls handleChange when name changes', async () => {
      const user = userEvent.setup();
      render(<MealsFormHeader />);
    
      const input = screen.getByTestId('meal-name-input');
    
      // Simulate typing 'Oats' into the meal name input
      await user.type(input, 'Oats');
    
      // handler should be called 4 times (one per character)
      expect(mockContext.handleChange).toHaveBeenCalledTimes(4);
    });

    it('renders validation error if present', () => {
      useMealsFormContext.mockReturnValue({
        ...mockContext,
        formErrors: { mealName: ['Meal name is required'] },
      });

      render(<MealsFormHeader />);

      // Checks for presence of validation error message
      expect(screen.getByTestId('mealName-error-0')).toBeInTheDocument();
    });
  });

  describe('MealsFormFooter', () => {
    it('renders submit button', () => {
      render(<MealsFormFooter />);

      // Checks for presence of submit button
      expect(
        screen.getByRole('button', { name: /create meal/i })
      ).toBeInTheDocument();
    });

    it('calls handleSubmit when clicked', async () => {
      const user = userEvent.setup();

      // Renders the entire form to ensure the submit function can be called correctly
      render(
        <MealsForm>
          <MealsFormHeader />
          <MealsFormFooter />
        </MealsForm >
      );

      //
      await user.click(
        screen.getByRole('button', { name: /create meal/i })
      );

      // Checks that the submit handler was called
      expect(mockContext.handleSubmit).toHaveBeenCalled();
    });

    it('disables button when pending', () => {
      useMealsFormContext.mockReturnValue({
        ...mockContext,
        isPending: true,
      });

      render(<MealsFormFooter />);

      // Checks that the submit button is disabled when the form is in a pending state
      expect(
        screen.getByRole('button', { name: /create meal/i })
      ).toBeDisabled();
    });
  });

  describe('MealsFormMacros', () => {
    it('renders macro values correctly', () => {
      render(<MealsFormMacros />);

      const macros = screen.getAllByTestId(/^macro-/i);

      macros.forEach((macro) => {
        // Checks that each macro badge is rendered
        expect(macro).toBeInTheDocument();
        expect(macro).toHaveTextContent(/calories|protein|carbs|fats/i);
        expect(macro).toHaveTextContent(/\d+/i);
      });
    });

    it('renders 0 when macro value is undefined', () => {
      useMealsFormContext.mockReturnValue({
        ...mockContext,
        macros: {},
      });

      render(<MealsFormMacros />);

      // Checks that macros with undefined values render as 0
      expect(screen.getAllByTestId(/^macro-/i).length).toBeGreaterThan(0);
    });
  });


  describe('IngredientSearch', () => {
    const mockSearch = {
      query: '',
      results: [{ fdcId: '123', description: 'Chicken Breast' }],
      isLoading: false,
      handleChange: vi.fn(),
      setInputValue: vi.fn(),
      handleClick: vi.fn(),
      handleScroll: vi.fn(),
    };

    beforeEach(() => {
      useSearch.mockReturnValue(mockSearch);
    });

    it('renders search input', () => {
      render(<MealsFormIngredientSearch isOpen={true} setIsOpen={vi.fn()} />);

      // Checks for presence of search input
      expect(
        screen.getByPlaceholderText(/type to search/i)
      ).toBeInTheDocument();
    });

    it('updates the input value when typing', async () => {
      const user = userEvent.setup();
    
      render(<MealsFormIngredientSearch isOpen={true} setIsOpen={vi.fn()} />);
    
      // Simulate typing 'chicken' into the search input
      const input = screen.getByPlaceholderText(/type to search/i);
      await user.type(input, 'chicken');

      // Checks that the search query is updated and handleChange is called
      expect(mockSearch.setInputValue).toHaveBeenCalledTimes(7);
    });

    it('renders search results', () => {
      render(<MealsFormIngredientSearch isOpen={true} setIsOpen={vi.fn()} />);

      // Checks that search results are rendered
      expect(screen.getByTestId(`search-result-${mockSearch.results[0].fdcId}`)).toBeInTheDocument();
    });

    it('calls handleClick when clicking a result', async () => {
      const user = userEvent.setup();

      render(<MealsFormIngredientSearch isOpen={true} setIsOpen={vi.fn()} />);

      // Simulates clicking on the search result
      await user.click(screen.getByTestId(`search-result-${mockSearch.results[0].fdcId}`));

      // Checks that the handleClick function was called
      expect(mockContext.handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls handleScroll when scrolling results', async () => {
      render(<MealsFormIngredientSearch isOpen={true} setIsOpen={vi.fn()} />);

      // Simulates scrolling the results container
      const resultsContainer = screen.getByRole('list');
      resultsContainer.dispatchEvent(new Event('scroll'));

      // Checks that the handleScroll function was called
      expect(mockSearch.handleScroll).toHaveBeenCalled();
    });
  });


  describe('MealsFormIngredients', () => {
    it('renders empty state when no ingredients selected', () => {
      render(<MealsFormIngredients />);
      expect(
        screen.getByText(/selected ingredients/i)
      ).toBeInTheDocument();
    });

    it('renders selected ingredients', () => {
      render(<MealsFormIngredients />);

      expect(screen.getByText(/chicken breast/i)).toBeInTheDocument();
    });

    it('calls handleIngredientQuantityChange with correct value', async () => {
      const user = userEvent.setup();
    
      render(<MealsFormIngredients />);
    
      const input = screen.getByTestId('quantity-input-123');
    
      await user.clear(input);
      await user.type(input, '200');
    
      expect(mockContext.handleIngredientQuantityChange)
        .toHaveBeenCalled();
    });

    it('calls handleRemoveIngredient with correct id', async () => {
      const user = userEvent.setup();

      render(<MealsFormIngredients />);

      await user.dblClick(screen.getByTestId(`ingredient-${mockContext.ingredients?.[0]?.ingredientId}`));

      expect(mockContext.handleRemoveClick).toHaveBeenCalledWith('123');
    });
  });
});