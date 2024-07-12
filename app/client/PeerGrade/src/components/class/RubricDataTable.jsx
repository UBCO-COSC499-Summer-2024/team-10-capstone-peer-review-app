import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus,  } from 'lucide-react';
import { TrashIcon, PlusIcon, Minus} from 'lucide-react';


const RubricDataTable = ({ rubricData, setRubricData, setIsValid }) => {
    const [errors, setErrors] = useState({});

    useEffect(() => {
        validateRubric();
    }, [rubricData]);

    const validateRubric = () => {
        let newErrors = {};
        let isValid = true;

        rubricData.criteria.forEach((criterion, index) => {
            const maxPoints = parseFloat(criterion.maxPoints);
            const totalRatingPoints = criterion.ratings.reduce((sum, rating) => sum + parseFloat(rating.points || 0), 0);

            if (maxPoints !== totalRatingPoints) {
                newErrors[`criterion_${index}`] = `Total rating points (${totalRatingPoints}) must equal max points (${maxPoints})`;
                isValid = false;
            }
        });

        setErrors(newErrors);
        setIsValid(isValid);
    };

    const handleTitleChange = (value) => {
        setRubricData({ ...rubricData, title: value });
    };

    const handleCriteriaChange = (index, value) => {
        const newCriteria = [...rubricData.criteria];
        newCriteria[index].criteria = value;
        setRubricData({ ...rubricData, criteria: newCriteria });
    };

    const handleRatingsChange = (criteriaIndex, ratingIndex, field, value) => {
        const newCriteria = [...rubricData.criteria];
        newCriteria[criteriaIndex].ratings[ratingIndex][field] = value;
        setRubricData({ ...rubricData, criteria: newCriteria });
    };

    const handleMinPointsChange = (index, value) => {
        const newCriteria = [...rubricData.criteria];
        newCriteria[index].minPoints = value;
        setRubricData({ ...rubricData, criteria: newCriteria });
    };

    const handleMaxPointsChange = (index, value) => {
        const newCriteria = [...rubricData.criteria];
        newCriteria[index].maxPoints = value;
        setRubricData({ ...rubricData, criteria: newCriteria });
    };

    const addRating = (index) => {
        const newCriteria = [...rubricData.criteria];
        newCriteria[index].ratings.push({ text: "", points: "" });
        setRubricData({ ...rubricData, criteria: newCriteria });
    };

    const removeRating = (criteriaIndex, ratingIndex) => {
        const newCriteria = [...rubricData.criteria];
        newCriteria[criteriaIndex].ratings = newCriteria[criteriaIndex].ratings.filter((_, i) => i !== ratingIndex);
        setRubricData({ ...rubricData, criteria: newCriteria });
    };

    const addCriteria = () => {
        setRubricData({
            ...rubricData,
            criteria: [...rubricData.criteria, { criteria: "", ratings: [{ text: "", points: "" }], minPoints: "", maxPoints: "" }]
        });
    };

    const removeCriteria = (index) => {
        const newCriteria = rubricData.criteria.filter((_, i) => i !== index);
        setRubricData({ ...rubricData, criteria: newCriteria });
    };

    return (
        <div className="mt-5">
            <h2 className="text-lg font-semibold mb-4">Edit Rubric</h2>
            <Input
                placeholder="Rubric Title"
                value={rubricData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full mb-4"
            />
            {rubricData.criteria.map((item, index) => (
                <div key={index} className="mb-4 border p-4 rounded-lg overflow-y-scroll">
                    <div className="flex items-center mb-2">
                        <Input
                            placeholder="Criteria"
                            value={item.criteria}
                            onChange={(e) => handleCriteriaChange(index, e.target.value)}
                            className="w-full"
                        />
                        <Button variant="destructive" onClick={() => removeCriteria(index)} className="ml-2">
                            <TrashIcon className="h-4 w-4"/>
                        </Button>
                    </div>
                    <div className="flex flex-wrap items-center mb-2">
                        {item.ratings.map((rating, ratingIndex) => (
                            <div key={ratingIndex} className="flex items-center w-full mb-2">
                                <Input
                                    placeholder="Rating"
                                    value={rating.text}
                                    onChange={(e) => handleRatingsChange(index, ratingIndex, 'text', e.target.value)}
                                    className="w-1/2 mr-2"
                                />
                                <Input
                                    placeholder="Points"
                                    value={rating.points}
                                    onChange={(e) => handleRatingsChange(index, ratingIndex, 'points', e.target.value)}
                                    className={`w-1/4 mr-2 ${errors[`criterion_${index}`] ? 'border-red-500' : ''}`}
                                />
                                <Button variant="outline" onClick={() => removeRating(index, ratingIndex)} className="h-8 w-8 p-0 flex items-center justify-center">
                                    <Minus className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" onClick={() => addRating(index)} className="h-8 w-8 p-0 flex items-center justify-center">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-center mb-2">
                        <Input
                            placeholder="Min Points"
                            value={item.minPoints}
                            onChange={(e) => handleMinPointsChange(index, e.target.value)}
                            className="w-1/2 mr-2"
                        />
                        <Input
                            placeholder="Max Points"
                            value={item.maxPoints}
                            onChange={(e) => handleMaxPointsChange(index, e.target.value)}
                            className={`w-1/2 ${errors[`criterion_${index}`] ? 'border-red-500' : ''}`}
                        />
                    </div>
                    {errors[`criterion_${index}`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`criterion_${index}`]}</p>
                    )}
                </div>
            ))}
            <Button variant="success" onClick={addCriteria} className="h-10 w-10 p-0 flex items-center justify-center">
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default RubricDataTable;