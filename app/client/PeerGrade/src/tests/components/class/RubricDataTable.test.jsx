import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RubricDataTable from '@/components/class/RubricDataTable';

describe('RubricDataTable Component', () => {
  let rubricData;
  let setRubricData;
  let setIsValid;

  beforeEach(() => {
    rubricData = {
      title: '',
      description: '',
      criteria: [
        {
          criteria: '',
          ratings: [{ text: '', points: '' }],
          points: ''
        }
      ]
    };
    setRubricData = jest.fn();
    setIsValid = jest.fn();
  });

  it('renders without crashing', () => {
    render(<RubricDataTable rubricData={rubricData} setRubricData={setRubricData} setIsValid={setIsValid} />);
    expect(screen.getByPlaceholderText('Rubric Title')).toBeInTheDocument();
  });

  it('updates title and description', () => {
    render(<RubricDataTable rubricData={rubricData} setRubricData={setRubricData} setIsValid={setIsValid} />);
    
    fireEvent.change(screen.getByPlaceholderText('Rubric Title'), { target: { value: 'New Title' } });
    fireEvent.change(screen.getByPlaceholderText('Rubric Description'), { target: { value: 'New Description' } });
    
    expect(setRubricData).toHaveBeenCalledWith(expect.objectContaining({ title: 'New Title' }));
    expect(setRubricData).toHaveBeenCalledWith(expect.objectContaining({ description: 'New Description' }));
  });

  it('updates criteria and ratings', () => {
    render(<RubricDataTable rubricData={rubricData} setRubricData={setRubricData} setIsValid={setIsValid} />);
    
    fireEvent.change(screen.getByPlaceholderText('Criteria'), { target: { value: 'New Criteria' } });
    fireEvent.change(screen.getByPlaceholderText('Rating'), { target: { value: 'New Rating' } });
    fireEvent.change(screen.getByPlaceholderText('Points'), { target: { value: '10' } });
    
    expect(setRubricData).toHaveBeenCalledWith(expect.objectContaining({
      criteria: expect.arrayContaining([
        expect.objectContaining({
          criteria: 'New Criteria',
          ratings: expect.arrayContaining([
            expect.objectContaining({ text: 'New Rating', points: 10 })
          ])
        })
      ])
    }));
  });

  it('adds and removes criteria', () => {
    render(<RubricDataTable rubricData={rubricData} setRubricData={setRubricData} setIsValid={setIsValid} />);
    
    fireEvent.click(screen.getByText('Add Criterion'));
    expect(setRubricData).toHaveBeenCalledWith(expect.objectContaining({
      criteria: expect.arrayContaining([
        expect.objectContaining({ criteria: '', ratings: [{ text: '', points: '' }], points: '' }),
        expect.objectContaining({ criteria: '', ratings: [{ text: '', points: '' }], points: '' })
      ])
    }));

    fireEvent.click(screen.getByTestId('remove-criterion-0'));
    expect(setRubricData).toHaveBeenCalledWith(expect.objectContaining({
      criteria: expect.arrayContaining([])
    }));
  });

  it('adds and removes ratings', () => {
    render(<RubricDataTable rubricData={rubricData} setRubricData={setRubricData} setIsValid={setIsValid} />);
    
    fireEvent.click(screen.getByTestId('add-rating-0-0'));
    expect(setRubricData).toHaveBeenCalledWith(expect.objectContaining({
      criteria: expect.arrayContaining([
        expect.objectContaining({
          ratings: expect.arrayContaining([
            expect.objectContaining({ text: '', points: '' }),
            expect.objectContaining({ text: '', points: '' })
          ])
        })
      ])
    }));

    fireEvent.click(screen.getByTestId('remove-rating-0-0'));
    expect(setRubricData).toHaveBeenCalledWith(expect.objectContaining({
      criteria: expect.arrayContaining([
        expect.objectContaining({
          ratings: expect.arrayContaining([])
        })
      ])
    }));
  });

  it('shows validation errors', () => {
    rubricData.criteria[0].points = '10';
    rubricData.criteria[0].ratings[0].points = '5';
    
    render(<RubricDataTable rubricData={rubricData} setRubricData={setRubricData} setIsValid={setIsValid} />);
    
    expect(screen.getByText('Total rating points (5) must equal total points (10)')).toBeInTheDocument();
  });
});