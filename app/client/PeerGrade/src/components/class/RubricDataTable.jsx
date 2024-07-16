import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus, Trash } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const RubricDataTable = ({ rubricData, setRubricData, setIsValid }) => {
    const [errors, setErrors] = useState({});

    useEffect(() => {
        validateRubric();
    }, [rubricData]);

    const validateRubric = () => {
        let newErrors = {};
        let isValid = true;

        rubricData.criteria.forEach((criterion, index) => {
            const totalPoints = parseFloat(criterion.points) || 0;
            const totalRatingPoints = criterion.ratings.reduce((sum, rating) => sum + (parseFloat(rating.points) || 0), 0);

            if (totalPoints !== totalRatingPoints) {
                newErrors[`criterion_${index}`] = `Total rating points (${totalRatingPoints}) must equal total points (${totalPoints})`;
                isValid = false;
            }
        });

        setErrors(newErrors);
        setIsValid(isValid);
    };

    const handleTitleChange = (value) => {
        setRubricData({ ...rubricData, title: value });
    };

    const handleDescriptionChange = (value) => {
        setRubricData({ ...rubricData, description: value });
    };

    const handleCriteriaChange = (index, value) => {
        const newCriteria = [...rubricData.criteria];
        newCriteria[index].criteria = value;
        setRubricData({ ...rubricData, criteria: newCriteria });
    };

    const handlePointsChange = (index, value) => {
        const newCriteria = [...rubricData.criteria];
        newCriteria[index].points = parseFloat(value) || 0;
        setRubricData({ ...rubricData, criteria: newCriteria });
    };
    
    const handleRatingsChange = (criteriaIndex, ratingIndex, field, value) => {
        const newCriteria = [...rubricData.criteria];
        if (field === 'points') {
            value = parseFloat(value) || 0;
        }
        newCriteria[criteriaIndex].ratings[ratingIndex][field] = value;
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
            criteria: [...rubricData.criteria, { criteria: "", ratings: [{ text: "", points: "" }], points: "" }]
        });
    };

    const removeCriteria = (index) => {
        const newCriteria = rubricData.criteria.filter((_, i) => i !== index);
        setRubricData({ ...rubricData, criteria: newCriteria });
    };

    const calculateTotalPoints = () => {
        return rubricData.criteria.reduce((total, criterion) => total + (parseFloat(criterion.points) || 0), 0);
    };

    return (
        <div className="space-y-4">
            <Input
                placeholder="Rubric Title"
                value={rubricData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full"
            />
            <Textarea
                placeholder="Rubric Description"
                value={rubricData.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                className="w-full"
            />
            <Table className="border-collapse">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/3 border">Criteria</TableHead>
                        <TableHead className="w-1/2 border">Ratings</TableHead>
                        <TableHead className="w-1/6 border">Pts</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="bg-accent">
                    {rubricData.criteria.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="border relative">
                                <Input
                                    placeholder="Criteria"
                                    value={item.criteria}
                                    onChange={(e) => handleCriteriaChange(index, e.target.value)}
                                    className="w-full border-none"
                                />
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => removeCriteria(index)}
                                    className="mr-4 mb-2 absolute bottom-0 right-0 p-1 text-destructive hover:bg-white hover:text-destructive"
                                >
                                    <Trash className="h-4 w-4"/>
                                </Button>
                            </TableCell>
                            <TableCell className="border p-0">
                                <div className="flex flex-wrap">
                                    {item.ratings.map((rating, ratingIndex) => (
                                        <div key={ratingIndex} className="flex gap-2 min-w-[200px] border-r border-b relative p-2">
                                            <div className="flex gap-2 w-full">
                                                <Input
                                                    placeholder="Rating"
                                                    value={rating.text}
                                                    onChange={(e) => handleRatingsChange(index, ratingIndex, 'text', e.target.value)}
                                                    className="border-none mb-2 w-2/3"
                                                />
                                                <Input
                                                    placeholder="Points"
                                                    value={rating.points}
                                                    onChange={(e) => handleRatingsChange(index, ratingIndex, 'points', e.target.value)}
                                                    className="border-none w-1/3"
                                                    type="number"
                                                />
                                            </div>
                                            <div className='flex gap-1'>
                                                <Button 
                                                    onClick={() => removeRating(index, ratingIndex)}
                                                    className="flex-1 max-w-[10px] text-white bg-destructive hover:bg-destructive-dark"
                                                    variant="ghost"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <Button 
                                                    onClick={() => addRating(index)}
                                                    variant="ghost"
                                                    className="flex-1 max-w-[10px] bg-success"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell className="border">
                                <Input
                                    placeholder="Total Points"
                                    value={item.points}
                                    onChange={(e) => handlePointsChange(index, e.target.value)}
                                    className="w-full border-none"
                                    type="number"
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-between items-center">
                <Button variant="outline" onClick={addCriteria}>
                    <Plus className="h-4 w-4 mr-2" /> Add Criterion
                </Button>
                <div>Total Points: {calculateTotalPoints()}</div>
            </div>
            {Object.values(errors).map((error, index) => (
                <p key={index} className="text-red-500 text-sm">{error}</p>
            ))}
        </div>
    );
};

export default RubricDataTable;