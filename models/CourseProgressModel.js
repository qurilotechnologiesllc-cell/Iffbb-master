import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    questionIndex: Number,
    selectedOptionIndex: Number,
    isCorrect: Boolean,
});

const moduleProgressSchema = new mongoose.Schema({
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    testPassed: {
        type: Boolean,
        default: false,
    },
    score: Number,
    answers: [answerSchema],
});

const courseProgressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        modulesProgress: [moduleProgressSchema],
        currentUnlockedModuleIndex: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.model("CourseProgress", courseProgressSchema);
