export const getAllClasses = (state) => state.classes;
export const getClassById = (classId) => (state) => state.classes.find(cls => cls.class_id === classId);